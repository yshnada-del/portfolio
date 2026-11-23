(() => {
  if (/^project-0[1-3]$/.test(document.documentElement.dataset.project || '')) {
    const topButton = document.createElement('button');
    topButton.type = 'button';
    topButton.className = 'proposal-back-to-top';
    topButton.setAttribute('aria-label', '기획서 맨 위로 이동');
    topButton.title = '맨 위로';
    topButton.innerHTML = '<span class="proposal-back-to-top__icon" aria-hidden="true">▲</span><span>TOP</span>';
    document.body.append(topButton);
    const scrollContainers = new Set([document.scrollingElement]);
    document.addEventListener('scroll', (event) => {
      const target = event.target === document ? document.scrollingElement : event.target;
      if (target instanceof HTMLElement && target.scrollHeight > target.clientHeight) scrollContainers.add(target);
    }, { capture: true, passive: true });
    topButton.addEventListener('click', () => {
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
      window.scrollTo({ top: 0, behavior });
      scrollContainers.forEach(container => {
        if (container?.isConnected && container.scrollTop > 0) container.scrollTo({ top: 0, behavior });
      });
    });
  }
  const zoomable = window.matchMedia('(max-width: 1599px)');
  const dialog = document.createElement('dialog');
  dialog.className = 'proposal-image-dialog';
  dialog.setAttribute('aria-label', '디자인 이미지 확대');
  dialog.innerHTML = '<button type="button" class="proposal-image-dialog__close">닫기 ×</button><div class="proposal-image-dialog__scroll"><img alt=""></div>';
  document.body.append(dialog);
  const close = dialog.querySelector('button');
  const largeImage = dialog.querySelector('img');
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', (event) => { if (event.key === 'Escape') event.stopPropagation(); });

  const imageSelector = '.figma-cover-image, .pain-figma-image, .persona-figma-image, .mvp-figma-image, .insight-figma-image, .ui-design-figma-image, .ia-tree-image, .survey-board-image, .wireframe-figma-image, .figma-flow-image, .hero-figma-frame, .simmons-ending img, .proposal-ending img, .comparison-pair__shot img, .flow-ia-figure img, .wireframe-frame img, .figma-frame-card img, .persona-figma-stack img, .ia-image-wrap img, .service-concept__image';
  const openImage = (image) => {
    if (!zoomable.matches || !image.naturalWidth) return;
    largeImage.src = image.currentSrc || image.src;
    largeImage.alt = image.alt;
    largeImage.style.width = `${image.naturalWidth}px`;
    dialog.showModal();
    dialog.querySelector('.proposal-image-dialog__scroll').scrollTo(0, 0);
    close.focus();
  };
  const enhanceTables = () => {
    document.querySelectorAll('.compare-table, .process-board').forEach((table) => {
      if (table.dataset.scrollReady) return;
      table.dataset.scrollReady = 'true';
      table.classList.add('proposal-scroll-region');
      table.tabIndex = 0;
      table.setAttribute('role', 'region');
      table.setAttribute('aria-label', `${table.getAttribute('aria-label') || '비교표'} — 좌우로 스크롤하여 전체 보기`);
    });
    document.querySelectorAll('table').forEach((table) => {
      if (table.parentElement.classList.contains('proposal-scroll-region')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'proposal-scroll-region';
      wrapper.tabIndex = 0;
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', '표 — 좌우로 스크롤하여 전체 보기');
      table.before(wrapper);
      wrapper.append(table);
    });
  };
  const marketObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-market-active');
      marketObserver.unobserve(entry.target);
    });
  }, { threshold: 0.28 });
  const enhanceImages = () => {
    if (document.documentElement.dataset.project === 'project-01') {
      document.querySelectorAll('.market-circles:not(.is-market-ready)').forEach((circles) => {
        circles.classList.add('is-market-ready');
        marketObserver.observe(circles);
      });
    }
    document.querySelectorAll(imageSelector).forEach((image) => {
      if (image.dataset.zoomReady) return;
      image.dataset.zoomReady = 'true';
      const sectionName = image.classList.contains('figma-cover-image')?'cover':new URL(image.src).pathname.match(/\/sections\/([^/]+)\.png$/)?.[1];
      const replacement = window.proposalImageAssets?.[sectionName];
      if (document.documentElement.dataset.project === 'project-01' && replacement) {
        image.src = replacement;
      }
      image.classList.add('proposal-zoomable');
      const toggleAccess = () => {
        if (zoomable.matches) {
          image.setAttribute('role', 'button'); image.tabIndex = 0;
          image.setAttribute('aria-label', `${image.alt || '디자인 이미지'} 크게 보기`);
          image.title = '이미지를 눌러 크게 보기';
        } else { image.removeAttribute('role'); image.removeAttribute('tabindex'); image.removeAttribute('aria-label'); image.removeAttribute('title'); }
      };
      toggleAccess();
      zoomable.addEventListener('change', toggleAccess);
      image.addEventListener('click', () => openImage(image));
      image.addEventListener('keydown', (event) => {
        if (zoomable.matches && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); openImage(image); }
      });
    });
    enhanceTables();
  };
  let pending;
  const schedule = () => { cancelAnimationFrame(pending); pending = requestAnimationFrame(enhanceImages); };
  const observer = new MutationObserver(schedule);
  observer.observe(document.getElementById('root'), { childList: true, subtree: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  enhanceImages();
})();
