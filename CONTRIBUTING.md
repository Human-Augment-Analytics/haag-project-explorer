# Contributing

This is the single guide for changing the HAAG website. It covers the Next.js
site in `app/` and the data files it reads. For setup and deployment, see
[PILOT.md](PILOT.md). For the project-explorer metadata template, see
[README.md](README.md).

Most changes are content edits to YAML or JSON files. You do not need to touch
code for those. Each task below says which file to edit, whether it needs a
code change, and how to check the result.

## Before you start

```bash
npm install     # once
npm run dev     # http://localhost:3000, reloads as you edit
npm test        # checks the manifest, content JSON, and sanitizer
npm run build   # writes the static site to out/
```

Run `npm test` and `npm run build` before opening a PR. CI runs the same checks
and will fail the build on a malformed data file.

## Tasks

### Update the recruitment phase

There are two recruitment pages. Each reads its own file, so update both when
the phase changes.

| Page | File | Code change? |
|---|---|---|
| `/recruitment-status` (status timeline) | `recruitment-status/recruitment.yml` | No |
| `/recruitment` (recruitment page) | `recruitment.yml` | No |

1. Set `current_phase` to one of `applications_open`, `applications_closed`,
   `matching`, or `finalized`. Do not rename these keys.
2. Set `last_updated` to today's date (`YYYY-MM-DD`).
3. Optionally edit `notes` (use `null` for none).
4. Check: `npm run dev`, then open `/recruitment-status` and `/recruitment`.
   Phases before the current one show as complete.

### Edit the recruitment FAQs

Both recruitment pages share one FAQ file.

1. Edit `recruitment-status/faqs.yml`. Each section has `items:` with a
   `question` and an `answer`.
2. Keep answers as plain text.
3. Check: open `/recruitment` and `/recruitment-status` and expand the FAQ.

### Add or edit a project

Projects appear in the Project Explorer only when `visibility: public`.

1. Create `projects/<project-id>.yml`. Copy the template in
   [README.md](README.md#template). Use a unique, lowercase, hyphenated
   filename.
2. Add the filename to the `projects` array in `projects/manifest.json`.
   Files that are not listed are rejected by `npm test`.
3. Leave links you do not have as `null`. Placeholder values such as
   `example.com` are rejected.
4. Check: `npm test`, then open `/project-explorer` and confirm the project
   appears with its name, status, and links.

To edit a project, change its YAML file. To hide one, set `visibility: private`.

### Add or edit a person

People are listed on `/people`.

1. Edit `people.yml` under `researchers:`. Each entry has `name`, `role`
   (one of `Faculty`, `PhD`, `Postdoc`, `Graduate`), `role_label`, `tags`, and
   `profile_url` (use `"#"` if there is no profile yet).
2. Use `&middot;` in `role_label` for the separator. Common HTML entities
   are decoded at build time (see `decodeEntities` in `lib/sanitize.js`).
3. Features and blog posts on the same page are under `features:`.
4. Check: open `/people` and search for the new name.

### Edit text on an article page

Article pages (`/faculty-affiliates`, `/phd-postdoc`,
`/data-science-research`) are built from `content/<page>.json`. They have a
masthead, a main column, and a sidebar, each made of typed blocks.

1. Edit the matching `content/<page>.json`. Each block has a `type`; see
   `content/blocks.schema.json` for the fields each type takes.
2. Fields ending in `_html` accept simple inline HTML (`a`, `p`, `strong`,
   `em`, `ul`, `ol`, `li`). Other text fields are plain text.
3. Links accept `http(s)`, `mailto:`, and relative paths. Other schemes are
   dropped.
4. Check: `npm test` (it validates the file against the schema), then open the
   page in `npm run dev`.

### Edit text on any other page

The home page, project management, recruitment, and team matching pages keep
their text in code. These are code changes.

1. Find the page in `app/<route>/page.jsx`. Home is `app/page.jsx`.
2. Edit the text in the JSX. Keep the existing class names so the styling
   still applies.
3. Check: `npm run dev`, then review the page at the desktop and mobile widths.

### Change the navigation or footer

The header and footer are shared by every page, in `components/Chrome.jsx`.

1. Edit `NAV_A` (most pages) or `NAV_B` (recruitment pages). Each entry is
   `[key, '/route', 'Label']`.
2. Footer links are plain `<a>` tags in the same file.
3. Every internal `href` in this file must be wrapped in `withBase()`. Do not
   write a bare `href="/..."`.
4. Check: click through the nav on `npm run dev`.

### Add a page

1. Create `app/<route>/page.jsx`. For a standard article page, copy
   `app/faculty-affiliates/page.jsx`, which uses `ArticlePage` and a
   `content/<route>.json` file. Otherwise copy `app/people/page.jsx` and build
   the page from `Chrome` components.
2. Add a `page.css` next to it if the page needs styles.
3. If the page is an article page, add `content/<route>.json` and make sure it
   passes `npm test`.
4. Add the link to `NAV_A` or `NAV_B` in `components/Chrome.jsx` if it should
   appear in the navigation.
5. Check: `npm run build`. The new route should appear in the build output,
   and the page should load in `npm run dev`.

### Remove an old redirect

Old `.html` paths are rewritten to clean routes automatically (see
`lib/links.js`). Redirect stubs live in `app/<route>/page.jsx` and use the
`Redirect` component. Remove the stub and its route folder only after you
confirm nothing links to it.

## Deploying

Changes are published by `.github/workflows/pages.yml`. It runs `npm test` and
`npm run build`, then deploys `out/`. The workflow runs on pushes to the pilot
branch, on a publish event from the Directory, nightly, and on demand. Until
the cutover to `main`, the live site is not rebuilt from `main`.

The site URL prefix comes from `BASE_PATH`. The default is
`/haag-project-explorer`. To check a build with that prefix, run
`BASE_PATH=/haag-project-explorer npm run build` and confirm the internal links
in `out/*.html` start with it. Use `npm run build` with no prefix to check a
root-domain build.

## Rules that apply to every change

- Keep content in data files. Do not hard-code a person, project, or
  recruitment date in the page code.
- Use `withBase()` for internal links. Route raw HTML through
  `lib/sanitize.js`.
- A malformed data file must fail the build. Do not add a silent fallback that
  hides bad data.
- When you add a block type, update `components/Blocks.jsx`,
  `content/blocks.schema.json`, and this file together.
