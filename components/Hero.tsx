import Link from "next/link";
import GlassRefraction from "@/components/GlassRefraction";

export default function Hero() {
  return (
    <div className="animate-fade-up max-w-xl lg:max-w-2xl">
      <h1 className="text-[clamp(2.5rem,6.5vw,5rem)] font-semibold leading-[1.02] tracking-tight text-white">
        Chris Hogan
      </h1>
      <p className="mt-3 flex items-baseline gap-2">
        <span className="text-lg font-medium text-white/85 sm:text-xl">
          VirtuArch Labs
        </span>
        <span className="text-white/30">·</span>
        <span className="text-sm font-medium uppercase tracking-[0.15em] text-white/45">
          Founder
        </span>
      </p>
      <p className="mt-4 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">
        Innovation Studio focused on building AI-enabled products, enterprise
        platforms, and digital systems.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href="/virtuarch"
          className="glass-light relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          <GlassRefraction blur={28} />
          <span className="relative z-10">Explore the Studio</span>
        </Link>
        <Link
          href="/about"
          className="glass-nav relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:text-white"
        >
          <GlassRefraction blur={38} />
          <span className="relative z-10">About Me</span>
        </Link>
      </div>
    </div>
  );
}
