"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * The Services → Portfolio camera turn.
 *
 * Spec: "the slides move, and when going from services to portfolio the
 * camera turns 180*". Two clauses, and both are implemented here.
 *
 * WHY IT USED TO READ AS A CARD FLIP. Two coplanar faces with
 * `backface-visibility: hidden` is the CSS flip-card recipe: at 90° both faces
 * are edge-on and neither is drawn, so the middle of the transition was an
 * empty black frame and the ground, grain and light jumped discontinuously at
 * the swap. A page turning over, not a camera moving.
 *
 * Three things fix that, and they work together:
 *
 *   1. A ROOM THAT PERSISTS. The ground, grain and key light now live outside
 *      the rotating stage, so they carry continuously through the turn. At the
 *      halfway point you are looking at a lit room rather than at nothing,
 *      which is the whole difference between "the camera moved" and "the card
 *      flipped".
 *
 *   2. THE CAMERA PULLS BACK to come around. The stage dips to 0.94 at the
 *      midpoint and returns. A camera swinging around a subject does not hold
 *      a constant distance, and this is the cue that sells the move as one.
 *
 *   3. THE SLIDES MOVE. The poster rail on the far face is scrubbed sideways
 *      by the same progress that drives the yaw, so the work is already in
 *      motion when the camera arrives on it. That is the spec's first clause,
 *      and it was previously unimplemented.
 *
 * VERIFICATION NOTE: this effect cannot be exercised by scripting
 * `window.scrollTo` in a headless/automated browser — that moves the scroll
 * position without emitting `scroll` events, so every scroll-driven library
 * (ScrollTrigger, Framer's `useScroll`, or a hand-rolled listener) correctly
 * stays at progress 0. Dispatching a synthetic `scroll` event afterwards
 * drives it as expected. The turn therefore needs a human scroll to sign off
 * on feel; the mechanism itself is confirmed.
 *
 * Degradation is total below `lg` and under `prefers-reduced-motion`: GSAP's
 * matchMedia never installs the pin, so the two sections simply stack and
 * scroll. A 3D-transformed ancestor breaks `position: fixed` for descendants
 * and is expensive to composite on phones, so the effect is absent there
 * rather than approximated.
 *
 * WHICH MEANS EVERY LAYOUT CLASS HERE CARRIES `motion-safe:` TOO, and that is
 * not decoration. The pin installs under
 *
 *     (min-width: 1024px) and (prefers-reduced-motion: no-preference)
 *
 * but the geometry used to be plain `lg:` — `lg:h-dvh lg:overflow-hidden` on
 * the stage and `lg:absolute lg:inset-0` on both faces. So a desktop visitor
 * with Reduce Motion enabled got the geometry WITHOUT the mechanism that
 * makes it work: two full sections pinned on top of one another inside a
 * 100dvh overflow-hidden box, every line of one printed over the other, and
 * the second section unreachable. Measured at 1440px: the Services numerals
 * sat at 100% overlap on the poster titles.
 *
 * The CSS query and the JS query have to be the same query. `motion-safe:`
 * is that query, so the fallback is now what the paragraph above claims:
 * ordinary document flow, one section after the other.
 */
export function CameraPan({
  front,
  back,
}: {
  front: ReactNode;
  back: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const backFaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const backFace = backFaceRef.current;
    if (!root || !stage || !backFace) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        // Pre-rotate the far face so it meets the camera at the end of the
        // turn. Applied here rather than in markup so the mobile fallback,
        // which has no perspective, never renders a mirrored section.
        gsap.set(backFace, { rotateY: 180 });
        gsap.set(stage, { transformStyle: "preserve-3d" });

        // The rail that "the slides move" refers to. Queried rather than
        // threaded through as a ref, because the far face is an opaque
        // ReactNode from the caller's side.
        const rail = backFace.querySelector<HTMLElement>("[data-poster-rail]");

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            // Length of the turn. Longer reads cinematic; shorter reads twitchy.
            end: "+=160%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(stage, { rotateY: -180, ease: "none", duration: 1 }, 0)
          // Pull back through the middle and settle — a camera arcing around a
          // subject does not hold a constant distance.
          .to(stage, { scale: 0.94, ease: "sine.inOut", duration: 0.5 }, 0)
          .to(stage, { scale: 1, ease: "sine.inOut", duration: 0.5 }, 0.5);

        if (rail) {
          // Scrub the rail across most of its overflow, so the work is already
          // travelling when the camera lands on it. Recomputed on refresh so a
          // resize cannot leave it scrolled past the end.
          timeline.fromTo(
            rail,
            { scrollLeft: 0 },
            {
              scrollLeft: () => Math.max(0, rail.scrollWidth - rail.clientWidth) * 0.85,
              ease: "none",
              duration: 1,
            },
            0,
          );
        }

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
          gsap.set([stage, backFace], { clearProps: "all" });
          if (rail) rail.scrollLeft = 0;
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <div className="relative motion-safe:lg:h-dvh motion-safe:lg:overflow-hidden motion-safe:lg:[perspective:1800px]">
        {/*
          The room the turn happens inside. OUTSIDE the rotating stage, so it
          does not turn with the faces and is what you see at the halfway point
          when both faces are edge-on. Without this the midpoint is black.
        */}
        <div
          aria-hidden
          className="grain pointer-events-none absolute inset-0 hidden bg-void motion-safe:lg:block"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(78% 62% at 62% 8%, rgb(255 176 92 / 0.16) 0%, rgb(255 138 61 / 0.06) 34%, transparent 68%), radial-gradient(120% 80% at 50% 108%, rgb(24 20 26 / 0.9) 0%, transparent 70%)",
            }}
          />
        </div>

        <div ref={stageRef} className="motion-safe:lg:relative motion-safe:lg:h-full">
          <Face>{front}</Face>
          <Face ref={backFaceRef}>{back}</Face>
        </div>
      </div>
    </div>
  );
}

/**
 * One face of the stage. Scrolls internally if its section is taller than the
 * viewport, so a long section is never silently cropped by the turn.
 */
function Face({
  ref,
  children,
}: {
  ref?: React.Ref<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <div
      ref={ref}
      // Lenis hijacks the wheel globally, so a face's `overflow-y-auto` never
      // actually ran and any content past the fold was unreachable. This opts
      // the face out of the smooth-scroll handler. Both faces are now composed
      // to fit 100dvh anyway, so this is the safety net rather than the plan.
      data-lenis-prevent
      className="no-scrollbar motion-safe:lg:absolute motion-safe:lg:inset-0 motion-safe:lg:overflow-y-auto motion-safe:lg:[backface-visibility:hidden]"
    >
      {children}
    </div>
  );
}
