"use client";

import {
  BookOpen,
  FileText,
  Grid2x2,
  Home,
  Info,
  Layers,
  Send,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { GenesisMark, GenesisStar } from "@/components/genesis/genesis-mark";
import { GlassButton } from "@/components/genesis/glass-button";
import { workspaceNav } from "@/lib/page-content";
import { cn } from "@/lib/utils";

/**
 * The library's left rail, built to the Genesis mockup on page 7: the lockup
 * at the top, the nav with the current page marked by a red dot, a "Start a
 * Project" action, and the promo card at the foot.
 */

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  grid: Grid2x2,
  layers: Layers,
  file: FileText,
  sparkles: Sparkles,
  users: Users,
  info: Info,
  book: BookOpen,
  send: Send,
};

export function WorkspaceSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 border-white/8 p-6 lg:h-full lg:w-56 lg:border-r">
      <Link href="/" className="rounded-field focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson">
        <GenesisMark />
      </Link>

      <nav className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 lg:flex-col lg:overflow-visible">
        {workspaceNav.map((item) => {
          const Icon = ICONS[item.icon] ?? Home;
          const active = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex shrink-0 items-center gap-3 rounded-card px-3 py-3 text-small transition-colors duration-200",
                active
                  ? "bg-white/[0.07] text-bone"
                  : "text-ash hover:bg-white/[0.04] hover:text-bone",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <span className="whitespace-nowrap">{item.label}</span>
              {active && (
                <span
                  aria-hidden
                  className="ml-auto hidden size-1.5 rounded-full bg-crimson lg:block"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden flex-col gap-4 lg:flex">
        <GlassButton href="/#contact" variant="glass" size="sm" arrow className="w-full">
          Start a Project
        </GlassButton>

        {/* The promo card at the foot of the rail. */}
        <div className="glass relative overflow-hidden rounded-card p-4">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,rgb(255_45_63/0.22),transparent_60%)]"
          />
          <GenesisStar className="absolute right-3 top-3 size-4" />
          <p className="relative text-small text-ash">Let&rsquo;s create</p>
          <p className="relative mt-0.5 text-small font-medium leading-tight text-bone">
            something impactful
          </p>
        </div>
      </div>
    </aside>
  );
}
