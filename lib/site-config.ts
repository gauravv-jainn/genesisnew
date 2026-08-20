/**
 * Single source of truth for navigation and site-wide strings.
 * Defined once so the nav, footer, sitemap and mobile menu never drift.
 */

export type NavItem = {
  label: string;
  href: string;
  /** Marks routes that do not exist until Phase 4. */
  planned?: boolean;
};

export const siteConfig = {
  name: "Genesis Media",
  // TODO(copy): pulled from the current genesismedia.co hero (docs/reference/
  // img-019). Confirm before launch — the live site has a typo in "Technolgy".
  tagline: "Empowering brands with influencer marketing, creative content & technology.",
  description:
    "Genesis is a Gen Z-led full-service agency where strategy, content and technology come together to build iconic brands.",
  url: "https://genesismedia.co",
} as const;

/** Primary navigation. Homepage sections are anchors; the rest are routes. */
export const navItems: NavItem[] = [
  { label: "Work", href: "/our-work" },
  { label: "Services", href: "/#services" },
  { label: "Content", href: "/content-creation" },
  { label: "Case Studies", href: "/#case-studies" },
  { label: "Influencers", href: "/influencer-campaigns" },
  { label: "Journal", href: "/blog" },
  { label: "Creators", href: "/creator" },
];

/** Footer groupings. */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Agency",
    items: [
      { label: "Our Work", href: "/our-work" },
      { label: "Content Creation", href: "/content-creation" },
      { label: "Case Studies", href: "/#case-studies" },
      { label: "Services", href: "/#services" },
    ],
  },
  {
    heading: "Network",
    items: [
      { label: "Influencer Campaigns", href: "/influencer-campaigns" },
      { label: "For Creators", href: "/creator" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    heading: "More",
    items: [
      { label: "Journal", href: "/blog" },
      { label: "Insider", href: "/insider" },
    ],
  },
];
