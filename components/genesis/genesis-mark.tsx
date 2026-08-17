import { cn } from "@/lib/utils";

/**
 * PLACEHOLDER LOGO.
 *
 * Reconstructed from the wordmark in docs/reference/img-012 and img-013:
 * "GENESIS" in wide caps with "MEDIA" letterspaced beneath, and a four-point
 * crimson star to the upper right. Replace wholesale when the real logo files
 * arrive — this is deliberately a single component so the swap is one file.
 */
export function GenesisMark({
  className,
  compact = false,
}: {
  className?: string;
  /** Star only — for tight spaces such as the mobile bar. */
  compact?: boolean;
}) {
  if (compact) {
    return <GenesisStar className={cn("size-6", className)} />;
  }

  return (
    <span className={cn("inline-flex items-start gap-1.5", className)}>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-[0.14em] text-bone">
          GENESIS
        </span>
        <span className="mt-1 text-[8px] font-medium tracking-[0.52em] text-ash">
          MEDIA
        </span>
      </span>
      <GenesisStar className="mt-0.5 size-3.5" />
    </span>
  );
}

/** The four-point sparkle from the Genesis lockup. */
export function GenesisStar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("text-crimson", className)}
    >
      <path
        d="M12 0c.6 6.3 5.1 10.8 12 12-6.9 1.2-11.4 5.7-12 12-.6-6.3-5.1-10.8-12-12C6.9 10.8 11.4 6.3 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
