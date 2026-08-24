"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";

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
  badge?: ReactNode;
};

export function FloatingPapers({
  papers,
  className,
}: {
  papers: FloatingPaper[];
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("grid gap-8 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {papers.map((paper, index) => (
        <motion.div
          key={`${paper.href}-${paper.title}`}
          // Idle drift. Offsetting the delay stops the grid pulsing in unison.
          animate={
            prefersReducedMotion ? undefined : { y: [0, -10, 0] }
          }
          transition={{
            duration: 6 + (index % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
          }}
          className="h-full"
        >
          <PaperCard
            tone={index % 3 === 1 ? "crimson" : "amber"}
            rotate={index % 2 === 0 ? -2 : 1.8}
            className="h-full"
          >
            <Link href={paper.href} className="group flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <span className="micro-label">{paper.eyebrow}</span>
                {paper.badge}
              </div>

              <h3 className="mt-6 text-balance text-h3 font-semibold leading-snug tracking-tight text-bone transition-colors group-hover:text-amber-light">
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
        </motion.div>
      ))}
    </div>
  );
}
