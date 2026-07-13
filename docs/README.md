# Mizuki 文檔索引

歡迎查閱 Mizuki 的詳細文檔！

## 📚 文檔列表

### 核心文檔

- **[../README.zh.md](../README.zh.md)** - 項目主文檔 (簡體中文)
  - 快速開始
  - 功能特性
  - 基礎配置
  - 常見問題

### 多語言文檔

- **[../README.md](../README.md)** - English
- **[../README.ja.md](../README.ja.md)** - 日本語  
- **[../README.tw.md](../README.tw.md)** - 繁體中文

### 內容分離相關

- **[CONTENT_SEPARATION.md](./CONTENT_SEPARATION.md)** - 內容分離完整指南 ⭐
  - ENABLE_CONTENT_SYNC 控制開關
  - 環境變量配置詳解
  - 私有倉庫配置方法
  - 模式切換指南
  - 故障排查

- **[CONTENT_REPOSITORY.md](./CONTENT_REPOSITORY.md)** - 內容倉庫結構指南
  - 推薦的目錄結構
  - 文件組織方式
  - 內容編寫規範
  - 圖片管理建議

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - 內容遷移指南
  - 從單倉庫遷移到分離模式
  - 詳細遷移步驟
  - 測試驗證方法

### 部署相關

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - 部署完整指南 ⭐
  - 各平臺部署配置 (GitHub Pages / Vercel / Netlify / Cloudflare Pages)
  - 內容倉庫更新自動觸發構建
  - 私有倉庫認證
  - 故障排查

- **[AUTO_BUILD_TRIGGER.md](./AUTO_BUILD_TRIGGER.md)** - 自動構建觸發快速參考 🆕
  - 5 步快速配置，解決內容更新不觸發部署的問題

## 🚀 快速查找

### 我是新手，想快速開始
→ 閱讀 [主 README](../README.zh.md)

### 我想部署博客
→ 閱讀 [部署指南](./DEPLOYMENT.md)

### 我想使用內容分離功能
→ 閱讀 [內容分離完整指南](./CONTENT_SEPARATION.md)

### 我想從單倉庫遷移到分離模式
→ 閱讀 [內容遷移指南](./MIGRATION_GUIDE.md)

### 我想配置私有內容倉庫
→ 閱讀 [內容分離指南 - 私有倉庫配置](./CONTENT_SEPARATION.md#-私有倉庫配置)

### 我的部署遇到問題
→ 閱讀 [部署指南 - 故障排查](./DEPLOYMENT.md#-故障排查)

### 我遇到了內容同步錯誤
→ 閱讀 [內容分離指南 - 故障排查](./CONTENT_SEPARATION.md#-故障排查)

### 內容倉庫更新後站點沒有自動重新部署 🆕
→ 閱讀 [自動構建觸發快速參考](./AUTO_BUILD_TRIGGER.md)

## 📖 文檔架構

```
docs/
├── README.md                    # 本文檔 - 索引導航
├── CONTENT_SEPARATION.md        # 內容分離核心指南
├── CONTENT_REPOSITORY.md        # 內容倉庫結構
├── MIGRATION_GUIDE.md           # 遷移指南
├── DEPLOYMENT.md                # 部署完整指南
├── AUTO_BUILD_TRIGGER.md        # 自動構建觸發快速參考
└── image/                       # 文檔圖片資源
```

## 🎯 文檔使用建議

### 新用戶推薦閱讀順序

1. [主 README](../README.zh.md) - 瞭解項目基本情況
2. [部署指南](./DEPLOYMENT.md) - 選擇平臺並部署
3. (可選) [內容分離指南](./CONTENT_SEPARATION.md) - 高級功能

### 高級用戶推薦

- 直接查閱具體主題的文檔
- 使用快速查找定位問題解決方案

## 🤝 需要幫助？

- 查看 [GitHub Issues](https://github.com/LyraVoid/Mizuki/issues)
- 閱讀相關文檔的故障排查章節
- 運行 `pnpm run check-env` 檢查配置

祝你使用愉快！🎉
