import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Every still on the site goes through here.
 *
 * WHY THIS EXISTS. Seven places rendered a raw <img>, which serves one file
 * to every screen — a 1440px still downloaded whole onto a 390px phone, and
 * the same still upscaled on a retina display. That is the "different in
 * different places" problem: not that the images looked wrong, but that each
 * component decided loading and sizing for itself and no two agreed.
 *
 * next/image generates a srcset and picks per screen. The catch is `sizes`:
 * with `fill` and no `sizes`, Next assumes the image spans the viewport and
 * serves the largest file it has, which is worse than the raw <img> it
 * replaced. So `sizes` is REQUIRED here rather than optional — the type will
 * not let a caller forget the one prop that makes this worth doing.
 *
 * ASPECTS ARE NAMED, not written per call site. Nine different ratios were in
 * use across the components; these are the four the design actually has.
 */
export const ASPECT = {
  /** Reels and UGC — shot portrait. */
  portrait: "aspect-[9/13]",
  /** Cards, team tiles, creator cards. */
  card: "aspect-[4/5]",
  /** Films, campaigns, case-study cards. */
  landscape: "aspect-[4/3]",
  /** Hero stills on a detail page. */
  wide: "aspect-[16/10]",
} as const;

export type Aspect = keyof typeof ASPECT;

export function Media({
  src,
  alt,
  sizes,
  aspect,
  className,
  imageClassName,
  priority = false,
  rounded = "rounded-card",
}: {
  src: string;
  /** Empty string only for decoration the surrounding text already names. */
  alt: string;
  /** Required — see above. */
  sizes: string;
  aspect?: Aspect;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  rounded?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-ink",
        aspect && ASPECT[aspect],
        rounded,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
