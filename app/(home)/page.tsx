import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import { AiContent } from "./components/ai-content";
import { BlogTeaser } from "./components/blog-teaser";
import { BrandingDesign } from "./components/branding-design";
import { CreativeProcess } from "./components/creative-process";
import { CaseStudies } from "./components/case-studies";
import { ClientLogos } from "./components/client-logos";
import { FooterCta } from "./components/footer-cta";
import { Hero } from "./components/hero";
import { InfluencerMarketing } from "./components/influencer-marketing";
import { InsiderTeaser } from "./components/insider-teaser";
import { Journey } from "./components/journey";
import { Portfolio } from "./components/portfolio";
import { Services } from "./components/services";
import { WhoWeAre } from "./components/who-we-are";
import { Testimonials } from "./components/testimonials";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — ${siteConfig.tagline}`,
  },
  description: siteConfig.description,
};

/**
 * Homepage — one continuous scroll narrative in 13 sections.
 *
 * Order is fixed by the brief. Each section owns its own atmosphere (ground,
 * light source, grain) so the page reads as a single lit space rather than a
 * stack of independent blocks.
 *
 * Phase 2 scope: structure, copy and basic scroll reveals only. The
 * shared-element morphs and the Services→Portfolio pan are Phase 3, and are
 * designed to drop in without restructuring any of these components.
 */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhoWeAre />
      {/* Services and Portfolio are the two faces of one turning stage. */}
      {/*
        Services and Portfolio, one after the other.

        These used to be the two faces of a pinned 3D camera turn. It is gone:
        it pinned the page for 160% of the viewport to deliver one rotation,
        it was the single most expensive thing on the site to composite, and
        with Reduce Motion enabled it collapsed into two sections printed on
        top of each other. Plain document flow says the same thing.
      */}
      <Services />
      <Portfolio />
      <CaseStudies />
      <Journey />
      <CreativeProcess />
      <AiContent />
      <InfluencerMarketing />
      <BrandingDesign />
      <ClientLogos />
      <Testimonials />
      <BlogTeaser />
      <InsiderTeaser />
      <FooterCta />
    </main>
  );
}
