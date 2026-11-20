/**
 * 简历打印与展示页面交互
 */
document.addEventListener("DOMContentLoaded", () => {
  const data = DataManager.getData();
  const profile = data.profile;

  // 1. 填充个人头部
  document.getElementById("cv-name").textContent = profile.name || "赵铖城";
  document.getElementById("cv-target").textContent = `求职意向：${profile.title || "AI 产品经理实习生"}`;
  document.getElementById("cv-phone").textContent = profile.phone || "";
  document.getElementById("cv-email").textContent = profile.email || "";
  if (profile.avatar) {
    document.getElementById("cv-avatar").src = profile.avatar;
  }

  // 2. 教育背景
  const eduContainer = document.getElementById("cv-education-list");
  eduContainer.innerHTML = (data.education || []).map(edu => `
    <div class="cv-item">
      <div class="cv-item-head">
        <span style="display: flex; align-items: center; gap: 8px;">
          ${edu.logo ? `<img src="${escapeAttr(edu.logo)}" alt="校徽" style="width: 22px; height: 22px; object-fit: contain; vertical-align: middle;">` : ""}
          <span>${escapeHTML(edu.institution)} · ${escapeHTML(edu.degree)}</span>
        </span>
        <span style="font-weight: 500; font-size: 0.88rem;">${escapeHTML(edu.period)}</span>
      </div>
      ${edu.courses ? `<div class="cv-item-sub">主修课程：${escapeHTML(edu.courses)}</div>` : ""}
      ${edu.highlights && edu.highlights.length ? `
        <ul class="cv-bullets">
          ${edu.highlights.map(h => `<li>${escapeHTML(h)}</li>`).join("")}
        </ul>
      ` : ""}
    </div>
  `).join("");

  // 3. 实习与工作经历
  const expContainer = document.getElementById("cv-experience-list");
  expContainer.innerHTML = (data.experience || []).map(exp => `
    <div class="cv-item">
      <div class="cv-item-head">
        <span>${escapeHTML(exp.company)} | ${escapeHTML(exp.role)}</span>
        <span style="font-weight: 500; font-size: 0.88rem;">${escapeHTML(exp.period)}</span>
      </div>
      ${exp.summary ? `<div class="cv-item-sub" style="font-style: italic; color: #555;">${escapeHTML(exp.summary)}</div>` : ""}
      ${exp.responsibilities && exp.responsibilities.length ? `
        <ul class="cv-bullets">
          ${exp.responsibilities.map(r => `<li>${escapeHTML(r)}</li>`).join("")}
        </ul>
      ` : ""}
    </div>
  `).join("");

  // 4. 核心项目
  const projContainer = document.getElementById("cv-projects-list");
  projContainer.innerHTML = (data.projects || []).map(p => `
    <div class="cv-item">
      <div class="cv-item-head">
        <span>${escapeHTML(p.title)}（${escapeHTML(p.role || "负责人")}）</span>
        <span style="font-weight: 500; font-size: 0.88rem;">${escapeHTML(p.period)}</span>
      </div>
      <div class="cv-item-sub" style="color: #444;"><strong>定位与方案：</strong>${escapeHTML(p.solution || p.subtitle || "")}</div>
      <ul class="cv-bullets">
        <li><strong>业务痛点：</strong>${escapeHTML(p.problem || "")}</li>
        <li><strong>量化产出：</strong>${escapeHTML(p.outcome || "")}</li>
      </ul>
    </div>
  `).join("");

  // 5. 技能与资质
  const skillsContainer = document.getElementById("cv-skills-list");
  skillsContainer.innerHTML = (data.skills || []).map(cat => `
    <div style="margin-bottom: 6px;">
      <strong>${escapeHTML(cat.category)}：</strong>
      <span>${(cat.items || []).map(i => escapeHTML(i.name)).join(" | ")}</span>
    </div>
  `).join("");
});

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(str) {
  if (!str) return "";
  return String(str).replace(/"/g, "&quot;");
}
