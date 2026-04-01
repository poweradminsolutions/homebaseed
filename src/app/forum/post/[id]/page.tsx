"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter, useParams } from "next/navigation";
import { Heart, MessageSquare, Trash2 } from "lucide-react";

interface Post {
  id: string;
  title: string;
  body: string;
  category: string;
  author_id: string;
  created_at: string;
  display_name: string;
  reply_count: number;
  like_count: number;
  user_has_liked?: boolean;
}

interface Reply {
  id: string;
  body: string;
  author_id: string;
  created_at: string;
  display_name: string;
  like_count: number;
  user_has_liked?: boolean;
}

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/forum/posts/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data.post);
          setReplies(data.replies || []);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  const handleLikePost = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch(`/api/forum/posts/${postId}/like`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        if (post) {
          setPost({
            ...post,
            like_count: data.like_count,
            user_has_liked: data.user_has_liked,
          });
        }
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (!replyBody.trim()) {
      return;
    }

    setSubmittingReply(true);

    try {
      const response = await fetch(`/api/forum/posts/${postId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyBody }),
      });

      if (response.ok) {
        const data = await response.json();
        setReplies([...replies, data.reply]);
        setReplyBody("");

        // Update post reply count
        if (post) {
          setPost({
            ...post,
            reply_count: post.reply_count + 1,
          });
        }
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/forum/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/forum");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-border rounded w-3/4"></div>
            <div className="h-4 bg-border rounded w-1/2"></div>
            <div className="space-y-4">
              <div className="h-4 bg-border rounded"></div>
              <div className="h-4 bg-border rounded"></div>
              <div className="h-4 bg-border rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-muted mb-4">Post not found.</p>
          <Link href="/forum" className="text-primary font-medium hover:text-primary-dark">
            ← Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/forum"
            className="text-primary font-medium hover:text-primary-dark mb-4 inline-block"
          >
            ← Back to Forum
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-muted">
            <div className="flex items-center gap-4">
              <span className="font-medium">{post.display_name}</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            {user?.id === post.author_id && (
              <button
                onClick={handleDeletePost}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Post */}
          <div className="bg-white border border-border rounded-lg p-8">
            <div className="prose prose-sm max-w-none text-foreground mb-6">
              {post.body.split("\n").map((paragraph, idx) => (
                <p key={idx} className="mb-4 whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Post Actions */}
            <div className="flex items-center gap-4 pt-6 border-t border-border">
              <button
                onClick={handleLikePost}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  post.user_has_liked
                    ? "bg-red-100 text-red-600"
                    : "text-muted hover:bg-primary-light"
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  fill={post.user_has_liked ? "currentColor" : "none"}
                />
                {post.like_count}
              </button>
              <div className="flex items-center gap-2 px-4 py-2 text-muted">
                <MessageSquare className="w-5 h-5" />
                {post.reply_count}
              </div>
            </div>
          </div>

          {/* Replies Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Replies ({replies.length})
            </h2>

            {/* Reply Form */}
            {user ? (
              <form onSubmit={handleSubmitReply} className="mb-8">
                <div className="bg-white border border-border rounded-lg p-6 space-y-4">
                  <textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setReplyBody("")}
                      className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-primary-light transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!replyBody.trim() || submittingReply}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingReply ? "Posting..." : "Post Reply"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-primary-light border border-primary/20 rounded-lg p-6 mb-8">
                <p className="text-foreground mb-4">
                  Sign in to reply to this discussion.
                </p>
                <Link
                  href="/auth/login"
                  className="inline-block bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Replies List */}
            {replies.length > 0 ? (
              <div className="space-y-4">
                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-white border border-border rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium text-foreground">
                          {reply.display_name}
                        </span>
                        <span className="text-muted">
                          {new Date(reply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-foreground mb-4 whitespace-pre-wrap">
                      {reply.body}
                    </p>
                    <div className="flex items-center gap-2 text-muted">
                      <button className="flex items-center gap-1 px-3 py-1 hover:bg-primary-light rounded transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">{reply.like_count}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-border rounded-lg">
                <p className="text-muted">No replies yet. Be the first to reply!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
