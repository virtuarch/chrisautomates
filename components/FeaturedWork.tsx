import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";

export default function FeaturedWork() {
  return (
    <section id="featured-work" className="mt-10 lg:mt-12">
      <div className="mx-auto w-full">
        <div className="mb-5 flex items-center gap-4">
          <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
            Featured Work
          </h2>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Exactly two cards by design — VirtuArch itself is reached via
            Hero's "Explore the Studio" button, not a slot here. */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={project.href ?? `/projects#${project.id}`}
              className="glass-panel glass-panel-hover group flex items-stretch gap-5 overflow-hidden rounded-2xl p-6 sm:gap-6 sm:p-5"
            >
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {project.name}
                    {project.role && (
                      <span className="ml-2 whitespace-nowrap text-sm font-normal text-white/40">
                        ({project.role})
                      </span>
                    )}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {project.tagline}
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center text-sm text-white/40 transition-colors group-hover:text-white/80">
                  View project
                  <span className="ml-1.5 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
              {/* Fixed width + flex stretch (not aspect-ratio) so the
                  height always matches the card exactly, on every browser —
                  aspect-ratio combined with flex stretch has a known WebKit
                  bug that collapsed this to 0 width on mobile Safari. */}
              {project.image && (
                <div className="relative -my-6 -mr-6 w-24 flex-shrink-0 sm:-my-5 sm:-mr-5 sm:w-28">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
