"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * The divisions orb — a point-cloud sphere that reacts to the pointer.
 *
 * WHAT IT IS FOR. The services heading claims "four divisions, one system",
 * and the section under it was a list of four names with nothing saying they
 * were one thing. Genesis's own films put the four names around a single
 * dotted sphere with the wordmark at its core, so the picture argues the
 * sentence: one body, four things orbiting it.
 *
 * WHY CANVAS AND NOT HOUDINI. The Paint API looks like the right tool for a
 * generated background and is the wrong one here. A paint worklet is a pure
 * function of the element's size and custom properties — it cannot keep state
 * between frames, so every particle's excitation, every travelling pulse and
 * every ripple would have to be serialised out to CSS properties and back on
 * each tick, and the whole surface repaints whenever any one of them changes.
 * This needs ~2000 points carrying their own decay across frames at 60Hz.
 * That is what a canvas and a typed array are for. Houdini would also be the
 * only part of this page that silently renders nothing in Safari.
 *
 * WHY IT COSTS ALMOST NOTHING.
 *   - Points are stamped from pre-rendered sprites rather than arc() + fill().
 *   - Compositing is `lighter`, which is order-independent, so the depth sort
 *     a point cloud normally needs every frame is not needed at all.
 *     Overlapping points also brighten, which gives the silhouette its
 *     density for free.
 *   - Every per-point value that has to survive a frame lives in a
 *     Float32Array, so the loop allocates nothing and never triggers a GC
 *     pause mid-scroll.
 *   - The loop is suspended when the section is off-screen and when the tab
 *     is hidden. Scrolled past, this is a sleeping canvas.
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

/** Resting tilt toward the viewer, so the top pole's rings are visible. */
const TILT = -0.34;

/** One full rotation, in ms. Slow enough to be ambient, not hypnotic. */
const PERIOD = 52_000;

/** How far the sphere leans toward the pointer, in radians, and how quickly
 *  it gets there. The lean is deliberately small: past about 0.3rad it stops
 *  reading as attention and starts reading as a dragged object. */
const LEAN_YAW = 0.26;
const LEAN_PITCH = 0.17;
const LEAN_EASE = 0.055;

/** Radius of the pointer's influence, as a fraction of the sphere's. */
const REACH = 0.5;

/**
 * How fast a point takes up the pointer's excitement and how slowly it lets
 * it go. They are different on purpose — equal rates make the glow a rigid
 * disc welded to the cursor, while a slow release leaves a wake behind the
 * pointer and is most of why the surface feels like a material rather than a
 * mask.
 */
const EXCITE_RISE = 0.26;
const EXCITE_FALL = 0.055;

/** Travelling pulses: how many at once, how often one starts, how long it
 *  lives, how fast it runs along its ring (dots per second) and how many dots
 *  it spans. */
const PULSE_MAX = 5;
const PULSE_EVERY = 780;
const PULSE_LIFE = 1700;
const PULSE_SPEED = 20;
const PULSE_SPAN = 5;

/** Click ripple: sphere radii per second, the width of the wave front as a
 *  fraction of the radius, and how many can be in flight. The cap matters —
 *  every live ripple adds a distance test per point per frame, so a reader
 *  hammering the mouse must not be able to run the cost up without bound. */
const RIPPLE_SPEED = 1.45;
const RIPPLE_WIDTH = 0.17;
const RIPPLE_MAX = 3;

type Sphere = {
  /** Unit positions, xyz interleaved. */
  pos: Float32Array;
  /** Phase offset for the breathing displacement, so the surface shimmers
   *  rather than pulsing as one rigid shell. */
  phase: Float32Array;
  /** Which sprite paints each point. */
  tone: Uint8Array;
  /** Where each ring starts in the arrays, and how many dots it holds. */
  ringStart: Int32Array;
  ringLen: Int32Array;
  count: number;
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
 * The rings are also what the pulses run along, which is the second reason to
 * keep them addressable rather than flattening everything into one list.
 *
 * Dots per ring follow the ring's circumference, so density stays even over
 * the surface instead of jamming up at the poles.
 */
function buildSphere(target: number): Sphere {
  // Summing cos(lat) over evenly spaced rings tends to 2/pi of their count,
  // so this lands the total on the caller's target in one step rather than
  // fitting for it. `density` is literally the dot count at the equator.
  const density = target / (RINGS * 0.6366);

  const ringStart = new Int32Array(RINGS);
  const ringLen = new Int32Array(RINGS);
  let count = 0;
  for (let ring = 0; ring < RINGS; ring += 1) {
    const lat = -Math.PI / 2 + ((ring + 0.5) / RINGS) * Math.PI;
    const n = Math.max(1, Math.round(density * Math.cos(lat)));
    ringStart[ring] = count;
    ringLen[ring] = n;
    count += n;
  }

  const pos = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const tone = new Uint8Array(count);

  for (let ring = 0; ring < RINGS; ring += 1) {
    // Half-step in, so no ring sits exactly on a pole with one lonely dot.
    const lat = -Math.PI / 2 + ((ring + 0.5) / RINGS) * Math.PI;
    const y = Math.sin(lat);
    const radius = Math.cos(lat);
    const twist = ring * RING_TWIST;
    const start = ringStart[ring];
    const n = ringLen[ring];

    for (let slot = 0; slot < n; slot += 1) {
      const i = start + slot;
      const theta = twist + (slot / n) * Math.PI * 2;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * radius;
      phase[i] = ((ring * 7 + slot) % 97) * 0.0647;
      // A warm crown at the top pole and a scatter of the deck's violet
      // through the body, exactly as the reference grades it.
      tone[i] = y > 0.9 ? 1 : (ring * 13 + slot) % 19 === 0 ? 2 : 0;
    }
  }

  return { pos, phase, tone, ringStart, ringLen, count };
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

type Pulse = { ring: number; head: number; born: number; tone: number };
type Ripple = { x: number; y: number; born: number };

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

    /** Pulse colours, alternating. Yellow is the interface accent and violet
     *  is the deck's, so a signal running the sphere is in the brand either
     *  way round. */
    const PULSE_RGB = ["255, 212, 0", "186, 168, 255"] as const;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cosTilt = Math.cos(TILT);
    const sinTilt = Math.sin(TILT);

    let width = 0;
    let height = 0;
    let radius = 0;
    let dot = 1;
    let sphere = buildSphere(2100);
    // Last frame's screen position per point, and the excitation it carries.
    let screen = new Float32Array(sphere.count * 2);
    let near = new Float32Array(sphere.count);
    let excite = new Float32Array(sphere.count);

    let frame = 0;
    let visible = false;

    /*
      Pointer state, in the SAME space the projected points land in: CSS
      pixels from the canvas's top-left corner. The lean wants the offset
      from the centre instead, so that is derived where it is used rather
      than stored — keeping two coordinate systems in two variables that look
      alike is how the first version came to measure every point's distance
      to a cursor half a canvas away from where it actually was.

      `hasPointer` is separate from the coordinates so leaving eases the lean
      back to rest rather than snapping it to the middle.
    */
    let hasPointer = false;
    let pointerX = 0;
    let pointerY = 0;
    let leanYaw = 0;
    let leanPitch = 0;
    let targetYaw = 0;
    let targetPitch = 0;

    const pulses: Pulse[] = [];
    const ripples: Ripple[] = [];
    let lastPulse = 0;
    let pulseTone = 0;

    const resize = () => {
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
      if (Math.abs(wanted - sphere.count) > 120) {
        sphere = buildSphere(wanted);
        screen = new Float32Array(sphere.count * 2);
        near = new Float32Array(sphere.count);
        excite = new Float32Array(sphere.count);
        pulses.length = 0;
      }
      return true;
    };

    /** Starts a signal on a ring that is currently facing the viewer, so a
     *  pulse is never spent entirely round the back. */
    const spawnPulse = (now: number) => {
      for (let attempt = 0; attempt < 6; attempt += 1) {
        // Away from the poles, where a ring is a handful of dots and a pulse
        // just blinks.
        const ring = 6 + Math.floor(Math.random() * (RINGS - 12));
        const head = Math.floor(Math.random() * sphere.ringLen[ring]);
        if (near[sphere.ringStart[ring] + head] > 0.72) {
          pulses.push({ ring, head, born: now, tone: pulseTone });
          pulseTone = 1 - pulseTone;
          return;
        }
      }
    };

    const render = (now: number) => {
      const cx = width / 2;
      const cy = height / 2;
      const frozen = still.matches;

      // Rest, plus however far the pointer has pulled it.
      leanYaw += (targetYaw - leanYaw) * LEAN_EASE;
      leanPitch += (targetPitch - leanPitch) * LEAN_EASE;

      const spin = (frozen ? PERIOD * 0.11 : now) / PERIOD * Math.PI * 2 + leanYaw;
      const cosSpin = Math.cos(spin);
      const sinSpin = Math.sin(spin);
      const tilt = TILT + leanPitch;
      const cosT = leanPitch === 0 ? cosTilt : Math.cos(tilt);
      const sinT = leanPitch === 0 ? sinTilt : Math.sin(tilt);
      const breath = frozen ? 0 : now * 0.0011;
      const reach = radius * REACH;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const { pos, phase, tone, count } = sphere;

      for (let i = 0; i < count; i += 1) {
        /*
          Excitation is measured against LAST frame's screen position, which
          is already in hand — computing it against this frame's would mean
          projecting every point twice, since the excitation also displaces
          the point being projected. One frame of lag at 60Hz is 16ms and
          invisible; two passes over 2000 points is not free.
        */
        let target = 0;
        if (near[i] > 0.45) {
          if (hasPointer) {
            const dx = screen[i * 2] - pointerX;
            const dy = screen[i * 2 + 1] - pointerY;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < reach) {
              const t = 1 - d / reach;
              target = t * t;
            }
          }
          // The click wave, as a moving band rather than a filled disc.
          for (let r = 0; r < ripples.length; r += 1) {
            const ripple = ripples[r];
            const front = ((now - ripple.born) / 1000) * RIPPLE_SPEED * radius;
            const rx = screen[i * 2] - ripple.x;
            const ry = screen[i * 2 + 1] - ripple.y;
            const band =
              1 -
              Math.abs(Math.sqrt(rx * rx + ry * ry) - front) /
                (radius * RIPPLE_WIDTH);
            if (band > target) target = band;
          }
        }
        const e = excite[i];
        excite[i] =
          e + (target - e) * (target > e ? EXCITE_RISE : EXCITE_FALL);
        const lift = excite[i];

        // Breathing, plus however far the pointer has lifted this point off
        // the surface. The lift is along the normal, so the sphere dimples
        // outward under the cursor instead of smearing sideways.
        const swell = 1 + (frozen ? 0 : 0.013 * Math.sin(breath + phase[i])) + lift * 0.075;

        const x = pos[i * 3] * swell;
        const y = pos[i * 3 + 1] * swell;
        const z = pos[i * 3 + 2] * swell;

        // Spin about the vertical axis, then tilt the whole thing forward.
        const sx3 = x * cosSpin + z * sinSpin;
        const sz3 = z * cosSpin - x * sinSpin;
        const sy3 = y * cosT - sz3 * sinT;
        const depth = y * sinT + sz3 * cosT;

        const scale = CAMERA / (CAMERA - depth);
        // 0 at the far pole, 1 at the near one.
        const front = (depth + 1) / 2;
        near[i] = front;

        const px = cx + sx3 * radius * scale;
        const py = cy - sy3 * radius * scale;
        screen[i * 2] = px;
        screen[i * 2 + 1] = py;

        // A GENTLE ramp, not a steep one. The bright rim on the reference is
        // made by density — the projection crowds dots together at the
        // silhouette — not by the near face being lit. Driving alpha hard
        // with depth blows out the front and hides that entirely.
        /*
          The lift shows up mostly as LIGHT, only a little as size. The first
          pass had it the other way round and the excited patch read as a
          sparser part of the sphere rather than a brighter one — swelling a
          dot spreads the same energy over more pixels, so past about half a
          dot's width it dims the very thing it is meant to be lighting.
        */
        ctx.globalAlpha = Math.min(1, 0.24 + front * 0.46 + lift * 0.7);
        const size = (0.62 + front * 0.95 + lift * 0.62) * dot;
        ctx.drawImage(
          sprites[tone[i]],
          px - size,
          py - size,
          size * 2,
          size * 2,
        );
      }

      /*
        The signals. A pulse is drawn through the projected positions of a run
        of consecutive dots on one ring, so it traces the sphere's own contour
        rather than cutting a chord across it. Any run that crosses the
        silhouette is skipped — its two ends are on opposite sides of the ball
        and a line between them would be a wire through the middle.
      */
      if (!frozen) {
        for (let p = pulses.length - 1; p >= 0; p -= 1) {
          const pulse = pulses[p];
          const age = now - pulse.born;
          if (age > PULSE_LIFE) {
            pulses.splice(p, 1);
            continue;
          }
          // In over 180ms, out over the last 500ms.
          const fade = Math.min(1, age / 180, (PULSE_LIFE - age) / 500);
          const start = sphere.ringStart[pulse.ring];
          const len = sphere.ringLen[pulse.ring];
          const head = pulse.head + (age / 1000) * PULSE_SPEED;

          let visibleRun = true;
          ctx.beginPath();
          for (let s = 0; s < PULSE_SPAN; s += 1) {
            const idx = start + (Math.floor(head - s) % len + len) % len;
            if (near[idx] < 0.55) {
              visibleRun = false;
              break;
            }
            const lx = screen[idx * 2];
            const ly = screen[idx * 2 + 1];
            if (s === 0) ctx.moveTo(lx, ly);
            else ctx.lineTo(lx, ly);
          }
          if (!visibleRun) continue;

          const rgb = PULSE_RGB[pulse.tone];
          ctx.lineCap = "round";
          ctx.strokeStyle = `rgba(${rgb}, ${(fade * 0.2).toFixed(3)})`;
          ctx.lineWidth = dot * 6;
          ctx.stroke();
          ctx.strokeStyle = `rgba(${rgb}, ${(fade * 0.85).toFixed(3)})`;
          ctx.lineWidth = dot * 1.4;
          ctx.stroke();
        }

        // Signals quicken while someone is in the section. It is the
        // cheapest way to make the thing read as awake rather than looping.
        const cadence = hasPointer ? PULSE_EVERY * 0.55 : PULSE_EVERY;
        if (pulses.length < PULSE_MAX && now - lastPulse > cadence) {
          lastPulse = now;
          spawnPulse(now);
        }
      }

      for (let r = ripples.length - 1; r >= 0; r -= 1) {
        if (((now - ripples[r].born) / 1000) * RIPPLE_SPEED > 2.4) {
          ripples.splice(r, 1);
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (now: number) => {
      render(now);
      frame = requestAnimationFrame(loop);
    };

    /**
     * Under Reduce Motion the sphere does not run on its own — but it still
     * answers the pointer, because a response to something the reader is
     * doing right now is not the ambient movement that setting is asking us
     * to stop. So the loop is allowed to run while the pointer is in the
     * section, and stops again when it leaves.
     */
    const shouldRun = () =>
      visible && !document.hidden && (!still.matches || hasPointer);

    const start = () => {
      if (frame || !shouldRun()) return;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    if (resize()) render(still.matches ? 0 : performance.now());

    const onResize = () => {
      if (resize()) render(performance.now());
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(host);

    /*
      Pointer listeners sit on the SECTION, not on the canvas. The orb is
      pointer-events:none — it must never intercept a click meant for the page
      — and the sphere leaning toward a cursor that is still crossing the
      names reads far better than one that only wakes when you are on top of
      it. The rect is cached and refreshed on move and on scroll rather than
      measured every frame, so the render loop never reads layout.
    */
    const zone: Element = host.closest("section") ?? host;
    let rect = host.getBoundingClientRect();

    const place = (clientX: number, clientY: number) => {
      pointerX = clientX - rect.left;
      pointerY = clientY - rect.top;
      const half = { x: (rect.width || 1) / 2, y: (rect.height || 1) / 2 };
      const nx = Math.max(-2, Math.min(2, (pointerX - half.x) / half.x));
      const ny = Math.max(-2, Math.min(2, (pointerY - half.y) / half.y));
      targetYaw = nx * LEAN_YAW;
      targetPitch = -ny * LEAN_PITCH;
    };

    let lastClientX = 0;
    let lastClientY = 0;

    const onMove = (event: Event) => {
      const pointer = event as PointerEvent;
      rect = host.getBoundingClientRect();
      lastClientX = pointer.clientX;
      lastClientY = pointer.clientY;
      hasPointer = true;
      place(pointer.clientX, pointer.clientY);
      start();
    };

    const onLeave = () => {
      hasPointer = false;
      targetYaw = 0;
      targetPitch = 0;
      // Under Reduce Motion the loop only runs for the pointer, so it has to
      // be let go of here — but not before the lean has eased back, or the
      // sphere would freeze mid-turn.
      if (still.matches) {
        window.setTimeout(() => {
          if (!hasPointer) {
            stop();
            leanYaw = 0;
            leanPitch = 0;
            excite.fill(0);
            render(0);
          }
        }, 700);
      }
    };

    const onDown = (event: Event) => {
      const pointer = event as PointerEvent;
      rect = host.getBoundingClientRect();
      place(pointer.clientX, pointer.clientY);
      // Only within reach of the sphere — a click on a nav link at the far
      // side of the section has nothing to do with this.
      if (Math.hypot(pointerX - width / 2, pointerY - height / 2) < radius * 1.4) {
        if (ripples.length >= RIPPLE_MAX) ripples.shift();
        ripples.push({ x: pointerX, y: pointerY, born: performance.now() });
        hasPointer = true;
        start();
      }
    };

    const onScroll = () => {
      if (!hasPointer) return;
      rect = host.getBoundingClientRect();
      place(lastClientX, lastClientY);
    };

    zone.addEventListener("pointermove", onMove, { passive: true });
    zone.addEventListener("pointerleave", onLeave, { passive: true });
    zone.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

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
      if (still.matches) render(0);
      else start();
    };
    still.addEventListener("change", onPreference);

    return () => {
      stop();
      observer.disconnect();
      watcher.disconnect();
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
      zone.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
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
