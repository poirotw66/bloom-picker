# Bloom Picker · 雅色

## AI-Driven Development Flow

本專案採用 vif。

模式：完全自動化（Solo）
流程：產品先行

### flow_mode

<!-- PRD approved 後逐階段手動推進 -->
<!-- - flow_mode: normal -->

### Skills

| 類別 | Skill | 說明 |
|------|-------|------|
| 架構 | `/vif-arch` | 架構決策 + ADR |
| 設計基礎 | `/vif-uiux` | UI/UX 設計基礎 |
| 需求 | `/vif-prd` | PRD 撰寫 |
| 行為 | `/vif-bdd` | BDD Discovery（可選） |
| 規劃 | `/vif-spec` | 影響分析 + 技術規劃 |
| 原型 | `/vif-prototype` | HTML 原型（可選） |
| 設計 | `/vif-ui-spec` | UI 頁面規格 |
| 設計 | `/vif-api-spec` | API + openapi + dbschema |
| 開發 | `/vif-develop` | TDD 開發 |
| 驗證 | `/vif-verify` | 自動化驗證 |
| 審查 | `/vif-review` | 程式碼審查 |
| 收尾 | `/vif-close` | 完成檢查清單 |
| 全自動 | `/vif-god` | God Mode：PRD 確認後全自動開發 |

### 技術棧

- 語言：TypeScript 5.x
- 框架：React 18 + Vite 5
- 動畫：Framer Motion 11
- 圖示：Lucide React
- 部署：GitHub Pages（base: `/bloom-picker/`）
- 測試：尚未設定（待 /vif-arch 或 spec 階段補齊）

### 專案指令

- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Preview: `npm run preview`
- Type Check: `npx tsc --noEmit`

### 測試策略

- Frontend: 待建立（建議 Vitest + React Testing Library）
- E2E: 待評估（手機斷點與互動為關鍵驗證點）

### Git 規範

- 使用 git-commit subagent 執行 commit
- dispatch 時附上當前模型名稱（供 Co-Authored-By 使用）
- Commit message 風格：簡潔英文，前綴 `feat:` / `fix:` / `docs:` / `refactor:`

### 設計基礎

詳見 `guideline/ui/ui-guideline.md`

- **調性**：和室掛軸 — 全屏浸染傳統色 + 半透明白紙浮層
- **字型**：LXGW WenKai TC（色名/UI）、Cormorant Garamond（數值標籤）、Noto Sans TC（數值/WCAG）
- **色彩**：動態 `--ui-*` token（`computeThemeTokens`），無固定 brand primary
- **深度**：glass morphism + 淡邊框，不用重陰影
- **斷點**：mobile ≤767px、desktop ≥960px；平板沿用 mobile
- **spec-001**：可收合色票 tab、搜尋 FAB、首屏色名+HEX、觸控 ≥44px

### vif-verify 設定

<!-- - Code Quality: true -->

### Guideline 映射

- ui-spec → guideline/ui/
- prototype → guideline/ui/
