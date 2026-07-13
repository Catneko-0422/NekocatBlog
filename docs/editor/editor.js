/* ========== Mizuki Editor - JavaScript ========== */
(function() {
'use strict';

// ========== i18n System ==========
const I18N = {
  'zh-CN': {
    pageTitle: 'Mizuki 可視化編輯器',
    themeColor: '主題顏色', themeMode: '主題模式',
    themeDark: '默認深色', themeLight: '亮色主題', themeDeepBlue: '深藍主題', themeHighContrast: '高對比度',
    colorRed: '紅色', colorOrange: '橙色', colorYellow: '黃色', colorGreen: '綠色',
    colorCyan: '青色', colorBlue: '藍色', colorPurple: '紫色', colorPink: '粉色',
    modulePanel: '模塊面板', searchModules: '搜索模塊...',
    editorPlaceholder: '在此輸入 Markdown 內容...',
    cmdHeading: '標題', cmdBold: '加粗', cmdItalic: '斜體', cmdStrikethrough: '刪除線',
    cmdUl: '無序列表', cmdOl: '有序列表', cmdTask: '任務列表', cmdQuote: '引用',
    cmdCode: '行內代碼', cmdCodeblock: '代碼塊', cmdLink: '鏈接', cmdImage: '圖片',
    cmdTable: '表格', cmdHr: '分割線',
    viewEdit: '編輯', viewSplit: '分屏', viewPreview: '預覽',
    importFile: '導入', exportFile: '導出',
    fmConfig: 'Front Matter 配置',
    fmTitle: '標題', fmTitlePh: '文章標題',
    fmPublished: '發佈日期', fmUpdated: '更新日期',
    fmDesc: '描述', fmDescPh: '文章描述',
    fmImage: '封面圖片', fmCategory: '分類', fmCategoryPh: '分類名稱',
    fmTags: '標籤', fmTagsPh: '標籤1, 標籤2, 標籤3',
    fmDraft: '草稿', fmPinned: '置頂', fmComment: '評論', fmEncrypted: '加密',
    fmPassword: '密碼', fmPasswordPh: '訪問密碼',
    fmPriority: '優先級', fmAlias: '別名', fmLang: '語言', fmLangDefault: '默認',
    fmLicense: '許可證', fmAuthor: '作者', fmAuthorPh: '作者名', fmSourceLink: '來源鏈接',
    fmApply: '應用到文章', fmCancelBtn: '取消',
    exportTitle: '導出文件', exportTxt: '📄 純文本 (.txt)',
    dropMain: '📂 拖拽文件到此處導入', dropSub: '支持 .md .txt .html',
    // Module categories & items
    catFrontMatter: 'Front Matter', catBasicMd: '基礎 Markdown', catExtended: '擴展功能',
    catMermaid: 'Mermaid 圖表', catVideo: '視頻嵌入', catTemplates: '文章模板',
    modBasicConfig: '基本配置', modEncryptConfig: '加密配置', modPinConfig: '置頂配置', modDraftConfig: '草稿配置',
    modH1: '一級標題', modH2: '二級標題', modH3: '三級標題',
    modBold: '加粗', modItalic: '斜體', modStrike: '刪除線',
    modUl: '無序列表', modOl: '有序列表', modTask: '任務列表',
    modQuote: '引用塊', modInlineCode: '行內代碼', modCodeBlock: '代碼塊',
    modLink: '鏈接', modImage: '圖片', modTable: '表格', modHr: '分割線', modHtml: 'HTML塊',
    modGithubCard: 'GitHub 卡片',
    modNote: 'Note 提示框', modTip: 'Tip 技巧框', modImportant: 'Important 重要框',
    modWarning: 'Warning 警告框', modCaution: 'Caution 注意框', modCustomAdmonition: '自定義標題提示框',
    modSpoiler: 'Spoiler 隱藏', modExcerpt: '摘要分隔',
    modInlineMath: '行內公式', modBlockMath: '塊級公式',
    modFlowchart: '流程圖', modSequence: '時序圖', modGantt: '甘特圖',
    modClassDiag: '類圖', modPie: '餅圖', modState: '狀態圖',
    modYoutube: 'YouTube', modBilibili: 'Bilibili',
    modStdArticle: '標準文章', modEncArticle: '加密文章', modPinArticle: '置頂公告', modTutorial: '技術教程'
  },
  'zh-TW': {
    pageTitle: 'Mizuki 視覺化編輯器',
    themeColor: '主題顏色', themeMode: '主題模式',
    themeDark: '預設深色', themeLight: '亮色主題', themeDeepBlue: '深藍主題', themeHighContrast: '高對比度',
    colorRed: '紅色', colorOrange: '橙色', colorYellow: '黃色', colorGreen: '綠色',
    colorCyan: '青色', colorBlue: '藍色', colorPurple: '紫色', colorPink: '粉色',
    modulePanel: '模組面板', searchModules: '搜尋模組...',
    editorPlaceholder: '在此輸入 Markdown 內容...',
    cmdHeading: '標題', cmdBold: '粗體', cmdItalic: '斜體', cmdStrikethrough: '刪除線',
    cmdUl: '無序清單', cmdOl: '有序清單', cmdTask: '任務清單', cmdQuote: '引用',
    cmdCode: '行內程式碼', cmdCodeblock: '程式碼區塊', cmdLink: '連結', cmdImage: '圖片',
    cmdTable: '表格', cmdHr: '分隔線',
    viewEdit: '編輯', viewSplit: '分屏', viewPreview: '預覽',
    importFile: '匯入', exportFile: '匯出',
    fmConfig: 'Front Matter 設定',
    fmTitle: '標題', fmTitlePh: '文章標題',
    fmPublished: '發佈日期', fmUpdated: '更新日期',
    fmDesc: '描述', fmDescPh: '文章描述',
    fmImage: '封面圖片', fmCategory: '分類', fmCategoryPh: '分類名稱',
    fmTags: '標籤', fmTagsPh: '標籤1, 標籤2, 標籤3',
    fmDraft: '草稿', fmPinned: '置頂', fmComment: '留言', fmEncrypted: '加密',
    fmPassword: '密碼', fmPasswordPh: '存取密碼',
    fmPriority: '優先順序', fmAlias: '別名', fmLang: '語言', fmLangDefault: '預設',
    fmLicense: '授權條款', fmAuthor: '作者', fmAuthorPh: '作者名', fmSourceLink: '來源連結',
    fmApply: '套用至文章', fmCancelBtn: '取消',
    exportTitle: '匯出檔案', exportTxt: '📄 純文字 (.txt)',
    dropMain: '📂 拖曳檔案至此匯入', dropSub: '支援 .md .txt .html',
    catFrontMatter: 'Front Matter', catBasicMd: '基礎 Markdown', catExtended: '擴充功能',
    catMermaid: 'Mermaid 圖表', catVideo: '影片嵌入', catTemplates: '文章模板',
    modBasicConfig: '基本設定', modEncryptConfig: '加密設定', modPinConfig: '置頂設定', modDraftConfig: '草稿設定',
    modH1: '一級標題', modH2: '二級標題', modH3: '三級標題',
    modBold: '粗體', modItalic: '斜體', modStrike: '刪除線',
    modUl: '無序清單', modOl: '有序清單', modTask: '任務清單',
    modQuote: '引用區塊', modInlineCode: '行內程式碼', modCodeBlock: '程式碼區塊',
    modLink: '連結', modImage: '圖片', modTable: '表格', modHr: '分隔線', modHtml: 'HTML區塊',
    modGithubCard: 'GitHub 卡片',
    modNote: 'Note 提示框', modTip: 'Tip 技巧框', modImportant: 'Important 重要框',
    modWarning: 'Warning 警告框', modCaution: 'Caution 注意框', modCustomAdmonition: '自訂標題提示框',
    modSpoiler: 'Spoiler 隱藏', modExcerpt: '摘要分隔',
    modInlineMath: '行內公式', modBlockMath: '區塊公式',
    modFlowchart: '流程圖', modSequence: '時序圖', modGantt: '甘特圖',
    modClassDiag: '類別圖', modPie: '圓餅圖', modState: '狀態圖',
    modYoutube: 'YouTube', modBilibili: 'Bilibili',
    modStdArticle: '標準文章', modEncArticle: '加密文章', modPinArticle: '置頂公告', modTutorial: '技術教學'
  },
  en: {
    pageTitle: 'Mizuki Visual Editor',
    themeColor: 'Theme Color', themeMode: 'Theme Mode',
    themeDark: 'Default Dark', themeLight: 'Light Theme', themeDeepBlue: 'Deep Blue', themeHighContrast: 'High Contrast',
    colorRed: 'Red', colorOrange: 'Orange', colorYellow: 'Yellow', colorGreen: 'Green',
    colorCyan: 'Cyan', colorBlue: 'Blue', colorPurple: 'Purple', colorPink: 'Pink',
    modulePanel: 'Modules', searchModules: 'Search modules...',
    editorPlaceholder: 'Type your Markdown here...',
    cmdHeading: 'Heading', cmdBold: 'Bold', cmdItalic: 'Italic', cmdStrikethrough: 'Strikethrough',
    cmdUl: 'Bullet List', cmdOl: 'Numbered List', cmdTask: 'Task List', cmdQuote: 'Blockquote',
    cmdCode: 'Inline Code', cmdCodeblock: 'Code Block', cmdLink: 'Link', cmdImage: 'Image',
    cmdTable: 'Table', cmdHr: 'Horizontal Rule',
    viewEdit: 'Edit', viewSplit: 'Split', viewPreview: 'Preview',
    importFile: 'Import', exportFile: 'Export',
    fmConfig: 'Front Matter Settings',
    fmTitle: 'Title', fmTitlePh: 'Article title',
    fmPublished: 'Published', fmUpdated: 'Updated',
    fmDesc: 'Description', fmDescPh: 'Article description',
    fmImage: 'Cover image', fmCategory: 'Category', fmCategoryPh: 'Category name',
    fmTags: 'Tags', fmTagsPh: 'tag1, tag2, tag3',
    fmDraft: 'Draft', fmPinned: 'Pinned', fmComment: 'Comments', fmEncrypted: 'Encrypted',
    fmPassword: 'Password', fmPasswordPh: 'Access password',
    fmPriority: 'Priority', fmAlias: 'Alias', fmLang: 'Language', fmLangDefault: 'Default',
    fmLicense: 'License', fmAuthor: 'Author', fmAuthorPh: 'Author name', fmSourceLink: 'Source link',
    fmApply: 'Apply to Article', fmCancelBtn: 'Cancel',
    exportTitle: 'Export File', exportTxt: '📄 Plain Text (.txt)',
    dropMain: '📂 Drop files here to import', dropSub: 'Supports .md .txt .html',
    catFrontMatter: 'Front Matter', catBasicMd: 'Basic Markdown', catExtended: 'Extended Features',
    catMermaid: 'Mermaid Diagrams', catVideo: 'Video Embed', catTemplates: 'Article Templates',
    modBasicConfig: 'Basic Config', modEncryptConfig: 'Encrypt Config', modPinConfig: 'Pin Config', modDraftConfig: 'Draft Config',
    modH1: 'Heading 1', modH2: 'Heading 2', modH3: 'Heading 3',
    modBold: 'Bold', modItalic: 'Italic', modStrike: 'Strikethrough',
    modUl: 'Bullet List', modOl: 'Numbered List', modTask: 'Task List',
    modQuote: 'Blockquote', modInlineCode: 'Inline Code', modCodeBlock: 'Code Block',
    modLink: 'Link', modImage: 'Image', modTable: 'Table', modHr: 'Horizontal Rule', modHtml: 'HTML Block',
    modGithubCard: 'GitHub Card',
    modNote: 'Note', modTip: 'Tip', modImportant: 'Important',
    modWarning: 'Warning', modCaution: 'Caution', modCustomAdmonition: 'Custom Admonition',
    modSpoiler: 'Spoiler', modExcerpt: 'Excerpt Separator',
    modInlineMath: 'Inline Math', modBlockMath: 'Block Math',
    modFlowchart: 'Flowchart', modSequence: 'Sequence', modGantt: 'Gantt',
    modClassDiag: 'Class Diagram', modPie: 'Pie Chart', modState: 'State Diagram',
    modYoutube: 'YouTube', modBilibili: 'Bilibili',
    modStdArticle: 'Standard Article', modEncArticle: 'Encrypted Article', modPinArticle: 'Pinned Announcement', modTutorial: 'Tech Tutorial'
  },
  ja: {
    pageTitle: 'Mizuki ビジュアルエディタ',
    themeColor: 'テーマカラー', themeMode: 'テーマモード',
    themeDark: 'デフォルトダーク', themeLight: 'ライト', themeDeepBlue: 'ディープブルー', themeHighContrast: 'ハイコントラスト',
    colorRed: '赤', colorOrange: 'オレンジ', colorYellow: '黃', colorGreen: '緑',
    colorCyan: 'シアン', colorBlue: '青', colorPurple: '紫', colorPink: 'ピンク',
    modulePanel: 'モジュール', searchModules: 'モジュール検索...',
    editorPlaceholder: 'ここにMarkdownを入力...',
    cmdHeading: '見出し', cmdBold: '太字', cmdItalic: '斜體', cmdStrikethrough: '取消線',
    cmdUl: '箇條書き', cmdOl: '番號付き', cmdTask: 'タスク', cmdQuote: '引用',
    cmdCode: 'インラインコード', cmdCodeblock: 'コードブロック', cmdLink: 'リンク', cmdImage: '畫像',
    cmdTable: '表', cmdHr: '區切り線',
    viewEdit: '編集', viewSplit: '分割', viewPreview: 'プレビュー',
    importFile: 'インポート', exportFile: 'エクスポート',
    fmConfig: 'Front Matter 設定',
    fmTitle: 'タイトル', fmTitlePh: '記事タイトル',
    fmPublished: '公開日', fmUpdated: '更新日',
    fmDesc: '説明', fmDescPh: '記事の説明',
    fmImage: 'カバー畫像', fmCategory: 'カテゴリ', fmCategoryPh: 'カテゴリ名',
    fmTags: 'タグ', fmTagsPh: 'タグ1, タグ2, タグ3',
    fmDraft: '下書き', fmPinned: 'ピン留め', fmComment: 'コメント', fmEncrypted: '暗號化',
    fmPassword: 'パスワード', fmPasswordPh: 'アクセスパスワード',
    fmPriority: '優先度', fmAlias: 'エイリアス', fmLang: '言語', fmLangDefault: 'デフォルト',
    fmLicense: 'ライセンス', fmAuthor: '著者', fmAuthorPh: '著者名', fmSourceLink: 'ソースリンク',
    fmApply: '記事に適用', fmCancelBtn: 'キャンセル',
    exportTitle: 'ファイルエクスポート', exportTxt: '📄 プレーンテキスト (.txt)',
    dropMain: '📂 ファイルをここにドラッグ＆ドロップ', dropSub: '.md .txt .html に対応',
    catFrontMatter: 'Front Matter', catBasicMd: '基本 Markdown', catExtended: '拡張機能',
    catMermaid: 'Mermaid 図表', catVideo: '動畫埋め込み', catTemplates: '記事テンプレート',
    modBasicConfig: '基本設定', modEncryptConfig: '暗號化設定', modPinConfig: 'ピン留め設定', modDraftConfig: '下書き設定',
    modH1: '見出し1', modH2: '見出し2', modH3: '見出し3',
    modBold: '太字', modItalic: '斜體', modStrike: '取消線',
    modUl: '箇條書き', modOl: '番號付き', modTask: 'タスク',
    modQuote: '引用ブロック', modInlineCode: 'インラインコード', modCodeBlock: 'コードブロック',
    modLink: 'リンク', modImage: '畫像', modTable: '表', modHr: '區切り線', modHtml: 'HTMLブロック',
    modGithubCard: 'GitHub カード',
    modNote: 'Note ノート', modTip: 'Tip ヒント', modImportant: 'Important 重要',
    modWarning: 'Warning 警告', modCaution: 'Caution 注意', modCustomAdmonition: 'カスタムタイトル',
    modSpoiler: 'Spoiler 隠す', modExcerpt: '抜粋區切り',
    modInlineMath: 'インライン數式', modBlockMath: 'ブロック數式',
    modFlowchart: 'フローチャート', modSequence: 'シーケンス図', modGantt: 'ガントチャート',
    modClassDiag: 'クラス図', modPie: '円グラフ', modState: '狀態図',
    modYoutube: 'YouTube', modBilibili: 'Bilibili',
    modStdArticle: '標準記事', modEncArticle: '暗號化記事', modPinArticle: 'ピン留め公告', modTutorial: '技術チュートリアル'
  }
};

let currentLang = 'zh-CN';

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || (I18N['zh-CN'][key]) || key;
}

function applyI18n() {
  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'TITLE') {document.title = t(key);}
    else {el.textContent = t(key);}
  });
  // Titles (tooltips)
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });
  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  // Update html lang attribute
  const langMap = { 'zh-CN': 'zh-CN', 'zh-TW': 'zh-TW', en: 'en', ja: 'ja' };
  document.documentElement.lang = langMap[currentLang] || 'zh-CN';
  // Re-render modules with new language
  renderModules($('#moduleSearch').value);
}

// ========== Code Snippet Localization ==========
const CODE_TRANSLATIONS = {
  'zh-TW': {
    '文章標題': '文章標題', '文章描述': '文章描述', '標籤1': '標籤1', '標籤2': '標籤2', '分類名稱': '分類名稱',
    '加密文章': '加密文章', '加密文章描述': '加密文章描述', '加密': '加密', '安全': '安全',
    '置頂文章': '置頂文章', '置頂文章描述': '置頂文章描述', '公告': '公告',
    '草稿文章': '草稿文章', '草稿': '草稿', '示例': '範例',
    '標題': '標題', '加粗文本': '粗體文字', '斜體文本': '斜體文字', '刪除文本': '刪除文字',
    '列表項一': '清單項一', '列表項二': '清單項二', '列表項三': '清單項三',
    '第一項': '第一項', '第二項': '第二項', '第三項': '第三項',
    '已完成任務': '已完成任務', '未完成任務': '未完成任務', '待辦事項': '待辦事項',
    '引用內容': '引用內容', '引用第二段': '引用第二段',
    '行內代碼': '行內程式碼', '代碼內容': '程式碼內容', '代碼': '程式碼',
    '鏈接文本': '連結文字', '替代文本': '替代文字', '圖片標題': '圖片標題',
    '內容': '內容', '列1': '欄1', '列2': '欄2', '列3': '欄3',
    '用戶名/倉庫名': '使用者名稱/儲存庫名稱',
    '提示信息內容': '提示資訊內容', '技巧和建議內容': '技巧與建議內容',
    '重要信息內容': '重要資訊內容', '警告內容': '警告內容', '注意事項內容': '注意事項內容',
    '自定義標題': '自訂標題', '帶有自定義標題的提示框內容': '帶有自訂標題的提示框內容',
    '隱藏的內容': '隱藏的內容',
    '開始': '開始', '條件判斷': '條件判斷', '是': '是', '否': '否',
    '處理步驟1': '處理步驟1', '處理步驟2': '處理步驟2', '結束': '結束',
    '用戶': '使用者', '應用': '應用', '服務器': '伺服器',
    '提交請求': '提交請求', '發送數據': '傳送資料', '返回結果': '回傳結果', '顯示結果': '顯示結果',
    '項目時間線': '專案時間線', '設計': '設計', '需求分析': '需求分析', 'UI設計': 'UI設計',
    '開發': '開發', '前端開發': '前端開發', '後端開發': '後端開發',
    '用戶名': '使用者名稱', '密碼': '密碼', '登錄': '登入', '退出': '登出',
    '文章': '文章', '內容': '內容', '發佈': '發佈', '撰寫': '撰寫',
    '數據分析': '資料分析', '分類A': '分類A', '分類B': '分類B', '分類C': '分類C', '其他': '其他',
    '審覈中': '審核中', '提交': '提交', '拒絕': '拒絕', '已發佈': '已發佈', '通過': '通過', '已歸檔': '已歸檔', '歸檔': '歸檔',
    '視頻ID': '影片ID', '視頻BV號': '影片BV號',
    '文章主標題': '文章主標題', '這裏是文章開頭部分': '這裡是文章開頭部分',
    '二級標題': '二級標題', '正文內容，支持': '正文內容，支持',
    '三級標題': '三級標題', '文章總結部分': '文章總結部分', '總結': '總結',
    '加密內容': '加密內容', '這是一篇加密文章，只有輸入正確密碼才能查看': '這是一篇加密文章，只有輸入正確密碼才能查看',
    '敏感信息': '敏感資訊', '這裏包含需要保護的內容': '這裡包含需要保護的內容',
    '重要公告': '重要公告', '重要通知': '重要通知', '重要': '重要',
    '時間': '時間', '待定': '待定', '影響範圍': '影響範圍', '全站': '全站',
    '詳細內容': '詳細內容', '公告詳情': '公告詳情', '重要提醒': '重要提醒', '請注意': '請注意',
    '技術教程標題': '技術教學標題', '技術教程描述': '技術教學描述',
    '教程': '教學', '技術': '技術', '技術教程': '技術教學',
    '簡介段落': '簡介段落', '基本概念': '基本概念', '概念說明': '概念說明',
    '示例代碼': '範例程式碼', '實際應用': '實際應用', '實用技巧': '實用技巧', '技巧內容': '技巧內容',
    '關鍵詞': '關鍵詞', '關鍵詞1': '關鍵詞1', '關鍵詞2': '關鍵詞2',
    'HTML內容': 'HTML內容',
    '需要密碼訪問的加密文章': '需要密碼存取的加密文章',
    '加密文章示例': '加密文章範例'
  },
  en: {
    '文章標題': 'Article Title', '文章描述': 'Article description', '標籤1': 'Tag1', '標籤2': 'Tag2', '分類名稱': 'Category',
    '加密文章': 'Encrypted Article', '加密文章描述': 'Encrypted article description', '加密': 'Encrypted', '安全': 'Security',
    '置頂文章': 'Pinned Article', '置頂文章描述': 'Pinned article description', '公告': 'Announcement',
    '草稿文章': 'Draft Article', '草稿': 'Draft', '示例': 'Example',
    '標題': 'Heading', '加粗文本': 'Bold text', '斜體文本': 'Italic text', '刪除文本': 'Deleted text',
    '列表項一': 'List item 1', '列表項二': 'List item 2', '列表項三': 'List item 3',
    '第一項': 'First item', '第二項': 'Second item', '第三項': 'Third item',
    '已完成任務': 'Completed task', '未完成任務': 'Incomplete task', '待辦事項': 'Todo item',
    '引用內容': 'Quoted content', '引用第二段': 'Second paragraph',
    '行內代碼': 'inline code', '代碼內容': 'code here', '代碼': 'code',
    '鏈接文本': 'Link text', '替代文本': 'Alt text', '圖片標題': 'Image title',
    '內容': 'Content', '列1': 'Col 1', '列2': 'Col 2', '列3': 'Col 3',
    '用戶名/倉庫名': 'user/repo',
    '提示信息內容': 'Note content here.', '技巧和建議內容': 'Tip content here.',
    '重要信息內容': 'Important content here.', '警告內容': 'Warning content here.', '注意事項內容': 'Caution content here.',
    '自定義標題': 'Custom Title', '帶有自定義標題的提示框內容': 'Admonition content with custom title.',
    '隱藏的內容': 'Hidden content',
    '開始': 'Start', '條件判斷': 'Condition', '是': 'Yes', '否': 'No',
    '處理步驟1': 'Process 1', '處理步驟2': 'Process 2', '結束': 'End',
    '用戶': 'User', '應用': 'App', '服務器': 'Server',
    '提交請求': 'Submit request', '發送數據': 'Send data', '返回結果': 'Return result', '顯示結果': 'Show result',
    '項目時間線': 'Project Timeline', '設計': 'Design', '需求分析': 'Requirements', 'UI設計': 'UI Design',
    '開發': 'Development', '前端開發': 'Frontend', '後端開發': 'Backend',
    '用戶名': 'username', '密碼': 'password', '登錄': 'login', '退出': 'logout',
    '文章': 'Article', '發佈': 'publish', '撰寫': 'writes',
    '數據分析': 'Data Analysis', '分類A': 'Category A', '分類B': 'Category B', '分類C': 'Category C', '其他': 'Others',
    '審覈中': 'Reviewing', '提交': 'Submit', '拒絕': 'Reject', '已發佈': 'Published', '通過': 'Approve', '已歸檔': 'Archived', '歸檔': 'Archive',
    '視頻ID': 'VIDEO_ID', '視頻BV號': 'VIDEO_BV_ID',
    '文章主標題': 'Main Title', '這裏是文章開頭部分': 'Introduction paragraph here.',
    '二級標題': 'Section Title', '正文內容，支持': 'Body text with',
    '三級標題': 'Subsection', '文章總結部分': 'Summary section.', '總結': 'Summary',
    '加密內容': 'Encrypted Content', '這是一篇加密文章，只有輸入正確密碼才能查看': 'This is an encrypted article. Enter the correct password to view.',
    '敏感信息': 'Sensitive Info', '這裏包含需要保護的內容': 'Protected content here.',
    '重要公告': 'Important Announcement', '重要通知': 'Important notice', '重要': 'Important',
    '時間': 'Date', '待定': 'TBD', '影響範圍': 'Scope', '全站': 'Entire site',
    '詳細內容': 'Details', '公告詳情': 'Announcement details...', '重要提醒': 'Important Reminder', '請注意': 'Please note...',
    '技術教程標題': 'Technical Tutorial Title', '技術教程描述': 'Technical tutorial description',
    '教程': 'Tutorial', '技術': 'Tech', '技術教程': 'Tech Tutorial',
    '簡介段落': 'Introduction paragraph.', '基本概念': 'Basic Concepts', '概念說明': 'Concept explanation...',
    '示例代碼': 'Example Code', '實際應用': 'Practical Usage', '實用技巧': 'Useful Tips', '技巧內容': 'Tip content.',
    '關鍵詞': 'Keywords', '關鍵詞1': 'keyword1', '關鍵詞2': 'keyword2',
    'HTML內容': 'HTML content',
    '需要密碼訪問的加密文章': 'Encrypted article requiring password',
    '加密文章示例': 'Encrypted Article Example'
  },
  ja: {
    '文章標題': '記事タイトル', '文章描述': '記事の説明', '標籤1': 'タグ1', '標籤2': 'タグ2', '分類名稱': 'カテゴリ名',
    '加密文章': '暗號化記事', '加密文章描述': '暗號化記事の説明', '加密': '暗號化', '安全': 'セキュリティ',
    '置頂文章': 'ピン留め記事', '置頂文章描述': 'ピン留め記事の説明', '公告': 'お知らせ',
    '草稿文章': '下書き記事', '草稿': '下書き', '示例': 'サンプル',
    '標題': '見出し', '加粗文本': '太字テキスト', '斜體文本': '斜體テキスト', '刪除文本': '取消テキスト',
    '列表項一': 'リスト項目1', '列表項二': 'リスト項目2', '列表項三': 'リスト項目3',
    '第一項': '最初の項目', '第二項': '2番目の項目', '第三項': '3番目の項目',
    '已完成任務': '完了タスク', '未完成任務': '未完了タスク', '待辦事項': 'TODO項目',
    '引用內容': '引用文', '引用第二段': '引用の第2段落',
    '行內代碼': 'インラインコード', '代碼內容': 'コードの內容', '代碼': 'コード',
    '鏈接文本': 'リンクテキスト', '替代文本': '代替テキスト', '圖片標題': '畫像タイトル',
    '內容': '內容', '列1': '列1', '列2': '列2', '列3': '列3',
    '用戶名/倉庫名': 'ユーザー名/リポジトリ名',
    '提示信息內容': 'ノートの內容。', '技巧和建議內容': 'ヒントの內容。',
    '重要信息內容': '重要な內容。', '警告內容': '警告の內容。', '注意事項內容': '注意の內容。',
    '自定義標題': 'カスタムタイトル', '帶有自定義標題的提示框內容': 'カスタムタイトル付きの內容。',
    '隱藏的內容': '隠された內容',
    '開始': '開始', '條件判斷': '條件分岐', '是': 'はい', '否': 'いいえ',
    '處理步驟1': '処理ステップ1', '處理步驟2': '処理ステップ2', '結束': '終了',
    '用戶': 'ユーザー', '應用': 'アプリ', '服務器': 'サーバー',
    '提交請求': 'リクエスト送信', '發送數據': 'データ送信', '返回結果': '結果返卻', '顯示結果': '結果表示',
    '項目時間線': 'プロジェクトタイムライン', '設計': '設計', '需求分析': '要件分析', 'UIデザイン': 'UIデザイン',
    '開発': '開発', 'フロントエンド': 'フロントエンド', 'バックエンド': 'バックエンド',
    'ユーザー名': 'ユーザー名', 'パスワード': 'パスワード', 'ログイン': 'ログイン', 'ログアウト': 'ログアウト',
    '記事': '記事', '公開': '公開', '執筆': '執筆',
    'データ分析': 'データ分析', 'カテゴリA': 'カテゴリA', 'カテゴリB': 'カテゴリB', 'カテゴリC': 'カテゴリC', 'その他': 'その他',
    'レビュー中': 'レビュー中', '提出': '提出', '卻下': '卻下', '公開済み': '公開済み', '承認': '承認', 'アーカイブ済み': 'アーカイブ済み', 'アーカイブ': 'アーカイブ',
    '動畫ID': '動畫ID', '動畫BV番號': '動畫BV番號',
    '記事メインタイトル': '記事メインタイトル', 'ここは記事の導入部分です。': 'ここは記事の導入部分です。',
    'セクションタイトル': 'セクションタイトル', '本文は': '本文は',
    'サブセクション': 'サブセクション', 'まとめのセクション。': 'まとめのセクション。', 'まとめ': 'まとめ',
    '暗號化コンテンツ': '暗號化コンテンツ', 'この記事は暗號化されています。正しいパスワードを入力してください。': 'この記事は暗號化されています。正しいパスワードを入力してください。',
    '機密情報': '機密情報', '保護が必要な內容です。': '保護が必要な內容です。',
    '重要なお知らせ': '重要なお知らせ', '重要な通知': '重要な通知', '重要': '重要',
    '日時': '日時', '未定': '未定', '影響範囲': '影響範囲', 'サイト全體': 'サイト全體',
    '詳細': '詳細', 'お知らせの詳細...': 'お知らせの詳細...', '重要なリマインダー': '重要なリマインダー', 'ご注意ください...': 'ご注意ください...',
    '技術チュートリアルタイトル': '技術チュートリアルタイトル', '技術チュートリアルの説明': '技術チュートリアルの説明',
    'チュートリアル': 'チュートリアル', '技術': '技術', '技術チュートリアル': '技術チュートリアル',
    '紹介文。': '紹介文。', '基本概念': '基本概念', '概念の説明...': '概念の説明...',
    'サンプルコード': 'サンプルコード', '実踐的な使い方': '実踐的な使い方', '実用ヒント': '実用ヒント', 'ヒントの內容。': 'ヒントの內容。',
    'キーワード': 'キーワード', 'キーワード1': 'キーワード1', 'キーワード2': 'キーワード2',
    'HTML內容': 'HTML內容',
    'パスワードが必要な暗號化記事': 'パスワードが必要な暗號化記事',
    '暗號化記事の例': '暗號化記事の例'
  }
};

function localizeCode(code) {
  if (currentLang === 'zh-CN') {return code;}
  const map = CODE_TRANSLATIONS[currentLang];
  if (!map) {return code;}
  // Sort keys by length descending so longer phrases are replaced first
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  let result = code;
  keys.forEach(k => {
    result = result.split(k).join(map[k]);
  });
  return result;
}

// ========== Module Data ==========
const MODULES = [
  { catKey: 'catFrontMatter', icon: '⚙️', items: [
    { nameKey: 'modBasicConfig', icon: '📋', code: '---\ntitle: "文章標題"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndescription: "文章描述"\nimage: "./cover.webp"\ntags: [標籤1, 標籤2]\ncategory: 分類名稱\ndraft: false\npinned: false\ncomment: true\n---\n\n' },
    { nameKey: 'modEncryptConfig', icon: '🔒', code: '---\ntitle: "加密文章"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndescription: "加密文章描述"\nencrypted: true\npassword: "123456"\ntags: [加密]\ncategory: 安全\n---\n\n' },
    { nameKey: 'modPinConfig', icon: '📌', code: '---\ntitle: "置頂文章"\npublished: ' + new Date().toISOString().split('T')[0] + '\npinned: true\npriority: 0\ndescription: "置頂文章描述"\ntags: [公告]\ncategory: 公告\n---\n\n' },
    { nameKey: 'modDraftConfig', icon: '📝', code: '---\ntitle: "草稿文章"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndraft: true\ntags: [草稿]\ncategory: 示例\n---\n\n' }
  ]},
  { catKey: 'catBasicMd', icon: '✏️', items: [
    { nameKey: 'modH1', icon: 'H1', code: '# 標題\n\n' },
    { nameKey: 'modH2', icon: 'H2', code: '## 標題\n\n' },
    { nameKey: 'modH3', icon: 'H3', code: '### 標題\n\n' },
    { nameKey: 'modBold', icon: 'B', code: '**加粗文本**' },
    { nameKey: 'modItalic', icon: 'I', code: '*斜體文本*' },
    { nameKey: 'modStrike', icon: 'S', code: '~~刪除文本~~' },
    { nameKey: 'modUl', icon: '⊙', code: '- 列表項一\n- 列表項二\n- 列表項三\n\n' },
    { nameKey: 'modOl', icon: '①', code: '1. 第一項\n2. 第二項\n3. 第三項\n\n' },
    { nameKey: 'modTask', icon: '☑', code: '- [x] 已完成任務\n- [ ] 未完成任務\n- [ ] 待辦事項\n\n' },
    { nameKey: 'modQuote', icon: '❝', code: '> 引用內容\n>\n> 引用第二段\n\n' },
    { nameKey: 'modInlineCode', icon: '⌥', code: '`行內代碼`' },
    { nameKey: 'modCodeBlock', icon: '{ }', code: '```javascript\n// 代碼內容\nconsole.log("Hello");\n```\n\n' },
    { nameKey: 'modLink', icon: '🔗', code: '[鏈接文本](https://example.com "標題")' },
    { nameKey: 'modImage', icon: '🖼', code: '![替代文本](./images/photo.png "圖片標題")\n\n' },
    { nameKey: 'modTable', icon: '▦', code: '| 列1 | 列2 | 列3 |\n|------|------|------|\n| 內容 | 內容 | 內容 |\n| 內容 | 內容 | 內容 |\n\n' },
    { nameKey: 'modHr', icon: '─', code: '\n---\n\n' },
    { nameKey: 'modHtml', icon: '🏷', code: '<div class="custom">\n  HTML內容\n</div>\n\n' }
  ]},
  { catKey: 'catExtended', icon: '🚀', items: [
    { nameKey: 'modGithubCard', icon: '🐙', code: ':::github{repo="用戶名/倉庫名"}\n\n' },
    { nameKey: 'modNote', icon: '💡', code: '::::note\n提示信息內容。\n::::\n\n' },
    { nameKey: 'modTip', icon: '💚', code: '::::tip\n技巧和建議內容。\n::::\n\n' },
    { nameKey: 'modImportant', icon: '💜', code: '::::important\n重要信息內容。\n::::\n\n' },
    { nameKey: 'modWarning', icon: '⚠️', code: '::::warning\n警告內容。\n::::\n\n' },
    { nameKey: 'modCaution', icon: '🔴', code: '::::caution\n注意事項內容。\n::::\n\n' },
    { nameKey: 'modCustomAdmonition', icon: '📌', code: '::::note[自定義標題]\n帶有自定義標題的提示框內容。\n::::\n\n' },
    { nameKey: 'modSpoiler', icon: '👁', code: ':spoiler[隱藏的內容]' },
    { nameKey: 'modExcerpt', icon: '✂️', code: '\n<!--more-->\n\n' },
    { nameKey: 'modInlineMath', icon: '∑', code: '$E = mc^2$' },
    { nameKey: 'modBlockMath', icon: '∫', code: '$$\n\\\\int_{-\\\\infty}^{\\\\infty} e^{-x^2} dx = \\\\sqrt{\\\\pi}\n$$\n\n' }
  ]},
  { catKey: 'catMermaid', icon: '📊', items: [
    { nameKey: 'modFlowchart', icon: '🔀', code: '```mermaid\ngraph TD\n    A[開始] --> B{條件判斷}\n    B -->|是| C[處理步驟1]\n    B -->|否| D[處理步驟2]\n    C --> E[結束]\n    D --> E\n```\n\n' },
    { nameKey: 'modSequence', icon: '⏱', code: '```mermaid\nsequenceDiagram\n    participant 用戶\n    participant 應用\n    participant 服務器\n    用戶->>應用: 提交請求\n    應用->>服務器: 發送數據\n    服務器-->>應用: 返回結果\n    應用-->>用戶: 顯示結果\n```\n\n' },
    { nameKey: 'modGantt', icon: '📅', code: '```mermaid\ngantt\n    title 項目時間線\n    dateFormat YYYY-MM-DD\n    section 設計\n    需求分析 :a1, 2024-01-01, 7d\n    UI設計   :a2, after a1, 10d\n    section 開發\n    前端開發 :b1, 2024-01-15, 15d\n    後端開發 :b2, 2024-01-20, 18d\n```\n\n' },
    { nameKey: 'modClassDiag', icon: '🏗', code: '```mermaid\nclassDiagram\n    class 用戶 {\n        +用戶名\n        +密碼\n        +登錄()\n        +退出()\n    }\n    class 文章 {\n        +標題\n        +內容\n        +發佈()\n    }\n    用戶 "1" -- "*" 文章 : 撰寫\n```\n\n' },
    { nameKey: 'modPie', icon: '🥧', code: '```mermaid\npie title 數據分析\n    "分類A" : 45.6\n    "分類B" : 30.1\n    "分類C" : 15.3\n    "其他"  : 9.0\n```\n\n' },
    { nameKey: 'modState', icon: '🔄', code: '```mermaid\nstateDiagram-v2\n    [*] --> 草稿\n    草稿 --> 審覈中 : 提交\n    審覈中 --> 草稿 : 拒絕\n    審覈中 --> 已發佈 : 通過\n    已發佈 --> 已歸檔 : 歸檔\n```\n\n' }
  ]},
  { catKey: 'catVideo', icon: '🎬', items: [
    { nameKey: 'modYoutube', icon: '▶️', code: '<iframe width="100%" height="468" src="https://www.youtube.com/embed/視頻ID" title="YouTube" frameborder="0" allowfullscreen></iframe>\n\n' },
    { nameKey: 'modBilibili', icon: '📺', code: '<iframe width="100%" height="468" src="//player.bilibili.com/player.html?bvid=視頻BV號&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>\n\n' }
  ]},
  { catKey: 'catTemplates', icon: '📑', items: [
    { nameKey: 'modStdArticle', icon: '📄', code: '---\ntitle: "文章標題"\npublished: ' + new Date().toISOString().split('T')[0] + '\nupdated: \ndescription: "文章描述"\nimage: ./cover.webp\ntags: [標籤1, 標籤2]\ncategory: 分類名稱\ndraft: false\npinned: false\ncomment: true\n---\n\n# 文章主標題\n\n這裏是文章開頭部分。\n\n<!--more-->\n\n## 二級標題\n\n正文內容，支持**加粗**、*斜體*、`行內代碼`。\n\n### 三級標題\n\n- 列表項一\n- 列表項二\n\n```javascript\nconsole.log("Hello World");\n```\n\n> 引用內容\n\n---\n\n## 總結\n\n文章總結部分。\n' },
    { nameKey: 'modEncArticle', icon: '🔐', code: '---\ntitle: "加密文章示例"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndescription: "需要密碼訪問的加密文章"\nencrypted: true\npassword: "myPassword123"\ntags: [加密, 安全]\ncategory: 安全\n---\n\n# 🔒 加密內容\n\n> 這是一篇加密文章，只有輸入正確密碼才能查看。\n\n## 敏感信息\n\n這裏包含需要保護的內容。\n' },
    { nameKey: 'modPinArticle', icon: '📢', code: '---\ntitle: "重要公告"\npublished: ' + new Date().toISOString().split('T')[0] + '\npinned: true\npriority: 0\ndescription: "重要通知"\ntags: [公告, 重要]\ncategory: 公告\n---\n\n# 🚨 重要公告\n\n> 📅 **時間**：待定\n> 🔧 **影響範圍**：全站\n\n## 詳細內容\n\n公告詳情...\n\n::::warning[重要提醒]\n請注意...\n::::\n' },
    { nameKey: 'modTutorial', icon: '🎓', code: '---\ntitle: "技術教程標題"\npublished: ' + new Date().toISOString().split('T')[0] + '\ndescription: "技術教程描述"\nimage: "./cover.webp"\ntags: [教程, 技術]\ncategory: 技術教程\nlicenseName: "CC BY-NC-SA 4.0"\n---\n\n# 技術教程標題\n\n簡介段落。\n\n<!--more-->\n\n## 基本概念\n\n概念說明...\n\n### 示例代碼\n\n```python\ndef hello():\n    print("Hello World")\n```\n\n## 實際應用\n\n::::tip[實用技巧]\n技巧內容。\n::::\n\n```mermaid\ngraph TD\n    A[開始] --> B[結束]\n```\n\n## 總結\n\n**關鍵詞**：關鍵詞1, 關鍵詞2\n' }
  ]}
];

// ========== DOM References ==========
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const editor = $('#editor');
const preview = $('#preview');
const moduleList = $('#moduleList');
const modulePanel = $('#modulePanel');
const editorSection = $('#editorSection');
const previewSection = $('#previewSection');

// ========== Theme Color ==========
function setHue(h) {
  document.documentElement.style.setProperty('--hue', h);
  $('#huePreview').style.background = `hsl(${h} 70% 55%)`;
  localStorage.setItem('mizuki-editor-hue', h);
}

$('#themePickerBtn').onclick = () => $('#themePickerPanel').classList.toggle('hidden');
$('#hueSlider').oninput = e => setHue(e.target.value);
$$('.preset').forEach(p => p.onclick = () => {
  const h = p.dataset.hue;
  $('#hueSlider').value = h;
  setHue(h);
});

// Restore saved hue
const savedHue = localStorage.getItem('mizuki-editor-hue');
if (savedHue) { $('#hueSlider').value = savedHue; setHue(savedHue); }
else { setHue(60); }

// Close picker on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.theme-picker-btn') && !e.target.closest('.theme-picker-panel'))
    {$('#themePickerPanel').classList.add('hidden');}
  if (!e.target.closest('#btnLang') && !e.target.closest('.lang-dropdown'))
    {$('#langDropdown').classList.add('hidden');}
});

// ========== Theme Switching ==========
const THEME_CLASSES = ['theme-light', 'theme-deep-blue', 'theme-high-contrast'];
const hljsStyleLink = document.querySelector('link[href*="highlight.js"]');

function setTheme(theme) {
  THEME_CLASSES.forEach(c => document.body.classList.remove(c));
  if (theme !== 'dark') {
    document.body.classList.add('theme-' + theme);
  }
  if (hljsStyleLink) {
    hljsStyleLink.href = theme === 'light'
      ? 'https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css'
      : 'https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github-dark.min.css';
  }
  $$('.theme-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.theme === theme);
  });
  localStorage.setItem('mizuki-editor-theme', theme);
  updatePreview();
}

$$('.theme-opt').forEach(opt => {
  opt.onclick = () => setTheme(opt.dataset.theme);
});

const savedTheme = localStorage.getItem('mizuki-editor-theme');
if (savedTheme && savedTheme !== 'dark') {
  setTheme(savedTheme);
}

// ========== Language Switching ==========
$('#btnLang').onclick = () => $('#langDropdown').classList.toggle('hidden');

function setLanguage(lang) {
  currentLang = lang;
  $$('.lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });
  localStorage.setItem('mizuki-editor-lang', lang);
  applyI18n();
}

$$('.lang-opt').forEach(opt => {
  opt.onclick = () => {
    setLanguage(opt.dataset.lang);
    $('#langDropdown').classList.add('hidden');
  };
});

// Restore saved language
const savedLang = localStorage.getItem('mizuki-editor-lang');
if (savedLang && I18N[savedLang]) {
  setLanguage(savedLang);
} else {
  applyI18n(); // apply default zh-CN
}

// ========== Module Panel ==========
function renderModules(filter = '') {
  moduleList.innerHTML = '';
  const f = filter.toLowerCase();
  MODULES.forEach(cat => {
    const catName = t(cat.catKey);
    const items = cat.items.filter(i => {
      const itemName = t(i.nameKey);
      return !f || itemName.toLowerCase().includes(f) || catName.toLowerCase().includes(f);
    });
    if (!items.length) {return;}
    const catEl = document.createElement('div');
    catEl.className = 'module-category';
    catEl.innerHTML = `<div class="module-cat-header"><span class="arrow">▼</span>${cat.icon} ${catName}</div><div class="module-cat-items"></div>`;
    const itemsEl = catEl.querySelector('.module-cat-items');
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'module-item';
      el.innerHTML = `<span class="icon">${item.icon}</span>${t(item.nameKey)}`;
      el.onclick = () => insertAtCursor(localizeCode(item.code));
      el.draggable = true;
      el.ondragstart = e => e.dataTransfer.setData('text/plain', localizeCode(item.code));
      itemsEl.appendChild(el);
    });
    catEl.querySelector('.module-cat-header').onclick = function() {
      this.classList.toggle('collapsed');
      itemsEl.classList.toggle('collapsed');
    };
    moduleList.appendChild(catEl);
  });
}

$('#moduleSearch').oninput = e => renderModules(e.target.value);
renderModules();

// Toggle panel
$('#toggleModules').onclick = () => modulePanel.classList.toggle('collapsed');

// ========== Editor Core ==========
function insertAtCursor(text) {
  editor.focus();
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const val = editor.value;
  editor.value = val.substring(0, start) + text + val.substring(end);
  const newPos = start + text.length;
  editor.setSelectionRange(newPos, newPos);
  updatePreview();
}

// Toolbar commands
$$('[data-cmd]').forEach(btn => {
  btn.onclick = () => {
    const cmd = btn.dataset.cmd;
    const map = {
      heading: '## ', bold: '**加粗**', italic: '*斜體*', strikethrough: '~~刪除~~',
      ul: '- ', ol: '1. ', task: '- [ ] ', quote: '> ',
      code: '`代碼`', codeblock: '```\n代碼\n```\n',
      link: '[文本](url)', image: '![描述](url)',
      table: '| 列1 | 列2 |\n|------|------|\n| 內容 | 內容 |\n',
      hr: '\n---\n'
    };
    if (map[cmd]) {insertAtCursor(map[cmd]);}
  };
});

// Tab key support
editor.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    insertAtCursor('  ');
  }
});

// Drop support on editor
editor.addEventListener('dragover', e => e.preventDefault());
editor.addEventListener('drop', e => {
  e.preventDefault();
  const text = e.dataTransfer.getData('text/plain');
  if (text) {insertAtCursor(text);}
});

// ========== Preview ==========
function updatePreview() {
  if (previewSection.classList.contains('hidden')) {return;}
  let content = editor.value;
  if (content.startsWith('---')) {
    const end = content.indexOf('---', 3);
    if (end !== -1) {content = content.substring(end + 3).trim();}
  }
  try {
    preview.innerHTML = marked.parse(content, {
      gfm: true, breaks: true,
      highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {return hljs.highlight(code, { language: lang }).value;}
        return hljs.highlightAuto(code).value;
      }
    });
  } catch(e) {
    preview.innerHTML = marked.parse(content);
  }
}

let previewTimer;
let saveTimer;
editor.addEventListener('input', () => {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(updatePreview, 300);
  // Auto-save content
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem('mizuki-editor-content', editor.value);
  }, 500);
});

// ========== View Switching ==========
$$('.view-btn').forEach(btn => {
  btn.onclick = () => {
    $$('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    if (view === 'edit') {
      editorSection.classList.remove('hidden');
      previewSection.classList.add('hidden');
    } else if (view === 'preview') {
      editorSection.classList.add('hidden');
      previewSection.classList.remove('hidden');
      updatePreview();
    } else {
      editorSection.classList.remove('hidden');
      previewSection.classList.remove('hidden');
      updatePreview();
    }
  };
});

// ========== Front Matter Modal ==========
function toggleModal(id, show) {
  const m = document.getElementById(id);
  if (show) {m.classList.remove('hidden');}
  else {m.classList.add('hidden');}
}
window.toggleModal = toggleModal;

$('#btnFrontMatter').onclick = () => { parseFMFromEditor(); toggleModal('fmModal', true); };
$('#fmClose').onclick = () => toggleModal('fmModal', false);
$('#fmCancel').onclick = () => toggleModal('fmModal', false);
$('#fmModal .modal-overlay').onclick = () => toggleModal('fmModal', false);

$('#fm-encrypted').onchange = function() {
  $('#fm-password-row').classList.toggle('hidden', !this.checked);
};

function parseFMFromEditor() {
  const val = editor.value;
  if (!val.startsWith('---')) {return;}
  const end = val.indexOf('---', 3);
  if (end === -1) {return;}
  const yaml = val.substring(3, end).trim();
  const lines = yaml.split('\n');
  lines.forEach(line => {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (!m) {return;}
    const [, key, value] = m;
    const v = value.replace(/^["']|["']$/g, '').trim();
    const el = document.getElementById('fm-' + key);
    if (el) {
      if (el.type === 'checkbox') {el.checked = v === 'true';}
      else {el.value = v;}
    }
    if (key === 'tags') {
      $('#fm-tags').value = v.replace(/[\[\]]/g, '');
    }
  });
  if ($('#fm-encrypted').checked) {$('#fm-password-row').classList.remove('hidden');}
}

$('#fmApply').onclick = () => {
  let fm = '---\n';
  const add = (k, v) => { if (v) {fm += `${k}: ${v}\n`;} };
  const addQ = (k, v) => { if (v) {fm += `${k}: "${v}"\n`;} };
  addQ('title', $('#fm-title').value);
  add('published', $('#fm-published').value);
  if ($('#fm-updated').value) {add('updated', $('#fm-updated').value);}
  addQ('description', $('#fm-description').value);
  if ($('#fm-image').value) {add('image', $('#fm-image').value);}
  if ($('#fm-tags').value) {
    const tags = $('#fm-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    fm += `tags: [${tags.join(', ')}]\n`;
  }
  if ($('#fm-category').value) {add('category', $('#fm-category').value);}
  fm += `draft: ${$('#fm-draft').checked}\n`;
  fm += `pinned: ${$('#fm-pinned').checked}\n`;
  if ($('#fm-pinned').checked && $('#fm-priority').value) {add('priority', $('#fm-priority').value);}
  fm += `comment: ${$('#fm-comment').checked}\n`;
  if ($('#fm-encrypted').checked) {
    fm += 'encrypted: true\n';
    addQ('password', $('#fm-password').value);
  }
  if ($('#fm-alias').value) {addQ('alias', $('#fm-alias').value);}
  if ($('#fm-lang').value) {add('lang', $('#fm-lang').value);}
  if ($('#fm-license').value) {addQ('licenseName', $('#fm-license').value);}
  if ($('#fm-author').value) {addQ('author', $('#fm-author').value);}
  if ($('#fm-source').value) {addQ('sourceLink', $('#fm-source').value);}
  fm += '---\n\n';

  let content = editor.value;
  if (content.startsWith('---')) {
    const end = content.indexOf('---', 3);
    if (end !== -1) {content = content.substring(end + 3).trimStart();}
  }
  editor.value = fm + content;
  toggleModal('fmModal', false);
  updatePreview();
};

// ========== Import ==========
$('#btnImport').onclick = () => $('#fileInput').click();
$('#fileInput').onchange = e => {
  const file = e.target.files[0];
  if (file) {readFile(file);}
  e.target.value = '';
};

function readFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    let content = e.target.result;
    if (file.name.endsWith('.html')) {
      const tmp = document.createElement('div');
      tmp.innerHTML = content;
      content = tmp.textContent || tmp.innerText;
    }
    editor.value = content;
    updatePreview();
  };
  reader.readAsText(file);
}

// Drag & drop file import
document.addEventListener('dragover', e => {
  e.preventDefault();
  if (e.dataTransfer.types.includes('Files'))
    {$('#dropOverlay').classList.remove('hidden');}
});
$('#dropOverlay').addEventListener('dragleave', e => {
  if (e.target === $('#dropOverlay') || e.target.closest('.drop-message'))
    {$('#dropOverlay').classList.add('hidden');}
});
$('#dropOverlay').addEventListener('drop', e => {
  e.preventDefault();
  $('#dropOverlay').classList.add('hidden');
  const file = e.dataTransfer.files[0];
  if (file) {readFile(file);}
});

// ========== Export ==========
$('#btnExport').onclick = () => toggleModal('exportModal', true);
$('#exportModal .modal-overlay').onclick = () => toggleModal('exportModal', false);

$$('.export-btn').forEach(btn => {
  btn.onclick = () => {
    const fmt = btn.dataset.format;
    let content, filename, mime;
    const raw = editor.value;
    if (fmt === 'md') {
      content = raw; filename = 'article.md'; mime = 'text/markdown';
    } else if (fmt === 'html') {
      let body = raw;
      if (body.startsWith('---')) {
        const end = body.indexOf('---', 3);
        if (end !== -1) {body = body.substring(end + 3).trim();}
      }
      const html = marked.parse(body);
      content = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Article</title><style>body{font-family:system-ui;max-width:800px;margin:2em auto;padding:0 1em;line-height:1.7;color:#222}code{background:#f4f4f4;padding:2px 6px;border-radius:4px}pre{background:#f4f4f4;padding:1em;border-radius:8px;overflow-x:auto}blockquote{border-left:3px solid #ddd;padding:.5em 1em;color:#666;margin:1em 0}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px 12px}th{background:#f0f0f0}</style></head><body>${html}</body></html>`;
      filename = 'article.html'; mime = 'text/html';
    } else {
      let txt = raw;
      if (txt.startsWith('---')) {
        const end = txt.indexOf('---', 3);
        if (end !== -1) {txt = txt.substring(end + 3).trim();}
      }
      content = txt.replace(/[#*`~>[\]()_|\\-]/g, '').replace(/\n{3,}/g, '\n\n');
      filename = 'article.txt'; mime = 'text/plain';
    }
    const blob = new Blob([content], { type: mime + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    a.click(); URL.revokeObjectURL(url);
    toggleModal('exportModal', false);
  };
});

// ========== Init ==========
// Restore saved content
const savedContent = localStorage.getItem('mizuki-editor-content');
if (savedContent) {
  editor.value = savedContent;
  updatePreview();
}

$('#fm-published').value = new Date().toISOString().split('T')[0];

// Save on page unload as safety net
window.addEventListener('beforeunload', () => {
  if (editor.value.trim()) {
    localStorage.setItem('mizuki-editor-content', editor.value);
  }
});

})();
