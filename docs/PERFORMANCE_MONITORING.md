# 性能監控指南

本文檔介紹如何在項目中配置和使用性能監控工具。

## 目錄

- [概述](#概述)
- [快速開始](#快速開始)
- [Lighthouse CI 配置](#lighthouse-ci-配置)
- [性能基準管理](#性能基準管理)
- [GitHub Actions 集成](#github-actions-集成)
- [常見問題](#常見問題)

---

## 概述

項目集成了以下性能監控工具：

| 工具 | 用途 |
|------|------|
| Lighthouse CI | 自動化性能測試 |
| Web Vitals | 運行時性能監控 |
| Performance Observer | 自定義指標收集 |

### 性能指標目標

| 指標 | 目標值 | 說明 |
|------|--------|------|
| Performance Score | ≥ 0.85 | Lighthouse 性能分數 |
| FCP | ≤ 2000ms | 首次內容繪製 |
| LCP | ≤ 4000ms | 最大內容繪製 |
| TTI | ≤ 5000ms | 可交互時間 |
| CLS | ≤ 0.1 | 累積佈局偏移 |

---

## 快速開始

### 1. 運行性能測試

```bash
# 構建項目
pnpm build

# 運行 Lighthouse CI（自動啓動 preview server）
pnpm lhci autorun
```

### 2. 查看性能報告

測試結果保存在 `.lighthouseci/` 目錄：

```bash
# 查看 JSON 格式的詳細報告
cat .lighthouseci/lhr-*.json

# 查看當前性能指標
node scripts/performance-baseline.js
```

### 3. 更新性能基準

首次使用時，需要建立性能基準：

```bash
node scripts/performance-baseline.js --update
```

---

## Lighthouse CI 配置

### 配置文件

主配置文件：`lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": [
        "http://localhost:4321/",
        "http://localhost:4321/about/",
        "http://localhost:4321/anime/"
      ]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.85 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 2000 }]
      }
    }
  }
}
```

### 配置說明

| 選項 | 說明 |
|------|------|
| `numberOfRuns` | 運行次數，結果取平均值 |
| `url` | 要測試的頁面 URL |
| `minScore` | 最小分數閾值 |
| `maxNumericValue` | 最大數值閾值（毫秒） |

---

## 性能基準管理

### 基準文件

性能基準保存在 `performance-baseline.json`：

```json
{
  "baseline": {
    "homepage": {
      "url": "http://localhost:4321/",
      "metrics": {
        "performance": 0.85,
        "first-contentful-paint": 1800,
        "largest-contentful-paint": 3500
      }
    }
  },
  "thresholds": {
    "regressionPercent": 10
  }
}
```

### 管理命令

```bash
# 查看當前性能指標（不更新基準）
node scripts/performance-baseline.js

# 更新性能基準
node scripts/performance-baseline.js --update

# 檢查性能迴歸
node scripts/performance-check.js
```

### 迴歸檢測

當性能指標下降超過 10% 時會報警：

```
⚠️  Performance regressions detected!
  ❌ first-contentful-paint
     Current: 2500.00ms
     Baseline: 1800.00ms
     Change: +38.9%
```

---

## GitHub Actions 集成

### 自動運行

推送代碼後會自動運行 Lighthouse CI 檢查：

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: pnpm install
      - run: pnpm build
      - uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: "./lighthouserc.json"
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### 檢查結果

CI 檢查包括：

- ✅ Astro Check（類型檢查）
- ✅ ESLint（代碼規範）
- ✅ Build（構建測試）
- ⚠️ Lighthouse（性能測試）

---

## 常見問題

### Q: Lighthouse 測試失敗怎麼辦？

1. 檢查網絡連接是否正常
2. 確認端口 4321 未被佔用
3. 查看詳細錯誤信息：

```bash
npx lhci autorun --verbose
```

### Q: 如何排除某些檢查？

編輯 `lighthouserc.json`，將不想檢查的指標設爲 `"off"`：

```json
"uses-optimized-images": "off",
"uses-webp-images": "off"
```

### Q: 如何添加新的測試頁面？

編輯 `lighthouserc.json`，在 `url` 數組中添加：

```json
"url": [
  "http://localhost:4321/",
  "http://localhost:4321/about/",
  "http://localhost:4321/anime/",
  "http://localhost:4321/new-page/"  // 新頁面
]
```

### Q: 性能波動大怎麼辦？

1. 增加運行次數：

```json
"numberOfRuns": 5
```

2. 使用中位數而非平均值
3. 設置更寬鬆的閾值

### Q: LHCI Server 未配置會怎樣？

本地運行時，報告會保存到 `.lighthouseci/` 目錄，不會影響測試。但 GitHub Actions 中會報錯：

```
Error: Must provide token for LHCI target
```

如需完整功能，請配置 [LHCI Server](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md)。

---

## 相關資源

- [Lighthouse CI 文檔](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse 性能評分](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
