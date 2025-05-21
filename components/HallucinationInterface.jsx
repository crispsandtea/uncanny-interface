import { useState, useRef } from "react";

export default function HallucinationInterface() {
  const [input, setInput] = useState("");
  const floatingRef = useRef(null);

  const handleSubmit = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!input.trim()) return;

      try {
        const res = await fetch("/api/hallucinate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: input }),
        });

        const data = await res.json();
        const responseText = data.result || "The interface refused to speak.";

        speakResponse(responseText);
        spawnGlowingWords(responseText);
        setInput("");
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };

  const speakResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
    pulseEffect(); // trigger visual pulse
  };

  const spawnGlowingWords = (text) => {
    const words = text.split(" ");
    const container = floatingRef.current;

    words.forEach((word) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.style.position = "absolute";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.fontSize = `${12 + Math.random() * 18}px`;
      span.style.color = "#99f0ff";
      span.style.opacity = 0.8;
      span.style.pointerEvents = "none";
      span.style.animation = "floatWord 6s ease-out forwards";
      span.style.textShadow = "0 0 8px #99f0ff";

      container.appendChild(span);
      setTimeout(() => container.removeChild(span), 6000);
    });
  };

  const pulseEffect = () => {
    const body = document.body;
    body.classList.add("glitch-pulse");
    setTimeout(() => body.classList.remove("glitch-pulse"), 500);
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <input
          type="text"
          placeholder="Enter your prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleSubmit}
          style={{
            padding: "1rem",
            fontSize: "1rem",
            width: "320px",
            borderRadius: "12px",
            border: "1px solid #ccc",
            backgroundColor: "white",
            color: "black",
          }}
        />
      </div>

      <div
        ref={floatingRef}
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      />

      <style jsx>{`
        @keyframes floatWord {
          0% {
            opacity: 0;
            transform: translateY(0px) scale(1);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-80px) scale(1.5);
          }
        }

        :global(body.glitch-pulse) {
          animation: pulse 0.4s ease-in-out;
        }

        @keyframes pulse {
          0% {
            filter: brightness(1) contrast(1);
          }
          50% {
            filter: brightness(1.3) contrast(1.5) hue-rotate(30deg);
          }
          100% {
            filter: brightness(1) contrast(1);
          }
        }
      `}</style>
    </>
  );
}
