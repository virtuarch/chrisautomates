import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { site } from "@/lib/site";
import { getTodayBackdrop, getTodayMobileBackdrop } from "@/lib/backdrops";
import { BackdropProvider } from "@/components/BackdropProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Computed once here (not in app/page.tsx) so the nav — rendered as a
  // sibling of the page content, not a descendant — shares the exact same
  // backdrop.
  const backdrop = getTodayBackdrop();
  const mobileBackdrop = getTodayMobileBackdrop();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-[#f5f5f7]">
        {/* Hidden SVG filter powering the glass refraction effect (see
            .glass-nav / .glass-panel in globals.css). Zero-size and
            aria-hidden — it never renders visibly on its own. */}
        <svg
          aria-hidden="true"
          focusable="false"
          className="pointer-events-none absolute h-0 w-0 overflow-hidden"
        >
          <filter
            id="liquid-glass-distortion"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009 0.012"
              numOctaves="2"
              seed="11"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softNoise"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
        <BackdropProvider
          initialBackdrop={backdrop}
          initialMobileBackdrop={mobileBackdrop}
        >
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
        </BackdropProvider>
      </body>
    </html>
  );
}
