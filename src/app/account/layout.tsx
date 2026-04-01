import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your account and profile",
};

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
