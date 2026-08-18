import type { Metadata } from "next";

import { PaperVortex } from "@/components/genesis/paper-vortex";
import { Reveal } from "@/components/genesis/reveal";
import { SectionLabel } from "@/components/genesis/section-label";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on creators, content and the technology reshaping both.",
};

/**
 * /blog — the hub, built to p06_0.
 *
 * The heading stands at the centre of the ring, where the figure stands in
 * the reference; the papers turn around it. Every sheet is a post, and posts
 * repeat around the ring when there are fewer of them than sheets.
 */
export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="grain relative isolate min-h-dvh overflow-hidden bg-void pt-24">
      {/* Painterly walls — the brushed dark ground of the reference. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgb(24 26 32 / 1) 0%, rgb(9 10 13 / 1) 55%, rgb(6 6 8 / 1) 100%), repeating-linear-gradient(97deg, rgb(120 100 60 / 0.05) 0px, transparent 3px, transparent 26px)",
        }}
      />

      {posts.length > 0 ? (
        <PaperVortex
          posts={posts.map((post) => ({
            slug: post.slug,
            title: post.title,
            category: post.category,
          }))}
          sheets={32}
          className="relative z-[2]"
        >
          <Reveal>
            <SectionLabel dot tone="amber" className="justify-center">
              Journal
            </SectionLabel>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone sm:text-5xl">
              Thinking out{" "}
              <span className="font-serif font-normal italic text-amber">
                loud
              </span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-ash">
              Every sheet is a piece. Move through them.
            </p>
          </Reveal>
        </PaperVortex>
      ) : (
        <div className="mx-auto max-w-3xl px-6 py-32 text-center">
          <SectionLabel dot tone="amber" className="justify-center">
            Journal
          </SectionLabel>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-bone">
            Thinking out{" "}
            <span className="font-serif font-normal italic text-amber">loud</span>
          </h1>
          <p className="mt-5 text-sm text-ash">
            The first pieces are being written. Check back shortly.
          </p>
        </div>
      )}
    </main>
  );
}
