import { Quote } from "lucide-react";

import { testimonials } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 6 — Testimonials, as a slider that runs on its own.
 *
 * WHAT GENESIS ASKED FOR, AND WHY EACH PART IS BUILT THE WAY IT IS.
 *
 *   NAMES. The quotes carry the client's name and company now. They are also
 *     still written rather than collected — see the note over `testimonials`
 *     in lib/home-content, where that is recorded against every one of them
 *     with an `approved: false` flag so the whole set can be found in one
 *     grep on the day the real ones arrive.
 *   AUTO-SLIDE. A marquee rather than a stepper. A stepper has to know how
 *     many cards fit, which changes at every breakpoint, and ends up with
 *     positions the last card can never reach and dots that lie about it. A
 *     marquee has no index at all: the track is duplicated once and
 *     translated exactly -50%, so the copy starts where the original ends and
 *     the seam never lands anywhere.
 *   PAUSE ON HOVER. `animation-play-state: paused`, which stops on the frame
 *     the pointer arrives — a JS timer can only stop at the next tick, which
 *     for readable content is exactly the wrong moment. Focus-within pauses
 *     it too, so tabbing to a card does not leave a keyboard user chasing it,
 *     and :active covers a touch screen, which has no hover to give.
 *
 * SLOW ON PURPOSE. 72s for a full pass is about 36px a second — deliberate
 * drift rather than a conveyor. Moving text is harder to read than still
 * text, and the answer to that is a speed you can read at plus a pause that
 * responds instantly, not a faster loop.
 *
 * IT NO LONGER SAYS THE QUOTES ARE SAMPLES. That disclosure line was here and
 * Genesis asked for it to go. The honesty it was carrying did not go with it —
 * it moved into the data, where it is a flag on each quote rather than a
 * sentence under the section.
 */
export function Testimonials() {
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
      /*
        Full-bleed, and the container padding is what the section normally
        gets — so the rail runs edge to edge and the fade at each end has page
        to dissolve into, instead of stopping at a 72rem boundary with empty
        page beyond it. That gap is the cut Genesis kept finding on rails.
      */
      contentClassName="relative left-1/2 w-screen -translate-x-1/2"
    >
      {/*
        THE RAIL TAKES FOCUS, and that is not decoration.

        `group-focus-within` was already on the track, but nothing inside a
        card is focusable — no link, no button — so it could never fire and
        the "keyboard users can pause it" claim was empty. A tabindex on the
        rail makes :focus-within reachable by Tab, which is also what a
        scrollable region owes a keyboard in the reduced-motion case below,
        where this becomes a rail you have to scroll to finish reading.
      */}
      <div
        role="group"
        aria-label="Client testimonials"
        tabIndex={0}
        className={[
          "group relative overflow-hidden py-1",
          "outline-none focus-visible:ring-2 focus-visible:ring-brand-ink/50",
          /*
            Clipped while it animates, SCROLLABLE when it does not. The track
            is twice the content wide and the animation walks it to -50%, so
            letting it scroll at the same time would let you scroll past the
            end of the duplicate into blank page. With the animation off there
            is no walk and no duplicate to run past, and a rail you cannot
            reach the end of would be the worse bug.
          */
          "no-scrollbar motion-reduce:overflow-x-auto",
          // The ends dissolve rather than stop. Same treatment the other
          // rails on the page use.
          "[mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]",
        ].join(" ")}
      >
        <div
          className={[
            "flex w-max items-stretch gap-4 sm:gap-6",
            "animate-[genesis-marquee_var(--marquee-duration)_linear_infinite]",
            // The three ways to stop it: pointer, keyboard (see the
            // tabindex above), thumb.
            "group-hover:[animation-play-state:paused]",
            "group-focus-within:[animation-play-state:paused]",
            "group-active:[animation-play-state:paused]",
            // And the fourth: a visitor who has asked for no motion never
            // starts it — the rail above turns into a plain scroller instead.
            "motion-reduce:animate-none",
          ].join(" ")}
          style={{ "--marquee-duration": "72s" } as React.CSSProperties}
        >
          {[0, 1].map((copy) => (
            /*
              The second pass is the same six quotes again, so the loop is
              seamless. It is aria-hidden because a screen reader should hear
              each client once — the duplicate is a rendering trick, not
              content.
            */
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-stretch gap-4 sm:gap-6"
            >
              {testimonials.items.map((item) => (
                <li
                  key={`${copy}-${item.name}`}
                  className="w-[min(82vw,24rem)] shrink-0"
                >
                  {/*
                    A column with the quote taking the slack, so however long
                    each one runs the names line up along the bottom. Cards of
                    equal height with their footers at different heights is
                    the thing that makes a testimonial row look unfinished.
                  */}
                  <figure className="glass glass-lit flex h-full flex-col rounded-panel p-6 text-left sm:p-7">
                    <Quote
                      aria-hidden
                      className="size-5 shrink-0 text-brand-ink"
                      strokeWidth={2}
                    />

                    <blockquote className="mt-4 flex-1 text-pretty text-body leading-relaxed text-bone">
                      {item.quote}
                    </blockquote>

                    <figcaption className="mt-6 border-t border-[var(--glass-border)] pt-4">
                      <p className="text-small font-medium text-bone">
                        {item.name}
                      </p>
                      <p className="mt-1 text-micro text-faint">{item.role}</p>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
