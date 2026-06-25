function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
      <path
        d="M12 3.5 4 7.5v9l8 4 8-4v-9l-8-4Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M4 7.5l8 4 8-4M12 11.5V20.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
      <path
        d="M12.5 3 5 13.5h5.5L11 21l7.5-10.5H13L12.5 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]">
      <path
        d="M12 3.5c.4 3 1.7 4.9 4.5 5.5-2.8.6-4.1 2.5-4.5 5.5-.4-3-1.7-4.9-4.5-5.5 2.8-.6 4.1-2.5 4.5-5.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M18 14.5c.2 1.5.9 2.4 2.3 2.7-1.4.3-2.1 1.2-2.3 2.7-.2-1.5-.9-2.4-2.3-2.7 1.4-.3 2.1-1.2 2.3-2.7Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const pillars = [
  {
    title: "Build",
    description: "Software platforms and tools that solve real problems.",
    icon: <BoxIcon />,
  },
  {
    title: "Automate",
    description: "Design and implement automation that drives efficiency.",
    icon: <BoltIcon />,
  },
  {
    title: "Create",
    description: "Products and systems with clean architecture and great UX.",
    icon: <SparkleIcon />,
  },
];

/**
 * A single, non-interactive glass panel summarizing the three pillars.
 * Deliberately not three separate clickable cards — just one quiet
 * surface. Only ever shown on desktop, and only once there's enough
 * horizontal room next to the hero (see the `xl:` breakpoint below);
 * it's hidden entirely on mobile and on narrower desktop windows.
 */
export default function WhatIDo() {
  return (
    <div className="hidden w-[300px] shrink-0 xl:block">
      <div className="glass-panel rounded-3xl p-6">
        <div className="flex flex-col divide-y divide-white/10">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/15">
                {pillar.icon}
              </span>
              <div>
                <h3 className="text-base font-semibold text-white">
                  {pillar.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
