import type { Metadata } from "next";

import { FloatingPapers } from "@/components/genesis/floating-papers";
import { GlassButton } from "@/components/genesis/glass-button";
import { PaperCard } from "@/components/genesis/paper-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { CornerNote, GhostType, Spotlight } from "@/components/genesis/spotlight";
import { formatPostDate, getAllPosts } from "@/lib/blog";
import { creativeProcess } from "@/lib/home-content";
import { contentCreationPage } from "@/lib/page-content";
import { SectionShell } from "../components/section-shell";

export const metadata: Metadata = {
  title: "Content Creation",
  description: contentCreationPage.body,
};

/**
 * /content-creation — the page the spec asks for on page 28:
 * "Content Creation - Create a New Page / Add blogs section / Add creative
 * process 2 lines or sections / [Add blog articles linked to the video
 * uploaded on YouTube]".
 *
 * Order follows that note: what we do, how it gets made, then the writing.
 */
export default function ContentCreationPage() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <main>
      <section className="grain relative isolate overflow-hidden bg-void pt-36 pb-24 sm:pt-44">
        <Spotlight x={44} spread={17} tone="warm" intensity={0.95} reach={96} />
        <GhostType>CONTENT</GhostType>

        <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <Reveal className="max-w-xl">
              <SectionLabel dot tone="amber">
                {contentCreationPage.label}
              </SectionLabel>
              <h1 className="mt-6 text-balance text-h2 font-semibold leading-[1.05] tracking-tight text-bone sm:text-h1 lg:text-h1">
                {contentCreationPage.heading}{" "}
                <span className="font-serif font-normal italic text-amber">
                  {contentCreationPage.headingAccent}
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <CornerNote index="Content">{contentCreationPage.body}</CornerNote>
            </Reveal>
          </div>

          <RevealGroup className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {contentCreationPage.capabilities.map((capability, index) => (
              <RevealItem key={capability.title} className="h-full">
                <PaperCard
                  pinned
                  tone={index % 3 === 1 ? "crimson" : "amber"}
                  rotate={index % 2 === 0 ? -2.4 : 2}
                  className="h-full"
                >
                  <p className="micro-label mb-3">{`0${index + 1}`}</p>
                  <h2 className="text-h3 font-semibold tracking-tight text-bone">
                    {capability.title}
                  </h2>
                  <p className="mt-3 text-small leading-relaxed text-ash">
                    {capability.body}
                  </p>
                </PaperCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* "Add creative process 2 lines or sections" */}
      <SectionShell
        label={creativeProcess.label}
        heading={creativeProcess.heading}
        headingAccent={creativeProcess.headingAccent}
        body={creativeProcess.body}
        tone="crimson"
        origin="top-right"
        intensity={0.18}
      >
        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {creativeProcess.steps.map((step, index) => (
            <RevealItem key={step.title} className="h-full">
              <div className="glass glass-lit flex h-full flex-col rounded-panel p-6">
                <p className="micro-label">{`0${index + 1}`}</p>
                <h3 className="mt-4 text-h3 font-semibold tracking-tight text-bone">
                  {step.title}
                </h3>
                <p className="mt-3 text-small leading-relaxed text-ash">{step.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </SectionShell>

      {/* "Add blogs section" */}
      {posts.length > 0 && (
        <SectionShell
          label="Writing"
          heading="What we've been"
          headingAccent="working out"
          body={contentCreationPage.videoNote}
          tone="amber"
          origin="top-left"
          intensity={0.16}
        >
          <Reveal>
            <FloatingPapers
              papers={posts.map((post) => ({
                href: `/blog/${post.slug}`,
                eyebrow: post.category,
                title: post.title,
                description: post.description,
                footnote: `${formatPostDate(post.date)} · ${post.readingTime}`,
              }))}
            />
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <GlassButton href="/blog" variant="glass" arrow>
              Read the journal
            </GlassButton>
          </Reveal>
        </SectionShell>
      )}

      <SectionShell
        id="contact"
        label="Start something"
        heading="Tell us what"
        headingAccent="you're making"
        body="Bring the brief, or bring the problem. We'll come back with an approach."
        tone="crimson"
        origin="bottom"
        intensity={0.2}
        align="center"
      >
        <Reveal className="flex justify-center">
          <GlassButton href="/#contact" variant="crimson" size="lg" arrow magnetic>
            Start a project
          </GlassButton>
        </Reveal>
      </SectionShell>
    </main>
  );
}
