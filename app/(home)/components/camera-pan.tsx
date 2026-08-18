"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * The Services → Portfolio camera turn.
 *
 * Spec: "the slides move, and when going from services to portfolio the
 * camera turns 180*".
 *
 * Services and Portfolio are mounted as the two faces of one stage. GSAP
 * ScrollTrigger pins the stage and scrubs its yaw from 0° to -180°, so the
 * viewer reads it as the camera swinging around to face the other side rather
 * than one section replacing another.
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

        const tween = gsap.to(stage, {
          rotateY: -180,
          ease: "none",
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

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set([stage, backFace], { clearProps: "all" });
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <div className="lg:h-dvh lg:overflow-hidden lg:[perspective:1800px]">
        <div ref={stageRef} className="lg:relative lg:h-full">
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
      className="no-scrollbar lg:absolute lg:inset-0 lg:overflow-y-auto lg:[backface-visibility:hidden]"
    >
      {children}
    </div>
  );
}
