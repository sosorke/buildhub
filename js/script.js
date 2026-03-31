const canvas = document.getElementById("space");
const context = canvas.getContext("2d");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const themeToggle = document.getElementById("themeToggle");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.getElementById("formStatus");

let width = 0;
let height = 0;
let stars = [];
let animationId = null;

const pointer = {
  x: 0,
  y: 0,
  radius: 140,
  active: false,
};

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  createStars();
}

function createStars() {
  const amount = Math.max(80, Math.floor((width * height) / 18000));

  stars = Array.from({ length: amount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 1.7 + 0.4,
    speedX: (Math.random() - 0.5) * 0.35,
    speedY: (Math.random() - 0.5) * 0.35,
    depth: Math.random() * 0.8 + 0.3,
  }));
}

function themeColors() {
  const botaoTema = document.getElementById("themeToggle");

function themeColors() {
  cconst isLight = document.body.classList.contains("light-mode");

  if (isLight) {
    return {
      star: "rgba(16, 0, 114, 0.9)",
      line: "rgba(16, 0, 114, 0.08)",
      glow: "rgba(0, 127, 187, 0.16)",
    };
  }

  return {
    star: "rgba(255, 255, 255, 0.92)",
    line: "rgba(103, 212, 255, 0.08)",
    glow: "rgba(103, 212, 255, 0.16)",
  };
}
  };
}

function updateStar(star) {
  if (pointer.active) {
    const deltaX = pointer.x - star.x;
    const deltaY = pointer.y - star.y;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance < pointer.radius) {
      const force = (pointer.radius - distance) / pointer.radius;
      star.x -= (deltaX / (distance || 1)) * force * 1.3 * star.depth;
      star.y -= (deltaY / (distance || 1)) * force * 1.3 * star.depth;
    }
  }

  star.x += star.speedX * star.depth;
  star.y += star.speedY * star.depth;

  if (star.x < -20) star.x = width + 20;
  if (star.x > width + 20) star.x = -20;
  if (star.y < -20) star.y = height + 20;
  if (star.y > height + 20) star.y = -20;
}

function drawSpace() {
  const colors = themeColors();
  context.clearRect(0, 0, width, height);

  for (const star of stars) {
    updateStar(star);
    context.beginPath();
    context.fillStyle = colors.star;
    context.shadowBlur = 12;
    context.shadowColor = colors.glow;
    context.arc(star.x, star.y, star.size * star.depth, 0, Math.PI * 2);
    context.fill();
  }

  context.shadowBlur = 0;

  for (let i = 0; i < stars.length; i += 1) {
    for (let j = i + 1; j < stars.length; j += 1) {
      const first = stars[i];
      const second = stars[j];
      const distance = Math.hypot(first.x - second.x, first.y - second.y);

      if (distance < 86) {
        context.beginPath();
        context.strokeStyle = colors.line;
        context.lineWidth = 0.5;
        context.moveTo(first.x, first.y);
        context.lineTo(second.x, second.y);
        context.stroke();
      }
    }
  }

  animationId = requestAnimationFrame(drawSpace);
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function animateCounter(counter) {
  const target = Number(counter.dataset.target);
  const duration = 1500;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    counter.textContent = `+${value}`;

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      counter.textContent = `+${target}`;
    }
  }

  requestAnimationFrame(frame);
}

function setupCounters() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.65 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function setupTheme() {
  const savedTheme = localStorage.getItem("buildhub-theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const mode = document.body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("buildhub-theme", mode);
  });
}

function setupForm() {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Mensagem enviada com sucesso. A BuildHub entrara em contato em breve.";
    contactForm.reset();
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
  cancelAnimationFrame(animationId);
  resizeCanvas();
  drawSpace();
});

resizeCanvas();
drawSpace();
setupReveal();
setupCounters();
setupTheme();
setupForm();
