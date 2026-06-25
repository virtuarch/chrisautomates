# Portfolio Site Template

A custom, code-first portfolio site — Next.js 16 (App Router), TypeScript, Tailwind CSS v4, deployed on Vercel. There's no CMS or database: every piece of content (copy, projects, photos) lives directly in the source files, so customizing it for yourself just means editing files and redeploying.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## What's already wired up

- **Daily background system** — `lib/backdrops.ts` holds an array of photos, each cropped into a dedicated desktop (16:9) and mobile (9:16) file in `public/backdrops/`. `getTodayBackdrop()` picks one deterministically via day-of-year modulo image count — no database, same photo for every visitor for 24 hours. The homepage (`app/page.tsx`) revalidates every 30 minutes (`export const revalidate = 1800`) so the backdrop rotates without a redeploy.
- **Pages** — Home (`/`), About (`/about`), Projects (`/projects`), Writing (`/writing`), Contact (`/contact`).
- **Components** — `Navbar` (liquid-glass, mobile menu), `DailyBackground` + `DailyCaption`, `Hero`, `WhatIDo`, `FeaturedWork`, `Footer`.
- **Glass styling** — utility classes `.glass-nav` / `.glass-panel` / `.glass-panel-hover` in `app/globals.css`.
- **Font** — self-hosted Geist via the `geist` npm package (no Google Fonts network call at build time).

## Where to edit content

Quick map of "I want to change X" → the file to open. There's no CMS or database — every piece of text lives in a plain TypeScript or page file, so editing the site means editing a sentence in one of these files, saving, and letting the dev server hot-reload.

| I want to change... | Edit this |
|---|---|
| Hero headline, name, role line, bio, hero buttons | `components/Hero.tsx` |
| "What I Do" pillars (Build / Automate / Create) | `components/WhatIDo.tsx` → `pillars` array |
| Featured Work cards on the homepage — names, taglines, roles, tags, links | `lib/projects.ts` — single source of truth; the homepage cards and the full `/projects` page both read from this same array |
| Featured Work card layout/styling (sizing, image position, spacing) | `components/FeaturedWork.tsx` |
| Project card artwork (the images on each Featured Work card) | Drop a new image into `public/projects/`, then point that project's `image` field at it in `lib/projects.ts` |
| `/projects` page heading + intro copy | `app/projects/page.tsx` |
| Each project's longer description on `/projects` | `lib/projects.ts` → that project's `description` field |
| `/virtuarch` studio page | `app/virtuarch/page.tsx` |
| `/about` page — bio, education, certifications, core competencies, selected projects, resume/GitHub buttons | `app/about/page.tsx` |
| `/contact` page | `app/contact/page.tsx` |
| `/writing` page | `app/writing/page.tsx` |
| Nav bar links (Projects / About / Writing / Contact) | `lib/site.ts` → `navLinks` array |
| Nav bar layout, brand badge, mobile menu | `components/Navbar.tsx` |
| Footer content | `components/Footer.tsx` |
| Daily caption near the footer ("Today's backdrop" — location/date) | `components/DailyCaption.tsx` |
| Email, GitHub URL, LinkedIn URL, resume path, site meta description | `lib/site.ts` |
| Resume PDF | Replace `public/resume.pdf` with the new file (keep the same filename, or update `resumeHref` in `lib/site.ts` if you rename it) |
| Daily background photos — which photos rotate, their captions/dates | `lib/backdrops.ts` → `backdrops` array (see "Adding a new daily backdrop" below) |
| Daily background photo files themselves | `public/backdrops/desktop/` (16:9 crops) and `public/backdrops/mobile/` (9:16 crops) |
| Glass/glassmorphism styling, colors, fonts | `app/globals.css` |

## Before you launch — replace these placeholders

This repo ships with sample content. Before deploying it as your own site, replace:

| What | Where | Notes |
|---|---|---|
| Site name, title, meta description | `lib/site.ts` → `site` object | Your name/brand and a one-line description. |
| Email | `lib/site.ts` → `site.email` | Your contact address. |
| GitHub URL | `lib/site.ts` → `site.github` | Your GitHub profile or org URL. |
| LinkedIn URL | `lib/site.ts` → `site.linkedin` | Optional — rendered as a secondary link, not a CTA. Remove if you don't want it shown. |
| Resume PDF | `public/resume.pdf` | Replace with your own résumé (keep the filename, or update `resumeHref` in `lib/site.ts` if you rename it). |
| Hero name, role line, bio | `components/Hero.tsx` | Replace with your own. |
| Daily background photos | `lib/backdrops.ts` + `public/backdrops/` | Replace with your own photos — see "Adding a new daily backdrop" below. |
| Featured Work projects | `lib/projects.ts` | Replace with your own projects. |
| About page content | `app/about/page.tsx` | Replace bio, education, certifications, and experience with your own. |

Tip: keep your original, uncropped source photos and any resume master files outside this repo (e.g. a personal backup folder) — only the cropped/exported versions need to live in `public/`.

## Adding a new daily backdrop

1. Drop a desktop image into `public/backdrops/desktop/your-id.jpg` and a mobile crop into `public/backdrops/mobile/your-id.jpg`.
2. Add an entry to the `backdrops` array in `lib/backdrops.ts`:

```ts
{
  id: "your-id",
  location: "City, Country",
  date: "Month Day, Year",
  desktopImage: "/backdrops/desktop/your-id.jpg",
  mobileImage: "/backdrops/mobile/your-id.jpg",
}
```

The rotation automatically includes it (day-of-year % array length).

## Deploying

1. Push this folder to a GitHub repo.
2. Import the repo on [Vercel](https://vercel.com/new) — it auto-detects Next.js, no config needed.
3. Point your domain at Vercel through your DNS provider: add the `A`/`CNAME` records Vercel gives you on the project's Domains settings page.
4. Set your contact email and other site details in `lib/site.ts` — already wired into the Contact page and footer.

## Notes

- Tailwind v4 is configured via CSS (`@theme inline` in `app/globals.css`) — there's no `tailwind.config.ts` in v4.
- `node_modules` and `.next` are intentionally not included — run `npm install` after pulling this folder.

Last updated: June 2026