import FilmSection from './FilmSection.jsx';

export default function ContactSection() {
  return (
    <FilmSection id="contact" scene="06" label="CONTACT" tone="dark" className="film-section--contact-crawl">
      <div className="contact-crawl" aria-label="Contact information">
        <div className="contact-crawl__stars" aria-hidden="true" />
        <div className="contact-crawl__viewport">
          <div className="contact-crawl__text">
            <h2>CONTACT ME</h2>
            <p>
              <span>리서치부터 디자인,</span>
              <span>인터랙션 구현까지.</span>
            </p>
            <p>
              <span>사용자의 흐름을 읽고</span>
              <span>문제를 더 나은 경험으로 바꾸는</span>
              <span>디자이너가 되고 싶습니다.</span>
            </p>
            <p>
              <span>아직 완벽하진 않지만,</span>
              <span>끝까지 고민하고</span>
              <span>더 나은 방향을 찾아가는 사람입니다.</span>
            </p>
            <p>
              <span>새로운 프로젝트를 함께 만들어갈</span>
              <span>준비가 되어 있습니다.</span>
            </p>
            <address>
              <a href="mailto:yshnada@gmail.com">yshnada@gmail.com</a>
              <a href="tel:+821041142912">+82 10-4114-2912</a>
            </address>
            <strong>YOO SEUNG HYUN</strong>
          </div>
        </div>
      </div>
    </FilmSection>
  );
}
