import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { getArchiveFrameLayout } from './archiveFrameLayout.js';
import { getArchiveUrl, getReelUrl } from '../routes.js';
import about from '../assets/about-cinema-poster.svg';
import project01 from '../assets/project-01-cinema-poster.png';
import project02 from '../assets/project-02-cinema-poster.png';
import project03 from '../assets/project-03-cinema-poster-wordmark.png';
import project04 from '../assets/project-04-cinema-poster.png';
import contact from '../assets/contact-cinema-poster.png';
import appLinkHandwritten from '../assets/app-link-handwritten.svg';
import cinemaExitSign from '../assets/cinema-exit-sign.svg';

const reelItems = [
  { id: 'about', label: 'ABOUT ME', image: about },
  { id: 'project-01', label: 'PROJECT 1', image: project01 },
  { id: 'project-02', label: 'PROJECT 2', image: project02 },
  { id: 'project-03', label: 'PROJECT 3', image: project03 },
  { id: 'project-04', label: 'PROJECT 4', image: project04 },
  { id: 'contact', label: 'CONTACT ME', image: contact },
];

export default function FilmReelProject({ activeId = 'project-01', document, source, title, action, frameRef }) {
  const screenRef = useRef(null);
  const navigationTimerRef = useRef(null);
  const [ejectingId, setEjectingId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const svgId = useId().replace(/:/g, '');
  const currentIndex = reelItems.findIndex((item) => item.id === activeId);
  const previousItem = reelItems[(currentIndex - 1 + reelItems.length) % reelItems.length];
  const nextItem = reelItems[(currentIndex + 1) % reelItems.length];

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
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (ejectingId) return;
    setEjectingId(id);
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420;
    navigationTimerRef.current = window.setTimeout(() => {
      if (id === activeId) {
        frameRef.current?.contentWindow?.scrollTo({ top: 0, behavior: 'smooth' });
        setEjectingId(null);
        setMenuOpen(false);
      } else {
        window.location.href = getArchiveUrl(id);
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
        <button ref={menuButtonRef} type="button" aria-expanded={menuOpen} aria-controls={`${svgId}-menu`} onClick={() => setMenuOpen(true)}>☰ 메뉴</button>
        <span>{reelItems[currentIndex].label}</span>
        <span>{currentIndex + 1}/6</span>
      </header>
      {menuOpen && <button className="film-reel-detail__backdrop" aria-label="아카이브 메뉴 닫기" tabIndex={-1} onClick={closeMenu} />}
      <aside ref={sidebarRef} id={`${svgId}-menu`} className="film-reel-detail__sidebar" onKeyDown={handleMenuKey}>
        <div className="film-reel-detail__menu-heading"><span>ARCHIVE</span><button ref={closeButtonRef} type="button" onClick={closeMenu} aria-label="메뉴 닫기">×</button></div>
        <nav className="half-reel" aria-label="반원 필름 아카이브 메뉴">
          <svg className="half-reel__assembly" viewBox="0 0 540 1000" aria-label="여섯 장의 탈착식 필름 카드">
            <defs>
              <radialGradient id={`${svgId}-cardboard`} cx="30%" cy="45%" r="80%">
                <stop stopColor="#45433b" /><stop offset=".6" stopColor="#302f29" /><stop offset="1" stopColor="#201f1b" />
              </radialGradient>
              <linearGradient id={`${svgId}-metal`} x2="1" y2="1">
                <stop stopColor="#f0ece1" /><stop offset=".5" stopColor="#b5b1a5" /><stop offset="1" stopColor="#e0d9c7" />
              </linearGradient>
              <filter id={`${svgId}-grain`} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" seed="14" result="grain" />
                <feColorMatrix in="grain" type="saturate" values="0" />
                <feComponentTransfer><feFuncA type="linear" slope=".18" /></feComponentTransfer>
                <feBlend in="SourceGraphic" mode="soft-light" />
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
              {reelItems.map((item) => <clipPath key={item.id} id={`${svgId}-${item.id}`}><rect x="-53" y="-65" width="106" height="128" rx="13" /></clipPath>)}
            </defs>
            <path d="M0 40 A460 460 0 0 1 0 960Z" fill={`url(#${svgId}-cardboard)`} stroke="#8b8066" strokeWidth="3" filter={`url(#${svgId}-grain)`} />
            <path d="M0 54 A446 446 0 0 1 0 946" fill="none" stroke="#c2af8744" strokeWidth="2" strokeDasharray="2 7" />
            {reelItems.map((item, index) => {
              // One radial axis controls both the rectangular insert and its pull tab.
              const angle = -75 + index * 30;
              const radians = angle * Math.PI / 180;
              const x = Math.cos(radians) * 318;
              const y = 500 + Math.sin(radians) * 318;
              return (
                <g key={item.id} transform={`translate(${x} ${y}) rotate(${angle + 90})`}>
                  <rect x="-62" y="-77" width="124" height="153" rx="16" fill="#161510" stroke="#77705d" strokeWidth="2" />
                  <a href={getArchiveUrl(item.id)} onClick={(event) => selectCard(event, item.id)} className={`half-reel__card${ejectingId === item.id ? ' is-ejecting' : ''}`} aria-label={item.label} aria-current={item.id === activeId ? 'page' : undefined}>
                    <path className="half-reel__insert" d="M-62 77V-112L-38-145H-27V-170H27V-145H38L62-112V77Z" fill={`url(#${svgId}-cardboard)`} stroke="#91846a" strokeWidth="2" filter={`url(#${svgId}-grain)`} />
                    <rect x="-21" y="-166" width="42" height="35" rx="5" fill={`url(#${svgId}-metal)`} stroke="#948974" strokeWidth="2" />
                    <rect x="-11" y="-159" width="22" height="20" rx="2" fill="#292720" />
                    <rect x="-56" y="-68" width="112" height="134" rx="15" fill="#100f0c" stroke="#908167" strokeWidth="2" />
                    <image href={item.image} x="-53" y="-65" width="106" height="128" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${svgId}-${item.id})`} />
                    <rect x="-53" y="43" width="106" height="20" fill="#16130fe6" />
                    <text x="0" y="57" textAnchor="middle" fill="#fff4d6" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="10">{item.label}</text>
                  </a>
                </g>
              );
            })}
            <path d="M0 275 A225 225 0 0 1 0 725Z" fill={`url(#${svgId}-metal)`} stroke="#f1ecdf" strokeWidth="4" filter={`url(#${svgId}-grain)`} />
            <path d="M0 292 A208 208 0 0 1 0 708" fill="none" stroke="#7c776b" strokeWidth="2" />
            <a className="half-reel__exit" href={getReelUrl()} aria-label="EXIT: 상영관으로 나가기">
              <image href={cinemaExitSign} x="22" y="467.5" width="150" height="65" />
            </a>
            {[115, 185, 815, 885].map((y) => <circle key={y} cx="18" cy={y} r="10" fill="#3e392c" stroke="#d1c4a3" strokeWidth="4" />)}
          </svg>
        </nav>
        <nav className="film-reel-detail__compact-links" aria-label="아카이브 메뉴">
          {reelItems.map((item) => <a key={item.id} href={getArchiveUrl(item.id)} onClick={(event) => selectCard(event, item.id)} aria-current={item.id === activeId ? 'page' : undefined}><img src={item.image} alt="" /><span>{item.label}</span></a>)}
          <a className="film-reel-detail__compact-exit" href={getReelUrl()} aria-label="EXIT: 상영관으로 나가기"><img src={cinemaExitSign} alt="EXIT" /><span>상영관으로 나가기</span></a>
        </nav>
      </aside>
      <div className="film-reel-detail__film" inert={menuOpen || undefined} style={{ '--proposal-accent': '#7055ed' }}>
        <div className="project-proposal__film project-proposal__film--left" aria-hidden="true" />
        <div className="film-reel-detail__screen" ref={screenRef}>
          <iframe ref={frameRef} srcDoc={document} src={source} data-native-page={!document || undefined} title={title} allowFullScreen />
        </div>
        <div className="project-proposal__film project-proposal__film--right" aria-hidden="true" />
        <div className="cassette-floaters" aria-label="프로젝트 바로가기">
          {action && <a className="cassette-floater cassette-floater--app" href={action.href} target={action.href.startsWith('https:') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={action.label}>
            <span className="cassette-floater__label">{action.label === '앱 바로가기' ? <img src={appLinkHandwritten} alt={action.label} /> : <span className="cassette-floater__action-text">{action.label}</span>}</span>
          </a>}
          <nav className="cassette-floater" aria-label="ABOUT ME부터 CONTACT ME까지 이동">
            <div className="cassette-floater__label cassette-floater__pagination">
              <a href={getArchiveUrl(previousItem.id)} onClick={(event) => selectCard(event, previousItem.id)} aria-label={`이전: ${previousItem.label}`} title={previousItem.label}>‹</a>
              <span aria-label={`전체 6개 중 ${currentIndex + 1}번째`}>{currentIndex + 1}/6</span>
              <a href={getArchiveUrl(nextItem.id)} onClick={(event) => selectCard(event, nextItem.id)} aria-label={`다음: ${nextItem.label}`} title={nextItem.label}>›</a>
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}
