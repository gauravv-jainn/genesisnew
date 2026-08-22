"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Movie-poster card — the "Genesis Netflix" unit (img-025, img-026, img-013).
 *
 * Vertical 2:3 poster, category badge top-left, play affordance top-right,
 * title and meta over a bottom scrim. On hover it lifts and blooms crimson,
 * matching the centre-focused treatment in the reference carousel.
 */

export type Poster = {
  id: string;
  title: string;
  /** e.g. "Brand Film", "Product Reel". */
  category: string;
  client?: string;
  meta?: string[];
  /** Optional real artwork. Falls back to a generated gradient. */
  image?: string;
};

/**
 * Deterministic placeholder artwork.
 *
 * Real poster images do not exist yet, and an empty <img> would render as a
 * broken frame. Hashing the id into a hue keeps each card visually distinct
 * and stable between server and client renders (no Math.random hydration
 * mismatch). Delete once real artwork is supplied.
 */
function placeholderArt(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) % 360;
  }
  // Constrained to the BRAND ARC, crimson 350deg through amber 30deg, rather
  // than the full wheel. An unconstrained hash put three of the four live
  // portfolio ids at hue 92, 105 and 135 — lime and green billboards under the
  // names Aditya Birla Capital, HDFC and Mahindra Finance, on a site whose
  // whole palette is crimson and amber. Saturation and lightness are pulled
  // back to graphite too: this is unphotographed work, and it should read as
  // restrained rather than as the loudest colour on the page.
  const hue = (350 + (hash % 41)) % 360;
  const partner = (hue + 14) % 360;
  return `radial-gradient(120% 90% at 30% 15%, hsl(${hue} 48% 26% / 0.9) 0%, transparent 60%),
          radial-gradient(90% 80% at 80% 90%, hsl(${partner} 40% 18% / 0.8) 0%, transparent 65%),
          linear-gradient(160deg, #1a1820 0%, #0c0b0f 100%)`;
}

export function PosterCard({
  poster,
  className,
  priority = false,
}: {
  poster: Poster;
  className?: string;
  /** Renders larger, as the focused card in a rail. */
  priority?: boolean;
}) {
  return (
    <motion.article
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-panel border border-white/10",
        "shadow-[0_18px_50px_-18px_rgb(0_0_0/0.9)]",
        "transition-shadow duration-500 hover:shadow-[0_26px_70px_-16px_rgb(255_45_63/0.4)]",
        // Spec page 12 asks Portfolio for a "minimal Scroll section", and the
        // scroll IS the section. At the previous widths four posters plus
        // their gaps measured 1144px inside a 1104px container — the track was
        // the container width to the pixel, so `snap-x snap-mandatory` was
        // inert, `no-scrollbar` hid a scrollbar that could never appear, and
        // the negative right margin advertised a bleed that did not exist.
        priority ? "w-[clamp(15rem,26vw,21rem)]" : "w-[clamp(12rem,20vw,18rem)]",
        className,
      )}
    >
      <div
        // Arbitrary-value syntax: Tailwind v4 has no bare-fraction `aspect-2/3`.
        className="relative aspect-[2/3] w-full"
        style={
          poster.image
            ? { backgroundImage: `url(${poster.image})`, backgroundSize: "cover" }
            : { backgroundImage: placeholderArt(poster.id) }
        }
      >
        {/*
          With no artwork the client is the subject rather than a caption at
          the foot of an empty rectangle. Set large and centred, so the card
          reads as a deliberate typographic poster instead of a missing image.
        */}
        {!poster.image && (
          <div className="absolute inset-0 grid place-items-center px-5 pb-12">
            <p className="text-balance text-center text-h3 font-semibold leading-[1.1] tracking-tight text-bone/90">
              {/* Whichever field carries the recognisable name. Case studies
                  with no written story put the client in `title`; portfolio
                  entries carry both. */}
              {poster.client ?? poster.title}
            </p>
          </div>
        )}

        {/* Legibility scrim for the title block. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.45)_0%,transparent_28%,transparent_45%,rgb(0_0_0/0.88)_100%)]" />

        <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-micro font-medium tracking-wide text-bone">
          {poster.category}
        </span>

        <span className="glass absolute right-3 top-3 grid size-8 place-items-center rounded-full text-bone opacity-80 transition-opacity duration-300 group-hover:opacity-100">
          <Play className="size-3.5 fill-current" aria-hidden />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-4">
          {poster.client && poster.image && (
            <p className="micro-label mb-2 !text-micro !tracking-[0.22em] text-bone/70">
              {poster.client}
            </p>
          )}
          {!(!poster.image && !poster.client) && (
            <h3 className="text-balance text-small font-semibold leading-tight text-bone">
              {poster.title}
            </h3>
          )}
          {poster.meta && poster.meta.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {poster.meta.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white/10 px-2 py-0.5 text-micro text-bone/80"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/**
 * Horizontal poster rail with drag-to-pan and native scroll-snap.
 * The scroll-driven centre-focus effect lands in the Phase 3 motion pass.
 */
export function PosterRail({
  posters,
  className,
}: {
  posters: Poster[];
  className?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={railRef}
      // Marks this element for the Services -> Portfolio camera turn, which
      // scrubs its scrollLeft from the same progress that drives the yaw so
      // the work is already travelling when the camera arrives. That is the
      // "the slides move" half of the spec's note on page 1.
      data-poster-rail
      className={cn(
        "no-scrollbar flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-1 pb-4",
        className,
      )}
    >
      {posters.map((poster, index) => (
        <div key={poster.id} className="snap-center">
          <PosterCard poster={poster} priority={index === Math.floor(posters.length / 2)} />
        </div>
      ))}
    </div>
  );
}
