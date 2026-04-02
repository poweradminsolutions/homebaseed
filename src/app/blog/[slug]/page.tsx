import Link from "next/link";
import { Metadata } from "next";
import { blogPosts } from "@/data/blog-posts";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The blog post you're looking for doesn't exist.",
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      authors: [post.author],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

const categories = [
  { id: "getting-started", label: "Getting Started" },
  { id: "curriculum", label: "Curriculum" },
  { id: "state-laws", label: "State Laws" },
  { id: "college-prep", label: "College Prep" },
  { id: "special-needs", label: "Special Needs" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "resources", label: "Resources" },
];

function generateTableOfContents(content: string): Array<{ level: number; text: string; id: string }> {
  const headingRegex = /<h([2-3])>(.*?)<\/h\1>/g;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2];
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ level, text, id });
  }

  return headings;
}

function replaceHeadingsWithIds(content: string): string {
  return content.replace(/<h([2-3])>(.*?)<\/h\1>/g, (match, level, text) => {
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
        <p className="text-muted mb-6">
          Sorry, we couldn't find the blog post you're looking for.
        </p>
        <Link href="/blog" className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
          Back to Blog
        </Link>
      </div>
    );
  }

  const categoryLabel = categories.find((c) => c.id === post.category)?.label || post.category;
  const relatedPosts = blogPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  const toc = generateTableOfContents(post.content);
  const contentWithIds = replaceHeadingsWithIds(post.content);

  return (
    <article className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-muted text-sm mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
        <span>/</span>
        <span>{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
            {categoryLabel}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>
        <p className="text-lg text-muted mb-6">{post.description}</p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted border-t border-b border-border py-4">
          <div>
            <span className="font-semibold text-foreground">By</span> {post.author}
          </div>
          <span>•</span>
          <div>{new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
          {post.updatedAt && (
            <>
              <span>•</span>
              <div>Updated {new Date(post.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
            </>
          )}
          <span>•</span>
          <div>{post.readingTime} min read</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: contentWithIds }} />
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-12 pb-8 border-b border-border">
              <h4 className="font-semibold text-foreground mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-6">Related Articles</h3>
              <div className="grid gap-4">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                    <div className="border border-border rounded-lg p-4 hover:shadow-lg hover:border-primary transition-all cursor-pointer group">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-muted text-sm">{relatedPost.description}</p>
                      <div className="text-xs text-muted mt-2">
                        {new Date(relatedPost.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • {relatedPost.readingTime} min
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Back to Blog
          </Link>
        </div>

        {/* Sidebar */}
        <div>
          {/* Table of Contents */}
          {toc.length > 0 && (
            <div className="sticky top-24 bg-gray-50 border border-border rounded-lg p-6 mb-8">
              <h4 className="font-bold text-foreground mb-4">In This Article</h4>
              <nav className="space-y-2 text-sm">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block hover:text-primary transition-colors truncate ${
                      item.level === 3 ? "pl-4 text-muted" : "text-foreground"
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Share */}
          <div className="bg-primary-light border border-primary rounded-lg p-6">
            <h4 className="font-bold text-foreground mb-4">Share This Article</h4>
            <div className="space-y-2 text-sm">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://thehomeschoolsource.com/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 bg-white border border-border rounded hover:bg-gray-100 transition-colors text-center"
              >
                Share on Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://thehomeschoolsource.com/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 bg-white border border-border rounded hover:bg-gray-100 transition-colors text-center"
              >
                Share on Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
