"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter, useParams } from "next/navigation";
import { MessageSquare, Heart, Plus, ChevronUp, ChevronDown } from "lucide-react";

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
}

type SortOption = "newest" | "liked" | "replied";

const CATEGORY_INFO: Record<
  string,
  { name: string; description: string }
> = {
  general: {
    name: "General Discussion",
    description: "General homeschooling topics and announcements",
  },
  curriculum: {
    name: "Curriculum Talk",
    description: "Discuss and review curriculum options",
  },
  coops: {
    name: "Co-ops & Groups",
    description: "Share and discuss local co-ops and group learning",
  },
  laws: {
    name: "State Laws & Regulations",
    description: "Questions about homeschool laws by state",
  },
  specialneeds: {
    name: "Special Needs",
    description: "Homeschooling with special needs children",
  },
  gettingstarted: {
    name: "Getting Started",
    description: "For new homeschoolers just beginning their journey",
  },
};

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const { user } = useAuth();
  const router = useRouter();

  const categoryInfo = CATEGORY_INFO[category] || {
    name: "Unknown Category",
    description: "This category does not exist",
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `/api/forum/posts?category=${category}&sort=${sortBy}`
        );
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category, sortBy]);

  const handleNewPost = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    router.push(`/forum/new?category=${category}`);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="bg-primary-light border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link
            href="/forum"
            className="text-primary font-medium hover:text-primary-dark mb-4 inline-block"
          >
            ← Back to Forum
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            {categoryInfo.name}
          </h1>
          <p className="mt-4 text-lg text-muted">{categoryInfo.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="sort" className="block text-sm font-medium text-foreground mb-2">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="liked">Most Liked</option>
                <option value="replied">Most Replied</option>
              </select>
            </div>
            <button
              onClick={handleNewPost}
              className="flex items-center gap-2 bg-primary text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Post
            </button>
          </div>

          {/* Posts List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-border rounded-lg p-6 animate-pulse"
                >
                  <div className="h-4 bg-border rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-border rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/forum/post/${post.id}`}
                  className="block bg-white border border-border rounded-lg p-6 hover:border-primary hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-muted text-sm line-clamp-2 mb-4">
                    {post.body}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{post.display_name}</span>
                      <span>
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {post.reply_count}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.like_count}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-border rounded-lg">
              <p className="text-muted mb-6">
                No discussions in this category yet.
              </p>
              <button
                onClick={handleNewPost}
                className="inline-block bg-primary text-white font-medium py-2.5 px-6 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Start a Discussion
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
