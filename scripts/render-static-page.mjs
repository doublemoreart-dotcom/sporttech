import { cp, mkdir, copyFile, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const outputsRoot = resolve(repoRoot, "../../outputs");
const assetsRoot = resolve(outputsRoot, "assets");
const clientAssetsRoot = resolve(repoRoot, "dist/client/assets");
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
  .replaceAll("/assets/", "assets/")
  .replaceAll('import("assets/', 'import("./assets/')
  .replaceAll('="/assets/', '="assets/')
  .replaceAll('("/assets/', '("assets/')
  .replaceAll("(/assets/", "(assets/")
  .replaceAll('="/favicon.svg"', '="assets/favicon.svg"')
  .replaceAll('="/sporttech-budget-hero.jpg"', '="assets/sporttech-budget-hero.jpg"')
  .replaceAll('="/sporttech-budget-hero-small.jpg"', '="assets/sporttech-budget-hero-small.jpg"');

html = html.replace(/<script id="_R_">[\s\S]*?<\/script>/, "");

const staticFallbackScript = `<script>
(() => {
  const flowData = ${JSON.stringify({
    stages: {
      proposal: "提案/爭取",
      approved: "已核定",
      executing: "執行中",
      verified: "已有成果",
      unknown: "待公開對帳",
    },
    layers: {
      central: "中央預算",
      research: "科研/學研",
      local: "地方場域",
      industry: "產業新創",
      association: "協會應用端",
    },
    sources: {
      ey: { label: "行政院全球資訊網", url: "https://www.ey.gov.tw/", note: "政策新聞、院會與跨部會計畫線索。" },
      nstc: { label: "國科會全球資訊網", url: "https://www.nstc.gov.tw/", note: "科技計畫、研究補助、新聞資料與查詢入口。" },
      gstp: { label: "政府科技計畫資訊網", url: "https://gstp.stpi.narl.org.tw/", note: "跨部會科技計畫與年度科技預算查詢入口。" },
      grb: { label: "政府研究資訊系統 GRB", url: "https://www.grb.gov.tw/", note: "研究計畫名稱、主持人、關鍵字與成果摘要查詢。" },
      sports: { label: "運動部全民運動署", url: "https://www.sa.gov.tw/", note: "運動科技、場域、補助與政策公告入口。" },
      dgbas: { label: "行政院主計總處", url: "https://www.dgbas.gov.tw/", note: "中央政府預算、決算與補捐助資訊入口。" },
      pcc: { label: "公共工程委員會", url: "https://www.pcc.gov.tw/", note: "政府採購、決標與委辦案追蹤入口。" },
      data: { label: "政府資料開放平臺", url: "https://data.gov.tw/", note: "open data 資料集與 API 查詢入口。" },
    },
    metrics: [
      {
        label: "政策總額",
        value: "46 億元",
        detailTitle: "政策總額怎麼讀",
        detail: "46 億元比較像一個政策總盤，不是一張已經花出去的帳單。閱讀時先問：這筆錢原本由誰核定？分到哪些部會？後來是否變成年度預算、地方補助或採購案？",
        flow: ["政策核定", "年度預算", "分案/採購", "驗收/成果"],
        flowRoles: ["行政院/科技會報", "主計總處與各部會", "地方政府或委辦廠商", "場域、使用者與成果報告"],
        flowIcons: ["badge-check", "calendar-days", "file-search", "circle-check"],
        checks: ["先確認行政院或科技會報核定的是政策總額、計畫期程與主責部會。註：政策總額是方向與額度，不等於已花完。", "再拆年度中央政府總預算、科技預算與運動部/國科會科目。註：年度預算才比較接近每年可執行的錢。", "最後比對地方核定、採購決標、驗收紀錄與成果報告。註：驗收或成果報告才代表案件比較接近落地。"],
        sourceRefs: ["ey", "gstp", "dgbas", "data"],
      },
      {
        label: "科研線索",
        value: "2.4 億元級",
        detailTitle: "科研線索怎麼追",
        detail: "科研預算通常先支持研究團隊，不會立刻變成民眾看到的場館系統。它可能先變成 AI 模型、感測器、分析工具，之後才進入國家隊訓練或地方場域。",
        flow: ["研究計畫", "學研團隊", "模型/設備", "國訓/場域"],
        flowRoles: ["國科會/GRB", "大學與研究中心", "AI、感測與分析工具", "國訓中心、協會或地方場館"],
        flowIcons: ["search", "school", "cpu", "dumbbell"],
        checks: ["用 GRB 查計畫名稱、主持人、補助機關、執行期間與成果摘要。註：GRB 是政府研究計畫查詢系統。", "比對國科會新聞、補助公告與學校研究成果，確認是不是同一條計畫線。", "確認成果是否進入國訓中心、單項協會、地方場域或商品化應用。註：有研究成果不代表已經普及使用。"],
        sourceRefs: ["nstc", "grb", "gstp", "sports"],
      },
      {
        label: "地方案例",
        value: "14 縣市 / 30 案",
        detailTitle: "地方案例怎麼對帳",
        detail: "地方場域通常不是中央全額付款，而是中央補助、地方配合款和委外廠商一起完成。看到「14 縣市 / 30 案」時，要繼續追每一案是否已決標、驗收、維運和被民眾使用。",
        flow: ["中央核定", "地方配合款", "採購/委辦", "維運使用"],
        flowRoles: ["運動部/全民運動署", "縣市政府與議會", "得標廠商或受託單位", "場館營運者與民眾"],
        flowIcons: ["landmark", "building-2", "wrench", "users"],
        checks: ["先查地方府會預算書、議會質詢與中央補助核定，分開看中央款與地方款。註：配合款是地方自己也要出的錢。", "再查政府採購決標公告、契約廠商與驗收資訊，確認金額是否已形成契約。註：決標代表找到承作廠商。", "最後看系統上線、維運年度、使用人次與開放資料，避免只停在示範案數。"],
        sourceRefs: ["sports", "pcc", "dgbas", "data"],
      },
      {
        label: "協會角色",
        value: "5 項運動",
        note: "目前可辨識棒球、羽球、桌球、舉重、自由車等應用端線索。",
        detailTitle: "協會角色怎麼判斷",
        detail: "協會常出現在運動科技新聞裡，但不一定就是拿錢的單位。它可能只是提供選手、賽事、場地或專業意見。要判斷是否真的承接預算，要看補助名單、委辦契約、採購得標與成果報告。",
        flow: ["補助名單", "委辦契約", "合作露出", "實際承接"],
        flowRoles: ["運動部/補助公告", "採購或委辦契約", "協會、教練與選手", "受補助者或得標單位"],
        flowIcons: ["file-text", "handshake", "megaphone", "badge-check"],
        checks: ["查協會是否列為受補助者、委辦承攬者或採購得標單位。註：出現在新聞裡，不等於直接拿預算。", "區分合作露出、提供選手資料、提供賽事場域與實際經費承接。註：應用端是使用或協助測試的一方。", "比對成果報告、賽事資料與場域紀錄，確認科技導入後誰負責維運。"],
        sourceRefs: ["sports", "pcc", "grb", "data"],
      },
    ],
    flows: [
      {
        id: "taiwan-sporttech",
        year: "2022-2026",
        title: "台灣運動 x 科技行動計畫",
        amount: "46 億元",
        source: "行政院跨部會科技預算",
        stage: "executing",
        layer: "central",
        actors: ["運動部/前體育署", "國科會", "經濟部", "地方政府", "學研單位"],
        associations: ["棒球", "羽球", "桌球", "自由車", "游泳", "田徑"],
        locations: ["全國/跨縣市", "待逐案整理"],
        publicness: "政策總額明確，逐年逐案流向仍需對帳。",
        note: "政策總額，分散於跨部會與跨年度項目，不宜直接視為運動部單一預算。",
        publicInfo: {
          news: ["新聞與政策報導多以 2022-2026、46 億元跨部會投入為主，較少逐案列明年度支出。"],
          announcements: ["中央層級以行政院、科技會報、國科會與運動部政策說明為主要線索。"],
          openData: ["尚未見單一公開資料集可逐年對帳 46 億元流向；需拆到部會、年度與地方分案。"],
        },
      },
      {
        id: "precision-sport-science",
        year: "2017-2024",
        title: "精準運動科學研究專案",
        amount: "2.4 億元級",
        source: "科技部/國科會科研預算",
        stage: "verified",
        layer: "research",
        actors: ["大學研究團隊", "國家隊支援系統", "國家運動科學中心"],
        associations: ["羽球", "桌球", "棒球", "舉重", "自由車"],
        locations: ["全國/跨縣市"],
        publicness: "歷史專案與成果可辨識，但分年支出仍需細表。",
        note: "重點在 AI 訓練、動作分析、疲勞監控、傷害預防與競技表現。",
        publicInfo: {
          news: ["公開討論包含精準運動科學研究、國科會補助與國家隊科技支援成果。"],
          announcements: ["中央線索在科技部/國科會研究計畫、學校研究公告與國家運動科學中心成果。"],
          openData: ["可查研究計畫名稱、主持人、補助金額與成果摘要，但完整運動別分年支出仍需逐案整理。"],
        },
      },
      {
        id: "field-proof",
        year: "2022-2025",
        title: "地方運動科技場域實證",
        amount: "分案補助",
        source: "運動部公務預算 + 地方配合款",
        stage: "executing",
        layer: "local",
        actors: ["14 縣市", "場館營運者", "科技廠商", "地方體育局"],
        associations: ["游泳", "田徑", "棒球", "全民運動"],
        locations: ["台北市", "新北市", "桃園市", "嘉義市", "高雄市", "待逐案整理"],
        publicness: "案件數可辨識，逐案決標、驗收、維運需另查。",
        note: "公開資料顯示累計約 30 案；各案核定、決標、驗收、維運狀態不一致。",
        publicInfo: {
          news: ["地方案例常以智慧走跑、科技防溺、智慧場館或運動科技體驗活動形式出現在地方新聞。"],
          announcements: ["地方政府體育局、教育局公告、議會預算與政府採購決標是主要追蹤路徑。"],
          openData: ["已知有縣市與案件數線索，但每案核定、決標、驗收、維運、使用人次尚未形成統一 open data。"],
        },
      },
      {
        id: "sports-fund",
        year: "年度型",
        title: "運動發展基金創新研發與數位轉型",
        amount: "約 3,000 萬元年度科目案例",
        source: "運動發展基金",
        stage: "executing",
        layer: "industry",
        actors: ["運動產業", "新創團隊", "法人", "地方政府"],
        associations: ["依合作案而定"],
        locations: ["全國/跨縣市", "待逐案整理"],
        publicness: "年度科目可辨識，受補助名單與成果需逐案整理。",
        note: "偏向產品、服務、數位轉型、產學合作和商業模式驗證。",
        publicInfo: {
          news: ["較常出現在運動產業創新、數位轉型、新創補助與產學合作報導。"],
          announcements: ["線索集中在運動發展基金年度預算、補助要點、受補助名單或成果發表。"],
          openData: ["年度科目可辨識，但受補助團隊、補助額、成果與後續營收需逐案公開對帳。"],
        },
      },
      {
        id: "application-budget",
        year: "年度型",
        title: "運動科技應用發展",
        amount: "約 3,567 萬元年度科目案例",
        source: "體育署/運動部年度公務預算",
        stage: "verified",
        layer: "central",
        actors: ["地方政府", "學校", "委辦團隊", "場域夥伴"],
        associations: ["依場域而定"],
        locations: ["全國/跨縣市", "待逐案整理"],
        publicness: "科目案例清楚，但非所有運動科技經費總額。",
        note: "用於地方科技場域、跨域人才與應用推廣；只是特定年度可辨識科目。",
        publicInfo: {
          news: ["多以運動科技應用、地方場域、人才培育、體驗競賽等活動型新聞出現。"],
          announcements: ["主要查運動部/前體育署年度預算、單位預算與相關委辦、補助公告。"],
          openData: ["科目案例可辨識，但不是完整運動科技總額；需和資訊服務費、場館設備、委辦費分開查。"],
        },
      },
      {
        id: "baseball-made",
        year: "2025-2026",
        title: "國球國造：棒球運動科技場域淬鍊",
        amount: "待核定公開",
        source: "爭取 115 年度國科會科技預算",
        stage: "proposal",
        layer: "research",
        actors: ["國科會", "運動部", "天母棒球場經驗模型", "縣市場館"],
        associations: ["棒球"],
        locations: ["台北市", "待擴散縣市"],
        publicness: "目前宜列提案/爭取，不宜寫成已全面執行。",
        note: "目前較適合列為提案/預算爭取，不宜描述為已全面執行。",
        publicInfo: {
          news: ["目前公開資訊多指向天母棒球場經驗、棒球科技場域與國產技術驗證構想。"],
          announcements: ["應追蹤 115 年度國科會科技預算、運動部提案與後續採購或補助公告。"],
          openData: ["尚屬提案/爭取與模型規劃階段；未見完整核定金額、得標廠商與擴散縣市清單。"],
        },
      },
      {
        id: "aspn",
        year: "2025-2026",
        title: "ASPN 國際運動科技創新加速器",
        amount: "委辦與補助細目待公開",
        source: "運動部產業與科技相關預算",
        stage: "executing",
        layer: "industry",
        actors: ["陽明交通大學 IAPS", "新創團隊", "國際市場夥伴"],
        associations: ["依場域測試而定"],
        locations: ["全國/跨縣市", "待逐案整理"],
        publicness: "活動與成果可見，完整成本拆分仍待公開。",
        note: "可見活動與成果，但完整委辦金額、新創補助與行政成本仍需對帳。",
        publicInfo: {
          news: ["公開資訊以 ASPN 國際運動科技創新加速器徵案、入選團隊、國際展會與 Demo Day 為主。"],
          announcements: ["可追陽明交通大學 IAPS、運動部產業科技計畫、委辦或徵案公告。"],
          openData: ["活動成果可見，但委辦金額、新創補助、展會費用與場域驗證成本仍需拆帳。"],
        },
      },
      {
        id: "association-use",
        year: "持續",
        title: "協會端科技導入與國家隊應用",
        amount: "多非直接預算主體",
        source: "大學/研究中心/國科會/運動部計畫轉介",
        stage: "unknown",
        layer: "association",
        actors: ["單項協會", "教練", "選手", "研究團隊"],
        associations: ["棒球", "羽球", "桌球", "舉重", "自由車"],
        locations: ["全國/跨縣市", "待逐案整理"],
        publicness: "需逐案釐清協會是受補助者、合作方或應用場域。",
        note: "協會多為合作場域、選手資料與應用端，不一定是科技預算直接受補助者。",
        publicInfo: {
          news: ["協會端多出現在特定運動科技導入、國家隊訓練、選手數據分析或賽事情蒐報導。"],
          announcements: ["需比對單項協會、國訓中心、國家運動科學中心與研究團隊合作公告。"],
          openData: ["目前應標為應用端線索；需逐案確認協會是受補助者、合作方、資料提供者或場域使用者。"],
        },
      },
    ],
  })};

  const selected = {
    layers: new Set(),
    stages: new Set(),
    locations: new Set(),
  };

  const labels = {
    layer: flowData.layers,
    stage: flowData.stages,
  };

  const allLanes = () => Array.from(document.querySelectorAll(".lane[data-flow-id]"));
  const activeClass = (node, isActive) => node?.classList.toggle("active", isActive);
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
  const list = (items) => items.map((item) => \`<li>\${escapeHtml(item)}</li>\`).join("");
  const pills = (items) => items.map((item) => \`<li>\${escapeHtml(item)}</li>\`).join("");
  const sourceLinks = (keys) => keys.map((key) => {
    const source = flowData.sources[key];
    if (!source) return "";
    return \`<li><a href="\${escapeHtml(source.url)}" rel="noreferrer" target="_blank">\${escapeHtml(source.label)}</a><span>\${escapeHtml(source.note)}</span></li>\`;
  }).join("");

  function updateFilterUi() {
    document.querySelectorAll("[data-filter-layer]").forEach((button) => {
      const layer = button.dataset.filterLayer;
      const isActive = layer === "all" ? selected.layers.size === 0 : selected.layers.has(layer);
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    document.querySelectorAll("[data-filter-location]").forEach((button) => {
      const location = button.dataset.filterLocation;
      const isActive = location === "all" ? selected.locations.size === 0 : selected.locations.has(location);
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    document.querySelectorAll("[data-stage-filter]").forEach((button) => {
      const stage = button.dataset.stageFilter;
      const isActive = stage === "all" ? selected.stages.size === 0 : selected.stages.has(stage);
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function matches(flow) {
    const layerMatch = selected.layers.size === 0 || selected.layers.has(flow.layer);
    const stageMatch = selected.stages.size === 0 || selected.stages.has(flow.stage);
    const locationMatch = selected.locations.size === 0 || flow.locations.some((location) => selected.locations.has(location));
    return layerMatch && stageMatch && locationMatch;
  }

  function updateResults() {
    const visibleIds = new Set(flowData.flows.filter(matches).map((flow) => flow.id));
    allLanes().forEach((lane) => {
      lane.hidden = !visibleIds.has(lane.dataset.flowId);
    });
    const count = visibleIds.size;
    const status = document.querySelector(".panel-status strong");
    if (status) status.textContent = \`\${count} / \${flowData.flows.length} 項\`;
    const result = document.querySelector(".results-toolbar strong");
    if (result) result.textContent = count === 0 ? "沒有符合項目" : \`顯示 \${count} 筆公開線索\`;
    updateFilterUi();
  }

  function closeDrawers() {
    document.querySelectorAll(".static-drawer-layer").forEach((node) => node.remove());
  }

  function lucideIcon(name) {
    const icons = {
      "badge-check": '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.77 4 4 0 0 1 0 6.76 4 4 0 0 1-4.78 4.77 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m9 12 2 2 4-4"></path>',
      "building-2": '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path>',
      "calendar-days": '<path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path>',
      "circle-check": '<circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path>',
      cpu: '<rect width="14" height="14" x="5" y="5" rx="2"></rect><path d="M9 9h6v6H9z"></path><path d="M9 1v4"></path><path d="M15 1v4"></path><path d="M9 19v4"></path><path d="M15 19v4"></path><path d="M1 9h4"></path><path d="M1 15h4"></path><path d="M19 9h4"></path><path d="M19 15h4"></path>',
      database: '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"></path>',
      dumbbell: '<path d="m6.5 6.5 11 11"></path><path d="m21 21-1-1"></path><path d="m3 3 1 1"></path><path d="m18 22 4-4"></path><path d="m2 6 4-4"></path><path d="m3 10 7-7"></path><path d="m14 21 7-7"></path>',
      "file-search": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6"></path><circle cx="11.5" cy="14.5" r="2.5"></circle><path d="m13.3 16.3 1.7 1.7"></path>',
      "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path>',
      handshake: '<path d="m11 17 2 2a2.8 2.8 0 0 0 4 0l4-4"></path><path d="m14 14 2.5 2.5a2.8 2.8 0 0 0 4 0"></path><path d="M3 7h3l4 4"></path><path d="M21 7h-3l-4 4"></path><path d="m7 15 4-4"></path><path d="m2 8 5 5"></path><path d="m22 8-5 5"></path>',
      landmark: '<path d="M3 22h18"></path><path d="M6 18v-7"></path><path d="M10 18v-7"></path><path d="M14 18v-7"></path><path d="M18 18v-7"></path><path d="m12 2 9 5H3Z"></path>',
      megaphone: '<path d="m3 11 18-5v12L3 14v-3Z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>',
      school: '<path d="m4 6 8-4 8 4"></path><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"></path><path d="M6 10v12"></path><path d="M18 10v12"></path><path d="M10 22v-6h4v6"></path>',
      search: '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>',
      users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
      wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.8 7.8L6 21l-3-3 7-7a6 6 0 0 1 7.8-7.8Z"></path>',
    };
    return '<svg aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">' + (icons[name] || icons["circle-check"]) + '</svg>';
  }

  function budgetRoute() {
    const steps = [
      { icon: "landmark", label: "中央/基金", role: "政策、基金或年度科目" },
      { icon: "building-2", label: "執行單位", role: "部會、學研、地方或法人" },
      { icon: "handshake", label: "場域/協會", role: "場館、協會或合作夥伴" },
      { icon: "users", label: "選手/民眾", role: "訓練、使用與成果回饋" },
    ];
    return steps.map((step) => '<span><b aria-hidden="true">' + lucideIcon(step.icon) + '</b><strong>' + escapeHtml(step.label) + '</strong><small>' + escapeHtml(step.role) + '</small></span>').join("");
  }

  function openFlowDrawer(flow) {
    closeDrawers();
    const drawer = document.createElement("div");
    drawer.className = "drawer-layer static-drawer-layer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.innerHTML = \`
      <button class="drawer-backdrop" aria-label="關閉查詢結果"></button>
      <article class="drawer-panel">
        <div class="drawer-handle" aria-hidden="true"></div>
        <div class="drawer-topline">
          <div class="detail-header"><span>\${escapeHtml(flowData.layers[flow.layer])}</span><span>\${escapeHtml(flowData.stages[flow.stage])}</span></div>
          <button class="close-button" type="button">關閉</button>
        </div>
        <div class="drawer-scroll">
          <h2>\${escapeHtml(flow.title)}</h2>
          <dl class="facts compact-facts">
            <div><dt>期間</dt><dd>\${escapeHtml(flow.year)}</dd></div>
            <div><dt>金額</dt><dd>\${escapeHtml(flow.amount)}</dd></div>
            <div><dt>來源</dt><dd>\${escapeHtml(flow.source)}</dd></div>
          </dl>
          <div class="audit-summary compact-summary"><h3>查核摘要</h3><p>\${escapeHtml(flow.publicness)}</p></div>
          <div class="drawer-detail-grid">
            <div class="flow-diagram" aria-label="預算路徑">\${budgetRoute()}</div>
            <div class="detail-groups">
              <section><h3>主要執行或合作單位</h3><ul class="inline-list">\${pills(flow.actors)}</ul></section>
              <section><h3>對應協會或運動種類</h3><ul class="inline-list">\${pills(flow.associations)}</ul></section>
              <section><h3>對應縣市</h3><ul class="inline-list">\${pills(flow.locations)}</ul></section>
            </div>
            <section class="public-info"><h3>公開資訊進度</h3><div class="public-info-grid">
              <section><h4>新聞/報導線索</h4><ul>\${list(flow.publicInfo.news)}</ul></section>
              <section><h4>中央或地方府會公告</h4><ul>\${list(flow.publicInfo.announcements)}</ul></section>
              <section><h4>open data / 對帳進度</h4><ul>\${list(flow.publicInfo.openData)}</ul></section>
            </div></section>
            <div class="audit-summary secondary-summary"><h3>補充判斷</h3><p>\${escapeHtml(flow.note)}</p><dl><div><dt>下一步問法</dt><dd>這筆錢是政策總額、年度科目、委辦案、地方配合款，還是協會直接補助？</dd></div></dl></div>
          </div>
        </div>
      </article>\`;
    drawer.querySelector(".drawer-backdrop").addEventListener("click", closeDrawers);
    drawer.querySelector(".close-button").addEventListener("click", closeDrawers);
    document.body.append(drawer);
    drawer.querySelector(".close-button")?.focus();
  }

  function openMetricDrawer(metric) {
    closeDrawers();
    const drawer = document.createElement("div");
    drawer.className = "drawer-layer metric-drawer-layer static-drawer-layer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.innerHTML = \`
      <button class="drawer-backdrop metric-drawer-backdrop" aria-label="關閉總覽說明"></button>
      <aside class="drawer-panel metric-drawer-panel">
        <div class="drawer-handle" aria-hidden="true"></div>
        <div class="drawer-topline">
          <div class="detail-header"><span>總覽指標</span><span>\${escapeHtml(metric.label)}</span></div>
          <button class="close-button" type="button">關閉</button>
        </div>
        <div class="drawer-scroll metric-drawer-scroll">
          <span class="metric-drawer-label">\${escapeHtml(metric.value)}</span>
          <h2>\${escapeHtml(metric.detailTitle)}</h2>
          <p>\${escapeHtml(metric.detail)}</p>
          <div class="metric-check-flow" aria-label="\${escapeHtml(metric.label)}查核流程">\${metric.flow.map((step, index) => \`<span><b aria-hidden="true">\${lucideIcon(metric.flowIcons[index])}</b><strong>\${escapeHtml(step)}</strong><small>\${escapeHtml(metric.flowRoles[index])}</small></span>\`).join("")}</div>
          <section class="metric-info-block"><h3>查核重點</h3><ul>\${list(metric.checks)}</ul></section>
          <section class="metric-source-section metric-info-block compact"><h3>相關連結</h3><ul>\${sourceLinks(metric.sourceRefs)}</ul></section>
        </div>
      </aside>\`;
    drawer.querySelector(".metric-drawer-backdrop").addEventListener("click", closeDrawers);
    drawer.querySelector(".close-button").addEventListener("click", closeDrawers);
    document.body.append(drawer);
    drawer.querySelector(".close-button")?.focus();
  }

  let fallbackWired = false;

  function wireStaticInteractions() {
    if (fallbackWired || window.__sporttechHydrated) return;
    fallbackWired = true;
    document.querySelector(".preloader button")?.addEventListener("click", () => {
      document.querySelector(".preloader")?.remove();
      document.querySelector(".site-shell")?.classList.remove("loading-shell");
    });
    document.querySelectorAll(".metric").forEach((button, index) => {
      button.addEventListener("click", () => openMetricDrawer(flowData.metrics[index]));
    });
    document.querySelectorAll("[data-stage-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const stage = button.dataset.stageFilter;
        if (stage === "all") selected.stages.clear();
        else if (selected.stages.has(stage)) selected.stages.delete(stage);
        else selected.stages.add(stage);
        closeDrawers();
        updateResults();
      });
    });
    document.querySelectorAll("[data-filter-layer]").forEach((button) => {
      button.addEventListener("click", () => {
        const layer = button.dataset.filterLayer;
        if (layer === "all") selected.layers.clear();
        else if (selected.layers.has(layer)) selected.layers.delete(layer);
        else selected.layers.add(layer);
        closeDrawers();
        updateResults();
      });
    });
    document.querySelectorAll("[data-filter-location]").forEach((button) => {
      button.addEventListener("click", () => {
        const location = button.dataset.filterLocation;
        if (location === "all") selected.locations.clear();
        else if (selected.locations.has(location)) selected.locations.delete(location);
        else selected.locations.add(location);
        closeDrawers();
        updateResults();
      });
    });
    document.querySelectorAll(".view-toggle button").forEach((button) => {
      button.addEventListener("click", () => {
        const isCard = button.textContent?.trim() === "卡片";
        document.querySelector(".lane-map")?.classList.toggle("card-view", isCard);
        document.querySelector(".lane-map")?.classList.toggle("list-view", !isCard);
        document.querySelectorAll(".view-toggle button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      });
    });
    allLanes().forEach((lane) => {
      lane.addEventListener("click", () => {
        const flow = flowData.flows.find((item) => item.id === lane.dataset.flowId);
        if (!flow) return;
        allLanes().forEach((item) => item.classList.toggle("active", item === lane));
        openFlowDrawer(flow);
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDrawers();
    });
    updateResults();
  }

  function startStaticFallbackIfNeeded() {
    if (window.__sporttechHydrated) return;
    document.querySelector(".preloader")?.remove();
    document.querySelector(".site-shell")?.classList.remove("loading-shell");
    wireStaticInteractions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(startStaticFallbackIfNeeded, 1700);
    });
  } else {
    setTimeout(startStaticFallbackIfNeeded, 1700);
  }
})();
</script>`;

html = html.replace("</body>", `${staticFallbackScript}</body>`);

await rm(assetsRoot, { recursive: true, force: true });
await mkdir(assetsRoot, { recursive: true });
await cp(clientAssetsRoot, assetsRoot, { recursive: true });
await Promise.all([
  copyFile(resolve(repoRoot, "public/favicon.svg"), resolve(assetsRoot, "favicon.svg")),
  copyFile(resolve(repoRoot, "public/sporttech-budget-hero.jpg"), resolve(assetsRoot, "sporttech-budget-hero.jpg")),
  copyFile(resolve(repoRoot, "public/sporttech-budget-hero-small.jpg"), resolve(assetsRoot, "sporttech-budget-hero-small.jpg")),
]);

const assetFiles = await readdir(assetsRoot, { recursive: true, withFileTypes: true });
await Promise.all(
  assetFiles
    .filter((entry) => entry.isFile() && /\.(css|js)$/i.test(entry.name))
    .map(async (entry) => {
      const path = resolve(entry.parentPath, entry.name);
      const text = await readFile(path, "utf8");
      await writeFile(path, text.replaceAll("/assets/", "assets/"), "utf8");
    }),
);
await writeFile(resolve(outputsRoot, "index.html"), html, "utf8");

console.log(`Rendered static HTML: ${resolve(outputsRoot, "index.html")}`);
