<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Maintenance rules for this repo

- **Content goes in data files, not page code.** Projects, people, recruitment, and article pages are edited in `projects/`, `people.yml`, `recruitment*.yml`, and `content/*.json`. See `CONTRIBUTING.md` for the step-by-step tasks.
- **Run `npm test` before opening a PR.** It validates the project manifest, the content JSON against `content/blocks.schema.json`, and the sanitizer. `npm run build` must also succeed.
- **Internal links need `withBase()`.** Use `withBase()` from `lib/links.js` for any hard-coded internal `href`, or `Redirect` target, so the site works under `BASE_PATH`. Never write a bare `href="/..."`.
- **Sanitize any `_html` field.** Route raw HTML through `lib/sanitize.js`, and keep hrefs going through `isSafeHref` / `safeHref`.
- **Data loaders fail loudly.** `lib/data.js` runs at build time. A malformed data file should break the build with the file name, not silently drop content.
- **Keep the renderer and schema in step.** When adding a block type, update `components/Blocks.jsx`, `content/blocks.schema.json`, and `CONTRIBUTING.md` together.
