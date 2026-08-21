import { RevealGroup, RevealItem, Reveal } from "@/components/genesis/reveal";
import { branding } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 8 — Branding & Design.
 *
 * A bento arrangement (img-021, img-028): one tall statement tile beside a
 * grid of capability chips. Deliberately quieter than the sections either
 * side of it, so the page has a trough between Influencer and the logo wall.
 */
export function BrandingDesign() {
  return (
    <SectionShell
      id="branding"
      label={branding.label}
      heading={branding.heading}
      headingAccent={branding.headingAccent}
      body={branding.body}
      tone="neutral"
      origin="top-left"
      intensity={0.12}
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

        <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {branding.capabilities.map((capability) => (
            <RevealItem key={capability}>
              <div className="glass flex h-full min-h-28 items-end rounded-card p-6 transition-colors duration-300 hover:bg-white/10">
                <span className="text-small font-medium leading-tight text-bone">
                  {capability}
                </span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </SectionShell>
  );
}
