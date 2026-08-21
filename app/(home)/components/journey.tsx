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
      className="grain relative isolate overflow-hidden bg-void py-28 sm:py-36"
    >
      <Spotlight x={50} spread={13} tone="cool" intensity={1.05} reach={98} />
      <GhostType>SINCE DAY ONE</GhostType>

      <div className="relative z-[2] mx-auto w-full max-w-5xl px-6">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <Reveal>
            <SectionLabel dot tone="teal">
              {journey.label}
            </SectionLabel>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone sm:text-5xl">
              {journey.heading}{" "}
              <span className="font-serif font-normal italic text-[#cfe3ff]">
                {journey.headingAccent}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <CornerNote index="Journey">{journey.body}</CornerNote>
          </Reveal>
        </div>

        {/*
          The figures the spec asks for: "//numbers increasing animation".
          StatRow counts each up once as it scrolls into view.
        */}
        <Reveal delay={0.12} className="mt-14">
          <StatRow stats={figures.map((figure) => ({ ...figure }))} />
        </Reveal>

        {/*
          The sheet. Lit from the top edge, falling off toward the bottom, with
          a slight perspective tilt so it reads as standing in the room rather
          than pasted onto the page.
        */}
        <Reveal delay={0.18} className="mt-14">
          <div
            className="relative rounded-[2px] px-6 py-14 sm:px-14"
            style={{
              background:
                "linear-gradient(180deg, rgb(232 238 248 / 0.10) 0%, rgb(210 222 240 / 0.055) 38%, rgb(160 176 200 / 0.02) 100%)",
              boxShadow:
                "0 -1px 0 0 rgb(226 238 255 / 0.35) inset, 0 60px 120px -50px rgb(0 0 0 / 0.9)",
              transform: "perspective(1600px) rotateX(1.6deg)",
            }}
          >
            {/* Fold lines, as on a broadsheet. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, transparent 49.9%, rgb(255 255 255) 50%, transparent 50.1%), linear-gradient(180deg, transparent 49.9%, rgb(255 255 255) 50%, transparent 50.1%)",
              }}
            />

            <AnimatedTimeline
              milestones={milestones}
              tone="teal"
              className="relative"
            />
          </div>

          {/* The sheet curling away at its foot. */}
          <div
            aria-hidden
            className="h-16 rounded-b-[50%]"
            style={{
              background:
                "linear-gradient(180deg, rgb(200 214 235 / 0.05) 0%, transparent 100%)",
              filter: "blur(2px)",
            }}
          />
        </Reveal>
      </div>
    </section>
  );
}
