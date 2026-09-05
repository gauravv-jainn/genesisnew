import type { CSSProperties } from "react";

/**
 * ONE ATMOSPHERE FOR THE WHOLE PAGE, instead of one per section.
 *
 * THE BUG THIS EXISTS TO KILL. Every section painted its own ground and its
 * own wash into a box with `overflow: hidden`. The washes are radial
 * gradients whose hot spots sit near the section's own edges — 6%, 16%, 88%,
 * 92% down the box — so at the section boundary the gradient was still
 * bright, and the clip cut it off mid-value. The next section started its
 * own wash from nothing. The result is a hard horizontal line across the
 * page at every join: the "cut". Measured before this change, the page had
 * eight of them, the worst a 17-point jump in luminance over a single pixel
 * row. No amount of tuning the per-section gradients fixes that, because the
 * edge is drawn by the CLIP, not by the colour.
 *
 * THE FIX IS STRUCTURAL. The light now belongs to the page, not to the
 * section. One element spans the entire document and carries the whole
 * field; sections are transparent and let it through. A single gradient
 * cannot draw an edge inside itself, so there is nothing left to cut.
 *
 * IT IS ALSO THE BETTER DESIGN. Because the sources are placed against the
 * whole document rather than against each box, the colour drifts as you
 * scroll — violet through the Brain, warm through Influence and Studios,
 * pink through AI Lab, brand yellow into the close. The page reads as one
 * continuous scene that changes temperature, which is what the sectioned
 * version was trying and failing to say.
 *
 * ANYTHING STILL PAINTING A FULL-BLEED WASH INSIDE A SECTION — the two
 * chapters that pin themselves dark, and so hide this field behind their own
 * ground — must carry `.seamless`, which masks it to zero at its own edges.
 */

/**
 * The field, as sources rather than as a string.
 *
 * `y` is a percentage of the WHOLE DOCUMENT, so each entry is anchored to a
 * chapter of the page rather than to a box. The radii are absolute so a short
 * page (a division page, /team) gets blobs of the same physical size as the
 * homepage rather than the same fraction of a much smaller box — at 6% of
 * 2,000px a source would be a hard little spot.
 */
const SOURCES: Array<{
  /** rgb triplet, space separated. */
  color: string;
  x: string;
  y: string;
  /** Horizontal and vertical radius. */
  rx: string;
  ry: string;
  alpha: number;
}> = [
  // The Brain — the orb's own violet and blue.
  { color: "122 60 255", x: "14%", y: "2%", rx: "44rem", ry: "30rem", alpha: 0.2 },
  { color: "59 91 255", x: "88%", y: "7%", rx: "40rem", ry: "28rem", alpha: 0.16 },
  // Work, then the client wall — cool, then the first of the brand yellow.
  { color: "108 92 220", x: "18%", y: "13%", rx: "42rem", ry: "28rem", alpha: 0.11 },
  { color: "255 212 0", x: "82%", y: "18%", rx: "44rem", ry: "30rem", alpha: 0.1 },
  // Influence — its own ramp, orange into pink.
  { color: "255 138 76", x: "10%", y: "24%", rx: "44rem", ry: "30rem", alpha: 0.14 },
  { color: "247 113 158", x: "78%", y: "29%", rx: "40rem", ry: "28rem", alpha: 0.13 },
  // Studios — amber, the warmest stretch of the page.
  { color: "255 145 71", x: "16%", y: "35%", rx: "46rem", ry: "30rem", alpha: 0.13 },
  { color: "255 176 87", x: "86%", y: "41%", rx: "40rem", ry: "28rem", alpha: 0.11 },
  // The library — cools off so the posters carry the colour.
  { color: "111 79 196", x: "12%", y: "47%", rx: "42rem", ry: "30rem", alpha: 0.12 },
  // AI Lab — violet through pink.
  { color: "203 182 255", x: "84%", y: "53%", rx: "42rem", ry: "28rem", alpha: 0.12 },
  { color: "242 134 180", x: "14%", y: "58%", rx: "42rem", ry: "28rem", alpha: 0.12 },
  // Brand & Design — the lilac end of the divisions board.
  { color: "202 193 255", x: "82%", y: "64%", rx: "44rem", ry: "30rem", alpha: 0.13 },
  // Who we are, then the journey — back to the route ramp.
  { color: "59 91 255", x: "16%", y: "70%", rx: "42rem", ry: "28rem", alpha: 0.11 },
  { color: "139 92 246", x: "84%", y: "76%", rx: "42rem", ry: "30rem", alpha: 0.13 },
  { color: "217 70 166", x: "12%", y: "81%", rx: "40rem", ry: "26rem", alpha: 0.11 },
  // Case studies and testimonials, closing on the accent.
  { color: "255 212 0", x: "80%", y: "87%", rx: "44rem", ry: "30rem", alpha: 0.11 },
  { color: "255 143 184", x: "18%", y: "92%", rx: "42rem", ry: "28rem", alpha: 0.12 },
  { color: "255 212 0", x: "72%", y: "98%", rx: "46rem", ry: "32rem", alpha: 0.14 },
];

/**
 * `--spectrum` is 1 on dark and 0.5 on light: the same alpha of colour reads
 * about twice as strongly on paper as it does on black. It is declared with
 * the rest of the theme tokens, so this stays one string for both themes.
 */
const FIELD = SOURCES.map(
  (s) =>
    `radial-gradient(${s.rx} ${s.ry} at ${s.x} ${s.y}, rgb(${s.color} / calc(${s.alpha} * var(--spectrum, 1))) 0%, transparent 100%)`,
).join(", ");

export function PageAtmosphere({ children }: { children: React.ReactNode }) {
  return (
    /*
      NO `overflow: hidden` HERE. The field is inset-0 and cannot escape, and
      clipping the page wrapper would break every `position: sticky` inside
      it — the work rail and the journey both use one.
    */
    <div
      className="relative isolate min-h-dvh"
      /*
        THE GROUND IS A GRADIENT, not a flat fill with light thrown at it.
        This was `bg-void` — #111111 — with the eighteen sources below floated
        over it, and at ten to twenty percent alpha eighteen soft blobs on a
        black wall still read as a black wall. --page-ground is that wall
        redrawn as the drift itself; see globals.css, where both themes'
        versions live and where the contrast figures are recorded.

        Painted on this element rather than on <body> so it spans the whole
        document — the wrapper is min-h-dvh but grows to the page's real
        height, so the gradient's stops stretch across every section rather
        than repeating per screen. body keeps the flat token underneath it,
        which is what shows through on overscroll and is correct there.
      */
      style={{ background: "var(--page-ground)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: FIELD } as CSSProperties}
      />
      {/*
        GRAIN IS PAGE-WIDE TOO, and for a sharper reason than the field.
        `.grain::after` blends `overlay`, which needs a backdrop — and each
        section is `isolate`, so the noise could only ever see that section's
        own box. Once the sections went transparent it was blending against
        nothing, and each section's grain lifted it by a different amount
        from its neighbour's: measured, that alone was a step of up to 8
        luminance points at six of the boundaries, larger than anything left
        in the gradients. One layer, one backdrop, no edges.
      */}
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />
      {children}
    </div>
  );
}
