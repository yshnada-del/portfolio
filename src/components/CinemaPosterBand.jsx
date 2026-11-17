import { useLayoutEffect, useRef } from 'react';
import { createCinemaSurface, rectangleToQuad } from './cinemaSurface.js';

export default function CinemaPosterBand({ children }) {
  const bandRef = useRef(null);

  useLayoutEffect(() => {
    const band = bandRef.current;
    const posters = Array.from(band.querySelectorAll('.cinema-poster'));
    let active = true;
    let frame;
    const update = () => {
      if (!active) return;
      const bounds = band.getBoundingClientRect();
      const list = band.querySelector('.cinema-posters').getBoundingClientRect();
      const width = document.documentElement.clientWidth;
      const height = band.offsetHeight;
      if (!width || !height) return;
      const project = createCinemaSurface(width, height, window.innerHeight);
      posters.forEach(poster => {
        const x = list.left + poster.offsetLeft;
        const y = list.top - bounds.top + poster.offsetTop;
        const w = poster.offsetWidth;
        const h = poster.offsetHeight;
        poster.dataset.depthSide = x + w / 2 < width / 2 ? 'left' : 'right';
        const corners = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]
          .map(([px, py]) => {
            const point = project(px, py);
            return { x: point.x - x, y: point.y - y };
          });
        poster.style.transform = `matrix3d(${rectangleToQuad(w, h, corners).join(',')})`;
      });
    };
    const schedule = () => {
      if (!active) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(band);
    observer.observe(band.querySelector('.cinema-posters'));
    window.addEventListener('resize', schedule);
    document.fonts.ready.then(schedule);
    update();
    return () => {
      active = false;
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      window.cancelAnimationFrame(frame);
      posters.forEach(poster => {
        poster.style.removeProperty('transform');
        delete poster.dataset.depthSide;
      });
    };
  }, []);

  return (
    <div ref={bandRef} className="cinema-poster-band">
      {children}
    </div>
  );
}
