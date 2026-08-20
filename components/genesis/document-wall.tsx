import { cn } from "@/lib/utils";

/**
 * A curved wall of lit documents — the landing reference on page 1.
 *
 * The panels sit on a CYLINDER, not in a row. Each is absolutely centred and
 * then placed by `rotateY(θ) translateZ(R)` about a shared origin, so the
 * whole set wraps toward the viewer and adjacent edges nearly meet.
 *
 * An earlier version laid them out with flex and rotated each in place. That
 * spreads them apart and reads as a bar chart: the rotation tilts a panel but
 * never moves it onto an arc. It also sized them with percentage heights
 * inside an auto-height flex row, which computes to zero — so the wall did
 * not render at all.
 *
 * Panel width is derived from the radius and the angular step, so the sheets
 * stay just shy of touching at any size instead of being tuned by eye.
 */
export function DocumentWall({
  panels = 7,
  tone = "amber",
  className,
}: {
  panels?: number;
  tone?: "amber" | "crimson" | "cool";
  className?: string;
}) {
  const TONES = {
    amber: { hot: "255 238 198", mid: "255 165 72", rim: "214 104 30" },
    crimson: { hot: "255 228 230", mid: "255 88 100", rim: "196 26 46" },
    cool: { hot: "234 244 255", mid: "156 190 232", rim: "84 124 184" },
  } as const;

  const { hot, mid, rim } = TONES[tone];

  // Cylinder geometry. Radius in px; the step is the angle between panels.
  const RADIUS = 520;
  const STEP = 15;
  const middle = (panels - 1) / 2;

  // Chord width for one step, minus a hair so the sheets do not intersect.
  const width = 2 * RADIUS * Math.tan((STEP * Math.PI) / 360) * 0.94;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ perspective: "1100px", perspectiveOrigin: "50% 46%" }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{ transformStyle: "preserve-3d", transform: `translateZ(-${RADIUS}px)` }}
      >
        {Array.from({ length: panels }).map((_, index) => {
          const offset = index - middle;
          const angle = offset * STEP;
          const distance = Math.abs(offset) / middle;

          // The centre sheet stands tallest; the flanks fall away.
          const height = 460 - distance * 150;
          // Flanks turn from the light, so they read dimmer without a filter.
          const brightness = 1 - distance * 0.46;

          return (
            <div
              key={index}
              className="absolute rounded-[2px]"
              style={{
                width: `${width.toFixed(1)}px`,
                height: `${height.toFixed(0)}px`,
                left: `${(-width / 2).toFixed(1)}px`,
                top: `${(-height / 2).toFixed(0)}px`,
                transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                background: `linear-gradient(178deg,
                  rgb(${hot} / ${(0.96 * brightness).toFixed(3)}) 0%,
                  rgb(${mid} / ${(0.82 * brightness).toFixed(3)}) 58%,
                  rgb(${rim} / ${(0.5 * brightness).toFixed(3)}) 100%)`,
                boxShadow: `0 0 90px 24px rgb(${mid} / ${(0.3 * brightness).toFixed(3)})`,
              }}
            >
              {/* Ruled lines — the ghost of print on a page. */}
              <div
                className="absolute inset-0 rounded-[2px] opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(180deg, rgb(96 44 4 / 0.5) 0px, rgb(96 44 4 / 0.5) 1px, transparent 1px, transparent 6px)",
                  maskImage:
                    "linear-gradient(180deg, transparent 5%, black 12%, black 90%, transparent 98%)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* The light the wall throws back into the room. */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background: `radial-gradient(58% 100% at 50% 10%, rgb(${mid} / 0.26) 0%, transparent 72%)`,
        }}
      />
    </div>
  );
}
