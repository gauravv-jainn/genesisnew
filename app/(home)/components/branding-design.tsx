import { GlassButton } from "@/components/genesis/glass-button";
import { Reveal } from "@/components/genesis/reveal";
import { branding, services } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 8 — Branding & Design.
 *
 * A bento arrangement (img-021, img-028): one tall statement tile beside the
 * capabilities. Deliberately quieter than the sections either side of it, so
 * the page has a trough between Influencer and the logo wall.
 *
 * QUIET IS NOT THE SAME AS UNLIT. This was the flattest thing on the page: a
 * `tone="neutral"` section with no light at all, next to a grid of six
 * identical grey rectangles carrying one 14px word each. Every other section
 * on this site is lit; this one just had the light switched off, which does
 * not read as restraint, it reads as unfinished.
 *
 * Two changes. The section gets an brand wash — the secondary accent, so it
 * stays quieter than the brand sections around it without being dark. And
 * the capabilities stop being a 3x2 grid of equal boxes: they are a LIST of
 * disciplines, not six things of equal weight, so they are set as a rule-
 * separated column with the count carried in the eyebrow, which is what the
 * editorial references do with a list.
 */
export function BrandingDesign() {
  return (
    <SectionShell
      id="brand-design"
      division={{
        name: "Brand & Design",
        tagline: services.items[1].caption,
        ramp: services.items[1].ramp,
      }}
      body={branding.body}
      align="split"
      tone="brand"
      origin="top-left"
      intensity={0.16}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <div className="glass glass-lit relative flex h-full min-h-64 flex-col justify-end overflow-hidden rounded-panel p-8">
            {/* Hairline grid, the editorial device from img-058. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div className="relative">
              <p className="micro-label mb-6">Selected identity work</p>
              {/* Named in the spec: Tripgate, Abhi App, Doja. */}
              <ul className="flex flex-col gap-4">
                {branding.work.map((item) => (
                  <li key={item.title} className="border-b border-white/10 pb-3 last:border-0">
                    <p className="text-h3 font-semibold tracking-tight text-bone">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-small text-ash">{item.caption}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="glass glass-lit relative flex h-full flex-col rounded-panel p-8">
            <p className="micro-label mb-6">
              What we make · {String(branding.capabilities.length).padStart(2, "0")}
            </p>

            {/*
              A rule-separated list, numbered. Six equal boxes said these were
              six interchangeable things; a list says they are a set of
              disciplines with an order, and it lets the type carry the section
              instead of six rectangles carrying it.
            */}
            <ul className="flex flex-1 flex-col justify-between">
              {branding.capabilities.map((capability, index) => (
                <li
                  key={capability}
                  className="flex items-baseline gap-6 border-b border-white/10 py-4 last:border-0"
                >
                  <span className="micro-label shrink-0 !text-brand-ink/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-h3 font-medium leading-tight tracking-tight text-bone">
                    {capability}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/*
          This division had no call to action at all — a reader could finish
          the section that describes identity work with nowhere to go.
        */}
        <Reveal delay={0.15} className="mt-12 flex flex-wrap gap-3">
          <GlassButton
            href="/#contact"
            quickContact="brand-design:build-a-brand"
            variant="brand"
            arrow
          >
            Build a brand
          </GlassButton>
          <GlassButton href="/our-work" variant="glass" arrow>
            View branding work
          </GlassButton>
        </Reveal>
      </div>
    </SectionShell>
  );
}
