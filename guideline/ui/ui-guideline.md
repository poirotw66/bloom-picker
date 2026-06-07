# UI/UX 設計基礎 — Bloom Picker · 雅色

## Meta

- 專案：Bloom Picker
- 建立：2026-06-07
- 更新：2026-06-07
- 關聯 PRD：prd-001-responsive-mobile-ui

## 版本歷程

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0 | 2026-06-07 | 初始建立：既有視覺語言文件化 + spec-001 響應式擴充規範 |

---

## Intent First

| 問題 | 回答 |
|------|------|
| **誰在用？** | 視覺設計師、品牌設計、UI 工程師、配色初學者；常在靈感探索或交付前查色碼，可能在通勤時用手機快速查一個傳統色 |
| **要完成什麼？** | **感知**一個傳統色的氛圍、**取得**色碼、**收藏**並匯出到設計系統 |
| **應該感覺像什麼？** | 走進一間和室，牆面就是當下那抹傳統色；紙質標籤浮在色面上，字是書法感但可讀；安靜、雅緻，不是 SaaS 儀表板 |

---

## 產品領域探索

### 領域（概念與隱喻）

1. **傳統色名** — 櫻、群青、若竹；名稱本身帶文化敘事
2. **全屏浸染** — 背景即當前色，使用者「站在顏色裡」
3. **和室 / 紙障子** — 半透明面板像紙窗透出的光
4. **色票與調色盤** — 設計師工作流隱喻
5. **無障礙對比** — 美與可讀性的平衡（WCAG）
6. **探索儀式** — 「今日之色」「隨機一色」像每日一籤

### 色彩世界（從領域推導）

| 來源 | 在介面中的體現 |
|------|----------------|
| 當下傳統色本身 | 全屏 `--bg`（inline `backgroundColor`） |
| 和紙 / 障子白 | `--ui-card-bg` 半透明白 |
| 墨與淡墨 | 深/淺文字 token（依背景 luminance 自動切換） |
| 金箔點綴 | 收藏愛心 active 色 `#e74c5e` |
| 灰阶中性 | 色相篩選「灰」、邊框 `--ui-border` |

### 標誌性元素

**動態全屏色塊 + 依背景自動反相的 glass 卡片** — 沒有固定 brand primary；「當下所選之色」即主色。這是 Bloom Picker 獨有，不可改成固定色 navbar。

### 刻意不用的預設

| 常見預設 | 本專案替代 | WHY |
|----------|-----------|-----|
| Inter / Roboto 全站 | LXGW WenKai TC + Noto Serif TC | 傳統、書卷氣；色名是文化物件不是表單 label |
| 固定白底 + 紫色 CTA | 動態色底 + 半透明 UI | 產品核心是「顏色本身」，不是操作按鈕 |
| 左側固定 sidebar 導航 | 桌面：左色票面板；手機：可收合 tab + FAB | 手機首屏留給色名與 HEX（prd-001） |

### 設計方向

> 雅色是一幅會變色的和室掛軸：背景是當下之色，浮層是半透明白紙上的標籤與數值；互動輕盈如翻色卡，動效慢而穩（1.2s 背景過渡）。

---

## 技術棧

| 項目 | 選擇 | 說明 |
|------|------|------|
| 前端框架 | React 18 + TypeScript | |
| UI 元件庫 | 無（自訂元件） | 避免通用元件庫視覺 |
| CSS 方案 | 全域 CSS（`App.css`）+ CSS 變數 | theme token 由 JS 注入 |
| 圖示庫 | Lucide React | 線條簡潔，不搶色票 |
| 動畫 | Framer Motion | 色切換、drawer、tab |
| 字型載入 | Google Fonts | 見 index.html |

---

## 色彩系統

### 動態 UI Token（非固定 hex）

所有 UI 色由 `computeThemeTokens(hex)` 依背景 luminance 產生，掛在 `.app-container` 上。

| Token | 語意 | 用途 |
|-------|------|------|
| `--ui-text` | 前景 primary | 色名、logo、主要標籤 |
| `--ui-text-secondary` | 前景 secondary | 副標、reco 色名 |
| `--ui-text-muted` | 前景 tertiary | 說明、placeholder |
| `--ui-border` | 邊框 default | 卡片、按鈕描邊 |
| `--ui-border-hover` | 邊框 strong | hover / active 邊框 |
| `--ui-bg` | 表面 base | 按鈕、篩選 pill 底 |
| `--ui-bg-hover` | 表面 elevated | focus、hover 底 |
| `--ui-card-bg` | 面板 | color-values、drawer |
| `--ui-card-border` | 面板邊框 | |
| `--ui-sidebar-bg` | 側欄（桌面） | color-nav 背景 |
| `--ui-btn-bg` / `--ui-btn-bg-active` | 互動按鈕 | header-btn、hue-btn |
| `--ui-hex-bg` | HEX 複製區 | |
| `--ui-wcag-bg` | WCAG 區塊 | |
| `--ui-theme` | `light` / `dark` | 語意標記（非切換模式） |

**WHY 動態 token：** 250 色各異，固定深/淺 UI 無法在所有色上可讀；對比邏輯與 WCAG 計算共用同一 luminance 來源。

### 功能性色彩（固定）

| 名稱 | 色碼 | 用途 |
|------|------|------|
| Success (WCAG pass) | `#4ade80` on `rgba(34,197,94,0.15)` | AA/AAA 通過 badge |
| Warning (WCAG warn) | `#fbbf24` on `rgba(250,204,21,0.15)` | 邊界對比 |
| Danger (WCAG fail / 清除) | `#f87171` | 未通過、清除收藏 hover |
| Favorite active | `#e74c5e` | 收藏愛心 |
| Toast 背景 | `rgba(20,20,25,0.9)` | 複製成功提示 |

### 深度策略

**表面色差 + 淡 blur（glass morphism）** — 全專案一致。

- `backdrop-filter: blur(8px–24px)` 依層級遞增
- 邊框 `1px solid var(--ui-border)` 界定形狀，不用重陰影
- 背景色塊 transition：`1.2s cubic-bezier(0.16, 1, 0.3, 1)`（`--ease-out-expo`）

### 表面層級

| Level | 元素 | z-index 參考 |
|-------|------|-------------|
| 0 | `.bg` 全屏色 | -1 |
| 1 | Header、ColorDetail、桌面 sidebar | auto |
| 2 | 色票 tab（手機）、export dropdown | 20–30 |
| 3 | 搜尋 FAB、搜尋 overlay | 40 |
| 4 | FavoriteDrawer | 100 |
| 5 | Toast | 30（低於 drawer 展開時；spec 實作時 drawer open 時 toast 上移） |

---

## 字型系統

### 字體

| 用途 | 字體 | Fallback | WHY |
|------|------|----------|-----|
| 色名、標題、中文 UI | LXGW WenKai TC | Noto Serif TC, serif | 楷書韻味，呼應傳統色名 |
| 副標、日文色名 | LXGW WenKai TC | Noto Serif TC | 與色名統一 |
| 數值標籤（CMYK 等） | Cormorant Garamond | Noto Serif TC | 拉丁襯線，與色碼的「精確感」對比 |
| 數值、WCAG、計數 | Noto Sans TC | sans-serif | tabular-nums、小字可讀 |

### 字型大小（桌面基準 → 手機調整）

| Token | 桌面 | 手機（≤767px） | 用途 |
|-------|------|---------------|------|
| `--font-color-name` | clamp(3rem, 10vw, 5.5rem) | clamp(2.5rem, 12vw, 3.5rem) | 色名 h1 |
| `--font-hex-hero` | 1.1rem（value） | 1.5rem | **首屏 HEX 強調**（spec-001） |
| `--font-logo` | 1.7rem | 1.4rem | logo |
| `--font-tagline` | 1rem | 0.85rem | tagline |
| `--font-caption` | 0.65–0.8rem | 同左 | 標籤、reco |
| `html` root | clamp(16px, 2.3vw, 19px) | 16px 下限 | 避免手機 root 過大 |

### 字重

| 用途 | 值 |
|------|-----|
| 色名 | 700 |
| Logo | 700 |
| 內文 / 按鈕 | 400–500 |
| WCAG ratio | 700 |

---

## 間距系統

- **基準單位：4px**（rem 換算：0.25rem = 4px @ 16px root）

| Token | 值 | 用途 |
|-------|---|------|
| `--space-xs` | 0.25rem (4px) | icon gap |
| `--space-sm` | 0.5rem (8px) | pill 內距、色票 gap |
| `--space-md` | 1rem (16px) | 卡片內距 |
| `--space-lg` | 1.5rem (24px) | section 間距 |
| `--space-xl` | 2.5rem (40px) | header padding |
| `--touch-min` | 2.75rem (44px) | **最小觸控目標**（spec-001 硬性） |

**WHY 寬鬆間距：** 色名需要「呼吸感」；手機上過密會像表單而非展示。

---

## 佈局

### 桌面（≥960px）

```
┌──────────────────────────────────────────────┐
│ Header（logo + 今日/隨機 + tagline + 搜尋*）   │
├──────────────┬───────────────────────────────┤
│ ColorSidebar │ ColorDetail + PaletteReco     │
│ 35% 寬       │ flex 1                        │
│ glass 面板   │ 左對齊色名                      │
└──────────────┴───────────────────────────────┘
│ FavoriteDrawer（底部固定）                     │
└──────────────────────────────────────────────┘
* 搜尋保留在 sidebar 頂部（桌面不改用 FAB）
```

### 手機（≤767px）— prd-001 目標

```
┌─────────────────────────┐
│ Header（精簡，觸控 ≥44px）│
├─────────────────────────┤
│ ColorDetail 精簡首屏      │  ← 色名 + HEX（DOM 順序優先）
│   （捲動後：相似色、數值） │
│ PaletteReco              │
├─────────────────────────┤
│ ColorExplorerTab（收合）  │  ← 預設收合，含色相篩選+色票
└─────────────────────────┘
              [Search FAB]   ← 右下，bottom: calc(drawer_peek + 1rem)
┌─────────────────────────┐
│ FavoriteDrawer           │
└─────────────────────────┘
```

### 平板（768–959px）

沿用**手機 layout**（prd-001 決策），避免三種 layout 增加維護成本。

### 響應式斷點

| 名稱 | 寬度 | 佈局 |
|------|------|------|
| mobile | ≤767px | 單欄、tab 色票、FAB 搜尋、首屏 HEX |
| desktop | ≥960px | 雙欄 sidebar + content |
| gap | 768–959px | 同 mobile |

---

## 元件規範

### 按鈕

| 變體 | class | 用途 |
|------|-------|------|
| Pill ghost | `.header-btn` | 今日之色、隨機一色 |
| Pill filter | `.hue-btn` | 色相篩選 |
| Icon circle | `.icon-btn` | 圖示操作 |
| Text action | `.palette-action-btn` | drawer 匯出/清除 |
| FAB | `.search-fab`（新增） | 手機搜尋入口 |

**手機觸控：** 所有可點擊元素 `min-width` / `min-height` ≥ `--touch-min`（44px），視覺可小但 hit area 用 padding / pseudo 撐大。

**狀態：** default / hover（桌面）/ active / focus-visible（`outline: 2px solid var(--ui-border-hover)`）/ disabled（opacity 0.4）

### 色票卡片 `.color-card`

- 圓角 6px，邊框 1.5px
- active：`scale(1.08)` + 強邊框
- 收藏 `.fav-heart`：視覺 icon 可 1.1rem，**hit area 44×44px**（absolute 擴展 padding）

### ColorExplorerTab（手機新增）

| 狀態 | 外觀 |
|------|------|
| collapsed | 底部固定條，顯示「探索色票 (N)」+ chevron |
| expanded | 向上展開 max-height ~50vh，內含 hue-filters + color-list scroll |
| 動效 | Framer Motion 或 CSS transform，`--ease-out-expo` |

**互斥：** tab expanded 時，FavoriteDrawer 維持 peek 或 auto-collapse（ui-spec 定案，預設 drawer peek + tab 在上層 z-index 3）。

### Search FAB + Overlay（手機新增）

| 項目 | 規範 |
|------|------|
| FAB 位置 | `right: 1rem`; `bottom: calc(3.2rem + 1rem)`（避開 drawer peek） |
| FAB 尺寸 | 48×48px（略大於最小觸控） |
| Overlay | 半透明 `--ui-card-bg` + blur；內嵌 search-input 全寬 |
| 關閉 | 再次點 FAB / 點 overlay 外 / Esc |

### FavoriteDrawer

| 項目 | 桌面 | 手機 |
|------|------|------|
| peek 高度 | 3.2rem | 3.5rem（觸控 header ≥44px） |
| 排序 | HTML5 drag | **上下移動按鈕**（每列 ≥44px hit area） |
| 移除 | hover 顯示 × | 常駐或 swipe（v1 用常駐按鈕） |

**WHY 上下按鈕而非 long-press drag：** 實作穩定、無與 scroll 手勢衝突、符合 44px 規範。

### Toast `.export-toast`

| 項目 | 規範 |
|------|------|
| 位置 | 固定 bottom center；手機：`bottom: calc(6rem + var(--palette-height))` |
| 顯示 | 2 秒 |
| 樣式 | 深色半透明，blur |

### WCAG Badge

維持既有 pass / warn / fail 三色，不隨 `--ui-theme` 反轉（語意色需穩定）。

---

## 動效

| Token | 值 | 用途 |
|-------|---|------|
| `--ease-out-expo` | cubic-bezier(0.16, 1, 0.3, 1) | 背景、drawer、tab |
| `--ease-out` | cubic-bezier(0.33, 1, 0.68, 1) | UI 微互動 |
| `--transition-bg` | 1.2s | 全屏色切換 |
| `--transition-ui` | 0.2s | 按鈕、hover |

`prefers-reduced-motion: reduce` 時：背景 transition 降至 0.01ms，transform 動畫停用。

---

## 圖示

| 項目 | 規範 |
|------|------|
| 圖示庫 | Lucide React |
| inline | 14–16px |
| 按鈕內 | 14px（header-btn） |
| FAB | 20px |
| 顏色 | `currentColor`，繼承 `--ui-text` |

---

## 暗色模式

不支援手動切換。介面隨**當前傳統色**深淺自動反相（`--ui-theme: light | dark`），這是產品機制而非 preference。

---

## 品質測試

| 測試 | 結果 |
|------|------|
| **Swap test** | 換成 Inter + 白底 fixed navbar → 失去和室浸染感 ✓ |
| **Squint test** | 模糊後仍可分色名 / glass 卡片 / 底部 drawer 三層 ✓ |
| **Signature test** | 全屏動態色、楷書色名、glass 卡片、WCAG 列、reco 色票 strip ✓ |
| **Token test** | `--ui-text`、`--ui-card-bg` 等語意清晰；非 `--gray-700` ✓ |

---

## spec-001 實作檢查清單

- [ ] 手機首屏：色名 + HEX 無需捲動可見
- [ ] ColorExplorerTab 預設收合
- [ ] Search FAB 僅 ≤767px 顯示
- [ ] fav-heart、hue-btn、drawer header、reorder 按鈕 ≥44px
- [ ] 平板 768–959 沿用 mobile layout
- [ ] 桌面 spacing / sidebar 比例微調，功能無 regression
- [ ] z-index 層級符合本文件「表面層級」表
- [ ] `prefers-reduced-motion` 尊重

---

## 備註

- 色碼資料與 WCAG 演算法不在 UI guideline 範圍
- 新增 UI token 時優先擴充 `themeTokens.ts`，避免元件內硬編碼 rgba
- ui-spec 撰寫時以本文件為視覺權威，細部 pixel 可在 ui-spec 覆寫但不可違反 token 語意
