import { useState, useRef } from "react";

export default function HallucinationInterface() {
  const [input, setInput] = useState("");
  const floatingRef = useRef(null);

  const handleSubmit = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!input.trim()) return;

      const responseText = await getOpenAIResponse(input);

      // Speak the hallucinated response
      const utterance = new SpeechSynthesisUtterance(responseText);
      speechSynthesis.speak(utterance);

      // Float the glowing words
      spawnGlowingWords(responseText);

      setInput(""); // Clear prompt input
    }
  };

  // 🔌 Call your /api/hallucinate route
  async function getOpenAIResponse(prompt) {
    try {
      const res = await fetch("/api/hallucinate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API error:", data.error);
        return "The interface refuses to answer.";
      }

      return data.result || "Something emerged from the fog...";
    } catch (err) {
      console.error("Fetch failed:", err);
      return "The signal flickered and vanished.";
    }
  }

  // ✨ Float words across the screen
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
      span.style.opacity = 0.8;
      span.style.pointerEvents = "none";
      span.style.animation = "floatWord 6s ease-out forwards";
      span.style.textShadow = "0 0 8px #99f0ff";

      container.appendChild(span);
      setTimeout(() => container.removeChild(span), 6000);
    });
  }

  return (
    <>
      {/* Input */}
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
            width: "300px",
            borderRadius: "12px",
            border: "1px solid #ccc",
            backgroundColor: "white",
          }}
        />
      </div>

      {/* Floating words */}
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

      {/* Animation */}
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
      `}</style>
    </>
  );
}
