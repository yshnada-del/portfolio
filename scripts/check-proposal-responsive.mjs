import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import postcss from 'postcss';
import { getArchiveFrameLayout } from '../src/components/archiveFrameLayout.js';

// A desktop shell can contain a phone/tablet sized film. Never turn it into
// a desktop artboard, or the proposal's media queries will select the wrong layout.
for (const viewportWidth of [767, 768, 1279, 1280, 1919, 1920, 2560]) {
  for (const width of [320, 390, 680, 767, 768, 1024, 1279, 1280, 1440, 1920]) {
    if (width > viewportWidth) continue;
    const layout = getArchiveFrameLayout({ width, height: 760, viewportWidth, nativePage: false });
    assert.equal(layout.width, width);
    assert.equal(layout.height, 760);
    assert.equal(layout.scale, 1);
  }
}

const css = fs.readFileSync('src/components/proposals/responsive.css', 'utf8');
const script = fs.readFileSync('src/components/proposals/responsive.js', 'utf8');
const hintCss = fs.readFileSync('src/components/proposals/scrollHint.css', 'utf8');
const hintScript = fs.readFileSync('src/components/proposals/scrollHint.js', 'utf8');
postcss.parse(css);
postcss.parse(hintCss);
new vm.Script(script);
new vm.Script(hintScript);
const module = fs.readFileSync('src/components/proposals/documents.js', 'utf8');
const fn = module.slice(module.indexOf('function withProposalScrollHint'), module.indexOf('const documents')).replaceAll('export ', '');
const getInjections = new Function('responsiveStyles', 'responsiveScript', 'scrollHintStyles', 'scrollHintScript', 'fetch',
  `${fn}; return { withResponsiveProposal, getOriginalProposalDocument };`);
const originalPage = '<html lang="ko"><head><title>Pizza Hut</title></head><body><div id="root"></div></body></html>';
const { withResponsiveProposal: inject, getOriginalProposalDocument } = getInjections(css, script, hintCss, hintScript,
  async () => ({ ok: true, text: async () => originalPage }));
for (const id of ['project-01', 'project-02', 'project-03']) {
  const input = fs.readFileSync(id === 'project-01' ? 'src/components/project01Proposal.html' : `src/components/proposals/${id.replace('-', '')}.html`, 'utf8');
  const output = inject(input, id);
  assert.ok(output.includes(`<html data-project="${id}"`));
  assert.ok(output.indexOf(css) > output.indexOf('rel="stylesheet"'));
  assert.ok(output.indexOf(css) < output.indexOf('</head>'));
  assert.ok(output.includes(`<script>${script}</script>`));
  assert.ok(output.includes(`<script>${hintScript}</script>`));
}
const originalUrl = 'https://yshnada-del.github.io/pizzahutpage/';
const originalWithHint = await getOriginalProposalDocument('project-04', originalUrl);
assert.ok(originalWithHint.includes(`<base href="${originalUrl}" />`));
assert.ok(originalWithHint.includes(`<script>${hintScript}</script>`));
assert.ok(originalWithHint.includes(`<style>${hintCss}</style>`));
assert.ok(!originalWithHint.includes(css));
console.log('PASS: viewport boundaries, proposal injections, CSS parsing, and injected script syntax.');
