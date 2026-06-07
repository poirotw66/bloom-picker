# Spec-001: Responsive Mobile UI

## Meta
- 類型：Feature
- 狀態：in-progress
- PRD：docs/prds/prd-001-responsive-mobile-ui.md
- UI 來源：guideline/ui/ui-guideline.md
- 依賴：—
- 建立：2026-06-07
- 更新：2026-06-07

## 1. 背景與目的

對應 PRD-001：修復手機端資訊架構倒置與觸控目標不足，使首屏呈現色名+HEX，色票列表改可收合 tab，搜尋改 FAB，並同步微調桌面 layout。

## 2. 設計原則

- **Mobile-first 資訊層級**：色名與 HEX 優先於色票列表
- **漸進增強**：桌面保留 sidebar 內嵌搜尋；手機才啟用 tab + FAB
- **觸控底線**：互動 hit area ≥ 44px，視覺可小於 hit area
- **既有 token 優先**：擴充 CSS 變數與 `computeThemeTokens`，不硬編碼新色系

## 3. 不在範圍內

- 新色票資料、WCAG 演算法變更
- PWA、後端 API
- Vitest 框架建置（本 spec 以 build/lint/tsc + 手動驗測為主）

## 4. 涉及範圍

### 頁面清單

| 動作 | 頁面 | 說明 | 設計來源 | UISpec |
|------|------|------|---------|--------|
| 修改 | 主畫面 App | 手機/桌面 layout 分流 | ui-guideline | docs/ui-specs/main/responsive-layout.md |
| 修改 | ColorDetail | 手機首屏 HEX hero | ui-guideline | 同上 |
| 修改 | ColorSidebar | 桌面完整；手機嵌入 tab、隱藏搜尋 | ui-guideline | 同上 |
| 新增 | ColorExplorerTab | 手機可收合色票 tab | ui-guideline | 同上 |
| 新增 | SearchFab | 手機搜尋 FAB + overlay | ui-guideline | 同上 |
| 修改 | FavoriteDrawer | 觸控 header、手機上下排序 | ui-guideline | 同上 |
| 修改 | Header | 手機觸控按鈕 | ui-guideline | 同上 |
| 參考 | PaletteReco | 手機單欄 grid（CSS only） | — | — |

### API 清單

（無 — 純前端）

### DB 清單

（無）

## 5. 業務規則

- 斷點：mobile ≤767px、desktop ≥960px；768–959px 沿用 mobile
- 手機 ColorExplorerTab **預設收合**
- 手機 SearchFab 僅在 ≤767px 渲染
- 收藏 drawer 展開時，SearchFab 隱藏避免遮擋
- 手機收藏排序使用上下按鈕；桌面保留 drag
- 所有既有功能（hash 路由、收藏、匯出、WCAG、reco）保持可用

## 6. 實作任務

### 依賴圖

task-1 → task-2 → task-3 → task-4

### 任務清單

1. [ ] 新增 `useIsMobile` hook — 影響: `src/hooks/useIsMobile.ts`
2. [ ] ColorDetail 手機 HEX hero + ColorExplorerTab + SearchFab — 影響: `src/components/*`, `src/App.tsx`
3. [ ] FavoriteDrawer 觸控排序 + Header 觸控 — 影響: `FavoriteDrawer.tsx`, `Header.tsx`
4. [ ] App.css 響應式斷點與桌面 spacing — 影響: `src/App.css`
   - spec ref: docs/ui-specs/main/responsive-layout.md

## 7. 驗收條件

- [ ] AC-1: Given 視窗 ≤767px，When 載入或切換顏色，Then 無捲動即可看見繁中色名與 HEX
- [ ] AC-2: Given 手機，When 頁面載入，Then 色票 tab 為收合狀態；點擊可展開色相篩選與色票列表
- [ ] AC-3: Given 手機，When 點擊搜尋 FAB，Then 出現搜尋 overlay；輸入可篩選並選色
- [ ] AC-4: Given 手機，Then fav-heart、hue-btn、drawer header、reorder 按鈕 hit area ≥44px
- [ ] AC-5: Given 視窗 ≥960px，Then 維持雙欄 sidebar+content，搜尋在 sidebar 內，無 FAB/tab
- [ ] AC-6: Given 任意斷點，Then hash 路由、收藏、匯出、WCAG、推薦色票功能正常

## 8. 約束與限制

- 不引入 UI 元件庫
- `prefers-reduced-motion: reduce` 需保留
- GitHub Pages base `/bloom-picker/` 不變

## 9. 成功標準

- 驗收條件 AC-1 至 AC-6 通過
- `npm run build`、`npm run lint`、`npx tsc --noEmit` 通過
