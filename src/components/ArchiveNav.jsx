const archiveNavItems = [
  { id: 'about', label: 'About Me' },
  { id: 'project-01', label: 'Project 01' },
  { id: 'project-02', label: 'Project 02' },
  { id: 'project-03', label: 'Project 03' },
  { id: 'project-04', label: 'Project 04' },
  { id: 'contact', label: 'Contact Me' },
];

export default function ArchiveNav({ activeId, onSelect }) {
  const exitArchive = (event) => {
    event.preventDefault();
    window.location.href = '/?view=reel';
  };

  const handleClick = (event, id) => {
    event.preventDefault();
    onSelect?.(id);
    window.history.pushState(null, '', `/archive#${id}`);

    const target = document.getElementById(id);

    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="archive-nav" aria-label="Archive section navigation">
      <a className="archive-nav__exit" href="/" onClick={exitArchive}>
        Exit
      </a>
      {archiveNavItems.map((item) => (
        <a
          className={activeId === item.id ? 'is-active' : ''}
          key={item.id}
          href={`/archive#${item.id}`}
          onClick={(event) => handleClick(event, item.id)}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
