import { useState, useRef } from "react";

export default function HallucinationInterface() {
  const [input, setInput] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const floatingRef = useRef(null);

  const handleSubmit = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!input.trim()) return;

      const responseText = await getOpenAIResponse(input);

      // 🔊 Speak
      const utterance = new SpeechSynthesisUtterance(responseText);
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      speechSynthesis.speak(utterance);

      // 🌟 Words
      spawnGlowingWords(responseText);

      setInput("");
    }
  };

  // 🔁 Real API Call
  async function getOpenAIResponse(prompt) {
    try {
      const res = await fetch("/api/hallucinate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: prompt }),
      });

      const data = await res.json();
      return data.result || "The interface refused to answer.";
    } catch (err) {
      console.error(err);
      return "The interface blinked, then vanished.";
    }
  }

  // ✨ Floating word logic
  function spawnGlowingWords(text) {
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
      span.style.opacity = 0.85;
      span.style.pointerEvents = "none";
      span.style.animation = "floatWord 6s ease-out forwards";
      span.style.textShadow = "0 0 8px #99f0ff";

      container.appendChild(span);

      setTimeout(() => {
        container.removeChild(span);
      }, 6000);
    });
  }

  return (
    <div className={speaking ? "speaking" : ""}>
      {/* Input Box */}
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
            boxShadow: "0 0 12px rgba(153, 240, 255, 0.6)",
          }}
        />
      </div>

      {/* Floating Word Container */}
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

      {/* Styles */}
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

        .speaking {
          animation: screenGlitch 0.08s infinite alternate;
        }

        @keyframes screenGlitch {
          0% {
            filter: hue-rotate(0deg) brightness(1);
          }
          100% {
            filter: hue-rotate(15deg) brightness(1.07);
          }
        }
      `}</style>
    </div>
  );
}
