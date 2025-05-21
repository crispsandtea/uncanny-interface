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

  // 🌟 Glitching words
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
      span.style.color = "#99f0ff";
      span.style.opacity = 0.8;
      span.style.pointerEvents = "none";
      span.style.textShadow = "0 0 8px #99f0ff";
      span.className = "glitch-word";
      container.appendChild(span);

      setTimeout(() => container.removeChild(span), 5000);
    });
  }

  useEffect(() => {
    const inputBox = document.getElementById("hallucination-input");

    const handleFocus = () => {
      if (cursorRef.current) cursorRef.current.classList.add("morphing");
    };
    const handleBlur = () => {
      if (cursorRef.current) cursorRef.current.classList.remove("morphing");
    };

    inputBox?.addEventListener("focus", handleFocus);
    inputBox?.addEventListener("blur", handleBlur);

    return () => {
      inputBox?.removeEventListener("focus", handleFocus);
      inputBox?.removeEventListener("blur", handleBlur);
    };
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
            border: "1px solid rgba(153, 240, 255, 0.4)",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            color: "#99f0ff",
            textAlign: "center",
            boxShadow: "0 0 12px rgba(153, 240, 255, 0.3)",
            outline: "none",
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

      <div
        ref={cursorRef}
        className="morphing-cursor"
        style={{
          position: "fixed",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "#99f0ff",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "difference",
        }}
      />

      <style jsx>{`
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

        .morphing {
          animation: pulse 1.5s infinite ease-in-out;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
