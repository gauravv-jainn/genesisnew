import type { Metadata } from "next";

import { ContactForm } from "@/components/genesis/contact-form";
import { PaperCard } from "@/components/genesis/paper-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { creatorPage } from "@/lib/page-content";
import { SectionShell } from "../components/section-shell";

export const metadata: Metadata = {
  title: "For Creators",
  description: creatorPage.body,
};

/**
 * /creator — "I'm a Creator".
 *
 * Deliberately plain-spoken: creators read a hundred agency pages, and the
 * things that actually decide it are briefs, money and repeat work.
 */
export default function CreatorPage() {
  return (
    <main className="pt-24">
      <SectionShell
        label={creatorPage.label}
        heading={creatorPage.heading}
        headingAccent={creatorPage.headingAccent}
        body={creatorPage.body}
        tone="amber"
        origin="top-right"
        intensity={0.24}
      >
        <RevealGroup className="grid gap-6 sm:grid-cols-2">
          {creatorPage.benefits.map((benefit, index) => (
            <RevealItem key={benefit.title} className="h-full">
              <PaperCard
                tone={index % 2 === 0 ? "amber" : "crimson"}
                rotate={index % 2 === 0 ? -1.6 : 1.4}
                className="h-full"
              >
                <h3 className="text-lg font-semibold tracking-tight text-bone">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ash">
                  {benefit.body}
                </p>
              </PaperCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </SectionShell>

      <SectionShell
        id="apply"
        label="Join the roster"
        heading="Tell us what"
        headingAccent="you make"
        body="Send your handle and the kind of work you do. We'll come back if there's a fit."
        tone="crimson"
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
  );
}
