import { PaperCard } from "@/components/genesis/paper-card";
import { RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { services } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 2 — Services.
 *
 * The six disciplines as scattered paper cards under a single light
 * (img-009, img-053). In Phase 3 this section hands off into Portfolio with
 * the 180° pan; the layout here is built to survive that without restructuring.
 */
export function Services() {
  return (
    <SectionShell
      id="services"
      label={services.label}
      heading={services.heading}
      headingAccent={services.headingAccent}
      body={services.body}
      tone="amber"
      origin="top-left"
      intensity={0.16}
    >
      <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.items.map((service, index) => (
          <RevealItem key={service.title} className="h-full">
            <PaperCard
              tone={index % 3 === 1 ? "crimson" : "amber"}
              rotate={index % 2 === 0 ? -1.8 : 1.6}
              className="h-full"
            >
              <p className="micro-label mb-3">{`0${index + 1}`}</p>
              <h3 className="text-xl font-semibold tracking-tight text-bone">
                {service.title}
              </h3>
              <p className="mt-1 text-xs text-amber/70">{service.caption}</p>
              <p className="mt-4 text-sm leading-relaxed text-ash">
                {service.body}
              </p>
            </PaperCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </SectionShell>
  );
}
