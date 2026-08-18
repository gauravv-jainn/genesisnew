import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { GlassButton } from "@/components/genesis/glass-button";
import { PaperCard } from "@/components/genesis/paper-card";
import { RevealGroup, RevealItem, Reveal } from "@/components/genesis/reveal";
import { journal } from "@/lib/home-content";
import { SectionShell } from "./section-shell";

/**
 * Section 11 — Journal teaser.
 *
 * Paper cards again, closing the motif loop that Services and Case Studies
 * opened. Posts become real MDX files in Phase 4; these link ahead to routes
 * that do not have content yet.
 */
export function BlogTeaser() {
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
      <RevealGroup className="grid gap-6 lg:grid-cols-3">
        {journal.posts.map((post, index) => (
          <RevealItem key={post.slug} className="h-full">
            <PaperCard
              tone={index === 1 ? "crimson" : "amber"}
              rotate={index % 2 === 0 ? -1.5 : 1.5}
              className="h-full"
            >
              <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
                <div className="flex items-center justify-between gap-3">
                  <span className="micro-label">{post.category}</span>
                  <ArrowUpRight
                    className="size-4 text-faint transition-colors duration-300 group-hover:text-amber"
                    aria-hidden
                  />
                </div>

                <h3 className="mt-5 flex-1 text-balance text-lg font-semibold leading-snug tracking-tight text-bone">
                  {post.title}
                </h3>

                <p className="mt-6 text-xs text-faint">{post.readingTime}</p>
              </Link>
            </PaperCard>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1} className="mt-10">
        <GlassButton href="/blog" variant="glass" arrow>
          Read the journal
        </GlassButton>
      </Reveal>
    </SectionShell>
  );
}
