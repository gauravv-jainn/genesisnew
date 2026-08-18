import type { Metadata } from "next";

import { JournalScene } from "@/components/genesis/journal-scene";
import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on creators, content and the technology reshaping both.",
};

/**
 * /blog — the hub.
 *
 * The scene is the reference plate with the interactive sheets composited
 * over it; see components/genesis/journal-scene.tsx for why, and for the
 * rights note on the plate itself.
 */
export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="relative min-h-dvh overflow-hidden bg-void pt-24">
      <div className="relative z-[2] mx-auto max-w-3xl px-6 pb-6 text-center">
        <Reveal>
          <SectionLabel dot tone="amber" className="justify-center">
            Journal
          </SectionLabel>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone sm:text-5xl">
            Thinking out{" "}
            <span className="font-serif font-normal italic text-amber">loud</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ash">
            Every sheet is a piece. Move your cursor through them.
          </p>
        </Reveal>
      </div>

      {posts.length > 0 ? (
        <JournalScene
          posts={posts.map((post) => ({
            slug: post.slug,
            title: post.title,
            category: post.category,
          }))}
          className="pb-16"
        />
      ) : (
        <p className="pb-24 text-center text-sm text-faint">
          The first pieces are being written. Check back shortly.
        </p>
      )}
    </main>
  );
}
