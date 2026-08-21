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
/**
 * Interpolates one "r g b" triple toward another.
 *
 * This is how the flanks are darkened, and it replaced a plain multiply.
 * Sampled down p01_1's sheets with a median (which rejects the printed ink):
 *
 *     centre sheet  y19% rgb(252,235,108)  y29% rgb(252,175, 48)
 *     outer  sheet  y20% rgb(246,111, 12)  y30% rgb(250,133, 20)
 *
 * Red is pegged at 246-252 on every sheet at every height. The flanks are not
 * greyer versions of the centre — they are the SAME red pushed much further
 * into orange, and darker only because green and blue have collapsed (R-B goes
 * +144 at the centre's top to +234 on the outer sheet). A neutral multiply
 * cannot express that: it drains ivory to olive-khaki, which is what turned
 * the outer sheets into dusty parchment that dissolved into the room glow.
 */
function lerpRgb(from: string, to: string, t: number) {
  const a = from.split(" ").map(Number);
  const b = to.split(" ").map(Number);
  return a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(" ");
}

export function DocumentWall({
  panels = 7,
  tone = "amber",
  /**
   * Cylinder radius as a CSS LENGTH, not a number. Larger = a flatter, wider
   * wall.
   *
   * Every dimension here used to be a fixed px number, which meant the wall
   * was 59% of a 1440px frame, 44% of 1920 and 33% of a 2560 ultrawide — a
   * small glowing fan floating in a big empty room on a large monitor — while
   * at 390px only the centre sheet and two slivers survived, cropping the
   * entire idea out of existence. Passing a length lets the landing scene
   * drive it from container units so the wall's outer edge always lands near
   * the frame edge; the derived panel width follows through calc().
   */
  radius = "520px",
  /** Angle between adjacent panels, degrees. */
  step = 15,
  /** Height of the centre panel, as a CSS length. */
  height = "460px",
  /** 0–1. Flanks shrink toward this share of `height`. 0 keeps them equal. */
  falloff = 0.33,
  /** 0–1. How hot the sheets burn. The landing scene runs near 1. */
  intensity = 0.62,
  perspective = "1100px",
  className,
}: {
  panels?: number;
  tone?: "amber" | "crimson" | "cool";
  radius?: string;
  step?: number;
  height?: string;
  falloff?: number;
  intensity?: number;
  perspective?: string;
  className?: string;
}) {
  const TONES = {
    // Stops read straight off p01_1; `flank` is the colour the outermost
    // sheet actually is, and every stop is interpolated toward it by the
    // panel's distance from centre.
    amber: { hot: "252 235 108", mid: "252 190 55", rim: "236 132 22", flank: "246 111 12" },
    crimson: { hot: "255 228 230", mid: "255 88 100", rim: "196 26 46", flank: "214 34 52" },
    cool: { hot: "234 244 255", mid: "156 190 232", rim: "84 124 184", flank: "96 140 200" },
  } as const;

  const { hot, mid, rim, flank } = TONES[tone];
  const middle = (panels - 1) / 2;

  // Chord width for one step, minus a hair so the sheets do not intersect.
  // Derived from the radius through calc(), so it tracks whatever unit the
  // caller expressed the radius in.
  const widthFactor = 2 * Math.tan((step * Math.PI) / 360) * 0.94;
  const width = `calc(${radius} * ${widthFactor.toFixed(5)})`;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ perspective, perspectiveOrigin: "50% 46%" }}
    >
      {/*
        CONCAVE, wrapping toward the camera.

        The previous composition was `rotateY(θ) translateZ(R)` under a parent
        at `translateZ(-R)`, which puts a panel at z = R(cos θ − 1): the flanks
        RECEDE. Combined with a centre panel that was also the tallest, the
        wall rendered as a symmetric pyramid — a fan folding away from you,
        which is the same "bar chart" failure this file's history already
        records once.

        Flipping the sign of the inner translate gives z = R(1 − cos θ), so the
        flanks come FORWARD and the wall closes around the figure the way the
        reference's amphitheatre does.
      */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{ transformStyle: "preserve-3d", transform: `translateZ(${radius})` }}
      >
        {Array.from({ length: panels }).map((_, index) => {
          const offset = index - middle;
          const angle = offset * step;
          const distance = middle === 0 ? 0 : Math.abs(offset) / middle;

          // The centre sheet stands tallest; the flanks fall away. A ratio
          // rather than a px delta, so it survives the change to CSS lengths.
          const panelHeight = `calc(${height} * ${(1 - distance * falloff).toFixed(4)})`;
          // How far this panel's colour is pushed toward the flank orange.
          const turn = distance * 0.9;
          const lit = (c: string) => lerpRgb(lerpRgb(c, flank, turn), "0 0 0", 1 - intensity);

          return (
            <div
              key={index}
              className="absolute rounded-[2px]"
              style={{
                width,
                height: panelHeight,
                left: `calc(${width} / -2)`,
                top: `calc(${panelHeight} / -2)`,
                transform: `rotateY(${angle}deg) translateZ(calc(${radius} * -1))`,
                // Hottest at the top, where the source sits behind the wall.
                //
                // The falloff is applied to the COLOUR, not to alpha. Dimming
                // a flank by dropping its opacity made the sheet translucent
                // and you read the room straight through it; paper is opaque,
                // and a sheet turned away from a light gets darker, not
                // see-through.
                background: `linear-gradient(177deg,
                  rgb(${lit(hot)}) 0%,
                  rgb(${lit(mid)}) 20%,
                  rgb(${lit(mid)}) 68%,
                  rgb(${lit(rim)}) 100%)`,
                boxShadow: `0 0 78px 12px rgb(${mid} / ${(0.22 * intensity).toFixed(3)})`,
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
