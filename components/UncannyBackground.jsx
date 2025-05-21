return (
  <>
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none", // ✅ Doesn't block clicks
      }}
    />
    <div
      ref={eyeRef}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        width: "60px",
        height: "60px",
        marginLeft: "-30px",
        marginTop: "-30px",
        background: "radial-gradient(circle, #99f0ff 0%, #000 70%)",
        borderRadius: "50%",
        zIndex: 3,
        pointerEvents: "none", // ✅ Add this
      }}
    />
    <div
      ref={containerRef}
      id="floating-texts"
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        zIndex: 2,
        pointerEvents: "none", // ✅ Add this
      }}
    />
  </>
);
