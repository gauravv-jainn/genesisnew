import type { Metadata } from "next";

import { GenesisForm } from "@/components/genesis/genesis-form";
import { GlowWord } from "@/components/genesis/glow-word";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { careersPage } from "@/lib/page-content";

export const metadata: Metadata = {
  title: "Careers",
  description: careersPage.body,
};

/**
 * /careers — the waitlist, built to p05_1.
 *
 * PINNED DARK. This page is a lit scene, not a surface: one word glowing in
 * darkness over a lit bank. In light mode the glow had nothing to shine
 * against — the glowing word vanished entirely and the scene became a pale
 * fog. `.scene-dark` re-declares the dark tokens for this subtree so the
 * composition holds in either theme, while the nav outside it still follows
 * the visitor's choice.
 *
 * The reference is one idea: a single word lit from within, held in a glass
 * capsule, over a dark scene that glows from below. Everything else on the
 * page defers to it — one action, one line of scarcity, nothing to navigate
 * away to.
 */
export default function CareersPage() {
  return (
    <main className="scene-dark relative isolate min-h-dvh overflow-hidden bg-void">
      {/*
        The ground the scene grows out of.

        p05_1 puts a lit botanical bed across its lower half — that bed is
        where all of its light comes from, and it is why the reference sits at
        75.7% shadow with a mean luminance of 34.9 while this page sat at 95.4%
        and 18.1: a page-wide 22%-alpha wash is not a light source.

        The bed itself is photography and cannot be reproduced here. Its
        STRUCTURE can: a bright bank low in the frame with growth silhouetted
        against it, so the light has something to come from and something to
        rake across.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            /*
              GENESIS'S COLOURS, NOT A FOREST'S. This fog was mint and teal —
              rgb(186 236 204) over #04120f — which belongs to no part of the
              identity. The page read as a different site with the Genesis nav
              bolted on.

              Rebuilt from the tokens: --page-ground's violet (#191333) for the
              depth and --brand-ink (#ffd400) for the light, at the same
              opacities the mint version used, so the shape of the fog is
              unchanged and only its hue moves.
            */
            "radial-gradient(58% 26% at 50% 72%, rgb(255 212 0 / 0.20) 0%, rgb(196 150 255 / 0.16) 34%, rgb(84 60 140 / 0.13) 58%, transparent 80%), radial-gradient(86% 40% at 50% 88%, rgb(140 108 220 / 0.22) 0%, transparent 68%), radial-gradient(56% 30% at 50% 30%, rgb(255 212 0 / 0.07) 0%, transparent 70%)",
        }}
      />

      {/* Growth rising into the light, silhouetted against the bank. */}
      <svg
        aria-hidden
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-[46%] h-[34%] w-full"
      >
        <defs>
          <linearGradient id="careers-stem" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#120f18" stopOpacity="0.96" />
            <stop offset="70%" stopColor="#191333" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1d1528" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 46 }).map((_, i) => {
          const seeded = (salt: number) => {
            const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
            return v - Math.floor(v);
          };
          const x = seeded(1) * 1200;
          const h = 90 + seeded(2) * 175;
          const lean = (seeded(3) - 0.5) * 60;
          const w = 1.4 + seeded(4) * 2.4;
          return (
            <path
              key={i}
              d={`M ${x.toFixed(1)} 300 Q ${(x + lean * 0.4).toFixed(1)} ${(300 - h * 0.55).toFixed(1)} ${(x + lean).toFixed(1)} ${(300 - h).toFixed(1)}`}
              stroke="url(#careers-stem)"
              strokeWidth={w.toFixed(2)}
              fill="none"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Motes drifting in the light. Deterministic so SSR matches. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {Array.from({ length: 26 }).map((_, i) => {
          const seeded = (salt: number) => {
            const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
            return v - Math.floor(v);
          };
          return (
            <span
              key={i}
              className="absolute rounded-full bg-white "
              style={
                {
                  left: `${(seeded(1) * 100).toFixed(2)}%`,
                  top: `${(38 + seeded(2) * 52).toFixed(2)}%`,
                  width: `${(1 + seeded(3) * 2).toFixed(1)}px`,
                  height: `${(1 + seeded(3) * 2).toFixed(1)}px`,
                  opacity: (0.12 + seeded(4) * 0.4).toFixed(2),
                  "--float-duration": `${(7 + seeded(5) * 7).toFixed(1)}s`,
                  animationDelay: `-${(seeded(6) * 8).toFixed(1)}s`,
                } as React.CSSProperties
              }
            />
          );
        })}
      </div>

      <div className="relative z-[2] mx-auto flex min-h-dvh w-full max-w-3xl flex-col items-center justify-center px-6 py-32 text-center">
        <Reveal>
          <SectionLabel dot tone="brand" className="justify-center">
            {careersPage.label}
          </SectionLabel>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-8 text-balance text-h2 font-normal leading-[1.15] tracking-tight text-bone sm:text-h1 lg:text-h1">
            {careersPage.heading}
          </h1>
        </Reveal>

        {/* The lit word, held in glass — the whole point of the reference. */}
        <Reveal delay={0.12}>
          <GlowWord tone="warm" className="mt-6 text-h2 sm:text-h1 lg:text-h1">
            {careersPage.headingAccent}
          </GlowWord>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-12 max-w-lg text-pretty text-small leading-relaxed text-ash sm:text-body">
            {careersPage.body}
          </p>
        </Reveal>

        <Reveal delay={0.24} className="mt-12 w-full max-w-xl">
          {/*
            The full application, not the four-field waitlist this was.
            Name/email/message could not tell you what someone applied FOR —
            every application arrived as prose that a human had to read to
            find the discipline. The `career` spec asks for the position as a
            field, so it sorts in the sheet.
          */}
          <GenesisForm kind="career" source="/careers" compact />
        </Reveal>

        {/* TODO(copy): confirm before launch — this is a scarcity claim. */}
        <Reveal delay={0.3}>
          <p className="mt-6 text-small text-faint">
            We open roles in batches. Only a few spots each round.
          </p>
        </Reveal>

        <div className="mt-16">
          <Reveal>
            <p className="micro-label">Disciplines we hire for</p>
          </Reveal>
          <RevealGroup className="mt-6 flex flex-wrap justify-center gap-3">
            {careersPage.disciplines.map((discipline) => (
              <RevealItem key={discipline}>
                <span className="glass-chip rounded-full px-4 py-2 text-small text-ash">
                  {discipline}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </main>
  );
}
