import React, { useState } from "react";

export default function HallucinationInterface() {
  const [queryMode, setQueryMode] = useState(false);
  const [input, setInput] = useState("");

  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {queryMode ? (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your prompt..."
          style={{
            padding: "1rem",
            fontSize: "1.2rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "300px",
          }}
        />
      ) : (
        <button
          onClick={() => setQueryMode(true)}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            backgroundColor: "#99f0ff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Query
        </button>
      )}
    </div>
  );
}
