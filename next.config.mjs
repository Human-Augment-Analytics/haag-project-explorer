// BASE_PATH sets the URL prefix the site is served under, e.g. /haag-project-explorer
// for GitHub Pages project sites. Leave it unset (or "/") when the site is served
// from the root of a domain.
const rawBasePath = (process.env.BASE_PATH || '').trim().replace(/\/+$/, '');
const basePath = rawBasePath === '' || rawBasePath === '/' ? '' : rawBasePath;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: `npm run build` writes plain HTML/CSS/JS to out/,
  // matching how the old hand-written site was deployed.
  output: 'export',
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
