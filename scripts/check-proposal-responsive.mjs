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
postcss.parse(css);
new vm.Script(script);
const module = fs.readFileSync('src/components/proposals/documents.js', 'utf8');
const fn = module.slice(module.indexOf('export function withResponsiveProposal'), module.indexOf('const pizzaSystemAssets')).replace('export ', '');
const inject = new Function('responsiveStyles', 'responsiveScript', `${fn}; return withResponsiveProposal;`)(css, script);
for (const id of ['project-01', 'project-02', 'project-03', 'project-04']) {
  const input = fs.readFileSync(id === 'project-01' ? 'src/components/project01Proposal.html' : `src/components/proposals/${id.replace('-', '')}.html`, 'utf8');
  const output = inject(input, id);
  assert.ok(output.includes(`<html data-project="${id}"`));
  assert.ok(output.indexOf(css) > output.indexOf('rel="stylesheet"'));
  assert.ok(output.indexOf(css) < output.indexOf('</head>'));
  assert.ok(output.includes(`<script>${script}</script>`));
}
console.log('PASS: viewport boundaries, all four proposal injections, CSS parsing, and injected script syntax.');
