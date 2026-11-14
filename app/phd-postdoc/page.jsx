import './page.css';
import ArticlePage from '../../components/ArticlePage';
import { getContentPage } from '../../lib/data';

export const metadata = {
  title: 'PhD / Post-Doc (CLEAR) | Human-Augmented Analytics Group',
};

export default function PhdPostdocPage() {
  const data = getContentPage('phd-postdoc');
  return <ArticlePage data={data} navCurrent="phd" breadcrumb="PhD / Post-Doc (CLEAR)" />;
}
