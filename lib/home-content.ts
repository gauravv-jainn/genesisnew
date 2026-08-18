import type { Poster } from "@/components/genesis/poster-card";
import type { Milestone } from "@/components/genesis/animated-timeline";

/**
 * All homepage copy in one place.
 *
 * Everything marked TODO needs sign-off before launch. Where possible this is
 * REAL Genesis material recovered from docs/reference/ rather than invented
 * filler — the current site's hero and body copy (img-019), the influencer
 * figures and positioning line (img-012), and the client/category lists
 * (img-013). Invented items are labelled as such.
 */

// --- Hero -------------------------------------------------------------------

export const hero = {
  eyebrow: "Gen Z-led · Full-service · AI-first",
  // Real, from the current genesismedia.co hero. NOTE: the live site spells it
  // "Technolgy" — corrected here; fix at the source too.
  headlineLead: "Empowering brands with influencer marketing, creative content &",
  headlineAccent: "technology",
  // Real, from the current site's body copy.
  body:
    "Genesis is a Gen Z-led full-service agency where strategy, content and technology come together to build iconic brands. From influencer activations and UGC to AI-powered campaigns, we help brands spark real engagement across channels.",
  primaryCta: { label: "Start a project", href: "/#contact" },
  secondaryCta: { label: "See our work", href: "/our-work" },
} as const;

// --- Services ---------------------------------------------------------------

export const services = {
  label: "What we do",
  heading: "Six disciplines,",
  headingAccent: "one team",
  body:
    "Strategy, production and distribution under one roof — so a campaign never loses its thread between the idea and the post.",
  // TODO(copy): confirm this is the right six-way split of the offering.
  items: [
    {
      title: "Influencer Marketing",
      caption: "discovery → delivery",
      body: "Matching brands to the right voices across every niche and platform, then running the campaign end to end.",
    },
    {
      title: "UGC & Creator Content",
      caption: "always-on volume",
      body: "Creator-made content built for the feed, produced at the cadence performance channels actually need.",
    },
    {
      title: "Brand Films & Ads",
      caption: "hero storytelling",
      body: "The big-format work — brand films, ad films and launch stories that set the tone for everything else.",
    },
    {
      title: "AI-Generated Content",
      caption: "scale without the shoot",
      body: "AI-assisted visuals and variants that let one concept ship in fifty forms without fifty production days.",
    },
    {
      title: "Branding & Design",
      caption: "identity systems",
      body: "Identity, art direction and design systems that hold together across every surface a brand touches.",
    },
    {
      title: "Strategy & Performance",
      caption: "the decisions underneath",
      body: "Audience, channel and measurement strategy, so creative choices are made against numbers rather than taste.",
    },
  ],
} as const;

// --- Portfolio / Our Work ---------------------------------------------------

// Real client names and formats, from the "Our Content" library (img-013).
// TODO(legal): confirm each is cleared for public display on the new site.
export const portfolio = {
  label: "Selected work",
  heading: "The library",
  headingAccent: "keeps growing",
  body:
    "Reels, films, ad campaigns and brand stories — the full catalogue lives in Our Work.",
  posters: [
    { id: "kayali", client: "Kayali", title: "Fragrance product reel", category: "Reel", meta: ["2025", "0:45"] },
    { id: "tata-motors", client: "Tata Motors", title: "Brand film", category: "Film", meta: ["2025", "2:10"] },
    { id: "icici", client: "ICICI Bank", title: "Brand story", category: "Brand Story", meta: ["2024"] },
    { id: "miraggio", client: "Miraggio", title: "Lifestyle reel", category: "Reel", meta: ["2025"] },
    { id: "yonex", client: "Yonex", title: "Ad film", category: "Ad Film", meta: ["2024", "1:30"] },
    { id: "third-wave", client: "Third Wave Coffee", title: "Product reel", category: "Reel", meta: ["2025"] },
    { id: "mauritius", client: "Mauritius Tourism", title: "Travel film", category: "Travel Film", meta: ["2024"] },
    { id: "dot-key", client: "Dot & Key", title: "Skincare reel", category: "Reel", meta: ["2025"] },
  ] satisfies Poster[],
} as const;

// --- Case studies -----------------------------------------------------------

export const caseStudies = {
  label: "Case studies",
  heading: "Work that",
  headingAccent: "moved a number",
  body: "A few campaigns where the result was measurable, not just visible.",
  // TODO(data): every figure below is INVENTED and must be replaced with real
  // reported results before this section goes live.
  items: [
    {
      id: "cs-kayali",
      client: "Kayali",
      title: "A fragrance launch that sold out in nine days",
      result: "3.2M organic reach",
      discipline: "Influencer + UGC",
    },
    {
      id: "cs-tata",
      client: "Tata Motors",
      title: "Putting a launch film in front of the right drivers",
      result: "41% lift in recall",
      discipline: "Brand film",
    },
    {
      id: "cs-icici",
      client: "ICICI Bank",
      title: "Making a banking product legible to Gen Z",
      result: "2.7x engagement rate",
      discipline: "Brand story",
    },
    {
      id: "cs-yonex",
      client: "Yonex",
      title: "An ad film built for the second screen",
      result: "18M views in six weeks",
      discipline: "Ad film",
    },
  ],
} as const;

// --- Journey ----------------------------------------------------------------

// TODO(data): placeholder milestones and dates — replace with the real story.
export const journey = {
  label: "Our journey",
  heading: "How Genesis",
  headingAccent: "got here",
  body: "A short history, told in the moments that changed how we work.",
  milestones: [
    { date: "2021", title: "Genesis begins", description: "Founded as a creator-first studio, working with a handful of brands and a much larger handful of creators." },
    { date: "2022", title: "The network scales", description: "The creator roster grows past five figures and campaign work becomes the core of the business." },
    { date: "2023", title: "Production comes in-house", description: "Brand films and ad films join the offering, so strategy and production stop living in different buildings." },
    { date: "2024", title: "AI studio opens", description: "AI-assisted content moves from experiment to a standing capability inside campaigns." },
    { date: "2025", title: "Full-service", description: "Strategy, content, influence and technology operating as one team." },
  ] satisfies Milestone[],
} as const;

// --- AI content -------------------------------------------------------------

export const aiContent = {
  label: "AI studio",
  heading: "Fifty variants,",
  headingAccent: "one shoot",
  body:
    "AI-assisted production lets a single concept ship in every format a channel needs — without booking fifty production days to get there.",
  features: [
    { title: "Concept to output in hours", body: "Ideas become finished visuals inside a working session, not a production schedule." },
    { title: "Every format, one system", body: "One concept, resized and re-cut for each placement without losing the art direction." },
    { title: "Human-directed throughout", body: "AI does the volume. Direction, taste and final approval stay with the team." },
  ],
} as const;

// --- Influencer marketing ---------------------------------------------------

// Real figures and positioning, from Genesis's own artwork (img-012).
// TODO(data): confirm these numbers are still current before launch.
export const influencer = {
  label: "Strategic · Targeted · Impactful",
  heading: "Influencer",
  headingAccent: "campaigns",
  body:
    "From discovery to delivery, we connect brands with the right voices to create content that drives results.",
  databaseStat: {
    value: "1,00,000+",
    label: "Influencer database",
    description: "A curated network of creators across every niche and platform.",
  },
  stats: [
    { value: "500+", label: "Campaigns executed" },
    { value: "200+", label: "Brands partnered" },
    { value: "50M+", label: "Content reach" },
    { value: "20+", label: "Platforms covered" },
  ],
  orbit: [
    { id: "travel", label: "Travel Creator", sublabel: "856K followers" },
    { id: "fitness", label: "Fitness Creator", sublabel: "2.4M followers", accent: "amber" as const },
    { id: "lifestyle", label: "Lifestyle Creator", sublabel: "1.2M followers" },
    { id: "finance", label: "Finance Creator", sublabel: "1.1M followers" },
    { id: "fashion", label: "Fashion Creator", sublabel: "947K followers" },
  ],
} as const;

// --- Branding & design ------------------------------------------------------

export const branding = {
  label: "Branding & design",
  heading: "Identity that survives",
  headingAccent: "contact with the feed",
  body:
    "A brand system is only as good as its worst placement. We design for the sixth-second crop, not just the pitch deck.",
  capabilities: [
    "Visual identity",
    "Art direction",
    "Design systems",
    "Packaging",
    "Campaign toolkits",
    "Motion language",
  ],
} as const;

// --- Clients ----------------------------------------------------------------

// Real client names, from img-013. TODO(legal): confirm display rights.
export const clients = {
  label: "Trusted by",
  rowOne: ["KAYALI", "TATA MOTORS", "ICICI BANK", "MIRAGGIO", "YONEX"],
  rowTwo: ["THIRD WAVE COFFEE", "MAURITIUS TOURISM", "KREO TECH", "DOT & KEY", "GENESIS DRIP"],
} as const;

// --- Testimonials -----------------------------------------------------------

// TODO(copy): every quote, name and role below is INVENTED placeholder text.
// Nothing here may ship until real, attributed testimonials are supplied.
export const testimonials = {
  label: "What clients say",
  heading: "In their",
  headingAccent: "words",
  items: [
    {
      quote: "They moved faster than our internal team could brief. The first cut landed before we'd finished writing the brief for it.",
      name: "TODO — Client name",
      role: "TODO — Role, Company",
    },
    {
      quote: "The creator matching was the part that surprised us. They picked voices we'd have never shortlisted, and those were the ones that worked.",
      name: "TODO — Client name",
      role: "TODO — Role, Company",
    },
    {
      quote: "We came for the reels and stayed for the strategy. They argue with us about the numbers, which is what we actually needed.",
      name: "TODO — Client name",
      role: "TODO — Role, Company",
    },
  ],
} as const;

// --- Journal / blog teaser --------------------------------------------------

// TODO(content): placeholder articles. Real posts arrive as MDX in Phase 4.
export const journal = {
  label: "Journal",
  heading: "Thinking out",
  headingAccent: "loud",
  body: "Notes on creators, content and the technology reshaping both.",
  posts: [
    { slug: "creator-economy-2026", title: "The creator economy is consolidating. Here's what that means for brands.", category: "Industry", readingTime: "6 min read" },
    { slug: "ugc-that-performs", title: "Why most UGC underperforms, and the three fixes that change it", category: "Playbook", readingTime: "8 min read" },
    { slug: "ai-in-production", title: "What AI actually replaced in our production pipeline", category: "Inside Genesis", readingTime: "5 min read" },
  ],
} as const;

// --- Insider teaser ---------------------------------------------------------

export const insider = {
  label: "Genesis Insider",
  heading: "The workspace",
  headingAccent: "behind the work",
  body:
    "Clients, projects, content pipelines and invoicing — the internal operating system the team runs on. Access is invite-only.",
  cta: { label: "Sign in to Insider", href: "/insider" },
} as const;

// --- Footer CTA -------------------------------------------------------------

export const footerCta = {
  heading: "Let's build something",
  headingAccent: "iconic",
  body: "Tell us what you're launching. We'll tell you how we'd approach it.",
  primaryCta: { label: "Start a project", href: "/#contact" },
  // TODO(contact): replace with the real routing address and phone number.
  email: "hello@genesismedia.co",
} as const;
