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
          cell={150}
          items={clients.logos.map((logo) => ({
            id: logo.file,
            content: (
              /*
                ONE GROUND FOR THE WHOLE WALL. This used to give each mark the
                chip its own ink wanted — white for most, dark for the light
                ones — which was legible and looked like a chequerboard.
                Genesis was right: a wall of client logos wants one surface.

                The seven marks that cannot live on paper are handled on the
                MARK instead, from a measurement rather than by eye. Two are
                monochrome white and simply invert, which for a mark with no
                colour in it is lossless. Five carry colour and are dimmed,
                which holds the hue — inverting those would turn The Lalit's
                red square cyan. See lib/home-content.

                The chip is opaque rather than glass on purpose: a client's
                logo is their asset and should sit on a clean ground, not take
                a tint from the page gradient behind it.
              */
              <div className="relative grid size-28 place-items-center rounded-panel border border-black/10 bg-white p-3.5 sm:size-32">
                <Image
                  src={`/clients/${logo.file}.png`}
                  alt={logo.name}
                  fill
                  // The chip is 128px at its largest; without this each of the
                  // twenty-nine would pull a viewport-sized file.
                  sizes="128px"
                  className="object-contain p-3.5"
                  style={
                    logo.ink === "invert"
                      ? { filter: "invert(1)" }
                      : logo.ink === "darken"
                        ? // Saturation nudged back up because dimming reads as
                          // washing out; the hue itself is untouched.
                          { filter: "brightness(0.58) saturate(1.2)" }
                        : undefined
                  }
                />
              </div>
            ),
          }))}
        />
      </Reveal>
    </Atmosphere>
  );
}
