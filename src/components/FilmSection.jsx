export default function FilmSection({ id, scene, label, tone = 'ivory', className = '', children }) {
  return (
    <section id={id} className={`film-section film-section--${tone} ${className}`.trim()} data-reveal>
      <div className="film-section__sprockets film-section__sprockets--left" aria-hidden="true" />
      <div className="film-section__sprockets film-section__sprockets--right" aria-hidden="true" />
      <div className="film-section__edge-label film-section__edge-label--left">{label}</div>
      <div className="film-section__edge-label film-section__edge-label--right">{scene}</div>
      <div className="film-section__content">
        <p className="film-section__scene">
          <span>{scene}</span> SCENE
        </p>
        {children}
      </div>
    </section>
  );
}
