"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Apple Watch style logo cluster.
 *
 * Straight from the spec, which asks for this twice: client logos
 * "//movable like Apple Watch Apps", and testimonials "//this will like move
 * around like how apps move around in an apple watch".
 *
 * Items sit on a honeycomb lattice inside a draggable plane. Each item scales
 * by its distance from the centre of the viewport window, so the cluster
 * bulges in the middle and falls away at the edges — the characteristic watch
 * behaviour. Scaling is driven entirely by MotionValues, so dragging never
 * triggers a React re-render.
 */

export type ClusterItem = {
  id: string;
  content: ReactNode;
};

/**
 * Honeycomb lattice positions, generated as concentric rings.
 * Odd rows are offset half a cell so the packing interlocks.
 */
function honeycomb(count: number, cell: number) {
  const positions: { x: number; y: number }[] = [];
  const rowHeight = cell * 0.86;

  let ring = 0;
  while (positions.length < count) {
    if (ring === 0) {
      positions.push({ x: 0, y: 0 });
      ring += 1;
      continue;
    }
    // Six sides per ring, `ring` items along each.
    for (let side = 0; side < 6 && positions.length < count; side += 1) {
      for (let step = 0; step < ring && positions.length < count; step += 1) {
        const angle = (Math.PI / 3) * side;
        const nextAngle = (Math.PI / 3) * ((side + 1) % 6);
        const t = step / ring;
        // Rounded on purpose: Framer serialises style values at reduced
        // precision during SSR, so an unrounded float like -75.00000000000007
        // renders as "-75px" on the server and mismatches on hydration.
        const x = Math.round(
          ring * cell * (Math.cos(angle) * (1 - t) + Math.cos(nextAngle) * t),
        );
        const y = Math.round(
          ring * rowHeight * (Math.sin(angle) * (1 - t) + Math.sin(nextAngle) * t),
        );
        positions.push({ x, y });
      }
    }
    ring += 1;
  }

  return positions;
}

export function WatchCluster({
  items,
  cell = 132,
  height = 460,
  className,
}: {
  items: ClusterItem[];
  /** Spacing between lattice centres, in px. */
  cell?: number;
  height?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const clipId = useId().replace(/:/g, "");

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Spring-smoothed, so the wall eases after the pointer rather than
  // tracking it rigidly.
  const x = useSpring(dragX, { stiffness: 220, damping: 30, mass: 0.7 });
  const y = useSpring(dragY, { stiffness: 220, damping: 30, mass: 0.7 });

  const positions = honeycomb(items.length, cell);

  // How far from centre an item can be before it reaches minimum scale.
  const falloff = cell * 2.4;

  return (
    <div
      className={cn("relative isolate w-full overflow-hidden", className)}
      style={{
        height,
        /*
          THE FADE HAS TO REACH ZERO AT THE EDGE, which is the whole fix.

          This was one radial — 75% 75% at 50% 50%, black to 55%, transparent
          at 100% — and a radial sized in percentages of the BOX is not sized
          in percentages of the visible area. On the 400px logo wall its
          vertical radius was 300px from the centre while the box edge is only
          200px away, so the gradient was still at 74% opacity exactly where
          overflow:hidden cut it. Measured, the wall's content ran from -30px
          to 430px inside that 400px box: 30px of card guillotined at
          three-quarter brightness, top and bottom. The people wall was worse,
          69px off the bottom.

          Two linear gradients intersected instead. Each runs to fully
          transparent AT its own edge, so whatever the lattice does outside the
          box has already faded to nothing before the clip can reach it, and
          the middle stays at full opacity rather than being dimmed by a
          vignette. The bands are wider vertically than horizontally because
          that is where the honeycomb overruns.
        */
        maskImage:
          "linear-gradient(90deg, transparent 0%, #000 13%, #000 87%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 20%, #000 80%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, #000 13%, #000 87%, transparent 100%), linear-gradient(180deg, transparent 0%, #000 20%, #000 80%, transparent 100%)",
        // Both spellings: the standard property, and the older WebKit one for
        // Safari versions that only understand that.
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
      aria-describedby={clipId}
      onPointerMove={(event) => {
        if (prefersReducedMotion) return;
        const box = event.currentTarget.getBoundingClientRect();
        // Inverted: pointing right pulls the wall left, so what was off the
        // right edge comes into view.
        const nx = (event.clientX - box.left) / box.width - 0.5;
        const ny = (event.clientY - box.top) / box.height - 0.5;
        dragX.set(-nx * cell * 1.6);
        dragY.set(-ny * cell * 1.1);
      }}
      onPointerLeave={() => {
        dragX.set(0);
        dragY.set(0);
      }}
    >
      <p id={clipId} className="sr-only">
        A cluster of client logos. It drifts toward the pointer; every logo is
        in the document order below.
      </p>

      <motion.div
        /*
          IT FOLLOWS THE POINTER; IT IS NOT DRAGGED. Dragging asked the reader
          to discover that the wall could be moved at all, and then to do the
          work — on a section whose only job is to say "these are the brands".
          The cluster now leans toward wherever the pointer is, which reveals
          the same off-centre logos for no effort and nothing to learn.

          This IS automatic motion, unlike a drag, so it is gated on
          prefers-reduced-motion. Nothing is lost when it is off: the cluster
          is sized so every logo is inside the frame at rest, and the lean
          only changes which of them sit under the brightest part of the mask.
        */
        style={{ x, y }}
        className="absolute inset-0"
      >
        {items.map((item, index) => (
          <ClusterCell
            key={item.id}
            position={positions[index]}
            x={x}
            y={y}
            falloff={falloff}
          >
            {item.content}
          </ClusterCell>
        ))}
      </motion.div>
    </div>
  );
}

function ClusterCell({
  position,
  x,
  y,
  falloff,
  children,
}: {
  position: { x: number; y: number };
  x: MotionValue<number>;
  y: MotionValue<number>;
  falloff: number;
  children: ReactNode;
}) {
  // Distance from the window centre, accounting for the current drag offset.
  const distance = useTransform<number, number>([x, y], ([dx, dy]) =>
    Math.hypot(position.x + dx, position.y + dy),
  );

  // Fixed precision keeps the server and client strings byte-identical; see
  // the note in `honeycomb` above.
  const round = (value: number) => Number(value.toFixed(4));

  const scale = useTransform(distance, (value) =>
    round(
      1 + (0.5 - 1) * Math.min(1, Math.max(0, value / falloff)),
    ),
  );
  const opacity = useTransform(distance, (value) =>
    round(
      1 + (0.35 - 1) * Math.min(1, Math.max(0, value / falloff)),
    ),
  );

  return (
    <motion.div
      style={{
        left: "50%",
        top: "50%",
        marginLeft: position.x,
        marginTop: position.y,
        scale,
        opacity,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      {children}
    </motion.div>
  );
}
