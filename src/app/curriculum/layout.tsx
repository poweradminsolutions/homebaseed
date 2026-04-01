import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homeschool Curriculum Directory | Compare Programs, Reviews & Prices",
  description:
    "Compare 20+ homeschool curricula by subject, grade level, teaching approach, and price. Real parent reviews and ratings to help you find the right fit.",
  keywords: [
    "homeschool curriculum",
    "curriculum directory",
    "homeschool programs",
    "curriculum reviews",
    "homeschool resources",
    "teaching methods",
    "curriculum comparison",
    "homeschool materials",
  ],
  openGraph: {
    title: "Homeschool Curriculum Directory | Compare Programs, Reviews & Prices",
    description:
      "Compare 20+ homeschool curricula by subject, grade level, teaching approach, and price.",
    type: "website",
  },
};

export default function CurriculumLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
