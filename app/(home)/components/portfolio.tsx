import { GlassButton } from "@/components/genesis/glass-button";
import { PosterRail, type Poster } from "@/components/genesis/poster-card";
import { Reveal } from "@/components/genesis/reveal";
import { portfolio } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 3 — Portfolio.
 *
 * Spec: "[Add minimal Scroll section]" listing Aditya Birla Capital, HDFC,
 * Aditya Birla Sun Life Insurance and Mahindra Finance.
 *
 * This is the receiving end of the Services→Portfolio camera turn (Phase 3),
 * so the rail is deliberately the first thing the camera lands on.
 */
export function Portfolio() {
  const posters: Poster[] = portfolio.clients.map((entry) => ({
    id: entry.id,
    client: entry.client,
    title: entry.title,
    category: entry.category,
  }));

  return (
    <SectionShell
      id="portfolio"
      label={portfolio.label}
      heading={portfolio.heading}
      headingAccent={portfolio.headingAccent}
      body={portfolio.body}
      tone="crimson"
      origin="top"
      intensity={0.18}
      contentClassName="-mr-6 sm:-mr-10"
    >
      <Reveal>
        <PosterRail posters={posters} />
      </Reveal>

      <Reveal delay={0.1} className="mr-6 mt-10 sm:mr-10">
        <GlassButton href="/our-work" variant="glass" arrow>
          Browse the full library
        </GlassButton>
      </Reveal>
    </SectionShell>
  );
}
