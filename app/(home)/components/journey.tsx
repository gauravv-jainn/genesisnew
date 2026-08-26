import { StatRow } from "@/components/genesis/stat-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { journey } from "@/lib/home-content";

/**
 * "How Genesis got here" — the route, from the company's own journey board.
 *
 * The board traces a single illuminated line across a night map of Mumbai,
 * Panvel to Chembur to Ghatkopar, graded violet to gold, with each stop
 * branching off into what happened there. Four things carry it and all four
 * are here: the line MEANDERS rather than running straight, it GLOWS, the
 * colour runs with time, and each stop is a lit node with the office name.
 *
 * The map itself is not reproduced. It is the ground the route is drawn on
 * rather than the thing being said, and a decorative city behind live text
 * costs legibility for atmosphere. The route carries the idea without it.
 *
 * HOW THE MEANDER IS BUILT. Each stop owns its own segment of the line: an
 * SVG in the rail column, stretched to whatever height that stop's content
 * needs, drawing a curve from its own node down to the next one's. The
 * segments meet because each ends at the x the next one starts from, so the
 * line is continuous no matter how uneven the stops are — and they are very
 * uneven, one line for 2020 against six for 2022-24.
 *
 * That is also why this runs down the page where the board runs across it. A
 * horizontal track gives every stop the same column width, so either the long
 * stop overflows or the short ones sit in a sea of space. Vertically each
 * takes the height it needs, and the route runs the way the page scrolls.
 */

/** Rail column width in px; the curve is described inside this box. */
const RAIL = 72;

/**
 * Where each node sits across the rail, as a fraction of its width. The
 * alternation is what makes the line wander instead of dropping straight —
 * these are hand-set rather than generated so the bends fall in a rhythm
 * rather than a zigzag.
 */
const NODE_X = [0.3, 0.7, 0.26, 0.72, 0.36];

export function Journey() {
  const stops = journey.milestones;

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

        <RevealGroup className="mt-16 flex flex-col sm:mt-20">
          {stops.map((stop, index) => {
            const isLast = index === stops.length - 1;
            const from = NODE_X[index] ?? 0.3;
            const to = NODE_X[index + 1] ?? from;
            const hasPlace = "place" in stop && Boolean(stop.place);

            return (
              <RevealItem key={stop.period}>
                <article className="relative grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
                  <div
                    className="relative shrink-0"
                    style={{ width: RAIL }}
                    aria-hidden
                  >
                    {/*
                      This stop's segment of the route, from its own node down
                      to the next. preserveAspectRatio="none" lets one path
                      description stretch to any content height — a tall stop
                      simply draws a longer, lazier curve.
                    */}
                    {!isLast && (
                      <svg
                        className="absolute inset-0 h-full w-full overflow-visible"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        focusable="false"
                      >
                        <defs>
                          <linearGradient
                            id={`route-${index}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={`var(--route-${index + 1})`}
                            />
                            <stop
                              offset="100%"
                              stopColor={`var(--route-${index + 2})`}
                            />
                          </linearGradient>
                        </defs>
                        {/* The bloom, then the line itself over it. */}
                        <path
                          d={segment(from, to)}
                          fill="none"
                          stroke={`url(#route-${index})`}
                          strokeWidth="6"
                          strokeLinecap="round"
                          opacity="0.28"
                          style={{ filter: "blur(4px)" }}
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          d={segment(from, to)}
                          fill="none"
                          stroke={`url(#route-${index})`}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    )}

                    {/*
                      The node. Filled where the stop is an office, hollow
                      where it is a moment on the road between two — which is
                      what 2020 is, and how the board draws it.
                    */}
                    <span
                      className="absolute flex size-6 -translate-x-1/2 items-center justify-center"
                      style={{ left: from * RAIL, top: "0.35rem" }}
                    >
                      <span
                        className="absolute inset-0 rounded-full opacity-40 blur-[7px]"
                        style={{ background: `var(--route-${index + 1})` }}
                      />
                      <span
                        className="relative size-3 rounded-full"
                        style={
                          hasPlace
                            ? { background: `var(--route-${index + 1})` }
                            : {
                                background: "var(--surface-base)",
                                boxShadow: `inset 0 0 0 2px var(--route-${index + 1})`,
                              }
                        }
                      />
                    </span>
                  </div>

                  <div className="min-w-0 pb-12 sm:pb-14">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3
                        className="text-h3 font-normal leading-none tracking-tight sm:text-h2"
                        style={{ color: `var(--route-${index + 1})` }}
                      >
                        {stop.period}
                      </h3>
                      {hasPlace && (
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
            );
          })}
        </RevealGroup>

        {/*
          The figures, three of which come straight out of the 2022-24 stop.
          They sit under the route because they are what it adds up to.
        */}
        <Reveal
          delay={0.15}
          className="mt-4 border-t border-[var(--glass-border)] pt-10"
        >
          <StatRow stats={journey.figures.map((figure) => ({ ...figure }))} />
        </Reveal>
      </div>
    </section>
  );
}

/**
 * One segment of the route, in the rail's 0-100 box: out of this stop's node,
 * bending toward the next one's, arriving vertical so the joins are smooth.
 * The control points sit at 40% and 62% rather than symmetrically, which
 * makes the bend lean into the second half of the drop — closer to a road
 * easing round a corner than a sine wave.
 */
function segment(from: number, to: number) {
  const x1 = from * 100;
  const x2 = to * 100;
  return `M ${x1} 2 C ${x1} 40, ${x2} 62, ${x2} 100`;
}
