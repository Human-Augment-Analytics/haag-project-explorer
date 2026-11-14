import './page.css';
import { UtilityBar, Nav, Masthead, Breadcrumb, FooterA } from '../../components/Chrome';
import { getPeople } from '../../lib/data';
import PeopleClient from './PeopleClient';

export const metadata = {
  title: 'People | Human-Augmented Analytics Group',
};

export default function PeoplePage() {
  const { researchers, features } = getPeople();
  return (
    <>
      <UtilityBar />
      <Masthead
        eyebrow="HAAG · Our People"
        title="Meet the HAAG Research Community"
        sub="Faculty, PhD researchers, postdocs, and students working across disciplines and AI. This directory is generated from a single data file — add a researcher and push, no code changes required."
      />
      <Nav current="people" />
      <Breadcrumb here="People" />
      <div className="wrap">
        <h2 className="page-title">Researcher Directory</h2>
        <p className="page-desc">Search or filter by role and research area to find a collaborator.</p>
        <PeopleClient researchers={researchers} features={features} />
      </div>
      <FooterA />
    </>
  );
}
