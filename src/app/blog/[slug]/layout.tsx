import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Post | The Homeschool Source",
  description: "Read expert guides and resources for homeschool families.",
};

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </div>
    </div>
  );
}
