import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import FilmSection from './FilmSection.jsx';
const PopcornScene = lazy(() => import('./PopcornScene.jsx'));

const kernels = Array.from({ length: 26 }, (_, index) => {
  const angle = index * 137.5 * Math.PI / 180;
  const radius = 170 + (index % 5) * 48;
  return { '--burst-x': `${Math.cos(angle) * radius}px`, '--burst-y': `${Math.sin(angle) * radius - 100}px`, '--burst-rotation': `${index * 63}deg`, '--burst-delay': `${(index % 4) * 25}ms`, '--kernel-size': `${18 + (index % 4) * 7}px` };
});

export default function ContactSection() {
  const [phase, setPhase] = useState('idle');
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (phase !== 'popping') return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => { dialogRef.current.showModal(); setPhase('open'); }, reducedMotion ? 0 : 720);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const closeForm = () => dialogRef.current.close();
  const reset = () => { setPhase('idle'); triggerRef.current?.focus(); };
  const sendInquiry = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `[포트폴리오 문의 · ${data.get('type')}] ${data.get('name')}`;
    const body = [`이름: ${data.get('name')}`, `소속: ${data.get('organization') || '-'}`, `답변 받을 이메일: ${data.get('email')}`, `문의 유형: ${data.get('type')}`, '', data.get('message')].join('\n');
    window.location.href = `mailto:yshnada@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <FilmSection id="contact" scene="06" label="CONTACT" tone="dark" className="film-section--popcorn">
      <div className={`popcorn-contact popcorn-contact--${phase}`}>
        <h2 className="popcorn-contact__heading">CONTACT ME</h2>
        <div className="popcorn-contact__stage">
          <Suspense fallback={null}>
            <PopcornScene phase={phase} />
          </Suspense>
</div>
        <button ref={triggerRef} className="popcorn-contact__invitation" type="button" onClick={() => setPhase('popping')} disabled={phase !== 'idle'} aria-haspopup="dialog">CLICK TO BUTTON<small>버튼을 클릭해주세요.</small></button>
      </div>
      <dialog ref={dialogRef} className="contact-slate" aria-labelledby="contact-slate-title" aria-describedby="contact-slate-description" onClose={reset} onKeyDown={(event) => { if (event.key === 'Escape') event.stopPropagation(); }} onClick={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
        <div className="contact-slate__board">
          <div className="contact-slate__clapper" aria-hidden="true"><i /><i /></div>
          <button className="contact-slate__close" type="button" onClick={closeForm} aria-label="문의 양식 닫기" autoFocus>×</button>
          <div className="contact-slate__body">
            <header className="contact-slate__heading"><span className="contact-slate__eyebrow">LET’S MAKE THE NEXT SCENE</span><h2 id="contact-slate-title">GET IN TOUCH</h2><p id="contact-slate-description">함께할 프로젝트나 제안을 남겨주세요.</p></header>
            <form className="contact-slate__form" onSubmit={sendInquiry}>
              <div className="contact-slate__pair">
                <label><span>NAME <small>이름 *</small></span><input name="name" autoComplete="name" placeholder="이름을 입력해주세요" required maxLength={80} /></label>
                <label><span>COMPANY <small>소속 (선택)</small></span><input name="organization" autoComplete="organization" placeholder="회사 또는 단체명" maxLength={120} /></label>
              </div>
              <label><span>EMAIL <small>이메일 *</small></span><input name="email" type="email" autoComplete="email" placeholder="답변 받을 이메일 주소" required maxLength={200} /></label>
              <label><span>SCENE <small>문의 유형 *</small></span><select name="type" defaultValue="" required><option value="" disabled>문의 유형을 선택해주세요</option><option>채용</option><option>디자인 협업</option><option>공연·콘텐츠</option><option>기타</option></select></label>
              <label><span>STORY <small>메시지 *</small></span><textarea name="message" placeholder="제안 내용과 일정을 알려주세요" rows={4} required maxLength={5000} /></label>
              <div className="contact-slate__footer"><span>DIRECTOR<br /><strong>YOO SEUNG HYUN</strong></span><span>CONTACT<br /><a href="mailto:yshnada@gmail.com">yshnada@gmail.com</a></span><button type="submit">문의 보내기 ↗</button></div>
            </form>
          </div>
        </div>
      </dialog>
    </FilmSection>
  );
}
