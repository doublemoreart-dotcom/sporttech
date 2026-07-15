# 2022-2026 運動X科技預算查詢小幫手

一頁式互動查詢工具，用於協助使用者判讀台灣運動科技相關預算的來源、執行程度、地方場域、學研/產業執行單位，以及協會在預算流中的角色。

## 網站架構

```text
app/
  layout.tsx      全站 metadata、語系與字體設定
  budget-data.ts  預算項目、來源目錄、指標、分類與縣市資料
  page.tsx        一頁式互動查詢工具，含 preloading、篩選、預算項目清單與抽屜詳情
  globals.css     全站視覺樣式、preloading 與響應式版面
public/           favicon 與公開靜態素材
tests/            build 後 HTML 驗證
.openai/          Sites hosting 設定
worker/           vinext/hosting runtime 入口
```

目前的資料採「可公開辨識的預算項目」呈現，不把不同來源的總額直接相加。重點判斷如下：

- 46 億元是 2022-2026 跨部會政策總額，不是運動部單一預算。
- 協會多半是應用端、合作端或場域端，不一定是科技預算直接受補助者。
- 地方場域需要區分核定、決標、驗收、維運與實際使用。
- 尚未公開細目的計畫，以「待公開對帳」或「提案/爭取」處理。

## 本機版

本機版負責開發、預覽與驗證。可以保留安裝依賴、快取、build 產物和暫存檔。詳細維護規則請見 [`VERSIONING.md`](./VERSIONING.md)。

```bash
npm run dev
npm run build
npm test
npm run lint
```

本機可存在但不進 Git 的內容：

- `node_modules/`
- `.next/`
- `.vinext/`
- `.wrangler/`
- `dist/`
- `coverage/`
- `.env*`
- 暫存匯出或截圖

## Git 版控版

Git 版只追蹤可重建網站的來源與設定：

- `app/`
- `public/`
- `tests/`
- `.openai/`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next.config.ts`
- `vite.config.ts`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `README.md`
- `VERSIONING.md`

目前工作流採「正式 repo 為 source of truth，`outputs/` 為本機交付快照」。建議 commit 節奏：

1. `scaffold site structure`
2. `build budget query assistant page`
3. `document local and git versioning`
4. `verify production build`

## 交付版

外層資料夾的 `outputs/` 用於存放給使用者看的交付檔，例如靜態說明、截圖或匯出版。它不屬於網站原始碼 repo。

目前常用交付入口：

```text
outputs/index.html
outputs/sporttech-budget-static-v2.html
outputs/github-pages/sporttech/index.html
outputs/assets/
```

同步本機交付版與 GitHub Pages 靜態檔：

```bash
npm run sync
```

建議更新節奏：

```bash
npm run check
npm run sync
git status --short
```

需要部署到 GitHub Pages 時：

```bash
npm run deploy:pages
```

本專案原始碼位置：

```text
/Users/dino/Documents/Codex/2026-07-13/referenced-chatgpt-conversation-this-is-untrusted/work/sporttech-budget-map
```
