"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send message");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        subject: "",
        message: "",
      });
      setLoading(false);

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "Is The Homeschool Source really free?",
      answer:
        "Yes, completely. Every resource on The Homeschool Source is free to access. No paywalls, no ads, no affiliate links, no surprise charges. We're funded by community contributions and the belief that homeschooling information should be accessible to everyone.",
    },
    {
      question: "How do I add my co-op or resource?",
      answer:
        "Visit our Submit page to fill out a quick form with details about your co-op, curriculum, tutoring service, or other resource. After you submit, our volunteer editors will verify the information and add it to the directory within a few business days.",
    },
    {
      question: "Is the legal information up to date?",
      answer:
        "We work hard to keep state laws current, but laws change throughout the year. If you notice something outdated or incorrect, please use the 'Report Incorrect Info' option in the contact form so our editors can verify and update it right away.",
    },
    {
      question: "Do you recommend specific curricula?",
      answer:
        "We don't recommend anything—we compile resources and let parents decide. You'll find curriculum reviews and descriptions in our directory, but we don't push any particular approach. We believe the best curriculum is the one that works for your family.",
    },
    {
      question: "Can I volunteer or contribute?",
      answer:
        "Absolutely! We're looking for editors, writers, researchers, developers, and subject matter experts. Use the 'Partnership Inquiry' option in the contact form to tell us how you'd like to help.",
    },
    {
      question: "How do I report incorrect information?",
      answer:
        "If you find a mistake—a co-op that closed, outdated state law, bad website link—use the 'Report Incorrect Info' option in the contact form and include as much detail as you can. Our editors review all reports and make corrections quickly.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              Get in Touch
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Have a question? Found an error? Want to help? We&apos;d love to
              hear from you. We typically respond within 24-48 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-border rounded-xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Send us a Message
                </h2>

                {submitted ? (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-8 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      Thank you!
                    </h3>
                    <p className="text-green-800">
                      We got your message and we&apos;ll be in touch soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Sarah"
                          required
                          className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Johnson"
                          required
                          className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Mobile Phone
                        <span className="text-muted text-xs font-normal ml-2">Optional - for faster response</span>
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                        className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Choose a topic...</option>
                        <option value="General Question">General Question</option>
                        <option value="Report Incorrect Info">Report Incorrect Info</option>
                        <option value="Submit a Resource">Submit a Resource</option>
                        <option value="Partnership Inquiry">Partnership Inquiry</option>
                        <option value="Bug Report">Bug Report</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us what's on your mind..."
                        required
                        rows={6}
                        className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-primary-light rounded-xl p-6 border border-primary/20">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Response Time
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted leading-relaxed">
                    We typically respond to all messages within <strong>24-48 hours</strong> during business days. For faster service on urgent matters, please include your phone number.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Submit a Resource
                </h3>
                <p className="text-sm text-muted mb-4">
                  Have a co-op, curriculum, or service to share? Use our
                  dedicated form.
                </p>
                <a
                  href="/submit"
                  className="inline-block w-full text-center bg-primary text-white font-medium py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Go to Submit Form
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Answers to common questions about The Homeschool Source
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-white rounded-lg border border-border overflow-hidden"
              >
                <summary className="flex items-center justify-between w-full px-6 py-4 cursor-pointer hover:bg-primary-light/50 transition-colors font-semibold text-foreground">
                  <span>{faq.question}</span>
                  <span className="text-primary flex-shrink-0 ml-4">
                    <svg
                      className="w-5 h-5 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 py-4 border-t border-border bg-white/50">
                  <p className="text-muted leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
