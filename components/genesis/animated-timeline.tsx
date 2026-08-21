"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

import { isPending } from "@/lib/home-content";
import { cn } from "@/lib/utils";

/**
 * Animated vertical timeline — the "Our Journey" spine (img-004).
 *
 * A dim rail runs the full height; a lit rail scales up through it as the
 * section scrolls, and each milestone's date pill and marker fade in as they
 * arrive. Scroll progress is spring-smoothed so the fill glides rather than
 * tracking the wheel one-to-one.
 */

export type Milestone = {
  /** e.g. "Mar 2024". Absent while the date is still unwritten. */
  date?: string;
  title: string;
  description?: string;
};

export function AnimatedTimeline({
  milestones,
  tone = "amber",
  className,
}: {
  milestones: Milestone[];
  tone?: "amber" | "crimson" | "teal";
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start filling when the section's top reaches 80% down the viewport;
    // finish when its bottom passes the 40% line.
    offset: ["start 0.8", "end 0.4"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  const railColor =
    tone === "crimson"
      ? "from-crimson via-crimson-soft to-transparent"
      : tone === "teal"
        ? "from-teal via-teal/60 to-transparent"
        : "from-amber via-amber-light to-transparent";

  const glowColor =
    tone === "crimson"
      ? "rgb(255 45 63 / 0.5)"
      : tone === "teal"
        ? "rgb(45 212 191 / 0.45)"
        : "rgb(255 138 61 / 0.5)";

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Unlit rail */}
      <div
        aria-hidden
        className="absolute left-[7.5rem] top-0 h-full w-px bg-white/10 sm:left-[9.5rem]"
      />

      {/* Lit rail, driven by scroll progress */}
      <motion.div
        aria-hidden
        style={{ scaleY, boxShadow: `0 0 18px 1px ${glowColor}` }}
        className={cn(
          "absolute left-[7.5rem] top-0 h-full w-px origin-top bg-gradient-to-b sm:left-[9.5rem]",
          railColor,
        )}
      />

      <ol className="relative flex flex-col gap-14">
        {milestones.map((milestone, index) => (
          <motion.li
            key={milestone.title}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
            className="relative grid grid-cols-[7.5rem_1fr] items-start gap-x-8 sm:grid-cols-[9.5rem_1fr]"
          >
            {/*
              Date pill, right-aligned against the rail. Omitted entirely when
              the date is unwritten: the column keeps its width so the rail
              stays straight, but nothing is printed in it. An unwritten date
              must never surface as a placeholder next to real history.
            */}
            <div className="flex justify-end pr-0">
              {!isPending(milestone.date) && (
                <span className="glass rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide text-bone">
                  {milestone.date}
                </span>
              )}
            </div>

            {/* Node sitting on the rail */}
            <span
              aria-hidden
              className="absolute left-[7.5rem] top-2.5 size-2.5 -translate-x-1/2 rounded-full border border-white/25 bg-ink sm:left-[9.5rem]"
              style={{ boxShadow: `0 0 12px 2px ${glowColor}` }}
            />

            <div className="pl-4">
              <h3 className="text-lg font-semibold tracking-tight text-bone">
                {milestone.title}
              </h3>
              {!isPending(milestone.description) && (
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-ash">
                  {milestone.description}
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
