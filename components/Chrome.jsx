import { withBase } from '../lib/links';
// Shared site chrome, ported 1:1 from the original pages' markup.
// Two families exist on the current site:
//   Variant A (most pages): 3-link utility bar, nav order Home/Faculty/PhD/
//     Research/PM/People/Explorer/Recruitment, 4-column footer.
//   Variant B (recruitment family): nav order with People second,
//     3-column footer; recruitment.html's utility bar has only 2 links.
// Plain <a> tags are used on purpose: the original site is multi-page
// (full reload per navigation), and each page ships its own full stylesheet,
// so full-page navigation also keeps per-page CSS perfectly isolated.

export function UtilityBar({ links = ['Georgia Institute of Technology', 'GT Directory', 'Campus Map'] }) {
  return (
    <div className="gt-utility">
      {links.map((label) => (
        <a key={label} href="#">{label}</a>
      ))}
    </div>
  );
}

const NAV_A = [
  ['home', '/', 'Home'],
  ['faculty', '/faculty-affiliates', 'Faculty Affiliates'],
  ['phd', '/phd-postdoc', 'PhD / Post-Doc'],
  ['research', '/data-science-research', 'Research'],
  ['pm', '/project-management', 'Project Management'],
  ['people', '/people', 'People'],
  ['explorer', '/project-explorer', 'Project Explorer'],
  ['recruitment', '/recruitment', 'Recruitment Status'],
];

const NAV_B = [
  ['home', '/', 'Home'],
  ['people', '/people', 'People'],
  ['faculty', '/faculty-affiliates', 'Faculty Affiliates'],
  ['phd', '/phd-postdoc', 'PhD / Post-Doc'],
  ['research', '/data-science-research', 'Research'],
  ['pm', '/project-management', 'Project Management'],
  ['explorer', '/project-explorer', 'Project Explorer'],
  ['recruitment', '/recruitment', 'Recruitment Status'],
];

export function Nav({ current, variant = 'A' }) {
  const items = variant === 'B' ? NAV_B : NAV_A;
  return (
    <nav className="nav-bar">
      <div className="nav-inner">
        {items.map(([key, href, label]) => (
          <a key={key} href={withBase(href)} className={key === current ? 'current' : undefined}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function Masthead({ eyebrow, title, sub }) {
  return (
    <div className="masthead">
      <div className="masthead-inner">
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p className="sub">{sub}</p>
      </div>
    </div>
  );
}

export function Breadcrumb({ here }) {
  return (
    <div className="breadcrumb">
      <a href={withBase('/')}>HAAG</a>
      <span className="sep">/</span>
      <span className="here">{here}</span>
    </div>
  );
}

export function FooterA() {
  return (
    <footer className="gt-footer">
      <div className="gt-footer-inner">
        <div>
          <h4>Georgia Institute of Technology</h4>
          <p>
            North Avenue<br />
            Atlanta, GA 30332<br />
            +1 404.894.2000
          </p>
        </div>
        <div>
          <h4>General</h4>
          <ul>
            <li><a href="#">Directory</a></li>
            <li><a href="#">Employment</a></li>
            <li><a href="#">Emergency Information</a></li>
            <li><a href="#">Accessibility</a></li>
          </ul>
        </div>
        <div>
          <h4>Legal &amp; Privacy</h4>
          <ul>
            <li><a href="#">Legal &amp; Privacy Information</a></li>
            <li><a href="#">Human Trafficking Notice</a></li>
            <li><a href="#">Title IX / Sexual Misconduct</a></li>
          </ul>
        </div>
        <div>
          <h4>HAAG</h4>
          <ul>
            <li><a href={withBase('/')}>Our Mission</a></li>
            <li><a href={withBase('/people')}>People</a></li>
            <li><a href={withBase('/recruitment')}>Recruitment Status</a></li>
          </ul>
        </div>
      </div>
      <div className="gt-footer-bottom">
        © 2026 Georgia Institute of Technology · Human-Augmented Analytics Group
      </div>
    </footer>
  );
}

export function FooterB() {
  return (
    <footer className="gt-footer">
      <div className="gt-footer-inner">
        <div>
          <h4>Georgia Institute of Technology</h4>
          <p>
            North Avenue<br />
            Atlanta, GA 30332<br />
            +1 404.894.2000
          </p>
        </div>
        <div>
          <h4>General</h4>
          <ul>
            <li><a href="#">Directory</a></li>
            <li><a href="#">Employment</a></li>
            <li><a href="#">Emergency Information</a></li>
          </ul>
        </div>
        <div>
          <h4>HAAG</h4>
          <ul>
            <li><a href="#">About HAAG</a></li>
            <li><a href="#">Programs</a></li>
            <li><a href={withBase('/recruitment')}>Recruitment Status</a></li>
          </ul>
        </div>
      </div>
      <div className="gt-footer-bottom">
        © 2026 Georgia Institute of Technology · Human-Augmented Analytics Group
      </div>
    </footer>
  );
}
