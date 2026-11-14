'use client';

// Interactive directory, ported from the inline script in the old people.html.
// Data arrives as props (parsed from people.yml at build time) instead of a
// runtime fetch, so the exported HTML already contains the full directory —
// no "Loading…" flash. Search/filter/sort behavior is unchanged.
//
// The old page's PEOPLE_FEATURE_FLAGS (profileButtons / facultyProfiles /
// blogPosts) all default to false, and window overrides do not exist in the
// port: profile links render hidden and the "Recently Featured" section
// stays hidden, matching the default visitor experience exactly.

import { withBase } from '../../lib/links';
import { useMemo, useState } from 'react';

const ROLES = [
  ['All', 'All Roles'],
  ['Faculty', 'Faculty'],
  ['Postdoc', 'Postdoc'],
  ['PhD', 'PhD'],
  ['Graduate', 'Graduate'],
];

function initials(name) {
  return String(name || '')
    .replace(/^Dr\.\s*/, '')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function personSortKey(person) {
  return String(person?.name || '')
    .replace(/^Dr\.\s*/i, '')
    .trim()
    .toLocaleLowerCase();
}

function PersonCard({ person }) {
  const searchText = (person.name + ' ' + (person.tags || []).join(' ')).toLowerCase();
  return (
    <div className="person-card" data-role={person.role} data-search={searchText}>
      <div className="avatar">{initials(person.name)}</div>
      <div className="person-name">{person.name}</div>
      <div className="person-role">{person.role_label || person.role}</div>
      <div className="tag-row">
        {(person.tags || []).map((t) => (
          <span className="tag" key={t}>{t}</span>
        ))}
      </div>
      {/* Profile buttons are flag-gated OFF in the current site (see header note). */}
      <a className="cta-link" href={person.profile_url || '#'} hidden>
        View Profile →
      </a>
    </div>
  );
}

export default function PeopleClient({ researchers, features }) {
  const [activeRole, setActiveRole] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return researchers
      .filter((p) => {
        const roleMatch = activeRole === 'All' || p.role === activeRole;
        const searchMatch = !q || (p.name + ' ' + (p.tags || []).join(' ')).toLowerCase().includes(q);
        return roleMatch && searchMatch;
      })
      .slice()
      .sort((a, b) => personSortKey(a).localeCompare(personSortKey(b)));
  }, [researchers, activeRole, query]);

  return (
    <>
      <div className="filter-bar">
        <input
          className="search-input"
          id="search"
          type="text"
          placeholder="Search by name or research area…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {ROLES.map(([role, label]) => (
          <button
            key={role}
            type="button"
            className={activeRole === role ? 'chip active' : 'chip'}
            data-role={role}
            onClick={() => setActiveRole(role)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="result-row">
        <span id="result-count">
          Showing {filtered.length} of {researchers.length} researchers
        </span>
      </div>
      <div id="grid-container">
        {filtered.length === 0 ? (
          <p className="empty">No researchers match your search.</p>
        ) : (
          <div className="people-grid">
            {filtered.map((p) => (
              <PersonCard person={p} key={p.name} />
            ))}
            <div className="join-card">
              <h3>Interested in joining HAAG?</h3>
              <p>We welcome faculty, students, and postdocs year-round.</p>
              <a className="btn-gold" href={withBase('/recruitment')}>Become a Researcher →</a>
            </div>
          </div>
        )}
      </div>
      {/* Featured section: flag-gated OFF by default on the current site. */}
      <div className="log-heading" id="featured-heading" hidden>
        Recently Featured
      </div>
      <div className="features-grid" id="features-grid" hidden>
        {(features || []).map((f, i) => (
          <div className="feature-card" key={i}>
            <span className="feature-kind">{f.kind}</span>
            <h3>{f.title}</h3>
            <div className="feature-byline">{f.byline || ''}</div>
            <p className="feature-summary">{f.summary || ''}</p>
            <a className="cta-link" href={f.url || '#'}>Read more →</a>
          </div>
        ))}
      </div>
    </>
  );
}
