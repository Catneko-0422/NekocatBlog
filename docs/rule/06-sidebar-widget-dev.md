# 側欄組件開發指南

> 本文檔用於規範側欄相關組件的開發流程，避免出現"配置了組件但頁面不顯示"的遺漏。

## 適用範圍

- 新增或重構側欄組件（如 `music-sidebar`、自定義統計組件等）
- 調整 `sidebarLayoutConfig` 中的組件佈局
- 在左側欄、右側欄、抽屜側欄中複用同一組件

---

## 接入步驟：3 步缺一不可

### 步驟 1：在類型系統中聲明組件類型

文件：`src/types/config.ts`

在 `WidgetComponentType` 中新增類型枚舉：

```ts
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "toc"
	| "music-player"
	| "music-sidebar" // ✅ 新增類型
	| "pio"
	| "site-stats"
	| "calendar"
	| "custom";
```

> **規則**：所有側欄組件必須先在 `WidgetComponentType` 中聲明。缺少此步 TS 編譯不通過，配置也無意義。

---

### 步驟 2：在 `sidebarLayoutConfig` 中配置佈局

文件：`src/config.ts`

使用 `SidebarLayoutConfig.components` 來控制組件出現的位置和順序：

```ts
export const sidebarLayoutConfig: SidebarLayoutConfig = {
	properties: [
		{
			type: "music-sidebar",
			position: "sticky",
			class: "onload-animation",
			animationDelay: 100,
		},
		// ... 其他組件
	],
	components: {
		left: ["profile", "announcement", "categories", "tags"],
		right: ["site-stats", "calendar", "music-sidebar"], // 在右側欄顯示
		drawer: [
			"profile",
			"announcement",
			"music-sidebar",
			"categories",
			"tags",
		],
	},
	// ...
};
```

> **規則**：
> - `properties` 定義組件的"存在性"、位置（top / sticky）、動畫等屬性
> - `components.left / right / drawer` 定義在不同側欄中"展示哪些組件、按什麼順序"

---

### 步驟 3：在所有側欄渲染器中註冊組件（最容易忘記）

這是最常出錯的步驟。側欄渲染依賴**手動的 componentMap**，若未註冊則對應類型會被靜默忽略。

請務必檢查以下 **3 個文件**：

#### 3.1 左側欄：`src/components/widgets/sidebar/SideBar.astro`

```ts
import { MusicSidebarWidget } from "../music-sidebar";

const componentMap: Record<string, unknown> = {
	profile: Profile,
	announcement: Announcement,
	categories: Categories,
	tags: Tags,
	toc: SidebarTOC,
	"music-player": MusicPlayer,
	"music-sidebar": MusicSidebarWidget, // ✅ 必須註冊
	"site-stats": SiteStats,
	calendar: Calendar,
};
```

#### 3.2 右側欄：`src/components/layout/RightSideBar.astro`

```ts
import { MusicSidebarWidget } from "@/components/widgets/music-sidebar";

const componentMap: Record<string, unknown> = {
	profile: Profile,
	announcement: Announcement,
	categories: Categories,
	tags: Tags,
	toc: SidebarTOC,
	"music-player": MusicPlayer,
	"music-sidebar": MusicSidebarWidget, // ✅ 必須註冊（與左側欄獨立）
	"site-stats": SiteStats,
	calendar: Calendar,
};
```

#### 3.3 抽屜側欄：`src/components/widgets/sidebar/SideBar.astro`

抽屜側欄與左側欄共用同一個文件 `SideBar.astro`，確認 3.1 的註冊已覆蓋抽屜。

> **典型遺漏**：只在 `SideBar.astro`（左側欄）中註冊了組件，卻忘記在 `RightSideBar.astro`（右側欄）中註冊。導致在 `sidebarLayoutConfig.components.right` 中添加了組件但右側欄始終不顯示。

---

## 常見問題排查

### Q1：配置了組件但頁面不顯示

請按以下順序排查：

1. `src/types/config.ts` 中的 `WidgetComponentType` 是否包含該類型？
2. `src/config.ts` 中 `sidebarLayoutConfig.components` 的對應數組是否包含該類型？
3. 對應側欄渲染器的 `componentMap` 是否註冊了該類型？
4. 該側欄在當前設備寬度下是否被響應式邏輯隱藏了？
5. 組件自身是否有 `enable` 配置導致不渲染？

### Q2：音樂播放器配置說明

音樂播放器有以下配置選項（位於 `musicPlayerConfig`）：

| 配置項 | 類型 | 說明 |
|--------|------|------|
| `enable` | boolean | 控制音樂核心是否初始化。爲 `false` 時，懸浮 UI 和側欄均不工作 |
| `showFloatingPlayer` | boolean | 控制懸浮播放器 UI 是否顯示。爲 `false` 時僅側欄可用 |
| `mode` | "meting" \| "local" | 播放列表數據來源 |
| `meting_api` | string | Meting API 地址 |
| `id` | string | 歌單 ID |
| `server` | string | 音樂源服務器 |
| `type` | string | 播單類型 |

**驗證場景**：
- `enable=true, showFloatingPlayer=true` — 全功能，懸浮 UI 和側欄均可用
- `enable=true, showFloatingPlayer=false` — 僅側欄可用，懸浮 UI 不顯示
- `enable=false` — 音樂核心不初始化，懸浮 UI 和側欄均不工作

**注意**：`music-sidebar` 側欄組件依賴 `musicPlayerStore` 運行，當 `enable=false` 時側欄也無法工作。

### Q3：只在左側欄顯示，右側欄不顯示

請檢查 `RightSideBar.astro` 的 `componentMap` 是否包含該組件類型。左側欄註冊了不等於右側欄也自動註冊。

### Q4：組件在 SSR 時報錯 `window is not defined`

**原因**：Svelte 組件在服務端渲染階段訪問了 `window` 對象。

**解法**：在 Astro 中使用 `client:only` 指令禁止服務端渲染：

```astro
<!-- ❌ 錯誤：服務端仍會渲染組件 -->
<MyComponent client:idle />

<!-- ✅ 正確：只在瀏覽器執行 -->
<MyComponent client:only="svelte" />
```

### Q5：多個側欄需要各自獨立的狀態

若同一組件在多個側欄實例中需要獨立狀態（如側欄播放列表的展開/收起狀態），該狀態應存在**組件自身**，而非共享全局狀態。

---

## 代碼審查檢查清單

在代碼審查時，必須檢查：

- [ ] `src/types/config.ts` 的 `WidgetComponentType` 中已聲明新組件類型
- [ ] `src/config.ts` 的 `sidebarLayoutConfig.components` 中已配置該組件
- [ ] `SideBar.astro`（左側欄 + 抽屜）的 `componentMap` 中已註冊
- [ ] `RightSideBar.astro`（右側欄）的 `componentMap` 中已註冊
- [ ] Svelte 組件使用了正確的 `client:*` 指令（避免 SSR window 錯誤）
- [ ] 組件自身的功能開關（如 `enable`、`showFloatingPlayer`）已正確配置

---

## 配置文件速查表

| 文件 | 作用 | 必須操作 |
|------|------|----------|
| `src/types/config.ts` | 類型聲明 | 在 `WidgetComponentType` 中新增枚舉 |
| `src/config.ts` | 佈局配置 | 在 `sidebarLayoutConfig.components` 中添加組件 |
| `src/components/widgets/sidebar/SideBar.astro` | 左側欄渲染 | 在 `componentMap` 中註冊 |
| `src/components/layout/RightSideBar.astro` | 右側欄渲染 | 在 `componentMap` 中註冊（獨立於左側欄） |
