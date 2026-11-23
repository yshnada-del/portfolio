import project02 from './project02.html?raw';
import project03 from './project03.html?raw';
import navigation from './navigation.js?raw';
import project02Ending from '../../assets/project-02-simmons-last.png';
import pretendardRegular from '../../assets/fonts/Pretendard-Regular.woff2';
import responsiveStyles from './responsive.css?raw';
import responsiveScript from './responsive.js?raw';
import scrollHintStyles from './scrollHint.css?raw';
import scrollHintScript from './scrollHint.js?raw';

function withProposalScrollHint(document, projectId) {
  return document
    .replace(/<html\b/i, `<html data-project="${projectId}"`)
    .replace(/<\/head>/i, `<style>${scrollHintStyles}</style></head>`)
    .replace(/<\/body>/i, `<script>${scrollHintScript}</script></body>`);
}

export function withResponsiveProposal(document, projectId = 'project-01', imageAssets = {}) {
  return withProposalScrollHint(document, projectId)
    .replace(/<\/head>/i, `<style>${responsiveStyles}</style></head>`)
    .replace(/<\/body>/i, `<script>window.proposalImageAssets = ${JSON.stringify(imageAssets)};</script><script>${responsiveScript}</script></body>`);
}

export async function getOriginalProposalDocument(projectId, url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Proposal could not be loaded (${response.status})`);
  const document = await response.text();
  return withProposalScrollHint(
    document.replace(/<head\b[^>]*>/i, head => `${head}<base href="${url}" />`),
    projectId,
  );
}

const documents = {
  'project-02': project02,
  'project-03': project03,
};

export function getProposalDocument(project) {
  // Preserve the original document and resolve its scripts, styles and media to its own site.
  return withResponsiveProposal(documents[project.id]
    .replace('__PROJECT_02_ENDING__', new URL(project02Ending, window.location.href).href)
    .replace('__PRETENDARD_REGULAR__', new URL(pretendardRegular, window.location.href).href)
    .replace(/<head>/i, `<head><base href="${project.proposalUrl}" />`)
    .replace(/<\/head>/i, `<style>
      html { scroll-behavior: smooth; }
      * { scrollbar-width: none !important; }
      ::-webkit-scrollbar { display: none !important; width: 0; height: 0; }
      @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
    </style></head>`)
    .replace(/<\/body>/i, `<script>${navigation}</script></body>`), project.id);
}
