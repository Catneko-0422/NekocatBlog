# 相冊功能使用說明

Mizuki 主題的相冊功能採用**自動掃描**機制，只需創建文件夾、放置圖片和配置文件即可，無需手動編寫代碼（外鏈相冊則需要手動定義每張圖片的 `src` 等信息）。

## 快速開始

創建一個相冊只需 3 步：

1. 在 `public/images/albums/` （本說明文件所在目錄）下創建一個文件夾（文件夾名即爲相冊 ID）
2. 在文件夾中放置 `cover.jpg`（封面圖）和其他照片
3. 創建 `info.json` 配置文件

完成！相冊會自動出現在相冊列表頁面。

## 目錄結構

```
public/images/albums/
├── my-travel-2024/              # 相冊文件夾（文件夾名 = 相冊ID）
│   ├── info.json                # 相冊配置文件（必需）
│   ├── cover.jpg                # 封面圖（必需）
│   ├── photo1.jpg               # 相冊照片
│   ├── photo2.jpg
│   └── photo3.jpg
├── daily-life/                  # 另一個相冊
│   ├── info.json
│   ├── cover.jpg
│   └── ...
└── README.md                    # 本說明文件
```

## 配置文件說明

### 本地圖片模式

在相冊文件夾中創建 `info.json`：

```json
{
  "title": "我的旅行相冊",
  "description": "2024年夏天的美好回憶",
  "date": "2024-08-01",
  "location": "日本東京",
  "tags": ["旅行", "風景", "夏天"],
  "layout": "masonry",
  "columns": 3,
  "hidden": false
}
```

**配置項說明：**

| 字段 | 必需 | 說明 | 默認值 |
|------|------|------|--------|
| `title` | 是 | 相冊標題 | 使用文件夾名 |
| `description` | 否 | 相冊描述 | 空 |
| `date` | 否 | 相冊日期（格式：YYYY-MM-DD） | 當前日期 |
| `location` | 否 | 拍攝地點 | 空 |
| `tags` | 否 | 標籤數組 | `[]` |
| `layout` | 否 | 佈局方式：`grid`（網格）或 `masonry`（瀑布流） | `grid` |
| `columns` | 否 | 列數（2-4） | `3` |
| `hidden` | 否 | 是否隱藏相冊 | `false` |

### 外鏈圖片模式

如果想使用外部圖片鏈接（例如使用圖牀），設置 `mode: "external"`：

```json
{
  "mode": "external",
  "title": "外鏈相冊示例",
  "description": "使用外部圖片鏈接的相冊",
  "date": "2024-08-28",
  "location": "網絡",
  "tags": ["外鏈", "示例"],
  "layout": "masonry",
  "columns": 3,
  "cover": "https://example.com/cover.jpg",
  "photos": [
    {
      "id": "photo-1",
      "src": "https://example.com/photo1.jpg",
      "alt": "圖片描述",
      "title": "圖片標題",
      "description": "詳細描述",
      "tags": ["標籤1"],
      "width": 1920,
      "height": 1280
    }
  ]
}
```

**外鏈模式額外字段：**

| 字段 | 必需 | 說明 |
|------|------|------|
| `mode` | 是 | 設置爲 `"external"` 啓用外鏈模式 |
| `cover` | 是 | 封面圖片 URL （僅外鏈模式需要） |
| `photos` | 是 | 照片數組，每張照片包含 `src`、`alt`、`title` 等字段，詳見下表 |

**photos 數組中每張圖片的字段說明（僅外鏈模式需要）：**

| 字段 | 必需 | 說明 | 示例 |
|------|------|------|------|
| `id` | 否 | 照片唯一標識符 | `"photo-1"` |
| `src` | 是 | 照片 URL 地址 | `"https://example.com/photo.jpg"` |
| `thumbnail` | 否 | 縮略圖 URL（不提供則使用原圖） | `"https://example.com/thumb.jpg"` |
| `alt` | 否 | 圖片替代文本（用於無障礙訪問） | `"美麗的日落"` |
| `title` | 否 | 照片標題 | `"海邊日落"` |
| `description` | 否 | 照片詳細描述 | `"2024年夏天在海邊拍攝的日落"` |
| `tags` | 否 | 照片標籤數組 | `["日落", "海邊"]` |
| `date` | 否 | 拍攝日期（格式：YYYY-MM-DD） | `"2024-08-01"` |
| `location` | 否 | 拍攝地點 | `"沖繩海灘"` |
| `width` | 否 | 照片寬度（像素） | `1920` |
| `height` | 否 | 照片高度（像素） | `1280` |
| `camera` | 否 | 相機型號 | `"Canon EOS R5"` |
| `lens` | 否 | 鏡頭型號 | `"RF 24-70mm F2.8"` |
| `settings` | 否 | 拍攝參數（字符串） | `"f/2.8, 1/500s, ISO 100"` |

> **注意**：
> - 本地圖片模式**不需要**配置 `photos` 字段，系統會自動掃描文件夾中的所有圖片文件
> - 外鏈模式**必須**手動配置 `photos` 數組，至少需要提供 `src` 字段
> - 建議爲外鏈照片提供 `thumbnail` 縮略圖以提升加載速度

## 圖片格式建議

### 封面圖片 (cover.jpg)
- **尺寸**：800×600px（4:3 比例）
- **格式**：JPG （外鏈模式可支持更多格式）
- **大小**：建議 < 200KB

### 相冊照片
- **格式**：JPG、JPEG、PNG、WebP、GIF、SVG、AVIF
- **尺寸**：建議最大寬度 1920px
- **優化**：建議壓縮後上傳，提升加載速度

## 佈局選項

### 網格佈局 (Grid)
```json
{
  "layout": "grid",
  "columns": 3
}
```
- 適合尺寸統一的照片
- 支持 2-4 列
- 照片會被裁剪爲正方形

### 瀑布流佈局 (Masonry)
```json
{
  "layout": "masonry",
  "columns": 3
}
```
- 適合不同尺寸的照片
- 保持照片原始比例
- 自動排列，視覺效果更自然

## 示例相冊

項目包含以下示例相冊供參考：

### AcgExample
- **本地圖片模式**示例
- 展示如何使用本地圖片創建相冊
- 瀑布流佈局，3 列

### ExternalExample
- **外鏈圖片模式**示例（默認隱藏）
- 展示如何使用外部圖片鏈接
- 適合使用圖牀的場景

### HiddenExample
- **隱藏相冊**示例
- 展示如何創建不在列表顯示的相冊
- 可通過直接訪問 URL 查看

## 高級功能

### 文件名標籤（實驗性）

系統支持從文件名解析標籤（格式：`基本名_標籤1_標籤2.ext`）：

```
photo_sunset_beach.jpg  →  標籤：sunset, beach
```

### 隱藏相冊

設置 `"hidden": true` 可以隱藏相冊，但仍可通過 URL 直接訪問：

```
訪問：/albums/your-album-id/
```

## 常見問題

**Q: 爲什麼我的相冊沒有顯示？**  
A: 檢查是否存在 `info.json` 和 `cover.jpg`，以及 `hidden` 是否設置爲 `true`。

**Q: 可以使用其他圖片格式嗎？**  
A: 可以，支持 JPG、PNG、WebP、GIF、SVG、AVIF 等格式。

**Q: 如何優化圖片加載速度？**  
A: 建議使用 WebP 等壓縮率較高的格式壓縮圖片大小。使用外鏈模式時設置縮略圖。

**Q: 如何更改相冊排序？**  
A: 相冊按時間順序展示，可通過修改相冊的 `date` 字段調整排序。
