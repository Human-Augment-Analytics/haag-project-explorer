# HAAG Website

Static site for the Human-Augmented Analytics Group (HAAG), Georgia Tech.
No build step, no framework, no server-side code — every page is a
self-contained HTML file with its own embedded CSS, deployed as static
HTML via Cloudflare Pages. This replaces the previous WordPress-based
site — there is no WordPress, no PHP, and no CMS admin in this setup.

---

## 1. Why this redesign

The previous HAAG site (WordPress, `sites.gatech.edu`) had grown
organically over several semesters into a large set of loosely
connected pages. Two problems stood out:

- **No way to find people.** There was no researcher directory at all —
  faculty, PhD researchers, postdocs, and students were mentioned
  incidentally across program pages, blog posts, and project write-ups,
  with no single place to browse who was working on what.
- **Inconsistent design across pages.** Program pages, the homepage, and
  ad-hoc posts (semester reports, buddy program announcements, project
  pages hosted on entirely separate `sites.gatech.edu` subsites) didn't
  share a visual system, making the group look fragmented rather than
  like one coherent lab.

This redesign addresses both directly:

- **`people.html`** is a new page that didn't exist before — a
  searchable, filterable directory of researchers by name, role, and
  research area, plus a "Recently Featured" section surfacing blog
  posts and publications by name. This is the direct fix for "no way to
  find faculty and their work."
- **`project-explorer.html`** consolidates project information that was
  previously scattered across a dozen separate `sites.gatech.edu`
  subsites (one per project) into a single browsable gallery, grouped
  by research area, with researchers and faculty collaborators listed
  up front instead of buried in project-specific pages.
- **One shared design system** (Section 4) ties every page — homepage,
  program pages, directory, project gallery — to the same navy/gold GT
  branding, type system, and card patterns, so the site reads as one
  product instead of a collection of separate WordPress posts.

---

## 2. Contributors

| Contributor | Contribution |
|---|---|
| **Armando** | Designed all pages except the Recruitment Status page — homepage, faculty directory, project explorer, and the four program pages (Faculty Affiliates, PhD/Post-Doc, Data Science Research, Project Management), including the shared navy/gold design system all of them run on. |
| **Mohammad** | Built the pipeline to get the codebase onto GitHub and deployed correctly on Cloudflare Pages. |
| **Ash** | Designed the Recruitment Status page, contributed to the Faculty Affiliates page, and contributed to the overall site design. |

---

## 3. Site map

| File | Page | Owner / status |
|---|---|---|
| `index.html` | Homepage | New |
| `faculty-affiliates.html` | Faculty Affiliates (FATE program) | New |
| `phd-postdoc.html` | PhD / Post-Doc (CLEAR program) | New |
| `data-science-research.html` | Data Science Research (FAIR-CS / CS 8903 & CS 6999) | New |
| `project-management.html` | Project Management (MGT 8803 & CS 8803 Practicum) | New |
| `project-explorer.html` | HAAG Project Explorer (project gallery) | New |
| `people.html` | Researcher directory | New |
| `people.yml` | Data file behind `people.html` | New |
| `recruitment.html` | Recruitment status | Existing (teammate) |
| `team-matching.html` | Team matching results | Existing (teammate) |
| `recruitment.yml` | Data file behind `recruitment.html` | Existing (teammate) |

The naming conflict that used to exist here (the recruitment page and
the homepage both pointing to `index.html`) has been resolved —
`index.html` is now exclusively the homepage, and the recruitment page
lives at `recruitment.html` with its nav links updated to match.

Every page's nav bar and footer link to all of the above by filename, so
once everything is dropped into the same folder, the site is fully
cross-linked.

### What each redesigned page solves

| Page | Problem before | How it's solved now |
|---|---|---|
| `index.html` | Homepage mixed a photo-blog layout with dense text, no visual hierarchy | Clear hero → stats → mission → programs → milestone timeline, in one consistent visual system |
| `people.html` | No researcher directory existed anywhere on the old site | Searchable, filterable (role + keyword) grid of every researcher, with tags for research area |
| `project-explorer.html` | Projects were scattered across ~10 separate `sites.gatech.edu` subsites, each with its own layout | Single gallery page, grouped by research area, with researchers/collaborators visible at a glance |
| `faculty-affiliates.html`, `phd-postdoc.html`, `data-science-research.html`, `project-management.html` | Long, syllabus-style walls of text with no visual structure | Same content, restructured into scannable cards, numbered steps, and a sidebar for related programs/contacts |

---

## 4. How to update content

### Adding or editing a researcher (most common update)
Open **`people.yml`**. Each researcher is a block under `researchers:`:

```yaml
- name: Dr. Sarah Chen
  role: Faculty              # must be exactly: Faculty | PhD | Postdoc | Undergraduate
  role_label: Faculty Advisor &middot; Computer Science
  tags: [NLP, Human-AI Trust]
  profile_url: "#"
```

Add a new block, edit an existing one, or delete one — then commit and
push. `people.html` fetches this file at page load and renders the grid,
so **no HTML or JS needs to change.** The `role` field must match one of
the four filter chip values exactly (case-sensitive) or that person
won't show up when someone filters by role.

The "Recently Featured" strip at the bottom of the page works the same
way — edit the `features:` block in the same file.

### Editing any other page's text
There's no CMS — open the `.html` file and edit the text directly. Each
page is one file with markup and copy interleaved; search for the
sentence you want to change. There is no templating, so a fact repeated
across pages (e.g. HAAG's founding date) has to be updated in each file
individually.

### Editing shared chrome (nav bar, footer, utility bar)
This is the one real maintenance cost of the current approach: the nav
bar, utility bar, and footer markup are **duplicated in every file**
rather than pulled from one shared include. If you add a new page or
rename one, you need to update the nav `<a>` list in every other HTML
file to match. See [Section 7](#7-known-limitations--future-work) for
the fix if this becomes painful.

---

## 5. Design system reference

All pages share the same tokens, defined at the top of each file's
`<style>` block:

```css
--navy: #003057;        /* GT brand navy — primary color */
--navy-light: #0C4A7A;  /* gradient accent */
--gold: #B3A369;        /* GT Tech Gold — accents, borders, buttons */
--gold-mid: #A4925A;    /* button hover state */
--gold-dark: #857437;   /* text on light gold backgrounds */
--paper: #FAFAF8;       /* page background */
--ink: #1B1F23;         /* body text */
--mute: #5B6670;        /* secondary/caption text */
--line: #E2E5E8;        /* borders */
```

Typography: **Archivo** (headings, loaded from Google Fonts) and
**IBM Plex Mono** (eyebrows, labels, badges, tags). Body copy uses system
sans (Helvetica Neue / Arial).

If you want to change a color or font sitewide today, you'd do a
find-and-replace across every file — see Section 7 for why, and how to
fix it going forward.

---

## 6. Deployment

This site deploys as **static HTML on Cloudflare Pages** — not
WordPress, not GitHub Pages, and not embedded into `sites.gatech.edu`.
There is no PHP, no WordPress admin, no plugin layer, and no build step
to configure.

1. Push all files (the HTML pages, `people.yml`, `recruitment.yml`) to
   the Git repo connected to the Cloudflare Pages project.
2. In the Cloudflare Pages project settings: **no build command**, and
   set the build output directory to the repo root (or wherever these
   files live in the repo) since there's nothing to compile — Cloudflare
   just serves the files as-is.
3. Cloudflare Pages auto-deploys on every push to the connected branch.
   Set up a preview branch/environment if you want to review changes
   before they go live on the production domain.
4. Point HAAG's domain (or a `sites.gatech.edu` redirect, if that's
   being retired in favor of the new domain) at the Cloudflare Pages
   project once it's verified.

**Two things this depends on that a local double-click won't give you:**
- `people.html` (and `recruitment.html`) **fetch a `.yml` file over
  HTTP.** Opening the file directly from your filesystem (`file://`)
  will fail with a CORS/fetch error — it must be served over HTTP, which
  Cloudflare Pages does automatically once deployed. If you want to test
  locally first, run `python3 -m http.server` in the folder and visit
  `http://localhost:8000/people.html`.
- Google Fonts (Archivo, IBM Plex Mono) and the `js-yaml` library both
  load from CDNs at runtime. If GT's network ever blocks
  `fonts.googleapis.com` or `cdnjs.cloudflare.com`, fonts will silently
  fall back to system fonts and the YAML-driven pages will show a "could
  not load" error instead of a grid. Worth a one-time check from a
  campus network before launch.
- **If deploying via Cloudflare's Direct Upload (drag-and-drop), drag
  the *contents* of the project folder, not the folder itself.**
  Zip downloads (e.g. GitHub's "Download ZIP") extract into a wrapper
  folder like `haag-project-explorer-main/`. If you drag that whole
  wrapper folder into Cloudflare's upload box, every file ends up
  nested one level too deep (`haag-project-explorer-main/index.html`
  instead of `index.html` at the root), and every page except whichever
  one Cloudflare's SPA fallback happens to serve will 404. Open the
  folder first, select everything *inside* it, and drag that selection
  instead. This is also the reason a fresh deployment or a rollback
  won't fix the problem if the upload itself has this nesting — check
  a deployment's **Assets uploaded** list under its Details page to
  confirm `index.html` (and the rest) show up at the top level, not
  inside a subfolder.

---

## 7. Known limitations & future work

These aren't blockers to shipping, but worth knowing about:

- **Duplicated chrome.** As noted above, the nav/footer/utility bar HTML
  is copy-pasted into all 9 files. Fine at this size; if the site grows
  past ~15 pages, consider moving to a static site generator that
  Cloudflare Pages can build directly (Eleventy, Astro, and Hugo are all
  supported with a build command in the Pages project settings) so
  nav/footer live in one shared layout file instead of being duplicated
  by hand.
- **Placeholder data.** `people.yml` has 15 sample researchers with
  invented names/tags — swap in real people before publishing.
- **Project Explorer's source is unconfirmed** — built from HAAG's
  public "On-Going Projects" listing since the exact live
  `/haag-project-explorer/` page wasn't directly reachable; confirm it
  matches before publishing.
- **No mobile testing done beyond CSS breakpoints** — the responsive
  rules are in place but haven't been checked on an actual device.
- **Real contact emails and named staff are embedded** (e.g. CLEAR's
  contact, Faculty Affiliates' contact) — confirm those people are still
  correct and comfortable being listed before this goes live.
