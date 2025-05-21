import { useState, useRef, useEffect } from "react";

export default function HallucinationInterface() {
  const [input, setInput] = useState("");
  const floatingRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body.glitch-pulse {
        animation: pulse 0.4s ease-in-out;
      }

      @keyframes pulse {
        0% { filter: brightness(1) contrast(1); }
        50% { filter: brightness(1.3) contrast(1.6) hue-rotate(20deg); }
        100% { filter: brightness(1) contrast(1); }
      }

      .glitch-span {
        position: absolute;
        font-weight: bold;
        color: #99f0ff;
        text-shadow: 0 0 4px #99f0ff, 0 0 8px #ccffff;
        animation: floatWord 6s ease-out forwards, glitch 0.5s infinite;
      }

      @keyframes floatWord {
        0% { opacity: 0; transform: translateY(0px) scale(1); }
        50% { opacity: 1; }
        100% { opacity: 0; transform: translateY(-80px) scale(1.5); }
      }

      @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-1px, 1px); }
        40% { transform: translate(1px, -1px); }
        60% { transform: translate(-2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
      }

      .glow-input {
        border: none;
        outline: none;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        color: white;
        font-size: 1rem;
        padding: 1rem;
        border-radius: 12px;
        width: 320px;
        box-shadow: 0 0 12px #99f0ff;
        transition: box-shadow 0.3s, background 0.3s;
        caret-color: #99f0ff;
      }

      .glow-input:focus {
        box-shadow: 0 0 20px #99f0ff, 0 0 40px #66e0ff;
        cursor: crosshair;
      }

      .glow-cursor {
        cursor: url('data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjMyIiB3aWR0aD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTlmMGZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNiAxTDMyIDE2TDE2IDMxTDEgMTYiLz48L3N2Zz4='), auto !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

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

        playGlitchAudio(responseText);
        spawnGlitchingWords(responseText);
        setInput("");
      } catch (err) {
        console.error("Error:", err);
      }
    }
  };

  const playGlitchAudio = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 0.9;
    utterance.volume = 1;

    // Web Audio distortion
    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(
      (speechSynthesis.speak(utterance), new MediaStream())
    );
    const distortion = ctx.createWaveShaper();
    const gain = ctx.createGain();

    distortion.curve = makeDistortionCurve(400);
    distortion.oversample = "4x";
    gain.gain.value = 0.9;

    source.connect(distortion);
    distortion.connect(gain);
    gain.connect(ctx.destination);

    document.body.classList.add("glitch-pulse");
    setTimeout(() => document.body.classList.remove("glitch-pulse"), 500);
  };

  const makeDistortionCurve = (amount = 50) => {
    const k = typeof amount === "number" ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * Math.PI) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  };

  const spawnGlitchingWords = (text) => {
    const words = text.split(" ");
    const container = floatingRef.current;

    words.forEach((word) => {
      const span = document.createElement("span");
      span.textContent = word;
      span.className = "glitch-span";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.fontSize = `${12 + Math.random() * 18}px`;
      container.appendChild(span);
      setTimeout(() => container.removeChild(span), 6000);
    });
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
          ref={inputRef}
          type="text"
          placeholder="Enter your prompt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleSubmit}
          className="glow-input glow-cursor"
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
    </>
  );
}
