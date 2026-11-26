import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { getArchiveFrameLayout } from './archiveFrameLayout.js';
import { getArchiveUrl, getHomeUrl, getReelUrl } from '../routes.js';
import { isProjectEnabled } from '../projectVisibility.js';
import about from '../assets/about-cinema-poster.svg';
import project01 from '../assets/project-01-cinema-poster-home.png';
import project01Landscape from '../assets/project-01-cover.png';
import project02 from '../assets/project-02-cinema-poster.png';
import project03 from '../assets/project-03-cover.png';
import project04 from '../assets/project-04-cover-portrait.png';
import project04Film from '../assets/project-04-film-hero.png';
import contact from '../assets/contact-cinema-poster.png';

import cinemaExitSign from '../assets/cinema-exit-sign.svg';
import appLinkHandwritten from '../assets/app-link-handwritten.svg';
import siteLinkHandwritten from '../assets/site-link-handwritten.svg';
import cassetteArtwork from '../assets/cassette-floater.svg?raw';
import crtTv from '../assets/crt-tv.png';

const reelItems = [
  { id: 'about', label: 'ABOUT ME', image: about },
  { id: 'project-01', label: 'PROJECT 1', image: project01 },
  { id: 'project-02', label: 'PROJECT 2', image: project02 },
  { id: 'project-03', label: 'PROJECT 3', image: project03 },
  { id: 'project-04', label: 'PROJECT 4', image: project04, filmImage: project04Film },
  { id: 'contact', label: 'CONTACT ME', image: contact },
  { id: 'vhs', label: 'VHS PLAYER', image: crtTv },
].filter((item) => isProjectEnabled(item.id));

const itemUrl = (id) => id === 'vhs' ? getHomeUrl() : getArchiveUrl(id);
const reelStep = 360 / reelItems.length;
const centerIndex = reelItems.findIndex((item) => item.id === 'project-02');
const reelAngles = reelItems.map((_, index) => (index - centerIndex) * reelStep);
const snapRotation = (angle) => Math.round(angle / reelStep) * reelStep;
const reelPoint = (radius, angle) => {
  const radians = angle * Math.PI / 180;
  return `${Math.cos(radians) * radius} ${500 + Math.sin(radians) * radius}`;
};
// Open windows between the cast-metal spokes, cut through the reel face.
const reelWindows = reelAngles.map((angle) => (
  `M${reelPoint(180, angle - 20)} L${reelPoint(390, angle - 23)} A390 390 0 0 1 ${reelPoint(390, angle + 23)} L${reelPoint(180, angle + 20)} A180 180 0 0 0 ${reelPoint(180, angle - 20)} Z`
)).join(' ');
const chipBody = 'M-60 130L-149-56Q0-119 149-56L60 130Q0 110-60 130Z';
const chipWindow = 'M-50 108L-121-48Q0-96 121-48L50 108Q0 91-50 108Z';
let pendingFilmOrigin = null;

function FilmArtwork({ item, clipPath }) {
  if (item.filmImage) {
    return (
      <g clipPath={clipPath}>
        <path d={chipWindow} fill="#faf0e9" />
        <svg x="-123" y="-74" width="246" height="190" viewBox="65 115 950 734" preserveAspectRatio="xMidYMid slice">
          <image href={item.filmImage} width="1360" height="752" />
        </svg>
      </g>
    );
  }

  return <image href={item.image} x="-123" y="-74" width="246" height="190" preserveAspectRatio="xMidYMid slice" clipPath={clipPath} />;
}

export default function FilmReelProject({ activeId = 'project-01', document, source, title, action, frameRef }) {
  const screenRef = useRef(null);
  const selectedFilmRef = useRef(null);
  const navigationTimerRef = useRef(null);
  const rotationDragRef = useRef(null);
  const suppressCardClickUntilRef = useRef(0);
  const [rotation, setRotation] = useState(() => {
    // Every project opens with the three project slots visible together.
    if (activeId.startsWith('project-')) return 0;
    try {
      if (!window.sessionStorage.getItem('portfolio-reel-entered')) return 0;
    } catch {
      return 0;
    }
    const selectedIndex = reelItems.findIndex((item) => item.id === activeId);
    return selectedIndex < 0 ? 0 : -reelAngles[selectedIndex];
  });
  const [isRotating, setIsRotating] = useState(false);
  const [ejectingId, setEjectingId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const svgId = useId().replace(/:/g, '');
  const reelHintId = `${svgId}-drag-hint`;
  const pageIndex = reelItems.findIndex((item) => item.id === activeId);
  const selectedItem = reelItems[pageIndex];
  const previousItem = reelItems[(pageIndex - 1 + reelItems.length) % reelItems.length];
  const nextItem = reelItems[(pageIndex + 1) % reelItems.length];
  const activeLabel = selectedItem?.label ?? title;
  const isAppLink = action?.label === '앱 바로가기';
  const paginationLabel = pageIndex < 0 ? 'PROJECTS' : (
    <><span className="reel-page-current">{pageIndex + 1}</span>/{reelItems.length}</>
  );

  useLayoutEffect(() => {
    const film = selectedFilmRef.current;
    if (!film || pendingFilmOrigin?.id !== activeId) return;
    const origin = pendingFilmOrigin;
    film.style.setProperty('--film-start-x', `${origin.x - film.offsetLeft - film.offsetWidth / 2}px`);
    film.style.setProperty('--film-start-y', `${origin.y - film.offsetTop - film.offsetHeight / 2}px`);
    film.style.setProperty('--film-start-angle', `${origin.angle}deg`);
    film.style.setProperty('--film-start-scale', String(origin.width / film.offsetWidth));
    pendingFilmOrigin = null;
  }, [activeId]);

  useEffect(() => {
    // Keep the project trio on the first entrance, then frame the selected item.
    try { window.sessionStorage.setItem('portfolio-reel-entered', '1'); } catch { /* Storage may be unavailable. */ }
  }, []);

  const pointerAngle = (event) => {
    const point = event.currentTarget.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(event.currentTarget.getScreenCTM().inverse());
    return Math.atan2(local.y - 500, local.x) * 180 / Math.PI;
  };
  const startRotation = (event) => {
    if (event.button !== 0 || event.target.closest('.half-reel__exit')) return;
    const onCard = Boolean(event.target.closest('a'));
    if (!onCard) event.preventDefault();
    rotationDragRef.current = { angle: pointerAngle(event), rotation, initialRotation: rotation, distance: 0, onCard };
    setIsRotating(true);
  };
  const dragRotation = (event) => {
    const drag = rotationDragRef.current;
    if (!drag) return;
    const angle = pointerAngle(event);
    const delta = ((angle - drag.angle + 540) % 360) - 180;
    drag.rotation += delta;
    drag.distance += Math.abs(delta);
    drag.angle = angle;
    if (drag.distance > 4) {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      suppressCardClickUntilRef.current = performance.now() + 400;
      setRotation(drag.rotation);
    }
  };
  const endRotation = (event) => {
    const drag = rotationDragRef.current;
    if (!drag) return;
    if (drag.onCard && drag.distance <= 4) setRotation(drag.initialRotation);
    else setRotation(snapRotation(drag.rotation + (drag.distance <= 4 && event.type !== 'pointercancel' ? reelStep : 0)));
    if (drag.distance > 4) suppressCardClickUntilRef.current = performance.now() + 400;
    rotationDragRef.current = null;
    setIsRotating(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  useEffect(() => {
    if (menuOpen) closeButtonRef.current?.focus();
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const resetDrawer = () => { if (desktopQuery.matches) setMenuOpen(false); };
    desktopQuery.addEventListener('change', resetDrawer);
    return () => desktopQuery.removeEventListener('change', resetDrawer);
  }, [menuOpen]);

  const handleMenuKey = (event) => {
    if (!menuOpen) return;
    if (event.key === 'Escape') {
      event.stopPropagation();
      closeMenu();
    } else if (event.key === 'Tab') {
      const focusable = [...sidebarRef.current.querySelectorAll('button, a[href]')].filter((element) => element.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && event.target === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && event.target === last) { event.preventDefault(); first?.focus(); }
    }
  };

  useEffect(() => () => window.clearTimeout(navigationTimerRef.current), []);

  const selectCard = (event, id) => {
    if (performance.now() < suppressCardClickUntilRef.current) {
      event.preventDefault();
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (ejectingId) return;
    const selectedIndex = reelItems.findIndex((item) => item.id === id);
    if (id !== activeId && id !== 'vhs' && event.currentTarget.classList.contains('half-reel__card')) {
      const bounds = event.currentTarget.getBoundingClientRect();
      pendingFilmOrigin = {
        id,
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
        angle: ((reelAngles[selectedIndex] + rotation + 90 + 540) % 360) - 180,
        width: event.currentTarget.ownerSVGElement.getBoundingClientRect().width * 340 / 540,
      };
    }
    if (selectedIndex >= 0) {
      const selectedRotation = -reelAngles[selectedIndex];
      setRotation((value) => selectedRotation + Math.round((value - selectedRotation) / 360) * 360);
    }
    setEjectingId(id);
    const duration = 0;
    navigationTimerRef.current = window.setTimeout(() => {
      if (id === activeId) {
        const frame = frameRef.current;
        if (frame?.contentDocument) {
          frame.contentDocument.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (frame && source) {
          frame.src = source;
        }
        setEjectingId(null);
        setMenuOpen(false);
      } else {
        if (id === 'vhs') {
          window.location.href = itemUrl(id);
        } else {
          window.history.pushState(null, '', itemUrl(id));
          window.dispatchEvent(new Event('hashchange'));
        }
      }
    }, duration);
  };

  useLayoutEffect(() => {
    const screen = screenRef.current;
    const updateFrame = () => {
      const { width, height } = screen.getBoundingClientRect();
      if (!width || !height) return;
      const layout = getArchiveFrameLayout({ width, height });
      screen.style.setProperty('--landing-width', `${layout.width}px`);
      screen.style.setProperty('--landing-scale', layout.scale);
      screen.style.setProperty('--landing-height', `${layout.height}px`);
    };
    updateFrame();
    const observer = new ResizeObserver(updateFrame);
    observer.observe(screen);
    window.addEventListener('resize', updateFrame);
    return () => { observer.disconnect(); window.removeEventListener('resize', updateFrame); };
  }, [document]);

  return (
    <section className={`film-reel-detail${menuOpen ? ' is-menu-open' : ''}`} id={activeId} aria-label={title}>
      <header className="film-reel-detail__mobile-toolbar">
        <button className="film-reel-detail__mobile-menu" ref={menuButtonRef} type="button" aria-expanded={menuOpen} aria-controls={`${svgId}-menu`} onClick={() => setMenuOpen(true)}>☰ 메뉴</button>
        <nav className="film-reel-detail__mobile-pages" aria-label="이전 다음 아카이브 페이지">
          <a href={itemUrl(previousItem.id)} onClick={(event) => selectCard(event, previousItem.id)} aria-label={`이전 페이지: ${previousItem.label}`}><span aria-hidden="true">&lt;</span></a>
          <span className="film-reel-detail__mobile-title">{activeLabel}</span>
          <a href={itemUrl(nextItem.id)} onClick={(event) => selectCard(event, nextItem.id)} aria-label={`다음 페이지: ${nextItem.label}`}><span aria-hidden="true">&gt;</span></a>
        </nav>
        <span className="film-reel-detail__mobile-count" aria-label="현재 페이지">{paginationLabel}</span>
      </header>
      {menuOpen && <button className="film-reel-detail__backdrop" aria-label="아카이브 메뉴 닫기" tabIndex={-1} onClick={closeMenu} />}
      <aside ref={sidebarRef} id={`${svgId}-menu`} className="film-reel-detail__sidebar" onKeyDown={handleMenuKey}>
        <div className="film-reel-detail__menu-heading"><span>ARCHIVE</span><button ref={closeButtonRef} type="button" onClick={closeMenu} aria-label="메뉴 닫기">×</button></div>
        <nav className={`half-reel${isRotating ? ' is-rotating' : ''}`} aria-label="반원 필름 아카이브 메뉴">
          <svg onPointerDown={startRotation} onPointerMove={dragRotation} onPointerUp={endRotation} onPointerCancel={endRotation} className="half-reel__assembly" viewBox="0 0 540 1000" aria-label={`탈착식 필름 카드 ${reelItems.length}장`} aria-describedby={reelHintId}>
            <defs>
              <radialGradient id={`${svgId}-cardboard`} cx="30%" cy="45%" r="80%">
                <stop stopColor="#45433b" /><stop offset=".6" stopColor="#302f29" /><stop offset="1" stopColor="#201f1b" />
              </radialGradient>
              <linearGradient id={`${svgId}-metal`} x2="1" y2="1">
                <stop stopColor="#b4afa2" /><stop offset=".18" stopColor="#66645e" /><stop offset=".42" stopColor="#a19c8e" /><stop offset=".65" stopColor="#504f49" /><stop offset=".84" stopColor="#928b7c" /><stop offset="1" stopColor="#4a4740" />
              </linearGradient>
              <linearGradient id={`${svgId}-rim`} x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#e3dcc9" /><stop offset=".2" stopColor="#777269" /><stop offset=".48" stopColor="#c6bfac" /><stop offset=".65" stopColor="#49463e" /><stop offset="1" stopColor="#a39a88" />
              </linearGradient>
              <radialGradient id={`${svgId}-hub`} cx="35%" cy="30%" r="70%">
                <stop stopColor="#c2bbab" /><stop offset=".45" stopColor="#78756b" /><stop offset=".8" stopColor="#49473f" /><stop offset="1" stopColor="#a59b88" />
              </radialGradient>
              <filter id={`${svgId}-grain`} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" seed="14" result="grain" />
                <feColorMatrix in="grain" type="saturate" values="0" />
                <feComponentTransfer><feFuncA type="linear" slope=".18" /></feComponentTransfer>
                <feBlend in="SourceGraphic" mode="soft-light" />
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
              {reelItems.map((item) => <clipPath key={item.id} id={`${svgId}-${item.id}`}><path d={chipWindow} /></clipPath>)}
              <path id={`${svgId}-marker-arc`} d="M-139-81Q0-137 139-81" />
              <clipPath id={`${svgId}-half-view`}><rect x="0" y="0" width="540" height="1000" /></clipPath>
              <marker id={`${svgId}-rotation-arrow`} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="14" markerHeight="14" markerUnits="userSpaceOnUse" orient="auto">
                <path d="M2 2L10 6L2 10" fill="none" stroke="#161613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>
            <g clipPath={`url(#${svgId}-half-view)`}>
            <g className="half-reel__rotor" style={{ transform: `rotate(${rotation}deg)` }}>
            <g className="half-reel__mechanism" aria-hidden="true">
              <circle cx="0" cy="500" r="452" fill="#302b23" />
              {[425, 418, 410, 402].map((radius) => <circle key={radius} cx="0" cy="500" r={radius} fill="none" stroke="#81725b" strokeWidth="3" opacity=".42" />)}
              <path d={`M0 48 A452 452 0 1 1 0 952 A452 452 0 1 1 0 48Z ${reelWindows}`} fill={`url(#${svgId}-metal)`} fillRule="evenodd" stroke="#4b4740" strokeWidth="7" strokeLinejoin="round" filter={`url(#${svgId}-grain)`} />
              <path d={`M0 48 A452 452 0 1 1 0 952 A452 452 0 1 1 0 48Z ${reelWindows}`} fill="none" stroke="#c2b9a4" strokeWidth="2" strokeLinejoin="round" opacity=".65" />
              <circle cx="0" cy="500" r="460" fill="none" stroke="#37352f" strokeWidth="14" />
              <circle cx="0" cy="500" r="460" fill="none" stroke={`url(#${svgId}-rim)`} strokeWidth="8" />
              <circle cx="0" cy="500" r="447" fill="none" stroke="#ded6c1" strokeWidth="2" opacity=".55" />
              {reelAngles.map((angle) => <g key={angle} transform={`translate(${reelPoint(425, angle + reelStep / 2)})`}>
                <circle r="7" fill="#383731" stroke="#c0b6a0" strokeWidth="2" />
                <path d="M-3 2L3-2" stroke="#b7ad97" strokeWidth="1.5" />
              </g>)}
            </g>
            {reelItems.map((item, index) => {
              // One radial axis controls both the rectangular insert and its pull tab.
              const angle = reelAngles[index];
              const radians = angle * Math.PI / 180;
              const x = Math.cos(radians) * 302;
              const y = 500 + Math.sin(radians) * 302;
              return (
                <g key={item.id} transform={`translate(${x} ${y}) rotate(${angle + 90})`}>
                  <path d="M-62 133L-152-57Q0-119 152-57L62 133Q0 111-62 133Z" fill="#161510" stroke="#77705d" strokeWidth="3" />
                  <a href={itemUrl(item.id)} onClick={(event) => selectCard(event, item.id)} className={`half-reel__card${ejectingId === item.id ? ' is-ejecting' : ''}`} aria-label={item.label} aria-current={item.id === activeId ? 'page' : undefined}>
                    <path className="half-reel__insert" d={chipBody} fill={`url(#${svgId}-metal)`} stroke="#b0a48d" strokeWidth="2" strokeLinejoin="round" filter={`url(#${svgId}-grain)`} />
                    <path d="M-143-53L-57 124Q0 105 57 124" fill="none" stroke="#e0d6bc" strokeWidth="1.5" opacity=".55" />
                    <path d={chipWindow} fill="#100f0c" stroke="#3c3830" strokeWidth="4" strokeLinejoin="round" />
                    {item.id === 'project-01' ? (
                      <g clipPath={`url(#${svgId}-${item.id})`}>
                        <path d={chipWindow} fill="#f2edfc" />
                        <svg x="-123" y="-74" width="246" height="190" viewBox="300 500 2800 1300" preserveAspectRatio="xMidYMid meet">
                          <image href={project01Landscape} width="3840" height="2160" />
                        </svg>
                      </g>
                    ) : item.id === 'project-03' ? (
                      <g clipPath={`url(#${svgId}-${item.id})`}>
                        <path d={chipWindow} fill="#030806" />
                        <image href={item.image} x="-123" y="-74" width="246" height="190" preserveAspectRatio="xMidYMid meet" />
                      </g>
                    ) : item.id === 'vhs' ? (
                      <g clipPath={`url(#${svgId}-${item.id})`}>
                        <path d={chipWindow} fill="#12201b" />
                        <image href={item.image} x="-88" y="-65" width="176" height="160" preserveAspectRatio="xMidYMid meet" />
                      </g>
                    ) : <FilmArtwork item={item} clipPath={`url(#${svgId}-${item.id})`} />}
                  </a>
                    <text
                      className="half-reel__marker-label"
                      textAnchor="middle"
                      transform={`rotate(${index === 1 ? 0.8 : -1})`}
                      textLength={item.id === 'project-03' ? 188 : 158}
                      lengthAdjust="spacingAndGlyphs"
                    >
                      <textPath href={`#${svgId}-marker-arc`} startOffset="50%">
                        {item.id === 'project-03' ? 'PERSONL PROJECT' : item.id === 'project-01' ? 'TEAM PROJECT 1' : item.id === 'project-02' ? 'TEAM PROJECT 2' : item.id.startsWith('project-') ? 'TEAM PROJECT' : item.label}
                      </textPath>
                    </text>
                </g>
              );
            })}
            </g>
            </g>
            <path d="M0 355 A145 145 0 0 1 0 645Z" fill={`url(#${svgId}-hub)`} stroke="#c3baa6" strokeWidth="4" filter={`url(#${svgId}-grain)`} />
            <path d="M0 369 A131 131 0 0 1 0 631" fill="none" stroke="#34332d" strokeWidth="4" />
            <path d="M0 376 A124 124 0 0 1 0 624" fill="none" stroke="#d1c7b0" strokeWidth="1" opacity=".6" />
            {[-60, 0, 60].map((angle) => <g key={angle} transform={`translate(${reelPoint(106, angle)})`}>
              <circle r="9" fill="#34332d" stroke="#a69e8a" strokeWidth="2" />
              <circle r="5" fill={`url(#${svgId}-rim)`} />
              <path d="M-3 3L3-3" stroke="#36342d" strokeWidth="2" />
            </g>)}

            <g className="half-reel__rotation-arrows" aria-hidden="true" fill="none" stroke="#161613" strokeWidth="2.5" strokeLinecap="round" pointerEvents="none">
              <path d="M466 350A490 490 0 0 0 302 114" markerEnd={`url(#${svgId}-rotation-arrow)`} />
              <path d="M466 650A490 490 0 0 1 302 886" markerEnd={`url(#${svgId}-rotation-arrow)`} />
            </g>
          </svg>
          <div className="half-reel__rotation-controls" role="group" aria-label="릴 회전">
            <button type="button" onClick={() => setRotation((value) => snapRotation(value - reelStep))} aria-label="릴을 위로 돌리기">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 15L12 8L19 15" /></svg>
            </button>
            <span className="half-reel__page-count" aria-label="현재 페이지" aria-live="polite">{paginationLabel}</span>
            <button type="button" onClick={() => setRotation((value) => snapRotation(value + reelStep))} aria-label="릴을 아래로 돌리기">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9L12 16L19 9" /></svg>
            </button>
            <div className="half-reel__drag-hint" id={reelHintId}>
              <svg className="half-reel__drag-gesture" viewBox="0 0 40 44" aria-hidden="true">
                <rect x="2" y="4" width="22" height="36" rx="11" />
                <path d="M13 4v12M2 16h22M9 10h1m24-2-4 4m4-4 4 4m-4-4v28m0 0-4-4m4 4 4-4" />
              </svg>
              <span lang="en">DRAG</span>
            </div>
          </div>
        </nav>
        <nav className="film-reel-detail__compact-links" aria-label="아카이브 메뉴">
          {reelItems.map((item) => <a key={item.id} href={itemUrl(item.id)} onClick={(event) => selectCard(event, item.id)} aria-current={item.id === activeId ? 'page' : undefined}><img src={item.image} alt="" /><span>{item.label}</span></a>)}

        </nav>
      </aside>
      {selectedItem && <div ref={selectedFilmRef} className="film-reel-detail__selected-film" key={activeId} aria-label={`선택한 필름: ${selectedItem.label}`}>
        <svg viewBox="-170 -135 340 285" role="img" aria-label={selectedItem.label}>
          <defs><clipPath id={`${svgId}-selected-window`}><path d={chipWindow} /></clipPath></defs>
          <path d={chipBody} fill={`url(#${svgId}-metal)`} stroke="#b0a48d" strokeWidth="2" strokeLinejoin="round" />
          <path d="M-143-53L-57 124Q0 105 57 124" fill="none" stroke="#e0d6bc" strokeWidth="1.5" opacity=".55" />
          <path d={chipWindow} fill="#100f0c" stroke="#3c3830" strokeWidth="4" strokeLinejoin="round" />
          {activeId === 'project-01' ? <g clipPath={`url(#${svgId}-selected-window)`}>
            <path d={chipWindow} fill="#f2edfc" />
            <svg x="-123" y="-74" width="246" height="190" viewBox="300 500 2800 1300" preserveAspectRatio="xMidYMid meet">
              <image href={project01Landscape} width="3840" height="2160" />
            </svg>
          </g> : <FilmArtwork item={selectedItem} clipPath={`url(#${svgId}-selected-window)`} />}
        </svg>
      </div>}
      <nav className="film-reel-detail__actions" aria-label="바로가기 및 나가기">
        {action && <a className={`cassette-floater cassette-floater--shortcut${isAppLink ? '' : ' cassette-floater--site'}`} href={action.href} target="_blank" rel="noopener noreferrer" aria-label={action.label} style={{ '--cassette-primary': action.color }}>
          <span className="cassette-floater__art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: cassetteArtwork }} />
          <span className="cassette-floater__label">
            <img src={isAppLink ? appLinkHandwritten : siteLinkHandwritten} alt="" />
          </span>
        </a>}
        <a className="film-reel-detail__exit-link" href={getReelUrl()} aria-label="EXIT: 상영관으로 나가기">
          <img src={cinemaExitSign} alt="EXIT" />
        </a>
      </nav>
      <div className="film-reel-detail__film" inert={menuOpen || undefined} style={{ '--proposal-accent': '#7055ed' }}>
        <div className="project-proposal__film project-proposal__film--left" aria-hidden="true" />
        <div className="film-reel-detail__screen" ref={screenRef}>
          <iframe ref={frameRef} srcDoc={document} src={source} data-native-page={!document || undefined} title={title} allowFullScreen />
        </div>
        <div className="project-proposal__film project-proposal__film--right" aria-hidden="true" />

      </div>
    </section>
  );
}
