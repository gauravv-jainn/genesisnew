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
import { useMemo, useRef, type PointerEvent } from "react";

import { cn } from "@/lib/utils";

/**
 * Papers caught in a vortex under a single overhead light — built to p06_0.
 *
 * EVERY sheet is a blog. When there are fewer posts than sheets the posts
 * repeat around the ring in a shuffled order, so the scene keeps the density
 * of the reference without inventing empty paper.
 *
 * The papers are MAGNETIC: the cursor is a field over the whole vortex, and
 * every sheet within range is pushed away from it, hardest at the centre of
 * the field. That is a field effect rather than per-card hover — which is
 * what makes the whole ring feel alive as the pointer crosses it.
 *
 * What makes it read as a vortex rather than a ring of cards:
 *   - sheets sit on a tilted ELLIPSE, not a circle
 *   - depth drives scale, brightness, blur and stacking together
 *   - the nearest sheets are large, dark and out of focus, exactly as the
 *     foreground silhouettes in the reference
 */

export type VortexPost = {
  slug: string;
  title: string;
  category: string;
};

/** How far the cursor's influence reaches, in container percentage points. */
const FIELD_RADIUS = 26;
/** How hard sheets are pushed at the centre of the field. */
const FIELD_STRENGTH = 13;

type Placed = {
  left: number;
  top: number;
  scale: number;
  /** 1 at the back of the ring, 0 at the very front. */
  depth: number;
  rotate: number;
  skewY: number;
  post: VortexPost;
};

/** Deterministic pseudo-random so server and client markup agree. */
function seeded(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function buildRing(posts: VortexPost[], sheetCount: number): Placed[] {
  if (posts.length === 0) return [];

  const placed: Placed[] = [];

  for (let i = 0; i < sheetCount; i += 1) {
    const angle = (i / sheetCount) * Math.PI * 2 + 0.21;

    // Tilted ellipse — only slightly wider than tall, as the ring is seen
    // from a little above. Positions are percentages of the fixed-aspect
    // stage below, not of the section, so the ring keeps its shape at any
    // viewport width instead of smearing sideways on wide screens.
    const rx = 30 + seeded(i, 1) * 7;
    const ry = 26 + seeded(i, 2) * 6;

    // sin: -1 at the back of the ring, +1 at the front.
    const front = Math.sin(angle);
    const depth = (1 - front) / 2;

    // Posts repeat around the ring, offset by a seeded jump so the same post
    // never lands on two adjacent sheets.
    const postIndex =
      (i + Math.floor(seeded(i, 5) * posts.length)) % posts.length;

    placed.push({
      left: 50 + rx * Math.cos(angle),
      top: 46 + ry * front,
      scale: Number((0.54 + (1 - depth) * 0.9).toFixed(3)),
      depth: Number(depth.toFixed(3)),
      rotate: Number(((seeded(i, 3) - 0.5) * 52).toFixed(2)),
      skewY: Number(((seeded(i, 4) - 0.5) * 24).toFixed(2)),
      post: posts[postIndex],
    });
  }

  // Far sheets paint first so nearer ones overlap them.
  return placed.sort((a, b) => b.depth - a.depth);
}

export function PaperVortex({
  posts,
  sheets: sheetCount = 30,
  children,
  className,
}: {
  posts: VortexPost[];
  /** Total papers in the ring. Posts repeat to fill it. */
  sheets?: number;
  /** Sits at the centre of the ring, where the figure stands. */
  children?: React.ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const sheets = useMemo(() => buildRing(posts, sheetCount), [posts, sheetCount]);

  // Cursor position in container percentage units. Parked far away so no
  // sheet is displaced until the pointer actually enters.
  const pointerX = useMotionValue(-999);
  const pointerY = useMotionValue(-999);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || event.pointerType !== "mouse") return;
    // Measured against the stage so the field lines up with the sheets.
    const stage = event.currentTarget.querySelector("[data-vortex-stage]");
    const bounds = (stage ?? event.currentTarget).getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
  };

  const handlePointerLeave = () => {
    pointerX.set(-999);
    pointerY.set(-999);
  };

  if (sheets.length === 0) return null;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "relative isolate w-full overflow-hidden",
        "min-h-[38rem] sm:min-h-[46rem] lg:min-h-[54rem]",
        className,
      )}
    >
      {/* The shaft of light, visible in the air. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgb(246 232 200 / 0.30) 0%, rgb(240 220 176 / 0.10) 26%, transparent 62%)",
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
            "radial-gradient(closest-side, rgb(246 232 200 / 0.16) 0%, transparent 100%)",
          filter: "blur(30px)",
        }}
      />

      {/*
        The stage. Fixed aspect and capped width so the ellipse stays an
        ellipse: percentage offsets against a full-bleed container would
        stretch the ring flat on a wide monitor.
      */}
      <div data-vortex-stage className="absolute inset-0 mx-auto aspect-[4/3] h-full max-h-full w-auto min-w-[38rem]">
        {children && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-6 text-center">
            <div className="pointer-events-auto">{children}</div>
          </div>
        )}

        {sheets.map((sheet, index) => (
          <Sheet
            key={`${sheet.post.slug}-${index}`}
            sheet={sheet}
            index={index}
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
  index,
  pointerX,
  pointerY,
  reduced,
}: {
  sheet: Placed;
  index: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  reduced: boolean;
}) {
  const { post, depth } = sheet;

  // Nearest sheets fall out of focus and into shadow — the foreground
  // silhouettes in the reference. They are decorative, so not interactive.
  const isForeground = depth < 0.16;
  const blur = isForeground ? 6 + (0.16 - depth) * 26 : depth * 2.2;
  const brightness = isForeground ? 0.1 : 0.44 + (1 - depth) * 0.7;

  /**
   * Magnetic displacement. Distance is measured in the same percentage units
   * the sheet is positioned in, so the field behaves consistently at any
   * container size. Nearer sheets react more, which reinforces the depth.
   *
   * Both axes are computed inline rather than via a shared helper: calling a
   * hook from a helper function breaks the rules of hooks, even when the call
   * order happens to be stable.
   */
  const displacement = (dx: number, dy: number) => {
    const distance = Math.hypot(dx, dy);
    if (distance > FIELD_RADIUS || distance === 0) return 0;
    return (1 - distance / FIELD_RADIUS) * FIELD_STRENGTH * (1.25 - depth);
  };

  const rawX = useTransform<number, number>([pointerX, pointerY], ([px, py]) => {
    const dx = sheet.left - px;
    const dy = sheet.top - py;
    const force = displacement(dx, dy);
    if (force === 0) return 0;
    return Number(((dx / Math.hypot(dx, dy)) * force).toFixed(2));
  });

  const rawY = useTransform<number, number>([pointerX, pointerY], ([px, py]) => {
    const dx = sheet.left - px;
    const dy = sheet.top - py;
    const force = displacement(dx, dy);
    if (force === 0) return 0;
    return Number(((dy / Math.hypot(dx, dy)) * force).toFixed(2));
  });

  const spring = { stiffness: 140, damping: 18, mass: 0.5 };
  const offsetX = useSpring(rawX, spring);
  const offsetY = useSpring(rawY, spring);

  const paper = (
    <div
      className="relative h-28 w-20 rounded-[2px] sm:h-32 sm:w-24"
      style={{
        background:
          "linear-gradient(160deg, #efe6cf 0%, #ddd0b0 46%, #c3b490 100%)",
        filter: `blur(${blur.toFixed(1)}px) brightness(${brightness.toFixed(2)})`,
        boxShadow: "0 18px 40px -18px rgb(0 0 0 / 0.9)",
      }}
    >
      {/* Faint ruled marks, standing in for the sketches on the sheets. */}
      <div
        aria-hidden
        className="absolute inset-2 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgb(60 45 20 / 0.5) 0px, rgb(60 45 20 / 0.5) 1px, transparent 1px, transparent 6px)",
        }}
      />

      {!isForeground && (
        <div className="absolute inset-0 flex flex-col justify-between p-2">
          <span className="text-[6px] font-semibold uppercase tracking-[0.16em] text-[#6b5a33]">
            {post.category}
          </span>
          <span className="line-clamp-4 text-[7.5px] font-semibold leading-tight text-[#33291a]">
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
        zIndex: Math.round((1 - depth) * 20),
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -8, 0] }}
        transition={{
          duration: 7 + (index % 5),
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.22,
        }}
      >
        <motion.div
          style={{
            rotate: sheet.rotate,
            skewY: sheet.skewY,
            scale: sheet.scale,
          }}
          whileHover={isForeground ? undefined : { scale: sheet.scale * 1.24, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {isForeground ? (
            <div aria-hidden>{paper}</div>
          ) : (
            <Link
              href={`/blog/${post.slug}`}
              aria-label={post.title}
              className="block rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
            >
              {paper}
            </Link>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
