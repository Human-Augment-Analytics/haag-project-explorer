// Project normalization for the Project Explorer, ported from the inline
// script in the old project-explorer.html (buildProject, normalizeProjectLink,
// formatLinkLabel, createAccent, isPublicProject). Runs at build time over
// the parsed projects/*.yml data; the client component receives the result.

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function toList(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => normalizeText(item).length > 0);
}

const ACCENT_PALETTES = [
  ['#0f766e', '#2563eb'],
  ['#7c3aed', '#ec4899'],
  ['#ea580c', '#f59e0b'],
  ['#2563eb', '#06b6d4'],
  ['#15803d', '#4ade80'],
  ['#7c2d12', '#fb923c'],
];

function createAccent(name) {
  const text = String(name || 'Project');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % ACCENT_PALETTES.length;
  }
  return ACCENT_PALETTES[Math.abs(hash) % ACCENT_PALETTES.length];
}

function formatLinkLabel(key) {
  const labels = {
    github: 'GitHub',
    docs: 'Docs',
    publication: 'Publication',
    forum: 'Forum',
    contact: 'Contact',
  };
  const lower = String(key || '').toLowerCase();
  return labels[lower] || (key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Link');
}

function normalizeProjectLink(value) {
  if (!value || typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed || trimmed === 'null') return '';

  const emailMatch = trimmed.match(/^(?:mailto:)?([^\s@]+@[^\s@]+\.[^\s@]+)$/i);
  if (emailMatch) {
    const email = emailMatch[1];
    if (/@(?:example\.(?:com|edu|org)|domain\.com)$/i.test(email)) return '';
    return `mailto:${email}`;
  }

  let candidate = trimmed;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(candidate)) {
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(candidate)) {
      candidate = `https://${candidate}`;
    } else {
      return '';
    }
  }

  try {
    const url = new URL(candidate);
    if (!['https:', 'http:'].includes(url.protocol)) return '';

    const hostname = url.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === 'example.com' || hostname.endsWith('.example.com') ||
      hostname === 'example.edu' || hostname.endsWith('.example.edu') ||
      hostname === 'example.org' || hostname.endsWith('.example.org')
    ) {
      return '';
    }

    if (url.pathname.includes('...') || url.pathname.includes('/org/')) {
      return '';
    }

    return url.href;
  } catch {
    return '';
  }
}

export function buildProject(projectData) {
  const summary = projectData.summary ? String(projectData.summary).trim() : '';
  const tags = toList(projectData.tags).map((tag) => normalizeText(tag));
  const faculty = toList(projectData.faculty).map((person) => normalizeText(person));
  const researchers = toList(projectData.researchers).map((person) => normalizeText(person));
  const advisors = toList(projectData.advisors).map((person) => normalizeText(person));
  const links = projectData.links && typeof projectData.links === 'object'
    ? Object.entries(projectData.links)
        .map(([label, value]) => ({ label: formatLinkLabel(label), value: normalizeProjectLink(value) }))
        .filter((link) => link.value)
    : [];
  const accent = createAccent(projectData.name || 'Project');

  return {
    id: projectData.id || (projectData.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: normalizeText(projectData.name || 'Untitled project'),
    status: normalizeText(projectData.status || ''),
    visibility: normalizeText(projectData.visibility || ''),
    recruiting: String(projectData.recruiting ?? '').toLowerCase() === 'true',
    summary,
    tags,
    faculty,
    researchers,
    advisors,
    links,
    accent,
  };
}

export function buildPublicProjects(rawProjects) {
  return rawProjects
    .filter(Boolean)
    .map(buildProject)
    .filter((p) => String(p.visibility || '').toLowerCase() === 'public')
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
}
