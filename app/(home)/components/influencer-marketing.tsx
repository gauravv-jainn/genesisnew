import { BarChart3, Globe, Sparkles, Target, Users } from "lucide-react";

import { CreatorConstellation } from "@/components/genesis/creator-constellation";
import { GlassButton } from "@/components/genesis/glass-button";
import { Reveal } from "@/components/genesis/reveal";
import { influencer, isPending } from "@/lib/home-content";

/**
 * Influencer marketing — built to the Genesis mockup on page 7.
 *
 * This section does NOT use SectionShell, and the difference is deliberate.
 * The mockup sets its own rules and they are the opposite of the site's
 * default heading pattern:
 *
 *   - the headline is LIGHT weight, not semibold, and very large
 *   - the second word recedes into grey rather than taking the serif accent
 *   - the eyebrow sits BELOW the headline, not above it
 *   - the figures live inside one bar that also holds the CTA
 *
 * Copying those choices matters more than internal consistency here: it is
 * Genesis's own artwork for this exact section.
 */

const STAT_ICONS = [Target, BarChart3, Sparkles, Globe];

export function InfluencerMarketing() {
  // An unconfirmed figure is omitted, never printed as a placeholder.
  const stats = influencer.stats.filter((stat) => !isPending(stat.value));

  return (
    <section
      id="influence"
      className="grain relative isolate overflow-hidden bg-void py-24 sm:py-32"
    >
      {/* Soft key light behind the headline, red spill low-left, as in the mockup. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 38% at 24% 16%, rgb(214 210 214 / 0.11) 0%, transparent 68%), radial-gradient(50% 44% at 8% 92%, rgb(255 212 0 / 0.16) 0%, transparent 70%), radial-gradient(60% 50% at 88% 40%, rgb(255 212 0 / 0.07) 0%, transparent 72%)",
        }}
      />

      <div className="relative z-[2] mx-auto w-full max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          {/*
            min-w-0 is load-bearing. A grid item defaults to `min-width: auto`,
            which refuses to shrink below its content's longest unbreakable
            run — so at 375px the 44px headline held "Influencer marketing," on
            one line, expanded its column to 393px, and was silently clipped by
            the section's overflow:hidden at 417px against a 375px viewport.
            With min-w-0 the column can shrink and the line wraps instead.
          */}
          <div className="min-w-0">
            <Reveal>
              {/*
                Light weight and a receding second line — the mockup's
                treatment, not the site's usual bold two-tone.
              */}
              <h2 className="text-[clamp(2.75rem,7vw,5rem)] font-light leading-[0.95] tracking-[-0.03em] text-bone">
                {influencer.heading}
                <span
                  className="block font-light"
                  style={{
                    background:
                      "linear-gradient(96deg, #d8d4d2 0%, #a5a09e 46%, #6f6a69 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {influencer.headingAccent}
                </span>
              </h2>
            </Reveal>

            {/* Eyebrow BELOW the headline, per the mockup. */}
            <Reveal delay={0.06}>
              <p className="micro-label mt-6 flex items-center gap-3">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-brand" />
                {influencer.label}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-pretty text-body leading-relaxed text-ash">
                {influencer.body}
              </p>
            </Reveal>

            {/* The database card: red-tinted glass, icon well, circular arrow. */}
            <Reveal delay={0.16}>
              <div
                className="glass glass-lit mt-8 flex items-center gap-6 rounded-panel p-6 sm:p-8"
                style={{
                  background:
                    "linear-gradient(102deg, rgb(255 212 0 / 0.17) 0%, rgb(255 212 0 / 0.05) 42%, rgb(255 255 255 / 0.03) 100%)",
                }}
              >
                <div className="grid size-16 shrink-0 place-items-center rounded-card border border-brand/35 bg-brand/10 text-brand-ink">
                  <Users className="size-7" aria-hidden />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-h2 font-medium leading-none tracking-tight text-bone">
                    {influencer.databaseStat.value}
                  </p>
                  <p className="micro-label mt-3">{influencer.databaseStat.label}</p>
                  <p className="mt-3 text-small leading-relaxed text-ash">
                    {influencer.databaseStat.description}
                  </p>
                </div>

                <a
                  href="/influencer-campaigns"
                  aria-label="See influencer campaigns"
                  className="grid size-12 shrink-0 place-items-center rounded-full border border-white/20 text-bone transition-colors hover:border-brand hover:bg-brand/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <span aria-hidden className="text-h3 leading-none">→</span>
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} direction="left" variant="scene">
            {/*
              The mockup labels these by niche and follower count, not by
              celebrity name — the named celebrity collaborations are a
              separate list and do not ride the orbits.
            */}
            <CreatorConstellation creators={influencer.creators.map((c) => ({ ...c }))} />
          </Reveal>
        </div>

        {/* The figures bar — the CTA lives inside it, as in the mockup. */}
        <Reveal delay={0.24} className="mt-10">
          <div className="glass glass-lit flex flex-col gap-8 rounded-panel px-6 py-8 sm:px-8 lg:flex-row lg:items-center">
            <div className="grid flex-1 grid-cols-2 gap-y-8 lg:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = STAT_ICONS[index] ?? Globe;
                const highlight = index === 0;

                return (
                  <div
                    key={stat.label}
                    className={cnJoin(
                      "flex items-center gap-4 px-1",
                      index > 0 ? "lg:border-l lg:border-white/10 lg:pl-6" : "",
                    )}
                  >
                    <span
                      className={cnJoin(
                        "grid size-11 shrink-0 place-items-center rounded-card border",
                        highlight
                          ? "border-brand/35 bg-brand/10 text-brand-ink"
                          : "border-white/12 bg-white/5 text-bone",
                      )}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-h3 font-medium leading-none tracking-tight text-bone">
                        {stat.value}
                      </span>
                      <span className="mt-2 block text-small leading-tight text-ash">
                        {stat.label}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </Reveal>

        {/*
          TWO ACTIONS, both specific, and BELOW the figures rather than inside
          them. "Contact Us" was the only one here, which is the least useful
          thing a section about influencer campaigns can say — it asks the
          reader to translate their own intent into a generic enquiry. Sitting
          them in the stats panel packed four numbers and two buttons into one
          row; they get their own line.
        */}
        <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-3">
          <GlassButton
            href="/#contact"
            quickContact="influence:plan-a-campaign"
            variant="brand"
            size="lg"
            arrow
          >
            Plan an influencer campaign
          </GlassButton>
          <GlassButton href="/influencer-campaigns" variant="glass" size="lg" arrow>
            Explore Genesis Influence
          </GlassButton>
        </Reveal>
      </div>
    </section>
  );
}

/** Local join so this file needs no extra import for two conditional classes. */
function cnJoin(...parts: string[]) {
  return parts.filter(Boolean).join(" ");
}
