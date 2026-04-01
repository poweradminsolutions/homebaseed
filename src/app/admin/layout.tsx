import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | The Homeschool Source",
  description: "Admin dashboard for managing submissions",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
