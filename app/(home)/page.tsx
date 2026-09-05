import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";
import { AiContent } from "./components/ai-content";
import { BrandingDesign } from "./components/branding-design";
import { CaseStudies } from "./components/case-studies";
import { ClientLogos } from "./components/client-logos";
import { FooterCta } from "./components/footer-cta";
import { InfluencerMarketing } from "./components/influencer-marketing";
import { Journey } from "./components/journey";
import { Services } from "./components/services";
import { Studios } from "./components/studios";
import { WorkLibrary } from "./components/work-library";
import { Testimonials } from "./components/testimonials";
import { WhoWeAre } from "./components/who-we-are";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — ${siteConfig.tagline}`,
  },
  description: siteConfig.description,
};

/**
 * Homepage — the Genesis ecosystem, in the order the brief asks for.
 *
 * THE BRAIN IS THE HERO. The old opening was a lit room with a standing
 * figure and a headline over it: a picture of nobody, in front of nothing,
 * saying what Genesis does in words. It has been removed. The first thing a
 * visitor now meets is the orb with the four verticals around it, which says
 * the same thing as a diagram and lets them click straight into whichever
 * part they came for.
 *
 * WORK IS SECOND, and that is the point of the whole reorder. The old page
 * spent its first three screens explaining Genesis before showing anything it
 * had made. A visitor deciding whether to hire a creative company is looking
 * for the work; everything else is a caption on it.
 *
 * THE FOUR VERTICALS ARE THE SPINE. Influence, Studios, AI Labs and Brand &
 * Design each get their own block with their own work and their own call to
 * action, so the site reads as one ecosystem with four parts rather than as
 * fifteen unrelated services.
 *
 * WHAT LEFT THE PAGE.
 *   - The Journal teaser. There are no published articles, and a "coming
 *     soon" editorial shelf makes a launch look unfinished. The route still
 *     exists; it comes back when there is a pipeline behind it.
 *   - The Insider teaser. Genesis Insider is an internal operating system and
 *     it was interrupting the agency story. It is a Client Login in the
 *     footer now, which is where a staff door belongs.
 *   - The creative-process board. It describes how production runs, which
 *     makes it part of Studios rather than a section of its own; it moves
 *     into the Studios block when that block is built.
 *
 * ALL FOUR VERTICALS NOW HAVE A SECTION. Studios was the gap for as long as
 * there was no footage to put in it — it is the division whose whole argument
 * is showing the work, and thirteen service names in a grid is the least
 * convincing thing a page about making films could say. The masters have
 * since been transcoded, so it leads with the reel wall.
 */
export default function HomePage() {
  return (
    <main>
      {/* 01 — the Brain. Four verticals, one system, and the way in. */}
      <Services />

      {/* 02 — proof: who Genesis has done it for. */}
      <ClientLogos />

      {/* 03-06 — the four verticals, in the brief's order. */}
      <InfluencerMarketing />
      <Studios />
      <AiContent />
      <BrandingDesign />

      {/*
        07 — THE LIBRARY, and the only browse on the page. Genesis counted the
        work three times over: a poster rail at the top under "Selected work",
        the Studios reel wall, and this grid between Studios and AI Lab. Three
        answers to "show me what you've made", two of them trailers for each
        other.

        Two now, with different jobs. The reel wall inside Studios is that
        division showing its own footage, and its button sends you here rather
        than off to another page. This is the browse: everything, filterable,
        and placed after all four verticals so a visitor has met the whole
        ecosystem before being handed the catalogue. The rail that used to open
        the page is gone outright — it was the same catalogue, four cards
        shorter.
      */}
      <WorkLibrary />

      {/*
        Positioning and history, together. The brief asks to cut explanatory
        sections and its running order drops this one — but it is also the
        deck's own positioning page, which was added at the client's request,
        so rather than delete it outright it moves out of the opening and sits
        against the journey, where "who we are" and "how we got here" read as
        one thought. Easy to cut if the answer is still cut.
      */}
      <WhoWeAre />
      <Journey />

      {/* 09-11 — the strategic case, the client's voice, then the ask. */}
      <CaseStudies />
      <Testimonials />
      <FooterCta />
    </main>
  );
}
