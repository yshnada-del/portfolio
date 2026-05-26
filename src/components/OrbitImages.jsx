import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import DecryptedText from "./DecryptedText.jsx";

const ABOUT_STONE_INDEX = 4;
const JIBSA_STONE_INDEX = 1;

const stoneDetails = [
  {
    name: "POWER STONE",
    status: "UNKNOWN",
    housedIn: "THE ORB",
    appearances: ["GUARDIANS OF THE GALAXY", "AVENGERS: INFINITY WAR", "AVENGERS: ENDGAME"],
  },
  {
    name: "JIBSA LIFE",
    statusLabel: "PROJECT STATUS:",
    status: "IN DEVELOPMENT",
    basedLabel: "PROJECT FIELD:",
    housedIn: "AI PET HEALTHCARE",
    identityLabel: "CORE FEATURES:",
    appearances: ["AI HEALTH CHECK", "PET CARE RECORD", "COMMUNITY VOTING"],
    hasAccessFile: true,
  },
  {
    name: "TIME STONE",
    status: "UNKNOWN",
    housedIn: "THE EYE OF AGAMOTTO",
    appearances: ["DOCTOR STRANGE", "AVENGERS: INFINITY WAR", "AVENGERS: ENDGAME"],
  },
  {
    name: "SOUL STONE",
    status: "UNKNOWN",
    housedIn: "VORMIR",
    appearances: ["AVENGERS: INFINITY WAR", "AVENGERS: ENDGAME"],
  },
  {
    name: "ABOUT ME",
    status: "GROWING DESIGNER",
    basedLabel: "BASED IN:",
    housedIn: "USER EXPERIENCE",
    identityLabel: "IDENTITY:",
    appearances: [
      "OBSERVES USER PROBLEMS",
      "STRUCTURES COMPLEX FLOWS",
      "DESIGNS CLEAR EXPERIENCES",
    ],
    hasAccessFile: true,
  },
  {
    name: "MIND STONE",
    status: "UNKNOWN",
    housedIn: "LOKI'S SCEPTER",
    appearances: ["THE AVENGERS", "AVENGERS: AGE OF ULTRON", "AVENGERS: ENDGAME"],
  },
];

function generateEllipsePath(cx, cy, rx, ry) {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
}

function generateCirclePath(cx, cy, r) {
  return generateEllipsePath(cx, cy, r, r);
}

function generateSquarePath(cx, cy, size) {
  const h = size / 2;
  return `M ${cx - h} ${cy - h} L ${cx + h} ${cy - h} L ${cx + h} ${cy + h} L ${cx - h} ${cy + h} Z`;
}

function generateRectanglePath(cx, cy, w, h) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx - hw} ${cy - hh} L ${cx + hw} ${cy - hh} L ${cx + hw} ${cy + hh} L ${cx - hw} ${cy + hh} Z`;
}

function generateTrianglePath(cx, cy, size) {
  const height = (size * Math.sqrt(3)) / 2;
  const hs = size / 2;
  return `M ${cx} ${cy - height / 1.5} L ${cx + hs} ${cy + height / 3} L ${cx - hs} ${cy + height / 3} Z`;
}

function generateStarPath(cx, cy, outerR, innerR, points) {
  const step = Math.PI / points;
  let path = "";

  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }

  return `${path} Z`;
}

function generateHeartPath(cx, cy, size) {
  const s = size / 30;
  return `M ${cx} ${cy + 12 * s} C ${cx - 20 * s} ${cy - 5 * s}, ${cx - 12 * s} ${cy - 18 * s}, ${cx} ${cy - 8 * s} C ${cx + 12 * s} ${cy - 18 * s}, ${cx + 20 * s} ${cy - 5 * s}, ${cx} ${cy + 12 * s}`;
}

function generateInfinityPath(cx, cy, w, h) {
  const hw = w / 2;
  const hh = h / 2;
  return `M ${cx} ${cy} C ${cx + hw * 0.5} ${cy - hh}, ${cx + hw} ${cy - hh}, ${cx + hw} ${cy} C ${cx + hw} ${cy + hh}, ${cx + hw * 0.5} ${cy + hh}, ${cx} ${cy} C ${cx - hw * 0.5} ${cy + hh}, ${cx - hw} ${cy + hh}, ${cx - hw} ${cy} C ${cx - hw} ${cy - hh}, ${cx - hw * 0.5} ${cy - hh}, ${cx} ${cy}`;
}

function generateWavePath(cx, cy, w, amplitude, waves) {
  const pts = [];
  const segs = waves * 20;
  const hw = w / 2;

  for (let i = 0; i <= segs; i++) {
    const x = cx - hw + (w * i) / segs;
    const y = cy + Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
  }

  for (let i = segs; i >= 0; i--) {
    const x = cx - hw + (w * i) / segs;
    const y = cy - Math.sin((i / segs) * waves * 2 * Math.PI) * amplitude;
    pts.push(`L ${x} ${y}`);
  }

  return `${pts.join(" ")} Z`;
}

function OrbitItem({
  item,
  orbitIndex,
  totalItems,
  path,
  itemSize,
  rotation,
  progress,
  fill,
  isSelected,
  isDimmed,
  isLocked,
  isActive,
  onHoverStart,
  onHoverEnd,
  onSelect,
}) {
  const itemOffset = fill ? (orbitIndex / totalItems) * 100 : 0;
  const offsetDistance = useTransform(progress, (p) => {
    const offset = (((p + itemOffset) % 100) + 100) % 100;
    return `${offset}%`;
  });
  const zIndex = useTransform(progress, (p) => {
    const offset = (((p + itemOffset) % 100) + 100) % 100;
    return offset >= 50 ? 18 : 6;
  });

  return (
    <motion.div
      className={`orbit-item${isSelected ? " orbit-item--selected" : ""}${isDimmed ? " orbit-item--dimmed" : ""}${isLocked ? " orbit-item--locked" : ""}${isActive ? " orbit-item--active" : ""}`}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
      style={{
        width: itemSize,
        height: itemSize,
        offsetPath: `path("${path}")`,
        offsetRotate: "0deg",
        offsetAnchor: "center center",
        offsetDistance,
        zIndex,
      }}
    >
      <div className="orbit-item-inner" style={{ transform: `rotate(${-rotation}deg)` }}>
        {item}
      </div>
    </motion.div>
  );
}

export default function OrbitImages({
  images = [],
  altPrefix = "Orbiting image",
  shape = "ellipse",
  customPath,
  baseWidth = 1400,
  radiusX = 700,
  radiusY = 170,
  radius = 300,
  starPoints = 5,
  starInnerRatio = 0.5,
  rotation = -8,
  duration = 40,
  itemSize = 64,
  direction = "normal",
  fill = true,
  width = 100,
  height = 100,
  className = "",
  showPath = false,
  pathColor = "rgba(255,255,255,0.12)",
  pathWidth = 2,
  easing = "linear",
  paused = false,
  centerContent,
  responsive = false,
  onAboutContinue,
  onProjectContinue,
  onLockedSelect,
  activeStoneIndex = null,
  completedStoneIndexes = [],
}) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const progress = useMotionValue(0);
  const completedStoneSet = useMemo(
    () => new Set(completedStoneIndexes),
    [completedStoneIndexes],
  );
  const canSelectStone = (index) => activeStoneIndex === null || index === activeStoneIndex;

  const designCenterX = baseWidth / 2;
  const designCenterY = baseWidth / 2;

  const path = useMemo(() => {
    switch (shape) {
      case "circle":
        return generateCirclePath(designCenterX, designCenterY, radius);
      case "square":
        return generateSquarePath(designCenterX, designCenterY, radius * 2);
      case "rectangle":
        return generateRectanglePath(designCenterX, designCenterY, radiusX * 2, radiusY * 2);
      case "triangle":
        return generateTrianglePath(designCenterX, designCenterY, radius * 2);
      case "star":
        return generateStarPath(
          designCenterX,
          designCenterY,
          radius,
          radius * starInnerRatio,
          starPoints,
        );
      case "heart":
        return generateHeartPath(designCenterX, designCenterY, radius * 2);
      case "infinity":
        return generateInfinityPath(designCenterX, designCenterY, radiusX * 2, radiusY * 2);
      case "wave":
        return generateWavePath(designCenterX, designCenterY, radiusX * 2, radiusY, 3);
      case "custom":
        return customPath || generateCirclePath(designCenterX, designCenterY, radius);
      case "ellipse":
      default:
        return generateEllipsePath(designCenterX, designCenterY, radiusX, radiusY);
    }
  }, [
    shape,
    customPath,
    designCenterX,
    designCenterY,
    radiusX,
    radiusY,
    radius,
    starPoints,
    starInnerRatio,
  ]);

  useEffect(() => {
    if (!responsive || !containerRef.current) {
      return undefined;
    }

    const updateScale = () => {
      if (!containerRef.current) {
        return;
      }

      setScale(containerRef.current.clientWidth / baseWidth);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [responsive, baseWidth]);

  useEffect(() => {
    if (paused || isHoverPaused || selectedIndex !== null) {
      return undefined;
    }

    const currentProgress = progress.get();
    const nextProgress = currentProgress + (direction === "reverse" ? -100 : 100);
    const controls = animate(progress, nextProgress, {
      duration,
      ease: easing,
      repeat: Infinity,
      repeatType: "loop",
    });

    return () => controls.stop();
  }, [progress, duration, easing, direction, paused, isHoverPaused, selectedIndex]);

  useEffect(() => {
    if (selectedIndex !== null && completedStoneSet.has(selectedIndex)) {
      setSelectedIndex(null);
    }
  }, [completedStoneSet, selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  const containerWidth = responsive ? "100%" : typeof width === "number" ? width : "100%";
  const containerHeight = responsive
    ? "auto"
    : typeof height === "number"
      ? height
      : typeof width === "number"
        ? width
        : "auto";

  const items = images
    .map((image, index) => ({ image, index }))
    .filter(({ index }) => !completedStoneSet.has(index))
    .map(({ image, index }) => ({
      index,
      item: (
        <span className={`orbit-stone orbit-stone-${index + 1}`}>
          <img
            src={image}
            alt={`${altPrefix} ${index + 1}`}
            draggable={false}
            className="orbit-image"
          />
        </span>
      ),
    }));
  const selectedStone = selectedIndex === null ? null : stoneDetails[selectedIndex] || stoneDetails[0];
  const selectedImage = selectedIndex === null ? null : images[selectedIndex];
  const isAboutSelected = selectedIndex === ABOUT_STONE_INDEX;
  const handleAccessFileClick = isAboutSelected
    ? onAboutContinue
    : selectedIndex === JIBSA_STONE_INDEX
      ? onProjectContinue
      : undefined;
  const stoneHud = selectedStone && selectedImage && (
    <motion.div
      className={`stone-hud orbit-stone-${selectedIndex + 1}${isAboutSelected ? " stone-hud--about" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="stone-hud-circuit-lines" aria-hidden="true" />
      <button
        className="stone-hud-close"
        type="button"
        aria-label="Close stone details"
        onClick={() => setSelectedIndex(null)}
      />
      <motion.div
        className={`stone-hud-image-frame orbit-stone-${selectedIndex + 1}`}
        initial={{ opacity: 0, scale: 0.82, y: 22 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.38, ease: "easeOut" }}
      >
        <img className="stone-hud-image" src={selectedImage} alt="" draggable={false} />
      </motion.div>
      <div className="stone-hud-status">
        <span>{selectedStone.statusLabel || "STATUS:"}</span>
        <strong>{selectedStone.status}</strong>
      </div>
      <div className="stone-hud-appearances">
        <span>{selectedStone.identityLabel || "APPEARANCES:"}</span>
        {selectedStone.appearances.map((appearance) => (
          <strong key={appearance}>{appearance}</strong>
        ))}
      </div>
      <div className="stone-hud-title">
        <span>{selectedStone.basedLabel || "HOUSED IN:"}</span>
        <strong>{selectedStone.housedIn}</strong>
        <h2>{selectedStone.name}</h2>
        {selectedStone.hasAccessFile && (
          <button
            className="stone-hud-continue"
            type="button"
            onClick={handleAccessFileClick}
          >
            <DecryptedText
              text="ACCESS FILE ->"
              speed={60}
              maxIterations={10}
              sequential
              revealDirection="start"
              animateOn="hover"
              parentClassName="stone-hud-continue-text"
              encryptedClassName="stone-hud-continue-encrypted"
            />
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <>
      <div
        ref={containerRef}
        className={`orbit-container ${className}${selectedIndex !== null ? " orbit-container--detail-open" : ""}`}
        style={{
          width: containerWidth,
          height: containerHeight,
          aspectRatio: responsive ? "1 / 1" : undefined,
        }}
        aria-label="Infinity stones orbit"
      >
        <div
          className={
            responsive
              ? "orbit-scaling-container orbit-scaling-container--responsive"
              : "orbit-scaling-container"
          }
          style={{
            width: responsive ? baseWidth : "100%",
            height: responsive ? baseWidth : "100%",
            transform: responsive ? `translate(-50%, -50%) scale(${scale})` : undefined,
          }}
        >
          <div className="orbit-rotation-wrapper" style={{ transform: `rotate(${rotation}deg)` }}>
          {showPath && (
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${baseWidth} ${baseWidth}`}
              className="orbit-path-svg"
            >
              <path d={path} fill="none" stroke={pathColor} strokeWidth={pathWidth / scale} />
            </svg>
          )}

          {items.map(({ item, index }, orbitIndex) => (
            <OrbitItem
              key={index}
              item={item}
              orbitIndex={orbitIndex}
              totalItems={items.length}
              path={path}
              itemSize={itemSize}
              rotation={rotation}
              progress={progress}
              fill={fill}
              isSelected={selectedIndex === index}
              isDimmed={selectedIndex !== null && selectedIndex !== index}
              isLocked={!canSelectStone(index)}
              isActive={activeStoneIndex === index}
              onHoverStart={() => setIsHoverPaused(true)}
              onHoverEnd={() => setIsHoverPaused(false)}
              onSelect={() => {
                if (!canSelectStone(index)) {
                  onLockedSelect?.(index);
                  return;
                }

                setSelectedIndex((current) => (current === index ? null : index));
              }}
            />
          ))}

          {centerContent && (
            <div
              className="orbit-center-content"
              style={{ transform: `rotate(${-rotation}deg)` }}
            >
              {centerContent}
            </div>
          )}
          </div>
      </div>
      </div>
      {typeof document !== "undefined" && stoneHud ? createPortal(stoneHud, document.body) : null}
    </>
  );
}
