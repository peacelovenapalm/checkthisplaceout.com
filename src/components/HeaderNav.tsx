"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const getPageLabel = (pathname: string) => {
  if (pathname.startsWith("/c/")) return "Category";
  if (pathname.startsWith("/p/")) return "Place";
  if (pathname.startsWith("/about")) return "About";
  if (pathname.startsWith("/privacy")) return "Privacy";
  return "Home";
};

export default function HeaderNav() {
  const pathname = usePathname();
  const pageLabel = getPageLabel(pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border-color)] bg-[rgba(5,5,5,0.92)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="hud-meta text-[color:var(--color-yellow)]">
            {"// LV-OPS"}
          </span>
          <span className="display-title text-base tracking-[0.18em] text-[color:var(--text-hologram)] sm:text-lg">
            CHECKTHISPLACEOUT
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[color:var(--accent-electric-cyan)]">
            <span
              aria-hidden="true"
              className="h-2 w-2 animate-pulse bg-[color:var(--accent-electric-cyan)] shadow-[0_0_8px_rgba(0,240,255,0.7)]"
            />
            <span className="font-mono">SYS.ONLINE</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs">
            <span className="hud-meta text-[color:var(--text-dim)]">
              {`// ${pageLabel}`}
            </span>
            <span className="cursor-block" aria-hidden="true" />
          </div>
          <nav className="hidden gap-5 text-xs uppercase tracking-[0.3em] text-[color:var(--text-dim)] sm:flex">
            <Link className="hover:text-[color:var(--color-cyan)]" href="/about">
              About
            </Link>
            <Link className="hover:text-[color:var(--color-cyan)]" href="/privacy">
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
