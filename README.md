# 2022-2026 運動X科技預算小幫手

一頁式互動查詢工具，用於協助使用者判讀台灣運動科技相關預算的來源、執行程度、地方場域、學研/產業執行單位，以及協會在預算流中的角色。

## 正式準線

未來查核、部署與維護請以以下兩個位置為準：

- Public URL: `https://dinopeng.com/sporttech/`
- GitHub repo: `https://github.com/doublemoreart-dotcom/sporttech`

其他本機 `outputs/` HTML、早期 prototype、截圖與審查筆記都視為交付快照或舊資料，不作為正式來源。需要更新網站時，先修改本 repo，再同步與部署。

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
- 運動項目預算表採運動項目聚合公開線索，方便查棒球、羽球、游泳等主題，但不代表單項運動已完成正式對帳。
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

舊資料判斷：

- 保留：`outputs/index.html`、`outputs/sporttech-budget-static-v2.html`、`outputs/github-pages/sporttech/index.html`，因為同步與部署流程仍會產生或使用它們。
- 可刪或封存：`outputs/sporttech-budget-static-prototype.html`、一次性 review notes、舊截圖與早期試作檔。
- 不要直接改：任何 `outputs/` 檔案都不應成為主要修改來源。

同步本機交付版與 GitHub Pages 靜態檔：

```bash
npm run sync
```

## 更新流程

這個專案採本機優先更新。日常調整時只更新 source 與本機靜態快照；收到明確「推 Git」或「部署」指令前，不進行 commit、push、登入或 token 建立。

目前有兩個不同責任的 repo：

- `doublemoreart-dotcom/sporttech`：本工具的 source of truth，負責開發、測試與產生靜態輸出。
- `doublemoreart-dotcom/dinopeng-com`：正式網域主站，`https://dinopeng.com/sporttech/` 實際由此 repo 的 `/sporttech/` 目錄供應。

### 1. 本機審查

每次修改畫面、資料或互動後先跑：

```bash
npm run update:local
```

這會依序重產 favicon 與社群分享縮圖、執行 lint、build、測試、同步本機靜態快照，並驗證靜態版是否保留互動所需的標記、相對素材路徑、響應式主視覺、社群轉發 metadata 與 fallback script，最後列出 `git status -sb`、`git diff --stat` 與本機審查檔案位置。

若只想單獨重產 favicon 與社群縮圖：

```bash
npm run assets:social
```

不要把 `npm run check`、`npm run sync` 或手動複製輸出檔並行執行；先讓資產生成與檢查完成，再同步靜態輸出，才能避免舊 build、舊素材或半套 HTML 被推到 GitHub Pages。

可單獨檢查靜態輸出：

```bash
npm run verify:static
```

本機審查入口：

```text
../../outputs/sporttech-budget-static-v2.html
```

正式站同步來源：

```text
../../outputs/github-pages/sporttech/index.html
```

### 2. 同步正式站本機檔案

只有畫面、互動或靜態輸出有變動，且使用者明確要求更新正式站時，才同步主站 repo：

```bash
git -C /Users/dino/Documents/Codex/2026-07-14/dinopeng-com-tptrees-dinopeng-com-aidata/work/dinopeng-com fetch origin
git -C /Users/dino/Documents/Codex/2026-07-14/dinopeng-com-tptrees-dinopeng-com-aidata/work/dinopeng-com pull --ff-only origin main
npm run sync:main-site
```

這個命令只會把已驗證的 `outputs/github-pages/sporttech/` 複製到本機主站 repo 的 `/sporttech/` 目錄，並列出主站 `git status -sb`。它不會 commit、不會 push，也不會登入或建立 token。
若主站本機 repo 顯示 `behind`，同步腳本會停止；先快轉主站再同步，避免用過期的主站狀態覆蓋正式站資料。

若只是想先看會異動哪些主站檔案：

```bash
npm run sync:main-site:dry-run
```

同步後請到主站 repo 檢查 diff：

```bash
cd /Users/dino/Documents/Codex/2026-07-14/dinopeng-com-tptrees-dinopeng-com-aidata/work/dinopeng-com
git status -sb
git diff --stat
```

### 3. Git 推版

只有收到明確「推 Git」指令才進行，且要先判斷這次推的是哪一種：

- **Source repo 推版**：更新 `doublemoreart-dotcom/sporttech` 的原始碼、測試與靜態產出來源。這不會直接更新 `https://dinopeng.com/sporttech/`。
- **SportTech Pages 推版**：更新 `doublemoreart-dotcom/sporttech` 的 `gh-pages` 分支。主站自動同步流程會讀這個分支。
- **正式網址推版**：更新 `doublemoreart-dotcom/dinopeng-com` 的 `/sporttech/` 目錄。這才會讓 `https://dinopeng.com/sporttech/` 變更。

若只是更新 source repo：

```bash
git fetch origin
git status -sb
git log --oneline -5
git add <changed files>
git commit -m "<message>"
git push origin main
npm run status:public
```

`status:public` 會把四層狀態攤開：`doublemoreart-dotcom/sporttech` source main、`sporttech` 的 `gh-pages`、`doublemoreart-dotcom/dinopeng-com` 的 raw `/sporttech/index.html`，以及 `https://dinopeng.com/sporttech/` live HTML。若 source main 已是新版但 `gh-pages` 還舊，先跑 `npm run deploy:pages`；若 `gh-pages` 已是新版但 main-site raw 還舊，代表還沒有同步主站 repo。

若是更新正式網址，必須先補齊 `sporttech/gh-pages`，再同步主站 repo 並推送 `/sporttech/` 目錄：

```bash
cd /Users/dino/Documents/Codex/2026-07-13/referenced-chatgpt-conversation-this-is-untrusted/work/sporttech-budget-map
npm run sync
npm run deploy:pages
cd /Users/dino/Documents/Codex/2026-07-14/dinopeng-com-tptrees-dinopeng-com-aidata/work/dinopeng-com
git fetch origin
git pull --ff-only origin main
git status -sb
cd /Users/dino/Documents/Codex/2026-07-13/referenced-chatgpt-conversation-this-is-untrusted/work/sporttech-budget-map
npm run sync:main-site
cd /Users/dino/Documents/Codex/2026-07-14/dinopeng-com-tptrees-dinopeng-com-aidata/work/dinopeng-com
git diff --stat
git add sporttech
git commit -m "Update sporttech static page"
git push origin main
```

推版前先確認遠端是否有新 commit；不要 force push。正式站推完後不要只看 HTTP 200，還要確認 GitHub 遠端 main、固定 commit raw HTML 與正式網址 HTML 都含有新版標記：

```bash
npm run status:public
npm run verify:public
```

若要指定剛推送的主站 commit：

```bash
npm run verify:public -- --ref=<main-site-commit>
```

`verify:public` 會檢查：

- `doublemoreart-dotcom/dinopeng-com` 的遠端 `main` commit。
- 該 commit 的 `sporttech/index.html` 是否包含新版 title、menu icon、GA、運動項目預算表、排序 hook、favicon 與社群縮圖。
- `https://dinopeng.com/sporttech/` 是否也送出同樣的新版標記。
- raw HTML 與 live HTML 檔案大小是否一致。

若 GitHub raw 已更新但正式網址還舊，通常是 GitHub Pages/Fastly 快取尚未過期；若 raw/main 也回到舊版，先檢查 `sporttech/gh-pages` 是否舊版。主站 workflow 會從 `doublemoreart-dotcom/sporttech:gh-pages` 同步，所以正式站推版一定要先更新 `gh-pages`，再同步並推主站 repo。

### 4. GitHub Pages 發布

需要發布 `doublemoreart-dotcom/sporttech` repo 自己的 GitHub Pages，或正式站要避免被主站自動同步流程覆蓋時使用：

```bash
npm run update:deploy
```

`update:deploy` 會在檢查與同步通過後部署 GitHub Pages；它不會自動 commit，也不會 force push。部署前仍要先確認本機畫面、互動與 RWD。

目前 `https://dinopeng.com/sporttech/` 由主站 repo 供應，但主站排程會從 `sporttech/gh-pages` 重新同步 `/sporttech/`。若只更新本 repo 的工作流程文件或測試腳本，不一定需要同步主站；若畫面、互動或靜態輸出有變動，請依序更新 source main、`gh-pages`、主站 `/sporttech/`，最後驗證 live URL。

正式網址更新後可用以下方式確認：

```bash
curl -L -I https://dinopeng.com/sporttech/
curl -L https://dinopeng.com/sporttech/ | grep '運動X科技預算小幫手'
npm run verify:public
```

若 GitHub Pages build 已完成但正式網址還是舊版，先看 header 的 `last-modified`、`etag`、`age` 與 `expires`，通常是 GitHub Pages/Fastly 快取尚未過期。

本專案原始碼位置：

```text
/Users/dino/Documents/Codex/2026-07-13/referenced-chatgpt-conversation-this-is-untrusted/work/sporttech-budget-map
```
