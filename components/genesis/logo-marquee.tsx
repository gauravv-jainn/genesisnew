"use client";

import { cn } from "@/lib/utils";

/**
 * Client logo wall — an infinite horizontal marquee.
 *
 * The track is duplicated once and translated by exactly -50%, which makes the
 * loop seamless without measuring anything. The duplicate is aria-hidden so
 * screen readers announce each client exactly once.
 *
 * Uses a CSS animation rather than Framer Motion: this runs continuously for
 * the life of the page, and keeping it off the main thread avoids a permanent
 * rAF subscription.
 */

export function LogoMarquee({
  logos,
  speedSeconds = 40,
  reverse = false,
  className,
}: {
  /** Wordmarks for now; swap for <img> when real client logos arrive. */
  logos: string[];
  speedSeconds?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        // Fade the rail into the background at both edges.
        "[mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <div
        className="flex w-max animate-[genesis-marquee_var(--marquee-duration)_linear_infinite] items-center gap-14 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={
          {
            "--marquee-duration": `${speedSeconds}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center gap-14"
          >
            {logos.map((logo) => (
              <span
                key={`${copy}-${logo}`}
                className="whitespace-nowrap text-lg font-semibold tracking-[0.12em] text-bone/35 transition-colors duration-300 hover:text-bone/80"
              >
                {logo}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
