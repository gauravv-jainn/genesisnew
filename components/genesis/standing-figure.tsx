import { cn } from "@/lib/utils";

/**
 * The figure standing at the centre of the vortex — the anchor of p06_0.
 *
 * A person in an oversized suit, lit from directly above so the crown, the
 * shoulders and the tops of the sleeves catch the light while everything
 * below falls into near-black. The silhouette is deliberately boxy: the
 * reference's jacket is far too big for the wearer, which is what makes the
 * figure read as small and dwarfed by the paper turning around them.
 *
 * Drawn rather than photographed so it scales, costs nothing to load, and
 * carries no licensing question.
 */
export function StandingFigure({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 300"
      className={cn("h-full w-auto", className)}
      aria-hidden
    >
      <defs>
        {/* Top-down key light: bright at the crown, gone by the waist. */}
        <linearGradient id="genesis-figure-key" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a352d" />
          <stop offset="12%" stopColor="#221f1a" />
          <stop offset="38%" stopColor="#121110" />
          <stop offset="100%" stopColor="#070708" />
        </linearGradient>

        {/* Rim along the shoulders where the shaft catches the fabric. */}
        <linearGradient id="genesis-figure-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9bda4" stopOpacity="0.34" />
          <stop offset="55%" stopColor="#c9bda4" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#c9bda4" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="genesis-figure-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5045" />
          <stop offset="100%" stopColor="#1b1815" />
        </linearGradient>
      </defs>

      {/* Legs — wide, straight trousers pooling at the shoe. */}
      <path
        d="M44 168 L40 268 Q40 276 47 276 L55 276 Q58 276 58 268 L59 168 Z"
        fill="url(#genesis-figure-key)"
      />
      <path
        d="M61 168 L62 268 Q62 276 65 276 L73 276 Q80 276 80 268 L76 168 Z"
        fill="url(#genesis-figure-key)"
      />

      {/* Shoes. */}
      <path d="M38 274 Q37 282 46 282 L57 282 Q59 282 58 274 Z" fill="#08080a" />
      <path d="M62 274 Q61 282 63 282 L74 282 Q83 282 82 274 Z" fill="#08080a" />

      {/* Head. */}
      <ellipse cx="60" cy="41" rx="12.5" ry="15" fill="url(#genesis-figure-skin)" />
      {/* Hair, catching the light from above. */}
      <path
        d="M47.5 38 Q49 24 60 24 Q71 24 72.5 38 Q66 31 60 31 Q54 31 47.5 38 Z"
        fill="#2b2620"
      />

      {/* Neck. */}
      <rect x="55" y="52" width="10" height="10" fill="#221f1b" />

      {/*
        The jacket. Shoulders sit wide of the body and the hem drops past the
        hip — the oversized cut that makes the figure look small.
      */}
      <path
        d="M60 58
           L38 66 Q28 70 27 82
           L23 138 Q22 146 29 147 L34 148
           L36 176 Q36 182 43 182
           L77 182 Q84 182 84 176
           L86 148 L91 147 Q98 146 97 138
           L93 82 Q92 70 82 66 Z"
        fill="url(#genesis-figure-key)"
      />

      {/* Light landing on the shoulders and sleeve tops. */}
      <path
        d="M60 58 L38 66 Q28 70 27 82 L25 104 Q34 84 44 76 Q52 69 60 66
           Q68 69 76 76 Q86 84 95 104 L93 82 Q92 70 82 66 Z"
        fill="url(#genesis-figure-rim)"
      />

      {/* Lapel shadow, so the jacket does not read as one flat shape. */}
      <path
        d="M60 60 L52 70 L57 108 L60 108 L63 108 L68 70 Z"
        fill="#0d0c0d"
        opacity="0.85"
      />
    </svg>
  );
}
