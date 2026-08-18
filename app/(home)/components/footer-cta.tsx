import Link from "next/link";

import { Atmosphere } from "@/components/genesis/atmosphere";
import { GenesisMark } from "@/components/genesis/genesis-mark";
import { GlassButton } from "@/components/genesis/glass-button";
import { Reveal } from "@/components/genesis/reveal";
import { footerCta } from "@/lib/home-content";
import { footerNav, siteConfig } from "@/lib/site-config";

/**
 * Section 13 — Footer CTA.
 *
 * Closes on the giant ghosted wordmark from img-044 / img-045: outlined type
 * bleeding off the bottom edge, with the real footer sitting above it.
 */
export function FooterCta() {
  return (
    <Atmosphere
      tone="crimson"
      origin="bottom"
      intensity={0.24}
      className="relative overflow-hidden pt-24 sm:pt-32"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-bone sm:text-5xl lg:text-6xl">
              {footerCta.heading}{" "}
              <span className="font-serif font-normal italic text-amber">
                {footerCta.headingAccent}
              </span>
            </h2>

            <div className="flex flex-col items-start gap-4">
              <p className="max-w-sm text-sm leading-relaxed text-ash">
                {footerCta.body}
              </p>
              <GlassButton
                href={footerCta.primaryCta.href}
                variant="crimson"
                size="lg"
                arrow
                magnetic
              >
                {footerCta.primaryCta.label}
              </GlassButton>
            </div>
          </div>
        </Reveal>

        {/* Contact + navigation */}
        <div
          id="contact"
          className="mt-20 grid gap-12 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Reveal>
            <GenesisMark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ash">
              {siteConfig.description}
            </p>
            <a
              href={`mailto:${footerCta.email}`}
              className="mt-5 inline-block text-sm text-bone underline-offset-4 transition-colors hover:text-crimson hover:underline"
            >
              {footerCta.email}
            </a>
          </Reveal>

          {footerNav.map((group, index) => (
            <Reveal key={group.heading} delay={0.05 * (index + 1)}>
              <p className="micro-label">{group.heading}</p>
              <ul className="mt-5 flex flex-col gap-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ash transition-colors hover:text-bone"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 py-8 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          {/* TODO(legal): real policy pages required before launch. */}
          <p>Privacy · Terms</p>
        </div>
      </div>

      {/* The oversized outlined wordmark, bleeding off the bottom edge. */}
      <div
        aria-hidden
        className="pointer-events-none select-none overflow-hidden"
      >
        <p
          className="translate-y-[18%] whitespace-nowrap text-center text-[22vw] font-semibold leading-none tracking-tight"
          style={{
            color: "transparent",
            WebkitTextStroke: "1px rgb(255 255 255 / 0.08)",
          }}
        >
          GENESIS
        </p>
      </div>
    </Atmosphere>
  );
}
