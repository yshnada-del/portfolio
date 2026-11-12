import { useLayoutEffect, useRef, useState } from 'react';
import './AboutTimeline.css';

function TimelineContent({ scene }) {
  if (scene.type === 'information') {
    return (
      <div className="profile-timeline__information">
        <h3>YOO SEUNG HYUN</h3>
        <p className="profile-timeline__job">UX/UI Designer</p>
        <p className="profile-timeline__statement">사용자의 흐름을 이해하고,<br />가치 있는 경험을 설계합니다.</p>
        <dl>
          <div><dt>EMAIL</dt><dd>yshnada@gmail.com</dd></div>
          <div><dt>LOCATION</dt><dd>Bucheon, Korea</dd></div>
        </dl>
      </div>
    );
  }

  if (scene.type === 'tools') {
    return (
      <ul className="profile-timeline__tools">
        {scene.items.map(([name, , icon]) => (
          <li key={name}>
            <img src={icon} alt="" />
            <span>{name}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ol className="profile-timeline__entries">
      {scene.items.map(([date, title, description]) => (
        <li key={`${date}-${title}`}>
          <time>{date}</time>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </li>
      ))}
    </ol>
  );
}

export default function AboutTimeline({ scenes }) {
  const timelineRef = useRef(null);
  const advanceRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [unlockedSection, setUnlockedSection] = useState(0);

  useLayoutEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sections = Array.from(timeline.querySelectorAll('.profile-timeline__section'));
    const sectionItems = sections.map((section) => Array.from(section.querySelectorAll([
      '.profile-timeline__heading',
      '.profile-timeline__information > h3',
      '.profile-timeline__information > p',
      '.profile-timeline__information dl > div',
      '.profile-timeline__entries time',
      '.profile-timeline__entries h3',
      '.profile-timeline__entries p',
      '.profile-timeline__tools li',
    ].join(', '))));
    const items = sectionItems.flat();
    items.forEach((item) => item.classList.add('profile-timeline__reveal'));
    timeline.classList.add('profile-timeline--reveal');
    let currentStep = -1;
    let queuedSteps = 0;
    let busy = false;
    let stepTimer;
    let revealTimer;
    let scrollFrame;
    let wheelTotal = 0;
    let lastWheelAt = 0;
    let wheelGestureConsumed = false;
    const playNextStep = () => {
      if (busy || !queuedSteps || currentStep >= sections.length - 1) return;
      queuedSteps -= 1;
      currentStep += 1;
      busy = true;
      setHasStarted(true);
      setUnlockedSection(currentStep);
      const target = sections[currentStep];
      const fromY = window.scrollY;
      const targetY = Math.max(0, Math.min(
        target.getBoundingClientRect().top + fromY - Math.max(64, window.innerHeight * 0.12),
        document.documentElement.scrollHeight - window.innerHeight,
      ));
      const startedAt = performance.now();
      const travelDuration = Math.min(1100, Math.max(880, Math.abs(targetY - fromY) * 0.8));
      const moveToSection = (now) => {
        const progress = reducedMotion.matches ? 1 : Math.min(1, (now - startedAt) / travelDuration);
        // Continuous velocity and acceleration avoid the abrupt midpoint and
        // hard stop of the previous two-piece cubic motion.
        const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10);
        window.scrollTo({ top: fromY + (targetY - fromY) * eased, behavior: 'instant' });
        if (progress < 1) scrollFrame = window.requestAnimationFrame(moveToSection);
      };
      scrollFrame = window.requestAnimationFrame(moveToSection);
      // Commit the unlocked scene while its text is still transparent. Start
      // fading during the glide, rather than revealing behind a hidden parent.
      const currentItems = sectionItems[currentStep];
      revealTimer = window.setTimeout(() => {
        currentItems.forEach((item, index) => {
          item.style.setProperty('--reveal-delay', reducedMotion.matches ? '0ms' : `${Math.min(index, 5) * 64}ms`);
          item.classList.add('profile-timeline__reveal--visible');
        });
      }, reducedMotion.matches ? 0 : 160);
      // Consume queued inputs one at a time, after the text and a short pause.
      stepTimer = window.setTimeout(() => {
        busy = false;
        playNextStep();
      }, reducedMotion.matches ? 400 : 1500);
    };
    const queueStep = () => {
      if (currentStep + queuedSteps >= sections.length - 1) return;
      queuedSteps += 1;
      playNextStep();
    };
    advanceRef.current = queueStep;
    const stepping = () => currentStep < sections.length - 1 || busy;
    const handleWheel = (event) => {
      if (event.ctrlKey || event.deltaY <= 0 || !stepping()) return;
      event.preventDefault();
      const now = performance.now();
      // A strong flick emits many wheel events, including momentum. Consume
      // the whole burst once; only a fresh gesture can request another stop.
      if (now - lastWheelAt > 240) {
        wheelTotal = 0;
        wheelGestureConsumed = false;
      }
      lastWheelAt = now;
      if (wheelGestureConsumed) return;
      wheelTotal += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (wheelTotal >= 80) {
        wheelTotal = 0;
        wheelGestureConsumed = true;
        queueStep();
      }
    };
    let touchY = null;
    let touchGestureConsumed = false;
    const handleTouchStart = (event) => {
      touchY = event.touches[0]?.clientY ?? null;
      touchGestureConsumed = false;
    };
    const handleTouchMove = (event) => {
      const nextY = event.touches[0]?.clientY;
      if (touchY === null || nextY === undefined || nextY >= touchY || !stepping()) return;
      event.preventDefault();
      if (touchGestureConsumed) return;
      if (touchY - nextY >= 60) {
        touchGestureConsumed = true;
        queueStep();
      }
    };
    const handleKeyDown = (event) => {
      if (event.target.closest('button, a, input, textarea, select, [contenteditable]')) return;
      if (!['ArrowDown', 'PageDown', 'End', ' '].includes(event.key) || event.shiftKey || !stepping()) return;
      event.preventDefault();
      if (!event.repeat) queueStep();
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(stepTimer);
      window.clearTimeout(revealTimer);
      window.cancelAnimationFrame(scrollFrame);
      advanceRef.current = null;
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      timeline.classList.remove('profile-timeline--reveal');
      items.forEach((item) => {
        item.classList.remove('profile-timeline__reveal', 'profile-timeline__reveal--visible');
        item.style.removeProperty('--reveal-delay');
      });
    };
  }, [scenes]);
  return (
    <section ref={timelineRef} className={`profile-timeline${hasStarted ? ' profile-timeline--started' : ''}`} id="about" aria-label="About me">
      <div className="project-proposal__film project-proposal__film--left profile-timeline__film" aria-hidden="true" />
      <div className="project-proposal__film project-proposal__film--right profile-timeline__film" aria-hidden="true" />
      <header className="profile-timeline__intro">
        <h1>ABOUT ME</h1>
        <button
          className="profile-timeline__scroll-hint"
          type="button"
          aria-label="아래로 스크롤해 프로필 보기"
          onClick={() => advanceRef.current?.()}
        >
          <span className="profile-timeline__mouse" aria-hidden="true"><span /></span>
          <span className="profile-timeline__scroll-label">SCROLL DOWN</span>
        </button>
      </header>
      <ol className="profile-timeline__sections">
        {scenes.map((scene, index) => (
          <li className="profile-timeline__section" key={scene.id} data-unlocked={hasStarted && index <= unlockedSection ? 'true' : 'false'}>
            <div className="profile-timeline__heading">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{scene.title}</h2>
            </div>
            <span className="profile-timeline__node" aria-hidden="true" />
            <div className="profile-timeline__content"><TimelineContent scene={scene} /></div>
          </li>
        ))}
      </ol>
    </section>
  );
}
