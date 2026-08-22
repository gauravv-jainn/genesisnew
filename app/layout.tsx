import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { cn } from "@/lib/utils";
import "./globals.css";

// PLACEHOLDER TYPEFACES — stand-ins until the real Genesis brand fonts land.
// Geist covers the bold-sans headline role; Instrument Serif italic covers the
// single-accent-word role seen in the references (img-010 "thinkers",
// img-047 "how we see the world", img-058 "opac").
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
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
      className={cn("dark font-sans", geist.variable, instrumentSerif.variable)}
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
