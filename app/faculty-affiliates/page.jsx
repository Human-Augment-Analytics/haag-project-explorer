import './page.css';
import ArticlePage from '../../components/ArticlePage';
import { getContentPage } from '../../lib/data';

export const metadata = {
  title: 'Faculty Affiliates (FATE) | Human-Augmented Analytics Group',
};

export default function FacultyAffiliatesPage() {
  const data = getContentPage('faculty-affiliates');
  return <ArticlePage data={data} navCurrent="faculty" breadcrumb="Faculty Affiliates" />;
}
