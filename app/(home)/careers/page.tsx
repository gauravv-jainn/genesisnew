import type { Metadata } from "next";

import { ContactForm } from "@/components/genesis/contact-form";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { careersPage } from "@/lib/page-content";
import { SectionShell } from "../components/section-shell";

export const metadata: Metadata = {
  title: "Careers",
  description: careersPage.body,
};

/**
 * /careers — the waitlist.
 *
 * Modelled on the waitlist reference (img-044): one glass panel, one field
 * set, no navigation away from the single action.
 */
export default function CareersPage() {
  return (
    <main className="pt-24">
      <SectionShell
        label={careersPage.label}
        heading={careersPage.heading}
        headingAccent={careersPage.headingAccent}
        body={careersPage.body}
        tone="crimson"
        origin="top"
        intensity={0.26}
        align="center"
      >
        <Reveal className="mx-auto max-w-2xl">
          <ContactForm
            type="CAREERS_WAITLIST"
            source="/careers"
            submitLabel="Join the waitlist"
            showCompany={false}
            messageLabel="Discipline, experience and a link to your work"
          />
        </Reveal>

        <div className="mt-16">
          <Reveal>
            <p className="micro-label text-center">Disciplines we hire for</p>
          </Reveal>
          <RevealGroup className="mt-6 flex flex-wrap justify-center gap-3">
            {careersPage.disciplines.map((discipline) => (
              <RevealItem key={discipline}>
                <span className="glass rounded-full px-4 py-2 text-sm text-ash">
                  {discipline}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </SectionShell>
    </main>
  );
}
