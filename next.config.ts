import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // The floating dev-mode indicator (bottom-left "N" badge) is a real
  // fixed, viewport-anchored overlay — on a small phone screen it can sit
  // directly on top of whatever's at the bottom of the page, intercepting
  // taps meant for real UI underneath it (e.g. the footer's daily-backdrop
  // caption link). It never ships to production, but it's actively in the
  // way while testing against the local dev server from a phone, so it's
  // turned off entirely rather than just repositioned.
  devIndicators: false,
};

export default nextConfig;
