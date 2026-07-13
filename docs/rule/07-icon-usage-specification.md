# 圖標使用規範 (Icon Usage Specification)

## 1. 圖標系統架構總覽

本項目基於 [Iconify](https://iconify.design/) 生態系統，根據文件類型和運行場景，存在 **3 種標準化的圖標使用方式**：

| # | 使用方式 | 屬性名 | 導入來源 | 適用文件類型 | 運行時機 |
|---|---------|--------|---------|-------------|---------|
| ① | `<Icon name="...">` | `name` | `astro-icon/components` | `.astro` 靜態組件/頁面 | 構建時 (SSR) |
| ② | `<Icon icon="...">` | `icon` | `@iconify/svelte` | `.svelte` 客戶端組件 | 客戶端運行時 (CSR) |
| ③ | `<Icon icon="...">` | `icon` | 自定義 `@components/misc/Icon.astro` | `.astro`（需 loading 狀態） | 構建時 + 客戶端 |

> **禁止在業務代碼中直接使用原生 `<iconify-icon>` 標籤。**

---

## 2. 各方式的詳細說明

### 2.1 方式一：astro-icon（`.astro` 文件首選）

```astro
---
import { Icon } from "astro-icon/components";
---

<Icon name="material-symbols:arrow-back" class="text-base" />
<Icon name={dynamicIconName} class="text-xl" />
```

- **屬性**: `name`
- **底層庫**: [`astro-icon`](package.json) v^1.1.5
- **特點**: Astro 社區集成，構建時優化圖標引用
- **適用場景**: 所有 `.astro` 頁面和組件中的常規圖標

### 2.2 方式二：@iconify/svelte（`.svelte` 文件唯一選擇）

```svelte
<script lang="ts">
	import Icon from "@iconify/svelte";
</script>

<Icon icon="material-symbols:pause" class="text-xl" />
<Icon icon={dynamicIcon} class="text-lg" />
```

- **屬性**: `icon`
- **底層庫**: [`@iconify/svelte`](package.json) v^5.2.1
- **特點**: Iconify 官方 Svelte 組件，客戶端動態渲染
- **適用場景**: 所有 `.svelte` 組件

### 2.3 方式三：自定義 Icon 組件（增強封裝）

```astro
---
import Icon from "../../misc/Icon.astro";
---

<Icon icon="mdi:react" size="lg" color="#61DAFB" fallback="⚛" />
```

- **屬性**: `icon`, `size`, `color`, `fallback`, `loading`
- **實現位置**: [`src/components/atoms/Icon/Icon.astro`](../../src/components/atoms/Icon/Icon.astro)
- **包裝器**: [`src/components/misc/Icon.astro`](../../src/components/misc/Icon.astro)
- **特點**: 內置 loading 狀態、fallback 佔位、尺寸系統、顏色控制
- **適用場景**: 需要 loading 狀態管理或 fallback 的場景

---

## 3. `name` vs `icon` 差異根因

這是兩個不同庫的 API 設計差異，**不是同一組件的兩個屬性選項**：

| 維度 | `astro-icon` (`name`) | `@iconify/svelte` / `iconify-icon` (`icon`) |
|------|---------------------|-------------------------------------------|
| **API 標準歸屬** | Astro 社區第三方集成 | Iconify 官方標準 API |
| **設計理念** | 模仿 Astro Image 組件命名約定 | 遵循 Iconify 全生態統一規範 |
| **運行階段** | 構建時處理 (SSR) | 瀏覽器端渲染 (CSR) |
| **性能特徵** | 可內聯 SVG，減少網絡請求 | 從 CDN 按需加載圖標數據 |
| **跨框架支持** | 僅限 Astro | 支持 React/Vue/Svelte/Web Component |

---

## 4. 尺寸對照表

將原生的 `width`/`height` 屬性轉換爲 CSS 類：

| 原生寫法 | 替代 CSS 類 | Tailwind 等效 |
|---------|------------|-------------|
| `width="10" height="10"` | `w-2.5 h-2.5 text-[0.625rem]` | 最小圖標（節點等） |
| `width="14" height="14"` | `w-3.5 h-3.5 text-xs` | 元信息圖標（日期、位置） |
| `width="16" height="16"` | `w-4 h-4 text-base` | 行內小圖標（標籤、按鈕內） |
| `width="20" height="20"` | `text-lg` | 卡片頭部圖標 |
| `width="48" height="48"` | `text-5xl` | 佔位大圖標 |
| `width="64" height="64"` | `text-6xl` | 空狀態佔位圖標 |

> **推薦優先使用 Tailwind 的 `text-*` 或 `w-* h-*` 類來控制圖標大小**，而非原生 `width`/`height` 屬性。

---

## 5. 決策流程圖

```
編寫新代碼需要添加圖標？
        │
        ├── 文件是 .svelte？
        │     └── 是 → import Icon from "@iconify/svelte"
        │            → <Icon icon="..." />
        │
        └── 文件是 .astro？
              ├── 需要 loading/fallback 狀態？
              │     └── 是 → import Icon from "@components/misc/Icon.astro"
              │            → <Icon icon="..." size="..." fallback="..." />
              │
              └── 否 → import { Icon } from "astro-icon/components"
                     → <Icon name="..." />
```

---

## 6. 常見錯誤與修正

### 錯誤 1：屬性名混用（已修復）

```svelte
<!-- ❌ 錯誤：@iconify/svelte 不認識 name 屬性 -->
import Icon from "@iconify/svelte";
<Icon name="material-symbols:xxx" />

<!-- ✅ 正確 -->
import Icon from "@iconify/svelte";
<Icon icon="material-symbols:xxx" />
```

### 錯誤 2：直接使用原生標籤（已統一修復）

```astro
<!-- ❌ 已廢棄：直接使用 iconify-icon Web Component -->
<iconify-icon icon="material-symbols:xxx" width="16" height="16" />

<!-- ✅ 正確：通過 astro-icon 封裝 -->
import { Icon } from "astro-icon/components";
<Icon name="material-symbols:xxx" class="text-base w-4 h-4" />
```

### 錯誤 3：在同一文件中混合多種方式

```astro
<!-- ❌ 避免：同一文件中混用不同圖標方案 -->
<Icon name="material-symbols:a" />       <!-- astro-icon -->
<iconify-icon icon="material-symbols:b" /> <!-- 原生 -->

<!-- ✅ 正確：保持一致 -->
<Icon name="material-symbols:a" />
<Icon name="material-symbols:b" />
```

---

## 7. 項目中使用的圖標集

| 圖標集前綴 | 說明 | 使用頻率 |
|-----------|------|---------|
| `material-symbols:` | Google Material Symbols（主圖標集） | ★★★★★ 最高 |
| `fa7-solid:` / `fa7-regular:` | Font Awesome 7 | ★★☆☆☆ 低 |
| `mdi:` | Material Design Icons | ★★☆☆☆ 低 |
| `eos-icons:` | EOS Icons（loading 等） | ★☆☆☆☆ 極少 |

> 新增圖標時，**優先使用 `material-symbols:` 圖標集**以保持視覺一致性。

---

## 8. 相關文件索引

| 文件 | 角色 |
|-----|------|
| [`src/components/atoms/Icon/Icon.astro`](../../src/components/atoms/Icon/Icon.astro) | 自定義 Icon 組件核心實現 |
| [`src/components/atoms/Icon/types.ts`](../../src/components/atoms/Icon/types.ts) | 自定義 Icon Props 類型定義 |
| [`src/components/misc/Icon.astro`](../../src/components/misc/Icon.astro) | 向後兼容包裝器 |
| [`src/components/misc/IconifyLoader.astro`](../../src/components/misc/IconifyLoader.astro) | 全局 Iconify 加載器 |
| [`src/utils/icon-loader.ts`](../../src/utils/icon-loader.ts) | Iconify 加載工具類 |
| [`package.json`](../../package.json) | 依賴聲明（astro-icon, @iconify/svelte） |
