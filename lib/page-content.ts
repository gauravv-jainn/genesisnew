import { proof } from "./proof";

/**
 * Copy for the standalone pages.
 *
 * Same rule as lib/home-content.ts: real material from the spec document
 * where it exists, everything else marked TODO. Categories and the "Genesis'
 * NETFLIX" framing come from the spec.
 */

// --- /our-work — Content Library -------------------------------------------

export const ourWork = {
  label: "Portfolio",
  heading: "Everything",
  headingAccent: "we've made",
  body:
    "The complete library — reels, films, campaigns and brand work. Filter by division or by format; every piece opens on its own page.",
} as const;

/** Sidebar navigation, exactly as listed in the mockup. */
// --- /influencer-campaigns --------------------------------------------------

export const influencerPage = {
  label: "Strategic · Targeted · Impactful",
  heading: "Influencer",
  headingAccent: "campaigns",
  body:
    "From discovery to delivery, we connect brands with the right voices to create content that drives results.",
  // From lib/proof.ts. The three TODOs that used to sit here were rendering
  // as literal "TODO" wherever a component did not think to guard them.
  stats: [proof.creatorDatabase, proof.campaigns, proof.brands, proof.reach],
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
