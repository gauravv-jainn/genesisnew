import Image from "next/image";

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
    <Atmosphere tone="brand" origin="center" intensity={0.14} className="py-12 sm:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <SectionLabel dot>{clients.label}</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-6 max-w-md text-small text-ash">
            Move your pointer through the wall.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1} variant="scene" className="mt-8">
        <WatchCluster
          // Sized so all of them sit inside the frame at rest — the lean
          // is a flourish, not the only way to reach half the wall.
          height={400}
          cell={132}
          items={clients.logos.map((logo) => ({
            id: logo.file,
            content: (
              /*
                EACH MARK GETS THE GROUND IT NEEDS. Twenty-two of the
                twenty-nine are dark or full-colour and want paper behind
                them; eight are white-ink versions that would disappear on
                it. `onDark` is measured per file rather than guessed — see
                lib/home-content — and no CSS filter can substitute for it:
                inverting a white mark turns The Lalit's red square cyan.

                The chip is opaque rather than glass on purpose. A client's
                logo is their asset; it should sit on a clean ground, not be
                tinted by whatever the page's gradient is doing behind it.
              */
              <div
                className={
                  logo.onDark
                    ? "grid size-24 place-items-center rounded-panel border border-white/12 bg-[#141418] p-4 sm:size-28"
                    : "grid size-24 place-items-center rounded-panel border border-black/10 bg-white p-4 sm:size-28"
                }
              >
                <Image
                  src={`/clients/${logo.file}.png`}
                  alt={logo.name}
                  width={400}
                  height={400}
                  /*
                    The chip is 112px at its largest, so without `sizes` every
                    one of the twenty-nine would pull a viewport-sized file to
                    fill it. object-contain because a logo must never be
                    cropped; w-auto so a wide mark keeps its proportions.
                  */
                  sizes="112px"
                  className="max-h-full w-auto max-w-full object-contain"
                />
              </div>
            ),
          }))}
        />
      </Reveal>
    </Atmosphere>
  );
}
