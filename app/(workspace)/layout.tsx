import { SmoothScroll } from "@/components/genesis/smooth-scroll";

/**
 * Shell for the app-like surfaces.
 *
 * Deliberately does NOT render the floating marketing nav: these pages carry
 * their own sidebar, exactly as in the Genesis mockup, and two navigations on
 * one screen is one too many. The route group changes no URLs.
 */
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SmoothScroll />
      {children}
    </>
  );
}
