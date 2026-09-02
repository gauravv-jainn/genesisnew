"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * The divisions orb — a point-cloud sphere that assembles itself, thinks, and
 * answers the pointer.
 *
 * WHAT IT IS FOR. The services heading claims "four divisions, one system",
 * and the section under it was a list of four names with nothing saying they
 * were one thing. Genesis's own films put the four names around a single
 * dotted sphere with the wordmark at its core, so the picture argues the
 * sentence: one body, four things orbiting it. The sphere ASSEMBLING out of
 * scattered points when you first reach the section is the same argument in
 * motion, and it is the only entrance animation on the page.
 *
 * WHY CANVAS AND NOT HOUDINI. The Paint API looks like the right tool for a
 * generated background and is the wrong one here. A paint worklet is a pure
 * function of the element's size and custom properties — it cannot keep state
 * between frames, so every particle's excitation, every travelling pulse and
 * every ripple would have to be serialised out to CSS properties and back on
 * each tick, and the whole surface repaints whenever any one of them changes.
 * This needs ~2000 points carrying their own state at 60Hz. That is what a
 * canvas and a typed array are for. Houdini would also be the only part of
 * this page that silently renders nothing in Safari.
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
 *   - The synapse links are the one part that could go quadratic, and they
 *     are drawn only between points the pointer has already excited — a set
 *     of at most a hundred, not two thousand.
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

/**
 * The lean toward the pointer: how far, and the spring that gets it there.
 *
 * A spring rather than a lerp because a lerp arrives and stops dead, which
 * reads as a value being animated. STIFFNESS and DAMPING here are tuned to
 * overshoot by a few percent and settle — the sphere carries a little of its
 * own weight, and that is the difference between "it moved" and "it turned".
 */
const LEAN_YAW = 0.3;
const LEAN_PITCH = 0.2;
const LEAN_STIFFNESS = 0.012;
const LEAN_DAMPING = 0.86;

/** Radius of the pointer's influence, as a fraction of the sphere's. */
const REACH = 0.6;

/**
 * How fast a point takes up the pointer's excitement and how slowly it lets
 * it go. They are different on purpose — equal rates make the glow a rigid
 * disc welded to the cursor, while a slow release leaves a wake behind the
 * pointer and is most of why the surface feels like a material rather than a
 * mask.
 */
const EXCITE_RISE = 0.26;
const EXCITE_FALL = 0.055;

/**
 * The synapses: links drawn between excited neighbours.
 *
 * This is the part that makes it read as a brain rather than as a globe. A
 * node cloud with no edges is a starfield; the edges are the idea. They exist
 * only under the pointer, so the constellation forms where you touch it and
 * dissolves behind you.
 *
 * POOL is the ceiling on how many excited points are considered, because
 * linking is the one pairwise step here — a hundred points is five thousand
 * distance tests, which is nothing, and two thousand would be two million,
 * which is a dropped frame. DIST is the link length as a fraction of the
 * sphere's radius; much longer and the mesh stops following the surface and
 * starts drawing chords through it.
 */
const LINK_POOL = 150;
const LINK_DIST = 0.16;
const LINK_MAX = 320;
/** Excitation a point needs before it joins the mesh. This is the real
 *  selector: it picks the points nearest the cursor without sorting anything,
 *  because excitation already falls off with distance. Taking the first N in
 *  index order instead builds the mesh out of whichever rings happen to come
 *  first in the array, and it comes out lopsided. */
const LINK_FLOOR = 0.2;

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

/**
 * The assembly: how long the sphere takes to gather itself, how far the
 * points start from their places, and how much of the run is spent staggering
 * rather than moving.
 *
 * SCATTER IS BOUNDED BY THE CANVAS, not by taste. The canvas half-width is
 * about 2.17 sphere radii, so a point thrown further than that is not
 * dramatic, it is simply gone — clipped, and its return is a dot appearing
 * from nowhere at the frame edge. The first pass threw them out to nearly
 * five radii, which is why the opening second read as an empty box with a few
 * specks in the corner rather than as a cloud gathering. At 0.9 the furthest
 * point starts just inside the frame and the whole cloud is visible for the
 * whole animation.
 *
 * The stagger came down with it: at 0.55 the last ring did not begin moving
 * until the run was more than half over.
 */
const FORM_MS = 1500;
const FORM_SCATTER = 0.7;
const FORM_STAGGER = 0.38;
/** How visible a point is before it has arrived. Not zero — the incoming
 *  cloud is the good part, and fading it to nothing hides it. */
const FORM_DIM = 0.32;

type Sphere = {
  /** Unit positions, xyz interleaved. */
  pos: Float32Array;
  /** Where each point waits before the sphere gathers itself, as an offset
   *  from its final position. */
  scatter: Float32Array;
  /** 0-1 down the sphere, so the assembly can sweep rather than land flat. */
  stagger: Float32Array;
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
  const scatter = new Float32Array(count * 3);
  const stagger = new Float32Array(count);
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
      const px = Math.cos(theta) * radius;
      const pz = Math.sin(theta) * radius;
      pos[i * 3] = px;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = pz;

      /*
        The scatter is the point's own direction pushed outward and swung
        sideways, rather than a random vector. Random offsets make the
        assembly a cloud collapsing inward from nowhere; pushing along the
        normal with a tangential kick makes it a shell unwinding into place,
        which is the same gesture the finished sphere is already making.
      */
      const kick = 0.6 + ((i % 31) / 31) * 1.5;
      scatter[i * 3] = (px * 1.15 - pz * 0.9) * FORM_SCATTER * kick;
      scatter[i * 3 + 1] = y * 0.5 * FORM_SCATTER * kick;
      scatter[i * 3 + 2] = (pz * 1.15 + px * 0.9) * FORM_SCATTER * kick;

      stagger[i] = ring / (RINGS - 1);
      phase[i] = ((ring * 7 + slot) % 97) * 0.0647;
      /*
        A warm crown at the top pole, and the deck's violet and pink dusted
        through the body on coprime strides so the two accents never land on
        the same dot and never clump. Random assignment on 2000 points
        reliably produces visible clusters; strides cannot.
      */
      tone[i] =
        y > 0.9 ? 1 : (ring * 13 + slot) % 13 === 0 ? 2 : (ring * 7 + slot) % 29 === 0 ? 3 : 0;
    }
  }

  return { pos, scatter, stagger, phase, tone, ringStart, ringLen, count };
}

/**
 * A soft round dot, painted once and stamped everywhere after.
 *
 * `edge` is where the solid core ends. The crisp version keeps each dot an
 * object with a boundary, which is what holds the ring lines together; the
 * soft version is for the far side of the sphere, where a real lens would
 * have lost focus. Two sprites cost nothing and buy the depth that a flat
 * alpha ramp cannot.
 *
 * Colours are written in the legacy comma form deliberately. Canvas parses
 * colour strings on its own path, not through the stylesheet, and that path
 * is the last place `rgb(r g b / a)` landed — a silent black dot is not a
 * failure worth risking to save three characters.
 */
function makeSprite(r: number, g: number, b: number, edge: number): HTMLCanvasElement {
  const size = 16;
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;

  const ctx = sprite.getContext("2d");
  if (ctx) {
    const half = size / 2;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
    gradient.addColorStop(edge, `rgba(${r}, ${g}, ${b}, 0.92)`);
    gradient.addColorStop(Math.min(0.97, edge + 0.25), `rgba(${r}, ${g}, ${b}, 0.28)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  return sprite;
}

/** The nucleus: one soft white blob, modulated by globalAlpha rather than
 *  rebuilt, so the core can pulse for free. */
function makeCore(): HTMLCanvasElement {
  const size = 128;
  const core = document.createElement("canvas");
  core.width = size;
  core.height = size;
  const ctx = core.getContext("2d");
  if (ctx) {
    const half = size / 2;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, "rgba(255, 238, 190, 0.85)");
    gradient.addColorStop(0.3, "rgba(255, 205, 120, 0.32)");
    gradient.addColorStop(0.62, "rgba(196, 150, 255, 0.12)");
    gradient.addColorStop(1, "rgba(160, 130, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return core;
}

const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 3);

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

    /* Crisp for the near face, soft for the far one — index + 4 is the same
       colour out of focus. */
    const sprites = [
      makeSprite(235, 238, 245, 0.55), // bone
      makeSprite(255, 212, 0, 0.55), // the brand yellow, at the crown
      makeSprite(202, 193, 255, 0.55), // the deck's light violet
      makeSprite(247, 150, 190, 0.55), // and its pink
      makeSprite(235, 238, 245, 0.18),
      makeSprite(255, 212, 0, 0.18),
      makeSprite(202, 193, 255, 0.18),
      makeSprite(247, 150, 190, 0.18),
    ] as const;
    const coreSprite = makeCore();

    /** Pulse colours, alternating. Yellow is the interface accent and violet
     *  is the deck's, so a signal running the sphere is in the brand either
     *  way round. */
    const PULSE_RGB = ["255, 212, 0", "186, 168, 255"] as const;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let radius = 0;
    let dot = 1;
    let sphere = buildSphere(2100);
    // Last frame's screen position per point, the depth it was at, and the
    // excitation it carries.
    let screen = new Float32Array(sphere.count * 2);
    let near = new Float32Array(sphere.count);
    let excite = new Float32Array(sphere.count);
    // Scratch list of points the pointer has woken, refilled every frame.
    let woken = new Int32Array(LINK_POOL);

    let frame = 0;
    let visible = false;
    /** When the assembly began, or 0 if it has not been triggered yet. */
    let formedAt = 0;

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
    let leanYawVel = 0;
    let leanPitchVel = 0;
    let targetYaw = 0;
    let targetPitch = 0;

    const pulses: Pulse[] = [];
    const ripples: Ripple[] = [];
    let lastPulse = 0;
    let pulseTone = 0;
    /** Extra brightness in the core, kicked by a click and decaying. */
    let flare = 0;

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
      /*
        WHY 0.42 AND NOT A HALF.
        A perspective projection does not put a sphere's widest point on its
        silhouette. Maximising sqrt(1-d^2)/(CAMERA-d) puts it at d = 1/CAMERA
        — a third of the way toward the viewer — where the projected radius is
        1.053 times the sphere's own. On top of that the breathing adds 1.3%
        and the pointer's lift another 7.5%, and each dot is drawn about two
        dot-widths across.

        At 0.46 all of that added up to 98% of the canvas: the sphere sat hard
        against its own bounds, the outermost ring was shaved on every side,
        and moving the cursor to an edge pushed dots off it entirely. 0.42
        leaves the margin the arithmetic actually asks for. The section gives
        the width back by widening the column, so the sphere is larger on the
        page than it was before, not smaller.
      */
      radius = span * 0.42;
      dot = Math.max(0.8, span / 300);

      // Density follows area, so a small orb is not a solid white ball and a
      // large one is not a sparse dusting.
      const wanted = span < 300 ? 1000 : span < 460 ? 1550 : 2100;
      if (Math.abs(wanted - sphere.count) > 120) {
        sphere = buildSphere(wanted);
        screen = new Float32Array(sphere.count * 2);
        near = new Float32Array(sphere.count);
        excite = new Float32Array(sphere.count);
        woken = new Int32Array(LINK_POOL);
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

      /*
        The assembly. `form` runs 0 to 1 over FORM_MS and is then done for
        good — the sphere gathers itself once, the first time the reader
        reaches it, and never replays. A gesture that repeats on every scroll
        past stops being an entrance and becomes a tic.
      */
      const form =
        formedAt === 0
          ? 0
          : Math.min(1, (now - formedAt) / FORM_MS);
      const forming = form < 1;

      // A spring, not a lerp: it carries a little weight into the turn.
      leanYawVel = (leanYawVel + (targetYaw - leanYaw) * LEAN_STIFFNESS) * LEAN_DAMPING;
      leanPitchVel = (leanPitchVel + (targetPitch - leanPitch) * LEAN_STIFFNESS) * LEAN_DAMPING;
      leanYaw += leanYawVel;
      leanPitch += leanPitchVel;

      const spin = ((frozen ? PERIOD * 0.11 : now) / PERIOD) * Math.PI * 2 + leanYaw;
      const cosSpin = Math.cos(spin);
      const sinSpin = Math.sin(spin);
      const tilt = TILT + leanPitch;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const breath = frozen ? 0 : now * 0.0011;
      const reach = radius * REACH;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const { pos, scatter, stagger, phase, tone, count } = sphere;
      let wokenCount = 0;

      for (let i = 0; i < count; i += 1) {
        /*
          Excitation is measured against LAST frame's screen position, which
          is already in hand — computing it against this frame's would mean
          projecting every point twice, since the excitation also displaces
          the point being projected. One frame of lag at 60Hz is 16ms and
          invisible; two passes over 2000 points is not free.
        */
        let target = 0;
        if (near[i] > 0.45 && !forming) {
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
        excite[i] = e + (target - e) * (target > e ? EXCITE_RISE : EXCITE_FALL);
        const lift = excite[i];

        let x = pos[i * 3];
        let y = pos[i * 3 + 1];
        let z = pos[i * 3 + 2];
        let entering = 1;

        if (forming) {
          // Each ring sets off a little after the one above it, so the shell
          // unwinds pole to pole instead of landing all at once.
          const local = Math.min(
            1,
            Math.max(0, (form - stagger[i] * FORM_STAGGER) / (1 - FORM_STAGGER)),
          );
          const eased = EASE_OUT(local);
          const away = 1 - eased;
          x += scatter[i * 3] * away;
          y += scatter[i * 3 + 1] * away;
          z += scatter[i * 3 + 2] * away;
          entering = FORM_DIM + eased * (1 - FORM_DIM);
        }

        // Breathing, plus however far the pointer has lifted this point off
        // the surface. The lift is along the normal, so the sphere dimples
        // outward under the cursor instead of smearing sideways.
        const swell =
          1 + (frozen ? 0 : 0.013 * Math.sin(breath + phase[i])) + lift * 0.075;
        x *= swell;
        y *= swell;
        z *= swell;

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

        /*
          A GENTLE depth ramp, plus a rim term. The bright edge on the
          reference is made by density — the projection crowds dots together
          at the silhouette — so alpha must not fight it; but a small lift
          exactly AT the silhouette (where front is near a half) sharpens the
          sphere's outline against the page without touching the face.
        */
        const rim = 1 - Math.abs(front - 0.5) * 2;
        // The lift shows up mostly as LIGHT, only a little as size. The first
        // pass had it the other way round and the excited patch read as a
        // sparser part of the sphere rather than a brighter one — swelling a
        // dot spreads the same energy over more pixels, so past about half a
        // dot's width it dims the very thing it is meant to be lighting.
        ctx.globalAlpha =
          Math.min(1, 0.24 + front * 0.46 + rim * rim * 0.13 + lift * 0.7) * entering;
        const size = (0.62 + front * 0.95 + lift * 0.62) * dot;
        // Out of focus round the back, in focus on the near face.
        ctx.drawImage(
          sprites[front < 0.32 ? tone[i] + 4 : tone[i]],
          px - size,
          py - size,
          size * 2,
          size * 2,
        );

        if (lift > LINK_FLOOR && front > 0.5 && wokenCount < LINK_POOL) {
          woken[wokenCount] = i;
          wokenCount += 1;
        }
      }

      /*
        THE SYNAPSES. Every pair among the points the pointer has woken, close
        enough to be neighbours, gets a line. This is what turns a node cloud
        into a brain — a starfield has no edges, and the edges are the whole
        idea.

        Drawn in three alpha buckets rather than one stroke per line: a
        hundred and seventy separate stroke() calls is a hundred and seventy
        state changes, while three paths carry the same falloff closely enough
        that nobody can see the difference.
      */
      if (wokenCount > 1 && !forming) {
        const maxDist = radius * LINK_DIST;
        const maxSq = maxDist * maxDist;
        const buckets: number[][] = [[], [], []];
        let drawn = 0;

        for (let a = 0; a < wokenCount && drawn < LINK_MAX; a += 1) {
          const ia = woken[a];
          const ax = screen[ia * 2];
          const ay = screen[ia * 2 + 1];
          for (let b = a + 1; b < wokenCount && drawn < LINK_MAX; b += 1) {
            const ib = woken[b];
            const dx = screen[ib * 2] - ax;
            const dy = screen[ib * 2 + 1] - ay;
            const d2 = dx * dx + dy * dy;
            if (d2 > maxSq) continue;
            const strength =
              (1 - Math.sqrt(d2) / maxDist) *
              Math.min(excite[ia], excite[ib]);
            if (strength < 0.06) continue;
            const bucket = strength > 0.42 ? 2 : strength > 0.2 ? 1 : 0;
            buckets[bucket].push(ax, ay, screen[ib * 2], screen[ib * 2 + 1]);
            drawn += 1;
          }
        }

        const ALPHAS = [0.12, 0.26, 0.5];
        ctx.lineCap = "round";
        for (let bucket = 0; bucket < 3; bucket += 1) {
          const lines = buckets[bucket];
          if (lines.length === 0) continue;
          ctx.beginPath();
          for (let k = 0; k < lines.length; k += 4) {
            ctx.moveTo(lines[k], lines[k + 1]);
            ctx.lineTo(lines[k + 2], lines[k + 3]);
          }
          ctx.strokeStyle = `rgba(206, 200, 255, ${ALPHAS[bucket]})`;
          ctx.lineWidth = dot * (0.55 + bucket * 0.35);
          ctx.stroke();
        }
      }

      /*
        The signals. A pulse is drawn through the projected positions of a run
        of consecutive dots on one ring, so it traces the sphere's own contour
        rather than cutting a chord across it. Any run that crosses the
        silhouette is skipped — its two ends are on opposite sides of the ball
        and a line between them would be a wire through the middle.
      */
      if (!frozen && !forming) {
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
            const idx = start + (((Math.floor(head - s) % len) + len) % len);
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

      /*
        The nucleus, last so it sits over the near face. It breathes on a
        slower cycle than the surface does — two rhythms at the same rate
        read as one, and the point of the second is to make the sphere feel
        like it has an inside.

        SMALL AND DIM. The first pass drew it wider than the sphere itself at
        four times this alpha; it quadrupled the section's total emission,
        flattened the contrast the dots depend on, and put a warm haze
        directly behind the wordmark. A core should be a core.
      */
      flare *= 0.94;
      const corePulse = frozen ? 0.5 : 0.5 + 0.5 * Math.sin(now * 0.00042);
      const coreSize = radius * (0.6 + corePulse * 0.06 + flare * 0.22);
      ctx.globalAlpha = Math.min(0.7, (0.15 + corePulse * 0.05 + flare * 0.42) * form);
      ctx.drawImage(coreSprite, cx - coreSize, cy - coreSize, coreSize * 2, coreSize * 2);

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

    // Reduce Motion skips the assembly outright and starts fully formed.
    if (still.matches) formedAt = -FORM_MS;
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
      const halfX = (rect.width || 1) / 2;
      const halfY = (rect.height || 1) / 2;
      const nx = Math.max(-2, Math.min(2, (pointerX - halfX) / halfX));
      const ny = Math.max(-2, Math.min(2, (pointerY - halfY) / halfY));
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
            leanYawVel = 0;
            leanPitchVel = 0;
            excite.fill(0);
            render(0);
          }
        }, 900);
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
        flare = 1;
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
        if (visible) {
          // The assembly starts the first time it is actually seen, not at
          // mount — otherwise it plays to nobody while the reader is still
          // in the hero.
          if (formedAt === 0) formedAt = performance.now();
          start();
        } else {
          stop();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    watcher.observe(host);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onPreference = () => {
      stop();
      if (still.matches) {
        formedAt = -FORM_MS;
        render(0);
      } else {
        start();
      }
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
        A wide static wash under the canvas. The reactive part of the core is
        painted on the canvas, where it can pulse; this is the ambient half,
        and repainting it 60 times a second to have it not change would be
        pure waste.
      */}
      <div
        className="absolute inset-[10%] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 50% 46%, rgb(255 212 0 / 0.10) 0%, rgb(247 113 158 / 0.07) 38%, rgb(122 60 255 / 0.08) 64%, transparent 78%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
