
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
import { proof } from "./proof";

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
  heading: "Four divisions,",
  headingAccent: "one system",
  body:
    "Genesis is an AI-native culture and growth studio building the future of influence — human creativity, AI generation, creator marketing and performance thinking in one creative system.",
  /*
   * THE FOUR DIVISIONS, named by the brand guidelines rather than by us.
   *
   * The captions are the subtitles from Genesis's own division lockups, word
   * for word, replacing four descriptions written before those lockups
   * existed. "creator & celebrity marketing" was ours; "Influencer marketing
   * | Celeb | UGC activations" is theirs, and it is the one that will match
   * whatever else the division is printed on.
   *
   * The deck sets these out as Genesis.Influence, Genesis.BrandDesign,
   * Genesis.Studios and Genesis.AILab — four pillars, each on its own page.
   * The site had five services under different names (Content Production, AI
   * Content, Influencer Marketing, Branding & Design, Apps & Games), which
   * were written from the original brief before the guidelines existed.
   *
   * The mapping: Content Production became Studios, AI Content became AILab,
   * Influencer Marketing became Influence, Branding & Design became
   * BrandDesign. "Apps & Games" has no pillar of its own in the deck — the
   * product and interactive work now sits inside Studios, where the deck's
   * own "Technology & Integration" step puts it.
   *
   * The dotted names are set as one word deliberately; that is how the deck
   * writes them, and the dot is the system's own connector.
   */
  items: [
    {
      title: "Genesis.Influence",
      /* The colour this vertical GLOWS when you point at it. One stop out of
         its own ramp — a hover state has to be a single colour, and picking it
         here keeps it beside the ramp it came from. */
      glow: "#f7719e",
      /*
       * THE SHORT NAME, used where the Genesis wordmark is already in the
       * picture. The divisions board sets the four around the mark and drops
       * the prefix off each one, because the centre is saying it — printing
       * "Genesis." four more times around a Genesis logo is a stutter.
       */
      short: "Influence",
      /* Where the Brain sends you. Two verticals have a page of their own;
         the other two anchor to their homepage section until they do. */
      href: "/#influence",
      caption: "Influencer marketing | Celeb | UGC activations",
      /*
       * ONE GRADIENT PER DIVISION, from the deck's "What we do" board, where
       * each name is set in its own warm-to-cool ramp rather than in the
       * brand yellow. The yellow stays the interface accent; these are the
       * divisions' own identity and appear nowhere else.
       *
       * LIFTED to match the board. The first pass sat these in the mid tones
       * — 5.4 to 6.7 against the ground — and the board's names are far more
       * luminous than that, sitting high in value so they glow off the black
       * rather than sinking into it. Every stop is now 7.0 to 14.7.
       *
       * They are light ramps, so they only hold on a dark ground — which is
       * why the section is pinned dark, exactly as the board is.
       */
      ramp: "linear-gradient(100deg, #ff8a4c 0%, #f7719e 46%, #c3a2ff 100%)",
      body: "Creator and celebrity activations across every genre, from a database of over a lakh creators — briefed, matched, run and measured.",
    },
    {
      title: "Genesis.BrandDesign",
      /* The colour this vertical GLOWS when you point at it. One stop out of
         its own ramp — a hover state has to be a single colour, and picking it
         here keeps it beside the ramp it came from. */
      glow: "#e2a6ff",
      short: "Brand & Design",
      href: "/#brand-design",
      caption: "Branding | Design | Positioning | Collaterals",
      ramp: "linear-gradient(100deg, #f0dcff 0%, #f5a3cd 50%, #ffbe8f 100%)",
      body: "Identity systems, brand guidelines, motion design and the rules that keep a brand recognisable everywhere it appears.",
    },
    {
      title: "Genesis.Studios",
      /* The colour this vertical GLOWS when you point at it. One stop out of
         its own ramp — a hover state has to be a single colour, and picking it
         here keeps it beside the ramp it came from. */
      glow: "#ffab52",
      short: "Studios",
      href: "/#studios",
      caption: "Strategy, scripting & content production",
      ramp: "linear-gradient(100deg, #ff9147 0%, #ffb057 58%, #ffd27a 100%)",
      body: "Creative direction, strategy, scripting, production and post — plus the product and interactive work — built to hold up on any feed.",
    },
    {
      title: "Genesis.AILab",
      /* The colour this vertical GLOWS when you point at it. One stop out of
         its own ramp — a hover state has to be a single colour, and picking it
         here keeps it beside the ramp it came from. */
      glow: "#ff8fb8",
      short: "AI Lab",
      href: "/#ai-lab",
      caption: "Avatars | Multilingual content | Games & apps",
      ramp: "linear-gradient(100deg, #ff8fb8 0%, #ffa25c 100%)",
      body: "AI avatars and influencers, image and video generation, digital fashion, and the automation that compresses a content workflow from weeks into days.",
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

// --- Who we are -------------------------------------------------------------

/*
 * STRAIGHT FROM THE BRAND GUIDELINES, and none of it was on the site.
 *
 * The positioning page sets Genesis against the four kinds of agency the
 * market already has; the philosophy page gives three ideas, each with its
 * own line. Both are quoted rather than paraphrased — "AI isn't software. AI
 * is our creative medium." is the deck's sentence and it is better than
 * anything written to replace it.
 *
 * The sectors are the deck's own list, in its own order.
 */
export const whoWeAre = {
  label: "Who we are",
  heading: "An AI-native",
  headingAccent: "creative company",
  body:
    "The market has traditional agencies, social media agencies, influencer agencies and AI agencies. Genesis is a culture and growth studio building the future of influence.",
  /** The four categories the deck positions Genesis against. */
  market: [
    "Traditional agencies",
    "Social media agencies",
    "Influencer agencies",
    "AI agencies",
  ],
  ideas: [
    {
      title: "Culture First",
      line: "We build ideas people want to share.",
    },
    {
      title: "AI First",
      line: "AI isn't software. AI is our creative medium.",
    },
    {
      title: "Execution Wins",
      line: "Ideas matter. Shipping matters more.",
    },
  ],
  sectors: [
    "BFSI",
    "Finance",
    "Fashion",
    "Beauty",
    "Food & Beverage",
    "Health",
    "Lifestyle",
    "Entertainment",
    "Education",
    "Travel",
    "Tech",
    "Real Estate",
  ],
} as const;

// --- Journey ----------------------------------------------------------------

// The spec marks this "//numbers increasing animation".
// TODO(data): milestones and dates are placeholders — real story needed.
export const journey = {
  label: "Our journey",
  heading: "How Genesis",
  headingAccent: "got here",
  body: "From a garage in Panvel to an AI lab in Ghatkopar, told as the route it actually was.",
  /*
   * REAL, AT LAST. Every figure and every milestone below comes from the
   * company's own journey board — the map that traces Panvel to Chembur to
   * Ghatkopar. Everything here previously read "TODO"; five invented
   * milestone titles and three placeholder figures have been replaced with
   * what actually happened, in the board's own words.
   *
   * The creator-database figure was already confirmed elsewhere in the brief
   * and is unchanged.
   */
  // One source of truth — see lib/proof.ts for which of these are contested.
  figures: [
    proof.creatorDatabase,
    proof.events,
    proof.brands,
    proof.campaigns,
  ],
  /*
   * The board is a route, so each stop carries the office it was reached
   * from. 2020 has no office of its own — it is the pivot on the road
   * between Panvel and Chembur, and the board draws it that way.
   */
  milestones: [
    {
      period: "2016 – 2019",
      place: "Panvel",
      lines: ["Started up as an Events Expert in a garage"],
    },
    {
      period: "2020",
      lines: ["Pivoted to an Advertising Agency due to COVID"],
    },
    {
      period: "2021",
      place: "Chembur",
      lines: ["Championed Influencer Marketing"],
    },
    {
      period: "2022 – 24",
      lines: [
        "Created a Digital Wave",
        "Launched IP GenesisDrip",
        "Scaled Influencer Ecosystem",
        "1,500+ Successful Events",
        "Collaborated with 30+ Brands",
        "Developed 50+ Campaigns",
      ],
    },
    {
      period: "2025 – 26",
      place: "Ghatkopar",
      lines: [
        "Evolving with AI",
        "Tech Automations & App Development",
        "Genesis Estate Established",
      ],
    },
  ],
} as const;

// --- AI content -------------------------------------------------------------

// Spec: "AI tools, Image Generations, AI Avatars, Video Generations, AI videos
// and AI content to speed up your content workflows and engagement."
export const aiContent = {
  label: "AI Lab",
  heading: "Speed up the workflow,",
  headingAccent: "not the standard",
  body:
    "AI tools, image generation, video generation and a roster of AI avatars — used to compress content workflows and lift engagement, with direction and final approval staying human.",
  /*
   * THE AVATAR BOARD, from the AI Lab page of the deck.
   *
   * That board is a fanned hand of cards with one held upright in the middle,
   * each carrying the avatar's name and — this is the part the site was
   * missing entirely — WHO THEY ARE. An avatar with a brief behind it ("Adi,
   * Aditya Birla Health Insurance") is a case study; a name floating under a
   * frame is a mood board. The roles below are read off that board.
   *
   * Two of the five names the spec gave us do not appear on it, so they carry
   * no role rather than an invented one. The component omits the line.
   *
   * ORDER IS THE FAN'S ORDER, left to right, and it is deliberate: the centre
   * card is the one held upright and lit, so the roster is arranged to put
   * the brand-work avatar there rather than whoever happened to be listed
   * first.
   */
  avatarsHeading: "AI Avatars &",
  avatarsAccent: "Realism",
  avatarsBody: "AI content that works like magic.",
  /*
    TODO(assets): real avatar stills owed — one portrait per name, 3:4.
    TODO(content): `bio`, `languages` and `useCases` are Genesis's to write.
    Each avatar has a page of its own at /avatars/<slug>; the detail view
    omits whatever is still pending rather than printing a placeholder.
  */
  avatars: [
    { id: "ivaanat", name: "Ivaanat", role: undefined as string | undefined,
      bio: undefined as string | undefined, languages: [] as string[], useCases: [] as string[] },
    { id: "tanvi", name: "Tanvi", role: undefined as string | undefined,
      bio: undefined as string | undefined, languages: [] as string[], useCases: [] as string[] },
    { id: "jesko", name: "Jesko", role: "DJ | Techno artist",
      bio: undefined as string | undefined, languages: [] as string[], useCases: [] as string[] },
    { id: "adi", name: "Adi", role: "Aditya Birla Health Insurance",
      bio: undefined as string | undefined, languages: [] as string[], useCases: [] as string[] },
    { id: "diya", name: "Diya", role: "Aditya Birla Health Insurance",
      bio: undefined as string | undefined, languages: [] as string[], useCases: [] as string[] },
    { id: "bharat", name: "Bharat", role: "Advocate",
      bio: undefined as string | undefined, languages: [] as string[], useCases: [] as string[] },
    { id: "shivam", name: "Shivam", role: "Founder & CEO | Genesis",
      bio: undefined as string | undefined, languages: [] as string[], useCases: [] as string[] },
  ],
  // The deck's own subtitle for the division, verbatim, in place of four
  // categories written before the guidelines existed.
  capabilities: ["Avatars", "Multilingual content", "Games & apps"],
  /**
   * The stack feeding the lab. Spec says "TOOLS WE USE" but does not name
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
  destination: "Genesis.AILab",
} as const;

// --- Genesis Studios --------------------------------------------------------

/**
 * The production vertical, and the one the brief says to SHOW rather than
 * describe: "Show the actual production capability rather than simply
 * describing it."
 *
 * So the section leads with footage. The clips are Genesis's own work,
 * transcoded from the masters — the capability list underneath is the
 * caption, not the argument.
 *
 * THE CLIPS CARRY NO CLIENT NAMES, deliberately. They arrived as 1.mp4 to
 * 32.mp4 with no attribution anywhere in them, and a wall of real footage
 * labelled with guessed brands would be worse than a wall of unlabelled
 * footage. They stay anonymous until Genesis maps them; the work grid is
 * where named work lives.
 */
export const studios = {
  label: "Genesis Studios",
  heading: "Production at",
  headingAccent: "the standard",
  body:
    "Creative direction, scripting, shoot and post — the whole pipeline in-house, so a campaign never loses its thread between the idea and the published cut.",
  /** The brief's list, in its own words. */
  capabilities: [
    "Reels",
    "DVCs",
    "Brand films",
    "Product films",
    "Corporate films",
    "Social content",
    "Podcasts",
    "Photography",
    "Shoots",
    "Motion graphics",
    "Editing",
    "Event content",
    "UGC production",
  ],
  /**
   * Which transcoded previews the wall plays. Sixteen of the thirty-two, in
   * two rows — enough to read as a body of work without putting every poster
   * frame on the homepage at once.
   */
  reel: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 26, 28, 30, 32],
} as const;

// --- Creative process (BTS) -------------------------------------------------

/**
 * Spec, twice: "Add creative process (BTS)" and "Add creative process 2 lines
 * or sections". Written as what actually happens rather than a tidy funnel —
 * the unglamorous steps are the ones clients ask about.
 * TODO(assets): the spec wants behind-the-scenes stills and video per step.
 */
export const creativeProcess = {
  label: "How we work",
  heading: "Our Art",
  headingAccent: "of Doing",
  body: "The process to keep your brand on everyone's eye.",
  /*
   * THE SIX STEPS ARE THE DECK'S, VERBATIM. The guidelines set out "Our Art
   * of Doing" as six named stages, under the line "the process to keep your
   * brand on everyone's eye" — both used here as written.
   *
   * The four steps this replaced were invented for the original build: "The
   * brief argument", "Direction, then casting", "Production", "Publish and
   * read the numbers". They described a production pipeline. The deck's six
   * describe a growth engagement, which is a different and larger claim —
   * it starts at the brand and ends at technology, with content in the
   * middle rather than as the whole of it.
   *
   * `caption` is the one-line gloss the layout shows. Nothing here invents a
   * promise the deck does not make; each is a plain reading of its step.
   */
  steps: [
    {
      title: "Building the Brand",
      caption: "identity, positioning and the rules that hold them",
    },
    {
      title: "Designing the Journey",
      caption: "how someone arrives, and what they meet when they do",
    },
    {
      title: "Creating Attention & Culture",
      caption: "ideas people want to share, not ads people tolerate",
    },
    {
      title: "Content at Scale",
      caption: "production that keeps feeding every channel",
    },
    {
      title: "Drive Growth",
      caption: "performance thinking against numbers agreed up front",
    },
    {
      title: "Technology & Integration",
      caption: "AI tooling and automation wired into the work",
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
    ...proof.creatorDatabase,
    label: "Influencer database",
    description: "A curated network of creators across every niche and platform.",
  },
  /**
   * These four are read off Genesis's own mockup (spec page 7), which states
   * them as finished artwork — so they are the client's numbers, not invented
   * ones. They still want confirming against current reporting before launch,
   * because a design comp can lag the business.
   */
  /*
    These were the mockup's numbers and they disagreed with the journey
    board's by an order of magnitude — 500+ campaigns here against 50+ there,
    200+ brands against 30+. Both were on the same page. They now come from
    lib/proof.ts, which records the conflict rather than picking a side
    silently.
  */
  stats: [proof.campaigns, proof.brands, proof.reach, proof.platforms],
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
  /*
   * THE CONSTELLATION IS A MAP OF CATEGORIES, not a cast list. Genesis briefs
   * creators across every genre, and five dots read as five creators rather
   * than as a network — so the roster covers the niches the database actually
   * spans. Only the five with artwork carry an `image`; the rest fall through
   * to the cycling avatars, which is what the component already does for
   * anything orbiting.
   *
   * TODO(content): real creators and real reach, per the brief's note about
   * replacing generic placeholders. The CATEGORIES are real; the follower
   * counts are illustrative and must be signed off or removed before launch.
   */
  /*
   * EIGHT, NOT TWELVE. Twelve cards overlapping in one orbit read as a pile
   * rather than as a network — the labels collided and half the photographs
   * were behind another card.
   *
   * `name` IS THE LABEL, not the category. Genesis asked for the creator's
   * name on the card; the niche is what the section is already about, so
   * printing it eight times was saying the same thing eight times. The chip
   * renders only when a name exists, so until they arrive the cards are
   * simply photographs — which is also the decluttering.
   *
   * TODO(content): real creator names and reach. The `label` values below
   * are the niches and stay as the accessible description; `name` is empty
   * and must not be invented — these sit next to real photographs.
   */
  creators: [
    { id: "lifestyle", label: "Lifestyle", name: "", followers: "1.2M Followers", image: "/creators/lifestyle.webp", feature: true },
    { id: "travel", label: "Travel", name: "", followers: "856K Followers", image: "/creators/travel.webp" },
    { id: "fitness", label: "Fitness", name: "", followers: "2.4M Followers", image: "/creators/fitness.webp" },
    { id: "fashion", label: "Fashion", name: "", followers: "947K Followers", image: "/creators/fashion.webp" },
    { id: "finance", label: "Finance", name: "", followers: "1.1M Followers", image: "/creators/finance.webp" },
    { id: "beauty", label: "Beauty & skincare", name: "", followers: "1.6M Followers" },
    { id: "comedy", label: "Comedy & entertainment", name: "", followers: "3.1M Followers" },
    { id: "tech", label: "Tech & gadgets", name: "", followers: "610K Followers" },
  ],
  // Celebrity collaborations named in the spec.
  // TODO(spelling/legal): the document writes "Vikhrant Messay" and "Ajay
  // Devgan"; confirm correct spellings and that each is cleared for display.
  celebrities: [
    { id: "vikrant", label: "Vikrant Massey", sublabel: "Celebrity collaboration" },
    { id: "ajay", label: "Ajay Devgn", sublabel: "Celebrity collaboration", accent: "brand" as const },
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
  /*
   * THE CLIENT BOARD, in its own order.
   *
   * Genesis's logo dump runs eighteen brands; seventeen are here. The
   * eighteenth is set in script inside a yellow ticket and I could not read
   * it off the board with enough confidence to print a client's name on a
   * public page — a misspelled client is worse than a missing one, so it
   * waits for the file.
   *
   * The last four are from the original brief rather than the board. They are
   * real relationships and dropping them is the client's call, not ours, so
   * the two lists are unioned rather than replaced.
   *
   * TODO(assets): real logo files, one per entry, into /public/clients. The
   * component swaps <span> for <Image> in a single place when they land.
   */
  logos: [
    "ADITYA BIRLA CAPITAL",
    "HDFC BANK",
    "MAHINDRA FINANCE",
    "IDBI BANK",
    "HT BRUNCH",
    "SOCIAL SAMOSA",
    "LIZOL",
    "THE WORLDGRAD",
    "BUMBLE",
    "DOVE",
    "THE LALIT MUMBAI",
    "HOUSE OF HIRANANDANI",
    "BACARDI",
    "BUDWEISER",
    "VIVO",
    "LN CONSTRUCTION",
    "KAMDHENU REALITIES",
    "ADITYA BIRLA SUN LIFE INSURANCE",
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
