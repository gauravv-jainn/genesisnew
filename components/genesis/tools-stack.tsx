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
  const FOCUS_X = 560;
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
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.15" />
            <stop offset="45%" stopColor="#4ade80" stopOpacity="0.75" />
            <stop offset="80%" stopColor="#a78bfa" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff2d3f" stopOpacity="0.7" />
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
                  className="motion-safe:animate-[genesis-flow_var(--flow-duration)_linear_infinite]"
                  style={
                    {
                      "--flow-duration": `${(3.4 + index * 0.42).toFixed(2)}s`,
                      animationDelay: `-${(index * 0.6).toFixed(2)}s`,
                    } as React.CSSProperties
                  }
                />
                {/* Emitter dot at the source. */}
                <circle cx="150" cy={startY} r="3" fill="#4ade80" opacity="0.85" />
              </g>
            );
          })}
        </g>

        {/* Where everything arrives. */}
        <circle cx={FOCUS_X} cy={FOCUS_Y} r="5" fill="#ffffff" opacity="0.9" />
        <circle cx={FOCUS_X} cy={FOCUS_Y} r="14" fill="#a78bfa" opacity="0.16" />
      </svg>

      {/* Source labels, laid over the SVG at the same vertical rhythm. */}
      <ul className="absolute inset-y-0 left-0 flex w-[21%] flex-col justify-between py-[9%]">
        {tools.map((tool) => (
          <li
            key={tool.label}
            className="glass flex items-center justify-end gap-2 rounded-lg px-2.5 py-1.5 text-right"
          >
            <span className="min-w-0">
              <span className="block truncate text-[11px] font-medium text-bone">
                {tool.label}
              </span>
              {tool.detail && (
                <span className="block truncate text-[9px] text-faint">
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
          <span className="text-xl font-semibold tracking-tight text-bone sm:text-2xl">
            {destination}
          </span>
          {badge && (
            <span className="glass rounded-full px-2 py-0.5 text-[10px] text-ash">
              {badge}
            </span>
          )}
        </div>
        <span
          className="h-[3px] w-full max-w-[14rem] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, #2dd4bf 0%, #4ade80 34%, #a78bfa 70%, #ff2d3f 100%)",
          }}
        />
      </div>
    </div>
  );
}
