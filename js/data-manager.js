/**
 * 数据管理与导入导出层
 * 优先从 localStorage 读取数据，若无则使用 site-data.js 默认数据
 * 提供导入解析器（支持 LinkedIn、大厂简历纯文本、JSON 格式）、本地保存与重置
 */
const STORAGE_KEY = "ZC_PORTFOLIO_SITE_DATA_V1";

const DataManager = {
  // 获取当前数据（优先 LocalStorage，降级 DEFAULT_SITE_DATA）
  getData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.profile && parsed.experience) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("读取 localStorage 失败，使用默认数据", e);
    }
    // 返回深拷贝的默认数据
    return JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
  },

  // 保存数据到 LocalStorage
  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return { success: true };
    } catch (e) {
      console.error("保存至 LocalStorage 失败", e);
      return { success: false, error: e.message };
    }
  },

  // 重置恢复默认数据
  resetData() {
    localStorage.removeItem(STORAGE_KEY);
    return JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
  },

  // 导出为格式化 JSON 文件供下载
  exportJSON() {
    const data = this.getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `site-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // 导出为可直接替换 js/site-data.js 的代码
  exportJSCode() {
    const data = this.getData();
    return `/**\n * 个人网站与智能简历核心数据源\n * 更新时间: ${new Date().toLocaleString()}\n */\nconst DEFAULT_SITE_DATA = ${JSON.stringify(data, null, 2)};\n`;
  },

  // 智能解析外部文本（支持 LinkedIn / 大厂招聘平台复制内容 / 纯文本）
  smartParseText(rawText) {
    if (!rawText || !rawText.trim()) return null;
    const text = rawText.trim();

    // 1. 如果直接是 JSON 格式
    if (text.startsWith("{") && text.endsWith("}")) {
      try {
        const parsed = JSON.parse(text);
        if (parsed.profile || parsed.experience || parsed.education) {
          return { type: "json", data: parsed };
        }
      } catch (e) {
        // 继续走文本解析
      }
    }

    // 2. 文本正则与语义提取
    const extracted = {
      profile: {},
      education: [],
      experience: [],
      projects: [],
      skills: []
    };

    // 匹配手机号
    const phoneMatch = text.match(/(1[3-9]\d{9}|1[3-9]\d[-\s]\d{4}[-\s]\d{4})/);
    if (phoneMatch) extracted.profile.phone = phoneMatch[0].replace(/[\s-]/g, "");

    // 匹配邮箱
    const emailMatch = text.match(/([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/);
    if (emailMatch) extracted.profile.email = emailMatch[0];

    // 匹配姓名（常见两字或三字）
    const nameMatch = text.match(/(?:姓名|Name|我是|候选人)[:：\s]*([\u4e00-\u9fa5]{2,4})/i) ||
                      text.match(/^([\u4e00-\u9fa5]{2,4})\s*(?:男|女|\d{2,4}|电话|邮箱)/m);
    if (nameMatch) extracted.profile.name = nameMatch[1];

    // 智能提取教育背景
    const eduRegex = /([2][0-9]{3}[.\-/][0-1]?[0-9]?(?:\s*[-~至到]\s*(?:[2][0-9]{3}[.\-/][0-1]?[0-9]?|至今|现在|在读))?)[,\s|]*([^\n,，|]+(?:大学|学院|分校|Institute|University))[,，\s|]*([^\n,，|]+(?:硕士|学士|本科|博士|研究生|通信|电子|计算机|工程|系|专业)?[^\n]*)/gi;
    let eduMatch;
    while ((eduMatch = eduRegex.exec(text)) !== null) {
      extracted.education.push({
        id: "edu-" + Date.now() + Math.random().toString(36).substring(2, 5),
        period: eduMatch[1].trim(),
        institution: eduMatch[2].trim(),
        degree: eduMatch[3].trim(),
        highlights: []
      });
    }

    // 智能提取经历段落（通过常见时间段分隔）
    const expRegex = /([2][0-9]{3}[.\-/][0-1]?[0-9]?(?:\s*[-~至到]\s*(?:[2][0-9]{3}[.\-/][0-1]?[0-9]?|至今|现在|在职))?)[,\s|]*([^\n,，|]+(?:公司|团队|实验室|集团|科技|研究院|有限责任公司))[,，\s|]*([^\n]+)/gi;
    let expMatch;
    while ((expMatch = expRegex.exec(text)) !== null) {
      extracted.experience.push({
        id: "exp-" + Date.now() + Math.random().toString(36).substring(2, 5),
        period: expMatch[1].trim(),
        company: expMatch[2].trim(),
        role: expMatch[3].trim(),
        summary: "",
        responsibilities: []
      });
    }

    return { type: "text", data: extracted };
  }
};
