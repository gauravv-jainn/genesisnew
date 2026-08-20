"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * The creator network — built to the Genesis mockup on page 7.
 *
 * A wireframe globe with orbital rings, creator cards suspended in front of
 * it, and small platform badges riding the same orbits. Red nodes pulse along
 * the network to suggest activity without animating the whole scene.
 *
 * Cards ride a slow orbit in two nested layers, so the group has parallax
 * rather than turning as one rigid ring. Everything is driven by MotionValues
 * off the render loop, so nothing here re-renders per frame.
 */

export type Creator = {
  id: string;
  label: string;
  followers: string;
  /** Real portrait when supplied; a warm gradient stands in until then. */
  image?: string;
};

/** Deterministic pseudo-random, so SSR and the client agree. */
function seeded(index: number, salt: number) {
  const v = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
}

function portrait(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) % 360;
  return `radial-gradient(120% 90% at 30% 15%, hsl(${hash} 34% 46% / 0.95) 0%, transparent 62%),
          linear-gradient(165deg, #2a2530 0%, #14121a 100%)`;
}

export function CreatorConstellation({
  creators,
  className,
}: {
  creators: Creator[];
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const angle = useMotionValue(0);
  const [paused, setPaused] = useState(false);

  useAnimationFrame((_t, delta) => {
    if (paused || prefersReducedMotion) return;
    // A full turn every ~90s. Slow reads premium; fast reads like a widget.
    angle.set(angle.get() + (delta / 1000) * (360 / 90));
  });

  return (
    <div
      className={cn("relative isolate mx-auto aspect-square w-full max-w-2xl", className)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <Globe />

      {creators.map((creator, index) => (
        <OrbitCard
          key={creator.id}
          creator={creator}
          angle={angle}
          offset={(360 / creators.length) * index}
          // Alternating radii give the group depth instead of one flat ring.
          radius={index % 2 === 0 ? 36 : 25}
          index={index}
        />
      ))}

      {/* Platform badges ride the same orbits, further out and smaller. */}
      {Array.from({ length: 7 }).map((_, index) => (
        <PlatformBadge
          key={index}
          angle={angle}
          offset={(360 / 7) * index + 26}
          radius={44 + seeded(index, 3) * 5}
          index={index}
        />
      ))}
    </div>
  );
}

/** Wireframe sphere with orbital rings and pulsing nodes. */
function Globe() {
  return (
    <svg aria-hidden viewBox="0 0 400 400" className="absolute inset-0 size-full">
      <defs>
        <radialGradient id="genesis-globe-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff2d3f" stopOpacity="0.09" />
          <stop offset="70%" stopColor="#ff2d3f" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#ff2d3f" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="200" cy="200" r="118" fill="url(#genesis-globe-core)" />

      {/* Latitude bands — ellipses flattening toward the poles. */}
      <g stroke="rgb(255 255 255 / 0.11)" fill="none" strokeWidth="0.9">
        <circle cx="200" cy="200" r="118" />
        {[0.3, 0.58, 0.82, 0.96].map((k) => (
          <ellipse key={k} cx="200" cy="200" rx="118" ry={118 * k} />
        ))}
        {[0.3, 0.58, 0.82].map((k) => (
          <ellipse key={`v${k}`} cx="200" cy="200" rx={118 * k} ry="118" />
        ))}
      </g>

      {/* Wider orbits the cards and badges travel on. */}
      <g stroke="rgb(255 255 255 / 0.07)" fill="none" strokeWidth="0.8">
        <ellipse cx="200" cy="200" rx="176" ry="150" transform="rotate(-12 200 200)" />
        <ellipse cx="200" cy="200" rx="188" ry="112" transform="rotate(8 200 200)" />
      </g>

      {/* Nodes. Staggered so the network reads as live, not blinking in unison. */}
      {[
        [286, 96], [318, 208], [252, 316], [126, 300], [92, 176], [156, 84], [340, 148],
      ].map(([cx, cy], index) => (
        <circle
          key={index}
          cx={cx}
          cy={cy}
          r="2.6"
          fill="#ff2d3f"
          className="motion-safe:animate-[genesis-node-pulse_var(--pulse)_ease-in-out_infinite]"
          style={
            {
              "--pulse": `${(2.6 + seeded(index, 5) * 2.4).toFixed(2)}s`,
              animationDelay: `-${(seeded(index, 6) * 3).toFixed(2)}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </svg>
  );
}

function OrbitCard({
  creator,
  angle,
  offset,
  radius,
  index,
}: {
  creator: Creator;
  angle: MotionValue<number>;
  offset: number;
  radius: number;
  index: number;
}) {
  const rad = (deg: number) => ((deg + offset) * Math.PI) / 180;
  // Fixed precision: Framer serialises style values at reduced precision during
  // SSR, so an unrounded float mismatches on hydration.
  const round = (v: number) => Number(v.toFixed(3));

  const left = useTransform(angle, (v) => `${round(50 + radius * Math.cos(rad(v)))}%`);
  const top = useTransform(angle, (v) => `${round(50 + radius * 0.74 * Math.sin(rad(v)))}%`);
  // Cards toward the front sit larger and above.
  const scale = useTransform(angle, (v) => round(0.86 + 0.2 * ((Math.sin(rad(v)) + 1) / 2)));

  return (
    <motion.div
      style={{ left, top, scale }}
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
    >
      <div className="glass glass-lit w-[8.5rem] overflow-hidden rounded-2xl sm:w-40">
        <div
          className="relative aspect-[4/5]"
          style={{ backgroundImage: creator.image ? undefined : portrait(creator.id) }}
        >
          {creator.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={creator.image} alt="" className="size-full object-cover" />
          )}

          <span className="glass absolute right-2 top-2 grid size-6 place-items-center rounded-full text-bone">
            <Play className="size-2.5 fill-current" aria-hidden />
          </span>

          {/* The name bar, as in the mockup: avatar, name, follower count. */}
          <div className="glass glass-strong absolute inset-x-2 bottom-2 flex items-center gap-2 rounded-xl px-2 py-1.5">
            <span
              className="size-5 shrink-0 rounded-full"
              style={{ backgroundImage: portrait(`${creator.id}-a`) }}
            />
            <span className="min-w-0">
              <span className="block truncate text-[9px] font-medium leading-tight text-bone">
                {creator.label}
              </span>
              <span className="block truncate text-[8px] leading-tight text-ash">
                {creator.followers}
              </span>
            </span>
          </div>
        </div>
      </div>
      <span className="sr-only">{`${creator.label}, ${creator.followers}`}</span>
      <span aria-hidden className="hidden">{index}</span>
    </motion.div>
  );
}

function PlatformBadge({
  angle,
  offset,
  radius,
  index,
}: {
  angle: MotionValue<number>;
  offset: number;
  radius: number;
  index: number;
}) {
  const rad = (deg: number) => ((deg + offset) * Math.PI) / 180;
  const round = (v: number) => Number(v.toFixed(3));

  const left = useTransform(angle, (v) => `${round(50 + radius * Math.cos(rad(v)))}%`);
  const top = useTransform(angle, (v) => `${round(50 + radius * 0.72 * Math.sin(rad(v)))}%`);
  const opacity = useTransform(angle, (v) => round(0.4 + 0.6 * ((Math.sin(rad(v)) + 1) / 2)));

  return (
    <motion.div
      aria-hidden
      style={{ left, top, opacity }}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
    >
      <span
        className="block size-8 rounded-full ring-1 ring-white/15"
        style={{ backgroundImage: portrait(`badge-${index}`) }}
      />
      {/* The platform chip clipped to the badge's corner, as in the mockup. */}
      <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-[4px] bg-crimson/80 ring-1 ring-black/40" />
    </motion.div>
  );
}
