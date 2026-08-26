import { StatRow } from "@/components/genesis/stat-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { journey } from "@/lib/home-content";

/**
 * "How Genesis got here" — the route, from the company's own journey board.
 *
 * The board is a map: a single illuminated line running Panvel to Chembur to
 * Ghatkopar, graded from violet at the start to gold at the present, with
 * each stop branching off into what happened there. Three things carry it,
 * and all three survive here — the unbroken line, the colour running with
 * time, and the office names as the stops.
 *
 * WHAT IT REPLACED. A cold newspaper broadsheet standing in a spotlight,
 * carrying five invented milestones ("Genesis begins", "Production comes
 * in-house") with TODO where every date should have been. The content is now
 * real and so is the form.
 *
 * VERTICAL, WHERE THE BOARD IS HORIZONTAL, and that is a deliberate trade.
 * The stops carry wildly uneven content — one line for 2020, six for
 * 2022-24 — and a horizontal track gives every stop the same column width,
 * so either the long stop overflows or the short ones sit in a sea of space.
 * Down the page each stop takes the height it needs. It also means the route
 * runs the way the page already scrolls, so the reader follows it by doing
 * nothing.
 *
 * The rail is one continuous gradient behind all the stops rather than a
 * segment per stop, so the colour is genuinely continuous across the whole
 * history rather than stepping at each node.
 */
export function Journey() {
  return (
    <section
      id="journey"
      className="grain relative isolate overflow-hidden bg-void py-24 sm:py-32"
    >
      <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <Reveal className="max-w-xl">
            <SectionLabel dot tone="brand">
              {journey.label}
            </SectionLabel>
            <h2 className="mt-6 text-balance text-h2 font-normal leading-[1.02] tracking-tight text-bone sm:text-h1">
              {journey.heading}{" "}
              <span className="font-serif font-normal italic text-brand-ink">
                {journey.headingAccent}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="max-w-sm">
            <p className="text-small leading-relaxed text-ash">{journey.body}</p>
          </Reveal>
        </div>

        <div className="relative mt-16 sm:mt-20">
          {/*
            The route. One gradient for the whole history, so the colour moves
            continuously from the violet of the garage year to the gold of the
            present rather than changing in steps at each stop.

            Sits behind the stops and is inert to the pointer. On the left at
            every size: an alternating layout would put half the history on
            the wrong side of the line on a phone.
          */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-[7px] top-2 w-px sm:left-[11px]"
            style={{
              background:
                "linear-gradient(180deg, var(--route-1) 0%, var(--route-2) 26%, var(--route-3) 52%, var(--route-4) 76%, var(--route-5) 100%)",
            }}
          />

          <RevealGroup className="flex flex-col gap-12 sm:gap-14">
            {journey.milestones.map((stop, index) => (
              <RevealItem key={stop.period}>
                <article className="relative grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-7">
                  {/*
                    The stop itself. A filled node for an office, a hollow one
                    for a moment on the road between two — which is what 2020
                    is, and how the board draws it.
                  */}
                  <span
                    aria-hidden
                    className="relative mt-1.5 flex size-4 items-center justify-center sm:size-6"
                  >
                    <span
                      className="absolute inset-0 rounded-full opacity-30 blur-[6px]"
                      style={{ background: STOP_COLOUR[index] }}
                    />
                    <span
                      className={
                        "place" in stop && stop.place
                          ? "relative size-2.5 rounded-full sm:size-3"
                          : "relative size-2.5 rounded-full ring-2 ring-inset sm:size-3"
                      }
                      style={
                        "place" in stop && stop.place
                          ? { background: STOP_COLOUR[index] }
                          : {
                              background: "var(--surface-base)",
                              // ring-inset draws from the text colour
                              color: STOP_COLOUR[index],
                            }
                      }
                    />
                  </span>

                  <div className="min-w-0 pb-1">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3
                        className="text-h3 font-normal leading-none tracking-tight sm:text-h2"
                        style={{ color: STOP_COLOUR[index] }}
                      >
                        {stop.period}
                      </h3>
                      {"place" in stop && stop.place && (
                        <span className="micro-label !text-faint">
                          {stop.place}
                        </span>
                      )}
                    </div>

                    <ul className="mt-4 flex flex-col gap-1.5">
                      {stop.lines.map((line) => (
                        <li
                          key={line}
                          className="text-body leading-relaxed text-ash"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/*
          The figures, three of which come straight out of the 2022-24 stop.
          They sit under the route rather than above it because they are what
          the route adds up to.
        */}
        <Reveal delay={0.15} className="mt-16 border-t border-[var(--glass-border)] pt-10 sm:mt-20">
          <StatRow stats={journey.figures.map((figure) => ({ ...figure }))} />
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Colour per stop, taken from the same tokens the rail is drawn with, so a
 * stop's year and its node are the colour the route is passing through at
 * that moment — and so both follow the theme. The board's own values are a
 * night map and two of them are unreadable on paper; the light theme swaps
 * in a darkened ramp. See --route-1 in globals.css.
 */
const STOP_COLOUR = [
  "var(--route-1)",
  "var(--route-2)",
  "var(--route-3)",
  "var(--route-4)",
  "var(--route-5)",
];
