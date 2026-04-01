"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase-browser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit2, X } from "lucide-react";
import Link from "next/link";

interface Favorite {
  id: string;
  user_id: string;
  resource_type: string;
  resource_id: string;
  collection_name: string;
  notes: string | null;
  created_at: string;
}

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<{
    notes: string;
    collection_name: string;
  }>({ notes: "", collection_name: "" });
  const router = useRouter();
  const supabase = createClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?returnTo=/account/favorites");
    }
  }, [user, authLoading, router]);

  // Load favorites
  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/favorites");

      if (!response.ok) {
        throw new Error("Failed to load favorites");
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error("Error loading favorites:", err);
      setError("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const groupedFavorites = favorites.reduce(
    (acc: Record<string, Favorite[]>, fav) => {
      const collection = fav.collection_name || "Saved";
      if (!acc[collection]) {
        acc[collection] = [];
      }
      acc[collection].push(fav);
      return acc;
    },
    {}
  );

  const handleRemove = async (id: string) => {
    const favorite = favorites.find((f) => f.id === id);
    if (!favorite) return;

    if (!confirm("Remove this item from your favorites?")) {
      return;
    }

    try {
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource_type: favorite.resource_type,
          resource_id: favorite.resource_id,
        }),
      });

      if (response.ok) {
        setFavorites(favorites.filter((f) => f.id !== id));
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
      setError("Failed to remove favorite");
    }
  };

  const handleEditStart = (favorite: Favorite) => {
    setEditingId(favorite.id);
    setEditingData({
      notes: favorite.notes || "",
      collection_name: favorite.collection_name || "Saved",
    });
  };

  const handleEditSave = async (id: string) => {
    try {
      const favorite = favorites.find((f) => f.id === id);
      if (!favorite) return;

      // Update favorite with new data
      const { error } = await supabase
        .from("favorites")
        .update({
          notes: editingData.notes || null,
          collection_name: editingData.collection_name || "Saved",
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Update local state
      setFavorites(
        favorites.map((f) =>
          f.id === id
            ? {
                ...f,
                notes: editingData.notes || null,
                collection_name: editingData.collection_name || "Saved",
              }
            : f
        )
      );

      setEditingId(null);
    } catch (err) {
      console.error("Error updating favorite:", err);
      setError("Failed to update favorite");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getResourceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      curriculum: "Curriculum",
      "co-op": "Co-op",
      resource: "Resource",
    };
    return labels[type] || type;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Saved Favorites</h1>
            <p className="text-muted mt-2">
              {favorites.length === 0
                ? "You haven't saved any favorites yet"
                : `You have ${favorites.length} saved item${favorites.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Favorites List */}
          {loading ? (
            <div className="text-center text-muted py-8">Loading favorites...</div>
          ) : favorites.length === 0 ? (
            <div className="bg-white rounded-lg border border-border shadow-sm p-12 text-center">
              <p className="text-muted mb-6">
                Start saving your favorite curricula, co-ops, and resources to build your personalized collection.
              </p>
              <Link
                href="/find"
                className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                Browse Resources
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedFavorites).map(([collection, items]) => (
                <div key={collection}>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    {collection}
                  </h2>
                  <div className="space-y-3">
                    {items.map((favorite) => (
                      <div
                        key={favorite.id}
                        className="bg-white rounded-lg border border-border shadow-sm p-6 space-y-3"
                      >
                        {editingId === favorite.id ? (
                          // Edit Mode
                          <div className="space-y-4">
                            <div>
                              <label
                                htmlFor={`collection-${favorite.id}`}
                                className="block text-sm font-medium text-foreground mb-1"
                              >
                                Collection Name
                              </label>
                              <input
                                id={`collection-${favorite.id}`}
                                type="text"
                                value={editingData.collection_name}
                                onChange={(e) =>
                                  setEditingData({
                                    ...editingData,
                                    collection_name: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`notes-${favorite.id}`}
                                className="block text-sm font-medium text-foreground mb-1"
                              >
                                Notes
                              </label>
                              <textarea
                                id={`notes-${favorite.id}`}
                                value={editingData.notes}
                                onChange={(e) =>
                                  setEditingData({
                                    ...editingData,
                                    notes: e.target.value,
                                  })
                                }
                                rows={3}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                placeholder="Add your notes..."
                              />
                            </div>

                            <div className="flex gap-3 justify-end">
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleEditSave(favorite.id)}
                                className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <>
                            <div>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-foreground">
                                      {favorite.resource_id}
                                    </h3>
                                    <span className="px-3 py-1 bg-primary-light text-primary text-xs font-medium rounded-full">
                                      {getResourceTypeLabel(favorite.resource_type)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted mt-1">
                                    Saved on {formatDate(favorite.created_at)}
                                  </p>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditStart(favorite)}
                                    className="p-2 text-muted hover:text-foreground hover:bg-background rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleRemove(favorite.id)}
                                    className="p-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {favorite.notes && (
                              <div className="p-4 bg-primary-light rounded-lg">
                                <p className="text-sm font-medium text-foreground mb-2">
                                  Notes
                                </p>
                                <p className="text-sm text-foreground whitespace-pre-wrap">
                                  {favorite.notes}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
