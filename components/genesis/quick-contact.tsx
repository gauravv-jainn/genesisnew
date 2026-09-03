"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { GenesisForm } from "./genesis-form";
import { FORMS } from "@/lib/forms";
import { getLenis } from "./smooth-scroll";

/**
 * The quick lead popup — form C.
 *
 * OPENED BY A DATA ATTRIBUTE, not by a prop. Any control anywhere on the site
 * opts in by carrying `data-quick-contact` (optionally with a value naming the
 * CTA it came from), and one delegated listener on the document catches it.
 *
 * That matters because most of the CTAs on this site are rendered on the
 * server, inside server components. Threading an onClick down to them would
 * mean converting each of their sections into a client component — turning a
 * lead capture into a bundle-size decision. A delegated listener costs one
 * handler for the whole page and works from any depth, in any component,
 * including markup that does not exist yet.
 *
 * The CTA's own name rides along as the submission's `source`, so it is
 * possible to tell later which button actually produces business.
 */
export function QuickContact() {
  const [source, setSource] = useState<string | null>(null);
  const open = source !== null;
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setSource(null), []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const trigger = (event.target as Element | null)?.closest?.(
        "[data-quick-contact]",
      );
      if (!(trigger instanceof HTMLElement)) return;

      event.preventDefault();
      openerRef.current = trigger;
      setSource(trigger.dataset.quickContact || "cta");
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!open) return;

    const lenis = getLenis();
    lenis?.stop();
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";

    panelRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])',
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
      // Focus goes back to the button that opened it, not the top of the page.
      openerRef.current?.focus?.();
    };
  }, [open, close]);

  if (!open) return null;

  const spec = FORMS.quick;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={spec.title}
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto overscroll-contain p-4 pt-20 sm:items-center sm:p-8 sm:pt-8"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="fixed inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="scene-dark glass glass-strong relative z-[1] w-full max-w-lg rounded-panel p-6 outline-none sm:p-8"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-[var(--glass-border)] text-bone transition-colors hover:bg-[var(--hover-wash)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <X className="size-4" />
        </button>

        <header className="mb-6 flex flex-col gap-2 pr-10">
          <h2 className="text-h3 font-normal tracking-tight text-bone">
            {spec.title}
          </h2>
          <p className="text-small leading-relaxed text-ash">{spec.blurb}</p>
        </header>

        <GenesisForm kind="quick" source={source} compact />
      </div>
    </div>
  );
}
