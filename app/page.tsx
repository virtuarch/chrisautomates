import DailyBackground from "@/components/DailyBackground";
import Hero from "@/components/Hero";
import WhatIDo from "@/components/WhatIDo";
import FeaturedWork from "@/components/FeaturedWork";
import Footer from "@/components/Footer";

// Revalidate periodically so the daily backdrop rotates without a redeploy.
export const revalidate = 1800;

export default function Home() {
  // The day's backdrop is provided higher up, by BackdropProvider in
  // app/layout.tsx — that way the nav (a sibling of this page, not a
  // descendant) can read the same value for its own refraction layer.
  return (
    <main className="relative flex flex-1 flex-col">
      <DailyBackground />

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-8 pt-24 sm:px-10 sm:pt-28 lg:px-16 lg:pb-10 lg:pt-32">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:justify-between xl:gap-10">
          <Hero />
          <WhatIDo />
        </div>

        <FeaturedWork />
      </div>

      <Footer />
    </main>
  );
}
