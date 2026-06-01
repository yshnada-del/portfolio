import FilmSection from './FilmSection.jsx';

export default function ContactSection() {
  return (
    <FilmSection id="contact" scene="06" label="CONTACT" tone="ivory">
      <div className="contact-frame">
        <div className="contact-frame__copy">
          <h2>CONTACT ME</h2>
          <p>새로운 프로젝트를 함께하고 싶다면 언제든지 연락 주세요.</p>
          <ul>
            <li>
              <span>EMAIL</span>
              <a href="mailto:yshnada@gmail.com">yshnada@gmail.com</a>
            </li>
            <li>
              <span>PHONE</span>
              <a href="tel:+821041142912">+82 10-4114-2912</a>
            </li>
            <li>
              <span>GITHUB</span>
              <a href="#">GitHub</a>
            </li>
            <li>
              <span>PORTFOLIO</span>
              <a href="#">Notefolio / Behance</a>
            </li>
          </ul>
        </div>
        <div className="contact-frame__still" aria-hidden="true">
          <div className="director-card">
            <span>DIRECTOR</span>
            <strong>ARCHIVE</strong>
          </div>
          <p>Let&apos;s make the next scene together.</p>
          <div className="slate-card">
            <div />
            <span>SCENE</span>
            <span>TAKE</span>
            <span>ROLL</span>
            <strong>PORTFOLIO</strong>
            <strong>ARCHIVE</strong>
            <strong>2026</strong>
          </div>
        </div>
      </div>
    </FilmSection>
  );
}
