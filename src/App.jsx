import { useEffect, useRef, useState } from "react";
import ArcadeIntro from "./components/ArcadeIntro.jsx";
import OrbitImages from "./components/OrbitImages.jsx";
import TextType from "./components/TextType.jsx";
import backgroundImage from "./assets/background.png";
import noGauntlet from "./assets/no_Gauntlet.png";
import oneGauntlet from "./assets/one_Gauntlet.png";
import twoGauntlet from "./assets/two_Gauntlet.png";
import threeGauntlet from "./assets/three_Gauntlet.png";
import fourGauntlet from "./assets/four_Gauntlet.png";
import fiveGauntlet from "./assets/five_Gauntlet.png";
import guideImage from "./assets/guide.png";
import projectGuideImage from "./assets/project_guide01.png";
import stone1 from "./assets/stone1.png";
import stone2 from "./assets/stone2.png";
import stone3 from "./assets/stone3.png";
import stone4 from "./assets/stone4.png";
import stone5 from "./assets/stone5.png";
import stone6 from "./assets/stone6.png";

const stones = [
  stone1,
  stone2,
  stone3,
  stone4,
  stone5,
  stone6,
];

const gauntletImages = [
  noGauntlet,
  oneGauntlet,
  twoGauntlet,
  threeGauntlet,
  fourGauntlet,
  fiveGauntlet,
];

const ABOUT_STONE_INDEX = 4;
const stoneUnlockOrder = [4, 1, 2, 3, 0, 5];
const JIBSA_PROJECT_URL = "https://new-jibsalife.vercel.app";

function GuideDialog({ onClose }) {
  return (
    <section
      className="guide-dialog"
      aria-label="Locked stone guide"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="guide-dialog-panel"
        style={{ "--guide-bg": `url(${guideImage})` }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="guide-dialog-close"
          type="button"
          aria-label="Close guide"
          onClick={onClose}
        />
        <div className="guide-dialog-copy">
          <span>LOCKED FILE</span>
          <TextType
            as="strong"
            text="?쒖꽦?붾맂 ?ㅽ넠??癒쇱? ?뺤씤?댁＜?몄슂"
            typingSpeed={58}
            initialDelay={180}
            cursorCharacter="_"
            cursorClassName="guide-dialog-cursor"
          />
        </div>
      </div>
    </section>
  );
}

function DesignerFileSection({ onClose }) {
  return (
    <section
      className="designer-file-section"
      aria-label="Designer file"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="designer-file-shell" onClick={(event) => event.stopPropagation()}>
        <header className="designer-file-header">
          <div className="designer-file-mark" aria-hidden="true" />
          <h1>DESIGNER FILE</h1>
          <span>ABOUT ME</span>
          <button
            className="designer-file-close"
            type="button"
            aria-label="Close designer file"
            onClick={onClose}
          />
        </header>

        <div className="designer-file-grid">
          <aside className="designer-stats designer-panel">
            <h2>STATS</h2>
            {[
              ["OBSERVATION", "STRONG", "86%"],
              ["STRUCTURE", "HIGH", "86%"],
              ["COMMUNICATION", "GROWING", "64%"],
              ["PERSISTENCE", "STRONG", "86%"],
            ].map(([label, value, width]) => (
              <div className="designer-stat" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <div className="designer-stat-bar">
                  <i style={{ width }} />
                </div>
              </div>
            ))}
          </aside>

          <section className="designer-profile designer-panel">
            {[
              ["NAME:", "YOO SEUNGHYUN"],
              ["ROLE:", "UI/UX DESIGNER"],
              ["FOCUS:", "USER EXPERIENCE"],
              ["STARTED FROM:", "VISUAL INTEREST"],
              ["CURRENT GOAL:", "CLEAR & USEFUL EXPERIENCE"],
            ].map(([label, value]) => (
              <div className="designer-profile-row" key={label}>
                <div className="designer-profile-icon" aria-hidden="true" />
                <div>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              </div>
            ))}
          </section>

          <section className="designer-notes designer-panel">
            <h2>NOTES / WORK STYLE</h2>
            <ul>
              <li>Observes user problems closely</li>
              <li>Structures complex flows clearly</li>
              <li>Values clarity as much as visual polish</li>
              <li>Keeps learning through projects</li>
            </ul>
          </section>

          <aside className="designer-mini-card designer-panel">
            <div className="designer-mini-photo" aria-hidden="true" />
            <dl>
              <div>
                <dt>LOCATION</dt>
                <dd>SEOUL, KR</dd>
              </div>
              <div>
                <dt>STATUS</dt>
                <dd>DESIGNING</dd>
              </div>
              <div>
                <dt>MODE</dt>
                <dd>FOCUSED</dd>
              </div>
            </dl>
          </aside>

          <aside className="designer-photo-panel designer-panel">
            <div className="designer-photo-placeholder">
              <span>IMAGE PLACEHOLDER</span>
            </div>
          </aside>
        </div>

        <footer className="designer-file-footer">
          <span>CREATIVE THINKER</span>
          <strong>FROM VISUAL INTEREST TO USER-CENTERED DESIGN</strong>
          <span>DESIGNING WITH EMPATHY</span>
        </footer>
      </div>
    </section>
  );
}

function ProjectFileSection({ onClose }) {
  return (
    <section
      className="project-file-section"
      aria-label="Jibsa Life project file"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="project-file-shell"
        style={{ "--project-guide-bg": `url(${projectGuideImage})` }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="project-file-close"
          type="button"
          aria-label="Close project file"
          onClick={onClose}
        />

        <div className="project-file-grid">
          <div className="project-file-heading">
            <h1>PROJECT FILE</h1>
            <span>JIBSA LIFE</span>
          </div>

          <section className="project-hero-panel">
            <h2>JIBSA LIFE</h2>
            <p>AI 기반 반려동물 건강 기록과 커뮤니티 기능을 결합한</p>
            <p>반려동물 헬스케어 모바일 앱 프로젝트</p>
            <a
              className="project-view-link"
              href={JIBSA_PROJECT_URL}
              target="_blank"
              rel="noreferrer"
            >
              VIEW PROJECT
            </a>
          </section>

          <aside className="project-type-panel" aria-label="Project type">
            <strong>UX/UI</strong>
            <span>MOBILE APP</span>
          </aside>

          <section className="project-features-panel">
            <h3>KEY FEATURES</h3>
            {[
              ["AI HEALTH CHECK", "CORE"],
              ["AUTO CARE LOG", "CORE"],
              ["VET CONSULTING", "PLUS"],
              ["COMMUNITY VOTE", "ENGAGE"],
            ].map(([feature, tag]) => (
              <div className="project-feature-row" key={feature}>
                <span aria-hidden="true" />
                <strong>{feature}</strong>
                <em>{tag}</em>
              </div>
            ))}
          </section>

          <aside className="project-scope-panel">
            {[
              ["RESEARCH", "78%"],
              ["UX DESIGN", "82%"],
              ["UI DESIGN", "84%"],
              ["PROTOTYPE", "70%"],
              ["DEVELOPMENT", "72%"],
            ].map(([label, width]) => (
              <div className="project-scope-row" key={label}>
                <span>{label}</span>
                <i><b style={{ width }} /></i>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const gauntletSectionRef = useRef(null);
  const [isGauntletScrollLocked, setIsGauntletScrollLocked] = useState(false);
  const [isDesignerFileUnlocked, setIsDesignerFileUnlocked] = useState(false);
  const [isProjectFileOpen, setIsProjectFileOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [gauntletStep, setGauntletStep] = useState(0);
  const activeStoneIndex = stoneUnlockOrder[gauntletStep] ?? null;
  const completedStoneIndexes = stoneUnlockOrder.slice(0, gauntletStep);
  const gauntletImage = gauntletImages[Math.min(gauntletStep, gauntletImages.length - 1)];

  const handleAboutContinue = () => {
    setIsDesignerFileUnlocked(true);
  };

  const handleProjectContinue = () => {
    setIsProjectFileOpen(true);
  };

  const closeDesignerFile = () => {
    setIsDesignerFileUnlocked(false);
    setGauntletStep((current) => Math.max(current, 1));
  };

  const closeProjectFile = () => {
    setIsProjectFileOpen(false);
    setGauntletStep((current) => Math.max(current, 2));
  };

  useEffect(() => {
    if (!isDesignerFileUnlocked && !isProjectFileOpen && !isGuideOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (isGuideOpen) {
          setIsGuideOpen(false);
        } else if (isProjectFileOpen) {
          closeProjectFile();
        } else {
          closeDesignerFile();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDesignerFileUnlocked, isProjectFileOpen, isGuideOpen]);

  useEffect(() => {
    if (!isGauntletScrollLocked) {
      return undefined;
    }

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    const getGauntletTop = () => {
      const gauntletSection = gauntletSectionRef.current;

      if (!gauntletSection) {
        return 0;
      }

      return gauntletSection.getBoundingClientRect().top + window.scrollY;
    };

    const lockScrollOnGauntlet = () => {
      const gauntletTop = getGauntletTop();

      window.scrollTo({
        top: gauntletTop,
        behavior: "auto",
      });
    };

    const handleKeyDown = (event) => {
      const scrollKeys = new Set([
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ]);

      if (scrollKeys.has(event.key)) {
        event.preventDefault();
      }
    };

    lockScrollOnGauntlet();
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", lockScrollOnGauntlet);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("resize", lockScrollOnGauntlet);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGauntletScrollLocked]);

  return (
    <main>
      <ArcadeIntro onIntroComplete={() => setIsGauntletScrollLocked(true)} />
      <section
        ref={gauntletSectionRef}
        className={`portfolio-content gauntlet-section${
          isGauntletScrollLocked ? " gauntlet-section--locked" : ""
        }`}
        aria-label="Infinity gauntlet"
        style={{ "--gauntlet-bg": `url(${backgroundImage})` }}
      >
        <div className="gauntlet-stage">
          <OrbitImages
            images={stones}
            shape="ellipse"
            radiusX={265}
            radiusY={86}
            rotation={-9}
            duration={44}
            itemSize={48}
            responsive
            baseWidth={900}
            width="100%"
            fill
            className="gauntlet-orbit"
            pathColor="rgba(162, 118, 255, 0.18)"
            pathWidth={1.5}
            showPath={false}
            activeStoneIndex={activeStoneIndex}
            completedStoneIndexes={completedStoneIndexes}
            onAboutContinue={handleAboutContinue}
            onProjectContinue={handleProjectContinue}
            onLockedSelect={() => setIsGuideOpen(true)}
            centerContent={
              <div className="gauntlet-core">
                <img
                  key={gauntletImage}
                  className="gauntlet-image"
                  src={gauntletImage}
                  alt="Infinity gauntlet"
                  draggable="false"
                />
              </div>
            }
          />
        </div>
      </section>
      {isDesignerFileUnlocked && (
        <DesignerFileSection onClose={closeDesignerFile} />
      )}
      {isProjectFileOpen && (
        <ProjectFileSection onClose={closeProjectFile} />
      )}
      {isGuideOpen && <GuideDialog onClose={() => setIsGuideOpen(false)} />}
    </main>
  );
}

