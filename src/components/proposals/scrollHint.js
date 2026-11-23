(() => {
  const root = document.getElementById('root');
  const coverSelector = {
    'project-01': '.cover.cover-figma',
    'project-02': '.hero-figma-frame',
    'project-03': '.hero',
    'project-04': '.hero',
  }[document.documentElement.dataset.project];
  if (!root || !coverSelector) return;

  const hint = document.createElement('button');
  hint.type = 'button';
  hint.className = 'proposal-scroll-hint proposal-scroll-hint--cover-boundary';
  hint.setAttribute('aria-label', '아래로 스크롤하여 기획서 보기');
  hint.innerHTML = '<span class="proposal-scroll-hint__mouse" aria-hidden="true"><span></span></span><span class="proposal-scroll-hint__label">SCROLL DOWN</span>';
  document.body.append(hint);

  let scroller = document.scrollingElement;
  let pendingUpdate = 0;

  const updateHint = () => {
    const hidden = scroller.scrollTop > 0;
    hint.classList.toggle('proposal-scroll-hint--hidden', hidden);
    hint.setAttribute('aria-hidden', String(hidden));
    hint.tabIndex = hidden ? -1 : 0;
    if (hidden) return;

    // The Simmons cover is 16:9. Keep its baseline even on projects with taller covers.
    const simmonsCoverBottom = window.innerWidth * 9 / 16;
    const boundary = Math.min(simmonsCoverBottom, window.innerHeight - hint.offsetHeight + 16);
    hint.style.setProperty('--proposal-cover-boundary', `${boundary}px`);
  };

  const syncLayout = () => {
    pendingUpdate = 0;
    const cover = root.querySelector(coverSelector);
    scroller = document.scrollingElement;
    for (let element = cover?.parentElement; element && element !== scroller; element = element.parentElement) {
      if (element.scrollHeight > element.clientHeight && /auto|scroll/.test(getComputedStyle(element).overflowY)) {
        scroller = element;
        break;
      }
    }
    updateHint();
  };

  const scheduleLayout = () => {
    if (!pendingUpdate) pendingUpdate = requestAnimationFrame(syncLayout);
  };
  const resize = new ResizeObserver(scheduleLayout);
  resize.observe(root);
  new MutationObserver(scheduleLayout).observe(root, { childList: true, subtree: true });
  window.addEventListener('resize', scheduleLayout);
  window.addEventListener('pageshow', scheduleLayout);
  document.addEventListener('scroll', event => {
    const target = event.target === document ? document.scrollingElement : event.target;
    if (target === scroller) updateHint();
  }, { capture: true, passive: true });
  hint.addEventListener('click', () => {
    scroller.scrollBy({
      top: Math.max(240, scroller.clientHeight * .7),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  });
  syncLayout();
})();
