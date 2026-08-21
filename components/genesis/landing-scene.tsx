import { DocumentWall } from "@/components/genesis/document-wall";
import { paintedWall } from "@/lib/textures";
import { cn } from "@/lib/utils";

/**
 * The landing scene — built to the reference on page 1 of the spec.
 *
 * WHAT THE MEASUREMENT SAID. Compared like-for-like against that reference,
 * the previous hero was a different photograph entirely: 59% of it sat in
 * shadow against the reference's 19%, mean luminance 52 against 90, and warmth
 * (R−B) +75 against +167. It was a dark room with a small warm panel off to
 * one side. The reference is a BLAZING room — the wall of documents is not
 * decoration beside the headline, it is the only light source in the frame and
 * it dominates the composition.
 *
 * ORDER MATTERS MORE THAN VALUES HERE. A first attempt raised the sheets to
 * near-white and the frame barely moved, because the room glow and the haze
 * were painted OVER the wall: every warm veil laid on top drags the brightest
 * thing in the scene back toward the mid-tone it is supposed to be lighting.
 * The atmosphere now sits BEHIND the sheets, and only a thin bloom crosses in
 * front of them.
 *
 * The reference itself is a NMCo advertisement — one of the mood references
 * collected in the deck, not Genesis artwork — so what is copied here is the
 * staging and the light, never its text, marks or layout of copy.
 *
 * Everything is static: each layer rasterises once and then composites as a
 * plain quad, so the scene costs nothing per frame.
 */

/** Deterministic, so SSR and the client agree. */
function rand(seed: number) {
  const v = Math.sin(seed * 12.9898) * 43758.5453;
  return v - Math.floor(v);
}

/**
 * The blocks standing in the water either side of the plinth. They matter
 * more than they look: without them the floor is an empty plane and the eye
 * has nothing to measure the room's depth against.
 */
const BLOCKS = Array.from({ length: 10 }).map((_, i) => {
  const left = i < 5;
  const t = (i % 5) / 4;
  return {
    x: left ? 2 + t * 27 : 71 + (1 - t) * 27,
    y: 63 + rand(i * 3 + 1) * 17,
    w: 4 + rand(i * 5 + 2) * 7,
    h: 3 + rand(i * 7 + 3) * 6,
  };
});

/** Back-facing figure, mid-stride. At this size the silhouette is all of it. */
function Figure({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 250"
      className={className}
      style={style}
      preserveAspectRatio="xMidYMax meet"
    >
      <g fill="currentColor">
        <ellipse cx="50" cy="19" rx="11.5" ry="13" />
        <rect x="44.5" y="29" width="11" height="8" rx="3" />
        {/* torso */}
        <path d="M29 41 Q50 33 71 41 L66 99 Q50 104 34 99 Z" />
        {/* arms */}
        <path d="M29 43 Q24 47 23 57 L21 95 Q25 98 28.5 95.5 L31.5 58 Z" />
        <path d="M71 43 Q76 47 77 57 L79 95 Q75 98 71.5 95.5 L68.5 58 Z" />
        {/* legs, one carried forward */}
        <path d="M35 97 L49 97 L48 155 L45.5 206 Q41 208.5 37 206 L38.5 155 Z" />
        <path d="M51 97 L65 97 L63.5 158 L61 210 Q56.5 212.5 52.5 210 L54 158 Z" />
      </g>
    </svg>
  );
}

export function LandingScene({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ backgroundColor: "#260c03", isolation: "isolate", contain: "layout paint style" }}
    >
      {/* 1. The room. Warm before the wall adds anything — the reference has
             no neutral grey anywhere in it. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(104% 96% at 50% 44%, #a8440f 0%, #8a3409 24%, #6b2607 46%, #4c1a05 68%, #351104 86%, #260c03 100%)",
        }}
      />

      {/* 2. Bloom BEHIND the sheets: the source itself, spilling around them. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(48% 46% at 50% 48%, rgb(255 214 150 / 0.72) 0%, rgb(255 170 78 / 0.42) 32%, rgb(226 110 26 / 0.16) 58%, transparent 80%)",
        }}
      />

      {/* 3. Haze, still behind the wall, so the beam has something to cross. */}
      <div
        className="absolute inset-0 opacity-[0.45] mix-blend-soft-light"
        style={{
          backgroundImage: paintedWall({
            frequency: 0.0045,
            octaves: 5,
            opacity: 0.6,
            seed: 19,
            tint: "#ffab4d",
          }),
          backgroundSize: "900px 900px",
        }}
      />

      {/* 4. THE WALL, above the atmosphere. Nothing warm is laid over it, so
             the sheets keep the luminance they are drawn with. */}
      <div className="absolute inset-x-0 top-[2%] h-[72%]">
        <DocumentWall
          panels={5}
          tone="amber"
          radius={620}
          // Wider arc so the outer sheets reach toward the frame edges: in
          // p01_1 the lit sheets span x=6% to x=96% of the frame.
          step={24}
          height={524}
          // ZERO. The reference's five sheets are IDENTICAL rectangles — the
          // size difference on screen is perspective doing its job. Shrinking
          // the flanks as well made the centre peak in both size AND depth,
          // which is what produced the pyramid.
          falloff={0}
          intensity={1}
          perspective={1150}
        />
      </div>

      {/* 5. The wet floor. The horizon is never drawn — a hard line across the
             frame is exactly what the reference does not have — so the floor
             is a warm plane that simply becomes more reflective downward. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[44%]"
        style={{
          background:
            "linear-gradient(180deg, rgb(180 66 8 / 0) 0%, rgb(214 88 10 / 0.34) 16%, rgb(172 62 8 / 0.44) 48%, rgb(122 42 6 / 0.5) 80%, rgb(88 30 5 / 0.58) 100%)",
        }}
      />

      {/* 6. The specular column: the wall's light reflected straight down the
             water toward the viewer. This is the brightest thing in the lower
             half, and it is what makes the floor read as wet rather than as
             a dark band under the picture. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[44%]"
        style={{
          background:
            "radial-gradient(34% 104% at 50% -8%, rgb(255 206 128 / 0.8) 0%, rgb(255 158 54 / 0.5) 26%, rgb(236 104 16 / 0.24) 54%, transparent 82%)",
        }}
      />

      {/* 7. Ripples. Bands that soften with distance, so the plane recedes
             instead of tiling. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[44%] opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgb(255 198 118 / 0.32) 0px, rgb(255 198 118 / 0.32) 1px, transparent 1px, transparent 7px)",
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 20%, black 60%, transparent 96%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, black 20%, black 60%, transparent 96%)",
        }}
      />

      {/* 8. Blocks standing in the water, and their reflections. */}
      {BLOCKS.map((block, index) => (
        <div key={index}>
          <div
            className="absolute"
            style={{
              left: `${block.x}%`,
              top: `${block.y}%`,
              width: `${block.w}%`,
              height: `${block.h}%`,
              background:
                "linear-gradient(178deg, rgb(112 56 22 / 0.94) 0%, rgb(58 25 9 / 0.95) 40%, rgb(30 12 4 / 0.96) 100%)",
              boxShadow: "0 -1.5px 0 0 rgb(255 206 148 / 0.62) inset",
              maskImage: "linear-gradient(180deg, black 0%, black 76%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(180deg, black 0%, black 76%, transparent 100%)",
            }}
          />
          <div
            className="absolute opacity-30"
            style={{
              left: `${block.x}%`,
              top: `${block.y + block.h}%`,
              width: `${block.w}%`,
              height: `${block.h * 0.8}%`,
              background: "linear-gradient(180deg, rgb(96 44 16 / 0.9) 0%, transparent 88%)",
            }}
          />
        </div>
      ))}

      {/* 9. The plinth. A hard edge is correct here — it is cast concrete, not
             light — and it is lit from the front by the wall, so the top edge
             catches and the face falls away. */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: "71.5%",
          width: "13%",
          height: "15.5%",
          // Narrower at the base: the block recedes from the camera.
          clipPath: "polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)",
          background:
            "linear-gradient(178deg, rgb(126 66 30 / 0.97) 0%, rgb(70 32 12 / 0.97) 34%, rgb(34 14 5 / 0.98) 100%)",
          boxShadow: "0 -2px 0 0 rgb(255 228 184 / 0.85) inset",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 opacity-[0.34]"
        style={{
          top: "86%",
          width: "13%",
          height: "11%",
          clipPath: "polygon(5% 0%, 95% 0%, 88% 100%, 12% 100%)",
          background: "linear-gradient(180deg, rgb(170 96 44 / 0.9) 0%, transparent 90%)",
        }}
      />

      {/* 10. The figure. Small — the wall has to dwarf them, or the room has no
              scale — and near-black, because they are between the camera and
              the only light in the room. Reflected below into the water. */}
      <Figure
        className="absolute left-1/2 -translate-x-1/2 text-[#160702]"
        style={{ top: "51.5%", height: "20%", width: "6.4%" }}
      />
      <Figure
        className="absolute left-1/2 -translate-x-1/2 opacity-[0.2]"
        style={{
          top: "86%",
          height: "12%",
          width: "7%",
          transform: "translateX(-50%) scaleY(-1)",
          color: "#4a1e08",
          maskImage: "linear-gradient(180deg, black 0%, transparent 82%)",
          WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 82%)",
        }}
      />

      {/* 11. Vignette, plus a smoke dome across the top.

              In p01_1 the ceiling above the wall means lum 62 and the
              top-left corner lum 21 — a near-black cap that frames the wall.
              Ours lit the room from 20-22% of the frame, ABOVE the wall, so
              the top of the frame read as a sunrise at lum ~113 and roughly
              doubled the ambient the sheets had to beat. Both sources now sit
              behind the wall's mid-height and the top band is crushed back. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(86% 78% at 50% 46%, transparent 0%, transparent 40%, rgb(58 20 4 / 0.4) 72%, rgb(26 8 2 / 0.78) 100%), linear-gradient(180deg, rgb(18 6 1 / 0.72) 0%, rgb(24 8 2 / 0.34) 12%, transparent 26%)",
        }}
      />
    </div>
  );
}
