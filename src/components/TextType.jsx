import { useEffect, useState } from "react";

export default function TextType({
  text,
  as: Component = "span",
  typingSpeed = 50,
  initialDelay = 0,
  className = "",
  showCursor = true,
  cursorCharacter = "|",
  cursorClassName = "",
}) {
  const value = Array.isArray(text) ? text[0] || "" : text || "";
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    setVisibleText("");

    let index = 0;
    let intervalId;
    const delayId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setVisibleText(value.slice(0, index));

        if (index >= value.length) {
          window.clearInterval(intervalId);
        }
      }, typingSpeed);
    }, initialDelay);

    return () => {
      window.clearTimeout(delayId);
      window.clearInterval(intervalId);
    };
  }, [value, typingSpeed, initialDelay]);

  return (
    <Component className={className}>
      {visibleText}
      {showCursor && (
        <span className={`text-type-cursor ${cursorClassName}`} aria-hidden="true">
          {cursorCharacter}
        </span>
      )}
    </Component>
  );
}
