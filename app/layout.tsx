import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";

import { cn } from "@/lib/utils";
import "./globals.css";

/*
 * THE BRAND TYPEFACES, from the Genesis Media brand guidelines.
 *
 * Codec Pro is the text face and Mont is the display face — the wordmark in
 * the guidelines is set in Mont's heavy weight, which is why headings use it
 * rather than a bolder cut of Codec.
 *
 * Self-hosted rather than fetched: the CSP allows no external font host, and
 * next/font/local also removes the layout shift a webfont would otherwise
 * cause.
 *
 * TWO THINGS TO RESOLVE BEFORE LAUNCH.
 *
 * 1. LICENSING. The supplied Codec Pro is the CC BY-NC release — non
 *    commercial — and both Mont files are DEMO cuts under a trial EULA.
 *    Neither is licensed for a commercial agency site. The retail licences
 *    need buying; the files then drop in here unchanged.
 *
 * 2. MISSING WEIGHTS. Codec Pro arrived as Regular and Italic only, with no
 *    bold, and Mont as ExtraLight and Heavy with nothing between. So there is
 *    no semibold anywhere in the system. Headings take Mont Heavy, body takes
 *    Codec Pro Regular, and any `font-medium`/`font-semibold` on body copy is
 *    synthesised by the browser — which is why the type scale leans on SIZE
 *    and colour for hierarchy rather than weight. Codec Pro Bold and Mont
 *    Regular/Book would fix that.
 */
const codecPro = localFont({
  src: [
    { path: "./fonts/CodecPro-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/CodecPro-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-sans",
  display: "swap",
  // Measured against the file so the fallback occupies the same space.
  fallback: ["system-ui", "sans-serif"],
});

const mont = localFont({
  src: [
    { path: "./fonts/Mont-ExtraLightDEMO.otf", weight: "200", style: "normal" },
    { path: "./fonts/Mont-HeavyDEMO.otf", weight: "800", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "Genesis Media",
    template: "%s · Genesis Media",
  },
  description:
    "Genesis Media is an AI-first creative and content agency.",
  metadataBase: process.env.APP_BASE_URL
    ? new URL(process.env.APP_BASE_URL)
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // `suppressHydrationWarning` because the script below stamps `data-theme`
    // on this element before React hydrates. Without it React reports the
    // mismatch it is being asked to tolerate.
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("dark font-sans", codecPro.variable, mont.variable)}
    >
      <head>
        {/*
          NO-FLASH THEME STAMP. This has to run before first paint, which is
          why it is an inline blocking script rather than an effect: an effect
          runs after hydration, and the visitor would see a full dark page
          repaint to light. Nothing else on the site is allowed to be a
          render-blocking script; this one earns it because the alternative is
          visible.

          Absent from storage means "follow the OS", so nothing is stamped and
          the prefers-color-scheme block in globals.css resolves it.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("genesis-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
