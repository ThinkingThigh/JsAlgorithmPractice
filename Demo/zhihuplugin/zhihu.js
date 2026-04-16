/**
 * 知乎「代码编辑器」阅读模式：深色语法高亮风格、弱化品牌壳层，尽量只保留正文与评论区。
 *
 * 使用方式（在 https://www.zhihu.com 已打开页面）：
 *   1) 控制台粘贴本文件全文后执行；或
 *   2) 另存为书签/油猴脚本，在页面加载完成后调用 applyZhihuEditorTheme()
 *
 * 还原：removeZhihuEditorTheme()
 */
(function initZhihuEditorTheme(global) {
  const STYLE_ID = 'zhihu-editor-theme-style';
  const MARK_CLASS = 'zhihu-editor-theme-active';

  const DEFAULTS = {
    /** 是否把正文字体改为等宽（更像 IDE） */
    monoBody: true,
    /** 最大内容宽度 */
    maxContentWidth: '860px',
  };

  /** VS Code Dark+ 近似配色 */
  const PALETTE = {
    bg: '#1e1e1e',
    surface: '#252526',
    surface2: '#2d2d2d',
    border: '#3c3c3c',
    text: '#d4d4d4',
    muted: '#858585',
    keyword: '#569cd6',
    string: '#ce9178',
    comment: '#6a9955',
    link: '#4ec9b0',
    selection: '#264f78',
  };

  function buildCss(opts) {
    const { maxContentWidth, monoBody } = opts;
    const fontStack = monoBody
      ? 'ui-monospace, SFMono-Regular, "JetBrains Mono", "Fira Code", Menlo, Consolas, monospace'
      : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

    return `
      html.${MARK_CLASS},
      html.${MARK_CLASS} body {
        background: ${PALETTE.bg} !important;
        color: ${PALETTE.text} !important;
        font-family: ${fontStack} !important;
        -webkit-font-smoothing: antialiased;
      }

      html.${MARK_CLASS} ::selection {
        background: ${PALETTE.selection} !important;
        color: ${PALETTE.text} !important;
      }

      /* ---------- 隐藏壳层 / 营销 / 侧栏（类名随版本可能微调，可按需追加） ---------- */
      html.${MARK_CLASS} header[role="banner"],
      html.${MARK_CLASS} .AppHeader,
      html.${MARK_CLASS} .AppHeader-inner,
      html.${MARK_CLASS} .MobileAppHeader,
      html.${MARK_CLASS} .GlobalSideBar,
      html.${MARK_CLASS} .Question-sideColumn,
      html.${MARK_CLASS} .Question-sideColumnSticky,
      html.${MARK_CLASS} .Question-sideColumnCard,
      html.${MARK_CLASS} .Question-sideColumnAd,
      html.${MARK_CLASS} .Topstory-sidebar,
      html.${MARK_CLASS} .Topstory-Sidebar,
      html.${MARK_CLASS} .Topstory-sidebarColumn,
      html.${MARK_CLASS} .Topstory-sideBar,
      html.${MARK_CLASS} .TopstoryV2-sidebar,
      html.${MARK_CLASS} .Pc-card,
      html.${MARK_CLASS} .SimilarQuestions,
      html.${MARK_CLASS} .SimilarQuestions-list,
      html.${MARK_CLASS} .RelatedQuestions-list,
      html.${MARK_CLASS} .RelatedReadings,
      html.${MARK_CLASS} .QuestionRelatedReadings,
      html.${MARK_CLASS} .Recommendations,
      html.${MARK_CLASS} .QuestionWaiting,
      html.${MARK_CLASS} .QuestionHeader-footer,
      html.${MARK_CLASS} .OpenInAppButton,
      html.${MARK_CLASS} .CornerButton,
      html.${MARK_CLASS} .Sticky-openApp,
      html.${MARK_CLASS} .AdblockBanner,
      html.${MARK_CLASS} .MBannerAd,
      html.${MARK_CLASS} .CommercialAd,
      html.${MARK_CLASS} .Advertisement,
      html.${MARK_CLASS} [class*="Commercial"],
      html.${MARK_CLASS} [class*="BannerAd"],
      html.${MARK_CLASS} .Footer,
      html.${MARK_CLASS} footer.Footer,
      /* ---------- 布局：主栏居中 ---------- */
      html.${MARK_CLASS} .App-main,
      html.${MARK_CLASS} main.App-main {
        background: ${PALETTE.bg} !important;
        padding-top: 16px !important;
        padding-bottom: 48px !important;
      }

      html.${MARK_CLASS} .Question-main,
      html.${MARK_CLASS} .Question-mainColumn,
      html.${MARK_CLASS} .Topstory-mainColumn,
      html.${MARK_CLASS} .Post-Main,
      html.${MARK_CLASS} .ArticleItem {
        max-width: ${maxContentWidth} !important;
        margin-left: auto !important;
        margin-right: auto !important;
        float: none !important;
      }

      html.${MARK_CLASS} .Question-sideColumn,
      html.${MARK_CLASS} .Topstory-sidebarColumn {
        width: 0 !important;
        min-width: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
      }

      /* ---------- 卡片与分割线 IDE 化 ---------- */
      html.${MARK_CLASS} .Card,
      html.${MARK_CLASS} .AnswerItem,
      html.${MARK_CLASS} .TopstoryItem,
      html.${MARK_CLASS} .List-item,
      html.${MARK_CLASS} .CommentItemV2,
      html.${MARK_CLASS} .NestComment,
      html.${MARK_CLASS} .CommentItem,
      html.${MARK_CLASS} .CommentsV2-footer {
        background: ${PALETTE.surface} !important;
        color: ${PALETTE.text} !important;
        border-color: ${PALETTE.border} !important;
        box-shadow: none !important;
        border-radius: 4px !important;
      }

      html.${MARK_CLASS} .QuestionHeader-title,
      html.${MARK_CLASS} .QuestionHeader-core,
      html.${MARK_CLASS} .QuestionRichText,
      html.${MARK_CLASS} .RichText,
      html.${MARK_CLASS} .ztext,
      html.${MARK_CLASS} .RichContent-inner {
        color: ${PALETTE.text} !important;
      }

      html.${MARK_CLASS} a,
      html.${MARK_CLASS} .RichText-zLink,
      html.${MARK_CLASS} .QuestionRichText a {
        color: ${PALETTE.link} !important;
        text-decoration: none !important;
      }

      html.${MARK_CLASS} a:hover {
        text-decoration: underline !important;
      }

      html.${MARK_CLASS} img,
      html.${MARK_CLASS} video {
        opacity: 0.95;
        border-radius: 2px;
        border: 1px solid ${PALETTE.border};
      }

      /* 评论区：更像 diff/注释行 */
      html.${MARK_CLASS} [class*="CommentList"],
      html.${MARK_CLASS} .Comments-container,
      html.${MARK_CLASS} .CommentsV2-root,
      html.${MARK_CLASS} .CommentListV2 {
        background: ${PALETTE.bg} !important;
        border-top: 1px solid ${PALETTE.border} !important;
      }

      html.${MARK_CLASS} .CommentItemV2-meta,
      html.${MARK_CLASS} .CommentItemV2-time,
      html.${MARK_CLASS} .CommentItem-meta {
        color: ${PALETTE.comment} !important;
      }

      html.${MARK_CLASS} .Button--primary,
      html.${MARK_CLASS} .VoteButton--up,
      html.${MARK_CLASS} .VoteButton.is-active {
        background: ${PALETTE.keyword} !important;
        border-color: ${PALETTE.keyword} !important;
        color: #fff !important;
      }

      html.${MARK_CLASS} .Button,
      html.${MARK_CLASS} .Tag,
      html.${MARK_CLASS} .Label {
        background: ${PALETTE.surface2} !important;
        color: ${PALETTE.muted} !important;
        border-color: ${PALETTE.border} !important;
      }

      html.${MARK_CLASS} code,
      html.${MARK_CLASS} pre {
        font-family: inherit !important;
        background: ${PALETTE.surface2} !important;
        color: ${PALETTE.string} !important;
        border: 1px solid ${PALETTE.border} !important;
      }

      /* 去掉大面积知乎蓝背景条 */
      html.${MARK_CLASS} [style*="1772F6"],
      html.${MARK_CLASS} [style*="#1772F6"] {
        background-color: ${PALETTE.surface2} !important;
      }
    `;
  }

  let observer;

  function ensureStyle(opts) {
    let el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      el.type = 'text/css';
      document.documentElement.appendChild(el);
    }
    el.textContent = buildCss(opts);
  }

  function isZhihuHost() {
    return /^https:\/\/(www\.)?zhihu\.com\//i.test(location.href);
  }

  /**
   * 应用主题与布局裁剪
   * @param {Partial<typeof DEFAULTS>} options
   */
  function applyZhihuEditorTheme(options) {
    if (!isZhihuHost()) {
      console.warn('[ZhihuEditorTheme] 当前不是 zhihu.com 页面，已取消。');
      return;
    }

    const opts = { ...DEFAULTS, ...options };
    document.documentElement.classList.add(MARK_CLASS);
    ensureStyle(opts);

    if (observer) observer.disconnect();
    observer = new MutationObserver(() => ensureStyle(opts));
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function removeZhihuEditorTheme() {
    document.documentElement.classList.remove(MARK_CLASS);
    const el = document.getElementById(STYLE_ID);
    if (el) el.remove();
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  global.applyZhihuEditorTheme = applyZhihuEditorTheme;
  global.removeZhihuEditorTheme = removeZhihuEditorTheme;

  /** 若作为 IIFE 直接运行在页面，可自动开启（改为 false 可关闭自动） */
  const AUTO_RUN = true;
  if (AUTO_RUN && typeof document !== 'undefined') {
    const boot = () => applyZhihuEditorTheme();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
    else boot();
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
