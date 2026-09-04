import { Spectrum } from "@/components/genesis/atmosphere";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { creativeProcess } from "@/lib/home-content";

/**
 * "Our Art of Doing" — the six steps, from the brand guidelines.
 *
 * WHAT THIS REPLACED, TWICE OVER.
 *
 * The content: four invented stages describing a production pipeline — brief,
 * direction, production, publish. The deck sets out six that describe a growth
 * engagement instead, starting at the brand and ending at technology with
 * content in the middle rather than as the whole of it. That is a different
 * and larger claim, and it is the one Genesis actually makes.
 *
 * The treatment: four dark slabs scattered across an arc at 9-13 degrees over
 * a deep red ground, copied from a Figma community layout that predates the
 * guidelines. Red appears nowhere in the brand — the palette is black, white,
 * grey and one yellow — and tilted overlapping cards are the "normal agency
 * template" the deck tells you to reject. This is the site's one dark
 * chapter, so it takes the deck's own black rather than someone else's red.
 *
 * A grid, not a rail, because six named stages in order is a sequence you
 * read rather than a set you browse. The numbers carry the order; the type
 * carries everything else.
 */
export function CreativeProcess() {
  return (
    <section
      id="process"
      className="relative isolate overflow-hidden py-24 sm:py-32"
      style={{ backgroundColor: "#111111" }}
    >
      {/*
        Transitions into and out of the dark chapter. This is the only
        pinned-dark section on an otherwise light page, and without these it
        butted straight into the page ground on both sides — measured
        luminance steps of 0.676 -> 0.003 entering and 0.002 -> 0.836 leaving,
        in the space of three pixels.

        The bands blend to the ACTUAL adjacent grounds through the surface
        tokens, so they follow the theme: in dark mode both neighbours are
        near-black and these fade to nothing. The top is capped at 90% because
        the section above ends darkened by its own shadow, and a band that
        returned to clean paper overshot and drew the line it was removing.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--surface-base) 90%, transparent) 0%, color-mix(in srgb, var(--surface-base) 50%, transparent) 42%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-28"
        style={{
          background:
            "linear-gradient(0deg, var(--surface-ink) 0%, color-mix(in srgb, var(--surface-ink) 55%, transparent) 42%, transparent 100%)",
        }}
      />

      {/* One soft neutral source, so the field is not flat black. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 62% at 26% 34%, #2b2b2b 0%, #1c1c1c 42%, #141414 72%, #111111 100%)",
        }}
      />

      <Spectrum />

      <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <Reveal className="max-w-xl">
            <SectionLabel dot tone="brand">
              {creativeProcess.label}
            </SectionLabel>
            <h2 className="mt-6 text-balance text-h2 font-normal leading-[1.02] tracking-tight text-scene sm:text-h1">
              {creativeProcess.heading}{" "}
              <span className="font-serif font-normal italic text-brand">
                {creativeProcess.headingAccent}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="max-w-sm">
            <p className="text-small leading-relaxed text-scene-dim">
              {creativeProcess.body}
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-10 grid gap-px bg-white/10 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {creativeProcess.steps.map((step, index) => (
            <RevealItem key={step.title}>
              {/*
                The 1px gaps are the grid's own background showing through, so
                the six cells read as one divided field rather than six
                floating boxes — which is what the deck's pages do with a
                single black field and nothing sitting on top of it.
              */}
              <article className="flex h-full flex-col gap-4 bg-[#111111] p-7 sm:p-8">
                <span className="micro-label text-brand">{`0${index + 1}`}</span>
                <h3 className="text-balance text-h3 font-normal leading-tight tracking-tight text-scene">
                  {step.title}
                </h3>
                <p className="text-small leading-relaxed text-scene-dim">
                  {step.caption}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
