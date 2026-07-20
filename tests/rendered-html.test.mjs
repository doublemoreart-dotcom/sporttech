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
  assert.match(html, /<title>運動X科技預算小幫手<\/title>/);
  assert.match(html, /運動X科技預算小幫手/);
  assert.match(html, /\/sporttech-menu-icon\.png/);
  assert.match(html, /<picture>/);
  assert.match(html, /sporttech-budget-hero\.jpg/);
  assert.match(html, /sporttech-budget-hero-small\.jpg/);
  assert.match(html, /srcSet="\/sporttech-budget-hero-small\.jpg"/);
  assert.match(html, /運動場域、資料節點與預算流向的主視覺/);
  assert.match(html, /\/favicon\.ico/);
  assert.match(html, /\/favicon\.svg/);
  assert.match(html, /https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-K8SEFVT51N/);
  assert.match(html, /gtag\('config', 'G-K8SEFVT51N'\)/);
  assert.match(html, /https:\/\/dinopeng\.com\/sporttech\/assets\/og-image\.png/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /name="twitter:image"/);
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
  assert.match(html, /href="#sports">運動項目表/);
  assert.match(html, /id="sports"/);
  assert.match(html, /運動項目預算表/);
  assert.match(html, /以運動項目整理的預算線索表/);
  assert.match(html, /可辨識金額/);
  assert.match(html, /協會角色/);
  assert.match(html, /棒球科技場域/);
  assert.match(html, /科技防溺/);
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
  const [
    page,
    data,
    layout,
    readme,
    favicon,
    renderer,
    updateFlow,
    syncMainSite,
    verifyPublicSite,
    diagnosePublicSite,
    generateShareAssets,
    packageJson,
  ] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/budget-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../public/favicon.svg", import.meta.url), "utf8"),
    readFile(new URL("../scripts/render-static-page.mjs", import.meta.url), "utf8"),
    readFile(new URL("../scripts/update-flow.sh", import.meta.url), "utf8"),
    readFile(new URL("../scripts/sync-main-site.sh", import.meta.url), "utf8"),
    readFile(new URL("../scripts/verify-public-site.sh", import.meta.url), "utf8"),
    readFile(new URL("../scripts/diagnose-public-site.sh", import.meta.url), "utf8"),
    readFile(new URL("../scripts/generate-share-assets.mjs", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
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
  assert.match(page, /preloader-icon/);
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
  assert.match(layout, /metadataBase: new URL\("https:\/\/dinopeng\.com"\)/);
  assert.match(layout, /canonical: "\/sporttech\/"/);
  assert.match(layout, /\/favicon\.ico/);
  assert.match(layout, /\/favicon\.svg/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /twitter/);
  assert.match(layout, /https:\/\/dinopeng\.com\/sporttech\/assets\/og-image\.png/);
  assert.match(layout, /summary_large_image/);
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
  assert.match(page, /query-step/);
  assert.match(page, /query-illustration/);
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
  assert.match(page, /className="metric-label"/);
  assert.match(page, /metric-value-row/);
  assert.match(page, /metric-value numeric/);
  assert.match(page, /className="card-arrow"/);
  assert.match(page, /LucideIcon name="arrow-up-right"/);
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
  assert.match(page, /drawerOpen && active\?\.id === flow\.id \? "lane active" : "lane"/);
  assert.match(renderer, /wireStaticInteractions/);
  assert.match(renderer, /sortSportRows/);
  assert.match(renderer, /toggleSportDetail/);
  assert.match(renderer, /data-sport-sort/);
  assert.match(renderer, /data-sport-toggle/);
  assert.match(renderer, /favicon\.ico/);
  assert.match(renderer, /og-image\.png/);
  assert.match(renderer, /static-drawer-layer/);
  assert.match(renderer, /allLanes\(\)\.forEach\(\(lane\) => lane\.classList\.remove\("active"\)\)/);
  assert.match(renderer, /openFlowDrawer\(flow\);\n\s*allLanes\(\)\.forEach\(\(item\) => item\.classList\.toggle\("active", item === lane\)\)/);
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
  assert.match(layout, /icon: \[/);
  assert.match(layout, /\{ url: "https:\/\/dinopeng\.com\/sporttech\/assets\/favicon\.ico", sizes: "any" \}/);
  assert.match(layout, /\{ url: "https:\/\/dinopeng\.com\/sporttech\/assets\/favicon\.svg", type: "image\/svg\+xml" \}/);
  assert.match(layout, /shortcut: "https:\/\/dinopeng\.com\/sporttech\/assets\/favicon\.ico"/);
  assert.match(favicon, /viewBox="0 0 64 64"/);
  assert.match(favicon, /#F4EFE5/);
  assert.match(favicon, /#2E7068/);
  assert.match(favicon, /#A16C19/);
  assert.match(generateShareAssets, /favicon\.ico/);
  assert.match(generateShareAssets, /og-image\.png/);
  assert.match(generateShareAssets, /1200, 630/);
  assert.match(generateShareAssets, /icoFromPngs/);
  assert.match(generateShareAssets, /sharp/);
  assert.match(readme, /## 網站架構/);
  assert.match(readme, /npm run verify:public/);
  assert.match(readme, /npm run status:public/);
  assert.match(readme, /source 已是新版但 main-site raw 還舊/);
  assert.match(readme, /不要只看 HTTP 200/);
  assert.match(readme, /raw\/main 也回到舊版/);
  assert.match(packageJson, /"status:public": "bash scripts\/diagnose-public-site\.sh"/);
  assert.match(verifyPublicSite, /doublemoreart-dotcom\/dinopeng-com/);
  assert.match(verifyPublicSite, /G-K8SEFVT51N/);
  assert.match(verifyPublicSite, /<title>運動X科技預算小幫手<\/title>/);
  assert.match(verifyPublicSite, /sporttech-menu-icon\.png/);
  assert.match(verifyPublicSite, /運動項目預算表/);
  assert.match(verifyPublicSite, /data-sport-sort/);
  assert.match(verifyPublicSite, /assets\/favicon\.ico/);
  assert.match(verifyPublicSite, /assets\/og-image\.png/);
  assert.match(verifyPublicSite, /Live HTML size differs from remote raw HTML/);
  assert.match(diagnosePublicSite, /SportTech public deployment status/);
  assert.match(diagnosePublicSite, /doublemoreart-dotcom\/sporttech/);
  assert.match(diagnosePublicSite, /doublemoreart-dotcom\/dinopeng-com/);
  assert.match(diagnosePublicSite, /Local generated static output/);
  assert.match(diagnosePublicSite, /Main-site raw \/sporttech\/index\.html/);
  assert.match(diagnosePublicSite, /Live public URL/);
  assert.match(diagnosePublicSite, /source repo is current, but main-site repo has not been synced/);
  assert.match(readme, /## 本機版/);
  assert.match(readme, /## Git 版控版/);
  assert.match(readme, /## 交付版/);
  assert.match(readme, /## 更新流程/);
  assert.match(readme, /本機優先更新/);
  assert.match(readme, /收到明確「推 Git」或「部署」指令前，不進行 commit、push、登入或 token 建立/);
  assert.match(readme, /### 1\. 本機審查/);
  assert.match(readme, /npm run update:local/);
  assert.match(readme, /npm run assets:social/);
  assert.match(readme, /重產 favicon 與社群分享縮圖/);
  assert.match(readme, /社群轉發 metadata/);
  assert.match(readme, /git diff --stat/);
  assert.match(readme, /正式站同步來源/);
  assert.match(readme, /outputs\/github-pages\/sporttech\/index\.html/);
  assert.match(readme, /doublemoreart-dotcom\/sporttech/);
  assert.match(readme, /doublemoreart-dotcom\/dinopeng-com/);
  assert.match(readme, /正式網域主站/);
  assert.match(readme, /### 2\. 同步正式站本機檔案/);
  assert.match(readme, /npm run sync:main-site/);
  assert.match(readme, /npm run sync:main-site:dry-run/);
  assert.match(readme, /它不會 commit、不會 push/);
  assert.match(readme, /pull --ff-only origin main/);
  assert.match(readme, /若主站本機 repo 顯示 `behind`/);
  assert.match(readme, /### 3\. Git 推版/);
  assert.match(readme, /Source repo 推版/);
  assert.match(readme, /這不會直接更新 `https:\/\/dinopeng\.com\/sporttech\/`/);
  assert.match(readme, /正式網址推版/);
  assert.match(readme, /這才會讓 `https:\/\/dinopeng\.com\/sporttech\/` 變更/);
  assert.match(readme, /git fetch origin/);
  assert.match(readme, /git pull --ff-only origin main/);
  assert.match(readme, /npm run sync:main-site/);
  assert.match(readme, /git status -sb/);
  assert.match(readme, /git diff --stat/);
  assert.match(readme, /git push origin main/);
  assert.match(readme, /不要 force push/);
  assert.match(readme, /git add sporttech/);
  assert.match(readme, /### 4\. GitHub Pages 發布/);
  assert.match(readme, /npm run update:deploy/);
  assert.match(readme, /curl -L -I https:\/\/dinopeng\.com\/sporttech\//);
  assert.match(readme, /last-modified/);
  assert.match(readme, /Fastly 快取尚未過期/);
  assert.match(updateFlow, /Local-first update policy/);
  assert.match(updateFlow, /never commits, pushes, logs in, creates tokens, or deploys/);
  assert.match(updateFlow, /Pushing doublemoreart-dotcom\/sporttech updates source code only/);
  assert.match(updateFlow, /dinopeng\.com\/sporttech\/ updates only after syncing and pushing the main-site repo/);
  assert.match(updateFlow, /local review first; main-site sync and Git push only after an explicit user request/);
  assert.match(updateFlow, /doublemoreart-dotcom\/dinopeng-com/);
  assert.match(updateFlow, /regenerate derived share assets/);
  assert.match(updateFlow, /npm run assets:social/);
  assert.match(updateFlow, /Step 6\/6: review local change summary/);
  assert.match(updateFlow, /skip deploy by design/);
  assert.match(updateFlow, /Do not sync the main site or push Git until the user explicitly asks/);
  assert.match(updateFlow, /npm run sync:main-site/);
  assert.match(updateFlow, /git status -sb/);
  assert.match(updateFlow, /Changed file summary/);
  assert.match(updateFlow, /git diff --stat/);
  assert.match(updateFlow, /Local artifacts ready/);
  assert.match(updateFlow, /outputs\/github-pages\/sporttech\/index\.html/);
  assert.match(updateFlow, /Publish remains manual/);
  assert.match(updateFlow, /If the user says '推 Git' for source only/);
  assert.match(updateFlow, /this does not update https:\/\/dinopeng\.com\/sporttech\//);
  assert.match(updateFlow, /then run npm run status:public/);
  assert.match(updateFlow, /If the user says to update https:\/\/dinopeng\.com\/sporttech\//);
  assert.match(updateFlow, /fast-forward the main-site repo/);
  assert.match(updateFlow, /run npm run status:public to locate any source\/main-site\/live mismatch/);
  assert.match(updateFlow, /run npm run verify:public to compare remote main, raw HTML, and live HTML markers/);
  assert.match(updateFlow, /After updating https:\/\/dinopeng\.com\/sporttech\/ from the main-site repo, run/);
  assert.doesNotMatch(updateFlow, /git push|git commit|gh auth login|force push/);
  assert.match(syncMainSite, /MAIN_SITE_ROOT/);
  assert.match(syncMainSite, /doublemoreart-dotcom\/dinopeng-com/);
  assert.match(syncMainSite, /<title>運動X科技預算小幫手<\/title>/);
  assert.match(syncMainSite, /sporttech-menu-icon\.png/);
  assert.match(syncMainSite, /href="#sports"/);
  assert.match(syncMainSite, /npm run sync:main-site:dry-run/);
  assert.match(syncMainSite, /rsync "\$\{rsync_args\[@\]\}"/);
  assert.match(syncMainSite, /This command never commits or pushes/);
  assert.match(syncMainSite, /Main-site repo is behind origin/);
  assert.match(syncMainSite, /pull --ff-only origin main/);
  assert.match(syncMainSite, /git -C "\$\{main_site_root\}" status -sb/);
  assert.doesNotMatch(syncMainSite, /git push|git commit|gh auth login|force push/);
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
  assert.match(css, /\.audit-panel\s*\{[\s\S]*grid-column: 1 \/ -1/);
  assert.match(css, /\.audit-panel\s*\{[\s\S]*grid-template-columns: auto minmax\(220px, 0\.45fr\) minmax\(0, 1fr\)/);
  assert.match(css, /\.audit-panel\s*\{[\s\S]*border-left: 5px solid var\(--red\)/);
  assert.match(css, /\.audit-panel strong\s*\{[\s\S]*font-size: 1rem/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.audit-panel\s*\{[\s\S]*grid-template-columns: 1fr/);
  assert.match(css, /html\s*\{[\s\S]*scroll-behavior: smooth/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*html\s*\{[\s\S]*scroll-behavior: auto/);
  assert.match(css, /\.site-header\s*\{[\s\S]*position: sticky/);
  assert.match(css, /\.site-header\s*\{[\s\S]*top: 0/);
  assert.match(css, /\.site-logo\s*\{[\s\S]*display: inline-flex/);
  assert.match(css, /\.site-logo\s*\{[\s\S]*font-size: 0\.96rem/);
  assert.match(css, /\.site-logo-mark\s*\{[\s\S]*height: 42px/);
  assert.match(css, /\.site-logo-mark\s*\{[\s\S]*overflow: hidden/);
  assert.match(css, /\.site-logo-mark img\s*\{[\s\S]*object-fit: cover/);
  assert.match(css, /\.site-logo > span:not\(\.site-logo-mark\)\s*\{[\s\S]*line-height: 1\.22/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.site-logo\s*\{[\s\S]*font-size: 0\.9rem/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.site-logo-mark\s*\{[\s\S]*height: 38px/);
  assert.match(css, /\.site-header a:not\(\.site-logo\)\s*\{[\s\S]*font-size: 0\.94rem/);
  assert.match(css, /\.site-header a:not\(\.site-logo\)\s*\{[\s\S]*min-height: 40px/);
  assert.match(css, /\.heading-icon\s*\{[\s\S]*height: 34px/);
  assert.match(css, /\.heading-icon svg\s*\{[\s\S]*height: 18px/);
  assert.match(css, /\.metric-check-flow b svg\s*\{[\s\S]*height: 13px/);
  assert.match(css, /\.metric\s*\{[\s\S]*grid-template-rows: auto minmax\(86px, auto\) minmax\(54px, 1fr\) auto/);
  assert.match(css, /\.metric\s*\{[\s\S]*padding: 16px 48px 14px 14px/);
  assert.match(css, /\.metric-label\s*\{[\s\S]*font-size: 0\.76rem/);
  assert.match(css, /\.metric-value-row\s*\{[\s\S]*min-height: 86px/);
  assert.match(css, /\.metric strong\s*\{[\s\S]*font-size: clamp\(1\.75rem, 2\.8vw, 2\.35rem\)/);
  assert.match(css, /\.metric-value\.numeric\s*\{[\s\S]*font-size: clamp\(2\.35rem, 4vw, 3\.15rem\)/);
  assert.match(css, /\.panel-status strong\s*\{[\s\S]*font-size: clamp\(1\.65rem, 4vw, 2\.45rem\)/);
  assert.match(css, /\.metric:hover,\n\.metric:focus-visible\s*\{[\s\S]*transform: translate\(-2px, -2px\)/);
  assert.match(css, /\.metric::after\s*\{[\s\S]*content: "查看說明"/);
  assert.match(css, /\.card-arrow\s*\{[\s\S]*height: 32px/);
  assert.match(css, /\.card-arrow svg\s*\{[\s\S]*height: 16px/);
  assert.match(css, /\.metric \.card-arrow\s*\{[\s\S]*position: absolute/);
  assert.match(css, /\.lane:hover \.card-arrow,[\s\S]*\.lane\.active \.card-arrow\s*\{[\s\S]*background: var\(--ink\)/);
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
  assert.match(css, /\.query-flow \.query-step\s*\{[\s\S]*grid-template-columns: 32px minmax\(0, 1fr\) 54px/);
  assert.match(css, /\.query-illustration\s*\{[\s\S]*min-height: 70px/);
  assert.match(css, /\.query-illustration svg\s*\{[\s\S]*height: 28px/);
  assert.match(css, /\.panel-status\s*\{[\s\S]*border-bottom: 1px solid var\(--line\)/);
  assert.match(css, /\.empty-state button\s*\{/);
  assert.match(css, /\.view-switcher\s*\{[\s\S]*display: flex/);
  assert.match(css, /\.view-toggle\s*\{[\s\S]*border-radius: 999px/);
  assert.match(css, /\.view-toggle button\[aria-pressed="true"\]\s*\{[\s\S]*background: var\(--ink\)/);
  assert.match(css, /\.lane-map\.card-view\s*\{[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.card-view \.lane\s*\{[\s\S]*min-height: 210px/);
  assert.match(css, /\.preloader\s*\{[\s\S]*position: fixed/);
  assert.match(css, /\.preloader-card\s*\{[\s\S]*max-width: 420px/);
  assert.match(css, /\.preloader-icon\s*\{[\s\S]*height: 56px/);
  assert.match(css, /\.preloader-icon img\s*\{[\s\S]*object-fit: cover/);
  assert.match(css, /\.preloader-bar span\s*\{[\s\S]*animation: preload-progress 1\.35s ease-out forwards/);
  assert.doesNotMatch(css, /\.preloader-flow/);
  assert.match(css, /@keyframes preload-progress/);
  assert.match(css, /--anchor-offset: 128px/);
  assert.match(css, /--section-gap: 44px/);
  assert.match(css, /\.overview-section\s*\{[\s\S]*scroll-margin-top: var\(--anchor-offset\)/);
  assert.match(css, /\.query-section\s*\{[\s\S]*margin-top: var\(--section-gap\)[\s\S]*scroll-margin-top: var\(--anchor-offset\)/);
  assert.match(css, /\.sports-budget-section\s*\{[\s\S]*margin-top: var\(--section-gap\)[\s\S]*scroll-margin-top: var\(--anchor-offset\)/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*:root\s*\{[\s\S]*--anchor-offset: 150px/);
  assert.match(css, /\.site-footer\s*\{[\s\S]*border-top: 4px double var\(--ink\)/);
  assert.match(css, /\.site-footer\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\) minmax\(220px, 0\.34fr\)/);
  assert.match(css, /\.sources-section\s*\{[\s\S]*scroll-margin-top: var\(--anchor-offset\)/);
  assert.match(css, /\.source-registry\s*\{[\s\S]*list-style: none/);
  assert.match(css, /\.source-row\s*\{[\s\S]*grid-template-columns: minmax\(180px, 0\.55fr\) minmax\(0, 1fr\)/);
  assert.match(css, /\.source-row a:hover,[\s\S]*\.source-row a:focus-visible\s*\{[\s\S]*transform: translateX\(2px\)/);
  assert.match(css, /\.footer-meta\s*\{[\s\S]*text-align: right/);
  assert.match(css, /\.footer-meta small\s*\{[\s\S]*max-width: 320px/);
  assert.doesNotMatch(css, /release-strip/);
  assert.match(css, /\.workbench\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /grid-template-areas:\s*"dot year arrow"\s*"\. title arrow"\s*"\. amount arrow"/);
  assert.match(css, /\.lane \.card-arrow\s*\{[\s\S]*grid-area: arrow/);
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
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.query-flow \.query-step\s*\{[\s\S]*grid-template-columns: 28px minmax\(0, 1fr\) 42px/);
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

test("keeps responsive layout and interaction affordances reviewable", async () => {
  const [page, css, staticVerifier] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../scripts/verify-static-output.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(page, /aria-label="主要區塊"/);
  assert.match(page, /href="#overview"/);
  assert.match(page, /href="#query"/);
  assert.match(page, /href="#sports"/);
  assert.match(page, /href="#sources"/);
  assert.match(page, /sportBudgetRows/);
  assert.match(page, /sportSort/);
  assert.match(page, /expandedSports/);
  assert.match(page, /sports-budget-section/);
  assert.match(page, /sport-budget-table/);
  assert.match(page, /table-source-links/);
  assert.match(page, /aria-label="預算層級篩選"/);
  assert.match(page, /aria-label="縣市篩選"/);
  assert.match(page, /aria-label="執行程度篩選"/);
  assert.match(page, /aria-pressed=\{itemView === "list"\}/);
  assert.match(page, /aria-pressed=\{itemView === "card"\}/);
  assert.match(page, /role="dialog"/);
  assert.match(page, /aria-modal="true"/);
  assert.match(page, /event\.key === "Escape"/);

  assert.match(css, /\.site-shell\s*\{[\s\S]*width: min\(1240px, calc\(100% - 32px\)\)/);
  assert.match(css, /\.site-header\s*\{[\s\S]*position: sticky/);
  assert.match(css, /\.site-header nav\s*\{[\s\S]*flex-wrap: wrap/);
  assert.match(css, /\.stage-tags\s*\{[\s\S]*flex-wrap: wrap/);
  assert.match(css, /\.lane\s*\{[\s\S]*width: 100%/);
  assert.match(css, /\.drawer-scroll\s*\{[\s\S]*overflow: auto/);
  assert.match(css, /@media \(max-width: 1040px\)\s*\{[\s\S]*\.metrics\s*\{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 1040px\)\s*\{[\s\S]*\.lane-map\.card-view\s*\{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.metrics,[\s\S]*\.query-flow,[\s\S]*\.flow-diagram\s*\{[\s\S]*grid-template-columns: 1fr/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.lane-map\.card-view\s*\{[\s\S]*grid-template-columns: 1fr/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.drawer-panel\s*\{[\s\S]*width: 100%/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.metric-check-flow span:not\(:last-child\)::after\s*\{[\s\S]*height: 28px/);
  assert.match(staticVerifier, /data-filter-layer="central"/);
  assert.match(staticVerifier, /data-filter-location="台北市"/);
  assert.match(staticVerifier, /data-stage-filter="verified"/);
  assert.match(staticVerifier, /lane-map card-view/);
  assert.match(staticVerifier, /id="sports"/);
  assert.match(staticVerifier, /sport-budget-table/);
  assert.match(staticVerifier, /data-sport-sort="sport"/);
  assert.match(staticVerifier, /static-drawer-layer/);

  assert.doesNotMatch(css, /width:\s*100vw/);
  const cssWithoutScrollableSportTable = css.replace(
    /\.sport-budget-table\s*\{[\s\S]*?\}/g,
    "",
  );
  assert.doesNotMatch(cssWithoutScrollableSportTable, /min-width:\s*[4-9]\d{2}px/);
  assert.doesNotMatch(css, /overflow-x:\s*scroll/);
  assert.doesNotMatch(css, /font-size:\s*calc\([^;]*vw/);
  assert.doesNotMatch(page, /onClick=\{\(\) => window/);
});

test("adds a sport-oriented budget table for public clues", async () => {
  const [page, data, css, staticVerifier, readme] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/budget-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../scripts/verify-static-output.mjs", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.match(data, /export const sportBudgetRows = \[/);
  assert.match(data, /sport: "棒球"/);
  assert.match(data, /icon: "circle-dot"/);
  assert.match(data, /icon: "bike"/);
  assert.match(data, /icon: "waves"/);
  assert.match(data, /sport: "全民運動"/);
  assert.match(data, /theme: "棒球科技場域、軌跡分析與國家隊支援"/);
  assert.match(data, /theme: "科技防溺、泳池場域管理與動作資料"/);
  assert.match(data, /flowRefs: \["taiwan-sporttech", "precision-sport-science", "baseball-made"\]/);
  assert.match(data, /flowRefs: \["field-proof", "application-budget"\]/);
  assert.match(data, /associationRole/);
  assert.match(data, /nextCheck/);
  assert.match(data, /sourceRefs: \["nstc", "gstp", "sports", "pcc"\]/);

  assert.match(page, /href="#sports">運動項目表<\/a>/);
  assert.match(page, /<section className="sports-budget-section" id="sports"/);
  assert.match(page, /<h2 id="sports-title">/);
  assert.match(page, /運動項目預算表/);
  assert.match(page, /table-note/);
  assert.match(page, /表格中的「對應線索」會回扣上方 8 筆公開線索/);
  assert.match(page, /sport-table-toolbar/);
  assert.match(page, /data-sport-expand-all/);
  assert.match(page, /以運動項目整理的預算線索表/);
  assert.match(page, /sport-budget-table/);
  assert.match(page, /sort-button/);
  assert.match(page, /data-sport-sort=\{key\}/);
  assert.match(page, /toggleSportSort/);
  assert.match(page, /aria-sort/);
  assert.match(page, /data-sport-toggle=\{row\.sport\}/);
  assert.match(page, /className="sport-name-icon"/);
  assert.match(page, /LucideIcon name=\{row\.icon\}/);
  assert.match(page, /data-sport-detail=\{row\.sport\}/);
  assert.match(page, /hidden=\{!expandedSports\.includes\(row\.sport\)\}/);
  assert.match(page, /row\.flowRefs\.map/);
  assert.match(page, /flowTitleById\[flowId\]/);
  assert.match(page, /可辨識金額/);
  assert.match(page, /查核狀態/);
  assert.match(page, /協會角色/);
  assert.match(page, /下一步查核/);
  assert.match(page, /row\.budgetClues\.join/);
  assert.match(page, /row\.sourceRefs\.map/);

  assert.match(css, /\.sports-budget-section\s*\{/);
  assert.match(css, /\.table-note\s*\{/);
  assert.match(css, /\.sport-table-toolbar\s*\{/);
  assert.match(css, /\.sport-table-wrap\s*\{/);
  assert.match(css, /overflow-x: auto/);
  assert.match(css, /\.sport-budget-table\s*\{/);
  assert.match(css, /min-width: 1040px/);
  assert.match(css, /\.sort-button\s*\{/);
  assert.match(css, /\.sort-arrow\s*\{/);
  assert.match(css, /\.sport-toggle\s*\{/);
  assert.match(css, /\.sport-name\s*\{[\s\S]*display: inline-flex/);
  assert.match(css, /\.sport-name-icon\s*\{[\s\S]*height: 30px/);
  assert.match(css, /\.sport-name-icon svg\s*\{[\s\S]*height: 16px/);
  assert.match(css, /\.linked-clues li::before\s*\{/);
  assert.match(css, /\.linked-clues li::before\s*\{[\s\S]*background: var\(--teal\)/);
  assert.match(css, /\.sport-detail-row\[hidden\]\s*\{/);
  assert.match(css, /\.sport-detail-grid\s*\{/);
  assert.match(css, /\.status-pill\s*\{/);
  assert.match(css, /\.status-pill\s*\{[\s\S]*border-radius: 14px/);
  assert.match(css, /\.table-source-links\s*\{/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.sport-budget-table\s*\{[\s\S]*min-width: 920px/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.sport-budget-table th:nth-child\(4\),[\s\S]*\.sport-budget-table td:nth-child\(4\)\s*\{[\s\S]*min-width: 132px/);
  assert.match(css, /@media \(max-width: 700px\)\s*\{[\s\S]*\.status-pill\s*\{[\s\S]*border-radius: 12px[\s\S]*max-width: 9\.5em/);

  assert.match(staticVerifier, /id="sports"/);
  assert.match(staticVerifier, /sport-budget-table/);
  assert.match(staticVerifier, /data-sport-toggle="棒球"/);
  assert.match(staticVerifier, /data-sport-sort="sport"/);
  assert.match(staticVerifier, /以運動項目整理的預算線索表/);
  assert.match(staticVerifier, /棒球科技場域/);
  assert.match(staticVerifier, /全民運動/);
  assert.match(readme, /運動項目預算表/);
  assert.match(readme, /運動項目聚合/);
});
