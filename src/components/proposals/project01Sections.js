// Current app screenshots in the desktop experience's 408 x 862 device frame.
// Retain the original section keys for both the proposal and enlargement.
import project01Cover from '../../assets/project-01-cover.png';
import project01UIDesign from '../../assets/project-01-ui-design.png';
const assets = import.meta.glob('../../assets/project-01-sections/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});

const sectionOrder = [
  'onboarding', 'login-page', 'health-01', 'health-02', 'calendar',
  'home-01', 'home-02', 'home-03', 'my-page', 'petstagram',
  'community-01', 'community-02', 'community-03', 'ai-chat',
];

export const project01SectionImages = sectionOrder.map((name) =>
  assets[`../../assets/project-01-sections/${name}.png`]);

export function getProject01Sections() {
  return Object.fromEntries(Object.entries(assets).map(([path, url]) => [
    path.split('/').pop().replace(/\.png$/, ''),
    new URL(url, window.location.href).href,
  ]).concat([
    ['cover',new URL(project01Cover,window.location.href).href],
    ['ui-design',new URL(project01UIDesign,window.location.href).href],
  ]));
}
