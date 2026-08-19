"use client";

import { LayoutGrid, List, Play, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { ourWork } from "@/lib/page-content";
import { cn } from "@/lib/utils";

/**
 * The content grid — "Genesis' NETFLIX", built to the mockup on page 7.
 *
 * Filtering and search run over a small in-memory list. There is no data
 * source to paginate against yet, so a fetch layer would be invented
 * complexity; it moves behind a query when the real catalogue lands.
 */

type ViewMode = "grid" | "list";

/**
 * Deterministic placeholder artwork. The spec calls for "videos playing on
 * their own like a GIF", so each tile becomes a muted autoplay loop once real
 * media exists. Until then a stable hashed gradient stands in — stable so the
 * server and client agree, and distinct so tiles are told apart.
 */
function placeholderArt(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) % 360;
  const partner = (hash + 46) % 360;
  return `radial-gradient(120% 96% at 28% 12%, hsl(${hash} 62% 42% / 0.9) 0%, transparent 62%),
          radial-gradient(96% 84% at 82% 92%, hsl(${partner} 56% 32% / 0.8) 0%, transparent 66%),
          linear-gradient(162deg, #1b1822 0%, #0b0a0f 100%)`;
}

export function ContentLibrary() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("grid");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return ourWork.items.filter((item) => {
      const inCategory = active === "All" || item.category === active;
      const matches =
        term === "" ||
        item.client.toLowerCase().includes(term) ||
        item.title.toLowerCase().includes(term);
      return inCategory && matches;
    });
  }, [active, query]);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* Heading + controls */}
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-bone">
            {ourWork.heading}
          </h1>
          <p className="mt-1.5 text-sm text-ash">{ourWork.body}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="glass flex h-10 items-center gap-2 rounded-xl px-3">
            <Search className="size-4 shrink-0 text-faint" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search content..."
              aria-label="Search content"
              className="w-40 bg-transparent text-sm text-bone placeholder:text-faint focus:outline-none sm:w-56"
            />
          </label>

          <button
            type="button"
            aria-label="Filters"
            className="glass grid size-10 shrink-0 place-items-center rounded-xl text-ash transition-colors hover:text-bone"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
          </button>

          <div className="glass flex shrink-0 items-center rounded-xl p-1" role="group" aria-label="View mode">
            {([["grid", LayoutGrid], ["list", List]] as const).map(([mode, Icon]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                aria-label={`${mode} view`}
                className={cn(
                  "grid size-8 place-items-center rounded-lg transition-colors",
                  view === mode ? "bg-white/10 text-bone" : "text-faint hover:text-ash",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div
        role="tablist"
        aria-label="Filter by format"
        className="no-scrollbar -mx-1 mt-7 flex gap-2 overflow-x-auto px-1 pb-1"
      >
        {ourWork.categories.map((category) => {
          const isActive = category === active;
          return (
            <button
              key={category}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActive(category)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200",
                isActive
                  ? "bg-white/[0.11] text-bone"
                  : "glass text-ash hover:text-bone",
              )}
            >
              {isActive && <span aria-hidden className="size-1.5 rounded-full bg-crimson" />}
              {category}
            </button>
          );
        })}
      </div>

      {/* The catalogue */}
      {visible.length === 0 ? (
        <p className="mt-14 text-sm text-faint">Nothing matches that yet.</p>
      ) : (
        <div
          className={cn(
            "mt-7",
            view === "grid"
              ? "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5"
              : "flex flex-col gap-3",
          )}
        >
          {visible.map((item) =>
            view === "grid" ? (
              <article
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 transition-shadow duration-500 hover:shadow-[0_20px_50px_-18px_rgb(255_45_63/0.45)]"
              >
                <div
                  className="relative aspect-[3/4]"
                  // TODO(assets): replaced by a muted autoplay loop per the
                  // spec's "videos playing on their own like a GIF".
                  style={{ backgroundImage: placeholderArt(item.id) }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.4)_0%,transparent_30%,transparent_46%,rgb(0_0_0/0.9)_100%)]" />

                  <span className="glass absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-medium text-bone">
                    {item.badge}
                  </span>

                  <span className="glass absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-full text-bone opacity-85 transition-opacity duration-300 group-hover:opacity-100">
                    <Play className="size-3 fill-current" aria-hidden />
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-[11px] font-semibold tracking-wide text-bone">
                      {item.client}
                    </p>
                    <p className="mt-0.5 text-[11px] text-ash">{item.title}</p>
                  </div>
                </div>
              </article>
            ) : (
              <article
                key={item.id}
                className="glass flex items-center gap-4 rounded-2xl p-3"
              >
                <div
                  className="size-14 shrink-0 rounded-xl"
                  style={{ backgroundImage: placeholderArt(item.id) }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-bone">{item.client}</p>
                  <p className="mt-0.5 text-xs text-ash">{item.title}</p>
                </div>
                <span className="glass shrink-0 rounded-full px-2.5 py-1 text-[10px] text-bone">
                  {item.badge}
                </span>
              </article>
            ),
          )}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] text-ash transition-colors hover:text-bone"
        >
          Load More Content
          <span
            aria-hidden
            className="size-3.5 rounded-full border border-current border-t-transparent"
          />
        </button>
      </div>
    </div>
  );
}
