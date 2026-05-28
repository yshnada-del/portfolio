import { useCallback, useEffect, useRef, useState } from 'react';
import allBackground from './assets/all_background.png';
import crtTv from './assets/crt-tv.png';
import noSignalVideo from './assets/NO SIGNAL.mp4';
import tapeAll from './assets/tape-all.png';
import tapeAbout from './assets/tape-about.png';
import tapeProject01 from './assets/tape-project-01.png';
import tapeProject02 from './assets/tape-project-02.png';
import tapeProject03 from './assets/tape-project-03.png';
import tapeProject04 from './assets/tape-project-04.png';
import tapeContact from './assets/tape-contact.png';

const tapes = [
  { id: 'about', title: 'ABOUT ME', image: tapeAbout },
  { id: 'project-01', title: 'PROJECT 01', image: tapeProject01 },
  { id: 'project-02', title: 'PROJECT 02', image: tapeProject02 },
  { id: 'project-03', title: 'PROJECT 03', image: tapeProject03 },
  { id: 'project-04', title: 'PROJECT 04', image: tapeProject04 },
  { id: 'contact', title: 'CONTACT', image: tapeContact },
];

const portfolioPanels = [
  'ABOUT ME',
  'PROJECT 01',
  'PROJECT 02',
  'PROJECT 03',
  'PROJECT 04',
  'CONTACT ME',
];

const panelSliceCount = 18;
const panelSlices = Array.from({ length: panelSliceCount }, (_, index) => index);

const getLoopOffset = (index, progress, total) => {
  const half = total / 2;
  const rawOffset = ((index - progress + half) % total + total) % total - half;

  return rawOffset;
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

function PortfolioScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;
    let startTime = 0;
    const duration = 18000;

    const animate = (time) => {
      if (!startTime) {
        startTime = time;
      }

      setProgress(((time - startTime) / duration) * portfolioPanels.length);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="portfolio-screen" aria-label="Portfolio content">
      <div className="portfolio-stage">
        {portfolioPanels.map((title, index) => {
          const offset = getLoopOffset(index, progress, portfolioPanels.length);
          const distance = Math.abs(offset);
          const side = Math.sign(offset);
          const curve = Math.max(0, 1 - distance / 0.82);
          const scale = Math.max(0.5, 1.18 - distance * 0.14);
          const z = 210 - distance * 70;
          const x = offset * 245;
          const rotateY = side * -18 * Math.min(distance, 1.35);
          const opacity = Math.max(0.34, 1 - distance * 0.13);
          const layer = Math.round((10 - distance) * 10);

          return (
            <article
              className="portfolio-panel"
              key={title}
              style={{
                '--panel-index': index,
                '--panel-x': `${x}px`,
                '--panel-z': `${z}px`,
                '--panel-rotate': `${rotateY}deg`,
                '--panel-scale': scale,
                '--panel-opacity': opacity,
                '--panel-curve': curve,
                zIndex: layer,
              }}
            >
              <div className="portfolio-panel__surface" aria-hidden="true">
                {panelSlices.map((sliceIndex) => {
                  const sliceCenter = (sliceIndex + 0.5) / panelSliceCount - 0.5;
                  const sliceAngle = sliceCenter * 72 * curve;
                  const sliceDepth = Math.cos(sliceCenter * Math.PI) * 104 * curve;

                  return (
                    <span
                      className="portfolio-panel__slice"
                      key={sliceIndex}
                      style={{
                        '--slice-index': sliceIndex,
                        '--slice-angle': `${sliceAngle}deg`,
                        '--slice-depth': `${sliceDepth}px`,
                      }}
                    />
                  );
                })}
              </div>
              <div className="portfolio-panel__content">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h2>{title}</h2>
              </div>
            </article>
          );
        })}
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
