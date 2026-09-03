"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

import { Spectrum } from "@/components/genesis/atmosphere";
import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { journey } from "@/lib/home-content";

/**
 * "How Genesis got here" — a route that draws itself as you scroll.
 *
 * THE BRIEF ASKS FOR A JOURNEY MAP, NOT A TIMELINE, and the difference is
 * motion: the route is drawn, the stops arrive as it reaches them, and the
 * figures count up at the end. A list of years with dots beside them is the
 * thing it is explicitly not meant to be.
 *
 * WHY THE PATH IS MEASURED RATHER THAN WRITTEN. The stops are wildly uneven —
 * one line for 2020 against six for 2022-24 — so their positions depend on
 * how the text wraps, which depends on the viewport. A hardcoded path in a
 * stretched viewBox (what this section used to do, one SVG segment per stop)
 * cannot bend through them; it can only be squashed, and the curve distorts
 * differently in every column width. So the nodes are measured after layout
 * and the curve is generated through their real centres, in real pixels. It
 * is regenerated on resize.
 *
 * WHY IT SCRUBS BUT DOES NOT PIN. Pinning was tried on this site once, for
 * the services-to-portfolio camera turn, and it was removed: it held the page
 * for 160% of the viewport to deliver one rotation and collapsed into
 * overlapping sections under Reduce Motion. Progress here is simply the
 * section's own travel through the viewport, so scrolling never stops being
 * scrolling and the section is exactly as tall as its content.
 *
 * UNDER REDUCE MOTION the route is drawn, every stop is visible and the
 * figures show their values. Nothing is hidden behind an animation that will
 * not play — which is the failure mode that matters, because a scroll-drawn
 * line that never draws leaves the section blank.
 */

/**
 * Where each node sits across the rail, as a fraction of its width. Hand-set
 * so the bends fall in a rhythm rather than a zigzag.
 */
const NODE_X = [0.3, 0.7, 0.26, 0.72, 0.36];
const RAIL = 72;

export function Journey() {
  const stops = journey.milestones;
  const railRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });
  /** How far the route has been drawn, 0-1. Drives the nodes too. */
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    gsap.registerPlugin(ScrollTrigger);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    /** Measure the container and every node centre, in the rail's own space. */
    const measure = () => {
      const bounds = rail.getBoundingClientRect();
      setBox({ w: bounds.width, h: bounds.height });

      const points = nodeRefs.current.map((node) => {
        if (!node) return null;
        const r = node.getBoundingClientRect();
        return {
          x: r.left - bounds.left + r.width / 2,
          y: r.top - bounds.top + r.height / 2,
        };
      });
      return points.filter(Boolean) as { x: number; y: number }[];
    };

    const build = () => {
      const points = measure();
      const path = pathRef.current;
      if (!path || points.length < 2) return;

      const d = curveThrough(points);
      path.setAttribute("d", d);
      glowRef.current?.setAttribute("d", d);

      const length = path.getTotalLength();
      for (const el of [path, glowRef.current]) {
        if (!el) continue;
        el.style.strokeDasharray = `${length}`;
        el.style.strokeDashoffset = `${length}`;
      }
      return length;
    };

    let length = build() ?? 0;

    const paint = (value: number) => {
      setProgress(value);
      for (const el of [pathRef.current, glowRef.current]) {
        if (el) el.style.strokeDashoffset = `${length * (1 - value)}`;
      }
    };

    if (still.matches) {
      paint(1);
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: rail,
      // The route starts drawing as the first stop clears the fold and
      // finishes as the last one leaves — the section's own travel, no pin.
      start: "top 80%",
      end: "bottom 60%",
      scrub: 0.6,
      onUpdate: (self) => paint(self.progress),
    });

    const onResize = () => {
      length = build() ?? length;
      paint(trigger.progress);
      ScrollTrigger.refresh();
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(rail);

    return () => {
      trigger.kill();
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="journey"
      className="grain relative isolate overflow-hidden bg-void py-24 sm:py-32"
    >
      <Spectrum />

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

        <div ref={railRef} className="relative mt-16 flex flex-col sm:mt-20">
          {/*
            One continuous route over the whole column, sized in real pixels
            so the measured node centres map to it one-to-one. No viewBox
            stretching, so the curve is the same shape at every width.
          */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            width={box.w || undefined}
            height={box.h || undefined}
            viewBox={box.w ? `0 0 ${box.w} ${box.h}` : undefined}
            focusable="false"
          >
            <defs>
              <linearGradient id="journey-route" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--route-1)" />
                <stop offset="28%" stopColor="var(--route-2)" />
                <stop offset="55%" stopColor="var(--route-3)" />
                <stop offset="80%" stopColor="var(--route-4)" />
                <stop offset="100%" stopColor="var(--route-5)" />
              </linearGradient>
            </defs>
            <path
              ref={glowRef}
              fill="none"
              stroke="url(#journey-route)"
              strokeWidth="7"
              strokeLinecap="round"
              opacity="0.3"
              style={{ filter: "blur(5px)" }}
            />
            <path
              ref={pathRef}
              fill="none"
              stroke="url(#journey-route)"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>

          {stops.map((stop, index) => {
            const from = NODE_X[index] ?? 0.3;
            const hasPlace = "place" in stop && Boolean(stop.place);
            /*
              A stop lights up once the route reaches it — divided by the
              NUMBER of stops rather than the gaps between them, so the last
              one lands at 80% of the draw instead of at 100%.

              Dividing by (length - 1) put the final stop's threshold at 1.0,
              which is only met at the very end of the scrub range — by which
              point the section is nearly scrolled past. The result was a
              400px hole where Ghatkopar should be, and the most important
              stop on the route, the AI era, arriving after the reader had
              left. Everything now finishes with a fifth of the range to
              spare.
            */
            const at = (index / stops.length) * 0.95;
            const reached = progress >= at - 0.04;

            return (
              <article
                key={stop.period}
                className="relative grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6"
              >
                <div className="relative shrink-0" style={{ width: RAIL }} aria-hidden>
                  <span
                    ref={(el) => {
                      nodeRefs.current[index] = el;
                    }}
                    className="absolute flex size-6 -translate-x-1/2 items-center justify-center"
                    style={{ left: from * RAIL, top: "0.35rem" }}
                  >
                    <span
                      className="absolute inset-0 rounded-full blur-[7px] transition-opacity duration-500"
                      style={{
                        background: `var(--route-${index + 1})`,
                        opacity: reached ? 0.45 : 0,
                      }}
                    />
                    <span
                      className="relative size-3 rounded-full transition-all duration-500"
                      style={
                        hasPlace
                          ? {
                              background: `var(--route-${index + 1})`,
                              transform: reached ? "scale(1)" : "scale(0.4)",
                              opacity: reached ? 1 : 0.35,
                            }
                          : {
                              background: "var(--surface-base)",
                              boxShadow: `inset 0 0 0 2px var(--route-${index + 1})`,
                              transform: reached ? "scale(1)" : "scale(0.4)",
                              opacity: reached ? 1 : 0.35,
                            }
                      }
                    />
                  </span>
                </div>

                {/*
                  The stop itself arrives with the route. Transform and opacity
                  only — nothing here animates a layout property, so the whole
                  scrub stays on the compositor.
                */}
                <div
                  className="min-w-0 pb-12 transition-[opacity,transform] duration-700 ease-out sm:pb-14"
                  style={{
                    opacity: reached ? 1 : 0,
                    transform: reached ? "none" : "translateY(14px)",
                  }}
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3
                      className="text-h3 font-normal leading-none tracking-tight sm:text-h2"
                      style={{ color: `var(--route-${index + 1})` }}
                    >
                      {stop.period}
                    </h3>
                    {hasPlace && (
                      <span className="micro-label !text-faint">{stop.place}</span>
                    )}
                  </div>

                  <ul className="mt-4 flex flex-col gap-1.5">
                    {stop.lines.map((line) => (
                      <li key={line} className="text-body leading-relaxed text-ash">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        {/* What the route adds up to, counted up once it has arrived. */}
        <div className="mt-4 grid gap-px border-t border-[var(--glass-border)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {journey.figures.map((figure) => (
            <div key={figure.label} className="flex flex-col gap-1 px-1">
              <span className="text-h2 font-normal leading-none tracking-tight text-bone">
                <CountUp value={figure.value} run={progress > 0.85} />
              </span>
              <span className="micro-label !text-faint">{figure.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * A smooth curve through the measured node centres.
 *
 * Control points are vertical and sit at 45% of each gap, so every stop is
 * entered and left travelling straight down — which is what stops the joins
 * showing as corners and reads as a road easing round a bend rather than a
 * sine wave.
 */
function curveThrough(points: { x: number; y: number }[]): string {
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const lift = (b.y - a.y) * 0.45;
    d += ` C ${a.x.toFixed(1)} ${(a.y + lift).toFixed(1)}, ${b.x.toFixed(1)} ${(
      b.y - lift
    ).toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  return d;
}

/**
 * Counts a figure up when the route reaches it.
 *
 * The values are strings written for people — "1,00,000+", "1,500+" — so the
 * digits are counted and everything else in the string is left exactly where
 * it was. Parsing them into numbers and reformatting would quietly turn the
 * Indian grouping in "1,00,000+" into "100,000+".
 */
function CountUp({ value, run }: { value: string; run: boolean }) {
  const [shown, setShown] = useState(value);
  const done = useRef(false);

  useEffect(() => {
    if (!run || done.current) return;
    done.current = true;

    const digits = value.replace(/\D/g, "");
    if (!digits) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = Number(digits);
    const start = performance.now();
    const DURATION = 900;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // Ease out, so it decelerates into the real figure.
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(target * eased).toString();
      // Rebuild the original string, swapping only its digits.
      let i = 0;
      const padded = current.padStart(digits.length, "0");
      setShown(value.replace(/\d/g, () => padded[i++] ?? "0"));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    // No synchronous set here: the first frame runs at t=0, where the eased
    // value is 0, so it renders the zero-padded string on its own.
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, value]);

  return <>{shown}</>;
}
