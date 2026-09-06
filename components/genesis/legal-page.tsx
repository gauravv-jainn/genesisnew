import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { LEGAL_EMAIL, LEGAL_NOTICE, type LegalDocument } from "@/lib/legal";

/**
 * The shell both legal documents render into.
 *
 * ONE COLUMN AND NOTHING ELSE. A policy is read, not browsed: no cards, no
 * light, no reveal on every paragraph. The measure is capped near 65
 * characters because that is what a wall of body copy needs and the rest of
 * the site's max-w-6xl grid does not give it.
 */
export function LegalPage({ doc }: { doc: LegalDocument }) {
  return (
    <main className="relative min-h-dvh pb-24 pt-32 sm:pt-40">
      <div className="mx-auto w-full max-w-2xl px-6">
        <Reveal>
          <SectionLabel dot tone="brand">
            Legal
          </SectionLabel>
          <h1 className="mt-6 text-balance text-h2 font-normal leading-[1.05] tracking-tight text-bone">
            {doc.title}
          </h1>
          <p className="mt-5 text-body leading-relaxed text-ash">
            {doc.standfirst}
          </p>

          {/*
            THE INTERIM NOTICE IS PART OF THE DOCUMENT, not a comment in the
            source. A placeholder policy that reads as a finished one is worse
            than no policy at all — it tells a visitor their data is covered
            by something that has not been written yet.
          */}
          <p className="glass mt-8 rounded-card p-5 text-small leading-relaxed text-bone/80">
            {LEGAL_NOTICE}
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-10">
          {doc.sections.map((section, index) => (
            <Reveal key={section.heading} delay={0.04 * index}>
              <h2 className="text-h3 font-semibold tracking-tight text-bone">
                {section.heading}
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-body leading-relaxed text-ash"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-12 border-t border-white/10 pt-8 text-small text-faint">
            Genesis Media ·{" "}
            <a
              href={`mailto:${LEGAL_EMAIL}`}
              className="text-ash underline-offset-4 transition-colors hover:text-bone hover:underline"
            >
              {LEGAL_EMAIL}
            </a>
          </p>
        </Reveal>
      </div>
    </main>
  );
}
