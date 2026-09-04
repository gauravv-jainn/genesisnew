"use client";

import { useRef } from "react";

import { GlassButton } from "@/components/genesis/glass-button";
import { Reveal } from "@/components/genesis/reveal";
import { Spectrum } from "@/components/genesis/atmosphere";
import { DivisionLockup } from "@/components/genesis/division-lockup";
import { services, studios } from "@/lib/home-content";

/**
 * Genesis Studios — the production vertical.
 *
 * IT WAS THE ONLY VERTICAL WITHOUT A SECTION. Influence, AI Labs and Brand &
 * Design each had one; Studios, the division whose entire argument is the
 * footage, had a link to another page. The brief is direct about it: show the
 * production capability rather than describing it.
 *
 * So the section leads with a wall of Genesis's own work and puts the
 * capability list underneath as a caption. Thirteen named services in a grid
 * is what this section would have been without the clips, and it would have
 * been the least convincing block on a page about making films.
 *
 * WHY POSTER-FIRST, PLAY ON HOVER. Sixteen autoplaying videos is sixteen live
 * decoders and sixteen files pulled on load. Each tile renders one <video>
 * with `preload="none"` and a poster, so the wall costs sixteen 40KB stills
 * until a pointer lands on one — then that one clip, and only that one,
 * starts fetching.
 *
 * THE WALL DRIFTS, IT DOES NOT SCROLL-JACK. Two rows moving in opposite
 * directions on a CSS transform animation — no JS, no scroll listener,
 * compositor-only. It pauses on hover so a tile can actually be watched, and
 * Reduce Motion stops it entirely and hands the rows back to the reader as
 * ordinary horizontal scrollers.
 */
export function Studios() {
  /*
    ONE ROW, NOT TWO. Two rows of tall tiles plus a header, a capability list
    and three buttons made this the longest section on the page — a scroll and
    a half for a division whose point is made in the first two seconds of
    looking at it. One row says the same thing in half the height.
  */
  const row = studios.reel;

  return (
    <section
      id="studios"
      className="scene-dark scene-open grain relative isolate overflow-hidden py-16 sm:py-20"
    >
      {/*
        Blends into the sections above and below, in the LIGHT theme only.
        This is one of only two chapters that pin themselves dark, and on a
        light page it butts straight into the neighbouring ground. The bands
        paint --chapter-blend, which is the PAGE's ground: white on light,
        transparent on dark, where the chapter is not an island at all and
        anything opaque here would itself cut the page-wide field.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-16"
        style={{
          background:
            "linear-gradient(180deg, var(--chapter-blend) 0%, color-mix(in srgb, var(--chapter-blend) 40%, transparent) 55%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-16"
        style={{
          background:
            "linear-gradient(0deg, var(--chapter-blend) 0%, color-mix(in srgb, var(--chapter-blend) 40%, transparent) 55%, transparent 100%)",
        }}
      />

      <Spectrum />

      <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <Reveal className="max-w-xl">
            <DivisionLockup
              name="Studios"
              tagline={services.items[2].caption}
              ramp={services.items[2].ramp}
            />
          </Reveal>

          <Reveal delay={0.1} className="max-w-sm">
            <p className="text-small leading-relaxed text-ash">{studios.body}</p>
          </Reveal>
        </div>
      </div>

      {/*
        Full-bleed, and clipped at both edges. A reel wall with air either
        side of it reads as a widget dropped into the section; running off
        both edges is what makes it read as more work than fits.
      */}
      <Reveal variant="scene" className="relative mt-10 sm:mt-12">
        <ReelRow clips={row} />

        {/* The wall fades out rather than being cut off by the viewport. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28"
          style={{
            background:
              "linear-gradient(90deg, var(--surface-base) 0%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28"
          style={{
            background:
              "linear-gradient(270deg, var(--surface-base) 0%, transparent 100%)",
          }}
        />
      </Reveal>

      <div className="relative z-[2] mx-auto mt-10 w-full max-w-6xl px-6 sm:mt-12">
        {/*
          THE CAPABILITY LIST IS GONE from this section at Genesis's request.
          Thirteen service names set as a run-on line under a wall of footage
          was the section explaining what the footage already showed, and it
          was the last thing standing between Studios and one screen.
        */}

        <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
          <GlassButton
            href="/#contact"
            quickContact="studios:plan-a-shoot"
            variant="brand"
            size="lg"
            arrow
          >
            Plan a shoot
          </GlassButton>
          <GlassButton href="/content-creation" variant="glass" size="lg" arrow>
            Explore Genesis Studios
          </GlassButton>
          <GlassButton href="/our-work" variant="ghost" size="lg" arrow>
            View studio work
          </GlassButton>
        </Reveal>
      </div>
    </section>
  );
}

function ReelRow({ clips }: { clips: readonly number[] }) {
  // Doubled so the translate can loop seamlessly: at -50% the second copy
  // sits exactly where the first started.
  const doubled = [...clips, ...clips];

  return (
    <div
      className="group/row relative flex overflow-x-auto overflow-y-hidden motion-safe:overflow-hidden"
      // Reduce Motion turns the row into a plain scroller, so the work is
      // still reachable when the drift is switched off.
      role="list"
      aria-label="Selected production work"
    >
      <div
        className={[
          "flex shrink-0 gap-4 pl-4",
          "motion-safe:animate-[reel-drift_60s_linear_infinite]",
          "motion-safe:group-hover/row:[animation-play-state:paused]",
        ].join(" ")}
      >
        {doubled.map((n, index) => (
          <ReelTile key={`${n}-${index}`} n={n} duplicate={index >= clips.length} />
        ))}
      </div>
    </div>
  );
}

function ReelTile({ n, duplicate }: { n: number; duplicate: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  const play = () => void ref.current?.play().catch(() => {});
  const stop = () => {
    const video = ref.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <div
      role="listitem"
      // The second copy exists only to make the loop seamless; announcing
      // every clip twice is noise.
      aria-hidden={duplicate || undefined}
      className="relative w-[clamp(8rem,13vw,11rem)] shrink-0 overflow-hidden rounded-card border border-[var(--glass-border)] bg-ink"
    >
      <video
        ref={ref}
        src={`/work/clips/${n}.mp4`}
        poster={`/work/posters/${n}.jpg`}
        muted
        loop
        playsInline
        // Nothing but the poster until a pointer arrives.
        preload="none"
        onMouseEnter={play}
        onMouseLeave={stop}
        className="aspect-[9/13] w-full object-cover"
      />
    </div>
  );
}
