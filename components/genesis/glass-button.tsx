"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { useMagnetic } from "@/lib/use-magnetic";
import { cn } from "@/lib/utils";

/**
 * The Genesis pill button.
 *
 * Three surface treatments, all drawn from the references:
 *   crimson  — filled brand gradient with a red bloom  (img-012 "Contact Us")
 *   luminous — warm amber core, dark label             (img-014 "Schedule a call")
 *   glass    — One UI blur over whatever is behind it  (img-013, img-044)
 *   ghost    — hairline outline only, for tertiary actions
 */

type GlassButtonProps = {
  children: ReactNode;
  variant?: "crimson" | "luminous" | "glass" | "ghost";
  size?: "sm" | "md" | "lg";
  /** Renders an anchor instead of a button. */
  href?: string;
  /** Trailing arrow, as on nearly every CTA in the references. */
  arrow?: boolean;
  /** Opt-in pointer-follow. Reserve for hero CTAs; it is loud in quantity. */
  magnetic?: boolean;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

const SIZES = {
  sm: "h-9 px-4 text-small gap-2",
  md: "h-11 px-6 text-small gap-2",
  lg: "h-14 px-8 text-body gap-3",
} as const;

const VARIANTS = {
  crimson: [
    "text-white border border-white/15",
    "bg-[linear-gradient(180deg,#ff4a58_0%,#ff2d3f_45%,#c9102b_100%)]",
    "shadow-[0_8px_30px_-6px_rgb(255_45_63/0.55),0_1px_0_0_rgb(255_255_255/0.25)_inset]",
    "hover:shadow-[0_12px_44px_-6px_rgb(255_45_63/0.75),0_1px_0_0_rgb(255_255_255/0.3)_inset]",
  ],
  luminous: [
    "text-[#2b1a0d] border border-amber-light/40",
    "bg-[radial-gradient(120%_140%_at_50%_50%,#fff3dd_0%,#ffc98a_45%,#ff9f4d_100%)]",
    "shadow-[0_8px_34px_-4px_rgb(255_138_61/0.6),0_1px_0_0_rgb(255_255_255/0.5)_inset]",
    "hover:shadow-[0_14px_50px_-4px_rgb(255_138_61/0.8),0_1px_0_0_rgb(255_255_255/0.6)_inset]",
  ],
  glass: ["glass glass-lit text-bone", "hover:bg-white/10"],
  ghost: [
    "text-ash border border-white/12 bg-transparent",
    "hover:text-bone hover:border-white/25 hover:bg-white/5",
  ],
} as const;

export function GlassButton({
  children,
  variant = "glass",
  size = "md",
  href,
  arrow = false,
  magnetic = false,
  icon,
  className,
  onClick,
  type = "button",
  disabled,
}: GlassButtonProps) {
  const { x, y, magneticProps } = useMagnetic(0.18);

  const classes = cn(
    "relative inline-flex select-none items-center justify-center rounded-full font-medium",
    "transition-[background-color,border-color,box-shadow,color] duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
    "disabled:pointer-events-none disabled:opacity-50",
    SIZES[size],
    VARIANTS[variant],
    className,
  );

  const content = (
    <>
      {icon}
      <span>{children}</span>
      {arrow && <ArrowUpRight className="size-4 shrink-0" aria-hidden />}
    </>
  );

  const motionProps = {
    style: magnetic ? { x, y } : undefined,
    ...(magnetic ? magneticProps : {}),
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 400, damping: 25 },
  };

  if (href) {
    return (
      <motion.a href={href} className={classes} {...motionProps}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}

/**
 * Segmented pill — one lit option inside a dark trough (img-014).
 * Used where two adjacent CTAs share a container.
 */
export function GlassSegment({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass inline-flex items-center rounded-full p-1",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "relative h-10 rounded-full px-6 text-small font-medium transition-colors duration-300",
              active ? "text-[#2b1a0d]" : "text-ash hover:text-bone",
            )}
          >
            {active && (
              <motion.span
                layoutId="glass-segment-active"
                className="absolute inset-0 rounded-full bg-[radial-gradient(120%_140%_at_50%_50%,#fff3dd_0%,#ffc98a_45%,#ff9f4d_100%)] shadow-[0_6px_28px_-4px_rgb(255_138_61/0.7)]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
