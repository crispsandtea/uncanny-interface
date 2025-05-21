import { useState } from "react";

export default function HallucinationInterface() {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const response = `You said: ${input}`;

      // Speak the response
      const utterance = new SpeechSynthesisUtterance(response);
      speechSynthesis.speak(utterance);

      setInput(""); // Clear input
    }
  };

  return (
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
  );
}
