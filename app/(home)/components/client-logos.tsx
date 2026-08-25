import { Atmosphere } from "@/components/genesis/atmosphere";
import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { WatchCluster } from "@/components/genesis/watch-cluster";
import { clients } from "@/lib/home-content";

/**
 * Section 5 — Clients we've worked with.
 *
 * Spec: "Clients we have worked with (logos dump) //movable like Apple Watch
 * Apps". Wordmarks stand in until the logo files arrive — swapping them for
 * <img> is a change inside this one map call.
 *
 * SIZED TO BE A CLUSTER YOU ARE INSIDE. At cell 150 the honeycomb spanned
 * about 47% of a 1280 frame: a small clump floating in a mostly empty section,
 * which reads as a widget dropped in the middle rather than as a wall of
 * clients. And the section was tone="neutral" — unlit, in a site where every
 * other section is lit, which is not restraint, it is the light switched off.
 */
export function ClientLogos() {
  return (
    <Atmosphere tone="brand" origin="center" intensity={0.14} className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <SectionLabel dot>{clients.label}</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-6 max-w-md text-small text-ash">
            Drag the cluster to move through it.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1} variant="scene" className="mt-8">
        <WatchCluster
          height={560}
          cell={196}
          items={clients.logos.map((logo) => ({
            id: logo,
            content: (
              <div className="glass glass-lit grid size-32 place-items-center rounded-panel p-4 text-center sm:size-40">
                {/* TODO(assets): real client logo files owed (spec: "Ask tanvi"). */}
                <span className="text-small font-semibold leading-tight tracking-[0.08em] text-bone/80">
                  {logo}
                </span>
              </div>
            ),
          }))}
        />
      </Reveal>
    </Atmosphere>
  );
}
