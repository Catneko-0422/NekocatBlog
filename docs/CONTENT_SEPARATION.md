# Mizuki 內容分離完整指南

本指南詳細說明如何在 Mizuki 中使用內容分離功能,包括基礎配置、私有倉庫、CI/CD 部署等所有場景。

## 📖 目錄

- [快速開始](#-快速開始)
- [ENABLE_CONTENT_SYNC 控制開關](#-enable_content_sync-控制開關)
- [配置方式](#-配置方式)
- [私有倉庫](#-私有倉庫配置)
- [CI/CD 部署](#-cicd-部署)
- [常用命令](#-常用命令)
- [故障排查](#-故障排查)

---

## 🚀 快速開始

### 新手推薦: 本地模式 (最簡單)

**不需要任何配置**,直接開始使用:

```bash
# 克隆項目
git clone https://github.com/LyraVoid/Mizuki.git
cd Mizuki

# 安裝依賴
pnpm install

# 直接開發
pnpm dev
```

內容存放在 `src/content/` 和 `public/images/` 目錄,與代碼一起管理。

### 進階: 啓用內容分離

如果需要將內容獨立管理(多人協作、私有內容、獨立版本控制),按以下步驟配置:

```bash
# 1. 創建 .env 文件
cp .env.example .env

# 2. 編輯 .env,啓用內容分離
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git

# 3. 同步內容
pnpm run sync-content

# 4. 啓動開發
pnpm dev
```

---

## 🎛️ ENABLE_CONTENT_SYNC 控制開關

### 功能說明

`ENABLE_CONTENT_SYNC` 是一個一鍵開關,控制是否啓用內容分離功能。

| 值 | 說明 | 適用場景 |
|---|---|---|
| `false` 或未設置 | **禁用內容分離** (默認) | 新手、個人博客、內容較少 |
| `true` | **啓用內容分離** | 團隊協作、私有內容、大量文章 |

### 配置位置

在項目根目錄的 `.env` 文件中:

```bash
# 禁用內容分離 (使用本地內容)
ENABLE_CONTENT_SYNC=false

# 或啓用內容分離 (從遠程倉庫同步)
ENABLE_CONTENT_SYNC=true
```

### 使用場景對比

#### 場景 1: 本地模式 (推薦新手)

**特點**:
- ✅ 無需額外配置
- ✅ 內容和代碼一起管理
- ✅ 適合個人博客、小型項目

**配置**:
```bash
# .env (或不創建 .env 文件)
ENABLE_CONTENT_SYNC=false
```

**工作流程**:
```bash
# 直接編輯 src/content/ 下的文章
pnpm dev

# 提交時一起提交代碼和內容
git add .
git commit -m "Update content"
git push
```

#### 場景 2: 獨立倉庫（分離）模式

**特點**:
- ✅ 內容獨立倉庫管理
- ✅ 支持私有內容倉庫
- ✅ 多人協作方便
- ✅ 獨立的內容版本控制

**配置**:
```bash
# .env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
```

**工作流程**:
```bash
# 自動同步內容後啓動
pnpm dev

# 內容在獨立倉庫編輯
cd /path/to/Mizuki-Content
# 編輯文章
git add .
git commit -m "Update article"
git push
```

### 模式切換

#### 從本地切換到獨立倉庫

1. 創建內容倉庫 (參考 [CONTENT_MIGRATION.md](./CONTENT_MIGRATION.md))
2. 編輯 `.env`:
   ```bash
   ENABLE_CONTENT_SYNC=true
   CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
   ```
3. 同步內容: `pnpm run sync-content`

#### 從獨立倉庫切換回本地

1. 編輯 `.env`:
   ```bash
   ENABLE_CONTENT_SYNC=false
   ```
2. 直接開發: `pnpm dev`

---

## ⚙️ 配置方式

### 環境變量說明

在 `.env` 文件中配置:

```bash
# ============================================
# 功能開關
# ============================================

# 是否啓用內容分離功能
# false = 使用本地內容 (推薦新手)
# true = 從遠程倉庫同步內容
ENABLE_CONTENT_SYNC=false

# ============================================
# 內容倉庫配置 (僅當 ENABLE_CONTENT_SYNC=true 時需要)
# ============================================

# 內容倉庫地址
# 支持 HTTPS 和 SSH 方式
# 公開倉庫: https://github.com/username/repo.git
# 私有倉庫 (SSH): git@github.com:username/repo.git
# 私有倉庫 (Token): https://TOKEN@github.com/username/repo.git
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git

# 內容目錄路徑 (默認 ./content 一般無需改動)
CONTENT_DIR=./content
```

### 配置示例

#### 示例 1: 完全本地 (最簡單)

```bash
# .env
ENABLE_CONTENT_SYNC=false
```

或者**不創建 `.env` 文件**,直接使用本地內容。

#### 示例 2: 公開倉庫 (HTTPS)

```bash
# .env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
```

#### 示例 3: 私有倉庫 (SSH)

```bash
# .env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=git@github.com:your-username/Mizuki-Content-Private.git
```

---

## 🔄 自動構建觸發 (內容更新時)

### 問題

啓用內容分離後，默認只有代碼倉庫更新會觸發部署，內容倉庫更新**不會**自動觸發。

### 解決方案

**推薦使用 Repository Dispatch**，5 步快速配置，適用所有部署平臺。

詳細步驟請查看:
- **[自動構建觸發快速參考](./AUTO_BUILD_TRIGGER.md)** - 最簡潔的配置指南 ⭐
- **[部署文檔 - 完整說明](./DEPLOYMENT.md#內容倉庫更新觸發構建)** - 包含多種方案
- **[內容倉庫配置指南](../Mizuki-Content/.github/workflows/README.md)** - 工作流詳細說明

---

## 🔐 私有倉庫配置

完全支持私有內容倉庫! 推薦使用 SSH 方式,安全且方便。

### 方案 A: SSH 密鑰 (推薦)

#### 1. 生成 SSH 密鑰

```bash
# 推薦使用 Ed25519
ssh-keygen -t ed25519 -C "your_email@example.com"

# 或使用 RSA
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

按提示操作,默認保存到 `~/.ssh/id_ed25519`。

#### 2. 添加公鑰到 Git 平臺

```bash
# 查看公鑰
cat ~/.ssh/id_ed25519.pub

# Windows PowerShell
Get-Content ~/.ssh/id_ed25519.pub
```

**GitHub**: 
- Settings → SSH and GPG keys → New SSH key
- 粘貼公鑰內容

**GitLab**: 
- Preferences → SSH Keys → Add new key

**Gitee**: 
- 設置 → SSH 公鑰 → 添加公鑰

#### 3. 配置 Mizuki

在 `.env` 文件中使用 SSH URL:

```bash
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=git@github.com:your-username/Mizuki-Content-Private.git
```

#### 4. 測試連接

```bash
# 測試 GitHub 連接
ssh -T git@github.com

# 測試 GitLab 連接
ssh -T git@gitlab.com

# 同步內容
pnpm run sync-content
```

### 方案 B: HTTPS + Personal Access Token

#### 1. 生成 Token

**GitHub**:
- Settings → Developer settings → Personal access tokens → Generate new token
- 權限: 勾選 `repo` (完整訪問)

**GitLab**:
- Preferences → Access Tokens
- Scopes: `read_repository`

**Gitee**:
- 設置 → 私人令牌 → 生成新令牌
- 權限: `projects` (讀取)

#### 2. 配置 .env

```bash
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://YOUR_TOKEN@github.com/your-username/Mizuki-Content-Private.git
```

⚠️ **安全提示**:
- **不要將 `.env` 提交到 Git!** (已在 `.gitignore` 中)
- Token 具有完整權限,請妥善保管

---

## 🌐 CI/CD 部署

### 快速配置

所有部署平臺都使用相同的自動同步機制:
- ✅ `pnpm build` 執行前自動運行 `prebuild` 鉤子
- ✅ 根據 `ENABLE_CONTENT_SYNC` 決定是否同步內容
- ✅ 同步失敗不會中斷構建,回退到本地內容

**只需配置環境變量,無需修改構建命令!**

### 環境變量配置

在部署平臺添加以下環境變量:

| 變量名 | 值 | 說明 |
|-------|---|------|
| `ENABLE_CONTENT_SYNC` | `true` | 啓用內容分離 |
| `CONTENT_REPO_URL` | 倉庫地址 | 內容倉庫的 URL |

### 支持的平臺

- ✅ **GitHub Pages** - 使用 GitHub Actions
- ✅ **Vercel** - 環境變量配置
- ✅ **Netlify** - 環境變量配置
- ✅ **Cloudflare Pages** - 環境變量配置

### 詳細配置指南

不同平臺的具體配置步驟、私有倉庫認證、故障排查等詳細信息，請查看：

📖 **[部署指南](./DEPLOYMENT.md)** - 完整的部署文檔，包含：
- GitHub Pages 自動部署配置
- Vercel 部署詳細步驟
- Netlify 部署配置
- Cloudflare Pages 部署
- 私有倉庫認證配置
- 常見問題故障排查

---

## 📋 常用命令

| 命令 | 說明 |
|------|------|
| `pnpm run init-content` | 運行交互式初始化嚮導 |
| `pnpm run sync-content` | 手動同步內容倉庫 |
| `pnpm run check-env` | 檢查環境變量配置 |
| `pnpm dev` | 啓動開發服務器 (自動同步) |
| `pnpm build` | 構建項目 (自動同步) |

### 自動同步時機

當 `ENABLE_CONTENT_SYNC=true` 時,以下命令會自動同步內容:

- `pnpm dev` - 開發前自動同步
- `pnpm build` - 構建前自動同步

同步失敗不會中斷開發,會顯示警告並繼續。

---

## 🔍 故障排查

### 問題 1: 提示 "未啓用內容分離功能"

**原因**: `ENABLE_CONTENT_SYNC` 未設置或設置爲 `false`。

**解決**:
```bash
# 檢查 .env 文件
cat .env

# 確認有以下配置
ENABLE_CONTENT_SYNC=true
```

### 問題 2: 提示 "未設置 CONTENT_REPO_URL"

**原因**: 啓用了內容分離但未配置倉庫地址。

**解決**:
```bash
# 在 .env 中添加
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
```

### 問題 3: 私有倉庫認證失敗

**SSH 方式**:
```bash
# 測試 SSH 連接
ssh -T git@github.com

# 應該看到: Hi username! You've successfully authenticated...
```

如果失敗,檢查:
- SSH 密鑰是否生成: `ls ~/.ssh/`
- 公鑰是否添加到 GitHub
- SSH agent 是否運行: `ssh-add -l`

**HTTPS + Token 方式**:
- 檢查 Token 是否有效
- 檢查 Token 權限是否正確 (`repo` 權限)
- 確認 URL 格式: `https://TOKEN@github.com/user/repo.git`

### 問題 4: .env 文件不生效

**檢查清單**:

1. 文件位置正確 (項目根目錄)
   ```bash
   ls -la .env  # Linux/Mac
   dir .env     # Windows
   ```

2. 文件格式正確
   ```bash
   # ✅ 正確
   ENABLE_CONTENT_SYNC=true
   
   # ❌ 錯誤 (多餘空格)
   ENABLE_CONTENT_SYNC = true
   
   # ❌ 錯誤 (不需要引號,除非值中有空格)
   ENABLE_CONTENT_SYNC="true"
   ```

3. 文件權限可讀
   ```bash
   chmod 644 .env  # Linux/Mac
   ```

4. 運行檢查命令
   ```bash
   pnpm run check-env
   ```

### 問題 5: 內容同步失敗

```bash
# 手動同步內容
pnpm run sync-content

# 檢查內容目錄
ls -la content/

# 手動克隆內容倉庫
git clone https://github.com/your-username/Mizuki-Content.git content
```

### 問題 6: 部署時內容未同步

**Vercel/Netlify**:
- 確認環境變量已添加
- 檢查構建日誌,查看同步步驟是否執行
- 確認 Token 在部署環境有效

**GitHub Actions**:
- 檢查工作流配置
- 查看 Actions 運行日誌
- 確認 Secrets 已正確添加

---

## 💡 最佳實踐

### 新手建議

1. **從本地模式開始** - 不需要額外配置,立即可用
2. **內容穩定後再分離** - 等內容積累到一定程度
3. **使用 SSH 方式** - 比 Token 更安全方便

### 進階用戶

1. **使用獨立倉庫模式** - 清晰的版本控制
2. **內容倉庫添加 CI** - 自動檢查文章格式、圖片優化等
3. **分支管理** - main 分支用於生產,develop 用於預覽

### 團隊協作

1. **統一環境變量** - 團隊成員使用相同的配置
2. **權限控制** - 內容倉庫設置爲私有,精細控制訪問權限
3. **Git Hooks** - 提交前檢查文章格式、圖片大小等

---

## 📚 相關文檔

- [內容遷移指南](./CONTENT_MIGRATION.md) - 如何從單倉庫遷移到分離模式
- [內容倉庫結構](./CONTENT_REPOSITORY.md) - 內容倉庫的推薦結構
- [主 README](../README.zh.md) - 項目總體說明

---

## 🤝 需要幫助?

- 查看 [GitHub Issues](https://github.com/LyraVoid/Mizuki/issues)
- 閱讀 [完整文檔](../README.zh.md)
- 運行 `pnpm run check-env` 檢查配置

祝你使用愉快! 🎉
