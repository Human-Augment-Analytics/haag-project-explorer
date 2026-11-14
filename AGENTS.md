# AGENTS.md — working on the HAAG site

This repo is the HAAG public site, converted to **Next.js (App Router) with a
static export**. Same look and same content as the old hand-written site; the
pages are React components now, and everything still reads from the same data
files in this repo.

Start here:

- **CONTRIBUTING.md** — how to do the common tasks (update the recruitment
  phase, add a project or person, edit page text, change the nav, add a page).
- **PILOT.md** — how to run the Next.js pilot locally.

## Commands

```bash
npm install     # once — Next.js, React, and the yaml package (Node 20+)
npm run dev     # dev server at http://localhost:3000  (or: make nextjs)
npm run build   # static export to out/
make check      # validate data files — run before any PR
```

## Rules for changes

- **Data is not code.** Page text for the program pages lives in
  `content/*.json` and must validate against `content/blocks.schema.json`.
  Projects live in `projects/*.yml` (listed in `projects/manifest.json`),
  people in `people.yml`, recruitment in `recruitment.yml` and
  `recruitment-status/*.yml`. Edit the data file; do not hardcode text in
  components. `lib/data.js` reads all of it at build time.
- **The site is a static export** (`output: 'export'` in `next.config.mjs`).
  No server code, no API routes, no runtime fetching. If a change needs a
  server, it does not belong in this repo.
- **Links use clean routes** (`/people`, `/project-explorer`), not `.html`.
  `lib/links.js` rewrites legacy `.html` hrefs found in data files, but new
  content should use the clean route directly.
- **Feature flags did not carry into the port.** The old site's
  `feature-flags.js` registry is gone, so there is no flag system on this
  branch. New features land as reviewed PRs. If flags come back, they come
  back with the registry and its tests together.
- **Keep the current look.** Each page ships its own stylesheet
  (`app/<route>/page.css`). Do not restyle the shared chrome
  (`components/Chrome.jsx`) without team sign-off.
- **Work on a branch from your fork** and open the PR against
  `Human-Augment-Analytics/haag-project-explorer` main. Run `make check` and
  `npm run build`, and click through the pages you changed, before opening it.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
