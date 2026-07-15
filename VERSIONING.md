# 本機版與 Git 版控規則

本專案採雙軌維護：正式原始碼進 Git，本機靜態檔作為交付快照。原則是「先改正式版，再同步本機版」。

## Source of Truth

正式來源是：

```text
work/sporttech-budget-map/
```

任何會影響網站功能、資料結構、互動邏輯、樣式、測試或部署的修改，都應先改這個 repo。

主要檔案：

```text
app/budget-data.ts  預算項目、來源目錄、指標、分類與縣市資料
app/page.tsx        preloading、篩選邏輯、預算清單、抽屜詳情
app/globals.css     視覺樣式、preloading 與響應式版面
public/             正式版會引用的圖片與靜態素材
tests/              build 後 HTML 與版面規則驗證
README.md           專案概覽
VERSIONING.md       本文件，說明本機版與 Git 版控邊界
```

## 本機交付版

本機可直接打開的交付快照放在外層：

```text
outputs/index.html
outputs/sporttech-budget-static-v2.html
outputs/assets/
```

這些檔案用於快速預覽、截圖、分享、審稿或離線打開，不是主要開發來源。

若正式版有功能或內容更新，才同步更新 `outputs/`。不要只改 `outputs/` 後忘記回填正式 repo。

## Git 應追蹤

Git 版控應保留可重建網站的來源與設定：

- `app/`
- `public/`
- `tests/`
- `.openai/`
- `build/`
- `worker/`
- `README.md`
- `VERSIONING.md`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next.config.ts`
- `vite.config.ts`
- `postcss.config.mjs`
- `eslint.config.mjs`

## Git 不應追蹤

以下屬於本機依賴、快取、build 產物或暫存資料：

- `node_modules/`
- `.next/`
- `.vinext/`
- `.wrangler/`
- `.npm-cache/`
- `dist/`
- `coverage/`
- `.env*`
- 截圖、臨時匯出、一次性檢查檔

## 更新流程

1. 在 `work/sporttech-budget-map/` 修改正式版。
2. 執行驗證：

   ```bash
   npm run check
   ```

3. 若有同步維護靜態交付檔，先確認 `outputs/index.html` 是最新主檔，再執行：

   ```bash
   npm run sync
   ```

   這會同步：

   ```text
   outputs/sporttech-budget-static-v2.html
   outputs/github-pages/sporttech/index.html
   ```

   並自動將 GitHub Pages 版本的主視覺改用較小的 `sporttech-budget-hero-small.jpg`。

4. 檢查 Git 狀態：

   ```bash
   git status --short
   ```

5. 只 commit 正式 repo 內應追蹤的檔案。
6. 需要部署時，使用：

   ```bash
   npm run deploy:pages
   ```

## 命名建議

本機快照可以保留明確版本名，例如：

```text
outputs/sporttech-budget-static-v2.html
outputs/index.html
```

正式版 commit 則使用動詞開頭的短句，例如：

```text
add hero visual above title
add source links for budget evidence
add city filter for budget items
```

## 核心判斷

如果不確定某個檔案該不該進 Git，問一句：

> 沒有這個檔案，未來是否仍能重建同一個網站？

如果答案是否定的，通常應進 Git。若只是預覽、截圖、快照或 build 結果，通常留在本機或 release 交付即可。
