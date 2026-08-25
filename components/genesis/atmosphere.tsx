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
  brand: "255 197 22",
  neutral: "180 180 200",
};

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
      <Aurora origin={origin} tone={tone} intensity={intensity} />
      <Grain />
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
