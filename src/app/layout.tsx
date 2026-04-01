import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://thehomeschoolsource.com"),
  title: {
    default: "The Homeschool Source - Your Complete Homeschool Directory",
    template: "%s | The Homeschool Source",
  },
  description:
    "Free, comprehensive directory for the US homeschooling ecosystem. Find state laws, local co-ops, curriculum reviews, and everything you need to homeschool with confidence.",
  keywords: [
    "homeschool",
    "homeschooling",
    "homeschool laws",
    "homeschool curriculum",
    "homeschool co-ops",
    "homeschool directory",
    "homeschool by state",
    "homeschool requirements",
    "how to homeschool",
    "homeschool resources",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "The Homeschool Source - Your Complete Homeschool Directory",
    description:
      "Free, comprehensive directory for the US homeschooling ecosystem. State laws, curriculum reviews, local co-ops, and more.",
    type: "website",
    locale: "en_US",
    url: "https://thehomeschoolsource.com",
    siteName: "The Homeschool Source",
    images: [
      {
        url: "/logo-512.png",
        width: 512,
        height: 512,
        alt: "The Homeschool Source Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "The Homeschool Source - Your Complete Homeschool Directory",
    description:
      "Free, comprehensive directory for the US homeschooling ecosystem.",
    images: ["/logo-512.png"],
  },
  alternates: {
    canonical: "https://thehomeschoolsource.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <WebsiteJsonLd />
        <OrganizationJsonLd />
        <AuthProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
