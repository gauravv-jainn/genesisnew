import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RouteStub } from "@/components/genesis/route-stub";
import { journal } from "@/lib/home-content";

/**
 * Placeholder post route.
 *
 * The journal teaser on the homepage links to individual posts, so this must
 * resolve or the homepage ships dead links. Phase 4 replaces this with the
 * real MDX-backed template; until then only the known placeholder slugs
 * resolve and anything else 404s.
 */

// Only the placeholder posts exist. Unknown slugs fall through to notFound().
export function generateStaticParams() {
  return journal.posts.map((post) => ({ slug: post.slug }));
}

function findPost(slug: string) {
  return journal.posts.find((post) => post.slug === slug);
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = findPost(slug);
  return { title: post?.title ?? "Journal" };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = findPost(slug);

  if (!post) notFound();

  return (
    <RouteStub
      label={post.category}
      title={post.title}
      description={`${post.readingTime}. The full article is written in Phase 4, when posts move into the repo as MDX files.`}
    />
  );
}
