/**
 * 后台访问密码门（仅站主本人可进入管理面板）
 * 说明：本站为纯静态托管，采用「SHA-256 密码哈希 + 会话解锁」方式保护后台页面。
 *       密码明文不出现在任何前端代码中，代码中仅保存其 SHA-256 哈希。
 * 修改密码：在后台「导出与备份」页签中使用“生成新密码配置行”，
 *           将生成的哈希替换下方 codeHash 的值，提交推送后生效。
 */
window.ADMIN_AUTH = {
  // 默认访问密码的 SHA-256 哈希（默认密码由站主私下保管，不在仓库中明文出现）
  codeHash: "7632abac651a06a40378dd42e340167616e485db81d746e3757c28fb4f422aa1",
  sessionFlag: "ZC_ADMIN_UNLOCKED_V1",

  async sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  },

  isUnlocked() {
    try {
      return sessionStorage.getItem(this.sessionFlag) === "1";
    } catch (e) {
      return false;
    }
  },

  async unlock(code) {
    const h = await this.sha256(code || "");
    if (h === this.codeHash) {
      try { sessionStorage.setItem(this.sessionFlag, "1"); } catch (e) {}
      return true;
    }
    return false;
  },

  lock() {
    try { sessionStorage.removeItem(this.sessionFlag); } catch (e) {}
  }
};
