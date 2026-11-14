import { withBase } from '../../../lib/links';
import './page.css';
import Redirect from '../../../components/Redirect';

// The original recruitment-status/team-matching.html was a redirect stub to
// the folder's index page (the recruitment status page). Its chrome differs
// from the main site (most nav links are placeholders), so it is reproduced
// here rather than built from the shared components.
export const metadata = {
  title: 'Recruitment Status | Human-Augmented Analytics Group',
  robots: { index: false, follow: false },
};

export default function RecruitmentStatusTeamMatchingPage() {
  return (
    <>
      <div className="gt-utility">
        <a href="#">Georgia Institute of Technology</a>
        <a href="#">GT Directory</a>
        <a href="#">Campus Map</a>
      </div>

      <div className="masthead">
        <div className="masthead-inner">
          <div className="eyebrow">HAAG · Recruitment</div>
          <h1>Human-Augmented Analytics Group</h1>
          <p className="sub">
            Advancing interdisciplinary data science collaboration through applied research and
            education.
          </p>
        </div>
      </div>

      <nav className="nav-bar">
        <div className="nav-inner">
          <a href={withBase('/recruitment-status')}>HAAG (Home)</a>
          <a href="#">Faculty Affiliates</a>
          <a href="#">PhD / Post-Doc</a>
          <a href="#">Data Science Research</a>
          <a href="#">Project Management</a>
          <a href="#">HAAG Project Explorer</a>
          <a href={withBase('/recruitment-status')}>Recruitment Status</a>
        </div>
      </nav>

      <div className="breadcrumb">
        <a href={withBase('/recruitment-status')}>HAAG</a>
        <span className="sep">/</span>
        <span className="here">Recruitment Status</span>
      </div>

      <div className="wrap">
        <h2 className="page-title">Recruitment Status</h2>
        <p className="page-desc">Team matching results are not published on the website.</p>
        <div className="hidden-card">
          <p>You are being redirected to the recruitment status page.</p>
        </div>
      </div>

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
              <li><a href={withBase('/recruitment-status')}>Recruitment Status</a></li>
            </ul>
          </div>
        </div>
        <div className="gt-footer-bottom">
          © 2026 Georgia Institute of Technology · Human-Augmented Analytics Group
        </div>
      </footer>

      <Redirect to="/recruitment-status" />
    </>
  );
}
