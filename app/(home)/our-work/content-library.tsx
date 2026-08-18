"use client";

import { useMemo, useState } from "react";

import { PosterCard } from "@/components/genesis/poster-card";
import { RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { ourWork } from "@/lib/page-content";
import { cn } from "@/lib/utils";

/**
 * The filterable content grid — "Genesis' NETFLIX" in the spec.
 *
 * Filtering is client-side over a small in-memory list; there is no data
 * source to paginate against yet, so a fetch layer would be invented
 * complexity. It moves behind a query when the real catalogue lands.
 */
export function ContentLibrary() {
  const [active, setActive] = useState<string>("All");

  const visible = useMemo(
    () =>
      active === "All"
        ? ourWork.items
        : ourWork.items.filter((item) => item.category === active),
    [active],
  );

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter content by format"
        className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
      >
        {ourWork.categories.map((category) => {
          const isActive = category === active;
          return (
            <button
              key={category}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setActive(category)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-300",
                isActive
                  ? "bg-crimson text-white shadow-[0_6px_24px_-6px_rgb(255_45_63/0.7)]"
                  : "glass text-ash hover:text-bone",
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      <RevealGroup
        // Re-keyed on filter so cards re-run their entrance when the set changes.
        key={active}
        className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
      >
        {visible.map((item) => (
          <RevealItem key={item.id}>
            <PosterCard poster={item} className="w-full" />
          </RevealItem>
        ))}
      </RevealGroup>

      {visible.length === 0 && (
        <p className="mt-12 text-sm text-faint">
          Nothing in this format yet.
        </p>
      )}
    </div>
  );
}
