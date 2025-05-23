import { useEffect, useRef } from "react";

export default function UncannyBackground() {
  const canvasRef = useRef(null);
  const eyeRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const orbs = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    mouse.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };

    for (let i = 0; i < 40; i++) {
      orbs.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseR: 4 + Math.random() * 6,
        r: 0,
        phase: Math.random() * Math.PI * 2,
        dx: 0,
        dy: 0,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }

    function drawOrbs() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.002;

      orbs.current.forEach((orb) => {
        const distX = (mouse.current.x - orb.x) * 0.002;
        const distY = (mouse.current.y - orb.y) * 0.002;
        orb.dx += distX;
        orb.dy += distY;
        orb.x += orb.dx;
        orb.y += orb.dy;
        orb.dx *= 0.94;
        orb.dy *= 0.94;
        orb.r = orb.baseR + Math.sin(time + orb.phase) * 1.5;

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(153, 240, 255, ${orb.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(drawOrbs);
    }

    drawOrbs();

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      const x = (e.clientX / window.innerWidth - 0.5) * 80;
      const y = (e.clientY / window.innerHeight - 0.5) * 80;
      if (eyeRef.current) {
        eyeRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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
          pointerEvents: "none", // 🔥 Keeps background from blocking clicks
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
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
