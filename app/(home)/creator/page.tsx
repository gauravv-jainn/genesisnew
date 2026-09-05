import type { Metadata } from "next";

import { GenesisForm } from "@/components/genesis/genesis-form";
import { SlideUp } from "@/components/genesis/slide-up";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { CornerNote, Spotlight } from "@/components/genesis/spotlight";
import { creatorPage } from "@/lib/page-content";
import { SectionShell } from "../components/section-shell";

export const metadata: Metadata = {
  title: "For Creators",
  description: creatorPage.body,
};

/**
 * /creator — "I'm a Creator", built to p05_0.
 *
 * One hard light from upper right, the offer pinned beneath it as cards at
 * angles, oversized ghosted type behind, and editorial corner annotations.
 * The copy stays plain-spoken on purpose: creators read a hundred agency
 * pages, and what decides it is briefs, money and repeat work.
 */
export default function CreatorPage() {
  return (
    <SlideUp>
    <main>
      <section className="relative isolate overflow-hidden pt-32 pb-32 sm:pt-40">
        {/*
          THE SPOTLIGHT STOPS ABOVE THE CARDS.

          It was reach 96 at full intensity — a cone falling almost the whole
          section, which landed on cards 03 and 04 and washed them to a pale
          yellow their body copy could not be read against. A spotlight that
          lights the headline is drama; one that lights the paragraphs is a
          filter over them.
        */}
        <Spotlight x={68} spread={17} tone="warm" intensity={0.82} reach={58} />

        {/*
          THE GHOST WORDMARK IS GONE FROM THIS PAGE.

          It was "FOR CREATORS" at up to 22rem across the whole hero. Bounding
          it to the headline band stopped it printing through the cards, and
          left it doing the other half of the damage — sitting directly behind
          "Work with Genesis" at a weight close enough to compete with it. Two
          headlines occupying one space, one of which is decoration.

          The section already has scale: a spotlight, a 4rem headline and four
          pinned cards. It did not need a fifth voice, and Genesis was right
          that the page looked wrong with it. GhostType still earns its place
          on sections that are mostly type and air; this one is neither.
        */}

        <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <Reveal className="max-w-xl">
              <SectionLabel dot tone="brand">
                {creatorPage.label}
              </SectionLabel>
              <h1 className="mt-6 text-balance text-h2 font-normal leading-[1.05] tracking-tight text-bone sm:text-h1 lg:text-h1">
                {creatorPage.heading}{" "}
                <span className="font-serif font-normal italic text-brand-ink">
                  {creatorPage.headingAccent}
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <CornerNote index="Creators">{creatorPage.body}</CornerNote>
            </Reveal>
          </div>

          <RevealGroup className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {creatorPage.benefits.map((benefit, index) => (
              <RevealItem key={benefit.title} className="h-full">
                {/*
                  PLAIN CARDS, at Genesis's instruction. These were PaperCards:
                  pinned, tilted and tinted, each holding two sentences. Four of
                  them in a row was three effects and a paragraph competing for
                  the same square — the pin drew the eye to a corner, the tilt
                  said "loose note" while the content was a list of commitments,
                  and the tint made the copy fight its own background.

                  A title and one line, level, in the same glass surface the
                  rest of the site uses. Nothing here needed a device.
                */}
                <div className="glass glass-lit flex h-full flex-col rounded-panel p-6">
                  <p className="micro-label text-brand-ink">{`0${index + 1}`}</p>
                  <h2 className="mt-4 text-h3 font-normal tracking-tight text-bone">
                    {benefit.title}
                  </h2>
                  <p className="mt-2 text-small leading-relaxed text-ash">
                    {benefit.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.15} className="mt-16 flex justify-end">
            {/*
              This note used to repeat card 04 almost word for word — "most of
              our creators come back for the next campaign" appeared twice,
              two screens apart, which reads as a copy-paste slip rather than
              emphasis. A closing note should add the thing the four cards
              imply but none of them says.
            */}
            <CornerNote index="2">
              None of that is generosity. It is the cheapest way we know to get
              work worth publishing.
            </CornerNote>
          </Reveal>
        </div>
      </section>

      <SectionShell
        id="apply"
        label="Join the roster"
        heading="Get onboarded"
        headingAccent="with us"
        body="Hello influencers and creators. Tell us where you post, what you charge and what you're looking for — we brief creators for brand campaigns every week."
        tone="brand"
        origin="bottom"
        intensity={0.2}
      >
        <Reveal className="mx-auto max-w-2xl">
          {/*
            `influencer` rather than `creator`: same audience, the field set
            Genesis actually runs — platforms, rates, and the permission to
            pitch on someone's behalf, which is a thing you must be asked for
            rather than assumed.
          */}
          <GenesisForm kind="influencer" source="/creator" compact />
        </Reveal>
      </SectionShell>
    </main>
    </SlideUp>
  );
}
