import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | The Homeschool Source",
  description:
    "Privacy policy for The Homeschool Source. Learn how we collect, use, and protect your information.",
  openGraph: {
    title: "Privacy Policy | The Homeschool Source",
    description: "Privacy policy for The Homeschool Source",
    type: "website",
    url: "https://thehomeschoolsource.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Your privacy matters to us. Here&apos;s exactly what information we
              collect and how we use it.
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
                The Homeschool Source (&quot;we,&quot; &quot;us,&quot; or
                &quot;our&quot;) operates the website thehomeschoolsource.com.
                This page informs you of our policies regarding the collection,
                use, and disclosure of personal data when you use our service and
                the choices you have associated with that data.
              </p>
              <p className="text-muted leading-relaxed">
                <strong>Important:</strong> This privacy policy is provided for
                informational purposes and is not legal advice. We recommend
                consulting with a qualified attorney to understand how privacy
                laws may apply to your specific situation.
              </p>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Information We Collect
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  We collect information in several categories to provide and
                  improve our service. This information helps us manage your
                  account, communicate with you, and enhance your experience on
                  our platform.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Account Information
                  </h3>
                  <p>
                    When you create an account, we collect and store your name
                    and email address. This information is necessary for account
                    creation, authentication, and communication purposes. Your
                    email address may be used to send you account notifications,
                    verification messages, and other service-related
                    communications.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Usage Information
                  </h3>
                  <p>
                    We collect information about how you interact with our
                    website, including which pages you visit, how long you spend
                    on each page, the links you click, and your search queries.
                    This usage data helps us understand which resources are most
                    valuable to our users and where we can improve the site.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Cookies and Local Storage
                  </h3>
                  <p>
                    We use cookies and browser local storage to enhance your
                    experience on our site. Specifically, we use these tools to
                    remember your bookmarks and your preferences (such as display
                    settings or category filters). These small data files are
                    stored on your device and help us provide a more personalized
                    experience without storing sensitive information on our
                    servers.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                How We Use Your Information
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  We use the information we collect for specific, limited
                  purposes related to providing our service and improving our
                  platform.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Account Management
                  </h3>
                  <p>
                    Your account information is used to create and maintain your
                    user account, authenticate your identity when you log in,
                    manage your account settings, and preserve your bookmarks and
                    preferences across devices and sessions.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Email Communications
                  </h3>
                  <p>
                    We may send you transactional emails (account confirmations,
                    password resets, and service announcements) that are
                    essential to using our service. If you opt in to receive
                    notifications, we may also send you emails about updates to
                    resources relevant to your interests or state, new features,
                    or important information about the site. You can manage your
                    email preferences at any time through your account settings
                    and can opt out of promotional emails while still receiving
                    essential transactional messages.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Site Improvement
                  </h3>
                  <p>
                    Your usage data helps us understand how people use the site,
                    which resources are most helpful, which features are
                    underutilized, and where we can make improvements. We analyze
                    this data in aggregate to identify trends and patterns, not
                    to track individual users.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                What We Do NOT Do
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  We believe in being transparent about what we don&apos;t do
                  with your information:
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    No Data Sales or Sharing for Profit
                  </h3>
                  <p>
                    We do not sell your personal information to third parties.
                    We do not share your data with marketers, advertisers, or
                    data brokers. Your information is not for sale at any price.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    No Advertising or Tracking Pixels
                  </h3>
                  <p>
                    The Homeschool Source does not display advertisements on our
                    site. We do not use tracking pixels, web beacons, or other
                    hidden tracking technologies to follow users across the
                    internet. We do not participate in ad networks or use your
                    data to build advertising profiles.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    No Third-Party Ad Networks
                  </h3>
                  <p>
                    We do not partner with Google Analytics for user tracking, do
                    not use Meta Pixel or similar conversion tracking tools, and
                    do not allow third-party advertisers to track you on our
                    site. Our focus is on providing useful information, not on
                    building detailed user profiles for commercial purposes.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Third-Party Services
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  Our site relies on trusted third-party services to operate. We
                  choose these partners carefully and have agreements in place to
                  protect your information.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Supabase
                  </h3>
                  <p>
                    We use Supabase for authentication and database services.
                    Supabase handles your login credentials and stores your
                    account data securely. Supabase is committed to data
                    protection and privacy. Your data is stored with Supabase
                    and is subject to their privacy policies.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Mailgun
                  </h3>
                  <p>
                    We use Mailgun to send transactional emails such as password
                    resets, account confirmations, and notification emails you
                    have opted into. Mailgun does not use your email address for
                    any purpose other than delivering our messages. Mailgun is
                    committed to email privacy and security.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Vercel
                  </h3>
                  <p>
                    Our website is hosted on Vercel, which provides the
                    infrastructure and servers that deliver our site to you.
                    Vercel collects basic server logs and analytics to maintain
                    site performance and security. Vercel is compliant with
                    major data protection regulations.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Your Rights and Choices
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  You have important rights regarding your personal information,
                  and we provide multiple ways for you to exercise those rights.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Delete Your Account
                  </h3>
                  <p>
                    You can delete your account at any time through your account
                    settings. When you delete your account, we remove your
                    personal data (name and email address) from our active
                    system. Some limited information may be retained for legal
                    compliance or technical reasons, but it will not be used to
                    identify you.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Export Your Data
                  </h3>
                  <p>
                    You can request a copy of your data at any time. Contact us
                    through our contact form on the website, and we will provide
                    you with all personal information we hold about you in a
                    standard, portable format.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Manage Email Preferences
                  </h3>
                  <p>
                    You can control which emails you receive through your account
                    notifications settings. You can opt out of all promotional
                    and notification emails at any time. We will continue to send
                    transactional emails necessary for account management and
                    security.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    Clear Cookies and Local Storage
                  </h3>
                  <p>
                    You can delete cookies and local storage data using your
                    browser settings. Clearing this data will remove your saved
                    bookmarks and preferences on that device, but you can
                    restore them by logging in to your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Children&apos;s Privacy
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  The Homeschool Source is designed for parents, guardians, and
                  adult homeschooling educators. We do not knowingly collect
                  personal information from children under the age of 13. If we
                  learn that we have collected personal information from a child
                  under 13 without parental consent, we will delete that
                  information promptly. If you believe we have collected
                  information from a child under 13, please contact us immediately
                  using the contact form on our website.
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Contact Us
              </h2>
              <div className="space-y-6 text-muted leading-relaxed">
                <p>
                  If you have questions about this privacy policy, want to
                  exercise your data rights, or have concerns about how we handle
                  your information, please reach out to us. You can contact us
                  using the form on our{" "}
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
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
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
