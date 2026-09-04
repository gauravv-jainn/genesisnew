import type { Metadata } from "next";
import { Users } from "lucide-react";

import { GenesisForm } from "@/components/genesis/genesis-form";
import { CreatorConstellation } from "@/components/genesis/creator-constellation";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { StatRow } from "@/components/genesis/stat-card";
import { influencer, isPending } from "@/lib/home-content";
import { influencerPage } from "@/lib/page-content";
import { DivisionIntro } from "@/components/genesis/division-intro";
import { services } from "@/lib/home-content";
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
 *
 * This page measured 99.1% of its pixels in shadow with zero images — the
 * emptiest screen on the site — while the homepage's own influencer section,
 * built to Genesis's artwork on p07_0, is the richest. The difference was that
 * the constellation and its photography lived only on the homepage. It leads
 * here now, which is the page the spec actually devotes to this subject.
 */
export default function InfluencerCampaignsPage() {
  return (
    <main className="pt-24">
            {/* The division's own lockup, so the page announces which one it is. */}
      <DivisionIntro
        division="Influence"
        tagline={services.items[0].caption}
        ramp={services.items[0].ramp}
      />

<SectionShell
        label={influencerPage.label}
        heading={influencerPage.heading}
        headingAccent={influencerPage.headingAccent}
        body={influencerPage.body}
        tone="brand"
        origin="top-right"
        intensity={0.28}
      >
        <Reveal>
          <CreatorConstellation creators={influencer.creators.map((c) => ({ ...c }))} />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
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
        tone="brand"
        origin="top-left"
        intensity={0.16}
      >
        {/*
          The named collaborations, as cards rather than on an orbit. They are
          NAMES, not photographs — an orbit of text discs reads as a widget,
          and the constellation above already carries the motion this page
          needs.
        */}
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {influencer.celebrities.map((celebrity) => (
            <RevealItem key={celebrity.id}>
              <article className="glass glass-lit flex h-full flex-col justify-between gap-6 rounded-card p-6">
                <p className="micro-label">{celebrity.sublabel}</p>
                <h3 className="text-balance text-h3 font-normal leading-tight tracking-tight text-bone">
                  {celebrity.label}
                </h3>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <RevealGroup className="mt-16 flex flex-wrap justify-center gap-3">
          {influencerPage.genres.map((genre) => (
            <RevealItem key={genre}>
              <span className="glass-chip rounded-full px-4 py-2 text-small text-bone">
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
              <div className="glass glass-lit flex h-full flex-col rounded-panel p-6">
                <p className="micro-label">{`0${index + 1}`}</p>
                <h3 className="mt-4 text-h3 font-normal tracking-tight text-bone">
                  {step.title}
                </h3>
                <p className="mt-3 text-small leading-relaxed text-ash">{step.body}</p>
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
        tone="brand"
        origin="bottom"
        intensity={0.22}
      >
        <Reveal className="mx-auto max-w-2xl">
          <GenesisForm kind="brand" source="/influencer-campaigns" />
        </Reveal>
      </SectionShell>
    </main>
  );
}
