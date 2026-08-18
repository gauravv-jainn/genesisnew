import { BarChart3, Globe, Target, Users } from "lucide-react";

import { GenesisStar } from "@/components/genesis/genesis-mark";
import { GlassButton } from "@/components/genesis/glass-button";
import { OrbitingCards } from "@/components/genesis/orbiting-cards";
import { Reveal } from "@/components/genesis/reveal";
import { StatCard, StatRow } from "@/components/genesis/stat-card";
import { influencer } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 7 — Influencer Marketing.
 *
 * The closest section to existing Genesis artwork (img-012): headline left,
 * creator constellation right, the database stat card beneath, and the
 * four-figure glass bar across the bottom.
 */

const STAT_ICONS = [
  <Target key="t" className="size-5" />,
  <BarChart3 key="b" className="size-5" />,
  <Globe key="g" className="size-5" />,
  <Globe key="p" className="size-5" />,
];

export function InfluencerMarketing() {
  return (
    <SectionShell
      id="influencer"
      label={influencer.label}
      heading={influencer.heading}
      headingAccent={influencer.headingAccent}
      body={influencer.body}
      tone="crimson"
      origin="top-right"
      intensity={0.26}
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <StatCard
            value={influencer.databaseStat.value}
            label={influencer.databaseStat.label}
            description={influencer.databaseStat.description}
            icon={<Users className="size-6" />}
            action={
              <GlassButton
                href="/influencer-campaigns"
                variant="ghost"
                size="sm"
                arrow
              >
                <span className="sr-only">See influencer campaigns</span>
              </GlassButton>
            }
          />
        </Reveal>

        <Reveal direction="left" delay={0.1}>
          <OrbitingCards
            items={[...influencer.orbit]}
            center={
              <div className="glass glass-lit grid size-24 place-items-center rounded-full">
                <GenesisStar className="size-9" />
              </div>
            }
          />
        </Reveal>
      </div>

      <Reveal delay={0.15} className="mt-12">
        <StatRow
          stats={influencer.stats.map((stat, index) => ({
            ...stat,
            icon: STAT_ICONS[index],
          }))}
        />
      </Reveal>

      <Reveal delay={0.2} className="mt-10">
        <GlassButton href="/influencer-campaigns" variant="crimson" arrow>
          See how campaigns run
        </GlassButton>
      </Reveal>
    </SectionShell>
  );
}
