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
/** Only sheets this close to the viewer are blurred. Keep it small. */
const BLUR_DEPTH = 0.1;

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

function buildCloud(posts: VortexPost[], sheetCount: number): Placed[] {
  if (posts.length === 0) return [];

  const placed: Placed[] = [];

  for (let i = 0; i < sheetCount; i += 1) {
    // Golden-angle stepping spreads sheets evenly without banding, then a
    // seeded radius spreads them across depth rather than onto one ellipse.
    //
    // The radius floor keeps a clearing at the centre of the cloud. The
    // reference has one: the figure stands in open space with the papers
    // turning around them. Without it, sheets drift over the heading and
    // bury it.
    const angle = i * 2.39996 + 0.4;
    const radius = 0.66 + seeded(i, 1) * 0.62;

    const rx = 27 * radius;
    const ry = 23 * radius;

    const front = Math.sin(angle);
    // Depth combines where it sits front-to-back with how far out it is, so
    // the cloud has genuine layering instead of one shell.
    const depth = Math.min(
      1,
      Math.max(0, (1 - front) / 2 * 0.68 + (1 - radius / 1.12) * 0.32),
    );

    const postIndex =
      (i + Math.floor(seeded(i, 5) * posts.length)) % posts.length;

    // Near sheets are big; far sheets recede hard.
    const scale = 0.4 + Math.pow(1 - depth, 1.5) * 1.25;

    // Darkness baked into the sheet's own colours — cheaper than a filter and
    // it composites for free.
    const dark = 0.06 + depth * 0.72;
    const isForeground = depth < BLUR_DEPTH;
    const veryDark = isForeground ? 0.86 : dark;

    placed.push({
      left: 50 + rx * Math.cos(angle),
      top: 47 + ry * front,
      scale: Number(scale.toFixed(3)),
      depth: Number(depth.toFixed(3)),
      rotate: Number(((seeded(i, 3) - 0.5) * 68).toFixed(2)),
      driftDuration: Number((7 + seeded(i, 6) * 6).toFixed(2)),
      driftDelay: Number((seeded(i, 7) * 6).toFixed(2)),
      blur: isForeground ? Number((3 + (BLUR_DEPTH - depth) * 40).toFixed(1)) : 0,
      top_color: `rgb(${shade(239, veryDark)} ${shade(230, veryDark)} ${shade(207, veryDark)})`,
      bottom_color: `rgb(${shade(186, veryDark)} ${shade(172, veryDark)} ${shade(136, veryDark)})`,
      textColor: `rgb(${shade(51, dark * 0.5)} ${shade(41, dark * 0.5)} ${shade(26, dark * 0.5)})`,
      // Only reasonably lit, reasonably large sheets are clickable; tiny dim
      // ones at the back would be a hostile hit target.
      interactive: depth < 0.62 && !isForeground,
      post: posts[postIndex],
    });
  }

  // Far sheets paint first so nearer ones overlap them.
  return placed.sort((a, b) => b.depth - a.depth);
}

export function PaperVortex({
  posts,
  sheets: sheetCount = 34,
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
    const stage = event.currentTarget.querySelector("[data-vortex-stage]");
    const bounds = (stage ?? event.currentTarget).getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
  };

  if (sheets.length === 0) return null;

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(-999);
        pointerY.set(-999);
      }}
      className={cn(
        "relative isolate w-full overflow-hidden",
        "min-h-[40rem] sm:min-h-[48rem] lg:min-h-[56rem]",
        className,
      )}
    >
      {/* The shaft of light, visible in the air. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgb(246 232 200 / 0.32) 0%, rgb(240 220 176 / 0.11) 26%, transparent 62%)",
          clipPath: "polygon(43% 0%, 57% 0%, 88% 100%, 12% 100%)",
          filter: "blur(22px)",
        }}
      />

      {/* The pool it casts on the floor. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[8%] mx-auto h-[26%] w-[62%]"
        style={{
          background:
            "radial-gradient(closest-side, rgb(246 232 200 / 0.15) 0%, transparent 100%)",
          filter: "blur(30px)",
        }}
      />

      {/*
        Fixed-aspect stage: percentage offsets against a full-bleed container
        stretch the cloud flat on a wide monitor.
      */}
      <div
        data-vortex-stage
        className="absolute inset-0 mx-auto aspect-[4/3] h-full max-h-full w-auto min-w-[38rem]"
      >
        {children && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-6 text-center">
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
      className="relative h-28 w-20 rounded-[2px] sm:h-32 sm:w-24"
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
