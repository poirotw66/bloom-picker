# PRD-001: 響應式介面與手機端體驗優化

## Meta
- 提案人：Human + AI
- 日期：2026-06-07
- 狀態：approved

## 1. 問題描述

Bloom Picker 在手機與小螢幕裝置上，使用者必須先捲過搜尋列、色相篩選與 250 色色票列表，才能看到當前色的名稱與色碼；互動元素（收藏愛心、篩選按鈕、收藏 drawer）觸控區域偏小，不符合行動裝置操作習慣。React 版遷移時遺失了 legacy 版已有的手機斷點樣式，導致手機體驗明顯劣於桌面版。

## 2. 證據

- **CSS 斷點缺失**：現行 `src/App.css` 僅有 `@media (min-width: 960px)` 桌面雙欄；無 `max-width` 手機專用規則。legacy `styles.css` 曾有 `@media (max-width: 640px)`（色票單欄、列表高度限制、和諧色 2 欄等），未遷移至 React 版。
- **資訊架構倒置**：`App.tsx` 手機垂直堆疊順序為 Header → ColorSidebar（搜尋 + 篩選 + 色票）→ ColorDetail → PaletteReco → FavoriteDrawer。核心資訊（色名、HEX）被埋在最下方需大量捲動才能抵達。
- **觸控目標不足**：
  - `.fav-heart` 僅 `1.1rem × 1.1rem`（約 17–22px），低於 WCAG / Apple HIG 建議的 44×44px
  - `.hue-btn` padding `0.4rem 0.75rem`，有效點擊區約 30px 高
  - FavoriteDrawer 使用 HTML5 drag API，手機上無原生 touch 支援，且 toggle 區域未針對觸控放大
- **桌面版同步改善空間**：現有 960px 斷點下 sidebar 佔 35%、content 區 padding 與 spacing 可一併檢視，使雙端體驗一致且層級清晰。

## 3. 預期成果

| 指標 | 目標 |
|------|------|
| 手機首屏資訊 | 進入頁面或切換顏色後，**無需捲動**即可看見色名（繁中）+ HEX |
| 色票列表存取 | 手機上透過**可收合 tab** 展開/收合色票列表，預設收合 |
| 搜尋存取 | 手機上搜尋改為**浮動按鈕（FAB）**，點擊後展開搜尋面板 |
| 觸控合規 | 收藏愛心、色相篩選、drawer 操作區最小觸控目標 **≥ 44×44px** |
| 斷點覆蓋 | 定義並實作手機（≤767px）與桌面（≥960px）兩段式 layout；768–959px 平板區間沿用手機或桌面邏輯（spec 階段定案） |
| 桌面一致性 | 桌面版同步調整資訊層級、間距與 sidebar/content 比例，不 regress 現有功能 |
| 功能保留 | Hash 路由、收藏、匯出、WCAG、推薦色票、今日之色/隨機一色等既有功能全部可用 |

## 4. 方案選項

### 手機色票導覽模式

| 方案 | 優點 | 缺點 | 工時估算 |
|------|------|------|---------|
| **A. 可收合 tab（推薦）** | 預設收合不佔首屏；展開後完整色票+篩選；與 Human 決策一致 | 需新增 tab 元件與動畫狀態管理 | 2–3 人天 |
| B. 全頁垂直捲動（現狀微調） | 改動最小 | 首屏問題未根本解決；250 色列表仍造成長捲動 | 0.5–1 人天 |
| C. Bottom sheet 抽屜 | 手勢直覺、不遮主內容 | 與底部 FavoriteDrawer 可能衝突；需協調 z-index 與手勢 | 3–4 人天 |

### 手機搜尋模式

| 方案 | 優點 | 缺點 | 工時估算 |
|------|------|------|---------|
| **A. 浮動搜尋 FAB（推薦）** | 首屏乾淨；按需展開；與 Human 決策一致 | 需 overlay / sheet 元件 | 含於 spec-001 |
| B. 固定頂部搜尋列 | 實作簡單 | 仍佔用首屏垂直空間 | — |
| C. 併入可收合 tab 內 | 單一入口 | tab 展開後才搜尋，多一步操作 | — |

→ **推薦：色票可收合 tab + 搜尋 FAB**，理由：直接解決首屏資訊優先序，與使用者已確認的方向一致，且避免與底部收藏 drawer 的手勢衝突。

### 手機 layout 概念（ASCII）

```
┌─────────────────────────┐
│  BLOOM PICKER  [今日][隨機] │
│  傳統色彩 · 雅緻選色          │
├─────────────────────────┤
│                         │
│       群青                │  ← 色名（首屏）
│       #005CAF             │  ← HEX（首屏，可點複製）
│                         │
│  [相似色] [WCAG] [推薦色票]  │  ← 捲動後次要資訊
│                         │
├─────────────────────────┤
│ ▲ 探索色票 (250)          │  ← 可收合 tab（預設收合）
└─────────────────────────┘
                    [🔍]     ← 搜尋 FAB（右下，避開 drawer）
┌─────────────────────────┐
│ ▼ 我的調色盤 (3)          │  ← FavoriteDrawer（觸控優化）
└─────────────────────────┘
```

## 5. 不在範圍內

- 新增色票資料或演算法變更（paletteGen、WCAG 計算邏輯不變）
- 後端 API、使用者帳號、雲端同步收藏
- PWA / offline / 安裝至主畫面
- 多語系（維持現有繁中 + 日文色名 + 拉丁名）
- 全新視覺風格重設（色系、字型家族維持現有 design token）
- 自動化 E2E 測試框架建置（可於 spec 階段建議，但不屬本 PRD 交付）

## 6. 拆解為 Feature / Spec

> 本 PRD 產生以下 spec（狀態、依賴、PRD 追溯等 metadata 由 `/vif-prd` Step 5 展開至 `docs/specs/specs-overview.md`）。

**Spec 清單：**

- spec-001 responsive-mobile-ui — 手機可收合色票 tab、搜尋 FAB、首屏色名+HEX 優先序、觸控目標 ≥44px、桌面 layout 同步調整

**拆解理由：**

本需求橫跨 ColorSidebar、ColorDetail、Header、FavoriteDrawer 與 App.css 斷點，但屬同一使用者旅程（「在小螢幕上快速看色、選色、收藏」），拆成單一 spec 可避免 ui-spec / develop 階段來回切換。若實作後發現 drawer touch reorder 複雜度過高，可在 spec 階段再細分 task，但不預先拆成多 spec。

**Feature（BDD 使用，可選）：**

- [ ] features/ui/responsive-mobile-ui.feature

## 7. 依賴與影響

**依賴：**
- 既有 React 元件結構（`App.tsx` 組裝方式）
- 既有 theme token 系統（`computeThemeTokens`）
- Framer Motion 動畫（tab 展開/收合可沿用）

**影響：**
- `src/App.css` — 新增手機斷點、調整桌面 spacing
- `src/components/ColorSidebar.tsx` — 手機模式改為 tab 內容；搜尋抽出為 FAB 觸發
- `src/components/ColorDetail.tsx` — 手機首屏突出 HEX（可能 reorder DOM 或 CSS order）
- `src/components/FavoriteDrawer.tsx` — 觸控區放大；drag 改 touch-friendly（long-press 或替代 UI）
- `src/components/Header.tsx` — 手機 header 按鈕觸控區檢查
- `src/App.tsx` — 可能新增 mobile layout state、FAB 元件掛載點

**風險：**
- FavoriteDrawer 與色票 tab 同時展開時的 z-index / 捲動鎖定需 ui-spec 明確定義
- HTML5 drag 在手機需替代方案（touch event 或上下移動按鈕）
