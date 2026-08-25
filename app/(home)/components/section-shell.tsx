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
  tone = "brand",
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
  tone?: "brand" | "neutral";
  origin?: "top" | "top-right" | "top-left" | "center" | "bottom";
  intensity?: number;
  align?: "left" | "center" | "split";
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
        {/*
          `split` sets the heading left and the standfirst right, on a grid.
          Eleven sections were running the centred, boxed arrangement, which is
          the symmetric-SaaS-template tell the brief warns about — and several
          sections already hand-rolled a split header rather than use the shell,
          which is a sign the shell was missing the mode rather than that the
          sections were being wilful.
        */}
        {(label || heading || body) && (
          <header
            className={cn(
              align === "split"
                ? "grid items-end gap-x-12 gap-y-6 lg:grid-cols-[1.1fr_0.9fr]"
                : "flex flex-col",
              align === "center" && "items-center text-center",
            )}
          >
            {label && (
              <Reveal className={align === "split" ? "lg:col-start-1" : undefined}>
                <SectionLabel dot tone={tone === "neutral" ? "brand" : tone}>
                  {label}
                </SectionLabel>
              </Reveal>
            )}

            {heading && (
              <Reveal delay={0.05} className={align === "split" ? "lg:col-start-1" : undefined}>
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
                      <span className="font-serif italic font-normal text-brand-ink">
                        {headingAccent}
                      </span>
                    </>
                  )}
                </h2>
              </Reveal>
            )}

            {body && (
              <Reveal delay={0.1} className={align === "split" ? "lg:pb-2" : undefined}>
                <p
                  className={cn(
                    "text-pretty text-body text-ash sm:text-lead",
                    align === "split" ? "max-w-md lg:mt-0" : "mt-6 max-w-2xl",
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
          <div className={cn("mt-16 sm:mt-16", contentClassName)}>{children}</div>
        )}
      </section>
    </Atmosphere>
  );
}
