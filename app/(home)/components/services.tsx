import type { CSSProperties } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { services } from "@/lib/home-content";

/**
 * Section 2 — the four divisions.
 *
 * BUILT TO THE BRAND DECK, not to the old mockups. Pages 26-29 of the
 * guidelines give each division a page of its own, and each of those pages is
 * the same thing: a black field, the division name set once at 96pt, and
 * nothing else. No cards, no tilt, no scatter, no ornament.
 *
 * WHAT THIS REPLACED. Five pinned paper cards dropped across an arc at 8-13
 * degrees under a raking spotlight, overlapping, at three sizes. It was
 * carefully made and it was wrong twice over: it is not what the deck shows,
 * and it is the exact thing the guidelines tell you to reject — "Minimal.
 * Confident. Never Loud. Rule: if it feels like a normal agency template,
 * reject it." Tilted pinned index cards are an agency template.
 *
 * So the divisions are a list, and the type does the work: the name at
 * display size in Mont, the number and the caption reduced to labels around
 * it. On a 1440 screen four names at this size fill the frame the way one
 * name fills a deck page.
 *
 * THE N-SLICE. The deck names the mark's diagonal as the brand's ownable
 * device — "the diagonal split should drive masks, wipes, transitions, image
 * crops and section cuts" — and the site was using none of it. Each row's
 * hover fill is cut at the mark's own angle rather than being a rectangle,
 * so the one interactive flourish in the section is the brand's own gesture.
 */

export function Services() {
  return (
    <section
      id="services"
      className="scene-dark grain relative isolate overflow-hidden bg-void py-24 sm:py-32"
    >
      {/*
        Transitions into and out of the dark chapter — the same treatment the
        process section uses, since this is now the second pinned-dark band on
        an otherwise light page and a butt joint reads as a rendering fault.
        Both blend to the ACTUAL adjacent grounds through the surface tokens,
        so they disappear in dark mode where the neighbours are already black.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-28"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--surface-ink) 90%, transparent) 0%, color-mix(in srgb, var(--surface-ink) 50%, transparent) 42%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-28"
        style={{
          background:
            "linear-gradient(0deg, var(--surface-base) 0%, color-mix(in srgb, var(--surface-base) 55%, transparent) 42%, transparent 100%)",
        }}
      />

      {/*
        No ghost word behind the list. The deck's division pages carry the
        name and nothing else, and at this type size a second set of letterforms
        underneath is just noise competing with the first.
      */}
      <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <Reveal className="max-w-xl">
            <SectionLabel dot tone="brand">
              {services.label}
            </SectionLabel>
            <h2 className="mt-6 text-balance text-h2 font-normal leading-[1.02] tracking-tight text-bone sm:text-h1">
              {services.heading}{" "}
              <span className="font-serif font-normal italic text-brand-ink">
                {services.headingAccent}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="max-w-sm">
            <p className="text-small leading-relaxed text-ash">{services.body}</p>
          </Reveal>
        </div>

        <RevealGroup className="mt-16 border-t border-[var(--glass-border)] sm:mt-20">
          {services.items.map((service, index) => (
            <RevealItem key={service.title}>
              <article className="group relative isolate border-b border-[var(--glass-border)]">
                {/*
                  The hover fill, edged at the mark's own angle by .n-wash.
                  On a row this wide 51deg reads as a slight slant — the edge
                  travels 81px across 1152px — which is the angle behaving
                  correctly on a wide box, not a diluted version of it. Sits
                  behind the row and is inert to the pointer, so it can never
                  eat a click.
                */}
                <div
                  aria-hidden
                  className="n-wash pointer-events-none absolute inset-0 -z-10 text-brand/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <div className="flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:gap-8 sm:py-10">
                  <span className="micro-label shrink-0 text-brand-ink sm:w-16">
                    {`0${index + 1}`}
                  </span>

                  <h3
                    className="ramp-text min-w-0 flex-1 text-balance text-h2 font-normal leading-[1.05] tracking-tight text-bone sm:text-h1"
                    style={{ "--ramp": service.ramp } as CSSProperties}
                  >
                    {/*
                      The names are dotted single tokens — "Genesis.BrandDesign"
                      has no space in it and cannot wrap. A <wbr> after the dot
                      gives the browser somewhere to break, which is where the
                      name wants to break anyway.
                    */}
                    {service.title.split(".").map((part, i, all) => (
                      <span key={part}>
                        {part}
                        {i < all.length - 1 && (
                          <>
                            .<wbr />
                          </>
                        )}
                      </span>
                    ))}
                  </h3>

                  <p className="shrink-0 text-small leading-relaxed text-ash sm:w-64 sm:text-right">
                    {service.caption}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
