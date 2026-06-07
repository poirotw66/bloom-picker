---
name: responsive-layout
description: Main app responsive layout — mobile tab, FAB, desktop sidebar
domain: ui
module: main
spec: spec-001
status: approved
route: /
apis: []
---

# Responsive Layout — Main App

## Meta

- 頁面類型：detail-page
- 頁面檔名: `App.tsx`
- 建立：2026-06-07
- 更新：2026-06-07

## 說明

Bloom Picker 主畫面在 mobile（≤767px）與 desktop（≥960px）的 layout 與互動規格。

## 頁面結構

### Desktop (≥960px)

```
Header
main.main [row]
  ColorSidebar (search + hue filters + color list)
  content-area
    ColorDetail
    PaletteReco
FavoriteDrawer (bottom)
```

### Mobile (≤767px)

```
Header (compact, touch ≥44px buttons)
main.main [column, content first]
  content-area
    ColorDetail (hero HEX under name)
    PaletteReco (1-col grid)
ColorExplorerTab (fixed, above drawer, default collapsed)
SearchFab (fixed, hidden when drawer open)
FavoriteDrawer
```

## 元件：ColorDetail 手機首屏

| 元素 | 行為 |
|------|------|
| `.color-name` | 繁中色名，clamp 2.5–3.5rem |
| `.color-hex-hero` | HEX 無 # 前綴，1.5rem，點擊複製；僅 mobile 顯示 |
| `.color-values .value-hex` | 桌面與手機詳情區保留 |

## 元件：ColorExplorerTab

| 狀態 | UI |
|------|-----|
| collapsed | 固定底 bar，`bottom: var(--drawer-peek)`；文案「探索色票 (N)」 |
| expanded | max-height 50vh，內含 hue-filters + scrollable color-list |
| 互動 | 點 bar toggle；z-index 90 |

不含搜尋列（搜尋由 FAB 負責）。

## 元件：SearchFab

| 項目 | 值 |
|------|-----|
| 尺寸 | 48×48px |
| 位置 | right 1rem; bottom: calc(var(--drawer-peek) + var(--explorer-tab-peek) + 1rem) |
| z-index | 95 |
| overlay | blur 背景 + 全寬 search input + 結果列表 |
| 關閉 | FAB / overlay 外點擊 / Esc |
| 隱藏 | FavoriteDrawer `open` 時 |

## 元件：FavoriteDrawer 手機

| 項目 | 規範 |
|------|------|
| peek | 3.5rem，`--drawer-peek` |
| header | min-height 44px |
| 排序 | 手機：每列 ↑↓ 按鈕 44px；桌面：HTML5 drag |
| remove | 常駐 × 按鈕，44px hit area |

## 觸控目標

全域 `--touch-min: 2.75rem (44px)` 套用於：
- `.header-btn`, `.hue-btn`, `.fav-heart`, `.palette-header`, `.palette-reorder-btn`, `.search-fab`

## 響應式 CSS

| 斷點 | 規則 |
|------|------|
| max-width 767px | mobile layout |
| min-width 960px | desktop dual column |
| 768–959 | 同 mobile |

## 互動流程

1. 使用者開啟 `#color-name` → ColorDetail 首屏顯示色名+HEX
2. 需瀏覽色票 → 點 ColorExplorerTab 展開 → 選色 → tab 可收合
3. 需搜尋 → 點 SearchFab → overlay 輸入 → 選結果 → overlay 關閉
4. 收藏 → drawer peek；展開後 FAB 隱藏
