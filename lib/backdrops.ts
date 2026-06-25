/**
 * Daily background system.
 *
 * One curated travel photograph is shown per day. The image is selected
 * deterministically using day-of-year modulo the number of images, so the
 * same photograph is shown to every visitor for the full 24-hour window,
 * with no database and no client-side randomness.
 *
 * To add a new backdrop: drop a desktop (landscape) and mobile (portrait)
 * image into /public/backdrops/desktop and /public/backdrops/mobile, then
 * add an entry below.
 */

export type Backdrop = {
  id: string;
  location: string;
  date: string;
  desktopImage: string;
  mobileImage: string;
};

/**
 * A portrait-only photo with no desktop counterpart. These shuffle into the
 * mobile daily rotation alongside the paired `backdrops` (see
 * `getTodayMobileBackdrop`) purely for variety — desktop never shows them.
 */
export type MobileOnlyBackdrop = {
  id: string;
  location: string;
  date: string;
  mobileImage: string;
};

/** Whatever mobile is showing today — either a paired `Backdrop` or one of
 * the `mobileOnlyBackdrops`, normalized to a common shape. `paired` tells
 * you which, in case a caller needs to look up the matching desktop image. */
export type MobileBackdrop = {
  id: string;
  location: string;
  date: string;
  mobileImage: string;
  paired: boolean;
};

/** A single browsable entry in the photo catalog — covers both paired and
 * mobile-only photos. `desktopImage` is absent for mobile-only entries. */
export type CatalogEntry = {
  id: string;
  location: string;
  date: string;
  desktopImage?: string;
  mobileImage: string;
};

export const backdrops: Backdrop[] = [
  {
    id: "muscat-2022",
    location: "Muscat, Oman",
    date: "October 27, 2022",
    desktopImage: "/backdrops/desktop/muscat-2022.jpg",
    mobileImage: "/backdrops/mobile/muscat-2022.jpg",
  },
  {
    id: "singapore-2024",
    location: "Singapore",
    date: "August 26, 2024",
    desktopImage: "/backdrops/desktop/singapore-2024.jpg",
    mobileImage: "/backdrops/mobile/singapore-2024.jpg",
  },
  {
    id: "cape-town-2022",
    location: "Cape Town, South Africa",
    date: "July 20, 2022",
    desktopImage: "/backdrops/desktop/cape-town-2022.jpg",
    mobileImage: "/backdrops/mobile/cape-town-2022.jpg",
  },
  {
    id: "como-2023",
    location: "Lake Como, Italy",
    date: "July 26, 2023",
    desktopImage: "/backdrops/desktop/como-2023.jpg",
    mobileImage: "/backdrops/mobile/como-2023.jpg",
  },
  {
    id: "paris-2025",
    location: "Paris, France",
    date: "February 21, 2025",
    desktopImage: "/backdrops/desktop/paris-2025.jpg",
    mobileImage: "/backdrops/mobile/paris-2025.jpg",
  },
  {
    id: "lisse-2025",
    location: "Lisse, Netherlands",
    date: "April 25, 2025",
    desktopImage: "/backdrops/desktop/lisse-2025.jpg",
    mobileImage: "/backdrops/mobile/lisse-2025.jpg",
  },
  {
    id: "riyadh-2025",
    location: "Riyadh, Saudi Arabia",
    date: "November 11, 2025",
    desktopImage: "/backdrops/desktop/riyadh-2025.jpg",
    mobileImage: "/backdrops/mobile/riyadh-2025.jpg",
  },
];

/**
 * Portrait photos with no landscape counterpart — shown only on mobile.
 * They never appear on desktop and never break the paired-photo guarantee
 * below; they just add variety on the days they're picked.
 */
export const mobileOnlyBackdrops: MobileOnlyBackdrop[] = [
  {
    id: "marbella-2025",
    location: "Puerto Banús, Spain",
    date: "June 24, 2025",
    mobileImage: "/backdrops/mobile/marbella-2025.jpg",
  },
  {
    id: "como-blooms-2023",
    location: "Lake Como, Italy",
    date: "July 26, 2023",
    mobileImage: "/backdrops/mobile/como-blooms-2023.jpg",
  },
  {
    id: "riyadh-evening-2023",
    location: "Riyadh, Saudi Arabia",
    date: "December 24, 2023",
    mobileImage: "/backdrops/mobile/riyadh-evening-2023.jpg",
  },
  // The following six were originally paired `backdrops` entries, but their
  // "desktop" image turned out to be an illegitimate force-crop — a
  // horizontal slice cut from this exact same portrait photo (confirmed by
  // matching unique details: identical cloud shapes, identical lens-flare
  // position, identical foreground elements). A photo's native orientation
  // dictates its only valid device slot, so each one moves here intact with
  // its real portrait image, and no longer appears on desktop at all.
  {
    id: "doha-2023",
    location: "Doha, Qatar",
    date: "May 12, 2023",
    mobileImage: "/backdrops/mobile/doha-2023.jpg",
  },
  {
    id: "pilatus-2023",
    location: "Mount Pilatus, Switzerland",
    date: "July 24, 2023",
    mobileImage: "/backdrops/mobile/pilatus-2023.jpg",
  },
  {
    id: "lucerne-2023",
    location: "Lake Lucerne, Switzerland",
    date: "July 24, 2023",
    mobileImage: "/backdrops/mobile/lucerne-2023.jpg",
  },
  {
    id: "urnersee-2023",
    location: "Urnersee, Switzerland",
    date: "July 25, 2023",
    mobileImage: "/backdrops/mobile/urnersee-2023.jpg",
  },
  {
    id: "zurich-2023",
    location: "Lake Zurich, Switzerland",
    date: "July 27, 2023",
    mobileImage: "/backdrops/mobile/zurich-2023.jpg",
  },
  {
    id: "jeddah-2026",
    location: "Jeddah, Saudi Arabia",
    date: "May 11, 2026",
    mobileImage: "/backdrops/mobile/jeddah-2026.jpg",
  },
];

/** Every photo in the catalog — paired and mobile-only — for the browsable
 * lightbox. Order matches `backdrops` first, then `mobileOnlyBackdrops`. */
export const catalog: CatalogEntry[] = [...backdrops, ...mobileOnlyBackdrops];

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff =
    date.getTime() -
    start.getTime() -
    (date.getTimezoneOffset() - start.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / 86_400_000);
}

/** Deterministically pick today's backdrop. Pass a date for testing. */
export function getTodayBackdrop(date: Date = new Date()): Backdrop {
  const dayOfYear = getDayOfYear(date);
  const index = dayOfYear % backdrops.length;
  return backdrops[index];
}

/**
 * Deterministically pick what mobile shows today. Cycles through a combined
 * rotation of `backdrops.length + mobileOnlyBackdrops.length` days. On most
 * days (a `backdrops.length`-sized share of the cycle) this resolves to
 * *today's actual desktop pick's own mobile image* — computed by calling
 * `getTodayBackdrop` directly rather than re-deriving an index, so mobile is
 * guaranteed to depict the exact same place as desktop on those days, even
 * though the two arrays are different lengths and their independent moduli
 * would otherwise drift out of sync. On the remaining days, mobile shows one
 * of the portrait-only extras instead — desktop is unaffected either way.
 */
export function getTodayMobileBackdrop(date: Date = new Date()): MobileBackdrop {
  const dayOfYear = getDayOfYear(date);
  const combinedLength = backdrops.length + mobileOnlyBackdrops.length;
  const slot = dayOfYear % combinedLength;

  if (slot < backdrops.length) {
    const today = getTodayBackdrop(date);
    return {
      id: today.id,
      location: today.location,
      date: today.date,
      mobileImage: today.mobileImage,
      paired: true,
    };
  }

  const extra = mobileOnlyBackdrops[slot - backdrops.length];
  return { ...extra, paired: false };
}
