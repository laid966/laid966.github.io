/**
 * 主页面逻辑：数据渲染、主题切换、入场动画、作品筛选与模态弹窗
 * UI 设计语言参考 umutxyp/Personal-Website (once-ui)
 */
document.addEventListener("DOMContentLoaded", () => {
  const data = DataManager.getData();

  renderProfile(data.profile);
  renderEducation(data.education);
  renderExperience(data.experience);
  renderProjects(data.projects, "all");
  renderSkills(data.skills);
  setupProjectFilters(data.projects);
  setupModalEvents(data.projects);
  setupThemeToggle();
  setupRevealAnimations();
});

/* ---------- 个人信息 ---------- */
function renderProfile(profile) {
  if (!profile) return;

  document.getElementById("nav-brand-name").textContent = profile.name || "赵铖城";
  if (profile.avatar) {
    document.getElementById("header-avatar").src = profile.avatar;
    const btnAvatar = document.querySelector("#cta-resume .btn-avatar");
    if (btnAvatar) btnAvatar.src = profile.avatar;
  }

  document.getElementById("hero-badge").textContent = profile.statusBadge || "🟢 寻找实习";
  document.getElementById("hero-name").textContent =
    `${profile.name || ""}${profile.nameEn ? ` ${profile.nameEn}` : ""}`;
  document.getElementById("hero-subline").textContent = profile.subTitle || "";

  document.getElementById("hero-bio").innerHTML = (profile.bioParagraphs || [])
    .map(p => `<p>${escapeHTML(p)}</p>`).join("");

  document.getElementById("hero-meta").innerHTML = `
    <span class="meta-pill">📍 ${escapeHTML(profile.location || "")}</span>
    <span class="meta-pill">🎓 ${escapeHTML((profile.highlights && profile.highlights[0]) ? profile.highlights[0].value : "")}</span>
    <span class="meta-pill">✉️ <a href="mailto:${escapeAttr(profile.email)}">${escapeHTML(profile.email || "")}</a></span>
    <span class="meta-pill">📱 ${escapeHTML(profile.phone || "")}</span>
  `;

  const emailCta = document.getElementById("cta-email");
  emailCta.href = `mailto:${profile.email || ""}`;

  document.getElementById("contact-phone").textContent = profile.phone || "";
  const contactEmail = document.getElementById("contact-email");
  contactEmail.textContent = profile.email || "";
  contactEmail.href = `mailto:${profile.email || ""}`;
  document.getElementById("contact-location").textContent = profile.location || "";
  if (profile.github) document.getElementById("contact-github").href = profile.github;

  document.getElementById("highlights-container").innerHTML = (profile.highlights || [])
    .map(h => `
      <div class="highlight-item">
        <div class="highlight-label">${escapeHTML(h.label)}</div>
        <div class="highlight-value">${escapeHTML(h.value)}</div>
      </div>
    `).join("");
}

/* ---------- 教育背景（含官方校徽） ---------- */
function renderEducation(educationList) {
  const container = document.getElementById("education-container");
  if (!container || !educationList) return;

  container.innerHTML = educationList.map(edu => `
    <div class="timeline-card">
      ${edu.logo ? `<div class="edu-logo-chip"><img src="${escapeAttr(edu.logo)}" alt="${escapeAttr(edu.institution)} 校徽"></div>` : ""}
      <div class="card-header-row">
        <div>
          <div class="role-title">${escapeHTML(edu.institution)}</div>
          <div class="company-name">${escapeHTML(edu.degree)}</div>
        </div>
        <div class="period-badge">${escapeHTML(edu.period)}</div>
      </div>
      ${edu.courses ? `<p style="font-size: 0.86rem; color: var(--on-bg-weak); margin-bottom: 10px;"><strong>主修/相关课程：</strong>${escapeHTML(edu.courses)}</p>` : ""}
      ${edu.highlights && edu.highlights.length ? `
        <ul class="bullet-points">
          ${edu.highlights.map(h => `<li>${escapeHTML(h)}</li>`).join("")}
        </ul>
      ` : ""}
    </div>
  `).join("");
}

/* ---------- 实习与工作经历 ---------- */
function renderExperience(expList) {
  const container = document.getElementById("experience-container");
  if (!container || !expList) return;

  container.innerHTML = expList.map(exp => `
    <div class="timeline-card">
      <div class="card-header-row">
        <div>
          <div class="role-title">${escapeHTML(exp.role)}</div>
          <div class="company-name">${escapeHTML(exp.company)}</div>
        </div>
        <div class="period-badge">${escapeHTML(exp.period)}</div>
      </div>
      ${exp.tag ? `<span class="tag-badge">${escapeHTML(exp.tag)}</span>` : ""}
      ${exp.summary ? `<div class="card-summary">${escapeHTML(exp.summary)}</div>` : ""}
      ${exp.responsibilities && exp.responsibilities.length ? `
        <ul class="bullet-points">
          ${exp.responsibilities.map(r => `<li>${escapeHTML(r)}</li>`).join("")}
        </ul>
      ` : ""}
    </div>
  `).join("");
}

/* ---------- 代表作品 ---------- */
function renderProjects(projects, activeCategory) {
  const container = document.getElementById("projects-container");
  if (!container || !projects) return;

  const filtered = activeCategory === "all"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  container.innerHTML = filtered.map(proj => `
    <div class="project-card" data-project-id="${escapeAttr(proj.id)}">
      <div>
        <div class="project-title">${escapeHTML(proj.title)}</div>
        <div class="project-subtitle">${escapeHTML(proj.subtitle || "")}</div>
      </div>
      <div class="project-tags">
        ${(proj.tags || []).map(t => `<span class="project-tag">${escapeHTML(t)}</span>`).join("")}
      </div>
      <div class="project-body">
        <span><strong style="color:var(--accent);">痛点</strong> ${escapeHTML(truncate(proj.problem, 70))}</span>
        <span><strong style="color:var(--brand-strong);">方案</strong> ${escapeHTML(truncate(proj.solution, 70))}</span>
      </div>
      <div class="project-footer">
        <span style="color: var(--on-bg-weak); font-family: var(--font-mono);">${escapeHTML(proj.period || "")}</span>
        <span class="detail-link">深入复盘 →</span>
      </div>
    </div>
  `).join("");
}

/* ---------- 技能 ---------- */
function renderSkills(skillsList) {
  const container = document.getElementById("skills-container");
  if (!container || !skillsList) return;

  container.innerHTML = skillsList.map(cat => `
    <div class="skill-category-card">
      <div class="skill-cat-title">${escapeHTML(cat.category)}</div>
      <div class="skill-list">
        ${(cat.items || []).map(item => `
          <div class="skill-row">
            <span class="skill-name">${escapeHTML(item.name)}</span>
            <span class="skill-level-badge">${escapeHTML(item.level)}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
}

/* ---------- 筛选 ---------- */
function setupProjectFilters(allProjects) {
  const filterBtns = document.querySelectorAll(".filter-tabs .tab-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderProjects(allProjects, btn.getAttribute("data-filter"));
    });
  });
}

/* ---------- 模态弹窗 ---------- */
function setupModalEvents(allProjects) {
  const modal = document.getElementById("project-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const modalContent = document.getElementById("modal-content");

  document.getElementById("projects-container").addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");
    if (!card) return;
    const proj = allProjects.find(p => p.id === card.getAttribute("data-project-id"));
    if (!proj) return;

    modalContent.innerHTML = `
      <div style="margin-bottom: 18px;">
        <span class="tag-badge">${escapeHTML((proj.category || "").toUpperCase())}</span>
        <h2 style="font-size: 1.5rem; letter-spacing: -0.02em; margin-bottom: 6px;">${escapeHTML(proj.title)}</h2>
        <div style="color: var(--on-bg-weak); font-size: 0.9rem;">${escapeHTML(proj.subtitle || "")}</div>
        <div style="font-size: 0.84rem; color: var(--brand-strong); margin-top: 6px; font-weight: 500;">
          ${escapeHTML(proj.role || "")} · ${escapeHTML(proj.period || "")}
        </div>
      </div>
      <div class="project-tags" style="margin-bottom: 18px;">
        ${(proj.tags || []).map(t => `<span class="project-tag">${escapeHTML(t)}</span>`).join("")}
      </div>
      <div style="display: flex; flex-direction: column; gap: 14px; font-size: 0.93rem; color: var(--on-bg-medium); line-height: 1.65;">
        <div style="background: var(--accent-weak); padding: 14px 18px; border-radius: var(--radius-m);">
          <strong style="color: var(--accent); display: block; margin-bottom: 4px;">🎯 业务痛点与技术挑战</strong>
          ${escapeHTML(proj.problem || "")}
        </div>
        <div style="background: var(--brand-weak); padding: 14px 18px; border-radius: var(--radius-m);">
          <strong style="color: var(--brand-strong); display: block; margin-bottom: 4px;">💡 产品 / 工程解决方案</strong>
          ${escapeHTML(proj.solution || "")}
        </div>
        <div style="background: var(--success-weak); padding: 14px 18px; border-radius: var(--radius-m);">
          <strong style="color: var(--success); display: block; margin-bottom: 4px;">📈 关键指标与产出</strong>
          ${escapeHTML(proj.outcome || "")}
        </div>
      </div>
    `;
    modal.classList.add("active");
  });

  closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("active"); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") modal.classList.remove("active"); });
}

/* ---------- 主题切换（light / dark，存 localStorage data-theme） ---------- */
function setupThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  const root = document.documentElement;

  const syncIcon = () => {
    btn.textContent = root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";
  };
  syncIcon();

  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("data-theme", next); } catch (e) {}
    syncIcon();
  });
}

/* ---------- 入场动画（RevealFx 风格） ---------- */
function setupRevealAnimations() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("revealed"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => io.observe(el));
}

/* ---------- 工具 ---------- */
function truncate(str, n) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n) + "…" : str;
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function escapeAttr(str) {
  if (!str) return "";
  return String(str).replace(/"/g, "&quot;");
}
