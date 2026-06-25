"use client";

import Image from "next/image";
import { useBackdrop } from "./BackdropProvider";

/**
 * Renders today's curated travel photograph as a fixed, full-bleed
 * background. Desktop and mobile use dedicated image crops — selected
 * purely via CSS breakpoints, so there is no client-side image swap,
 * no flash of the wrong image, and no slideshow. A dark gradient overlay
 * keeps foreground text readable regardless of the photo underneath.
 *
 * The backdrop itself comes from BackdropProvider, which is seeded with
 * the server-computed day-of-year photo. Desktop and mobile rotate on
 * independent (if overlapping) schedules — see `getTodayMobileBackdrop` in
 * lib/backdrops.ts — so on some days mobile shows a portrait-only photo
 * with no desktop counterpart at all.
 *
 * Both images use `priority`, which forces eager loading regardless of
 * `display: none` — so the `sizes` on each is deliberately breakpoint-
 * conditional ("100vw" only above/below md, "0px" otherwise) rather than a
 * blanket "100vw". Without that, the browser would treat the hidden crop
 * as if it still needed a full-viewport-width image and fetch a larger
 * file than it will ever display.
 */
export default function DailyBackground() {
  const { backdrop, mobileBackdrop } = useBackdrop();

  return (
    <div
      aria-hidden="true"
      // GlassRefraction (nav pill) already renders its own, correctly
      // offset duplicate of this photo, so its live scroll-mirror clone
      // of <main> skips this node — a position:fixed clone trapped inside
      // a filtered ancestor would otherwise render at the wrong size/spot.
      data-glass-mirror-exclude="true"
      className="fixed inset-0 -z-10 overflow-hidden bg-black"
    >
      <div className="absolute inset-0 hidden md:block">
        <Image
          key={backdrop.desktopImage}
          src={backdrop.desktopImage}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 100vw, 0px"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 md:hidden">
        <Image
          key={mobileBackdrop.mobileImage}
          src={mobileBackdrop.mobileImage}
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 100vw, 0px"
          className="object-cover"
        />
      </div>

      {/* Overlay: keeps hero copy and nav legible over any photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/75" />
      <div className="absolute inset-0 bg-black/15" />
    </div>
  );
}
