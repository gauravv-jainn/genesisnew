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
   * Genesis's business WhatsApp line. Written the way a person writes a phone
   * number rather than the way wa.me wants it — the button strips everything
   * that is not a digit before building the link, so the readable form is the
   * one that lives here and the country code is the only part that matters.
   *
   * The floating button renders only when this holds a number; setting it
   * back to an empty string switches the button off rather than leaving it
   * opening a chat with nobody.
   */
  whatsapp: "+91 96534 54848",
  /**
   * THE MESSAGE THE CHAT OPENS WITH, so the visitor never faces an empty
   * compose box. Two jobs: read like something a person would actually send,
   * and tell Genesis where the lead came from — a message that opens with the
   * website saves the first reply from being "how did you find us?". It stops
   * short of naming a division on purpose. The button floats on every page,
   * so it cannot know which one they were reading, and a wrong guess printed
   * in the visitor's own compose box is worse than no guess.
   */
  whatsappMessage:
    "Hi Genesis! I found you through your website and I'd like to talk about a project.",
} as const;

/**
 * Primary navigation — the four verticals first, then the rest.
 *
 * NO "WORK" ITEM. There is now exactly one browse on the homepage — the
 * library, below the four verticals — and Studios' own reel wall points down
 * to it. The verticals are the way in; a reader who wants the catalogue
 * reaches it from any of them.
 *
 * FLAT, NOT A DROPDOWN. The verticals lived behind a Capabilities menu, on
 * the reasoning that nine items crowd a pill. Genesis wants them on the bar
 * itself, and they are right that a division a visitor came for should not be
 * one hover away from being found. Eight fit because the names are short —
 * two of them are the forms, which Genesis asked to be reachable without
 * scrolling into a section first.
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
  /*
    THE TWO FORMS, ON THE BAR. Both pages existed and neither was reachable
    from the nav — the only routes to them were a button inside a section you
    had to scroll to first, which for a creator or an applicant who arrived
    looking for exactly this is not a route at all. Genesis asked for them up
    here by name.
  */
  { label: "I'm a Creator", href: "/creator" },
  { label: "Career", href: "/careers" },
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
