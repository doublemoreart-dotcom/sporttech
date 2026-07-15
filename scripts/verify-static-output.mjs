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
  assert.match(html, /src="assets\/sporttech-budget-hero\.jpg"/, `${target}: missing hero image`);
  assert.match(html, /srcSet="assets\/sporttech-budget-hero-small\.jpg"/, `${target}: missing responsive hero source`);
  assert.match(html, /data-filter-layer="central"/, `${target}: missing layer filter markers`);
  assert.match(html, /data-filter-location="台北市"/, `${target}: missing location filter markers`);
  assert.match(html, /data-stage-filter="verified"/, `${target}: missing stage filter markers`);
  assert.match(html, /data-flow-id="application-budget"/, `${target}: missing flow markers`);
  assert.match(html, /wireStaticInteractions/, `${target}: missing static interaction bootstrap`);
  assert.match(html, /static-drawer-layer/, `${target}: missing static drawer behavior`);
  assert.match(html, /menu\.open = false/, `${target}: dropdown selections should collapse menus`);

  assert.doesNotMatch(html, /<script id="_R_">/, `${target}: static output should not hydrate React`);
  assert.doesNotMatch(html, /import\("assets\//, `${target}: dynamic imports must not use bare asset specifiers`);
  assert.doesNotMatch(html, /href="\/assets\//, `${target}: absolute asset href found`);
  assert.doesNotMatch(html, /src="\/assets\//, `${target}: absolute asset src found`);
}

console.log(`Verified static outputs: ${targets.length} files`);
