import Link from "next/link";

const footerLinks = {
  explore: [
    { href: "/states", label: "State Laws" },
    { href: "/find", label: "Find Resources" },
    { href: "/curriculum", label: "Curriculum Directory" },
    { href: "/events", label: "Events" },
  ],
  learn: [
    { href: "/get-started", label: "Getting Started" },
    { href: "/college-prep", label: "College Prep" },
    { href: "/special-needs", label: "Special Needs" },
    { href: "/community", label: "Community" },
  ],
  about: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/submit", label: "Submit a Listing" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-white mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-xl font-bold">
              The Homeschool <span className="text-green-400">Source</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              A free, neutral directory for the US homeschooling community.
              No ads. No affiliates. Just helpful information.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Explore
            </h3>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Learn
            </h3>
            <ul className="space-y-2">
              {footerLinks.learn.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
              About
            </h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} The Homeschool Source. Free and open for
            everyone. Not affiliated with any religious organization, curriculum
            publisher, or government agency.
          </p>
        </div>
      </div>
    </footer>
  );
}
