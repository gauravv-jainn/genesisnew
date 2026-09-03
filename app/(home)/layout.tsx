import { GlassNav } from "@/components/genesis/glass-nav";
import { SmoothScroll } from "@/components/genesis/smooth-scroll";
import { WhatsappButton } from "@/components/genesis/whatsapp-button";

/**
 * Marketing shell. The floating nav is fixed-position and lives here rather
 * than in the root layout so it never appears over /insider, which has its
 * own authenticated chrome.
 */
export default function HomeLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  /** Parallel slot holding an intercepted project route, or nothing. */
  modal: React.ReactNode;
}) {
  return (
    <>
      <SmoothScroll />
      <GlassNav />
      {children}
      {modal}
      <WhatsappButton />
    </>
  );
}
