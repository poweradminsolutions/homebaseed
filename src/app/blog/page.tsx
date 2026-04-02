import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";

const categories = [
  { id: "getting-started", label: "Getting Started", color: "bg-blue-100 text-blue-800" },
  { id: "curriculum", label: "Curriculum", color: "bg-purple-100 text-purple-800" },
  { id: "state-laws", label: "State Laws", color: "bg-green-100 text-green-800" },
  { id: "college-prep", label: "College Prep", color: "bg-orange-100 text-orange-800" },
  { id: "special-needs", label: "Special Needs", color: "bg-pink-100 text-pink-800" },
  { id: "lifestyle", label: "Lifestyle", color: "bg-indigo-100 text-indigo-800" },
  { id: "resources", label: "Resources", color: "bg-teal-100 text-teal-800" },
];

const POSTS_PER_PAGE = 12;

export default function BlogPage({ searchParams }: { searchParams: { page?: string; category?: string } }) {
  const currentPage = parseInt(searchParams.page || "1");
  const selectedCategory = searchParams.category || null;

  // Filter posts by category if selected
  let filteredPosts = selectedCategory
    ? blogPosts.filter((post) => post.category === selectedCategory)
    : blogPosts;

  // Sort by published date (newest first)
  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Get featured post
  const featuredPost = sortedPosts.find((post) => post.featured);
  const nonFeaturedPosts = sortedPosts.filter((post) => !post.featured);

  // Paginate
  const totalPages = Math.ceil(nonFeaturedPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const paginatedPosts = nonFeaturedPosts.slice(startIndex, endIndex);

  // Get popular tags
  const allTags: { [key: string]: number } = {};
  blogPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      allTags[tag] = (allTags[tag] || 0) + 1;
    });
  });
  const popularTags = Object.entries(allTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag]) => tag);

  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "bg-gray-100 text-gray-800";
  };

  const getCategoryLabel = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.label || categoryId;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Homeschool Resources & Insights</h1>
        <p className="text-lg text-muted max-w-2xl">
          Expert guides on curriculum selection, state laws, college prep, and everything else homeschool families need to know.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Featured Post */}
          {featuredPost && !selectedCategory && currentPage === 1 && (
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="mb-12 rounded-lg overflow-hidden border-2 border-primary hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="bg-gradient-to-br from-primary to-primary-dark p-8 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-white text-primary`}>
                      Featured
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(featuredPost.category)}`}>
                      {getCategoryLabel(featuredPost.category)}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-3 group-hover:text-primary-light transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-primary-light mb-4 text-lg">{featuredPost.description}</p>
                  <div className="flex items-center gap-4 text-sm text-primary-light">
                    <span>{featuredPost.author}</span>
                    <span>•</span>
                    <span>{new Date(featuredPost.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                    <span>•</span>
                    <span>{featuredPost.readingTime} min read</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Category Filter Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-foreground hover:bg-gray-300"
                }`}
              >
                All Posts
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog?category=${category.id}&page=1`}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-foreground hover:bg-gray-300"
                  }`}
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid gap-6 mb-8">
            {paginatedPosts.length > 0 ? (
              paginatedPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <div className="border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
                          {getCategoryLabel(post.category)}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted mb-4 line-clamp-2">{post.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted mb-3">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                      <span>•</span>
                      <span>{post.readingTime} min read</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted">No posts found in this category yet.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {paginatedPosts.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/blog?category=${selectedCategory || ""}&page=${currentPage - 1}`}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-gray-100 transition-colors"
                >
                  Previous
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/blog?category=${selectedCategory || ""}&page=${page}`}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    page === currentPage
                      ? "bg-primary text-white"
                      : "border border-border hover:bg-gray-100"
                  }`}
                >
                  {page}
                </Link>
              ))}

              {currentPage < totalPages && (
                <Link
                  href={`/blog?category=${selectedCategory || ""}&page=${currentPage + 1}`}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-gray-100 transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Categories */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Categories</h3>
            <div className="space-y-2">
              <Link
                href="/blog"
                className={`block px-3 py-2 rounded-lg transition-colors ${
                  !selectedCategory
                    ? "bg-primary-light text-primary font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                All Posts ({blogPosts.length})
              </Link>
              {categories.map((category) => {
                const count = blogPosts.filter((p) => p.category === category.id).length;
                return (
                  <Link
                    key={category.id}
                    href={`/blog?category=${category.id}&page=1`}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary-light text-primary font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {category.label} ({count})
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <a
                  key={tag}
                  href={`#${tag}`}
                  className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary-light rounded-lg p-6 border-l-4 border-primary">
            <h3 className="text-lg font-bold text-foreground mb-2">Share Your Expertise</h3>
            <p className="text-muted text-sm mb-4">
              Have a homeschool resource or story? We'd love to hear from our community.
            </p>
            <a
              href="/contact"
              className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
