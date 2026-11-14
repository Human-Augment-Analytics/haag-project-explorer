import './page.css';
import { UtilityBar, Nav, Masthead, Breadcrumb, FooterB } from '../../components/Chrome';
import Redirect from '../../components/Redirect';

// The original team-matching.html was a redirect stub to recruitment.html —
// preserved as-is (same chrome, same stub card, meta refresh + JS redirect).
export const metadata = {
  title: 'Recruitment Status | Human-Augmented Analytics Group',
  robots: { index: false, follow: false },
};

export default function TeamMatchingPage() {
  return (
    <>
      <UtilityBar />
      <Masthead
        eyebrow="HAAG · Recruitment"
        title="Human-Augmented Analytics Group"
        sub="Advancing interdisciplinary data science collaboration through applied research and education."
      />
      <Nav variant="B" />
      <Breadcrumb here="Recruitment Status" />
      <div className="wrap">
        <h2 className="page-title">Recruitment Status</h2>
        <p className="page-desc">Team matching results are not published on the website.</p>
        <div className="hidden-card">
          <p>You are being redirected to the recruitment status page.</p>
        </div>
      </div>
      <FooterB />
      <Redirect to="/recruitment" />
    </>
  );
}
