import { useLayoutEffect, useRef, useState } from 'react';
import './AboutTimeline.css';

function ProfileInformation() {
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

function TimelineContent({ scene }) {
  if (scene.type === 'information') {
    return <ProfileInformation />;
  }

  if (scene.type === 'tools') {
    return (
      <ul className="profile-timeline__tools">
        {scene.items.map(([name, , icon]) => (
          <li key={name}>
            <img src={icon} alt="" loading="lazy" />
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

function TimelineSections({ scenes, unlockedSection }) {
  return (
    <ol className="profile-timeline__sections">
      {scenes.map((scene, index) => (
        <li className="profile-timeline__section" key={scene.id} data-unlocked={index <= unlockedSection ? 'true' : 'false'}>
          <div className="profile-timeline__heading">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h2>{scene.title}</h2>
          </div>
          <span className="profile-timeline__node" aria-hidden="true" />
          <div className="profile-timeline__content"><TimelineContent scene={scene} /></div>
        </li>
      ))}
    </ol>
  );
}

export default function AboutTimeline({ scenes }) {
  const timelineRef = useRef(null);
  const advanceRef = useRef(null);
  const [unlockedSection, setUnlockedSection] = useState(0);

  useLayoutEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sections = Array.from(timeline.querySelectorAll('.profile-timeline__section'));
    const sectionItems = sections.map(section => Array.from(section.querySelectorAll(
      '.profile-timeline__heading, .profile-timeline__content',
    )));
    const items = sectionItems.flat();
    const revealed = new Set();
    items.forEach(item => item.classList.add('profile-timeline__reveal'));
    timeline.classList.add('profile-timeline--reveal');
    setUnlockedSection(0);

    const revealSection = (index) => {
      if (revealed.has(index)) return;
      revealed.add(index);
      sectionItems[index]?.forEach(item => {
        item.style.setProperty('--reveal-delay', index === 0 || reducedMotion.matches
          ? '0ms' : `${Math.min((index - 1) % 5, 4) * 42}ms`);
        item.classList.add('profile-timeline__reveal--visible');
      });
      setUnlockedSection(previous => Math.max(previous, index));
    };
    revealSection(0);

    // Match the FAQ's viewport reveal, without capturing wheel, touch, or keys.
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const index = sections.indexOf(entry.target);
        // Include scenes passed by a fast scrollbar drag or a keyboard jump.
        for (let passed = 1; passed <= index; passed += 1) revealSection(passed);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }) : null;

    let previousY = window.scrollY;
    const startReveals = () => {
      const nextY = window.scrollY;
      if (nextY <= previousY) {
        previousY = nextY;
        return;
      }
      window.removeEventListener('scroll', startReveals);
      sections.slice(1).forEach((section, index) => {
        if (observer) observer.observe(section);
        else revealSection(index + 1);
      });
    };
    // Scene 01 is ready on arrival; later scenes wait for the first downward scroll.
    window.addEventListener('scroll', startReveals, { passive: true });
    advanceRef.current = () => {
      const inset = Math.max(64, window.innerHeight * 0.12);
      const next = sections.find(section => section.getBoundingClientRect().top > inset + 1);
      const top = next ? next.getBoundingClientRect().top + window.scrollY - inset
        : window.scrollY + window.innerHeight * 0.7;
      window.scrollTo({ top, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    };

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', startReveals);
      advanceRef.current = null;
      timeline.classList.remove('profile-timeline--reveal');
      items.forEach(item => {
        item.classList.remove('profile-timeline__reveal', 'profile-timeline__reveal--visible');
        item.style.removeProperty('--reveal-delay');
      });
    };
  }, [scenes]);
  return (
    <section ref={timelineRef} className="profile-timeline" id="about" aria-label="About me">
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
      <TimelineSections scenes={scenes} unlockedSection={unlockedSection} />
    </section>
  );
}
