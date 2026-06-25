# Chris Automates

Custom portfolio site for chrisautomates.com — Next.js 16 (App Router), TypeScript, Tailwind CSS v4, deployed on Vercel.

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

- **Daily background system** — `lib/backdrops.ts` holds 11 real travel photos (Doha, Muscat, four spots in Switzerland, Singapore, Paris, Lisse, Riyadh, Jeddah), each cropped into a dedicated desktop (16:9) and mobile (9:16) file in `public/backdrops/`. `getTodayBackdrop()` picks one deterministically via day-of-year modulo image count — no database, same photo for every visitor for 24 hours. The homepage (`app/page.tsx`) revalidates every 30 minutes (`export const revalidate = 1800`) so the backdrop rotates without a redeploy.
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

| What | Where | Notes |
|---|---|---|
| Resume PDF | `public/resume.pdf` | Done — your real resume is wired in. |
| GitHub URL | `lib/site.ts` → `github` | Done — set to `https://github.com/virtuarch`. |
| LinkedIn URL | `lib/site.ts` → `linkedin` | Done — set as a secondary link, not a CTA, per the brief. |

Everything else (email, bio, education, certifications, project descriptions) is already filled in with the content you provided.

Note: the original, uncropped source photos and resume master files (docx) that were used to produce the assets in `public/` have been removed from the repo to keep it lean — `public/backdrops/`, `public/projects/`, and `public/resume.pdf` are the only copies now. Keep your own backups of those originals outside this repo if you want them for future re-cropping or edits.

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
3. In Hostinger DNS, point `chrisautomates.com` at Vercel: add the `A`/`CNAME` records Vercel gives you on the project's Domains settings page.
4. Set `chris@chrisautomates.com` as the contact address — already wired into `lib/site.ts`.

## Notes

- Tailwind v4 is configured via CSS (`@theme inline` in `app/globals.css`) — there's no `tailwind.config.ts` in v4.
- `node_modules` and `.next` are intentionally not included — run `npm install` after pulling this folder.

Last updated: June 2026