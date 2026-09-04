"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import {
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
 * True while a tile is showing interim mockup artwork that already carries
 * its own chrome.
 *
 * The ten client stills in /public/work are cards lifted from Genesis's own
 * content-library mockup, and the category pill, the play control and the
 * client name are PAINTED INTO the image. Drawing the component's own caption
 * and chip over them prints everything twice — which is exactly what this
 * grid did on its first pass.
 *
 * The rule is deliberately inferred rather than flagged per item: the moment
 * a real clip or poster lands for a piece, the branch stops matching and the
 * data-driven overlays come back on their own.
 */
function artHasBakedChrome(item: WorkItem): boolean {
  return Boolean(item.art) && !item.clip && !item.poster;
}

/**
 * Tile shape follows the FORMAT, which is the one honest source of variety
 * here: a reel is shot portrait and a film is not, so the grid is uneven
 * because the work is, rather than because a masonry algorithm decided so.
 */
function aspectFor(item: WorkItem): string {
  /*
    Artwork that carries its own chrome keeps its own shape. The ten interim
    stills are all 173x200 cards with the client name printed along their
    bottom edge, so cropping them to a format aspect — which is what the first
    pass did — sliced the first letter off every one of them: KAYALI rendered
    as AYALI. Format aspects apply to real footage, which has no text in it to
    lose.
  */
  if (artHasBakedChrome(item)) return "aspect-[173/200]";
  if (item.format === "Reels" || item.format === "UGC") return "aspect-[9/13]";
  if (item.format === "Shoots" || item.format === "Campaigns") return "aspect-[4/3]";
  return "aspect-[4/5]";
}

function Tile({ item }: { item: WorkItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const baked = artHasBakedChrome(item);

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
            // Three columns on desktop, two on tablet, one on a phone.
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
      */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
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
