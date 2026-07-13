# 🌸 Mizuki

<img align='right' src='logo.png' width='200px' alt="Mizuki logo">

一個現代化、功能豐富的靜態博客模板，基於 [Astro](https://astro.build) 構建，具有先進的功能和精美的設計。

[![Node.js >= 22](https://img.shields.io/badge/node.js-%3E%3D22-brightgreen)](https://nodejs.org/)
[![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue)](https://pnpm.io/)
[![Astro](https://img.shields.io/badge/Astro-7.0.4-orange)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-blue)](https://www.typescriptlang.org/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](https://opensource.org/licenses/Apache-2.0)

[**🖥️ 在線演示**](https://mizuki.mysqil.com/) | [**📝 用戶文檔**](https://docs.mizuki.mysqil.com/)

🌏 **README 語言:**
[**English**](./README.md) / [**中文**](./README.zh.md) / [**日本語**](./README.ja.md) / [**繁體中文**](./README.tw.md) /

通過我們的綜合文檔快速開始。無論是自定義主題、配置功能，還是部署到生產環境，文檔涵蓋了您成功啓動博客所需的所有內容。

[📚 閱讀完整文檔](https://docs.mizuki.mysqil.com/) →

![Mizuki Preview](./README.webp)

<table>
  <tr>
    <td><img alt="" src="docs/image/1.webp"></td>
    <td><img alt="" src="docs/image/2.webp"></td>
    <td><img alt="" src="docs/image/3.webp"></td>
  <tr>
  <tr>
    <td><img alt="" src="docs/image/4.webp"></td>
    <td><img alt="" src="docs/image/5.webp"></td>
    <td><img alt="" src="docs/image/6.webp"></td>
  <tr>
</table>

## 🚀 NEW: 自動分辨率適配

> **🎯 自動分辨率算法** - 智能適配內容佈局基於設備屏幕分辨率，爲所有設備提供最佳觀看體驗

🌏 README 語言
[**English**](./README.md) /
[**中文**](./README.zh.md) /
[**日本語**](./README.ja.md) /
[**繁體中文**](./README.tw.md) /

### 🔧 組件配置系統重構

- **統一配置架構：** 全新的模塊化組件配置體系，支持動態組件管理和順序配置
- **配置驅動的組件加載：** 重構 SideBar 組件，實現完全基於配置的組件加載機制
- **統一控制開關：** 移除音樂播放器和公告組件的獨立 enable 開關，統一由 sidebarLayoutConfig 控制
- **響應式佈局適配：** 組件支持響應式佈局，可根據設備類型自動調整顯示

### 📐 佈局系統優化

- **側邊欄位置動態調整：** 支持左右側邊欄切換，佈局自動適配
- **文章目錄智能定位：** 當側邊欄在右側時，文章導航自動移至左側，提供更好的閱讀體驗
- **網格佈局改進：** 優化 CSS Grid 佈局，解決容器寬度異常問題

### 🎛️ 配置文件格式標準化

- **標準化配置格式：** 創建統一的組件配置文件格式規範
- **類型安全：** 完善的 TypeScript 類型定義，確保配置的類型安全
- **可擴展性：** 支持自定義組件類型和配置選項

### 🧹 代碼優化

- **測試文件清理：** 移除未使用的測試配置和依賴，減少項目體積
- **代碼結構優化：** 改進組件架構，提升代碼可維護性
- **性能提升：** 優化組件加載邏輯，提升頁面渲染性能

---

## ✨ 功能特性

### 🎨 設計與界面

- [x] 基於 [Astro](https://astro.build) 和 [Tailwind CSS](https://tailwindcss.com) 構建
- [x] 使用 [Swup](https://swup.js.org/) 實現流暢的動畫和頁面過渡
- [x] 明暗主題切換，支持系統偏好檢測
- [x] 可自定義主題色彩和動態橫幅輪播
- [x] 全屏背景圖片，支持輪播、透明度和模糊效果
- [x] 全設備響應式設計
- [x] 使用 JetBrains Mono 字體的優美排版

### 🔍 內容與搜索

- [x] 基於 [Pagefind](https://pagefind.app/) 的高級搜索功能
- [x] [增強的 Markdown 功能](#-markdown-擴展語法)，支持語法高亮
- [x] 交互式目錄，支持自動滾動
- [x] RSS 訂閱生成
- [x] 閱讀時間估算
- [x] 文章分類和標籤系統

### 📱 特色頁面

- [x] **追番頁面** - 追蹤動畫觀看進度和評分
- [x] **友鏈頁面** - 精美卡片展示朋友網站
- [x] **日記頁面** - 分享生活瞬間，類似社交媒體
- [x] **歸檔頁面** - 有序的文章時間線視圖
- [x] **關於頁面** - 可自定義的個人介紹

### 🛠 技術特性

- [x] **增強代碼塊**，基於 [Expressive Code](https://expressive-code.com/)
- [x] **數學公式支持**，KaTeX 渲染
- [x] **圖片優化**，PhotoSwipe 畫廊集成
- [x] **SEO 優化**，包含站點地圖和元標籤
- [x] **性能優化**，懶加載和緩存機制
- [x] **評論系統**，支持 Twikoo 集成

## 🚀 快速開始

### 📦 安裝

1. **克隆倉庫：**

   ```bash
   git clone https://github.com/LyraVoid/Mizuki.git
   cd Mizuki
   ```

2. **安裝依賴：**

   ```bash
   # 如果沒有安裝 pnpm，先安裝
   npm install -g pnpm

   # 安裝項目依賴
   pnpm install
   ```

3. **配置博客：**
   - 編輯 `src/config.ts` 自定義博客設置
   - 更新站點信息、主題色彩、橫幅圖片和社交鏈接
   - 配置特色頁面功能
   - (可選) 配置內容倉庫分離 - 見 [內容倉庫配置](#-代碼內容分離可選)

4. **啓動開發服務器：**
   ```bash
   pnpm dev
   ```
   博客將在 `http://localhost:4321` 可用

### 📝 內容管理

- **創建新文章：** `pnpm new-post <文件名>`
- **編輯文章：** 修改 `src/content/posts/` 中的文件
- **自定義頁面：** 編輯 `src/content/spec/` 中的特殊頁面
- **添加圖片：** 將圖片放在 `src/assets/` 或 `public/` 中

### 🚀 部署

將博客部署到任何靜態託管平臺：

- **Vercel：** 連接 GitHub 倉庫到 Vercel
- **Netlify：** 直接從 GitHub 部署
- **GitHub Pages：** 使用包含的 GitHub Actions 工作流
- **Cloudflare Pages：** 連接您的倉庫

- **環境變量配置（可選）：** 可參照 `.env.example` 來配置

部署前，請在 `src/config.ts` 中更新 `siteURL`。
**不建議**將 `.env` 文件提交到 Git，`.env` 應該僅在本地調試或構建使用。若要將項目在雲平臺部署，建議通過平臺上的 `環境變量` 配置傳入。

## 📝 文章前言格式

```yaml
---
title: 我的第一篇博客文章
published: 2023-09-09
description: 這是我新博客的第一篇文章。
image: ./cover.jpg
tags: [標籤1, 標籤2]
category: 前端
draft: false
pinned: false
comment: true
lang: zh-CN # 僅當文章語言與 config.ts 中的站點語言不同時設置
---
```

### Frontmatter 字段說明

- **title**: 文章標題（必需）
- **published**: 發佈日期（必需）
- **description**: 文章描述，用於 SEO 和預覽
- **image**: 封面圖片路徑（相對於文章文件）
- **tags**: 標籤數組，用於分類
- **category**: 文章分類
- **draft**: 設置爲 `true` 在生產環境中隱藏文章
- **pinned**: 設置爲 `true` 將文章置頂
- **comment**: 設置爲 `true` 啓用文章評論區（需全局啓用評論功能）
- **lang**: 文章語言（僅當與站點默認語言不同時設置）

### 置頂文章功能

`pinned` 字段允許您將重要文章置頂到博客列表的頂部。置頂文章將始終顯示在普通文章之前，無論其發佈日期如何。

**使用方法：**

```yaml
pinned: true  # 將此文章置頂
pinned: false # 普通文章（默認）
```

**排序規則：**

1. 置頂文章優先顯示，按發佈日期排序（最新在前）
2. 普通文章隨後顯示，按發佈日期排序（最新在前）

### 文章級評論控制

`comment` 字段允許您單獨控制每篇文章評論區的開啓與關閉。

**使用方法：**

```yaml
comment: true  # 啓用評論（默認）
comment: false # 禁用評論
```

**注意：**
此功能需要先在 `src/config.ts` 中啓用評論系統。

## 🧩 Markdown 擴展語法

Mizuki 支持超越標準 GitHub Flavored Markdown 的增強功能：

### 📝 增強寫作

- **提示框：** 使用 `> [!NOTE]`、`> [!TIP]`、`> [!WARNING]` 等創建精美的標註框
- **數學公式：** 使用 `$行內$` 和 `$$塊級$$` 語法編寫 LaTeX 數學公式
- **代碼高亮：** 高級語法高亮，支持行號和複製按鈕
- **GitHub 卡片：** 使用 `::github{repo="用戶/倉庫"}` 嵌入倉庫卡片

### 🎨 視覺元素

- **圖片畫廊：** 自動 PhotoSwipe 集成，支持圖片查看
- **可摺疊部分：** 創建可展開的內容塊
- **自定義組件：** 使用特殊指令增強內容

### 📊 內容組織

- **目錄：** 從標題自動生成，支持平滑滾動
- **閱讀時間：** 自動計算和顯示
- **文章元數據：** 豐富的前言支持，包含分類和標籤

## ⚡ 命令

所有命令都在項目根目錄運行：

| 命令                     | 操作                                   |
| :----------------------- | :------------------------------------- |
| `pnpm install`           | 安裝依賴                               |
| `pnpm dev`               | 在 `localhost:4321` 啓動本地開發服務器 |
| `pnpm build`             | 構建生產站點到 `./dist/`               |
| `pnpm preview`           | 在部署前本地預覽構建                   |
| `pnpm check`             | 運行 Astro 錯誤檢查                    |
| `pnpm format`            | 使用 Prettier 格式化代碼               |
| `pnpm lint`              | 檢查並修復代碼問題                     |
| `pnpm new-post <文件名>` | 創建新博客文章                         |
| `pnpm astro ...`         | 運行 Astro CLI 命令                    |

## 🎯 配置指南

### 🔧 基礎配置

編輯 `src/config.ts` 自定義您的博客：

```typescript
export const siteConfig: SiteConfig = {
  title: "您的博客名稱",
  subtitle: "您的博客描述",
  lang: "zh-CN", // 或 "en"、"ja" 等
  themeColor: {
    hue: 210, // 0-360，主題色調
    fixed: false, // 隱藏主題色選擇器
  },
  banner: {
    enable: true,
    src: ["assets/banner/1.webp"], // 橫幅圖片
    carousel: {
      enable: true,
      interval: 0.8, // 秒
    },
  },
};
```

### 📱 特色頁面配置

- **追番頁面：** 在 `src/pages/anime.astro` 中編輯動畫列表
- **友鏈頁面：** 在 `src/content/spec/friends.md` 中編輯朋友數據
- **日記頁面：** 在 `src/pages/diary.astro` 中編輯動態
- **關於頁面：** 在 `src/content/spec/about.md` 中編輯內容

### 📦 代碼內容分離 (可選)

Mizuki 支持將代碼和內容分成兩個獨立的倉庫管理,適合團隊協作和大型項目。

**快速選擇**:

| 使用場景               | 配置方式                        | 適合人羣           |
| ---------------------- | ------------------------------- | ------------------ |
| 🆕 **本地模式** (默認) | 不配置,直接使用                 | 新手、個人博客     |
| 🔧 **分離模式**        | 設置 `ENABLE_CONTENT_SYNC=true` | 團隊協作、私有內容 |

**一鍵啓用/禁用**:

```bash
# 方式 1: 本地模式 (推薦新手)
# 不創建 .env 文件,直接運行
pnpm dev

# 方式 2: 內容分離模式
# 1. 複製配置文件
cp .env.example .env

# 2. 編輯 .env,啓用內容分離
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git

# 3. 同步內容
pnpm run sync-content
```

**功能特性**:

- ✅ 支持公開和私有倉庫 🔐
- ✅ 一鍵啓用/禁用,無需修改代碼
- ✅ 自動同步,開發前自動拉取最新內容

📖 **詳細配置**: [內容分離完整指南](docs/CONTENT_SEPARATION.md)  
🔄 **遷移教程**: [從單倉庫遷移到分離模式](docs/MIGRATION_GUIDE.md)  
📚 **更多文檔**: [文檔索引](docs/README.md)

## ✏️ 貢獻

我們歡迎貢獻！請隨時提交問題和拉取請求。

1. Fork 倉庫
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打開拉取請求

## 📄 許可證

本項目基於 Apache 許可證 2.0 - 查看 [LICENSE](LICENSE) 文件瞭解詳情。

### 原始項目許可證

本項目基於 [Fuwari](https://github.com/saicaca/fuwari) 開發，該項目使用 MIT 許可證。根據 MIT 許可證要求，原始版權聲明和許可聲明已包含在 LICENSE.MIT 文件中。

## 🙏 致謝

- 基於原始 [Fuwari](https://github.com/saicaca/fuwari) 模板
- 靈感來源於 [Yukina](https://github.com/WhitePaper233/yukina) - 一個美麗優雅的博客模板
- 部分設計靈感來源於 [Firefly](https://github.com/CuteLeaf/Firefly) 和 [Twilight](https://github.com/spr-aachen/Twilight) 模板
- 使用 [Pio](https://github.com/Dreamer-Paul/Pio) 實現可愛的 Live2D 看板娘插件
- 使用 [Astro](https://astro.build) 和 [Tailwind CSS](https://tailwindcss.com) 構建
- 圖標來自 [Iconify](https://iconify.design/)

### 🌸 特別感謝

- **[Fuwari](https://github.com/saicaca/fuwari)** by saicaca - 本項目所基於的原始模板。感謝您創建瞭如此漂亮且功能強大的模板。
- **[Yukina](https://github.com/WhitePaper233/yukina)** - 感謝提供設計靈感和創意，幫助塑造了這個項目。Yukina 是一個優雅的博客模板，展現了出色的設計原則和用戶體驗。
- **[Firefly](https://github.com/CuteLeaf/Firefly)** - 感謝提供優秀的佈局設計思路，雙側邊欄佈局、文章雙列網格等佈局，及部分小組件的設計與實現，讓 Mizuki 的界面更加豐富。
- **[Twilight](https://github.com/spr-aachen/Twilight)** - 感謝提供靈感和技術支持。Twilight 的動態壁紙模式切換系統、響應式設計和過渡效果顯著提升了 Mizuki 的使用體驗。

## 🍀 貢獻者

感謝以下貢獻者對本項目做出的貢獻，如有問題或建議，請提交 [Issue](https://github.com/LyraVoid/Mizuki/issues) 或 [Pull Request](https://github.com/LyraVoid/Mizuki/pulls)。

<a href="https://github.com/LyraVoid/Mizuki/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=LyraVoid/Mizuki" />
</a>

## ⭐ Star History

## [![Star History Chart](https://api.star-history.com/svg?repos=LyraVoid/Mizuki&type=Date)](https://star-history.com/#LyraVoid/Mizuki&Date)

⭐ 如果您覺得這個項目有幫助，請考慮給它一個星標!
