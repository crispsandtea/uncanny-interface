import { useState, useRef, useEffect } from "react";

export default function HallucinationInterface() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const floatingRef = useRef(null);
  const cursorRef = useRef(null);

  const handleSubmit = async (e) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      if (!input.trim()) return;

      setLoading(true);

      try {
        const res = await fetch("/api/hallucinate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: input }),
        });

        const data = await res.json();
        const text = data?.result || "The interface refused to speak.";

        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);

        spawnGlitchingWords(text);
      } catch (err) {
        console.error(err);
        const fallback = "The interface refused to speak.";
        speechSynthesis.speak(new SpeechSynthesisUtterance(fallback));
      } finally {
        setInput("");
        setLoading(false);
      }
    }
  };

  function spawnGlitchingWords(text) {
    const words = text.split(" ");
    const container = floatingRef.current;

    words.forEach((word) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.style.position = "absolute";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.fontSize = `${14 + Math.random() * 12}px`;
      span.style.color = "#ff3e3e";
      span.style.opacity = 0.9;
      span.style.pointerEvents = "none";
      span.style.textShadow = "0 0 8px red";
      span.className = "glitch-word";
      container.appendChild(span);

      setTimeout(() => container.removeChild(span), 5000);
    });
  }

  // 💎 Track mouse for custom diamond cursor
  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

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
          id="hallucination-input"
          type="text"
          placeholder={loading ? "Listening..." : "Enter your prompt"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleSubmit}
          style={{
            padding: "1rem",
            fontSize: "1.2rem",
            width: "400px",
            borderRadius: "20px",
            border: "1px solid rgba(255, 0, 0, 0.5)",
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(10px)",
            color: "#ff3e3e", // 🔥 visible input text
            textAlign: "center",
            boxShadow: "0 0 12px rgba(255, 0, 0, 0.4)",
            outline: "none",
            caretColor: "#ff3e3e",
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

      {/* 🔴 Custom Red Diamond Cursor */}
      <div
        ref={cursorRef}
        className="diamond-cursor"
        style={{
          position: "fixed",
          width: "20px",
          height: "20px",
          background: "#ff3e3e",
          transform: "rotate(45deg)",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "difference",
          transition: "transform 0.1s ease-out",
        }}
      />

      <style jsx global>{`
        * {
          cursor: none !important;
        }

        @keyframes glitch {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(-1px, 1px);
          }
          50% {
            transform: translate(1px, -1px);
          }
          75% {
            transform: translate(-1px, -1px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        .glitch-word {
          animation: glitch 0.2s infinite;
        }
      `}</style>
    </>
  );
}
