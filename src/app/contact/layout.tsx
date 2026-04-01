import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with The Homeschool Source team. Have a question, found an error, or want to help? We respond to all inquiries within 24-48 hours.",
  openGraph: {
    title: "Contact Us | The Homeschool Source",
    description:
      "Reach out to The Homeschool Source. Questions? Feedback? Want to contribute? We'd love to hear from you.",
    type: "website",
    url: "https://thehomeschoolsource.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
