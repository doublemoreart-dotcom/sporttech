import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const repoRoot = resolve(import.meta.dirname, "..");
const outputsRoot = resolve(repoRoot, "../../outputs");
const targets = [
  resolve(outputsRoot, "sporttech-budget-static-v2.html"),
  resolve(outputsRoot, "github-pages/sporttech/index.html"),
];

for (const target of targets) {
  const html = await readFile(target, "utf8");

  assert.match(html, /href="assets\//, `${target}: expected relative asset hrefs`);
  assert.match(html, /assets\/favicon\.ico/, `${target}: missing ico favicon`);
  assert.match(html, /assets\/favicon\.svg/, `${target}: missing svg favicon`);
  assert.match(html, /assets\/sporttech-menu-icon\.png/, `${target}: missing header menu icon`);
  assert.match(html, /https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-K8SEFVT51N/, `${target}: missing Google tag loader`);
  assert.match(html, /gtag\('config', 'G-K8SEFVT51N'\)/, `${target}: missing Google tag config`);
  assert.match(html, /https:\/\/dinopeng\.com\/sporttech\/assets\/og-image\.png/, `${target}: missing absolute social share image`);
  assert.match(html, /property="og:image"/, `${target}: missing Open Graph image metadata`);
  assert.match(html, /name="twitter:image"/, `${target}: missing Twitter image metadata`);
  assert.match(html, /src="assets\/sporttech-budget-hero\.jpg"/, `${target}: missing hero image`);
  assert.match(html, /srcSet="assets\/sporttech-budget-hero-small\.jpg"/, `${target}: missing responsive hero source`);
  assert.match(html, /data-filter-layer="central"/, `${target}: missing layer filter markers`);
  assert.match(html, /data-filter-location="台北市"/, `${target}: missing location filter markers`);
  assert.match(html, /data-stage-filter="verified"/, `${target}: missing stage filter markers`);
  assert.match(html, /data-flow-id="application-budget"/, `${target}: missing flow markers`);
  assert.match(html, /lane-map card-view/, `${target}: query results should default to card view`);
  assert.match(html, /href="#sports">運動項目表/, `${target}: missing sport budget nav anchor`);
  assert.match(html, /id="sports"/, `${target}: missing sport budget section`);
  assert.match(html, /sport-budget-table/, `${target}: missing sport-oriented budget table`);
  assert.match(html, /data-sport-sort="sport"/, `${target}: missing sport table sort controls`);
  assert.match(html, /data-sport-toggle="棒球"/, `${target}: missing sport table collapse controls`);
  assert.match(html, /data-sport-detail="棒球"/, `${target}: missing sport table expandable detail rows`);
  assert.match(html, /表格中的「對應線索」會回扣上方 8 筆公開線索/, `${target}: missing query/table relationship copy`);
  assert.match(html, /以運動項目整理的預算線索表/, `${target}: missing sport budget table accessible label`);
  assert.match(html, /棒球科技場域/, `${target}: missing baseball sport budget clue`);
  assert.match(html, /科技防溺/, `${target}: missing swimming safety technology clue`);
  assert.match(html, /全民運動/, `${target}: missing public sport budget row`);
  assert.match(html, /class="source-row"/, `${target}: sources should render as compact source rows`);
  assert.match(html, /heading-icon/, `${target}: section heading icons missing`);
  assert.match(html, /viewBox="0 0 24 24"/, `${target}: Lucide-style SVG icons missing`);
  assert.match(html, /metric-check-flow/, `${target}: metric drawer flow styles/markup missing`);
  assert.match(html, /"flowRoles":\["行政院\/科技會報"/, `${target}: metric drawer flow role data missing`);
  assert.match(html, /"flowIcons":\["badge-check","calendar-days","file-search","circle-check"\]/, `${target}: metric drawer Lucide icon data missing`);
  assert.match(html, /lucideIcon\(metric\.flowIcons\[index\]\)/, `${target}: metric drawer Lucide icon template missing`);
  assert.match(html, /metric\.flowRoles\[index\]/, `${target}: metric drawer flow role template missing`);
  assert.match(html, /GRB 是政府研究計畫查詢系統/, `${target}: glossary note missing`);
  assert.match(html, /metric-info-block/, `${target}: metric drawer info hierarchy missing`);
  assert.match(html, /metric-source-section metric-info-block compact/, `${target}: compact metric source block missing`);
  assert.match(html, /metric-source-section/, `${target}: metric drawer source links missing`);
  assert.match(html, /wireStaticInteractions/, `${target}: missing static interaction bootstrap`);
  assert.match(html, /static-drawer-layer/, `${target}: missing static drawer behavior`);
  assert.match(html, /document\.querySelectorAll\("\[data-filter-layer\]"\)/, `${target}: layer tag filters missing`);
  assert.match(html, /document\.querySelectorAll\("\[data-filter-location\]"\)/, `${target}: location tag filters missing`);

  assert.doesNotMatch(html, /<script id="_R_">/, `${target}: static output should not hydrate React`);
  assert.doesNotMatch(html, /<details class="select-menu"/, `${target}: dropdown filters should not render`);
  assert.doesNotMatch(html, /type="checkbox"/, `${target}: filter checkboxes should not render`);
  assert.doesNotMatch(html, /import\("assets\//, `${target}: dynamic imports must not use bare asset specifiers`);
  assert.doesNotMatch(html, /href="\/assets\//, `${target}: absolute asset href found`);
  assert.doesNotMatch(html, /src="\/assets\//, `${target}: absolute asset src found`);
}

console.log(`Verified static outputs: ${targets.length} files`);
