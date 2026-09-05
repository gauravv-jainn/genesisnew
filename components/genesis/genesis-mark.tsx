import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The Genesis Media wordmark, from the brand guidelines.
 *
 * 2026 REBRAND. Both files are the new lockup, in which MEDIA is set in the
 * identity's own warm-to-violet gradient rather than the flat white it used
 * to be — so the mark now carries the same ramp as the division lockups and
 * the orb, and the wordmark is no longer the one place on the page wearing
 * none of it. Supplied on a 2160 square of which 96% was transparent padding;
 * cropped to the ink's measured bounding box with a hair of margin, which is
 * what makes the ratio note below true.
 *
 * Two files, not one recoloured file: the guidelines supply a dark lockup for
 * light grounds and a white lockup for dark ones, and in both the N's wedge
 * stays brand yellow. A CSS filter could not produce that from one asset
 * without turning the yellow as well.
 *
 * MIND THE FILENAMES. They are named for the THEME each belongs to, not for
 * its own ink: `-light` is the lockup the LIGHT theme uses on its dark chrome
 * and is therefore WHITE; `-dark` is the dark-inked one. Read literally they
 * are backwards, and any override that sets --logo-invert by reasoning about
 * the colour rather than the theme will invert the mark.
 *
 * Both are rendered and cross-faded by --logo-invert, which is defined
 * alongside the rest of the theme tokens. That means the mark follows the
 * theme AND follows `.scene-dark` — the pages that pin themselves dark keep
 * the white lockup without needing to know they have a logo in them.
 *
 * This replaces a hand-drawn placeholder: caps "GENESIS" over letterspaced
 * "MEDIA" with a four-point star that appears nowhere in the real identity.
 */
export function GenesisMark({
  className,
  compact = false,
  sizes = "120px",
}: {
  className?: string;
  /** The N symbol alone — for tight spaces such as the mobile bar. */
  compact?: boolean;
  /**
   * What width the mark actually renders at, for next/image's srcset.
   *
   * 120px is right for the nav and the footer and wrong everywhere the mark
   * is large — at the orb's core it renders around 250px, and a hard-coded
   * 120 there picks the 256px candidate, which is 1x on a retina display and
   * looks it. A caller that sets an unusual width should say so here too.
   */
  sizes?: string;
}) {
  if (compact) {
    return (
      <Image
        src="/brand/genesis-n.png"
        alt="Genesis Media"
        width={306}
        height={500}
        priority
        className={cn("h-6 w-auto", className)}
      />
    );
  }

  return (
    /*
      THE BOX IS THE ARTWORK'S OWN RATIO, 8.8:1.

      It was 10:1 (120x12), which fitted the old file's 9.83 closely enough
      that nobody noticed. The 2026 wordmark is 1723x181 of ink on a 1760x200
      canvas — 8.8 — and `object-contain` resolves a mismatch by shrinking to
      fit the tighter axis, so in a 10:1 box the mark would have rendered at
      full height with fourteen pixels of dead space to its right and looked
      like a logo that had lost its nerve. Height follows width here rather
      than the other way round, so the mark keeps the horizontal presence the
      layouts were built around.
    */
    <span
      className={cn("relative block h-[14px] w-[7.5rem] shrink-0", className)}
    >
      <Image
        src="/brand/genesis-wordmark-light.png"
        alt="Genesis Media"
        fill
        sizes={sizes}
        priority
        className="object-contain object-left"
        style={{ opacity: "calc(1 - var(--logo-invert, 0))" }}
      />
      <Image
        src="/brand/genesis-wordmark-dark.png"
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        priority
        className="object-contain object-left"
        style={{ opacity: "var(--logo-invert, 0)" }}
      />
    </span>
  );
}

/**
 * The N symbol on its own — the wedge from the wordmark, used as a small
 * standalone mark. Replaces the four-point star, which was a placeholder
 * invention and appears nowhere in the identity.
 */
export function GenesisN({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/genesis-n.png"
      alt=""
      aria-hidden
      width={306}
      height={500}
      className={cn("h-auto w-auto", className)}
    />
  );
}
