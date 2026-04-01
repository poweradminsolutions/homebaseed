import { Metadata } from "next";
import Link from "next/link";
import { states, regulationColors, regulationLabels } from "@/data/states";
import { stateLaws } from "@/data/stateLaws";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Homeschool Laws by State | HomebaseED",
  description:
    "Comprehensive guide to homeschooling laws and regulations for all 50 states. Find requirements, notification rules, and educational standards for your state.",
  keywords: [
    "homeschool laws",
    "homeschooling regulations",
    "state requirements",
    "homeschool by state",
  ],
  openGraph: {
    title: "Homeschool Laws by State | HomebaseED",
    description:
      "Comprehensive guide to homeschooling laws and regulations for all 50 states.",
    type: "website",
    url: "https://homebaseed.com/states",
    images: [
      {
        url: "https://homebaseed.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Homeschool laws by state",
      },
    ],
  },
  alternates: {
    canonical: "https://homebaseed.com/states",
  },
};

export default function StatesPage() {
  const breadcrumbItems = [
    { name: "Home", url: "https://homebaseed.com" },
    { name: "State Laws", url: "https://homebaseed.com/states" },
  ];

  return (
    <div className="bg-white">
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Homeschool Laws by State
          </h1>
          <p className="text-lg text-muted mb-8 max-w-3xl">
            Explore homeschooling regulations, requirements, and resources for each
            state. Click on a state card to view detailed information about local laws,
            notification requirements, and educational standards.
          </p>

          {/* Regulation Legend */}
          <div className="bg-primary-light rounded-lg p-6 border border-primary/20">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-4">
              Understanding Regulation Levels
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(regulationLabels).map(([level, label]) => (
                <div key={level} className="flex items-start space-x-3">
                  <div
                    className={`flex-shrink-0 w-4 h-4 rounded-full mt-1 ${
                      regulationColors[level as keyof typeof regulationColors].fill
                    }`}
                  />
                  <div>
                    <p className="font-medium text-foreground text-sm">{label}</p>
                    <p className="text-xs text-muted mt-1">
                      {level === "none" &&
                        "Minimal to no state oversight of homeschools"}
                      {level === "low" &&
                        "Basic notification or registration required"}
                      {level === "moderate" &&
                        "Significant compliance requirements"}
                      {level === "high" &&
                        "Extensive regulations and oversight"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* States Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {states.map((state) => {
            const lawData = Object.values(stateLaws).find((s) => s.slug === state.slug);
            const quickSummary = lawData?.quickSummary || `Learn about homeschooling laws in ${state.name}.`;

            return (
              <Link key={state.slug} href={`/states/${state.slug}`}>
                <div className="h-full bg-white border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {state.name}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${
                        regulationColors[state.regulationLevel as keyof typeof regulationColors].bg
                      } ${
                        regulationColors[state.regulationLevel as keyof typeof regulationColors].text
                      }`}
                    >
                      {regulationLabels[state.regulationLevel as keyof typeof regulationLabels]}
                    </span>
                  </div>
                  <p className="text-sm text-muted line-clamp-3">
                    {quickSummary}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <span className="text-sm font-medium text-primary group-hover:translate-x-1 transition-transform inline-block">
                      View details →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
