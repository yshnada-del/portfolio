import { useEffect, useRef, useState } from 'react';
import project01Proposal from './project01Proposal.html?raw';
import project01Ending from '../assets/project-01-frame-15.png';
import { getProposalDocument, withResponsiveProposal } from './proposals/documents.js';
import { getProject01Sections, project01SectionImages as project01Frames } from './proposals/project01Sections.js';
import AboutTimeline from './AboutTimeline.jsx';
import cssIcon from '../assets/css.png';
import figmaIcon from '../assets/figma.png';
import htmlIcon from '../assets/html.png';
import illustratorIcon from '../assets/illust.png';
import javascriptIcon from '../assets/javascript.png';
import photoshopIcon from '../assets/photoshop.png';
import pizzahut from '../assets/pizzahut.png';
import exitIcon from '../assets/exit.png';
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
import ProjectSection from './ProjectSection.jsx';
import FilmReelProject from './FilmReelProject.jsx';
import { getArchiveUrl, getReelUrl } from '../routes.js';
import { isProjectEnabled } from '../projectVisibility.js';

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
    proposalUrl: 'https://yshnada-del.github.io/jibsalifepage/',
    floatingColor: '#7055ed',
    scene: '02',
    edgeLabel: 'PROJECT 01',
    number: 'PROJECT 01',
    title: '집사인생',
    tagline: '반려동물 예방 건강 관리 서비스',
    description:
      '사진 기반 AI 분석과 오늘의 요약, 커뮤니티 기능을 통해 반려동물의 건강 관리를 더 쉽고 꾸준하게 도와주는 서비스입니다.',
    role: '\uae30\ud68d\ud300\uc7a5 / \ub514\uc790\uc778 \uc11c\ube0c',
    period: '2026.04~2026.05',
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
      { label: '\ud504\ub85c\uc81d\ud2b8 \ubc14\ub85c\uac00\uae30', href: `${import.meta.env.BASE_URL}jibsalife/index.html` },
      {
        label: '\ub2e4\uc74c \ud504\ub85c\uc81d\ud2b8 \ubc14\ub85c\uac00\uae30',
        href: '#project-02',
        type: 'next',
      },
    ],
    visualType: 'figma-frame',
    image: project01Frames[0],
    images: project01Frames,
    tone: 'ivory',
  },
  {
    id: 'project-02',
    proposalUrl: 'https://yshnada-del.github.io/simmonspage/',
    floatingColor: '#92535b',
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
      {
        label: '\ub2e4\uc74c \ud504\ub85c\uc81d\ud2b8 \ubc14\ub85c\uac00\uae30',
        href: '#project-03',
        type: 'next',
      },
    ],
    visualType: 'figma-frame',
    image: project02SimmonsWireframeWeb,
    images: project02Frames,
    tone: 'ivory',
  },
  {
    id: 'project-03',
    proposalUrl: 'https://yshnada-del.github.io/landingpage/',
    floatingColor: '#3f6b5e',
    scene: '04',
    edgeLabel: 'PROJECT 03',
    number: 'PROJECT 03',
    title: '맛과멋',
    tagline: '스타일 기반 장소 큐레이션 서비스',
    description:
      '사용자의 착장과 무드, 상황을 기반으로 오늘의 스타일에 어울리는 식당과 장소를 추천하는 모바일 서비스입니다.',
    role: '\uae30\ud68d \uac1c\ubc1c \ub514\uc790\uc778',
    period: '2026.04 ~ 2026.05',
    tools: '\ud53c\uadf8\ub9c8 / \ucc57\uc9c0\ud53c\ud2f0 / \ud074\ub85c\ub4dc / \ud3ec\ud1a0\uc0f5 / \uc81c\ubbf8\ub098\uc774 / \uc77c\ub7ec\uc2a4\ud2b8 / \ubbf8\ub4dc\uc800\ub2c8 / \ucf54\ub371\uc2a4 / vs code / \uae43\ud5c8\ube0c / react / html / css / js',
    contribution: '100%',
    metaLabels: {
      role: '\uc5ed\ud560',
      period: '\uae30\uac04',
      tools: '\ud234',
      contribution: '\uae30\uc5ec\ub3c4',
    },
    actionLinks: [
      { label: '\uae30\ud68d\uc11c \ubc14\ub85c\uac00\uae30', href: 'https://yshnada-del.github.io/landingpage/' },
      { label: '\ud504\ub85c\uc81d\ud2b8 \ubc14\ub85c\uac00\uae30', href: `${import.meta.env.BASE_URL}matmut/index.html` },
      {
        label: '\ub2e4\uc74c \ud504\ub85c\uc81d\ud2b8 \ubc14\ub85c\uac00\uae30',
        href: '#project-04',
        type: 'next',
      },
    ],
    visualType: 'figma-frame',
    image: project03Frame01,
    images: project03Frames,
    tone: 'ivory',
  },
  {
    id: 'project-04',
    proposalUrl: 'https://yshnada-del.github.io/pizzahutpage/',
    floatingColor: '#c8102e',
    scene: '05',
    edgeLabel: 'PROJECT 04',
    number: 'PROJECT 04',
    title: '피자헛',
    tagline: '반려동물 예방 건강 관리 서비스',
    description:
      '사진 기반 AI 분석과 오늘의 요약, 커뮤니티 기능을 통해 반려동물의 건강 관리를 더 쉽고 꾸준하게 도와주는 서비스입니다.',
    role: '\uae30\ud68d \uac1c\ubc1c \ub514\uc790\uc778',
    period: '2026.02.09 ~ 2026.02.25',
    tools: 'Figma / ChatGPT / Photoshop / Midjourney / Codex / VS Code / GitHub / HTML / CSS / JavaScript',
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

const enabledProjects = projects.filter((project) => isProjectEnabled(project.id)).map((project) => ({
  ...project,
  actionLinks: project.actionLinks.filter((link) => !link.href.startsWith('#') || isProjectEnabled(link.href.slice(1))),
}));
const pageIds = ['about', ...enabledProjects.map((project) => project.id), 'contact'];

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
      ['Figma', 80, figmaIcon],
      ['Photoshop', 70, photoshopIcon],
      ['Illustrator', 65, illustratorIcon],
      ['React', 50, reactIcon],
      ['HTML', 78, htmlIcon],
      ['CSS', 75, cssIcon],
      ['JavaScript', 55, javascriptIcon],
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
      ['2026.06', '이젠아카데미 DX교육센터 개근상'],
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

  if (!isProjectEnabled(hashId)) {
    window.location.replace(`${getReelUrl()}&room=projects`);
    return 'about';
  }

  return pageIds.includes(hashId) ? hashId : 'about';
}

export default function ArchivePage() {
  const proposalFrameRef = useRef(null);
  const [activeId, setActiveId] = useState(getPageIdFromHash);
  const [projectViewportMode, setProjectViewportMode] = useState(() => {
    if (typeof window === 'undefined') {
      return 'wide';
    }

    return window.matchMedia('(max-width: 760px)').matches ? 'compact' : 'wide';
  });
  const activeProject = enabledProjects.find((project) => project.id === activeId);
  const nextProject = activeProject
    ? enabledProjects[(enabledProjects.indexOf(activeProject) + 1) % enabledProjects.length]
    : null;
  const previousProject = activeProject
    ? enabledProjects[(enabledProjects.indexOf(activeProject) - 1 + enabledProjects.length) % enabledProjects.length]
    : null;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        window.top.location.href = getReelUrl();
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
    const compactQuery = window.matchMedia('(max-width: 760px)');

    const syncProjectLock = () => {
      const shouldLock = Boolean(activeProject) && !compactQuery.matches;
      document.documentElement.classList.toggle(className, shouldLock);
      document.body.classList.toggle(className, shouldLock);
      setProjectViewportMode(compactQuery.matches ? 'compact' : 'wide');
    };

    syncProjectLock();
    compactQuery.addEventListener('change', syncProjectLock);

    return () => {
      compactQuery.removeEventListener('change', syncProjectLock);
      document.documentElement.classList.remove(className);
      document.body.classList.remove(className);
    };
  }, [activeProject]);

  const pageClass = `archive-page${activeId === 'about' ? ' archive-page--about archive-page--timeline' : ''}${
    activeId === 'contact' ? ' archive-page--contact' : ''
  }${activeProject ? ' archive-page--project-detail' : ''}${activeProject?.proposalUrl ? ' archive-page--proposal' : ''}`;

  const embedded = new URLSearchParams(window.location.search).get('embedded') === '1';
  const nativePage = activeId === 'about' || activeId === 'contact';

  if (embedded && nativePage) {
    return (
      <main className={`${pageClass} archive-page--embedded`}>
        <div className="archive-page__reel">
          {activeId === 'about' ? <AboutTimeline scenes={aboutScrollScenes} /> : <ContactSection />}
        </div>
      </main>
    );
  }

  const proposalDocument = activeProject
    ? activeId === 'project-01'
      ? withResponsiveProposal(project01Proposal.replace('__PROJECT_01_ENDING__', new URL(project01Ending, window.location.href).href), 'project-01', getProject01Sections())
      : getProposalDocument(activeProject)
    : undefined;
  const action = activeProject ? {
    href: activeProject.actionLinks[1].href,
    label: activeId === 'project-01' || activeId === 'project-03'
      ? '\uc571 \ubc14\ub85c\uac00\uae30'
      : '\uc0ac\uc774\ud2b8 \ubc14\ub85c\uac00\uae30',
  } : null;

  return (
    <main className={pageClass}>
      <FilmReelProject
        key={activeId}
        activeId={activeId}
        frameRef={proposalFrameRef}
        document={proposalDocument}
        source={nativePage ? getArchiveUrl(activeId).replace('?view=archive', '?view=archive&embedded=1') : undefined}
        title={activeProject ? activeProject.title : activeId === 'about' ? 'ABOUT ME' : 'CONTACT ME'}
        action={action}
      />
    </main>
  );
}
