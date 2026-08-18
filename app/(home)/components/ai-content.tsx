import { Sparkles } from "lucide-react";

import { GlassButton } from "@/components/genesis/glass-button";
import { RevealGroup, RevealItem, Reveal } from "@/components/genesis/reveal";
import { aiContent } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 6 — AI-Generated Content.
 *
 * The perspective card arc from img-033: a row of frames receding on both
 * sides of centre, with the feature captions beneath. Depth comes from CSS
 * 3D transforms rather than images, so it costs nothing to load.
 */

// Rotation/offset per card, mirrored around the centre index.
const ARC = [
  { rotateY: 38, translateZ: -140, opacity: 0.35 },
  { rotateY: 22, translateZ: -70, opacity: 0.6 },
  { rotateY: 0, translateZ: 0, opacity: 1 },
  { rotateY: -22, translateZ: -70, opacity: 0.6 },
  { rotateY: -38, translateZ: -140, opacity: 0.35 },
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
          className="flex items-center justify-center gap-3 sm:gap-5"
          style={{ perspective: "1200px" }}
        >
          {ARC.map((frame, index) => (
            <div
              key={index}
              aria-hidden
              className="h-44 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:h-64 sm:w-40"
              style={{
                transform: `perspective(1200px) rotateY(${frame.rotateY}deg) translateZ(${frame.translateZ}px)`,
                opacity: frame.opacity,
                // Placeholder frames — real generated stills drop in later.
                background: `linear-gradient(${150 + index * 20}deg, rgb(45 212 191 / 0.25) 0%, rgb(20 20 24 / 0.9) 55%), radial-gradient(80% 60% at 50% 20%, rgb(255 255 255 / 0.16), transparent 70%)`,
              }}
            />
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 flex justify-center">
        <GlassButton variant="glass" icon={<Sparkles className="size-4" />}>
          {/* TODO(link): points at the AI studio page once it exists. */}
          Explore the AI studio
        </GlassButton>
      </Reveal>

      <RevealGroup className="mt-16 grid gap-8 text-left sm:grid-cols-3">
        {aiContent.features.map((feature) => (
          <RevealItem key={feature.title}>
            <h3 className="text-base font-semibold tracking-tight text-bone">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ash">
              {feature.body}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>
    </SectionShell>
  );
}
