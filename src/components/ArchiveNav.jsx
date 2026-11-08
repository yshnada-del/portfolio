import { useEffect, useRef, useState } from 'react';
import { getArchiveUrl, getHomeUrl } from '../routes.js';
import './ArchiveNav.css';

const archiveNavItems = [
  { id: 'home', label: 'HOME', href: getHomeUrl() },
  { id: 'about', label: 'ABOUT' },
  { id: 'project-01', label: 'PROJECT' },
  { id: 'contact', label: 'CONTACT' },
];

export default function ArchiveNav({ activeId, onSelect, proposalFrameRef }) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const lastMotionAtRef = useRef(0);
  const activeIndex = activeId?.startsWith('project-')
    ? 2
    : Math.max(0, archiveNavItems.findIndex((item) => item.id === activeId));

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    let proposalHasScrolled = false;
    setIsHidden(false);

    const setByDelta = (delta) => {
      if (Math.abs(delta) < 8) {
        return;
      }

      lastMotionAtRef.current = window.performance.now();
      setIsHidden(delta > 0);
    };

    const handleWheel = (event) => {
      setByDelta(event.deltaY);
    };

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      const delta = nextScrollY - lastScrollYRef.current;
      lastScrollYRef.current = nextScrollY;
      setByDelta(delta);
    };

    const handleKeyDown = (event) => {
      const downKeys = ['ArrowDown', 'PageDown', ' '];
      const upKeys = ['ArrowUp', 'PageUp'];

      if (downKeys.includes(event.key)) {
        setByDelta(24);
      }

      if (upKeys.includes(event.key)) {
        setByDelta(-24);
      }
    };

    const handleMouseMove = (event) => {
      if (proposalHasScrolled) return;
      if (event.clientY <= 90 && window.performance.now() - lastMotionAtRef.current > 120) {
        setIsHidden(false);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true, capture: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);

    // The proposal reports its own scrolling, including nested scroll containers.
    const handleProposalMessage = (event) => {
      if (!proposalFrameRef?.current || event.source !== proposalFrameRef.current.contentWindow) return;
      if (event.data?.type !== 'proposal-nav-visibility' || typeof event.data.hidden !== 'boolean') return;
      proposalHasScrolled = event.data.hidden;
      lastMotionAtRef.current = window.performance.now();
      setIsHidden(proposalHasScrolled);
    };
    window.addEventListener('message', handleProposalMessage);

    return () => {
      window.removeEventListener('message', handleProposalMessage);
      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeId, proposalFrameRef]);

  const handleClick = (event, id) => {
    event.preventDefault();
    setIsHidden(false);

    if (id === 'home') {
      window.location.href = getHomeUrl();
      return;
    }

    onSelect?.(id);
    window.history.pushState(null, '', getArchiveUrl(id));

    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className={`archive-nav archive-nav--glass${isHidden ? ' archive-nav--hidden' : ''}`}
      style={{ '--active-index': activeIndex }}
      onPointerMove={(event) => {
        if (event.pointerType === 'touch') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--glare-x', `${event.clientX - bounds.left}px`);
        event.currentTarget.style.setProperty('--glare-y', `${event.clientY - bounds.top}px`);
      }}
      aria-label="Archive section navigation"
    >
      <span className="archive-nav__glass-pill" aria-hidden="true" />
      {archiveNavItems.map((item) => (
        <a
          className={activeId === item.id || (item.id === 'project-01' && activeId?.startsWith('project-')) ? 'is-active' : ''}
          key={item.id}
          aria-current={archiveNavItems[activeIndex].id === item.id ? 'page' : undefined}
          href={item.href ?? getArchiveUrl(item.id)}
          onClick={(event) => handleClick(event, item.id)}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
