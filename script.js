// Tema (claro/escuro)
(() => {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if(saved) root.setAttribute("data-theme", saved);
  document.getElementById("themeToggle").addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "light" ? "" : "light";
    if(next) root.setAttribute("data-theme", next);
    else root.removeAttribute("data-theme");
    localStorage.setItem("theme", next);
  });
})();

// Sidebar toggle (mobile) com backdrop e resize-safe
(() => {
  const sidebar = document.getElementById("sidebar");
  const btn = document.getElementById("sidebarToggle");
  const backdrop = document.getElementById("sidebarBackdrop");
  const mq = window.matchMedia("(max-width: 959.98px)");

  function closeDrawer(){
    sidebar.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  function openDrawer(){
    sidebar.classList.add("open");
    document.body.classList.add("no-scroll");
  }

  btn?.addEventListener("click", () => {
    if (!mq.matches) return;  // só age no mobile
    if (sidebar.classList.contains("open")) closeDrawer();
    else openDrawer();
  });

  backdrop?.addEventListener("click", closeDrawer);

  // Fechar ao trocar para desktop
  mq.addEventListener("change", (e) => {
    if (!e.matches) closeDrawer();
  });
})();

// Ano do rodapé
document.getElementById("year").textContent = new Date().getFullYear();

// Carregar e renderizar projetos
const grid = document.getElementById("projectsGrid");
const searchInput = document.getElementById("searchInput");
let allProjects = [];
let activeFilter = "all";

function matchesFilter(p){
  return activeFilter === "all" || (p.category || "").toLowerCase() === activeFilter;
}
function matchesSearch(p, q){
  if(!q) return true;
  const hay = (p.title + " " + (p.stack||"") + " " + (p.description||"")).toLowerCase();
  return hay.includes(q.toLowerCase());
}
function renderProjects(){
  const q = searchInput.value.trim();
  const items = allProjects.filter(p => matchesFilter(p) && matchesSearch(p, q));
  grid.innerHTML = items.map(p => `
    <article class="card project">
      <img class="thumb" src="${p.image || 'assets/placeholder.png'}" alt="Thumb do projeto ${p.title}">
      <div>
        <h3>${p.title}</h3>
        <p class="meta">${p.stack || ''}</p>
        <p>${p.description || ''}</p>
        <div style="display:flex; gap:.5rem; flex-wrap:wrap; margin-top:.5rem">
          ${p.demo ? `<a class="btn sm outline" href="${p.demo}" target="_blank" rel="noopener">Demo</a>` : ''}
          ${p.repo ? `<a class="btn sm outline" href="${p.repo}" target="_blank" rel="noopener">Código</a>` : ''}
        </div>
      </div>
    </article>
  `).join("") || `<p class="meta">Nenhum projeto encontrado com esses filtros.</p>`;
}

async function loadProjects(){
  try{
    const res = await fetch("projects.json", { cache: "no-store" });
    if(!res.ok) throw new Error("Falha ao carregar projects.json");
    allProjects = await res.json();
    renderProjects();
  } catch (e){
    // fallback mínimo para quando abrir pelo file:// sem servidor
    allProjects = [{
      title: "Exemplo — Troque pelo seu projeto",
      category: "web",
      stack: "HTML • CSS • JS",
      description: "Projeto de exemplo. Edite o arquivo projects.json para listar seus projetos reais.",
      demo: "#",
      repo: "https://github.com/lucaslucindo",
      image: "assets/placeholder.png"
    }];
    renderProjects();
  }
}
loadProjects();

// Filtros (botões e links do sidebar)
document.querySelectorAll("[data-filter]").forEach(el => {
  el.addEventListener("click", (ev) => {
    activeFilter = el.getAttribute("data-filter");
    renderProjects();
  });
});
searchInput.addEventListener("input", renderProjects);

// Scroll suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if(id.length > 1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", id);
    }
  });
});

// ===== Modal da foto de perfil =====
(() => {
  const avatar = document.getElementById("avatarImg");
  const modal = document.getElementById("avatarModal");
  const modalImg = document.getElementById("avatarModalImg");
  const closeBtn = document.querySelector(".modal-close");

  if(avatar && modal && modalImg){
    avatar.addEventListener("click", () => {
      modal.style.display = "block";
      modalImg.src = avatar.src;
    });

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
      if(e.target === modal){ modal.style.display = "none"; }
    });
  }
})();