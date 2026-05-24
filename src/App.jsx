import { useRef, useState } from "react";
import ArcadeIntro from "./components/ArcadeIntro.jsx";
import OrbitImages from "./components/OrbitImages.jsx";
import backgroundImage from "./assets/background.png";
import noGauntlet from "./assets/no_Gauntlet.png";
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

function DesignerFileSection({ sectionRef }) {
  return (
    <section ref={sectionRef} className="designer-file-section" aria-label="Designer file">
      <div className="designer-file-shell">
        <header className="designer-file-header">
          <div className="designer-file-mark" aria-hidden="true" />
          <h1>DESIGNER FILE</h1>
          <span>ABOUT ME</span>
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

export default function App() {
  const designerFileRef = useRef(null);
  const [isDesignerFileUnlocked, setIsDesignerFileUnlocked] = useState(false);

  const handleAboutContinue = () => {
    setIsDesignerFileUnlocked(true);
    window.requestAnimationFrame(() => {
      designerFileRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <main>
      <ArcadeIntro />
      <section
        className="portfolio-content gauntlet-section"
        aria-label="Stone-free gauntlet"
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
            onAboutContinue={handleAboutContinue}
            centerContent={
              <img
                className="gauntlet-image"
                src={noGauntlet}
                alt="Infinity gauntlet without stones"
                draggable="false"
              />
            }
          />
        </div>
      </section>
      {isDesignerFileUnlocked && <DesignerFileSection sectionRef={designerFileRef} />}
    </main>
  );
}
