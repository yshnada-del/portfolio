import { useEffect, useRef, useState } from 'react';

const archiveNavItems = [
  { id: 'home', label: 'HOME', href: '/?view=reel' },
  { id: 'about', label: 'ABOUT' },
  { id: 'project-01', label: 'PROJECT' },
  { id: 'contact', label: 'CONTACT' },
];

export default function ArchiveNav({ activeId, onSelect }) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const lastMotionAtRef = useRef(0);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

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
      if (event.clientY <= 90 && window.performance.now() - lastMotionAtRef.current > 120) {
        setIsHidden(false);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true, capture: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleClick = (event, id) => {
    event.preventDefault();
    setIsHidden(false);

    if (id === 'home') {
      window.location.href = '/?view=reel';
      return;
    }

    onSelect?.(id);
    window.history.pushState(null, '', `/archive#${id}`);

    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className={`archive-nav${isHidden ? ' archive-nav--hidden' : ''}`}
      aria-label="Archive section navigation"
    >
      {archiveNavItems.map((item) => (
        <a
          className={activeId === item.id || (item.id === 'project-01' && activeId?.startsWith('project-')) ? 'is-active' : ''}
          key={item.id}
          href={item.href ?? `/archive#${item.id}`}
          onClick={(event) => handleClick(event, item.id)}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
