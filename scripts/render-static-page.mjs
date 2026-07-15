import { mkdir, copyFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const outputsRoot = resolve(repoRoot, "../../outputs");
const assetsRoot = resolve(outputsRoot, "assets");
const workerUrl = pathToFileURL(resolve(repoRoot, "dist/server/index.js"));

workerUrl.searchParams.set("render", `${process.pid}-${Date.now()}`);

const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
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

if (!response.ok) {
  throw new Error(`Static render failed with status ${response.status}`);
}

let html = await response.text();
html = html
  .replaceAll('="/favicon.svg"', '="assets/favicon.svg"')
  .replaceAll('="/sporttech-budget-hero.jpg"', '="assets/sporttech-budget-hero.jpg"')
  .replaceAll('="/sporttech-budget-hero-small.jpg"', '="assets/sporttech-budget-hero-small.jpg"');

await mkdir(assetsRoot, { recursive: true });
await Promise.all([
  writeFile(resolve(outputsRoot, "index.html"), html, "utf8"),
  copyFile(resolve(repoRoot, "public/favicon.svg"), resolve(assetsRoot, "favicon.svg")),
  copyFile(resolve(repoRoot, "public/sporttech-budget-hero.jpg"), resolve(assetsRoot, "sporttech-budget-hero.jpg")),
  copyFile(resolve(repoRoot, "public/sporttech-budget-hero.png"), resolve(assetsRoot, "sporttech-budget-hero.png")),
  copyFile(
    resolve(repoRoot, "public/sporttech-budget-hero-small.jpg"),
    resolve(assetsRoot, "sporttech-budget-hero-small.jpg"),
  ),
]);

console.log(`Rendered static HTML: ${resolve(outputsRoot, "index.html")}`);
