# HAAG Website — Next.js Pilot

This branch is the HAAG site converted to **Next.js (App Router)** with a
static export. Same design, same content. The pages are React components
now, and everything still reads from the same data files in this repo.
Approved as a pilot by Riyam on 2026-10-24.

The old hand-written HTML site is untouched on `main`. To contribute content
or code changes, read [CONTRIBUTING.md](CONTRIBUTING.md).

## Requirements

- Node.js 20.10 or newer (the test script uses a Node flag added in 20.10)
- npm (comes with Node)

## Run it locally

```bash
npm install     # once: installs Next.js, React, the yaml package, and ajv
npm run dev     # dev server at http://localhost:3000
```

Open http://localhost:3000 and click around. Every page from the old site is
there:

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

Stop the dev server with Ctrl+C. Code and data changes reload while it runs.

## Checks

```bash
npm test        # project manifest, content JSON vs. schema, sanitizer tests
```

`make check` runs the same thing. CI runs `npm test` before every deploy.

## Build the static site

```bash
npm run build   # writes the finished site to out/
```

`out/` is plain HTML/CSS/JS, like the old site. Routes are written as
`out/<route>.html` files.

To check the export locally at the root of a server:

```bash
make start      # builds, then serves out/ at http://localhost:3000
```

## URL prefix (`BASE_PATH`)

The site is served under a path prefix. The build reads it from the
`BASE_PATH` environment variable, which `next.config.mjs` applies to every
internal link and asset.

| Where it's served | `BASE_PATH` |
|---|---|
| GitHub Pages project site, `https://<owner>.github.io/haag-project-explorer/` | `/haag-project-explorer` (the default in CI) |
| Root of a domain, such as `haag.cc.gatech.edu` | `/` or unset |

In CI, the value comes from the repository variable `BASE_PATH`, falling back
to `/haag-project-explorer`. To move the site to the root of the domain,
set the variable to `/` and redeploy. No code changes are needed.

## Deploying

`.github/workflows/pages.yml` runs `npm test`, then `npm run build`, then
uploads `out/` to GitHub Pages. It runs:

- on pushes to the pilot branch (`Sai/nextjs-pilot`), which is the only branch
  it deploys from for now,
- when the Directory sends a `content-published` repository event,
- nightly, as a backup rebuild,
- on demand, from the Actions tab.

At cutover, add `main` to the workflow's push branches and point the site at
the new host.

## Editing content

Content is **not** in the page code. The data files are listed in
[CONTRIBUTING.md](CONTRIBUTING.md#tasks). Edit the data file, then rebuild
(or restart `npm run dev`).

Careful: the two `recruitment.yml` files are different files with different
dates and notes. `/recruitment` reads the root `recruitment.yml`, and
`/recruitment-status` reads `recruitment-status/recruitment.yml`. Update both
when the phase changes. A malformed data file fails the build instead of
breaking the page for visitors.

## Project layout

- `app/` — one folder per route. Each route has a `page.jsx` and a
  `page.css` (the page's styles, carried over unchanged from the old
  site). `app/layout.jsx` is the shared HTML shell.
- `components/` — the shared header/nav/footer (`Chrome.jsx`), the
  blocks renderer for the article pages (`Blocks.jsx`), the article
  page shell (`ArticlePage.jsx`), and the client-side redirect (`Redirect.jsx`).
- `lib/` — the build-time data loaders, the HTML sanitizer, and the link helpers
  (`links.js`, which includes `withBase()`).
- `public/` — files copied as-is into `out/`. Currently `embed-resize.js`.
- `scripts/` — `validate.js` (project manifest), `validate-content.mjs`
  (content JSON vs. schema), and `test-sanitize.mjs` (sanitizer and link tests).
- `next.config.mjs` — Next config. `output: 'export'` makes the build a static
  site, and `BASE_PATH` sets the URL prefix.

## Notes

- **`embed-resize.js` stays until WordPress is retired.** The WordPress
  embed loads it from the site, so it lives in `public/` and is copied into
  `out/`. Under the default prefix, its URL is
  `/haag-project-explorer/embed-resize.js`. Remove it when the embed is gone.
- **Redirects are client-side.** `/team-matching` and
  `/recruitment-status/team-matching` use a meta refresh and
  `window.location.replace()`, not HTTP 301s. Browsers follow them, but search
  engines and link previews may not. If the redirects need to be real 301s,
  configure them on the host.
- **The feature-flag preview toggle is gone.** The old
  `feature-flags.js` / `feature-toggle.js` let editors preview hidden
  sections; what a normal visitor saw is unchanged — those sections
  stay hidden exactly as the defaults had them.
- **The Makefile is updated.** `make nextjs` starts the dev server and
  `make start` serves the built `out/`. The old `.html` server targets are
  removed.
