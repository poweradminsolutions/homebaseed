import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Resource",
  description:
    "Share your homeschool co-op, curriculum, tutoring service, event, or other resource. Help other families discover what you love. Free and easy to submit.",
  openGraph: {
    title: "Submit a Resource | HomebaseED",
    description:
      "Add your homeschooling resource to our free directory. Co-ops, curricula, tutors, events, and more.",
    type: "website",
    url: "https://homebaseed.com/submit",
  },
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
