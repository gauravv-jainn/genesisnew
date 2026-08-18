import type { Poster } from "@/components/genesis/poster-card";

/**
 * Copy for the standalone pages.
 *
 * Same rule as lib/home-content.ts: real material from the spec document
 * where it exists, everything else marked TODO. Categories and the "Genesis'
 * NETFLIX" framing come from the spec.
 */

// --- /our-work — Content Library -------------------------------------------

export const ourWork = {
  label: "Content library",
  heading: "Everything we've",
  headingAccent: "made",
  body:
    "Reels, films, ad campaigns, brand stories and AI content — the full catalogue, filterable by format.",
  // Categories are verbatim from the spec's content-library mockup.
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
  // TODO(assets): real thumbnails and video links required. Clients are real.
  items: [
    { id: "abc-reel", client: "Aditya Birla Capital", title: "Campaign reel", category: "Reels", meta: ["2025"] },
    { id: "hdfc-film", client: "HDFC", title: "Brand film", category: "Films", meta: ["2025"] },
    { id: "absli-story", client: "Aditya Birla Sun Life Insurance", title: "Brand story", category: "Brand Stories", meta: ["2024"] },
    { id: "mahindra-campaign", client: "Mahindra Finance", title: "Influencer campaign", category: "Influencer Campaigns", meta: ["2025"] },
    { id: "ai-avatars", client: "Genesis AI Studio", title: "AI avatar series", category: "AI Content", meta: ["2025"] },
    { id: "tripgate-brand", client: "Tripgate", title: "Brand identity film", category: "Films", meta: ["2024"] },
    { id: "abhi-ad", client: "Abhi App", title: "Product ad", category: "Ads", meta: ["2025"] },
    { id: "doja-content", client: "Doja", title: "Curated content", category: "Reels", meta: ["2025"] },
    { id: "event-coverage", client: "Genesis", title: "Event coverage", category: "Event Coverage", meta: ["2025"] },
  ] satisfies Poster[],
} as const;

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
