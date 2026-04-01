"use client";

import { useState } from "react";
import { states } from "@/data/states";

type ResourceType = "coop" | "curriculum" | "tutor" | "event" | "other" | "";

interface FormData {
  type: ResourceType;
  name: string;
  description: string;
  website: string;
  email: string;
  state: string;
  city: string;
  submitterName: string;
  submitterEmail: string;
  termsAgreed: boolean;

  // Co-op/Group fields
  meetingSchedule?: string;
  ageRange?: string;
  cost?: string;
  religiousAffiliation?: string;

  // Curriculum fields
  subjects?: string;
  gradeRange?: string;
  approach?: string;
  priceRange?: string;

  // Tutor fields
  tutorSubjects?: string;
  hourlyRate?: string;
  format?: string;
}

export default function SubmitPage() {
  const [formData, setFormData] = useState<FormData>({
    type: "",
    name: "",
    description: "",
    website: "",
    email: "",
    state: "",
    city: "",
    submitterName: "",
    submitterEmail: "",
    termsAgreed: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setFormData({
            type: "",
            name: "",
            description: "",
            website: "",
            email: "",
            state: "",
            city: "",
            submitterName: "",
            submitterEmail: "",
            termsAgreed: false,
          });
          setSubmitted(false);
        }, 5000);
      } else {
        const error = await response.json();
        setSubmitError(error.error || "Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderConditionalFields = () => {
    switch (formData.type) {
      case "coop":
        return (
          <div className="space-y-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-foreground">Co-op / Group Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Meeting Schedule
                </label>
                <input
                  type="text"
                  name="meetingSchedule"
                  value={formData.meetingSchedule || ""}
                  onChange={handleChange}
                  placeholder="e.g., Tuesdays & Thursdays, 9am-1pm"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Age Range Served
                </label>
                <input
                  type="text"
                  name="ageRange"
                  value={formData.ageRange || ""}
                  onChange={handleChange}
                  placeholder="e.g., K-5, 6-8, 9-12"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cost Per Year
                </label>
                <input
                  type="text"
                  name="cost"
                  value={formData.cost || ""}
                  onChange={handleChange}
                  placeholder="e.g., $500-800, Free, $50/month"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Religious Affiliation
                </label>
                <input
                  type="text"
                  name="religiousAffiliation"
                  value={formData.religiousAffiliation || ""}
                  onChange={handleChange}
                  placeholder="e.g., Christian, Secular, Eclectic, None"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case "curriculum":
        return (
          <div className="space-y-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-foreground">Curriculum Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subjects Covered
                </label>
                <input
                  type="text"
                  name="subjects"
                  value={formData.subjects || ""}
                  onChange={handleChange}
                  placeholder="e.g., Math, English, Science, History"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Grade Range
                </label>
                <input
                  type="text"
                  name="gradeRange"
                  value={formData.gradeRange || ""}
                  onChange={handleChange}
                  placeholder="e.g., K-2, 3-5, 6-8, 9-12"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Approach / Philosophy
                </label>
                <input
                  type="text"
                  name="approach"
                  value={formData.approach || ""}
                  onChange={handleChange}
                  placeholder="e.g., Charlotte Mason, Classical, Unschooling, Eclectic"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price Range
                </label>
                <input
                  type="text"
                  name="priceRange"
                  value={formData.priceRange || ""}
                  onChange={handleChange}
                  placeholder="e.g., $200-400, Free, $30-50 per subject"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case "tutor":
        return (
          <div className="space-y-6 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="font-semibold text-foreground">Tutor / Service Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subjects
                </label>
                <input
                  type="text"
                  name="tutorSubjects"
                  value={formData.tutorSubjects || ""}
                  onChange={handleChange}
                  placeholder="e.g., Math, Writing, Test Prep, Reading"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Hourly Rate Range
                </label>
                <input
                  type="text"
                  name="hourlyRate"
                  value={formData.hourlyRate || ""}
                  onChange={handleChange}
                  placeholder="e.g., $30-50/hr, $40/hr, Sliding scale"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Format
                </label>
                <select
                  name="format"
                  value={formData.format || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select format...</option>
                  <option value="in-person">In-Person</option>
                  <option value="online">Online</option>
                  <option value="both">Both In-Person and Online</option>
                </select>
              </div>
            </div>
          </div>
        );

      case "event":
        return (
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-3">Event Details</h3>
            <p className="text-muted text-sm">
              Please include event dates, frequency, and any registration details
              in your description above.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              Share Your Resource
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Found an amazing co-op, curriculum, tutoring service, or event?
              Help other families discover it. Add it to The Homeschool Source.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Submission Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-border rounded-xl p-8">
                {submitted ? (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-12 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-8 h-8 text-green-600"
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
                    <h3 className="text-2xl font-bold text-green-900 mb-2">
                      Thank You!
                    </h3>
                    <p className="text-green-800 mb-4">
                      We received your submission and our editors will review it
                      within a few business days. You should hear back soon!
                    </p>
                    <p className="text-sm text-green-700">
                      We really appreciate you helping make The Homeschool Source better.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitError && (
                      <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                        <p className="text-red-800">{submitError}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-3">
                        What are you sharing?
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { value: "coop", label: "Co-op or Group" },
                          { value: "curriculum", label: "Curriculum" },
                          { value: "tutor", label: "Tutor or Service" },
                          { value: "event", label: "Event" },
                          { value: "other", label: "Other" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                type: option.value as ResourceType,
                              }))
                            }
                            className={`p-3 border-2 rounded-lg transition-all text-sm font-medium ${
                              formData.type === option.value
                                ? "border-primary bg-primary-light text-primary"
                                : "border-border text-foreground hover:border-primary"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.type && (
                      <>
                        <div className="border-t border-border pt-6">
                          <h3 className="font-semibold text-foreground mb-4">
                            Basic Information
                          </h3>
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Name of {formData.type === "coop" ? "Co-op/Group" : formData.type === "curriculum" ? "Curriculum" : formData.type === "tutor" ? "Service/Person" : "Event"}
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter the name"
                                required
                                className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Description
                              </label>
                              <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell us about it. What makes it special? Who would benefit?"
                                required
                                rows={5}
                                className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Website
                              </label>
                              <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Contact Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="contact@example.com"
                                className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                  State
                                </label>
                                <select
                                  name="state"
                                  value={formData.state}
                                  onChange={handleChange}
                                  required
                                  className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                  <option value="">Select a state...</option>
                                  {states.map((state) => (
                                    <option key={state.slug} value={state.slug}>
                                      {state.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                  City / Area
                                </label>
                                <input
                                  type="text"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleChange}
                                  placeholder="City or region"
                                  className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {renderConditionalFields()}

                        <div className="border-t border-border pt-6">
                          <h3 className="font-semibold text-foreground mb-4">
                            About You
                          </h3>
                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Your Name
                              </label>
                              <input
                                type="text"
                                name="submitterName"
                                value={formData.submitterName}
                                onChange={handleChange}
                                placeholder="How should we credit you?"
                                required
                                className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                Your Email
                              </label>
                              <input
                                type="email"
                                name="submitterEmail"
                                value={formData.submitterEmail}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                required
                                className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-border pt-6">
                          <label className="flex gap-3 items-start cursor-pointer">
                            <input
                              type="checkbox"
                              name="termsAgreed"
                              checked={formData.termsAgreed}
                              onChange={handleChange}
                              required
                              className="w-5 h-5 border border-border rounded mt-0.5 accent-primary cursor-pointer"
                            />
                            <span className="text-sm text-muted leading-relaxed">
                              I confirm that this information is accurate and
                              complete. I understand that The Homeschool Source may edit
                              or remove this listing if it violates our
                              guidelines or contains inaccurate information.
                            </span>
                          </label>
                        </div>

                        <button
                          type="submit"
                          disabled={!formData.termsAgreed || isSubmitting}
                          className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "Submitting..." : "Submit for Review"}
                        </button>
                      </>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-primary-light rounded-xl p-6 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-4">
                  Guidelines for Great Listings
                </h3>
                <ul className="space-y-3 text-sm text-muted">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold flex-shrink-0">
                      ✓
                    </span>
                    <span>
                      <strong className="text-foreground">Be accurate.</strong> Double-check
                      all information before submitting.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold flex-shrink-0">
                      ✓
                    </span>
                    <span>
                      <strong className="text-foreground">Be specific.</strong> The more
                      details, the better families can decide if it's right for
                      them.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold flex-shrink-0">
                      ✓
                    </span>
                    <span>
                      <strong className="text-foreground">Stay neutral.</strong> Describe
                      what the resource is, not why everyone should use it.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold flex-shrink-0">
                      ✓
                    </span>
                    <span>
                      <strong className="text-foreground">Use plain language.</strong> Think
                      "parent-friendly," not corporate.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold flex-shrink-0">
                      ✓
                    </span>
                    <span>
                      <strong className="text-foreground">Include contact info.</strong> A
                      website or email so families can follow up.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  What Happens Next?
                </h3>
                <ol className="space-y-3 text-sm text-muted">
                  <li className="flex gap-2">
                    <span className="font-bold text-primary flex-shrink-0">
                      1.
                    </span>
                    <span>You submit the form</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary flex-shrink-0">
                      2.
                    </span>
                    <span>Our editors review it for accuracy</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary flex-shrink-0">
                      3.
                    </span>
                    <span>We may ask for clarification or edits</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary flex-shrink-0">
                      4.
                    </span>
                    <span>Your listing goes live!</span>
                  </li>
                </ol>
                <p className="mt-4 text-xs text-muted italic">
                  This usually takes 2-5 business days.
                </p>
              </div>

              <div className="bg-white border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-3">
                  Questions?
                </h3>
                <p className="text-sm text-muted mb-4">
                  Email us at hello@thehomeschoolsource.com or use our contact form.
                </p>
                <a
                  href="/contact"
                  className="inline-block w-full text-center text-primary font-medium hover:text-primary-dark"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
