import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the HomebaseED team. Have a question, found an error, or want to help? We respond to all inquiries within 24-48 hours.",
  openGraph: {
    title: "Contact Us | HomebaseED",
    description:
      "Reach out to HomebaseED. Questions? Feedback? Want to contribute? We'd love to hear from you.",
    type: "website",
    url: "https://homebaseed.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
