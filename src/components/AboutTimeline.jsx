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
  return (
    <section className="profile-timeline" id="about" aria-label="About me">
      <div className="project-proposal__film project-proposal__film--left profile-timeline__film" aria-hidden="true" />
      <div className="project-proposal__film project-proposal__film--right profile-timeline__film" aria-hidden="true" />
      <header className="profile-timeline__intro">
        <h1>ABOUT ME</h1>
      </header>
      <ol className="profile-timeline__sections">
        {scenes.map((scene, index) => (
          <li className="profile-timeline__section" key={scene.id}>
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
