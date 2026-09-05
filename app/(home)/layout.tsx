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
      <PageAtmosphere>{children}</PageAtmosphere>

      {/*
        THE DIALOG SITS OUTSIDE THE ATMOSPHERE, and it has to.

        PageAtmosphere is `isolate` — it must be, or its -z-10 field and grain
        would paint behind the page rather than behind its own children. But
        isolation creates a stacking context, and a stacking context is a
        ceiling: the modal's z-[60] was being resolved INSIDE it, against
        siblings, while the wrapper itself has z-index auto. The nav is a fixed
        z-50 sibling of the wrapper, so it won every time — which is why an
        open avatar dialog had the nav pill floating over its own blurred
        backdrop, sharp and still clickable.

        Rendered here the slot is a sibling of the nav rather than a
        descendant of an isolated box, and z-60 finally means what it says.
      */}
      {modal}
      <QuickContact />
      <WhatsappButton />
    </>
  );
}
