import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | The Homeschool Source",
  description:
    "Terms of Service for The Homeschool Source. Read our policies and user agreements.",
  openGraph: {
    title: "Terms of Service | The Homeschool Source",
    description: "Terms of Service for The Homeschool Source",
    type: "website",
    url: "https://thehomeschoolsource.com/terms",
  },
};

export default function TermsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              Terms of Service
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              The rules of the road for using The Homeschool Source. Please read
              carefully.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="space-y-12">
            <div>
              <p className="text-sm text-muted mb-8">
                <em>Last updated: April 2026</em>
              </p>
              <p className="text-muted leading-relaxed mb-6">
                By accessing and using The Homeschool Source website
                (thehomeschoolsource.com), you accept and agree to be bound by
                the terms and provision of this agreement. If you do not agree
                to abide by the above, please do not use this service.
              </p>
              <p className="text-muted leading-relaxed">
                <strong>Important:</strong> These terms are provided for
                informational purposes and are not legal advice. We recommend
                consulting with a qualified attorney to understand your legal
                obligations and rights. Homeschooling laws vary significantly by
                state, and you are responsible for verifying the legal
                requirements that apply in your jurisdiction.
              </p>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Acceptance of Terms
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  By creating an account, accessing our website, or using any of
                  our services, you acknowledge that you have read, understood,
                  and agree to be bound by all of the terms and conditions
                  contained in this agreement. We may update these terms at any
                  time, and your continued use of the service after any such
                  modifications constitutes your acceptance of the updated terms.
                  We encourage you to review this page periodically to stay
                  informed of any changes.
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                User Accounts
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  If you choose to create an account on The Homeschool Source,
                  you agree to the following terms regarding your account.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Age Requirement
                  </h3>
                  <p>
                    You must be at least 18 years of age to create and maintain
                    an account on The Homeschool Source. By creating an account,
                    you represent and warrant that you are 18 years of age or
                    older. If you are under 18, please ask a parent or guardian
                    to create an account on your behalf.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Account Security and Responsibility
                  </h3>
                  <p>
                    You are responsible for maintaining the confidentiality of
                    your account credentials and for all activities that occur
                    under your account. You agree to notify us immediately if
                    you discover unauthorized access to your account. You may
                    not share your account with others, sell your account, or
                    permit anyone else to use your login credentials. We are not
                    responsible for any loss or damage that results from your
                    failure to keep your account credentials secure.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Account Termination
                  </h3>
                  <p>
                    We reserve the right to suspend or terminate your account at
                    any time if we believe you have violated these terms or
                    engaged in prohibited conduct. You may delete your account at
                    any time through your account settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                User Content
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  The Homeschool Source allows users to submit content such as
                  forum posts, resource reviews, and comments. By submitting
                  content, you grant us certain rights while retaining ownership
                  of your work.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Ownership of Your Content
                  </h3>
                  <p>
                    You retain all ownership rights to any content you submit to
                    The Homeschool Source, including forum posts, reviews, and
                    comments. You represent and warrant that you own or have the
                    right to use any content you submit and that the content does
                    not infringe on any third-party intellectual property rights.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    License to Us
                  </h3>
                  <p>
                    By submitting content to The Homeschool Source, you grant us
                    a worldwide, non-exclusive, royalty-free license to use,
                    reproduce, modify, distribute, and display your content in
                    connection with our service. This license allows us to
                    display your forum posts, publish your reviews, and use your
                    submissions as part of our website and community. You may
                    remove your content at any time by deleting it from your
                    account.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Content Responsibility
                  </h3>
                  <p>
                    You are solely responsible for the content you submit. You
                    agree that your content will not contain defamatory,
                    libelous, hateful, abusive, or otherwise harmful material.
                    You may not submit content that infringes on intellectual
                    property rights, violates privacy or publicity rights, or is
                    otherwise illegal.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Prohibited Conduct
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  We maintain high standards for community conduct. The following
                  behaviors are strictly prohibited on The Homeschool Source:
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Spam and Abuse
                  </h3>
                  <p>
                    You may not use The Homeschool Source to send spam, including
                    repeated unsolicited messages, advertising, or promotional
                    content. You may not harass, threaten, stalk, or abuse any
                    other user or member of our community.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Illegal Activity
                  </h3>
                  <p>
                    You may not use The Homeschool Source for any illegal purpose
                    or in violation of any applicable law or regulation. This
                    includes but is not limited to distribution of illegal
                    material, fraud, identity theft, or any other criminal
                    activity.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Scraping and Automated Access
                  </h3>
                  <p>
                    You may not scrape, crawl, or use automated tools to extract
                    data from The Homeschool Source without our explicit written
                    permission. You may not use bots, scripts, or other automated
                    systems to access our website in a manner that could disrupt
                    service or impose an unreasonable burden on our servers.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Intellectual Property Violation
                  </h3>
                  <p>
                    You may not post, submit, or distribute content that
                    infringes on copyrights, trademarks, patents, or other
                    intellectual property rights of third parties. If you
                    believe that your intellectual property rights have been
                    infringed, please contact us using the form on our website.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Disclaimers
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  The Homeschool Source provides information and resources to
                  support parents and educators in homeschooling decisions. Please
                  understand the important limitations of our service.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    General Information Only
                  </h3>
                  <p>
                    The information provided on The Homeschool Source is for
                    general informational purposes only. It is not intended to
                    serve as professional legal advice, educational advice,
                    counseling, medical advice, or any other form of professional
                    consultation. We do not provide personalized recommendations
                    or guidance tailored to your specific situation.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Legal Responsibility
                  </h3>
                  <p>
                    Homeschooling laws and requirements vary significantly from
                    state to state and change frequently. You are solely
                    responsible for verifying that your homeschool is in
                    compliance with the laws of your state. We strongly recommend
                    consulting with a qualified attorney licensed in your state
                    to ensure you understand the legal requirements that apply to
                    you. The information on our site should not be relied upon as
                    legal advice.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    &quot;As-Is&quot; Service
                  </h3>
                  <p>
                    The Homeschool Source is provided on an &quot;as-is&quot;
                    basis without warranties of any kind, either express or
                    implied. We do not warrant that the information is accurate,
                    complete, or current, or that the website will function
                    without interruption or errors.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Limitation of Liability
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  To the fullest extent permitted by law, The Homeschool Source
                  and its owners, operators, and staff shall not be liable for
                  any indirect, incidental, special, consequential, or punitive
                  damages, including but not limited to damages for lost profits,
                  loss of data, business interruption, or personal injury, even if
                  we have been advised of the possibility of such damages. Our
                  total liability to you for any claims arising from your use of
                  The Homeschool Source shall not exceed the amount you have paid
                  to us, if any.
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Directory Listings and Third-Party Content
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  The Homeschool Source includes a directory of educational
                  resources, curricula, co-ops, tutoring services, and other
                  homeschool-related providers. The inclusion of a listing in our
                  directory does not constitute an endorsement by The Homeschool
                  Source.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    No Endorsement
                  </h3>
                  <p>
                    Listings in our directory are provided for informational
                    purposes only. We do not endorse, recommend, or guarantee any
                    listed provider, curriculum, or service. We have not
                    personally evaluated or tested all listed resources and cannot
                    verify the quality, safety, or suitability of these resources
                    for your family.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Your Responsibility
                  </h3>
                  <p>
                    You are responsible for independently verifying any
                    information in our directory, evaluating the quality and
                    suitability of any listed resource, and making your own
                    decisions about which providers and curricula to use. We
                    recommend reading reviews, visiting provider websites,
                    contacting providers directly, and seeking recommendations
                    from other homeschool families before making a decision.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Modifications to Terms and Service
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  The Homeschool Source reserves the right to modify these terms
                  of service at any time. Any changes to these terms will be
                  posted on this page with an updated &quot;Last Updated&quot;
                  date. Your continued use of the service following the posting
                  of revised terms means that you accept and agree to the
                  changes. We may also make changes to the service itself,
                  including adding, removing, or modifying features or
                  functionality.
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Contact Us
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  If you have questions about these terms of service, need to
                  report a violation, or have other concerns about The Homeschool
                  Source, please reach out to us. You can contact us using the
                  form on our{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    contact page
                  </Link>
                  . We will respond to your inquiry within a reasonable timeframe.
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <p className="text-muted leading-relaxed">
                You can also view our{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
