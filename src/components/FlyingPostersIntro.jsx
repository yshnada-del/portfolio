import { useEffect, useRef } from 'react';

export default function FlyingPostersIntro() {
  const rootRef = useRef(null);

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      frameId = 0;
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const section = root.closest('.film-section--about-flight');
      const rect = section?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      const travel = Math.max(rect.height - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      const fallProgress = Math.min(progress / 0.32, 1);
      const holdProgress = Math.min(Math.max((progress - 0.32) / 0.08, 0), 1);
      const expandProgress = Math.min(Math.max((progress - 0.4) / 0.28, 0), 1);
      const horizontalProgress = Math.min(Math.max((progress - 0.68) / 0.22, 0), 1);
      const exitProgress = Math.min(Math.max((progress - 0.9) / 0.1, 0), 1);
      const easeFall = 1 - Math.pow(1 - fallProgress, 3);
      const easeHold = 1 - Math.pow(1 - holdProgress, 3);
      const easeExpand = 1 - Math.pow(1 - expandProgress, 3);
      const easeHorizontal = 1 - Math.pow(1 - horizontalProgress, 3);
      const easeExit = 1 - Math.pow(1 - exitProgress, 3);
      const archiveOpacity = Math.min(Math.max((progress - 0.58) / 0.1, 0), 1);
      const values = {
        '--flight-progress': progress.toFixed(4),
        '--card-y': `${(-58 + easeFall * 58).toFixed(2)}vh`,
        '--card-x': `${((1 - easeFall) * -10).toFixed(2)}vw`,
        '--card-rotate': `${(-22 + easeFall * 22 + Math.sin(progress * Math.PI * 4) * (1 - fallProgress) * 5).toFixed(2)}deg`,
        '--card-rotate-x': `${(26 - easeFall * 26).toFixed(2)}deg`,
        '--card-rotate-y': `${(-32 + easeFall * 32).toFixed(2)}deg`,
        '--card-scale': (0.3 + easeHold * 0.04 + easeExpand * 1.28).toFixed(4),
        '--card-opacity': (1 - Math.min(Math.max((progress - 0.62) / 0.12, 0), 1)).toFixed(4),
        '--card-shadow': (0.2 + easeExpand * 0.8).toFixed(4),
        '--archive-opacity': (archiveOpacity * (1 - easeExit * 0.42)).toFixed(4),
        '--archive-y': `${((1 - easeExpand) * 34 + easeExit * 18).toFixed(2)}px`,
        '--archive-x': `${(-34 * easeHorizontal).toFixed(2)}vw`,
        '--archive-scale': (0.92 + easeExpand * 0.08).toFixed(4),
      };
      const target = root.parentElement;

      Object.entries(values).forEach(([name, value]) => {
        root.style.setProperty(name, value);
        target?.style.setProperty(name, value);
      });
    };

    const requestUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div className="flying-posters" ref={rootRef} aria-hidden="true">
      <article className="about-flying-card">
        <div className="about-flying-card__scene">01 SCENE</div>
        <div className="about-flying-card__left">
          <strong>ABOUT<br />ME</strong>
          <span>YOO SEUNG HYUN</span>
          <p>UX/UI DESIGNER</p>
        </div>
        <div className="about-flying-card__portrait" />
        <div className="about-flying-card__grid">
          <span>EDUCATION</span>
          <span>EXPERIENCE</span>
          <span>TOOLS</span>
          <span>AWARDS</span>
        </div>
      </article>
    </div>
  );
}
