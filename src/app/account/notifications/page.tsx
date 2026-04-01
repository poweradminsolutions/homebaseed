"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { Bell, Check } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { states } from "@/data/states";

interface DigestPreferences {
  id: string;
  user_id: string;
  weekly_digest: boolean;
  new_listing_alerts: boolean;
  forum_reply_alerts: boolean;
  state_filter: string | null;
  updated_at: string;
}

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [preferences, setPreferences] = useState<DigestPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      fetchPreferences();
    }
  }, [user, authLoading, router]);

  const fetchPreferences = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("digest_preferences")
        .select("*")
        .eq("user_id", user!.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Error fetching preferences:", error);
      }

      if (data) {
        setPreferences(data);
      } else {
        // Create default preferences
        const defaultPreferences: DigestPreferences = {
          id: "",
          user_id: user!.id,
          weekly_digest: false,
          new_listing_alerts: false,
          forum_reply_alerts: false,
          state_filter: null,
          updated_at: new Date().toISOString(),
        };
        setPreferences(defaultPreferences);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (field: keyof Omit<DigestPreferences, "id" | "user_id" | "updated_at" | "state_filter">) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      [field]: !preferences[field],
    });
  };

  const handleStateChange = (value: string) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      state_filter: value || null,
    });
  };

  const handleSave = async () => {
    if (!preferences || !user) return;

    setSaving(true);
    setSaved(false);

    try {
      const supabase = createClient();

      if (preferences.id) {
        // Update existing
        const { error } = await supabase
          .from("digest_preferences")
          .update({
            weekly_digest: preferences.weekly_digest,
            new_listing_alerts: preferences.new_listing_alerts,
            forum_reply_alerts: preferences.forum_reply_alerts,
            state_filter: preferences.state_filter,
            updated_at: new Date().toISOString(),
          })
          .eq("id", preferences.id);

        if (error) {
          console.error("Error updating preferences:", error);
        } else {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }
      } else {
        // Insert new
        const { data, error } = await supabase
          .from("digest_preferences")
          .insert({
            user_id: user.id,
            weekly_digest: preferences.weekly_digest,
            new_listing_alerts: preferences.new_listing_alerts,
            forum_reply_alerts: preferences.forum_reply_alerts,
            state_filter: preferences.state_filter,
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating preferences:", error);
        } else if (data) {
          setPreferences(data);
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-border rounded w-1/3"></div>
            <div className="space-y-4">
              <div className="h-4 bg-border rounded"></div>
              <div className="h-4 bg-border rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-muted">Error loading preferences. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Notification Settings
            </h1>
          </div>
          <p className="text-muted mt-2">
            Choose how and when you want to receive updates from The Homeschool Source.
          </p>
        </div>

        <div className="space-y-6">
          {/* Weekly Digest */}
          <div className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Weekly Digest
                </h3>
                <p className="text-muted text-sm">
                  Get a curated digest of new resources, popular forum discussions, and community updates every week.
                </p>
              </div>
              <button
                onClick={() => handleToggle("weekly_digest")}
                className={`flex-shrink-0 w-12 h-7 rounded-full transition-colors flex items-center px-1 ${
                  preferences.weekly_digest
                    ? "bg-primary"
                    : "bg-border"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    preferences.weekly_digest ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* New Listing Alerts */}
          <div className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  New Listing Alerts
                </h3>
                <p className="text-muted text-sm">
                  Get notified when new resources matching your interests are added.
                </p>
              </div>
              <button
                onClick={() => handleToggle("new_listing_alerts")}
                className={`flex-shrink-0 w-12 h-7 rounded-full transition-colors flex items-center px-1 ${
                  preferences.new_listing_alerts
                    ? "bg-primary"
                    : "bg-border"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    preferences.new_listing_alerts ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Forum Reply Alerts */}
          <div className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Forum Reply Notifications
                </h3>
                <p className="text-muted text-sm">
                  Get notified when someone replies to your forum discussions.
                </p>
              </div>
              <button
                onClick={() => handleToggle("forum_reply_alerts")}
                className={`flex-shrink-0 w-12 h-7 rounded-full transition-colors flex items-center px-1 ${
                  preferences.forum_reply_alerts
                    ? "bg-primary"
                    : "bg-border"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    preferences.forum_reply_alerts ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* State Filter */}
          {(preferences.weekly_digest ||
            preferences.new_listing_alerts) && (
            <div className="bg-white border border-border rounded-lg p-6">
              <label htmlFor="state-filter" className="block text-sm font-semibold text-foreground mb-3">
                Focus State (Optional)
              </label>
              <p className="text-muted text-sm mb-4">
                Receive alerts primarily for resources in your state. Leave blank to see resources from all states.
              </p>
              <select
                id="state-filter"
                value={preferences.state_filter || ""}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All States</option>
                {states.map((state) => (
                  <option key={state.slug} value={state.slug}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save Preferences"}
            {saved && <Check className="w-5 h-5" />}
          </button>
          {saved && (
            <p className="text-green-600 text-sm font-medium">
              Your preferences have been saved.
            </p>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-primary-light border border-primary/20 rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-3">
            About Your Data
          </h3>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex gap-2">
              <span className="text-primary flex-shrink-0">✓</span>
              <span>We'll never spam you or share your email with third parties.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary flex-shrink-0">✓</span>
              <span>You can change these settings anytime.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary flex-shrink-0">✓</span>
              <span>Every email includes an unsubscribe link.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
