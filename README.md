# HAAG Project Explorer
The goal of this project explorer is to provide visibility into the projects under HAAG. This repository holds the metadata for HAAG research projects that will be displayed on the HAAG website.

## Template
This is the template to be used to structure the metadata. For fields (such as links) that you want to leave blank, please populate with `null`.

```yaml
id: project-id # choose a simple id for the project
name: Project Title
status: active      # Research status. new | active | completed | preprint | archived
visibility: private # For project visibility. public | private (if not to be publicly visible at this time)
recruiting: false # boolean - set to true if the project is currently recruiting
faculty: # PI / Faculty
  - 
researchers: # List research contributors here
  - 
  -
advisors: # List computational advisors if any exist on the project (if none exist, mark as null).
  - 
  - 
summary: > # Summarize the project
  Summary here.
tags: # Optional for now, but will be used to categorize the projects into groupings (such as unit groups). If unknown, mark with null.
  - 
  -
links:
  github: null      # e.g. https://github.com/... (placeholder, if public)
  docs: null        # e.g. https://example.com/docs (Could be README, wiki, github pages, project website, etc.)
  publication: null # e.g. https://doi.org/... (If exists/preprint/completed)
  forum: null       # link to forum - @James Hennessy - leave null for now
  contact: null     # e.g. mailto:lab@example.edu (Contact to reach out to for interested parties, or null if none)
```

## Example

See `projects/photogrammetry.yml` as an example.

## Adding a new project

1. Create a new YAML file under `projects/` using the template above.
2. Give the project a unique filename, for example `projects/my-new-project.yml`.
3. Add your new filename to `projects/manifest.json` under the `projects` array.
4. Set `visibility: public` in the YAML if you want the project to appear in the explorer.
5. Keep `visibility: private` for work that should remain hidden from the public explorer.
6. Save and commit both the new YAML file and the updated `projects/manifest.json`.

> The explorer reads `projects/manifest.json` first and then loads each listed YAML file. The manifest is the source of truth for which project files are included.

## Feature flags (required for new features)

All existing functionality is `CURRENT` by default, represented by the
`existingSite` baseline in `feature-flags.js`. Existing unmarked UI remains visible.
Every upcoming feature **must** have its own global registry entry and start as
`PREVIEW`. Use exactly these two values:

| Value | Default visitor | Preview enabled |
| --- | --- | --- |
| `CURRENT` | Enabled | Enabled |
| `PREVIEW` | Disabled | Enabled |

The registry is shared by all pages, including `recruitment-status/`. There is no
build step or external service. Unknown names and invalid values are disabled.
`existingSite` records the legacy baseline; it is not a master switch for the site.

### Add a feature

1. Add a uniquely named entry to `feature-flags.js`, for example
   `projectComparison: 'PREVIEW',`. Use letters, digits, `_`, or `-`, beginning
   with a letter.
2. Gate **every** entry point and UI element for the feature:

   ```html
   <button data-feature="projectComparison">Compare projects</button>
   <section data-feature="projectComparison">Comparison panel</section>
   ```

3. Gate its JavaScript initialization, event handlers, and data fetching too:

   ```js
   if (window.HAAGFeatures.isEnabled('projectComparison')) {
     initializeProjectComparison();
   }
   ```

4. Verify both modes, including navigation, direct page access, and embedded use.
5. Change the registry value to `CURRENT` when the feature is approved for release.
   Keep the gates so the feature can be returned to `PREVIEW` if needed.

For a new HTML page, copy the `haag-feature-gates` style and the two feature script
imports from an existing page into its head, before feature markup or scripts.
Adjust relative paths for nested folders. Keep these scripts synchronous: gates
are computed before content renders. Dynamic `data-feature` elements are covered
by the same CSS automatically; nested features require all enclosing gates to be
enabled. Do not change registry values at runtime; edit the file and reload.

### Preview upcoming features locally

Start the site with `make start`, open a page, and run this in its browser console:

```js
sessionStorage.setItem('haag:preview', 'PREVIEW');
location.reload();
```

This enables all registered `PREVIEW` features in that browser tab and origin,
including navigation to other pages. To restore the default `CURRENT` mode:

```js
sessionStorage.removeItem('haag:preview');
location.reload();
```

Inspect `HAAGFeatures.mode`, `HAAGFeatures.flags`, or
`HAAGFeatures.isEnabled('projectComparison')` in the console. For an iframe,
select the embedded page's console context. When session storage is blocked,
preview stays off. Preview settings do not change another visitor's experience.

These client-side flags control rollout, not access to confidential content:
HTML, JavaScript, and data shipped with the site remain publicly downloadable.

### Required review checklist

- Every new feature is registered as `PREVIEW` and gates both UI and behavior.
- Existing functionality remains `CURRENT`.
- Both default and preview modes are checked before merging.
- New pages load the shared feature scripts and gate style.
- Run `make check` to validate the registry, page integration, and toggle behavior.

### Working example and browser test

`projectResultCount` is a real `PREVIEW` feature on the Project Explorer. It shows
“Showing X of Y public projects” and updates as filters change. In default mode,
the counter is hidden and its update code does not execute. Enable preview using
the console commands above to try it, then select a recruitment filter.

The automated browser test checks default visibility, existing card/modal
behavior, preview visibility, filter updates, disabling preview, and promotion to
`CURRENT` (simulated without editing the registry):

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node scripts/test-feature-browser.js
```

If Google Chrome is already installed, skip the Chromium download and run
`BROWSER_CHANNEL=chrome node scripts/test-feature-browser.js` instead. The test
starts and stops its own temporary localhost server. Browser tests are separate
from the dependency-free `make check` checks.
