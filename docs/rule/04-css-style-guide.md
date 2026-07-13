# CSS 樣式指南

## 概述

本文檔定義了 Mizuki 項目的 CSS 樣式規範，確保樣式的一致性、可維護性和性能。

## 核心原則

### 禁止使用 `!important` 級別

項目中**應該儘量避免使用 `!important` 級別的 CSS**，原因如下：

1. **破壞樣式優先級**：`!important` 會打破 CSS 的自然級聯規則
2. **難以維護**：一旦使用 `!important`，後續修改將不得不使用更多的 `!important`
3. **與主題系統衝突**：`!important` 可能導致不可預期的樣式衝突
4. **Tailwind CSS 不兼容**：Tailwind 的原子類設計基於正常的 CSS 優先級，`!important` 會破壞這種設計
5. **調試困難**：`!important` 使得樣式調試變得非常困難

## 允許使用 `!important` 的例外情況

### Twikoo 評論區樣式

在 `src/styles/twikoo.css` 文件中**允許使用 `!important`**。

**理由**：
1. **第三方庫動態注入**：Twikoo 是第三方評論系統，其樣式通過 JavaScript 動態注入到頁面
2. **選擇器優先級高**：Twikoo 內部樣式使用了較高的選擇器優先級，常規 CSS 無法覆蓋
3. **隔離性好**：Twikoo 樣式文件獨立，`!important` 的影響範圍僅限於評論區，不會影響其他組件
4. **無其他替代方案**：由於無法控制 Twikoo 的樣式注入時機和方式，`!important` 是唯一可靠的覆蓋方式
5. **CSS-in-JS 庫**：Twikoo 使用組件庫，其內聯樣式的優先級很難用常規 CSS 覆蓋

**示例**：
```css
/* ✅ 允許：在 twikoo.css 中覆蓋 Twikoo 默認樣式 */
.tk-loading {
  display: flex !important;
  justify-content: center !important;
}

.tk-btn {
  color: var(--primary) !important;
  background-color: transparent !important;
}

.tk-submit-btn {
  background-color: var(--primary) !important;
  color: white !important;
}
```

### 其他特殊情況（需要審批）

如果遇到以下特殊情況，需要經過團隊審批才能使用 `!important`：

1. **覆蓋第三方庫的必要樣式**（如 Twikoo、Chart.js 等）
2. **修復框架級別的 bug**（僅作爲臨時解決方案，需要跟進）
3. **處理瀏覽器的已知 bug**（僅作爲臨時解決方案，需要添加註釋）

**審批流程**：
1. 在 Pull Request 中說明爲什麼需要使用 `!important`
2. 提供替代方案的嘗試記錄
3. 獲得至少 1 名核心開發者的批准

## 正確做法

### 1. 提高選擇器優先級

通過更具體的選擇器來覆蓋樣式，而不是使用 `!important`。

**❌ 錯誤示例**：
```css
.album-card {
  background-color: white !important;
  color: black !important;
}

.dark .album-card {
  background-color: black !important;
}
```

**✅ 正確示例**：
```css
/* 通過提高選擇器優先級覆蓋樣式 */
.album-card.card-base {
  background-color: white;
  color: black;
}

.dark .album-card.card-base {
  background-color: black;
}

/* 或者使用更具體的選擇器 */
.card-base.album-card {
  background-color: white;
}
```

### 2. 使用 CSS 變量

使用 CSS 變量而不是硬編碼值，這樣可以在全局統一修改。

**❌ 錯誤示例**：
```css
.button {
  background-color: #3b82f6 !important;
  color: #ffffff !important;
}
```

**✅ 正確示例**：
```css
:root {
  --primary: #3b82f6;
  --text-color: #ffffff;
}

.button {
  background-color: var(--primary);
  color: var(--text-color);
}
```

### 3. 利用 Tailwind 的優先級

Tailwind CSS 的原子類按順序應用，後面的類會覆蓋前面的類。

**❌ 錯誤示例**：
```css
<div class="!bg-white !text-black">
  內容
</div>
```

**✅ 正確示例**：
```astro
---
// Tailwind 類按順序應用，不需要 !important
---

<div class="bg-white dark:bg-black text-black dark:text-white">
  內容
</div>
```

### 4. 使用作用域樣式

Astro 的作用域樣式自動提供選擇器隔離。

**❌ 錯誤示例**：
```astro
---
---

<div class="card">
  內容
</div>

<style>
  /* 使用 :global 影響全局 */
  :global(.card) {
    background: white !important;
  }
</style>
```

**✅ 正確示例**：
```astro
---
---

<div class="card card-base">
  內容
</div>

<style>
  /* 作用域樣式自動隔離，不需要 :global */
  .card {
    background: var(--card-bg);
    color: var(--text-color);
  }
</style>
```

### 5. 使用組合類

通過組合多個 Tailwind 類來實現複雜的樣式。

**❌ 錯誤示例**：
```css
<style>
  .custom-button {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0.5rem 1rem !important;
    border-radius: 0.5rem !important;
    font-weight: 600 !important;
    transition: all 0.2s !important;
  }
</style>
```

**✅ 正確示例**：
```astro
---
---

<button class="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200">
  按鈕
</button>
```

## 特殊情況處理

### 需要覆蓋第三方庫樣式時

#### Twikoo 評論區（允許 `!important`）✅

**文件位置**：`src/styles/twikoo.css`

```css
/* ✅ 允許：Twikoo 樣式文件 */
.tk-btn {
  color: var(--primary) !important;
  background-color: transparent !important;
}

.tk-content {
  color: var(--text-color) !important;
  font-size: 1rem !important;
}

.tk-submit-btn {
  background-color: var(--primary) !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.tk-loading-spinner {
  border-color: var(--primary) transparent transparent transparent !important;
}

/* 其他 Twikoo 相關樣式... */
```

#### 其他第三方庫（需要審批）

**❌ 錯誤示例**：
```css
/* 未經審批直接使用 !important */
.external-library-element {
  color: red !important;
}
```

**✅ 正確示例**：
```css
/* 先嚐試其他方法 */
.external-library-container .external-library-element {
  /* 方法 1：提高選擇器優先級 */
  color: red;
}

/* 方法 2：使用更具體的選擇器 */
.widget-container .external-library-element {
  color: red;
}

/* 方法 3：添加說明註釋 */
/*
 * TODO: 臨時解決方案，需要與庫維護者協商
 * Issue: #123
 */
.external-library-element {
  color: red !important; /* 需要審批，PR #123 */
}
```

### 內聯樣式的優先級

內聯樣式的優先級高於外部樣式表，應謹慎使用。

**❌ 錯誤示例**：
```astro
---
<div style="background-color: white !important; padding: 1rem !important;">
  內容
</div>
```

**✅ 正確示例**：
```astro
---
<!-- 使用 Tailwind 類或自定義 class -->
<div class="bg-white p-4 custom-card">
  內容
</div>

<style>
  .custom-card {
    background-color: var(--card-bg);
    padding: 1rem;
  }
</style>
```

### 動態樣式

使用 CSS 變量或樣式綁定，而不是在 JS 中直接操作 style。

**❌ 錯誤示例**：
```javascript
element.style.setProperty('background-color', 'white', 'important');
```

**✅ 正確示例**：
```typescript
// 使用 CSS 變量
document.documentElement.style.setProperty('--dynamic-color', dynamicValue);
```

```css
:root {
  --dynamic-color: #3b82f6;
}

.dynamic-element {
  background-color: var(--dynamic-color);
}
```

## Tailwind CSS 的 `!important` 使用

### Tailwind v4 的 `!` 前綴

Tailwind CSS v4 提供了 `!` 前綴來添加 `!important`：

**⚠️ 謹慎使用**：僅在絕對必要時使用 `!` 前綴。

**❌ 錯誤示例**：
```astro
---
<!-- 未經審批使用 ! 前綴 -->
<div class="!bg-white !text-black">
  內容
</div>
```

**✅ 正確示例**：
```astro
---
<!-- 使用正常的 Tailwind 類 -->
<div class="bg-white dark:bg-black text-black dark:text-white">
  內容
</div>
```

**使用場景**：僅在必須覆蓋第三方庫的內聯樣式時使用。

```astro
---
<!-- 只有在無法通過其他方式覆蓋時才使用 -->
<div class="!bg-white" style="/* 需要覆蓋第三方樣式 */">
  內容
</div>
```

## CSS 優先級規則

### 選擇器優先級（從高到低）

1. **內聯樣式（`style="..."`）**：最高優先級
2. **`!important`**：強制最高優先級
3. **ID 選擇器（`#id`）**
4. **類選擇器（`.class`）**
5. **屬性選擇器（`[attr]`）**
6. **僞類選擇器（`:hover`、`:active` 等）**
7. **僞元素選擇器（`::before`、`::after` 等）**
8. **元素選擇器（`div`、`span` 等）**：最低優先級

### 特異性規則

```css
/* 優先級 1：ID 選擇器 */
#unique-element {
  color: red;
}

/* 優先級 2：類選擇器 + 僞類 */
.button:hover {
  color: blue;
}

/* 優先級 3：類選擇器 */
.button {
  color: green;
}

/* 優先級 4：元素選擇器 */
div {
  color: black;
}
```

### 選擇器特異性計算

```css
/* 特異性：1 個 ID，0 個類，0 個屬性 = 100 分 */
#header .nav-link {
  color: blue;
}

/* 特異性：0 個 ID，1 個類，1 個屬性 = 11 分 */
.nav-link.active {
  color: green; /* 更高優先級 */
}

/* 特異性：0 個 ID，2 個類 = 20 分 */
.card .header .title {
  color: red; /* 最高優先級 */
}
```

## 暗色主題樣式

### 使用 CSS 變量

使用 CSS 變量實現主題切換，避免使用 `!important`。

**❌ 錯誤示例**：
```css
/* 使用 !important 強制覆蓋 */
.dark .card {
  background-color: black !important;
  color: white !important;
}
```

**✅ 正確示例**：
```css
:root {
  --card-bg: white;
  --text-color: black;
}

.dark {
  --card-bg: #1f2937;
  --text-color: #f3f4f6;
}

.card {
  background-color: var(--card-bg);
  color: var(--text-color);
}
```

### 暗色主題選擇器

```css
/* ✅ 正確：使用暗色主題類名 */
.dark .card {
  background-color: var(--card-bg-dark);
}

/* 或者在 Astro 組件中使用 */
<style>
  :global(.dark) .card {
    background-color: var(--card-bg-dark);
  }
</style>
```

## 組件樣式最佳實踐

### 1. 作用域樣式

Astro 組件默認使用作用域樣式，不需要額外的包裝器。

**✅ 正確示例**：
```astro
---
---

<div class="my-component">
  內容
</div>

<style>
  .my-component {
    /* 樣式僅應用於當前組件 */
    padding: 1rem;
  }
</style>
```

### 2. 全局樣式（謹慎使用）

只在真正需要全局影響時使用 `:global()`。

**❌ 錯誤示例**：
```astro
---
<style>
  /* 影響 .my-class 的所有實例 */
  :global(.my-class) {
    background: white !important;
  }
</style>
```

**✅ 正確示例**：
```css
/* 在全局樣式文件中定義 */
.src/styles/global.css {
  .global-utility {
    /* 真正需要的全局樣式 */
    display: flex;
  }
}
```

### 3. 使用 CSS 變量優先

優先使用 CSS 變量，而不是硬編碼值。

**❌ 錯誤示例**：
```css
.button {
  background-color: #3b82f6;
  padding: 8px 16px;
  border-radius: 4px;
}
```

**✅ 正確示例**：
```css
:root {
  --primary: #3b82f6;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --radius-md: 4px;
}

.button {
  background-color: var(--primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
}
```

### 4. Tailwind 與自定義樣式混合

```astro
---
---

<!-- Tailwind 處理佈局和間距 -->
<div class="flex flex-col gap-4 p-6">
  <!-- 自定義樣式處理組件特定行爲 -->
  <div class="custom-card">
    內容
  </div>
</div>

<style>
  .custom-card {
    /* 組件特定的樣式 */
    background-color: var(--card-bg);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>
```

## 檢查清單

在提交代碼前，確保：

### CSS 相關
- [ ] 普通業務 CSS 文件中沒有 `!important`
- [ ] `<style>` 標籤中沒有 `!important`（Twikoo 組件除外）
- [ ] Tailwind 類中沒有 `!` 前綴（除非有充分理由）
- [ ] 使用了 CSS 變量而不是硬編碼值
- [ ] 使用了作用域樣式而不是全局樣式
- [ ] 樣式優先級合理，易於理解和維護

### Twikoo 樣式
- [ ] Twikoo 相關樣式只在 `src/styles/twikoo.css` 中
- [ ] 使用了 `!important` 覆蓋 Twikoo 默認樣式
- [ ] 添加了必要的註釋說明爲什麼需要覆蓋

### 主題樣式
- [ ] 使用 CSS 變量實現主題切換
- [ ] 暗色主題使用正確的類名或變量
- [ ] 沒有 `!important` 強制覆蓋主題樣式

### 性能相關
- [ ] 避免了不必要的重複樣式
- [ ] 使用了 Tailwind 的工具類而不是自定義 CSS
- [ ] 沒有過度的選擇器嵌套

## 替代方案優先級

在需要覆蓋樣式時，按以下優先級嘗試：

### 1. 使用 Tailwind 原子類（首選）

```astro
---
<div class="bg-white p-4 rounded-lg shadow-md">
  內容
</div>
```

### 2. 提高選擇器優先級（次選）

```css
.card-base.album-card {
  background-color: white;
}
```

### 3. 使用 CSS 變量（再次選）

```css
:root {
  --album-bg: white;
}

.album-card {
  background-color: var(--album-bg);
}
```

### 4. 使用作用域樣式（備選）

```css
/* 在組件內部 */
.my-component .element {
  background-color: white;
}
```

### 5. 使用全局樣式（特殊）

```css
/* 在全局樣式文件中 */
.src/styles/global.css {
  .special-case {
    background-color: white;
  }
}
```

### 6. 使用 `!important`（最後手段）

**僅允許的情況**：
- Twikoo 評論區樣式
- 經過團隊審批的第三方庫樣式覆蓋

## 常見問題和解決方案

### Q1: 樣式不生效怎麼辦？

**A**: 按照以下步驟排查：

1. **檢查選擇器特異性**：優先使用更具體的選擇器
2. **檢查樣式加載順序**：後面的樣式會覆蓋前面的樣式
3. **檢查作用域**：確認樣式是否在正確的作用域內
4. **檢查 CSS 變量**：確認變量是否正確定義
5. **檢查 Tailwind 配置**：確認 Tailwind 是否正確配置

### Q2: 如何覆蓋 Tailwind 的默認樣式？

**A**: 使用 Tailwind 的工具類或自定義樣式，而不是 `!important`。

```astro
---
<!-- ✅ 正確：使用 Tailwind 類 -->
<div class="text-lg font-semibold text-gray-900">
  標題
</div>

<!-- ❌ 錯誤：使用 !important -->
<div class="!text-lg !font-semibold">
  標題
</div>
```

### Q3: 第三方庫樣式衝突怎麼辦？

**A**: 按照優先級處理：

1. **提高選擇器優先級**
2. **使用更具體的選擇器**
3. **包裝組件以隔離樣式**
4. **最後手段**：使用 `!important`（需要審批）

**示例**：
```css
/* 優先級 1：包裝器隔離 */
.my-wrapper .external-library-element {
  color: var(--text-color);
}

/* 優先級 2：更具體的選擇器 */
div.widget-container .external-library-element {
  color: var(--text-color);
}

/* 優先級 3：臨時解決方案（需要審批） */
.external-library-element {
  color: var(--text-color) !important; /* 需要審批，Issue #123 */
}
```

### Q4: 主題切換時樣式閃爍怎麼辦？

**A**: 使用 CSS 變量和過渡，而不是 `!important` 強制刷新。

```css
:root {
  --bg-color: white;
  --text-color: black;
}

.dark {
  --bg-color: #1f2937;
  --text-color: #f3f4f6;
}

.card {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

## Twikoo 樣式文件規範

### 文件位置

```
src/styles/
├── global.css           # 全局樣式
├── theme.css            # 主題樣式
├── components.css       # 組件樣式
└── twikoo.css          # Twikoo 樣式（允許 !important）
```

### Twikoo 樣式示例

```css
/* src/styles/twikoo.css */
/* Twikoo 評論區樣式 - 允許使用 !important */

/* 容器樣式 */
.tk-admin {
  background-color: var(--card-bg) !important;
  border-radius: 8px !important;
}

/* 按鈕樣式 */
.tk-btn {
  color: var(--primary) !important;
  background-color: transparent !important;
  transition: all 0.2s ease !important;
}

.tk-btn:hover {
  color: var(--primary-hover) !important;
  background-color: var(--primary-bg-light) !important;
}

/* 輸入框樣式 */
.tk-input {
  background-color: var(--input-bg) !important;
  border-color: var(--border-color) !important;
  color: var(--text-color) !important;
}

/* 提交按鈕 */
.tk-submit-btn {
  background-color: var(--primary) !important;
  color: white !important;
  font-weight: 600 !important;
}

/* 加載狀態 */
.tk-loading {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.tk-loading-spinner {
  border-color: var(--primary) transparent transparent transparent !important;
}

/* 內容區域 */
.tk-content {
  color: var(--text-color) !important;
  font-size: 1rem !important;
  line-height: 1.6 !important;
}

/* 鏈接樣式 */
.tk-content a {
  color: var(--primary) !important;
  text-decoration: none !important;
}

.tk-content a:hover {
  text-decoration: underline !important;
}

/* 其他 Twikoo 相關樣式... */
```

### Twikoo 樣式最佳實踐

1. **集中管理**：所有 Twikoo 樣式都在 `twikoo.css` 文件中
2. **添加註釋**：爲每個樣式覆蓋添加註釋說明原因
3. **使用 CSS 變量**：優先使用項目定義的 CSS 變量
4. **保持一致性**：與其他組件使用相同的設計令牌
5. **定期更新**：Twikoo 更新時同步調整樣式

## 性能優化

### 避免過度使用

**❌ 錯誤示例**：
```css
/* 過度使用 !important */
.button {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 8px 16px !important;
  border: none !important;
  border-radius: 4px !important;
  background-color: #3b82f6 !important;
  color: white !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  transition: all 0.2s !important;
  cursor: pointer !important;
}
```

**✅ 正確示例**：
```astro
---
<!-- 使用 Tailwind 工具類 -->
<button class="flex items-center justify-center px-4 py-2 border-0 rounded-lg bg-[var(--primary)] text-white font-medium transition-all duration-200 cursor-pointer">
  按鈕
</button>
```

### 使用 CSS 變量提高性能

```css
:root {
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

/* 多次重用變量 */
.card {
  padding: var(--spacing-md);
}

.button {
  padding: var(--spacing-sm) var(--spacing-md);
}

.header {
  margin-bottom: var(--spacing-lg);
}
```

## 總結

### 核心原則

1. **禁止使用 `!important`**：除了 Twikoo 組件和經過審批的情況
2. **優先使用 Tailwind**：利用工具類而不是自定義 CSS
3. **使用 CSS 變量**：提高樣式的可維護性
4. **提高選擇器優先級**：而不是使用 `!important`
5. **使用作用域樣式**：避免全局污染
6. **保持一致性**：使用統一的設計令牌

### 檢查清單

- [ ] 沒有 `!important`（Twikoo 除外）
- [ ] 使用了 Tailwind 工具類
- [ ] 使用了 CSS 變量
- [ ] 樣式優先級合理
- [ ] 主題樣式正確
- [ ] 沒有過度嵌套

---

**最後更新**: 2026-03-17
**維護者**: Mizuki 開發團隊

## 參考資源

- [組件架構設計規範](./01-component-architecture.md)
- [文件組織架構規範](./03-file-organization-architecture.md)
- [Aruma CSS 規範](../../demo/Aruma/docs/rule/02-no-important-css.md)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [CSS 優先級計算器](https://specificity.keegan.st/)
