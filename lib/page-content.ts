/**
 * Copy for the standalone pages.
 *
 * Same rule as lib/home-content.ts: real material from the spec document
 * where it exists, everything else marked TODO. Categories and the "Genesis'
 * NETFLIX" framing come from the spec.
 */

// --- /our-work — Content Library -------------------------------------------

export const ourWork = {
  heading: "Our Content",
  body: "Explore content crafted with creativity, strategy and results.",
  // Verbatim from the Genesis mockup on page 7 of the spec.
  categories: [
    "All",
    "Reels",
    "Films",
    "Ads",
    "Brand Stories",
    "Influencer Campaigns",
    "AI Content",
    "Event Coverage",
  ],
  /**
   * The exact ten pieces in the mockup, in order. These are the Content
   * Library's clients — a different set from the Portfolio section's
   * (Aditya Birla, HDFC, ABSLI, Mahindra Finance). Both are real; they belong
   * to different sections, and conflating them was an earlier mistake.
   *
   * TODO(assets): the spec notes "videos playing on their own like a GIF", so
   * each item needs a short muted loop. `poster` is the still shown until it
   * loads; `clip` is the loop. Both are pending real media.
   */
  items: [
    // `clip` is a short muted loop (the spec's "videos playing on their own
    // like a GIF"); `poster` is the still shown until it can play. Both are
    // optional — a tile without them falls back to generated artwork.
    { id: "kayali", art: "/work/kayali.webp", client: "KAYALI", title: "Product Reel", category: "Reels", badge: "Reel" },
    { id: "tata-motors", art: "/work/tata-motors.webp", client: "TATA MOTORS", title: "Brand Film", category: "Films", badge: "Film" },
    { id: "icici", art: "/work/icici-bank.webp", client: "ICICI BANK", title: "Brand Story", category: "Brand Stories", badge: "Brand Story" },
    { id: "miraggio", art: "/work/miraggio.webp", client: "MIRAGGIO", title: "Lifestyle Reel", category: "Reels", badge: "Reel" },
    { id: "yonex", art: "/work/yonex.webp", client: "YONEX", title: "Ad Film", category: "Ads", badge: "Ad Film" },
    { id: "third-wave", art: "/work/third-wave-coffee.webp", client: "THIRD WAVE COFFEE", title: "Product Reel", category: "Reels", badge: "Reel" },
    { id: "mauritius", art: "/work/mauritius-tourism.webp", client: "MAURITIUS TOURISM", title: "Travel Film", category: "Films", badge: "Travel Film" },
    { id: "kreo-tech", art: "/work/kreo-tech.webp", client: "KREO TECH", title: "Product Film", category: "Films", badge: "Product Film" },
    { id: "dot-key", art: "/work/dot-and-key.webp", client: "DOT & KEY", title: "Skincare Reel", category: "Reels", badge: "Reel" },
    { id: "genesis-drip", art: "/work/genesis-drip.webp", client: "GENESIS DRIP", title: "Event Coverage", category: "Event Coverage", badge: "Event" },
  ],
} as const;

/** Sidebar navigation, exactly as listed in the mockup. */
export const workspaceNav = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Our Work", href: "/our-work", icon: "grid" },
  { label: "Services", href: "/#services", icon: "layers" },
  { label: "Case Studies", href: "/#case-studies", icon: "file" },
  { label: "AI Studio", href: "/#ai-studio", icon: "sparkles" },
  { label: "Influencers", href: "/influencer-campaigns", icon: "users" },
  { label: "About Us", href: "/#about", icon: "info" },
  { label: "Insights", href: "/blog", icon: "book" },
  { label: "Contact", href: "/#contact", icon: "send" },
] as const;

// --- /influencer-campaigns --------------------------------------------------

export const influencerPage = {
  label: "Strategic · Targeted · Impactful",
  heading: "Influencer",
  headingAccent: "campaigns",
  body:
    "From discovery to delivery, we connect brands with the right voices to create content that drives results.",
  // TODO(data): only the database figure is confirmed by the spec.
  stats: [
    { value: "1,00,000+", label: "Creator database" },
    { value: "TODO", label: "Campaigns executed" },
    { value: "TODO", label: "Brands partnered" },
    { value: "TODO", label: "Content reach" },
  ],
  genres: [
    "Fashion", "Fitness", "Finance", "Travel", "Food",
    "Tech", "Lifestyle", "Beauty", "Gaming", "Parenting",
  ],
  process: [
    { title: "Discovery", body: "Brief, audience and channel strategy — before a single creator is approached." },
    { title: "Matching", body: "Creators shortlisted from the database against the audience, not the follower count." },
    { title: "Production", body: "Scripting, direction and edit support so the content clears the bar." },
    { title: "Delivery", body: "Publishing, tracking and reporting against the numbers agreed up front." },
  ],
} as const;

// --- /creator ---------------------------------------------------------------

export const creatorPage = {
  label: "I'm a creator",
  heading: "Work with",
  headingAccent: "Genesis",
  body:
    "We run campaigns for brands that pay on time and brief properly. If you make content people actually watch, we'd like you on the roster.",
  benefits: [
    { title: "Real briefs", body: "Written briefs with a clear deliverable, deadline and fee — agreed before you start." },
    { title: "Paid on schedule", body: "Payment terms are set at signing and tracked, not negotiated after delivery." },
    { title: "Creative latitude", body: "You know your audience. We bring the brand's guardrails, not a shot list." },
    { title: "Repeat work", body: "Most of our creators come back for the next campaign. That's the whole model." },
  ],
} as const;

// --- /careers ---------------------------------------------------------------

export const careersPage = {
  label: "Careers",
  heading: "Join the",
  headingAccent: "waitlist",
  body:
    "We open roles in batches. Leave your details and we'll reach out when something matching your discipline opens up.",
  disciplines: [
    "Content production", "Editing & post", "Creative direction",
    "Strategy", "Influencer partnerships", "Design & motion",
    "AI content", "Engineering",
  ],
} as const;

// --- /content-creation ------------------------------------------------------

/**
 * Spec, page 28: "Content Creation - Create a New Page / Add blogs section /
 * Add creative process 2 lines or sections / [Add blog articles linked to the
 * video uploaded on YouTube]".
 */
export const contentCreationPage = {
  label: "Content creation",
  heading: "Production that holds up",
  headingAccent: "on any feed",
  body:
    "Creative direction, strategy, scripting, shoot and post — the full pipeline in-house, so a campaign never loses its thread between the idea and the published post.",
  capabilities: [
    { title: "Creative direction", body: "The idea, and the argument about whether it is the right one." },
    { title: "Strategy", body: "Audience, channel and measurement decided before anything is shot." },
    { title: "Scripting", body: "Concept to board, written for the placement it will actually run in." },
    { title: "Production", body: "Shoot or generation, with the standard set at the top." },
    { title: "Edit & post", body: "Assembly, grade and sound — where timing decides whether it works." },
    { title: "Distribution", body: "Publishing, tracking, and reporting against the numbers agreed up front." },
  ],
  /**
   * TODO(content): the spec wants each article linked to its YouTube video,
   * and the thumbnails changed. Needs the video IDs.
   */
  videoNote: "Articles pair with the film they document.",
} as const;
