"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { GlassButton } from "./glass-button";
import { GenesisMark } from "./genesis-mark";
import { navItems } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * Floating glass navigation.
 *
 * Sits detached from the top edge as a pill (img-013, img-015). It starts
 * near-transparent over the hero and condenses into a heavier blur once the
 * page scrolls, so it never competes with the hero headline.
 */
export function GlassNav() {
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setCondensed(value > 40);
  });

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
      {/*
        DRIVEN BY THE TOKENS, not by hardcoded values. This component used to
        animate between rgba(255,255,255,0.03) and 0.07 with blur(12px)/28px of
        its own, which meant the most visible glass surface on the site opted
        out of the one place glass is defined — and sat at 3% where the token
        was 5%. Measured on the hero it lifted its background by +3.4 luminance
        against the +18.6 of Genesis's own artwork.

        It now wears .glass and swaps to .glass-strong once scrolled, so it
        inherits any future change to --glass-fill. Framer cannot interpolate
        between CSS custom properties, so the crossfade is a CSS transition
        rather than an animate prop.
      */}
      <nav
        className={cn(
          "glass glass-lit pointer-events-auto flex w-full max-w-5xl items-center gap-4 rounded-full",
          "border border-white/10 px-4 py-2.5 sm:px-5",
          "transition-[background-color,backdrop-filter] duration-500 ease-out",
          condensed && "glass-strong",
        )}
      >
        <Link
          href="/"
          className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
          aria-label={`${"Genesis Media"} — home`}
        >
          <GenesisMark />
        </Link>

        {/* Desktop links */}
        <ul className="ml-2 hidden flex-1 items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="rounded-full px-3 py-2 text-[13px] text-ash transition-colors duration-200 hover:bg-white/5 hover:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <GlassButton
            href="/#contact"
            variant="crimson"
            size="sm"
            className="hidden sm:inline-flex"
            arrow
          >
            Start a project
          </GlassButton>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-full border border-white/10 text-bone transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson lg:hidden"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass glass-strong pointer-events-auto absolute inset-x-4 top-20 rounded-3xl p-4 lg:hidden"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="micro-label">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid size-8 place-items-center rounded-full border border-white/10 text-ash hover:text-bone"
              >
                <X className="size-4" />
              </button>
            </div>
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm text-ash transition-colors hover:bg-white/5 hover:text-bone"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <GlassButton
              href="/#contact"
              variant="crimson"
              size="md"
              arrow
              className="mt-3 w-full"
            >
              Start a project
            </GlassButton>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
