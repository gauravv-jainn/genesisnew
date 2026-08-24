import { AnimatedTimeline } from "@/components/genesis/animated-timeline";
import { StatRow } from "@/components/genesis/stat-card";
import { CornerNote, GhostType, Spotlight } from "@/components/genesis/spotlight";
import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { isPending, journey } from "@/lib/home-content";

/**
 * Section 5 — Our Journey.
 *
 * The spec pairs this section with the giant newspaper standing in a cold
 * spotlight. So the history is printed on a single large sheet, lit from
 * directly above, with the paper curling away at its foot — rather than
 * floating in glass cards.
 *
 * The cool tone is deliberate and is the one place the site goes cold: it
 * separates the retrospective from the warm, present-tense sections either
 * side of it.
 *
 * WHAT IS REAL HERE. All five milestone TITLES come from the spec — Genesis
 * begins, the creator network scales, production comes in-house, the AI studio
 * opens, full-service. Only their dates and one-line descriptions are unwritten.
 *
 * An earlier pass required a date before a milestone could render, which
 * filtered out all five and removed the section from the page. That was the
 * wrong test: the shape of the history is the titles and their order, and both
 * are known. AnimatedTimeline omits the date pill and the description for any
 * milestone that lacks them, so the rail renders on what is true and fills in
 * as the copy lands. Figures are still filtered by value; see isPending().
 */
export function Journey() {
  // Unwritten fields are stripped HERE rather than only at render. This is a
  // client component, so anything left on the object is serialised into the
  // RSC payload and shipped to the browser even though nothing displays it.
  const milestones = journey.milestones.map((milestone) => ({
    title: milestone.title,
    ...(isPending(milestone.date) ? {} : { date: milestone.date }),
    ...(isPending(milestone.description) ? {} : { description: milestone.description }),
  }));
  const figures = journey.figures.filter((figure) => !isPending(figure.value));

  return (
    <section
      id="journey"
      className="grain relative isolate overflow-hidden bg-void py-32 sm:py-32"
    >
      <Spotlight x={50} spread={13} tone="cool" intensity={1.05} reach={98} />
      <GhostType>SINCE DAY ONE</GhostType>

      <div className="relative z-[2] mx-auto w-full max-w-5xl px-6">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <Reveal>
            <SectionLabel dot tone="crimson">
              {journey.label}
            </SectionLabel>
            <h2 className="mt-6 text-balance text-h2 font-semibold leading-[1.05] tracking-tight text-bone sm:text-h1">
              {journey.heading}{" "}
              <span className="font-serif font-normal italic text-cool-accent">
                {journey.headingAccent}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <CornerNote index="Journey">{journey.body}</CornerNote>
          </Reveal>
        </div>

        {/*
          The sheet. Lit from the top edge, falling off toward the bottom, with
          a slight perspective tilt so it reads as standing in the room rather
          than pasted onto the page.
        */}
        <Reveal delay={0.18} variant="scene" className="mt-16">
          <div
            className="relative rounded-[2px] px-6 py-16 sm:px-16"
            style={{
              background:
                "linear-gradient(180deg, rgb(185 204 214) 0%, rgb(168 189 201) 30%, rgb(152 174 187) 58%, rgb(138 161 174) 100%)",
              boxShadow:
                "0 -1px 0 0 rgb(240 248 255 / 0.75) inset, 0 60px 140px -46px rgb(0 0 0 / 0.95), 0 0 90px 10px rgb(190 214 246 / 0.12)",
              transform: "perspective(1600px) rotateX(1.6deg)",
            }}
          >
            {/*
              Column rules and one horizontal fold — a broadsheet is ruled into
              many columns, and p15_0 shows exactly that. A single centre cross
              read as a crease on a blank sheet, not as newsprint.
            */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent 0 11.9%, rgb(28 48 63 / 0.55) 11.9% 12%), linear-gradient(180deg, transparent 49.7%, rgb(28 48 63 / 0.4) 50%, transparent 50.3%)",
              }}
            />

            <div className="relative grid gap-12 lg:grid-cols-[1fr_0.62fr] lg:gap-16">
              <AnimatedTimeline
                milestones={milestones}
              // Crimson, not teal. This section reads cold because its PAPER is
              // cold — sampled straight off p15_0 — so the accent no longer has to
              // carry that, and teal appears nowhere in the references.
                tone="crimson"
                surface="light"
                className="relative"
              />

              {/*
                The right column of the page. Dark ink on paper, and the rule
                down its inside edge is a column rule — the same device the
                sheet's own ruling uses.
              */}
              <div className="lg:border-l lg:border-[#1c2b38]/15 lg:pl-16">
                <StatRow
                  stats={figures.map((figure) => ({ ...figure }))}
                  surface="light"
                />
                <p className="mt-8 max-w-xs text-small leading-relaxed text-[#20303e]">
                  {journey.body}
                </p>
              </div>
            </div>
          </div>

          {/* The sheet curling away at its foot. */}
          <div
            aria-hidden
            className="h-16 rounded-b-[50%]"
            style={{
              background:
                "linear-gradient(180deg, rgb(138 161 174 / 0.85) 0%, rgb(96 116 130 / 0.4) 40%, transparent 100%)",
              filter: "blur(2px)",
            }}
          />
        </Reveal>
      </div>
    </section>
  );
}
