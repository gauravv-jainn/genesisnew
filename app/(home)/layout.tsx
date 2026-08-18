import { GlassNav } from "@/components/genesis/glass-nav";

/**
 * Marketing shell. The floating nav is fixed-position and lives here rather
 * than in the root layout so it never appears over /insider, which has its
 * own authenticated chrome.
 */
export default function HomeLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <GlassNav />
      {children}
    </>
  );
}
