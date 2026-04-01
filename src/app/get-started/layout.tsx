import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started Wizard",
  description: "Begin your homeschooling journey with our interactive wizard. Answer a few questions to get personalized resources and recommendations for your state.",
};

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
