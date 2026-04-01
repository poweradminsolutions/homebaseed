"use client";

import { Suspense, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type CategoryType = "general" | "curriculum" | "coops" | "laws" | "specialneeds" | "gettingstarted";

const CATEGORIES: Array<{ value: CategoryType; label: string }> = [
  { value: "general", label: "General Discussion" },
  { value: "curriculum", label: "Curriculum Talk" },
  { value: "coops", label: "Co-ops & Groups" },
  { value: "laws", label: "State Laws & Regulations" },
  { value: "specialneeds", label: "Special Needs" },
  { value: "gettingstarted", label: "Getting Started" },
];

export default function NewPostPage() {
  return (
    <Suspense fallback={
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
    }>
      <NewPostContent />
    </Suspense>
  );
}

function NewPostContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<CategoryType>(
    (searchParams.get("category") as CategoryType) || "general"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (authLoading) {
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

  if (!user) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-muted mb-6">You must be signed in to create a post.</p>
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="inline-block bg-primary text-white font-medium py-2.5 px-6 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Sign In
            </Link>
            <p className="text-sm text-muted">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:text-primary-dark">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !body.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          category,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/forum/post/${data.post.id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="bg-primary-light border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link
            href="/forum"
            className="text-primary font-medium hover:text-primary-dark mb-4 inline-block"
          >
            ← Back to Forum
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            Start a Discussion
          </h1>
          <p className="mt-4 text-lg text-muted">
            Share your question or insight with the homeschooling community.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Category Select */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-foreground mb-3">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryType)}
              className="w-full px-4 py-3 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted mt-2">
              Choose the category that best fits your discussion.
            </p>
          </div>

          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-foreground mb-3">
              Discussion Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              maxLength={200}
              className="w-full px-4 py-3 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-muted mt-2">
              {title.length}/200 characters
            </p>
          </div>

          {/* Body Textarea */}
          <div>
            <label htmlFor="body" className="block text-sm font-semibold text-foreground mb-3">
              Your Message
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your question, experience, or insight..."
              rows={10}
              className="w-full px-4 py-3 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <p className="text-xs text-muted mt-2">
              Be respectful and constructive. No spam or self-promotion.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-border">
            <button
              type="submit"
              disabled={submitting || !title.trim() || !body.trim()}
              className="flex-1 bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Posting..." : "Post Discussion"}
            </button>
            <Link
              href="/forum"
              className="px-6 py-3 border border-border rounded-lg text-foreground hover:bg-primary-light transition-colors font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-12 bg-primary-light border border-primary/20 rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Tips for a Great Discussion</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-2">
              <span className="text-primary font-bold flex-shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Be clear.</strong> A good title helps
                others find and engage with your discussion.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold flex-shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Be specific.</strong> Include relevant
                details like age ranges, locations, or preferences.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold flex-shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Be respectful.</strong> Remember that
                homeschooling looks different for every family.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold flex-shrink-0">✓</span>
              <span>
                <strong className="text-foreground">Search first.</strong> Your question might
                already be answered in another discussion.
              </span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
