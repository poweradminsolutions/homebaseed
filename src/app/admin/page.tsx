"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase-browser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Eye, ChevronDown } from "lucide-react";

interface Submission {
  id: string;
  type: string;
  submitter_name: string | null;
  submitter_email: string | null;
  data: Record<string, unknown> | null;
  status: "pending" | "approved" | "rejected";
  reviewer_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

type TabType = "pending" | "approved" | "rejected";

export default function AdminPage() {
  const { profile, loading: authLoading } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Check admin role
  useEffect(() => {
    if (!authLoading && profile?.role !== "admin") {
      router.push("/");
    }
  }, [profile, authLoading, router]);

  // Load submissions
  useEffect(() => {
    if (profile?.role === "admin") {
      loadSubmissions();
    }
  }, [profile]);

  const loadSubmissions = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setSubmissions((data || []) as unknown as Submission[]);
    } catch (err) {
      console.error("Error loading submissions:", err);
      setError("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);

    try {
      const response = await fetch(`/api/submissions/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to approve submission");
      }

      // Update local state
      setSubmissions(
        submissions.map((s) =>
          s.id === id ? { ...s, status: "approved" } : s
        )
      );
    } catch (err) {
      console.error("Error approving submission:", err);
      setError("Failed to approve submission");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this submission?")) {
      return;
    }

    setActionLoading(id);

    try {
      const response = await fetch(`/api/submissions/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to reject submission");
      }

      // Update local state
      setSubmissions(
        submissions.map((s) =>
          s.id === id ? { ...s, status: "rejected" } : s
        )
      );
    } catch (err) {
      console.error("Error rejecting submission:", err);
      setError("Failed to reject submission");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredSubmissions = submissions.filter((s) => s.status === activeTab);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  if (profile?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted mt-2">Manage submissions</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-4 border-b border-border">
            {(["pending", "approved", "rejected"] as const).map((tab) => {
              const count = submissions.filter((s) => s.status === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
                </button>
              );
            })}
          </div>

          {/* Submissions List */}
          {loading ? (
            <div className="text-center text-muted py-12">Loading submissions...</div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-lg border border-border shadow-sm p-12 text-center">
              <p className="text-muted">
                No {activeTab} submissions
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-white rounded-lg border border-border shadow-sm"
                >
                  <div
                    onClick={() =>
                      setExpandedId(
                        expandedId === submission.id ? null : submission.id
                      )
                    }
                    className="p-6 cursor-pointer hover:bg-background transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-foreground">
                            {(submission.data as any)?.name || submission.submitter_name || "Untitled"}
                          </h3>
                          <span className="px-3 py-1 bg-primary-light text-primary text-xs font-medium rounded-full">
                            {submission.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted">
                          Submitted by: {submission.submitter_name || "Unknown"} ({submission.submitter_email || "No email"})
                        </p>
                        {(submission.data as any)?.website && (
                          <p className="text-sm text-muted">
                            Website:{" "}
                            <a
                              href={(submission.data as any).website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary-dark"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {(submission.data as any).website}
                            </a>
                          </p>
                        )}
                        {(submission.data as any)?.location && (
                          <p className="text-sm text-muted">
                            Location: {(submission.data as any).location}
                          </p>
                        )}
                        <p className="text-xs text-muted mt-2">
                          Submitted on {formatDate(submission.created_at)}
                        </p>
                      </div>

                      <ChevronDown
                        className={`w-5 h-5 text-muted transition-transform ${
                          expandedId === submission.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === submission.id && (
                    <div className="border-t border-border p-6 bg-background space-y-4">
                      {(submission.data as any)?.description && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">
                            Description
                          </h4>
                          <p className="text-sm text-foreground whitespace-pre-wrap">
                            {(submission.data as any).description}
                          </p>
                        </div>
                      )}

                      {submission.data && Object.keys(submission.data as Record<string, unknown>).length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">
                            Additional Data
                          </h4>
                          <div className="bg-white rounded p-3 border border-border overflow-auto max-h-64">
                            <pre className="text-xs text-muted font-mono">
                              {JSON.stringify(submission.data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {activeTab === "pending" && (
                        <div className="flex gap-3 justify-end pt-4 border-t border-border">
                          <button
                            onClick={() => handleReject(submission.id)}
                            disabled={actionLoading === submission.id}
                            className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </button>
                          <button
                            onClick={() => handleApprove(submission.id)}
                            disabled={actionLoading === submission.id}
                            className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Approve
                          </button>
                        </div>
                      )}

                      {activeTab !== "pending" && (
                        <div className="text-sm text-muted pt-4 border-t border-border">
                          Status: <span className="font-medium text-foreground">{activeTab}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
