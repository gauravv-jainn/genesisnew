import { Reveal } from "@/components/genesis/reveal";
import { WatchCluster } from "@/components/genesis/watch-cluster";
import { testimonials } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 6 — Testimonials.
 *
 * Spec: "//this will like move around like how apps move around in an apple
 * watch", so this shares the cluster interaction with the client logos.
 *
 * Names and companies are real (from the spec). Every QUOTE is still a
 * placeholder — the spec also notes "Start video testimonial project", so
 * these cells become video cards once that footage exists.
 */
export function Testimonials() {
  return (
    <SectionShell
      id="testimonials"
      label={testimonials.label}
      heading={testimonials.heading}
      headingAccent={testimonials.headingAccent}
      body="Drag to move through the wall."
      tone="amber"
      origin="top"
      intensity={0.14}
    >
      <Reveal>
        <WatchCluster
          height={520}
          cell={190}
          items={testimonials.items.map((testimonial) => ({
            id: testimonial.name,
            content: (
              <figure className="glass glass-lit flex w-40 flex-col gap-3 rounded-3xl p-4 sm:w-44">
                <blockquote className="text-[11px] leading-relaxed text-bone/80">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="border-t border-white/10 pt-3">
                  <p className="text-xs font-medium text-bone">{testimonial.name}</p>
                  <p className="mt-0.5 text-[10px] text-faint">{testimonial.role}</p>
                </figcaption>
              </figure>
            ),
          }))}
        />
      </Reveal>
    </SectionShell>
  );
}
