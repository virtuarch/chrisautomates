import Link from "next/link";
import { site } from "@/lib/site";
import DailyCaption from "./DailyCaption";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto px-6 py-6 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-white/10 pt-5 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href={`mailto:${site.email}`}
            className="link-underline text-white/75 hover:text-white"
          >
            {site.email}
          </a>
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
          <Link href="/contact" className="link-underline hover:text-white">
            Contact
          </Link>
        </div>

        <DailyCaption inline className="shrink-0" />
      </div>
    </footer>
  );
}
