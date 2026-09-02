import type { CSSProperties } from "react";

import { Sparkles } from "lucide-react";

import { AvatarFan } from "@/components/genesis/avatar-fan";
import { GlassButton } from "@/components/genesis/glass-button";
import { ToolsStack } from "@/components/genesis/tools-stack";
import { RevealGroup, RevealItem, Reveal } from "@/components/genesis/reveal";
import { aiContent } from "@/lib/home-content";
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
      label={aiContent.label}
      heading={aiContent.heading}
      headingAccent={aiContent.headingAccent}
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
        className="relative left-1/2 mt-20 w-screen -translate-x-1/2 overflow-hidden"
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

        <AvatarFan avatars={aiContent.avatars} className="mt-14 sm:mt-16" />
      </Reveal>

      {/* The stack feeding the studio — many inputs converging on one output. */}
      <Reveal delay={0.12} className="mx-auto mt-24 max-w-4xl">
        <p className="micro-label mb-8 text-center">Tools we use</p>
        <ToolsStack
          tools={[...aiContent.tools]}
          destination={aiContent.destination}
          badge="Lab"
        />
      </Reveal>

      <RevealGroup className="mx-auto mt-16 flex max-w-2xl flex-wrap justify-center gap-3">
        {aiContent.capabilities.map((capability) => (
          <RevealItem key={capability}>
            <span className="glass inline-flex rounded-full px-4 py-2 text-small text-bone">
              {capability}
            </span>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1} className="mt-12 flex justify-center">
        <GlassButton variant="glass" icon={<Sparkles className="size-4" />} arrow>
          {/* TODO(link): points at the AI Lab page once it exists. */}
          Explore the AI Lab
        </GlassButton>
      </Reveal>
    </SectionShell>
  );
}
