import FilmSection from './FilmSection.jsx';

export default function ContactSection() {
  return (
    <FilmSection id="contact" scene="06" label="CONTACT" tone="dark" className="film-section--contact-crawl">
      <div className="contact-crawl" aria-label="Contact information">
        <div className="contact-crawl__stars" aria-hidden="true" />
        <div className="contact-crawl__viewport">
          <div className="contact-crawl__text">
      <div className="contact-card" aria-labelledby="contact-title">
        <h2 id="contact-title">Contact me</h2>
        <div className="contact-card__grid">
          <div className="contact-card__intro">
            <p>YOO SEUNG HYUN</p>
            <p className="contact-card__muted">UI/UX Designer</p>
            <p className="contact-card__greeting">Let's connect.</p>
            <p className="contact-card__muted">더 나은 사용자 경험을 함께 만들어갈 기회를 기다립니다.</p>
          </div>
          <div className="contact-card__details">
            <dl>
              <div><dt>Email</dt><dd><a href="mailto:yshnada@gmail.com">yshnada@gmail.com</a></dd></div>
              <div><dt>Phone</dt><dd><a href="tel:+821041142912">+82 10-4114-2912</a></dd></div>
              <div><dt>Availability</dt><dd>새로운 기회와 채용 관련 연락을 기다립니다.</dd></div>
            </dl>
            <a className="contact-card__email" href="mailto:yshnada@gmail.com">Send Email <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
          </div>
        </div>
      </div>
    </FilmSection>
  );
}
