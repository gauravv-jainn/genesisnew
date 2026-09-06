import type { Metadata } from "next";
import Image from "next/image";

import { GlassButton } from "@/components/genesis/glass-button";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { initials, team } from "@/lib/team";

export const metadata: Metadata = {
  title: "Team",
  description: team.body,
};

/**
 * /team — meet the people.
 *
 * ONE TILE SHAPE FOR EVERYONE, whether a headshot exists or not, so the grid
 * does not reflow when a photograph lands. A member without one gets a
 * monogram on a dark ground rather than a grey avatar box: a broken image
 * reads as a bug, a monogram reads as a portrait that has not arrived.
 *
 * Both current members have theirs — hand-cut to a matching frame, see
 * lib/team.ts — so the monogram branch is only waiting for the next hire.
 */
export default function TeamPage() {
  return (
    <main className="relative min-h-dvh pb-32 pt-32 sm:pt-40">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <SectionLabel dot tone="brand">
            {team.label}
          </SectionLabel>
          <h1 className="mt-6 max-w-2xl text-balance text-h2 font-normal leading-[1.02] tracking-tight text-bone sm:text-h1">
            {team.heading}{" "}
            <span className="font-serif font-normal italic text-brand-ink">
              {team.headingAccent}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-body leading-relaxed text-ash">
            {team.body}
          </p>
        </Reveal>

        {/*
          TWO COLUMNS, CAPPED. It was four across at lg, sized for the eight
          placeholders that used to be here. Two members in a four-column grid
          are two tiles huddled in the left quarter of a 1152px row with half
          the page empty beside them; the same two at a 2xl measure read as a
          leadership pair, which is what they are.
        */}
        <RevealGroup className="mt-14 grid max-w-2xl grid-cols-2 gap-x-5 gap-y-10 sm:mt-16 sm:gap-x-8">
          {team.members.map((member) => (
            <RevealItem key={member.slug}>
              <figure className="flex flex-col gap-4">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card border border-[var(--glass-border)]">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={`${member.name}, ${member.role}`}
                      fill
                      // Two across at every width, inside a 42rem measure.
                      sizes="(min-width: 768px) 20rem, 45vw"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 grid place-items-center"
                      style={{
                        background:
                          "linear-gradient(150deg, #2b2b2b 0%, #171717 60%, #111111 100%)",
                      }}
                    >
                      {/*
                        Monogram from the DIVISION while the person is a
                        placeholder — initials of a job title give "F&" for
                        "Founder & CEO", which reads as a rendering fault
                        rather than as a stand-in.
                      */}
                      <span
                        aria-hidden
                        className="text-h1 font-normal tracking-tight text-white/25"
                      >
                        {initials(member.pending ? member.division : member.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/*
                  While a member is a placeholder the name IS the role, so
                  printing both put the same words twice under every tile.
                  The role leads until a real name arrives.
                */}
                <figcaption className="flex flex-col gap-1">
                  {!member.pending && (
                    <span className="text-body font-medium leading-tight text-bone">
                      {member.name}
                    </span>
                  )}
                  <span
                    className={
                      member.pending
                        ? "text-body font-medium leading-tight text-bone"
                        : "text-small leading-tight text-ash"
                    }
                  >
                    {member.role}
                  </span>
                  <span className="micro-label mt-1 !text-faint">
                    {member.division}
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mt-14 flex flex-wrap gap-3">
          <GlassButton href="/careers" variant="brand" arrow>
            Work with us
          </GlassButton>
          <GlassButton
            href="/#contact"
            quickContact="team:start-a-project"
            variant="glass"
            arrow
          >
            Start a project
          </GlassButton>
        </Reveal>
      </div>
    </main>
  );
}
