import { ArrowUpRight } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { caseStudies, isPending } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 4 — Case studies.
 *
 * WHAT IS REAL HERE AND WHAT IS NOT. The four clients and their disciplines
 * come from the spec and are confirmed. The headline and the result figure for
 * each are not written yet.
 *
 * An earlier pass dropped any study whose headline was unwritten, which
 * emptied the section and removed it from the page entirely. That threw away
 * four real client relationships to avoid printing two unwritten fields. The
 * card is now built the other way round: the CLIENT is the headline, because
 * the client is the part that is true. The story and the number appear the
 * moment they are written, and nothing is invented in the meantime.
 */
export function CaseStudies() {
  return (
    <SectionShell
      id="case-studies"
      label={caseStudies.label}
      heading={caseStudies.heading}
      headingAccent={caseStudies.headingAccent}
      body={caseStudies.body}
      tone="crimson"
      origin="top-right"
      intensity={0.2}
    >
      <RevealGroup className="grid gap-6 sm:grid-cols-2">
        {caseStudies.items.map((study) => {
          const hasStory = !isPending(study.title);
          const hasResult = !isPending(study.result);

          return (
            <RevealItem key={study.id}>
              <article className="glass glass-lit group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-7 transition-shadow duration-500 hover:shadow-[0_28px_70px_-20px_rgb(255_45_63/0.4)] sm:p-8">
                {/* The light falling across the card. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,rgb(255_45_63/0.14)_0%,transparent_50%)]"
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    {/*
                      With no written story the client carries the card, so it
                      steps up from a micro-label to the heading. With a story
                      it steps back down and the story leads.
                    */}
                    {hasStory ? (
                      <p className="micro-label">{study.client}</p>
                    ) : (
                      <h3 className="text-balance text-2xl font-semibold leading-snug tracking-tight text-bone">
                        {study.client}
                      </h3>
                    )}
                    <ArrowUpRight
                      className="size-5 shrink-0 text-faint transition-colors duration-300 group-hover:text-crimson"
                      aria-hidden
                    />
                  </div>

                  {hasStory && (
                    <h3 className="mt-5 text-balance text-2xl font-semibold leading-snug tracking-tight text-bone">
                      {study.title}
                    </h3>
                  )}
                </div>

                <div className="relative mt-10 flex items-end justify-between gap-4 border-t border-white/10 pt-6">
                  <div>
                    {/* No confirmed figure means no figure — never a placeholder. */}
                    {hasResult && (
                      <>
                        <p className="text-3xl font-semibold tracking-tight text-bone">
                          {study.result}
                        </p>
                        <p className="mt-1 text-xs text-faint">Reported result</p>
                      </>
                    )}
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-ash">
                    {study.discipline}
                  </span>
                </div>
              </article>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </SectionShell>
  );
}
