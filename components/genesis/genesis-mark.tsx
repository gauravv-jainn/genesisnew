import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The Genesis Media wordmark, from the brand guidelines.
 *
 * Two files, not one recoloured file: the guidelines supply a dark lockup for
 * light grounds and a white lockup for dark ones, and in both the N's wedge
 * stays brand yellow. A CSS filter could not produce that from one asset
 * without turning the yellow as well.
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
}: {
  className?: string;
  /** The N symbol alone — for tight spaces such as the mobile bar. */
  compact?: boolean;
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
    <span
      className={cn("relative block h-[12px] w-[7.5rem] shrink-0", className)}
    >
      <Image
        src="/brand/genesis-wordmark-light.png"
        alt="Genesis Media"
        fill
        sizes="120px"
        priority
        className="object-contain object-left"
        style={{ opacity: "calc(1 - var(--logo-invert, 0))" }}
      />
      <Image
        src="/brand/genesis-wordmark-dark.png"
        alt=""
        aria-hidden
        fill
        sizes="120px"
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
