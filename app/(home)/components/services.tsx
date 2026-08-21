import { CornerNote, GhostType, Spotlight } from "@/components/genesis/spotlight";
import { PaperCard } from "@/components/genesis/paper-card";
import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { services } from "@/lib/home-content";

/**
 * Section 2 — Services.
 *
 * Built to img-009 and img-053: cards dropped under a single raked source, at
 * real angles, overlapping, at more than one size, with display type behind
 * them that they partly occlude.
 *
 * WHAT THE PREVIOUS VERSION WAS. A `sm:grid-cols-2 lg:grid-cols-3` feature
 * grid with every card forced to equal height and rotated by 2.2-2.6 degrees —
 * small enough to read as a rendering artefact rather than a decision. Five
 * equal rectangles in three columns, none overlapping, all pinned dead centre.
 * That is a stock three-up feature grid with a tilt filter, and it is exactly
 * the template look this rebuild exists to remove.
 *
 * It also did not fit. Inside the camera pan the face is clamped to 100dvh,
 * and the old composition measured ~1000px at lg — so on a 1440x900 laptop
 * two of the five disciplines the spec names sat below a fold that could not
 * be scrolled. The stage below is sized in stage-relative units and the
 * trailing corner note is gone, so the whole section fits the turn.
 *
 * Cards carry title and caption only. The full sentence for each discipline
 * stays in `body` for the places that have room; a paragraph on a tilted,
 * overlapping card is unreadable however good the paragraph is.
 */

/**
 * Five positions across the stage. 23-25% wide at a 19% step overlaps by
 * roughly a fifth of a card, all leaning one way at 8-13 degrees, at three
 * height steps so the group has hierarchy rather than reading as one row.
 */
const SCATTER = [
  { left: "0%", top: "14%", rotate: -11, width: "23%", height: "62%" },
  { left: "19%", top: "38%", rotate: -8, width: "21%", height: "54%" },
  { left: "38%", top: "4%", rotate: -13, width: "25%", height: "70%" },
  { left: "58%", top: "34%", rotate: -9, width: "21%", height: "54%" },
  { left: "77%", top: "12%", rotate: -12, width: "23%", height: "62%" },
];

export function Services() {
  return (
    <section
      id="services"
      className="grain relative isolate overflow-hidden bg-void py-20 sm:py-24"
    >
      {/* One narrow source, raking in from upper right as in img-009. */}
      <Spotlight x={72} spread={8} rake={-28} tone="warm" intensity={1.15} reach={96} />

      <GhostType className="translate-y-4">OUR SERVICES</GhostType>

      <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <Reveal className="max-w-lg">
            <SectionLabel dot tone="amber">
              {services.label}
            </SectionLabel>
            <h2 className="mt-6 text-balance text-h2 font-semibold leading-[1.05] tracking-tight text-bone sm:text-h1">
              {services.heading}{" "}
              <span className="font-serif font-normal italic text-amber">
                {services.headingAccent}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <CornerNote index="Services">{services.body}</CornerNote>
          </Reveal>
        </div>

        {/* Below lg: a plain readable grid. An overlapping arc at phone width
            is illegible, not atmospheric. */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:hidden">
          {services.items.map((service, index) => (
            <Reveal key={service.title} delay={0.05 * index} variant="card">
              <ServiceCard service={service} index={index} />
            </Reveal>
          ))}
        </div>

        {/* lg and up: the scattered arc, in a stage sized so the whole section
            fits inside the camera pan's 100dvh face. */}
        <div className="relative mt-10 hidden lg:block lg:aspect-[1104/470]">
          {services.items.map((service, index) => {
            const place = SCATTER[index] ?? SCATTER[SCATTER.length - 1];
            return (
              <div
                key={service.title}
                className="absolute"
                style={{
                  left: place.left,
                  top: place.top,
                  width: place.width,
                  height: place.height,
                  zIndex: 10 + index,
                }}
              >
                <Reveal delay={0.06 * index} variant="card" className="h-full">
                  <ServiceCard service={service} index={index} rotate={place.rotate} />
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  rotate = 0,
}: {
  service: { title: string; caption: string };
  index: number;
  rotate?: number;
}) {
  return (
    <PaperCard
      pinned
      tone={index % 3 === 1 ? "crimson" : "amber"}
      rotate={rotate}
      className="flex h-full flex-col justify-between"
    >
      <p className="micro-label">{`0${index + 1}`}</p>
      <div>
        <h3 className="text-balance text-h3 font-semibold leading-tight tracking-tight text-bone">
          {service.title}
        </h3>
        <p className="mt-2 text-small leading-relaxed text-amber/75">{service.caption}</p>
      </div>
    </PaperCard>
  );
}
