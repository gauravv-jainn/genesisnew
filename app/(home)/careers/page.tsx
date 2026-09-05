import type { Metadata } from "next";

import { GenesisForm } from "@/components/genesis/genesis-form";
import { Atmosphere } from "@/components/genesis/atmosphere";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { careersPage } from "@/lib/page-content";

export const metadata: Metadata = {
  title: "Careers",
  description: careersPage.body,
};

/**
 * /careers — the application, on the page's own ground.
 *
 * WHY THE BOTANICAL SCENE IS GONE. This page painted its own world: a mint-fog
 * bank, forty-six SVG stems silhouetted against it and twenty-six drifting
 * motes, all held inside `scene-dark bg-void`. It was built to a reference and
 * it was the only page on the site that did this.
 *
 * Two things were wrong with it and they have the same cause. The colours
 * belonged to no part of the identity — recolouring the fog to brand tokens
 * helped and did not fix it, because a bespoke scene is bespoke whatever hue
 * it is. And `scene-dark` PINS the dark tokens for the subtree, so the theme
 * toggle did nothing here: Genesis switched to light and got a black page with
 * a light switch on it.
 *
 * `Atmosphere` is what every other section on this site stands on. It follows
 * the theme, it carries the brand wash, and it is one line. The page loses a
 * scene it did not need and gains a light mode it should always have had.
 */
export default function CareersPage() {
  return (
    <Atmosphere
      tone="brand"
      origin="top"
      intensity={0.2}
      className="relative isolate min-h-dvh overflow-hidden"
    >
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

        {/*
          THE ACCENT IS SET THE WAY EVERY OTHER HEADING ON THIS SITE IS.

          It was a GlowWord — a lit word held in glass, which is a lovely thing
          on a black page and was the last piece of the reference this page was
          built to. On the light theme it rendered pale gold on near-white and
          all but vanished: the glow IS the letterform there, and a glow needs
          something dark to be a glow against.

          Serif italic in --brand-ink is the site's own accent, and that token
          already carries a dark value for light mode (#7a6000). One treatment,
          both themes, and this heading finally matches the other twelve.
        */}
        <Reveal delay={0.12}>
          <p className="mt-2 font-serif text-h2 font-normal italic text-brand-ink sm:text-h1">
            {careersPage.headingAccent}
          </p>
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
    </Atmosphere>
  );
}
