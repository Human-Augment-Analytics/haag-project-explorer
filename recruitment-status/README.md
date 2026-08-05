# HAAG Recruitment Status

The goal of this page is to give everyone — prospective researchers, faculty, advisors — a
clear, always-current answer to "where is HAAG right now in the recruitment cycle?"
This repository holds the single YAML file that drives that status display on the HAAG
website.

## How it works

- `recruitment.yml` is the single source of truth for the current recruitment phase.
- `index.html` reads `recruitment.yml` at page load and renders the status banner and
  timeline. There is no build step and no backend — the page just reads the file directly.
- To change what's shown on the site, you only ever edit `recruitment.yml`. Nothing else
  needs to change.

This intentionally does **not** integrate with BuzzMe. The recruitment phase only changes
a handful of times per cycle, so a manual update is simpler and has no dependency on
BuzzMe's system staying accessible to us.

## Template

```yaml
cycle_name: Fall 2026 Recruitment
current_phase: applications_open   # applications_open | applications_closed | matching | finalized
last_updated: 2026-07-20           # YYYY-MM-DD

notes: > # Optional context shown under the status banner. Leave as null for none.
  Applications are open now through August 15 on BuzzMe.

phases:
  - key: applications_open
    label: Applications Open
    description: Applications are open and being accepted through BuzzMe.
  - key: applications_closed
    label: Applications Closed
    description: The application window has closed and submissions are under review.
  - key: matching
    label: Matching In Progress
    description: Applicants are being matched with projects, faculty, and advisors.
  - key: finalized
    label: Finalized
    description: Matches have been finalized and communicated to applicants.

contact: mailto:haag@gatech.edu
```

## Updating the current phase

1. Open `recruitment.yml`.
2. Change `current_phase` to the key of the phase you're now in.
3. Update `last_updated` to today's date.
4. Optionally update `notes` with anything applicants should know right now.
5. Commit and push (or open a PR, if this gets folded into HAAG's broader review workflow).

The site automatically reflects whatever `current_phase` is set to — phases before it show
as complete, the matching phase shows as current, and phases after it show as upcoming.

## Running locally

Because `index.html` fetches `recruitment.yml` over HTTP, opening the file directly in a
browser (`file://`) will fail due to browser security restrictions. Serve it locally instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or deploy it via GitHub Pages, same as the Project Explorer repo, and it'll work without
any extra setup.

## Notes for future integration

- This currently stands alone as a prototype. If it gets folded into the main HAAG site
  redesign (see the "Understand" / site structure work), this same `recruitment.yml`
  pattern can likely be embedded directly rather than rebuilt.
- Phase `key` values should stay stable once in use — the timeline logic depends on
  `current_phase` matching one of the `phases[].key` values in order.
