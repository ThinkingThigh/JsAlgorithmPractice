/**
 * 进度条 HTML 生成（用于 formApi.setFieldsValue 等场景替换只读/展示字段）
 *
 * @example
 * formApi.setFieldsValue({
 *   my_progress_field: { value: ProcessBar.getHtml('my_progress_field', 37, '预算使用率') },
 * });
 */
(function (global) {
    "use strict";
  
    /**
     * @param {string} fieldId 表单字段名，用于生成容器 DOM id，避免同页多条进度条冲突
     * @param {number} percent 百分比数值，会自动限制在 0～100
     * @param {string} [title='百分比'] 左侧标题文案
     * @returns {string} 可直接赋给字段 value 的 HTML 字符串
     */
    function escapeHtml(text) {
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }
  
    function getHtml(fieldId, percent, title) {
      var p = Number(percent);
      if (isNaN(p)) {
        p = 0;
      }
      if (p < 0) {
        p = 0;
      }
      if (p > 100) {
        p = 100;
      }
      p = Math.round(p * 100) / 100;
  
      var raw = fieldId == null ? "progress" : String(fieldId);
      var safeId = raw.replace(/[^a-zA-Z0-9_-]/g, "_");
      var wrapId = "process_bar_wrap_" + safeId;
      var label = title == null || title === "" ? "百分比" : String(title);
  
      return (
        '<div id="' +
        wrapId +
        '" class="process-bar-wrap" style="width:100%;max-width:360px;box-sizing:border-box;">' +
        '<div class="process-bar-track" style="height:10px;border-radius:5px;background:#f0f0f0;overflow:hidden;">' +
        '<div class="process-bar-fill" style="height:100%;width:' +
        p +
        '%;background:linear-gradient(90deg,#1890ff,#40a9ff);border-radius:5px;transition:width 0.25s ease;"></div>' +
        "</div>" +
        '<div class="process-bar-meta" style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;font-size:12px;color:#595959;">' +
        "<span>" +
        escapeHtml(label) +
        "</span>" +
        "<span><strong>" +
        p +
        "</strong>%</span>" +
        "</div>" +
        "</div>"
      );
    }
  
    global.ProcessBar = {
      getHtml: getHtml,
    };
  })(typeof window !== "undefined" ? window : this);
  