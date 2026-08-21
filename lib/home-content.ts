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

/**
 * True for any field still waiting on a real value.
 *
 * Placeholders are written as "TODO — …" here so they stay greppable, but they
 * must never reach the page. These sections carry REAL client names — Mahindra,
 * Aditya Birla — and printing "TODO — real quote required." beside one reads to
 * a visitor as a claim Genesis is making about that client. Components call
 * this and omit the element rather than rendering the token.
 *
 * Omission is the safe direction: a missing figure is invisible, an invented
 * one is a lie that has to be retracted.
 */
export function isPending(value: string | null | undefined): boolean {
  return !value || value.trimStart().startsWith("TODO");
}

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

/**
 * The hero reel. Spec: "Update this reel video with new content."
 * TODO(assets): supply a short muted loop and its poster frame.
 */
export const heroReel = {
  src: undefined as string | undefined,
  poster: undefined as string | undefined,
  label: "Showreel",
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
  /**
   * The spec marks this section "//numbers increasing animation", so the
   * history is fronted by figures that count up as they arrive.
   * TODO(data): every figure is a placeholder except the creator database,
   * which is confirmed elsewhere in the spec.
   */
  figures: [
    { value: "1,00,000+", label: "Creators in the network" },
    { value: "TODO", label: "Campaigns delivered" },
    { value: "TODO", label: "Brands partnered" },
    { value: "TODO", label: "Years running" },
  ],
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
  /**
   * The stack feeding the studio. Spec says "TOOLS WE USE" but does not name
   * them, so these are the categories rather than vendors.
   * TODO(content): replace with the actual tools Genesis runs on.
   */
  tools: [
    { label: "Image generation", detail: "stills & keyframes" },
    { label: "Video generation", detail: "motion & b-roll" },
    { label: "AI avatars", detail: "presenters" },
    { label: "Voice & dubbing", detail: "multi-language" },
    { label: "Edit & post", detail: "assembly" },
    { label: "Scripting", detail: "concept to board" },
  ],
  destination: "Genesis AI Studio",
} as const;

// --- Creative process (BTS) -------------------------------------------------

/**
 * Spec, twice: "Add creative process (BTS)" and "Add creative process 2 lines
 * or sections". Written as what actually happens rather than a tidy funnel —
 * the unglamorous steps are the ones clients ask about.
 * TODO(assets): the spec wants behind-the-scenes stills and video per step.
 */
export const creativeProcess = {
  label: "Behind the scenes",
  heading: "How the work",
  headingAccent: "actually gets made",
  body:
    "The process below is the one we run. It is written down because briefs go wrong in predictable places, and most of them are early.",
  steps: [
    {
      title: "The brief argument",
      body: "Before anything is made we argue about the brief: who it is for, what should change in their head, and how we will know.",
    },
    {
      title: "Direction, then casting",
      body: "Creative direction comes first and creators are matched to it. The other order is how brands end up shaped by whoever was free.",
    },
    {
      title: "Production",
      body: "Scripting, shoot or generation, edit. AI carries the variants; the hero cut gets human attention start to finish.",
    },
    {
      title: "Publish and read the numbers",
      body: "The metrics were agreed in step one, so this step is arithmetic rather than argument.",
    },
  ],
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
  /**
   * These four are read off Genesis's own mockup (spec page 7), which states
   * them as finished artwork — so they are the client's numbers, not invented
   * ones. They still want confirming against current reporting before launch,
   * because a design comp can lag the business.
   */
  stats: [
    { value: "500+", label: "Campaigns Executed" },
    { value: "200+", label: "Brands Partnered" },
    { value: "50M+", label: "Content Reach" },
    { value: "20+", label: "Platforms Covered" },
  ],
  /**
   * The constellation cards. The mockup labels these by NICHE and follower
   * count — "Travel Creator · 856K Followers" — not by celebrity name, so the
   * named celebrity collaborations below are a separate list and are not what
   * rides the orbits.
   *
   * Portraits are cropped from that same mockup and live in public/creators.
   * INTERIM: they are stills lifted from a design comp, at comp resolution.
   * Replace with real shot photography before launch.
   */
  creators: [
    { id: "lifestyle", label: "Lifestyle Creator", followers: "1.2M Followers", image: "/creators/lifestyle.webp", feature: true },
    { id: "travel", label: "Travel Creator", followers: "856K Followers", image: "/creators/travel.webp" },
    { id: "fitness", label: "Fitness Creator", followers: "2.4M Followers", image: "/creators/fitness.webp" },
    { id: "fashion", label: "Fashion Creator", followers: "947K Followers", image: "/creators/fashion.webp" },
    { id: "finance", label: "Finance Creator", followers: "1.1M Followers", image: "/creators/finance.webp" },
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
  /**
   * Used while no quote has been collected. The names and companies below are
   * real; the quotes are not written yet. A section headed "In their words"
   * containing no words is a promise the page cannot keep — but deleting the
   * section throws away a dozen real client relationships to avoid two
   * unwritten fields. So until the first quote lands the section presents
   * itself as what it can honestly be, and flips back on its own the moment
   * a real quote exists.
   */
  awaiting: {
    label: "Clients & collaborators",
    heading: "The people",
    headingAccent: "we work with",
    body: "Named clients and collaborators from delivered projects. Drag to move through the wall.",
  },
  /**
   * Spec: "Start Video testimonial project." Each entry may carry a `clip`
   * once that footage exists; entries without one render as text cards.
   * TODO(assets): video testimonials pending.
   */
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
