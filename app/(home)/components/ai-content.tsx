import { Sparkles } from "lucide-react";

import { GlassButton } from "@/components/genesis/glass-button";
import { RevealGroup, RevealItem, Reveal } from "@/components/genesis/reveal";
import { aiContent } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section — AI-generated content.
 *
 * Spec: "AI tools, Image Generations, AI Avatars, Video Generations… Some AI
 * content can be showcased. Ai Avatars: Adi, Diya, Ivaanat, Shivam, Tanvi."
 *
 * The avatars are presented as a perspective arc of frames (img-033). Real
 * avatar stills replace the placeholder frames when the assets land.
 */

// Rotation/offset per frame, mirrored around the centre index.
const ARC = [
  { rotateY: 38, translateZ: -140, opacity: 0.45 },
  { rotateY: 22, translateZ: -70, opacity: 0.7 },
  { rotateY: 0, translateZ: 0, opacity: 1 },
  { rotateY: -22, translateZ: -70, opacity: 0.7 },
  { rotateY: -38, translateZ: -140, opacity: 0.45 },
];

export function AiContent() {
  return (
    <SectionShell
      id="ai-studio"
      label={aiContent.label}
      heading={aiContent.heading}
      headingAccent={aiContent.headingAccent}
      body={aiContent.body}
      tone="teal"
      origin="center"
      intensity={0.14}
      align="center"
    >
      <Reveal>
        <div
          className="flex items-end justify-center gap-3 sm:gap-5"
          style={{ perspective: "1200px" }}
        >
          {aiContent.avatars.map((avatar, index) => {
            const frame = ARC[index] ?? ARC[2];
            return (
              <figure
                key={avatar.id}
                className="shrink-0"
                style={{
                  transform: `perspective(1200px) rotateY(${frame.rotateY}deg) translateZ(${frame.translateZ}px)`,
                  opacity: frame.opacity,
                }}
              >
                <div
                  className="h-44 w-24 overflow-hidden rounded-2xl border border-white/10 sm:h-64 sm:w-40"
                  style={{
                    // TODO(assets): real avatar stills replace this placeholder.
                    background: `linear-gradient(${150 + index * 20}deg, rgb(45 212 191 / 0.28) 0%, rgb(20 20 24 / 0.92) 55%), radial-gradient(80% 60% at 50% 20%, rgb(255 255 255 / 0.18), transparent 70%)`,
                  }}
                />
                <figcaption className="mt-3 text-center text-xs font-medium text-bone">
                  {avatar.name}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={0.08} className="mt-10 flex justify-center">
        <p className="micro-label">AI avatars</p>
      </Reveal>

      <RevealGroup className="mx-auto mt-14 flex max-w-2xl flex-wrap justify-center gap-3">
        {aiContent.capabilities.map((capability) => (
          <RevealItem key={capability}>
            <span className="glass inline-flex rounded-full px-4 py-2 text-sm text-bone">
              {capability}
            </span>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1} className="mt-12 flex justify-center">
        <GlassButton variant="glass" icon={<Sparkles className="size-4" />} arrow>
          {/* TODO(link): points at the AI studio page once it exists. */}
          Explore the AI studio
        </GlassButton>
      </Reveal>
    </SectionShell>
  );
}
