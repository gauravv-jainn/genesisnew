import { cn } from "@/lib/utils";

/**
 * An arc of lit panels standing in the dark — the landing-page reference on
 * page 1 of the spec (the figure facing a curved wall of glowing documents).
 *
 * Each panel is a sheet catching the light, angled so the row curves away on
 * both sides. Panels nearer the centre stand taller and burn brighter, which
 * is what gives the arc its depth; the ruled lines are the ghost of text on a
 * page, not real content.
 *
 * Pure CSS: no images, so it costs nothing to load and scales to any width.
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
    amber: { hot: "255 236 190", mid: "255 158 60", rim: "255 120 40" },
    crimson: { hot: "255 226 226", mid: "255 80 92", rim: "220 30 50" },
    cool: { hot: "232 242 255", mid: "150 185 230", rim: "90 130 190" },
  } as const;

  const { hot, mid, rim } = TONES[tone];
  const middle = (panels - 1) / 2;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden",
        className,
      )}
      style={{ perspective: "1400px" }}
    >
      <div className="flex items-end gap-[1.2%]" style={{ transformStyle: "preserve-3d" }}>
        {Array.from({ length: panels }).map((_, index) => {
          // 0 at the centre panel, 1 at the outermost.
          const offset = (index - middle) / middle;
          const distance = Math.abs(offset);

          // Panels rotate away from the viewer the further out they sit.
          const rotateY = offset * 46;
          const height = 82 - distance * 26;
          const brightness = 1 - distance * 0.42;

          return (
            <div
              key={index}
              className="relative w-[9vw] max-w-[7.5rem] origin-bottom rounded-[3px]"
              style={{
                height: `${height}%`,
                transform: `rotateY(${-rotateY}deg) translateZ(${-distance * 90}px)`,
                background: `linear-gradient(180deg, rgb(${hot} / ${0.95 * brightness}) 0%, rgb(${mid} / ${0.8 * brightness}) 55%, rgb(${rim} / ${0.5 * brightness}) 100%)`,
                boxShadow: `0 0 80px 20px rgb(${mid} / ${0.28 * brightness})`,
              }}
            >
              {/* Ruled lines standing in for printed text. */}
              <div
                className="absolute inset-0 rounded-[3px] opacity-25"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(180deg, rgb(90 40 0 / 0.55) 0px, rgb(90 40 0 / 0.55) 1px, transparent 1px, transparent 7px)",
                  maskImage:
                    "linear-gradient(180deg, transparent 6%, black 14%, black 88%, transparent 96%)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* The glow the wall throws into the room. */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: `radial-gradient(60% 100% at 50% 0%, rgb(${mid} / 0.3) 0%, transparent 70%)`,
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}
