import { cn } from "@/lib/utils";

/**
 * The room the vortex stands in — built to p06_0.
 *
 * The reference is not a dark backdrop; it is an interior. Side walls
 * converge toward a back wall, a floor plane recedes toward the viewer, a
 * narrow shaft drops from above and pools on that floor, and a hard vignette
 * crushes the corners. Everything else in the scene sits inside that box.
 *
 * Painted with layered gradients and clip-paths rather than 3D transforms:
 * a real rotateX floor would put every paper into the same 3D context and
 * fight their own transforms, and this composites far more cheaply.
 */
export function LitRoom({
  /** Horizontal position of the shaft, percent. */
  lightX = 50,
  className,
}: {
  lightX?: number;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {/* Back wall. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0b0d11 0%, #121519 42%, #0d0f13 78%, #08090c 100%)",
        }}
      />

      {/* Floor: a trapezoid widening toward the viewer. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[46%]"
        style={{
          clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
          background:
            "linear-gradient(180deg, #16181d 0%, #101216 40%, #0a0b0e 100%)",
        }}
      />

      {/* Left and right walls, angled inward. */}
      <div
        className="absolute inset-y-0 left-0 w-[34%]"
        style={{
          clipPath: "polygon(0% 0%, 100% 12%, 100% 78%, 0% 100%)",
          background:
            "linear-gradient(90deg, #050608 0%, #0c0e12 60%, #0f1216 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[34%]"
        style={{
          clipPath: "polygon(100% 0%, 0% 12%, 0% 78%, 100% 100%)",
          background:
            "linear-gradient(270deg, #050608 0%, #0c0e12 60%, #0f1216 100%)",
        }}
      />

      {/*
        Painterly texture. Two crossing sets of soft streaks at different
        angles, plus warm ochre marks — the brushed walls of the reference.
        Kept very low contrast; it should read as surface, not pattern.
      */}
      <div
        className="absolute inset-0 opacity-[0.5] mix-blend-soft-light"
        style={{
          backgroundImage: [
            "repeating-linear-gradient(94deg, rgb(255 255 255 / 0.05) 0px, transparent 2px, transparent 17px)",
            "repeating-linear-gradient(86deg, rgb(0 0 0 / 0.16) 0px, transparent 3px, transparent 24px)",
            "repeating-linear-gradient(91deg, rgb(198 158 78 / 0.08) 0px, transparent 2px, transparent 61px)",
          ].join(","),
        }}
      />

      {/* The shaft, visible in the air. */}
      <div
        className="absolute top-0 h-[78%]"
        style={{
          left: `${lightX}%`,
          width: "46%",
          transform: "translateX(-50%)",
          background:
            "linear-gradient(180deg, rgb(250 238 208 / 0.34) 0%, rgb(244 226 186 / 0.13) 34%, transparent 78%)",
          clipPath: "polygon(41% 0%, 59% 0%, 100% 100%, 0% 100%)",
          filter: "blur(16px)",
        }}
      />

      {/* Where it lands on the floor. */}
      <div
        className="absolute bottom-[16%] h-[26%] w-[54%]"
        style={{
          left: `${lightX}%`,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(closest-side, rgb(250 238 208 / 0.24) 0%, rgb(230 206 160 / 0.08) 52%, transparent 100%)",
          filter: "blur(24px)",
        }}
      />

      {/* Hard vignette — the reference crushes its corners almost to black. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(72% 62% at 50% 42%, transparent 0%, transparent 42%, rgb(4 4 6 / 0.72) 82%, rgb(2 2 3 / 0.94) 100%)",
        }}
      />
    </div>
  );
}
