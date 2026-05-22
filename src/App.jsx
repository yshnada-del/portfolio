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

export default function App() {
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
    </main>
  );
}
