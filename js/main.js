/**
 * 主页面逻辑：数据绑定、作品集筛选与模态弹窗查看
 */
document.addEventListener("DOMContentLoaded", () => {
  const data = DataManager.getData();

  // 1. 渲染头部与个人信息
  renderProfile(data.profile);

  // 2. 渲染教育背景
  renderEducation(data.education);

  // 3. 渲染实习与工作经历
  renderExperience(data.experience);

  // 4. 渲染代表作品
  renderProjects(data.projects, "all");

  // 5. 渲染技能矩阵
  renderSkills(data.skills);

  // 6. 绑定筛选器事件
  setupProjectFilters(data.projects);

  // 7. 绑定模态框交互
  setupModalEvents(data.projects);
});

// 渲染个人基本信息
function renderProfile(profile) {
  if (!profile) return;

  document.getElementById("nav-brand-name").textContent = profile.name || "赵铖城";
  document.getElementById("nav-brand-status").textContent = profile.statusBadge || "🟢 寻找实习";
  
  document.getElementById("hero-name").textContent = `${profile.name} ${profile.nameEn ? `(${profile.nameEn})` : ""}`;
  document.getElementById("hero-subtitle").textContent = profile.subTitle || "";
  
  // 渲染段落
  const bioContainer = document.getElementById("hero-bio");
  bioContainer.innerHTML = (profile.bioParagraphs || [])
    .map(p => `<p>${escapeHTML(p)}</p>`)
    .join("");

  // 元信息
  document.getElementById("meta-location").textContent = profile.location || "深圳 / 广州";
  document.getElementById("meta-phone").textContent = profile.phone || "";
  const emailEl = document.getElementById("meta-email");
  emailEl.textContent = profile.email || "";
  emailEl.href = `mailto:${profile.email || ""}`;

  if (profile.avatar) {
    document.getElementById("hero-avatar-img").src = profile.avatar;
  }

  // 核心指标
  const highlightsContainer = document.getElementById("highlights-container");
  highlightsContainer.innerHTML = (profile.highlights || [])
    .map(h => `
      <div class="highlight-item">
        <span class="highlight-label">${escapeHTML(h.label)}</span>
        <span class="highlight-value">${escapeHTML(h.value)}</span>
      </div>
    `).join("");
}

// 渲染教育经历
function renderEducation(educationList) {
  const container = document.getElementById("education-container");
  if (!container || !educationList) return;

  container.innerHTML = educationList.map(edu => `
    <div class="timeline-card">
      <div class="card-header-row">
        <div>
          <div class="role-title">${escapeHTML(edu.institution)}</div>
          <div class="company-name">${escapeHTML(edu.degree)}</div>
        </div>
        <div class="period-badge">${escapeHTML(edu.period)}</div>
      </div>
      ${edu.courses ? `<p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 8px;"><strong>主修/相关课程：</strong>${escapeHTML(edu.courses)}</p>` : ""}
      ${edu.highlights && edu.highlights.length ? `
        <ul class="bullet-points">
          ${edu.highlights.map(h => `<li>${escapeHTML(h)}</li>`).join("")}
        </ul>
      ` : ""}
    </div>
  `).join("");
}

// 渲染工作与实习经历
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

// 渲染代表作品
function renderProjects(projects, activeCategory) {
  const container = document.getElementById("projects-container");
  if (!container || !projects) return;

  const filtered = activeCategory === "all" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  container.innerHTML = filtered.map(proj => `
    <div class="project-card" data-project-id="${proj.id}">
      <div class="project-card-header">
        <div class="project-title">${escapeHTML(proj.title)}</div>
        <div class="project-subtitle">${escapeHTML(proj.subtitle || "")}</div>
        <div class="project-tags">
          ${(proj.tags || []).map(t => `<span class="project-tag">${escapeHTML(t)}</span>`).join("")}
        </div>
      </div>
      <div class="project-body">
        <p style="font-size: 0.88rem; margin-bottom: 6px;"><strong>业务难点：</strong>${escapeHTML(proj.problem || "")}</p>
        <p style="font-size: 0.88rem;"><strong>核心方案：</strong>${escapeHTML((proj.solution || "").slice(0, 85))}...</p>
      </div>
      <div class="project-footer">
        <span style="color: var(--text-muted); font-size: 0.78rem;">${escapeHTML(proj.period || "")}</span>
        <span class="detail-link">深入复盘 & 方案详情 &rarr;</span>
      </div>
    </div>
  `).join("");
}

// 渲染技能列表
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

// 设置项目筛选切换事件
function setupProjectFilters(allProjects) {
  const filterBtns = document.querySelectorAll(".filter-tabs .tab-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-filter");
      renderProjects(allProjects, category);
    });
  });
}

// 设置模态弹窗
function setupModalEvents(allProjects) {
  const modal = document.getElementById("project-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const modalContent = document.getElementById("modal-content");

  // 点击卡片打开详情
  document.getElementById("projects-container").addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");
    if (!card) return;
    const projId = card.getAttribute("data-project-id");
    const proj = allProjects.find(p => p.id === projId);
    if (!proj) return;

    modalContent.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span class="tag-badge" style="margin-bottom: 8px;">${escapeHTML(proj.category.toUpperCase())}</span>
        <h2 style="font-size: 1.6rem; margin-bottom: 6px;">${escapeHTML(proj.title)}</h2>
        <div style="color: var(--text-muted); font-size: 0.9rem;">${escapeHTML(proj.subtitle || "")}</div>
        <div style="font-size: 0.85rem; color: var(--accent-color); margin-top: 4px; font-weight: 500;">
          角色职责: ${escapeHTML(proj.role || "项目负责人")} · 时间: ${escapeHTML(proj.period || "")}
        </div>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px;">
        ${(proj.tags || []).map(t => `<span class="project-tag" style="font-size: 0.8rem;">${escapeHTML(t)}</span>`).join("")}
      </div>

      <div style="display: flex; flex-direction: column; gap: 16px; line-height: 1.65; font-size: 0.95rem;">
        <div style="background: var(--bg-subtle); padding: 14px 18px; border-radius: var(--radius-sm); border-left: 3px solid #DC2626;">
          <strong style="color: #991B1B; display: block; margin-bottom: 4px;">🎯 业务痛点与技术挑战 (Problem)</strong>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">${escapeHTML(proj.problem || "")}</p>
        </div>

        <div style="background: var(--bg-subtle); padding: 14px 18px; border-radius: var(--radius-sm); border-left: 3px solid var(--accent-color);">
          <strong style="color: var(--accent-color); display: block; margin-bottom: 4px;">💡 核心产品/工程解决方案 (Solution)</strong>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">${escapeHTML(proj.solution || "")}</p>
        </div>

        <div style="background: var(--bg-subtle); padding: 14px 18px; border-radius: var(--radius-sm); border-left: 3px solid #16A34A;">
          <strong style="color: #166534; display: block; margin-bottom: 4px;">📈 关键指标与可衡量产出 (Outcome & Metric)</strong>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">${escapeHTML(proj.outcome || "")}</p>
        </div>
      </div>
    `;

    modal.classList.add("active");
  });

  // 关闭模态
  closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.classList.remove("active");
  });
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
