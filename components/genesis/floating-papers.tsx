"use client";

import Link from "next/link";

import { PaperCard } from "./paper-card";
import { cn } from "@/lib/utils";

/**
 * Blog posts as sheets of paper drifting under a light.
 *
 * Spec: "each paper is a blog (floating animation)" and "papers moving like
 * magnetics (for reference motion check igloo.inc)". Each sheet idles on its
 * own slow loop and straightens toward the cursor via the shared magnetic
 * behaviour in <PaperCard />.
 *
 * Laid out on a normal responsive grid rather than absolute coordinates — a
 * scattered absolute layout looks right at one viewport and breaks at every
 * other one, and papers that overlap are papers you cannot click.
 */

export type FloatingPaper = {
  href: string;
  eyebrow: string;
  title: string;
  description?: string;
  footnote?: string;
  /*
    A LABEL, not an element.

    This used to be a ReactNode, and the caller built the chip's JSX inside
    its own posts.map(). React's dev-mode key validation walks elements
    created inside an iteration and flags them as an unkeyed list — even
    though these were passed as a prop and rendered singly, never as an
    array. The warning named FloatingPapers and blamed a child "passed from
    BlogTeaser", which is exactly what it was.

    Keeping JSX out of the data mapping removes the whole class of problem:
    the caller says what the label is, this component decides how a label
    looks.
  */
  badge?: string;
};

export function FloatingPapers({
  papers,
  className,
}: {
  papers: FloatingPaper[];
  className?: string;
}) {

  return (
    <div className={cn("grid gap-8 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {papers.map((paper, index) => (
        <div key={`${paper.href}-${paper.title}`} className="h-full">
          <PaperCard
            tone="brand"
            rotate={index % 2 === 0 ? -2 : 1.8}
            className="h-full"
          >
            <Link href={paper.href} className="group flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <span className="micro-label">{paper.eyebrow}</span>
                {paper.badge && (
                  <span className="rounded-full border border-brand-ink/40 px-2 py-0.5 text-micro text-brand-ink">
                    {paper.badge}
                  </span>
                )}
              </div>

              <h3 className="mt-6 text-balance text-h3 font-normal leading-snug tracking-tight text-bone transition-colors group-hover:text-brand-ink">
                {paper.title}
              </h3>

              {paper.description && (
                <p className="mt-3 flex-1 text-small leading-relaxed text-ash">
                  {paper.description}
                </p>
              )}

              {paper.footnote && (
                <p className="mt-6 text-small text-faint">{paper.footnote}</p>
              )}
            </Link>
          </PaperCard>
        </div>
      ))}
    </div>
  );
}
