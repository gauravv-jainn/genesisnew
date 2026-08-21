import { Sparkles } from "lucide-react";

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
 * The avatars are presented as a perspective arc of frames (img-033). Real
 * avatar stills replace the placeholder frames when the assets land.
 */

/**
 * Rotation and depth per frame, mirrored around the centre.
 *
 * NO OPACITY RAMP. img-033 is a continuous curved WALL of panels running edge
 * to edge and bleeding off both sides of the frame, every one at full
 * brightness — the outermost right panel is the most vivid thing in the
 * picture. Fading the flanks to 0.45 and 0.7 produced the generic 3D-carousel
 * look instead: five small fanned playing cards at descending scale AND
 * descending opacity in the middle of a wide empty section, where the
 * reference is a wall you feel you are standing inside. Rotation and depth
 * carry the curve; brightness does not have to.
 */
const ARC = [
  { rotateY: 42, translateZ: -150 },
  { rotateY: 24, translateZ: -68 },
  { rotateY: 0, translateZ: 0 },
  { rotateY: -24, translateZ: -68 },
  { rotateY: -42, translateZ: -150 },
];

export function AiContent() {
  return (
    <SectionShell
      id="ai-studio"
      label={aiContent.label}
      heading={aiContent.heading}
      headingAccent={aiContent.headingAccent}
      body={aiContent.body}
      // Teal appears NOWHERE in the references (PROGRESS.md:190). This section was painting itself mint-green inside a crimson brand.
      tone="crimson"
      origin="center"
      intensity={0.14}
      align="center"
    >
      {/*
        FULL-BLEED. The arc used to sit inside SectionShell's max-w-6xl, so
        five 160x256 frames totalling 880px floated in a 1104px column with
        ~110px of dead space each side, capped and never scaled up. The
        reference runs edge to edge and clips at both sides, which is what
        makes it read as a wall rather than as a widget.
      */}
      <Reveal className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div
          className="flex items-end justify-center gap-1 sm:gap-1.5"
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
                }}
              >
                <div
                  className="aspect-[2/3] w-[clamp(8rem,19vw,20rem)] overflow-hidden rounded-2xl border border-white/10"
                  style={{
                    // TODO(assets): real avatar stills replace this placeholder.
                    background: `linear-gradient(${150 + index * 20}deg, rgb(255 45 63 / 0.24) 0%, rgb(20 20 24 / 0.92) 55%), radial-gradient(80% 60% at 50% 20%, rgb(255 255 255 / 0.18), transparent 70%)`,
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

      {/* The stack feeding the studio — many inputs converging on one output. */}
      <Reveal delay={0.12} className="mx-auto mt-20 max-w-4xl">
        <p className="micro-label mb-8 text-center">Tools we use</p>
        <ToolsStack
          tools={[...aiContent.tools]}
          destination={aiContent.destination}
          badge="Studio"
        />
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
