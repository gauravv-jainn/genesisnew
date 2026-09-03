import { GlassNav } from "@/components/genesis/glass-nav";
import { SmoothScroll } from "@/components/genesis/smooth-scroll";
import { WhatsappButton } from "@/components/genesis/whatsapp-button";

/**
 * Marketing shell. The floating nav is fixed-position and lives here rather
 * than in the root layout so it never appears over /insider, which has its
 * own authenticated chrome.
 */
export default function HomeLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SmoothScroll />
      <GlassNav />
      {children}
      <WhatsappButton />
    </>
  );
}
