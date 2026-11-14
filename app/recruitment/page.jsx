import './page.css';
import { UtilityBar, Nav, Masthead, Breadcrumb, FooterB } from '../../components/Chrome';
import {
  getRecruitment,
  getFaqSections,
  formatDisplayValue,
  phaseStates,
  currentPhaseLabel,
} from '../../lib/data';

export const metadata = {
  title: 'Recruitment Status | Human-Augmented Analytics Group',
};

const BUZZME_URL =
  'https://buzzme.cc.gatech.edu/research/project/search/?instructor_of_record=Breanna%20Shi&title=&description_content=&recommended_skills_content=';
const QUALTRICS_URL = 'https://gatech.co1.qualtrics.com/jfe/form/SV_86XF2sy4ZpbOLYy';

// Same transform as the old page's formatFaqAnswer(): escape, blank lines
// become paragraph breaks, single newlines become <br>, wrapped in <p>.
function faqAnswerHtml(answer) {
  const escaped = String(answer ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return '<p>' + escaped.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
}

export default function RecruitmentPage() {
  const data = getRecruitment();
  const faqSections = getFaqSections();
  const phases = phaseStates(data);
  const updated = formatDisplayValue(data.last_updated) || 'unknown';

  return (
    <>
      <UtilityBar links={['Georgia Institute of Technology', 'GT Directory']} />
      <Masthead
        eyebrow="HAAG · Recruitment"
        title="Human-Augmented Analytics Group"
        sub="Advancing interdisciplinary data science collaboration through applied research and education."
      />
      <Nav current="recruitment" variant="B" />
      <Breadcrumb here="Recruitment Status" />
      <div className="wrap">
        <div className="grid">
          <div>
            <h2 className="page-title">Recruitment Cycle Status</h2>
            <p className="page-desc">
              A live, always-current view of where HAAG stands in its recruitment cycle, from
              applications opening on BuzzMe through final team placements.
            </p>
            <div id="content">
              <div className="status-banner">
                <div className="top-row">
                  <div>
                    <div className="label">Current Phase</div>
                    <div className="phase">{currentPhaseLabel(data)}</div>
                  </div>
                  <div className="cycle">{data.cycle_name || ''}</div>
                </div>
                <div className="updated">Last updated {updated}</div>
              </div>

              {data.notes ? <div className="notes">{String(data.notes).trim()}</div> : null}

              <div className="side-card apply apply-flow">
                <h3>CS 8903 Application</h3>
                <p>
                  Applying for 8903 credit? You must first submit a BuzzMe application for the
                  main project you want to join, then complete the 8903 application form.
                </p>
                <div className="cta-stack">
                  <a className="cta" href={BUZZME_URL} target="_blank" rel="noreferrer">
                    <span className="step">Step 1</span> Find your project on BuzzMe →
                  </a>
                  <a className="cta" href={QUALTRICS_URL} target="_blank" rel="noreferrer">
                    <span className="step">Step 2</span> Submit the 8903 application →
                  </a>
                </div>
              </div>

              <div className="log-heading">Cycle Log</div>
              <div className="timeline">
                {phases.map((p, i) => (
                  <div className={`phase-row ${p.state}`} key={p.key || i}>
                    <div className="rail">
                      <div className={`dot ${p.state}`}>{p.state === 'complete' ? '✓' : `P${i + 1}`}</div>
                      {!p.isLast && <div className={`line ${p.state === 'complete' ? 'complete' : ''}`}></div>}
                    </div>
                    <div className="phase-content">
                      <span className="phase-label">{p.label}</span>
                      {p.state === 'current' && <span className="badge current">Current</span>}
                      {p.state === 'complete' && <span className="badge complete">Complete</span>}
                      <div className="phase-desc">{p.description || ''}</div>
                    </div>
                  </div>
                ))}
              </div>

              {faqSections.length ? (
                <div className="faq-shell">
                  <div className="log-heading">Enrollment FAQs</div>
                  <div className="faq-grid">
                    {faqSections.map((section) => (
                      <section className="faq-card" id={section.key || 'faq-section'} key={section.key}>
                        <div className="faq-kicker">{section.eyebrow || 'FAQ'}</div>
                        <h3>{section.title || ''}</h3>
                        {section.description ? <p className="faq-desc">{section.description}</p> : null}
                        <div className="faq-list">
                          {(section.items || []).map((item, i) => (
                            <details className="faq-item" key={i}>
                              <summary>{item.question || ''}</summary>
                              <div
                                className="faq-answer"
                                dangerouslySetInnerHTML={{ __html: faqAnswerHtml(item.answer || '') }}
                              />
                            </details>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <div className="side-card">
              <h3>How this stays current</h3>
              <p>
                This page is driven by a single structured file maintained by the recruitment
                team. When the phase changes, the file is updated and this page reflects it
                automatically.
              </p>
            </div>
            <div className="side-card contact" id="contact-card">
              {data.contact ? (
                <>
                  <h3 id="contact-haag">Questions about this cycle?</h3>
                  <p>Jump to the right FAQ first, then reach out if you still need help.</p>
                  <div className="cta-stack">
                    <a className="cta" href="#faq-8903">8903 FAQ for New Researchers →</a>
                    <a className="cta" href="#faq-6999">6999 FAQ for Returning Project Track →</a>
                    <a className="cta" href={data.contact}>Additional questions? Contact HAAG →</a>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <FooterB />
    </>
  );
}
