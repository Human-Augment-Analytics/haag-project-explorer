import { withBase } from '../../lib/links';
import './page.css';
import { UtilityBar, Nav, Masthead, Breadcrumb, FooterA } from '../../components/Chrome';

export const metadata = {
  title: 'Project Management (Practicum) | Human-Augmented Analytics Group',
};

export default function ProjectManagementPage() {
  return (
    <>
      <UtilityBar />
      <Masthead
        eyebrow="HAAG · OMSCS Practicum"
        title="Research Operations Project Management Practicum (MGT 8803 & CS 8803)"
        sub="Interdisciplinary research meets project management — MBA students partner with OMSCS students to manage real AI research projects."
      />
      <Nav current="pm" />
      <Breadcrumb here="Project Management (Practicum)" />
      <div className="article-grid">
        <div>
          <h2 className="h2">Learning Objectives</h2>
          <p className="body-text">After completing MGT 8803 / CS 8803, students should be able to:</p>
          <ul className="body-list">
            <li>Evaluate project management methodologies and frameworks for their effectiveness in interdisciplinary, research-driven teams spanning computer science, data science, and analytics.</li>
            <li>Develop a structured plan incorporating project management concepts to facilitate execution of a research initiative.</li>
            <li>Synthesize project outcomes, team dynamics, and risk management strategies into a professional report reflecting on the challenges and successes of managing interdisciplinary research.</li>
          </ul>

          <h2 className="h2">Core Instructional Team</h2>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">BS</div>
              <h4>Bree Shi</h4>
              <div className="role">Director of HAAG</div>
              <p>Founded HAAG in Summer 2024; leads administration and outreach.</p>
            </div>
            <div className="team-card">
              <div className="team-avatar">NL</div>
              <h4>Nick Lytle, Ph.D</h4>
              <div className="role">Director, OMSCS Research</div>
              <p>Creator and instructor of the open research course CS 8803.</p>
            </div>
            <div className="team-card">
              <div className="team-avatar">CA</div>
              <h4>Charlotte Alexander, J.D.</h4>
              <div className="role">Professor of Law &amp; Ethics</div>
              <p>Scheller College of Business; empirical and computational methods for court-system research.</p>
            </div>
          </div>

          <h2 className="h2">Course Description</h2>
          <p className="body-text">A project-driven course in which MBA students partner with OMSCS students to manage research projects involving novel data, analytics, and computer science methods — past projects have spanned computer vision, generative AI, and NLP. Working in pairs or small teams, students embed in larger ongoing HAAG research projects, combining MBA project management expertise with OMSCS subject-matter knowledge.</p>
          <p className="body-text">Students are assessed on two components: their contribution to managing the operations of the research group, and their work on a project management initiative of their own choosing. As an option (subject to instructor approval), students may also join the authorship team on articles written about their assigned project.</p>
          <p className="body-text">The course suits MBA students with an interest in computer science or analytics and a project management background (including those accumulating certification hours), as well as OMSCS students with computational expertise who want to build project management skills.</p>

          <h2 className="h2">Course Grading</h2>
          <div className="grade-row">
            <div className="grade-card">
              <div className="pct">60%</div>
              <h4>Course Deliverables</h4>
            </div>
            <div className="grade-card">
              <div className="pct">40%</div>
              <h4>Attendance &amp; Participation</h4>
            </div>
          </div>
          <p className="body-text">Work is documented across three staged reports — initial proposal, mid-term, and final — each covering both operations (managing the ongoing research project) and initiative (progress on the student&apos;s chosen project management focus, e.g. communication strategy, team dynamics, or tooling). Pairs or small groups receive a shared grade; attendance and participation are graded individually.</p>

          <h3 className="h3">Course Deliverables</h3>
          <div className="deliverable-item">
            <h4>Initial Proposal</h4>
            <p>Students define and scope their chosen project management initiative at the start of the semester, in writing and presented in class.</p>
          </div>
          <div className="deliverable-item">
            <h4>Mid-term Report</h4>
            <p>Covers operations role and initiative progress, with reflection on successes, challenges, and plans for the rest of the semester.</p>
          </div>
          <div className="deliverable-item">
            <h4>Final Report</h4>
            <p>Addresses the same two topics across the full semester&apos;s work.</p>
          </div>

          <h3 className="h3">Course Policies</h3>
          <p className="body-text">Regular attendance and engaged participation are expected, with cameras on for virtual meetings; repeated unexcused absences affect the participation grade. Students are responsible for all material posted on Canvas, Basecamp, email, or Slack. Academic honesty follows Georgia Tech&apos;s Honor Code in full; suspected violations are referred to the Office of Student Integrity. Instructors reserve the right to adjust syllabus policies as needed.</p>
          <div className="callout">Disability accommodation is coordinated through Georgia Tech&apos;s Office of Disability Services (disabilityservices.gatech.edu) — students seeking accommodation should review the student guide and documentation requirements there.</div>

          <h3 className="h3">Additional Student Resources</h3>
          <div className="resource-list">
            <a href="https://cm.maxient.com/reportingform.php?GeorgiaTech=&layout_id=4/">Dean of Students</a>
            <br />
            <a href="https://disabilityservices.gatech.edu/">Disability Services</a>
            <br />
            <a href="https://belonging.gatech.edu/studentsupport">Belonging &amp; Student Support</a>
            <br />
            <a href="https://veterans.gatech.edu/">Veterans Resource Center</a>
            <br />
            <a href="https://mentalhealth.gatech.edu/">Center for Mental Health Care &amp; Resources</a>
            <br />
            <a href="https://wellnesscenter.gatech.edu/node/47">Voice (Sexual &amp; Relationship Violence Prevention)</a>
            <br />
            <a href="https://students.gatech.edu/student-resource-guide">General Resource Guide</a>
          </div>
        </div>
        <div>
          <div className="side-card">
            <h3>Related programs</h3>
            <ul>
              <li><a href={withBase('/faculty-affiliates')}>FATE — faculty affiliates</a></li>
              <li><a href={withBase('/data-science-research')}>FAIR-CS — the OMSCS research course</a></li>
              <li><a href={withBase('/project-explorer')}>Browse past &amp; current projects</a></li>
            </ul>
          </div>
          <div className="side-card contact">
            <h3>Questions about this course?</h3>
            <p>Contact Charlie Clark, HAAG Head TA.</p>
            <a className="cta-link" href="mailto:haag@gatech.edu">Contact HAAG →</a>
          </div>
        </div>
      </div>
      <FooterA />
    </>
  );
}
