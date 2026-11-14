// Shared layout for the three content/*.json-driven article pages
// (faculty-affiliates, data-science-research, phd-postdoc). The old pages
// shipped static fallback HTML and content-render-blocks.js replaced the
// masthead + article columns from the JSON at runtime; the port renders the
// same JSON at build time, so the exported HTML is the rendered result.
import { UtilityBar, Nav, Masthead, Breadcrumb, FooterA } from './Chrome';
import { MainBlocks, SidebarBlocks } from './Blocks';

export default function ArticlePage({ data, navCurrent, breadcrumb }) {
  const { masthead, main, sidebar } = data;
  return (
    <>
      <UtilityBar />
      <Masthead eyebrow={masthead.eyebrow} title={masthead.title} sub={masthead.sub} />
      <Nav current={navCurrent} />
      <Breadcrumb here={breadcrumb} />
      <div className="article-grid">
        <div>
          <MainBlocks blocks={main} />
        </div>
        <div>
          <SidebarBlocks blocks={sidebar} />
        </div>
      </div>
      <FooterA />
    </>
  );
}
