import { FloatingPapers } from "@/components/genesis/floating-papers";
import { GlassButton } from "@/components/genesis/glass-button";
import { Reveal } from "@/components/genesis/reveal";
import { formatPostDate, getAllPosts } from "@/lib/blog";
import { journal } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 11 — Journal teaser.
 *
 * Reads the same MDX files as /blog rather than a duplicate list, so the
 * homepage can never drift from the journal. Spec: "add on homepage".
 */
export function BlogTeaser() {
  const posts = getAllPosts().slice(0, 3);

  // The section always renders. Returning null when every post is still a
  // draft silently dropped the homepage from thirteen sections to twelve in
  // production, which is not a decision a content state should be making.
  return (
    <SectionShell
      id="journal"
      label={journal.label}
      heading={journal.heading}
      headingAccent={journal.headingAccent}
      body={journal.body}
      align="split"
      tone="amber"
      origin="top-right"
      intensity={0.16}
    >
      {posts.length === 0 ? (
        <Reveal>
          <div className="glass glass-lit rounded-panel p-8">
            <p className="text-small text-ash">
              The first pieces are being written. Check back shortly.
            </p>
          </div>
        </Reveal>
      ) : (
      <Reveal variant="scene">
        <FloatingPapers
          papers={posts.map((post) => ({
            href: `/blog/${post.slug}`,
            eyebrow: post.category,
            title: post.title,
            description: post.description,
            footnote: `${formatPostDate(post.date)} · ${post.readingTime}`,
            badge: post.draft ? (
              <span className="rounded-full border border-amber/40 px-2 py-0.5 text-micro text-amber">
                Draft
              </span>
            ) : undefined,
          }))}
        />
      </Reveal>
      )}

      <Reveal delay={0.1} className="mt-12">
        <GlassButton href="/blog" variant="glass" arrow>
          Read the journal
        </GlassButton>
      </Reveal>
    </SectionShell>
  );
}
