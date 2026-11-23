import { useEffect, useRef, useState } from 'react';
import project01Proposal from './project01Proposal.html?raw';
import project01Ending from '../assets/project-01-frame-15.png';
import { getOriginalProposalDocument, getProposalDocument, withResponsiveProposal } from './proposals/documents.js';
import { getProject01Sections, project01SectionImages as project01Frames } from './proposals/project01Sections.js';
import AboutTimeline from './AboutTimeline.jsx';
import { aboutScrollScenes } from './aboutScenes.js';
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
    embedOriginalProposal: true,
    floatingColor: '#c92332',
    scene: '05',
    edgeLabel: 'PROJECT 04',
    number: 'PROJECT 04',
    title: '피자헛',
    tagline: '피자헛 웹사이트 리뉴얼',
    description:
      '피자헛의 메뉴 탐색부터 배달·포장 주문까지 이어지는 흐름을 재설계한 웹 UX/UI 프로젝트입니다.',
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
    tone: 'ivory',
  },
];

const enabledProjects = projects.filter((project) => isProjectEnabled(project.id)).map((project) => ({
  ...project,
  actionLinks: project.actionLinks.filter((link) => !link.href.startsWith('#') || isProjectEnabled(link.href.slice(1))),
}));
const pageIds = ['about', ...enabledProjects.map((project) => project.id), 'contact'];

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
  const [originalProposal, setOriginalProposal] = useState();
  const [projectViewportMode, setProjectViewportMode] = useState(() => {
    if (typeof window === 'undefined') {
      return 'wide';
    }

    return window.matchMedia('(max-width: 760px)').matches ? 'compact' : 'wide';
  });
  const activeProject = enabledProjects.find((project) => project.id === activeId);
  const originalProposalUrl = activeProject?.embedOriginalProposal ? activeProject.proposalUrl : undefined;
  const nextProject = activeProject
    ? enabledProjects[(enabledProjects.indexOf(activeProject) + 1) % enabledProjects.length]
    : null;
  const previousProject = activeProject
    ? enabledProjects[(enabledProjects.indexOf(activeProject) - 1 + enabledProjects.length) % enabledProjects.length]
    : null;

  useEffect(() => {
    if (!originalProposalUrl) return;
    const controller = new AbortController();
    getOriginalProposalDocument(activeId, originalProposalUrl, controller.signal)
      .then(document => setOriginalProposal({ url: originalProposalUrl, document }))
      .catch(() => {
        if (!controller.signal.aborted) setOriginalProposal({ url: originalProposalUrl, source: originalProposalUrl });
      });
    return () => controller.abort();
  }, [activeId, originalProposalUrl]);

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

  const loadedOriginal = originalProposal?.url === originalProposalUrl ? originalProposal : undefined;
  const proposalDocument = activeId === 'project-01'
    ? withResponsiveProposal(project01Proposal.replace('__PROJECT_01_ENDING__', new URL(project01Ending, window.location.href).href), 'project-01', getProject01Sections())
    : activeProject && !originalProposalUrl ? getProposalDocument(activeProject) : loadedOriginal?.document;
  const action = activeProject ? {
    href: activeProject.actionLinks[1].href,
    color: activeProject.floatingColor,
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
        source={nativePage
          ? getArchiveUrl(activeId, { embedded: true })
          : loadedOriginal?.source}
        title={activeProject ? activeProject.title : activeId === 'about' ? 'ABOUT ME' : 'CONTACT ME'}
        action={action}
      />
    </main>
  );
}
