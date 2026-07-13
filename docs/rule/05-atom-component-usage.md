# 原子化組件使用規範

## 概述

本文檔規定了在開發過程中必須優先使用現有原子化組件，以及在缺少合適組件時應當創建新的原子化組件。

## 核心原則

### 黃金法則

> **在編寫新代碼前，先檢查是否存在可複用的原子化組件。如果沒有，就創建一個。**

```
❌ 錯誤：在組件中直接編寫重複的 UI 結構
✅ 正確：使用現有原子組件或創建新的原子組件
```

## 組件分層架構

項目採用原子化設計（Atomic Design），組件分爲以下層級：

```
atoms/          → 原子組件（不可再分）
├── Badge/      → 徽章、序號
├── Button/     → 按鈕
├── Chip/       → 標籤、分類
├── Icon/       → 圖標
├── Image/      → 圖片
├── Link/       → 鏈接
├── Loader/     → 加載器
└── ...

features/      → 功能組件（組合 atoms）
├── posts/      → 文章相關
├── projects/   → 項目相關
└── ...

organisms/     → 有機體組件（組合 features）
├── navigation/ → 導航
└── footer/     → 頁腳

widgets/       → 小組件（獨立功能單元）
├── sidebar/    → 側邊欄
├── profile/    → 個人資料
└── ...

misc/          → 雜項組件（通用容器）
├── ListContainer/ → 列表容器
└── ListDivider/   → 列表分隔線
```

## 現有原子組件清單

### atoms/ - 原子組件

| 組件 | 路徑 | 用途 |
|------|------|------|
| `Badge` | `atoms/Badge/` | 序號徽章、計數徽章 |
| `Button` | `atoms/Button/` | 按鈕（支持多種變體） |
| `Chip` | `atoms/Chip/` | 標籤、分類標籤 |
| `Icon` | `atoms/Icon/` | 圖標渲染 |
| `Image` | `atoms/Image/` | 圖片（支持懶加載、loading） |
| `Link` | `atoms/Link/` | 鏈接（帶圖標等） |
| `Loader` | `atoms/Loader/` | 加載動畫 |
| `tag-chip` | `atoms/tag-chip/` | 文章標籤 |

### misc/ - 通用組件

| 組件 | 路徑 | 用途 |
|------|------|------|
| `ListContainer` | `misc/ListContainer/` | 卡片容器（標題+圖標+徽章） |
| `ListDivider` | `misc/ListDivider/` | 列表分隔線 |
| `CardBase` | 全局樣式 | 卡片基礎樣式 |

## 使用決策流程

```
開始編寫新 UI
       │
       ▼
┌──────────────────────┐
│ 存在可用的原子組件？  │
└──────────────────────┘
       │
   是  │  否
   ▼   ▼
使用   考慮創建新組件
現有   │
組件   ▼
   ┌──────────────────┐
   │ 多個場景可複用？ │
   └──────────────────┘
       │
   是  │  否
   ▼   ▼
創建   直接實現
原子   但標記待重構
組件   │
       ▼
   提交 Issue
```

## 實踐指南

### 場景 1：需要顯示序號

```astro
<!-- ❌ 錯誤：直接寫死樣式 -->
<div class="w-6 h-6 rounded-md bg-enter-btn text-primary flex items-center justify-center">
    {index + 1}
</div>

<!-- ✅ 正確：使用 Badge 組件 -->
<Badge variant="number">{index + 1}</Badge>
```

### 場景 2：需要分類標籤

```astro
<!-- ❌ 錯誤：直接寫死樣式 -->
<span class="px-1.5 py-0.5 rounded bg-btn-regular-bg text-btn-content">
    {category}
</span>

<!-- ✅ 正確：使用 Chip 組件 -->
<Chip>{category}</Chip>
```

### 場景 3：需要卡片容器（標題+圖標+內容）

```astro
<!-- ❌ 錯誤：重複編寫卡片頭部 -->
<div class="card-base p-5">
    <div class="flex items-center gap-2 pb-3 border-b border-dashed">
        <Icon name="material-symbols:article" class="text-xl text-primary" />
        <span class="font-bold">標題</span>
        <span class="ml-auto text-xs px-2 py-0.5 rounded-full bg-btn-bg">標籤</span>
    </div>
    <!-- 內容 -->
</div>

<!-- ✅ 正確：使用 ListContainer 組件 -->
<ListContainer title="標題" icon="material-symbols:article" badge="標籤">
    <!-- 內容 -->
</ListContainer>
```

### 場景 4：需要列表分隔線

```astro
<!-- ❌ 錯誤：重複編寫分隔線 -->
<div class="border-b border-dashed border-line-divider"></div>

<!-- ✅ 正確：使用 ListDivider 組件 -->
<ListDivider />
```

### 場景 5：需要複用列表項佈局

```astro
<!-- ❌ 錯誤：在多個組件中重複列表項代碼 -->
<div class="flex items-center gap-3 px-3 py-3">
    <div class="w-6 h-6">...</div>
    <div class="flex-1 min-w-0">
        <div class="font-bold">{title}</div>
        <div class="text-xs text-black/30">{date}</div>
    </div>
    <Icon name="chevron-right" />
</div>

<!-- ✅ 正確：創建 PostListItem 組件 -->
<PostListItem post={post} index={index} />
```

## 創建新原子組件的判斷標準

當出現以下情況時，應當創建新的原子組件：

| 標準 | 說明 |
|------|------|
| **重複出現 2+ 次** | 相同的 UI 結構在多個文件中出現 |
| **職責單一** | 組件只負責一件事（顯示徽章、渲染圖標等） |
| **可獨立存在** | 不依賴特定業務邏輯 |
| **可配置化** | 通過 Props 控制外觀和行爲 |

### 創建示例：創建 Badge 組件

如果項目中沒有 `Badge` 組件，但多處需要顯示序號徽章：

```astro
// src/components/atoms/Badge/Badge.astro
---
interface Props {
    variant?: "number" | "dot" | "count";
    size?: "sm" | "md" | "lg";
    children: any;
}

const { variant = "number", size = "md" } = Astro.props;

const sizeClasses = {
    sm: "w-4 h-4 text-xs",
    md: "w-6 h-6 text-sm",
    lg: "w-8 h-8 text-base"
};
---

<span class:list={[
    "shrink-0 rounded-md bg-(--enter-btn-bg) text-(--primary)",
    "flex items-center justify-center font-bold",
    sizeClasses[size]
]}>
    {variant === "number" && <slot />}
    {variant === "dot" && <span class="w-2 h-2 rounded-full bg-(--primary)" />}
    {variant === "count" && <slot />}
</span>
```

## 常見問題

### Q1：原子組件 Props 太多怎麼辦？

**A**：使用合理的默認值，僅暴露必要的 Props。

```astro
<!-- ✅ 好的設計：合理的默認值 -->
<Badge>{count}</Badge>
<Badge variant="dot" />
<Badge variant="number" size="lg">{num}</Badge>
```

### Q2：現有組件樣式不完全匹配怎麼辦？

**A**：
1. 檢查是否可以通過新增 Props 變體解決
2. 使用 `class` prop 追加樣式（如果有）
3. 討論是否需要 fork 並修改原組件

### Q3：不確定是否需要創建新組件怎麼辦？

**A**：保守策略——先創建。如果後續發現不需要，可以合併或刪除。

### Q4：原子組件和功能組件的區別？

**A**：
- **原子組件**：最小 UI 單元（Button、Icon、Badge）
- **功能組件**：組合原子組件實現特定功能（PostCard、UserProfile）

## 代碼審查檢查清單

在代碼審查時，必須檢查：

- [ ] 是否優先使用了現有原子組件？
- [ ] 是否有重複的 UI 代碼可以抽取爲原子組件？
- [ ] 新創建的組件是否遵循單一職責原則？
- [ ] 組件命名是否符合規範（PascalCase）？
- [ ] 組件是否添加到 `index.ts` 導出？

## 違規示例

### 示例 1：直接在組件中寫死徽章樣式

```astro
<!-- ❌ 違規代碼 -->
---
const { index } = Astro.props;
---

<div class="w-6 h-6 rounded-md bg-(--enter-btn-bg) text-(--primary) flex items-center justify-center text-sm font-bold">
    {index + 1}
</div>

<!-- ✅ 修復後：使用 Badge 組件 -->
import Badge from "@/components/atoms/Badge/Badge.astro";
<Badge>{index + 1}</Badge>
```

### 示例 2：多個組件重複相同的卡片頭部

```astro
<!-- ❌ 違規代碼：WidgetA.astro -->
<div class="card-base p-5">
    <div class="flex items-center gap-2 pb-3 border-b border-dashed border-(--line-divider)">
        <Icon name="article" />
        <span class="font-bold">標題</span>
    </div>
    <!-- 內容 -->
</div>

<!-- ❌ 違規代碼：WidgetB.astro（同樣的頭部代碼） -->
<div class="card-base p-5">
    <div class="flex items-center gap-2 pb-3 border-b border-dashed border-(--line-divider)">
        <Icon name="category" />
        <span class="font-bold">分類</span>
    </div>
    <!-- 內容 -->
</div>

<!-- ✅ 修復後：使用 ListContainer 組件 -->
<ListContainer title="標題" icon="article">
    <!-- 內容 -->
</ListContainer>
```

## 相關文檔

- [組件架構設計規範](./01-component-architecture.md) - 組件分層和架構
- [組件拆分指南](./02-component-split-guide.md) - 何時需要拆分組件
- [文件組織架構規範](./03-file-organization-architecture.md) - 文件組織方式

---

**最後更新**: 2026-03-21
**維護者**: Mizuki 開發團隊
