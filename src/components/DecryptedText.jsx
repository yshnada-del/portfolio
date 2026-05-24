import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

const DEFAULT_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

export default function DecryptedText({
  text,
  speed = 38,
  maxIterations = 9,
  sequential = true,
  revealDirection = "start",
  characters = DEFAULT_CHARACTERS,
  animateOn = "hover",
  className = "",
  encryptedClassName = "",
  parentClassName = "",
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  const orderedIndices = useMemo(() => {
    const indices = Array.from({ length: text.length }, (_, index) => index);

    if (revealDirection === "end") {
      return indices.reverse();
    }

    if (revealDirection === "center") {
      const center = (text.length - 1) / 2;
      return indices.sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
    }

    return indices;
  }, [revealDirection, text.length]);

  useEffect(() => {
    if (animateOn !== "view" && animateOn !== "both") {
      return undefined;
    }

    const element = containerRef.current;

    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [animateOn]);

  const shouldAnimate =
    animateOn === "hover"
      ? isHovering
      : animateOn === "both"
        ? (isHovering || isInView) && !hasAnimated
        : isInView && !hasAnimated;

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayText(text);
      return undefined;
    }

    let iteration = 0;
    const interval = window.setInterval(() => {
      iteration += 1;

      setDisplayText(() => {
        const revealedCount = sequential
          ? Math.floor((iteration / maxIterations) * text.length)
          : text.length;
        const revealed = new Set(orderedIndices.slice(0, revealedCount));

        return text
          .split("")
          .map((char, index) => {
            if (char === " " || revealed.has(index) || iteration >= maxIterations) {
              return char;
            }

            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("");
      });

      if (iteration >= maxIterations) {
        window.clearInterval(interval);
        setDisplayText(text);
        setHasAnimated(true);
      }
    }, speed);

    return () => window.clearInterval(interval);
  }, [characters, maxIterations, orderedIndices, sequential, shouldAnimate, speed, text]);

  const hoverProps =
    animateOn === "hover" || animateOn === "both"
      ? {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false),
          onFocus: () => setIsHovering(true),
          onBlur: () => setIsHovering(false),
        }
      : {};

  return (
    <motion.span ref={containerRef} className={parentClassName} {...hoverProps}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isEncrypted = char !== text[index];

          return (
            <span key={`${char}-${index}`} className={isEncrypted ? encryptedClassName : className}>
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}
