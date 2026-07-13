# Mizuki 內容倉庫結構說明

本文檔說明如何創建和組織 Mizuki 博客的內容倉庫。

## 📁 推薦的目錄結構

```
Mizuki-Content/
├── posts/              # 博客文章
│   ├── post-1.md
│   ├── post-2.md
│   └── my-article/
│       ├── index.md
│       └── cover.jpg
├── spec/               # 特殊頁面
│   ├── about.md
│   └── friends.md
├── data/               # 數據文件
│   ├── anime.ts
│   ├── projects.ts
│   ├── skills.ts
│   └── timeline.ts
├── images/             # 圖片資源
│   ├── albums/         # 相冊圖片
│   ├── diary/          # 日記圖片
│   └── posts/          # 文章圖片
└── README.md
```

## 🚀 快速開始

### 1. 創建新的內容倉庫

```bash
# 創建新倉庫
mkdir Mizuki-Content
cd Mizuki-Content
git init

# 創建基本目錄結構
mkdir -p posts spec data images/albums images/diary images/posts

# 創建 README
echo "# Mizuki 博客內容" > README.md
```

### 2. 從現有 Mizuki 項目遷移內容

如果你已經有一個 Mizuki 項目,可以將內容遷移到新倉庫:

```bash
# 在 Mizuki 項目根目錄執行
cd /path/to/Mizuki

# 複製內容到新倉庫
cp -r src/content/posts/* /path/to/Mizuki-Content/posts/
cp -r src/content/spec/* /path/to/Mizuki-Content/spec/
cp -r src/data/* /path/to/Mizuki-Content/data/
cp -r public/images/* /path/to/Mizuki-Content/images/
```

### 3. 提交到 Git

```bash
cd /path/to/Mizuki-Content

git add .
git commit -m "Initial commit: Add blog content"

# 添加遠程倉庫並推送
git remote add origin https://github.com/your-username/Mizuki-Content.git
git branch -M main
git push -u origin main
```

## 🔗 連接到 Mizuki 代碼倉庫

### 方式一: Git Submodule (推薦)

在 Mizuki 代碼倉庫中:

```bash
cd /path/to/Mizuki

# 添加內容倉庫作爲 submodule
git submodule add https://github.com/your-username/Mizuki-Content.git content

# 提交 submodule 配置
git add .gitmodules content
git commit -m "Add content repository as submodule"
git push
```

配置環境變量 `.env`:

```bash
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
USE_SUBMODULE=true
```

### 方式二: 獨立倉庫模式

配置環境變量 `.env`:

```bash
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
CONTENT_DIR=./content
USE_SUBMODULE=false
```

然後運行同步:

```bash
pnpm run sync-content
```

## 📝 內容編寫指南

### 文章前言 (Frontmatter)

每篇文章都應該包含以下前言:

```yaml
---
title: 文章標題
published: 2024-01-01
description: 文章描述
image: ./cover.jpg
tags: [標籤1, 標籤2]
category: 分類
draft: false
pinned: false
lang: zh-CN
---
```

### 目錄組織

- **單文件文章**: 直接在 `posts/` 目錄下創建 `.md` 文件
- **包含圖片的文章**: 創建文件夾,將 `index.md` 和圖片放在一起

示例:
```
posts/
├── simple-post.md                    # 簡單文章
└── complex-post/                     # 複雜文章
    ├── index.md                      # 文章內容
    ├── cover.jpg                     # 封面圖
    └── diagram.png                   # 文章中的圖片
```

## 🔄 更新工作流

### 本地開發

1. 修改內容倉庫中的文件
2. 提交併推送更改
3. 在代碼倉庫中同步內容:
   ```bash
   cd /path/to/Mizuki
   pnpm run sync-content
   ```

### 使用 Submodule 時

```bash
# 更新 submodule
cd /path/to/Mizuki
git submodule update --remote --merge

# 或者使用同步腳本
pnpm run sync-content
```

### 部署時自動同步

在 CI/CD 配置中添加:

```yaml
- name: Sync Content
  run: pnpm run sync-content
  env:
    CONTENT_REPO_URL: ${{ secrets.CONTENT_REPO_URL }}
    USE_SUBMODULE: true
```

## 📦 數據文件說明

### anime.ts
番劇數據配置,包含你觀看的動畫列表。

### projects.ts
項目展示數據,展示你的作品集。

### skills.ts
技能數據,展示你的技術棧。

### timeline.ts
時間線數據,記錄重要事件。

## 🎨 圖片管理

### 目錄說明

- `images/albums/`: 相冊頁面的圖片
- `images/diary/`: 日記頁面的圖片  
- `images/posts/`: 文章中引用的公共圖片

### 圖片引用

在文章中引用圖片:

```markdown
<!-- 相對路徑 (推薦) -->
![描述](./image.jpg)

<!-- 公共圖片目錄 -->
![描述](/images/posts/image.jpg)
```

## ⚠️ 注意事項

1. **不要**在內容倉庫中包含代碼文件
2. **保持**目錄結構與主倉庫一致
3. **定期**備份重要內容
4. **使用** Git LFS 管理大型圖片文件(可選)

## 🔐 私有內容倉庫

如果你的內容倉庫是私有的，需要配置訪問權限。詳細的配置方法請參考：

- [內容分離完整指南 - 私有倉庫配置](./CONTENT_SEPARATION.md#-私有倉庫配置)
- [部署指南](./DEPLOYMENT.md) - 各平臺的私有倉庫部署配置

### 快速參考

**本地開發**: 推薦使用 SSH 密鑰
```bash
CONTENT_REPO_URL=git@github.com:your-username/Mizuki-Content-Private.git
USE_SUBMODULE=true
```

**CI/CD 部署**: 根據平臺選擇
- GitHub Actions: 使用 `GITHUB_TOKEN` (同賬號) 或 SSH 密鑰
- Vercel/Netlify: 授權訪問或使用 Token

## 📚 參考資源

- [Git Submodule 文檔](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)
- [Mizuki 文檔](https://docs.mizuki.mysqil.com/)
- [Astro Content Collections](https://docs.astro.build/zh-cn/guides/content-collections/)

---

💡 **提示**: 建議先在本地測試內容同步流程,確保一切正常後再配置自動化部署。
