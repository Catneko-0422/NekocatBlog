# 組件架構設計規範

## 概述

本文檔定義了 Mizuki 項目的組件化架構設計原則和最佳實踐，旨在提高代碼的可維護性、可複用性和性能。

## 核心原則

### 1. 分層架構原則

採用**原子設計（Atomic Design）**理念，將組件分爲四個層次：

```
atoms (原子) → molecules (分子) → organisms (有機體) → pages (頁面)
```

#### 1.1 Atoms - 原子組件

**定義**：構成 UI 的最基礎、不可再分的元素。

**特點**：
- 職責單一，功能簡單
- 無業務邏輯
- 高度可複用
- 不依賴其他組件

**示例**：
```typescript
// Button.astro
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  icon?: string
}

const { variant = 'primary', size = 'md', disabled = false, icon } = Astro.props
---

<button class={`btn btn-${variant} btn-${size} ${disabled ? 'disabled' : ''}`}>
  {icon && <Icon name={icon} />}
  <slot />
</button>

<style>
  .btn {
    /* 基礎按鈕樣式 */
  }
  .btn-primary {
    /* 主按鈕樣式 */
  }
  .btn-secondary {
    /* 次要按鈕樣式 */
  }
</style>
```

**原子組件清單**：
- `Button.astro` - 按鈕
- `Card.astro` - 卡片容器
- `Input.astro` - 輸入框
- `Badge.astro` - 標籤/徽章
- `Chip.astro` - Chip 標籤
- `Icon.astro` - 圖標
- `Avatar.astro` - 頭像

#### 1.2 Molecules - 分子組件

**定義**：由多個原子組件組合而成，具有單一職責的小型功能組件。

**特點**：
- 由 2-5 個原子組件組合
- 具有簡單的交互邏輯
- 仍然保持高度可複用性
- 封裝特定的 UI 模式

**示例**：
```astro
---
// SearchBar.astro
import Button from '../atoms/Button.astro'
import Input from '../atoms/Input.astro'

interface Props {
  placeholder?: string
  onSearch?: (query: string) => void
}

const { placeholder = '搜索...', onSearch } = Astro.props
---

<div class="search-bar">
  <Input {placeholder} id="search-input" />
  <Button variant="primary" size="md" icon="material-symbols:search">
    搜索
  </Button>
</div>

<script>
  const input = document.getElementById('search-input')
  const button = document.querySelector('.search-bar button')

  const handleSearch = () => {
    const query = input?.value || ''
    if (onSearch) {
      onSearch(query)
    }
  }

  button?.addEventListener('click', handleSearch)
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch()
  })
</script>
```

**分子組件清單**：
- `SearchBar.astro` - 搜索欄
- `Pagination.astro` - 分頁
- `DropdownMenu.astro` - 下拉菜單
- `FormItem.astro` - 表單項
- `ChipCloud.astro` - 標籤雲

#### 1.3 Organisms - 有機體組件

**定義**：複雜的業務組件，由多個分子組件和原子組件組合而成。

**特點**：
- 包含複雜的業務邏輯
- 可能有多個子組件
- 專門用於特定的頁面或功能
- 可能需要拆分爲子目錄

**示例**：
```
Navbar.astro
├── NavbarSearch.svelte (分子)
├── NavbarMenu.svelte (分子)
├── LayoutSwitchButton.svelte (分子)
└── LightDarkSwitch.svelte (原子)
```

**有機體組件清單**：
- `Navbar.astro` - 導航欄
- `Sidebar.astro` - 側邊欄
- `MusicPlayer.svelte` - 音樂播放器
- `Footer.astro` - 頁腳
- `TOC.astro` - 目錄

#### 1.4 Widgets - 小部件組件

**定義**：側邊欄的小功能模塊，介於分子和有機體之間。

**特點**：
- 相對獨立的功能模塊
- 可配置的顯示位置
- 統一的 UI 風格
- 使用通用容器組件

**示例**：
```astro
---
// widget/Profile.astro
import WidgetLayout from './common/WidgetLayout.astro'
import Avatar from '../atoms/Avatar.astro'
---

<WidgetLayout name="個人資料">
  <Avatar src="/avatar.png" />
  <div class="profile-info">
    <h3>Mizuki</h3>
    <p>前端開發者</p>
  </div>
</WidgetLayout>
```

**小部件組件清單**：
- `Profile.astro` - 個人資料
- `Calendar.astro` - 日曆
- `Categories.astro` - 分類
- `Tags.astro` - 標籤
- `SiteStats.astro` - 站點統計
- `Announcement.astro` - 公告

## 組件目錄結構

### 推薦的目錄組織方式

```
src/components/
├── atoms/                    # 原子組件
│   ├── Button.astro
│   ├── Card.astro
│   ├── Input.astro
│   ├── Badge.astro
│   ├── Chip.astro
│   └── Icon.astro
│
├── molecules/                # 分子組件
│   ├── SearchBar.astro
│   ├── Pagination.astro
│   ├── DropdownMenu.astro
│   └── ChipCloud.astro
│
├── organisms/                # 有機體組件
│   ├── Navbar.astro
│   ├── Sidebar.astro
│   ├── MusicPlayer.svelte   # 複雜組件可包含子目錄
│   │   ├── MusicPlayer.svelte
│   │   ├── MiniPlayer.svelte
│   │   ├── ExpandedPlayer.svelte
│   │   ├── controls/
│   │   │   ├── PlayControls.svelte
│   │   │   ├── ProgressBar.svelte
│   │   │   └── VolumeControl.svelte
│   │   ├── hooks/
│   │   │   ├── useAudio.ts
│   │   │   └── usePlaylist.ts
│   │   └── types.ts
│   ├── Footer.astro
│   └── TOC.astro
│
├── widgets/                   # 側邊欄小部件
│   ├── Profile.astro
│   ├── Calendar.astro
│   ├── Categories.astro
│   ├── Tags.astro
│   ├── SiteStats.astro
│   └── common/              # 通用小部件組件
│       ├── WidgetLayout.astro
│       └── WidgetHeader.astro
│
├── features/                  # 功能性組件
│   ├── comment/
│   ├── search/
│   └── protection/
│
├── layouts/                   # 頁面佈局
│   ├── MainLayout.astro
│   └── PostLayout.astro
│
└── utils/                     # 工具和 Hooks
    ├── widgetManager.ts
    └── useCalendar.ts
```

### 複雜組件的子目錄組織

當組件需要拆分爲多個子組件時，應按照以下結構組織：

```
ComponentName/
├── ComponentName.astro/svelte  # 主組件（組合層）
├── SubComponent1.astro/svelte  # 子組件
├── SubComponent2.astro/svelte  # 子組件
├── hooks/                      # 相關 Hooks
│   ├── useFeature1.ts
│   └── useFeature2.ts
├── types.ts                    # 類型定義
└── utils/                      # 工具函數
    └── helper.ts
```

## 命名規範

### 文件命名

#### Astro 組件
- 使用 PascalCase
- 示例：`Button.astro`, `SearchBar.astro`, `Navbar.astro`

#### Svelte 組件
- 使用 PascalCase
- 示例：`MusicPlayer.svelte`, `LayoutSwitchButton.svelte`

#### 功能模塊組件
- 使用 功能名+Module 後綴
- 示例：`SearchModule.astro`, `QRCodeModule.astro`

#### 容器組件
- 使用 功能名+Container 後綴
- 示例：`SidebarContainer.astro`, `WidgetContainer.astro`

#### Hooks
- 使用 use 前綴
- 示例：`useCalendar.ts`, `useMusicPlayer.ts`, `useTOC.ts`

#### 工具函數
- 使用小駝峯
- 示例：`formatDate.ts`, `calculatePagination.ts`

### 組件內命名

#### Props 接口
```typescript
interface Props {
  title?: string
  description?: string
  items?: Array<Item>
  onAction?: (value: any) => void
}
```

#### 事件處理器
```typescript
const handleClick = () => {}
const handleSubmit = () => {}
const handleScroll = () => {}
```

#### 響應式變量
```typescript
let isOpen = false
let count = 0
let items = []
```

## 組件職責原則

### 單一職責原則（SRP）

每個組件應該只有一個明確的職責。

**✅ 正確示例**：
```astro
---
// Button.astro - 只負責按鈕的渲染和基本交互
interface Props {
  variant: 'primary' | 'secondary'
  children: any
}
const { variant } = Astro.props
---

<button class={`btn-${variant}`}>
  <slot />
</button>
```

**❌ 錯誤示例**：
```astro
---
// ❌ 錯誤：一個組件同時負責搜索、導航、主題切換
// SearchNavbarTheme.astro (500+ 行)
const handleSearch = () => {}
const toggleNavbar = () => {}
const toggleTheme = () => {}
---
<div>
  <input id="search" />
  <nav>...</nav>
  <button id="theme-toggle">...</button>
</div>

<style>
  /* 搜索樣式、導航樣式、主題樣式混在一起 */
</style>

<script>
  // 搜索邏輯、導航邏輯、主題邏輯混在一起
</script>
```

### 控制組件粒度

| 複雜度 | 行數 | 職責數 | 狀態數 | 適用組件類型 |
|--------|------|--------|--------|-------------|
| ⭐ 簡單 | < 100 | 1 | < 3 | 原子組件、簡單分子組件 |
| ⭐⭐ 中等 | 100-200 | 1-2 | 3-5 | 分子組件、簡單有機體組件 |
| ⭐⭐⭐ 較高 | 200-300 | 2-3 | 5-10 | 有機體組件 |
| ⭐⭐⭐⭐ 高 | 300-500 | 3-4 | 10-15 | 複雜有機體組件（需要拆分） |
| ⭐⭐⭐⭐⭐ 極高 | > 500 | > 4 | > 15 | **必須拆分** |

**拆分警告信號**：
- ❌ 組件超過 500 行
- ❌ 有 4 個或更多獨立的功能模塊
- ❌ 樣式超過 200 行
- ❌ 腳本超過 150 行
- ❌ 難以理解和測試

## 組件複用模式

### 1. 組合模式

使用 Slot API 實現靈活的組合：

```astro
---
// ContainerComponent.astro
---

<div class="container">
  <slot name="header" />
  <div class="content">
    <slot />
  </div>
  <slot name="footer" />
</div>

<style>
  .container { /* 容器樣式 */ }
</style>
```

**使用**：
```astro
---
import ContainerComponent from './ContainerComponent.astro'
---

<ContainerComponent>
  <div slot="header">自定義頭部</div>
  <div>主要內容</div>
  <div slot="footer">自定義底部</div>
</ContainerComponent>
```

### 2. 容器組件模式

創建通用的容器組件，統一樣式和行爲：

```astro
---
// widgets/common/WidgetLayout.astro
interface Props {
  name?: string
  isCollapsed?: boolean
  collapsedHeight?: string
}

const { name, isCollapsed, collapsedHeight } = Astro.props
---

<div class="widget-layout" data-collapsed={isCollapsed}>
  {name && <div class="widget-header">{name}</div>}
  <div class="widget-content">
    <slot />
  </div>
</div>

<style define:vars={{ collapsedHeight }}>
  .widget-layout[data-collapsed="true"] .widget-content {
    max-height: var(--collapsed-height);
    overflow: hidden;
  }
</style>
```

### 3. 工具函數複用

將通用邏輯提取到工具函數：

```typescript
// utils/calendarUtils.ts
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

// 在組件中使用
import { getDaysInMonth, getFirstDayOfMonth } from '@/utils/calendarUtils'
```

### 4. Hooks 複用

將複雜的交互邏輯提取爲 Hooks：

```typescript
// hooks/useMusicPlayer.ts
import { writable, derived } from 'svelte/store'

export function useMusicPlayer() {
  const isPlaying = writable(false)
  const currentSong = writable(null)
  const volume = writable(0.8)

  const togglePlay = () => isPlaying.update(n => !n)
  const setVolume = (val: number) => volume.set(val)

  return {
    isPlaying,
    currentSong,
    volume,
    togglePlay,
    setVolume
  }
}

// 在組件中使用
<script lang="ts">
  import { useMusicPlayer } from './hooks/useMusicPlayer'

  const player = useMusicPlayer()
  const { isPlaying, togglePlay } = player
</script>
```

## 組件間通信

### Props 傳遞（父 → 子）

```astro
---
// 父組件
import ChildComponent from './ChildComponent.astro'
---

<ChildComponent
  title="Hello"
  count={42}
  onAction={() => console.log('Action triggered')}
/>
```

```astro
---
// 子組件
interface Props {
  title: string
  count: number
  onAction?: () => void
}

const { title, count, onAction } = Astro.props
---

<div>
  <h1>{title}</h1>
  <p>Count: {count}</p>
  <button id="action-btn">Action</button>
</div>

<script>
  document.getElementById('action-btn')?.addEventListener('click', () => {
    if (onAction) onAction()
  })
</script>
```

### 事件派發（子 → 父）

```astro
---
// 子組件
interface Props {
  onValueChange?: (value: string) => void
}

const { onValueChange } = Astro.props
---

<input id="input" />

<script>
  const input = document.getElementById('input')
  input?.addEventListener('input', (e) => {
    if (onValueChange) {
      onValueChange((e.target as HTMLInputElement).value)
    }
  })
</script>
```

### 全局狀態管理

對於跨組件的狀態管理，使用全局變量或第三方庫：

```typescript
// stores/themeStore.ts
import { writable } from 'svelte/store'

export const themeStore = writable({
  mode: 'light' as 'light' | 'dark',
  hue: 60
})
```

## 性能優化

### 1. 懶加載

使用 Astro 的 Hydration 指令按需加載：

```astro
<!-- 立即加載 - 必需組件 -->
<Navbar client:load />

<!-- 可見時加載 - 功能模塊 -->
<Calendar client:visible />

<!-- 空閒時加載 - 非關鍵功能 -->
<MusicPlayer client:idle />

<!-- 永不加載 - 靜態內容 -->
<Footer />
```

### 2. 動態導入

```javascript
// 延遲加載重型庫
async function initQRCode() {
  const QRCode = await import('qrcode')
  QRCode.toCanvas(canvas, url, options)
}
```

### 3. 虛擬滾動

對於長列表，使用虛擬滾動：

```typescript
import { useVirtualList } from '@/hooks/useVirtualList'

const { list, containerProps, wrapperProps } = useVirtualList({
  items: largeList,
  itemHeight: 50
})
```

## TypeScript 使用規範

### Props 接口定義

```typescript
interface Props {
  // 必需屬性
  id: string

  // 可選屬性
  title?: string
  count?: number

  // 聯合類型
  variant?: 'primary' | 'secondary' | 'ghost'

  // 數組類型
  items?: Array<{
    id: string
    name: string
    slug: string
  }>

  // 事件處理
  onAction?: (value: any) => void

  // 自定義類名和樣式
  class?: string
  style?: string
}
```

### 默認值處理

```typescript
const {
  title = '默認標題',
  count = 0,
  variant = 'primary',
  items = [],
  class: className = '',
  style = ''
} = Astro.props
```

## 樣式規範

### 使用 CSS 變量

```css
:root {
  --primary-color: #3b82f6;
  --text-color: #1f2937;
  --bg-color: #ffffff;
}

.dark {
  --primary-color: #60a5fa;
  --text-color: #f3f4f6;
  --bg-color: #111827;
}
```

### 作用域樣式

```astro
<style>
  .my-component {
    color: var(--text-color);
    background-color: var(--bg-color);
  }

  /* 避免全局選擇器 */
  /* :global(div) { ... } */
</style>
```

### Tailwind CSS 結合

```astro
---
const className = Astro.props.class
---

<div class={`card-base ${className} p-4 rounded-lg shadow-md`}>
  <slot />
</div>

<style>
  .card-base {
    /* 組件特定的樣式 */
  }
</style>
```

## 組件文檔

### 組件頭部註釋

```astro
---
/**
 * Button 組件
 *
 * @description 基礎按鈕組件，支持多種變體和尺寸
 *
 * @example
 * <Button variant="primary" size="md" icon="material-symbols:add">
 *   點擊我
 * </Button>
 *
 * @props
 * - variant: 'primary' | 'secondary' | 'ghost' - 按鈕變體，默認 'primary'
 * - size: 'sm' | 'md' | 'lg' - 按鈕尺寸，默認 'md'
 * - disabled: boolean - 是否禁用，默認 false
 * - icon: string - 圖標名稱
 */

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  icon?: string
}
---
```

## 代碼審查檢查清單

在提交代碼前，確保：

- [ ] 組件遵循分層架構（atoms/molecules/organisms）
- [ ] 文件名符合命名規範（PascalCase）
- [ ] 組件行數在合理範圍內（< 500行）
- [ ] 使用 TypeScript 定義 Props 接口
- [ ] 組件職責單一明確
- [ ] 複雜邏輯提取到 Hooks 或工具函數
- [ ] 樣式使用 CSS 變量
- [ ] 使用適當的 Hydration 指令
- [ ] 添加組件文檔註釋
- [ ] 代碼格式化和 Lint 檢查通過

## 遷移指南

### 從現有組件遷移到新架構

1. **識別組件類型**
   - 判斷組件應該屬於哪個層次（atoms/molecules/organisms）
   - 評估組件的複雜度和是否需要拆分

2. **移動組件文件**
   - 將組件移動到對應的目錄
   - 更新導入路徑

3. **提取通用邏輯**
   - 將重複的邏輯提取到 Hooks 或工具函數
   - 創建通用的容器組件

4. **優化和重構**
   - 減少組件行數
   - 提高複用性
   - 添加類型定義和文檔

### 示例：重構 Widget 組件

**重構前**：
```astro
// widget/Categories.astro (150 行，包含樣式和邏輯)
---
// 獲取分類數據
const categories = await getCategories()
---

<div class="categories-widget">
  <div class="widget-header">
    <Icon name="material-symbols:category" />
    <h3>分類</h3>
  </div>
  <div class="widget-content">
    {categories.map(cat => (
      <a href={`/category/${cat.slug}`} class="category-link">
        {cat.name} ({cat.count})
      </a>
    ))}
  </div>
</div>

<style>
  .categories-widget { /* 樣式 */ }
  .widget-header { /* 樣式 */ }
  .widget-content { /* 樣式 */ }
</style>
```

**重構後**：
```astro
// widget/Categories.astro (50 行)
---
import WidgetLayout from './common/WidgetLayout.astro'
import ChipCloud from '../molecules/ChipCloud.astro'

const categories = await getCategories()
---

<WidgetLayout name="分類">
  <ChipCloud
    items={categories}
    hrefPrefix="/category/"
  />
</WidgetLayout>
```

## 參考資源

- [Aruma 組件架構](../../demo/Aruma/docs/rule/05-component-architecture.md)
- [Astro 組件最佳實踐](https://docs.astro.build/zh-cn/core-concepts/astro-components/)
- [Atomic Design](https://atomicdesign.bradfrost.com/)
- [組件驅動開發](https://componentdriven.org/)

---

**最後更新**: 2026-03-17
**維護者**: Mizuki 開發團隊
