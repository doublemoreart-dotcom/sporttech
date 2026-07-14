import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the sporttech budget query assistant", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /2022-2026 運動X科技預算查詢小幫手/);
  assert.match(html, /運動X科技預算查詢小幫手/);
  assert.match(html, /sporttech-budget-hero\.jpg/);
  assert.match(html, /運動場域、資料節點與預算流向的主視覺/);
  assert.match(html, /先判斷預算身分，再看協會是否直接承接/);
  assert.match(html, /想查一筆運動科技相關預算時/);
  assert.match(html, /14 縣市 \/ 30 案/);
  assert.match(html, /台灣運動 x 科技行動計畫/);
  assert.match(html, /精準運動科學研究專案/);
  assert.match(html, /版號/);
  assert.match(html, /v0\.2\.1/);
  assert.match(html, /更新日期/);
  assert.match(html, /2026-07-14/);
  assert.match(html, /整理運動X科技預算線索/);
  assert.match(html, /略過導入/);
  assert.match(html, /公開資料與版權聲明/);
  assert.match(html, /Open data for public interest research/);
  assert.doesNotMatch(html, /本機版|Git 版控版|交付版/);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working|react-loading-skeleton/i);
});

test("documents the local and git version boundary", async () => {
  const [page, data, layout, readme, favicon] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/budget-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../public/favicon.svg", import.meta.url), "utf8"),
  ]);

  assert.match(page, /版號/);
  assert.match(page, /v0\.2\.1/);
  assert.match(page, /更新日期/);
  assert.match(page, /isPreloading/);
  assert.match(page, /setIsPreloading/);
  assert.match(page, /setTimeout\(\(\) => setIsPreloading\(false\), 1400\)/);
  assert.match(page, /role="status"/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /整理運動X科技預算線索/);
  assert.match(page, /略過導入/);
  assert.match(page, /className="site-footer"/);
  assert.match(page, /className="footer-copy"/);
  assert.match(page, /className="footer-meta"/);
  assert.match(page, /公開資料與版權聲明/);
  assert.match(page, /政府公開資訊、open data、新聞報導/);
  assert.match(page, /公共討論、新聞查核、政策研究與公民監督/);
  assert.match(page, /不代表主管機關之正式預算對帳/);
  assert.match(page, /Open data for public interest research and non-commercial civic use/);
  assert.doesNotMatch(page, /release-strip/);
  assert.match(page, /className="hero-visual"/);
  assert.match(page, /\/sporttech-budget-hero\.jpg/);
  assert.doesNotMatch(page, /next\/image/);
  assert.match(page, /drawerOpen/);
  assert.match(page, /setDrawerOpen\(true\)/);
  assert.match(page, /closeButtonRef/);
  assert.match(page, /lastTriggerRef/);
  assert.match(page, /event\.key === "Escape"/);
  assert.match(page, /selectedLayers/);
  assert.match(page, /selectedStages/);
  assert.match(page, /selectedLocations/);
  assert.match(page, /activeMetric/);
  assert.match(page, /setActiveMetric/);
  assert.match(page, /className="metric"/);
  assert.match(page, /metric-drawer-layer/);
  assert.match(page, /metric-drawer-panel/);
  assert.match(page, /metricCloseButtonRef/);
  assert.match(page, /縣市/);
  assert.match(page, /對應縣市/);
  assert.match(data, /台北市/);
  assert.match(data, /待逐案整理/);
  assert.match(data, /detailTitle: "政策總額怎麼讀"/);
  assert.match(data, /checks: \[/);
  assert.match(data, /查行政院或科技會報核定計畫/);
  assert.match(page, /selectionSummary/);
  assert.match(page, /關閉/);
  assert.match(page, /查核摘要/);
  assert.match(page, /公開資訊進度/);
  assert.match(page, /新聞\/報導線索/);
  assert.match(page, /中央或地方府會公告/);
  assert.match(page, /open data \/ 對帳進度/);
  assert.match(data, /publicInfo/);
  assert.match(page, /相關數據與連結來源/);
  assert.match(data, /sourceCatalog/);
  assert.match(data, /政府科技計畫資訊網/);
  assert.match(data, /政府研究資訊系統 GRB/);
  assert.match(data, /政府資料開放平臺/);
  assert.match(page, /補充判斷/);
  assert.match(page, /下一步問法/);
  assert.doesNotMatch(page, /<h2>本機版<\/h2>|<h2>Git 版控版<\/h2>|<h2>交付版<\/h2>/);
  assert.doesNotMatch(page, /detail-disclosure|展開完整資料/);
  assert.match(layout, /lang="zh-Hant"/);
  assert.match(layout, /運動X科技預算查詢小幫手/);
  assert.match(layout, /icon: "\/favicon\.svg"/);
  assert.match(layout, /shortcut: "\/favicon\.svg"/);
  assert.match(favicon, /viewBox="0 0 64 64"/);
  assert.match(favicon, /#F4EFE5/);
  assert.match(favicon, /#2E7068/);
  assert.match(favicon, /#A16C19/);
  assert.match(readme, /## 網站架構/);
  assert.match(readme, /## 本機版/);
  assert.match(readme, /## Git 版控版/);
  assert.match(readme, /## 交付版/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview|codex-preview/);

  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});

test("keeps the workbench and lane cards vertically sequenced", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /\.hero-visual\s*\{[\s\S]*grid-column: 1 \/ -1/);
  assert.match(css, /\.hero-visual img\s*\{[\s\S]*aspect-ratio: 16 \/ 6/);
  assert.match(css, /\.metric:hover,\n\.metric:focus-visible\s*\{[\s\S]*transform: translate\(-2px, -2px\)/);
  assert.match(css, /\.metric::after\s*\{[\s\S]*content: "查看說明"/);
  assert.match(css, /\.metric-drawer-panel\s*\{[\s\S]*right: 0/);
  assert.match(css, /@keyframes metric-drawer-slide/);
  assert.match(css, /\.preloader\s*\{[\s\S]*position: fixed/);
  assert.match(css, /\.preloader-card\s*\{[\s\S]*max-width: 620px/);
  assert.match(css, /\.preloader-bar span\s*\{[\s\S]*animation: preload-progress 1\.35s ease-out forwards/);
  assert.match(css, /@keyframes preload-progress/);
  assert.match(css, /\.site-footer\s*\{[\s\S]*border-top: 4px double var\(--ink\)/);
  assert.match(css, /\.site-footer\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\) minmax\(220px, 0\.34fr\)/);
  assert.match(css, /\.footer-meta\s*\{[\s\S]*text-align: right/);
  assert.match(css, /\.footer-meta small\s*\{[\s\S]*max-width: 320px/);
  assert.doesNotMatch(css, /release-strip/);
  assert.match(css, /\.workbench\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /grid-template-areas:\s*"dot year"\s*"\. title"\s*"\. amount"/);
});

test("uses a bottom drawer for detail reading", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /\.drawer-panel\s*\{[\s\S]*height: 70vh/);
  assert.match(css, /\.drawer-scroll\s*\{[\s\S]*overflow: auto/);
  assert.match(css, /\.public-info-grid\s*\{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.source-links\s*\{/);
  assert.match(css, /\.select-options\s*\{[\s\S]*max-height: min\(360px, 60vh\)/);
  assert.match(css, /@media \(max-width: 1040px\)\s*\{[\s\S]*\.metrics\s*\{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@keyframes drawer-rise/);
  assert.doesNotMatch(css, /detail-disclosure/);
});

test("uses dropdown multiselect filters", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<details className="select-menu">/);
  assert.match(page, /className="stage-option"/);
  assert.match(page, /type="checkbox"/);
  assert.match(css, /\.filter-grid\s*\{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.select-options/);
  assert.match(css, /\.stage-option/);
  assert.doesNotMatch(css, /position: sticky/);
  assert.doesNotMatch(page, /chip-row|className=\{selectedLayer|className=\{selectedStage/);
  assert.doesNotMatch(css, /\.chip\b|\.chip-row/);
});
