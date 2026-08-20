"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * A page that arrives from below — the spec's "I'm a creator page ⟶ slide up".
 *
 * The whole page rises into place on mount rather than fading, so following
 * the link reads as moving somewhere rather than swapping content. Kept to
 * transform and opacity so it composites, and skipped entirely under
 * `prefers-reduced-motion`, where a full-page translation is exactly the kind
 * of thing that triggers discomfort.
 */
export function SlideUp({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return <>{children}</>;

  return (
    <motion.div
      initial={{ y: 64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
