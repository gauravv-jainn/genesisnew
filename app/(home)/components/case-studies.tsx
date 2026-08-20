import { ArrowUpRight } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { caseStudies, isPending } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 4 — Case studies.
 *
 * Poster-proportioned cards, but weighted toward the result rather than the
 * artwork — the number is the reason to read on.
 *
 * A case study with no confirmed headline has nothing to say beyond the
 * client's name, so it is dropped rather than shown with placeholder text; if
 * that empties the section, the section does not render. These are real client
 * names, and "TODO — result" printed under Mahindra reads as a claim about
 * Mahindra. See isPending() in lib/home-content.ts.
 */
export function CaseStudies() {
  const items = caseStudies.items.filter((study) => !isPending(study.title));
  if (items.length === 0) return null;

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
        {items.map((study) => (
          <RevealItem key={study.id}>
            <article className="glass glass-lit group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-7 transition-shadow duration-500 hover:shadow-[0_28px_70px_-20px_rgb(255_45_63/0.4)] sm:p-8">
              {/* The light falling across the card. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,rgb(255_45_63/0.14)_0%,transparent_50%)]"
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <p className="micro-label">{study.client}</p>
                  <ArrowUpRight
                    className="size-5 shrink-0 text-faint transition-colors duration-300 group-hover:text-crimson"
                    aria-hidden
                  />
                </div>

                <h3 className="mt-5 text-balance text-2xl font-semibold leading-snug tracking-tight text-bone">
                  {study.title}
                </h3>
              </div>

              <div className="relative mt-10 flex items-end justify-between gap-4 border-t border-white/10 pt-6">
                <div>
                  {/* No confirmed figure means no figure — never a placeholder. */}
                  {!isPending(study.result) && (
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
        ))}
      </RevealGroup>
    </SectionShell>
  );
}
