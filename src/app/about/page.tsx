import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About HomebaseED",
  description:
    "Learn about HomebaseED: the free, neutral, community-built homeschooling directory. No ads, no affiliate links, no bias. Built by homeschool parents, for homeschool parents.",
  openGraph: {
    title: "About HomebaseED",
    description:
      "Free, neutral, community-built homeschooling directory. Learn our mission.",
    type: "website",
    url: "https://homebaseed.com/about",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              About HomebaseED
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              We built this because homeschooling parents deserve better than
              scattered Facebook groups, outdated blogs, and gatekeeping. This
              is the resource we wished existed.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-muted leading-relaxed">
                To create the world&apos;s most comprehensive, neutral,
                community-driven directory for homeschooling in America. We
                gather reliable information about state laws, local resources,
                curriculum options, and everything else homeschool parents need
                to make confident decisions—all in one place, all for free.
              </p>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why This Exists
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Before HomebaseED, here&apos;s what homeschool parents faced:
                </p>
                <ul className="space-y-3 ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold flex-shrink-0">
                      •
                    </span>
                    <span>
                      <strong className="text-foreground">Scattered info:</strong>{" "}
                      State laws buried in PDFs, local co-ops only in Facebook
                      groups, curriculum reviews scattered across a dozen
                      websites
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold flex-shrink-0">
                      •
                    </span>
                    <span>
                      <strong className="text-foreground">Outdated content:</strong>{" "}
                      Laws change. Co-ops fold or move. That blog post from
                      2015 is still ranking at the top of Google.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold flex-shrink-0">
                      •
                    </span>
                    <span>
                      <strong className="text-foreground">Paywalls:</strong> Want
                      curriculum reviews? Better have a membership. Legal advice?
                      That&apos;ll be $300/hour.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold flex-shrink-0">
                      •
                    </span>
                    <span>
                      <strong className="text-foreground">Hidden agendas:</strong> Is this
                      site recommending that curriculum because it&apos;s good,
                      or because they get paid commission? Who knows?
                    </span>
                  </li>
                </ul>
                <p className="mt-6">
                  Parents waste <em>hours</em> researching. We wanted to fix
                  that.
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                What We&apos;re Not
              </h2>
              <div className="space-y-3 text-muted leading-relaxed">
                <p className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">✗</span>
                  <span>
                    <strong className="text-foreground">Not a curriculum seller.</strong> We don&apos;t
                    sell curricula, take affiliate commissions, or get paid for
                    recommendations.
                  </span>
                </p>
                <p className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">✗</span>
                  <span>
                    <strong className="text-foreground">Not politically affiliated.</strong> We&apos;re
                    not pushing any political agenda. Left, right, or center—all
                    families belong here.
                  </span>
                </p>
                <p className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">✗</span>
                  <span>
                    <strong className="text-foreground">Not religiously affiliated.</strong> Christian,
                    secular, unschooling, classical, eclectic—we welcome all
                    approaches.
                  </span>
                </p>
                <p className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">✗</span>
                  <span>
                    <strong className="text-foreground">Not a government agency.</strong> We&apos;re
                    independent. We simply compile public legal information in
                    one place.
                  </span>
                </p>
                <p className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">✗</span>
                  <span>
                    <strong className="text-foreground">Not a blog.</strong> We don&apos;t publish
                    opinions. We&apos;re a clearinghouse of facts, vetted by
                    community experts.
                  </span>
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  HomebaseED is built on community trust and volunteer
                  verification:
                </p>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="bg-primary-light rounded-lg p-6">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-4">
                      1
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Community Submits
                    </h3>
                    <p className="text-sm">
                      Anyone can submit resources: a co-op, curriculum review,
                      state law update, or tutoring service.
                    </p>
                  </div>
                  <div className="bg-primary-light rounded-lg p-6">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-4">
                      2
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Editors Verify
                    </h3>
                    <p className="text-sm">
                      Volunteer editors (experienced homeschool parents) check
                      accuracy and relevance before publishing.
                    </p>
                  </div>
                  <div className="bg-primary-light rounded-lg p-6">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-4">
                      3
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Always Free
                    </h3>
                    <p className="text-sm">
                      Everyone can access, search, and use everything. No
                      paywalls, no ads, ever.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                By the Numbers
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="p-6 bg-primary-light rounded-lg">
                  <div className="text-4xl font-bold text-primary">50</div>
                  <p className="mt-2 text-sm text-muted">States Covered</p>
                </div>
                <div className="p-6 bg-primary-light rounded-lg">
                  <div className="text-4xl font-bold text-primary">12+</div>
                  <p className="mt-2 text-sm text-muted">Resource Categories</p>
                </div>
                <div className="p-6 bg-primary-light rounded-lg">
                  <div className="text-4xl font-bold text-primary">0</div>
                  <p className="mt-2 text-sm text-muted">Ads</p>
                </div>
                <div className="p-6 bg-primary-light rounded-lg">
                  <div className="text-4xl font-bold text-primary">100%</div>
                  <p className="mt-2 text-sm text-muted">Free</p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Who We Are
              </h2>
              <p className="text-muted leading-relaxed mb-6">
                HomebaseED was founded by homeschooling parents who got tired of
                having the same conversation over and over: "Where do I find
                X?" "Is that curriculum any good?" "What does my state actually
                require?"
              </p>
              <p className="text-muted leading-relaxed mb-6">
                We&apos;re powered by volunteers—homeschool parents, educators,
                and community members who believe this information should be
                free and trustworthy. Everyone here does this because they
                believe in the mission.
              </p>
              <div className="bg-primary-light rounded-lg p-8 border border-primary/20">
                <p className="text-foreground font-semibold mb-4">
                  Want to help? We&apos;re always looking for:
                </p>
                <ul className="space-y-2 text-muted">
                  <li>• Volunteer editors to verify submissions</li>
                  <li>• Subject matter experts for curriculum reviews</li>
                  <li>• State coordinators to keep local info current</li>
                  <li>• Developers and designers</li>
                  <li>• Writers and researchers</li>
                </ul>
                <p className="mt-6 text-foreground font-semibold">
                  <Link href="/contact" className="text-primary hover:text-primary-dark underline">
                    Get in touch with us.
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Help Us Grow This Resource
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Know a great co-op, curriculum, or resource we&apos;re missing?
            Have you found a mistake in our state law info?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/submit"
              className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-green-50 transition-colors"
            >
              Submit a Resource
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
