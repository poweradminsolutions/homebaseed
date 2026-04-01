"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Star, X } from "lucide-react";
import Link from "next/link";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  helpful_count: number;
  created_at: string;
  profiles?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface ReviewSectionProps {
  resourceType: string;
  resourceId: string;
}

export function ReviewSection({
  resourceType,
  resourceId,
}: ReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    body: "",
  });

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/reviews?resource_type=${resourceType}&resource_id=${resourceId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [resourceType, resourceId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource_type: resourceType,
          resource_id: resourceId,
          rating: formData.rating,
          title: formData.title || null,
          body: formData.body || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit review");
        return;
      }

      // Add new review to list
      setReviews([data.review, ...reviews]);

      // Recalculate average rating
      const allRatings = [data.review.rating, ...reviews.map((r) => r.rating)];
      setAverageRating(
        allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
      );

      // Reset form
      setFormData({ rating: 5, title: "", body: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < count ? "fill-accent text-accent" : "text-border"
        }`}
      />
    ));
  };

  const renderStarRating = (
    rating: number,
    onChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange && onChange(i + 1)}
            className={`transition-colors ${onChange ? "cursor-pointer" : ""}`}
            disabled={!onChange}
          >
            <Star
              className={`w-5 h-5 ${
                i < rating ? "fill-accent text-accent" : "text-border"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-primary-light rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-4xl font-bold text-foreground">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 mt-2">{renderStars(Math.round(averageRating))}</div>
            <div className="text-sm text-muted mt-1">
              Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </div>
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      {!showForm && (
        <div>
          {user ? (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Write a Review
            </button>
          ) : (
            <Link
              href="/auth/login?returnTo=account"
              className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Sign in to Write a Review
            </Link>
          )}
        </div>
      )}

      {/* Review Form */}
      {showForm && user && (
        <form onSubmit={handleSubmitReview} className="bg-white border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Write Your Review</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-muted hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Rating
            </label>
            {renderStarRating(formData.rating, (rating) =>
              setFormData({ ...formData, rating })
            )}
          </div>

          <div>
            <label
              htmlFor="review-title"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Title (optional)
            </label>
            <input
              id="review-title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Sum up your experience..."
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="review-body"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Your Review (optional)
            </label>
            <textarea
              id="review-body"
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              placeholder="What was your experience with this resource?"
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={submitting}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-muted py-8">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-muted py-8">
            No reviews yet. Be the first to review!
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-border rounded-lg p-6 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">{renderStars(review.rating)}</div>
                    <span className="text-sm text-muted">
                      {review.rating}/5
                    </span>
                  </div>
                  {review.title && (
                    <h4 className="font-bold text-foreground mt-2">
                      {review.title}
                    </h4>
                  )}
                </div>
              </div>

              {review.body && (
                <p className="text-foreground text-sm leading-relaxed">
                  {review.body}
                </p>
              )}

              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {review.profiles?.display_name || "Anonymous"}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {review.helpful_count > 0 && (
                <div className="text-xs text-muted">
                  {review.helpful_count} {review.helpful_count === 1 ? "person" : "people"} found this helpful
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
