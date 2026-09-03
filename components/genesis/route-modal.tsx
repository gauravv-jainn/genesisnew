"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

import { getLenis } from "./smooth-scroll";

/**
 * The dialog an intercepted route renders into.
 *
 * Closing is `router.back()` rather than a state flip, because the modal IS a
 * history entry — it was opened by navigating to /work/<slug>. Going back
 * restores the grid and the URL together, and the browser's own back gesture
 * closes it for free, which is what people already expect from a gallery.
 *
 * THREE THINGS A DIALOG HAS TO DO, and this does all three:
 *
 *   1. Stop the page behind it. `overflow: hidden` alone is not enough here —
 *      Lenis drives scroll from wheel and touch events, not the scrollbar, so
 *      the page kept moving under the dialog. It is suspended explicitly and
 *      resumed on unmount.
 *   2. Take focus, and give it back. Focus moves to the dialog on open and
 *      returns to whatever opened it on close, so a keyboard user is not
 *      dropped at the top of the document.
 *   3. Keep focus inside while open. Tab cycles within the dialog rather than
 *      wandering into the grid behind it, which is unreachable anyway.
 */
export function RouteModal({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();

    // Belt and braces: Lenis is absent on touch and under Reduce Motion,
    // where the page scrolls natively and this is what holds it.
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";

    panelRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        router.back();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), video[controls], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
      lenis?.start();
      opener?.focus?.();
    };
  }, [router]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto overscroll-contain p-4 pt-20 sm:p-8 sm:pt-24"
    >
      {/*
        The backdrop is a button, not a div with a click handler — it is a
        control that does something, so it should be reachable and announced
        like one rather than being invisible to anything that is not a mouse.
      */}
      <button
        type="button"
        aria-label="Close project"
        onClick={() => router.back()}
        className="fixed inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="scene-dark glass glass-strong relative z-[1] w-full max-w-4xl rounded-panel p-5 outline-none sm:p-8"
      >
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Close project"
          className="absolute right-4 top-4 z-[2] grid size-9 place-items-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-fill)] text-bone transition-colors hover:bg-[var(--hover-wash)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <X className="size-4" />
        </button>

        {children}
      </div>
    </div>
  );
}
