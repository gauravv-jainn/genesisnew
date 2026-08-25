"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

/**
 * The tools stack — built to p03_1, for the spec's "TOOLS WE USE".
 *
 * A column of sources on the left, each feeding a glowing curve that
 * converges on a single point beside the studio mark. The curves are one SVG
 * with a shared gradient, and the flow is a stroke-dashoffset animation, so
 * the whole thing is a handful of paths rather than a particle system.
 *
 * The convergence is the message: many inputs, one output.
 */

export type Tool = {
  label: string;
  /** Optional second line, e.g. a file type. */
  detail?: string;
};

export function ToolsStack({
  tools,
  destination,
  badge,
  className,
}: {
  tools: Tool[];
  destination: string;
  badge?: string;
  className?: string;
}) {
  // Unique per instance so two stacks on one page cannot collide on defs ids.
  const raw = useId().replace(/:/g, "");
  const gradientId = `tools-grad-${raw}`;
  const glowId = `tools-glow-${raw}`;

  // Curves converge on this point, in viewBox units.
  // Left of the destination block's edge, with air between them. At 560 the
  // curves and the focus dot were drawn ~150px INSIDE the wordmark.
  const FOCUS_X = 445;
  const FOCUS_Y = 200;

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        viewBox="0 0 720 400"
        className="w-full"
        aria-hidden
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6b6b70" stopOpacity="0.2" />
            <stop offset="45%" stopColor="#ffc516" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#ffc516" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffc516" stopOpacity="0.7" />
          </linearGradient>

          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#${glowId})`}>
          {tools.map((tool, index) => {
            const startY = 40 + index * (320 / Math.max(1, tools.length - 1));
            // A single control point pulled toward the focus gives the gentle
            // S-bend of the reference without needing a cubic.
            const path = `M 150 ${startY} Q ${FOCUS_X - 180} ${startY} ${FOCUS_X} ${FOCUS_Y}`;

            return (
              <g key={tool.label}>
                <path
                  d={path}
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                {/* The travelling pulse. */}
                <path
                  d={path}
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeDasharray="26 320"
                  className=""
                  style={
                    {
                      "--flow-duration": `${(3.4 + index * 0.42).toFixed(2)}s`,
                      animationDelay: `-${(index * 0.6).toFixed(2)}s`,
                    } as React.CSSProperties
                  }
                />
                {/* Emitter dot at the source. */}
                <circle cx="150" cy={startY} r="3" fill="#ffc516" opacity="0.85" />
              </g>
            );
          })}
        </g>

        {/* Where everything arrives. */}
        <circle cx={FOCUS_X} cy={FOCUS_Y} r="5" fill="#ffffff" opacity="0.9" />
        <circle cx={FOCUS_X} cy={FOCUS_Y} r="14" fill="#ffc516" opacity="0.18" />
      </svg>

      {/*
        Source labels, positioned from THE SAME NUMBERS as the curves.

        They used to be laid out with `justify-between` and `py-[9%]`, which is
        a different rhythm from `startY = 40 + index * (320 / (n - 1))`. The
        two only agreed in the middle: the first and last curves left their dot
        roughly 46px — a label and a half — from the label they were supposed
        to be emitting from, so the top and bottom rows visibly floated
        unconnected. Percentage padding on a box whose height comes from the
        SVG's aspect ratio was never going to line up with viewBox units.
      */}
      <ul className="absolute inset-y-0 left-0 w-[21%]">
        {tools.map((tool, index) => (
          <li
            key={tool.label}
            style={{
              position: "absolute",
              insetInline: 0,
              // Same expression as startY, expressed as a share of the 400-unit
              // viewBox height.
              top: `${((40 + index * (320 / Math.max(1, tools.length - 1))) / 400) * 100}%`,
              transform: "translateY(-50%)",
            }}
            className="glass flex items-center justify-end gap-2 rounded-field px-3 py-2 text-right"
          >
            <span className="min-w-0">
              <span className="block truncate text-micro font-medium text-bone">
                {tool.label}
              </span>
              {tool.detail && (
                <span className="block truncate text-micro text-faint">
                  {tool.detail}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* The destination mark. */}
      <div className="absolute right-0 top-1/2 flex w-[42%] -translate-y-1/2 flex-col items-start gap-2 pl-6">
        <div className="flex items-center gap-2">
          <span className="text-h3 font-semibold tracking-tight text-bone sm:text-h3">
            {destination}
          </span>
          {badge && (
            <span className="glass rounded-full px-2 py-0.5 text-micro text-ash">
              {badge}
            </span>
          )}
        </div>
        <span
          className="h-[3px] w-full max-w-[14rem] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #6b6b70 0%, #ffc516 46%, #ffc516 100%)",
          }}
        />
      </div>
    </div>
  );
}
