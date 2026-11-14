import './page.css';
import { UtilityBar, Nav, Masthead, Breadcrumb, FooterA } from '../../components/Chrome';
import { getRawProjects } from '../../lib/data';
import { buildPublicProjects } from '../../lib/projects';
import ExplorerClient from './ExplorerClient';

export const metadata = {
  title: 'Project Explorer',
};

export default function ProjectExplorerPage() {
  const projects = buildPublicProjects(getRawProjects());
  return (
    <>
      <UtilityBar />
      <Masthead
        eyebrow="HAAG · Project Explorer"
        title="Browse Active HAAG Research Projects"
        sub="Explore public project metadata across faculty teams, research categories, and recruiting status. Use filters to quickly find work aligned with your interests."
      />
      <Nav current="explorer" variant="B" />
      <Breadcrumb here="Project Explorer" />
      <main className="page">
        <h2 className="page-title">Project Directory</h2>
        <p className="page-desc">
          Filter by faculty, recruitment, status, and categories to explore the research conducted
          under HAAG.
        </p>
        <ExplorerClient projects={projects} />
      </main>
      <FooterA />
    </>
  );
}
