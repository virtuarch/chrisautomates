import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import Footer from "@/components/Footer";
import GlassRefraction from "@/components/GlassRefraction";

export const metadata: Metadata = {
  title: "About",
  description:
    "Systems Architect, Automation Engineer, and Founder — background, education, and certifications.",
};

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const bio = [
  "I'm Chris Hogan, a Systems Architect, Automation Engineer, and Founder focused on building software, automation systems, and digital products.",
  "My career began in enterprise IT and network operations, where I worked across service desk, systems administration, and infrastructure teams supporting large-scale government environments. Over time, I specialized in automation, collaboration platforms, and business process optimization, helping organizations streamline operations through SharePoint, Power Platform, workflow automation, and modern cloud technologies.",
  "Today, I work at the intersection of enterprise systems and software development. Professionally, I've designed and implemented solutions that improve visibility, reduce manual effort, and enable teams to operate more efficiently. Personally, I enjoy building products from the ground up, exploring new technologies, and creating software that solves meaningful problems.",
  "In 2026, I completed a Bachelor of Science in Computer Science from Western Governors University, further strengthening my foundation in software engineering, algorithms, data structures, machine learning, and systems design.",
  "Outside of work, I enjoy traveling, photography, fitness, investing, and studying how technology can improve decision-making. Many of the images featured throughout this website were captured during travels across the Middle East, Europe, Africa, and beyond while building my career and pursuing new ideas.",
  "This site serves as a collection of projects, experiments, and products that reflect both my professional experience and personal interests.",
];

const selectedProjects = [
  {
    title: "Package Route Optimization Engine",
    description:
      "Developed a package delivery optimization engine using custom data structures, graph traversal, and greedy routing algorithms to minimize mileage while satisfying strict delivery deadlines.",
  },
  {
    title: "Air Quality Prediction Model",
    description:
      "Designed and trained a neural network using TensorFlow/Keras to predict urban air quality from historical environmental datasets while evaluating model accuracy and performance.",
  },
  {
    title: "Enterprise Requirements & QA System",
    description:
      "Produced complete enterprise software documentation including requirements analysis, architecture, traceability matrices, testing strategy, defect analysis, and implementation planning.",
  },
  {
    title: "Fourth Meridian Financial Intelligence Platform",
    description:
      "Designed and engineered a workspace-based financial intelligence platform featuring AI-assisted insights, modern web architecture, secure authentication, and scalable enterprise design patterns.",
  },
];

const certifications = [
  "CompTIA Security+",
  "CompTIA CASP+",
  "ITIL 4 Foundation",
  "Microsoft Certified Solutions Associate (MCSA)",
  "Microsoft Azure Certification",
  "Linux Essentials",
];

const coreCompetencies = [
  "Software Architecture",
  "AI & Agentic Systems",
  "Enterprise Automation",
  "Power Platform Development",
  "SharePoint Solutions",
  "Workflow Automation",
  "Modern Web Development",
  "TypeScript",
  "Next.js",
  "PostgreSQL",
  "System Design",
  "Cloud Technologies",
];

export default function AboutPage() {
  return (
    <main className="relative flex flex-1 flex-col bg-black">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_-10%,rgba(255,255,255,0.08),transparent_55%)]" />

      <section className="px-6 pb-16 pt-36 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            About
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Chris Hogan
          </h1>

          <div className="mt-10 space-y-5">
            {bio.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-white/65 sm:text-[17px]">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:grid-cols-2">
            <div className="p-7">
              <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-white/40">
                Education
              </h2>
              <p className="mt-3 text-base font-medium text-white">
                B.S. Computer Science
              </p>
              <p className="text-sm text-white/50">
                Western Governors University · 2026
              </p>
            </div>

            <div className="p-7">
              <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-white/40">
                Certifications
              </h2>
              <ul className="mt-3 space-y-1.5 text-sm text-white/60">
                {certifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-white/40">
              Selected Projects
            </h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {selectedProjects.map((project) => (
                <div key={project.title}>
                  <p className="text-sm font-medium text-white">
                    {project.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/55">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-white/40">
              Core Competencies
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {coreCompetencies.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-white/12 px-3 py-1 text-xs text-white/60"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-white/10 pt-10">
            <Link
              href="/projects"
              className="glass-light relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              <GlassRefraction blur={28} />
              <span className="relative z-10">See what I&rsquo;m building</span>
            </Link>
            {/* "Resume" opens the PDF in a new tab for viewing; the small
                icon button beside it forces an actual download (an <a>
                can't both navigate and force-download from one click —
                these are two separate, deliberate affordances). */}
            <a
              href={site.resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-nav relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              <GlassRefraction blur={38} />
              <span className="relative z-10">Resume</span>
            </a>
            <a
              href={site.resumeHref}
              download="Chris-Hogan-Resume.pdf"
              aria-label="Download resume"
              className="glass-nav relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full text-white/80 transition-colors hover:text-white"
            >
              <GlassRefraction blur={38} />
              <span className="relative z-10 flex items-center justify-center">
                <DownloadIcon />
              </span>
            </a>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-nav relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium text-white/90 transition-colors hover:text-white"
            >
              <GlassRefraction blur={38} />
              <span className="relative z-10">GitHub</span>
            </a>
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
