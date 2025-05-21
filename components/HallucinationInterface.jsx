import { useState, useRef, useEffect } from "react";

export default function HallucinationInterface() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const floatingRef = useRef(null);
  const cursorRef = useRef(null);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.8;
    utterance.rate = 0.75;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("https://uncanny-interface-1.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      const result = data.generated_text || "⚠️ No output from model";

      speak(result);
      spawnGlitchWords(result);
      setInput("");
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const spawnGlitchWords = (text) => {
    const words = text.split(" ");
    const container = floatingRef.current;

    words.forEach((word) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.className = "glitch-word";
      span.style.position = "absolute";
      span.style.left = `${Math.random() * 90}%`;
      span.style.top = `${Math.random() * 90}%`;
      span.style.fontSize = `${14 + Math.random() * 16}px`;
      span.style.color = "#99f0ff";
      span.style.opacity = 0.8;
      span.style.textShadow = "0 0 8px #99f0ff";
      span.style.animation = "floatWord 5s ease-out forwards";

      container.appendChild(span);
      setTimeout(() => container.removeChild(span), 5000);
    });
  };

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
      <form
        onSubmit={handleSubmit}
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
          className="hallucination-input"
        />
      </form>

      <div
        ref={floatingRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          width: "28px",
          height: "28px",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
        }}
      >
        {loading ? (
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle
              cx="50"
              cy="50"
              r="35"
              stroke="#99f0ff"
              strokeWidth="10"
              fill="none"
              strokeDasharray="164"
              strokeDashoffset="60"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <polygon
              points="50,0 100,50 50,100 0,50"
              fill="none"
              stroke="#ff3e3e"
              strokeWidth="10"
              filter="url(#glow)"
            />
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ff3e3e" />
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ff3e3e" />
              </filter>
            </defs>
          </svg>
        )}
      </div>

      <style jsx global>{`
        * {
          cursor: none !important;
        }
        .hallucination-input {
          padding: 1rem;
          font-size: 1rem;
          width: 340px;
          border-radius: 12px;
          border: 1px solid #99f0ff;
          background: rgba(0, 0, 0, 0.5);
          color: #99f0ff;
          text-shadow: 0 0 5px #99f0ff;
          backdrop-filter: blur(4px);
          outline: none;
          box-shadow: 0 0 12px #99f0ff;
        }
        .hallucination-input::placeholder {
          color: #66c0e0;
        }
        .glitch-word {
          animation: glitch 0.2s infinite;
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
            transform: translateY(-60px) scale(1.5);
          }
        }
      `}</style>
    </>
  );
}
