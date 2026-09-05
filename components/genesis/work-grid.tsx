"use client";

import { useMemo, useState } from "react";

import { matchesFilter, workFilters, type WorkItem } from "@/lib/work";
import { cn } from "@/lib/utils";
import { WorkTile } from "./work-tile";

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
            <WorkTile item={item} />
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
