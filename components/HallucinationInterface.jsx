import { useState } from "react";

export default function HallucinationInterface() {
  const [queryMode, setQueryMode] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate handling input (e.g. calling an API)
    setResponse(`You queried: ${input}`);
    setInput("");
  };

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
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your prompt..."
            style={{
              padding: "1rem",
              fontSize: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              width: "300px",
              marginBottom: "1rem",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              backgroundColor: "#99f0ff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
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

      {response && (
        <p style={{ marginTop: "2rem", fontSize: "1rem", color: "#fff" }}>{response}</p>
      )}
    </div>
  );
}
