import { useEffect, useMemo, useRef, useState } from 'react';
import aboutFilm from './assets/about_film.png';
import crtTv from './assets/crt-tv.png';
import noSignalVideo from './assets/NO SIGNAL.mp4';
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

function VhsTape({ title, image, index, isDragging, onPointerDown }) {
  return (
    <div
      className={`vhs-tape${isDragging ? ' vhs-tape--dragging' : ''}`}
      style={{ '--stack-index': index }}
      role="button"
      tabIndex={0}
      aria-label={`Drag ${title} tape to TV`}
      onPointerDown={onPointerDown}
    >
      <img src={image} alt={`${title} VHS tape`} />
    </div>
  );
}

function CrtTv({ activeTapeId }) {
  const isAboutPlaying = activeTapeId === 'about';

  return (
    <>
      <div className="tv-video-screen" aria-hidden="true">
        {!isAboutPlaying && <video src={noSignalVideo} autoPlay muted loop playsInline />}
        {isAboutPlaying && (
          <div className="about-film-screen" style={{ '--about-film': `url(${aboutFilm})` }}>
            <div className="about-film-strip about-film-strip--top" />
            <div className="about-film-strip about-film-strip--bottom" />
          </div>
        )}
      </div>
      <img className="tv-image" src={crtTv} alt="CRT television" />
    </>
  );
}

export default function App() {
  const tvRef = useRef(null);
  const dragTimerRef = useRef(null);
  const [insertedTapeIds, setInsertedTapeIds] = useState([]);
  const [activeTapeId, setActiveTapeId] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [isOverTv, setIsOverTv] = useState(false);

  const visibleTapes = useMemo(
    () => tapes.filter((tape) => !insertedTapeIds.includes(tape.id)),
    [insertedTapeIds],
  );
  const dragPhase = dragState?.phase;
  const draggedTapeId = dragState?.tape.id;

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

  const startDrag = (event, tape, index) => {
    if (event.button !== 0) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);

    setDragState({
      tape,
      index,
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
    if (!draggedTapeId || dragPhase !== 'dragging') {
      return undefined;
    }

    const handlePointerMove = (event) => {
      const overTv = isPointOverTv(event.clientX, event.clientY);

      setIsOverTv(overTv);
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
        setInsertedTapeIds((current) => [...current, draggedTapeId]);
        setActiveTapeId(draggedTapeId);
        setDragState(null);
      }, 440);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragPhase, draggedTapeId]);

  useEffect(() => {
    return () => {
      if (dragTimerRef.current) {
        window.clearTimeout(dragTimerRef.current);
      }
    };
  }, []);

  const dragX = dragState
    ? (dragState.target?.x ?? dragState.pointer.x) - dragState.offset.x
    : 0;
  const dragY = dragState
    ? (dragState.target?.y ?? dragState.pointer.y) - dragState.offset.y
    : 0;

  return (
    <main className="intro-page">
      <section className="desk-scene" aria-label="Retro VHS portfolio intro">
        <div className="scene-copy">
          <p className="eyebrow">RETRO VHS PORTFOLIO</p>
          <h1>Insert a tape to play my work.</h1>
        </div>

        <div className="vhs-stack" aria-label="Portfolio section tapes">
          {visibleTapes.map((tape, index) => (
            <VhsTape
              key={tape.id}
              {...tape}
              index={index}
              isDragging={dragState?.tape.id === tape.id}
              onPointerDown={(event) => startDrag(event, tape, index)}
            />
          ))}
        </div>

        <div className={`tv-stage${isOverTv ? ' tv-stage--drop-target' : ''}`} ref={tvRef}>
          <CrtTv activeTapeId={activeTapeId} />
        </div>

        {dragState && (
          <div
            className={`vhs-drag-ghost${
              dragState.phase === 'inserting' ? ' vhs-drag-ghost--inserting' : ''
            }`}
            style={{
              left: `${dragX}px`,
              top: `${dragY}px`,
              width: `${dragState.size.width}px`,
              height: `${dragState.size.height}px`,
            }}
            aria-hidden="true"
          >
            <img src={dragState.tape.image} alt="" />
          </div>
        )}
      </section>
    </main>
  );
}
