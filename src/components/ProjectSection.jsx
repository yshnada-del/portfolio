import { useEffect, useRef } from 'react';
import FilmSection from './FilmSection.jsx';

function ProjectMeta({ label, value }) {
  const isTools = String(label).toLowerCase() === 'tools' || label === '툴';
  const tools = isTools && typeof value === 'string' ? value.split(' / ') : [];
  const groupedTools =
    tools.length > 1
      ? [...tools.slice(0, -2), tools.slice(-2).join(' / ')]
      : tools;

  return (
    <li>
      <span>{label}</span>
      <strong>
        {groupedTools.length > 0
          ? groupedTools.map((tool, index) => (
              <span className="project-frame__meta-tool" key={tool}>
                {tool}
                {index < groupedTools.length - 1 ? ' / ' : ''}
              </span>
            ))
          : value}
      </strong>
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

  if (type === 'figma-frame') {
    return (
      <div className="archive-image-preview archive-image-preview--figma-frame">
        <img src={image} alt={`${title} preview`} />
      </div>
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

function ProjectWorkItem({ item, project, index, layoutIndex = index, isDuplicate = false }) {
  return (
    <article
      className={`project-work-card${isDuplicate ? ' project-work-card--duplicate' : ''}`}
      data-work-reveal
      data-work-index={layoutIndex}
      style={{ '--work-index': index }}
      aria-hidden={isDuplicate ? 'true' : undefined}
    >
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
  const canvasRef = useRef(null);
  const works = project.works ?? getProjectWorks(project);
  const imageSources = project.images?.length ? project.images : [project.image].filter(Boolean);
  const galleryWorks = works;
  const metaLabels = project.metaLabels ?? {
    role: 'ROLE',
    period: 'PERIOD',
    tools: 'TOOLS',
    contribution: 'CONTRIB',
  };
  const actionLinks = project.actionLinks ?? [
    { label: 'View Case Study', href: project.caseStudyUrl ?? '#' },
    { label: 'GitHub', href: project.githubUrl ?? '#' },
    { label: 'Live Site', href: project.liveUrl ?? '#' },
  ];

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    const section = frame?.closest('.film-section--project-scroll');
    const gallery = frame?.querySelector('.project-frame__gallery');

    if (!frame || !canvas || !section || !gallery) {
      return undefined;
    }

    let frameId = 0;
    let motionId = 0;
    let scrollTarget = 0;
    let scrollCurrent = 0;
    let scrollBase = 0;
    let scrollReady = false;
    let imageReady = false;
    let destroyed = false;
    const images = [];

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const isCompactViewport = () => window.matchMedia('(max-width: 760px)').matches;

    const drawImageFull = (context, img, x, y, width, height) => {
      context.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, y, width, height);
    };

    const renderGallery = (scrollValue) => {
      const cards = Array.from(gallery.querySelectorAll('.project-work-card'));

      if (isCompactViewport()) {
        const context = canvas.getContext('2d');
        context?.clearRect(0, 0, canvas.width, canvas.height);
        cards.forEach((card) => {
          card.style.removeProperty('--plane-scale');
          card.style.removeProperty('--plane-y');
          card.style.removeProperty('--plane-opacity');
          card.classList.add('is-visible');
        });
        return;
      }

      if (!imageReady || images.length === 0) {
        return;
      }

      const context = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const nextWidth = Math.max(1, Math.round(rect.width * ratio));
      const nextHeight = Math.max(1, Math.round(rect.height * ratio));

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);

      const itemCount = images.length;
      const planeWidth = rect.width;
      const heights = images.map((img) => planeWidth / (img.naturalWidth / img.naturalHeight));
      const totalHeight = heights.reduce((sum, height) => sum + height, 0);

      if (!scrollReady && heights[0]) {
        scrollCurrent = -(rect.height / 2 - heights[0] / 2);
        scrollTarget = scrollCurrent;
        scrollBase = scrollCurrent;
        scrollReady = true;
      }

      let y = -scrollValue;
      const wrapLimit = totalHeight * 0.85;

      while (y < -wrapLimit) {
        y += wrapLimit;
      }

      while (y > 0) {
        y -= wrapLimit;
      }

      let placedCount = 0;
      const placed = new Uint8Array(itemCount);
      const maxIterations = itemCount * 5;

      for (let iteration = 0; iteration < maxIterations; iteration += 1) {
        const index = iteration % itemCount;
        const currentImage = images[index];
        const naturalHeight = heights[index];
        const centerY = y + naturalHeight / 2;
        const distance = Math.abs(centerY - rect.height / 2) / rect.height;
        const scale = clamp(1 - distance * 0.3, 0.85, 1);
        const drawWidth = planeWidth * scale;
        const drawHeight = naturalHeight * scale;
        const drawX = planeWidth - drawWidth;

        if (!placed[index] && y + drawHeight > -drawHeight && y < rect.height + drawHeight) {
          placed[index] = 1;
          placedCount += 1;
          context.save();
          context.globalAlpha = clamp(0.9 + (scale - 0.85) * 0.66, 0.9, 1);
          drawImageFull(context, currentImage, drawX, y, drawWidth, drawHeight);
          context.restore();
        }

        y += drawHeight;

        if (placedCount === itemCount && y > rect.height) {
          break;
        }
      }

      cards.forEach((card) => {
        card.classList.remove('is-visible');
      });
    };

    const animateGallery = () => {
      const delta = scrollTarget - scrollCurrent;
      scrollCurrent += delta * 0.09;

      if (Math.abs(delta) < 0.5) {
        scrollCurrent = scrollTarget;
        renderGallery(scrollCurrent);
        motionId = 0;
        return;
      }

      renderGallery(scrollCurrent);
      motionId = window.requestAnimationFrame(animateGallery);
    };

    const updateGalleryPosition = () => {
      frameId = 0;
      if (!motionId) {
        motionId = window.requestAnimationFrame(animateGallery);
      }
    };

    const scheduleUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateGalleryPosition);
    };

    const scrollParent = section.closest('.archive-page');

    const moveToTarget = () => {
      if (!motionId) {
        motionId = window.requestAnimationFrame(animateGallery);
      }
    };

    const onWheel = (event) => {
      if (isCompactViewport()) {
        return;
      }

      event.preventDefault();
      scrollTarget += event.deltaY;
      moveToTarget();
    };

    const onNativeScroll = () => {
      if (isCompactViewport() || !scrollReady) {
        return;
      }

      const sectionStart = section.offsetTop;
      const sectionRange = Math.max(1, section.offsetHeight - window.innerHeight);
      const sectionScroll = clamp(window.scrollY - sectionStart, 0, sectionRange);
      scrollTarget = scrollBase + sectionScroll;
      moveToTarget();
    };

    const onKeyDown = (event) => {
      if (isCompactViewport()) {
        return;
      }

      const keyStep = window.innerHeight * 0.72;
      const keys = {
        ArrowDown: keyStep,
        ArrowRight: keyStep,
        PageDown: keyStep,
        ' ': keyStep,
        ArrowUp: -keyStep,
        ArrowLeft: -keyStep,
        PageUp: -keyStep,
      };

      if (!(event.key in keys)) {
        return;
      }

      event.preventDefault();
      scrollTarget += keys[event.key];
      moveToTarget();
    };

    let loadedCount = 0;

    imageSources.forEach((source) => {
      const img = new Image();
      img.onload = () => {
        if (destroyed) {
          return;
        }

        loadedCount += 1;

        if (loadedCount === imageSources.length) {
          imageReady = true;
          scrollReady = false;
          updateGalleryPosition();
        }
      };
      img.src = source;
      images.push(img);
    });

    if (imageSources.length === 0) {
      imageReady = true;
    }

    if (destroyed) {
        return;
      }

    updateGalleryPosition();
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      destroyed = true;

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      if (motionId) {
        window.cancelAnimationFrame(motionId);
      }

      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [imageSources.join('|'), works.length]);

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
            <ProjectMeta label={metaLabels.role} value={project.role} />
            <ProjectMeta label={metaLabels.period} value={project.period} />
            <ProjectMeta label={metaLabels.tools} value={project.tools} />
            <ProjectMeta label={metaLabels.contribution} value={project.contribution ?? project.role} />
          </ul>
          <div className="project-frame__actions">
            {actionLinks.map((link) => (
              <a href={link.href ?? '#'} target={link.target} rel={link.rel} key={link.label}>
                <span>{link.label}</span>
                <span className="project-frame__action-icon" aria-hidden="true" />
              </a>
            ))}
          </div>
        </aside>
        <canvas className="project-frame__canvas" ref={canvasRef} aria-hidden="true" />
        <div className="project-frame__gallery" aria-label={`${project.title} work gallery`}>
          {galleryWorks.map((item, index) => (
            <ProjectWorkItem
              item={item}
              project={project}
              index={index % works.length}
              layoutIndex={index}
              isDuplicate={index >= works.length}
              key={`${item.key ?? `${project.id}-${index}`}-${index}`}
            />
          ))}
        </div>
      </div>
    </FilmSection>
  );
}
