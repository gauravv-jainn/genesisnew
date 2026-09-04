import type { Metadata } from "next";
import Link from "next/link";

import { Media } from "@/components/genesis/media";

import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { GlassButton } from "@/components/genesis/glass-button";
import { caseStudiesPage, caseStudyList, isPublished } from "@/lib/case-studies";
import { findWork } from "@/lib/work";

export const metadata: Metadata = {
  title: "Case studies",
  description: caseStudiesPage.body,
};

/**
 * /case-studies — its own page, which is the point.
 *
 * "Case Studies" in the nav used to be an anchor to a rail on the homepage.
 * The brief is explicit that this must be separate, and the reason is
 * practical rather than structural: a marketing head evaluating Genesis needs
 * a URL they can forward to a colleague, and a homepage anchor is not that.
 *
 * PORTFOLIO ANSWERS "what has Genesis made?". This answers "can Genesis solve
 * my business problem?" — so the cards lead with the outcome where there is
 * one, and the layout is deliberately quieter than the work grid. A page that
 * has to be read should not compete with itself.
 */
export default function CaseStudiesPage() {
  return (
    <main className="relative min-h-dvh pb-32 pt-32 sm:pt-40">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <SectionLabel dot tone="brand">
            {caseStudiesPage.label}
          </SectionLabel>
          <h1 className="mt-6 max-w-2xl text-balance text-h2 font-normal leading-[1.02] tracking-tight text-bone sm:text-h1">
            {caseStudiesPage.heading}{" "}
            <span className="font-serif font-normal italic text-brand-ink">
              {caseStudiesPage.headingAccent}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-body leading-relaxed text-ash">
            {caseStudiesPage.body}
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-px bg-[var(--glass-border)] sm:mt-16 sm:grid-cols-2">
          {caseStudyList.map((study) => {
            const published = isPublished(study);
            const hero = study.work?.[0] ? findWork(study.work[0]) : undefined;
            const headline = study.headline;

            const card = (
              <article className="flex h-full flex-col gap-5 bg-void p-7 transition-colors duration-300 group-hover:bg-ink sm:p-8">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="micro-label text-brand-ink">
                    {study.vertical}
                  </span>
                  <span aria-hidden className="text-faint">
                    ·
                  </span>
                  <span className="micro-label !text-faint">
                    {study.discipline}
                  </span>
                </div>

                <h2 className="text-balance text-h3 font-normal leading-tight tracking-tight text-bone sm:text-h2">
                  {study.client}
                </h2>

                {/*
                  The result is the whole reason a card here differs from a
                  card in the portfolio, so it is the only thing given
                  emphasis — and it is simply absent until there is one,
                  rather than a dash or a "coming soon".
                */}
                {headline && (
                  <p className="text-lead leading-snug text-bone">{headline}</p>
                )}

                {hero?.art && (
                  <Media
                    src={hero.art}
                    // Decorative: the client and discipline are already set
                    // in text directly above it.
                    alt=""
                    aspect="landscape"
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="mt-auto"
                  />
                )}

                <span className="mt-auto text-small text-ash">
                  {published ? (
                    <span className="text-brand-ink">View case study →</span>
                  ) : (
                    /*
                      No link, and no button that looks like one. A card
                      promising "View case study" that opens a client's name
                      and nothing else reads as a broken site rather than an
                      unfinished one.
                    */
                    <span className="text-faint">Study in progress</span>
                  )}
                </span>
              </article>
            );

            return (
              <RevealItem key={study.slug}>
                {published ? (
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    {card}
                  </Link>
                ) : (
                  <div className="group h-full">{card}</div>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-12 flex flex-wrap gap-3">
          <GlassButton href="/our-work" variant="glass" arrow>
            See the full portfolio
          </GlassButton>
          <GlassButton
            href="/#contact"
            quickContact="case-studies:start-a-project"
            variant="brand"
            arrow
          >
            Start a project
          </GlassButton>
        </Reveal>
      </div>
    </main>
  );
}
