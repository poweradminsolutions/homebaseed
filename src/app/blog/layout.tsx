import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | The Homeschool Source",
  description: "Expert guides, tips, and resources for homeschooling families. Learn about curriculum, state laws, college prep, and more.",
  openGraph: {
    title: "Blog | The Homeschool Source",
    description: "Expert guides, tips, and resources for homeschooling families.",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </div>
    </div>
  );
}
