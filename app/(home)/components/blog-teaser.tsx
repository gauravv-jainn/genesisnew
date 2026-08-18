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

  if (posts.length === 0) return null;

  return (
    <SectionShell
      id="journal"
      label={journal.label}
      heading={journal.heading}
      headingAccent={journal.headingAccent}
      body={journal.body}
      tone="amber"
      origin="top-right"
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
            badge: post.draft ? (
              <span className="rounded-full border border-amber/40 px-2 py-0.5 text-[10px] text-amber">
                Draft
              </span>
            ) : undefined,
          }))}
        />
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        <GlassButton href="/blog" variant="glass" arrow>
          Read the journal
        </GlassButton>
      </Reveal>
    </SectionShell>
  );
}
