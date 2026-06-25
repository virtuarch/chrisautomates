"use client";

import { useEffect, useRef, useState } from "react";
import { backdrops, catalog, type CatalogEntry } from "@/lib/backdrops";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  const d = direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7";
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

/**
 * Browse-only lightbox over the backdrop catalog.
 *
 * This never touches BackdropProvider and never calls the daily-rotation
 * logic in lib/backdrops.ts — it's a read-only viewer, seeded to open on
 * whichever photo was actually clicked. Closing it (or navigating inside
 * it) has zero effect on what's actually showing as the page background.
 *
 * Which photos are browsable depends on the real viewport, not just which
 * `<img>` happens to be visible: desktop only ever steps through genuinely
 * landscape-native photos (`backdrops`, every one of which has a real
 * `desktopImage`), while mobile steps through the full portrait `catalog`
 * (paired photos plus the portrait-only extras). A portrait photo never
 * gets shown stretched or fallback-cropped on desktop — if it has no real
 * desktop image, desktop simply never lands on it.
 */
export default function PhotoCatalogModal({
  open,
  onClose,
  initialId,
}: {
  open: boolean;
  onClose: () => void;
  initialId: string;
}) {
  // Lazily read the real viewport during render (guarded for SSR), then
  // subscribe to changes — same pattern GlassRefraction uses for its own
  // matchMedia check. 640px matches Tailwind's default `sm` breakpoint,
  // which is what every other breakpoint-scoped image swap in this app
  // (DailyBackground, DailyCaption) is already built around.
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(min-width: 640px)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    const onChange = () => setIsDesktop(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const entries: CatalogEntry[] = isDesktop ? backdrops : catalog;

  const startIndex = Math.max(
    0,
    entries.findIndex((b) => b.id === initialId)
  );
  const [index, setIndex] = useState(startIndex);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Re-seed to today's photo each time the modal transitions to open.
  // Adjusting state during render (React's documented pattern for this)
  // instead of inside an effect — no extra render-then-effect round trip,
  // and it satisfies the "don't setState synchronously in an effect" rule.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setIndex(startIndex);
  }

  // The entries list itself can change size out from under `index` if the
  // viewport crosses 640px while the modal happens to be open (a desktop
  // window resize, mostly — a phone rotation never crosses this
  // breakpoint). Same render-time-adjustment pattern as `wasOpen` above,
  // not an effect — this just guarantees `entries[index]` always stays in
  // bounds; landing on a neighboring photo in that rare case is a minor
  // cosmetic hiccup, not a bug worth tracking identity across it.
  const [lastLength, setLastLength] = useState(entries.length);
  if (entries.length !== lastLength) {
    setLastLength(entries.length);
    if (index > entries.length - 1) setIndex(entries.length - 1);
  }

  const goTo = (next: number) => {
    setIndex(((next % entries.length) + entries.length) % entries.length);
  };

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(index + 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  if (!open) return null;

  const current = catalog[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo catalog — ${current.location}`}
      data-glass-mirror-exclude="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="glass-sheet relative w-full max-w-3xl overflow-hidden rounded-3xl p-3 sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close photo catalog"
          className="glass-nav absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-white/80 transition-colors hover:text-white"
        >
          <CloseIcon />
        </button>

        {/* Photo */}
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous photo"
            className="glass-nav absolute left-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full text-white/80 transition-colors hover:text-white sm:left-2"
          >
            <ChevronIcon direction="left" />
          </button>

          <div className="flex max-h-[58vh] w-full items-center justify-center overflow-hidden rounded-2xl bg-black sm:max-h-[64vh]">
            {/* Mobile-only entries have no desktop crop — fall back to the
                portrait image rather than leaving this pane empty. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={current.id}
              src={current.desktopImage ?? current.mobileImage}
              alt={current.location}
              className="hidden max-h-[58vh] w-auto object-contain sm:block sm:max-h-[64vh]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`${current.id}-mobile`}
              src={current.mobileImage}
              alt={current.location}
              className="max-h-[58vh] w-auto object-contain sm:hidden"
            />
          </div>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next photo"
            className="glass-nav absolute right-1 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full text-white/80 transition-colors hover:text-white sm:right-2"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>

        {/* Metadata */}
        <div className="mt-4 flex flex-col items-center gap-1 text-center">
          <p className="text-base font-medium text-white/90">
            {current.location}
          </p>
          <p className="text-sm text-white/55">{current.date}</p>
          <p className="mt-1 text-xs text-white/35">
            {index + 1} / {catalog.length}
          </p>
        </div>
      </div>
    </div>
  );
}
