"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A vertical glass rail of circular icon buttons — built to p08_1.
 *
 * The reference is a single tall capsule of heavy glass with round icon
 * targets inside it and exactly one lit. It reads as a floating control, not
 * as a sidebar, which is why it suits the Insider shell: this surface is a
 * tool, not a website.
 */

export type RailItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  onSelect?: () => void;
};

export function GlassRail({
  items,
  activeId,
  className,
}: {
  items: RailItem[];
  activeId: string;
  className?: string;
}) {
  return (
    <nav
      aria-label="Insider sections"
      className={cn(
        "glass glass-strong glass-lit flex flex-row items-center gap-2 rounded-full p-2",
        "lg:flex-col",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.id === activeId;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onSelect}
            aria-current={active ? "page" : undefined}
            title={item.label}
            className={cn(
              "group relative grid size-11 shrink-0 place-items-center rounded-full",
              "transition-colors duration-300",
              active
                ? "bg-white text-[#141118] shadow-[0_6px_20px_-6px_rgb(255_255_255/0.45)]"
                : "text-ash hover:bg-white/10 hover:text-bone",
            )}
          >
            <Icon className="size-[18px]" aria-hidden />
            <span className="sr-only">{item.label}</span>

            {/* Label on hover, so the rail stays icons-only at rest. */}
            <span
              className={cn(
                "pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-field",
                "glass px-3 py-1 text-micro text-bone opacity-0 transition-opacity duration-200",
                "group-hover:opacity-100 lg:block",
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
