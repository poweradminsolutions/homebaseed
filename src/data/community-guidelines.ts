// Community Guidelines and Moderation Rules for The Homeschool Source
// These rules apply to all user-generated content: forum posts, reviews, comments

export const communityGuidelines = {
  title: "Community Guidelines",
  lastUpdated: "2026-04-02",
  intro:
    "The Homeschool Source is a welcoming space for all homeschool families. These guidelines exist to keep our community helpful, respectful, and focused on what matters: supporting each other in educating our kids.",

  rules: [
    {
      id: "no-politics",
      title: "No Political Content",
      severity: "zero-tolerance" as const,
      description:
        "This is a hard rule. No political parties, politicians, political movements, or political commentary of any kind. No conservative, liberal, Democrat, Republican, libertarian, or any other political references. We are here to talk about homeschooling, not politics. Posts containing political content will be removed immediately.",
    },
    {
      id: "respect-all-approaches",
      title: "Respect All Approaches",
      severity: "zero-tolerance" as const,
      description:
        "Religious families, secular families, and everything in between are welcome here. You may share your experience with religious or secular curricula and methods. You may not disparage someone else's approach. 'This worked for us' is great. 'Your way is wrong' is not.",
    },
    {
      id: "be-kind",
      title: "Be Kind and Constructive",
      severity: "warning" as const,
      description:
        "Disagree respectfully. Offer alternatives instead of just criticism. Remember that every parent here is doing their best. Personal attacks, name-calling, and bullying will result in removal from the community.",
    },
    {
      id: "no-spam",
      title: "No Spam or Self-Promotion",
      severity: "warning" as const,
      description:
        "Do not post advertisements, affiliate links, or promotional content. You may mention products or services you genuinely use and recommend, but repeated promotion of the same product or service will be treated as spam.",
    },
    {
      id: "protect-privacy",
      title: "Protect Privacy",
      severity: "zero-tolerance" as const,
      description:
        "Do not share personal information about other people, including children's full names, addresses, or photos of other people's children without consent. Use first names or initials only when discussing your own family.",
    },
    {
      id: "accurate-info",
      title: "Share Accurate Information",
      severity: "warning" as const,
      description:
        "When sharing information about state laws, requirements, or educational claims, do your best to be accurate. If you are unsure, say so. Spreading misinformation about legal requirements can have real consequences for families.",
    },
    {
      id: "stay-on-topic",
      title: "Stay On Topic",
      severity: "warning" as const,
      description:
        "Post in the appropriate category. Keep discussions focused on homeschooling and related topics. Off-topic posts may be moved or removed.",
    },
    {
      id: "no-medical-advice",
      title: "No Medical or Legal Advice",
      severity: "warning" as const,
      description:
        "You may share your personal experiences with learning differences, therapies, and accommodations. Do not present yourself as a medical or legal professional unless you are one, and even then, encourage others to consult their own professionals.",
    },
  ],

  enforcement: {
    firstViolation: "Post removed with a private message explaining the violation.",
    secondViolation: "Post removed with a formal warning.",
    thirdViolation: "Temporary suspension (7 days).",
    zeroTolerance:
      "Political content, privacy violations, and hate speech result in immediate post removal. Repeated violations result in permanent ban.",
  },
};
