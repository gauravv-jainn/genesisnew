"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Lenis smooth scrolling, wired directly into GSAP.
 *
 * The integration matters more than the smoothing. Lenis and ScrollTrigger
 * must share one clock and one scroll signal:
 *
 *   - `lenis.on("scroll", ScrollTrigger.update)` — ScrollTrigger reads scroll
 *     position from Lenis rather than waiting for native scroll events.
 *   - Lenis is stepped from `gsap.ticker` instead of its own
 *     requestAnimationFrame loop, so pinned/scrubbed timelines are evaluated
 *     on the same frame the scroll position changed.
 *   - `lagSmoothing(0)` stops GSAP from silently skipping ahead after a long
 *     frame, which desynchronises a scrub from the scrollbar.
 *
 * An earlier version ran Lenis on its own rAF and notified ScrollTrigger via a
 * custom window event. The pin installed correctly but never advanced — the
 * scrub sat at progress 0 for the entire pinned range. This is the fix.
 *
 * Smoothing is disabled for reduced-motion users and on coarse pointers,
 * where hijacking native momentum reliably feels worse. ScrollTrigger still
 * works in that mode via native scroll events.
 */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (prefersReducedMotion || isTouch) {
      // Positions still need recomputing once fonts and images settle.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      return () => window.removeEventListener("load", refresh);
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      // gsap.ticker reports seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Trigger positions are measured at install time, before webfonts swap and
    // section reveals settle. Recompute once the page has fully loaded.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
