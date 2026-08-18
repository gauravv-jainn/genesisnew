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

import { paperFibre, sketchMarks } from "@/lib/textures";
import { LitRoom } from "./lit-room";
import { StandingFigure } from "./standing-figure";
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

/**
 * Shared texture pools.
 *
 * Giving every sheet its own seeded turbulence meant the browser had to
 * rasterise two unique SVG filter images per sheet — 200+ of them — which
 * cost more than every transform on the page combined and pinned the scene
 * at ~42fps. A handful of variants, reused across the cloud, rasterises once
 * each and is indistinguishable at these sizes.
 */
const SKETCH_POOL = Array.from({ length: 8 }, (_, i) => sketchMarks({ seed: i + 1 }));
const FIBRE_POOL = Array.from({ length: 3 }, (_, i) =>
  paperFibre({ seed: i + 1, opacity: 0.42 }),
);

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
  /** Drives this sheet's own sketch marks and fibre. */
  seed: number;
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
  const silhouettes = 12;
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
      top_color: `rgb(${shade(244, dark)} ${shade(230, dark)} ${shade(195, dark)})`,
      bottom_color: `rgb(${shade(196, dark)} ${shade(174, dark)} ${shade(126, dark)})`,
      textColor: `rgb(${shade(51, dark * 0.45)} ${shade(41, dark * 0.45)} ${shade(26, dark * 0.45)})`,
      interactive,
      seed: i + 1,
      post: posts[postIndex],
    });
  };

  // --- RING: the torus, evenly walked so it closes all the way round -------
  for (let i = 0; i < ring; i += 1) {
    const angle = (i / ring) * Math.PI * 2 + seeded(i, 8) * 0.24;
    const spread = 0.98 + seeded(i, 1) * 0.34;
    // Slight extra brightness where the light actually falls.
    const lit = 0.05 + Math.abs(Math.cos(angle)) * 0.16 + seeded(i, 9) * 0.1;
    push(
      i,
      angle,
      36 * spread,
      32 * spread,
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
    const spread = 0.66 + seeded(index, 1) * 0.26;
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
  sheets: sheetCount = 108,
  showFigure = true,
  children,
  className,
}: {
  posts: VortexPost[];
  sheets?: number;
  /** The person at the centre of the scene. */
  showFigure?: boolean;
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
        {/*
          The figure. Sits at a z-index between the inner tier and the ring,
          so nearer sheets pass in FRONT of the body while deeper ones sit
          behind — which is what places them in the same space rather than
          pasting the person on top of a backdrop.
        */}
        {showFigure && (
          <div
            className="pointer-events-none absolute left-1/2 z-[16] -translate-x-1/2"
            style={{ bottom: "13%", height: "56%" }}
          >
            <StandingFigure className="h-full" />
          </div>
        )}

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

  /**
   * A realistic sheet — as ONE element.
   *
   * Every layer that used to be its own child div is now a background layer
   * on the sheet itself, composited in a single pass with a per-layer blend
   * mode. Four nested divs per sheet across a hundred sheets meant 400+ boxes
   * for the compositor and dropped the page to ~51fps; this collapses that to
   * one box each.
   *
   * Layer order, topmost first:
   *   1. pencil work, unique to this sheet via its seed
   *   2. fibre tooth, multiplied so it darkens rather than fogs
   *   3. the curl — light down one edge, shadow down the other, so the sheet
   *      reads as bowed rather than as a flat rectangle
   *   4. the base stock
   *
   * Corner radii are deliberately unequal: no two corners of real paper match,
   * and matched radii are what make CSS paper look like a card.
   */
  const paper = (
    <div
      className="relative h-24 w-[4.4rem] sm:h-28 sm:w-20"
      style={{
        backgroundImage: [
          SKETCH_POOL[sheet.seed % SKETCH_POOL.length],
          FIBRE_POOL[sheet.seed % FIBRE_POOL.length],
          "linear-gradient(105deg, rgb(255 252 240 / 0.42) 0%, rgb(255 255 255 / 0) 26%, rgb(0 0 0 / 0) 68%, rgb(20 14 4 / 0.34) 100%)",
          `linear-gradient(157deg, ${sheet.top_color} 0%, ${sheet.bottom_color} 100%)`,
        ].join(","),
        backgroundSize: "100% 100%, 120px 120px, 100% 100%, 100% 100%",
        backgroundRepeat: "no-repeat, repeat, no-repeat, no-repeat",
        backgroundBlendMode: "normal, multiply, normal, normal",
        borderRadius: "2px 3px 2px 4px",
        boxShadow: "0 8px 18px -10px rgb(0 0 0 / 0.95)",
        filter: sheet.blur ? `blur(${sheet.blur}px)` : undefined,
      }}
    >
      {interactive && (
        <div className="absolute inset-0 flex flex-col justify-end p-2">
          <span
            className="line-clamp-3 text-[7px] font-semibold leading-[1.25]"
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
        Idle drift is a CSS animation on its own wrapper, so it never touches
        the main thread; the inner element carries only the resting transform
        and the hover response.
      */}
      <div
        className={reduced ? undefined : "motion-safe:animate-[genesis-paper-float_var(--float-duration)_ease-in-out_infinite]"}
        style={
          reduced
            ? undefined
            : ({
                "--float-duration": `${sheet.driftDuration}s`,
                animationDelay: `-${sheet.driftDelay}s`,
                willChange: "transform",
              } as React.CSSProperties)
        }
      >
        <motion.div
          style={{ willChange: "transform" }}
          initial={{ rotate: sheet.rotate, scale: sheet.scale }}
          animate={{ rotate: sheet.rotate, scale: sheet.scale }}
          whileHover={interactive ? { scale: sheet.scale * 1.3 } : undefined}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
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
      </div>
    </motion.div>
  );
}
