import { cn } from "@/lib/utils";

/**
 * A single hard light source, rendered as a volumetric cone.
 *
 * This is the defining element of the reference layouts — the newspaper under
 * a spotlight, the pinned service cards, the ring of papers. Everything in
 * those scenes is lit by one dramatic source from above, and the light itself
 * is visible in the air.
 *
 * Built from three stacked pieces because a single gradient reads flat:
 *   1. the cone — a clipped wedge of light widening downward
 *   2. the pool — the ellipse where it lands
 *   3. the bloom — a soft halo around the emitter
 */
export function Spotlight({
  /** Horizontal position of the emitter, as a percentage of the container. */
  x = 50,
  /** Cone half-angle in degrees. Narrow reads theatrical; wide reads ambient. */
  spread = 14,
  tone = "warm",
  intensity = 1,
  /** Where the light lands, as a percentage of container height. */
  reach = 92,
  /**
   * Degrees off vertical. img-009's shaft rakes in at roughly 25-35 degrees;
   * a purely vertical cone reads as ambient haze rather than as a source.
   */
  rake = 0,
  className,
}: {
  x?: number;
  spread?: number;
  tone?: "warm" | "cool" | "crimson";
  intensity?: number;
  reach?: number;
  rake?: number;
  className?: string;
}) {
  const TONES = {
    warm: { core: "255 236 200", edge: "255 176 92" },
    cool: { core: "226 238 255", edge: "150 180 220" },
    crimson: { core: "255 220 220", edge: "255 90 100" },
  } as const;

  const { core, edge } = TONES[tone];

  // Half-width of the cone at its base, derived from the angle.
  const halfWidth = Math.tan((spread * Math.PI) / 180) * reach;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* The cone of light in the air. */}
      <div
        className="absolute top-0"
        style={{
          left: `${x}%`,
          width: `${halfWidth * 2}%`,
          height: `${reach}%`,
          transform: `translateX(-50%) rotate(${rake}deg)`,
          transformOrigin: "50% 0",
          background: `linear-gradient(to bottom, rgb(${core} / ${0.46 * intensity}) 0%, rgb(${core} / ${0.24 * intensity}) 28%, rgb(${edge} / ${0.12 * intensity}) 62%, transparent 100%)`,
          clipPath: "polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%)",
          filter: "blur(10px)",
        }}
      />

      {/* Where it lands. */}
      <div
        className="absolute"
        style={{
          left: `${x + Math.tan((rake * Math.PI) / 180) * reach * 0.5}%`,
          top: `${reach - 12}%`,
          width: `${halfWidth * 2.4}%`,
          height: "22%",
          transform: "translateX(-50%)",
          background: `radial-gradient(closest-side, rgb(${core} / ${0.3 * intensity}) 0%, rgb(${edge} / ${0.12 * intensity}) 45%, transparent 100%)`,
          filter: "blur(26px)",
        }}
      />

      {/* Bloom at the emitter. */}
      <div
        className="absolute -top-24"
        style={{
          left: `${x}%`,
          width: "34%",
          height: "34%",
          transform: "translateX(-50%)",
          background: `radial-gradient(closest-side, rgb(${core} / ${0.42 * intensity}) 0%, transparent 100%)`,
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}

/**
 * Oversized display type sitting behind content, cropped by its container.
 *
 * Used throughout the references (p05 "LET'S IMPROVE … OUR SERVICES", the
 * waitlist and contact pages). It gives a section depth and scale that a
 * normal heading cannot, and it is what makes those layouts read as designed
 * rather than assembled.
 */
export function GhostType({
  children,
  /** Outline instead of fill — the treatment used on the footer wordmark. */
  outlined = false,
  className,
}: {
  children: React.ReactNode;
  outlined?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden",
        className,
      )}
    >
      {/*
        At 3.5% white over #08080a this composited to about #111112 — roughly
        nine levels of luminance, which is BELOW the measured amplitude of the
        grain layer painted on top of it (3.36 std). It was mathematically
        present and visually absent, so every section relying on it for scale
        got nothing. img-009 shows it as a legible mid-grey the cards occlude.

        It also wrapped nowhere: `whitespace-nowrap` at clamp(...,22rem) meant
        a multi-word phrase overflowed and cropped to nonsense. It now wraps.
      */}
      <p
        className="text-balance text-center font-semibold leading-[0.82] tracking-tighter"
        style={
          outlined
            ? {
                fontSize: "clamp(6rem, 20vw, 22rem)",
                maxWidth: "min(100%, 18ch)",
                color: "transparent",
                WebkitTextStroke: "1px rgb(255 255 255 / 0.07)",
              }
            : {
                fontSize: "clamp(6rem, 20vw, 22rem)",
                maxWidth: "min(100%, 18ch)",
                color: "rgb(255 255 255 / 0.12)",
              }
        }
      >
        {children}
      </p>
    </div>
  );
}

/**
 * The editorial corner marks from the references — `× × ×` above a short
 * annotation, with a bracketed index opposite.
 */
export function CornerNote({
  children,
  index,
  align = "right",
  className,
}: {
  children: React.ReactNode;
  index?: string;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-56 flex-col gap-2 text-[11px] leading-relaxed text-ash",
        align === "right" ? "items-end text-right" : "items-start text-left",
        className,
      )}
    >
      <span aria-hidden className="tracking-[0.5em] text-faint">
        × × ×
      </span>
      <p>{children}</p>
      {index && (
        <span className="text-faint">[ {index} ]</span>
      )}
    </div>
  );
}
