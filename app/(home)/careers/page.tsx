import type { Metadata } from "next";

import { ContactForm } from "@/components/genesis/contact-form";
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
 * The reference is one idea: a single word lit from within, held in a glass
 * capsule, over a dark scene that glows from below. Everything else on the
 * page defers to it — one action, one line of scarcity, nothing to navigate
 * away to.
 */
export default function CareersPage() {
  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-void">
      {/* The ground glow the scene sits in. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(72% 46% at 50% 104%, rgb(120 190 160 / 0.22) 0%, rgb(60 120 110 / 0.09) 38%, transparent 72%), radial-gradient(60% 40% at 50% 30%, rgb(255 236 200 / 0.05) 0%, transparent 70%)",
        }}
      />

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
              className="absolute rounded-full bg-white motion-safe:animate-[genesis-paper-float_var(--float-duration)_ease-in-out_infinite]"
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
          <SectionLabel dot tone="amber" className="justify-center">
            {careersPage.label}
          </SectionLabel>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-8 text-balance text-4xl font-semibold leading-[1.15] tracking-tight text-bone sm:text-5xl lg:text-6xl">
            {careersPage.heading}
          </h1>
        </Reveal>

        {/* The lit word, held in glass — the whole point of the reference. */}
        <Reveal delay={0.12}>
          <GlowWord tone="warm" className="mt-6 text-4xl sm:text-5xl lg:text-6xl">
            {careersPage.headingAccent}
          </GlowWord>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-10 max-w-lg text-pretty text-sm leading-relaxed text-ash sm:text-base">
            {careersPage.body}
          </p>
        </Reveal>

        <Reveal delay={0.24} className="mt-12 w-full max-w-xl">
          <ContactForm
            type="CAREERS_WAITLIST"
            source="/careers"
            submitLabel="Join the waitlist"
            showCompany={false}
            messageLabel="Discipline, experience and a link to your work"
          />
        </Reveal>

        {/* TODO(copy): confirm before launch — this is a scarcity claim. */}
        <Reveal delay={0.3}>
          <p className="mt-6 text-xs text-faint">
            We open roles in batches. Only a few spots each round.
          </p>
        </Reveal>

        <div className="mt-16">
          <Reveal>
            <p className="micro-label">Disciplines we hire for</p>
          </Reveal>
          <RevealGroup className="mt-6 flex flex-wrap justify-center gap-2.5">
            {careersPage.disciplines.map((discipline) => (
              <RevealItem key={discipline}>
                <span className="glass rounded-full px-4 py-2 text-[13px] text-ash">
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
