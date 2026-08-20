import { CornerNote, GhostType, Spotlight } from "@/components/genesis/spotlight";
import { PaperCard } from "@/components/genesis/paper-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { creativeProcess } from "@/lib/home-content";

/**
 * Creative process — the spec asks for this twice: "Add creative process
 * (BTS)" and "Add creative process 2 lines or sections".
 *
 * Uses the pinned-paper treatment so it reads as working material pulled off
 * a wall rather than a tidy marketing funnel. The steps are written as what
 * actually happens, including the unglamorous parts, because those are the
 * ones clients ask about.
 */
export function CreativeProcess() {
  return (
    <section
      id="process"
      className="grain relative isolate overflow-hidden bg-void py-24 sm:py-32"
    >
      <Spotlight x={36} spread={16} tone="warm" intensity={0.9} reach={94} />
      <GhostType>BEHIND THE SCENES</GhostType>

      <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <Reveal className="max-w-xl">
            <SectionLabel dot tone="amber">
              {creativeProcess.label}
            </SectionLabel>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone sm:text-5xl">
              {creativeProcess.heading}{" "}
              <span className="font-serif font-normal italic text-amber">
                {creativeProcess.headingAccent}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <CornerNote index="Process">{creativeProcess.body}</CornerNote>
          </Reveal>
        </div>

        <RevealGroup className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {creativeProcess.steps.map((step, index) => (
            <RevealItem key={step.title} className="h-full">
              <PaperCard
                pinned
                tone={index % 3 === 1 ? "crimson" : "amber"}
                rotate={index % 2 === 0 ? -2.4 : 2}
                className="h-full"
              >
                <p className="micro-label mb-3">{`0${index + 1}`}</p>
                <h3 className="text-lg font-semibold tracking-tight text-bone">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ash">{step.body}</p>
              </PaperCard>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* TODO(assets): the spec wants BTS stills and video per step. */}
      </div>
    </section>
  );
}
