import { useEffect, useRef } from 'react';
import FilmSection from './FilmSection.jsx';

function ProjectMeta({ label, value }) {
  return (
    <li>
      <span>{label}</span>
      <strong>{value}</strong>
    </li>
  );
}

function MobileMockups({ variant }) {
  return (
    <div className={`archive-mockups archive-mockups--${variant}`} aria-label="Mobile app preview placeholders">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="phone-mockup" key={index}>
          <div className="phone-mockup__bar" />
          <div className="phone-mockup__hero" />
          <div className="phone-mockup__line phone-mockup__line--wide" />
          <div className="phone-mockup__line" />
          <div className="phone-mockup__cards">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopPreview({ variant }) {
  return (
    <div className={`desktop-preview desktop-preview--${variant}`}>
      <div className="desktop-preview__nav">
        <span />
        <span />
        <span />
      </div>
      <div className="desktop-preview__body">
        <div>
          <span className="desktop-preview__eyebrow" />
          <span className="desktop-preview__title" />
          <span className="desktop-preview__title desktop-preview__title--short" />
          <span className="desktop-preview__copy" />
          <span className="desktop-preview__button" />
        </div>
        <div className="desktop-preview__object" />
      </div>
    </div>
  );
}

function ProjectVisual({ type, image, title }) {
  if (type === 'mobile-light') {
    return <MobileMockups variant="light" />;
  }

  if (type === 'mobile-dark') {
    return <MobileMockups variant="dark" />;
  }

  if (type === 'desktop-burgundy') {
    return image ? (
      <div className="archive-image-preview archive-image-preview--burgundy">
        <img src={image} alt={`${title} preview`} />
      </div>
    ) : (
      <DesktopPreview variant="burgundy" />
    );
  }

  if (type === 'desktop-pizza') {
    return image ? (
      <div className="archive-image-preview archive-image-preview--pizza">
        <img src={image} alt={`${title} preview`} />
      </div>
    ) : (
      <DesktopPreview variant="pizza" />
    );
  }

  return null;
}

const workCopy = {
  'mobile-light': [
    ['Overview Flow', 'Onboarding, dashboard, daily care journey'],
    ['Care Record', 'Health logging and visual summary screens'],
    ['Community', 'Checklist, feed, and profile interaction states'],
    ['Design System', 'Reusable mobile components and app states'],
  ],
  'mobile-dark': [
    ['Discovery Flow', 'Preference setup and recommendation entry'],
    ['Place Detail', 'Dark mobile cards for mood-based browsing'],
    ['Saved Routes', 'Personal list, map, and review moments'],
    ['Service States', 'Empty, loading, and confirmation screens'],
  ],
  default: [
    ['Landing Experience', 'Hero, navigation, and first-view composition'],
    ['Product Story', 'Campaign sections and conversion modules'],
    ['Responsive Layout', 'Desktop, tablet, and mobile breakpoint study'],
    ['Interaction States', 'Hover, scroll, and micro-interaction details'],
  ],
};

function getProjectWorks(project) {
  const items = workCopy[project.visualType] ?? workCopy.default;

  return items.map(([title, description], index) => ({
    title,
    description,
    visualType: project.visualType,
    image: project.image,
    key: `${project.id}-work-${index + 1}`,
  }));
}

function ProjectWorkItem({ item, project, index }) {
  return (
    <article className="project-work-card" data-work-reveal style={{ '--work-index': index }}>
      <div className="project-work-card__header">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      </div>
      <div className="project-work-card__visual">
        <ProjectVisual type={item.visualType} image={item.image} title={`${project.title} ${item.title}`} />
      </div>
    </article>
  );
}

export default function ProjectSection({ project }) {
  const frameRef = useRef(null);
  const works = project.works ?? getProjectWorks(project);

  useEffect(() => {
    const frame = frameRef.current;
    const section = frame?.closest('.film-section--project-scroll');
    const gallery = frame?.querySelector('.project-frame__gallery');

    if (!frame || !section || !gallery) {
      return undefined;
    }

    let frameId = 0;

    const updateGalleryPosition = () => {
      frameId = 0;

      if (window.matchMedia('(max-width: 1120px)').matches) {
        frame.style.setProperty('--gallery-y', '0px');
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(rect.height - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      const viewport = window.innerHeight;
      const galleryHeight = gallery.scrollHeight;
      const startY = viewport * 0.02;
      const endY = Math.min(-(galleryHeight - viewport * 0.82), startY);
      const y = startY + (endY - startY) * progress;

      frame.style.setProperty('--gallery-y', `${y}px`);
    };

    const scheduleUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateGalleryPosition);
    };

    updateGalleryPosition();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [works.length]);

  return (
    <FilmSection
      id={project.id}
      scene={project.scene}
      label={project.edgeLabel}
      tone={project.tone}
      className="film-section--project-scroll"
    >
      <div className="project-frame" ref={frameRef} style={{ '--work-count': works.length }}>
        <aside className="project-frame__copy">
          <p className="project-frame__number">{project.number}</p>
          <h2>{project.title}</h2>
          <p className="project-frame__tagline">{project.tagline}</p>
          <p className="project-frame__description">{project.description}</p>
          <ul className="project-frame__meta">
            <ProjectMeta label="ROLE" value={project.role} />
            <ProjectMeta label="PERIOD" value={project.period} />
            <ProjectMeta label="TOOLS" value={project.tools} />
            <ProjectMeta label="CONTRIB" value={project.contribution ?? project.role} />
          </ul>
          <div className="project-frame__actions">
            {/* Replace these placeholder links with the real project URLs later. */}
            <a href={project.caseStudyUrl ?? '#'}>View Case Study</a>
            <a href={project.githubUrl ?? '#'}>GitHub</a>
            <a href={project.liveUrl ?? '#'}>Live Site</a>
          </div>
        </aside>
        <div className="project-frame__gallery" aria-label={`${project.title} work gallery`}>
          {works.map((item, index) => (
            <ProjectWorkItem item={item} project={project} index={index} key={item.key ?? `${project.id}-${index}`} />
          ))}
        </div>
      </div>
    </FilmSection>
  );
}
