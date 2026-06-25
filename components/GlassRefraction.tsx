"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useOptionalBackdrop } from "@/components/BackdropProvider";
import { generateLensDisplacementMap } from "@/lib/glass-lens";

/**
 * Real optical refraction for the center nav pill, not a faked one.
 *
 * `backdrop-filter` with an SVG distortion only actually bends pixels in
 * Chromium — Safari and Firefox parse it but silently ignore the SVG part
 * and fall back to a flat blur. So instead of filtering the live page
 * behind the nav, this renders its own private copy of the background
 * photo, clipped to the pill's exact box, and runs *that* copy through the
 * SVG filter via the ordinary `filter` property — which every browser
 * actually honors. The real nav links sit on top, untouched and clickable;
 * this layer is purely decorative bent light underneath them.
 *
 * The bend itself comes from a small canvas-rendered displacement map
 * (see lib/glass-lens.ts): a flat, undistorted center with the refraction
 * concentrated in a curved rim band, the way a bevelled piece of glass
 * actually behaves.
 *
 * Two things get bent: the fixed daily photo (a hand-positioned duplicate
 * `<img>`, since the photo never moves) and whatever page content is
 * currently scrolled underneath the nav — a raw `cloneNode()` of the
 * live <main>, not a second React render, repositioned every scroll tick
 * via a single CSS transform. Cloning the already-rendered DOM means no
 * component logic, hooks, or network requests run twice; it's purely
 * inert decoration, stripped of ids and marked inert/aria-hidden so it
 * can't collide with the real page or be reached by assistive tech.
 *
 * This is the site-wide button treatment, not a one-off for the nav pill —
 * every glass surface (badge, nav pill, icon buttons, white and dark CTAs,
 * the email button) mounts one of these as its first child. Two props
 * make it reusable across very different shapes and surfaces:
 *
 * - `radius` overrides the lens's corner radius for non-pill shapes (the
 *   compact brand badge uses a small fixed radius, not height/2). Leave
 *   unset for anything `rounded-full` — a circle or pill's true radius is
 *   always height/2 regardless of width, which is the default.
 * - `blur` should roughly match the host surface's own backdrop-filter
 *   blur value, so the bent duplicate's softness agrees with the (real,
 *   Chromium-only) blurred backdrop showing through at the edges instead
 *   of looking crisp and out of place next to it.
 *
 * The bent duplicate is intentionally translucent (`opacity`, default
 * 0.5) rather than fully opaque: the host surface's own tinted background
 * — already carrying the dark-vs-white glass identity — should read
 * first, with the bend showing through as a secondary "looking through
 * glass" accent on top of it, not replacing it outright.
 */
export default function GlassRefraction({
  className = "",
  radius,
  blur = 24,
  opacity = 0.5,
}: {
  className?: string;
  radius?: number;
  blur?: number;
  opacity?: number;
}) {
  const backdropCtx = useOptionalBackdrop();
  const backdrop = backdropCtx?.backdrop ?? null;
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const [generation, setGeneration] = useState(0);
  const [lens, setLens] = useState<{ url: string; rect: DOMRect } | null>(null);
  // Lazily read the OS preference during render (guarded for SSR, where
  // `window` doesn't exist) rather than via setState inside the effect
  // below — that effect only needs to subscribe to future changes.
  const [reducedTransparency, setReducedTransparency] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-transparency: reduce)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-transparency: reduce)");
    const onChange = () => setReducedTransparency(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedTransparency) return;

    let revoke: (() => void) | null = null;
    let cancelled = false;

    const rebuild = () => {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;

      generateLensDisplacementMap({
        width: rect.width,
        height: rect.height,
        radius: radius ?? rect.height / 2,
        pixelRatio: Math.min(2, window.devicePixelRatio || 1),
      })
        .then(({ url, revoke: revokeMap }) => {
          if (cancelled) {
            revokeMap();
            return;
          }
          revoke?.();
          revoke = revokeMap;
          setLens({ url, rect });
          // Safari keeps a filter's rasterized output keyed by element id,
          // so a fresh id forces it to actually redraw on resize instead
          // of reusing a stale, wrongly-sized result.
          setGeneration((g) => g + 1);
        })
        .catch(() => {
          // Canvas/blob generation failed for some reason — fail safe by
          // simply not showing a refraction layer, never a broken page.
          setLens(null);
        });
    };

    rebuild();

    let frame = 0;
    const onResize = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(rebuild);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      revoke?.();
    };
  }, [reducedTransparency, radius]);

  // Rebuild the live content mirror whenever the lens is (re)generated —
  // i.e. on mount and on resize — or the route changes, since each page
  // has different content underneath the nav. A raw cloneNode() of the
  // already-rendered <main>, not a second React render: no component
  // logic, hooks, or image requests run twice, it's just inert markup.
  useEffect(() => {
    if (reducedTransparency || !lens) return;

    const source = document.querySelector("main");
    const target = mirrorRef.current;
    if (!source || !target) return;

    const clone = source.cloneNode(true) as HTMLElement;
    clone.removeAttribute("id");
    clone
      .querySelectorAll("[data-glass-mirror-exclude], script")
      .forEach((node) => node.remove());
    clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("inert", "");

    target.replaceChildren(clone);
    return () => {
      target.replaceChildren();
    };
  }, [reducedTransparency, lens, pathname]);

  // Keep the mirror's position in lockstep with real scroll via a single
  // GPU-composited transform, updated on every tick — much cheaper than
  // re-cloning or re-rendering, and the mirror's markup itself never
  // needs to change as the page is scrolled, only its on-screen offset.
  useEffect(() => {
    if (reducedTransparency || !lens) return;

    let frame = 0;
    const sync = () => {
      const target = mirrorRef.current;
      if (target) {
        target.style.transform = `translateY(${-window.scrollY}px)`;
      }
    };

    sync();
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(sync);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reducedTransparency, lens]);

  if (reducedTransparency || !backdrop || !lens) return null;

  const filterId = `${baseId}-lens-${generation}`;
  const { rect } = lens;
  const scale = Math.min(22, Math.max(10, rect.height * 0.32));

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] ${className}`}
      style={{ filter: `url(#${filterId}) blur(${blur}px)`, opacity }}
    >
      {/* A plain <img>, not next/image, on purpose: this is a decorative,
          aria-hidden duplicate that needs exact manual offset math against
          the viewport (see `top`/`left` below) — next/image's own wrapper
          and sizing logic would fight that. It's never the LCP element;
          the real backdrop photo elsewhere still goes through next/image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backdrop.desktopImage}
        alt=""
        style={{
          position: "absolute",
          top: -rect.top,
          left: -rect.left,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
        }}
      />

      {/* Live mirror of whatever's actually scrolling underneath the nav
          right now (Hero copy, cards, footer — varies per page). Anchored
          at the same screen offset as the photo above; `mirrorRef` itself
          gets its transform updated on every scroll tick in the effect
          above, so the clone slides past in lockstep with the real page. */}
      <div
        style={{
          position: "absolute",
          top: -rect.top,
          left: -rect.left,
          width: "100vw",
        }}
      >
        <div ref={mirrorRef} />
      </div>

      <svg
        aria-hidden="true"
        focusable="false"
        className="absolute h-0 w-0 overflow-hidden"
      >
        <filter
          id={filterId}
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          <feImage
            href={lens.url}
            x="0"
            y="0"
            width="100%"
            height="100%"
            result="lensMap"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="lensMap"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
            result="bent"
          />
          <feColorMatrix
            in="lensMap"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 1 0 0"
            result="rim"
          />
          <feComponentTransfer in="rim" result="rimSoft">
            <feFuncA type="linear" slope="0.5" intercept="0" />
          </feComponentTransfer>
          <feBlend in="bent" in2="rimSoft" mode="screen" />
        </filter>
      </svg>
    </div>
  );
}
