# Bloom Picker · 雅色

Bloom Picker 不只是一個色碼查詢工具，而是把 **東亞傳統色** 與 **現代工作流程** 接軌的橋樑：

- **設計與品牌**：250 款具文化脈絡的色名與色碼，方便品牌、視覺與 UI 設計師快速取用，並可匯出 CSS 變數或 JSON 整合進設計系統。
- **無障礙與合規**：內建 WCAG 2.1 對比度計算與 AA / AAA 提示，有助於在美觀與可讀性之間取得平衡。
- **文化與在地化**：色名以台灣慣用繁體呈現（如 桜→櫻、黒→黑），保留傳統色感同時提升在地辨識度。
- **探索與靈感**：透過「今日之色」、隨機一色與演算法推薦色票，降低配色門檻，適合快速發想與教學示範。

---

## 預覽

|  | **初櫻** | **群青** | **若竹** |
|--|----------|----------|----------|
| 主畫面 | ![初櫻 主](image/ikkonome.png) | ![群青 主](image/gunjyo.png) | ![若竹 主](image/wakatake.png) |
| 推薦色票 | ![創意配色](image/bloom-picker-創意配色.png) | ![蒼穹萬里](image/bloom-picker-蒼穹萬里.png) | ![新綠萌芽](image/bloom-picker-新綠萌芽.png) |
| 概念圖 | ![創意配色 概念](image/bloom-picker-創意配色-img.png) | ![蒼穹萬里 概念](image/bloom-picker-蒼穹萬里-img.png) | ![新綠萌芽 概念](image/bloom-picker-新綠萌芽-img.png) |

---

## 特色

### 視覺體驗

- **全螢幕浸染**：背景即當前所選之色，1.2s 平滑過渡；依背景明度自動切換深 / 淺文字與和紙感玻璃卡片。
- **動態主題 token**：UI 邊框、陰影、卡片透明度隨色票即時反相，無固定 brand primary。
- **響應式布局**：桌面雙欄（色名 + 色值卡）、手機單欄；Sticky Header 與 Hero HEX 膠囊便於複製色碼。

### 探索與操作

- **左側工具列（Left Edge Rail）**：調色盤圖示展開色票探索、搜尋圖示展開色名搜尋；兩面板互斥展開，定位於 Header 下方。
- **色票探索**：250 色依色相篩選，展開後才載入列表以提升首屏速度。
- **搜尋**：支援繁中色名、日文色名、拉丁 slug 模糊比對。
- **今日之色 / 隨機一色**：Header 快捷入口，適合靈感探索。

### 色彩資訊

- **完整色碼**：CMYK / RGB / HSL / HEX，點擊 HEX 或 Hero 膠囊即可複製。
- **格式匯出**：單色可匯出 CSS Variable、SCSS Variable、RGB / HSL 公式。
- **WCAG 對比度**：自動計算與黑 / 白文字的對比比率，顯示 AA / AAA 通過狀態。
- **相似顏色**：依明度變化列出鄰近傳統色，一鍵切換。
- **色名典故**：部分傳統色附文化說明（`colorCaptions`）。

### 收藏與推薦

- **推薦色票**：精選色票 + 演算法生成（UI 配色、創意、季節、漸層等），可下載 PNG 或一次收藏整組。
- **調色盤收藏**：底部 Drawer 收藏喜愛色，支援拖拉排序（桌面）或上下移（手機），匯出 CSS 變數或 JSON。
- **Hash 路由**：網址 `#color-name` 直達指定色，標題顯示「群青 · Bloom Picker」。

---

## 技術棧

| 項目 | 選擇 |
|------|------|
| 框架 | React 18 + TypeScript |
| 建置 | Vite 5 |
| 樣式 | 全域 CSS（`App.css`）+ CSS 自訂屬性 |
| 圖示 | Lucide React |
| 動畫 | CSS `@keyframes`（色切換、Toast） |
| 色彩邏輯 | 自訂色距演算法、WCAG 2.1、`colorMeta` 預計算 |

### 效能策略

- **程式碼分割**：React、Lucide、PaletteReco 分 chunk 載入。
- **延遲載入**：`PaletteReco` 以 `React.lazy` 載入；色票列表僅在探索面板展開時渲染。
- **預計算**：250 色的色相分類與深 / 淺文字色於啟動時一次算好（`src/utils/colorMeta.ts`）。
- **字型精簡**：LXGW WenKai TC、Cormorant Garamond、Noto Sans TC，`display=swap`。

---

## 開發與啟動

```bash
npm install
npm run dev      # 開發伺服器，預設 http://localhost:5173/
npm run build    # 產出 dist/
npm run preview  # 預覽建置結果
```

> `npm run lint` 需專案根目錄有 ESLint 設定檔；若尚未設定，以 `npm run build` 作為主要驗證即可。

---

## 部署到 GitHub Pages

`vite.config.ts` 已設定 `base: '/bloom-picker/'`，建置後的 `dist` 可部署至 GitHub Pages。

1. 將專案 push 到 GitHub 倉庫。
2. 在倉庫 **Settings → Pages**：
   - **Source** 選 **Deploy from a branch**
   - **Branch** 選 `main`（或你的預設分支），資料夾依部署方式選 `/ (root)` 或 `dist/`
3. 儲存後等待數分鐘，網站會出現在：
   - `https://<你的帳號>.github.io/bloom-picker/`

---

## 檔案結構

```text
bloom-picker/
├── index.html
├── favicon.svg
├── image/                         # README 截圖與示意圖
├── docs/                          # PRD、規格、UI 規格（vif 流程產出）
├── guideline/ui/ui-guideline.md   # 設計基礎與視覺語言
├── src/
│   ├── main.tsx
│   ├── App.tsx                    # 主畫面組裝、主題 token、路由 hash
│   ├── App.css                    # 版面、玻璃質感、響應式斷點
│   ├── components/
│   │   ├── Header.tsx             # Logo、今日之色、隨機一色
│   │   ├── ColorDetail.tsx        # 色名、色碼、WCAG、相似色
│   │   ├── PaletteReco.tsx        # 推薦色票（lazy）
│   │   ├── FavoriteDrawer.tsx     # 底部收藏 Drawer
│   │   ├── LeftEdgeRail.tsx       # 左側工具列容器
│   │   ├── ColorExplorerPanel.tsx # 色票探索面板
│   │   ├── SearchPanel.tsx        # 搜尋面板
│   │   └── ColorSidebar.tsx       # 色相篩選 + 色票列表
│   ├── hooks/                     # favorites、export、isMobile
│   ├── data/                      # colors、curatedPalettes、colorCaptions
│   └── utils/                     # colorConverter、wcag、paletteGen、themeTokens、colorMeta
├── legacy/                        # 早期純靜態版本（保留參考）
├── package.json
├── vite.config.ts
└── README.md
```

---

## 色名與資料

色名以「傳統色名 · 台灣口語 · 高貴優雅」為原則，沿用東亞傳統色名並統一為繁體中文。色碼資料改寫自日本傳統色（如 NIPPON COLORS 等公開資料），僅作轉寫與在地化，非商業用途。

---

## 授權

本專案採用 [Apache License 2.0](LICENSE)。專案內色碼資料改寫自公開之[日本傳統色](https://nipponcolors.com/)資料；網頁結構與程式為本專案原創。
