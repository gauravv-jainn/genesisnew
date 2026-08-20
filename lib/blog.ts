import "server-only";

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

/**
 * MDX-backed blog.
 *
 * Posts are files in `content/blog`, not database rows — the brief calls for
 * this explicitly, and it keeps writing and shipping in the same place. Files
 * are read at build time; nothing here runs per-request.
 */

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  /** ISO date, used for ordering. */
  date: z.string().min(1),
  readingTime: z.string().min(1),
  /** Drafts are hidden in production but visible while developing. */
  draft: z.boolean().optional().default(false),
  /**
   * The film this article documents — spec: "[Add blog articles linked to the
   * video uploaded on YouTube]". Just the id, e.g. dQw4w9WgXcQ.
   */
  youtube: z.string().optional(),
});

export type PostMeta = z.infer<typeof frontmatterSchema> & { slug: string };
export type Post = PostMeta & { content: string };

function readPostFile(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    // A malformed post should fail loudly at build rather than render blank.
    throw new Error(
      `Invalid frontmatter in content/blog/${slug}.mdx: ` +
        parsed.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join(", "),
    );
  }

  return { ...parsed.data, slug, content };
}

/** Drafts are included in development so they can be previewed. */
function includeDrafts() {
  return process.env.NODE_ENV !== "production";
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => readPostFile(file.replace(/\.mdx$/, "")))
    .filter((post): post is Post => post !== null)
    .filter((post) => includeDrafts() || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
  const post = readPostFile(slug);
  if (!post) return null;
  if (!includeDrafts() && post.draft) return null;
  return post;
}

/** Formats an ISO date for display, fixed to en-GB so SSR and client agree. */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
