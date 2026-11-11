// Full Figma artboards with URL captions removed in the source design.
// Keep these replacements keyed to the original proposal's section names.
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
  ]));
}
