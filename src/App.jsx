import { useCallback, useEffect, useRef, useState } from 'react';
import ArchivePage from './components/ArchivePage.jsx';
import { isProjectEnabled } from './projectVisibility.js';
import { getArchiveUrl, getHomeUrl, getReelUrl, isCurrentPath } from './routes.js';
import aboutMe from './assets/about_me.png';
import aboutMePage from './assets/about-cinema-poster.svg';
import allBackground from './assets/all_background.png';
import contactImage from './assets/contact-cinema-poster.png';
import cssIcon from './assets/css.png';
import crtTv from './assets/crt-tv.png';
import figmaIcon from './assets/figma.png';
import htmlIcon from './assets/html.png';
import illustIcon from './assets/illust.png';
import javascriptIcon from './assets/javascript.png';
import jibsalife from './assets/project-01-cinema-poster.png';
import mailIcon from './assets/mail.png';
import mouseTicket from './assets/mouse-ticket.png';
import matmut from './assets/project-03-cinema-poster-wordmark.png';
import noSignalVideo from './assets/NO SIGNAL.mp4';
import phoneIcon from './assets/phone.png';
import pizzahut from './assets/project-04-cinema-poster.png';
import photoshopIcon from './assets/photoshop.png';
import reactIcon from './assets/react.png';
import earthIcon from './assets/earth.png';
import tapeAll from './assets/tape-all.png';
import tapeAbout from './assets/tape-about.png';
import tapeProject01 from './assets/tape-project-01.png';
import tapeProject02 from './assets/tape-project-02.png';
import tapeProject03 from './assets/tape-project-03.png';
import tapeProject04 from './assets/tape-project-04.png';
import tapeContact from './assets/tape-contact.png';
import skipIntroLabel from './assets/label.png';
import simmons from './assets/project-02-cinema-poster.png';

const tapes = [
  { id: 'about', title: 'ABOUT ME', image: tapeAbout },
  { id: 'project-01', title: 'PROJECT 01', image: tapeProject01 },
  { id: 'project-02', title: 'PROJECT 02', image: tapeProject02 },
  { id: 'project-03', title: 'PROJECT 03', image: tapeProject03 },
  { id: 'project-04', title: 'PROJECT 04', image: tapeProject04 },
  { id: 'contact', title: 'CONTACT', image: tapeContact },
].filter((tape) => isProjectEnabled(tape.id));

const filmFrames = [
  { id: 'about', title: 'ABOUT ME', number: '01', image: aboutMePage, hideLabel: true, href: getArchiveUrl('about') },
  { id: 'project-01', title: 'PROJECT 01', number: '02', image: jibsalife, hideLabel: true, href: getArchiveUrl('project-01') },
  { id: 'project-02', title: 'PROJECT 02', number: '03', image: simmons, hideLabel: true, href: getArchiveUrl('project-02') },
  { id: 'project-03', title: 'PROJECT 03', number: '04', image: matmut, hideLabel: true, href: getArchiveUrl('project-03') },
  { id: 'project-04', title: 'PROJECT 04', number: '05', image: pizzahut, hideLabel: true, href: getArchiveUrl('project-04') },
  { id: 'contact', title: 'CONTACT ME', number: '06', image: contactImage, hideLabel: true, href: getArchiveUrl('contact') },
].filter((frame) => isProjectEnabled(frame.id));


const aboutSkillIcons = [
  { name: 'Figma', image: figmaIcon, className: 'about-skill-icon--figma' },
  { name: 'Photoshop', image: photoshopIcon, className: 'about-skill-icon--photoshop' },
  { name: 'Illustrator', image: illustIcon, className: 'about-skill-icon--illust' },
  { name: 'HTML', image: htmlIcon, className: 'about-skill-icon--html' },
  { name: 'CSS', image: cssIcon, className: 'about-skill-icon--css' },
  { name: 'JavaScript', image: javascriptIcon, className: 'about-skill-icon--javascript' },
  { name: 'React', image: reactIcon, className: 'about-skill-icon--react' },
];

const aboutContactIcons = [
  { name: 'Mail', image: mailIcon, className: 'about-contact-icon--mail' },
  { name: 'Phone', image: phoneIcon, className: 'about-contact-icon--phone' },
  { name: 'Website', image: earthIcon, className: 'about-contact-icon--earth' },
];

const getAboutTargetRect = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const width = Math.min(viewportWidth - 40, (viewportHeight - 40) * (1448 / 1086), 1448);
  const height = width * (1086 / 1448);
  const left = (viewportWidth - width) / 2;
  const top = (viewportHeight - height) / 2;

  return { left, top, width, height };
};

function VhsTape({ title, image, index }) {
  return (
    <div
      className="vhs-tape"
      style={{ '--stack-index': index, '--stack-depth': tapes.length - index }}
      aria-label={`${title} VHS tape`}
    >
      <img src={image} alt={`${title} VHS tape`} />
    </div>
  );
}

function CrtTv({ isAllTapeInserted, screenRef }) {
  return (
    <>
      <div className="tv-video-screen" ref={screenRef} aria-hidden="true">
        {isAllTapeInserted ? (
          <img className="tv-portfolio-preview" src={allBackground} alt="" />
        ) : (
          <video src={noSignalVideo} autoPlay muted loop playsInline />
        )}
      </div>
      <img className="tv-image" src={crtTv} alt="CRT television" />
    </>
  );
}

function LoadingOverlay({ isBootComplete }) {
  return (
    <div className={`portal-loading${isBootComplete ? ' portal-loading--complete' : ''}`} aria-hidden="true">
      <div className="portal-loading__bar">
        {Array.from({ length: 16 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <p>LOADING</p>
    </div>
  );
}

function AboutMeOverlay({ transition, onClose }) {
  if (!transition) {
    return null;
  }

  const rect = transition.isExpanded ? transition.target : transition.from;
  const isOpen = transition.phase === 'open';
  const portalClass = 'about-portal' + (transition.isExpanded ? ' about-portal--expanded' : '') + (isOpen ? ' about-portal--open' : '');
  const skillItems = [
    { name: 'Figma', image: figmaIcon, percent: '80%', value: 80 },
    { name: 'Photoshop', image: photoshopIcon, percent: '70%', value: 70 },
    { name: 'Illustrator', image: illustIcon, percent: '65%', value: 65 },
    { name: 'HTML', image: htmlIcon, percent: '78%', value: 78 },
    { name: 'CSS', image: cssIcon, percent: '75%', value: 75 },
    { name: 'JavaScript', image: javascriptIcon, percent: '55%', value: 55 },
    { name: 'React', image: reactIcon, percent: '50%', value: 50 },
  ];

  return (
    <section className={portalClass} aria-label="About me">
      <button className="about-portal__close" type="button" onClick={onClose} aria-label="Close about me">
        CLOSE
      </button>
      <div className="about-resume" aria-hidden={!isOpen}>
        <aside className="about-resume__profile">
          <div className="about-resume__headline">
            <h2>YOO SEUNG HYUN</h2>
            <p>UX/UI Designer</p>
          </div>
          <div className="about-resume__photo">
            <img src={aboutMe} alt="Yoo Seung Hyun profile" />
          </div>
          <ul className="about-resume__contact" aria-label="Contact">
            <li>
              <img className="contact-icon" src={mailIcon} alt="" />
              <span>yshnada@gmail.com</span>
            </li>
            <li>
              <img className="contact-icon" src={phoneIcon} alt="" />
              <span>+82 10-4114-2912</span>
            </li>
            <li>
              <img className="contact-icon" src={earthIcon} alt="" />
              <span>portfolio archive</span>
            </li>
          </ul>
        </aside>

        <div className="about-resume__main">
          <section className="resume-card resume-card--education">
            <div className="resume-card__title">
              <h3>EDUCATION</h3>
              <span />
            </div>
            <div className="timeline">
              <article>
                <span />
                <p className="timeline__date">2011.03 - 2014.02</p>
                <h4>{'\uc0c1\ub3d9\uace0\ub4f1\ud559\uad50'}</h4>
                <p>{'\uc774\uacfc \uc878\uc5c5'}</p>
              </article>
              <article>
                <span />
                <p className="timeline__date">2014.03 - 2019.02</p>
                <h4>{'\uad6d\uc81c\ud328\uc158\ub514\uc790\uc778\uc804\ubb38\ud559\uad50'}</h4>
                <p>{'\ud328\uc158\ub514\uc790\uc778\uacfc \uc804\ubb38 \ud559\uc0ac \uc878\uc5c5'}</p>
              </article>
              <article>
                <span />
                <p className="timeline__date">2025.12 - 2026.06</p>
                <h4>{'\uc774\uc820\uc544\uce74\ub370\ubbf8DX\uad50\uc721\uc13c\ud130'}</h4>
                <p>{'UXUI\ub514\uc790\uc778&\uc6f9\uae30\ud68d \ud504\ub860\ud2b8\uc5d4\ub4dc \ubd80\ud2b8\ucea0\ud504'}</p>
              </article>
            </div>
          </section>

          <section className="resume-card resume-card--skills">
            <div className="resume-card__title">
              <h3>TOOLS &amp; SKILLS</h3>
              <span />
            </div>
            <ul className="skill-grid">
              {skillItems.map((skill) => (
                <li key={skill.name}>
                  <span className="skill-logo" style={{ '--skill-percent': skill.value }}>
                    <img src={skill.image} alt="" />
                  </span>
                  <p>{skill.name}</p>
                  <strong>{skill.percent}</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="resume-card resume-card--experience">
            <div className="resume-card__title">
              <h3>EXPERIENCE</h3>
              <span />
            </div>
            <div className="timeline">
              <article>
                <span />
                <p className="timeline__date">2020.12 - 2021.07</p>
                <h4>{'\uc2ac\ub9c1\uc2a4\ud1a4'}</h4>
                <p>{'\ud328\uc158\ub514\uc790\uc778'}</p>
              </article>
              <article>
                <span />
                <p className="timeline__date">2021.09 - 2023.06</p>
                <h4>{'\uc5d8 \ub85c\uaf2c'}</h4>
                <p>{'\ud328\uc158 \uc0ac\uc5c5 \uc6b4\uc601'}</p>
              </article>
              <article>
                <span />
                <p className="timeline__date">2023.07 - 2025.12</p>
                <h4>{'\uc81c\uc774\uc564\uc5d0\uc2a4\ucee4\ub125\ud130'}</h4>
                <p>{'\uc81c\uc870 \ubc0f \ub0a9\ud488'}</p>
              </article>
            </div>
          </section>

          <section className="resume-card resume-card--exhibition">
            <div className="resume-card__title">
              <h3>EXHIBITION</h3>
              <span />
            </div>
            <ul className="plain-list plain-list--exhibition">
              <li>
                <span className="list-icon">I</span>
                <strong>2018.07</strong>
                <p>{'\uac15\ub0a8\ud398\uc2a4\ud2f0\ubc8c \ud328\uc158\uc1fc \uc2e0\uc9c4 \ub514\uc790\uc774\ub108 \ucf58\ud14c\uc2a4\ud2b8 \ucc38\uac00'}</p>
              </li>
              <li>
                <span className="list-icon">I</span>
                <strong>2019.03</strong>
                <p>{'K\ud328\uc158\uc624\ub514\uc158 \ucc38\uac00'}</p>
              </li>
              <li>
                <span className="list-icon">I</span>
                <strong>2019.06</strong>
                <p>{'\ucf00\uc774\ube0c\ub79c\ub4dc NIX \ub370\ub2d8 \ucf58\ud14c\uc2a4\ud2b8 \ucc38\uac00'}</p>
              </li>
            </ul>
          </section>

          <section className="resume-card resume-card--awards">
            <div className="resume-card__title">
              <h3>AWARDS</h3>
              <span />
            </div>
            <ul className="plain-list">
              <li>
                <span className="list-icon">A</span>
                <strong>2018.11</strong>
                <p>{'\ud328\uc158\ub514\uc790\uc778\uc804\ubb38\ud559\uad50 \uc6b0\uc218\uc791\ud488\uc0c1'}</p>
              </li>
              <li>
                <span className="list-icon">A</span>
                <strong>2018.11</strong>
                <p>{'\ud328\uc158\ub514\uc790\uc778\uc804\ubb38\ud559\uad50 \ud611\ub825\uc0ac\uc0c1'}</p>
              </li>
              <li>
                <span className="list-icon">A</span>
                <strong>2026.04</strong>
                <p>{'\uc774\uc820\uc544\uce74\ub370\ubbf8DX\uad50\uc721\uc13c\ud130 \ud504\ub85c\uc81d\ud2b8 \uc6b0\uc218\uc0c1'}</p>
              </li>
            </ul>
          </section>
        </div>
      </div>
      <div
        className="about-portal__image"
        style={{
          left: String(rect.left) + 'px',
          top: String(rect.top) + 'px',
          width: String(rect.width) + 'px',
          height: String(rect.height) + 'px',
        }}
      >
        <img src={transition.image} alt="About me" />
      </div>
    </section>
  );
}

function PortfolioScreen() {
  const cinemaRef = useRef(null);
  const ticketCursorRef = useRef(null);
  const admissionRef = useRef(false);
  const admissionTimerRef = useRef(null);
  const [admittingId, setAdmittingId] = useState(null);
  const projectFrames = filmFrames.filter((frame) => frame.id.startsWith('project-'));
  const cinemaFrames = [
    { id: 'vhs', title: 'VHS PLAYER', href: getHomeUrl() },
    filmFrames[0],
    { id: 'projects', title: 'PROJECT', href: getArchiveUrl('project-01') },
    filmFrames[filmFrames.length - 1],
  ];

  const hideTicketCursor = useCallback(() => {
    if (admissionRef.current) return;
    cinemaRef.current?.classList.remove('has-ticket-cursor');
    if (ticketCursorRef.current) ticketCursorRef.current.dataset.visible = 'false';
  }, []);

  useEffect(() => {
    window.addEventListener('blur', hideTicketCursor);
    return () => window.removeEventListener('blur', hideTicketCursor);
  }, [hideTicketCursor]);

  useEffect(() => {
    const resetAdmission = () => {
      window.clearTimeout(admissionTimerRef.current);
      admissionRef.current = false;
      setAdmittingId(null);
      hideTicketCursor();
    };
    window.addEventListener('pageshow', resetAdmission);
    return () => {
      window.clearTimeout(admissionTimerRef.current);
      window.removeEventListener('pageshow', resetAdmission);
    };
  }, [hideTicketCursor]);

  const moveTicketCursor = (event) => {
    if (admissionRef.current) return;
    const cursor = ticketCursorRef.current;
    const ticketImage = cursor?.querySelector('img');
    if (event.pointerType !== 'mouse' || !ticketImage?.complete || !ticketImage.naturalWidth) {
      hideTicketCursor();
      return;
    }
    const x = Math.max(0, Math.min(event.clientX - 12, window.innerWidth - 112));
    const y = Math.max(0, Math.min(event.clientY - 12, window.innerHeight - 57));
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    cursor.dataset.visible = 'true';
    cinemaRef.current?.classList.add('has-ticket-cursor');
  };

  const enterCinema = (event, frame) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (admissionRef.current) return;
    admissionRef.current = true;
    const bounds = event.currentTarget.getBoundingClientRect();
    const clickX = event.detail === 0 ? bounds.left + bounds.width / 2 : event.clientX;
    const clickY = event.detail === 0 ? bounds.top + bounds.height / 2 : event.clientY;
    const x = Math.max(12, Math.min(clickX - 12, window.innerWidth - 180));
    const y = Math.max(12, Math.min(clickY - 12, window.innerHeight - 125));
    const cursor = ticketCursorRef.current;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    cursor.dataset.visible = 'true';
    setAdmittingId(frame.id);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    admissionTimerRef.current = window.setTimeout(() => {
      window.location.href = frame.href;
    }, reducedMotion ? 160 : 940);
  };

  const bulbs = [
    ...Array.from({ length: 6 }, (_, index) => [
      { x: index * 20, y: 0 },
      { x: index * 20, y: 100 },
    ]).flat(),
    ...Array.from({ length: 7 }, (_, index) => [
      { x: 0, y: (index + 1) * 12.5 },
      { x: 100, y: (index + 1) * 12.5 },
    ]).flat(),
  ];
  const posterDetails = {
    about: { title: 'ABOUT ME', subtitle: 'DESIGNER PROFILE', name: 'YOO SEUNG HYUN' },
    'project-01': { title: 'PROJECT 1', subtitle: 'UX/UI DESIGN', name: '집사인생' },
    'project-02': { title: 'PROJECT 2', subtitle: 'WEBSITE REDESIGN', name: 'SIMMONS' },
    'project-03': { title: 'PROJECT 3', subtitle: 'UX/UI DESIGN', name: '맛과멋' },
    'project-04': { title: 'PROJECT 4', subtitle: 'WEBSITE REDESIGN', name: 'PIZZA HUT' },
    contact: { title: 'CONTACT ME', subtitle: "LET'S WORK TOGETHER", name: 'CONTACT' },
  };

  return (
    <section className="portfolio-screen portfolio-screen--cinema" ref={cinemaRef} onPointerMove={moveTicketCursor} onPointerLeave={hideTicketCursor} aria-label="포트폴리오 상영관">
      <div ref={ticketCursorRef} className={`cinema-ticket-cursor${admittingId ? ' cinema-ticket-cursor--tearing' : ''}`} aria-hidden="true" data-visible="false">
        <div className="cinema-ticket__paper">
          <img className="cinema-ticket__body" src={mouseTicket} alt="" draggable="false" />
          <img className="cinema-ticket__barcode" src={mouseTicket} alt="" draggable="false" />
        </div>
      </div>
      <div className="cinema-film cinema-film--top" aria-hidden="true" />
      <div className="cinema-film cinema-film--bottom" aria-hidden="true" />
      <div className="film-flow" aria-hidden="true">
        <div className="aurora-background">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="cinema-display">
        <ul className="cinema-posters" style={{ '--poster-count': cinemaFrames.length }} aria-label="아카이브 선택">
          {cinemaFrames.map((frame) => {
            const detail = posterDetails[frame.id] ?? { title: frame.title, name: frame.title };
            return (
              <li className={`cinema-poster cinema-poster--${frame.id}`} key={frame.id}>
                <a className={`cinema-poster__link${admittingId === frame.id ? ' is-admitting' : ''}`} href={frame.href} onClick={(event) => enterCinema(event, frame)} aria-label={`${detail.title} 아카이브 열기`} aria-busy={admittingId === frame.id}>
                  <div className="cinema-poster__marquee"><h2>{detail.title}</h2></div>
                  <div className="cinema-poster__case">
                    <div className="cinema-poster__bulbs" aria-hidden="true">
                      {bulbs.map((bulb, index) => (
                        <span className="cinema-poster__bulb" key={index} style={{ left: `${bulb.x}%`, top: `${bulb.y}%` }} />
                      ))}
                    </div>
                    <div className="cinema-poster__print">
                      {frame.id === 'projects' ? (
                        <div className="cinema-project-collection" aria-label="프로젝트 모음">
                          {projectFrames.map((project) => <img key={project.id} src={project.image} alt={posterDetails[project.id].name} />)}
                        </div>
                      ) : frame.id === 'vhs' ? (
                        <div className="cinema-vhs-art">
                          <div className="cinema-vhs-art__player">
                            <img className="cinema-vhs-art__tv" src={crtTv} alt="CRT TV" />
                            <div className="cinema-vhs-art__tape">
                              <img src={tapeAll} alt="TV 투입구 앞의 ALL IN ONE 비디오테이프" />
                            </div>
                          </div>
                        </div>
                      ) : <div className="cinema-poster__art"><img src={frame.image} alt={`${detail.name} 포스터`} /></div>}
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function ProjectRoomRedirect() {
  useEffect(() => {
    window.location.replace(getArchiveUrl('project-01'));
  }, []);
  return null;
}

export default function App() {
  const routeParams = new URLSearchParams(window.location.search);
  if (routeParams.get('view') === 'reel' && routeParams.get('room') === 'projects') {
    return <ProjectRoomRedirect />;
  }
  if (isCurrentPath(window.location.pathname, '/archive') || new URLSearchParams(window.location.search).get('view') === 'archive') {
    return <ArchivePage />;
  }

  if (new URLSearchParams(window.location.search).get('view') === 'reel') {
    return (
      <main className="intro-page">
        <PortfolioScreen />
      </main>
    );
  }

  const tvRef = useRef(null);
  const allTapeRef = useRef(null);
  const tvScreenRef = useRef(null);
  const dragTimerRef = useRef(null);
  const portalTimerRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const [isOverTv, setIsOverTv] = useState(false);
  const [isAllTapeInserted, setIsAllTapeInserted] = useState(false);
  const [cameraStyle, setCameraStyle] = useState({});
  const [isPortalEntering, setIsPortalEntering] = useState(false);
  const [isPortalExiting, setIsPortalExiting] = useState(false);
  const [hasBootStarted, setHasBootStarted] = useState(false);
  const [isBootComplete, setIsBootComplete] = useState(false);

  const resetPortal = () => {
    if (portalTimerRef.current) {
      window.clearTimeout(portalTimerRef.current);
    }

    setCameraStyle({});
    setIsPortalEntering(false);
    setIsPortalExiting(false);
    setHasBootStarted(false);
    setIsBootComplete(false);
    setIsAllTapeInserted(false);
  };

  const exitPortal = () => {
    if (isPortalExiting) {
      return;
    }

    if (portalTimerRef.current) {
      window.clearTimeout(portalTimerRef.current);
    }

    setIsPortalExiting(true);
    setHasBootStarted(false);
    setIsBootComplete(false);
    setCameraStyle((current) => ({
      ...current,
      '--portal-translate-x': '0px',
      '--portal-translate-y': '0px',
      '--portal-scale': 1,
      '--portal-fade': 1,
    }));

    portalTimerRef.current = window.setTimeout(() => {
      resetPortal();
    }, 920);
  };

  const isPointOverTv = (x, y) => {
    const tvRect = tvRef.current?.getBoundingClientRect();

    if (!tvRect) {
      return false;
    }

    const toleranceX = tvRect.width * 0.04;
    const toleranceY = tvRect.height * 0.04;

    return (
      x >= tvRect.left - toleranceX &&
      x <= tvRect.right + toleranceX &&
      y >= tvRect.top - toleranceY &&
      y <= tvRect.bottom + toleranceY
    );
  };

  const enterPortal = useCallback((event) => {
    event?.preventDefault?.();

    if (isPortalEntering || hasBootStarted) {
      return;
    }

    const tvRect = tvRef.current?.getBoundingClientRect();

    if (!tvRect) {
      return;
    }

    const tvCenterX = tvRect.left + tvRect.width * 0.5;
    const tvCenterY = tvRect.top + tvRect.height * 0.46;
    const targetScale = Math.min(
      window.innerWidth / (tvRect.width * 1.08),
      window.innerHeight / (tvRect.height * 1.08),
    );

    setCameraStyle({
      '--portal-origin-x': `${tvCenterX}px`,
      '--portal-origin-y': `${tvCenterY}px`,
      '--portal-translate-x': `${window.innerWidth * 0.5 - tvCenterX}px`,
      '--portal-translate-y': `${window.innerHeight * 0.48 - tvCenterY}px`,
      '--portal-scale': Math.max(targetScale, 1),
      '--portal-fade': 0,
    });
    setIsPortalEntering(true);

    portalTimerRef.current = window.setTimeout(() => {
      setHasBootStarted(true);
    }, 920);
  }, [hasBootStarted, isPortalEntering]);

  const insertAllTape = useCallback(() => {
    const tvRect = tvRef.current?.getBoundingClientRect();
    setIsOverTv(false);
    if (!tvRect) {
      setDragState(null);
      return;
    }
    setDragState((current) => current ? {
      ...current,
      phase: 'inserting',
      target: {
        x: tvRect.left + tvRect.width * 0.5,
        y: tvRect.top + tvRect.height * 0.69,
      },
    } : current);
    dragTimerRef.current = window.setTimeout(() => {
      setIsAllTapeInserted(true);
      setDragState(null);
    }, 440);
  }, []);

  const autoInsertAllTape = () => {
    if (dragState || isAllTapeInserted || isPortalEntering || hasBootStarted) return;
    const rect = allTapeRef.current?.getBoundingClientRect();
    if (!rect || !tvRef.current) return;
    setDragState({
      phase: 'auto-ready',
      pointer: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      offset: { x: rect.width / 2, y: rect.height / 2 },
      size: { width: rect.width, height: rect.height },
      target: null,
    });
  };

  useEffect(() => {
    if (dragState?.phase !== 'auto-ready') return undefined;
    let nextFrame;
    const frame = window.requestAnimationFrame(() => {
      nextFrame = window.requestAnimationFrame(() => {
        const rect = tvRef.current?.getBoundingClientRect();
        if (!rect) { setDragState(null); return; }
        setDragState((current) => ({
          ...current,
          phase: 'auto-moving',
          target: { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.69 },
        }));
      });
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(nextFrame);
    };
  }, [dragState?.phase]);

  useEffect(() => {
    if (dragState?.phase !== 'auto-moving') return undefined;
    const timer = window.setTimeout(insertAllTape, 700);
    return () => window.clearTimeout(timer);
  }, [dragState?.phase, insertAllTape]);

  const startAllTapeDrag = (event) => {
    if (event.button !== 0 || dragState || isAllTapeInserted) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);

    setDragState({
      phase: 'dragging',
      pointer: { x: event.clientX, y: event.clientY },
      offset: {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      },
      size: {
        width: rect.width,
        height: rect.height,
      },
      target: null,
    });
  };

  useEffect(() => {
    if (dragState?.phase !== 'dragging') {
      return undefined;
    }

    const handlePointerMove = (event) => {
      setIsOverTv(isPointOverTv(event.clientX, event.clientY));
      setDragState((current) => {
        if (!current || current.phase !== 'dragging') {
          return current;
        }

        return {
          ...current,
          pointer: { x: event.clientX, y: event.clientY },
        };
      });
    };

    const handlePointerUp = (event) => {
      const tvRect = tvRef.current?.getBoundingClientRect();
      const overTv = isPointOverTv(event.clientX, event.clientY);

      setIsOverTv(false);

      if (!overTv || !tvRect) {
        setDragState(null);
        return;
      }

      insertAllTape();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState?.phase, insertAllTape]);

  useEffect(() => {
    return () => {
      if (dragTimerRef.current) {
        window.clearTimeout(dragTimerRef.current);
      }
      if (portalTimerRef.current) {
        window.clearTimeout(portalTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isAllTapeInserted || isPortalEntering || hasBootStarted) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      enterPortal();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [enterPortal, hasBootStarted, isAllTapeInserted, isPortalEntering]);

  useEffect(() => {
    if (!hasBootStarted || isBootComplete) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIsBootComplete(true);
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [hasBootStarted, isBootComplete]);

  useEffect(() => {
    if (!hasBootStarted) {
      return undefined;
    }

    let touchStartY = 0;

    const handleWheel = (event) => {
      if (event.deltaY >= -8) {
        return;
      }

      event.preventDefault();
      exitPortal();
    };

    const handleTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event) => {
      const touchY = event.touches[0]?.clientY ?? touchStartY;

      if (touchY - touchStartY < 12) {
        return;
      }

      event.preventDefault();
      exitPortal();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [hasBootStarted, isPortalExiting]);

  const dragX = dragState
    ? (dragState.target?.x ?? dragState.pointer.x) - dragState.offset.x
    : 0;
  const dragY = dragState
    ? (dragState.target?.y ?? dragState.pointer.y) - dragState.offset.y
    : 0;

  return (
    <main className="intro-page">
      <section
        className={`desk-scene${isAllTapeInserted ? ' desk-scene--portal-active' : ''}`}
        style={cameraStyle}
        aria-label="Retro VHS portfolio intro"
      >
        <div className="scene-copy">
          <h1>
            Insert the tape.
            <span>Play the archive.</span>
          </h1>
        </div>

        <div className="vhs-stack" aria-label="Portfolio section tapes">
          {tapes.map((tape, index) => (
            <VhsTape key={tape.id} {...tape} index={index} />
          ))}
        </div>

        {!isAllTapeInserted && (
          <>
            <div className="drag-hint" aria-hidden="true">
              <span className="drag-hint__text">&#53580;&#51060;&#54532;&#47484; TV&#50640; &#45347;&#50612;&#51452;&#49464;&#50836;.</span>
              <span className="drag-hint__hands">
                <span>&#9756;</span>
                <span>&#9756;</span>
                <span>&#9756;</span>
              </span>
            </div>

            <div className="all-tape-slot">
              <button
                ref={allTapeRef}
                className={`all-tape${dragState ? ' all-tape--dragging' : ''}${dragState && dragState.phase !== 'dragging' ? ' all-tape--automating' : ''}`}
                type="button"
                aria-label="Drag ALL IN ONE tape to TV"
                onPointerDown={startAllTapeDrag}
              >
                <img src={tapeAll} alt="ALL IN ONE VHS tape" />
              </button>
            </div>
          </>
        )}

        <div className={`tv-stage${isOverTv ? ' tv-stage--drop-target' : ''}`} ref={tvRef}>
          <CrtTv isAllTapeInserted={isAllTapeInserted} screenRef={tvScreenRef} />
          {!isAllTapeInserted && (
            <button className="tv-skip-intro" type="button" onClick={autoInsertAllTape} disabled={Boolean(dragState)} aria-label="테이프를 자동으로 넣고 필름 아카이브 보기">
              <img src={skipIntroLabel} alt="Skip intro" draggable="false" />
            </button>
          )}
        </div>

        {dragState && (
          <div
            className={`all-tape-ghost${
              dragState.phase === 'inserting' ? ' all-tape-ghost--inserting' : ''
            }${dragState.phase === 'auto-moving' ? ' all-tape-ghost--auto-moving' : ''}`}
            style={{
              left: `${dragX}px`,
              top: `${dragY}px`,
              width: `${dragState.size.width}px`,
              height: `${dragState.size.height}px`,
            }}
            aria-hidden="true"
          >
            <img src={tapeAll} alt="" />
          </div>
        )}
      </section>

      {isAllTapeInserted && hasBootStarted && isBootComplete && <PortfolioScreen />}

      {isAllTapeInserted && hasBootStarted && (
        <div className={`portal-boot-layer${isBootComplete ? ' portal-boot-layer--complete' : ''}`}>
          <div className="portal-boot-frame">
            <img src={allBackground} alt="" />
            <LoadingOverlay isBootComplete={isBootComplete} />
          </div>
        </div>
      )}
    </main>
  );
}
