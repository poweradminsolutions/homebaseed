"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase-browser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AccountData {
  displayName: string | null;
  state: string | null;
  city: string | null;
}

export default function AccountPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [data, setData] = useState<AccountData>({
    displayName: profile?.display_name || "",
    state: profile?.state_id || "",
    city: profile?.city || "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState({ favorites: 0, reviews: 0 });
  const router = useRouter();
  const supabase = createClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login?returnTo=/account");
    }
  }, [user, authLoading, router]);

  // Load user stats
  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [favoritesRes, reviewsRes] = await Promise.all([
        supabase
          .from("favorites")
          .select("id", { count: "exact" })
          .eq("user_id", user.id),
        supabase
          .from("curriculum_reviews")
          .select("id", { count: "exact" })
          .eq("user_id", user.id),
      ]);

      setStats({
        favorites: favoritesRes.count || 0,
        reviews: reviewsRes.count || 0,
      });
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (!user) return;

      const response = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: data.displayName,
          state_id: data.state || null,
          city: data.city || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to save profile");
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setSaving(false);
    }
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
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Account</h1>
            <p className="text-muted mt-2">Manage your profile and preferences</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg border border-border shadow-sm p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Profile Information
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                Profile updated successfully
              </div>
            )}

            <div className="mb-6">
              <p className="text-sm text-muted">Email</p>
              <p className="text-foreground font-medium">{user.email}</p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={data.displayName || ""}
                  onChange={(e) =>
                    setData({ ...data, displayName: e.target.value })
                  }
                  disabled={saving}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={data.state || ""}
                    onChange={(e) =>
                      setData({ ...data, state: e.target.value })
                    }
                    disabled={saving}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    placeholder="CA, TX, NY..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-foreground mb-1"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={data.city || ""}
                    onChange={(e) =>
                      setData({ ...data, city: e.target.value })
                    }
                    disabled={saving}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Stats Card */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-border shadow-sm p-6">
              <p className="text-sm text-muted mb-2">Saved Favorites</p>
              <p className="text-3xl font-bold text-foreground mb-4">
                {stats.favorites}
              </p>
              <Link
                href="/account/favorites"
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                View all
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-border shadow-sm p-6">
              <p className="text-sm text-muted mb-2">Reviews Written</p>
              <p className="text-3xl font-bold text-foreground mb-4">
                {stats.reviews}
              </p>
              <Link
                href="/account/reviews"
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                View all
              </Link>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg border border-red-200 shadow-sm p-8">
            <h2 className="text-lg font-bold text-foreground mb-2">
              Danger Zone
            </h2>
            <p className="text-muted text-sm mb-4">
              Delete your account and all associated data
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
