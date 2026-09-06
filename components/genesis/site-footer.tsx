import Link from "next/link";

import { Atmosphere } from "@/components/genesis/atmosphere";
import { GenesisMark } from "@/components/genesis/genesis-mark";
import { SocialStars } from "@/components/genesis/social-stars";
import { Reveal } from "@/components/genesis/reveal";
import { footerCta } from "@/lib/home-content";
import { footerNav, siteConfig } from "@/lib/site-config";

/**
 * The site footer — contact sheet, navigation, copyright, ghosted wordmark.
 *
 * IT LIVED INSIDE FooterCta, WHICH IS WHY EIGHT PAGES HAD NONE. FooterCta is
 * the homepage's closing pitch: a headline, a promise and the brand enquiry
 * form. The footer happened to be printed underneath it, so every route that
 * was not the homepage — Careers, I'm a Creator, Portfolio, Team, the Journal,
 * the four division pages — simply ended. Genesis reported it on the two they
 * were looking at; it was true of all eight.
 *
 * Split out, it renders once from the (home) layout and every page in the
 * group closes the same way. The pitch above it stays where it belongs, on
 * the page that makes it.
 */
export function SiteFooter() {
  return (
    <Atmosphere
      tone="brand"
      origin="bottom"
      intensity={0.24}
      className="relative overflow-hidden pt-14"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        {/*
          Contact details + navigation, on a single sheet of liquid glass —
          the spec marks the footer "//liquid glass". Heavier blur and a lit
          top edge, so it reads as one pane the content sits inside rather
          than a row of boxes.
        */}
        <div className="glass glass-strong glass-lit grid gap-12 rounded-panel p-8 sm:grid-cols-2 sm:p-12 lg:grid-cols-4">
          <Reveal>
            <GenesisMark />
            <p className="mt-6 max-w-xs text-small leading-relaxed text-ash">
              {siteConfig.description}
            </p>
            <a
              href={`mailto:${footerCta.email}`}
              className="mt-6 inline-block text-small text-bone underline-offset-4 transition-colors hover:text-brand-ink hover:underline"
            >
              {footerCta.email}
            </a>

            {/* "Social Media Icons (like stars)" — the lockup's star, repeated. */}
            <SocialStars className="mt-6 -ml-3" />
          </Reveal>

          {footerNav.map((group, index) => (
            <Reveal key={group.heading} delay={0.05 * (index + 1)}>
              <p className="micro-label">{group.heading}</p>
              <ul className="mt-6 flex flex-col gap-3">
                {group.items.map((item) => (
                  /*
                    Keyed on the LABEL, not the href. Two entries in a nav
                    group can legitimately point at the same place — "Contact"
                    and "Start a Project" both go to /#contact — and keying on
                    the destination made React see them as the same child.
                  */
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-small text-ash transition-colors hover:text-bone"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 py-8 text-small text-faint sm:flex-row sm:items-center sm:justify-between">
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
