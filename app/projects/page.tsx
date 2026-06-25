import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Projects",
  description: "Software, automation, and digital products built by Chris Hogan.",
};

export default function ProjectsPage() {
  return (
    <main className="relative flex flex-1 flex-col bg-black">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_80%_-10%,rgba(255,255,255,0.08),transparent_55%)]" />

      <section className="px-6 pb-20 pt-36 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            Projects
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            What I&rsquo;m building
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">
            A focused set of products and automation systems I&rsquo;m
            building through VirtuArch Labs — quality over quantity.
          </p>

          <div className="mt-16 flex flex-col gap-6">
            {projects.map((project) => (
              <article
                key={project.id}
                id={project.id}
                className="glass-panel scroll-mt-28 rounded-3xl p-8 sm:p-10"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-white">
                    {project.name}
                    {project.role && (
                      <span className="ml-2 text-base font-normal text-white/40">
                        ({project.role})
                      </span>
                    )}
                  </h2>
                  <div className="flex gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/12 px-3 py-1 text-xs text-white/55"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-base leading-relaxed text-white/65">
                  {project.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
