import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import HeaderNav from "@/components/HeaderNav";
import ThemeBackground from "@/components/ThemeBackground";
import PageFlash from "@/components/PageFlash";
import ScrollGauge from "@/components/ScrollGauge";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Check This Place Out",
  description: copy.brand.oneLiner,
  metadataBase: new URL("https://checkthisplaceout.com"),
  openGraph: {
    title: "Check This Place Out",
    description: copy.brand.microline,
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="bg-terminal-black font-body text-hologram antialiased"
      >
        <ThemeBackground />
        <PageFlash />
        <div aria-hidden="true" className="scanlines z-50" />
        <ScrollGauge />
        <div className="relative z-10 flex min-h-screen flex-col">
          <HeaderNav />
          <main className="flex-1 px-4 pb-16 pt-4 sm:px-6 lg:px-10">
            {children}
          </main>
          <footer className="border-t border-[color:var(--border-color)] px-4 py-6 text-sm text-[color:var(--text-muted)] sm:px-6 lg:px-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>{copy.brand.tagline}</span>
              <div className="flex gap-4">
                <Link className="hover:text-[color:var(--color-cyan)]" href="/about">
                  {copy.nav.about}
                </Link>
                <Link className="hover:text-[color:var(--color-cyan)]" href="/privacy">
                  {copy.nav.privacy}
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
