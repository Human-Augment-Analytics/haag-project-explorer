import { withBase } from '../lib/links';
import './home.css';
import { UtilityBar, Nav, FooterA } from '../components/Chrome';
import { getProjectCount } from '../lib/data';

export const metadata = {
  title: 'Human-Augmented Analytics Group | Georgia Tech',
};

export default function HomePage() {
  const projectCount = getProjectCount();
  return (
    <>
      <UtilityBar />
      <Nav current="home" />

      <div className="hero">
        <div className="hero-inner">
          <div className="eyebrow">Human-Augmented Analytics Group</div>
          <h1>Advancing interdisciplinary data science through human-AI partnership</h1>
          <p className="sub">
            An experimental virtual laboratory connecting researchers and domain experts to
            democratize AI implementation across disciplines.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-gold" href={withBase('/recruitment')}>Become a Researcher →</a>
            <a className="btn btn-outline" href="#mission">Explore Our Mission</a>
          </div>
        </div>
      </div>

      <div className="stat-wrap">
        <div className="stat-row">
          <div className="stat-card">
            <div className="num">125</div>
            <div className="lbl">Active Researchers</div>
            <span className="pill">since May 2024</span>
          </div>
          <div className="stat-card">
            <div className="num" id="project-count">{projectCount}</div>
            <div className="lbl">Research Projects</div>
            <span className="pill">and counting</span>
          </div>
          <div className="stat-card">
            <div className="num">4</div>
            <div className="lbl">Core Initiatives</div>
            <span className="pill">fully active</span>
          </div>
          <div className="stat-card">
            <div className="num">2024</div>
            <div className="lbl">Founded</div>
            <span className="pill">by Dr. Breanna Shi</span>
          </div>
        </div>
      </div>

      <div className="section" id="mission">
        <p className="intro-text">
          As AI transforms every field of science, partnerships between domain experts and AI
          practitioners are essential to ethical, impactful research that serves the greater good.
        </p>
        <div className="section-head">
          <div className="eyebrow">Our Mission</div>
          <h2>Four ways HAAG serves the research community</h2>
        </div>
        <div className="mission-grid">
          <div className="mission-card">
            <div className="idx">01</div>
            <h3>Applied Research Education</h3>
            <p>Training data scientists through hands-on interdisciplinary projects for academic credit.</p>
          </div>
          <div className="mission-card">
            <div className="idx">02</div>
            <h3>Leadership &amp; Project Management Development</h3>
            <p>Preparing future faculty and PhD researchers with experience-based training.</p>
          </div>
          <div className="mission-card">
            <div className="idx">03</div>
            <h3>Cross-Disciplinary Collaboration</h3>
            <p>Building sustainable partnerships between computational and domain experts.</p>
          </div>
          <div className="mission-card">
            <div className="idx">04</div>
            <h3>Research Acceleration</h3>
            <p>Expanding faculty capacity through virtual partnerships that minimize advisor fatigue.</p>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div className="eyebrow">Our Programs</div>
          <h2>Pathways for researchers at every stage</h2>
        </div>
        <div className="programs-grid">
          <div className="program-card">
            <span className="eyebrow2">OMSCS Students · CS 8903 &amp; CS 6999</span>
            <h3>Interdisciplinary Data Science Research for Social Good</h3>
            <p>HAAG&apos;s flagship program. Earn up to 3 semesters of academic credit for interdisciplinary projects.</p>
            <a className="cta-link" href={withBase('/data-science-research')}>Learn more →</a>
          </div>
          <div className="program-card">
            <span className="eyebrow2">Faculty · Any Global Institution</span>
            <h3>Faculty Affiliates for Transdisciplinary Expansion (FATE)</h3>
            <p>A community of practice for faculty advancing interdisciplinary science teams.</p>
            <a className="cta-link" href={withBase('/faculty-affiliates')}>Learn more →</a>
          </div>
          <div className="program-card">
            <span className="eyebrow2">OMSCS Students · MGT 8803 &amp; CS 8903</span>
            <h3>Research Operations Project Management Practicum</h3>
            <p>MBA and computing students partner to manage real AI research projects.</p>
            <a className="cta-link" href={withBase('/project-management')}>Learn more →</a>
          </div>
          <div className="program-card">
            <span className="eyebrow2">PhD &amp; Postdoc · Any Global Institute</span>
            <h3>Cross-Disciplinary Leadership Education for Advanced Researchers (CLEAR)</h3>
            <p>HAAG&apos;s premier leadership program for PhDs and postdocs in a live research environment.</p>
            <a className="cta-link" href={withBase('/phd-postdoc')}>Learn more →</a>
          </div>
          <div className="program-card">
            <span className="eyebrow2">Certificate Program · Graduate</span>
            <h3>Graduate Certificate in Experience-Based Teaching</h3>
            <p>Hands-on experience in pedagogy, research methodology, and collaborative project management.</p>
            <a className="cta-link" href="#">Learn more →</a>
          </div>
          <div className="program-card">
            <span className="eyebrow2">Program &amp; Departments · Community Partners</span>
            <h3>Transformative &amp; Outcome Driven Partnerships Interfacing Communities (TOPIC)</h3>
            <p>Promoting outreach led jointly by HAAG and community partners for mutual, lasting impact.</p>
            <a className="cta-link" href="#">Learn more →</a>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div className="eyebrow">Milestone Achievement</div>
          <h2>HAAG&apos;s growth since founding</h2>
        </div>
        <div className="timeline">
          <div className="phase-row">
            <div className="rail">
              <div className="dot">✓</div>
              <div className="line"></div>
            </div>
            <div className="phase-content">
              <span className="phase-label">May 2024 — Founded</span>
              <div className="phase-desc">
                HAAG launches as an experimental virtual laboratory with 15 founding members.
              </div>
            </div>
          </div>
          <div className="phase-row">
            <div className="rail">
              <div className="dot">✓</div>
              <div className="line"></div>
            </div>
            <div className="phase-content">
              <span className="phase-label">Four Core Initiatives Established</span>
              <div className="phase-desc">
                Applied Research Education, Leadership Development, Cross-Disciplinary
                Collaboration, and Research Acceleration formalized.
              </div>
            </div>
          </div>
          <div className="phase-row current">
            <div className="rail">
              <div className="dot current">Now</div>
            </div>
            <div className="phase-content">
              <span className="phase-label">
                January 2025 — 125 Researchers<span className="badge">Current</span>
              </span>
              <div className="phase-desc">
                HAAG now supports a growing portfolio of{' '}
                <span id="timeline-project-count">{projectCount}</span> research projects across a
                thriving, multi-disciplinary research community.
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterA />
    </>
  );
}
