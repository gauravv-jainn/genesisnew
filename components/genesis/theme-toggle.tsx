"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

export type Theme = "light" | "dark";

const STORAGE_KEY = "genesis-theme";
/** Fired on the document when this tab changes the theme. */
const CHANGE_EVENT = "genesis-theme-change";

/**
 * Subscribes to every source that can change the resolved theme: this tab's
 * own toggle, the OS preference, and another tab writing to storage.
 */
function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  mq.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);
  document.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
    document.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/**
 * The RESOLVED theme, not the stored one. On a system-default visit nothing is
 * stored but the page is already light or dark, and the control has to agree
 * with what the visitor is looking at.
 */
function getSnapshot(): Theme {
  const stamped = document.documentElement.getAttribute("data-theme");
  if (stamped === "light" || stamped === "dark") return stamped;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

/** The server cannot know the OS preference; dark is the site's default. */
function getServerSnapshot(): Theme {
  return "dark";
}

/**
 * Light/dark switch.
 *
 * THREE STATES, TWO POSITIONS. Until someone chooses, the site follows the OS:
 * `data-theme` is not stamped and the `prefers-color-scheme` block in
 * globals.css resolves it. The first interaction stamps an explicit choice,
 * which then beats the OS in both directions and persists.
 *
 * Read through `useSyncExternalStore` rather than `useState` + an effect. The
 * theme lives outside React — in an attribute, in localStorage, and in a media
 * query — and this is the hook for exactly that. It also removes the
 * one-frame flicker a state-in-effect version has, because the store is read
 * during render rather than corrected after mount.
 *
 * Rendered as role="switch" so assistive tech announces the on/off state; the
 * label says what the control WILL DO, which is what a screen-reader user
 * needs at the moment they reach it.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLight = theme === "light";

  const toggle = () => {
    const next: Theme = isLight ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing can refuse storage. The choice still applies to this
      // page and simply will not survive a reload — the right degradation.
    }
    document.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      onClick={toggle}
      className={cn(
        "group relative inline-flex h-9 w-16 shrink-0 items-center rounded-full",
        // Theme-aware, because this control sits ON the glass pill and the
        // pill is near-white in the light theme: a white track with a white
        // border measured 1.00:1 against it, so the switch had no track and
        // no edge — just a floating knob.
        "border border-[var(--glass-border)] bg-[var(--hover-wash)] transition-colors duration-300",
        "hover:border-[var(--ink-faint)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute grid size-7 place-items-center rounded-full",
          "bg-bone text-void shadow-raised",
          "transition-transform duration-300 ease-out",
          isLight ? "translate-x-8" : "translate-x-1",
        )}
      >
        {isLight ? (
          <Sun className="size-4" strokeWidth={2.2} />
        ) : (
          <Moon className="size-4" strokeWidth={2.2} />
        )}
      </span>
    </button>
  );
}
