import React from "react";

export default function HallucinationInterface() {
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
      }}
    >
      <button
        style={{
          padding: "1rem 2rem",
          fontSize: "1.2rem",
          backgroundColor: "#99f0ff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
        onClick={() => alert("Query clicked")}
      >
        Query
      </button>
    </div>
  );
}
