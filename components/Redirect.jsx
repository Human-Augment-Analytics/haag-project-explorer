'use client';

// The old team-matching pages were redirect stubs: a meta refresh plus
// window.location.replace(). Both are preserved here (React hoists the
// <meta> tag into <head>).
import { useEffect } from 'react';
import { withBase } from '../lib/links';

export default function Redirect({ to }) {
  const target = withBase(to);
  useEffect(() => {
    window.location.replace(target);
  }, [target]);
  return <meta httpEquiv="refresh" content={`0; url=${target}`} />;
}
