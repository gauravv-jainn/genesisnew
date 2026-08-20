import type { Metadata } from "next";
import { Users } from "lucide-react";

import { ContactForm } from "@/components/genesis/contact-form";
import { GenesisStar } from "@/components/genesis/genesis-mark";
import { OrbitingCards } from "@/components/genesis/orbiting-cards";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { StatRow } from "@/components/genesis/stat-card";
import { influencer, isPending } from "@/lib/home-content";
import { influencerPage } from "@/lib/page-content";
import { SectionShell } from "../components/section-shell";

export const metadata: Metadata = {
  title: "Influencer Campaigns",
  description: influencerPage.body,
};

/**
 * /influencer-campaigns — the deep dive.
 *
 * Spec asks for numbers, genre of creators, celebrity showcases and a contact
 * CTA. Structure follows that order.
 */
export default function InfluencerCampaignsPage() {
  return (
    <main className="pt-24">
      <SectionShell
        label={influencerPage.label}
        heading={influencerPage.heading}
        headingAccent={influencerPage.headingAccent}
        body={influencerPage.body}
        tone="crimson"
        origin="top-right"
        intensity={0.28}
      >
        <Reveal>
          <StatRow
            /*
              Filtered HERE, not just in StatRow: an unconfirmed figure that
              survives to the client is still serialised into the RSC payload
              and shipped to the browser, even though nothing renders it.
            */
            stats={influencerPage.stats
              .filter((stat) => !isPending(stat.value))
              .map((stat, index) => ({
                ...stat,
                icon: index === 0 ? <Users className="size-5" /> : undefined,
              }))}
          />
        </Reveal>
      </SectionShell>

      {/* Celebrity collaborations, named in the spec. */}
      <SectionShell
        label="Celebrity collaborations"
        heading="The names"
        headingAccent="behind the reach"
        body="Celebrity and top-tier creator partnerships, alongside a database of over a lakh creators across every genre."
        tone="amber"
        origin="top-left"
        intensity={0.16}
      >
        <Reveal>
          <OrbitingCards
            items={[...influencer.celebrities]}
            center={
              <div className="glass glass-lit grid size-24 place-items-center rounded-full">
                <GenesisStar className="size-9" />
              </div>
            }
          />
        </Reveal>

        <RevealGroup className="mt-14 flex flex-wrap justify-center gap-3">
          {influencerPage.genres.map((genre) => (
            <RevealItem key={genre}>
              <span className="glass rounded-full px-4 py-2 text-sm text-bone">
                {genre}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </SectionShell>

      <SectionShell
        label="How it runs"
        heading="Discovery to"
        headingAccent="delivery"
        tone="neutral"
        origin="top"
        intensity={0.12}
      >
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {influencerPage.process.map((step, index) => (
            <RevealItem key={step.title} className="h-full">
              <div className="glass glass-lit flex h-full flex-col rounded-3xl p-6">
                <p className="micro-label">{`0${index + 1}`}</p>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-bone">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ash">{step.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </SectionShell>

      <SectionShell
        id="contact"
        label="Get in touch"
        heading="Run a campaign"
        headingAccent="with us"
        body="Tell us the brand, the audience and the timeline. We'll come back with an approach."
        tone="crimson"
        origin="bottom"
        intensity={0.22}
      >
        <Reveal className="mx-auto max-w-2xl">
          <ContactForm
            type="CONTACT"
            source="/influencer-campaigns"
            submitLabel="Send enquiry"
            messageLabel="Brand, audience and timeline"
          />
        </Reveal>
      </SectionShell>
    </main>
  );
}
