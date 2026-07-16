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
  assert.match(html, /2022-2026 運動X科技預算小幫手/);
  assert.match(html, /運動X科技預算小幫手/);
  assert.match(html, /<picture>/);
  assert.match(html, /sporttech-budget-hero\.jpg/);
  assert.match(html, /sporttech-budget-hero-small\.jpg/);
  assert.match(html, /srcSet="\/sporttech-budget-hero-small\.jpg"/);
  assert.match(html, /運動場域、資料節點與預算流向的主視覺/);
  assert.match(html, /先判斷預算身分，再看協會是否直接承接/);
  assert.match(html, /想查一筆運動科技相關預算時/);
  assert.match(html, /14 縣市 \/ 30 案/);
  assert.match(html, /5 項運動/);
  assert.match(html, /台灣運動 x 科技行動計畫/);
  assert.match(html, /精準運動科學研究專案/);
  assert.match(html, /版號/);
  assert.match(html, /v0\.2\.3/);
  assert.match(html, /更新日期/);
  assert.match(html, /2026-07-15/);
  assert.match(html, /建議查詢流程/);
  assert.match(html, /先選預算身分/);
  assert.match(html, /再看執行程度/);
  assert.match(html, /最後打開詳情/);
  assert.match(html, /目前查詢/);
  assert.match(html, /查詢結果/);
  assert.match(html, /切換分類/);
  assert.match(html, /href="#sources">資料來源/);
  assert.match(html, /id="sources"/);
  assert.match(html, /source registry/);
  assert.match(html, /行政院全球資訊網/);
  assert.match(html, /政府資料開放平臺/);
  assert.match(html, /整理預算線索/);
  assert.match(html, /略過導入/);
  assert.match(html, /公開資料與版權聲明/);
  assert.match(html, /Open data for public interest research/);
  assert.doesNotMatch(html, /本機版|Git 版控版|交付版/);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working|react-loading-skeleton/i);
});

test("documents the local and git version boundary", async () => {
  const [page, data, layout, readme, favicon, renderer] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/budget-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../public/favicon.svg", import.meta.url), "utf8"),
    readFile(new URL("../scripts/render-static-page.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(page, /版號/);
  assert.match(page, /v0\.2\.3/);
  assert.match(page, /更新日期/);
  assert.match(page, /isPreloading/);
  assert.match(page, /setIsPreloading/);
  assert.match(page, /setTimeout\(\(\) => setIsPreloading\(false\), 1400\)/);
  assert.match(page, /role="status"/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /整理預算線索/);
  assert.doesNotMatch(page, /preloader-flow/);
  assert.match(page, /略過導入/);
  assert.match(page, /className="site-footer"/);
  assert.match(page, /id="sources"/);
  assert.match(page, /className="source-registry"/);
  assert.match(page, /className="source-row"/);
  assert.match(page, /Object\.entries\(sourceCatalog\)/);
  assert.match(page, /className="footer-copy"/);
  assert.match(page, /className="footer-meta"/);
  assert.match(page, /公開資料與版權聲明/);
  assert.match(page, /政府公開資訊、open data、新聞報導/);
  assert.match(page, /公共討論、新聞查核、政策研究與公民監督/);
  assert.match(page, /不代表主管機關之正式預算對帳/);
  assert.match(page, /Open data for public interest research and non-commercial civic use/);
  assert.doesNotMatch(page, /release-strip/);
  assert.match(page, /className="hero-visual"/);
  assert.match(page, /<picture>/);
  assert.match(page, /\/sporttech-budget-hero\.jpg/);
  assert.match(page, /\/sporttech-budget-hero-small\.jpg/);
  assert.match(page, /srcSet="\/sporttech-budget-hero-small\.jpg"/);
  assert.doesNotMatch(page, /next\/image/);
  assert.match(page, /drawerOpen/);
  assert.match(page, /setDrawerOpen\(true\)/);
  assert.match(page, /closeButtonRef/);
  assert.match(page, /lastTriggerRef/);
  assert.match(page, /event\.key === "Escape"/);
  assert.match(page, /selectedLayers/);
  assert.match(page, /selectedStages/);
  assert.match(page, /selectedLocations/);
  assert.match(page, /hasActiveFilters/);
  assert.match(page, /function resetFilters/);
  assert.match(page, /建議查詢流程/);
  assert.match(page, /先選預算身分/);
  assert.match(page, /目前查詢/);
  assert.match(page, /清除篩選/);
  assert.match(page, /查詢結果/);
  assert.match(page, /重設查詢條件/);
  assert.match(page, /itemView/);
  assert.match(page, /useState<"list" \| "card">\("card"\)/);
  assert.match(page, /setItemView/);
  assert.match(page, /切換分類/);
  assert.match(page, /列表/);
  assert.match(page, /卡片/);
  assert.match(page, /card-view/);
  assert.match(page, /list-view/);
  assert.match(page, /activeMetric/);
  assert.match(page, /setActiveMetric/);
  assert.match(page, /className="metric"/);
  assert.match(page, /metric-value-row/);
  assert.match(page, /metric-value numeric/);
  assert.match(page, /className="drawer-layer metric-drawer-layer"/);
  assert.match(page, /className="drawer-panel metric-drawer-panel"/);
  assert.match(page, /className="drawer-scroll metric-drawer-scroll"/);
  assert.match(page, /metric-drawer-layer/);
  assert.match(page, /metric-drawer-panel/);
  assert.match(page, /metricCloseButtonRef/);
  assert.match(page, /metric-check-flow/);
  assert.match(page, /flowIcons/);
  assert.match(page, /flowRoles/);
  assert.match(page, /function LucideIcon/);
  assert.match(page, /const budgetRoute = \[/);
  assert.match(page, /訓練、使用與成果回饋/);
  assert.match(page, /viewBox="0 0 24 24"/);
  assert.match(page, /heading-icon/);
  assert.match(page, /className="metric-info-block"/);
  assert.match(page, /className="metric-source-section metric-info-block compact"/);
  assert.match(page, /metric-source-section/);
  assert.match(page, /縣市/);
  assert.match(page, /對應縣市/);
  assert.match(data, /台北市/);
  assert.match(data, /待逐案整理/);
  assert.match(data, /detailTitle: "政策總額怎麼讀"/);
  assert.match(data, /flow: \["政策核定", "年度預算", "分案\/採購", "驗收\/成果"\]/);
  assert.match(data, /flowRoles: \["行政院\/科技會報", "主計總處與各部會", "地方政府或委辦廠商", "場域、使用者與成果報告"\]/);
  assert.match(data, /flowIcons: \["badge-check", "calendar-days", "file-search", "circle-check"\]/);
  assert.match(data, /checks: \[/);
  assert.match(data, /政策總額是方向與額度，不等於已花完/);
  assert.match(data, /GRB 是政府研究計畫查詢系統/);
  assert.match(data, /配合款是地方自己也要出的錢/);
  assert.match(data, /應用端是使用或協助測試的一方/);
  assert.match(data, /value: "5 項運動"/);
  assert.match(data, /棒球、羽球、桌球、舉重、自由車/);
  assert.match(data, /sourceRefs: \["ey", "gstp", "dgbas", "data"\]/);
  assert.match(page, /data-filter-layer/);
  assert.match(page, /data-filter-location/);
  assert.match(page, /data-stage-filter/);
  assert.match(page, /data-flow-id/);
  assert.match(renderer, /wireStaticInteractions/);
  assert.match(renderer, /static-drawer-layer/);
  assert.match(renderer, /lucideIcon\(metric\.flowIcons\[index\]\)/);
  assert.match(renderer, /stroke="currentColor"/);
  assert.match(renderer, /metric\.flowRoles\[index\]/);
  assert.match(renderer, /<script id="_R_">/);
  assert.match(renderer, /html\.replace\(/);
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
  assert.match(layout, /運動X科技預算小幫手/);
  assert.match(layout, /Nunito/);
  assert.match(layout, /Zalando_Sans_Expanded/);
  assert.match(layout, /--font-nunito/);
  assert.match(layout, /--font-zalando-sans-expanded/);
  assert.doesNotMatch(layout, /DotGothic16|Geist|Rubik_Mono_One/);
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
  assert.match(css, /--font-sans: var\(--font-zalando-sans-expanded\), var\(--font-nunito\)/);
  assert.match(css, /--font-mono: var\(--font-zalando-sans-expanded\), var\(--font-nunito\)/);
  assert.match(css, /font-family: var\(--font-zalando-sans-expanded\), var\(--font-nunito\), Arial, Helvetica, sans-serif/);
  assert.match(css, /font-family: var\(--font-zalando-sans-expanded\), var\(--font-nunito\), monospace/);
  assert.match(css, /\.hero-visual picture\s*\{[\s\S]*display: block/);
  assert.match(css, /\.hero-visual img\s*\{[\s\S]*aspect-ratio: 16 \/ 6/);
  assert.match(css, /\.site-header\s*\{[\s\S]*position: sticky/);
  assert.match(css, /\.site-header\s*\{[\s\S]*top: 0/);
  assert.match(css, /\.site-header a:not\(\.site-logo\)\s*\{[\s\S]*font-size: 0\.94rem/);
  assert.match(css, /\.site-header a:not\(\.site-logo\)\s*\{[\s\S]*min-height: 40px/);
  assert.match(css, /\.heading-icon\s*\{[\s\S]*height: 34px/);
  assert.match(css, /\.heading-icon svg\s*\{[\s\S]*height: 18px/);
  assert.match(css, /\.metric-check-flow b svg\s*\{[\s\S]*height: 13px/);
  assert.match(css, /\.metric\s*\{[\s\S]*grid-template-rows: auto minmax\(86px, auto\) minmax\(54px, 1fr\) auto/);
  assert.match(css, /\.metric-value-row\s*\{[\s\S]*min-height: 86px/);
  assert.match(css, /\.metric strong\s*\{[\s\S]*font-size: clamp\(1\.75rem, 2\.8vw, 2\.35rem\)/);
  assert.match(css, /\.metric-value\.numeric\s*\{[\s\S]*font-size: clamp\(2\.35rem, 4vw, 3\.15rem\)/);
  assert.match(css, /\.panel-status strong\s*\{[\s\S]*font-size: clamp\(1\.65rem, 4vw, 2\.45rem\)/);
  assert.match(css, /\.metric:hover,\n\.metric:focus-visible\s*\{[\s\S]*transform: translate\(-2px, -2px\)/);
  assert.match(css, /\.metric::after\s*\{[\s\S]*content: "查看說明"/);
  assert.match(css, /\.metric-drawer-panel\s*\{[\s\S]*width: min\(980px, calc\(100% - 32px\)\)/);
  assert.match(css, /\.metric-drawer-scroll\s*\{[\s\S]*height: calc\(70vh - 71px\)/);
  assert.match(css, /\.metric-drawer-scroll\s*\{[\s\S]*padding: 20px 24px 28px/);
  assert.match(css, /\.metric-drawer-label\s*\{[\s\S]*border-radius: 8px/);
  assert.match(css, /\.metric-drawer-scroll h2\s*\{[\s\S]*font-size: clamp\(1\.85rem, 3\.1vw, 2\.55rem\)/);
  assert.match(css, /\.metric-info-block\s*\{[\s\S]*border-left: 5px solid var\(--red\)/);
  assert.match(css, /\.metric-info-block h3::before\s*\{[\s\S]*background: var\(--red\)/);
  assert.match(css, /\.metric-check-flow\s*\{[\s\S]*grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.metric-check-flow\s*\{[\s\S]*gap: 28px/);
  assert.match(css, /\.metric-check-flow span\s*\{[\s\S]*display: grid/);
  assert.match(css, /\.metric-check-flow b\s*\{[\s\S]*border-radius: 999px/);
  assert.match(css, /\.metric-check-flow small\s*\{[\s\S]*font-family: var\(--font-nunito\), Arial, Helvetica, sans-serif/);
  assert.match(css, /\.metric-check-flow span:not\(:last-child\)::after\s*\{[\s\S]*transform: translateY\(-50%\)/);
  assert.match(css, /\.metric-check-flow span:not\(:last-child\)::before\s*\{[\s\S]*transform: translateY\(-50%\) rotate\(45deg\)/);
  assert.match(css, /\.metric-source-section\s*\{[\s\S]*border-left-color: var\(--teal\)/);
  assert.match(css, /\.metric-info-block\.compact\s*\{[\s\S]*border-left-width: 4px/);
  assert.match(css, /\.flow-diagram\s*\{[\s\S]*gap: 28px/);
  assert.match(css, /\.flow-diagram span\s*\{[\s\S]*display: grid/);
  assert.match(css, /\.flow-diagram b svg\s*\{[\s\S]*height: 13px/);
  assert.match(css, /\.flow-diagram span:not\(:last-child\)::after\s*\{[\s\S]*transform: translateY\(-50%\)/);
  assert.match(css, /\.query-flow\s*\{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.query-flow div\s*\{[\s\S]*grid-template-columns: 32px minmax\(0, 1fr\)/);
  assert.match(css, /\.panel-status\s*\{[\s\S]*border-bottom: 1px solid var\(--line\)/);
  assert.match(css, /\.empty-state button\s*\{/);
  assert.match(css, /\.view-switcher\s*\{[\s\S]*display: flex/);
  assert.match(css, /\.view-toggle\s*\{[\s\S]*border-radius: 999px/);
  assert.match(css, /\.view-toggle button\[aria-pressed="true"\]\s*\{[\s\S]*background: var\(--ink\)/);
  assert.match(css, /\.lane-map\.card-view\s*\{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.card-view \.lane\s*\{[\s\S]*min-height: 210px/);
  assert.match(css, /\.preloader\s*\{[\s\S]*position: fixed/);
  assert.match(css, /\.preloader-card\s*\{[\s\S]*max-width: 420px/);
  assert.match(css, /\.preloader-bar span\s*\{[\s\S]*animation: preload-progress 1\.35s ease-out forwards/);
  assert.doesNotMatch(css, /\.preloader-flow/);
  assert.match(css, /@keyframes preload-progress/);
  assert.match(css, /\.site-footer\s*\{[\s\S]*border-top: 4px double var\(--ink\)/);
  assert.match(css, /\.site-footer\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\) minmax\(220px, 0\.34fr\)/);
  assert.match(css, /\.sources-section\s*\{[\s\S]*scroll-margin-top: 88px/);
  assert.match(css, /\.sources-section\s*\{[\s\S]*padding-top: 18px/);
  assert.match(css, /\.source-registry\s*\{[\s\S]*list-style: none/);
  assert.match(css, /\.source-row\s*\{[\s\S]*grid-template-columns: minmax\(180px, 0\.55fr\) minmax\(0, 1fr\)/);
  assert.match(css, /\.source-row a:hover,[\s\S]*\.source-row a:focus-visible\s*\{[\s\S]*transform: translateX\(2px\)/);
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
  assert.match(css, /@media \(max-width: 1040px\)\s*\{[\s\S]*\.metrics\s*\{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 1040px\)\s*\{[\s\S]*\.query-flow\s*\{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.query-flow,[\s\S]*grid-template-columns: 1fr/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.source-row\s*\{[\s\S]*grid-template-columns: 1fr/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.metric-check-flow\s*\{[\s\S]*grid-template-columns: 1fr/);
  assert.match(css, /@keyframes drawer-rise/);
  assert.doesNotMatch(css, /detail-disclosure/);
});

test("uses multi-select tag filters", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /className="filter-stack"/);
  assert.match(page, /aria-label="預算層級篩選"/);
  assert.match(page, /aria-label="縣市篩選"/);
  assert.match(page, /data-filter-layer="all"/);
  assert.match(page, /data-filter-location="all"/);
  assert.match(page, /className=\{selectedLayers\.length === 0 \? "stage-tag active" : "stage-tag"\}/);
  assert.match(page, /className=\{selectedLocations\.length === 0 \? "stage-tag active" : "stage-tag"\}/);
  assert.match(page, /aria-pressed=\{selectedLayers\.includes\(layer\)\}/);
  assert.match(page, /aria-pressed=\{selectedLocations\.includes\(location\)\}/);
  assert.match(page, /className=\{selectedStages\.length === 0 \? "stage-tag active" : "stage-tag"\}/);
  assert.match(page, /className=\{selectedStages\.includes\(stage\) \? "stage-tag active" : "stage-tag"\}/);
  assert.match(page, /aria-pressed=\{selectedStages\.includes\(stage\)\}/);
  assert.match(page, /<span className=\{`stage-dot \$\{stage\}`\} \/>/);
  assert.match(css, /\.filter-stack\s*\{/);
  assert.match(css, /\.stage-tags\s*\{/);
  assert.match(css, /\.stage-tag\s*\{/);
  assert.match(css, /\.stage-tag\.active\s*\{/);
  assert.doesNotMatch(page, /<details className="select-menu">/);
  assert.doesNotMatch(page, /type="checkbox"/);
  assert.doesNotMatch(css, /\.select-options/);
  assert.doesNotMatch(css, /\.select-menu/);
  assert.doesNotMatch(css, /\.stage-option/);
  assert.match(css, /\.site-header\s*\{[\s\S]*position: sticky/);
  assert.doesNotMatch(page, /chip-row|className=\{selectedLayer ===/);
  assert.doesNotMatch(css, /\.chip\b|\.chip-row/);
});
