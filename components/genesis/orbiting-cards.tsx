"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Orbiting, draggable card cluster — the creator constellation (img-012).
 *
 * Cards ride a slow elliptical orbit around a centrepiece and can be dragged
 * off it, snapping back on release. Structure is two nested motion layers:
 * the outer one owns orbital position, the inner one owns drag. Keeping them
 * separate means drag never fights the orbit for the same transform.
 *
 * The orbit angle lives in a MotionValue rather than React state, so the
 * animation runs entirely off the main render loop — no re-render per frame.
 */

export type OrbitItem = {
  id: string;
  label: string;
  sublabel?: string;
  accent?: "crimson" | "amber" | "teal";
};

export function OrbitingCards({
  items,
  center,
  /** Seconds per full revolution. Slow reads as premium; fast reads as a widget. */
  durationSeconds = 48,
  className,
}: {
  items: OrbitItem[];
  center?: ReactNode;
  durationSeconds?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const angle = useMotionValue(0);
  const [paused, setPaused] = useState(false);

  useAnimationFrame((_time, delta) => {
    if (paused || prefersReducedMotion) return;
    // delta is ms; convert to a fraction of a full turn.
    angle.set(angle.get() + (delta / 1000) * (360 / durationSeconds));
  });

  return (
    <div
      className={cn(
        "relative isolate mx-auto aspect-square w-full max-w-xl",
        className,
      )}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <OrbitRings />

      {/* Centrepiece */}
      {center && (
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          {center}
        </div>
      )}

      {items.map((item, index) => (
        <OrbitingCard
          key={item.id}
          item={item}
          angle={angle}
          offsetDegrees={(360 / items.length) * index}
          onDragStateChange={setPaused}
        />
      ))}
    </div>
  );
}

function OrbitingCard({
  item,
  angle,
  offsetDegrees,
  onDragStateChange,
}: {
  item: OrbitItem;
  angle: MotionValue<number>;
  offsetDegrees: number;
  onDragStateChange: (dragging: boolean) => void;
}) {
  const constraintsRef = useRef<HTMLDivElement>(null);

  /**
   * Percentages of the container, so the orbit scales with the viewport.
   * Kept clear of 50 by roughly a card half-width: at a wider radius the
   * left/right extremes of the orbit pushed cards past the container edge and
   * they were clipped by the section's overflow.
   */
  const radiusX = 34;
  const radiusY = 30;

  const toRadians = (degrees: number) => ((degrees + offsetDegrees) * Math.PI) / 180;

  /**
   * Values are rounded to a fixed precision on purpose. Framer Motion
   * serialises style values at reduced precision during SSR, so an unrounded
   * float ("17.639320225002095%") renders as "17.6393%" on the server and
   * mismatches on hydration. Fixing the precision ourselves makes both sides
   * produce byte-identical strings.
   */
  const round = (value: number) => Number(value.toFixed(4));

  const left = useTransform(
    angle,
    (value) => `${round(50 + radiusX * Math.cos(toRadians(value)))}%`,
  );
  const top = useTransform(
    angle,
    (value) => `${round(50 + radiusY * Math.sin(toRadians(value)))}%`,
  );

  // Cards nearer the "front" of the orbit sit above and read slightly larger.
  const scale = useTransform(angle, (value) =>
    round(0.9 + 0.12 * ((Math.sin(toRadians(value)) + 1) / 2)),
  );

  const accentRing =
    item.accent === "amber"
      ? "ring-amber/40"
      : item.accent === "teal"
        ? "ring-teal/40"
        : "ring-crimson/40";

  return (
    <>
      <div ref={constraintsRef} className="pointer-events-none absolute inset-0" />
      <motion.div
        style={{ left, top, scale }}
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.18}
          dragSnapToOrigin
          dragMomentum={false}
          onDragStart={() => onDragStateChange(true)}
          onDragEnd={() => onDragStateChange(false)}
          whileDrag={{ scale: 1.08, zIndex: 40 }}
          whileHover={{ scale: 1.05 }}
          className={cn(
            "glass glass-lit cursor-grab active:cursor-grabbing",
            "flex w-max items-center gap-2.5 rounded-2xl px-3 py-2 ring-1",
            accentRing,
          )}
        >
          {/* Avatar stand-in — real creator imagery is not available yet. */}
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-semibold text-bone">
            {item.label.slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block whitespace-nowrap text-xs font-medium text-bone">
              {item.label}
            </span>
            {item.sublabel && (
              <span className="block whitespace-nowrap text-[10px] text-ash">
                {item.sublabel}
              </span>
            )}
          </span>
        </motion.div>
      </motion.div>
    </>
  );
}

/** Decorative wireframe orbit rings, echoing the globe in img-012. */
function OrbitRings() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      className="absolute inset-0 size-full text-white/10"
    >
      <defs>
        <radialGradient id="genesis-orbit-fade" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="200" cy="200" rx="160" ry="136" fill="none" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="200" cy="200" rx="160" ry="64" fill="none" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="200" cy="200" rx="64" ry="160" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="200" cy="200" r="160" fill="url(#genesis-orbit-fade)" opacity="0.35" />
    </svg>
  );
}
