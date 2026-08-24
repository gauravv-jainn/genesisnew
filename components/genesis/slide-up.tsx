import type { ReactNode } from "react";

/**
 * A page that arrives from below — the spec's "I'm a creator page ⟶ slide up".
 *
 * The whole page rises into place on mount rather than fading, so following
 * the link reads as moving somewhere rather than swapping content. Kept to
 * transform and opacity so it composites.
 *
 * A CSS ANIMATION, NOT A MOTION COMPONENT, and the reason is worth keeping.
 * The previous version called useReducedMotion() and, when it was set, did
 * `return <>{children}</>` — an early return that changes the SHAPE of the
 * tree rather than one attribute on it. useReducedMotion() is null during SSR
 * and true in the browser, so the server rendered a wrapper and the client
 * expected a bare fragment. React cannot reconcile that, so it discarded the
 * server render of the whole page for exactly the visitors who had asked for
 * less work per frame.
 *
 * `motion-safe:` is a media query. It resolves identically on the server and
 * in the browser, so there is nothing to reconcile, and reduced-motion
 * visitors simply never get the animation. No hook, no client boundary.
 */
export function SlideUp({ children }: { children: ReactNode }) {
  return (
    <div className="motion-safe:animate-[genesis-slide-up_0.62s_cubic-bezier(0.22,1,0.36,1)_both]">
      {children}
    </div>
  );
}
