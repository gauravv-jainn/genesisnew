import { cn } from "@/lib/utils";

/**
 * A single word lit from within, sitting inside a glass capsule — the
 * "thinkers" treatment from p05_1.
 *
 * The glow is built from stacked text-shadows rather than a CSS filter: a
 * filter would rasterise the whole word to an offscreen buffer, while
 * text-shadow composites with the glyphs. Three shadows at increasing radius
 * give a core, a bloom and a haze, which is what makes it read as emitting
 * light rather than as coloured text.
 */
export function GlowWord({
  children,
  tone = "warm",
  className,
}: {
  children: React.ReactNode;
  tone?: "warm" | "cool" | "crimson";
  className?: string;
}) {
  const TONES = {
    warm: { core: "255 244 220", halo: "255 214 150" },
    cool: { core: "236 246 255", halo: "170 205 245" },
    crimson: { core: "255 236 238", halo: "255 110 125" },
  } as const;

  const { core, halo } = TONES[tone];

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-full px-8 py-2",
        // The capsule: barely-there glass so the word, not the frame, is lit.
        "border border-white/15 bg-white/[0.03]",
        className,
      )}
      style={{
        boxShadow: `0 0 60px -12px rgb(${halo} / 0.35), inset 0 0 40px -18px rgb(${core} / 0.5)`,
      }}
    >
      <span
        className="font-serif italic"
        style={{
          color: `rgb(${core})`,
          textShadow: [
            `0 0 8px rgb(${core} / 0.9)`,
            `0 0 26px rgb(${halo} / 0.65)`,
            `0 0 62px rgb(${halo} / 0.4)`,
          ].join(","),
        }}
      >
        {children}
      </span>

      {/* The light the capsule throws onto the surface beneath it. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-px left-1/2 h-px w-3/4 -translate-x-1/2"
        style={{
          background: `linear-gradient(90deg, transparent, rgb(${core} / 0.75), transparent)`,
        }}
      />
    </span>
  );
}

/**
 * The iridescent pill from the same reference — a near-white capsule with a
 * soft spectral wash drifting under its surface.
 */
export function IridescentButton({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full",
        "px-8 py-4 text-small font-medium text-[#1b1620]",
        "transition-transform duration-300 hover:scale-[1.03]",
        className,
      )}
      style={{
        background:
          "linear-gradient(96deg, #f6f1ff 0%, #ffffff 32%, #f3f7ff 62%, #fdf2f8 100%)",
        boxShadow:
          "0 10px 40px -12px rgb(210 190 255 / 0.55), inset 0 1px 0 0 rgb(255 255 255 / 0.9)",
      }}
    >
      {/* The spectral drift, kept under the label. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 120% at 18% 50%, rgb(186 160 255 / 0.55) 0%, transparent 60%), radial-gradient(60% 120% at 82% 50%, rgb(255 176 214 / 0.5) 0%, transparent 60%), radial-gradient(50% 120% at 50% 120%, rgb(150 214 255 / 0.45) 0%, transparent 62%)",
        }}
      />
      <span className="relative">{children}</span>
    </a>
  );
}
