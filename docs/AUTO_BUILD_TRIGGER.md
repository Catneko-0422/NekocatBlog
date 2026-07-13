# 內容倉庫更新自動觸發構建 - 快速參考

## 🎯 問題

啓用內容分離後,內容倉庫 (Mizuki-Content) 更新不會自動觸發代碼倉庫 (Mizuki) 的重新部署。

## ✅ 解決方案 (推薦)

使用 **Repository Dispatch** 讓內容更新時自動觸發構建,適用於所有部署平臺。

---

## 📝 5 步快速配置

### Step 1: 創建 GitHub Token

訪問: https://github.com/settings/tokens

- 點擊 **Generate new token (classic)**
- Note: `Mizuki Content Trigger`
- Scopes: 勾選 ✅ `repo`
- 點擊生成並**複製 Token** ⚠️ (只顯示一次)

### Step 2: 添加 Secret

在**內容倉庫** (Mizuki-Content):

Settings → Secrets and variables → Actions → New repository secret

- Name: `DISPATCH_TOKEN`
- Secret: 粘貼剛纔的 Token

### Step 3: 修改觸發器配置

編輯內容倉庫的 `.github/workflows/trigger-build.yml`

找到第 27 行,修改爲你的代碼倉庫:

```yaml
repository: your-username/Mizuki  # 改爲你的
```

例如: `matsuzaka-yuki/Mizuki`

### Step 4: 更新代碼倉庫工作流

編輯**代碼倉庫**的 `.github/workflows/deploy.yml`

在 `on:` 部分添加:

```yaml
on:
  push:
    branches:
      - main
  repository_dispatch:  # 👈 添加這個
    types:
      - content-updated
  workflow_dispatch:
```

### Step 5: 測試

在內容倉庫推送一次:

```bash
git add .
git commit -m "test: trigger build"
git push
```

查看:
1. 內容倉庫 Actions - 確認觸發器運行
2. 代碼倉庫 Actions - 確認部署被觸發

---

## 🔍 故障排查

### Token 問題

**錯誤**: `Bad credentials`

**解決**:
- 確認 Token 複製完整
- 確認 Token 有 `repo` 權限
- 重新生成 Token

### 倉庫名稱問題

**錯誤**: `Not Found`

**解決**:
- 確認格式: `owner/repo` (用斜槓分隔)
- 確認拼寫正確
- 示例: `matsuzaka-yuki/Mizuki`

### 代碼倉庫未觸發

**檢查**:
- [ ] `.github/workflows/deploy.yml` 包含 `repository_dispatch`
- [ ] Event type 爲 `content-updated`
- [ ] 代碼倉庫 Actions 已啓用

---

## 📚 詳細文檔

需要更多配置選項? 查看:
- [部署指南 - 完整說明](./DEPLOYMENT.md#內容倉庫更新觸發構建) - 包含 Webhook、定時構建等其他方案
- [內容倉庫配置指南](../Mizuki-Content/.github/workflows/README.md) - 工作流詳細說明

---

## 💡 提示

配置成功後:
- ✅ 內容倉庫每次推送都會自動觸發部署
- ✅ 可在 Actions 頁面查看觸發歷史
- ✅ 支持手動觸發 (workflow_dispatch)

---

**配置時間**: 約 5 分鐘  
**一次配置,長期有效** ✨
