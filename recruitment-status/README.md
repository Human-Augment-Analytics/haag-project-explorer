# HAAG Recruitment Status

This folder holds the data for the `/recruitment-status` page: where HAAG is in
the recruitment cycle, and the FAQ answers shown on the recruitment pages.

- `recruitment.yml` drives the status banner and timeline on `/recruitment-status`.
- `faqs.yml` drives the FAQ sections on `/recruitment` and `/recruitment-status`.

The site reads both files at build time. There is no backend and no external
service. This intentionally does **not** integrate with BuzzMe. The phase
changes a few times per cycle, so a manual update is simpler.

For the steps to update the phase or the FAQs, see the
[contributing guide](../CONTRIBUTING.md#update-the-recruitment-phase). The
`/recruitment` page has its own copy of the phase in the root `recruitment.yml`.
Update both files when the phase changes.

## Phase template

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

Phase `key` values should stay stable once in use. The timeline logic depends on
`current_phase` matching one of the `phases[].key` values, in order.

## FAQ template

```yaml
sections:
  - key: faq-8903
    eyebrow: FAQ for 8903
    title: New Researchers
    description: Guidance for first-time HAAG researchers enrolling in CS 8903.
    items:
      - question: Is the research statement required?
        answer: Yes, it is a non-negotiable requirement.
```

Keep answers as plain text. The page handles spacing and the accordion.

## Checking changes

```bash
npm install
npm test         # validates the project files and content
npm run dev      # then open http://localhost:3000/recruitment-status
```
