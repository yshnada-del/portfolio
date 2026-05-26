import { useEffect, useRef, useState } from "react";
import arcadeHero01 from "../assets/arcade_hero01.png";
import arcadeHero02 from "../assets/arcade_hero02.png";
import arcadeHero03 from "../assets/arcade_hero03.png";
import arcadeHero04 from "../assets/arcade_hero04.png";
import arcadeScreen from "../assets/arcade_screen01.png";
import startScreen from "../assets/start_screen01.png";
import startScreenNo from "../assets/start_screen02.png";

const leverImages = [arcadeHero01, arcadeHero02, arcadeHero03, arcadeHero04];

const images = {
  screen: arcadeScreen,
  start: startScreen,
  startNo: startScreenNo,
};

export default function ArcadeIntro({ onIntroComplete }) {
  const [leverStep, setLeverStep] = useState(0);
  const [previousLeverImage, setPreviousLeverImage] = useState(null);
  const [isLeverAnimating, setIsLeverAnimating] = useState(false);
  const [isScreenVisible, setIsScreenVisible] = useState(false);
  const [isStartVisible, setIsStartVisible] = useState(false);
  const [selectedStartOption, setSelectedStartOption] = useState("yes");
  const heroRef = useRef(null);
  const yesRef = useRef(null);
  const noRef = useRef(null);
  const leverFadeTimerRef = useRef(null);
  const leverReadyTimerRef = useRef(null);
  const screenTimerRef = useRef(null);
  const startTimerRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  const clearIntroTimers = () => {
    window.clearTimeout(leverFadeTimerRef.current);
    window.clearTimeout(leverReadyTimerRef.current);
    window.clearTimeout(screenTimerRef.current);
    window.clearTimeout(startTimerRef.current);
  };

  const resetIntro = () => {
    clearIntroTimers();
    setLeverStep(0);
    setPreviousLeverImage(null);
    setIsLeverAnimating(false);
    setIsScreenVisible(false);
    setIsStartVisible(false);
    setSelectedStartOption("yes");
  };

  const handleStartClick = () => {
    clearIntroTimers();
    setHasStarted(true);
    console.log("Opening complete");
    onIntroComplete?.();
  };

  const handleHomeClick = () => {
    setSelectedStartOption("no");
    window.setTimeout(resetIntro, 260);
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
    [...leverImages, images.screen, images.start, images.startNo].forEach((src) => {
      const preloadImage = new Image();
      preloadImage.src = src;
    });

    return clearIntroTimers;
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isStartVisible) {
        return;
      }

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
  }, [isStartVisible, selectedStartOption]);

  useEffect(() => {
    if (hasStarted) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [hasStarted]);

  const handleLeverClick = () => {
    if (isLeverAnimating || isScreenVisible) {
      return;
    }

    setIsLeverAnimating(true);
    setLeverStep((currentStep) => {
      const nextStep = Math.min(currentStep + 1, leverImages.length - 1);

      setPreviousLeverImage(leverImages[currentStep]);
      leverFadeTimerRef.current = window.setTimeout(() => {
        setPreviousLeverImage(null);
      }, 560);
      leverReadyTimerRef.current = window.setTimeout(() => {
        setIsLeverAnimating(false);
      }, 620);

      if (nextStep === leverImages.length - 1) {
        screenTimerRef.current = window.setTimeout(() => {
          setIsScreenVisible(true);
        }, 720);
        startTimerRef.current = window.setTimeout(() => {
          setIsStartVisible(true);
        }, 3720);
      }

      return nextStep;
    });
  };

  return (
    <section className="arcade-intro" aria-label="Arcade opening scene">
      <div className="arcade-stage">
        {previousLeverImage && (
          <img
            className="arcade-layer arcade-hero arcade-hero--previous"
            src={previousLeverImage}
            alt=""
            draggable="false"
          />
        )}
        <img
          key={leverStep}
          ref={heroRef}
          className="arcade-layer arcade-hero arcade-hero--current"
          src={leverImages[leverStep]}
          alt="Arcade control room"
          draggable="false"
        />

        {!isScreenVisible && (
          <div className="lever-controls" aria-label="Power levers">
            {[0, 1, 2].map((leverIndex) => (
              <button
                key={leverIndex}
                type="button"
                className={`lever-button lever-button-${leverIndex + 1}`}
                aria-label={`Raise lever ${leverIndex + 1}`}
                disabled={leverStep !== leverIndex || isLeverAnimating}
                onClick={handleLeverClick}
              />
            ))}
          </div>
        )}

        <div
          className={`screen-frame ${
            isScreenVisible ? "screen-frame--visible" : ""
          } ${
            isStartVisible ? "screen-frame--start-visible" : ""
          }`}
        >
          <img
            className="arcade-layer screen-layer boot-layer"
            src={images.screen}
            alt=""
            draggable="false"
          />
          <img
            className={`arcade-layer screen-layer start-layer start-layer-yes ${
              isStartVisible && selectedStartOption === "yes"
                ? "start-layer--visible"
                : ""
            }`}
            src={images.start}
            alt=""
            draggable="false"
          />
          <img
            className={`arcade-layer screen-layer start-layer start-layer-no ${
              isStartVisible && selectedStartOption === "no"
                ? "start-layer--visible"
                : ""
            }`}
            src={images.startNo}
            alt=""
            draggable="false"
          />
        </div>

        <div
          className={`start-controls ${
            isStartVisible ? "start-controls--visible" : ""
          }`}
          aria-label="Start selection"
        >
          <button
            ref={yesRef}
            type="button"
            className={`start-option-button start-yes-button ${
              selectedStartOption === "yes" ? "is-selected" : ""
            }`}
            aria-label="Select yes and start"
            aria-pressed={selectedStartOption === "yes"}
            onMouseEnter={() => setSelectedStartOption("yes")}
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
            onMouseEnter={() => setSelectedStartOption("no")}
            onClick={handleNoClick}
          />
        </div>
      </div>
    </section>
  );
}
