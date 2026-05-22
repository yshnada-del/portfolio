import { useEffect, useRef, useState } from "react";
import arcadeHero from "../assets/arcade_hero.png";
import arcadeScreen from "../assets/arcade_screen.png";
import startScreen from "../assets/start_screen.png";
import startScreenNo from "../assets/start_screen2.png";

const images = {
  hero: arcadeHero,
  screen: arcadeScreen,
  start: startScreen,
  startNo: startScreenNo,
};

export default function ArcadeIntro() {
  const [selectedStartOption, setSelectedStartOption] = useState("yes");
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const screenRef = useRef(null);
  const startRef = useRef(null);
  const yesRef = useRef(null);
  const noRef = useRef(null);
  const hasConfirmedStartRef = useRef(false);

  const scrollToPortfolioContent = () => {
    const portfolioContent = document.querySelector(".portfolio-content");

    if (!portfolioContent) {
      return;
    }

    const targetTop = portfolioContent.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  };

  const handleStartClick = () => {
    hasConfirmedStartRef.current = true;
    console.log("Opening complete");
    scrollToPortfolioContent();
  };

  const handleHomeClick = () => {
    hasConfirmedStartRef.current = false;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
      window.setTimeout(() => {
        setSelectedStartOption("yes");
        hasConfirmedStartRef.current = false;
      }, 600);
  };

  const handleYesClick = () => {
    setSelectedStartOption("yes");
    handleStartClick();
  };

  const handleNoClick = () => {
    setSelectedStartOption("no");
    handleHomeClick();
  };

  useEffect(() => {
    const preloadNoScreen = new Image();
    preloadNoScreen.src = images.startNo;
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelectedStartOption("yes");
        yesRef.current?.focus({ preventScroll: true });
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelectedStartOption("no");
        noRef.current?.focus({ preventScroll: true });
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        if (selectedStartOption === "yes") {
          handleStartClick();
          return;
        }

        handleHomeClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedStartOption]);

  useEffect(() => {
    let ctx;
    let isMounted = true;

    const setupAnimation = async () => {
      const [gsapModule, scrollTriggerModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (!isMounted) {
        return;
      }

      const gsap = gsapModule.default;
      const ScrollTrigger =
        scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        mm.add(
          {
            desktop: "(min-width: 769px)",
            mobile: "(max-width: 768px)",
          },
          (context) => {
            const { desktop } = context.conditions || {};
            const zoomScale = desktop ? 2.75 : 1.85;
            const zoomX = desktop ? "0%" : "0%";
            const zoomY = desktop ? "-6%" : "-3%";

            gsap.set(heroRef.current, {
              transformOrigin: "50% 43%",
              scale: 1,
              x: 0,
              y: 0,
              opacity: 1,
            });
            gsap.set([screenRef.current, startRef.current], {
              scale: 1.04,
              opacity: 0,
            });
            gsap.set([yesRef.current, noRef.current], {
              autoAlpha: 0,
              pointerEvents: "none",
            });

            const timeline = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top top",
                end: "+=260%",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onLeave: (self) => {
                  if (hasConfirmedStartRef.current) {
                    return;
                  }

                  window.scrollTo({
                    top: self.end - 2,
                    behavior: "auto",
                  });
                },
                onEnterBack: () => {
                  hasConfirmedStartRef.current = false;
                },
              },
            });

            timeline
              .to(heroRef.current, {
                scale: zoomScale,
                x: zoomX,
                y: zoomY,
                duration: 1.25,
              })
              .to(
                screenRef.current,
                {
                  opacity: 1,
                  scale: 1,
                  clipPath: "inset(0% 0% 0% 0% round 1.2rem)",
                  duration: 0.55,
                },
                "-=0.18",
              )
              .to(
                heroRef.current,
                {
                  opacity: 0,
                  duration: 0.35,
                },
                "<",
              )
              .to(screenRef.current, {
                opacity: 0,
                scale: 1.02,
                duration: 0.45,
              })
              .to(
                startRef.current,
                {
                  opacity: 1,
                  scale: 1,
                  clipPath: "inset(0% 0% 0% 0% round 1.2rem)",
                  duration: 0.6,
                },
                "-=0.22",
              )
              .to([yesRef.current, noRef.current], {
                autoAlpha: 1,
                pointerEvents: "auto",
                duration: 0.1,
              });
          },
        );

        return () => mm.revert();
      }, rootRef);
    };

    setupAnimation().catch((error) => {
      console.error("Arcade intro animation failed to start", error);
    });

    return () => {
      isMounted = false;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="arcade-intro" ref={rootRef} aria-label="Arcade opening scene">
      <div className="arcade-stage">
        <img
          ref={heroRef}
          className="arcade-layer arcade-hero"
          src={images.hero}
          alt="Arcade cabinet"
          draggable="false"
        />

        <div className="screen-frame">
          <img
            ref={screenRef}
            className="arcade-layer screen-layer"
            src={images.screen}
            alt=""
            draggable="false"
          />
          <img
            ref={startRef}
            className="arcade-layer screen-layer start-layer"
            src={selectedStartOption === "yes" ? images.start : images.startNo}
            alt=""
            draggable="false"
          />
        </div>

        <div className="start-controls" aria-label="Start selection">
          <button
            ref={yesRef}
            type="button"
            className={`start-option-button start-yes-button ${
              selectedStartOption === "yes" ? "is-selected" : ""
            }`}
            aria-label="Select yes and start"
            aria-pressed={selectedStartOption === "yes"}
            onClick={handleYesClick}
          />
          <button
            ref={noRef}
            type="button"
            className={`start-option-button start-no-button ${
              selectedStartOption === "no" ? "is-selected" : ""
            }`}
            aria-label="Select no"
            aria-pressed={selectedStartOption === "no"}
            onClick={handleNoClick}
          />
        </div>
      </div>
    </section>
  );
}
