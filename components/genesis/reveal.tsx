"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The single scroll-reveal primitive for the whole site.
 *
 * Phase 2 uses only fade + slide — the shared-element morphs and the
 * scroll-scrubbed camera pan belong to the Phase 3 motion pass. Every section
 * composes this rather than hand-rolling `whileInView`, so timing and easing
 * stay identical everywhere and there is one place to tune them.
 *
 * `motion` respects `prefers-reduced-motion` for transforms automatically when
 * the reduced-motion media query is set, and the global CSS reset in
 * globals.css collapses durations as a second line of defence.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const DIRECTION_OFFSET = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { y: 0, x: 24 },
  right: { y: 0, x: -24 },
  none: { y: 0, x: 0 },
} as const;

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className,
  as = "div",
}: {
  children: ReactNode;
  direction?: keyof typeof DIRECTION_OFFSET;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
}) {
  const offset = DIRECTION_OFFSET[direction];
  const Component = motion[as];

  return (
    <Component
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
    >
      {children}
    </Component>
  );
}

/**
 * Staggers a list of children. Use for grids and card rows so items arrive in
 * sequence instead of all at once.
 */
export function RevealGroup({
  children,
  stagger = 0.08,
  className,
}: {
  children: ReactNode;
  stagger?: number;
  className?: string;
}) {
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A child of `RevealGroup`. Inherits the parent's stagger timing. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
