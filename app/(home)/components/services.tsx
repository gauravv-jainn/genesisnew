import { CornerNote, GhostType, Spotlight } from "@/components/genesis/spotlight";
import { PaperCard } from "@/components/genesis/paper-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { services } from "@/lib/home-content";

/**
 * Section 2 — Services.
 *
 * Built to the spec's services layout: one hard spotlight from above, the
 * five disciplines as pinned cards caught in it, oversized ghosted type
 * behind them, and editorial corner annotations.
 *
 * This does NOT use SectionShell. That shell centres a tidy heading over a
 * grid, which is the opposite of this composition — here the light and the
 * ghosted type are the layout, and the cards sit inside them at angles.
 */
export function Services() {
  return (
    <section
      id="services"
      className="grain relative isolate overflow-hidden bg-void py-24 sm:py-28"
    >
      {/* The single dramatic source, from upper right as in the reference. */}
      <Spotlight x={68} spread={17} tone="warm" intensity={1} reach={96} />

      {/* Oversized type behind everything, cropped by the section. */}
      <GhostType className="translate-y-4">OUR SERVICES</GhostType>

      <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <Reveal className="max-w-lg">
            <SectionLabel dot tone="amber">
              {services.label}
            </SectionLabel>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone sm:text-5xl">
              {services.heading}{" "}
              <span className="font-serif font-normal italic text-amber">
                {services.headingAccent}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <CornerNote index="Services">
              {services.body}
            </CornerNote>
          </Reveal>
        </div>

        {/*
          Cards are pinned and tilted, and the tilt alternates so the group
          reads as dropped under the light rather than laid out on a grid.
        */}
        <RevealGroup className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((service, index) => (
            <RevealItem key={service.title} className="h-full">
              <PaperCard
                pinned
                tone={index % 3 === 1 ? "crimson" : "amber"}
                rotate={index % 2 === 0 ? -2.6 : 2.2}
                className="h-full"
              >
                <p className="micro-label mb-3">{`0${index + 1}`}</p>
                <h3 className="text-xl font-semibold tracking-tight text-bone">
                  {service.title}
                </h3>
                <p className="mt-1 text-xs text-amber/70">{service.caption}</p>
                <p className="mt-4 text-sm leading-relaxed text-ash">
                  {service.body}
                </p>
              </PaperCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15} className="mt-14 flex justify-end">
          <CornerNote index="2">
            Every discipline runs in-house, so a campaign never loses its thread
            between the idea and the post.
          </CornerNote>
        </Reveal>
      </div>
    </section>
  );
}
