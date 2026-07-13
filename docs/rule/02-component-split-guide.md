# 組件拆分指南

## 概述

本文檔提供詳細的組件拆分方法和最佳實踐，幫助你識別需要拆分的組件，並進行有效的重構。

## 識別需要拆分的組件

### 拆分信號清單

當一個組件出現以下信號時，應該考慮拆分：

#### 1. 代碼量過大

- ❌ 組件總行數 > 500 行
- ❌ 樣式代碼 > 200 行
- ❌ 腳本代碼 > 150 行

**示例**：
```
MusicPlayer.svelte - 934 行 ❌ 必須拆分
Calendar.astro - 527 行 ❌ 需要拆分
Navbar.astro - 294 行 ⚠️ 可以考慮拆分
Footer.astro - 159 行 ✅ 良好
```

#### 2. 職責過多

組件承擔了多個不相關的功能：

**❌ 錯誤示例**：
```astro
---
// ❌ 一個組件同時負責：
// 1. 搜索功能
// 2. 導航菜單
// 3. 主題切換
// 4. 側邊欄
// 5. 用戶認證
---

<SearchAndNavAndThemeAndSidebarAndAuth.astro />
```

**✅ 正確示例**：
```astro
<SearchModule.astro />
<NavbarMenu.astro />
<ThemeToggle.astro />
<Sidebar.astro />
<AuthModule.astro />
```

#### 3. 狀態複雜度高

- 狀態變量數量 > 10 個
- 狀態嵌套層級 > 3 層
- 狀態更新邏輯分散

**❌ 錯誤示例**：
```typescript
// ❌ 15+ 個響應式變量，難以維護
let isPlaying = $state(false)
let currentSong = $state(null)
let playlist = $state([])
let volume = $state(0.8)
let isMuted = $state(false)
let isExpanded = $state(false)
let showPlaylist = $state(false)
let currentTime = $state(0)
let duration = $state(0)
let isRepeat = $state(false)
let isShuffle = $state(false)
let showMiniPlayer = $state(true)
let audioRef = $state(null)
// ...
```

#### 4. DOM 操作過多

- 大量 `document.getElementById` 或 `querySelector`
- 複雜的事件監聽器綁定
- 動態創建/刪除元素

**❌ 錯誤示例**：
```javascript
// ❌ 20+ 個 DOM 操作
const button1 = document.getElementById('btn1')
const button2 = document.getElementById('btn2')
// ... 20 個類似的操作
```

#### 5. 依賴過多

- 導入了 10+ 個外部依賴
- 導入了多個大型第三方庫

**❌ 錯誤示例**：
```astro
---
// ❌ 導入 12 個依賴
import QRCode from 'qrcode'
import PDF from 'pdf-lib'
import XLSX from 'xlsx'
import Chart from 'chart.js'
// ...
```

### 拆分評估工具

使用以下評估矩陣判斷是否需要拆分：

| 評估項 | 權重 | 評分 (1-5) | 加權得分 |
|--------|------|-----------|----------|
| 代碼行數 | 25% | | |
| 職責數量 | 30% | | |
| 狀態複雜度 | 20% | | |
| DOM 操作數量 | 15% | | |
| 依賴數量 | 10% | | |
| **總分** | **100%** | | |

**拆分決策**：
- 總分 > 3.5：必須拆分
- 總分 2.5-3.5：建議拆分
- 總分 < 2.5：暫不拆分

## 拆分原則

### 1. 單一職責原則（SRP）

拆分後的每個組件應該只有一個明確的職責。

**示例：MusicPlayer 拆分前**

```svelte
// ❌ MusicPlayer.svelte (934 行)
// 職責：
// 1. 音頻播放控制
// 2. 播放列表管理
// 3. 進度條顯示和控制
// 4. 音量控制
// 5. 迷你播放器UI
// 6. 展開播放器UI
// 7. 播放列表UI
```

**拆分後**

```
MusicPlayer/
├── MusicPlayer.svelte           # 職責：組合層，協調各子組件
├── MiniPlayer.svelte          # 職責：迷你播放器UI
├── ExpandedPlayer.svelte      # 職責：展開播放器UI
├── PlaylistPanel.svelte        # 職責：播放列表UI
├── controls/
│   ├── PlayControls.svelte    # 職責：播放控制按鈕
│   ├── ProgressBar.svelte     # 職責：進度條
│   └── VolumeControl.svelte  # 職責：音量控制
└── hooks/
    ├── useAudio.ts           # 職責：音頻播放邏輯
    ├── usePlaylist.ts        # 職責：播放列表管理
    └── useVolume.ts         # 職責：音量控制邏輯
```

### 2. 接口隔離原則（ISP）

組件應該只依賴於它需要的接口，而不是被迫依賴不相關的接口。

**示例：Calendar 組件**

```astro
---
// ❌ 錯誤：Calendar 組件直接依賴所有功能
import { getAllPosts } from '../utils/blog'
import { calculateDates } from '../utils/calendar'
import { formatTime } from '../utils/date'
import { handleNav } from '../utils/navigation'
import { handleDrag } from '../utils/drag'
// ... 10+ 個依賴
---

// ✅ 正確：提取 Hook
import { useCalendar } from '../hooks/useCalendar'

const { dates, currentMonth, handleMonthChange } = useCalendar()
```

### 3. 依賴倒置原則（DIP）

高層模塊不應該依賴低層模塊，兩者都應該依賴抽象。

**示例：**

```typescript
// ❌ 錯誤：直接依賴具體實現
function renderPosts() {
  const posts = await getPostsFromDB()
  // ...
}

// ✅ 正確：依賴抽象
interface PostRepository {
  getAll(): Promise<Post[]>
}

function renderPosts(repository: PostRepository) {
  const posts = await repository.getAll()
  // ...
}
```

## 拆分方法

### 方法 1：按功能拆分

適用於職責明確的組件。

**步驟**：

1. **識別功能模塊**
   ```
   MusicPlayer 功能模塊：
   - 播放控制（play/pause/prev/next）
   - 進度管理（current time/duration/seek）
   - 音量管理（volume/mute）
   - 播放列表管理（add/remove/reorder）
   - UI狀態管理（mini/expanded/playlist）
   ```

2. **爲每個功能創建子組件**
   ```
   controls/PlayControls.svelte
   controls/ProgressBar.svelte
   controls/VolumeControl.svelte
   ```

3. **提取業務邏輯到 Hooks**
   ```
   hooks/useAudio.ts
   hooks/usePlaylist.ts
   hooks/useVolume.ts
   ```

4. **創建組合層組件**
   ```astro
   // MusicPlayer.astro（組合層）
   ---
   import PlayControls from './controls/PlayControls.svelte'
   import ProgressBar from './controls/ProgressBar.svelte'
   import VolumeControl from './controls/VolumeControl.svelte'
   ---

   <div class="music-player">
     <PlayControls />
     <ProgressBar />
     <VolumeControl />
   </div>
   ```

**實例：MusicPlayer 拆分**

**拆分前**：
```svelte
<script lang="ts">
// ❌ 934 行，所有邏輯混在一起
let isPlaying = $state(false)
let currentSong = $state(null)
let playlist = $state([])
let volume = $state(0.8)
// ... 更多狀態和邏輯

function togglePlay() {
  isPlaying = !isPlaying
  if (isPlaying) {
    audioRef.src = currentSong.url
    audioRef.play()
  } else {
    audioRef.pause()
  }
}

function handleProgressChange(time: number) {
  currentTime = time
  audioRef.currentTime = time
}

function handleVolumeChange(vol: number) {
  volume = vol
  audioRef.volume = vol
}

// ... 更多函數
</script>

<div class="music-player">
  <button onclick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
  <input type="range" bind:value={currentTime} />
  <input type="range" bind:value={volume} />
  <!-- 更多 UI -->
</div>

<style>
  /* 200+ 行樣式 */
</style>
```

**拆分後**：

1. **hooks/useAudio.ts**
```typescript
export function useAudio() {
  const isPlaying = $state(false)
  const currentTime = $state(0)
  const duration = $state(0)
  const audioRef = $state<HTMLAudioElement | null>(null)

  const togglePlay = () => {
    isPlaying = !isPlaying
    if (isPlaying) audioRef?.play()
    else audioRef?.pause()
  }

  const seek = (time: number) => {
    if (audioRef) audioRef.currentTime = time
  }

  return {
    isPlaying,
    currentTime,
    duration,
    audioRef,
    togglePlay,
    seek
  }
}
```

2. **controls/PlayControls.svelte**
```svelte
<script lang="ts">
  let { isPlaying, onTogglePlay, onPrev, onNext } = $props<{
    isPlaying: boolean
    onTogglePlay: () => void
    onPrev: () => void
    onNext: () => void
  }>()
</script>

<div class="play-controls">
  <button onclick={onPrev}>
    <Icon name="material-symbols:skip-previous" />
  </button>
  <button onclick={onTogglePlay}>
    <Icon name={isPlaying ? 'material-symbols:pause' : 'material-symbols:play-arrow'} />
  </button>
  <button onclick={onNext}>
    <Icon name="material-symbols:skip-next" />
  </button>
</div>

<style>
  .play-controls {
    display: flex;
    gap: 8px;
  }
</style>
```

3. **controls/ProgressBar.svelte**
```svelte
<script lang="ts">
  let { currentTime, duration, onSeek } = $props<{
    currentTime: number
    duration: number
    onSeek: (time: number) => void
  }>()
</script>

<div class="progress-container">
  <input
    type="range"
    min="0"
    max={duration}
    value={currentTime}
    oninput={(e) => onSeek(Number((e.target as HTMLInputElement).value))}
    class="progress-bar"
  />
  <span class="time">
    {formatTime(currentTime)} / {formatTime(duration)}
  </span>
</div>

<style>
  .progress-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
```

4. **MusicPlayer.astro（組合層）**
```astro
---
import PlayControls from './controls/PlayControls.svelte'
import ProgressBar from './controls/ProgressBar.svelte'
import { useAudio } from './hooks/useAudio'

const audio = useAudio()
---

<div class="music-player">
  <PlayControls
    isPlaying={audio.isPlaying}
    onTogglePlay={audio.togglePlay}
    onPrev={() => {}}
    onNext={() => {}}
  />
  <ProgressBar
    currentTime={audio.currentTime}
    duration={audio.duration}
    onSeek={audio.seek}
  />
</div>
```

### 方法 2：按 UI 層級拆分

適用於有清晰 UI 層級的組件。

**實例：Calendar 拆分**

**拆分前**：
```astro
---
// ❌ Calendar.astro (527 行)
// 包含：
// - 頭部導航（月份/年份選擇器）
// - 日曆網格（日期渲染）
// - 文章列表（選中日期的文章）
---

<div class="calendar">
  <header>
    <button>←</button>
    <select>2025</select>
    <select>3月</select>
    <button>→</button>
  </header>

  <div class="grid">
    <!-- 日曆網格 -->
  </div>

  <div class="posts">
    <!-- 文章列表 -->
  </div>
</div>
```

**拆分後**：

```
Calendar/
├── Calendar.astro              # 組合層（< 50 行）
├── CalendarHeader.svelte      # 頭部導航
├── CalendarGrid.svelte       # 日曆網格
├── PostList.astro           # 文章列表
├── utils/
│   └── calendarUtils.ts     # 日期計算邏輯
└── types.ts
```

1. **CalendarHeader.svelte**
```svelte
<script lang="ts">
  let { year, month, onPrevMonth, onNextMonth } = $props<{
    year: number
    month: number
    onPrevMonth: () => void
    onNextMonth: () => void
  }>()
</script>

<header class="calendar-header">
  <button onclick={onPrevMonth}>
    <Icon name="material-symbols:chevron-left" />
  </button>
  <div class="title">{year}年{month + 1}月</div>
  <button onclick={onNextMonth}>
    <Icon name="material-symbols:chevron-right" />
  </button>
</header>
```

2. **CalendarGrid.svelte**
```svelte
<script lang="ts">
  let { dates, selectedDate, onSelectDate } = $props<{
    dates: Date[]
    selectedDate: Date | null
    onSelectDate: (date: Date) => void
  }>()
</script>

<div class="calendar-grid">
  {#each dates as date}
    <div
      class="date-cell"
      class:selected={isSameDay(date, selectedDate)}
      onclick={() => onSelectDate(date)}
    >
      {date.getDate()}
    </div>
  {/each}
</div>
```

3. **Calendar.astro（組合層）**
```astro
---
import CalendarHeader from './CalendarHeader.svelte'
import CalendarGrid from './CalendarGrid.svelte'
import PostList from './PostList.astro'
import { useCalendar } from './hooks/useCalendar'

const calendar = useCalendar()
---

<div class="calendar">
  <CalendarHeader
    year={calendar.year}
    month={calendar.month}
    onPrevMonth={calendar.prevMonth}
    onNextMonth={calendar.nextMonth}
  />
  <CalendarGrid
    dates={calendar.dates}
    selectedDate={calendar.selectedDate}
    onSelectDate={calendar.selectDate}
  />
  <PostList posts={calendar.posts} />
</div>
```

### 方法 3：按關注點拆分

適用於邏輯複雜的組件。

**關注點**：
- 數據獲取
- 數據處理
- UI 渲染
- 事件處理
- 樣式

**實例：PasswordProtection 拆分**

**拆分前**：
```astro
---
// ❌ PasswordProtection.astro (648 行)
// 關注點混雜：
// - 加密/解密邏輯
// - UI 表單
// - 腳本動態執行
// - 錯誤處理
---

<script>
  // 加密邏輯
  function encrypt(text: string, key: string): string {
    // 100+ 行加密代碼
  }

  // 解密邏輯
  function decrypt(encrypted: string, key: string): string {
    // 100+ 行解密代碼
  }

  // UI 邏輯
  let password = $state('')
  let error = $state('')
  // ... 更多 UI 狀態
</script>

<form>
  <input type="password" bind:value={password} />
  <button onclick={handleSubmit}>解鎖</button>
</form>

<style>
  /* 表單樣式 */
</style>
```

**拆分後**：

```
features/protection/
├── PasswordProtection.astro  # UI層（< 200 行）
├── PasswordForm.astro       # 表單組件（< 100 行）
├── EncryptionService.ts      # 加密/解密服務（< 200 行）
└── types.ts                # 類型定義
```

1. **EncryptionService.ts**
```typescript
export class EncryptionService {
  private readonly algorithm = 'AES-GCM'
  private readonly saltLength = 16

  async encrypt(text: string, key: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(this.saltLength))
    const keyMaterial = await this.deriveKey(key, salt)
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const encrypted = await crypto.subtle.encrypt(
      { name: this.algorithm, iv },
      keyMaterial,
      new TextEncoder().encode(text)
    )

    return this.combineResults(salt, iv, encrypted)
  }

  async decrypt(encrypted: string, key: string): Promise<string> {
    const { salt, iv, data } = this.splitResults(encrypted)
    const keyMaterial = await this.deriveKey(key, salt)

    const decrypted = await crypto.subtle.decrypt(
      { name: this.algorithm, iv },
      keyMaterial,
      data
    )

    return new TextDecoder().decode(decrypted)
  }

  private async deriveKey(key: string, salt: Uint8Array) {
    return await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(key),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    )
  }

  // ... 更多輔助方法
}
```

2. **PasswordForm.astro**
```astro
---
import Button from '../atoms/Button.astro'
import Input from '../atoms/Input.astro'

interface Props {
  error?: string
  loading?: boolean
  onSubmit?: (password: string) => void
}

const { error = '', loading = false, onSubmit } = Astro.props
---

<form id="password-form">
  <Input
    type="password"
    name="password"
    placeholder="請輸入密碼"
    disabled={loading}
  />
  {error && <p class="error">{error}</p>}
  <Button
    variant="primary"
    disabled={loading}
    type="submit"
  >
    {loading ? '解鎖中...' : '解鎖'}
  </Button>
</form>

<script>
  const form = document.getElementById('password-form')
  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    const password = (form.querySelector('input[name="password"]') as HTMLInputElement).value
    if (onSubmit) onSubmit(password)
  })
</script>

<style>
  .error {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
</style>
```

3. **PasswordProtection.astro（UI層）**
```astro
---
import PasswordForm from './PasswordForm.astro'
import { EncryptionService } from './EncryptionService'

const encryptionService = new EncryptionService()
let error = ''
let loading = false

async function handleSubmit(password: string) {
  loading = true
  try {
    const decrypted = await encryptionService.decrypt(encryptedContent, password)
    // 處理解密後的內容
  } catch (e) {
    error = '密碼錯誤'
  } finally {
    loading = false
  }
}
---

<PasswordForm
  error={error}
  loading={loading}
  onSubmit={handleSubmit}
/>
```

### 方法 4：提取通用組件

適用於有相似模式的組件。

**實例：Widget 組件提取**

**拆分前**：
```astro
---
// widget/Profile.astro
---

<div class="widget card-base">
  <div class="widget-header">
    <Icon name="material-symbols:person" />
    <h3>個人資料</h3>
  </div>
  <div class="widget-content">
    <!-- 內容 -->
  </div>
</div>

---

// widget/Categories.astro
---

<div class="widget card-base">
  <div class="widget-header">
    <Icon name="material-symbols:category" />
    <h3>分類</h3>
  </div>
  <div class="widget-content">
    <!-- 內容 -->
  </div>
</div>
```

**拆分後**：

1. **widgets/common/WidgetLayout.astro**
```astro
---
import Icon from '../../atoms/Icon.astro'

interface Props {
  name?: string
  icon?: string
  isCollapsed?: boolean
  collapsedHeight?: string
  class?: string
}

const { name, icon, isCollapsed, collapsedHeight, class: className = '' } = Astro.props
---

<div class="widget-layout {className}" data-collapsed={isCollapsed}>
  {name && (
    <div class="widget-header">
      {icon && <Icon name={icon} />}
      <h3>{name}</h3>
    </div>
  )}
  <div class="widget-content">
    <slot />
  </div>
</div>

<style define:vars={{ collapsedHeight }}>
  .widget-layout[data-collapsed="true"] .widget-content {
    max-height: var(--collapsed-height);
    overflow: hidden;
  }

  .widget-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }

  .widget-content {
    padding: 1rem;
  }
</style>
```

2. **widget/Profile.astro**
```astro
---
import WidgetLayout from './common/WidgetLayout.astro'
import Avatar from '../../atoms/Avatar.astro'
---

<WidgetLayout name="個人資料" icon="material-symbols:person">
  <Avatar src="/avatar.png" size="lg" />
  <div class="profile-info">
    <h4>Mizuki</h4>
    <p>前端開發者</p>
  </div>
</WidgetLayout>
```

3. **widget/Categories.astro**
```astro
---
import WidgetLayout from './common/WidgetLayout.astro'
import ChipCloud from '../../molecules/ChipCloud.astro'

const categories = await getCategories()
---

<WidgetLayout name="分類" icon="material-symbols:category">
  <ChipCloud items={categories} hrefPrefix="/category/" />
</WidgetLayout>
```

## 拆分步驟

### 完整拆分流程

#### 步驟 1：分析和規劃

1. **評估組件**
   ```bash
   # 查看組件行數
   wc -l src/components/ComplexComponent.astro

   # 查看組件依賴
   grep -r "import" src/components/ComplexComponent.astro
   ```

2. **識別功能模塊**
   - 列出所有功能點
   - 識別重複模式
   - 標記獨立的功能模塊

3. **創建拆分計劃**
   ```markdown
   ## 組件拆分計劃：ComplexComponent

   ### 目標
   - 拆分爲 5 個子組件
   - 減少主組件到 < 100 行
   - 提取 3 個 Hooks

   ### 子組件列表
   1. SubComponent1.astro - 功能描述（預計行數）
   2. SubComponent2.svelte - 功能描述（預計行數）
   3. ...

   ### Hooks 列表
   1. useFeature1.ts - 功能描述
   2. useFeature2.ts - 功能描述
   ```

#### 步驟 2：創建目錄結構

```bash
# 創建子組件目錄
mkdir -p src/components/ComplexComponent/controls
mkdir -p src/components/ComplexComponent/hooks
mkdir -p src/components/ComplexComponent/utils
```

#### 步驟 3：提取邏輯到 Hooks

```typescript
// 提取狀態管理和業務邏輯
export function useFeature() {
  const actualState = $state(initialValue)

  const action = () => {
    // 邏輯
  }

  return { actualState, action }
}
```

#### 步驟 4：創建子組件

```astro
---
// 子組件專注於 UI 渲染
let { value, onChange } = $props<{
  value: string
  onChange: (value: string) => void
}>()
---

<input type="text" bind:value={value} oninput={(e) => onChange(e.target.value)} />
```

#### 步驟 5：更新主組件

```astro
---
import SubComponent1 from './SubComponent1.astro'
import SubComponent2 from './SubComponent2.svelte'
import { useFeature } from './hooks/useFeature'

const feature = useFeature()
---

<div class="main-component">
  <SubComponent1
    value={feature.value}
    onChange={feature.action}
  />
  <SubComponent2 />
</div>
```

#### 步驟 6：更新導入路徑

```bash
# 查找所有使用原組件的文件
grep -r "ComplexComponent" src/pages src/layouts

# 批量更新導入路徑
sed -i 's|import ComplexComponent from.*|import ComplexComponent from "@components/organisms/ComplexComponent/ComplexComponent.astro"|g' src/pages/*.astro
```

#### 步驟 7：測試和驗證

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

#### 步驟 8：清理和優化

```bash
# 刪除舊文件
rm src/components/ComplexComponent.astro.backup

# 更新文檔
# 添加組件拆分說明到 CHANGELOG
```

## 避免拆分的陷阱

### 陷阱 1：過度拆分

**問題**：將組件拆分得太細，增加管理成本。

**示例**：
```astro
---
// ❌ 過度拆分：每個按鈕都是一個獨立組件
import PlayButton from './PlayButton.astro'
import PauseButton from './PauseButton.astro'
import PrevButton from './PrevButton.astro'
import NextButton from './NextButton.astro'
---

<div class="controls">
  <PrevButton />
  <PlayButton />
  <PauseButton />
  <NextButton />
</div>
```

**修正**：
```svelte
<script lang="ts">
  // ✅ 合理拆分：使用一個組件處理播放控制
  interface Props {
    isPlaying: boolean
    onTogglePlay: () => void
    onPrev: () => void
    onNext: () => void
  }
  let { isPlaying, onTogglePlay, onPrev, onNext }: Props = $props()
</script>

<div class="controls">
  <button onclick={onPrev}>Prev</button>
  <button onclick={onTogglePlay}>
    {isPlaying ? 'Pause' : 'Play'}
  </button>
  <button onclick={onNext}>Next</button>
</div>
```

### 陷阱 2：循環依賴

**問題**：組件 A 依賴 B，B 又依賴 A。

**示例**：
```typescript
// ❌ 組件 A 依賴 B
import ComponentB from './ComponentB.astro'

// 組件 B 又依賴 A
import ComponentA from './ComponentA.astro'
```

**解決方案**：
```typescript
// ✅ 提取共享狀態到 Store
import { sharedStore } from '../stores/shared'

// 組件 A 使用 Store
const { value } = sharedStore

// 組件 B 也使用 Store
const { value } = sharedStore
```

### 陷阱 3：Props drilling

**問題**：Props 逐層傳遞，中間組件不需要使用這些 Props。

**示例**：
```astro
---
// ❌ 祖先組件
<ComponentA value={value} />

// 中間組件（不需要 value）
<ComponentB value={value} />

// 孫組件使用 value
<ComponentC value={value} />
```

**解決方案**：
```typescript
// ✅ 使用 Context 或 Store
import { createContext } from './context'

// 在祖先組件提供 Context
<Context.Provider value={{ value }}>
  <ComponentA />
</Context.Provider>

// 在孫組件消費 Context
const { value } = useContext(Context)
```

### 陷阱 4：過早優化

**問題**：在不確定需求的情況下提前拆分。

**解決方案**：遵循 YAGNI 原則（You Aren't Gonna Need It）

- 只在真正需要時才拆分
- 先實現功能，再重構
- 保持簡單，避免過度設計

## 實戰案例

### 案例 1：MusicPlayer 完整拆分

**背景**：
- MusicPlayer.svelte 934 行
- 職責過多：音頻控制、UI 渲染、播放列表管理
- 狀態複雜：15+ 個響應式變量

**拆分策略**：
1. 按 UI 層級拆分（MiniPlayer、ExpandedPlayer、PlaylistPanel）
2. 按功能拆分（播放控制、進度條、音量控制）
3. 提取業務邏輯到 Hooks（useAudio、usePlaylist、useVolume）

**拆分結果**：
```
MusicPlayer.svelte: 50 行（組合層）
├── MiniPlayer.svelte: 150 行
├── ExpandedPlayer.svelte: 200 行
├── PlaylistPanel.svelte: 120 行
├── controls/
│   ├── PlayControls.svelte: 80 行
│   ├── ProgressBar.svelte: 100 行
│   └── VolumeControl.svelte: 60 行
└── hooks/
    ├── useAudio.ts: 80 行
    ├── usePlaylist.ts: 90 行
    └── useVolume.ts: 50 行
```

**收益**：
- ✅ 主組件從 934 行減少到 50 行（-94%）
- ✅ 每個子組件職責單一，易於理解和測試
- ✅ Hooks 可複用
- ✅ 更容易維護和擴展

### 案例 2：Calendar 完整拆分

**背景**：
- Calendar.astro 527 行
- 日曆算法複雜
- 多種視圖模式

**拆分策略**：
1. 提取日期計算邏輯到 calendarUtils.ts
2. 按 UI 層級拆分（Header、Grid、PostList）
3. 創建 useCalendar Hook 管理狀態

**拆分結果**：
```
Calendar.astro: 50 行（組合層）
├── CalendarHeader.svelte: 80 行
├── CalendarGrid.svelte: 150 行
├── PostList.astro: 100 行
├── hooks/
│   └── useCalendar.ts: 120 行
└── utils/
    └── calendarUtils.ts: 80 行
```

**收益**：
- ✅ 主組件從 527 行減少到 50 行（-90%）
- ✅ 日曆算法獨立，易於測試
- ✅ UI 和邏輯分離
- ✅ 可複用的 calendarUtils

### 案例 3：TOC 合併拆分

**背景**：
- FloatingTOC.astro 548 行
- MobileTOC.svelte 651 行
- widget/TOC.astro 379 行
- 三個組件功能重複

**拆分策略**：
1. 提取公共邏輯到 useTOC Hook
2. 創建統一的 TOC 組件
3. 按設備分離 UI（DesktopTOC、MobileTOC）

**拆分結果**：
```
organisms/TOC/
├── TOC.astro: 50 行（組合層）
├── DesktopTOC.svelte: 200 行
├── MobileTOC.svelte: 150 行
└── hooks/
    └── useTOC.ts: 180 行
```

**收益**：
- ✅ 消除重複代碼
- ✅ 統一的 TOC 邏輯
- ✅ 更容易維護
- ✅ 總行數從 1578 行減少到 580 行（-63%）

## 拆分後驗證

### 功能驗證

```bash
# 運行開發服務器
pnpm run dev

# 手動測試所有功能
# - 播放器播放/暫停/切換
# - 日曆導航和選擇
# - TOC 導航和滾動
```

### 性能驗證

```bash
# 運行 Lighthouse
npx lighthouse http://localhost:4321 --view

# 檢查指標
# - Performance
# - First Contentful Paint
# - Time to Interactive
```

### 代碼質量驗證

```bash
# 運行 Lint
pnpm run lint

# 運行類型檢查
pnpm run typecheck

# 運行測試
pnpm run test
```

### 對比驗證

```bash
# 統計拆分前後行數
echo "拆分前：934 行"
echo "拆分後：$(wc -l MusicPlayer/*.svelte | tail -1)"

# 統計組件數量
find . -name "*.svelte" -o -name "*.astro" | wc -l
```

## 文檔更新

### 拆分後需要更新的文檔

1. **組件文檔**
   ```markdown
   ## MusicPlayer 組件

   ### 架構
   - MusicPlayer.astro（組合層）
   - MiniPlayer.svelte（迷你播放器）
   - ExpandedPlayer.svelte（展開播放器）
   - PlaylistPanel.svelte（播放列表）

   ### 使用方法
   ```astro
   <MusicPlayer client:visible />
   ```

   ### Props
   - playlist: 播放列表
   - autoplay: 是否自動播放
   ```

2. **遷移指南**
   ```markdown
   ## 從舊版本遷移

   ### 變更
   - MusicPlayer 組件內部結構已重構
   - API 保持不變，無需修改使用代碼

   ### 注意事項
   - 確保 client:visible 指令正確使用
   ```

3. **CHANGELOG**
   ```markdown
   ## [2.0.0] - 2026-03-17

   ### Changed
   - 重構 MusicPlayer 組件架構
   - 拆分 Calendar 組件
   - 合併 TOC 相關組件

   ### Performance
   - 減少初始加載包大小 30%
   - 提升組件渲染性能 40%
   ```

## 常見問題（FAQ）

### Q1: 拆分會影響性能嗎？

**A**: 不會。實際上，拆分後：
- 可以使用 `client:visible` 等指令按需加載
- 更細的組件可以更好地緩存
- 減少不必要的重渲染

### Q2: 拆分後如何處理組件間通信？

**A**: 使用以下方法：
- Props 傳遞（父 → 子）
- 事件派發（子 → 父）
- 全局 Store（跨組件）
- Context API（深層組件）

### Q3: 什麼時候需要拆分，什麼時候不需要？

**A**:
**需要拆分**：
- 組件 > 500 行
- 職責 > 3 個
- 狀態變量 > 10 個
- 難以理解和測試

**不需要拆分**：
- 組件 < 200 行
- 職責單一
- 邏輯簡單
- 易於維護

### Q4: 拆分後如何保持向後兼容？

**A**:
1. 保持公共 API 不變
2. 使用默認值
3. 提供遷移指南
4. 逐步棄用舊 API

### Q5: 如何測試拆分後的組件？

**A**:
1. **單元測試**：測試單個組件
   ```typescript
   test('MiniPlayer renders correctly', () => {
     const { getByRole } = render(MiniPlayer, { isPlaying: true })
     expect(getByRole('button')).toBeInTheDocument()
   })
   ```

2. **集成測試**：測試組件組合
   ```typescript
   test('MusicPlayer integrates sub-components', () => {
     const { getByText } = render(MusicPlayer, { playlist })
     expect(getByText('Play')).toBeInTheDocument()
   })
   ```

3. **E2E 測試**：測試用戶流程
   ```typescript
   test('User can play music', async ({ page }) => {
     await page.goto('/')
     await page.click('[data-testid="play-button"]')
     await expect(page.locator('[data-testid="playing-indicator"]')).toBeVisible()
   })
   ```

## 總結

組件拆分是提升代碼質量的關鍵步驟。記住：

✅ **拆分原則**
- 單一職責（SRP）
- 接口隔離（ISP）
- 依賴倒置（DIP）
- 保持簡單（KISS）

✅ **拆分方法**
- 按功能拆分
- 按 UI 層級拆分
- 按關注點拆分
- 提取通用組件

✅ **避免陷阱**
- 過度拆分
- 循環依賴
- Props drilling
- 過早優化

✅ **持續改進**
- 定期評估組件
- 重構大型組件
- 保持文檔更新
- 分享最佳實踐

---

**最後更新**: 2026-03-17
**維護者**: Mizuki 開發團隊

## 參考資源

- [組件架構設計規範](./01-component-architecture.md)
- [Aruma 組件拆分示例](../../demo/Aruma/docs/rule/05-component-architecture.md)
- [React 組件拆分指南](https://react.dev/learn/thinking-in-react)
