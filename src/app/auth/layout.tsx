import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in or sign up to The Homeschool Source",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
