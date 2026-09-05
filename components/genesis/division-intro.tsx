import { DivisionLockup } from "@/components/genesis/division-lockup";
import { Reveal } from "@/components/genesis/reveal";

/**
 * A division's own lockup, at the top of its page.
 *
 * Genesis's divisions each have a wordmark — GENESIS.Influence over
 * "Influencer Marketing | Celeb | UGC Activations" — and their pages opened
 * with a generic section heading instead, so a visitor arriving on one had no
 * signal they had reached that division rather than a page about it.
 *
 * Set rather than placed as an image, deliberately: the lockups are supplied
 * as raster files, and a page heading that is a PNG cannot be selected,
 * searched, translated, or read by a screen reader, and goes soft on a
 * retina display. The name is live text in the division's own ramp, which is
 * the same gradient the lockup uses.
 *
 * IT CARRIES ITS OWN CLEARANCE UNDER THE NAV. This is by definition the first
 * thing on a division page, and the nav is fixed — measured, its pill ends at
 * 86px on desktop and 78px on a phone, and a lockup with no top padding
 * renders entirely inside that. Leaving the clearance to the page meant each
 * one rediscovered the number: /influencer-campaigns put pt-24 on <main>,
 * which cleared it by ten pixels, and /content-creation set nothing at all
 * and printed its h1 under the pill. pt-32 sm:pt-40 is what every other page
 * on the site opens with, so a division page now opens at the same height as
 * its neighbours and the next one cannot get it wrong.
 */
export function DivisionIntro({
  division,
  tagline,
  ramp,
  children,
}: {
  /** The part after the dot — "Influence", "Studios". */
  division: string;
  tagline: string;
  /** The division's gradient, from lib/home-content. */
  ramp: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto w-full max-w-6xl px-6 pt-32 sm:pt-40">
      <Reveal>
        <DivisionLockup name={division} tagline={tagline} ramp={ramp} as="h1" />
      </Reveal>

      {children && (
        <Reveal delay={0.1} className="mt-8 max-w-2xl">
          {children}
        </Reveal>
      )}
    </header>
  );
}
