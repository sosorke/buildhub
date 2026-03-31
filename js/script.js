const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
const themeToggle = document.getElementById("themeToggle");
const form = document.querySelector(".contact-form");
const formFeedback = document.getElementById("formFeedback");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");

let width = 0;
let height = 0;
let animationFrame = null;
let stars = [];
const pointer = {
  x: 0,
  y: 0,
  radius: 120,
  active: false,
};

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  createStars();
}

function createStars() {
  const total = Math.max(70, Math.floor((width * height) / 16000));
  stars = Array.from({ length: total }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    z: Math.random() * 0.9 + 0.2,
    size: Math.random() * 1.8 + 0.4,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
  }));
}

function getThemePalette() {
  const lightMode = document.body.classList.contains("light-theme");

  return lightMode
    ? {
        star: "rgba(16, 0, 114, 0.9)",
        glow: "rgba(0, 159, 203, 0.16)",
        line: "rgba(16, 0, 114, 0.08)",
      }
    : {
        star: "rgba(255, 255, 255, 0.92)",
        glow: "rgba(122, 215, 255, 0.16)",
        line: "rgba(122, 215, 255, 0.10)",
      };
}

function drawStars() {
  const palette = getThemePalette();
  ctx.clearRect(0, 0, width, height);

  for (const star of stars) {
    const dx = pointer.x - star.x;
    const dy = pointer.y - star.y;
    const distance = Math.hypot(dx, dy);

    if (pointer.active && distance < pointer.radius) {
      star.x -= (dx / distance || 0) * 0.7 * star.z;
      star.y -= (dy / distance || 0) * 0.7 * star.z;
    }

    star.x += star.vx * star.z;
    star.y += star.vy * star.z;

    if (star.x < -20) star.x = width + 20;
    if (star.x > width + 20) star.x = -20;
    if (star.y < -20) star.y = height + 20;
    if (star.y > height + 20) star.y = -20;

    ctx.beginPath();
    ctx.fillStyle = palette.star;
    ctx.shadowBlur = 10;
    ctx.shadowColor = palette.glow;
    ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;

  for (let i = 0; i < stars.length; i += 1) {
    const a = stars[i];
    for (let j = i + 1; j < stars.length; j += 1) {
      const b = stars[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < 90) {
        ctx.beginPath();
        ctx.strokeStyle = palette.line;
        ctx.lineWidth = 0.5;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  animationFrame = window.requestAnimationFrame(drawStars);
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 1400;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    counter.textContent = `+${value}`;

    if (progress < 1) {
      window.requestAnimationFrame(update);
    } else {
      counter.textContent = `+${target}`;
    }
  }

  window.requestAnimationFrame(update);
}

function initCounters() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.7 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function initTheme() {
  const savedTheme = localStorage.getItem("buildhub-theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const nextTheme = document.body.classList.contains("light-theme") ? "light" : "dark";
    localStorage.setItem("buildhub-theme", nextTheme);
  });
}

function initForm() {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formFeedback.textContent = "Mensagem enviada com sucesso. Em breve a BuildHub entra em contato.";
    form.reset();
  });
}

window.addEventListener("mousemove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
});

window.addEventListener("mouseleave", () => {
  pointer.active = false;
});

window.addEventListener("resize", () => {
  window.cancelAnimationFrame(animationFrame);
  resizeCanvas();
  drawStars();
});

resizeCanvas();
drawStars();
initReveal();
initCounters();
initTheme();
initForm();

