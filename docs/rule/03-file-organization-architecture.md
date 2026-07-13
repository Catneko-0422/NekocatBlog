# 文件組織架構規範

## 概述

本文檔定義了 Mizuki 項目的文件組織架構，確保代碼結構清晰、模塊化、易於維護。

## 核心原則

### 1. 按功能分層

目錄應該按照功能和職責進行分層，而非按技術類型。

**❌ 錯誤示例**：
```
src/
├── astro/              # 按 .astro 文件分組
├── svelte/            # 按 .svelte 文件分組
└── typescript/         # 按 .ts 文件分組
```

**✅ 正確示例**：
```
src/
├── components/         # 按 UI 功能分組
├── utils/              # 按工具功能分組
├── types/              # 按類型定義分組
└── layouts/            # 按佈局功能分組
```

### 2. 按職責分離

每個目錄應該有明確的職責範圍，避免職責重疊。

**❌ 錯誤示例**：
```
src/
├── components/
│   ├── widgets/      # Widget 組件
│   └── misc/        # 雜項組件（職責不明確）
└── helpers/            # 工具函數
    └── widget/      # Widget 工具（職責重複）
```

**✅ 正確示例**：
```
src/
├── components/
│   ├── atoms/        # 原子 UI 組件
│   ├── molecules/     # 分子 UI 組件
│   ├── organisms/     # 有機體 UI 組件
│   ├── widgets/       # 側邊欄小部件
│   └── features/      # 功能性組件
└── utils/              # 工具函數（統一定義）
```

### 3. 扁平化結構

避免過深的嵌套層級，保持結構扁平化。

**❌ 錯誤示例**：
```
src/components/widgets/sidebar/primary/left/
```

**✅ 正確示例**：
```
src/components/widgets/
```

### 4. 一致性

使用統一的命名和組織模式。

**示例**：
- 所有組件目錄都包含 `atoms/`、`molecules/`、`organisms/`
- 所有複雜組件都包含 `hooks/`、`types.ts`
- 所有工具函數都按功能分類

## 目錄結構規範

### 完整的目錄樹

```
Mizuki/
├── src/                           # 源代碼目錄
│   ├── components/              # 組件目錄
│   │   ├── atoms/            # 原子組件（基礎 UI 元素）
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   ├── Input.astro
│   │   │   ├── Badge.astro
│   │   │   ├── Chip.astro
│   │   │   ├── Avatar.astro
│   │   │   ├── Icon.astro
│   │   │   ├── Modal.astro
│   │   │   └── Tabs.astro
│   │   │
│   │   ├── molecules/         # 分子組件（由原子組件組合）
│   │   │   ├── SearchBar.astro
│   │   │   ├── Pagination.astro
│   │   │   ├── DropdownMenu.astro
│   │   │   ├── FormItem.astro
│   │   │   └── ChipCloud.astro
│   │   │
│   │   ├── organisms/         # 有機體組件（複雜業務組件）
│   │   │   ├── Navbar.astro
│   │   │   ├── Sidebar.astro
│   │   │   ├── Footer.astro
│   │   │   ├── MusicPlayer/       # 複雜組件的子目錄
│   │   │   │   ├── MusicPlayer.astro
│   │   │   │   ├── MiniPlayer.svelte
│   │   │   │   ├── ExpandedPlayer.svelte
│   │   │   │   ├── controls/
│   │   │   │   ├── hooks/
│   │   │   │   └── types.ts
│   │   │   ├── Calendar/          # 複雜組件的子目錄
│   │   │   │   ├── Calendar.astro
│   │   │   │   ├── CalendarGrid.svelte
│   │   │   │   ├── CalendarHeader.svelte
│   │   │   │   ├── hooks/
│   │   │   │   └── utils/
│   │   │   └── TOC/
│   │   │
│   │   ├── widgets/           # 側邊欄小部件
│   │   │   ├── Profile.astro
│   │   │   ├── Calendar.astro
│   │   │   ├── Categories.astro
│   │   │   ├── Tags.astro
│   │   │   ├── SiteStats.astro
│   │   │   ├── Announcement.astro
│   │   │   └── common/          # 通用小部件組件
│   │   │       ├── WidgetLayout.astro
│   │   │       └── WidgetHeader.astro
│   │   │
│   │   ├── features/          # 功能性組件
│   │   │   ├── comment/          # 評論功能
│   │   │   ├── search/           # 搜索功能
│   │   │   ├── protection/       # 密碼保護
│   │   │   └── media/            # 媒體相關
│   │   │
│   │   ├── layouts/          # 佈局組件
│   │   │   ├── MainLayout.astro
│   │   │   ├── PostLayout.astro
│   │   │   └── PageLayout.astro
│   │   │
│   │   └── misc/             # 雜項組件（待整理）
│   │
│   ├── layouts/               # 頁面佈局
│   │   ├── Layout.astro
│   │   └── BlogPost.astro
│   │
│   ├── pages/                # 頁面路由
│   │   ├── index.astro
│   │   ├── posts/
│   │   │   ├── [slug].astro
│   │   │   └── index.astro
│   │   ├── albums/
│   │   ├── friends/
│   │   ├── projects/
│   │   ├── skills/
│   │   └── api/
│   │
│   ├── utils/                # 工具函數
│   │   ├── content-utils.ts
│   │   ├── date-utils.ts
│   │   ├── url-utils.ts
│   │   ├── string-utils.ts
│   │   └── widgetManager.ts
│   │
│   ├── types/                # 類型定義
│   │   ├── config.ts
│   │   └── api.ts
│   │
│   ├── constants/            # 常量
│   │   ├── index.ts
│   │   ├── theme.ts
│   │   └── routes.ts
│   │
│   ├── assets/               # 靜態資源
│   │   ├── images/
│   │   │   ├── home/
│   │   │   └── icons/
│   │   ├── fonts/
│   │   └── styles/
│   │
│   ├── styles/               # 全局樣式
│   │   ├── global.css
│   │   ├── theme.css
│   │   └── components.css
│   │
│   ├── i18n/                # 國際化
│   │   ├── i18nKey.ts
│   │   ├── translation.ts
│   │   └── languages/
│   │       ├── zh-CN.ts
│   │       ├── en.ts
│   │       └── ja.ts
│   │
│   ├── data/                # 數據文件
│   │   ├── friends.ts
│   │   └── projects.ts
│   │
│   ├── scripts/              # 腳本文件
│   │   ├── build.ts
│   │   └── deploy.ts
│   │
│   ├── plugins/              # Astro 插件
│   │   └── expressive-code/
│   │
│   ├── config.ts             # 主配置文件
│   ├── content.config.ts    # 內容集合配置
│   ├── env.d.ts             # 環境類型定義
│   └── global.d.ts          # 全局類型定義
│
├── public/                       # 公共靜態文件
│   ├── assets/              # 靜態資源
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   ├── favicon.ico
│   └── robots.txt
│
├── docs/                         # 項目文檔
│   ├── README.md
│   ├── rule/               # 開發規範
│   │   ├── README.md
│   │   ├── 01-component-architecture.md
│   │   ├── 02-component-split-guide.md
│   │   ├── 03-file-organization-architecture.md
│   │   └── IMPLEMENTATION_SUMMARY.md
│   └── image/              # 文檔圖片
│
├── demo/                         # 參考示例
│   └── Aruma/             # Aruma 主題參考
│
├── scripts/                      # 構建和部署腳本
│   ├── build.sh
│   └── deploy.sh
│
├── .vscode/                      # VS Code 配置
│   └── settings.json
│
├── .github/                      # GitHub 配置
│   └── workflows/
│       └── ci.yml
│
├── astro.config.mjs             # Astro 配置
├── tailwind.config.cjs           # Tailwind 配置
├── tsconfig.json                # TypeScript 配置
├── svelte.config.js             # Svelte 配置
├── package.json                 # 依賴管理
├── pnpm-lock.yaml              # 依賴鎖定
├── pnpm-workspace.yaml        # PNPM 工作區
├── .env.example                 # 環境變量示例
├── .gitignore                   # Git 忽略文件
├── .prettierrc                 # Prettier 配置
├── .prettierignore              # Prettier 忽略文件
├── README.md                    # 項目說明
├── LICENSE                      # 許可證
└── _frontmatter.json            # Frontmatter 默認值
```

## 目錄職責說明

### src/components/ - 組件目錄

#### atoms/ - 原子組件

**職責**：提供基礎的、不可再分的 UI 元素。

**特點**：
- 職責單一
- 無業務邏輯
- 高度可複用
- 狀態簡單（< 3 個變量）

**包含文件**：
- `Button.astro` - 按鈕
- `Card.astro` - 卡片容器
- `Input.astro` - 輸入框
- `Badge.astro` - 徽章
- `Chip.astro` - Chip 標籤
- `Avatar.astro` - 頭像
- `Icon.astro` - 圖標
- `Modal.astro` - 模態框
- `Tabs.astro` - 標籤頁

**使用場景**：
```astro
---
import Button from '../atoms/Button.astro'
import Input from '../atoms/Input.astro'
---

<form>
  <Input name="username" placeholder="用戶名" />
  <Button variant="primary">提交</Button>
</form>
```

#### molecules/ - 分子組件

**職責**：由多個原子組件組合而成的小型功能組件。

**特點**：
- 包含 2-5 個原子組件
- 有簡單的交互邏輯
- 仍然保持高度可複用性

**包含文件**：
- `SearchBar.astro` - 搜索欄（Input + Button）
- `Pagination.astro` - 分頁（多個 Button）
- `DropdownMenu.astro` - 下拉菜單（Button + Card）
- `FormItem.astro` - 表單項（Label + Input + Error）
- `ChipCloud.astro` - 標籤雲（多個 Chip）

**使用場景**：
```astro
---
import SearchBar from '../molecules/SearchBar.astro'
---

<SearchBar
  placeholder="搜索文章..."
  onSearch={(query) => navigate(`/search?q=${query}`)}
/>
```

#### organisms/ - 有機體組件

**職責**：複雜的業務組件，由多個分子組件和原子組件組合。

**特點**：
- 包含複雜的業務邏輯
- 可能有多個子組件
- 專門用於特定的頁面或功能
- 可能需要拆分爲子目錄

**包含文件**：
- `Navbar.astro` - 導航欄
- `Sidebar.astro` - 側邊欄
- `Footer.astro` - 頁腳
- `MusicPlayer/` - 音樂播放器（複雜組件）
- `Calendar/` - 日曆（複雜組件）
- `TOC/` - 目錄

**複雜組件的子目錄結構**：
```
MusicPlayer/
├── MusicPlayer.astro        # 主容器（組合層）
├── MiniPlayer.svelte        # 迷你播放器 UI
├── ExpandedPlayer.svelte    # 展開播放器 UI
├── PlaylistPanel.svelte      # 播放列表 UI
├── controls/               # 控制組件
│   ├── PlayControls.svelte
│   ├── ProgressBar.svelte
│   └── VolumeControl.svelte
├── hooks/                 # 相關 Hooks
│   ├── useAudio.ts
│   ├── usePlaylist.ts
│   └── useVolume.ts
├── types.ts               # 類型定義
└── utils/                 # 工具函數
```

#### widgets/ - 側邊欄小部件

**職責**：側邊欄的小功能模塊。

**特點**：
- 相對獨立的功能模塊
- 可配置的顯示位置
- 統一的 UI 風格
- 使用通用容器組件

**包含文件**：
- `Profile.astro` - 個人資料
- `Calendar.astro` - 日曆
- `Categories.astro` - 分類
- `Tags.astro` - 標籤
- `SiteStats.astro` - 站點統計
- `Announcement.astro` - 公告
- `common/` - 通用小部件組件
  - `WidgetLayout.astro` - 通用小部件容器
  - `WidgetHeader.astro` - 通用小部件頭部

**使用場景**：
```astro
---
import WidgetLayout from './common/WidgetLayout.astro'
import ChipCloud from '../molecules/ChipCloud.astro'

const categories = await getCategories()
---

<WidgetLayout name="分類" icon="material-symbols:category">
  <ChipCloud items={categories} hrefPrefix="/category/" />
</WidgetLayout>
```

#### features/ - 功能性組件

**職責**：特定功能的組件集合。

**子目錄**：
- `comment/` - 評論相關
  - `Twikoo.astro`
  - `index.astro`
- `search/` - 搜索相關
  - `Search.svelte`
  - `SearchModal.astro`
- `protection/` - 密碼保護
  - `PasswordProtection.astro`
  - `EncryptionService.ts`
- `media/` - 媒體相關
  - `MusicPlayer.svelte`
  - `ImageGallery.astro`

#### layouts/ - 佈局組件

**職責**：頁面級別的佈局組件。

**包含文件**：
- `MainLayout.astro` - 主佈局
- `PostLayout.astro` - 文章佈局
- `PageLayout.astro` - 頁面佈局

#### misc/ - 雜項組件

**職責**：不符合上述分類的臨時組件。

**說明**：此目錄用於存放待整理的組件，應該逐步遷移到合適的分類。

**包含文件**：
- `AnimationTest.astro`
- `FullscreenWallpaper.astro`
- `ImageWrapper.astro`
- `Markdown.astro`
- `SharePoster.svelte`

**遷移目標**：
- `AnimationTest.astro` → 刪除或移到 `organisms/`
- `FullscreenWallpaper.astro` → `features/media/`
- `ImageWrapper.astro` → `atoms/`
- `Markdown.astro` → `organisms/` 或 `features/media/`
- `SharePoster.svelte` → `features/media/`

### src/layouts/ - 頁面佈局

**職責**：定義頁面的整體結構。

**包含文件**：
- `Layout.astro` - 主佈局（所有頁面共享）
- `BlogPost.astro` - 文章頁面佈局

**使用場景**：
```astro
---
import MainLayout from '../layouts/Layout.astro'
---

<MainLayout title="文章標題">
  <article>
    <!-- 文章內容 -->
  </article>
</MainLayout>
```

### src/pages/ - 頁面路由

**職責**：定義頁面的路由結構。

**組織方式**：
- 按功能分組（posts、albums、friends 等）
- 使用 `[slug]` 等動態路由
- `api/` 子目錄用於 API 路由

**目錄結構**：
```
pages/
├── index.astro              # 首頁
├── posts/                  # 文章頁面
│   ├── index.astro         # 文章列表
│   └── [slug].astro       # 文章詳情（動態路由）
├── albums/                 # 相冊頁面
│   ├── index.astro         # 相冊列表
│   └── [id].astro          # 相冊詳情
├── friends/                # 友鏈頁面
│   └── index.astro
├── projects/               # 項目頁面
│   └── index.astro
├── skills/                 # 技能頁面
│   └── index.astro
├── api/                    # API 路由
│   ├── search.ts
│   └── sitemap.xml.ts
└── [...slug].astro          # 404 頁面
```

### src/utils/ - 工具函數

**職責**：提供可複用的工具函數。

**包含文件**：
- `content-utils.ts` - 內容相關工具
- `date-utils.ts` - 日期相關工具
- `url-utils.ts` - URL 相關工具
- `string-utils.ts` - 字符串相關工具
- `widgetManager.ts` - Widget 管理器

**命名規範**：
- 按功能分類（content、date、url 等）
- 使用 `*-utils.ts` 後綴
- 導出時使用命名空間避免衝突

**示例**：
```typescript
// content-utils.ts
export async function getCategories() { }
export async function getTags() { }
export async function getPosts() { }

// 使用時
import { getCategories, getTags, getPosts } from '@/utils/content-utils'
```

### src/types/ - 類型定義

**職責**：集中管理 TypeScript 類型定義。

**包含文件**：
- `config.ts` - 配置類型
- `api.ts` - API 類型
- `components.ts` - 組件 Props 類型（可選）

**示例**：
```typescript
// types/config.ts
export interface SiteConfig {
  title: string
  subtitle: string
  siteURL: string
  themeColor: ThemeColorConfig
  // ...
}

export interface ThemeColorConfig {
  hue: number
  fixed: boolean
}
```

### src/constants/ - 常量

**職責**：集中管理常量。

**包含文件**：
- `index.ts` - 主常量導出
- `theme.ts` - 主題相關常量
- `routes.ts` - 路由常量

**示例**：
```typescript
// constants/routes.ts
export const ROUTES = {
  HOME: '/',
  POSTS: '/posts',
  ALBUMS: '/albums',
  FRIENDS: '/friends',
} as const

// 使用時
import { ROUTES } from '@/constants/routes'
navigate(ROUTES.POSTS)
```

### src/assets/ - 靜態資源

**職責**：存放源代碼中的靜態資源。

**子目錄**：
- `images/` - 圖片
  - `home/` - 首頁圖片
  - `icons/` - 圖標
- `fonts/` - 字體文件
- `styles/` - 樣式文件（如全局 CSS）

**注意**：構建時會複製到 `public/` 目錄。

### src/styles/ - 全局樣式

**職責**：定義全局樣式和主題。

**包含文件**：
- `global.css` - 全局樣式
- `theme.css` - 主題樣式
- `components.css` - 組件樣式（可選）

**使用場景**：
```astro
---
import '../styles/global.css'
import '../styles/theme.css'
---

<html>
  <head>
    <link rel="stylesheet" href="/styles/theme.css" />
  </head>
</html>
```

### src/i18n/ - 國際化

**職責**：管理多語言支持。

**包含文件**：
- `i18nKey.ts` - i18n 鍵定義
- `translation.ts` - i18n 核心函數
- `languages/` - 語言文件
  - `zh-CN.ts` - 簡體中文
  - `en.ts` - 英文
  - `ja.ts` - 日文

**使用場景**：
```typescript
import { i18n } from '@/i18n/translation'
import I18nKey from '@/i18n/i18nKey'

const title = i18n(I18nKey.homePage)
```

### src/data/ - 數據文件

**職責**：存放靜態數據文件。

**包含文件**：
- `friends.ts` - 友鏈數據
- `projects.ts` - 項目數據
- `skills.ts` - 技能數據

**示例**：
```typescript
// data/friends.ts
export interface Friend {
  name: string
  url: string
  avatar: string
  description: string
}

export const friends: Friend[] = [
  {
    name: 'Friend Name',
    url: 'https://example.com',
    avatar: '/assets/friends/avatar.png',
    description: 'Description'
  }
]
```

## 文件命名規範

### 組件文件

#### Astro 組件

**格式**：`PascalCase.astro`

**示例**：
- `Button.astro`
- `SearchBar.astro`
- `MusicPlayer.astro`

**功能模塊後綴**：
- `SearchModule.astro` - 搜索功能模塊
- `QRCodeModule.astro` - 二維碼功能模塊

**容器組件後綴**：
- `SidebarContainer.astro` - 側邊欄容器
- `WidgetContainer.astro` - Widget 容器

#### Svelte 組件

**格式**：`PascalCase.svelte`

**示例**：
- `MusicPlayer.svelte`
- `ChipCloud.svelte`
- `ProfileCard.svelte`

### 工具函數文件

**格式**：`[功能]-utils.ts`

**示例**：
- `content-utils.ts`
- `date-utils.ts`
- `url-utils.ts`
- `string-utils.ts`

### 類型定義文件

**格式**：`[主題].ts`

**示例**：
- `config.ts` - 配置類型
- `api.ts` - API 類型
- `components.ts` - 組件類型

### 常量文件

**格式**：`[主題].ts`

**示例**：
- `theme.ts` - 主題常量
- `routes.ts` - 路由常量
- `api.ts` - API 端點常量

### 頁面文件

#### 靜態路由

**格式**：`[name].astro`

**示例**：
- `index.astro` - 首頁
- `about.astro` - 關於頁面
- `contact.astro` - 聯繫頁面

#### 動態路由

**格式**：`[param].astro`

**示例**：
- `[slug].astro` - 文章詳情
- `[id].astro` - 相冊詳情

#### 集合路由

**格式**：`[...catch-all].astro`

**示例**：
- `[...slug].astro` - 404 頁面
- `[...path].astro` - 動態路徑匹配

### 樣式文件

**格式**：`[主題].css`

**示例**：
- `global.css` - 全局樣式
- `theme.css` - 主題樣式
- `components.css` - 組件樣式

### 腳本文件

**格式**：`[功能].[ext]`

**示例**：
- `build.ts` - 構建腳本
- `deploy.sh` - 部署腳本
- `setup.ts` - 初始化腳本

### 文檔文件

**格式**：`[主題].md`

**示例**：
- `README.md` - 項目說明
- `CONTRIBUTING.md` - 貢獻指南
- `ARCHITECTURE.md` - 架構文檔

### 配置文件

**格式**：`[工具].config.[ext]`

**示例**：
- `astro.config.mjs` - Astro 配置
- `tailwind.config.cjs` - Tailwind 配置
- `tsconfig.json` - TypeScript 配置

## 模塊化組織原則

### 1. 單一職責

每個模塊（文件或目錄）應該只有一個明確的職責。

**示例**：

✅ **正確**：
```typescript
// content-utils.ts - 只負責內容相關工具
export function getPosts() { }
export function getCategories() { }
export function getTags() { }
```

❌ **錯誤**：
```typescript
// utils.ts - 職責過多
export function getPosts() { }        // 內容相關
export function formatDate() { }        // 日期相關
export function buildUrl() { }          // URL 相關
export function validateEmail() { }      // 驗證相關
```

### 2. 按功能分組

相關的功能應該組織在同一個目錄下。

**示例**：

✅ **正確**：
```
src/components/features/
├── comment/              # 評論功能
│   ├── Twikoo.astro
│   └── index.astro
├── search/               # 搜索功能
│   ├── Search.svelte
│   └── SearchModal.astro
└── protection/           # 保護功能
    ├── PasswordProtection.astro
    └── EncryptionService.ts
```

❌ **錯誤**：
```
src/components/
├── Twikoo.astro          # 評論組件
├── Search.svelte          # 搜索組件
├── PasswordProtection.astro # 保護組件
└── EncryptionService.ts   # 服務
```

### 3. 避免循環依賴

模塊之間應該避免循環依賴。

**示例**：

❌ **錯誤**：
```typescript
// ModuleA.ts
import { something } from './ModuleB'

// ModuleB.ts
import { somethingElse } from './ModuleA'
```

✅ **正確**：
```typescript
// ModuleA.ts
import { Shared } from './Shared'

// ModuleB.ts
import { Shared } from './Shared'
```

### 4. 清晰的導出接口

模塊應該提供清晰的導出接口。

**示例**：

✅ **正確**：
```typescript
// content-utils.ts
export interface Post {
  id: string
  title: string
  slug: string
}

export async function getPosts(): Promise<Post[]> { }
export async function getPost(id: string): Promise<Post> { }
```

✅ **正確（默認導出）**：
```typescript
// widgetManager.ts
export default class WidgetManager { }
export { WidgetManager }
```

### 5. 命名空間組織

避免命名衝突，使用命名空間。

**示例**：

✅ **正確**：
```typescript
// content-utils.ts
export const getPosts = () => { }

// date-utils.ts
export const formatDate = () => { }

// 使用
import { getPosts } from '@/utils/content-utils'
import { formatDate } from '@/utils/date-utils'
```

❌ **錯誤**：
```typescript
// utils.ts
export const getPosts = () => { }        // 衝突
export const formatDate = () => { }      // 衝突
export const formatUrl = () => { }        // 衝突
```

## 文件依賴管理

### 1. 使用絕對路徑導入

推薦使用絕對路徑（@ 別名）導入，提高可維護性。

**tsconfig.json 配置**：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"],
      "@constants/*": ["./src/constants/*"]
    }
  }
}
```

**使用示例**：
```astro
---
// ✅ 正確：使用絕對路徑
import Button from '@components/atoms/Button.astro'
import { getPosts } from '@utils/content-utils'
import { ROUTES } from '@constants/routes'
---

// ❌ 錯誤：使用相對路徑
import Button from '../../components/atoms/Button.astro'
import { getPosts } from '../utils/content-utils'
import { ROUTES } from '../constants/routes'
---
```

### 2. 按層次導入

按照依賴層次導入，避免混亂。

**導入順序**：
1. 外部庫
2. 內部庫
3. 組件
4. 工具函數
5. 類型
6. 常量

**示例**：
```astro
---
// 1. 外部庫
import { getCollection } from 'astro:content'
import { Icon } from 'astro-icon/components'

// 2. 內部庫
import I18nKey from '@i18n/i18nKey'
import { i18n } from '@i18n/translation'

// 3. 組件
import Button from '@components/atoms/Button.astro'
import Card from '@components/atoms/Card.astro'

// 4. 工具函數
import { getPosts } from '@utils/content-utils'
import { formatDate } from '@utils/date-utils'

// 5. 類型
import type { Post } from '@types/config'

// 6. 常量
import { ROUTES } from '@constants/routes'
---
```

### 3. 避免深度嵌套導入

導入路徑不應過深。

**示例**：

❌ **錯誤**：
```astro
---
import Button from '../../../components/atoms/Button.astro'
import { getPosts } from '../../utils/content-utils'
---
```

✅ **正確**：
```astro
---
import Button from '@components/atoms/Button.astro'
import { getPosts } from '@utils/content-utils'
---
```

## 複雜組件的文件組織

### 超大型組件的子目錄結構

當組件超過 300 行或包含多個子功能時，應該創建子目錄。

**結構模板**：
```
ComponentName/
├── ComponentName.astro      # 主組件（組合層）
├── SubComponent1.svelte      # 子組件 1
├── SubComponent2.svelte      # 子組件 2
├── SubComponent3.svelte      # 子組件 3
├── controls/                 # 控制組件
│   ├── Control1.svelte
│   └── Control2.svelte
├── hooks/                   # 相關 Hooks
│   ├── useFeature1.ts
│   ├── useFeature2.ts
│   └── useFeature3.ts
├── utils/                   # 工具函數
│   └── helper.ts
├── types.ts                 # 類型定義
└── README.md                # 組件說明（可選）
```

### 實例：MusicPlayer

**目錄結構**：
```
MusicPlayer/
├── MusicPlayer.astro          # 主容器（< 50 行）
├── MiniPlayer.svelte          # 迷你播放器（~150 行）
├── ExpandedPlayer.svelte      # 展開播放器（~200 行）
├── PlaylistPanel.svelte      # 播放列表（~120 行）
├── controls/                # 控制組件
│   ├── PlayControls.svelte    # 播放控制（~80 行）
│   ├── ProgressBar.svelte     # 進度條（~100 行）
│   └── VolumeControl.svelte  # 音量控制（~60 行）
├── hooks/                  # 相關 Hooks
│   ├── useAudio.ts           # 音頻播放邏輯（~80 行）
│   ├── usePlaylist.ts        # 播放列表管理（~90 行）
│   └── useVolume.ts         # 音量控制邏輯（~50 行）
├── types.ts                # 類型定義（~40 行）
└── README.md               # 組件說明
```

**使用方式**：
```astro
---
import MusicPlayer from './MusicPlayer.astro'
---

<MusicPlayer client:visible />
```

### 實例：Calendar

**目錄結構**：
```
Calendar/
├── Calendar.astro            # 主容器（< 50 行）
├── CalendarHeader.svelte     # 頭部導航（~80 行）
├── CalendarGrid.svelte      # 日曆網格（~150 行）
├── PostList.astro          # 文章列表（~100 行）
├── hooks/                  # 相關 Hooks
│   └── useCalendar.ts      # 日曆邏輯（~120 行）
├── utils/                  # 工具函數
│   └── calendarUtils.ts    # 日期計算（~80 行）
├── types.ts                # 類型定義（~40 行）
└── README.md               # 組件說明
```

## 公共文件管理

### 1. 索引文件

使用 `index.ts` 作爲公共導出接口。

**示例**：
```typescript
// components/atoms/index.ts
export { default as Button } from './Button.astro'
export { default as Card } from './Card.astro'
export { default as Input } from './Input.astro'

// 使用
import { Button, Card, Input } from '@components/atoms'
```

### 2. README 文件

爲複雜目錄添加 README 文件。

**示例**：
```markdown
# MusicPlayer 組件

音樂播放器組件，支持播放列表、音量控制、進度管理。

## 使用方法

```astro
<MusicPlayer
  playlist={playlist}
  autoplay={false}
/>
```

## Props

- `playlist`: 播放列表
- `autoplay`: 是否自動播放
```

### 3. 類型定義文件

爲複雜組件集中定義類型。

**示例**：
```typescript
// MusicPlayer/types.ts
export interface Song {
  id: string
  title: string
  artist: string
  url: string
  duration: number
}

export interface Playlist {
  id: string
  name: string
  songs: Song[]
}

export interface MusicPlayerProps {
  playlist: Playlist
  autoplay?: boolean
}
```

## 與 Aruma 的對比

### 文件組織對比

| 方面 | Mizuki | Aruma | 改進建議 |
|------|--------|-------|----------|
| **組件分層** | ✅ 已實現 | ✅ 完整 | 繼續完善 |
| **目錄結構** | ⚠️ 混亂 | ✅ 清晰 | 重組目錄 |
| **複雜組件** | ⚠️ 單文件 | ✅ 子目錄 | 拆分超大型組件 |
| **工具函數** | ⚠️ 分散 | ✅ 統一 | 合併工具函數 |
| **類型定義** | ⚠️ 分散 | ✅ 集中 | 統一類型定義 |
| **文檔** | ✅ 完善 | ✅ 完善 | 保持優勢 |

### Aruma 的優秀實踐

1. **清晰的組件分層**
   ```
   components/
   ├── admin/              # 管理後臺
   ├── cards/              # 卡片組件
   ├── comment/            # 評論組件
   ├── layouts/            # 佈局組件
   ├── svelte/             # Svelte 組件
   └── ui/                # UI 組件
   ```

2. **複雜組件的子目錄**
   ```
   MusicPlayer.svelte → 
   MusicPlayer/
   ├── MusicPlayer.svelte
   ├── controls/
   ├── hooks/
   └── types.ts
   ```

3. **統一的工具函數**
   ```
   lib/
   ├── utils/
   └── types/
   ```

## 遷移指南

### 從當前結構遷移到新結構

#### 步驟 1：創建新目錄

```bash
# 創建新的分層目錄
mkdir -p src/components/{atoms,molecules,organisms}
mkdir -p src/components/widgets/common
mkdir -p src/components/features/{comment,search,protection,media}
mkdir -p src/components/layouts
```

#### 步驟 2：移動文件

```bash
# 移動原子組件
mv src/components/Button.astro src/components/atoms/
mv src/components/Card.astro src/components/atoms/
mv src/components/Input.astro src/components/atoms/

# 移動小部件
mv src/components/widget/* src/components/widgets/
mv src/components/widget/common src/components/widgets/common

# 移動功能組件
mv src/components/comment src/components/features/
mv src/components/control src/components/molecules/
```

#### 步驟 3：更新導入路徑

```bash
# 查找所有導入
grep -r "from.*components" src/pages src/layouts

# 批量更新路徑
# 使用編輯器或腳本批量替換
```

#### 步驟 4：測試

```bash
# 運行構建檢查錯誤
pnpm run build

# 運行開發服務器測試
pnpm run dev

# 檢查 Lint
pnpm run lint

# 檢查類型
pnpm run typecheck
```

### 重構 Checklist

- [ ] 創建新的目錄結構
- [ ] 移動文件到對應的分類
- [ ] 更新所有導入路徑
- [ ] 重命名文件以符合命名規範
- [ ] 拆分超大型組件
- [ ] 合併重複的工具函數
- [ ] 統一類型定義
- [ ] 添加 README 文件
- [ ] 更新文檔
- [ ] 運行測試驗證

## 最佳實踐

### 1. 定期整理

定期檢查和整理文件結構，保持清晰。

**檢查項**：
- 是否有過時的文件？
- 是否有重複的代碼？
- 是否有職責不清的目錄？
- 是否需要拆分大型組件？

### 2. 使用工具

使用工具輔助文件管理。

**推薦工具**：
- **目錄樹**：`tree src/`
- **文件搜索**：`find src/ -name "*.astro"`
- **代碼統計**：`wc -l src/components/*.astro`
- **重複檢測**：使用 IDE 插件

### 3. 文檔同步

文件結構變更後及時更新文檔。

**更新內容**：
- 目錄結構圖
- 使用示例
- 遷移指南

### 4. 代碼審查

在代碼審查時檢查文件組織。

**審查要點**：
- [ ] 文件放在正確的目錄
- [ ] 文件名符合命名規範
- [ ] 導入路徑正確
- [ ] 沒有循環依賴

## 常見問題

### Q1: 如何處理臨時文件？

**A**：使用臨時目錄或添加 TODO 註釋。

**示例**：
```typescript
// TODO: 遷移到 atoms/
// TODO: 拆分爲子組件
```

### Q2: 何時拆分爲子目錄？

**A**：當組件滿足以下條件時：
- 組件 > 300 行
- 有 3+ 個子功能
- 需要多個輔助文件

### Q3: 如何處理共享的組件？

**A**：使用公共目錄或提取到更高層次。

**示例**：
```
src/components/
├── atoms/              # 共享的原子組件
├── widgets/common/      # 共享的 Widget 組件
└── organisms/          # 使用共享組件
```

### Q4: 如何命名相似功能的文件？

**A**：使用統一的前綴或後綴。

**示例**：
- `Calendar.astro` - 主組件
- `CalendarHeader.svelte` - 頭部
- `CalendarGrid.svelte` - 網格
- `CalendarUtils.ts` - 工具函數

## 總結

良好的文件組織架構是項目成功的關鍵：

✅ **清晰的職責分離** - 每個目錄有明確的職責
✅ **統一的命名規範** - 易於理解和導航
✅ **合理的依賴管理** - 避免循環依賴
✅ **模塊化的組織** - 易於維護和擴展

遵循本規範可以：
1. 提高代碼可讀性
2. 減少維護成本
3. 提升開發效率
4. 降低新手上手難度

---

**最後更新**: 2026-03-17
**維護者**: Mizuki 開發團隊

## 參考資源

- [組件架構設計規範](./01-component-architecture.md)
- [組件拆分指南](./02-component-split-guide.md)
- [Aruma 文件組織](../../demo/Aruma/docs/)
- [Astro 項目結構](https://docs.astro.build/zh-cn/core-concepts/project-structure/)
