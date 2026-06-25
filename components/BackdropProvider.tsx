"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Backdrop, MobileBackdrop } from "@/lib/backdrops";

type BackdropContextValue = {
  backdrop: Backdrop;
  setBackdrop: (backdrop: Backdrop) => void;
  /** What mobile is showing today — may be a different place than
   * `backdrop` on days the mobile-only rotation kicks in. See
   * `getTodayMobileBackdrop` in lib/backdrops.ts. */
  mobileBackdrop: MobileBackdrop;
};

const BackdropContext = createContext<BackdropContextValue | null>(null);

/**
 * Wraps the homepage so the background image and its dev-only switcher
 * share a single source of truth. In production this just holds the
 * day-of-year-selected backdrop computed on the server — nothing here
 * changes the "one fixed photo per session" behavior for real visitors.
 */
export function BackdropProvider({
  initialBackdrop,
  initialMobileBackdrop,
  children,
}: {
  initialBackdrop: Backdrop;
  initialMobileBackdrop: MobileBackdrop;
  children: ReactNode;
}) {
  const [backdrop, setBackdrop] = useState(initialBackdrop);

  return (
    <BackdropContext.Provider
      value={{ backdrop, setBackdrop, mobileBackdrop: initialMobileBackdrop }}
    >
      {children}
    </BackdropContext.Provider>
  );
}

/** Use within a BackdropProvider — throws if there isn't one. */
export function useBackdrop() {
  const ctx = useContext(BackdropContext);
  if (!ctx) {
    throw new Error("useBackdrop must be used within a BackdropProvider");
  }
  return ctx;
}

/** Use on pages that may or may not be wrapped in a BackdropProvider. */
export function useOptionalBackdrop() {
  return useContext(BackdropContext);
}
