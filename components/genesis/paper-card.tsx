"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { useMagnetic } from "@/lib/use-magnetic";
import { cn } from "@/lib/utils";

/**
 * Magnetic floating paper card.
 *
 * The connective motif of the whole site: sheets of paper caught in a single
 * hard light (img-009 pinned notes, img-011 paper vortex, img-053 angled
 * process cards). Each card sits at a slight rotation, lifts and straightens
 * under the cursor, and carries a directional sheen along its top edge.
 */

export function PaperCard({
  children,
  /** Resting rotation in degrees. Small values read as intentional; large as broken. */
  rotate = -2,
  tone = "amber",
  pinned = false,
  className,
}: {
  children: ReactNode;
  rotate?: number;
  tone?: "amber" | "crimson" | "neutral";
  /** Adds the pushpin from img-009. */
  pinned?: boolean;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { x, y, magneticProps } = useMagnetic(0.08);

  const sheen =
    tone === "crimson"
      ? "rgb(255 45 63 / 0.18)"
      : tone === "neutral"
        ? "rgb(255 255 255 / 0.14)"
        : "rgb(255 176 92 / 0.2)";

  return (
    <motion.div
      {...magneticProps}
      style={{ x, y, rotate: prefersReducedMotion ? 0 : rotate }}
      whileHover={prefersReducedMotion ? undefined : { rotate: 0, y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className={cn(
        "glass glass-lit relative rounded-2xl p-6",
        "shadow-[0_20px_60px_-24px_rgb(0_0_0/0.95)]",
        className,
      )}
    >
      {/* The light falling across the sheet. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(155deg, ${sheen} 0%, transparent 45%)`,
        }}
      />

      {pinned && <Pushpin />}

      <div className="relative">{children}</div>
    </motion.div>
  );
}

/** The lime pushpin from img-009. */
function Pushpin() {
  return (
    <span
      aria-hidden
      className="absolute -top-3 left-1/2 z-10 -translate-x-1/2"
    >
      <span className="block size-4 rounded-full bg-[#c5ff2e] shadow-[0_0_14px_3px_rgb(197_255_46/0.55)]" />
      <span className="mx-auto block h-3 w-px bg-[#8fbf22]" />
    </span>
  );
}

/**
 * A scattered cluster of paper cards (img-053). Rotations alternate so the
 * stack reads as dropped rather than arranged.
 */
export function PaperStack({
  items,
  tone = "amber",
  className,
}: {
  items: { title: string; caption?: string; body?: string }[];
  tone?: "amber" | "crimson" | "neutral";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {items.map((item, index) => (
        <PaperCard
          key={item.title}
          tone={tone}
          // Alternating tilt, damped toward the middle of the row.
          rotate={index % 2 === 0 ? -2.5 : 2}
          className="h-full"
        >
          <h3 className="text-lg font-semibold tracking-tight text-bone">
            {item.title}
          </h3>
          {item.caption && (
            <p className="mt-1 text-xs text-ash/80">{item.caption}</p>
          )}
          {item.body && (
            <p className="mt-3 text-sm leading-relaxed text-ash">{item.body}</p>
          )}
        </PaperCard>
      ))}
    </div>
  );
}
