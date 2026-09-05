import fs from "node:fs";
import path from "node:path";

import Image from "next/image";

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
/**
 * The sketch phases and finished mark for one identity, if they are on disk.
 *
 * READ FROM THE FILESYSTEM RATHER THAN LISTED IN DATA, and that is the point.
 * A hard-coded list of five paths is a list that can be wrong in two
 * directions: name a file that is not there and the section renders broken
 * images at a client; add a sixth sketch and nothing shows it until someone
 * remembers to edit an array. Reading the folder means dropping files in IS
 * the deployment.
 *
 * This is a server component, so the walk happens once at build and never in a
 * browser.
 *
 * CONVENTION: /public/brand/<assets>/phase-1.png … phase-N.png for the route,
 * final.png for the mark it arrived at. Any image extension works.
 */
function identityRoute(assets: string): { phases: string[]; final?: string } {
  const dir = path.join(process.cwd(), "public", "brand", assets);
  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return { phases: [] };
  }

  const isImage = (f: string) => /\.(png|jpe?g|webp|svg)$/i.test(f);
  const phases = entries
    .filter((f) => isImage(f) && /^phase-\d+\./i.test(f))
    // Numeric, not lexical: phase-10 sorts after phase-9, not after phase-1.
    .sort((a, b) => Number(a.match(/\d+/)![0]) - Number(b.match(/\d+/)![0]))
    .map((f) => `/brand/${assets}/${f}`);
  const finalFile = entries.find((f) => isImage(f) && /^final\./i.test(f));

  return { phases, final: finalFile ? `/brand/${assets}/${finalFile}` : undefined };
}

export function BrandingDesign() {
  return (
    <SectionShell
      id="brand-design"
      division={{
        name: "Brand & Design",
        tagline: services.items[1].caption,
        ramp: services.items[1].ramp,
      }}
      /*
        NO `body` HERE — it is set below the tiles instead, at Genesis's
        request. Between the lockup and the work it was a third line of
        introduction before anything had been shown; underneath, it reads as
        the caption to what you have just looked at, which is the job that
        sentence is actually doing.
      */
      // Centred, like AI Lab and Studios: the mark is artwork and sits in the
      // middle of its section. See the note in ai-content.
      align="center"
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
              {/* Tripgate and the Activ Health App — see lib/home-content. */}
              <ul className="flex flex-col gap-4">
                {branding.work.map((item) => {
                  const route =
                    "assets" in item
                      ? identityRoute(item.assets)
                      : { phases: [], final: undefined };
                  const hasRoute = route.phases.length > 0 || route.final;

                  return (
                    <li key={item.title} className="border-b border-white/10 pb-3 last:border-0">
                      <p className="text-h3 font-semibold tracking-tight text-bone">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-small text-ash">{item.caption}</p>

                      {/*
                        THE ROUTE TO THE MARK. Sketches on paper chips, then the
                        finished logo — the sketches are scans of white paper,
                        so they get a white ground rather than the panel's glass,
                        which would show through the paper and grey them out.

                        The final mark is separated by a rule and set larger: it
                        is the answer, not a fifth attempt, and a row of five
                        equal squares would read as five options.
                      */}
                      {/*
                        A LOCKED PALETTE, where the identity has one. Swatch,
                        then its hex under it — the code is the useful half:
                        somebody rebuilding a deck needs to copy it, and a
                        picture of a colour cannot be copied.

                        The chip carries a hairline border rather than sitting
                        flush, because the last swatch in this set is #ffffff
                        and white on a light theme with no edge is not a
                        swatch, it is a gap.
                      */}
                      {"palette" in item && item.palette.length > 0 && (
                        <div className="mt-4">
                          <ul className="flex flex-wrap gap-2">
                            {item.palette.map((hex) => (
                              <li key={hex} className="flex flex-col gap-1">
                                <span
                                  className="block size-10 rounded-card border border-white/25 sm:size-11"
                                  style={{ backgroundColor: hex }}
                                />
                                <span className="text-[0.5625rem] uppercase tracking-wide text-faint">
                                  {hex}
                                </span>
                              </li>
                            ))}
                          </ul>
                          {"paletteNote" in item && (
                            <p className="mt-2 text-micro text-ash">
                              {item.paletteNote}
                            </p>
                          )}
                        </div>
                      )}

                      {hasRoute && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {route.phases.map((src, index) => (
                            <div
                              key={src}
                              className="relative size-14 shrink-0 overflow-hidden rounded-card border border-white/15 bg-white sm:size-16"
                            >
                              <Image
                                src={src}
                                alt={`${item.title} logo, sketch ${index + 1} of ${route.phases.length}`}
                                fill
                                sizes="64px"
                                className="object-contain p-1.5"
                              />
                            </div>
                          ))}

                          {route.final && (
                            <>
                              {route.phases.length > 0 && (
                                <span
                                  aria-hidden
                                  className="mx-1 h-8 w-px shrink-0 bg-white/15"
                                />
                              )}
                              <div className="relative size-16 shrink-0 overflow-hidden rounded-card border border-brand-ink/40 bg-white sm:size-20">
                                <Image
                                  src={route.final}
                                  alt={`${item.title} — the finished logo`}
                                  fill
                                  sizes="80px"
                                  className="object-contain p-2"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
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
          The standfirst, moved down out of the header. lg:col-span-2 so it
          runs the full width under both tiles rather than being trapped in
          the left column, and centred to match the header above it.
        */}
        <Reveal delay={0.12} className="lg:col-span-2">
          <p className="mx-auto max-w-2xl text-pretty text-center text-body text-ash sm:text-lead">
            {branding.body}
          </p>
        </Reveal>

        {/*
          This division had no call to action at all — a reader could finish
          the section that describes identity work with nowhere to go.
        */}
        <Reveal delay={0.15} className="mt-2 flex flex-wrap justify-center gap-3 lg:col-span-2">
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
