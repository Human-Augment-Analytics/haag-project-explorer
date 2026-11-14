# HAAG Project Explorer
The goal of this project explorer is to provide visibility into the projects under HAAG. This repository holds the metadata for HAAG research projects that will be displayed on the HAAG website.

> Contributing guide: see [CONTRIBUTING.md](CONTRIBUTING.md). It covers every common content change.

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

## Page content and contributing

The website is built with Next.js. Start with [CONTRIBUTING.md](CONTRIBUTING.md)
for how to update recruitment status, add projects or people, edit page text,
change the navigation, or add a page.

### Article page content (`content/*.json`)

The article pages (`/faculty-affiliates`, `/phd-postdoc`, `/data-science-research`)
are rendered from `content/<page>.json`. Each file has a masthead, a main column,
and a sidebar. `content/blocks.schema.json` is the contract, and `npm test`
checks every file against it.

```json
{
  "page": "faculty-affiliates",
  "masthead": { "eyebrow": "HAAG · Faculty Program", "title": "...", "sub": "..." },
  "main": [ { "type": "heading", "text": "..." }, ... ],
  "sidebar": [ { "type": "card", "heading": "...", "text": "..." }, ... ]
}
```

`main` and `sidebar` are lists of blocks, and every block has a `type`. Fields
ending in `_html` accept inline HTML, which is sanitised (only simple formatting
tags such as `a`, `p`, `strong`, `em`, `ul`, `ol`, `li` survive). Other text
fields are plain text and escaped. Links allow `http(s)`, `mailto`, and relative
URLs only.

Main column (16 types): `heading` (level 2 or 3), `paragraph`, `rich_text`,
`numbered_list`, `callout`, `images`, `expandable_steps`, `people_cards`,
`grade_cards`, `item_list`, `link_list`, `pills`, `cards`, `steps`, `faq`,
`cta`. Sidebar (3 types): `card`, `links`, `contact`. See an existing
`content/*.json` file for the fields each type takes.
