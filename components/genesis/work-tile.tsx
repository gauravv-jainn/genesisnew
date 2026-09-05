"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { BAKED_ASPECT, hasBakedChrome, type WorkItem } from "@/lib/work";
import { cn } from "@/lib/utils";

/**
 * One piece of work as a tile, used by the masonry grid and by the browse
 * rails.
 *
 * IT WAS INSIDE work-grid.tsx, which is why it moved. The Portfolio grew a
 * second view — rows rather than a wall — and the choice was to copy a
 * hundred lines of tile or to lift them out. Two tiles would have disagreed
 * about hover playback within a week, and the placeholder bug below would
 * have had to be found twice.
 */

/**
 * Tile shape follows the FORMAT, which is the one honest source of variety
 * here: a reel is shot portrait and a film is not, so the grid is uneven
 * because the work is, rather than because a masonry algorithm decided so.
 *
 * Artwork that carries its own chrome keeps its own shape — the interim
 * stills are 173x200 cards with the client name printed along the bottom, so
 * cropping them to a format aspect slices the first letter off every one.
 */
export function aspectFor(item: WorkItem): string {
  if (hasBakedChrome(item)) return BAKED_ASPECT;
  if (item.format === "Reels" || item.format === "UGC") return "aspect-[9/13]";
  if (item.format === "Shoots" || item.format === "Campaigns") return "aspect-[4/3]";
  return "aspect-[4/5]";
}

export function WorkTile({
  item,
  /**
   * `grid` fills its column and takes its height from the aspect.
   * `rail` does the opposite — a FIXED HEIGHT with the width following the
   * aspect — so a row of mixed formats lines up top AND bottom. Netflix rows
   * are uniform; this catalogue is not, and letting the width vary is what
   * reconciles the two without cropping a portrait reel into a landscape box.
   */
  variant = "grid",
  className,
}: {
  item: WorkItem;
  variant?: "grid" | "rail";
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const baked = hasBakedChrome(item);
  const hasArt = Boolean(item.clip || item.art);
  const rail = variant === "rail";

  /*
    Hover playback, started and stopped by hand rather than with `autoPlay`.
    A grid of autoplaying videos pulls every file on load and keeps a dozen
    decoders alive; this way nothing decodes until a pointer is actually over
    a tile. play() rejects if the pointer leaves before the promise settles,
    which is normal and not worth surfacing.
  */
  const play = () => {
    const video = videoRef.current;
    if (video) void video.play().catch(() => {});
  };
  const stop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <Link
      href={`/work/${item.slug}`}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      className={cn(
        "group relative block overflow-hidden rounded-card border border-[var(--glass-border)] bg-ink",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        rail && "h-full w-auto shrink-0",
        className,
      )}
    >
      <div
        className={cn(
          "relative",
          rail ? "h-full w-auto" : "w-full",
          aspectFor(item),
        )}
      >
        {item.clip ? (
          <video
            ref={videoRef}
            src={item.clip}
            poster={item.poster ?? item.art}
            muted
            loop
            playsInline
            // Nothing but the header until someone hovers.
            preload="metadata"
            aria-hidden
            className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
          />
        ) : item.art ? (
          <Image
            src={item.art}
            alt={`${item.client} — ${item.title}`}
            fill
            // Follows the column count on the grid: four on desktop, three on
            // tablet, two on a phone. Rails cap out around 320px.
            sizes={
              rail
                ? "320px"
                : "(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            }
            className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          /*
            NO ARTWORK YET, AND THIS IS THE TILE THAT WAS BROKEN.
            
            It used to centre the client's name at text-h3 in the middle of the
            box AND draw the standard caption block over the bottom of it. On a
            short name nothing collided; on "Aditya Birla Sun Life Insurance"
            the name wrapped to three lines, ran down into the caption, and the
            caption printed the same name again underneath itself with the
            format chip sitting on top of both. Genesis screenshotted it.
            
            Two faults, one cause: the placeholder and the caption were both
            saying the client's name, and neither knew the other was there. So
            a tile with no artwork now owns its whole frame — the name is set
            ONCE, as the tile's own content, in a flow layout with nothing
            absolutely positioned over it. It cannot overlap because there is
            no longer anything to overlap with.
            
            Pinned dark rather than following the theme. Every other tile is a
            photograph, so a light placeholder in the middle of them reads as a
            hole in the grid.
          */
          <div className="absolute inset-0 flex flex-col justify-between bg-[linear-gradient(150deg,#2f2b34_0%,#17151b_58%,#111014_100%)] p-4 sm:p-5">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <span className="glass-chip relative w-fit rounded-full px-2.5 py-1 text-micro text-white/90">
              {item.format}
            </span>
            <div className="relative">
              {/*
                Balanced and hyphenated, because the longest client on the list
                is thirty-one characters and a rail tile can be 180px wide.
                Without `hyphens` a word longer than the box overflows it
                rather than breaking.
              */}
              <p className="text-balance text-body font-medium leading-tight tracking-tight text-white/90 [hyphens:auto] sm:text-h3">
                {item.client}
              </p>
              <p className="mt-1 line-clamp-2 text-micro text-white/55">
                {item.title}
              </p>
            </div>
          </div>
        )}

        {/*
          Scrim and caption, unless the artwork already carries its own — or
          unless there IS no artwork, in which case the block above is the
          caption and drawing a second one over it is the bug described there.
        */}
        {hasArt && !baked && (
          <>
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-2/3"
              style={{
                background:
                  "linear-gradient(0deg, rgb(0 0 0 / 0.86) 0%, rgb(0 0 0 / 0.35) 48%, transparent 100%)",
              }}
            />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
              <div className="min-w-0">
                <p className="truncate text-small font-medium text-white">
                  {item.client}
                </p>
                <p className="truncate text-micro text-white/70">{item.title}</p>
              </div>
              <span className="glass-chip shrink-0 rounded-full px-2.5 py-1 text-micro text-white/90">
                {item.format}
              </span>
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
