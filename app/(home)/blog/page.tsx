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
 * /blog — the hub.
 *
 * Everything on this page is a real element: the room, the light, the figure
 * and every single sheet are drawn in CSS and SVG. There is no background
 * image. Each tilted sheet is an actual post link.
 *
 * PINNED DARK IN BOTH THEMES, because the page IS a dark room — the sheets
 * are lit objects and light is only light when there is dark to spend it
 * against. In light mode the header alone flipped while the room below it
 * did not, which put a razor seam straight through the standfirst: half the
 * sentence on cream, half on black. The heading also fell to grey-on-cream
 * and the brand accent to near-invisible, because both are colours chosen to
 * glow rather than to sit on paper.
 */
export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="scene-dark relative min-h-dvh overflow-hidden bg-void pt-24">
      <div className="relative z-[3] mx-auto max-w-3xl px-6 pb-2 text-center">
        <Reveal>
          <SectionLabel dot tone="brand" className="justify-center">
            Journal
          </SectionLabel>
          <h1 className="mt-6 text-balance text-h2 font-normal leading-[1.05] tracking-tight text-bone sm:text-h1">
            Thinking out{" "}
            <span className="font-serif font-normal italic text-brand-ink">loud</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-small leading-relaxed text-ash">
            Every sheet is a piece. Move your cursor through them.
          </p>
        </Reveal>
      </div>

      {posts.length > 0 ? (
        <PaperVortex
          posts={posts.map((post) => ({
            slug: post.slug,
            title: post.title,
            category: post.category,
          }))}
        />
      ) : (
        <p className="pb-24 text-center text-small text-faint">
          The first pieces are being written. Check back shortly.
        </p>
      )}
    </main>
  );
}
