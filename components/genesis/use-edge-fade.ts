"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Fades a horizontal scroller's ends in proportion to how far it can still
 * travel that way.
 *
 * WHY IT IS DYNAMIC. A fixed mask veils the first card even when the rail is
 * already at its start, which hides content for no reason — the fade means
 * "there is more this way", so on an end with nothing beyond it there should
 * be no fade at all. And when everything fits, neither end should carry one.
 *
 * WHY IT WRITES CSS VARIABLES INSTEAD OF STATE. Putting the two widths in
 * React state would re-render the whole rail on every scroll frame in order to
 * move a gradient stop. These go straight onto the node through the ref, so
 * scrolling touches no React at all.
 *
 * Both custom properties default to 0% in the returned style, so the server
 * renders no fade and the effect fills them in once it can measure. There is
 * nothing for hydration to disagree about.
 */
export function useEdgeFade<T extends HTMLElement = HTMLDivElement>({
  /** Travel, in px, over which a fade reaches its full width. */
  ramp = 160,
  /**
   * Full fade width, as a percentage of the rail.
   *
   * 14 rather than 7. At 7% of a 1150px rail the fade was 80px against poster
   * cards nearly 500px wide — over a sixth of a card, which is not enough
   * distance to read as a card dissolving. It read as a card with a slightly
   * soft edge, which is a cut with an apology. Genesis asked for a gradient,
   * not a narrower guillotine; 14% is 160px, about a third of a card, and the
   * ramp is lengthened to match so the fade grows in step with the travel
   * rather than snapping to full width in the first few pixels of scroll.
   */
  max = 14,
}: { ramp?: number; max?: number } = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const rail = ref.current;
    if (!rail) return;

    const update = () => {
      const travel = rail.scrollWidth - rail.clientWidth;
      if (travel <= 1) {
        rail.style.setProperty("--fade-l", "0%");
        rail.style.setProperty("--fade-r", "0%");
        return;
      }
      const left = Math.min(1, rail.scrollLeft / ramp) * max;
      const right = Math.min(1, (travel - rail.scrollLeft) / ramp) * max;
      rail.style.setProperty("--fade-l", `${left.toFixed(2)}%`);
      rail.style.setProperty("--fade-r", `${right.toFixed(2)}%`);
    };

    update();
    rail.addEventListener("scroll", update, { passive: true });
    // Widths here are viewport-relative, so the overflow changes on resize
    // even when nothing has scrolled.
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    return () => {
      rail.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [ramp, max]);

  /*
    Three stops per side rather than two. A two-stop linear ramp fades at a
    constant rate, and against a bright poster that constant rate is visible
    as a band with its own edges — the thing it is supposed to be hiding. The
    midpoint at 45% alpha bends it into a curve that leaves black slowly and
    arrives at transparent quickly, which is what a fade into a page looks
    like.
  */
  const mask =
    "linear-gradient(90deg, transparent 0%, rgb(0 0 0 / 0.45) calc(var(--fade-l, 0%) * 0.55), #000 var(--fade-l, 0%), #000 calc(100% - var(--fade-r, 0%)), rgb(0 0 0 / 0.45) calc(100% - var(--fade-r, 0%) * 0.55), transparent 100%)";

  return {
    ref,
    style: { maskImage: mask, WebkitMaskImage: mask } as CSSProperties,
  };
}
