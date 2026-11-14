# Contributing to the HAAG site

The site is **Next.js (App Router) with a static export**. Pages are React
components under `app/`, and the content still comes from the same data files
the old site used — most updates are data edits, not code.

This file is the single source of truth for how to make changes. If README.md,
PILOT.md, or any other doc says something different, this file wins.

## Setup

You need Node.js 20 or newer.

```bash
npm install     # once
npm run dev     # dev server at http://localhost:3000 (or: make nextjs)
npm run build   # static export to out/
make check      # validate the data files (projects, people, content)
```

## Common tasks

### Update the recruitment phase

- **Edit:** `recruitment-status/recruitment.yml` for the `/recruitment-status`
  page, or `recruitment.yml` at the repo root for `/recruitment`. Change
  `current_phase` (one of `applications_open`, `applications_closed`,
  `matching`, `finalized`) and set `last_updated` to today.
- **Code change:** no.
- **Check:** open the page locally and confirm the banner and timeline show
  the new phase.
- Recruitment FAQs live in `recruitment-status/faqs.yml` — same pattern, edit
  and reload.

### Add a project

- **Edit:** create `projects/<your-project>.yml` using the template in
  README.md, then add the filename to the `projects` array in
  `projects/manifest.json`. Set `visibility: public` for it to appear.
- **Code change:** no.
- **Check:** run `make check` (it validates the manifest and the YAML), then
  open `/project-explorer` and find the project.

### Add a person

- **Edit:** `people.yml` — add an entry under `researchers` with `name`,
  `role` (Faculty | PhD | Postdoc | Graduate), `role_label`, `tags`, and
  `profile_url` (`#` if there is no profile yet).
- **Code change:** no.
- **Check:** open `/people`, find the person, and test the role filter.

### Edit page text

- **Program pages** (`/faculty-affiliates`, `/phd-postdoc`,
  `/data-science-research`): edit `content/<page>.json`. The file must
  validate against `content/blocks.schema.json` — `make check` enforces this.
  A content editor tool is planned and will replace this process later; these
  are the current steps.
- **All other pages:** the text is in the page component,
  `app/<route>/page.jsx` (the home page is `app/page.jsx`).
- **Code change:** no for the three program pages, yes for the rest.
- **Check:** reload the page locally and read it through.

### Change the nav

- **Edit:** `components/Chrome.jsx` and the nav items each page passes to it.
  Note the recruitment pages use a different nav order (People second) — check
  both variants.
- **Code change:** yes.
- **Check:** click through every page and confirm the order and the highlighted
  current item are right on each one.

### Add a page

- **Edit:** create `app/<route>/page.jsx` and `app/<route>/page.css`, and add
  the route to the nav (see above). The static export picks the new route up
  at build time — there is no route registry to update.
- **Code change:** yes.
- **Check:** `npm run build`, then open the new route from `out/` or the dev
  server.

## Before opening a PR

1. `make check` passes.
2. `npm run build` passes.
3. You clicked through every page you changed.
4. Branch from your fork, PR against `main` in
   `Human-Augment-Analytics/haag-project-explorer`. Say in the PR what you
   changed and how you checked it.
