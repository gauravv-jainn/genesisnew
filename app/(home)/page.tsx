import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import { AiContent } from "./components/ai-content";
import { BlogTeaser } from "./components/blog-teaser";
import { BrandingDesign } from "./components/branding-design";
import { CaseStudies } from "./components/case-studies";
import { ClientLogos } from "./components/client-logos";
import { FooterCta } from "./components/footer-cta";
import { Hero } from "./components/hero";
import { InfluencerMarketing } from "./components/influencer-marketing";
import { InsiderTeaser } from "./components/insider-teaser";
import { Journey } from "./components/journey";
import { Portfolio } from "./components/portfolio";
import { Services } from "./components/services";
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
      <Services />
      <Portfolio />
      <CaseStudies />
      <Journey />
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
