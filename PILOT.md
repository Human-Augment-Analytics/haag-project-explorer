# HAAG Website — Next.js Pilot

This branch is the HAAG site converted to **Next.js (App Router)** with a
static export. Same design, same content — the pages are React components
now, and everything still reads from the same data files in this repo.
Approved as a pilot by Riyam on 2026-10-24.

The old hand-written HTML site is untouched on `main`.

For day-to-day changes on this branch (adding projects or people, editing
page text, updating the recruitment phase), see **CONTRIBUTING.md** — this
file only covers running the pilot itself.

## Requirements

- Node.js 20 or newer
- npm (comes with Node)

## Run it locally

```bash
npm install     # once — installs Next.js, React, and the yaml package
npm run dev     # dev server at http://localhost:3000
```

Open http://localhost:3000 and click around — every page from the old
site is there:

- `/` — home
- `/project-explorer` — project cards with filters and the detail modal
- `/data-science-research` — researchers page
- `/faculty-affiliates`
- `/people` — directory with search, role filters, and sort
- `/phd-postdoc`
- `/project-management`
- `/recruitment`
- `/team-matching` — redirects to `/recruitment`, same as before
- `/recruitment-status`
- `/recruitment-status/team-matching` — redirects to `/recruitment-status`

Stop the dev server with Ctrl+C. Code changes reload automatically while
it runs; content changes (data files below) need a rebuild or a dev
server restart to show up.

## Build the static site

```bash
npm run build   # writes the finished site to out/
```

`out/` is plain HTML/CSS/JS, like the old site — host it anywhere static.
To check the export locally:

```bash
npx serve out   # serves out/ at http://localhost:3000
```

Note: routes are written as `out/<route>.html` files. If a host needs
folder-style URLs instead, set `trailingSlash: true` in `next.config.mjs`
and rebuild.

## Editing content

Content is **not** in the page code. Edit the data file, then rebuild
(or restart `npm run dev`):

| What | File |
|---|---|
| Projects (explorer cards + home counters) | `projects/*.yml`, listed in `projects/manifest.json` |
| People directory | `people.yml` |
| Recruitment page | `recruitment.yml` |
| Recruitment status page | `recruitment-status/recruitment.yml` |
| FAQs on the recruitment page | `recruitment-status/faqs.yml` |
| Article pages (researchers, faculty, phd/postdoc) | `content/*.json` |

Careful: the two `recruitment.yml` files are different files with
different dates and notes — each page reads its own. A malformed data
file now fails the build instead of breaking the page for visitors.

## Project layout

- `app/` — one folder per route. Each route has a `page.jsx` and a
  `page.css` (the page's styles, carried over unchanged from the old
  site). `app/layout.jsx` is the shared HTML shell.
- `components/` — the shared header/nav/footer (`Chrome.jsx`), the
  blocks renderer for the article pages (`Blocks.jsx`), and the article
  page shell (`ArticlePage.jsx`).
- `lib/` — the build-time data loaders and helpers the pages use.
- `next.config.mjs` — Next config; `output: 'export'` is what makes the
  build a static site.

## Notes

- **`embed-resize.js` is gone on purpose** — it existed only to resize
  the site inside the old WordPress iframe, and WordPress is no longer
  in the picture.
- **The feature-flag preview toggle is gone.** The old
  `feature-flags.js` / `feature-toggle.js` let editors preview hidden
  sections; what a normal visitor saw is unchanged — those sections
  stay hidden exactly as the defaults had them.
- **Ignore the Makefile on this branch.** Its `make serve` still
  describes the old workflow (python server, `.html` URLs). Use
  `npm run dev`, or `npm run build` + serve `out/`.
