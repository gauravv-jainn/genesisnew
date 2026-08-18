import type { Milestone } from "@/components/genesis/animated-timeline";

/**
 * All homepage copy in one place.
 *
 * SOURCE OF TRUTH: "Genesis Website Content.pdf" (Layout(Gaurav): FINAL).
 * Names, clients, services and section order below come from that document.
 * Anything still invented is marked TODO and must not ship.
 *
 * The document also specifies behaviour, recorded here next to the content it
 * applies to so it does not get lost:
 *   - Services → Portfolio: "the camera turns 180°"
 *   - Client logos + testimonials: "movable like Apple Watch apps"
 *   - Blogs: "each paper is a blog … papers moving like magnetics" (igloo.inc)
 *   - Overall background: "gradient + noise"
 *   - Footer: "liquid glass"
 */

// --- Hero -------------------------------------------------------------------

export const hero = {
  eyebrow: "Content · Influencers · AI",
  // Verbatim from the spec, Section 1.
  headlineLead: "Empowering brands that want to win at content, influencer activations &",
  headlineAccent: "AI",
  // The spec asks for "a good hook" and keeps the form to last. Expertise line
  // is drawn from Section 1's note on where the expertise lies.
  body:
    "Quality production and edits, creative direction, strategy and scripting — the parts that decide whether content performs. Genesis builds all of it in-house.",
  primaryCta: { label: "Start a project", href: "/#contact" },
  secondaryCta: { label: "See our work", href: "/our-work" },
} as const;

// --- Services (Section 2) ---------------------------------------------------

// The spec replaces the old services section with exactly these five, and asks
// that the AI tooling be visible in the framing.
export const services = {
  label: "What we do",
  heading: "Five disciplines,",
  headingAccent: "one team",
  body:
    "Strategy, production and distribution under one roof — with advanced AI tooling running through all of it.",
  items: [
    {
      title: "Content Production",
      caption: "quality production & edits",
      body: "Creative direction, strategy, scripting and post — the full pipeline, produced to a standard that holds up on any feed.",
    },
    {
      title: "AI Content",
      caption: "avatars, image & video generation",
      body: "AI avatars, image and video generation, and the tooling that compresses a content workflow from weeks into days.",
    },
    {
      title: "Influencer Marketing",
      caption: "UGC & celebrity collaborations",
      body: "Creator and celebrity activations across every genre, from a database of over a lakh creators.",
    },
    {
      title: "Branding & Design",
      caption: "guidelines, design & motion",
      body: "Identity systems, brand guidelines, motion design and curated content production.",
    },
    {
      title: "Apps & Games",
      caption: "product & interactive",
      body: "Interactive products and games — where a campaign needs to be something people use, not just something they watch.",
    },
  ],
} as const;

// --- Portfolio (Section 3) --------------------------------------------------

// Real clients, named in the spec. TODO(assets): real thumbnails/reels needed.
export const portfolio = {
  label: "Selected work",
  heading: "The work behind",
  headingAccent: "the names",
  body: "Content, campaigns and films made for brands that do not get second takes.",
  clients: [
    { id: "aditya-birla-capital", client: "Aditya Birla Capital", title: "Content & campaign work", category: "Campaign" },
    { id: "hdfc", client: "HDFC", title: "Content production", category: "Content" },
    { id: "absli", client: "Aditya Birla Sun Life Insurance", title: "Brand & performance content", category: "Brand" },
    { id: "mahindra-finance", client: "Mahindra Finance", title: "Influencer & content campaign", category: "Campaign" },
  ],
} as const;

// --- Case studies (Section 4) -----------------------------------------------

export const caseStudies = {
  label: "Case studies",
  heading: "Work that",
  headingAccent: "moved a number",
  body: "Campaigns where the outcome was measured, not just delivered.",
  // Clients are real (from the spec). TODO(data): every RESULT figure below is
  // still a placeholder — replace with reported numbers before launch.
  items: [
    { id: "cs-mahindra", client: "Mahindra", title: "TODO — case study headline", result: "TODO — result", discipline: "Content" },
    { id: "cs-abc", client: "Aditya Birla Capital", title: "TODO — case study headline", result: "TODO — result", discipline: "Campaign" },
    { id: "cs-absli", client: "Aditya Birla Sun Life Insurance", title: "TODO — case study headline", result: "TODO — result", discipline: "Brand" },
    { id: "cs-ab", client: "Aditya Birla", title: "TODO — case study headline", result: "TODO — result", discipline: "Content" },
  ],
} as const;

// --- Journey ----------------------------------------------------------------

// The spec marks this "//numbers increasing animation".
// TODO(data): milestones and dates are placeholders — real story needed.
export const journey = {
  label: "Our journey",
  heading: "How Genesis",
  headingAccent: "got here",
  body: "A short history, told in the moments that changed how we work.",
  milestones: [
    { date: "TODO", title: "Genesis begins", description: "TODO(copy): real milestone required." },
    { date: "TODO", title: "The creator network scales", description: "TODO(copy): real milestone required." },
    { date: "TODO", title: "Production comes in-house", description: "TODO(copy): real milestone required." },
    { date: "TODO", title: "AI studio opens", description: "TODO(copy): real milestone required." },
    { date: "TODO", title: "Full-service", description: "TODO(copy): real milestone required." },
  ] satisfies Milestone[],
} as const;

// --- AI content -------------------------------------------------------------

// Spec: "AI tools, Image Generations, AI Avatars, Video Generations, AI videos
// and AI content to speed up your content workflows and engagement."
export const aiContent = {
  label: "AI studio",
  heading: "Speed up the workflow,",
  headingAccent: "not the standard",
  body:
    "AI tools, image generation, video generation and a roster of AI avatars — used to compress content workflows and lift engagement, with direction and final approval staying human.",
  // Named in the spec. TODO(assets): avatar stills/reels required.
  avatars: [
    { id: "adi", name: "Adi" },
    { id: "diya", name: "Diya" },
    { id: "ivaanat", name: "Ivaanat" },
    { id: "shivam", name: "Shivam" },
    { id: "tanvi", name: "Tanvi" },
  ],
  capabilities: ["AI tools", "Image generation", "AI avatars", "Video generation"],
} as const;

// --- Influencer marketing ---------------------------------------------------

export const influencer = {
  label: "Strategic · Targeted · Impactful",
  heading: "Influencer marketing,",
  headingAccent: "UGC & celebrity",
  body:
    "From discovery to delivery, we connect brands with the right voices — creators across every genre, and celebrity collaborations at the top end.",
  databaseStat: {
    value: "1,00,000+",
    label: "Influencer database",
    description: "A curated network of creators across every niche and platform.",
  },
  // TODO(data): the database figure is from the spec; the remaining three are
  // placeholders pending real numbers.
  stats: [
    { value: "1,00,000+", label: "Creator database" },
    { value: "TODO", label: "Campaigns executed" },
    { value: "TODO", label: "Brands partnered" },
    { value: "TODO", label: "Content reach" },
  ],
  // Celebrity collaborations named in the spec.
  // TODO(spelling/legal): the document writes "Vikhrant Messay" and "Ajay
  // Devgan"; confirm correct spellings and that each is cleared for display.
  celebrities: [
    { id: "vikrant", label: "Vikrant Massey", sublabel: "Celebrity collaboration" },
    { id: "ajay", label: "Ajay Devgn", sublabel: "Celebrity collaboration", accent: "amber" as const },
    { id: "akash", label: "Akash", sublabel: "Creator" },
    { id: "rashmi", label: "Rashmi", sublabel: "Creator" },
    { id: "parvi", label: "Parvi", sublabel: "Creator" },
  ],
} as const;

// --- Branding & design ------------------------------------------------------

// Spec: "Tripgate Branding & Guidelines, Abhi App logo, Doja and more".
export const branding = {
  label: "Branding & design",
  heading: "Identity that survives",
  headingAccent: "contact with the feed",
  body:
    "Brand guidelines, design, motion videos and content production — built for the sixth-second crop, not just the pitch deck.",
  work: [
    { title: "Tripgate", caption: "Branding & guidelines" },
    { title: "Abhi App", caption: "Logo & identity" },
    { title: "Doja", caption: "Content & design" },
  ],
  capabilities: [
    "Brand guidelines",
    "Visual identity",
    "Motion design",
    "Content production",
    "Campaign toolkits",
    "Curated content",
  ],
} as const;

// --- Clients (Section 5) ----------------------------------------------------

// Spec: "Same as the existing website ++ @ Ask tanvi" — so this list is the
// confirmed subset. TODO(assets): full logo dump still owed by Tanvi.
export const clients = {
  label: "Clients we've worked with",
  logos: [
    "ADITYA BIRLA CAPITAL",
    "HDFC",
    "ADITYA BIRLA SUN LIFE INSURANCE",
    "MAHINDRA FINANCE",
    "MAHINDRA",
    "INDUSIND NIPPON LIFE INSURANCE",
    "TRIPGATE",
    "ABHI APP",
  ],
} as const;

// --- Testimonials (Section 6) -----------------------------------------------

// Names and companies are REAL, from the spec. The spec also notes "Start
// video testimonial project", so these become video cards later.
// TODO(copy): every QUOTE below is invented placeholder text — real quotes
// must be collected before launch. Names/roles are as given in the document.
export const testimonials = {
  label: "What clients say",
  heading: "In their",
  headingAccent: "words",
  items: [
    { quote: "TODO — real quote required.", name: "Anu Raj", role: "Mahindra" },
    { quote: "TODO — real quote required.", name: "Shreya", role: "Mahindra Finance" },
    { quote: "TODO — real quote required.", name: "Amey Khopte", role: "Aditya Birla Sun Life Insurance" },
    { quote: "TODO — real quote required.", name: "Aditya Rane", role: "IndusInd Nippon Life Insurance" },
    { quote: "TODO — real quote required.", name: "Anandkumar", role: "QuiteBox" },
    { quote: "TODO — real quote required.", name: "Rishabh Wala", role: "Cinematographer" },
    { quote: "TODO — real quote required.", name: "Harsh Jain", role: "TODO — company" },
    { quote: "TODO — real quote required.", name: "Siddhi Sharma", role: "TODO — company" },
    { quote: "TODO — real quote required.", name: "Rashmi Rai", role: "TODO — company" },
    { quote: "TODO — real quote required.", name: "Mayank Batwal", role: "TODO — company" },
    { quote: "TODO — real quote required.", name: "Pooja", role: "TODO — company" },
    { quote: "TODO — real quote required.", name: "Nancy", role: "TODO — company" },
  ],
} as const;

// --- Journal / blog teaser --------------------------------------------------

// Spec: "Write 2 new blogs on AI", "each paper is a blog (floating animation)",
// "papers moving like magnetics (for reference motion check igloo.inc)".
// TODO(content): real posts arrive as MDX in Phase 4.
export const journal = {
  label: "Journal",
  heading: "Thinking out",
  headingAccent: "loud",
  body: "Notes on creators, content and the technology reshaping both.",
  posts: [
    { slug: "ai-content-workflows", title: "TODO — AI blog #1 (spec: write 2 new blogs on AI)", category: "AI", readingTime: "TODO" },
    { slug: "ai-avatars-in-campaigns", title: "TODO — AI blog #2 (spec: write 2 new blogs on AI)", category: "AI", readingTime: "TODO" },
    { slug: "creative-process", title: "TODO — creative process / BTS", category: "Inside Genesis", readingTime: "TODO" },
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
  primaryCta: { label: "Contact us", href: "/#contact" },
  // TODO(contact): confirm the routing address.
  email: "hello@genesismedia.co",
} as const;
