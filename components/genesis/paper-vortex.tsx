"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { useMemo, type PointerEvent } from "react";

import { LitRoom } from "./lit-room";
import { cn } from "@/lib/utils";

/**
 * Papers caught in a vortex under a single overhead light — built to p06_0.
 *
 * TWO THINGS THIS GETS RIGHT THAT AN EARLIER VERSION DID NOT:
 *
 * 1. It is a CLOUD, not a ring. The reference has papers at many different
 *    radii, overlapping heavily, layered in front of and behind the centre —
 *    not a single-file ellipse with an empty middle. Each sheet therefore
 *    gets its own radius multiplier as well as its own angle.
 *
 * 2. It stays smooth. Depth is expressed by *baking darkness into each
 *    sheet's own gradient*, never with `filter: brightness()`, and blur is
 *    limited to the handful of genuine foreground sheets. CSS filters force
 *    repaints; thirty-two animated ones drop frames on any machine. Every
 *    per-frame value here is a transform, which the compositor handles.
 *
 * Every sheet is a blog. With fewer posts than sheets, posts repeat around
 * the cloud in a seeded shuffle so the same one never lands adjacent.
 */

export type VortexPost = {
  slug: string;
  title: string;
  category: string;
};

/** Reach of the cursor's influence, in stage percentage points. */
const FIELD_RADIUS = 30;
/** Push at the centre of the field. */
const FIELD_STRENGTH = 16;

type Placed = {
  left: number;
  top: number;
  scale: number;
  /** 1 at the back, 0 at the very front. */
  depth: number;
  rotate: number;
  /** Idle drift, seconds, staggered per sheet. */
  driftDuration: number;
  driftDelay: number;
  blur: number;
  /** Paper colours, pre-darkened for depth so no filter is needed. */
  top_color: string;
  bottom_color: string;
  textColor: string;
  interactive: boolean;
  post: VortexPost;
};

/** Deterministic pseudo-random so server and client markup agree. */
function seeded(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

/** Mixes a channel toward black by `amount` (0 = untouched, 1 = black). */
function shade(channel: number, amount: number) {
  return Math.round(channel * (1 - amount));
}

/**
 * Builds the scene in three explicit tiers.
 *
 * An earlier version drove size and brightness from one continuous depth
 * curve, which produced an even gradient of paper — a pile, not a vortex.
 * The reference is clearly tiered:
 *
 *   RING        the torus itself. Bright cream sheets in the light, moderate
 *               and fairly even in size, forming a hole around the figure.
 *   INNER       fewer, smaller, dimmer sheets nested inside the ring, sitting
 *               deeper in the room behind the figure.
 *   SILHOUETTE  a handful of very large near-black sheets along the bottom
 *               edge, backlit and out of focus, cropped by the frame.
 *
 * Tiers make each population independently tunable, which one curve does not.
 */
function buildCloud(posts: VortexPost[], sheetCount: number): Placed[] {
  if (posts.length === 0) return [];

  const placed: Placed[] = [];
  const silhouettes = 8;
  const inner = Math.round((sheetCount - silhouettes) * 0.32);
  const ring = sheetCount - silhouettes - inner;

  const push = (
    i: number,
    angle: number,
    rx: number,
    ry: number,
    scale: number,
    dark: number,
    blur: number,
    interactive: boolean,
    zBias: number,
  ) => {
    const postIndex =
      (i + Math.floor(seeded(i, 5) * posts.length)) % posts.length;

    placed.push({
      left: 50 + rx * Math.cos(angle),
      top: 47 + ry * Math.sin(angle),
      scale: Number(scale.toFixed(3)),
      depth: Number(zBias.toFixed(3)),
      rotate: Number(((seeded(i, 3) - 0.5) * 70).toFixed(2)),
      driftDuration: Number((7 + seeded(i, 6) * 6).toFixed(2)),
      driftDelay: Number((seeded(i, 7) * 6).toFixed(2)),
      blur,
      top_color: `rgb(${shade(247, dark)} ${shade(238, dark)} ${shade(214, dark)})`,
      bottom_color: `rgb(${shade(214, dark)} ${shade(198, dark)} ${shade(158, dark)})`,
      textColor: `rgb(${shade(51, dark * 0.45)} ${shade(41, dark * 0.45)} ${shade(26, dark * 0.45)})`,
      interactive,
      post: posts[postIndex],
    });
  };

  // --- RING: the torus, evenly walked so it closes all the way round -------
  for (let i = 0; i < ring; i += 1) {
    const angle = (i / ring) * Math.PI * 2 + seeded(i, 8) * 0.24;
    const spread = 0.9 + seeded(i, 1) * 0.28;
    // Slight extra brightness where the light actually falls.
    const lit = 0.05 + Math.abs(Math.cos(angle)) * 0.16 + seeded(i, 9) * 0.1;
    push(
      i,
      angle,
      35 * spread,
      31 * spread,
      0.62 + seeded(i, 2) * 0.42,
      lit,
      0,
      true,
      0.42,
    );
  }

  // --- INNER: deeper, smaller, dimmer -------------------------------------
  for (let i = 0; i < inner; i += 1) {
    const index = ring + i;
    const angle = (i / inner) * Math.PI * 2 + 1.1;
    const spread = 0.42 + seeded(index, 1) * 0.3;
    push(
      index,
      angle,
      33 * spread,
      29 * spread,
      0.4 + seeded(index, 2) * 0.22,
      0.42 + seeded(index, 9) * 0.24,
      0,
      false,
      0.72,
    );
  }

  // --- SILHOUETTE: big black sheets across the bottom edge -----------------
  for (let i = 0; i < silhouettes; i += 1) {
    const index = ring + inner + i;
    // Spread across the lower arc only, where the reference places them.
    const angle = Math.PI * (0.12 + (i / (silhouettes - 1)) * 0.76);
    const spread = 1.24 + seeded(index, 1) * 0.3;
    push(
      index,
      angle,
      38 * spread,
      33 * spread,
      1.7 + seeded(index, 2) * 0.9,
      0.94,
      7 + seeded(index, 4) * 7,
      false,
      0.04,
    );
  }

  // Far sheets paint first so nearer ones overlap them.
  return placed.sort((a, b) => b.depth - a.depth);
}

export function PaperVortex({
  posts,
  sheets: sheetCount = 64,
  children,
  className,
}: {
  posts: VortexPost[];
  sheets?: number;
  children?: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const sheets = useMemo(() => buildCloud(posts, sheetCount), [posts, sheetCount]);

  // Cursor position in stage percentage units, parked off-stage until entry.
  const pointerX = useMotionValue(-999);
  const pointerY = useMotionValue(-999);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
  };

  if (sheets.length === 0) return null;

  return (
    <div className={cn("relative isolate w-full overflow-hidden py-10", className)}>
      {/* The interior the whole scene stands in. */}
      <LitRoom />

      {/*
        The stage IS the container, not a box absolutely positioned inside
        one. Nesting an absolute stage inside a min-height section left the
        cloud floating in the top half with dead space beneath it; making the
        square itself the layout element centres it by construction.
      */}
      <div
        data-vortex-stage
        onPointerMove={handlePointerMove}
        onPointerLeave={() => {
          pointerX.set(-999);
          pointerY.set(-999);
        }}
        className="relative mx-auto w-full max-w-[46rem]"
        style={{ aspectRatio: "1 / 1" }}
      >
        {children && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-6 text-center">
            <div className="pointer-events-auto">{children}</div>
          </div>
        )}

        {sheets.map((sheet, index) => (
          <Sheet
            key={`${sheet.post.slug}-${index}`}
            sheet={sheet}
            pointerX={pointerX}
            pointerY={pointerY}
            reduced={Boolean(prefersReducedMotion)}
          />
        ))}
      </div>
    </div>
  );
}

function Sheet({
  sheet,
  pointerX,
  pointerY,
  reduced,
}: {
  sheet: Placed;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  reduced: boolean;
}) {
  const { post, depth, interactive } = sheet;

  /**
   * Magnetic displacement, measured in the same percentage units the sheet is
   * positioned in so the field behaves identically at any stage size. Both
   * axes are derived inline: calling a hook from a shared helper breaks the
   * rules of hooks even when call order is stable.
   */
  const rawX = useTransform<number, number>([pointerX, pointerY], ([px, py]) => {
    const dx = sheet.left - px;
    const dy = sheet.top - py;
    const distance = Math.hypot(dx, dy);
    if (distance > FIELD_RADIUS || distance === 0) return 0;
    const force = (1 - distance / FIELD_RADIUS) * FIELD_STRENGTH * (1.3 - depth);
    return Number(((dx / distance) * force).toFixed(2));
  });

  const rawY = useTransform<number, number>([pointerX, pointerY], ([px, py]) => {
    const dx = sheet.left - px;
    const dy = sheet.top - py;
    const distance = Math.hypot(dx, dy);
    if (distance > FIELD_RADIUS || distance === 0) return 0;
    const force = (1 - distance / FIELD_RADIUS) * FIELD_STRENGTH * (1.3 - depth);
    return Number(((dy / distance) * force).toFixed(2));
  });

  const spring = { stiffness: 130, damping: 17, mass: 0.5 };
  const offsetX = useSpring(rawX, spring);
  const offsetY = useSpring(rawY, spring);

  const paper = (
    <div
      className="relative h-20 w-14 rounded-[2px] sm:h-24 sm:w-16"
      style={{
        background: `linear-gradient(158deg, ${sheet.top_color} 0%, ${sheet.bottom_color} 100%)`,
        boxShadow: "0 14px 30px -16px rgb(0 0 0 / 0.85)",
        // Blur is confined to the few genuine foreground sheets.
        filter: sheet.blur ? `blur(${sheet.blur}px)` : undefined,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-2 opacity-25"
        style={{
          backgroundImage: `repeating-linear-gradient(180deg, ${sheet.textColor} 0px, ${sheet.textColor} 1px, transparent 1px, transparent 6px)`,
        }}
      />

      {interactive && (
        <div className="absolute inset-0 flex flex-col justify-between p-2">
          <span
            className="text-[6px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: sheet.textColor }}
          >
            {post.category}
          </span>
          <span
            className="line-clamp-4 text-[7.5px] font-semibold leading-tight"
            style={{ color: sheet.textColor }}
          >
            {post.title}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${sheet.left}%`,
        top: `${sheet.top}%`,
        x: offsetX,
        y: offsetY,
        zIndex: Math.round((1 - depth) * 30),
        translateX: "-50%",
        translateY: "-50%",
        willChange: "transform",
      }}
    >
      {/*
        Idle drift and the resting transform share one element. An earlier
        version nested three animated wrappers per sheet, which tripled the
        work the compositor had to do every frame for no visual gain.
      */}
      <motion.div
        style={{ willChange: "transform" }}
        initial={{ rotate: sheet.rotate, scale: sheet.scale, y: 0 }}
        animate={
          reduced
            ? { rotate: sheet.rotate, scale: sheet.scale, y: 0 }
            : { rotate: sheet.rotate, scale: sheet.scale, y: [0, -10, 0] }
        }
        transition={{
          y: {
            duration: sheet.driftDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: sheet.driftDelay,
          },
          rotate: { duration: 0 },
          scale: { type: "spring", stiffness: 260, damping: 22 },
        }}
        whileHover={interactive ? { scale: sheet.scale * 1.3 } : undefined}
      >
        {interactive ? (
          <Link
            href={`/blog/${post.slug}`}
            aria-label={post.title}
            className="block rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
          >
            {paper}
          </Link>
        ) : (
          <div aria-hidden>{paper}</div>
        )}
      </motion.div>
    </motion.div>
  );
}
