import { cn } from "@/lib/utils";

/**
 * The editorial micro-label used throughout the references — tiny uppercase
 * type at wide tracking, optionally preceded by a pulsing accent dot
 * (img-012 "● STRATEGIC · TARGETED · IMPACTFUL", img-058 corner annotations).
 */
export function SectionLabel({
  children,
  dot = false,
  tone = "brand",
  className,
}: {
  children: React.ReactNode;
  /** Show the leading accent dot. */
  dot?: boolean;
  tone?: "brand";
  className?: string;
}) {
  const dotColor =
    tone === "brand"
      ? "bg-brand"
      : tone === "brand"
        ? "bg-brand"
        : "bg-brand";

  return (
    <p className={cn("micro-label flex items-center gap-3", className)}>
      {dot && (
        <span
          aria-hidden
          className={cn("size-1.5 shrink-0 rounded-full", dotColor)}
        />
      )}
      {children}
    </p>
  );
}
