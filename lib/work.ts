import { isPending } from "./home-content";

/**
 * THE WORK CATALOGUE — one list, read by everything.
 *
 * Before this there were two: four clients in `portfolio.clients` driving the
 * homepage rail, and ten pieces in `ourWork.items` driving the library at
 * /our-work. They shared no shape, no ids and no vertical, so the homepage
 * and the portfolio were showing different work with no way to move between
 * them, and nothing had a URL.
 *
 * WORK vs PORTFOLIO, the way the brief settles it: "Work" is the homepage
 * section showing the strongest pieces — that is `featured` below. "Portfolio"
 * is the complete library at /our-work. Same data, two views.
 *
 * EVERY PIECE HAS A SLUG, and that is the point of the rewrite. A project can
 * be opened as a modal while browsing and still live at /work/<slug> — a real
 * page that can be shared into a WhatsApp thread, pasted into a proposal and
 * indexed by Google.
 *
 * THE NARRATIVE FIELDS ARE EMPTY ON PURPOSE. Objective, ask, approach,
 * execution and results are Genesis's to write; they are typed and wired and
 * the components omit whatever is still pending, so filling one in makes it
 * appear with no code change. What is NOT done is inventing them — these are
 * real clients, and a fabricated result attributed to Mahindra is a claim
 * about Mahindra.
 */

/** The four verticals, used for filtering and for the modal's byline. */
export type Vertical = "Influence" | "Studios" | "AI Labs" | "Brand & Design";

export type WorkResult = { label: string; value: string };

export type WorkItem = {
  /** URL segment. Permanent — changing it breaks every shared link. */
  slug: string;
  client: string;
  title: string;
  vertical: Vertical;
  /** Format tag, used by the filter row alongside the verticals. */
  format: string;
  /** Still. Every piece has one; the clip is the upgrade. */
  art?: string;
  /** Muted loop played on hover. TODO(assets): the real reels. */
  clip?: string;
  poster?: string;
  /** Shown in the homepage Work section. */
  featured?: boolean;

  // --- The mini case study, per the brief -----------------------------------
  objective?: string;
  ask?: string;
  approach?: string;
  whatWeDid?: string[];
  execution?: string;
  results?: WorkResult[];
  /** Set once a full case study page exists for this piece. */
  caseStudyHref?: string;
};

/**
 * VERTICALS ARE INFERRED FROM THE FORMAT, not invented. Reels, films, ads and
 * event coverage are production, so they sit under Studios; the campaign work
 * for the finance clients is creator-led and sits under Influence. Anything
 * that cannot be inferred is left for Genesis to assign rather than guessed.
 *
 * The distribution is lopsided — ten Studios pieces, four Influence, none for
 * AI Labs or Brand & Design — because that is the artwork that exists. The
 * filter row hides tags with nothing behind them rather than presenting empty
 * categories.
 */
export const work: WorkItem[] = [
  {
    slug: "kayali-product-reel",
    client: "Kayali",
    title: "Product Reel",
    vertical: "Studios",
    format: "Reels",
    art: "/work/kayali.webp",
    featured: true,
  },
  {
    slug: "tata-motors-brand-film",
    client: "Tata Motors",
    title: "Brand Film",
    vertical: "Studios",
    format: "Films",
    art: "/work/tata-motors.webp",
    featured: true,
  },
  {
    slug: "icici-bank-brand-story",
    client: "ICICI Bank",
    title: "Brand Story",
    vertical: "Studios",
    format: "Films",
    art: "/work/icici-bank.webp",
    featured: true,
  },
  {
    slug: "miraggio-lifestyle-reel",
    client: "Miraggio",
    title: "Lifestyle Reel",
    vertical: "Studios",
    format: "Reels",
    art: "/work/miraggio.webp",
    featured: true,
  },
  {
    slug: "yonex-ad-film",
    client: "Yonex",
    title: "Ad Film",
    vertical: "Studios",
    format: "Ads",
    art: "/work/yonex.webp",
    featured: true,
  },
  {
    slug: "third-wave-coffee-product-reel",
    client: "Third Wave Coffee",
    title: "Product Reel",
    vertical: "Studios",
    format: "Reels",
    art: "/work/third-wave-coffee.webp",
    featured: true,
  },
  {
    slug: "mauritius-tourism-travel-film",
    client: "Mauritius Tourism",
    title: "Travel Film",
    vertical: "Studios",
    format: "Films",
    art: "/work/mauritius-tourism.webp",
  },
  {
    slug: "kreo-tech-product-film",
    client: "Kreo Tech",
    title: "Product Film",
    vertical: "Studios",
    format: "Films",
    art: "/work/kreo-tech.webp",
  },
  {
    slug: "dot-and-key-skincare-reel",
    client: "Dot & Key",
    title: "Skincare Reel",
    vertical: "Studios",
    format: "Reels",
    art: "/work/dot-and-key.webp",
  },
  {
    slug: "genesis-drip-event-coverage",
    client: "Genesis Drip",
    title: "Event Coverage",
    vertical: "Studios",
    format: "Events",
    art: "/work/genesis-drip.webp",
  },

  /*
   * The finance work. Real relationships, named in the brief, with no artwork
   * yet — the grid gives these a typographic tile rather than a grey box, so
   * they read as work awaiting a still rather than as broken images.
   * TODO(assets): key stills or reels for the four below.
   */
  {
    slug: "mahindra-finance-influencer-campaign",
    client: "Mahindra Finance",
    title: "Influencer & Content Campaign",
    vertical: "Influence",
    format: "Campaigns",
    featured: true,
  },
  {
    slug: "aditya-birla-capital-campaign",
    client: "Aditya Birla Capital",
    title: "Content & Campaign Work",
    vertical: "Influence",
    format: "Campaigns",
    featured: true,
  },
  {
    slug: "absli-brand-performance",
    client: "Aditya Birla Sun Life Insurance",
    title: "Brand & Performance Content",
    vertical: "Influence",
    format: "Campaigns",
  },
  {
    slug: "hdfc-content-production",
    client: "HDFC",
    title: "Content Production",
    vertical: "Studios",
    format: "Social",
    featured: true,
  },
];

/** Fast lookup for the project route. */
export function findWork(slug: string): WorkItem | undefined {
  return work.find((item) => item.slug === slug);
}

export const featuredWork = work.filter((item) => item.featured);

/**
 * Filter tags, built from the data rather than hardcoded.
 *
 * The brief lists ten tags. Printing all ten when six of them match nothing
 * gives a visitor six ways to empty the grid, so the row offers verticals
 * first, then formats, and only the ones that actually have work behind them.
 */
export function workFilters(items: WorkItem[]): string[] {
  const verticals: string[] = [];
  const formats: string[] = [];
  for (const item of items) {
    if (!verticals.includes(item.vertical)) verticals.push(item.vertical);
    if (!formats.includes(item.format)) formats.push(item.format);
  }
  return ["All", ...verticals, ...formats];
}

export function matchesFilter(item: WorkItem, filter: string): boolean {
  return filter === "All" || item.vertical === filter || item.format === filter;
}

/** True when a piece has enough written to be worth opening a case study for. */
export function hasStory(item: WorkItem): boolean {
  return Boolean(
    !isPending(item.objective) ||
      !isPending(item.ask) ||
      !isPending(item.approach) ||
      !isPending(item.execution) ||
      (item.whatWeDid && item.whatWeDid.length > 0) ||
      (item.results && item.results.length > 0),
  );
}
