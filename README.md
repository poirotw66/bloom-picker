# Bloom Picker · 雅色

東方傳統色選色器，命名風格符合台灣口語、高貴優雅，並加入調色盤收藏、推薦色票與無障礙對比度檢查。

## 預覽

* **<font color=#F4A7B9>初櫻</font>**
![wakatake](image/ikkonome.png)
推薦色票
![Bloom Picker – 創意配色](image/bloom-picker-創意配色.png)
概念圖
![Bloom Picker – 創意配色-img](image/bloom-picker-創意配色-img.png)
-----
* **<font color=#51A8DD>群青</font>**
![wakatake](image/gunjyo.png)
推薦色票
![Bloom Picker – 蒼穹萬里](image/bloom-picker-蒼穹萬里.png)
概念圖
![Bloom Picker – 蒼穹萬里-img](image/bloom-picker-蒼穹萬里-img.png)
-----
* **<font color=#5DAC81>若竹</font>**
![wakatake](image/wakatake.png)
推薦色票
![Bloom Picker – 新綠萌芽](image/bloom-picker-新綠萌芽.png)
概念圖
![Bloom Picker – 新綠萌芽-img](image/bloom-picker-新綠萌芽-img.png)

## 特色

- **全螢幕色塊體驗**：點選側邊色名即切換整頁背景色，過場平滑、無按鈕閃爍感。
- **繁體中文在地化色名**：日文漢字統一轉為台灣慣用繁體（如 桜→櫻、黒→黑、黄→黃），兼顧原始風味與可讀性。
- **完整色碼資訊**：顯示 CMYK / RGB / HSL / HEX，點擊 HEX 可直接複製。
- **WCAG 對比度檢查**：自動計算與黑 / 白文字的對比比率，顯示 AA / AAA 通過狀態與簡易圖示。
- **推薦色票**：依據色距與色相演算法推薦搭配組合，可一次收藏整組或匯出 PNG。
- **調色盤收藏與排序**：支援收藏喜愛色、拖拉排序，並匯出為 CSS 變數或 JSON，方便貼到設計系統 / 專案。
- **Hash 路由與動態標題**：網址 `#color-name` 可直接連到指定色，瀏覽器標籤顯示「群青 · Bloom Picker」這類標題，方便多分頁辨識。
- **探索入口**：提供「今日之色」與「隨機一色」按鈕，適合靈感探索與每日配色。

## 技術棧

- **框架**：React + TypeScript
- **開發工具**：Vite
- **動畫**：Framer Motion
- **圖示**：Lucide React
- **色彩邏輯**：自訂色距與推薦演算法、WCAG 2.1 對比度計算

## 開發與啟動

專案目前為 React + TypeScript（使用 Vite），建議透過 Node.js 啟動開發伺服器。

```bash
npm install
npm run dev
```

預設會在瀏覽器開啟 `http://localhost:5173/`（以終端機輸出為準）。

## 部署到 GitHub Pages

本專案仍可視為靜態前端，建置後的 `dist` 可部署到 GitHub Pages 或任何靜態主機。

1. 將專案 push 到 GitHub 倉庫。
2. 在倉庫 **Settings → Pages** 中：
   - **Source** 選 **Deploy from a branch**
   - **Branch** 選 `main`（或你使用的預設分支），資料夾依你的部署流程選擇 `/ (root)` 或 `dist/`
3. 儲存後等待數分鐘，網站會出現在類似：
   - `https://<你的帳號>.github.io/bloom-picker/`

## 檔案結構（簡要）

```text
bloom-picker/
├── index.html
├── favicon.svg
├── image/                    # README 截圖與示意圖
├── src/
│   ├── main.tsx              # React 進入點
│   ├── App.tsx               # 主畫面組裝
│   ├── App.css               # 版面與動效樣式
│   ├── components/           # Header / ColorSidebar / ColorDetail / PaletteReco / FavoriteDrawer 等
│   ├── data/                 # 顏色資料與推薦色票
│   └── utils/                # 色彩轉換、WCAG 對比、主題 token、匯出工具
├── legacy/                   # 早期純靜態版本（保留作參考）
├── package.json
├── vite.config.ts
└── README.md
```

