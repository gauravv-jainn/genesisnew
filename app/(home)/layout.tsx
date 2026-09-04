import { GlassNav } from "@/components/genesis/glass-nav";
import { PageAtmosphere } from "@/components/genesis/page-atmosphere";
import { SmoothScroll } from "@/components/genesis/smooth-scroll";
import { QuickContact } from "@/components/genesis/quick-contact";
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
      {/*
        The page's light lives here, above every route, because a wash that
        belongs to a section gets clipped at that section's edge and draws a
        line across the page. See page-atmosphere.tsx.
      */}
      <PageAtmosphere>
        {children}
        {modal}
      </PageAtmosphere>
      <QuickContact />
      <WhatsappButton />
    </>
  );
}
