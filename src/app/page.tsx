import Link from "next/link";
import { SearchBar } from "@/components/ui/SearchBar";
import { USMap } from "@/components/map/USMap";
import { HomeschoolCounter } from "@/components/ui/HomeschoolCounter";

const features = [
  {
    href: "/states",
    title: "State-by-State Laws",
    description:
      "Every rule, requirement, and step for all 50 states. Plain English, no legal jargon.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    href: "/get-started",
    title: "Getting Started Wizard",
    description:
      "New to homeschooling? Answer a few questions and get a personalized action plan for your state.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/find",
    title: "Local Resource Finder",
    description:
      "Co-ops, tutors, sports leagues, enrichment classes, and support groups near you.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    href: "/curriculum",
    title: "Curriculum Directory",
    description:
      "Compare curricula by subject, approach, cost, and parent reviews. Find what fits your family.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
];

const stats = [
  { label: "States Covered", value: "50" },
  { label: "Resource Categories", value: "12+" },
  { label: "Always Free", value: "100%" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Everything You Need To{" "}
              <span className="text-primary">Homeschool</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed">
              Every state law, curriculum recommendations, co-ops near you.
              One place, zero bias, always free.
            </p>
            <div className="mt-8 max-w-xl mx-auto">
              <SearchBar size="large" />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted">
              <span>Popular:</span>
              <Link
                href="/states/texas"
                className="text-primary hover:text-primary-dark underline underline-offset-2"
              >
                Texas Laws
              </Link>
              <Link
                href="/states/florida"
                className="text-primary hover:text-primary-dark underline underline-offset-2"
              >
                Florida Laws
              </Link>
              <Link
                href="/curriculum"
                className="text-primary hover:text-primary-dark underline underline-offset-2"
              >
                Curriculum Reviews
              </Link>
              <Link
                href="/get-started"
                className="text-primary hover:text-primary-dark underline underline-offset-2"
              >
                Getting Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted">{stat.label}</div>
              </div>
            ))}
            <HomeschoolCounter />
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">
              Explore Homeschool Laws by State
            </h2>
            <p className="mt-3 text-muted max-w-2xl mx-auto">
              Click any state to see its complete homeschool legal guide.
              Colors indicate regulation level.
            </p>
          </div>
          <USMap />
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Everything You Need, One Place
            </h2>
            <p className="mt-3 text-muted max-w-2xl mx-auto">
              Built by homeschool parents, for homeschool parents. Every tool
              here exists because someone needed it and couldn&apos;t find it.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group p-6 bg-white rounded-xl border border-border hover:border-primary hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">
            New to Homeschooling?
          </h2>
          <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto">
            Answer five quick questions and get a personalized starter pack
            with your state&apos;s legal requirements, curriculum suggestions,
            and local resources.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/get-started"
              className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-green-50 transition-colors"
            >
              Take the Getting Started Quiz
            </Link>
            <Link
              href="/submit"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors"
            >
              Add Your Co-op or Resource
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
