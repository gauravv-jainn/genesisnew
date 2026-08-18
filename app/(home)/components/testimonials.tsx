import { RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { testimonials } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 10 — Testimonials.
 *
 * TODO(copy): every quote and attribution here is INVENTED placeholder text.
 * None of it may ship. Real, attributed quotes required before launch.
 */
export function Testimonials() {
  return (
    <SectionShell
      id="testimonials"
      label={testimonials.label}
      heading={testimonials.heading}
      headingAccent={testimonials.headingAccent}
      tone="amber"
      origin="top"
      intensity={0.14}
    >
      <RevealGroup className="grid gap-6 lg:grid-cols-3">
        {testimonials.items.map((testimonial) => (
          <RevealItem key={testimonial.quote} className="h-full">
            <figure className="glass glass-lit flex h-full flex-col justify-between rounded-3xl p-7">
              <blockquote className="text-pretty text-base leading-relaxed text-bone">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-8 border-t border-white/10 pt-5">
                <p className="text-sm font-medium text-bone">{testimonial.name}</p>
                <p className="mt-0.5 text-xs text-faint">{testimonial.role}</p>
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>
    </SectionShell>
  );
}
