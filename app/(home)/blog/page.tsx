import type { Metadata } from "next";

import { FloatingPapers } from "@/components/genesis/floating-papers";
import { Reveal } from "@/components/genesis/reveal";
import { formatPostDate, getAllPosts } from "@/lib/blog";
import { SectionShell } from "../components/section-shell";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on creators, content and the technology reshaping both.",
};

/**
 * /blog — the hub.
 *
 * Spec: "Blog hub - Add all blogs" and "clicking on those papers - each paper
 * has a different blog - papers moving like magnetics".
 */
export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="pt-24">
      <SectionShell
        label="Journal"
        heading="Thinking out"
        headingAccent="loud"
        body="Notes on creators, content and the technology reshaping both. Every sheet is a piece — drag your cursor across them."
        tone="amber"
        origin="top"
        intensity={0.22}
      >
        {posts.length > 0 ? (
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
        ) : (
          <p className="text-sm text-faint">No posts published yet.</p>
        )}
      </SectionShell>
    </main>
  );
}
