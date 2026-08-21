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
 */
export function ClientLogos() {
  return (
    <Atmosphere tone="neutral" origin="center" intensity={0.12} className="py-24 sm:py-32">
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
          height={480}
          cell={150}
          items={clients.logos.map((logo) => ({
            id: logo,
            content: (
              <div className="glass glass-lit grid size-28 place-items-center rounded-panel p-3 text-center sm:size-32">
                {/* TODO(assets): real client logo files owed (spec: "Ask tanvi"). */}
                <span className="text-micro font-semibold leading-tight tracking-[0.1em] text-bone/70">
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
