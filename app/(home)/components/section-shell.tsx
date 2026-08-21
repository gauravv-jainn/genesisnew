import type { ReactNode } from "react";

import { Atmosphere } from "@/components/genesis/atmosphere";
import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { cn } from "@/lib/utils";

/**
 * Shared layout for every homepage section: consistent vertical rhythm,
 * container width, and the label → two-tone heading → body intro pattern that
 * runs through the reference designs.
 *
 * Defined once so all 13 sections share spacing and heading treatment rather
 * than each re-deciding it.
 */

export function SectionShell({
  id,
  label,
  heading,
  headingAccent,
  body,
  children,
  tone = "crimson",
  origin = "top-right",
  intensity,
  align = "left",
  className,
  contentClassName,
}: {
  id?: string;
  label?: string;
  heading?: string;
  /** Rendered in serif italic — the single accent word per headline. */
  headingAccent?: string;
  body?: string;
  children?: ReactNode;
  tone?: "crimson" | "amber" | "teal" | "neutral";
  origin?: "top" | "top-right" | "top-left" | "center" | "bottom";
  intensity?: number;
  align?: "left" | "center";
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Atmosphere
      tone={tone}
      origin={origin}
      intensity={intensity}
      className={cn("py-24 sm:py-32 lg:py-40", className)}
    >
      <section id={id} className="mx-auto w-full max-w-6xl px-6">
        {(label || heading || body) && (
          <header
            className={cn(
              "flex flex-col",
              align === "center" && "items-center text-center",
            )}
          >
            {label && (
              <Reveal>
                <SectionLabel dot tone={tone === "neutral" ? "crimson" : tone}>
                  {label}
                </SectionLabel>
              </Reveal>
            )}

            {heading && (
              <Reveal delay={0.05}>
                <h2
                  className={cn(
                    "mt-6 text-balance text-h2 font-semibold leading-[1.05] tracking-tight text-bone",
                    "sm:text-h1 lg:text-h1",
                  )}
                >
                  {heading}
                  {headingAccent && (
                    <>
                      {" "}
                      <span className="font-serif italic font-normal text-amber">
                        {headingAccent}
                      </span>
                    </>
                  )}
                </h2>
              </Reveal>
            )}

            {body && (
              <Reveal delay={0.1}>
                <p
                  className={cn(
                    "mt-6 max-w-2xl text-pretty text-body leading-relaxed text-ash sm:text-h3",
                    align === "center" && "mx-auto",
                  )}
                >
                  {body}
                </p>
              </Reveal>
            )}
          </header>
        )}

        {children && (
          <div className={cn("mt-14 sm:mt-16", contentClassName)}>{children}</div>
        )}
      </section>
    </Atmosphere>
  );
}
