import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

// Reuse the site's original cassette artwork; the UI action text is a separate asset.
const source = await readFile(new URL('../src/assets/cassette-floater.svg', import.meta.url), 'utf8');
const cassette = source.replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<style>[\s\S]*?<\/style>/, '');
const output = new URL('../public/', import.meta.url);
await mkdir(output, { recursive: true });

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="72" fill="#edeae3"/>
  <g transform="translate(0 112) scale(.8)">${cassette}</g>
</svg>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <filter id="shadow" x="-20%" y="-30%" width="140%" height="170%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="12"/>
      <feOffset dy="10"/>
      <feComponentTransfer><feFuncA type="linear" slope=".25"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="#edeae3"/>
  <g filter="url(#shadow)"><g transform="translate(200 90) scale(1.25)">${cassette}</g></g>
</svg>`;

const render = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
await writeFile(new URL('favicon.svg', output), favicon);
await writeFile(new URL('og-image.svg', output), og);
await writeFile(new URL('og-image.png', output), render(og, 1200));
await writeFile(new URL('apple-touch-icon.png', output), render(favicon, 180));
for (const size of [16, 32, 192, 512]) {
  await writeFile(new URL(`favicon-${size}.png`, output), render(favicon, size));
}

// ICO directory with PNG entries for the browser's common tab icon sizes.
const sizes = [16, 32, 48];
const images = sizes.map(size => render(favicon, size));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, index) => {
  const entry = 6 + index * 16;
  header[entry] = size;
  header[entry + 1] = size;
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(images[index].length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += images[index].length;
});
await writeFile(new URL('favicon.ico', output), Buffer.concat([header, ...images]));
console.log('Created text-free VHS favicon, touch icons, and 1200×630 OG image in public/.');
