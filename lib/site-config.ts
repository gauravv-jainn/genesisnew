/**
 * Single source of truth for navigation and site-wide strings.
 * Defined once so the nav, footer, sitemap and mobile menu never drift.
 */

export type NavItem = {
  label: string;
  href: string;
  /** One-line description, used by the Capabilities menu. */
  blurb?: string;
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
  /**
   * WhatsApp, in international format without symbols — e.g. "919876543210".
   *
   * DELIBERATELY EMPTY. The floating button renders only when this holds a
   * real number, because a WhatsApp button that opens a chat with nobody is
   * worse than no button: it is a dead end presented as the fastest way to
   * reach Genesis. One line to fill in.
   * TODO(content): supply the business WhatsApp number.
   */
  whatsapp: "",
  whatsappMessage:
    "Hi Genesis, I'd like to discuss a project with your team.",
} as const;

/**
 * Primary navigation — the four verticals first, then the rest.
 *
 * NO "WORK" ITEM. The work now appears twice on the homepage — a short rail
 * near the top and the full library after Studios — so a nav entry pointing
 * at one of them is ambiguous, and the verticals are the way in.
 *
 * FLAT, NOT A DROPDOWN. The verticals lived behind a Capabilities menu, on
 * the reasoning that nine items crowd a pill. Genesis wants them on the bar
 * itself, and they are right that a division a visitor came for should not be
 * one hover away from being found. Seven items fit because the names are
 * short.
 *
 * THE PREFIX IS DROPPED. "Genesis Influence" four times in a row, under a
 * Genesis wordmark, is the same word five times across one bar. The prefix
 * belongs on the division's own page, where it is the lockup.
 */
export const navItems: NavItem[] = [
  { label: "Influence", href: "/#influence" },
  { label: "Studios", href: "/#studios" },
  { label: "AI Labs", href: "/#ai-lab" },
  { label: "Brand & Design", href: "/#brand-design" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Contact", href: "/#contact" },
];

/**
 * The same four, with their full names and blurbs, for the footer — where
 * there is room and no wordmark beside them.
 */
export const capabilities: NavItem[] = [
  { label: "Genesis Influence", href: "/#influence", blurb: "Creator-led growth" },
  { label: "Genesis Studios", href: "/#studios", blurb: "Production & content" },
  { label: "Genesis AI Labs", href: "/#ai-lab", blurb: "Creative technology" },
  { label: "Genesis Brand & Design", href: "/#brand-design", blurb: "Identity & communication" },
];

/** The one navigation item that is meant to look like an action. */
export const primaryCta = { label: "Start a Project", href: "/#contact" } as const;

/**
 * Footer groupings, rebuilt around the four verticals rather than around the
 * old service list.
 *
 * Client Login is here and nowhere else. Genesis Insider is an internal
 * operating system, and it was interrupting the agency story with a section
 * on the homepage — a visitor deciding whether to hire Genesis has no use for
 * a staff login, and a prospect who sees one wonders whether they are in the
 * right place.
 */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Genesis",
    items: [
      { label: "About", href: "/#about" },
          { label: "Portfolio", href: "/our-work" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Team", href: "/team" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    heading: "Capabilities",
    items: capabilities.map(({ label, href }) => ({ label, href })),
  },
  {
    heading: "Connect",
    items: [
      { label: "Contact", href: "/#contact" },
      { label: "For Creators", href: "/creator" },
      { label: "Start a Project", href: "/#contact" },
      { label: "Client Login", href: "/insider" },
    ],
  },
];
