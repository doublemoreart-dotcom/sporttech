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
  assert.match(html, /先判斷預算身分，再看協會是否直接承接/);
  assert.match(html, /想查一筆運動科技相關預算時/);
  assert.match(html, /14 縣市 \/ 30 案/);
  assert.match(html, /台灣運動 x 科技行動計畫/);
  assert.match(html, /精準運動科學研究專案/);
  assert.match(html, /版號/);
  assert.match(html, /v0\.2\.0/);
  assert.match(html, /更新日期/);
  assert.match(html, /2026-07-13/);
  assert.doesNotMatch(html, /本機版|Git 版控版|交付版/);
  assert.doesNotMatch(html, /Your site is taking shape|Codex is working|react-loading-skeleton/i);
});

test("documents the local and git version boundary", async () => {
  const [page, layout, readme] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.match(page, /版號/);
  assert.match(page, /v0\.2\.0/);
  assert.match(page, /更新日期/);
  assert.match(page, /drawerOpen/);
  assert.match(page, /setDrawerOpen\(true\)/);
  assert.match(page, /selectedLayers/);
  assert.match(page, /selectedStages/);
  assert.match(page, /selectionSummary/);
  assert.match(page, /關閉/);
  assert.match(page, /查核摘要/);
  assert.match(page, /補充判斷/);
  assert.match(page, /下一步問法/);
  assert.doesNotMatch(page, /<h2>本機版<\/h2>|<h2>Git 版控版<\/h2>|<h2>交付版<\/h2>/);
  assert.doesNotMatch(page, /detail-disclosure|展開完整資料/);
  assert.match(layout, /lang="zh-Hant"/);
  assert.match(layout, /運動X科技預算查詢小幫手/);
  assert.match(readme, /## 網站架構/);
  assert.match(readme, /## 本機版/);
  assert.match(readme, /## Git 版控版/);
  assert.match(readme, /## 交付版/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview|codex-preview/);

  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});

test("keeps the workbench and lane cards vertically sequenced", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /\.workbench\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /grid-template-areas:\s*"dot year"\s*"\. title"\s*"\. amount"/);
});

test("uses a bottom drawer for detail reading", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /\.drawer-panel\s*\{[\s\S]*height: 70vh/);
  assert.match(css, /\.drawer-scroll\s*\{[\s\S]*overflow: auto/);
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
  assert.match(css, /\.filter-grid/);
  assert.match(css, /\.select-options/);
  assert.match(css, /\.stage-option/);
  assert.match(css, /\.workbench > \.panel\s*\{[\s\S]*position: sticky/);
  assert.match(css, /\.workbench > \.panel\s*\{[\s\S]*top: 12px/);
  assert.doesNotMatch(page, /chip-row|className=\{selectedLayer|className=\{selectedStage/);
  assert.doesNotMatch(css, /\.chip\b|\.chip-row/);
});
