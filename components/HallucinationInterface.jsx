import { useEffect, useRef, useState } from "react";

export default function HallucinationInterface({ text, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [opacity, setOpacity] = useState(1);
  const indexRef = useRef(0);

  // Typewriter effect
  useEffect(() => {
    if (!text) return;

    const interval = setInterval(() => {
      indexRef.current++;
      setDisplayed(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        clearInterval(interval);
        setTimeout(() => {
          // Start fading
          let fade = setInterval(() => {
            setOpacity((prev) => {
              if (prev <= 0) {
                clearInterval(fade);
                onDone?.();
                return 0;
              }
              return prev - 0.01;
            });
          }, 50);
        }, 1000); // Delay before fading
      }
    }, 30); // Speed of typing

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div
      className="absolute top-1/2 left-1/2 max-w-xl w-full text-white text-lg pointer-events-none text-center"
      style={{
        transform: "translate(-50%, -50%)",
        opacity,
        backdropFilter: "blur(4px)",
        transition: "opacity 0.5s",
      }}
    >
      {displayed}
    </div>
  );
}
