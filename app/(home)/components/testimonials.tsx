import { Reel } from "@/components/genesis/reel";
import { Reveal } from "@/components/genesis/reveal";
import { WatchCluster } from "@/components/genesis/watch-cluster";
import { isPending, testimonials } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 6 — Testimonials.
 *
 * Spec: "//this will like move around like how apps move around in an apple
 * watch", so this shares the cluster interaction with the client logos, and
 * "Start Video testimonial project" — an entry with a clip becomes a video
 * card, the rest stay text.
 *
 * THE NAMES ARE REAL; THE QUOTES ARE NOT WRITTEN YET. Both halves of that
 * matter. Attributing an invented quote to a named person at a named company
 * is the worst thing this page could do — but an earlier pass then deleted the
 * whole section, which threw away a dozen real client relationships to avoid
 * two unwritten fields, and took the section off the homepage entirely.
 *
 * So the section renders either way. With no quote collected it presents
 * itself as the wall of people it can honestly be, under its own heading. The
 * moment ONE real quote exists it flips back to being testimonials and shows
 * only the entries that have one. Nothing here needs changing when that
 * happens.
 */
export function Testimonials() {
  const quoted = testimonials.items.filter((item) => !isPending(item.quote));
  const hasQuotes = quoted.length > 0;
  const items = hasQuotes ? quoted : testimonials.items;
  const copy = hasQuotes ? testimonials : testimonials.awaiting;

  return (
    <SectionShell
      id="testimonials"
      label={copy.label}
      heading={copy.heading}
      headingAccent={copy.headingAccent}
      // "Move your pointer", not "drag" — the cluster follows the pointer and
      // has since the drag was removed. See the note in home-content.
      body={
        hasQuotes
          ? "Move your pointer through the wall."
          : testimonials.awaiting.body
      }
      align="split"
      tone="brand"
      origin="top"
      intensity={0.14}
    >
      <Reveal variant="scene">
        <WatchCluster
          height={520}
          cell={190}
          items={items.map((testimonial) => ({
            id: testimonial.name,
            content: (
              <figure
                className={
                  hasQuotes
                    ? "glass glass-lit flex w-40 flex-col gap-3 rounded-panel p-4 sm:w-44"
                    : // With no quote the card is a NAME, so it is built like
                      // one: a real card with the name as its subject rather
                      // than two lines of small type in a pill. Same problem
                      // the poster cards had, same answer.
                      "glass glass-lit flex aspect-[4/3] w-44 flex-col justify-end rounded-panel p-5 sm:w-48"
                }
              >
                {"clip" in testimonial && testimonial.clip ? (
                  <Reel
                    src={testimonial.clip as string}
                    label={`${testimonial.name}, ${testimonial.role}`}
                    aspect="3 / 4"
                    className="rounded-card"
                  />
                ) : null}

                {/* Only ever rendered when the quote is real. */}
                {!isPending(testimonial.quote) && (
                  <blockquote className="text-micro leading-relaxed text-bone/80">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                )}

                <figcaption
                  className={
                    isPending(testimonial.quote)
                      ? ""
                      : "border-t border-white/10 pt-3"
                  }
                >
                  <p className={hasQuotes ? "text-small font-medium text-bone" : "text-balance text-h3 font-semibold leading-tight tracking-tight text-bone"}>
                    {testimonial.name}
                  </p>
                  {!isPending(testimonial.role) && (
                    <p className={hasQuotes ? "mt-1 text-micro text-faint" : "mt-2 text-small text-ash"}>
                      {testimonial.role}
                    </p>
                  )}
                </figcaption>
              </figure>
            ),
          }))}
        />
      </Reveal>
    </SectionShell>
  );
}
