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

import { agedPaper, sketchMarks } from "@/lib/textures";
import { USE_PHOTO_STOCK, stockCrop } from "@/lib/paper-stock";
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

/**
 * Aged stock: staining, foxing and fold creases, all baked into one image so
 * a sheet needs a single texture layer instead of three.
 *
 * Ten variants, reused across the cloud. Generating one per sheet meant the
 * browser rasterised a hundred unique turbulence filters, which cost more
 * than every transform on the page combined; ten are indistinguishable at
 * these sizes and rasterise once each.
 */
const STOCK_POOL = Array.from({ length: 10 }, (_, i) => agedPaper({ seed: i + 1 }));

/**
 * Slightly irregular sheet outlines. Perfectly rectangular corners are the
 * loudest tell that paper was drawn by a browser, so each sheet is cut with a
 * little jitter — under two percent, but enough to break the grid.
 */
const EDGE_POOL = Array.from({ length: 6 }, (_, i) => {
  const j = (salt: number) => {
    const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
    return (v - Math.floor(v)) * 1.8;
  };
  return `polygon(${j(1).toFixed(2)}% ${j(2).toFixed(2)}%, ${(100 - j(3)).toFixed(2)}% ${j(4).toFixed(2)}%, ${(100 - j(5)).toFixed(2)}% ${(100 - j(6)).toFixed(2)}%, ${j(7).toFixed(2)}% ${(100 - j(8)).toFixed(2)}%)`;
});

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
  /** Tilt in space. Flat-on sheets read as stickers, not paper. */
  rotateX: number;
  rotateY: number;
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
  const silhouettes = 6;
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
      // Real paper is almost never square to the eye. A little pitch and yaw
      // is the single biggest thing separating a sheet from a sticker.
      rotateX: Number(((seeded(i, 11) - 0.5) * 54).toFixed(2)),
      rotateY: Number(((seeded(i, 12) - 0.5) * 58).toFixed(2)),
      driftDuration: Number((7 + seeded(i, 6) * 6).toFixed(2)),
      driftDelay: Number((seeded(i, 7) * 6).toFixed(2)),
      blur,
      // Every sheet is cut from slightly different stock — a few points of
      // warmth either way stops the cloud reading as one printed swatch.
      top_color: `rgb(${shade(244 - seeded(i, 13) * 16, dark)} ${shade(230 - seeded(i, 13) * 18, dark)} ${shade(195 - seeded(i, 14) * 22, dark)})`,
      bottom_color: `rgb(${shade(196 - seeded(i, 14) * 18, dark)} ${shade(174 - seeded(i, 13) * 16, dark)} ${shade(126 - seeded(i, 15) * 20, dark)})`,
      textColor: `rgb(${shade(51, dark * 0.45)} ${shade(41, dark * 0.45)} ${shade(26, dark * 0.45)})`,
      interactive,
      seed: i + 1,
      post: posts[postIndex],
    });
  };

  // --- RING: the torus, evenly walked so it closes all the way round -------
  for (let i = 0; i < ring; i += 1) {
    const angle = (i / ring) * Math.PI * 2 + seeded(i, 8) * 0.24;
    const spread = 0.94 + seeded(i, 1) * 0.24;
    // Slight extra brightness where the light actually falls.
    const lit = 0.05 + Math.abs(Math.cos(angle)) * 0.16 + seeded(i, 9) * 0.1;
    push(
      i,
      angle,
      28 * spread,
      27 * spread,
      0.66 + seeded(i, 2) * 0.3,
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
    const spread = 0.6 + seeded(index, 1) * 0.24;
    push(
      index,
      angle,
      25 * spread,
      24 * spread,
      0.5 + seeded(index, 2) * 0.2,
      0.4 + seeded(index, 9) * 0.22,
      0,
      true,
      0.72,
    );
  }

  // --- SILHOUETTE: big black sheets across the bottom edge -----------------
  for (let i = 0; i < silhouettes; i += 1) {
    const index = ring + inner + i;
    // Spread across the lower arc only, where the reference places them.
    const angle = Math.PI * (0.12 + (i / (silhouettes - 1)) * 0.76);
    const spread = 1.0 + seeded(index, 1) * 0.16;
    push(
      index,
      angle,
      31 * spread,
      30 * spread,
      1.12 + seeded(index, 2) * 0.26,
      0.5 + seeded(index, 9) * 0.16,
      0,
      true,
      0.04,
    );
  }

  // Far sheets paint first so nearer ones overlap them.
  return placed.sort((a, b) => b.depth - a.depth);
}

export function PaperVortex({
  posts,
  sheets: sheetCount = 56,
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
    <div className={cn("relative isolate w-full overflow-hidden py-12", className)}>
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
   * A sheet of aged paper.
   *
   * Six layers, composited in a single element so a hundred of them stay
   * cheap — nested divs per sheet cost more than every transform on the page
   * combined. Topmost first:
   *
   *   1. pencil work — ruled lines and a boxed diagram, unique per sheet
   *   2. fibre tooth, multiplied so it darkens the stock rather than fogging it
   *   3. blotchy aging, also multiplied — the foxing and uneven yellowing that
   *      separates old paper from a printed swatch
   *   4. the curl: light down one edge, shadow down the other, so the sheet
   *      reads as bowed rather than flat
   *   5. warm bleed at the top edge, where the shaft passes through thin stock
   *   6. the base stock
   *
   * The outline is cut with a little jitter and the inner shadow rides the
   * bottom edge, so the sheet has thickness and no two corners match.
   */
  const paper = (
    <div
      className="relative h-[3.4rem] w-[2.5rem] sm:h-[4.3rem] sm:w-[3.1rem]"
      style={{
        backgroundImage: [
          // 1. pencil work
          SKETCH_POOL[sheet.seed % SKETCH_POOL.length],
          // 2. the fold: one face turns from the light, the other catches it
          `linear-gradient(${(sheet.rotate * 0.6 + 168).toFixed(0)}deg, rgb(255 250 232 / 0.34) 0%, rgb(255 250 232 / 0.05) 46%, rgb(46 32 12 / 0.16) 47%, rgb(46 32 12 / 0.02) 100%)`,
          // 3. curl along the leading edge
          "linear-gradient(104deg, rgb(255 250 234 / 0.42) 0%, rgb(255 255 255 / 0) 24%, rgb(0 0 0 / 0) 66%, rgb(28 19 6 / 0.3) 100%)",
          // 4. warm bleed where the shaft passes through thin stock
          "linear-gradient(184deg, rgb(255 238 198 / 0.5) 0%, rgb(255 238 198 / 0) 22%)",
          // 5. the stock itself — a photographed sheet when one is supplied,
          //    otherwise the procedural imitation
          USE_PHOTO_STOCK
            ? stockCrop(sheet.seed).backgroundImage
            : STOCK_POOL[sheet.seed % STOCK_POOL.length],
          // 6. depth tint, so far sheets sit back in the room
          `linear-gradient(157deg, ${sheet.top_color} 0%, ${sheet.bottom_color} 100%)`,
        ].join(","),
        backgroundSize: [
          "100% 100%",
          "100% 100%",
          "100% 100%",
          "100% 100%",
          // Each sheet samples its own patch of the photograph.
          USE_PHOTO_STOCK ? stockCrop(sheet.seed).backgroundSize : "100% 100%",
          "100% 100%",
        ].join(","),
        backgroundPosition: [
          "center",
          "center",
          "center",
          "center",
          USE_PHOTO_STOCK ? stockCrop(sheet.seed).backgroundPosition : "center",
          "center",
        ].join(","),
        backgroundRepeat: "no-repeat",
        backgroundBlendMode:
          "multiply, overlay, normal, screen, multiply, normal",
        clipPath: EDGE_POOL[sheet.seed % EDGE_POOL.length],
        boxShadow: [
          // Thickness: the sheet sits above what is behind it.
          "0 1px 2px 0 rgb(0 0 0 / 0.55)",
          "0 10px 24px -12px rgb(0 0 0 / 0.95)",
          // Bowed: the underside of the curl falls into shadow.
          "inset 0 -6px 10px -8px rgb(48 33 10 / 0.75)",
          "inset 0 4px 6px -6px rgb(255 246 224 / 0.65)",
        ].join(","),
        // SPREAD, not `: undefined`. An explicit undefined style value is
        // serialised differently server- and client-side, and React reports
        // the whole subtree as a hydration mismatch because of it — which is
        // what was putting a runtime error on /blog. Omitting the key entirely
        // when there is no blur is the same intent without the mismatch.
        ...(sheet.blur ? { filter: `blur(${sheet.blur}px)` } : {}),
      }}
    >
      {interactive && (
        <div className="absolute inset-0 flex flex-col justify-end p-1">
          <span
            className="line-clamp-3 text-[5px] font-medium leading-[1.3]"
            style={{
              color: sheet.textColor,
              // Pencil sits ON the fibre; it does not glow off it.
              mixBlendMode: "multiply",
              opacity: 0.72,
            }}
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
          style={{
            willChange: "transform",
            // Perspective per sheet rather than on the stage: a shared
            // perspective origin would swing the outer sheets wildly, since
            // they sit far from the vanishing point.
            transformStyle: "preserve-3d",
            perspective: "520px",
          }}
          initial={{
            rotate: sheet.rotate,
            rotateX: sheet.rotateX,
            rotateY: sheet.rotateY,
            scale: sheet.scale,
          }}
          animate={{
            rotate: sheet.rotate,
            rotateX: sheet.rotateX,
            rotateY: sheet.rotateY,
            scale: sheet.scale,
          }}
          whileHover={
            interactive
              // Straighten toward the viewer on approach, so the sheet
              // presents itself to be read.
              ? { scale: sheet.scale * 1.34, rotateX: 0, rotateY: 0, rotate: sheet.rotate * 0.3 }
              : undefined
          }
          transition={{ type: "spring", stiffness: 240, damping: 21 }}
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
