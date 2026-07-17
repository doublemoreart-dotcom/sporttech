import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const repoRoot = process.cwd();
const publicDir = path.join(repoRoot, "public");
const faviconSvg = path.join(publicDir, "favicon.svg");
const faviconIco = path.join(publicDir, "favicon.ico");
const heroImage = path.join(publicDir, "sporttech-budget-hero.jpg");
const ogImage = path.join(publicDir, "og-image.png");

function icoFromPngs(images) {
  const headerSize = 6;
  const directorySize = 16 * images.length;
  let offset = headerSize + directorySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
}

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const title = "運動X科技預算小幫手";
const subtitle = "2022-2026 台灣運動科技預算線索、執行程度與資料來源";
const tags = ["政策總額 46 億元", "地方案例 14 縣市 / 30 案", "公開資料查核"];

const overlay = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FBF8EF" stop-opacity="0.98"/>
      <stop offset="0.58" stop-color="#FBF8EF" stop-opacity="0.9"/>
      <stop offset="1" stop-color="#FBF8EF" stop-opacity="0.64"/>
    </linearGradient>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M42 0H0V42" fill="none" stroke="#D8D0C0" stroke-width="1" opacity="0.42"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect x="56" y="54" width="1088" height="522" rx="18" fill="#FBF8EF" opacity="0.9" stroke="#15191B" stroke-width="4"/>
  <circle cx="104" cy="106" r="15" fill="#2E7068"/>
  <circle cx="146" cy="106" r="15" fill="#A16C19"/>
  <circle cx="188" cy="106" r="15" fill="#A8453B"/>
  <text x="92" y="182" fill="#68777A" font-size="30" font-weight="800" font-family="Nunito, Arial, sans-serif" letter-spacing="3">SPORTTECH BUDGET</text>
  <text x="92" y="292" fill="#15191B" font-size="78" font-weight="900" font-family="PingFang TC, Noto Sans TC, Arial, sans-serif">${escapeXml(title)}</text>
  <text x="92" y="360" fill="#2F3D40" font-size="34" font-weight="700" font-family="PingFang TC, Noto Sans TC, Arial, sans-serif">${escapeXml(subtitle)}</text>
  <g transform="translate(92 424)">
    ${tags
      .map((tag, index) => {
        const widths = [222, 310, 212];
        const x = widths.slice(0, index).reduce((sum, width) => sum + width + 20, 0);
        return `
          <g transform="translate(${x} 0)">
            <rect width="${widths[index]}" height="62" rx="31" fill="#EEE4D3" stroke="#D8D0C0" stroke-width="2"/>
            <text x="28" y="40" fill="#15191B" font-size="24" font-weight="800" font-family="PingFang TC, Noto Sans TC, Arial, sans-serif">${escapeXml(tag)}</text>
          </g>
        `;
      })
      .join("")}
  </g>
  <path d="M92 526H1108" stroke="#15191B" stroke-width="4"/>
  <text x="92" y="558" fill="#68777A" font-size="22" font-weight="800" font-family="Nunito, Arial, sans-serif">dinopeng.com/sporttech/</text>
</svg>`;

await mkdir(publicDir, { recursive: true });

const faviconSource = await readFile(faviconSvg);
const faviconPngs = await Promise.all(
  [32, 64].map(async (size) => ({
    size,
    png: await sharp(faviconSource).resize(size, size).png().toBuffer(),
  })),
);
await writeFile(faviconIco, icoFromPngs(faviconPngs));

await sharp(heroImage)
  .resize(1200, 630, { fit: "cover", position: "center" })
  .composite([{ input: Buffer.from(overlay), blend: "over" }])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(ogImage);

console.log(`Generated ${faviconIco}`);
console.log(`Generated ${ogImage}`);
