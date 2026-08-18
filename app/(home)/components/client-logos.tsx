import { LogoMarquee } from "@/components/genesis/logo-marquee";
import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { Atmosphere } from "@/components/genesis/atmosphere";
import { clients } from "@/lib/home-content";

/**
 * Section 9 — Client logo wall.
 *
 * Two rails running in opposite directions so the band reads as motion rather
 * than a static list. Uses its own shell rather than SectionShell because the
 * marquees must bleed the full viewport width, not sit inside the container.
 *
 * TODO(assets): wordmarks stand in for real client logos.
 */
export function ClientLogos() {
  return (
    <Atmosphere tone="neutral" origin="center" intensity={0.1} className="py-20 sm:py-24">
      <div className="mx-auto mb-12 w-full max-w-6xl px-6">
        <Reveal>
          <SectionLabel dot>{clients.label}</SectionLabel>
        </Reveal>
      </div>

      <Reveal>
        <div className="flex flex-col gap-8">
          <LogoMarquee logos={[...clients.rowOne]} speedSeconds={44} />
          <LogoMarquee logos={[...clients.rowTwo]} speedSeconds={52} reverse />
        </div>
      </Reveal>
    </Atmosphere>
  );
}
