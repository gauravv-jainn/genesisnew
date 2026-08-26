import { cn } from "@/lib/utils";

/**
 * Background atmosphere primitives.
 *
 * Every reference image shares the same three-layer recipe: a near-black
 * ground, one soft directional glow, and a grain pass over the top. These are
 * the reusable pieces — no section should hand-roll its own gradient.
 */

type AuroraProps = {
  /** Where the light comes from. The references favour top and top-right. */
  origin?: "top" | "top-right" | "top-left" | "center" | "bottom";
  /** Which accent lights the scene. */
  tone?: "brand" | "neutral";
  /** 0–1. The references sit low; heavy glow reads as cheap. */
  intensity?: number;
  className?: string;
};

const ORIGIN_POSITION: Record<NonNullable<AuroraProps["origin"]>, string> = {
  top: "50% 0%",
  "top-right": "80% 5%",
  "top-left": "20% 5%",
  center: "50% 50%",
  bottom: "50% 100%",
};

const TONE_COLOR: Record<NonNullable<AuroraProps["tone"]>, string> = {
  brand: "255 212 0",
  neutral: "180 180 200",
};

/**
 * The ambient spectrum, from the deck's own secondary fills.
 *
 * Counting the guidelines' vector colours turns up more than the accent:
 * violet #7a3cff, blue #3b5bff, purple #6f4fc4 and a light violet #cac1ff sit
 * alongside it, and the divisions board runs a full warm-to-cool ramp. Every
 * section here was being washed in the one yellow, which is what made the
 * page read monotone — one colour doing the work of a palette.
 *
 * Four sources, placed at different corners so no two sections light the same
 * way, and each scaled by --spectrum. That token is 1 on dark and 0.5 on
 * light, because the same alpha of colour reads about twice as strongly on
 * paper as it does on black.
 *
 * Deliberately a TINT. The guidelines set the ratio at 70% white/black, 20%
 * grey, 10% yellow and say plainly that yellow is never the background — so
 * these sit where the hue is felt rather than seen. The measured lift on the
 * section ground is under two points of luminance.
 */
const SPECTRUM = [
  { color: "122 60 255", at: "14% 6%", size: "52% 46%", alpha: 0.15 },
  { color: "59 91 255", at: "88% 16%", size: "46% 42%", alpha: 0.12 },
  { color: "255 143 184", at: "78% 88%", size: "54% 48%", alpha: 0.11 },
  { color: "255 212 0", at: "18% 92%", size: "48% 42%", alpha: 0.09 },
];

/** Every source stacked into one background-image. */
function spectrumWash() {
  return SPECTRUM.map(
    (s) =>
      `radial-gradient(${s.size} at ${s.at}, rgb(${s.color} / calc(${s.alpha} * var(--spectrum, 1))) 0%, transparent 70%)`,
  ).join(", ");
}

/** A single soft directional light source — the "aurora" wash. */
export function Aurora({
  origin = "top",
  tone = "brand",
  intensity = 0.22,
  className,
}: AuroraProps) {
  const color = TONE_COLOR[tone];
  const position = ORIGIN_POSITION[origin];

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{
        background: `radial-gradient(60% 50% at ${position}, rgb(${color} / ${intensity}) 0%, rgb(${color} / ${intensity * 0.35}) 35%, transparent 70%)`,
      }}
    />
  );
}

/** The ambient wash on its own, for sections that build their own ground. */
export function Spectrum({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ background: spectrumWash() }}
    />
  );
}

/**
 * Film grain. Applied as a sibling overlay rather than on the section itself
 * so it composites above content without needing a stacking-context hack.
 */
export function Grain({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("grain pointer-events-none absolute inset-0", className)}
    />
  );
}

/**
 * The standard Genesis section shell: dark ground + one light source + grain.
 * Sections compose this instead of repeating the recipe.
 */
export function Atmosphere({
  children,
  origin,
  tone,
  intensity,
  className,
}: AuroraProps & { children: React.ReactNode }) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-ink", className)}>
      {/*
        Spectrum first, then the directional source over it, then grain over
        both — so the noise sits on the gradient rather than under it, which
        is what stops a wide soft wash banding on a cheap panel.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: spectrumWash() }}
      />
      <Aurora origin={origin} tone={tone} intensity={intensity} />
      <Grain />
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
