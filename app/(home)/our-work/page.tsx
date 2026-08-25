import type { Metadata } from "next";

import { ourWork } from "@/lib/page-content";
import { ContentLibrary } from "./content-library";

export const metadata: Metadata = {
  title: "Our Work",
  description: ourWork.body,
};

/**
 * /our-work — the content library the spec calls "Genesis' NETFLIX".
 *
 * THIS USED TO BE A DIFFERENT WEBSITE. It lived in its own route group with
 * its own layout, which deliberately withheld the site's navigation and
 * replaced it with a left rail carrying a SECOND copy of the nav — nine more
 * links, different labels, its own icons. On top of that the whole thing sat
 * inside a pinned-dark window that ignored the theme. One site, two
 * navigations, two visual languages, and this page on the wrong side of both.
 *
 * The guidelines open on exactly this: "Every creator, designer, editor,
 * salesperson, AI prompt and presentation should feel like it came from the
 * same Genesis engine." A bespoke shell for one route is the opposite.
 *
 * So it is now an ordinary page in the marketing shell: the same floating
 * nav, the same grounds, the same type, following the theme like everything
 * else. The catalogue itself — the grid, the filters, the search, the tiles
 * that play on hover — is unchanged, because that part was never the problem.
 */
export default function OurWorkPage() {
  return (
    <main className="relative min-h-dvh bg-void pb-32 pt-32 sm:pt-40">
      <div className="mx-auto w-full max-w-6xl px-6">
        <ContentLibrary />
      </div>
    </main>
  );
}
