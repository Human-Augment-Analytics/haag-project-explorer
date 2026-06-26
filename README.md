# HAAG Project Explorer
The goal of this project explorer is to provide visibility into the projects under HAAG. This repository holds the metadata for HAAG research projects that will be displayed on the HAAG website.

## Template
This is the template to be used to structure the metadata. For fields (such as links) that you want to leave blank, please populate with `null`.

```yaml
id: project-id
name: Project Title
status: active      # Research status. active | completed | preprint | archived
visibility: private # For code visibility. public (for open-source projects) | private (if not to be publicly visible at this time)
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
  github: https://github.com/...   # placeholder, if public
  docs: https://example.com/docs   # Could be README, wiki, github pages, project website, etc.
  publication: https://doi.org/... # If exists/preprint/completed
  forum: https://example.com/forum # link to forum - @James Hennessy - leave null for now
  contact: mailto:lab@example.edu  # Contact to reach out to for interested parties (lab-level email distribution), or leave null at this time if there isn't an email distribution that is setup at this time
```

## Example

See `projects/photogrammetry.yml` as an example.