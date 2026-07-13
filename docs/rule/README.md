# Mizuki 開發規範

本目錄包含了 Mizuki 項目的開發規範文檔，用於指導組件化開發和代碼重構。

## 規範列表

### 1. [組件架構設計規範](./01-component-architecture.md)

**說明**：定義 Mizuki 的組件分層架構、命名規範和代碼組織方式。

**關鍵點**：
- 組件分層架構（atoms/molecules/organisms）
- 文件命名和組織規範
- 組件職責分離原則
- 組件複用模式

### 2. [組件拆分指南](./02-component-split-guide.md)

**說明**：如何識別需要拆分的組件，以及拆分的具體方法和最佳實踐。

**關鍵點**：
- 組件拆分的判斷標準
- 超大型組件拆分實例
- 拆分步驟和驗證方法
- 避免常見拆分錯誤

### 3. [文件組織架構規範](./03-file-organization-architecture.md)

**說明**：定義項目的文件組織架構，包括目錄結構、文件命名和模塊化原則。

**關鍵點**：
- 完整的目錄樹結構
- 各目錄職責說明
- 文件命名規範
- 模塊化組織原則
- 文件依賴管理

### 4. [CSS 樣式指南](./04-css-style-guide.md)

**說明**：CSS 樣式規範，禁止使用 `!important` 級別（Twikoo 除外）。

**關鍵點**：
- 禁止使用 `!important`（Twikoo 組件除外）
- 使用 CSS 變量和 Tailwind 工具類
- 提高選擇器優先級替代 `!important`
- Twikoo 樣式文件規範和最佳實踐
- 暗色主題樣式實現方式

### 5. [原子化組件使用規範](./05-atom-component-usage.md)

**說明**：規定必須優先使用現有原子化組件，以及在缺少合適組件時創建新組件。

**關鍵點**：
- 優先使用現有 atoms/ 和 misc/ 組件
- 重複 UI 代碼超過 2 次應考慮抽取爲組件
- 創建新組件的判斷標準
- 組件分層架構說明
- 常見使用場景和決策流程

### 6. [側欄組件開發指南](./06-sidebar-widget-dev.md)

**說明**：規範側欄組件的接入流程，避免"配置了組件但頁面不顯示"的遺漏。

**關鍵點**：
- 側欄組件接入的 3 個必要步驟
- 在 `WidgetComponentType` 中聲明組件類型
- 在 `sidebarLayoutConfig` 中配置佈局
- **在所有側欄渲染器的 componentMap 中註冊組件**（最易遺漏）
- 常見問題排查

## 代碼審查檢查清單

在提交代碼前，請確保：

- [ ] 組件遵循分層架構規範（atoms/molecules/organisms）
- [ ] 組件文件名符合命名規範（PascalCase）
- [ ] 組件行數控制在合理範圍內（< 500行）
- [ ] 複雜組件已按功能拆分爲子組件
- [ ] **優先使用現有原子化組件（atoms/、misc/）**
- [ ] **重複 UI 代碼超過 2 次應抽取爲新組件**
- [ ] 使用現有通用組件和 Hooks，避免重複代碼
- [ ] 組件職責單一明確
- [ ] 樣式使用原子組件或統一樣式系統
- [ ] 組件使用 TypeScript 定義 Props 接口
- [ ] 代碼格式化通過（`pnpm run format`）
- [ ] Lint 檢查通過（`pnpm run lint`）
- [ ] 沒有使用 `!important`（Twikoo 組件除外）
- [ ] 使用 Tailwind 工具類或 CSS 變量
- [ ] 暗色主題使用 CSS 變量實現
- [ ] **側欄組件已在所有相關 componentMap 中註冊**
- [ ] **側欄組件的類型已在 `WidgetComponentType` 中聲明**
- [ ] **側欄組件已在 `sidebarLayoutConfig.components` 中配置**

## 參考資源

- [Aruma 組件架構](../../demo/Aruma/docs/rule/05-component-architecture.md)
- [Astro 組件最佳實踐](https://docs.astro.build/zh-cn/core-concepts/astro-components/)
- [組件驅動開發](https://componentdriven.org/)

## 相關文檔

- [../README.md](../README.md) - 項目主文檔
- [../DEPLOYMENT.md](../DEPLOYMENT.md) - 部署指南
- [../CONTENT_SEPARATION.md](../CONTENT_SEPARATION.md) - 內容分離指南

---

**最後更新**: 2026-03-21
**維護者**: Mizuki 開發團隊
