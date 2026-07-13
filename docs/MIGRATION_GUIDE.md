# Mizuki 內容遷移指南

本指南將幫助你將現有的 Mizuki 博客從單倉庫模式遷移到代碼內容分離模式。

> 💡 **提示**: 如果是新項目,建議先閱讀 [內容分離完整指南](./CONTENT_SEPARATION.md)

## 📋 遷移前準備

### 檢查清單

- [ ] **備份整個項目** (重要!)
- [ ] 確保所有更改已提交到 Git
- [ ] 瞭解你要使用的模式 (推薦 Submodule)
- [ ] 在 GitHub/GitLab 創建新的內容倉庫

## 🚀 遷移步驟

### 步驟 1: 創建內容倉庫

```bash
# 創建並進入新目錄
mkdir Mizuki-Content
cd Mizuki-Content

# 初始化 Git 倉庫
git init

# 創建目錄結構
mkdir -p posts spec data images/albums images/diary images/posts

# 創建 README
cat > README.md << 'EOF'
# Mizuki 博客內容

這是 Mizuki 博客的內容倉庫,包含所有文章、數據和圖片。

## 目錄結構

- `posts/` - 博客文章
- `spec/` - 特殊頁面 (關於、友鏈等)
- `data/` - 數據文件 (番劇、項目、技能、時間線)
- `images/` - 圖片資源

## 使用方法

此倉庫作爲 Mizuki 代碼倉庫的內容源,通過 Git Submodule 或獨立模式關聯。

詳細說明請查看: https://github.com/matsuzaka-yuki/Mizuki
EOF
```

### 步驟 2: 從 Mizuki 項目複製內容

```bash
# 設置路徑變量
MIZUKI_PATH="/path/to/your/Mizuki"
CONTENT_PATH="/path/to/Mizuki-Content"

# 複製文章
cp -r "$MIZUKI_PATH/src/content/posts/"* "$CONTENT_PATH/posts/"

# 複製特殊頁面
cp -r "$MIZUKI_PATH/src/content/spec/"* "$CONTENT_PATH/spec/"

# 複製數據文件
cp "$MIZUKI_PATH/src/data/anime.ts" "$CONTENT_PATH/data/" 2>/dev/null || echo "anime.ts not found"
cp "$MIZUKI_PATH/src/data/projects.ts" "$CONTENT_PATH/data/" 2>/dev/null || echo "projects.ts not found"
cp "$MIZUKI_PATH/src/data/skills.ts" "$CONTENT_PATH/data/" 2>/dev/null || echo "skills.ts not found"
cp "$MIZUKI_PATH/src/data/timeline.ts" "$CONTENT_PATH/data/" 2>/dev/null || echo "timeline.ts not found"

# 複製圖片
cp -r "$MIZUKI_PATH/public/images/albums/"* "$CONTENT_PATH/images/albums/" 2>/dev/null || echo "albums not found"
cp -r "$MIZUKI_PATH/public/images/diary/"* "$CONTENT_PATH/images/diary/" 2>/dev/null || echo "diary not found"

echo "✅ 內容複製完成!"
```

### 步驟 3: 提交內容倉庫

```bash
cd "$CONTENT_PATH"

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Migrate content from Mizuki monorepo"

# 添加遠程倉庫 (替換爲你的倉庫地址)
git remote add origin https://github.com/your-username/Mizuki-Content.git

# 推送
git branch -M master
git push -u origin master

echo "✅ 內容倉庫已推送!"
```

### 步驟 4: 配置 Mizuki 代碼倉庫

```bash
cd "$MIZUKI_PATH"

# 創建 .env 文件
cp .env.example .env

# 編輯 .env 文件,啓用內容分離
cat > .env << 'EOF'
# 啓用內容分離
ENABLE_CONTENT_SYNC=true

# 內容倉庫配置
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
USE_SUBMODULE=true
EOF

# 運行同步腳本
pnpm run sync-content

# 提交更改
git add .env.example
git commit -m "Enable content separation"
git push
```

> 📖 更多配置選項請參考 [內容分離完整指南](./CONTENT_SEPARATION.md)

### 步驟 5: 清理原倉庫中的內容 (可選)

⚠️ **警告**: 只有在確認內容已成功遷移後才執行此步驟!

```bash
cd "$MIZUKI_PATH"

# 備份原內容 (以防萬一)
mkdir -p ../mizuki-content-backup
cp -r src/content/posts ../mizuki-content-backup/
cp -r src/content/spec ../mizuki-content-backup/
cp -r src/data ../mizuki-content-backup/
cp -r public/images ../mizuki-content-backup/

# 刪除已遷移的內容 (保留目錄結構)
rm -rf src/content/posts/*
rm -rf src/content/spec/*
rm -f src/data/anime.ts src/data/projects.ts src/data/skills.ts src/data/timeline.ts
rm -rf public/images/albums/* public/images/diary/*

# 創建 .gitkeep 文件保留目錄
touch src/content/posts/.gitkeep
touch src/content/spec/.gitkeep
touch public/images/albums/.gitkeep
touch public/images/diary/.gitkeep

# 提交更改
git add .
git commit -m "Remove migrated content (now in separate repository)"
git push
```

## 🧪 測試遷移

### 本地測試

```bash
cd "$MIZUKI_PATH"

# 同步內容
pnpm run sync-content

# 啓動開發服務器
pnpm dev

# 訪問 http://localhost:4321 檢查:
# - 文章是否正常顯示
# - 圖片是否正確加載
# - 特殊頁面是否工作
# - 數據頁面是否正常 (番劇、項目等)
```

### 構建測試

```bash
# 構建項目
pnpm build

# 預覽構建結果
pnpm preview

# 檢查所有功能是否正常
```

## 🔄 日常工作流

### 更新內容

```bash
# 1. 在內容倉庫中修改
cd "$CONTENT_PATH"
# 編輯文件...
git add .
git commit -m "Update content"
git push

# 2. 在代碼倉庫中同步
cd "$MIZUKI_PATH"
pnpm run sync-content
```

### 使用 Submodule 時

```bash
cd "$MIZUKI_PATH"

# 更新 submodule 到最新版本
git submodule update --remote --merge

# 或者使用同步腳本 (推薦)
pnpm run sync-content

# 提交 submodule 更新
git add content
git commit -m "Update content submodule"
git push
```

## 🚀 部署配置

遷移完成後,需要在部署平臺配置環境變量:

```bash
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
USE_SUBMODULE=true
```

詳細的部署配置(包括私有倉庫、GitHub Actions、Vercel 等)請參考 [內容分離完整指南 - CI/CD 部署](./CONTENT_SEPARATION.md#-cicd-部署)

## ⚠️ 常見問題

### Q: 同步腳本失敗怎麼辦?

A: 檢查:
1. 網絡連接是否正常
2. Git 憑據是否配置正確
3. `ENABLE_CONTENT_SYNC=true` 是否已設置
4. `CONTENT_REPO_URL` 是否正確
5. 是否有足夠的磁盤空間

運行 `pnpm run check-env` 檢查配置。

### Q: 符號鏈接在 Windows 上不工作?

A: 需要以管理員身份運行,或者腳本會自動切換到複製模式。

### Q: 如何回滾到單倉庫模式?

A: 在 `.env` 中設置 `ENABLE_CONTENT_SYNC=false`,然後從備份或內容倉庫複製內容回本地。

### Q: 遇到私有倉庫認證問題?

A: 參考 [內容分離完整指南 - 私有倉庫配置](./CONTENT_SEPARATION.md#-私有倉庫配置)

## 📚 參考文檔

- [內容分離完整指南](./CONTENT_SEPARATION.md) - 詳細配置說明
- [內容倉庫結構說明](./CONTENT_REPOSITORY.md) - 推薦的倉庫結構
- [Git Submodule 文檔](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)

---

💡 **提示**: 遷移前建議先在測試環境中驗證整個流程!
