import { useCallback, useEffect, useRef, useState } from 'react';
import aboutMe from './assets/about_me.png';
import allBackground from './assets/all_background.png';
import contactImage from './assets/contact.png';
import crtTv from './assets/crt-tv.png';
import jibsalife from './assets/jibsalife.png';
import matmut from './assets/matmut.png';
import noSignalVideo from './assets/NO SIGNAL.mp4';
import pizzahut from './assets/pizzahut.png';
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
  { title: 'ABOUT ME', number: '01', image: aboutMe, hideLabel: true, href: aboutMe },
  { title: 'PROJECT 01', number: '02', image: jibsalife, hideLabel: true, href: jibsalife },
  { title: 'PROJECT 02', number: '03', image: simmons, hideLabel: true, href: simmons },
  { title: 'PROJECT 03', number: '04', image: matmut, hideLabel: true, href: matmut },
  { title: 'PROJECT 04', number: '05', image: pizzahut, hideLabel: true, href: pizzahut },
  { title: 'CONTACT ME', number: '06', image: contactImage, hideLabel: true, fit: 'contain', href: contactImage },
];

const filmSegments = Array.from({ length: 25 }, (_, index) => index);

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

function PortfolioScreen() {
  const screenRef = useRef(null);
  const segmentRefs = useRef([]);
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
            onPointerEnter={() => {
              motionRef.current.isPaused = true;
            }}
            onPointerLeave={() => {
              motionRef.current.isPaused = false;
            }}
            onFocus={() => {
              motionRef.current.isPaused = true;
            }}
            onBlur={() => {
              motionRef.current.isPaused = false;
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
    </section>
  );
}

export default function App() {
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
