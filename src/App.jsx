import { useCallback, useEffect, useRef, useState } from 'react';
import ArchivePage from './components/ArchivePage.jsx';
import { getArchiveUrl, isCurrentPath } from './routes.js';
import aboutMe from './assets/about_me.png';
import aboutMePage from './assets/about_me_page.svg';
import allBackground from './assets/all_background.png';
import contactImage from './assets/contact.png';
import cssIcon from './assets/css.png';
import crtTv from './assets/crt-tv.png';
import figmaIcon from './assets/figma.png';
import htmlIcon from './assets/html.png';
import illustIcon from './assets/illust.png';
import javascriptIcon from './assets/javascript.png';
import jibsalife from './assets/jibsalife.png';
import mailIcon from './assets/mail.png';
import matmut from './assets/matmut.png';
import noSignalVideo from './assets/NO SIGNAL.mp4';
import phoneIcon from './assets/phone.png';
import pizzahut from './assets/pizzahut.png';
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
import simmons from './assets/simmons.png';

const tapes = [
  { id: 'about', title: 'ABOUT ME', image: tapeAbout },
  { id: 'project-01', title: 'PROJECT 01', image: tapeProject01 },
  { id: 'project-02', title: 'PROJECT 02', image: tapeProject02 },
  { id: 'project-03', title: 'PROJECT 03', image: tapeProject03 },
  { id: 'project-04', title: 'PROJECT 04', image: tapeProject04 },
  { id: 'contact', title: 'CONTACT', image: tapeContact },
];

const filmFrames = [
  { id: 'about', title: 'ABOUT ME', number: '01', image: aboutMePage, hideLabel: true, href: getArchiveUrl('about') },
  { id: 'project-01', title: 'PROJECT 01', number: '02', image: jibsalife, hideLabel: true, href: getArchiveUrl('project-01') },
  { id: 'project-02', title: 'PROJECT 02', number: '03', image: simmons, hideLabel: true, href: getArchiveUrl('project-02') },
  { id: 'project-03', title: 'PROJECT 03', number: '04', image: matmut, hideLabel: true, href: getArchiveUrl('project-03') },
  { id: 'project-04', title: 'PROJECT 04', number: '05', image: pizzahut, hideLabel: true, href: getArchiveUrl('project-04') },
  { id: 'contact', title: 'CONTACT ME', number: '06', image: contactImage, hideLabel: true, href: getArchiveUrl('contact') },
];

const filmSegments = Array.from({ length: 25 }, (_, index) => index);

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
    { name: 'Figma', image: figmaIcon, percent: '90%', value: 90 },
    { name: 'Photoshop', image: photoshopIcon, percent: '85%', value: 85 },
    { name: 'Illustrator', image: illustIcon, percent: '80%', value: 80 },
    { name: 'HTML', image: htmlIcon, percent: '82%', value: 82 },
    { name: 'CSS', image: cssIcon, percent: '78%', value: 78 },
    { name: 'JavaScript', image: javascriptIcon, percent: '76%', value: 76 },
    { name: 'React', image: reactIcon, percent: '72%', value: 72 },
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
  const screenRef = useRef(null);
  const segmentRefs = useRef([]);
  const aboutTimerRef = useRef(null);
  const aboutFrameRef = useRef(null);
  const [aboutTransition, setAboutTransition] = useState(null);
  const [hoverCue, setHoverCue] = useState(null);
  const motionRef = useRef({
    curveAmount: 0,
    curvePos: 0,
    rotationX: 20,
    rotationDirection: -1,
    isPaused: false,
    lastTime: 0,
  });
  const frameRef = useRef(null);
  const repeatedFrames = [...filmFrames, ...filmFrames, ...filmFrames];

  const openAboutMe = (event, frame) => {
    if (!frame.id) {
      return;
    }

    event.preventDefault();
    window.location.href = getArchiveUrl(frame.id);
  };

  const closeAboutMe = () => {
    if (aboutTimerRef.current) {
      window.clearTimeout(aboutTimerRef.current);
    }

    setAboutTransition((current) => (current ? { ...current, phase: 'closing', isExpanded: false } : current));

    aboutTimerRef.current = window.setTimeout(() => {
      setAboutTransition(null);
      motionRef.current.isPaused = false;
    }, 680);
  };

  useEffect(() => {
    if (aboutTransition) {
      motionRef.current.isPaused = true;
    }
  }, [aboutTransition]);

  const renderFilmStrip = () => (
    <ul
      className="film-strip"
    >
      {repeatedFrames.map((frame, frameIndex) => (
        <li
          className={`film-strip__frame${frame.hideLabel ? ' film-strip__frame--image-only' : ''}${
            frame.fit === 'contain' ? ' film-strip__frame--contain' : ''
          }`}
          key={`${frame.title}-${frameIndex}`}
        >
          <a
            className="film-strip__link"
            href={frame.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${frame.title} 이미지 열기`}
            onClick={(event) => openAboutMe(event, frame)}
            onPointerEnter={(event) => {
              motionRef.current.isPaused = true;
              setHoverCue({ x: event.clientX, y: event.clientY });
            }}
            onPointerMove={(event) => {
              setHoverCue({ x: event.clientX, y: event.clientY });
            }}
            onPointerLeave={() => {
              motionRef.current.isPaused = false;
              setHoverCue(null);
            }}
            onFocus={(event) => {
              motionRef.current.isPaused = true;
              const rect = event.currentTarget.getBoundingClientRect();
              setHoverCue({ x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.62 });
            }}
            onBlur={() => {
              motionRef.current.isPaused = false;
              setHoverCue(null);
            }}
          >
            <img src={frame.image} alt="" />
            {!frame.hideLabel && (
              <>
                <span>{frame.number}</span>
                <h2>{frame.title}</h2>
              </>
            )}
          </a>
        </li>
      ))}
    </ul>
  );

  const renderSegment = (index = 0) => (
    <div
      className="film-flow__segment"
      data-offset={index}
      key={index}
      ref={(node) => {
        segmentRefs.current[index] = node;
      }}
    >
      <div className="film-flow__window">{renderFilmStrip()}</div>
      {index < filmSegments.length - 1 && renderSegment(index + 1)}
    </div>
  );

  useEffect(() => {
    const screen = screenRef.current;

    if (!screen) {
      return undefined;
    }

    const animate = (time = 0) => {
      const motion = motionRef.current;
      const delta = motion.lastTime ? Math.min(time - motion.lastTime, 34) : 16.7;
      const step = delta / 16.7;

      motion.lastTime = time;

      if (motion.isPaused) {
        frameRef.current = window.requestAnimationFrame(animate);
        return;
      }

      motion.rotationX += motion.rotationDirection * 0.022 * step;

      if (motion.rotationX <= -20) {
        motion.rotationX = -20;
        motion.rotationDirection = 1;
      }

      if (motion.rotationX >= 20) {
        motion.rotationX = 20;
        motion.rotationDirection = -1;
      }

      screen.style.setProperty('--film-rotation-x', `${motion.rotationX}deg`);

      motion.curveAmount += step * 0.334;
      segmentRefs.current.forEach((segment, index) => {
        if (!segment) {
          return;
        }

        const r = Math.cos(motion.curveAmount / 20 + index / 5);
        const shade = Math.abs(Math.floor(r * 10)) / 10;

        segment.style.setProperty('--segment-rotate-y', `${r * 0.8}deg`);
        segment.style.setProperty('--segment-bright', `${r >= 0 ? shade * 0.025 : 0}`);
        segment.style.setProperty('--segment-dark', `${r <= 0 ? shade * 0.025 : 0}`);
        segment.style.setProperty('--strip-offset', `${-(index * 100) - motion.curvePos}px`);

        motion.curvePos += 0.3 * step;
      });

      if (motion.curvePos >= 2880) {
        motion.curvePos = 0;
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
      if (aboutFrameRef.current) {
        window.cancelAnimationFrame(aboutFrameRef.current);
      }
      if (aboutTimerRef.current) {
        window.clearTimeout(aboutTimerRef.current);
      }
    };
  }, []);

  return (
    <section className="portfolio-screen" ref={screenRef} aria-label="Portfolio content">
      <div className="film-flow" aria-label="Portfolio sections">
        <div className="film-flow__stage">
          <div className="film-flow__ribbon">
            {renderSegment()}
          </div>
        </div>
      </div>
      {hoverCue && (
        <div
          className="film-hover-cue"
          style={{
            left: `${hoverCue.x}px`,
            top: `${hoverCue.y}px`,
          }}
          aria-hidden="true"
        >
          click me!
        </div>
      )}
      <AboutMeOverlay transition={aboutTransition} onClose={closeAboutMe} />
    </section>
  );
}

export default function App() {
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

    const insetX = tvRect.width * 0.16;
    const insetY = tvRect.height * 0.2;

    return (
      x >= tvRect.left + insetX &&
      x <= tvRect.right - insetX &&
      y >= tvRect.top + insetY &&
      y <= tvRect.bottom - insetY
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

  const startAllTapeDrag = (event) => {
    if (event.button !== 0) {
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

      setDragState((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          phase: 'inserting',
          target: {
            x: tvRect.left + tvRect.width * 0.5,
            y: tvRect.top + tvRect.height * 0.69,
          },
        };
      });

      dragTimerRef.current = window.setTimeout(() => {
        setIsAllTapeInserted(true);
        setDragState(null);
      }, 440);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState?.phase]);

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
                className={`all-tape${dragState ? ' all-tape--dragging' : ''}`}
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
        </div>

        {dragState && (
          <div
            className={`all-tape-ghost${
              dragState.phase === 'inserting' ? ' all-tape-ghost--inserting' : ''
            }`}
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
