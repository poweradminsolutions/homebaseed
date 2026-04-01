import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homeschool Community Directory | Co-ops, Groups & Support",
  description:
    "Find homeschool co-ops, support groups, enrichment programs, and local communities near you. Connect with other homeschooling families organized by state and county.",
  keywords: [
    "homeschool co-ops",
    "homeschool support groups",
    "homeschool community",
    "homeschool enrichment",
    "local homeschool groups",
    "homeschool meetups",
    "co-op directory",
  ],
  openGraph: {
    title: "Homeschool Community Directory | The Homeschool Source",
    description:
      "Find local homeschool co-ops, support groups, and enrichment programs. Connect with homeschooling families in your area.",
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
