"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, type PointerEvent } from "react";

import { cn } from "@/lib/utils";

/**
 * The journal scene.
 *
 * The room, the figure, the light and the settled paper are the reference
 * artwork itself, used as the plate. Six CSS rebuilds got the composition
 * close but never the finish: the reference is a painted illustration with
 * real brush texture, true depth of field and scattered volumetric light, and
 * DOM boxes with gradients do not reproduce that. Compositing over the plate
 * is the only way it looks exactly like the reference, because it is.
 *
 * The interactive sheets are drawn on top, positioned over the ring in the
 * plate and matched to its paper stock, so they read as part of the scene.
 * They carry the post titles, respond magnetically to the cursor, and are the
 * actual links — the spec's "each paper is a blog".
 *
 * ⚠️ RIGHTS: public/scenes/journal-room.png came from the moodboard in
 * "Genesis Website Content.pdf" and appears to be AI-generated reference
 * collected for direction, not Genesis-owned artwork. It must be cleared,
 * re-generated or re-shot before this page goes public. Swapping it is one
 * file — everything else here is independent of which plate is behind it.
 */

export type SceneSheet = {
  slug: string;
  title: string;
  category: string;
};

/** Reach of the cursor's influence, in percentage points of the plate. */
const FIELD_RADIUS = 24;
const FIELD_STRENGTH = 11;

/**
 * Hand-placed positions matching the paper ring in the plate, as percentages
 * of the image box. Measured off the artwork rather than generated, so the
 * interactive sheets land on the ring instead of floating over the walls.
 */
const SLOTS = [
  { left: 30, top: 30, rotate: -16, scale: 0.92 },
  { left: 45, top: 25, rotate: 7, scale: 0.86 },
  { left: 60, top: 29, rotate: 15, scale: 0.9 },
  { left: 70, top: 38, rotate: 24, scale: 0.96 },
  { left: 73, top: 49, rotate: 9, scale: 1.02 },
  { left: 67, top: 59, rotate: -12, scale: 1.06 },
  { left: 54, top: 64, rotate: 18, scale: 1.0 },
  { left: 40, top: 63, rotate: -20, scale: 1.04 },
  { left: 29, top: 55, rotate: 12, scale: 1.0 },
  { left: 25, top: 43, rotate: -8, scale: 0.94 },
  { left: 37, top: 38, rotate: 21, scale: 0.82 },
  { left: 63, top: 44, rotate: -14, scale: 0.84 },
];

export function JournalScene({
  posts,
  className,
}: {
  posts: SceneSheet[];
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  // Posts repeat around the ring when there are fewer than slots, per the
  // spec's "kaafi saare paper pe ek hi blog".
  const sheets = useMemo(
    () =>
      posts.length === 0
        ? []
        : SLOTS.map((slot, index) => ({
            ...slot,
            index,
            post: posts[index % posts.length],
          })),
    [posts],
  );

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
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(-999);
        pointerY.set(-999);
      }}
      className={cn(
        "relative mx-auto w-full max-w-[46rem] select-none",
        className,
      )}
      style={{ aspectRatio: "736 / 1318" }}
    >
      {/* The plate: room, figure, light, settled paper. */}
      <Image
        src="/scenes/journal-room.png"
        alt=""
        fill
        priority
        sizes="(max-width: 768px) 100vw, 46rem"
        className="pointer-events-none select-none object-cover"
      />

      {/* Blends the plate's edges into the page rather than ending on a seam. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(78% 66% at 50% 44%, transparent 0%, transparent 58%, rgb(8 8 10 / 0.55) 84%, rgb(8 8 10 / 0.95) 100%)",
        }}
      />

      {sheets.map((sheet) => (
        <SceneSheetCard
          key={`${sheet.post.slug}-${sheet.index}`}
          sheet={sheet}
          pointerX={pointerX}
          pointerY={pointerY}
        />
      ))}
    </div>
  );
}

function SceneSheetCard({
  sheet,
  pointerX,
  pointerY,
}: {
  sheet: (typeof SLOTS)[number] & { index: number; post: SceneSheet };
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  // Magnetic displacement, in the same percentage units the sheet sits in.
  const rawX = useTransform<number, number>([pointerX, pointerY], ([px, py]) => {
    const dx = sheet.left - px;
    const dy = sheet.top - py;
    const distance = Math.hypot(dx, dy);
    if (distance > FIELD_RADIUS || distance === 0) return 0;
    const force = (1 - distance / FIELD_RADIUS) * FIELD_STRENGTH;
    return Number(((dx / distance) * force).toFixed(2));
  });

  const rawY = useTransform<number, number>([pointerX, pointerY], ([px, py]) => {
    const dx = sheet.left - px;
    const dy = sheet.top - py;
    const distance = Math.hypot(dx, dy);
    if (distance > FIELD_RADIUS || distance === 0) return 0;
    const force = (1 - distance / FIELD_RADIUS) * FIELD_STRENGTH;
    return Number(((dy / distance) * force).toFixed(2));
  });

  const spring = { stiffness: 130, damping: 17, mass: 0.5 };
  const offsetX = useSpring(rawX, spring);
  const offsetY = useSpring(rawY, spring);

  return (
    <motion.div
      className="absolute z-10"
      style={{
        left: `${sheet.left}%`,
        top: `${sheet.top}%`,
        x: offsetX,
        y: offsetY,
        translateX: "-50%",
        translateY: "-50%",
        willChange: "transform",
      }}
    >
      <motion.div
        initial={{ rotate: sheet.rotate, scale: sheet.scale }}
        animate={{ rotate: sheet.rotate, scale: sheet.scale }}
        whileHover={{ scale: sheet.scale * 1.28, rotate: sheet.rotate * 0.4 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
      >
        <Link
          href={`/blog/${sheet.post.slug}`}
          aria-label={sheet.post.title}
          className="group block focus-visible:outline-none"
        >
          <div
            className={cn(
              "relative h-[4.6rem] w-[3.3rem] rounded-[2px] sm:h-24 sm:w-[4.2rem]",
              "transition-shadow duration-300",
              "group-hover:shadow-[0_0_28px_6px_rgb(250_236_200/0.32)]",
              "group-focus-visible:shadow-[0_0_28px_6px_rgb(250_236_200/0.5)]",
            )}
            style={{
              // Matched to the plate's own stock so the sheet belongs to it.
              background:
                "linear-gradient(158deg, #efe3c4 0%, #ddcfa8 52%, #b9a87f 100%)",
              boxShadow: "0 8px 18px -10px rgb(0 0 0 / 0.95)",
            }}
          >
            {/* Ruled marks, as on the sheets in the plate. */}
            <div
              aria-hidden
              className="absolute inset-[0.3rem] opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, rgb(74 63 40 / 0.55) 0px, rgb(74 63 40 / 0.55) 1px, transparent 1px, transparent 5px)",
              }}
            />

            {/* Title, revealed on approach so the resting scene stays clean. */}
            <span
              className={cn(
                "absolute inset-0 flex items-end p-1.5",
                "text-[6.5px] font-semibold leading-[1.2] text-[#3b3222]",
                "opacity-0 transition-opacity duration-300",
                "group-hover:opacity-100 group-focus-visible:opacity-100",
              )}
            >
              <span className="line-clamp-4">{sheet.post.title}</span>
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
