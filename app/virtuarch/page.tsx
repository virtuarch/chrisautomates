import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/projects";
import Footer from "@/components/Footer";
import GlassRefraction from "@/components/GlassRefraction";

export const metadata: Metadata = {
  title: "VirtuArch Labs",
  description:
    "Innovation Studio focused on building AI-enabled products, enterprise platforms, and digital systems.",
};

export default function VirtuArchPage() {
  const fourthMeridian = projects.find((p) => p.id === "fourth-meridian")!;

  return (
    <main className="relative flex flex-1 flex-col bg-black">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_80%_-10%,rgba(255,255,255,0.08),transparent_55%)]" />

      <section className="px-6 pb-20 pt-36 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            Studio
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            VirtuArch Labs
          </h1>
          <p className="mt-2 text-sm font-medium text-white/50">
            Founder, Chris Hogan
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-[17px]">
            Innovation Studio focused on building AI-enabled products,
            enterprise platforms, and digital systems.
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">
            VirtuArch is the studio behind the work on this site — the
            architecture, automation, and product engineering that turns
            ideas into systems people actually use. Fourth Meridian is its
            flagship product; Enterprise Automation is its ongoing work in
            operational systems.
          </p>

          {/* Fourth Meridian — Featured Work's card links here directly,
              for now. Once Fourth Meridian is ready to launch publicly,
              that link should point at FourthMeridian.com instead. */}
          <div
            id="fourth-meridian"
            className="glass-panel mt-16 scroll-mt-28 rounded-3xl p-8 sm:p-10"
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
              Flagship Product
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {fourthMeridian.name}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/65">
              {fourthMeridian.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {fourthMeridian.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/12 px-3 py-1 text-xs text-white/55"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm text-white/45">
              Currently in active development.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div>
              <h3 className="text-base font-semibold text-white">
                Enterprise Automation
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-white/55">
                Power Platform, SharePoint, and operational workflow systems
                built under the studio.
              </p>
            </div>
            <Link
              href="/projects#enterprise-automation"
              className="link-underline shrink-0 text-sm text-white/70 hover:text-white"
            >
              View →
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-white/10 pt-10">
            <Link
              href="/projects"
              className="glass-light relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              <GlassRefraction blur={28} />
              <span className="relative z-10">View Projects</span>
            </Link>
            <Link
              href="/contact"
              className="glass-nav relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              <GlassRefraction blur={38} />
              <span className="relative z-10">Get In Touch</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
