import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * A division's lockup — GENESIS.Influence over its own tagline.
 *
 * ONE DEFINITION, used by the section shell, the two sections that build
 * their own headers, and the division pages. It was written inline in the
 * shell first; the moment a second section needed it, three copies were one
 * refactor away from disagreeing about the dot.
 *
 * Live text in the division's ramp rather than the supplied PNG. A heading
 * that is an image cannot be selected, searched, translated or read aloud,
 * and goes soft on a retina display.
 */
export function DivisionLockup({
  name,
  tagline,
  ramp,
  as: Tag = "h2",
  className,
}: {
  /** The part after the dot — "Influence", "AI Lab". */
  name: string;
  tagline: string;
  ramp: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={className}>
      <Tag
        className={cn(
          "flex flex-wrap items-baseline gap-x-1 font-normal leading-[1.05] tracking-tight",
          "text-h2 sm:text-h1",
        )}
      >
        <span className="text-bone">GENESIS</span>
        <span className="text-brand-ink">.</span>
        <span className="ramp-text" style={{ "--ramp": ramp } as CSSProperties}>
          {name}
        </span>
      </Tag>
      <p className="mt-3 text-lead leading-relaxed text-ash">{tagline}</p>
    </div>
  );
}
