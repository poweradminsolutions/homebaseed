"use client";

import type { Metadata } from "next";
import { useState } from "react";

// Note: Metadata export doesn't work in client components, so we'll keep it server-side
// This component should be wrapped in a server-side layout with metadata

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send to a backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
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
        "Absolutely! We're looking for editors, writers, researchers, developers, and subject matter experts. Email us at hello@thehomeschoolsource.com or use the 'Partnership Inquiry' option to tell us how you'd like to help.",
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Sarah Johnson"
                          required
                          className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address
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
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Choose a topic...</option>
                        <option value="general">General Question</option>
                        <option value="incorrect">Report Incorrect Info</option>
                        <option value="submit">Submit a Resource</option>
                        <option value="partnership">Partnership Inquiry</option>
                        <option value="bug">Bug Report</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message
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
                      className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-primary-light rounded-xl p-6 border border-primary/20">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Quick Contact Info
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted mb-1">Email</p>
                    <p className="text-primary font-medium">
                      hello@thehomeschoolsource.com
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted mb-1">Response Time</p>
                    <p className="text-foreground font-medium">24-48 hours</p>
                  </div>
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
