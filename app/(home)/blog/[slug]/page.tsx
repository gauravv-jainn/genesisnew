import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { Atmosphere } from "@/components/genesis/atmosphere";
import { GlassButton } from "@/components/genesis/glass-button";
import { SectionLabel } from "@/components/genesis/section-label";
import { YouTubeEmbed } from "@/components/genesis/reel";
import { formatPostDate, getAllPosts, getPost } from "@/lib/blog";

/**
 * /blog/[slug] — the post template.
 *
 * Content is MDX from `content/blog`, rendered on the server. Only slugs that
 * exist as files resolve; everything else 404s.
 */

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.description,
    // Drafts must never be indexed, even if the URL leaks.
    robots: post.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);

  if (!post) notFound();

  return (
    <Atmosphere tone="amber" origin="top" intensity={0.2} className="min-h-dvh pt-32">
      <article className="mx-auto w-full max-w-3xl px-6 pb-32">
        <header className="border-b border-white/10 pb-10">
          <SectionLabel dot tone="amber">
            {post.category}
          </SectionLabel>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-bone sm:text-5xl">
            {post.title}
          </h1>

          <p className="mt-5 text-pretty text-lg leading-relaxed text-ash">
            {post.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-faint">
            <span>{formatPostDate(post.date)}</span>
            <span aria-hidden>·</span>
            <span>{post.readingTime}</span>
            {post.draft && (
              <span className="rounded-full border border-amber/40 px-2 py-0.5 text-amber">
                Draft — not published
              </span>
            )}
          </div>
        </header>

        {/*
          The film the piece documents, when there is one. Above the prose
          because the spec pairs article and video as one unit, and the frame
          only mounts on click so reading costs nothing.
        */}
        {post.youtube && (
          <YouTubeEmbed
            id={post.youtube}
            title={post.title}
            className="mt-12"
          />
        )}

        {/*
          Prose styles are scoped here rather than added to the global
          stylesheet: this is the only place long-form MDX is rendered, and
          global heading/paragraph rules would fight the marketing sections.
        */}
        <div
          className={[
            "mt-12 text-[15px] leading-[1.75] text-ash",
            "[&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-bone",
            "[&_h3]:mt-10 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-bone",
            "[&_p]:mt-5",
            "[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-2",
            "[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-5",
            "[&_strong]:font-semibold [&_strong]:text-bone",
            "[&_a]:text-amber [&_a]:underline [&_a]:underline-offset-4",
            "[&_blockquote]:mt-8 [&_blockquote]:border-l-2 [&_blockquote]:border-amber/50",
            "[&_blockquote]:pl-5 [&_blockquote]:text-sm [&_blockquote]:text-faint",
            "[&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px]",
          ].join(" ")}
        >
          <MDXRemote source={post.content} />
        </div>

        <footer className="mt-16 flex flex-wrap items-center gap-4 border-t border-white/10 pt-10">
          <GlassButton href="/blog" variant="glass" arrow>
            More from the journal
          </GlassButton>
          <Link
            href="/#contact"
            className="text-sm text-ash underline underline-offset-4 hover:text-bone"
          >
            Work with us
          </Link>
        </footer>
      </article>
    </Atmosphere>
  );
}
