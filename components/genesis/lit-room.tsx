import { paintedWall } from "@/lib/textures";
import { cn } from "@/lib/utils";

/**
 * The room the vortex stands in — built to p06_0.
 *
 * NO CLIP-PATHS AND NO CSS FILTERS ANYWHERE, and that is the whole point.
 *
 * The previous version cut the floor, both walls and the light shaft out of
 * `clip-path: polygon(...)` and then blurred them. Blurring a hard polygon
 * does not remove the edge — it produces a *uniform-width* soft edge, which
 * the eye still reads as a line. That was the "strong lines" problem exactly.
 *
 * In a black-box interior you never actually see the walls, the floor, or
 * their junction; you only see how the light falls off across them. So the
 * room is drawn entirely as ALPHA. The walls are a lateral falloff. The floor
 * is an ellipse centred below the frame, which narrows as it rises — that is
 * the trapezoid's perspective, drawn as an arc that is itself invisible. The
 * shaft is a gradient whose CONE SHAPE IS ITS MASK, so there is no boundary
 * anywhere for an edge to appear on.
 *
 * Every layer is static, so each rasterises once and then composites as a
 * plain quad — which is what lets it sit beneath ~56 animated sheets at 60fps.
 */

/**
 * The cone. A radial mask whose focus sits ABOVE the element: narrow at the
 * apex, wide at the floor, and soft in every direction at once. Because the
 * shape lives in the alpha channel, there is no edge to soften.
 */
const SHAFT_CONE_MASK =
  "radial-gradient(56% 118% at 50% -6%, #000 0%, rgb(0 0 0 / 0.92) 26%, rgb(0 0 0 / 0.55) 52%, rgb(0 0 0 / 0.18) 70%, transparent 84%)";

const SHAFT_CORE_MASK =
  "radial-gradient(46% 104% at 50% -10%, #000 0%, rgb(0 0 0 / 0.72) 38%, rgb(0 0 0 / 0.22) 62%, transparent 82%)";

export function LitRoom({
  /** Horizontal position of the shaft, percent. */
  lightX = 50,
  className,
}: {
  lightX?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{
        backgroundColor: "#08080a",
        // Blend modes below resolve inside this subtree rather than against
        // the animated sheets above it, so they never force a re-blend.
        isolation: "isolate",
        contain: "layout paint style",
      }}
    >
      {/* 1. Depth wash — back wall and both side walls in one layer. The
             walls are only ever a lateral falloff, so a wide horizontal
             extent lets the sides reach void long before the centre does. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(78% 122% at 50% 34%, #16181d 0%, #111318 26%, #0d0e12 48%, #0a0b0e 72%, #08080a 100%)",
        }}
      />

      {/* 2. The floor — an ellipse centred BELOW the bottom edge, so it
             narrows as it rises. The wall/floor junction is deliberately
             never drawn; a real black-box has none. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(168% 60% at 50% 109%, rgb(25 27 33 / 0.9) 0%, rgb(18 20 25 / 0.58) 34%, rgb(12 13 17 / 0.24) 62%, rgb(9 10 13 / 0.06) 82%, transparent 94%)",
        }}
      />

      {/* 3. Paint. Two turbulence tiles; the ochre is baked into the SVG so
             no CSS filter is needed to tint it. */}
      <div
        className="absolute inset-0 opacity-80 mix-blend-soft-light"
        style={{
          backgroundImage: paintedWall({
            frequency: 0.005,
            octaves: 5,
            opacity: 0.7,
            seed: 11,
          }),
          backgroundSize: "700px 700px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.34] mix-blend-overlay"
        style={{
          backgroundImage: paintedWall({
            frequency: 0.004,
            octaves: 4,
            opacity: 0.55,
            seed: 41,
            tint: "#7a5a24",
          }),
          backgroundSize: "700px 1240px",
        }}
      />

      {/* 4. Haze shoulder — much wider and far fainter than the beam, and
             unmasked, because a radial gradient is already edgeless. This is
             the layer that kills any residual "cone edge": the beam's outer
             falloff gains a second broad shoulder, so no single boundary
             remains for the eye to latch onto. */}
      <div
        className="absolute"
        style={{
          left: `${lightX}%`,
          top: "-6%",
          width: "108%",
          height: "94%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(62% 76% at 50% 2%, rgb(246 232 198 / 0.075) 0%, rgb(240 224 186 / 0.032) 40%, rgb(232 214 176 / 0.012) 62%, transparent 78%)",
        }}
      />

      {/* 5. The shaft in the air. Its apex is parked above the frame so the
             container's top edge crosses the beam where it is narrow and the
             alpha ramp is still climbing — the frame never cuts it. */}
      <div
        className="absolute"
        style={{
          left: `${lightX}%`,
          top: "-10%",
          width: "62%",
          height: "104%",
          transform: "translateX(-50%)",
          background:
            "linear-gradient(180deg, rgb(250 240 214 / 0.3) 0%, rgb(246 232 198 / 0.16) 30%, rgb(238 220 180 / 0.06) 58%, transparent 88%)",
          maskImage: SHAFT_CONE_MASK,
          WebkitMaskImage: SHAFT_CONE_MASK,
        }}
      />

      {/* 6. Hot core, narrower and brighter, so the beam has density rather
             than being one flat wash. */}
      <div
        className="absolute"
        style={{
          left: `${lightX}%`,
          top: "-12%",
          width: "34%",
          height: "88%",
          transform: "translateX(-50%)",
          background:
            "linear-gradient(180deg, rgb(255 252 240 / 0.34) 0%, rgb(250 238 206 / 0.13) 34%, transparent 74%)",
          maskImage: SHAFT_CORE_MASK,
          WebkitMaskImage: SHAFT_CORE_MASK,
        }}
      />

      {/* 7. Where it lands. An ellipse, so the pool has no rim. */}
      <div
        className="absolute inset-x-0"
        style={{
          bottom: "6%",
          height: "34%",
          background:
            "radial-gradient(42% 100% at 50% 62%, rgb(250 238 206 / 0.2) 0%, rgb(238 220 178 / 0.09) 38%, rgb(220 200 160 / 0.03) 62%, transparent 84%)",
        }}
      />

      {/* 8. Vignette — the reference crushes its corners almost to black. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(72% 62% at 50% 42%, transparent 0%, transparent 44%, rgb(4 4 6 / 0.68) 82%, rgb(2 2 3 / 0.94) 100%)",
        }}
      />
    </div>
  );
}
