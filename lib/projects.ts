export type Project = {
  id: string;
  name: string;
  /** Chris's role on this specific project — shown next to the name on
   * the Featured Work and /projects cards. Omit for studio-level work
   * with no single personal title attached (e.g. Enterprise Automation). */
  role?: string;
  tagline: string;
  description: string;
  tags: string[];
  /** Overrides the default `/projects#${id}` Featured Work link. Used by
   * Fourth Meridian to point at the VirtuArch studio page instead — once
   * Fourth Meridian is ready to launch publicly, swap this for the
   * external FourthMeridian.com domain. */
  href?: string;
  /** Card artwork shown on the homepage Featured Work cards. Lives in
   * /public/projects. */
  image?: string;
};

/**
 * Featured work. Homepage shows exactly these two, in this order.
 * The /projects page reuses the same data with the longer description.
 *
 * VirtuArch Labs itself is no longer listed here — it's the studio behind
 * this work, not a project of its own. It has its own dedicated page
 * (/virtuarch), reached via the homepage Hero's "Explore the Studio" button.
 */
export const projects: Project[] = [
  {
    id: "fourth-meridian",
    name: "Fourth Meridian",
    role: "Lead Developer",
    tagline: "Workspace-based financial intelligence platform.",
    description:
      "I'm designing and building a workspace-based platform to help individuals, families, and organizations better understand and manage their financial lives through data, automation, and intelligent insights.",
    tags: ["Product", "Fintech", "Automation"],
    href: "/virtuarch#fourth-meridian",
    image: "/projects/fourth-meridian.png",
  },
  {
    id: "enterprise-automation",
    name: "Enterprise Automation",
    tagline:
      "Power Platform, SharePoint, Power Automate, and operational workflow systems.",
    description:
      "I design and build automation solutions, workflows, and operational systems using SharePoint, Power Platform, Power Automate, and modern Microsoft technologies.",
    tags: ["Power Platform", "SharePoint", "Workflow"],
    image: "/projects/enterprise-automation.png",
  },
];
