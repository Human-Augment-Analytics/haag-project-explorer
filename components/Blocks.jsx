// React port of content-render-blocks.js: renders the block lists from
// content/*.json into the same markup/classes the vanilla renderer produced.
// Plain fields are rendered as React text (equivalent to the old esc());
// *_html fields go through lib/sanitize.js (same allow-list as the old
// sanitizer) and are injected as HTML. Internal *.html hrefs are rewritten
// to routes, exactly like the rest of the port.
import { sanitizeHtml } from '../lib/sanitize';
import { rewriteHref, safeHref } from '../lib/links';

function Html({ html }) {
  return <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
}

function linkProps(href) {
  const safe = safeHref(href || '#');
  const finalHref = rewriteHref(safe);
  const props = { href: finalHref };
  if (/^https?:/i.test(finalHref)) props.rel = 'noopener noreferrer';
  return props;
}

function MainBlock({ block }) {
  const b = block || {};
  switch (b.type) {
    case 'heading':
      return b.level === 3 ? <h3 className="h3">{b.text}</h3> : <h2 className="h2">{b.text}</h2>;

    case 'rich_text':
      return (
        <div className="body-text">
          <Html html={b.body_html ?? b.html ?? ''} />
        </div>
      );

    case 'paragraph':
      if (b.body_html != null) {
        return (
          <p className="body-text">
            <Html html={b.body_html} />
          </p>
        );
      }
      return <p className="body-text">{b.text}</p>;

    case 'numbered_list':
      return (
        <div className="service-list">
          {(b.items || []).map((it, i) => (
            <div className="service-item" key={i}>
              <h4>
                <span className="num">{i + 1}</span>
                {it.title}
              </h4>
              <p>{it.text}</p>
            </div>
          ))}
        </div>
      );

    case 'callout':
      return <div className="callout">{b.text}</div>;

    case 'images':
      return (
        <div className="img-row">
          {(b.items || []).map((im, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={safeHref(im.src)} alt={im.alt || ''} />
          ))}
        </div>
      );

    case 'expandable_steps':
      return (
        <>
          {(b.items || []).map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-label">{s.label}</div>
              <h3>{s.title}</h3>
              <p className="step-summary">{s.text}</p>
              <details className="step-detail">
                <summary>{b.more_label}</summary>
                <Html html={s.more_html} />
              </details>
            </div>
          ))}
        </>
      );

    case 'people_cards':
      return (
        <div className="team-grid">
          {(b.items || []).map((p, i) => (
            <div className="team-card" key={i}>
              <div className="team-avatar">{p.initials}</div>
              <h4>{p.name}</h4>
              <div className="role">{p.role}</div>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      );

    case 'grade_cards':
      return (
        <div className="grade-row">
          {(b.items || []).map((g, i) => (
            <div className="grade-card" key={i}>
              <div className="pct">{g.value}</div>
              <h4>{g.title}</h4>
              <ul>
                {(g.bullets || []).map((x, j) => (
                  <li key={j}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case 'item_list':
      return (
        <>
          {(b.items || []).map((it, i) => (
            <div className="deliverable-item" key={i}>
              <h4>{it.title}</h4>
              <p>{it.text}</p>
            </div>
          ))}
        </>
      );

    case 'link_list':
      return (
        <div className="resource-list">
          {(b.items || []).map((it, i) => (
            <span key={i}>
              {i > 0 && <br />}
              <a {...linkProps(it.href)}>{it.text}</a>
            </span>
          ))}
        </div>
      );

    case 'pills':
      return (
        <div className="audience-row">
          {(b.items || []).map((x, i) => (
            <span className="audience-pill" key={i}>{x}</span>
          ))}
        </div>
      );

    case 'cards': {
      const fact = b.variant === 'fact';
      return (
        <div className={fact ? 'fact-row' : 'challenge-grid'}>
          {(b.items || []).map((c, i) => (
            <div className={fact ? 'fact-card' : 'challenge-card'} key={i}>
              <div className="icon">{c.icon}</div>
              <h4>{c.title}</h4>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      );
    }

    case 'steps':
      return (
        <>
          {(b.items || []).map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-num">{s.number}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </>
      );

    case 'faq':
      return (
        <>
          {(b.items || []).map((f, i) => (
            <div className="faq-item" key={i}>
              <h4>{f.question}</h4>
              <p>{f.answer}</p>
            </div>
          ))}
        </>
      );

    case 'cta':
      return (
        <div className="callout-cta">
          <h3>{b.title}</h3>
          <p>{b.text}</p>
          <a className="btn-gold" {...linkProps(b.link_href)}>{b.link_text}</a>
        </div>
      );

    default:
      return null;
  }
}

function SidebarBlock({ block }) {
  const b = block || {};
  switch (b.type) {
    case 'card': {
      const cls = b.variant === 'contact' ? 'side-card contact' : 'side-card';
      return (
        <div className={cls}>
          <h3>{b.heading}</h3>
          {b.text ? <p>{b.text}</p> : null}
          {b.items && b.items.length ? (
            <ul>
              {b.items.map((it, i) => (
                <li key={i}>
                  <a {...linkProps(it.href)}>{it.text ?? it.label}</a>
                </li>
              ))}
            </ul>
          ) : null}
          {b.link_href ? (
            <a className="cta-link" {...linkProps(b.link_href)}>{b.link_text}</a>
          ) : null}
        </div>
      );
    }

    case 'links':
      return (
        <div className="side-card">
          <h3>{b.heading}</h3>
          <ul>
            {(b.items || []).map((it, i) => (
              <li key={i}>
                <a {...linkProps(it.href)}>{it.text ?? it.label}</a>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'contact':
      return (
        <div className="side-card contact">
          <h3>{b.heading}</h3>
          {b.text ? <p>{b.text}</p> : null}
          {b.link_href ? (
            <a className="cta-link" {...linkProps(b.link_href)}>{b.link_text}</a>
          ) : null}
        </div>
      );

    default:
      return null;
  }
}

export function MainBlocks({ blocks }) {
  return (
    <>
      {(blocks || []).map((b, i) => (
        <MainBlock block={b} key={i} />
      ))}
    </>
  );
}

export function SidebarBlocks({ blocks }) {
  return (
    <>
      {(blocks || []).map((b, i) => (
        <SidebarBlock block={b} key={i} />
      ))}
    </>
  );
}
