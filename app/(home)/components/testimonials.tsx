import { Quote } from "lucide-react";

import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { isPending, testimonials } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 6 — Testimonials.
 *
 * IT SHOWS QUOTES NOW. It was a WatchCluster of names — a wall of twelve
 * cards each carrying a person and their company and nothing else — because
 * no quote had been collected and the section refused to invent one. That was
 * the right instinct and the wrong outcome: under a heading about what
 * clients say, a grid of names says nothing, which is what Genesis meant by
 * the testimonials not being visible at all.
 *
 * SO THERE IS COPY, AND IT IS NOT PUT IN ANYONE'S MOUTH. The drafts in
 * lib/home-content carry a SECTOR rather than a person — "Marketing lead ·
 * Financial services" — because the twelve people on the list are real, at
 * named companies, and a made-up sentence under a real name is not a
 * placeholder, it is a quote that person never gave. Genesis asked for
 * placeholder testimonials and these are placeholder testimonials; what they
 * are not is a claim about a named individual.
 *
 * REAL QUOTES WIN. Anything in `items` with a written quote is attributed in
 * full, with the name and the company, and takes the place of a draft. The
 * section needs no code change on the day the first one arrives.
 */
export function Testimonials() {
  const real = testimonials.items.filter((item) => !isPending(item.quote));

  /*
    Attributed quotes first, drafts only to fill the row out to three. Once
    three real ones exist no draft renders at all, and this stops being a
    placeholder without anybody having to remember to remove it.
  */
  const cards = [
    ...real.map((item) => ({
      quote: item.quote,
      attribution: item.name,
      detail: isPending(item.role) ? undefined : item.role,
      attributed: true,
    })),
    ...testimonials.drafts.map((draft) => ({
      quote: draft.quote,
      attribution: draft.sector,
      detail: undefined,
      attributed: false,
    })),
  ].slice(0, 3);

  return (
    <SectionShell
      id="testimonials"
      label={testimonials.label}
      heading={testimonials.heading}
      headingAccent={testimonials.headingAccent}
      tone="brand"
      origin="top"
      intensity={0.14}
      align="center"
    >
      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {cards.map((card) => (
          <RevealItem key={card.quote} className="h-full">
            {/*
              Equal height by making the card a column and letting the quote
              take the slack, so the attributions line up along the bottom
              however long each quote runs. Three cards of different lengths
              with their footers at different heights is the thing that makes
              a testimonial row look unfinished.
            */}
            <figure className="glass glass-lit flex h-full flex-col rounded-panel p-6 text-left sm:p-7">
              <Quote
                aria-hidden
                className="size-5 shrink-0 text-brand-ink"
                strokeWidth={2}
              />

              <blockquote className="mt-4 flex-1 text-pretty text-body leading-relaxed text-bone">
                {card.quote}
              </blockquote>

              <figcaption className="mt-6 border-t border-[var(--glass-border)] pt-4">
                <p className="text-small font-medium text-bone">
                  {card.attribution}
                </p>
                {card.detail && (
                  <p className="mt-1 text-micro text-faint">{card.detail}</p>
                )}
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>

      {/*
        Said once, quietly, and only while a draft is on screen. A visitor
        reading three testimonials is entitled to know which of them came from
        a client — and the line removes itself the moment three real quotes
        exist, because there is no draft left to disclose.
      */}
      {cards.some((card) => !card.attributed) && (
        <Reveal delay={0.1} className="mt-6">
          <p className="text-center text-micro text-faint">
            Sample copy shown while client quotes are being collected.
          </p>
        </Reveal>
      )}
    </SectionShell>
  );
}
