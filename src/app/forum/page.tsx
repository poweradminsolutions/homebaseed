"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { MessageSquare, Heart, Search, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  postCount: number;
}

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

const CATEGORIES: Category[] = [
  {
    id: "general",
    name: "General Discussion",
    description: "General homeschooling topics and announcements",
    slug: "general",
    postCount: 0,
  },
  {
    id: "curriculum",
    name: "Curriculum Talk",
    description: "Discuss and review curriculum options",
    slug: "curriculum",
    postCount: 0,
  },
  {
    id: "coops",
    name: "Co-ops & Groups",
    description: "Share and discuss local co-ops and group learning",
    slug: "coops",
    postCount: 0,
  },
  {
    id: "laws",
    name: "State Laws & Regulations",
    description: "Questions about homeschool laws by state",
    slug: "laws",
    postCount: 0,
  },
  {
    id: "specialneeds",
    name: "Special Needs",
    description: "Homeschooling with special needs children",
    slug: "specialneeds",
    postCount: 0,
  },
  {
    id: "gettingstarted",
    name: "Getting Started",
    description: "For new homeschoolers just beginning their journey",
    slug: "gettingstarted",
    postCount: 0,
  },
];

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/forum/posts?limit=10");
        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts || []);

          // Count posts by category
          const updatedCategories = categories.map((cat) => ({
            ...cat,
            postCount: data.posts.filter((p: Post) => p.category === cat.slug)
              .length,
          }));
          setCategories(updatedCategories);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [authLoading]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewPost = () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    router.push("/forum/new");
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-light border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                Community Forum
              </h1>
              <p className="mt-4 text-lg text-muted max-w-2xl">
                Connect with other homeschooling families. Ask questions, share
                resources, and discuss what works for your family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* New Post Button */}
            <button
              onClick={handleNewPost}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Discussion
            </button>

            {/* Recent Posts */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Recent Discussions
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border border-border rounded-lg p-6 animate-pulse"
                    >
                      <div className="h-4 bg-border rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-border rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredPosts.length > 0 ? (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
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
                          <span>{post.display_name}</span>
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
                <div className="text-center py-12 bg-white border border-border rounded-lg">
                  <p className="text-muted mb-4">No discussions found.</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-primary font-medium hover:text-primary-dark"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-white border border-border rounded-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Categories
              </h3>
              <nav className="space-y-3">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/forum/${category.slug}`}
                    className="block p-3 rounded-lg hover:bg-primary-light transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {category.name}
                        </h4>
                        <p className="text-xs text-muted mt-1">
                          {category.description}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-primary bg-primary-light rounded-full w-6 h-6 flex items-center justify-center">
                        {category.postCount}
                      </span>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Guidelines */}
            <div className="bg-primary-light border border-primary/20 rounded-lg p-6">
              <h3 className="font-bold text-foreground mb-4">Forum Guidelines</h3>
              <ul className="space-y-3 text-sm text-muted">
                <li className="flex gap-2">
                  <span className="text-primary font-bold flex-shrink-0">
                    ✓
                  </span>
                  <span>Be respectful and kind</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold flex-shrink-0">
                    ✓
                  </span>
                  <span>No spam or self-promotion</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold flex-shrink-0">
                    ✓
                  </span>
                  <span>Stay on topic</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold flex-shrink-0">
                    ✓
                  </span>
                  <span>No hate speech or discrimination</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
