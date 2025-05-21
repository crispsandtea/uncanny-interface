
const container = document.getElementById("floating-texts");
const eye = document.getElementById("eye");
const canvas = document.getElementById("orbs-bg");
const ctx = canvas.getContext("2d");

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let orbs = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

for (let i = 0; i < 40; i++) {
  orbs.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    baseR: 4 + Math.random() * 6,
    r: 0,
    phase: Math.random() * Math.PI * 2,
    dx: 0,
    dy: 0,
    opacity: 0.3 + Math.random() * 0.4
  });
}

function drawOrbs() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const time = Date.now() * 0.002;

  orbs.forEach(orb => {
    const distX = (mouse.x - orb.x) * 0.002;
    const distY = (mouse.y - orb.y) * 0.002;
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

function spawnFloatingText(text) {
  const span = document.createElement("div");
  span.className = "float-text";
  span.style.left = `${Math.random() * 90}%`;
  span.style.top = `${Math.random() * 90}%`;
  span.textContent = text;
  container.appendChild(span);
  setTimeout(() => container.removeChild(span), 25000);
}

async function getHallucination() {
  const res = await fetch("/api/hallucinate");
  const data = await res.json();
  spawnFloatingText(data.text);
}

setInterval(getHallucination, 6000);

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  const x = (e.clientX / window.innerWidth - 0.5) * 80;
  const y = (e.clientY / window.innerHeight - 0.5) * 80;
  eye.style.transform = `translate(${x}px, ${y}px)`;
});
