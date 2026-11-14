// Build-time data loaders. The port reads the SAME data files the old site
// fetched at runtime, from the same locations at the repo root:
//   projects/manifest.json + projects/*.yml   (project explorer, home counts)
//   people.yml                                  (people directory)
//   recruitment.yml                             (/recruitment status + FAQs)
//   recruitment-status/recruitment.yml          (/recruitment-status)
//   recruitment-status/faqs.yml                 (/recruitment FAQs)
//   content/*.json                              (blocks pages)
// Nothing is copied or duplicated; edit the data file, rebuild, done.
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { decodeEntities } from './sanitize.js';

const ROOT = process.cwd();

function readText(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function readYaml(rel) {
  return parseYaml(readText(rel));
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

// js-yaml (used by the old pages) parses YAML dates into Date objects and the
// pages rendered them as ISO dates; the `yaml` package returns strings for
// plain dates but Dates for timestamps. Normalize both to 'YYYY-MM-DD'.
export function formatDisplayValue(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return value == null ? '' : String(value);
}

export function getProjectFiles() {
  const manifest = readJson('projects/manifest.json');
  return Array.isArray(manifest.projects) ? manifest.projects : [];
}

export function getProjectCount() {
  return getProjectFiles().length;
}

export function getRawProjects() {
  return getProjectFiles().map((fileName) => {
    const rel = path.join('projects', fileName);
    if (!fs.existsSync(path.join(ROOT, rel))) return null;
    try {
      return readYaml(rel);
    } catch (error) {
      throw new Error(`Could not parse ${rel}: ${error.message}`);
    }
  });
}

export function getPeople() {
  const data = readYaml('people.yml') || {};
  const researchers = (data.researchers || []).map((p) => ({
    name: p.name ?? '',
    role: p.role ?? '',
    role_label: decodeEntities(p.role_label ?? ''),
    tags: Array.isArray(p.tags) ? p.tags : [],
    profile_url: p.profile_url ?? '#',
  }));
  const features = (data.features || []).map((f) => ({
    kind: f.kind ?? '',
    title: f.title ?? '',
    byline: decodeEntities(f.byline ?? ''),
    summary: f.summary ?? '',
    url: f.url ?? '#',
  }));
  return { researchers, features };
}

export function getRecruitment() {
  return readYaml('recruitment.yml') || {};
}

export function getRecruitmentStatus() {
  return readYaml('recruitment-status/recruitment.yml') || {};
}

export function getFaqSections() {
  const data = readYaml('recruitment-status/faqs.yml') || {};
  return Array.isArray(data.sections) ? data.sections : [];
}

export function getContentPage(name) {
  return readJson(path.join('content', `${name}.json`));
}

// Shared phase-state logic from the old recruitment renderers:
// state is derived from the phase's index vs the current_phase index.
export function phaseStates(data) {
  const phases = Array.isArray(data.phases) ? data.phases : [];
  const currentIndex = phases.findIndex((p) => p.key === data.current_phase);
  return phases.map((p, i) => ({
    ...p,
    state: i < currentIndex ? 'complete' : i === currentIndex ? 'current' : 'upcoming',
    isLast: i === phases.length - 1,
  }));
}

export function currentPhaseLabel(data) {
  const phases = Array.isArray(data.phases) ? data.phases : [];
  const current = phases.find((p) => p.key === data.current_phase);
  return current ? current.label : data.current_phase;
}
