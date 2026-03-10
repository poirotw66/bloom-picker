# 雅色 · 傳統色

復刻 [NIPPON COLORS](https://nipponcolors.com/) 風格的傳統色網頁，命名風格符合台灣口語、高貴優雅。

## 特色

- **全螢幕色塊**：點選色名即切換背景色，過場平滑
- **繁體中文色名**：日文漢字轉為台灣慣用繁體（如 桜→櫻、黒→黑、黄→黃）
- **色碼資訊**：顯示 CMYK、RGB、Hex，點 Hex 可複製
- **明暗自動切換**：依背景亮度自動切換文字為深色或淺色，確保可讀

## 使用方式

用瀏覽器開啟 `index.html`，或使用本地伺服器：

```bash
# Python 3
python -m http.server 8000

# 或 npx
npx serve .
```

建議使用 Safari 或 Chrome 以獲得最佳顯示效果。

## 部署到 GitHub Pages

本專案為純靜態網站，可直接部署到 GitHub Pages，無需建置步驟。

1. 將專案 push 到 GitHub 倉庫。
2. 在倉庫 **Settings** → **Pages**：
   - **Source** 選 **Deploy from a branch**
   - **Branch** 選 `main`（或你使用的預設分支），資料夾選 **/ (root)**
3. 儲存後等待一兩分鐘，網站會出現在：
   - `https://<你的帳號>.github.io/bloom-picker/`

若使用 **Project site**（例如 `username.github.io/bloom-picker`），所有資源路徑皆為相對路徑，無需修改即可正常運作。

## 檔案結構
０
```
bloom-picker/
├── index.html      # 主頁
├── styles.css      # 樣式（全螢幕、排版、過場）
├── app.js          # 色碼轉換、hash 路由、複製 Hex
├── data/
│   └── colors.js   # 250 色資料（繁體名、日文名、Hex）
└── README.md
```

## 色名與資料

色名以「傳統色名 · 台灣口語 · 高貴優雅」為原則，沿用東亞傳統色名並統一為繁體中文。色碼資料改寫自日本傳統色（NIPPON COLORS），僅作轉寫與在地化，非商業用途。

## 授權

專案內色碼資料改寫自公開之日本傳統色資料；網頁結構與程式為本專案原創。
