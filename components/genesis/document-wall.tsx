import { documentSheet } from "@/lib/textures";
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
 *
 * THE SHEETS ARE LIT FROM BEHIND. That is the whole character of the
 * reference: they are not warm rectangles standing in a room, they are the
 * room's only light source, and what you read on them is the shadow of print
 * coming through the paper. Hence `documentSheet()` rather than ruled lines,
 * and hence `intensity` — the landing scene runs this near 1, where the
 * sheets are close to white-hot, while decorative uses run it far lower.
 */
/** Scales a "r g b" triple toward black, keeping the sheet fully opaque. */
function dim(rgb: string, k: number) {
  return rgb
    .split(" ")
    .map((channel) => Math.round(Math.min(255, Number(channel) * k)))
    .join(" ");
}

export function DocumentWall({
  panels = 7,
  tone = "amber",
  /** Cylinder radius in px. Larger = a flatter, wider wall. */
  radius = 520,
  /** Angle between adjacent panels, degrees. */
  step = 15,
  /** Height of the centre panel in px; flanks fall away from this. */
  height = 460,
  /** Falloff in px between the centre panel and the outermost. */
  falloff = 150,
  /** 0–1. How hot the sheets burn. The landing scene runs near 1. */
  intensity = 0.62,
  perspective = 1100,
  className,
}: {
  panels?: number;
  tone?: "amber" | "crimson" | "cool";
  radius?: number;
  step?: number;
  height?: number;
  falloff?: number;
  intensity?: number;
  perspective?: number;
  className?: string;
}) {
  const TONES = {
    amber: { hot: "255 226 140", mid: "255 140 30", rim: "184 62 6" },
    crimson: { hot: "255 228 230", mid: "255 88 100", rim: "196 26 46" },
    cool: { hot: "234 244 255", mid: "156 190 232", rim: "84 124 184" },
  } as const;

  const { hot, mid, rim } = TONES[tone];
  const middle = (panels - 1) / 2;

  // Chord width for one step, minus a hair so the sheets do not intersect.
  const width = 2 * radius * Math.tan((step * Math.PI) / 360) * 0.94;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ perspective: `${perspective}px`, perspectiveOrigin: "50% 46%" }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{ transformStyle: "preserve-3d", transform: `translateZ(-${radius}px)` }}
      >
        {Array.from({ length: panels }).map((_, index) => {
          const offset = index - middle;
          const angle = offset * step;
          const distance = middle === 0 ? 0 : Math.abs(offset) / middle;

          // The centre sheet stands tallest; the flanks fall away.
          const panelHeight = height - distance * falloff;
          // Flanks turn from the light, so they read dimmer without a filter.
          const brightness = (1 - distance * 0.4) * intensity;

          return (
            <div
              key={index}
              className="absolute rounded-[2px]"
              style={{
                width: `${width.toFixed(1)}px`,
                height: `${panelHeight.toFixed(0)}px`,
                left: `${(-width / 2).toFixed(1)}px`,
                top: `${(-panelHeight / 2).toFixed(0)}px`,
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                // Hottest at the top, where the source sits behind the wall.
                //
                // The falloff is applied to the COLOUR, not to alpha. Dimming
                // a flank by dropping its opacity made the sheet translucent
                // and you read the room straight through it; paper is opaque,
                // and a sheet turned away from a light gets darker, not
                // see-through.
                background: `linear-gradient(177deg,
                  rgb(${dim(hot, 1.06 * brightness)}) 0%,
                  rgb(${dim(hot, brightness)}) 46%,
                  rgb(${dim(mid, 0.96 * brightness)}) 78%,
                  rgb(${dim(rim, 0.72 * brightness)}) 100%)`,
                boxShadow: `0 0 120px 34px rgb(${mid} / ${(0.34 * brightness).toFixed(3)})`,
              }}
            >
              {/* The print, read as shadow through a backlit sheet. */}
              <div
                className="absolute inset-0 rounded-[2px]"
                style={{
                  backgroundImage: documentSheet({ seed: index * 7 + 3 }),
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                  opacity: 0.62 + distance * 0.12,
                  maskImage:
                    "linear-gradient(180deg, transparent 2%, black 9%, black 92%, transparent 99%)",
                }}
              />

              {/* Sheen down the sheet, so it reads as paper rather than a card. */}
              <div
                className="absolute inset-0 rounded-[2px] opacity-25"
                style={{
                  background:
                    "linear-gradient(96deg, rgb(255 244 214 / 0.22) 0%, transparent 24%, transparent 76%, rgb(120 52 8 / 0.22) 100%)",
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
          background: `radial-gradient(58% 100% at 50% 10%, rgb(${mid} / ${(0.42 * intensity).toFixed(3)}) 0%, transparent 72%)`,
        }}
      />
    </div>
  );
}
