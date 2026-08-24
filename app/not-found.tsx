import Link from "next/link";

import { Atmosphere } from "@/components/genesis/atmosphere";
import { GlassButton } from "@/components/genesis/glass-button";
import { SectionLabel } from "@/components/genesis/section-label";
import { GhostType } from "@/components/genesis/spotlight";
import { navItems } from "@/lib/site-config";

/**
 * 404. Branded rather than the framework default, because a dead link is
 * still a moment someone spends with the site — and because a bare Next.js
 * error page on a design-led agency site reads as neglect.
 */
export default function NotFound() {
  return (
    <Atmosphere tone="crimson" origin="top" intensity={0.2} className="min-h-dvh">
      <GhostType outlined>404</GhostType>

      <div className="relative z-[2] mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
        <SectionLabel dot>Page not found</SectionLabel>

        <h1 className="mt-6 text-balance text-h2 font-semibold leading-[1.1] tracking-tight text-bone sm:text-h1">
          That page doesn&rsquo;t{" "}
          <span className="font-serif font-normal italic text-amber-ink">exist</span>
        </h1>

        <p className="mt-6 max-w-md text-small leading-relaxed text-ash">
          The link may be old, or the page may have moved. Everything else is
          still where you left it.
        </p>

        <div className="mt-8">
          <GlassButton href="/" variant="crimson" size="lg" arrow>
            Back to the homepage
          </GlassButton>
        </div>

        <nav aria-label="Site sections" className="mt-16">
          <p className="micro-label">Or try</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="glass rounded-full px-4 py-2 text-small text-ash transition-colors hover:text-bone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Atmosphere>
  );
}
