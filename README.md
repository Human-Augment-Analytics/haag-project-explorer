# HAAG Project Explorer
Metadata for HAAG research projects to display on the HAAG website.

## Template
```yaml
id: project-id
name: Project Title
status: active      # Research status. active | completed | pending | archived
visibility: private # For code visibility. public (for open-source projects) | private (if not to be publicly visible at this time)
faculty: # PI / Faculty
  - 
researchers: # List research contributors here
  - 
  -
advisors: # List computational advisors if any exist on the project
  - 
  - 
summary: # Summarize the project >
  Summary here.
tags: # Optional for now, but will be used to categorize the projects into groupings (such as unit groups)
  - 
  -
links:
  github: https://github.com/... # placeholder, if public
  docs: https://example.com/docs # Could be README, wiki, github pages, project website, etc.
  publication: https://doi.org/... # If exists/preprint/completed
  forum: https://example.com/forum # link to forum - @James Hennessy - await guidance on this
  contact: mailto:lab@example.edu # Contact to reach out to for interested parties (lab-level email distribution), or leave blank at this time if there isn't an email distribution that is setup at this time
```

## Example

See `projects/photogrammetry.yml` as an example.