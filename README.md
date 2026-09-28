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
  github: null      # Public repo URL (e.g., https://github.com/...), or null if private/none
  docs: null        # Project docs, wiki, or website URL, or null
  publication: null # Preprint or paper DOI URL (e.g., https://doi.org/...), or null
  forum: null       # Link to forum discussion, or null
  contact: null     # Contact email (e.g., mailto:user@domain.edu), or null
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