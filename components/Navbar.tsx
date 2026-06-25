"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/lib/site";
import GlassRefraction from "@/components/GlassRefraction";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M5 5l14 14M19 5L5 19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand badge — glass pill so the wordmark stays readable over
            any daily background photo, sits outside the nav pill, far left */}
        <Link
          href="/"
          className="glass-badge relative overflow-hidden"
          onClick={() => setOpen(false)}
        >
          <GlassRefraction radius={10} blur={24} />
          <span className="relative z-10 inline-flex items-center">
            <span className="text-[12px] font-semibold tracking-[0.16em] text-white">
              CHRIS
            </span>
            <span className="ml-1 text-[12px] font-medium tracking-[0.16em] text-white/85">
              AUTOMATES
            </span>
          </span>
        </Link>

        {/* Center glass pill — links only, compact, perfectly centered */}
        <nav className="glass-nav absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 rounded-full px-6 py-2.5 md:flex">
          <GlassRefraction className="z-0" blur={38} />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline relative z-10 text-sm text-white/75 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Far right — a close control on every page except the homepage.
            GitHub now lives as a button on the About page instead, so the
            homepage's far right intentionally stays empty, keeping the
            homepage chrome light. */}
        <div className="hidden items-center gap-3 md:flex">
          {!isHome && (
            <Link
              href="/"
              aria-label="Close and return home"
              className="glass-nav relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-white/80 transition-colors hover:text-white"
            >
              <GlassRefraction blur={38} />
              <span className="relative z-10 flex items-center justify-center">
                <CloseIcon />
              </span>
            </Link>
          )}
        </div>

        {/* Mobile control — hamburger on the homepage; a close control everywhere else */}
        {isHome ? (
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="glass-nav relative flex h-9 w-9 touch-manipulation items-center justify-center overflow-hidden rounded-full md:hidden"
          >
            <GlassRefraction blur={38} />
            <span className="relative z-10 block h-3.5 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-5 bg-white transition-transform ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-px w-5 bg-white transition-transform ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        ) : (
          <Link
            href="/"
            aria-label="Close and return home"
            className="glass-nav relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-white/80 transition-colors hover:text-white md:hidden"
          >
            <GlassRefraction blur={38} />
            <span className="relative z-10 flex items-center justify-center">
              <CloseIcon />
            </span>
          </Link>
        )}
      </div>

      {/* Mobile menu panel — homepage only. `touch-manipulation` on every
          tap target removes the ~300ms tap-delay / double-tap-to-zoom
          gesture window some mobile browsers impose by default, which can
          make a translucent glass UI like this one feel like taps aren't
          registering. `relative z-10` on the panel is a defensive measure
          so its links always paint above anything else sharing this
          stacking context, even if something else on the page changes. */}
      {isHome && open && (
        <div className="glass-sheet absolute left-4 right-4 top-[calc(100%+0.5rem)] z-10 flex flex-col gap-1 rounded-2xl p-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="touch-manipulation rounded-xl px-3 py-2.5 text-sm text-white/85 transition-colors hover:bg-white/10 active:bg-white/15"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
