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
 * Apple Watch style draggable cluster.
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

  // Spring-smooth the drag so releasing glides instead of stopping dead.
  const x = useSpring(dragX, { stiffness: 220, damping: 30, mass: 0.7 });
  const y = useSpring(dragY, { stiffness: 220, damping: 30, mass: 0.7 });

  const positions = honeycomb(items.length, cell);

  // How far from centre an item can be before it reaches minimum scale.
  const falloff = cell * 2.4;

  return (
    <div
      className={cn(
        "relative isolate w-full overflow-hidden",
        // Fade the cluster out at every edge so it reads as a window onto
        // something larger, not a box with items clipped against a hard line.
        "[mask-image:radial-gradient(75%_75%_at_50%_50%,black_55%,transparent_100%)]",
        className,
      )}
      style={{ height }}
      aria-describedby={clipId}
    >
      <p id={clipId} className="sr-only">
        Draggable cluster. All items are also listed in the document order below.
      </p>

      <motion.div
        drag={!prefersReducedMotion}
        dragConstraints={{ left: -cell * 3, right: cell * 3, top: -cell * 2, bottom: cell * 2 }}
        dragElastic={0.12}
        dragMomentum
        style={{ x: dragX, y: dragY }}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
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
