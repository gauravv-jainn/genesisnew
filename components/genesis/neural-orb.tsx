"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * The divisions orb — a rotating point-cloud sphere, drawn on canvas.
 *
 * WHAT IT IS FOR. The services heading claims "four divisions, one system",
 * and the section under it was a list of four names with nothing saying they
 * were one thing. Genesis's own films put the four names around a single
 * dotted sphere with the wordmark at its core, so the picture argues the
 * sentence: one body, four things orbiting it.
 *
 * WHY CANVAS AND NOT SVG OR DIVS. Twelve hundred points at sixty frames is
 * twelve hundred DOM nodes being re-laid-out every frame. On canvas it is one
 * element and the browser never touches layout.
 *
 * WHY IT COSTS ALMOST NOTHING.
 *   - Points are drawn as a pre-rendered sprite via drawImage rather than as
 *     an arc() + fill() per point. Three sprites, painted once at mount.
 *   - Compositing is `lighter`, which is order-independent, so the depth sort
 *     that a point cloud normally needs every frame is not needed at all.
 *     Overlapping points also brighten, which is what gives the silhouette
 *     its density for free.
 *   - The loop is suspended when the section is off-screen and when the tab
 *     is hidden. Scrolled past, this is a sleeping canvas.
 *   - Under Reduce Motion it draws exactly one frame and never starts a loop.
 *     The sphere is still there, it simply is not turning.
 */

/**
 * Latitude bands.
 *
 * THIS NUMBER IS THE WHOLE EFFECT, and it is a ratio rather than a taste.
 * The eye groups whichever neighbours are closest, so if the gap BETWEEN
 * rings is smaller than the gap between dots ALONG a ring, a sphere of rings
 * reads as a sphere of meridians — vertical lines, which is not what the
 * board shows and is what forty-four rings produced. At thirty-four the
 * spacing along a ring (~16px at the equator) is comfortably tighter than the
 * spacing between rings (~21px), so the contour lines resolve the right way
 * round.
 */
const RINGS = 34;

/** Irrational turn per ring, so the rings do not line their dots up into a
 *  vertical seam running down the face of the sphere. */
const RING_TWIST = Math.PI * (3 - Math.sqrt(5));

/** Camera distance in sphere radii. Low enough to read as a ball, high
 *  enough that the near face does not balloon. */
const CAMERA = 3.2;

/** Tilt toward the viewer, so the top pole's rings are visible. */
const TILT = -0.34;

/** One full rotation, in ms. Slow enough to be ambient, not hypnotic. */
const PERIOD = 52_000;

type Point = {
  x: number;
  y: number;
  z: number;
  /** Phase offset for the breathing displacement, so it shimmers rather
   *  than pulsing as one rigid shell. */
  phase: number;
  /** Which sprite paints it. */
  tone: 0 | 1 | 2;
};

/**
 * Points on a unit sphere, laid out as latitude rings.
 *
 * WHY RINGS AND NOT A FIBONACCI LATTICE. The lattice is the textbook answer —
 * it spaces points more evenly than anything else — and it was wrong here.
 * Perfectly even spacing has no structure in it, so projected to a screen it
 * reads as a cloud of dust rather than as a surface. Genesis's own sphere is
 * built from rings, and the rings are the whole effect: they catch the eye as
 * contour lines, they crowd toward the poles, and where two rings cross near
 * the silhouette they pile up into the bright rim that makes the thing read
 * as solid. This is a case where the more regular arrangement looks better
 * BECAUSE it is more regular.
 *
 * Dots per ring follow the ring's circumference, so density stays even over
 * the surface instead of jamming up at the poles.
 */
function buildSphere(target: number): Point[] {
  const points: Point[] = [];
  // Summing cos(lat) over evenly spaced rings tends to 2/pi of their count,
  // so this lands the total on the caller's target in one step rather than
  // fitting for it. `density` is literally the dot count at the equator.
  const density = target / (RINGS * 0.6366);

  for (let ring = 0; ring < RINGS; ring += 1) {
    // Half-step in, so no ring sits exactly on a pole with one lonely dot.
    const lat = (-Math.PI / 2) + ((ring + 0.5) / RINGS) * Math.PI;
    const y = Math.sin(lat);
    const radius = Math.cos(lat);
    const count = Math.max(1, Math.round(density * radius));
    const twist = ring * RING_TWIST;

    for (let step = 0; step < count; step += 1) {
      const theta = twist + (step / count) * Math.PI * 2;
      points.push({
        x: Math.cos(theta) * radius,
        y,
        z: Math.sin(theta) * radius,
        phase: ((ring * 7 + step) % 97) * 0.0647,
        // A warm crown at the top pole and a scatter of the deck's violet
        // through the body, exactly as the reference grades it.
        tone: y > 0.9 ? 1 : (ring * 13 + step) % 19 === 0 ? 2 : 0,
      });
    }
  }

  return points;
}

/**
 * A soft round dot, painted once and stamped everywhere after.
 *
 * Colours are written in the legacy comma form deliberately. Canvas parses
 * colour strings on its own path, not through the stylesheet, and that path
 * is the last place `rgb(r g b / a)` landed — a silent black dot is not a
 * failure worth risking to save three characters.
 */
function makeSprite(r: number, g: number, b: number): HTMLCanvasElement {
  const size = 16;
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;

  const ctx = sprite.getContext("2d");
  if (ctx) {
    const half = size / 2;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    // Held solid most of the way out, then dropped fast. A wide feather
    // turns 2000 overlapping dots into haze and loses the ring lines
    // entirely; this keeps each dot an object with an edge, and leaves just
    // enough falloff to stop them aliasing into squares.
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
    gradient.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, 0.92)`);
    gradient.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, 0.28)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  return sprite;
}

export function NeuralOrb({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const sprites = [
      makeSprite(235, 238, 245), // bone
      makeSprite(255, 212, 0), // the brand yellow, at the crown
      makeSprite(202, 193, 255), // the deck's light violet
    ] as const;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cosTilt = Math.cos(TILT);
    const sinTilt = Math.sin(TILT);

    let width = 0;
    let height = 0;
    let radius = 0;
    let dot = 1;
    let points = buildSphere(2100);
    let frame = 0;
    let visible = false;

    const measure = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;

      // Two is the point past which more backing pixels buy nothing on a
      // field of soft dots, and cost the fill rate of a 3x canvas.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const span = Math.min(width, height);
      radius = span * 0.46;
      dot = Math.max(0.8, span / 300);

      // Density follows area, so a small orb is not a solid white ball and a
      // large one is not a sparse dusting.
      const wanted = span < 300 ? 1000 : span < 460 ? 1550 : 2100;
      if (wanted !== points.length) points = buildSphere(wanted);
      return true;
    };

    const render = (time: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const spin = (time / PERIOD) * Math.PI * 2;
      const cosSpin = Math.cos(spin);
      const sinSpin = Math.sin(spin);
      const breath = time * 0.0011;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        const swell = 1 + 0.013 * Math.sin(breath + p.phase);

        const x = p.x * swell;
        const y = p.y * swell;
        const z = p.z * swell;

        // Spin about the vertical axis, then tilt the whole thing forward.
        const sx3 = x * cosSpin + z * sinSpin;
        const sz3 = z * cosSpin - x * sinSpin;
        const sy3 = y * cosTilt - sz3 * sinTilt;
        const depth = y * sinTilt + sz3 * cosTilt;

        const scale = CAMERA / (CAMERA - depth);
        // 0 at the far pole, 1 at the near one.
        const near = (depth + 1) / 2;

        // A GENTLE ramp, not a steep one. The bright rim on the reference
        // is made by density — the projection crowds dots together at the
        // silhouette — not by the near face being lit. Driving alpha hard
        // with depth blows out the front and hides that entirely.
        ctx.globalAlpha = 0.24 + near * 0.46;
        const size = (0.62 + near * 0.95) * dot;
        ctx.drawImage(
          sprites[p.tone],
          cx + sx3 * radius * scale - size,
          cy - sy3 * radius * scale - size,
          size * 2,
          size * 2,
        );
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (time: number) => {
      render(time);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (frame || still.matches || document.hidden || !visible) return;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    if (measure()) render(still.matches ? PERIOD * 0.11 : performance.now());

    const onResize = () => {
      if (measure()) render(performance.now());
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(host);

    // Only the visible orb runs. A canvas three sections above the fold has
    // no business holding a 60Hz loop open.
    const watcher = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "160px" },
    );
    watcher.observe(host);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onPreference = () => {
      stop();
      if (still.matches) render(PERIOD * 0.11);
      else start();
    };
    still.addEventListener("change", onPreference);

    return () => {
      stop();
      observer.disconnect();
      watcher.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      still.removeEventListener("change", onPreference);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={cn("pointer-events-none relative aspect-square w-full", className)}
    >
      {/*
        The core light, in CSS rather than on the canvas. It is a wide static
        wash and repainting it 60 times a second to have it not change would
        be pure waste.
      */}
      <div
        className="absolute inset-[8%] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 50% 46%, rgb(255 212 0 / 0.16) 0%, rgb(247 113 158 / 0.10) 34%, rgb(122 60 255 / 0.10) 62%, transparent 78%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
