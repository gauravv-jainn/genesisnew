"use client";

import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useCallback, type PointerEvent } from "react";

/**
 * Pointer-follow ("magnetic") behaviour, defined once and shared by every
 * component that needs it — the floating paper cards, glass buttons, and the
 * orbiting card cluster.
 *
 * Returns spring-damped x/y offsets plus the handlers to spread onto the
 * element. Honours `prefers-reduced-motion` by pinning the offsets to zero.
 */
export function useMagnetic(strength = 0.35) {
  const prefersReducedMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const spring = { stiffness: 200, damping: 18, mass: 0.6 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion) return;
      // Coarse pointers (touch) have no hover state to track.
      if (event.pointerType !== "mouse") return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const offsetX = event.clientX - (bounds.left + bounds.width / 2);
      const offsetY = event.clientY - (bounds.top + bounds.height / 2);

      rawX.set(offsetX * strength);
      rawY.set(offsetY * strength);
    },
    [prefersReducedMotion, rawX, rawY, strength],
  );

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return {
    x: prefersReducedMotion ? 0 : x,
    y: prefersReducedMotion ? 0 : y,
    magneticProps: { onPointerMove, onPointerLeave },
  };
}
