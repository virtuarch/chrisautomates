import type { Metadata } from "next";
import { site } from "@/lib/site";
import Footer from "@/components/Footer";
import GlassRefraction from "@/components/GlassRefraction";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Chris Hogan.",
};

export default function ContactPage() {
  return (
    <main className="relative flex flex-1 flex-col bg-black">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_80%_-10%,rgba(255,255,255,0.08),transparent_55%)]" />

      <section className="flex flex-1 flex-col items-center justify-center px-6 py-28 text-center sm:px-10">
        <div className="mx-auto max-w-md">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            Contact
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Get In Touch
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/60">
            The best way to reach me is email. I read every message.
          </p>

          <a
            href={`mailto:${site.email}`}
            className="glass-panel glass-panel-hover relative mt-10 inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-3.5 text-sm font-medium text-white"
          >
            <GlassRefraction blur={42} />
            <span className="relative z-10">Email Me</span>
          </a>

          <p className="mt-4 text-sm text-white/45">{site.email}</p>

          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-white/55">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline hover:text-white"
            >
              GitHub
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline hover:text-white"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
