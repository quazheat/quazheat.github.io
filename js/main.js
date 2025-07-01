document.addEventListener("DOMContentLoaded", () => {
  // — Back to Top Button —
  const btn = document.getElementById("toTopBtn");
  if (btn) {
    window.onscroll = () => {
      btn.style.display = window.scrollY > 200 ? "block" : "none";
    };
    btn.onclick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }

  // — Mobile Nav Toggle —
  const navbar = document.querySelector(".navbar");
  const toggle = document.querySelector(".nav-toggle");
  if (navbar && toggle) {
    toggle.addEventListener("click", () => {
      navbar.classList.toggle("open");
    });
  }

  // — Canvas Animation —
  const canvas = document.getElementById("bg-canvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const rootStyles = getComputedStyle(document.documentElement);
    const accentHex = rootStyles.getPropertyValue("--mood-4").trim();

    function hexToRgba(hex, alpha = 1) {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    let width, height;
    const NODE_COUNT = 60,
      MAX_DISTANCE = 120,
      NODE_RADIUS = 2,
      SPEED = 0.4;
    let nodes = [];

    function resizeCanvas() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() * 2 - 1) * SPEED;
        this.vy = (Math.random() * 2 - 1) * SPEED;
      }
      move() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x <= 0 || this.x >= width) this.vx *= -1;
        if (this.y <= 0 || this.y >= height) this.vy *= -1;
      }
    }

    function initNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push(new Node());
      }
    }
    initNodes();

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX_DISTANCE) {
            const opacity = (1 - dist / MAX_DISTANCE) * 0.6;
            ctx.strokeStyle = hexToRgba(accentHex, opacity);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = hexToRgba(accentHex, 0.8);
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        node.move();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }
});
