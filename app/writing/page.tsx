import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes and essays from Chris Hogan.",
};

export default function WritingPage() {
  return (
    <main className="relative flex flex-1 flex-col bg-black">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_-10%,rgba(255,255,255,0.08),transparent_55%)]" />

      <section className="flex flex-1 flex-col px-6 pb-20 pt-36 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            Writing
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Notes, in time
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">
            Longer-form thoughts on systems, automation, and building are on
            their way. Nothing published yet — check back soon.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
