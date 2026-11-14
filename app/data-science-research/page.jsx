import './page.css';
import ArticlePage from '../../components/ArticlePage';
import { getContentPage } from '../../lib/data';

export const metadata = {
  title: 'Research (FAIR-CS) | Human-Augmented Analytics Group',
};

export default function DataScienceResearchPage() {
  const data = getContentPage('data-science-research');
  return <ArticlePage data={data} navCurrent="research" breadcrumb="Research (FAIR-CS)" />;
}
