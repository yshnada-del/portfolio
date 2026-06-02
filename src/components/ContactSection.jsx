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
              <span>리서치와 디자인, 인터랙션으로</span>
              <span>이어진 여정이</span>
              <span>마지막 장면에 도착했습니다.</span>
            </p>
            <p>
              <span>하지만 모든 끝은</span>
              <span>새로운 프로젝트의</span>
              <span>시작이기도 합니다.</span>
            </p>
            <p>
              <span>사용자의 흐름을 읽고,</span>
              <span>문제를 경험으로 풀어내는</span>
              <span>디자이너를 찾고 있다면</span>
            </p>
            <p>
              <span>저는 다음 미션을</span>
              <span>함께할 준비가 되어 있습니다.</span>
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
