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
    // The site is dark-only by design, so `dark` is pinned rather than
    // toggled. Phase 1 replaces the shadcn defaults with Genesis tokens.
    <html
      lang="en"
      className={cn(
        "dark font-sans",
        geist.variable,
        instrumentSerif.variable,
      )}
    >
      <body className="bg-background text-foreground antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
