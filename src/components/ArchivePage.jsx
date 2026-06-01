import { useEffect, useRef, useState } from 'react';
import aboutMe from '../assets/about_me.png';
import cssIcon from '../assets/css.png';
import figmaIcon from '../assets/figma.png';
import htmlIcon from '../assets/html.png';
import illustratorIcon from '../assets/illust.png';
import javascriptIcon from '../assets/javascript.png';
import photoshopIcon from '../assets/photoshop.png';
import pizzahut from '../assets/pizzahut.png';
import reactIcon from '../assets/react.png';
import simmons from '../assets/simmons.png';
import ArchiveNav from './ArchiveNav.jsx';
import ContactSection from './ContactSection.jsx';
import FilmSection from './FilmSection.jsx';
import ProjectSection from './ProjectSection.jsx';

const projects = [
  {
    id: 'project-01',
    scene: '02',
    edgeLabel: 'PROJECT 01',
    number: 'PROJECT 01',
    title: '집사인생',
    tagline: '반려동물 예방 건강 관리 서비스',
    description:
      '사진 기반 AI 분석과 오늘의 요약, 커뮤니티 기능을 통해 반려동물의 건강 관리를 더 쉽고 꾸준하게 도와주는 서비스입니다.',
    role: 'Planning Lead / UX Research / UI Design / Front-end Build',
    period: '2025.04 - 2025.06',
    tools: 'Figma / React / JavaScript / Firebase',
    visualType: 'mobile-light',
    tone: 'ivory',
  },
  {
    id: 'project-02',
    scene: '03',
    edgeLabel: 'PROJECT 02',
    number: 'PROJECT 02',
    title: 'SIMMONS',
    tagline: '프리미엄 침대 브랜드 웹 리디자인',
    description:
      '브랜드의 고급스러운 분위기를 유지하면서 사용자가 제품과 브랜드 스토리를 자연스럽게 탐색할 수 있도록 개선한 웹 리디자인 프로젝트입니다.',
    role: 'UI/UX Design / Front-end Develop',
    period: '2025.04 - 2025.05',
    tools: 'Figma / React / GSAP / Lenis',
    visualType: 'desktop-burgundy',
    image: simmons,
    tone: 'burgundy',
  },
  {
    id: 'project-03',
    scene: '04',
    edgeLabel: 'PROJECT 03',
    number: 'PROJECT 03',
    title: '맛과멋',
    tagline: '취향 기반 장소 추천 서비스',
    description:
      '사용자의 착장 분위기와 상황을 바탕으로 어울리는 식당과 장소를 추천하는 서비스입니다. 장소 중심이 아니라 사용자의 스타일과 무드를 기준으로 추천 흐름을 설계했습니다.',
    role: 'UX Research / UI Design / Front-end Develop',
    period: '2026.03 - 2026.05',
    tools: 'Figma / React / Supabase / Kakao API',
    visualType: 'mobile-dark',
    tone: 'dark',
  },
  {
    id: 'project-04',
    scene: '05',
    edgeLabel: 'PROJECT 04',
    number: 'PROJECT 04',
    title: 'PIZZA HUT',
    tagline: '프로모션 랜딩페이지 리디자인',
    description:
      '강렬한 프로모션 메시지와 제품 이미지를 중심으로 사용자의 시선을 빠르게 끌고, 주문 행동으로 자연스럽게 이어지도록 설계한 랜딩페이지입니다.',
    role: 'UI Design / Front-end Develop',
    period: '2026.04 - 2026.05',
    tools: 'Figma / React / GSAP',
    visualType: 'desktop-pizza',
    image: pizzahut,
    tone: 'dark',
  },
];

const pageIds = ['about', ...projects.map((project) => project.id), 'contact'];

const aboutScrollScenes = [
  {
    id: 'information',
    title: 'INFORMATION',
    type: 'information',
  },
  {
    id: 'education',
    title: 'EDUCATION',
    type: 'timeline',
    items: [
      ['2011.03 - 2014.02', '상동고등학교', '이과 졸업'],
      ['2014.03 - 2019.02', '국제패션디자인전문학교', '패션디자인과 전문 학사 졸업'],
      ['2025.12 - 2026.06', '이젠아카데미 DX교육센터', 'UX/UI 디자인 & 웹기획 프론트엔드 부트캠프'],
    ],
  },
  {
    id: 'experience',
    title: 'EXPERIENCE',
    type: 'timeline',
    items: [
      ['2020.12 - 2021.07', '슬릭스톤', '패션디자인'],
      ['2021.09 - 2023.06', '앨 로고', '패션 사업 운영'],
      ['2023.07 - 2025.12', '제이앤에스커넥터', '제조 및 납품'],
    ],
  },
  {
    id: 'tools',
    title: 'TOOLS',
    type: 'tools',
    items: [
      ['Figma', 90, figmaIcon],
      ['Photoshop', 85, photoshopIcon],
      ['Illustrator', 80, illustratorIcon],
      ['React', 72, reactIcon],
      ['HTML', 90, htmlIcon],
      ['CSS', 88, cssIcon],
      ['JavaScript', 82, javascriptIcon],
    ],
  },
  {
    id: 'awards',
    title: 'AWARDS',
    type: 'awards',
    items: [
      ['2018.11', '패션디자인전문학교 우수작품상'],
      ['2018.11', '패션디자인전문학교 협력사상'],
      ['2026.04', '이젠아카데미 DX교육센터 프로젝트 우수상'],
    ],
  },
  {
    id: 'exhibition',
    title: 'EXHIBITION',
    type: 'awards',
    items: [
      ['2018.07', '강남페스티벌 패션쇼 신진 디자이너 콘테스트 참가'],
      ['2019.03', 'K패션오디션 참가'],
      ['2019.06', '케이브랜드 NIX 데님 콘테스트 참가'],
    ],
  },
];

function getPageIdFromHash() {
  const hashId = window.location.hash.replace('#', '');

  return pageIds.includes(hashId) ? hashId : 'about';
}

function AboutZoomIntro() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const section = scene?.closest('.film-section--about-flight, .film-section--about-zoom');

    if (!scene || !section) {
      return undefined;
    }

    let frameId = 0;
    const scaleStops = [1, 1.7, 2.7, 4.1, 6.2, 9.2];

    const update = () => {
      frameId = 0;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      const stepFloat = progress * 5;
      const step = Math.min(Math.floor(stepFloat), 4);
      const local = stepFloat - step;
      const easedLocal = 1 - Math.pow(1 - local, 3);
      const scale = scaleStops[step] + (scaleStops[step + 1] - scaleStops[step]) * easedLocal;
      const finalProgress = Math.min(Math.max((progress - 0.78) / 0.16, 0), 1);
      const introOpacity = 1 - Math.min(Math.max((progress - 0.72) / 0.18, 0), 1);
      const backgroundOpacity = 0.18 - finalProgress * 0.08;

      scene.style.setProperty('--about-progress', progress.toFixed(4));
      scene.style.setProperty('--about-scale', scale.toFixed(4));
      scene.style.setProperty('--about-final', finalProgress.toFixed(4));
      scene.style.setProperty('--about-intro-opacity', introOpacity.toFixed(4));
      scene.style.setProperty('--about-bg-opacity', backgroundOpacity.toFixed(4));
    };

    const requestUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div className="about-zoom-scene" ref={sceneRef}>
      <div className="about-zoom-word" aria-hidden="true">
        ABOUT ME
      </div>
      <div className="about-zoom-counter" aria-hidden="true">
        <span>01</span>
        <span>02</span>
        <span>03</span>
        <span>04</span>
        <span>05</span>
      </div>
      <section className="about-final" aria-label="About me information">
        <div className="about-final__title">
          <p>UX/UI DESIGNER</p>
          <h1>
            사용자의 흐름을 이해하고
            <span>경험을 설계하는 디자이너입니다.</span>
          </h1>
        </div>
        <div className="about-final__content">
          <p className="about-final__lead">
            Figma, Photoshop, Illustrator, HTML, CSS, JavaScript, React를 활용해 기획부터 UI 설계와 프론트엔드 구현까지 연결합니다.
          </p>
          <aside className="about-final__info">
            <p>INFORMATION</p>
            <dl>
              <div>
                <dt>NAME</dt>
                <dd>YOO SEUNG HYUN</dd>
              </div>
              <div>
                <dt>EMAIL</dt>
                <dd>
                  <a href="mailto:yshnada@gmail.com">yshnada@gmail.com</a>
                </dd>
              </div>
              <div>
                <dt>PHONE</dt>
                <dd>
                  <a href="tel:+821041142912">+82 10-4114-2912</a>
                </dd>
              </div>
              <div>
                <dt>LOCATION</dt>
                <dd>Seoul, Korea</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
    </div>
  );
}

function AboutScrollAbout() {
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const section = stage?.closest('.film-section--about-flight');

    if (!stage || !section) {
      return undefined;
    }

    let frameId = 0;
    const scenes = Array.from(stage.querySelectorAll('.about-scroll-scene'));
    const watermark = stage.querySelector('.about-scroll-watermark');

    const update = () => {
      frameId = 0;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      const introProgress = Math.min(Math.max(progress / 0.24, 0), 1);
      const easedIntro = 1 - Math.pow(1 - introProgress, 3);
      const sceneProgress = Math.min(Math.max((progress - 0.18) / 0.8, 0), 0.9999);
      const activeIndex = Math.min(scenes.length - 1, Math.floor(sceneProgress * scenes.length));
      const watermarkOpacity = Math.max(0.18, 1 - easedIntro * 0.82);
      const watermarkStretchY = 1;
      const startSize = Math.max(58, Math.min(window.innerWidth * 0.05, 92));
      const endSize = Math.min(window.innerWidth * 0.34, window.innerHeight * 0.64, 680);
      let watermarkSize = startSize + (endSize - startSize) * easedIntro;

      scenes.forEach((scene, index) => {
        const rawSceneProgress = sceneProgress * scenes.length - index;
        const localProgress = Math.min(Math.max(rawSceneProgress, 0), 0.9999);
        const isActive = progress >= 0.16 && index === activeIndex;
        const isTitlePhase = isActive && localProgress < 0.34;
        const isContentPhase = isActive && localProgress >= 0.34 && localProgress < 0.68;
        const contentProgress = isContentPhase ? (localProgress - 0.34) / 0.34 : 0;
        const labelOpacity = isTitlePhase || isContentPhase ? 1 : 0;
        const contentOpacity = isContentPhase ? 1 : 0;
        const revealY = isContentPhase ? (1 - contentProgress) * 180 : 180;

        scene.classList.toggle('is-active', isActive);
        scene.classList.toggle('is-past', progress >= 0.16 && index < activeIndex);
        scene.style.setProperty('--label-opacity', labelOpacity.toFixed(4));
        scene.style.setProperty('--content-opacity', contentOpacity.toFixed(4));
        scene.style.setProperty('--content-reveal-y', `${revealY.toFixed(2)}px`);
      });

      stage.style.setProperty('--about-watermark-opacity', watermarkOpacity.toFixed(4));
      stage.style.setProperty('--about-watermark-size', `${watermarkSize.toFixed(2)}px`);
      stage.style.setProperty('--about-watermark-stretch-y', watermarkStretchY.toFixed(4));

      if (watermark) {
        watermark.style.opacity = watermarkOpacity.toFixed(4);
        watermark.style.fontSize = `${watermarkSize.toFixed(2)}px`;
        watermark.style.transform = `translate(-50%, -50%) scaleY(${watermarkStretchY.toFixed(4)})`;

        const maxWatermarkWidth = window.innerWidth * 1.16;
        const measuredWidth = watermark.getBoundingClientRect().width;

        if (measuredWidth > maxWatermarkWidth) {
          watermarkSize *= maxWatermarkWidth / measuredWidth;
          watermark.style.fontSize = `${watermarkSize.toFixed(2)}px`;
          stage.style.setProperty('--about-watermark-size', `${watermarkSize.toFixed(2)}px`);
        }
      }
    };

    const requestUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    update();
    const scrollParent = section.closest('.archive-page');
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    scrollParent?.addEventListener('scroll', requestUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      scrollParent?.removeEventListener('scroll', requestUpdate);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div className="about-scroll-stage" ref={stageRef}>
      <div className="about-scroll-grain" aria-hidden="true" />
      <div className="about-scroll-watermark" aria-hidden="true">
        ABOUT ME
      </div>
      <div className="about-scroll-scenes">
        {aboutScrollScenes.map((scene, sceneIndex) => (
          <section className="about-scroll-scene" aria-label={scene.title} key={scene.id}>
            <div className="about-scroll-scene__label">
              <span>{String(sceneIndex + 1).padStart(2, '0')}</span>
              <h2>{scene.title}</h2>
            </div>
            <AboutScrollSceneContent scene={scene} />
          </section>
        ))}
      </div>
    </div>
  );
}

function AboutScrollSceneContent({ scene }) {
  if (scene.type === 'information') {
    return (
      <div className="about-scroll-scene__content about-info">
        <div className="about-info__identity about-reveal" style={{ '--stagger': 1 }}>
          <strong>YOO SEUNG HYUN</strong>
          <span>UX/UI Designer</span>
        </div>
        <p className="about-info__statement about-reveal" style={{ '--stagger': 2 }}>
          사용자의 흐름을 이해하고,
          <br />
          가치 있는 경험을 설계합니다.
        </p>
        <dl className="about-info__contact about-reveal" style={{ '--stagger': 3 }}>
          <div>
            <dt>Email</dt>
            <dd>
              <a href="mailto:yshnada@gmail.com">yshnada@gmail.com</a>
            </dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>
              <a href="tel:+821041142912">+82 10-4114-2912</a>
            </dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>Seoul, Korea</dd>
          </div>
        </dl>
      </div>
    );
  }

  if (scene.type === 'tools') {
    return (
      <div className="about-scroll-scene__content about-tool-grid">
        {scene.items.map(([name, percent, icon], index) => (
          <article
            className="about-tool-card about-reveal"
            style={{ '--stagger': index + 1, '--tool-percent': percent }}
            key={name}
          >
            <div className="about-tool-card__gauge" aria-hidden="true">
              <img src={icon} alt="" />
            </div>
            <h3>{name}</h3>
            <p>{percent}%</p>
          </article>
        ))}
      </div>
    );
  }

  if (scene.type === 'awards') {
    return (
      <ol className="about-scroll-scene__content about-awards">
        {scene.items.map(([date, description], index) => (
          <li className="about-reveal" style={{ '--stagger': index + 1 }} key={`${date}-${description}`}>
            <time>{date}</time>
            <span>{description}</span>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className="about-scroll-scene__content about-timeline">
      {scene.items.map(([date, title, description], index) => (
        <li className="about-reveal" style={{ '--stagger': index + 1 }} key={`${date}-${title}`}>
          <time>{date}</time>
          <div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function AboutInfoScene() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scene.classList.add('is-visible');
        }
      },
      { threshold: 0.28 },
    );

    observer.observe(scene);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-info-scene" ref={sceneRef} aria-label="About me information">
      <div className="about-info-scene__grain" aria-hidden="true" />
      <div className="about-info-scene__film about-info-scene__film--left" aria-hidden="true" />
      <div className="about-info-scene__film about-info-scene__film--right" aria-hidden="true" />
      <div className="about-info-scene__watermark" aria-hidden="true">
        ABOUT ME
      </div>

      <div className="about-info-scene__grid">
        <div className="about-info-scene__title">
          <span>01</span>
          <h1>INFORMATION</h1>
        </div>

        <div className="about-info-scene__panel">
          <div className="about-info-scene__identity">
            <h2>YOO SEUNG HYUN</h2>
            <p>UX/UI DESIGNER</p>
          </div>

          <p className="about-info-scene__statement">
            사용자의 흐름을 이해하고,
            <br />
            가치 있는 경험을 설계합니다.
          </p>

          <dl className="about-info-scene__contact">
            <div>
              <dt>EMAIL</dt>
              <dd>
                <a href="mailto:yshnada@gmail.com">yshnada@gmail.com</a>
              </dd>
            </div>
            <div>
              <dt>PHONE</dt>
              <dd>
                <a href="tel:+821041142912">+82 10-4114-2912</a>
              </dd>
            </div>
            <div>
              <dt>LOCATION</dt>
              <dd>Seoul, Korea</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function ArchiveAbout() {
  return (
    <FilmSection id="about" scene="01" label="ABOUT ME" tone="ivory" className="film-section--about-flight">
      <div className="about-flight-wrap">
        <div className="about-flight-wrap__sticky">
          <AboutScrollAbout />
          <div className="about-archive">
            <div className="about-archive__intro">
              <h1>ABOUT ME</h1>
              <p className="about-archive__lead">사용자의 흐름을 이해하고, 가치 있는 경험을 설계합니다.</p>
              <div>
                <h2>YOO SEUNG HYUN</h2>
                <p>UX/UI Designer</p>
              </div>
              <ul className="about-archive__contact">
                <li>
                  <span>MAIL</span>
                  <a href="mailto:yshnada@gmail.com">yshnada@gmail.com</a>
                </li>
                <li>
                  <span>TEL</span>
                  <a href="tel:+821041142912">+82 10-4114-2912</a>
                </li>
                <li>
                  <span>LOC</span>
                  <strong>Seoul, Korea</strong>
                </li>
              </ul>
            </div>
            <div className="about-archive__photo">
              <img src={aboutMe} alt="Yoo Seung Hyun profile" />
            </div>
            <div className="about-archive__cards">
              <article>
                <h3>Education</h3>
                <p>이젠아카데미DX교육센터 UX/UI 디자인 & 프론트엔드 과정</p>
                <p>국제패션디자인전문학교 패션디자인</p>
              </article>
              <article>
                <h3>Experience</h3>
                <p>Fashion design, brand operation, product communication</p>
              </article>
              <article>
                <h3>Tools</h3>
                <p>
                  <strong>Design</strong> Figma, Photoshop, Illustrator
                </p>
                <p>
                  <strong>Development</strong> HTML, CSS, JavaScript, React
                </p>
                <p>
                  <strong>Workflow</strong> GitHub, Vercel, VS Code, AI Tools
                </p>
              </article>
              <article>
                <h3>Awards &amp; Exhibition</h3>
                <p>Project award, fashion exhibition and contest archive</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </FilmSection>
  );
}

export default function ArchivePage() {
  const [activeId, setActiveId] = useState(getPageIdFromHash);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        window.location.href = '/?view=reel';
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const revealTargets = Array.from(document.querySelectorAll('[data-reveal], [data-work-reveal]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.18 },
    );

    revealTargets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [activeId]);

  useEffect(() => {
    const syncPageFromHash = () => {
      setActiveId(getPageIdFromHash());
    };

    syncPageFromHash();
    window.addEventListener('hashchange', syncPageFromHash);
    window.addEventListener('popstate', syncPageFromHash);

    return () => {
      window.removeEventListener('hashchange', syncPageFromHash);
      window.removeEventListener('popstate', syncPageFromHash);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeId]);

  const activeProject = projects.find((project) => project.id === activeId);
  const pageClass = `archive-page${activeId === 'about' ? ' archive-page--about' : ''}${
    activeProject ? ' archive-page--project-detail' : ''
  }`;

  return (
    <main className={pageClass}>
      <ArchiveNav activeId={activeId} onSelect={setActiveId} />
      <div className="archive-page__reel">
        {activeId === 'about' && <ArchiveAbout />}
        {activeProject && <ProjectSection key={activeProject.id} project={activeProject} />}
        {activeId === 'contact' && <ContactSection />}
      </div>
    </main>
  );
}
