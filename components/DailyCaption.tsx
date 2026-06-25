"use client";

import { useState } from "react";
import { getTodayBackdrop, getTodayMobileBackdrop } from "@/lib/backdrops";
import { useOptionalBackdrop } from "./BackdropProvider";
import PhotoCatalogModal from "./PhotoCatalogModal";

/**
 * A small, photographer's-signature-style caption naming today's backdrop.
 *
 * Desktop and mobile can now show different photos on any given day (see
 * `getTodayMobileBackdrop` in lib/backdrops.ts), so this renders two
 * breakpoint-scoped variants — the same hidden/sm:block pattern
 * DailyBackground already uses for the photos themselves — rather than one
 * caption that could name the wrong place for whichever device is actually
 * looking at it.
 *
 * On the homepage it reads from BackdropProvider, so it stays in sync with
 * the dev-only background switcher. On every other page (which isn't
 * wrapped in a provider) it falls back to the real day-of-year backdrops.
 *
 * The location name is clickable — it opens a read-only catalog of every
 * backdrop photo (see PhotoCatalogModal), seeded to whichever photo was
 * actually clicked. Browsing the catalog never changes the active
 * background; it's purely for discovering the story behind the photos.
 */
export default function DailyCaption({
  className = "",
  inline = false,
}: {
  className?: string;
  inline?: boolean;
}) {
  const ctx = useOptionalBackdrop();
  const backdrop = ctx?.backdrop ?? getTodayBackdrop();
  const mobileBackdrop = ctx?.mobileBackdrop ?? getTodayMobileBackdrop();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [openId, setOpenId] = useState(backdrop.id);

  const openCatalog = (id: string) => {
    setOpenId(id);
    setCatalogOpen(true);
  };

  const locationButton = (location: string, id: string) => (
    <button
      type="button"
      onClick={() => openCatalog(id)}
      aria-haspopup="dialog"
      className="link-underline text-white/65 transition-colors hover:text-white"
    >
      {location}
    </button>
  );

  return (
    <>
      {inline ? (
        <>
          <p
            className={`hidden whitespace-nowrap text-xs text-white/45 sm:block ${className}`}
          >
            Today&rsquo;s backdrop
            <span className="mx-2 text-white/25">·</span>
            {locationButton(backdrop.location, backdrop.id)}
          </p>
          <p
            className={`whitespace-nowrap text-xs text-white/45 sm:hidden ${className}`}
          >
            Today&rsquo;s backdrop
            <span className="mx-2 text-white/25">·</span>
            {locationButton(mobileBackdrop.location, mobileBackdrop.id)}
          </p>
        </>
      ) : (
        <>
          <p
            className={`hidden text-xs leading-relaxed text-white/45 sm:block ${className}`}
          >
            Today&rsquo;s backdrop
            <br />
            {locationButton(backdrop.location, backdrop.id)}
          </p>
          <p
            className={`text-xs leading-relaxed text-white/45 sm:hidden ${className}`}
          >
            Today&rsquo;s backdrop
            <br />
            {locationButton(mobileBackdrop.location, mobileBackdrop.id)}
          </p>
        </>
      )}

      <PhotoCatalogModal
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        initialId={openId}
      />
    </>
  );
}
