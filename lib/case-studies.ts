import { isPending } from "./home-content";
import type { Vertical } from "./work";

/**
 * CASE STUDIES — a different question from the portfolio.
 *
 * The brief draws the line and the site did not: Portfolio answers "what has
 * Genesis made?", Case Studies answers "can Genesis solve my business
 * problem?". So this is not a prettier gallery. Every entry is shaped
 * Problem -> Strategy -> Execution -> Result, and a piece of work belongs here
 * only when there is a measured outcome to put at the end of it.
 *
 * IT IS A PAGE, NOT AN ANCHOR. "Case Studies" in the nav pointed at a section
 * on the homepage, which is the one thing the brief says it must not be — a
 * marketing head evaluating Genesis needs a URL they can send to a colleague,
 * and a homepage anchor is not that.
 *
 * THE NARRATIVE IS EMPTY AND THAT IS DELIBERATE. The four clients are real and
 * confirmed. Problem, strategy, execution and every metric are Genesis's to
 * write; each block is rendered and omitted while pending. A "Results" heading
 * over invented figures beside Aditya Birla's name is not a placeholder, it is
 * a claim about Aditya Birla.
 */

export type CaseMetric = { label: string; value: string };

export type CaseStudy = {
  /** URL segment. Permanent — changing it breaks every shared link. */
  slug: string;
  client: string;
  /** The campaign's own name, where it has one. */
  campaign?: string;
  vertical: Vertical;
  discipline: string;
  /** Pulled from the work catalogue where a piece of this campaign exists. */
  hero?: string;
  heroPoster?: string;

  /** The one figure a card leads with. */
  headline?: string;
  problem?: string;
  strategy?: string;
  execution?: string;
  results?: CaseMetric[];
  /** Slugs in lib/work.ts that belong to this campaign. */
  work?: string[];
};

export const caseStudyList: CaseStudy[] = [
  {
    slug: "mahindra-finance-influencer-campaign",
    client: "Mahindra Finance",
    vertical: "Influence",
    discipline: "Influencer + content campaign",
    work: ["mahindra-finance-influencer-campaign"],
  },
  {
    slug: "aditya-birla-capital-content-campaign",
    client: "Aditya Birla Capital",
    vertical: "Influence",
    discipline: "Content & campaign",
    work: ["aditya-birla-capital-campaign"],
  },
  {
    slug: "absli-brand-performance",
    client: "Aditya Birla Sun Life Insurance",
    vertical: "Influence",
    discipline: "Brand & performance content",
    work: ["absli-brand-performance"],
  },
  {
    slug: "hdfc-content-production",
    client: "HDFC",
    vertical: "Studios",
    discipline: "Content production",
    work: ["hdfc-content-production"],
  },
];

export function findCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudyList.find((study) => study.slug === slug);
}

/**
 * True once there is enough written for the page to be worth opening.
 *
 * The index links only to studies that pass this, because the alternative is
 * a card promising "View case study" that opens a client's name and nothing
 * else — which reads as a broken site rather than an unfinished one.
 */
export function isPublished(study: CaseStudy): boolean {
  return Boolean(
    !isPending(study.problem) ||
      !isPending(study.strategy) ||
      !isPending(study.execution) ||
      (study.results && study.results.length > 0),
  );
}

export const caseStudiesPage = {
  label: "Case studies",
  heading: "Work that",
  headingAccent: "moved a number",
  body:
    "Not a gallery — the problem, what we decided to do about it, and what changed. Every study here ends in a number the client agreed to.",
} as const;
