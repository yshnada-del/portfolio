import project02 from './project02.html?raw';
import project03 from './project03.html?raw';
import project04 from './project04.html?raw';
import navigation from './navigation.js?raw';
import project02Ending from '../../assets/project-02-simmons-last.png';
import pretendardRegular from '../../assets/fonts/Pretendard-Regular.woff2';
import pizzaVisualSystem from './pizzaVisualSystem.html?raw';
import pizzaMainWeb from '../../assets/project-04-main-web.png';
import pizzaCleanCover from '../../assets/project-04-cover-clean.png';

const pizzaSystemAssets = import.meta.glob('../../assets/pizza-system/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

const documents = {
  'project-02': project02,
  'project-03': project03,
  'project-04': project04,
};

export function getProposalDocument(project) {
  let document = documents[project.id];
  if (project.id === 'project-04') {
    const visualSystem = pizzaVisualSystem.replace(/__PIZZA_SYSTEM_(\w+)__/g, (_, name) => {
      const asset = Object.entries(pizzaSystemAssets).find(([path]) => path.split('/').pop().split('.')[0] === name);
      return new URL(asset[1], window.location.href).href;
    });
    document = document.replace(/<\/body>/i, `${visualSystem}</body>`);
  }
  // Preserve the original document and resolve its scripts, styles and media to its own site.
  return document
    .replace('__PIZZA_CLEAN_COVER__', new URL(pizzaCleanCover, window.location.href).href)
    .replaceAll('__PIZZA_MAIN_WEB__', new URL(pizzaMainWeb, window.location.href).href)
    .replace('__PROJECT_02_ENDING__', new URL(project02Ending, window.location.href).href)
    .replace('__PRETENDARD_REGULAR__', new URL(pretendardRegular, window.location.href).href)
    .replace(/<head>/i, `<head><base href="${project.proposalUrl}" />`)
    .replace(/<\/head>/i, `<style>
      html { scroll-behavior: smooth; }
      * { scrollbar-width: none !important; }
      ::-webkit-scrollbar { display: none !important; width: 0; height: 0; }
      @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
    </style></head>`)
    .replace(/<\/body>/i, `<script>${navigation}</script></body>`);
}
