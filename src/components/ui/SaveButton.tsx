"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase-browser";
import { Bookmark } from "lucide-react";
import Link from "next/link";

interface SaveButtonProps {
  resourceType: string;
  resourceId: string;
  resourceName?: string;
  className?: string;
}

export function SaveButton({
  resourceType,
  resourceId,
  resourceName = "this item",
  className = "",
}: SaveButtonProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const supabase = createClient();

  // Check if item is already saved
  useEffect(() => {
    if (!user) return;

    const checkIfSaved = async () => {
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("resource_type", resourceType)
          .eq("resource_id", resourceId)
          .maybeSingle();

        if (!error && data) {
          setIsSaved(true);
        }
      } catch (err) {
        console.error("Error checking saved status:", err);
      }
    };

    checkIfSaved();
  }, [user, resourceType, resourceId, supabase]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        // Remove from favorites
        const response = await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resource_type: resourceType, resource_id: resourceId }),
        });

        if (response.ok) {
          setIsSaved(false);
        }
      } else {
        // Add to favorites
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resource_type: resourceType,
            resource_id: resourceId,
            collection_name: "Saved",
          }),
        });

        if (response.ok) {
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Link
        href="/auth/login?returnTo=/account/favorites"
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-white text-foreground hover:bg-primary-light hover:text-primary transition-colors ${className}`}
        title="Sign in to save items"
      >
        <Bookmark className="w-5 h-5" />
        <span className="text-sm font-medium">Save</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleToggleSave}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
          isSaved
            ? "bg-primary text-white border-primary hover:bg-primary-dark"
            : "bg-white text-foreground border-border hover:bg-primary-light hover:text-primary"
        } disabled:opacity-50 ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title={isSaved ? "Remove from saved" : "Add to saved"}
      >
        <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
        <span className="text-sm font-medium">{isSaved ? "Saved" : "Save"}</span>
      </button>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-white text-xs rounded whitespace-nowrap pointer-events-none">
          {isSaved ? `Remove from saved` : `Add to saved`}
        </div>
      )}
    </div>
  );
}
