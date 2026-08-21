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

/**
 * Motion has to have a REASON, and it did not.
 *
 * The page ran 51 reveals across 16 sections, every one of them on the default
 * 0.6s duration, and 14 of the 16 on the default `up` direction. A poster
 * rail, a wall of lit documents, a timeline and a footer all arrived
 * identically. That is the definition of generic scroll motion: one
 * fade-and-slide applied everywhere regardless of what is moving or why.
 *
 * Three presets, chosen by what the thing IS:
 *
 *   editorial  headings and copy. Quick, small rise, gets out of the way.
 *   card       one of a group. Slightly longer, pairs with a stagger.
 *   scene      the big built pieces — document wall, vortex, constellation.
 *              NO TRANSLATION AT ALL. Something that large moving 24px reads
 *              as a hitch, not as an entrance; it resolves in place instead.
 */
const VARIANTS = {
  editorial: { duration: 0.5, distance: 16 },
  card: { duration: 0.65, distance: 20 },
  scene: { duration: 1.1, distance: 0 },
} as const;

export type RevealVariant = keyof typeof VARIANTS;

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration,
  variant = "editorial",
  className,
  as = "div",
  id,
}: {
  children: ReactNode;
  direction?: keyof typeof DIRECTION_OFFSET;
  delay?: number;
  /** Overrides the variant's duration. Prefer picking a variant. */
  duration?: number;
  variant?: RevealVariant;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
  /** Lets a revealed block double as an anchor target. */
  id?: string;
}) {
  const preset = VARIANTS[variant];
  const base = DIRECTION_OFFSET[direction];
  // Scale the direction offset by the variant's distance, so `scene` resolves
  // in place whichever direction it was given.
  const scale = preset.distance / 24;
  const offset = { x: base.x * scale, y: base.y * scale };
  const resolvedDuration = duration ?? preset.duration;
  const Component = motion[as];

  return (
    <Component
      id={id}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: resolvedDuration, delay, ease: EASE }}
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
  stagger = 0.06,
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
        hidden: { opacity: 0, y: VARIANTS.card.distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: VARIANTS.card.duration, ease: EASE },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
