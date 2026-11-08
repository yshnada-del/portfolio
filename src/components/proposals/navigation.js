// Runs inside each proposal document so iframe scroll events reach the archive header.
const reportNavVisibility = (hidden) => {
  window.parent.postMessage(
    { type: 'proposal-nav-visibility', hidden },
    window.parent.location.origin
  );
};
const scrollPositions = new WeakMap();
document.addEventListener('scroll', (event) => {
  const scroller = event.target === document ? document.scrollingElement : event.target;
  if (!scroller) return;
  const nextTop = Math.max(0, scroller.scrollTop ?? window.scrollY ?? 0);
  const previousTop = scrollPositions.get(scroller) ?? 0;
  scrollPositions.set(scroller, nextTop);
  if (nextTop === 0) reportNavVisibility(false);
  else if (nextTop !== previousTop) reportNavVisibility(nextTop > previousTop);
}, { capture: true, passive: true });
document.addEventListener('wheel', (event) => {
  if (event.deltaY !== 0) reportNavVisibility(event.deltaY > 0);
}, { capture: true, passive: true });
window.addEventListener('load', () => reportNavVisibility(window.scrollY > 8));
