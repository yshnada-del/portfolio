import { useEffect, useRef, useState } from 'react';
import aboutMe from '../assets/about_me.png';
import cssIcon from '../assets/css.png';
import figmaIcon from '../assets/figma.png';
import htmlIcon from '../assets/html.png';
import illustratorIcon from '../assets/illust.png';
import javascriptIcon from '../assets/javascript.png';
import photoshopIcon from '../assets/photoshop.png';
import pizzahut from '../assets/pizzahut.png';
import project01Frame01 from '../assets/project-01-frame-01.png';
import project01Frame02 from '../assets/project-01-frame-02.png';
import project01Frame03 from '../assets/project-01-frame-03.png';
import project01Frame04 from '../assets/project-01-frame-04.png';
import project01Frame05 from '../assets/project-01-frame-05.png';
import project01Frame06 from '../assets/project-01-frame-06.png';
import project01Frame07 from '../assets/project-01-frame-07.png';
import project01Frame08 from '../assets/project-01-frame-08.png';
import project01Frame09 from '../assets/project-01-frame-09.png';
import project01Frame10 from '../assets/project-01-frame-10.png';
import project01Frame11 from '../assets/project-01-frame-11.png';
import project01Frame12 from '../assets/project-01-frame-12.png';
import project01Frame13 from '../assets/project-01-frame-13.png';
import project01Frame14 from '../assets/project-01-frame-14.png';
import project02SimmonsDeliverablesMobile from '../assets/project-02-simmons-deliverables-mobile.png';
import project02SimmonsDeliverablesThumbnail from '../assets/project-02-simmons-deliverables-thumbnail.png';
import project02SimmonsDeliverablesWeb from '../assets/project-02-simmons-deliverables-web.png';
import project02SimmonsDesignProcess01 from '../assets/project-02-simmons-design-process-01.png';
import project02SimmonsDesignProcess02 from '../assets/project-02-simmons-design-process-02.png';
import project02SimmonsDesignProcess03 from '../assets/project-02-simmons-design-process-03.png';
import project02SimmonsDesignProcess04 from '../assets/project-02-simmons-design-process-04.png';
import project02SimmonsWireframeMobile from '../assets/project-02-simmons-wireframe-mobile.png';
import project02SimmonsWireframeWeb from '../assets/project-02-simmons-wireframe-web.png';
import project03Frame01 from '../assets/project-03-frame-01.png';
import project03Frame02 from '../assets/project-03-frame-02.png';
import project03Frame03 from '../assets/project-03-frame-03.png';
import project03Frame04 from '../assets/project-03-frame-04.png';
import project03Frame05 from '../assets/project-03-frame-05.png';
import project03Frame06 from '../assets/project-03-frame-06.png';
import project03Frame07 from '../assets/project-03-frame-07.png';
import project03Frame08 from '../assets/project-03-frame-08.png';
import project04SectionAfterDetail from '../assets/project-04-section-after-detail.png';
import project04SectionAfterLogin from '../assets/project-04-section-after-login.png';
import project04SectionAfterMain from '../assets/project-04-section-after-main.png';
import project04SectionAfterMenu from '../assets/project-04-section-after-menu.png';
import project04SectionAfterProductInfo from '../assets/project-04-section-after-product-info.png';
import project04SectionBeforeDetail from '../assets/project-04-section-before-detail.png';
import project04SectionBeforeLogin from '../assets/project-04-section-before-login.png';
import project04SectionBeforeMain from '../assets/project-04-section-before-main.png';
import project04SectionBeforeMenu from '../assets/project-04-section-before-menu.png';
import project04SectionBeforeProductInfo from '../assets/project-04-section-before-product-info.png';
import reactIcon from '../assets/react.png';
import simmons from '../assets/simmons.png';
import ArchiveNav from './ArchiveNav.jsx';
import ContactSection from './ContactSection.jsx';
import FilmSection from './FilmSection.jsx';
import ProjectSection from './ProjectSection.jsx';
import { getReelUrl } from '../routes.js';

const project01Frames = [
  project01Frame01,
  project01Frame02,
  project01Frame03,
  project01Frame04,
  project01Frame05,
  project01Frame06,
  project01Frame07,
  project01Frame08,
  project01Frame09,
  project01Frame10,
  project01Frame11,
  project01Frame12,
  project01Frame13,
  project01Frame14,
];

const project02Frames = [
  project02SimmonsWireframeWeb,
  project02SimmonsWireframeMobile,
  project02SimmonsDesignProcess01,
  project02SimmonsDesignProcess02,
  project02SimmonsDesignProcess03,
  project02SimmonsDesignProcess04,
  project02SimmonsDeliverablesWeb,
  project02SimmonsDeliverablesMobile,
  project02SimmonsDeliverablesThumbnail,
];

const project03Frames = [
  project03Frame01,
  project03Frame02,
  project03Frame03,
  project03Frame04,
  project03Frame05,
  project03Frame06,
  project03Frame07,
  project03Frame08,
];

const project04Frames = [
  project04SectionBeforeMain,
  project04SectionAfterMain,
  project04SectionBeforeMenu,
  project04SectionAfterMenu,
  project04SectionBeforeDetail,
  project04SectionAfterDetail,
  project04SectionBeforeProductInfo,
  project04SectionAfterProductInfo,
  project04SectionBeforeLogin,
  project04SectionAfterLogin,
];

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
    role: '\uae30\ud68d\ud300\uc7a5 / \ub514\uc790\uc778 \uc11c\ube0c',
    period: '2025.04~2025.05',
    tools: 'Figma / ChatGPT / Claud / Photoshop / Gemini',
    contribution: '77%',
    metaLabels: {
      role: '\uc5ed\ud560',
      period: '\uae30\uac04',
      tools: '\ud234',
      contribution: '\uae30\uc5ec\ub3c4',
    },
    actionLinks: [
      {
        label: '\uae30\ud68d\uc11c \ubc14\ub85c\uac00\uae30',
        href: 'https://yshnada-del.github.io/jibsalifepage/',
      },
      { label: '\ud504\ub85c\uc81d\ud2b8 \ubc14\ub85c\uac00\uae30', href: 'https://new-jibsalife.vercel.app' },
    ],
    visualType: 'figma-frame',
    image: project01Frame01,
    images: project01Frames,
    tone: 'ivory',
  },
  {
    id: 'project-02',
    scene: '03',
    edgeLabel: 'PROJECT 02',
    number: 'PROJECT 02',
    title: '시몬스',
    tagline: '반려동물 예방 건강 관리 서비스',
    description:
      '사진 기반 AI 분석과 오늘의 요약, 커뮤니티 기능을 통해 반려동물의 건강 관리를 더 쉽고 꾸준하게 도와주는 서비스입니다.',
    role: '\uac1c\ubc1c\ud300\uc7a5 / \ub514\uc790\uc778 \uc11c\ube0c',
    period: '2026.02 ~ 2026.03',
    tools: '\ud53c\uadf8\ub9c8 / \ucc57\uc9c0\ud53c\ud2f0 / \ud074\ub85c\ub4dc / \ud3ec\ud1a0\uc0f5 / \uc77c\ub7ec\uc2a4\ud2b8 / \uc81c\ubbf8\ub098\uc774 / \ubbf8\ub4dc\uc800\ub2c8 / \ucf54\ub371\uc2a4 / vs code / \uae43\ud5c8\ube0c / html / css / js',
    contribution: '88%',
    metaLabels: {
      role: '\uc5ed\ud560',
      period: '\uae30\uac04',
      tools: '\ud234',
      contribution: '\uae30\uc5ec\ub3c4',
    },
    actionLinks: [
      {
        label: '\uae30\ud68d\uc11c \ubc14\ub85c\uac00\uae30',
        href: 'https://yshnada-del.github.io/simmonspage/',
      },
      { label: '\ud504\ub85c\uc81d\ud2b8 \ubc14\ub85c\uac00\uae30', href: 'https://hyunjireal.github.io/resimmons/' },
    ],
    visualType: 'figma-frame',
    image: project02SimmonsWireframeWeb,
    images: project02Frames,
    tone: 'ivory',
  },
  {
    id: 'project-03',
    scene: '04',
    edgeLabel: 'PROJECT 03',
    number: 'PROJECT 03',
    title: '맛과멋',
    tagline: '스타일 기반 장소 큐레이션 서비스',
    description:
      '사용자의 착장과 무드, 상황을 기반으로 오늘의 스타일에 어울리는 식당과 장소를 추천하는 모바일 서비스입니다.',
    role: '\uae30\ud68d \uac1c\ubc1c \ub514\uc790\uc778',
    period: '2026.04 ~ 2026.05',
    tools: '\ud53c\uadf8\ub9c8 / \ucc57\uc9c0\ud53c\ud2f0 / \ud074\ub85c\ub4dc / \ud3ec\ud1a0\uc0f5 / \uc81c\ubbf8\ub098\uc774 / \uc77c\ub7ec\uc2a4\ud2b8 / \ubbf8\ub4dc\uc800\ub2c8 / \ucf54\ub371\uc2a4 / vs code / \uae43\ud5c8\ube0c / html / css / js',
    contribution: '100%',
    metaLabels: {
      role: '\uc5ed\ud560',
      period: '\uae30\uac04',
      tools: '\ud234',
      contribution: '\uae30\uc5ec\ub3c4',
    },
    actionLinks: [
      { label: '\uae30\ud68d\uc11c \ubc14\ub85c\uac00\uae30', href: 'https://yshnada-del.github.io/landingpage/' },
      { label: '\ud504\ub85c\uc81d\ud2b8 \ubc14\ub85c\uac00\uae30', href: 'https://yshnada-del.github.io/matmut/' },
    ],
    visualType: 'figma-frame',
    image: project03Frame01,
    images: project03Frames,
    tone: 'ivory',
  },
  {
    id: 'project-04',
    scene: '05',
    edgeLabel: 'PROJECT 04',
    number: 'PROJECT 04',
    title: '피자헛',
    tagline: '반려동물 예방 건강 관리 서비스',
    description:
      '사진 기반 AI 분석과 오늘의 요약, 커뮤니티 기능을 통해 반려동물의 건강 관리를 더 쉽고 꾸준하게 도와주는 서비스입니다.',
    role: '\uae30\ud68d \uac1c\ubc1c \ub514\uc790\uc778',
    period: '2026.02.09 ~ 2026.02.25',
    tools: '\ud53c\uadf8\ub9c8 / \ucc57\uc9c0\ud53c\ud2f0 / \ud3ec\ud1a0\uc0f5 / \uc81c\ubbf8\ub098\uc774 / \ubbf8\ub4dc\uc800\ub2c8 / \ucf54\ub371\uc2a4 / vs code / \uae43\ud5c8\ube0c / html / css / js',
    contribution: '100%',
    metaLabels: {
      role: '\uc5ed\ud560',
      period: '\uae30\uac04',
      tools: '\ud234',
      contribution: '\uae30\uc5ec\ub3c4',
    },
    actionLinks: [
      {
        label: '\uae30\ud68d\uc11c \ubc14\ub85c\uac00\uae30',
        href: 'https://yshnada-del.github.io/pizzahutpage/',
      },
      { label: '\ud504\ub85c\uc81d\ud2b8 \ubc14\ub85c\uac00\uae30', href: 'https://yshnada-del.github.io/pizzahut/' },
    ],
    visualType: 'figma-frame',
    image: project04SectionAfterMain,
    images: project04Frames,
    tone: 'ivory',
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
      ['2020.12 - 2021.07', '슬링스톤', '패션디자인'],
      ['2021.09 - 2023.06', '엘 로꼬', '패션 사업 운영'],
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
      const sceneProgress = Math.min(Math.max((progress - 0.16) / 0.86, 0), 0.9999);
      const activeIndex = Math.min(scenes.length - 1, Math.floor(sceneProgress * scenes.length));
      const scrollHintOpacity = Math.max(0, 1 - Math.min(progress / 0.16, 1));
      const watermarkOpacity = Math.max(0.18, 1 - easedIntro * 0.82);
      const watermarkStretchY = 1;
      const startSize = Math.max(58, Math.min(window.innerWidth * 0.05, 92));
      const endSize = Math.min(window.innerWidth * 0.34, window.innerHeight * 0.64, 680);
      let watermarkSize = startSize + (endSize - startSize) * easedIntro;
      const clamp01 = (value) => Math.min(Math.max(value, 0), 1);
      const easeOutCubic = (value) => 1 - Math.pow(1 - clamp01(value), 3);

      scenes.forEach((scene, index) => {
        const rawSceneProgress = sceneProgress * scenes.length - index;
        const localProgress = clamp01(rawSceneProgress);
        const isActive = progress >= 0.14 && index === activeIndex;
        const isVisible = progress >= 0.14 && rawSceneProgress > -0.04 && rawSceneProgress < 1.04;
        const labelIn = easeOutCubic(localProgress / 0.12);
        const labelOut = 1 - easeOutCubic((localProgress - 0.9) / 0.1);
        const contentIn = easeOutCubic((localProgress - 0.08) / 0.22);
        const contentOut = 1 - easeOutCubic((localProgress - 0.9) / 0.1);
        const labelOpacity = isVisible ? Math.min(labelIn, labelOut) : 0;
        const contentOpacity = isVisible ? Math.min(contentIn, contentOut) : 0;
        const revealY = (1 - contentIn) * 72;

        scene.classList.toggle('is-active', isActive);
        scene.classList.toggle('is-past', progress >= 0.14 && index < activeIndex);
        scene.style.setProperty('--label-opacity', labelOpacity.toFixed(4));
        scene.style.setProperty('--content-opacity', contentOpacity.toFixed(4));
        scene.style.setProperty('--content-reveal-y', `${revealY.toFixed(2)}px`);
      });

      stage.style.setProperty('--about-watermark-opacity', watermarkOpacity.toFixed(4));
      stage.style.setProperty('--about-watermark-size', `${watermarkSize.toFixed(2)}px`);
      stage.style.setProperty('--about-watermark-stretch-y', watermarkStretchY.toFixed(4));
      stage.style.setProperty('--about-scroll-hint-opacity', scrollHintOpacity.toFixed(4));

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
      <div className="about-scroll-hint" aria-hidden="true">
        <div className="about-scroll-hint__mouse" />
        <p>Scroll</p>
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
            <dd>Bucheon, Korea</dd>
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
            style={{
              '--stagger': index + 1,
              '--tool-percent': percent,
              '--tool-dash': `${percent} 100`,
              '--tool-delay': `${index * 90}ms`,
            }}
            key={name}
          >
            <div className="about-tool-card__gauge" aria-hidden="true">
              <svg className="about-tool-card__ring" viewBox="0 0 120 120">
                <circle className="about-tool-card__ring-track" cx="60" cy="60" r="52" pathLength="100" />
                <circle className="about-tool-card__ring-progress" cx="60" cy="60" r="52" pathLength="100" />
              </svg>
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
  const activeProject = projects.find((project) => project.id === activeId);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        window.location.href = getReelUrl();
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

  useEffect(() => {
    const className = 'archive-project-detail-lock';
    document.documentElement.classList.toggle(className, Boolean(activeProject));
    document.body.classList.toggle(className, Boolean(activeProject));

    return () => {
      document.documentElement.classList.remove(className);
      document.body.classList.remove(className);
    };
  }, [activeProject]);

  const pageClass = `archive-page${activeId === 'about' ? ' archive-page--about' : ''}${
    activeId === 'contact' ? ' archive-page--contact' : ''
  }${activeProject ? ' archive-page--project-detail' : ''}`;

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
