import { readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

// Compose the portrait version from the current cover's native artwork. The
// phone screen and QR remain the exact cover pixels, rather than redrawn UI.
const cover = await readFile(new URL('../src/assets/project-01-cover.png', import.meta.url));
const data = `data:image/png;base64,${cover.toString('base64')}`;
const crop = (x, y, width, height, viewBox) => `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet"><use href="#cover"/></svg>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1536" viewBox="0 0 1024 1536">
  <defs>
    <image id="cover" href="${data}" width="3840" height="2160"/>
    <g id="paw" fill="#b8a2ff"><ellipse cx="0" cy="6" rx="11" ry="9"/><ellipse cx="-13" cy="-6" rx="5" ry="7" transform="rotate(-25 -13 -6)"/><ellipse cx="-3" cy="-13" rx="5" ry="7"/><ellipse cx="9" cy="-12" rx="5" ry="7" transform="rotate(20 9 -12)"/><ellipse cx="18" cy="-1" rx="5" ry="7" transform="rotate(35 18 -1)"/></g>
    <path id="star" d="M0-16Q3-3 16 0Q3 3 0 16Q-3 3-16 0Q-3-3 0-16" fill="#baa9e3"/>
  </defs>
  <rect width="1024" height="1536" fill="#f2eefc"/>
  <use href="#paw" transform="translate(112 75) scale(1.4)"/>
  <use href="#paw" transform="translate(905 137) scale(.85)"/>
  <use href="#star" transform="translate(700 61) scale(1.1)"/>
  <use href="#star" transform="translate(120 367) scale(1.1)"/>
  <use href="#paw" transform="translate(126 686) scale(.8)"/>
  <use href="#star" transform="translate(887 643) scale(1.1)"/>
  <use href="#paw" transform="translate(888 1000) scale(1.1)"/>
  <use href="#star" transform="translate(130 1083)"/>
  <use href="#paw" transform="translate(124 1310) scale(1.1)"/>
  <use href="#star" transform="translate(920 1178) scale(.8)"/>
  ${crop(165, 115, 710, 207, '380 790 1700 495')}
  ${crop(222, 352, 580, 1120, '2310 450 740 1430')}
  ${crop(825, 1327, 157, 157, '3120 1290 510 510')}
</svg>`;
await writeFile(new URL('../src/assets/project-01-cinema-poster-home.png', import.meta.url), new Resvg(svg).render().asPng());
console.log('Built portrait poster using the current Home mockup and cover QR.');
