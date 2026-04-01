import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forum | The Homeschool Source",
  description: "Join the homeschooling community. Discuss curriculum, co-ops, state laws, and share tips with other families.",
  openGraph: {
    title: "Forum | The Homeschool Source",
    description: "Join the homeschooling community. Discuss curriculum, co-ops, state laws, and share tips.",
    type: "website",
  },
};

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
