import { Metadata } from "next";
import Link from "next/link";
import { getStateBySlug, regulationColors, regulationLabels } from "@/data/states";
import { stateLaws } from "@/data/stateLaws";
import { StateGuideJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lawData = Object.values(stateLaws).find((s) => s.slug === slug);

  if (!lawData) {
    return {
      title: "State Not Found | HomebaseED",
      description: "The state you're looking for doesn't exist.",
    };
  }

  const stateState = getStateBySlug(slug);
  const title = `${lawData.name} Homeschool Laws & Requirements | HomebaseED`;
  const description = lawData.quickSummary;

  return {
    title,
    description,
    keywords: [
      `${lawData.name} homeschool laws`,
      `${lawData.name} homeschooling requirements`,
      `homeschool curriculum ${lawData.abbreviation}`,
      "homeschooling regulations",
    ],
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://homebaseed.com/states/${slug}`,
      images: [
        {
          url: "https://homebaseed.com/og-image.png",
          width: 1200,
          height: 630,
          alt: `${lawData.name} homeschool laws`,
        },
      ],
    },
    alternates: {
      canonical: `https://homebaseed.com/states/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.values(stateLaws).map((state) => ({
    slug: state.slug,
  }));
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stateInfo = getStateBySlug(slug);
  const lawData = Object.values(stateLaws).find((s) => s.slug === slug);

  if (!stateInfo || !lawData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">State Not Found</h1>
        <p className="text-lg text-muted mb-6">
          The state you're looking for doesn't exist.
        </p>
        <Link href="/states" className="text-primary hover:text-primary/80">
          Back to all states
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: "Home", url: "https://homebaseed.com" },
    { name: "State Laws", url: "https://homebaseed.com/states" },
    { name: lawData.name, url: `https://homebaseed.com/states/${slug}` },
  ];

  return (
    <div className="bg-white">
      <StateGuideJsonLd
        stateName={lawData.name}
        slug={slug}
        description={lawData.quickSummary}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted py-4 border-b border-border">
          {breadcrumbItems.map((item, index) => (
            <div key={item.url} className="flex items-center space-x-2">
              {index > 0 && <span className="text-border">/</span>}
              {index === breadcrumbItems.length - 1 ? (
                <span className="text-foreground font-medium">{item.name}</span>
              ) : (
                <Link href={item.url} className="text-primary hover:text-primary/80">
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="py-12">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                  {lawData.name}
                </h1>
                <p className="text-lg text-muted">{lawData.legalStatus}</p>
              </div>
              <div className="flex-shrink-0">
                <span
                  className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
                    regulationColors[stateInfo.regulationLevel].bg
                  } ${regulationColors[stateInfo.regulationLevel].text}`}
                >
                  {regulationLabels[stateInfo.regulationLevel as keyof typeof regulationLabels]}
                </span>
              </div>
            </div>
            <p className="text-lg text-muted max-w-3xl">
              {lawData.quickSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* At a Glance Section */}
              <section id="at-a-glance" className="bg-primary-light rounded-lg p-6 border border-primary/20">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  At a Glance
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Compulsory Ages */}
                  <div className="bg-white rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                      Compulsory Ages
                    </h3>
                    <p className="text-lg font-bold text-foreground">
                      {lawData.compulsoryAges}
                    </p>
                  </div>

                  {/* Notice Required */}
                  <div className="bg-white rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                      Notice Required
                    </h3>
                    <p className="text-lg font-bold text-foreground mb-2">
                      {lawData.noticeRequired ? "Yes" : "No"}
                    </p>
                    <p className="text-sm text-muted">{lawData.noticeDetails}</p>
                  </div>

                  {/* Assessment Required */}
                  <div className="bg-white rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                      Assessment Required
                    </h3>
                    <p className="text-lg font-bold text-foreground mb-2">
                      {lawData.assessmentRequired ? "Yes" : "No"}
                    </p>
                    <p className="text-sm text-muted">{lawData.assessmentDetails}</p>
                  </div>

                  {/* Teacher Qualifications */}
                  <div className="bg-white rounded-lg p-4 border border-border">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                      Teacher Qualifications
                    </h3>
                    <p className="text-sm text-foreground">
                      {lawData.teacherQualifications}
                    </p>
                  </div>
                </div>
              </section>

              {/* Legal Requirements */}
              <section id="legal-requirements">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Legal Requirements
                </h2>
                <div className="bg-white border border-border rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Getting Started
                    </h3>
                    <p className="text-muted">
                      {lawData.noticeDetails}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Legal Status
                    </h3>
                    <p className="text-muted">
                      {lawData.legalStatus}
                    </p>
                  </div>
                </div>
              </section>

              {/* Required Subjects */}
              {lawData.subjectsRequired.length > 0 && (
                <section id="required-subjects">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Required Subjects
                  </h2>
                  <div className="bg-white border border-border rounded-lg p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {lawData.subjectsRequired.map((subject) => (
                        <div key={subject} className="flex items-start">
                          <span className="text-primary mr-2">✓</span>
                          <span className="text-foreground">{subject}</span>
                        </div>
                      ))}
                    </div>
                    {lawData.subjectsRequired.length === 0 && (
                      <p className="text-muted italic">
                        No specific subjects required.
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* Assessment & Testing */}
              <section id="assessment">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Assessment & Testing
                </h2>
                <div className="bg-white border border-border rounded-lg p-6">
                  <p className="text-foreground">
                    {lawData.assessmentDetails}
                  </p>
                </div>
              </section>

              {/* Record Keeping */}
              <section id="record-keeping">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Record Keeping
                </h2>
                <div className="bg-white border border-border rounded-lg p-6">
                  <p className="text-foreground">
                    {lawData.recordKeeping}
                  </p>
                </div>
              </section>

              {/* Additional Information */}
              <section id="additional">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Additional Information
                </h2>
                <div className="bg-white border border-border rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Diploma Issuing
                    </h3>
                    <p className="text-muted">{lawData.diplomaIssuing}</p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-semibold text-foreground mb-2">
                      Umbrella Schools
                    </h3>
                    <p className="text-muted">
                      {lawData.umbrellasAllowed
                        ? "Umbrella schools are allowed in this state."
                        : "Umbrella schools are not permitted in this state."}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-semibold text-foreground mb-2">
                      Special Education Access
                    </h3>
                    <p className="text-muted">
                      {lawData.specialEdAccess
                        ? "Homeschooled students have access to special education services."
                        : "Special education access may be limited."}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-semibold text-foreground mb-2">
                      Sports & Extracurricular Access
                    </h3>
                    <p className="text-muted">
                      {lawData.sportsAccess
                        ? "Homeschooled students can participate in school sports."
                        : "Sports participation through traditional public schools may be limited."}
                    </p>
                  </div>
                </div>
              </section>

              {/* Key Statutes */}
              <section id="statutes">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Key Statutes
                </h2>
                <div className="bg-white border border-border rounded-lg p-6">
                  <ul className="space-y-2">
                    {lawData.keyStatutes.map((statute) => (
                      <li key={statute} className="text-foreground font-mono text-sm">
                        {statute}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* On This Page */}
              <div className="bg-white border border-border rounded-lg p-6 sticky top-6">
                <h3 className="font-semibold text-foreground mb-4">On This Page</h3>
                <nav className="space-y-2 text-sm">
                  <a
                    href="#at-a-glance"
                    className="text-primary hover:text-primary/80 block"
                  >
                    At a Glance
                  </a>
                  <a
                    href="#legal-requirements"
                    className="text-primary hover:text-primary/80 block"
                  >
                    Legal Requirements
                  </a>
                  {lawData.subjectsRequired.length > 0 && (
                    <a
                      href="#required-subjects"
                      className="text-primary hover:text-primary/80 block"
                    >
                      Required Subjects
                    </a>
                  )}
                  <a
                    href="#assessment"
                    className="text-primary hover:text-primary/80 block"
                  >
                    Assessment & Testing
                  </a>
                  <a
                    href="#record-keeping"
                    className="text-primary hover:text-primary/80 block"
                  >
                    Record Keeping
                  </a>
                  <a
                    href="#additional"
                    className="text-primary hover:text-primary/80 block"
                  >
                    Additional Information
                  </a>
                  <a
                    href="#statutes"
                    className="text-primary hover:text-primary/80 block"
                  >
                    Key Statutes
                  </a>
                </nav>
              </div>

              {/* External Resources */}
              <div className="bg-primary-light border border-primary/20 rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  External Resources
                </h3>
                <p className="text-sm text-muted mb-4">
                  Learn more about homeschooling in {lawData.name}:
                </p>
                <a
                  href={lawData.hslda_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm"
                >
                  HSLDA Legal Analysis
                  <span className="ml-2">→</span>
                </a>
              </div>

              {/* Last Verified */}
              <div className="bg-white border border-border rounded-lg p-6">
                <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-2">
                  Last Verified
                </p>
                <p className="text-foreground font-mono text-sm">
                  {lawData.lastVerified}
                </p>
                <p className="text-xs text-muted mt-3">
                  Laws change frequently. Please verify current requirements with
                  official state sources.
                </p>
              </div>

              {/* Find Resources CTA */}
              <Link
                href={`/find?state=${slug}`}
                className="block w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg text-center hover:bg-primary/90 transition-colors"
              >
                Find Resources in {lawData.name}
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
