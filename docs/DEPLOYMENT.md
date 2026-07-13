# Mizuki 部署指南

本文檔提供 Mizuki 博客在各個平臺的部署配置說明。

## 📖 目錄

- [部署前準備](#-部署前準備)
- [GitHub Pages 部署](#-github-pages-部署)
- [Vercel 部署](#-vercel-部署)
- [Netlify 部署](#-netlify-部署)
- [Cloudflare Pages 部署](#-cloudflare-pages-部署)
- [故障排查](#-故障排查)

---

## 🚀 部署前準備

### 基礎配置

1. **更新站點 URL**

編輯 `astro.config.mjs`:
```javascript
export default defineConfig({
  site: 'https://your-domain.com',  // 更新爲你的域名
  // ...
});
```

2. **配置環境變量** (可選)

如果使用內容分離功能，需要配置：
- `ENABLE_CONTENT_SYNC=true`
- `CONTENT_REPO_URL=你的內容倉庫地址`
- `USE_SUBMODULE=true`

詳見 [內容分離完整指南](./CONTENT_SEPARATION.md)

---

## 📦 GitHub Pages 部署

### 自動部署 (推薦)

項目已配置好 GitHub Actions 工作流，推送到 `main` 分支會自動部署。

#### 本地模式 (默認)

**無需任何配置**，開箱即用：

1. 推送代碼到 GitHub
2. 在倉庫設置中啓用 GitHub Pages
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `pages` / `root`
3. 等待 Actions 完成部署

#### 內容分離模式

**配置步驟**:

1. **添加倉庫 Secrets**:
   - Settings → Secrets and variables → Actions → New repository secret
   - 添加 `CONTENT_REPO_URL`: `https://github.com/your-username/Mizuki-Content.git`

2. **修改 `.github/workflows/deploy.yml`**:

取消註釋環境變量部分:
```yaml
- name: Build site
  run: pnpm run build
  env:
    ENABLE_CONTENT_SYNC: true
    CONTENT_REPO_URL: ${{ secrets.CONTENT_REPO_URL }}
    USE_SUBMODULE: true
```

3. **私有內容倉庫配置**:

**同賬號私有倉庫** (推薦):
- 無需額外配置
- 自動使用 `GITHUB_TOKEN` 訪問

**跨賬號私有倉庫 (SSH)**:
```yaml
# 添加 SSH 配置步驟
- name: Setup SSH Key
  uses: webfactory/ssh-agent@v0.8.0
  with:
    ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}

- name: Checkout
  uses: actions/checkout@v4
  with:
    submodules: true
```

在 Secrets 中添加:
- `SSH_PRIVATE_KEY`: SSH 私鑰內容
- `CONTENT_REPO_URL`: `git@github.com:other-user/repo.git`

**跨賬號私有倉庫 (Token)**:
```yaml
- name: Checkout
  uses: actions/checkout@v4
  with:
    submodules: true
    token: ${{ secrets.PAT_TOKEN }}

- name: Build site
  run: pnpm run build
  env:
    ENABLE_CONTENT_SYNC: true
    CONTENT_REPO_URL: https://${{ secrets.PAT_TOKEN }}@github.com/other-user/repo.git
    USE_SUBMODULE: true
```

在 Secrets 中添加:
- `PAT_TOKEN`: GitHub Personal Access Token (需要 `repo` 權限)

### 工作流說明

項目包含三個工作流:

| 工作流 | 觸發條件 | 功能 |
|--------|---------|------|
| `build.yml` | Push/PR 到 main | CI 測試，檢查構建 |
| `deploy.yml` | Push 到 main | 構建並部署到 pages 分支 |
| `format.yml` | Push/PR | 代碼格式和質量檢查 |

---

## 🔷 Vercel 部署

### 快速部署

1. **連接倉庫**:
   - 訪問 [Vercel](https://vercel.com)
   - Import Git Repository
   - 選擇你的 Mizuki 倉庫

2. **配置項目**:
   - Framework Preset: Astro
   - Build Command: `pnpm build` (默認)
   - Output Directory: `dist` (默認)

3. **部署**:
   - 點擊 Deploy 開始部署

### 部署模式

#### 本地模式

**無需配置環境變量**，使用默認的 `vercel.json`。

#### 內容分離模式 - 公開倉庫

在 Vercel 項目設置中添加環境變量:

| 變量名 | 值 |
|-------|---|
| `ENABLE_CONTENT_SYNC` | `true` |
| `CONTENT_REPO_URL` | `https://github.com/your-username/Mizuki-Content.git` |
| `USE_SUBMODULE` | `false` 或 `true` (推薦 `false`) |

> ⚠️ **重要提示**: 如果使用 `USE_SUBMODULE=true`,請確保 `.gitignore` 中的 `content/` 行已被註釋掉,否則會導致部署失敗。推薦在 Vercel 上使用 `USE_SUBMODULE=false` (獨立倉庫模式)。

#### 內容分離模式 - 私有倉庫

**方式 A: 授權 Vercel 訪問**
- 在連接 GitHub 倉庫時，確保授權包括內容倉庫的訪問權限

**方式 B: 使用 Token**

添加環境變量:
```
ENABLE_CONTENT_SYNC=true
GITHUB_TOKEN=ghp_your_personal_access_token
CONTENT_REPO_URL=https://${GITHUB_TOKEN}@github.com/your-username/Mizuki-Content-Private.git
USE_SUBMODULE=true
```

### 配置文件

項目包含兩個 Vercel 配置文件:

- `vercel.json` - 默認配置，適用於本地模式
- `vercel-with-content.json.example` - 內容分離示例 (可選)

**注意**: 使用默認 `vercel.json` 即可，通過環境變量控制是否啓用內容分離。

---

## 🌐 Netlify 部署

### 部署步驟

1. **連接倉庫**:
   - 訪問 [Netlify](https://www.netlify.com)
   - New site from Git
   - 選擇你的 Mizuki 倉庫

2. **配置構建**:
   - Build command: `pnpm build`
   - Publish directory: `dist`

3. **環境變量** (如果使用內容分離):

在 Site settings → Environment variables 中添加:
```
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
USE_SUBMODULE=true
```

4. **私有倉庫配置**:

在 Site settings → Build & deploy → Deploy key 中添加有權限訪問私有倉庫的 SSH 密鑰。

### netlify.toml 配置

可選：創建 `netlify.toml` 文件：

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  PNPM_VERSION = "9"
  # 如果使用內容分離
  ENABLE_CONTENT_SYNC = "true"
  CONTENT_REPO_URL = "https://github.com/your-username/Mizuki-Content.git"
  USE_SUBMODULE = "true"
```

---

## ☁️ Cloudflare Pages 部署

### 部署步驟

1. **連接倉庫**:
   - 登錄 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Workers & Pages → Create application → Pages
   - Connect to Git

2. **配置構建**:
   - Framework preset: Astro
   - Build command: `pnpm build`
   - Build output directory: `dist`

3. **環境變量** (如果使用內容分離):

添加以下變量:
```
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
USE_SUBMODULE=false  # ⚠️ Cloudflare Pages 默認不支持 submodule
```

### 注意事項

⚠️ Cloudflare Pages 默認不支持 Git Submodule，建議:
- 使用獨立倉庫模式: `USE_SUBMODULE=false`
- 或在構建命令中手動初始化: `git submodule update --init && pnpm build`

---

## 🔄 自動同步機制

所有部署平臺都使用相同的自動同步機制：

```json
// package.json
{
  "scripts": {
    "prebuild": "node scripts/sync-content.js || true"
  }
}
```

**工作原理**:
1. `pnpm build` 執行前自動運行 `prebuild` 鉤子
2. 檢查 `ENABLE_CONTENT_SYNC` 環境變量
3. 如果爲 `true`，從遠程倉庫同步內容到 `src/content/` 和 `public/images/`
4. 如果爲 `false` 或未設置，跳過同步，使用本地內容
5. `|| true` 確保同步失敗不會中斷構建

**優勢**:
- ✅ 統一的構建命令，無需修改配置
- ✅ 自動兼容所有部署模式
- ✅ 同步失敗不影響構建（回退到本地內容）

---

## 🔍 故障排查

### 問題 1: 部署失敗 - "未設置 CONTENT_REPO_URL"

**原因**: 啓用了內容分離但未配置倉庫地址

**解決**:
1. 檢查環境變量中是否設置了 `ENABLE_CONTENT_SYNC=true`
2. 檢查是否設置了 `CONTENT_REPO_URL`
3. 或將 `ENABLE_CONTENT_SYNC` 設置爲 `false` 使用本地內容

### 問題 2: 私有倉庫認證失敗

**GitHub Actions**:
- **同賬號**: 確保使用 `${{ secrets.GITHUB_TOKEN }}`
- **跨賬號**: 配置 SSH 密鑰或 PAT Token

**Vercel/Netlify**:
- 確保授權了私有倉庫訪問
- 或使用 Token 方式: `https://TOKEN@github.com/user/repo.git`

### 問題 3: Submodule 與 .gitignore 衝突

**錯誤信息**:
```
The following paths are ignored by one of your .gitignore files:
content
fatal: Failed to add submodule 'content'
```

**原因**: `.gitignore` 文件中的 `content/` 規則阻止了 Git 添加 submodule

**解決方案 A: 修改 .gitignore (推薦)**

編輯 `.gitignore` 文件,註釋掉或刪除 `content/` 行:

```diff
# content repository (if using independent mode)
- content/
+ # content/  # 使用 submodule 時需要註釋掉
*.backup
```

然後重新部署。

**解決方案 B: 使用獨立倉庫模式**

如果不想修改 `.gitignore`,可以使用獨立倉庫模式:

```
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
USE_SUBMODULE=false  # 改爲 false
```

**解決方案 C: 自動降級 (v1.1+)**

`sync-content.js` 會自動檢測此衝突並降級到獨立倉庫模式,無需手動干預。

### 問題 4: Submodule 克隆失敗

**檢查**:
1. 確認部署平臺支持 Git Submodule
2. 檢查 SSH 密鑰或 Token 配置
3. 嘗試使用獨立倉庫模式: `USE_SUBMODULE=false`

### 問題 5: 構建成功但內容未更新

**檢查**:
1. 查看構建日誌，確認同步步驟執行
2. 檢查 `ENABLE_CONTENT_SYNC` 是否設置爲 `true`
3. 驗證 `CONTENT_REPO_URL` 是否正確
4. 清除部署平臺的緩存並重新部署

### 問題 6: 部署時間過長

**優化建議**:
- 使用 Git Submodule 模式 (更快)
- 啓用部署平臺的緩存機制
- 優化圖片大小和數量

### 問題 7: Vercel 部署時 submodule 權限問題

**錯誤信息**:
```
fatal: could not read Username for 'https://github.com'
```

**原因**: 私有倉庫需要認證

**解決**:
1. 在 Vercel 項目設置中添加 GitHub 集成權限
2. 或使用 Token: `https://${GITHUB_TOKEN}@github.com/user/repo.git`
3. 或切換到獨立倉庫模式: `USE_SUBMODULE=false`

**檢查**:
1. 查看構建日誌,確認同步步驟執行
2. 檢查 `ENABLE_CONTENT_SYNC` 是否設置爲 `true`
3. 驗證 `CONTENT_REPO_URL` 是否正確
4. 清除部署平臺的緩存並重新部署

---

## 📋 環境變量參考

| 變量名 | 必需 | 默認值 | 說明 |
|-------|------|--------|------|
| `ENABLE_CONTENT_SYNC` | ❌ | `false` | 是否啓用內容分離功能 |
| `CONTENT_REPO_URL` | ⚠️ | - | 內容倉庫地址 (啓用內容分離時必需) |
| `USE_SUBMODULE` | ❌ | `false` | 是否使用 Git Submodule 模式 |
| `CONTENT_DIR` | ❌ | `./content` | 內容目錄路徑 |
| `INDEXNOW_KEY` | ❌ | - | IndexNow API 密鑰，用於向搜索引擎提交 URL 更新 |
| `INDEXNOW_HOST` | ❌ | - | 網站主機地址 |
| `BILI_SESSDATA` | ❌ | - | Bilibili SESSDATA，用於獲取觀看進度 |

⚠️ = 在特定模式下必需

---

## 💡 推薦配置

### 個人博客
- **平臺**: Vercel 或 GitHub Pages
- **模式**: 本地模式（最簡單）
- **配置**: 無需環境變量

### 團隊協作
- **平臺**: 任意
- **模式**: 內容分離 - 私有倉庫
- **配置**: 啓用內容分離 + SSH 認證

### 多站點部署
- **平臺**: 多個平臺同時部署
- **模式**: 內容分離 - 公開倉庫
- **配置**: 統一的環境變量配置

---

## 📚 相關文檔

- [內容分離完整指南](./CONTENT_SEPARATION.md) - 詳細的內容分離配置
- [內容遷移指南](./MIGRATION_GUIDE.md) - 從單倉庫遷移到分離模式
- [內容倉庫結構](./CONTENT_REPOSITORY.md) - 內容倉庫的組織方式

---

💡 **建議**: 如果是第一次部署，推薦先使用本地模式熟悉流程，之後再根據需要啓用內容分離功能。

## 🔔 內容倉庫更新觸發構建

### 問題說明

當使用**內容代碼分離**架構時，默認情況下：
- ✅ 代碼倉庫 (Mizuki) 更新會觸發自動構建
- ❌ 內容倉庫 (Mizuki-Content) 更新**不會**觸發構建

這意味着您在內容倉庫中發佈新文章後，需要手動觸發代碼倉庫的重新部署才能看到更新。

### 解決方案概覽

有以下幾種方式實現內容倉庫更新時自動觸發構建：

| 方案 | 難度 | 推薦度 | 適用平臺 |
|------|------|--------|----------|
| **Repository Dispatch** | ⭐ 簡單 | ⭐⭐⭐⭐⭐ | GitHub Pages, Vercel, Netlify, CF Pages |
| **Webhook + Deploy Hook** | ⭐⭐ 中等 | ⭐⭐⭐⭐ | Vercel, Netlify, CF Pages |
| **定時構建** | ⭐ 簡單 | ⭐⭐⭐ | 所有平臺 |

---

### 方案 1: Repository Dispatch (推薦)

**原理**: 內容倉庫推送時，通過 GitHub Actions 觸發代碼倉庫的構建工作流。

**優點**:
- ✅ 實時觸發，無延遲
- ✅ 無需雲平臺特定配置
- ✅ 適用於所有部署平臺
- ✅ 完全免費

#### 配置步驟

**Step 1: 創建 GitHub Personal Access Token (PAT)**

1. 訪問 [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. 點擊 **Generate new token (classic)**
3. 配置 Token:
   - Note: `Mizuki Content Trigger` (名稱隨意)
   - Expiration: `No expiration` 或選擇合適的期限
   - Scopes: 勾選 `repo` (完整倉庫訪問權限)
4. 點擊 **Generate token**，複製生成的 Token (只顯示一次！)

**Step 2: 在內容倉庫添加 Secret**

1. 打開內容倉庫 (Mizuki-Content): `https://github.com/your-username/Mizuki-Content`
2. Settings → Secrets and variables → Actions → New repository secret
3. 添加:
   - Name: `DISPATCH_TOKEN`
   - Value: 粘貼剛纔創建的 PAT Token
4. 點擊 **Add secret**

**Step 3: 在內容倉庫創建 GitHub Actions 工作流**

在內容倉庫創建文件 `.github/workflows/trigger-build.yml`:

```yaml
name: Trigger Main Repo Build

on:
  push:
    branches:
      - main  # 或你使用的主分支名稱
    paths:
      - 'posts/**'
      - 'spec/**'
      - 'data/**'
      - 'images/**'

jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger repository dispatch
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.DISPATCH_TOKEN }}
          repository: your-username/Mizuki  # 改爲你的代碼倉庫
          event-type: content-updated
          client-payload: |
            {
              "ref": "${{ github.ref }}",
              "sha": "${{ github.sha }}",
              "message": "${{ github.event.head_commit.message }}"
            }
```

**注意事項**:
- 將 `your-username/Mizuki` 替換爲你的代碼倉庫完整名稱
- 可以根據需要調整 `paths`，只在特定文件變化時觸發

**Step 4: 在代碼倉庫更新 GitHub Actions 工作流**

編輯代碼倉庫的 `.github/workflows/deploy.yml`，添加 `repository_dispatch` 觸發器:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  repository_dispatch:  # 添加這個觸發器
    types:
      - content-updated

# ...其餘配置保持不變
```

**Step 5: 測試**

1. 在內容倉庫編輯一篇文章
2. 提交併推送到 `main` 分支
3. 查看內容倉庫的 Actions 頁面，確認 "Trigger Main Repo Build" 工作流運行
4. 查看代碼倉庫的 Actions 頁面，確認部署工作流被觸發

---

### 方案 2: Webhook + Deploy Hook

**原理**: 使用雲平臺提供的 Deploy Hook URL，在內容倉庫更新時通過 webhook 觸發構建。

**優點**:
- ✅ 實時觸發
- ✅ 與部署平臺深度集成

**缺點**:
- ⚠️ 需要爲每個部署平臺單獨配置
- ⚠️ 不適用於 GitHub Pages

#### Vercel 配置

**Step 1: 獲取 Deploy Hook URL**

1. 打開 Vercel 項目設置
2. Settings → Git → Deploy Hooks
3. 創建新的 Hook:
   - Name: `Content Update`
   - Git Branch: `main` (或你的主分支)
4. 點擊 **Create Hook**，複製生成的 URL

**Step 2: 在內容倉庫配置 Webhook**

在內容倉庫創建 `.github/workflows/trigger-vercel.yml`:

```yaml
name: Trigger Vercel Deployment

on:
  push:
    branches:
      - main
    paths:
      - 'posts/**'
      - 'spec/**'
      - 'data/**'
      - 'images/**'

jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Vercel Deploy Hook
        run: |
          curl -X POST "${{ secrets.VERCEL_DEPLOY_HOOK }}"
```

**Step 3: 添加 Secret**

在內容倉庫添加 Secret:
- Name: `VERCEL_DEPLOY_HOOK`
- Value: 粘貼 Vercel Deploy Hook URL

#### Netlify 配置

**Step 1: 獲取 Build Hook URL**

1. 打開 Netlify 站點設置
2. Site settings → Build & deploy → Continuous deployment → Build hooks
3. 點擊 **Add build hook**:
   - Build hook name: `Content Update`
   - Branch to build: `main`
4. 保存並複製生成的 URL

**Step 2: 配置 GitHub Actions**

在內容倉庫創建 `.github/workflows/trigger-netlify.yml`:

```yaml
name: Trigger Netlify Deployment

on:
  push:
    branches:
      - main
    paths:
      - 'posts/**'
      - 'spec/**'
      - 'data/**'
      - 'images/**'

jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Netlify Build Hook
        run: |
          curl -X POST -d '{}' "${{ secrets.NETLIFY_BUILD_HOOK }}"
```

**Step 3: 添加 Secret**

- Name: `NETLIFY_BUILD_HOOK`
- Value: 粘貼 Netlify Build Hook URL

#### Cloudflare Pages 配置

**Step 1: 獲取 Deploy Hook URL**

1. 打開 Cloudflare Pages 項目
2. Settings → Builds & deployments → Deploy hooks
3. 創建 Deploy Hook:
   - Hook name: `Content Update`
   - Branch: `main`
4. 保存並複製 URL

**Step 2: 配置類似於 Vercel/Netlify**

配置方式與上述相同，只需修改 Secret 名稱和 workflow 文件名。

---

### 方案 3: 定時構建 (fallback)

**原理**: 設置定時任務，每天自動構建一次。

**優點**:
- ✅ 配置簡單
- ✅ 無需額外 Token 或 Webhook

**缺點**:
- ⚠️ 有延遲，不是實時更新
- ⚠️ 可能造成不必要的構建

#### GitHub Actions 配置

在代碼倉庫的 `.github/workflows/deploy.yml` 中添加定時觸發:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  schedule:
    - cron: '0 2 * * *'  # 每天凌晨 2 點 (UTC 時間)
  workflow_dispatch:  # 支持手動觸發

# ...其餘配置
```

**Cron 表達式示例**:
- `0 2 * * *` - 每天凌晨 2 點
- `0 */6 * * *` - 每 6 小時一次
- `0 0 * * 1` - 每週一凌晨

#### Vercel/Netlify 配置

這些平臺也支持通過 webhook 設置定時構建:

```yaml
# 在內容倉庫創建 .github/workflows/scheduled-build.yml
name: Scheduled Build

on:
  schedule:
    - cron: '0 2 * * *'
  workflow_dispatch:

jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Deploy
        run: |
          curl -X POST "${{ secrets.DEPLOY_HOOK_URL }}"
```

---

### 推薦配置組合

#### 最佳實踐 (推薦)

結合多種方式，確保穩定性:

```yaml
# 代碼倉庫 .github/workflows/deploy.yml
on:
  push:
    branches:
      - main
  repository_dispatch:    # 內容更新觸發
    types:
      - content-updated
  schedule:              # 兜底方案
    - cron: '0 2 * * *'
  workflow_dispatch:     # 手動觸發
```

**優勢**:
- ✅ 內容更新實時觸發 (repository_dispatch)
- ✅ 每天自動同步，防止遺漏 (schedule)
- ✅ 支持手動觸發調試 (workflow_dispatch)

---

### 驗證配置

#### 檢查清單

- [ ] 創建了 PAT Token 或 Deploy Hook
- [ ] 在內容倉庫添加了對應的 Secret
- [ ] 創建了內容倉庫的觸發工作流
- [ ] 更新了代碼倉庫的部署工作流
- [ ] 測試了一次提交，確認觸發成功

#### 測試步驟

1. **在內容倉庫修改文章**:
   ```bash
   cd /path/to/Mizuki-Content
   # 編輯文章
   git add .
   git commit -m "test: trigger build"
   git push
   ```

2. **查看內容倉庫 Actions**:
   - 訪問 `https://github.com/your-username/Mizuki-Content/actions`
   - 確認 "Trigger Build" 工作流運行成功

3. **查看代碼倉庫 Actions**:
   - 訪問 `https://github.com/your-username/Mizuki/actions`
   - 確認部署工作流被觸發
   - 查看日誌確認內容同步成功

4. **查看部署平臺**:
   - Vercel/Netlify/CF Pages: 查看部署歷史
   - GitHub Pages: 訪問站點確認更新

---

### 故障排查

#### 問題 1: 內容倉庫推送後沒有觸發構建

**檢查**:
1. 內容倉庫的 Actions 是否運行?
   - 查看 Actions 頁面，確認工作流被觸發
2. PAT Token 權限是否正確?
   - 需要 `repo` 完整權限
3. 代碼倉庫名稱是否正確?
   - 格式: `owner/repo`

**調試**:
```yaml
# 在內容倉庫工作流中添加調試步驟
- name: Debug
  run: |
    echo "Repository: your-username/Mizuki"
    echo "Event type: content-updated"
```

#### 問題 2: Repository dispatch 觸發成功但構建失敗

**檢查**:
1. 代碼倉庫的 Actions 是否啓用?
   - Settings → Actions → General → 確保啓用
2. 工作流文件是否包含 `repository_dispatch` 觸發器?
3. 環境變量是否正確配置?

#### 問題 3: PAT Token 過期

**現象**: 工作流運行失敗，提示認證錯誤

**解決**:
1. 重新生成 PAT Token
2. 更新內容倉庫的 Secret
3. 測試觸發

#### 問題 4: Deploy Hook 無效

**檢查**:
1. Hook URL 是否正確複製?
2. Secret 是否正確添加?
3. 使用 curl 測試 Hook:
   ```bash
   curl -X POST "https://api.vercel.com/v1/integrations/deploy/..."
   ```

---
