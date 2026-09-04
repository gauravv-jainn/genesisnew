import type { CSSProperties } from "react";

import { Sparkles } from "lucide-react";

import { AvatarFan } from "@/components/genesis/avatar-fan";
import { GlassButton } from "@/components/genesis/glass-button";
import { Reveal } from "@/components/genesis/reveal";
import { aiContent, services } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section — AI-generated content.
 *
 * Spec: "AI tools, Image Generations, AI Avatars, Video Generations… Some AI
 * content can be showcased. Ai Avatars: Adi, Diya, Ivaanat, Shivam, Tanvi."
 *
 * The avatars are dealt as a fanned hand of cards, from the deck's own AI Lab
 * board. Real avatar stills replace the placeholder grounds when they land.
 */

export function AiContent() {
  return (
    <SectionShell
      id="ai-lab"
      division={{
        name: "AI Lab",
        tagline: services.items[3].caption,
        ramp: services.items[3].ramp,
      }}
      body={aiContent.body}
      // Teal appears NOWHERE in the references (PROGRESS.md:190). This section was painting itself mint-green inside a brand brand.
      tone="brand"
      origin="center"
      intensity={0.14}
      align="center"
    >
      {/*
        FULL-BLEED. The fan runs edge to edge and clips at both sides, the
        way the board does — a hand of cards floating with air either side of
        it reads as a widget dropped into the section instead of a roster
        being dealt to you.
      */}
      <Reveal
        variant="scene"
        className="relative left-1/2 mt-12 w-screen -translate-x-1/2 overflow-hidden"
      >
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h3
            className="ramp-text text-balance text-h2 font-normal leading-[1.05] tracking-tight sm:text-h1"
            style={{ "--ramp": "var(--ramp-avatars)" } as CSSProperties}
          >
            {aiContent.avatarsHeading} {aiContent.avatarsAccent}
          </h3>
          <p
            className="ramp-text mt-4 text-lead leading-relaxed"
            style={{ "--ramp": "var(--ramp-avatars-soft)" } as CSSProperties}
          >
            {aiContent.avatarsBody}
          </p>
        </div>

        <AvatarFan avatars={aiContent.avatars} className="mt-10 sm:mt-12" />
      </Reveal>

      {/*
        THE TOOL STACK AND THE CAPABILITY CHIPS ARE GONE from the homepage.
        With the roster, the stack, a chip row and a button this section ran
        to 2.28 screens — the worst offender on the page by some way, in a
        brief that asks for one section to a screen. The avatars are the
        argument; the tooling is a detail for the division's own page.
      */}
      <Reveal delay={0.1} className="mt-12 flex flex-wrap justify-center gap-3">
        <GlassButton
          href="/#contact"
          quickContact="ai-labs:build-with-ai"
          variant="brand"
          icon={<Sparkles className="size-4" />}
          arrow
        >
          Build with AI
        </GlassButton>
        <GlassButton href="/our-work" variant="glass" arrow>
          View AI work
        </GlassButton>
      </Reveal>
    </SectionShell>
  );
}
