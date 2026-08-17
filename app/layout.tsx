import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { cn } from "@/lib/utils";
import "./globals.css";

// PLACEHOLDER TYPEFACE — Geist stands in until the real Genesis brand fonts
// are supplied. Phase 1 replaces this with the bold sans + serif-italic pair.
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
    <html lang="en" className={cn("dark font-sans", geist.variable)}>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
