import { Lock } from "lucide-react";

import { GlassButton } from "@/components/genesis/glass-button";
import { Reveal } from "@/components/genesis/reveal";
import { insider } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 12 — Genesis Insider teaser.
 *
 * The one section that points inward. Deliberately restrained: it advertises
 * that a workspace exists without implying the public can enter it.
 */
export function InsiderTeaser() {
  return (
    <SectionShell
      id="insider"
      // Teal appears NOWHERE in the references (PROGRESS.md:190).
      tone="brand"
      origin="center"
      intensity={0.12}
    >
      <Reveal>
        <div className="glass glass-strong glass-lit relative overflow-hidden rounded-panel p-12 sm:p-16">
          {/* Faint grid, reading as "system" rather than "marketing". */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="micro-label flex items-center gap-3">
                <Lock className="size-3.5 text-brand-ink" aria-hidden />
                {insider.label}
              </p>

              <h2 className="mt-6 text-balance text-h2 font-normal leading-tight tracking-tight text-bone sm:text-h2">
                {insider.heading}{" "}
                <span className="font-serif font-normal italic text-brand-ink">
                  {insider.headingAccent}
                </span>
              </h2>

              <p className="mt-6 text-pretty text-small leading-relaxed text-ash sm:text-body">
                {insider.body}
              </p>
            </div>

            {/* A plain <a>, not <Link> — the Auth0 flow must not be client-routed. */}
            <GlassButton href={insider.cta.href} variant="glass" size="lg" arrow>
              {insider.cta.label}
            </GlassButton>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}
