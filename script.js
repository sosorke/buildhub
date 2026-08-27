const state = {
  projects: [
    {
      id: 1,
      title: "GameBear",
      category: "games",
      label: "Empresa de Desenvolvimento de Jogos",
      description: "Estudio especializado no desenvolvimento de jogos para PC, Mobile e Web, criando experiencias imersivas para jogadores do mundo inteiro.",
      shortDescription: "Experiencias gamer para PC, Mobile e Web.",
      stack: "Design gamer, UI neon, web interativa",
      progress: 100,
      url: "#",
      cover: "images/gamebear-cover.svg",
      logo: "images/gamebear-logo.svg",
      theme: "Escuro, azul e roxo neon",
      features: ["Design gamer", "Tons escuros", "Azul e roxo neon", "Interface moderna"]
    },
    {
      id: 2,
      title: "SafeCore",
      category: "security",
      label: "Blog de Tecnologia e Segurança Digital",
      description: "Portal focado em cibersegurança, privacidade digital, proteção de dados e noticias sobre tecnologia.",
      shortDescription: "Blog profissional sobre ciberseguranca e privacidade.",
      stack: "Blog, SEO, artigos em destaque",
      progress: 100,
      url: "https://sosorke.github.io/safecore/",
      cover: "images/safecore-cover.svg",
      logo: "images/safecore-logo.svg",
      theme: "Corporativo, branco e azul",
      features: ["Visual corporativo", "Branco e azul", "Layout de blog profissional", "Artigos em destaque"]
    },
    {
      id: 3,
      title: "Shield Woman",
      category: "store",
      label: "Loja de Defesa Pessoal Feminina",
      description: "E-commerce especializado em artigos voltados para segurança e proteção feminina, com foco em conscientização, informação e prevenção.",
      shortDescription: "Loja virtual elegante para seguranca e protecao feminina.",
      stack: "E-commerce, catalogo, conteudo educativo",
      progress: 100,
      url: "https://sosorke.github.io/nicolastrabalho1/",
      cover: "images/shieldwoman-cover.svg",
      logo: "images/shieldwoman-logo.svg",
      theme: "Roxo, branco e preto",
      features: ["Visual elegante", "Roxo, branco e preto", "Layout de loja virtual", "Catalogo de produtos"]
    }
  ],
  users: [
    { email: "buildhub@admin.com", password: "123456", role: "admin", name: "Administrador", cpf: "00000000000", matricula: "BH-0001", projectId: null },
    { email: "cliente@buildhub.dev", password: "123456", role: "cliente", name: "Cliente BuildHub", cpf: "11111111111", matricula: "BH-0002", projectId: null }
  ],
  clientProjects: [],
  activationKeys: [],
  chats: []
};

const selectors = {
  loader: document.querySelector("#loader"),
  grid: document.querySelector("#floatingGrid"),
  brandText: document.querySelector("#brandText"),
  brandSymbol: document.querySelector("#brandSymbol"),
  navToggle: document.querySelector("#navToggle"),
  navMenu: document.querySelector("#navMenu"),
  projectGrid: document.querySelector("#projectGrid"),
  modal: document.querySelector("#projectModal"),
  modalContent: document.querySelector("#modalContent"),
  loginForm: document.querySelector("#loginForm"),
  registerForm: document.querySelector("#registerForm"),
  themeToggle: document.querySelector("#themeToggle"),
  toast: document.querySelector("#toast"),
  toTop: document.querySelector("#toTop"),
  dashboard: document.querySelector("#dashboard"),
  dashboardRole: document.querySelector("#dashboardRole"),
  dashboardTitle: document.querySelector("#dashboardTitle"),
  dashboardMenu: document.querySelector("#dashboardMenu"),
  dashboardContent: document.querySelector("#dashboardContent"),
  logoutButton: document.querySelector("#logoutButton"),
  canvas: document.querySelector("#particleCanvas")
};

const storageKeys = {
  projects: "buildhub_projects",
  session: "buildhub_session",
  users: "buildhub_users",
  theme: "buildhub_theme",
  clientProjects: "buildhub_client_projects",
  activationKeys: "buildhub_activation_keys",
  chats: "buildhub_chats"
};

const pageType = document.body.dataset.page || "home";

document.addEventListener("DOMContentLoaded", () => {
  hydrateStorage();
  initTheme();
  if (selectors.brandText && selectors.brandSymbol) prepareLogoAnimation();
  if (selectors.grid) createFloatingBlocks();
  if (selectors.canvas) initParticles();
  if (selectors.projectGrid) {
    renderProjects();
    bindPortfolio();
  }
  if (selectors.navToggle && selectors.navMenu) bindNavigation();
  bindPortfolioLinks();
  bindForms();
  if (selectors.dashboard) bindDashboard();
  initRevealAnimations();
  initCursor();
  restoreSession();

  setTimeout(() => selectors.loader?.classList.add("done"), 850);
});

function initTheme() {
  const isDark = localStorage.getItem(storageKeys.theme) === "dark";
  document.documentElement.classList.toggle("dark-theme", isDark);
  document.body.classList.toggle("dark-theme", isDark);
  updateThemeToggle(isDark);

  selectors.themeToggle?.addEventListener("click", () => {
    const nextIsDark = !document.body.classList.contains("dark-theme");
    document.documentElement.classList.toggle("dark-theme", nextIsDark);
    document.body.classList.toggle("dark-theme", nextIsDark);
    localStorage.setItem(storageKeys.theme, nextIsDark ? "dark" : "light");
    updateThemeToggle(nextIsDark);
  });
}

function updateThemeToggle(isDark) {
  if (!selectors.themeToggle) return;
  selectors.themeToggle.textContent = isDark ? "☀️" : "🌙";
  selectors.themeToggle.setAttribute("aria-label", isDark ? "Ativar tema claro" : "Ativar tema escuro");
  selectors.themeToggle.setAttribute("title", isDark ? "Ativar tema claro" : "Ativar tema escuro");
}

function animatePreviewMetric(panel) {
  const value = panel.querySelector(".preview-metric-value");
  const fill = panel.querySelector(".preview-metric-bar-fill");
  const target = Number(panel.dataset.target) || 0;
  const duration = 2800;
  const start = performance.now();

  panel.style.setProperty("--progress", `${panel.dataset.progress || 0}%`);
  panel.classList.add("is-animated");

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    value.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(update);
    else value.textContent = target;
  }

  if (fill) requestAnimationFrame(() => requestAnimationFrame(() => fill.classList.add("is-animated")));
  requestAnimationFrame(update);
}

function hydrateStorage() {
  const savedProjects = JSON.parse(localStorage.getItem(storageKeys.projects) || "null");
  const savedUsers = JSON.parse(localStorage.getItem(storageKeys.users) || "null");
  const savedClientProjects = JSON.parse(localStorage.getItem(storageKeys.clientProjects) || "[]");
  const savedActivationKeys = JSON.parse(localStorage.getItem(storageKeys.activationKeys) || "[]");
  const savedChats = JSON.parse(localStorage.getItem(storageKeys.chats) || "[]");

  if (Array.isArray(savedUsers)) state.users = savedUsers.map((user, index) => ({
    ...user,
    role: user.role === "adm" ? "admin" : user.role,
    cpf: user.cpf || "",
    matricula: user.matricula || `BH-${String(index + 1).padStart(4, "0")}`,
    projectId: user.projectId || null
  }));
  if (!state.users.some((user) => user.email === "buildhub@admin.com")) {
    state.users.unshift({ email: "buildhub@admin.com", password: "123456", role: "admin", name: "Administrador", cpf: "00000000000", matricula: "BH-0001", projectId: null });
  }
  localStorage.setItem(storageKeys.users, JSON.stringify(state.users));
  state.clientProjects = Array.isArray(savedClientProjects) ? savedClientProjects : [];
  state.activationKeys = Array.isArray(savedActivationKeys) ? savedActivationKeys : [];
  state.chats = Array.isArray(savedChats) ? savedChats : [];

  const hasRequestedPortfolio = Array.isArray(savedProjects) && savedProjects.length === 3 && savedProjects.every((project) => ["GameBear", "SafeCore", "Shield Woman"].includes(project.title));
  if (hasRequestedPortfolio) {
    state.projects = savedProjects.map((project) => {
      const defaultProject = state.projects.find((item) => item.title === project.title);
      const savedUrl = project.url && project.url !== "#" ? project.url : defaultProject?.url;
      return { ...project, url: savedUrl || "#" };
    });
  } else {
    localStorage.setItem(storageKeys.projects, JSON.stringify(state.projects));
  }
}

function prepareLogoAnimation() {
  const text = selectors.brandText.textContent;
  selectors.brandText.innerHTML = text.split("").map((letter) => `<span>${letter}</span>`).join("");

  setInterval(() => {
    const letters = selectors.brandText.querySelectorAll("span");
    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add("logo-pop");
        setTimeout(() => letter.classList.remove("logo-pop"), 520);
      }, index * 55);
    });
    selectors.brandSymbol.animate(
      [
        { transform: "rotate(0deg) scale(1)" },
        { transform: "rotate(-5deg) scale(1.08)" },
        { transform: "rotate(0deg) scale(1)" }
      ],
      { duration: 680, easing: "cubic-bezier(.16,1,.3,1)" }
    );
  }, 3600);
}

function createFloatingBlocks() {
  const blockCount = Math.min(90, Math.floor(window.innerWidth / 16));
  selectors.grid.innerHTML = "";

  for (let index = 0; index < blockCount; index += 1) {
    const block = document.createElement("span");
    block.className = "float-block";
    block.dataset.baseX = Math.random() * 100;
    block.dataset.baseY = Math.random() * 100;
    block.style.left = `${block.dataset.baseX}%`;
    block.style.top = `${block.dataset.baseY}%`;
    block.style.width = `${6 + Math.random() * 11}px`;
    block.style.height = block.style.width;
    block.style.animationDelay = `${Math.random() * -8}s`;
    block.style.opacity = `${0.26 + Math.random() * 0.42}`;
    selectors.grid.appendChild(block);
  }

  if (!createFloatingBlocks.bound) {
    document.addEventListener("mousemove", scatterBlocks);
    createFloatingBlocks.bound = true;
  }
}

function scatterBlocks(event) {
  const blocks = selectors.grid.children;
  const influence = 130;

  Array.from(blocks).forEach((block) => {
    const rect = block.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

    if (distance < influence) {
      const strength = (influence - distance) / influence;
      const angle = Math.atan2(centerY - event.clientY, centerX - event.clientX);
      const move = 44 * strength;
      const rotate = 35 * strength * (centerX > event.clientX ? 1 : -1);
      block.classList.add("scatter");
      block.style.transform = `translate3d(${Math.cos(angle) * move}px, ${Math.sin(angle) * move}px, 0) rotate(${rotate}deg)`;
    } else {
      block.classList.remove("scatter");
      block.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
    }
  });
}

function initParticles() {
  const canvas = selectors.canvas;
  const context = canvas.getContext("2d");
  const particles = [];

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function seed() {
    particles.length = 0;
    const total = Math.min(70, Math.floor(window.innerWidth / 18));
    for (let index = 0; index < total; index += 1) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        size: Math.random() * 1.7 + 0.6
      });
    }
  }

  function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
      if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fillStyle = "rgba(16, 0, 114, 0.18)";
      context.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  seed();
  draw();
  window.addEventListener("resize", () => {
    resize();
    seed();
    createFloatingBlocks();
  });
}

function bindNavigation() {
  selectors.navToggle.addEventListener("click", () => {
    const isOpen = selectors.navMenu.classList.toggle("open");
    selectors.navToggle.classList.toggle("open", isOpen);
    selectors.navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  selectors.navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMobileMenu());
  });

  window.addEventListener("scroll", () => {
    selectors.toTop.classList.toggle("visible", window.scrollY > 620);
    updateActiveNav();
  });

  selectors.toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function bindPortfolioLinks() {
  document.querySelectorAll('a[href="#portfolio"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const portfolio = document.querySelector("#portfolio");
      if (!portfolio) {
        window.location.href = "index.html#portfolio";
        return;
      }

      event.preventDefault();
      portfolio.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMobileMenu();
    });
  });
}

function closeMobileMenu() {
  selectors.navMenu.classList.remove("open");
  selectors.navToggle.classList.remove("open");
  selectors.navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function updateActiveNav() {
  const sections = ["home", "quem-somos", "servicos", "processo", "portfólio", "login"];
  const current = sections.slice().reverse().find((id) => {
    const section = document.getElementById(id);
    return section && section.getBoundingClientRect().top <= 150;
  }) || "home";

  selectors.navMenu.querySelectorAll("a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

function renderProjects() {
  selectors.projectGrid.innerHTML = state.projects.map((project) => `
    <article class="project-card premium-project-card reveal" role="button" tabindex="0" data-project-id="${project.id}" data-category="${project.category}">
      <div class="project-visual premium-project-visual">
        <img class="project-cover" src="${project.cover}" alt="Capa do projeto ${project.title}">
        <span class="project-shine" aria-hidden="true"></span>
      </div>
      <div class="project-body premium-project-body">
        <img class="project-logo" src="${project.logo}" alt="Logo ${project.title}">
        <span class="project-category">${project.label}</span>
        <h3>${project.title}</h3>
        <p>${project.shortDescription || project.description}</p>
        <button class="project-button" type="button">Ver Projeto</button>
        <a class="project-link" href="${project.url || "#"}" target="_blank" rel="noopener noreferrer">Acessar site</a>
      </div>
    </article>
  `).join("");
  initRevealAnimations();
}

function bindPortfolio() {
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      filterProjects(button.dataset.filter);
    });
  });

  selectors.projectGrid.addEventListener("click", (event) => {
    const externalLink = event.target.closest(".project-link");
    if (externalLink) {
      event.preventDefault();
      const card = externalLink.closest(".project-card");
      const project = state.projects.find((item) => item.id === Number(card?.dataset.projectId));
      if (!project?.url || project.url === "#") {
        showToast("Defina a URL do projeto antes de acessar o site.");
        return;
      }
      window.open(project.url, "_blank", "noopener,noreferrer");
      return;
    }
    const card = event.target.closest(".project-card");
    if (!card) return;
    const project = state.projects.find((item) => item.id === Number(card.dataset.projectId));
    openProjectModal(project);
  });

  selectors.projectGrid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".project-card");
    if (!card) return;
    event.preventDefault();
    const project = state.projects.find((item) => item.id === Number(card.dataset.projectId));
    openProjectModal(project);
  });

  selectors.modal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-modal]")) closeProjectModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProjectModal();
  });
}

function filterProjects(filter) {
  selectors.projectGrid.querySelectorAll(".project-card").forEach((card) => {
    const shouldShow = filter === "all" || card.dataset.category === filter;
    card.hidden = !shouldShow;
  });
}

function openProjectModal(project) {
  selectors.modalContent.innerHTML = `
    <img class="modal-project-cover" src="${project.cover}" alt="Capa do projeto ${project.title}">
    <div class="modal-project-heading">
      <img class="project-logo" src="${project.logo}" alt="Logo ${project.title}">
      <div>
        <span class="project-category">${project.label}</span>
        <h2>${project.title}</h2>
      </div>
    </div>
    <p>${project.description}</p>
    <p><strong>Identidade:</strong> ${project.theme}</p>
    <p><strong>Entrega:</strong> ${project.stack}</p>
    <ul class="feature-list modal-feature-list">${project.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
    <div class="progress-track"><span style="width: ${project.progress}%"></span></div>
  `;
  selectors.modal.classList.add("open");
  selectors.modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProjectModal() {
  selectors.modal.classList.remove("open");
  selectors.modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function bindForms() {
  selectors.loginForm?.addEventListener("submit", handleLoginSubmit);
  selectors.registerForm?.addEventListener("submit", handleRegisterSubmit);

  document.querySelectorAll("[data-auth-tab]").forEach((tab) => {
    tab.addEventListener("click", () => setAuthMode(tab.dataset.authTab));
  });

  document.querySelector("#togglePassword")?.addEventListener("click", () => {
    const input = document.querySelector("#loginPassword");
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    document.querySelector("#togglePassword").textContent = isPassword ? "Ocultar" : "Ver";
  });

  document.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.querySelector(`#${button.dataset.togglePassword}`);
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      button.textContent = isPassword ? "Ocultar" : "Ver";
    });
  });

  document.querySelector("#registerCpf")?.addEventListener("input", (event) => {
    event.target.value = formatCpf(event.target.value);
  });

  const remembered = localStorage.getItem("buildhub_remembered_email");
  if (remembered && document.querySelector("#loginEmail")) {
    document.querySelector("#loginEmail").value = remembered;
    document.querySelector("#rememberLogin").checked = true;
  }
}

function formatCpf(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const firstBlock = digits.slice(0, 3);
  const secondBlock = digits.slice(3, 6);
  const thirdBlock = digits.slice(6, 9);
  const suffix = digits.slice(9, 11);
  return [firstBlock, secondBlock, thirdBlock].filter(Boolean).join(".") + (suffix ? `-${suffix}` : "");
}

// Exibe o CPF salvo de forma protegida até que o usuário clique no ícone de olho.
function cpfVisibilityControl(cpf, id) {
  const value = formatCpf(cpf || "");
  const hiddenValue = value.replace(/\d/g, "•") || "•••.•••.•••-••";
  return `<span class="password-control cpf-control"><span class="cpf-value" id="${id}" data-cpf-value="${escapeHTML(value)}" data-cpf-hidden="${hiddenValue}">${hiddenValue}</span><button data-toggle-cpf="${id}" type="button" aria-label="Mostrar CPF">👁</button></span>`;
}

function bindCpfToggles() {
  document.querySelectorAll("[data-toggle-cpf]").forEach((button) => button.addEventListener("click", () => {
    const value = document.querySelector(`#${button.dataset.toggleCpf}`);
    const isHidden = value.textContent === value.dataset.cpfHidden;
    value.textContent = isHidden ? value.dataset.cpfValue : value.dataset.cpfHidden;
    button.textContent = isHidden ? "🙈" : "👁";
    button.setAttribute("aria-label", isHidden ? "Ocultar CPF" : "Mostrar CPF");
  }));
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits.length > 10
    ? digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3").replace(/-$/, "")
    : digits.replace(/^(\d{2})(\d{0,4})(\d{0,4}).*/, "($1) $2-$3").replace(/[- ]$/, "");
}

function formatCnpj(value) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2}).*/, "$1.$2.$3/$4-$5").replace(/[./-]$/, "");
}

function setAuthMode(mode) {
  const isLogin = mode === "login";
  selectors.loginForm.hidden = !isLogin;
  selectors.registerForm.hidden = isLogin;
  document.querySelectorAll("[data-auth-tab]").forEach((tab) => {
    const active = tab.dataset.authTab === mode;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const fields = {
    name: form.elements.name,
    email: form.elements.email,
    cpf: form.elements.cpf,
    password: form.elements.password,
    passwordConfirm: form.elements.passwordConfirm
  };
  const email = fields.email.value.trim().toLowerCase();
  const cpf = fields.cpf.value.replace(/\D/g, "");
  const password = fields.password.value;
  const rules = [
    [fields.name, fields.name.value.trim().length >= 3, "Informe seu nome completo."],
    [fields.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Digite um email válido."],
    [fields.cpf, cpf.length === 11, "Informe um CPF com 11 numeros."],
    [fields.password, password.length >= 6, "A senha precisa ter pelo menos 6 caracteres."],
    [fields.passwordConfirm, fields.passwordConfirm.value === password, "As senhas não coincidem."]
  ];

  if (!validateRules(rules)) return;
  if (state.users.some((user) => user.email === email)) {
    showFieldError(fields.email, "Este email já possui cadastro.");
    return;
  }

  const user = {
    name: fields.name.value.trim(),
    email,
    cpf,
    password,
    role: "cliente",
    since: new Date().toLocaleDateString("pt-BR"),
    matricula: generateMatricula(),
    projectId: null
  };
  state.users.push(user);
  localStorage.setItem(storageKeys.users, JSON.stringify(state.users));
  form.reset();
  setAuthMode("login");
  document.querySelector("#loginEmail").value = email;
  showToast("Cadastro realizado! Faça login para continuar.");
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const emailInput = document.querySelector("#loginEmail");
  const passwordInput = document.querySelector("#loginPassword");
  const rememberInput = document.querySelector("#rememberLogin");
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  const rules = [
    [emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), "Digite um email válido."],
    [passwordInput, password.length >= 6, "A senha precisa ter 6 caracteres."]
  ];

  if (!validateRules(rules)) return;

  const user = state.users.find((item) => item.email === email && item.password === password);
  if (!user) {
    showFieldError(passwordInput, "Credenciais inválidas.");
    showToast("Acesso não encontrado. Verifique email e senha.");
    return;
  }

  if (rememberInput.checked) {
    localStorage.setItem("buildhub_remembered_email", email);
  } else {
    localStorage.removeItem("buildhub_remembered_email");
  }

  localStorage.setItem(storageKeys.session, JSON.stringify({ email: user.email, role: user.role, name: user.name }));
  showToast(`Bem-vindo, ${user.name}.`);

  if (pageType === "login") {
    const dashboardPage = user.role === "admin" ? "admin.html" : "cliente.html";
    setTimeout(() => { window.location.href = dashboardPage; }, 500);
    return;
  }

  if (selectors.dashboard) showDashboard(user);
}

function validateRules(rules) {
  let valid = true;
  rules.forEach(([field, condition, message]) => {
    const row = field.closest(".form-row");
    row.classList.toggle("error", !condition);
    row.querySelector("small").textContent = condition ? "" : message;
    if (!condition) valid = false;
  });
  return valid;
}

function showFieldError(field, message) {
  const row = field.closest(".form-row");
  row.classList.add("error");
  row.querySelector("small").textContent = message;
}

function bindDashboard() {
  selectors.logoutButton?.addEventListener("click", () => {
    localStorage.removeItem(storageKeys.session);
    if (selectors.dashboard) selectors.dashboard.hidden = true;
    showToast("Sessão encerrada.");
    setTimeout(() => {
      window.location.href = pageType === "home" ? "#login" : "login.html";
    }, 500);
  });
}

// Localiza o usuario da sessao atual para os paineis do cliente.
function getLoggedUser() {
  const session = JSON.parse(localStorage.getItem(storageKeys.session) || "null");
  return state.users.find((user) => user.email === session?.email) || null;
}

function restoreSession() {
  const session = JSON.parse(localStorage.getItem(storageKeys.session) || "null");
  if (!session) {
    protectDashboardPage();
    return;
  }

  const user = state.users.find((item) => item.email === session.email);
  if (!user) {
    localStorage.removeItem(storageKeys.session);
    protectDashboardPage();
    return;
  }

  if (pageType === "admin" && user.role !== "admin") {
    window.location.href = "cliente.html";
    return;
  }

  if (pageType === "cliente" && user.role !== "cliente") {
    window.location.href = "admin.html";
    return;
  }

  if (selectors.dashboard) showDashboard(user, false);
}

function protectDashboardPage() {
  if (pageType === "admin" || pageType === "cliente") {
    window.location.href = "login.html";
  }
}

function showDashboard(user, scroll = true) {
  if (!selectors.dashboard) return;
  selectors.dashboard.hidden = false;
  selectors.dashboard.dataset.role = user.role;
  selectors.dashboardRole.textContent = user.role === "admin" ? "Nível ADMIN" : "ível CLIENTE";
  selectors.dashboardTitle.textContent = user.role === "admin" ? "Painel administrativo" : "Área do cliente";
  renderDashboardMenu(user.role);
  renderCurrentDashboard("overview");
  if (scroll) selectors.dashboard.scrollIntoView({ behavior: "smooth" });
}

function renderDashboardMenu(role) {
  const adminItems = [
    ["overview", "Visão geral"],
    ["clients", "Clientes"],
    ["projects", "Projetos"],
    ["chat", "Mensagens"],
    ["account", "Minha conta"]
  ];
  const clientItems = [
    ["overview", "Andamento"],
    ["newProject", "Cadastrar projeto"],
    ["messages", "Mensagens"],
    ["account", "Minha conta"]
  ];
  const items = role === "admin" ? adminItems : clientItems;

  selectors.dashboardMenu.innerHTML = items.map(([id, label], index) => (
    `<button class="${index === 0 ? "active" : ""}" type="button" data-panel="${id}">${label}</button>`
  )).join("");

  selectors.dashboardMenu.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      selectors.dashboardMenu.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderCurrentDashboard(button.dataset.panel);
    });
  });
}

function renderCurrentDashboard(panel = "overview") {
  if (selectors.dashboard.hidden) return;
  const role = selectors.dashboard.dataset.role;
  if (role === "admin") renderAdminDashboard(panel);
  if (role === "cliente") renderClientDashboard(panel);
}

function renderAdminDashboard(panel) {
  const admin = getLoggedUser();
  if (panel === "clients") return renderAdminClients();
  if (panel === "projects") return renderAdminProjects();
  if (panel === "chat") return renderAdminChat(Number(selectors.dashboardContent.dataset.chatId), admin);
  if (panel === "account") return renderAccount(admin, true);

  const clients = state.users.filter((user) => user.role === "cliente").length;
  const average = state.clientProjects.length ? Math.round(state.clientProjects.reduce((sum, project) => sum + Number(project.progress || 0), 0) / state.clientProjects.length) : 0;
  selectors.dashboardContent.innerHTML = `
    <div class="stats-grid">
      <article class="stat-card"><span>Total de clientes</span><strong>${clients}</strong></article>
      <article class="stat-card"><span>Projetos em andamento</span><strong>${state.clientProjects.length}</strong></article>
      <article class="stat-card"><span>Progresso médio</span><strong>${average}%</strong></article>
      <article class="stat-card"><span>Atendimentos abertos</span><strong>${state.chats.filter((chat) => chat.status === "aberto").length}</strong></article>
    </div>
    <article class="dashboard-panel"><h3>Andamento dos projetos</h3>
      ${state.clientProjects.length ? state.clientProjects.map((project) => `<p><strong>${escapeHTML(project.name)}</strong> — ${project.progress}%</p><div class="progress-track"><span style="width: 0%" data-progress="${project.progress}%"></span></div>`).join("") : "<p>Nenhum projeto de cliente cadastrado ainda.</p>"}
    </article>`;
  requestAnimationFrame(() => document.querySelectorAll("[data-progress]").forEach((bar) => { bar.style.width = bar.dataset.progress; }));
}

function renderClientDashboard(panel) {
  const user = getLoggedUser();
  if (panel === "newProject") return renderNewProject(user);
  if (panel === "messages") return renderClientChats(user);
  if (panel === "account") return renderAccount(user, false);
  const project = getClientProject(user);
  if (!project) {
    selectors.dashboardContent.innerHTML = `<article class="dashboard-panel"><h3>Seu projeto</h3><p>Você ainda não cadastrou um projeto.</p><button class="btn btn-primary" id="goToNewProject" type="button">Cadastrar projeto</button></article>`;
    document.querySelector("#goToNewProject").addEventListener("click", () => selectDashboardPanel("newProject"));
    return;
  }
  selectors.dashboardContent.innerHTML = `<div class="stats-grid"><article class="stat-card"><span>Cliente</span><strong>${escapeHTML(user.name)}</strong></article><article class="stat-card"><span>Projeto</span><strong>${escapeHTML(project.name)}</strong></article><article class="stat-card"><span>Progresso</span><strong>${project.progress}%</strong></article></div><article class="dashboard-panel"><h3>Andamento geral</h3><div class="progress-track"><span style="width: 0%" data-progress="${project.progress}%"></span></div><p>${escapeHTML(project.missing || "Nenhuma pendência informada.")}</p><ul class="mini-list">${project.stages.map((stage) => `<li><span>${escapeHTML(stage.label)}</span><strong>${formatStageStatus(stage.status)}</strong></li>`).join("")}</ul><p><strong>Arquivos:</strong> ${project.files.length ? project.files.map(escapeHTML).join(", ") : "Nenhum"}</p><p><strong>Fotos:</strong> ${project.photos.length ? project.photos.map(escapeHTML).join(", ") : "Nenhuma"}</p></article>`;
  requestAnimationFrame(() => { const bar = document.querySelector("[data-progress]"); if (bar) bar.style.width = bar.dataset.progress; });
}

function selectDashboardPanel(panel) {
  selectors.dashboardMenu.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.panel === panel));
  renderCurrentDashboard(panel);
}

function generateMatricula() {
  const highest = state.users.reduce((max, user) => Math.max(max, Number(String(user.matricula || "").replace(/\D/g, "")) || 0), 0);
  return `BH-${String(highest + 1).padStart(4, "0")}`;
}

function getClientProject(user) {
  if (!user) return null;
  return state.clientProjects.find((project) => project.id === user.projectId || project.clientEmail === user.email) || null;
}

function persistUsers() { localStorage.setItem(storageKeys.users, JSON.stringify(state.users)); }
function persistClientProjects() { localStorage.setItem(storageKeys.clientProjects, JSON.stringify(state.clientProjects)); }
function persistActivationKeys() { localStorage.setItem(storageKeys.activationKeys, JSON.stringify(state.activationKeys)); }
function persistChats() { localStorage.setItem(storageKeys.chats, JSON.stringify(state.chats)); }
function formatStageStatus(status) { return ({ pendente: "Pendente", "em-andamento": "Em andamento", concluido: "Concluído" })[status] || "Pendente"; }
function defaultStages() { return ["Planejamento", "Design", "Desenvolvimento", "Testes", "Entrega"].map((label) => ({ id: label.toLowerCase(), label, status: "pendente" })); }

function renderAdminClients() {
  const users = state.users;
  selectors.dashboardContent.innerHTML = `<article class="dashboard-panel"><h3>Usuários do BuildHub</h3><div class="form-row"><label for="clientSearch">Pesquisar por nome, e-mail ou matrícula</label><input id="clientSearch" type="search" placeholder="Pesquisar usuário"></div><ul class="mini-list" id="usersList">${users.map((user, index) => `<li data-user-row="${escapeHTML(user.email)}"><span><strong>${escapeHTML(user.name)}</strong><br>${escapeHTML(user.email)}<br>${escapeHTML(user.matricula)}<br>CPF: ${cpfVisibilityControl(user.cpf, `clientCpf${index}`)}</span><span><select data-role-email="${escapeHTML(user.email)}"><option value="cliente" ${user.role === "cliente" ? "selected" : ""}>Cliente</option><option value="admin" ${user.role === "admin" ? "selected" : ""}>Administrador</option></select><button class="mini-btn" type="button" data-key-email="${escapeHTML(user.email)}">Gerar chave de projeto</button><button class="mini-btn" type="button" data-password-email="${escapeHTML(user.email)}">Trocar senha</button>${user.role === "cliente" ? `<button class="mini-btn danger" type="button" data-delete-client="${escapeHTML(user.email)}">Excluir cliente</button>` : ""}</span></li>`).join("")}</ul></article>`;
  bindCpfToggles();
  document.querySelector("#clientSearch").addEventListener("input", (event) => {
    const term = event.target.value.toLowerCase();
    document.querySelectorAll("[data-user-row]").forEach((row) => { row.hidden = !row.textContent.toLowerCase().includes(term); });
  });
  document.querySelectorAll("[data-role-email]").forEach((select) => select.addEventListener("change", () => {
    state.users = state.users.map((user) => user.email === select.dataset.roleEmail ? { ...user, role: select.value } : user);
    persistUsers(); showToast("Nível de acesso atualizado.");
  }));
  document.querySelectorAll("[data-key-email]").forEach((button) => button.addEventListener("click", () => {
    const key = Array.from({ length: 8 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");
    state.activationKeys.push({ key, clientEmail: button.dataset.keyEmail, used: false, createdAt: new Date().toLocaleString("pt-BR") });
    persistActivationKeys(); showToast(`Chave gerada para ${button.dataset.keyEmail}: ${key}`);
  }));
  document.querySelectorAll("[data-password-email]").forEach((button) => button.addEventListener("click", () => {
    const password = window.prompt("Nova senha (mínimo de 6 caracteres):");
    if (password === null) return;
    if (password.length < 6) return showToast("A senha precisa ter pelo menos 6 caracteres.");
    state.users = state.users.map((user) => user.email === button.dataset.passwordEmail ? { ...user, password } : user);
    persistUsers(); showToast("Senha atualizada com sucesso.");
  }));
  document.querySelectorAll("[data-delete-client]").forEach((button) => button.addEventListener("click", () => {
    const email = button.dataset.deleteClient;
    const client = state.users.find((user) => user.email === email);
    if (!client || client.role !== "cliente") return;
    if (!window.confirm(`Excluir o cliente ${client.name} e todos os dados vinculados?`)) return;
    state.users = state.users.filter((user) => user.email !== email);
    state.clientProjects = state.clientProjects.filter((project) => project.clientEmail !== email);
    state.activationKeys = state.activationKeys.filter((key) => key.clientEmail !== email);
    state.chats = state.chats.filter((chat) => chat.clientEmail !== email);
    persistUsers(); persistClientProjects(); persistActivationKeys(); persistChats();
    showToast("Cliente excluído."); renderAdminClients();
  }));
}

function renderAdminProjects() {
  selectors.dashboardContent.innerHTML = `<div class="admin-projects">${state.clientProjects.length ? state.clientProjects.map((project) => { const client = state.users.find((user) => user.email === project.clientEmail); return `<article class="dashboard-panel"><span class="project-category">${escapeHTML(client?.name || project.clientEmail)}</span><h3>${escapeHTML(project.name)}</h3><p>${project.progress}% concluído</p><div class="progress-track"><span style="width:${project.progress}%"></span></div><button class="mini-btn" type="button" data-edit-project="${project.id}">Alterar projeto</button></article>`; }).join("") : "<article class=\"dashboard-panel\"><p>Nenhum projeto cadastrado ainda.</p></article>"}</div>`;
  document.querySelectorAll("[data-edit-project]").forEach((button) => button.addEventListener("click", () => renderProjectEditor(Number(button.dataset.editProject))));
}

function renderProjectEditor(id) {
  const project = state.clientProjects.find((item) => item.id === id);
  if (!project) return renderAdminProjects();
  selectors.dashboardContent.innerHTML = `<article class="dashboard-panel"><h3>Alterar projeto: ${escapeHTML(project.name)}</h3><div class="form-row"><label for="projectProgress">Progresso (%)</label><input id="projectProgress" type="number" min="0" max="100" value="${project.progress}"></div><div class="form-row"><label for="projectMissing">O que falta para finalizar</label><textarea id="projectMissing" rows="3">${escapeHTML(project.missing || "")}</textarea></div><div class="form-row"><label for="projectFile">Adicionar arquivo</label><input id="projectFile" type="text"><button class="mini-btn" id="addProjectFile" type="button">Adicionar arquivo</button></div><p id="filesPreview">${project.files.map(escapeHTML).join(", ") || "Nenhum arquivo"}</p><div class="form-row"><label for="projectPhoto">Adicionar foto</label><input id="projectPhoto" type="text"><button class="mini-btn" id="addProjectPhoto" type="button">Adicionar foto</button></div><p id="photosPreview">${project.photos.map(escapeHTML).join(", ") || "Nenhuma foto"}</p>${project.stages.map((stage) => `<div class="form-row"><label>${escapeHTML(stage.label)}</label><select data-stage="${escapeHTML(stage.id)}"><option value="pendente" ${stage.status === "pendente" ? "selected" : ""}>Pendente</option><option value="em-andamento" ${stage.status === "em-andamento" ? "selected" : ""}>Em andamento</option><option value="concluido" ${stage.status === "concluido" ? "selected" : ""}>Concluído</option></select></div>`).join("")}<button class="btn btn-primary" id="saveProjectChanges" type="button">Salvar alterações</button><button class="mini-btn" id="cancelProjectChanges" type="button">Voltar</button></article>`;
  const addItem = (field, target, preview) => document.querySelector(target).addEventListener("click", () => { const value = document.querySelector(field).value.trim(); if (!value) return; project[preview].push(value); document.querySelector(field).value = ""; document.querySelector(`#${preview}Preview`).textContent = project[preview].join(", "); });
  addItem("#projectFile", "#addProjectFile", "files"); addItem("#projectPhoto", "#addProjectPhoto", "photos");
  document.querySelector("#saveProjectChanges").addEventListener("click", () => { project.progress = Math.max(0, Math.min(100, Number(document.querySelector("#projectProgress").value) || 0)); project.missing = document.querySelector("#projectMissing").value.trim(); project.stages = project.stages.map((stage) => ({ ...stage, status: document.querySelector(`[data-stage="${stage.id}"]`).value })); persistClientProjects(); showToast("Projeto atualizado."); renderAdminProjects(); });
  document.querySelector("#cancelProjectChanges").addEventListener("click", renderAdminProjects);
}

function renderAdminContacts(admin) {
  selectors.dashboardContent.innerHTML = `<article class="dashboard-panel"><h3>Contatos recebidos</h3><ul class="mini-list contacts-list">${state.contacts.length ? state.contacts.map((contact) => {
    const chat = state.chats.find((item) => item.clientEmail === contact.email && item.status === "aberto");
    return `<li class="contact-item"><div><strong>${escapeHTML(contact.name)}</strong><br>${escapeHTML(contact.email)} | ${escapeHTML(contact.phone)}<br>${escapeHTML(contact.message)}<br><small>${escapeHTML(contact.date)}</small></div>${chat ? `<section class="contact-chat"><div class="chat-messages">${chat.messages.length ? chat.messages.map((message) => `<div class="chat-bubble ${message.senderRole === "admin" ? "sent" : "received"}"><p>${escapeHTML(message.text)}</p><small>${escapeHTML(message.date)}</small></div>`).join("") : "<p class=\"chat-empty\">Envie a primeira resposta para iniciar a conversa.</p>"}</div><form class="chat-composer" data-contact-composer="${chat.id}"><input data-contact-chat-text="${chat.id}" type="text" autocomplete="off" placeholder="Digite uma mensagem"><button class="btn btn-primary" type="submit">Enviar</button></form></section>` : `<button class="mini-btn" type="button" data-contact-chat="${contact.id}">Iniciar bate-papo</button>`}</li>`;
  }).join("") : "<li>Nenhum contato recebido ainda.</li>"}</ul></article>`;
  document.querySelectorAll("[data-contact-chat]").forEach((button) => button.addEventListener("click", () => {
    const contact = state.contacts.find((item) => item.id === Number(button.dataset.contactChat));
    if (!contact) return;
    let chat = state.chats.find((item) => item.clientEmail === contact.email && item.status === "aberto");
    if (!chat) { chat = { id: Date.now(), clientEmail: contact.email, adminEmail: admin?.email || null, subject: contact.message, status: "aberto", messages: [], createdAt: new Date().toLocaleString("pt-BR") }; state.chats.unshift(chat); persistChats(); }
    persistChats(); renderAdminContacts(admin);
  }));
  document.querySelectorAll("[data-contact-composer]").forEach((form) => form.addEventListener("submit", (event) => {
    event.preventDefault();
    const chat = state.chats.find((item) => item.id === Number(form.dataset.contactComposer));
    const input = form.querySelector("[data-contact-chat-text]");
    const text = input.value.trim();
    if (!chat || !text) return;
    chat.adminEmail = admin?.email || chat.adminEmail;
    chat.messages.push({ sender: admin?.email || "admin", senderRole: "admin", text, date: new Date().toLocaleString("pt-BR") });
    persistChats(); renderAdminContacts(admin);
  }));
  document.querySelectorAll(".contact-chat .chat-messages").forEach((messages) => { messages.scrollTop = messages.scrollHeight; });
}

function renderAdminChat(id, admin) {
  const chats = state.chats.filter((chat) => chat.adminEmail === admin?.email || !chat.adminEmail);
  const activeId = chats.some((chat) => chat.id === id) ? id : chats[0]?.id;
  renderChatWorkspace(chats, activeId, "admin", admin);
}

function renderNewProject(user) {
  const currentProject = getClientProject(user);
  if (currentProject) { selectors.dashboardContent.innerHTML = `<article class="dashboard-panel"><h3>Projeto em andamento</h3><p>Você já possui o projeto “${escapeHTML(currentProject.name)}” cadastrado.</p></article>`; return; }
  selectors.dashboardContent.innerHTML = `<article class="dashboard-panel"><h3>Cadastrar projeto</h3><div class="form-row"><label for="activationKey">Chave de ativação</label><input id="activationKey" type="text" maxlength="8" placeholder="Ex.: X7F3K9QZ"><small></small></div><button class="mini-btn" id="validateActivationKey" type="button">Validar chave</button><div id="newProjectFields" hidden><div class="form-row"><label for="newProjectName">Nome do projeto</label><input id="newProjectName" type="text"></div><div class="form-row"><label for="newProjectWhat">O que o projeto vai fazer</label><textarea id="newProjectWhat" rows="3"></textarea></div><div class="form-row"><label for="newProjectHow">Como você imagina o projeto</label><textarea id="newProjectHow" rows="3"></textarea></div><div class="form-row"><label for="newProjectCnpj">CNPJ (opcional)</label><input id="newProjectCnpj" type="text"></div><div class="form-row"><label for="newProjectPhone">Telefone</label><input id="newProjectPhone" type="text"></div><button class="btn btn-primary" id="createClientProject" type="button">Cadastrar projeto</button></div></article>`;
  let activation = null;
  document.querySelector("#newProjectCnpj").addEventListener("input", (event) => { event.target.value = formatCnpj(event.target.value); });
  document.querySelector("#newProjectPhone").addEventListener("input", (event) => { event.target.value = formatPhone(event.target.value); });
  document.querySelector("#validateActivationKey").addEventListener("click", () => { activation = state.activationKeys.find((item) => item.key === document.querySelector("#activationKey").value.trim().toUpperCase() && item.clientEmail === user.email && !item.used); if (!activation) return showToast("Chave inválida, já utilizada ou não vinculada à sua conta."); document.querySelector("#newProjectFields").hidden = false; showToast("Chave validada. Preencha os dados do projeto."); });
  document.querySelector("#createClientProject").addEventListener("click", () => { const name = document.querySelector("#newProjectName").value.trim(); const whatItDoes = document.querySelector("#newProjectWhat").value.trim(); const howTheyWantIt = document.querySelector("#newProjectHow").value.trim(); const phone = document.querySelector("#newProjectPhone").value.trim(); if (!activation || !name || !whatItDoes || !howTheyWantIt || !phone) return showToast("Preencha todos os campos obrigatórios."); const project = { id: Date.now(), clientEmail: user.email, name, whatItDoes, howTheyWantIt, cnpj: document.querySelector("#newProjectCnpj").value.trim(), phone, progress: 0, missing: "", files: [], photos: [], stages: defaultStages(), createdAt: new Date().toLocaleString("pt-BR") }; state.clientProjects.push(project); activation.used = true; state.users = state.users.map((item) => item.email === user.email ? { ...item, projectId: project.id } : item); persistClientProjects(); persistActivationKeys(); persistUsers(); showToast("Projeto cadastrado com sucesso."); selectDashboardPanel("overview"); });
}

function renderClientChats(user, activeId) {
  const chats = state.chats.filter((chat) => chat.clientEmail === user?.email);
  renderChatWorkspace(chats, chats.some((chat) => chat.id === activeId) ? activeId : chats[0]?.id, "cliente", user);
}

function renderChatWorkspace(chats, activeId, role, user) {
  const activeChat = chats.find((chat) => chat.id === activeId);
  const isAdmin = role === "admin";
  const chatName = (chat) => {
    const email = isAdmin ? chat.clientEmail : (chat.adminEmail || "Equipe BuildHub");
    return state.users.find((item) => item.email === email)?.name || email;
  };
  const lastMessage = (chat) => chat.messages[chat.messages.length - 1];
  selectors.dashboardContent.innerHTML = `<section class="chat-workspace dashboard-panel"><aside class="chat-list"><div class="chat-list-heading"><h3>Mensagens</h3>${!isAdmin ? "<button class=\"mini-btn\" id=\"startChat\" type=\"button\">Novo atendimento</button>" : ""}</div>${chats.length ? chats.map((chat) => { const last = lastMessage(chat); return `<button class="chat-list-item ${chat.id === activeId ? "active" : ""}" data-open-chat="${chat.id}" type="button"><strong>${escapeHTML(chatName(chat))}</strong><span>${escapeHTML(last?.text || chat.subject)}</span><small>${escapeHTML(last?.date || chat.createdAt)}</small></button>`; }).join("") : "<p class=\"chat-empty\">Nenhuma conversa iniciada.</p>"}</aside><div class="chat-window">${activeChat ? `<header class="chat-header"><div><strong>${escapeHTML(chatName(activeChat))}</strong><span>${escapeHTML(activeChat.subject)}</span></div>${!isAdmin ? `<button class="mini-btn danger" id="deleteChat" type="button">Excluir conversa</button>` : ""}</header><div class="chat-messages" id="chatMessages">${activeChat.messages.length ? activeChat.messages.map((message) => `<div class="chat-bubble ${message.senderRole === role ? "sent" : "received"}"><p>${escapeHTML(message.text)}</p><small>${escapeHTML(message.date)}</small></div>`).join("") : "<p class=\"chat-empty\">Envie uma mensagem para iniciar a conversa.</p>"}</div>${activeChat.status === "aberto" ? `<form class="chat-composer" id="chatComposer"><input id="chatText" type="text" autocomplete="off" placeholder="Digite uma mensagem"><button class="btn btn-primary" type="submit">Enviar</button></form>` : "<p class=\"chat-empty\">Atendimento encerrado.</p>"}` : `<div class="chat-empty chat-welcome"><h3>Selecione uma conversa</h3><p>${isAdmin ? "Abra um contato para iniciar um bate-papo." : "Inicie um novo atendimento para falar com a equipe."}</p></div>`}</div></section>`;
  document.querySelectorAll("[data-open-chat]").forEach((button) => button.addEventListener("click", () => isAdmin ? renderAdminChat(Number(button.dataset.openChat), user) : renderClientChats(user, Number(button.dataset.openChat))));
  document.querySelector("#startChat")?.addEventListener("click", () => { const subject = window.prompt("Assunto do atendimento:", "Dúvida geral"); if (subject === null) return; const chat = { id: Date.now(), clientEmail: user.email, adminEmail: null, subject: subject.trim() || "Dúvida geral", status: "aberto", messages: [], createdAt: new Date().toLocaleString("pt-BR") }; state.chats.unshift(chat); persistChats(); renderClientChats(user, chat.id); });
  document.querySelector("#deleteChat")?.addEventListener("click", () => { if (!window.confirm("Excluir esta conversa?")) return; state.chats = state.chats.filter((chat) => chat.id !== activeChat.id); persistChats(); showToast("Conversa excluída."); renderClientChats(user); });
  document.querySelector("#chatComposer")?.addEventListener("submit", (event) => { event.preventDefault(); const text = document.querySelector("#chatText").value.trim(); if (!text) return; activeChat.adminEmail = isAdmin ? user.email : activeChat.adminEmail; activeChat.messages.push({ sender: user.email, senderRole: role, text, date: new Date().toLocaleString("pt-BR") }); persistChats(); isAdmin ? renderAdminChat(activeChat.id, user) : renderClientChats(user, activeChat.id); });
  const messages = document.querySelector("#chatMessages");
  if (messages) messages.scrollTop = messages.scrollHeight;
}

function renderAccount(user, isAdmin) {
  if (!user) return;
  selectors.dashboardContent.innerHTML = `<article class="dashboard-panel"><h3>Minha conta</h3><ul class="mini-list"><li><span>Nome</span><strong>${escapeHTML(user.name)}</strong></li><li><span>E-mail</span><strong>${escapeHTML(user.email)}</strong></li><li><span>Matrícula</span><strong>${escapeHTML(user.matricula || "-")}</strong></li><li><span>CPF</span>${cpfVisibilityControl(user.cpf, "accountCpf")}</li></ul></article><article class="dashboard-panel password-panel"><div class="password-panel-heading"><span aria-hidden="true">🔒</span><div><h3>Alterar senha</h3><p>Digite sua senha atual e a nova senha para confirmar a alteração.</p></div></div><div class="form-row" id="currentPasswordRow"><label for="currentPassword">Senha atual</label><div class="password-control"><input id="currentPassword" type="password"><button data-toggle-account-password="currentPassword" type="button" aria-label="Mostrar senha">👁</button></div></div><div class="form-row"><label for="newPassword">Nova senha</label><div class="password-control"><input id="newPassword" type="password"><button data-toggle-account-password="newPassword" type="button" aria-label="Mostrar senha">👁</button></div><div class="password-strength"><span id="passwordStrengthBar"></span></div><small id="passwordStrengthText">Use ao menos 6 caracteres.</small></div>${isAdmin ? "<button class=\"mini-btn\" id=\"forgotCurrentPassword\" type=\"button\">Esqueci minha senha atual</button>" : ""}<button class="btn btn-primary" id="saveAccountPassword" type="button">Salvar nova senha</button>${!isAdmin ? "<button class=\"mini-btn\" id=\"forgotClientPassword\" type=\"button\">Esqueci minha senha</button>" : ""}</article>`;
  bindCpfToggles();
  let skipCurrentPassword = false;
  document.querySelectorAll("[data-toggle-account-password]").forEach((button) => button.addEventListener("click", () => { const input = document.querySelector(`#${button.dataset.toggleAccountPassword}`); input.type = input.type === "password" ? "text" : "password"; button.textContent = input.type === "password" ? "👁" : "🙈"; }));
  document.querySelector("#newPassword").addEventListener("input", (event) => { const value = event.target.value; const score = (value.length >= 6) + (value.length >= 10) + /[A-Z]/.test(value) + /\d/.test(value) + /[^A-Za-z0-9]/.test(value); const bar = document.querySelector("#passwordStrengthBar"); const labels = ["Muito fraca", "Fraca", "Razoável", "Boa", "Forte", "Muito forte"]; bar.style.width = `${score * 20}%`; bar.dataset.strength = score >= 4 ? "strong" : score >= 2 ? "medium" : "weak"; document.querySelector("#passwordStrengthText").textContent = value ? `Força da senha: ${labels[score]}` : "Use ao menos 6 caracteres."; });
  document.querySelector("#forgotCurrentPassword")?.addEventListener("click", () => { skipCurrentPassword = true; document.querySelector("#currentPasswordRow").hidden = true; showToast("Informe apenas a nova senha."); });
  document.querySelector("#saveAccountPassword").addEventListener("click", () => { const current = document.querySelector("#currentPassword").value; const next = document.querySelector("#newPassword").value; if (next.length < 6) return showToast("A nova senha precisa ter pelo menos 6 caracteres."); if (!skipCurrentPassword && current !== user.password) return showToast("Senha atual incorreta."); state.users = state.users.map((item) => item.email === user.email ? { ...item, password: next } : item); persistUsers(); showToast("Senha atualizada com sucesso."); });
  document.querySelector("#forgotClientPassword")?.addEventListener("click", () => { state.chats.unshift({ id: Date.now(), clientEmail: user.email, adminEmail: null, subject: "Recuperação de senha", status: "aberto", messages: [], createdAt: new Date().toLocaleString("pt-BR") }); persistChats(); selectDashboardPanel("messages"); });
}

function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.matches("[data-preview-metric]")) animatePreviewMetric(entry.target);
        else if (entry.target.matches("[data-preview-chart]")) entry.target.classList.add("is-animated");
        else entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".reveal:not(.visible)").forEach((element) => observer.observe(element));
  document.querySelectorAll("[data-preview-metric]:not(.is-animated), [data-preview-chart]:not(.is-animated)").forEach((element) => observer.observe(element));
}

function initCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  document.addEventListener("mousemove", (event) => {
    selectors.cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  });

  document.querySelectorAll("a, button, input, textarea").forEach((element) => {
    element.addEventListener("mouseenter", () => selectors.cursor.classList.add("active"));
    element.addEventListener("mouseleave", () => selectors.cursor.classList.remove("active"));
  });
}

function showToast(message) {
  if (!selectors.toast) return;
  selectors.toast.textContent = message;
  selectors.toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => selectors.toast.classList.remove("show"), 3200);
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
