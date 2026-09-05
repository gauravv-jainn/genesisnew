import Image from "next/image";
import Link from "next/link";

import { GlassButton } from "@/components/genesis/glass-button";
import { isPending } from "@/lib/home-content";
import { hasStory, type WorkItem } from "@/lib/work";

/**
 * One project, rendered identically whether it arrived as a modal over the
 * grid or as its own page at /work/<slug>.
 *
 * ONE COMPONENT FOR BOTH, deliberately. The brief wants a project to open as
 * an immersive popup while browsing AND to have a permanent shareable URL —
 * which is two presentations of one thing, and the fastest way to make them
 * disagree is to write them twice.
 *
 * IT OMITS WHAT IS NOT WRITTEN. Objective, ask, approach, execution and
 * results are all still to come from Genesis, and every block below
 * disappears when its field is pending rather than printing a placeholder.
 * These are real clients: a heading reading "Results" over invented numbers
 * beside Mahindra's name is a claim about Mahindra, not a layout detail. What
 * the visitor sees today is the work, the client and the vertical; what they
 * will see once the copy lands is the full case study, with no code change.
 */
export function WorkDetail({ item }: { item: WorkItem }) {
  const story = hasStory(item);

  return (
    <article className="flex flex-col gap-8">
      {/* The piece itself, first and large. */}
      <figure className="relative overflow-hidden rounded-panel border border-[var(--glass-border)] bg-ink">
        {/*
          Same rule as the avatar hero, and for the same reason: aspect-[16/10]
          in an 848px panel is 531px of media before the reader reaches the
          client's name, which put this window a screen and a quarter tall on a
          laptop. An aspect ratio cannot know how tall the screen is; a clamp
          can. Portrait reels are object-cover'd inside it rather than being
          allowed to set the height themselves.
        */}
        <div className="relative h-[clamp(14rem,42vh,30rem)] w-full">
          {item.clip ? (
            <video
              src={item.clip}
              poster={item.poster ?? item.art}
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 size-full object-cover"
            />
          ) : item.art ? (
            <Image
              src={item.art}
              alt={`${item.client} — ${item.title}`}
              fill
              // Sits in a max-w-4xl column, full width below that.
              sizes="(min-width: 896px) 896px, 100vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(150deg,rgb(255_255_255/0.06),transparent_60%)] p-8">
              <span className="text-balance text-center text-h2 font-normal tracking-tight text-bone/80">
                {item.client}
              </span>
            </div>
          )}
        </div>
      </figure>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="micro-label text-brand-ink">{item.vertical}</span>
          <span aria-hidden className="text-faint">
            ·
          </span>
          <span className="micro-label !text-faint">{item.format}</span>
        </div>
        <h1 className="text-balance text-h2 font-normal leading-[1.05] tracking-tight text-bone sm:text-h1">
          {item.client}
        </h1>
        <p className="text-lead leading-relaxed text-ash">{item.title}</p>
      </header>

      {story && (
        <div className="flex flex-col gap-6 border-t border-[var(--glass-border)] pt-8">
          <Block heading="Objective" body={item.objective} />
          <Block heading="The ask" body={item.ask} />
          <Block heading="Our approach" body={item.approach} />

          {item.whatWeDid && item.whatWeDid.length > 0 && (
            <section className="flex flex-col gap-2">
              <h2 className="micro-label">What we did</h2>
              <ul className="flex flex-wrap gap-2">
                {item.whatWeDid.map((entry) => (
                  <li
                    key={entry}
                    className="glass-chip rounded-full px-3 py-1.5 text-small text-bone"
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Block heading="Execution" body={item.execution} />

          {item.results && item.results.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="micro-label">Results</h2>
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card bg-[var(--glass-border)] sm:grid-cols-3">
                {item.results.map((result) => (
                  <div
                    key={result.label}
                    className="flex flex-col gap-1 bg-ink p-4"
                  >
                    <dt className="micro-label !text-faint">{result.label}</dt>
                    <dd className="text-h3 font-normal tracking-tight text-bone">
                      {result.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </div>
      )}

      <footer className="flex flex-wrap items-center gap-3 border-t border-[var(--glass-border)] pt-8">
        {/*
          The case-study link appears only when there is a case study. A "View
          Full Case Study" button that goes nowhere is the single most
          annoying thing a portfolio can do to someone evaluating an agency.
        */}
        {item.caseStudyHref && (
          <GlassButton href={item.caseStudyHref} variant="brand" arrow>
            View full case study
          </GlassButton>
        )}
        <GlassButton href="/#contact" variant="glass" arrow>
          Start a project
        </GlassButton>
        <Link
          href="/our-work"
          className="rounded-full px-3 py-2 text-small text-ash underline-offset-4 transition-colors hover:text-bone hover:underline"
        >
          All work
        </Link>
      </footer>
    </article>
  );
}

function Block({ heading, body }: { heading: string; body?: string }) {
  if (isPending(body)) return null;
  return (
    <section className="flex flex-col gap-2">
      <h2 className="micro-label">{heading}</h2>
      <p className="max-w-2xl text-body leading-relaxed text-ash">{body}</p>
    </section>
  );
}
