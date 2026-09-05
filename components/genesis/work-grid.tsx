"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import {
  BAKED_ASPECT,
  hasBakedChrome,
  matchesFilter,
  workFilters,
  type WorkItem,
} from "@/lib/work";
import { cn } from "@/lib/utils";

/**
 * The work grid — filters plus tiles, used by both the homepage Work section
 * and the full Portfolio.
 *
 * ONE COMPONENT FOR BOTH, because they are the same thing at two lengths:
 * Work is the featured slice, Portfolio is everything. Two grids would drift
 * within a week.
 *
 * EVERY TILE IS A LINK TO A REAL URL, not a click handler that opens a
 * lightbox. /work/<slug> is a page — it can be shared, indexed, and pasted
 * into a proposal. The modal is an interception on top of that route, so
 * browsing feels like a gallery and the address bar still says something
 * useful. Middle-click and cmd-click open the project in a tab, which a
 * div-with-onClick would have silently swallowed.
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
function aspectFor(item: WorkItem): string {
  if (hasBakedChrome(item)) return BAKED_ASPECT;
  if (item.format === "Reels" || item.format === "UGC") return "aspect-[9/13]";
  if (item.format === "Shoots" || item.format === "Campaigns") return "aspect-[4/3]";
  return "aspect-[4/5]";
}

function Tile({ item }: { item: WorkItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const baked = hasBakedChrome(item);

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
      className="group relative block overflow-hidden rounded-card border border-[var(--glass-border)] bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      <div className={cn("relative w-full", aspectFor(item))}>
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
            // Follows the column count above: four on desktop, three on
            // tablet, two on a phone. Left at 33vw these would each fetch a
            // still half again as wide as the tile it lands in.
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          /*
            No still yet. A grey placeholder box reads as a broken image, so
            a piece without artwork gets a typographic tile instead — the
            client's name set large on the section ground. It looks
            deliberate, and it stops looking like this the moment a file
            lands.
          */
          /*
            Pinned dark rather than following the theme. Every other tile is a
            photograph, so a light placeholder in the middle of them reads as
            a hole in the grid — and the caption scrim below is built for a
            dark frame, so on a light tile it landed as a black band across
            the bottom of a white box.
          */
          <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(150deg,#2b2b2b_0%,#141414_60%,#111111_100%)] p-6">
            <span className="text-balance text-center text-h3 font-normal leading-tight tracking-tight text-white/80">
              {item.client}
            </span>
          </div>
        )}

        {/* Scrim and caption, unless the artwork already carries its own. */}
        {!baked && (
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

export function WorkGrid({
  items,
  showFilters = true,
  className,
}: {
  items: WorkItem[];
  showFilters?: boolean;
  className?: string;
}) {
  const [filter, setFilter] = useState("All");
  const filters = useMemo(() => workFilters(items), [items]);
  const visible = useMemo(
    () => items.filter((item) => matchesFilter(item, filter)),
    [items, filter],
  );

  return (
    <div className={className}>
      {showFilters && filters.length > 2 && (
        <div
          role="group"
          aria-label="Filter work"
          className="mb-8 flex flex-wrap gap-2"
        >
          {filters.map((tag) => {
            const active = tag === filter;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setFilter(tag)}
                aria-pressed={active}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-small transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                  active
                    ? "bg-brand text-on-brand"
                    : "border border-[var(--glass-border)] text-ash hover:bg-[var(--hover-wash)] hover:text-bone",
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/*
        Column flow rather than a fixed grid, so tiles of different heights
        pack without leaving a row of gaps under the short ones. `break-inside`
        is what stops a tile being sliced across a column boundary.

        FOUR COLUMNS AT THE TOP END, NOT THREE. Genesis's note on the library
        was that it is too big — and the height of a masonry grid is set by its
        column COUNT, not by the number of tiles: at three columns a 1280px
        page gave each tile 405px, so a 4:5 still stood 506px tall and six of
        them ran past a screen and a half. Four columns puts a tile at 296px
        and the same six at roughly half the height, and two on a phone rather
        than one turns a stack you scroll through into a wall you look at. A
        fifth column above 1280 takes a tile to 218px, which is where two rows
        of them and the heading above finally clear a laptop screen. Nothing is
        dropped; every tile is simply the size a thumbnail should be.
      */}
      <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 xl:columns-5 [&>*]:mb-3 sm:[&>*]:mb-4">
        {visible.map((item) => (
          <div key={item.slug} className="break-inside-avoid">
            <Tile item={item} />
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="py-16 text-center text-small text-ash">
          Nothing in {filter} yet.
        </p>
      )}
    </div>
  );
}
