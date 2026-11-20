/**
 * 后台管理交互：表单双向绑定、动态条目增删、智能解析、数据导入导出
 */
document.addEventListener("DOMContentLoaded", () => {
  const lockScreen = document.getElementById("admin-lock-screen");
  const adminContainer = document.querySelector(".admin-container");

  const startAdmin = () => {
    lockScreen.style.display = "none";
    adminContainer.style.display = "";
    initAdminPanel();
  };

  // 密码门：未解锁时只显示锁屏，禁止任何编辑操作
  if (window.ADMIN_AUTH && !ADMIN_AUTH.isUnlocked()) {
    lockScreen.style.display = "flex";
    adminContainer.style.display = "none";
    const passInput = document.getElementById("admin-pass-input");
    const lockMsg = document.getElementById("admin-lock-msg");
    const tryUnlock = async () => {
      const ok = await ADMIN_AUTH.unlock(passInput.value);
      if (ok) {
        startAdmin();
      } else {
        lockMsg.textContent = "密码错误，请重试（本页仅对站长本人开放）。";
        passInput.value = "";
        passInput.focus();
      }
    };
    document.getElementById("admin-unlock-btn").addEventListener("click", tryUnlock);
    passInput.addEventListener("keydown", (e) => { if (e.key === "Enter") tryUnlock(); });
    return;
  }

  startAdmin();
});

function initAdminPanel() {
  let currentData = DataManager.getData();

  // 初始化标签页切换
  initTabs();

  // 加载数据到表单
  loadFormData(currentData);

  // 绑定保存事件
  document.getElementById("save-all-btn").addEventListener("click", () => {
    saveFormData();
    showAlert("🎉 所有经历已成功保存！已在本地主页与简历中即刻生效。", "success");
  });

  // 绑定新增条目事件
  document.getElementById("add-edu-btn").addEventListener("click", () => {
    addEduEntry();
  });
  document.getElementById("add-exp-btn").addEventListener("click", () => {
    addExpEntry();
  });
  document.getElementById("add-proj-btn").addEventListener("click", () => {
    addProjEntry();
  });

  // 智能解析按钮
  document.getElementById("smart-parse-btn").addEventListener("click", () => {
    const rawText = document.getElementById("import-raw-text").value;
    const parseResult = DataManager.smartParseText(rawText);

    const resultBox = document.getElementById("import-result-box");
    if (!parseResult) {
      resultBox.innerHTML = `<span style="color: #DC2626;">❌ 请先输入或粘贴有效的文本/JSON 内容。</span>`;
      return;
    }

    if (parseResult.type === "json") {
      currentData = parseResult.data;
      loadFormData(currentData);
      resultBox.innerHTML = `<span style="color: #16A34A;">✅ 已成功识别为完整 JSON 配置并载入所有表单！请点击下方“保存”。</span>`;
    } else {
      const extracted = parseResult.data;
      let count = 0;
      if (extracted.profile.name) {
        document.getElementById("prof-name").value = extracted.profile.name;
        count++;
      }
      if (extracted.profile.phone) {
        document.getElementById("prof-phone").value = extracted.profile.phone;
        count++;
      }
      if (extracted.profile.email) {
        document.getElementById("prof-email").value = extracted.profile.email;
        count++;
      }
      if (extracted.education.length > 0) {
        extracted.education.forEach(e => addEduEntry(e));
        count += extracted.education.length;
      }
      if (extracted.experience.length > 0) {
        extracted.experience.forEach(e => addExpEntry(e));
        count += extracted.experience.length;
      }

      resultBox.innerHTML = `
        <div style="background: #DCFCE7; color: #166534; padding: 12px; border-radius: 4px;">
          ✅ <strong>智能解析成功！</strong> 已从文本中抽取出 <strong>${count}</strong> 项字段（含个人基础信息与经历），并追加到对应表单。请检查无误后点击下方保存！
        </div>
      `;
    }
  });

  document.getElementById("clear-import-btn").addEventListener("click", () => {
    document.getElementById("import-raw-text").value = "";
    document.getElementById("import-result-box").innerHTML = "";
  });

  // 导出与备份交互
  document.getElementById("download-json-btn").addEventListener("click", () => {
    saveFormData();
    DataManager.exportJSON();
  });

  document.getElementById("copy-js-btn").addEventListener("click", () => {
    saveFormData();
    const code = DataManager.exportJSCode();
    navigator.clipboard.writeText(code).then(() => {
      showAlert("📋 已成功将 site-data.js 完整代码复制到剪贴板！覆盖对应文件即可永久保存至 GitHub。", "success");
    });
  });

  document.getElementById("reset-default-btn").addEventListener("click", () => {
    if (confirm("确定要恢复到初始内置数据吗？未导出的修改将会丢失。")) {
      currentData = DataManager.resetData();
      loadFormData(currentData);
      showAlert("已成功恢复初始简历数据。", "success");
    }
  });

  // 锁定后台（退出解锁状态）
  document.getElementById("lock-admin-btn").addEventListener("click", () => {
    if (window.ADMIN_AUTH) {
      ADMIN_AUTH.lock();
      location.reload();
    }
  });

  // 生成新密码的哈希配置行
  document.getElementById("gen-hash-btn").addEventListener("click", async () => {
    const newPass = document.getElementById("new-pass-input").value;
    if (!newPass) {
      showAlert("请先输入新密码。", "success");
      return;
    }
    const hash = await ADMIN_AUTH.sha256(newPass);
    document.getElementById("hash-output").value = `codeHash: "${hash}",`;
  });
}

// 标签页切换逻辑
function initTabs() {
  const tabs = document.querySelectorAll(".admin-tab");
  const panels = document.querySelectorAll(".admin-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const targetId = tab.getAttribute("data-target");
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add("active");

      // 如果切换到导出面板，更新代码预览
      if (targetId === "tab-export") {
        document.getElementById("code-preview").value = DataManager.exportJSCode();
      }
    });
  });
}

// 加载数据进表单
function loadFormData(data) {
  const p = data.profile || {};
  document.getElementById("prof-name").value = p.name || "";
  document.getElementById("prof-name-en").value = p.nameEn || "";
  document.getElementById("prof-title").value = p.title || "";
  document.getElementById("prof-status").value = p.statusBadge || "";
  document.getElementById("prof-phone").value = p.phone || "";
  document.getElementById("prof-email").value = p.email || "";
  document.getElementById("prof-location").value = p.location || "";
  document.getElementById("prof-avatar").value = p.avatar || "";
  document.getElementById("prof-subtitle").value = p.subTitle || "";
  document.getElementById("prof-bio").value = (p.bioParagraphs || []).join("\n");

  // 教育背景
  const eduContainer = document.getElementById("edu-entries-list");
  eduContainer.innerHTML = "";
  (data.education || []).forEach(edu => addEduEntry(edu));

  // 实习经历
  const expContainer = document.getElementById("exp-entries-list");
  expContainer.innerHTML = "";
  (data.experience || []).forEach(exp => addExpEntry(exp));

  // 代表作品
  const projContainer = document.getElementById("proj-entries-list");
  projContainer.innerHTML = "";
  (data.projects || []).forEach(proj => addProjEntry(proj));
}

// 收集表单数据并保存
function saveFormData() {
  const oldData = DataManager.getData();

  const profile = {
    ...oldData.profile,
    name: document.getElementById("prof-name").value.trim(),
    nameEn: document.getElementById("prof-name-en").value.trim(),
    title: document.getElementById("prof-title").value.trim(),
    statusBadge: document.getElementById("prof-status").value.trim(),
    phone: document.getElementById("prof-phone").value.trim(),
    email: document.getElementById("prof-email").value.trim(),
    location: document.getElementById("prof-location").value.trim(),
    avatar: document.getElementById("prof-avatar").value.trim(),
    subTitle: document.getElementById("prof-subtitle").value.trim(),
    bioParagraphs: document.getElementById("prof-bio").value.split("\n").filter(l => l.trim())
  };

  // 收集教育背景
  const eduCards = document.querySelectorAll("#edu-entries-list .entry-card");
  const education = Array.from(eduCards).map(card => ({
    id: card.dataset.id || "edu-" + Date.now(),
    institution: card.querySelector(".edu-inst").value.trim(),
    degree: card.querySelector(".edu-deg").value.trim(),
    period: card.querySelector(".edu-per").value.trim(),
    courses: card.querySelector(".edu-crs").value.trim(),
    highlights: card.querySelector(".edu-hl").value.split("\n").filter(l => l.trim())
  }));

  // 收集实习经历
  const expCards = document.querySelectorAll("#exp-entries-list .entry-card");
  const experience = Array.from(expCards).map(card => ({
    id: card.dataset.id || "exp-" + Date.now(),
    company: card.querySelector(".exp-comp").value.trim(),
    role: card.querySelector(".exp-role").value.trim(),
    period: card.querySelector(".exp-per").value.trim(),
    tag: card.querySelector(".exp-tag").value.trim(),
    summary: card.querySelector(".exp-sum").value.trim(),
    responsibilities: card.querySelector(".exp-resp").value.split("\n").filter(l => l.trim())
  }));

  // 收集项目
  const projCards = document.querySelectorAll("#proj-entries-list .entry-card");
  const projects = Array.from(projCards).map(card => ({
    id: card.dataset.id || "proj-" + Date.now(),
    title: card.querySelector(".proj-title").value.trim(),
    category: card.querySelector(".proj-cat").value.trim(),
    subtitle: card.querySelector(".proj-sub").value.trim(),
    period: card.querySelector(".proj-per").value.trim(),
    role: card.querySelector(".proj-role").value.trim(),
    tags: card.querySelector(".proj-tags").value.split(",").map(t => t.trim()).filter(Boolean),
    problem: card.querySelector(".proj-prob").value.trim(),
    solution: card.querySelector(".proj-sol").value.trim(),
    outcome: card.querySelector(".proj-out").value.trim()
  }));

  const newData = {
    ...oldData,
    profile,
    education,
    experience,
    projects
  };

  DataManager.saveData(newData);
  document.getElementById("code-preview").value = DataManager.exportJSCode();
  return newData;
}

// 动态添加教育条目
function addEduEntry(edu = {}) {
  const container = document.getElementById("edu-entries-list");
  const card = document.createElement("div");
  card.className = "entry-card";
  card.dataset.id = edu.id || "edu-" + Date.now();

  card.innerHTML = `
    <button class="entry-delete-btn" onclick="this.closest('.entry-card').remove()">删除本条</button>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">院校名称</label>
        <input type="text" class="form-input edu-inst" value="${escapeAttr(edu.institution || "")}">
      </div>
      <div class="form-group">
        <label class="form-label">专业与学位</label>
        <input type="text" class="form-input edu-deg" value="${escapeAttr(edu.degree || "")}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">起止时间 (例如: 2026.09 - 2028.06)</label>
        <input type="text" class="form-input edu-per" value="${escapeAttr(edu.period || "")}">
      </div>
      <div class="form-group">
        <label class="form-label">主修或核心课程</label>
        <input type="text" class="form-input edu-crs" value="${escapeAttr(edu.courses || "")}">
      </div>
    </div>
    <div class="form-group" style="margin-bottom: 0;">
      <label class="form-label">荣誉与要点 (每行一条)</label>
      <textarea class="form-textarea edu-hl" rows="2">${(edu.highlights || []).join("\n")}</textarea>
    </div>
  `;
  container.appendChild(card);
}

// 动态添加实习条目
function addExpEntry(exp = {}) {
  const container = document.getElementById("exp-entries-list");
  const card = document.createElement("div");
  card.className = "entry-card";
  card.dataset.id = exp.id || "exp-" + Date.now();

  card.innerHTML = `
    <button class="entry-delete-btn" onclick="this.closest('.entry-card').remove()">删除本条</button>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">公司 / 组织名称</label>
        <input type="text" class="form-input exp-comp" value="${escapeAttr(exp.company || "")}">
      </div>
      <div class="form-group">
        <label class="form-label">担任职位 / 角色</label>
        <input type="text" class="form-input exp-role" value="${escapeAttr(exp.role || "")}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">起止时间</label>
        <input type="text" class="form-input exp-per" value="${escapeAttr(exp.period || "")}">
      </div>
      <div class="form-group">
        <label class="form-label">分类标签 (例如: 机器人 / 软硬协同)</label>
        <input type="text" class="form-input exp-tag" value="${escapeAttr(exp.tag || "")}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">职责概述 (一句话总结)</label>
      <input type="text" class="form-input exp-sum" value="${escapeAttr(exp.summary || "")}">
    </div>
    <div class="form-group" style="margin-bottom: 0;">
      <label class="form-label">核心工作要点与量化成果 (STAR 原则，每行一条)</label>
      <textarea class="form-textarea exp-resp" rows="4">${(exp.responsibilities || []).join("\n")}</textarea>
    </div>
  `;
  container.appendChild(card);
}

// 动态添加作品条目
function addProjEntry(proj = {}) {
  const container = document.getElementById("proj-entries-list");
  const card = document.createElement("div");
  card.className = "entry-card";
  card.dataset.id = proj.id || "proj-" + Date.now();

  card.innerHTML = `
    <button class="entry-delete-btn" onclick="this.closest('.entry-card').remove()">删除本条</button>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">项目/作品名称</label>
        <input type="text" class="form-input proj-title" value="${escapeAttr(proj.title || "")}">
      </div>
      <div class="form-group">
        <label class="form-label">所属分类</label>
        <select class="form-select proj-cat">
          <option value="ai-pm" ${proj.category === 'ai-pm' ? 'selected' : ''}>AI 产品 & 大模型评测 (ai-pm)</option>
          <option value="product-design" ${proj.category === 'product-design' ? 'selected' : ''}>UI/UX & 产品设计 (product-design)</option>
          <option value="hardware" ${proj.category === 'hardware' ? 'selected' : ''}>软硬件系统 & 算法 (hardware)</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">一句话副标题</label>
        <input type="text" class="form-input proj-sub" value="${escapeAttr(proj.subtitle || "")}">
      </div>
      <div class="form-group">
        <label class="form-label">技术/产品标签 (英文逗号分隔)</label>
        <input type="text" class="form-input proj-tags" value="${escapeAttr((proj.tags || []).join(", "))}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">时间周期</label>
        <input type="text" class="form-input proj-per" value="${escapeAttr(proj.period || "")}">
      </div>
      <div class="form-group">
        <label class="form-label">角色分工</label>
        <input type="text" class="form-input proj-role" value="${escapeAttr(proj.role || "")}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">🎯 业务难点与痛点 (Problem)</label>
      <textarea class="form-textarea proj-prob" rows="2">${escapeAttr(proj.problem || "")}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">💡 产品方案与技术落地 (Solution)</label>
      <textarea class="form-textarea proj-sol" rows="3">${escapeAttr(proj.solution || "")}</textarea>
    </div>
    <div class="form-group" style="margin-bottom: 0;">
      <label class="form-label">📈 衡量指标与关键产出 (Outcome)</label>
      <textarea class="form-textarea proj-out" rows="2">${escapeAttr(proj.outcome || "")}</textarea>
    </div>
  `;
  container.appendChild(card);
}

function showAlert(msg, type = "success") {
  const alertEl = document.getElementById("status-alert");
  alertEl.textContent = msg;
  alertEl.className = `alert-banner ${type}`;
  alertEl.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => {
    alertEl.style.display = "none";
  }, 4000);
}

function escapeAttr(str) {
  if (!str) return "";
  return String(str).replace(/"/g, "&quot;");
}
