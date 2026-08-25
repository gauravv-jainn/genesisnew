import type { Metadata } from "next";

import { ContactForm } from "@/components/genesis/contact-form";
import { SlideUp } from "@/components/genesis/slide-up";
import { PaperCard } from "@/components/genesis/paper-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { CornerNote, GhostType, Spotlight } from "@/components/genesis/spotlight";
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
      <section className="grain relative isolate overflow-hidden bg-void pt-32 pb-32 sm:pt-40">
        <Spotlight x={68} spread={17} tone="warm" intensity={1} reach={96} />
        <GhostType className="translate-y-2">FOR CREATORS</GhostType>

        <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <Reveal className="max-w-xl">
              <SectionLabel dot tone="brand">
                {creatorPage.label}
              </SectionLabel>
              <h1 className="mt-6 text-balance text-h2 font-semibold leading-[1.05] tracking-tight text-bone sm:text-h1 lg:text-h1">
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
                <PaperCard
                  pinned
                  tone="brand"
                  rotate={index % 2 === 0 ? -2.6 : 2.2}
                  className="h-full"
                >
                  <p className="micro-label mb-3">{`0${index + 1}`}</p>
                  <h2 className="text-h3 font-semibold tracking-tight text-bone">
                    {benefit.title}
                  </h2>
                  <p className="mt-3 text-small leading-relaxed text-ash">
                    {benefit.body}
                  </p>
                </PaperCard>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.15} className="mt-16 flex justify-end">
            <CornerNote index="2">
              Most of our creators come back for the next campaign. That is the
              whole model, and it only works if the first one was worth doing.
            </CornerNote>
          </Reveal>
        </div>
      </section>

      <SectionShell
        id="apply"
        label="Join the roster"
        heading="Tell us what"
        headingAccent="you make"
        body="Send your handles and the kind of work you do. We'll come back if there's a fit."
        tone="brand"
        origin="bottom"
        intensity={0.2}
      >
        <Reveal className="mx-auto max-w-2xl">
          <ContactForm
            type="CREATOR"
            source="/creator"
            submitLabel="Apply to the roster"
            showCompany={false}
            messageLabel="Handles, platforms and the content you make"
          />
        </Reveal>
      </SectionShell>
    </main>
    </SlideUp>
  );
}
