import type { Metadata } from "next";

import { ourWork } from "@/lib/page-content";
import { ContentLibrary } from "./content-library";
import { WorkspaceSidebar } from "./workspace-sidebar";

export const metadata: Metadata = {
  title: "Our Work",
  description: ourWork.body,
};

/**
 * /our-work — the content library the spec calls "Genesis' NETFLIX",
 * built to the Genesis mockup on page 7: a rail on the left, the catalogue
 * on the right, framed as a single window floating on the dark ground.
 *
 * PINNED DARK IN BOTH THEMES. The window is a fixed dark chrome — #0c0b10 at
 * 85% over a purple wash — because that is what the mockup shows and what
 * every media library does, Netflix and Spotify included: artwork reads
 * against dark and washes out against white. Without the pin the chrome
 * stayed dark while the type flipped with the theme, so the page heading
 * rendered near-black on near-black. Pinning the surface is the honest fix;
 * flipping the chrome would mean designing a second library that no
 * reference asks for.
 */
export default function OurWorkPage() {
  return (
    <main className="scene-dark relative min-h-dvh overflow-hidden bg-void px-3 py-3 sm:px-6 sm:py-6">
      {/* Ambient wash behind the window, as in the mockup. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 44% at 78% 0%, rgb(150 60 190 / 0.2) 0%, transparent 62%), radial-gradient(52% 40% at 12% 4%, rgb(255 45 63 / 0.14) 0%, transparent 60%), radial-gradient(80% 60% at 50% 100%, rgb(120 40 160 / 0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex min-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-panel border border-white/10 bg-[#0c0b10]/85 backdrop-blur-2xl sm:min-h-[calc(100dvh-3rem)] lg:flex-row">
        <WorkspaceSidebar />

        <div className="min-w-0 flex-1 overflow-y-auto p-6 sm:p-8">
          <ContentLibrary />
        </div>
      </div>
    </main>
  );
}
