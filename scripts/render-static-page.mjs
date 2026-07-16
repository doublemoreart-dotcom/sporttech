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
        detail: "46 億元是 2022-2026 運動X科技跨部會政策總盤，重點是辨識它分散在哪些部會、年度科目與地方分案，而不是把它當成單一機關的一筆支出。",
        flow: ["政策核定", "年度預算", "分案/採購", "驗收/成果"],
        checks: ["先確認行政院或科技會報核定的是政策總額、計畫期程與主責部會。", "再拆年度中央政府總預算、科技預算與運動部/國科會科目，避免重複計算。", "最後比對地方核定、採購決標、驗收紀錄與成果報告，確認是否真的落地。"],
        sourceRefs: ["ey", "gstp", "dgbas", "data"],
      },
      {
        label: "科研線索",
        value: "2.4 億元級",
        detailTitle: "科研線索怎麼追",
        detail: "科研預算常出現在國科會、GRB、學研計畫與國家隊支援成果中。它通常不會直接長成民眾看到的場館系統，而是先成為模型、感測、分析工具或訓練支援。",
        flow: ["研究計畫", "學研團隊", "模型/設備", "國訓/場域"],
        checks: ["用 GRB 查計畫名稱、主持人、補助機關、執行期間與成果摘要。", "比對國科會新聞、補助公告與學校研究成果，確認是否屬同一條計畫線。", "確認成果是否進入國訓中心、單項協會、地方場域或商品化應用。"],
        sourceRefs: ["nstc", "grb", "gstp", "sports"],
      },
      {
        label: "地方案例",
        value: "14 縣市 / 30 案",
        detailTitle: "地方案例怎麼對帳",
        detail: "地方場域通常是中央補助、地方配合款與委外廠商共同形成。看到案數時，要繼續追核定金額、決標金額、驗收狀態、維運費與實際使用量。",
        flow: ["中央核定", "地方配合款", "採購/委辦", "維運使用"],
        checks: ["先查地方府會預算書、議會質詢與中央補助核定，分開看中央款與地方款。", "再查政府採購決標公告、契約廠商與驗收資訊，確認金額是否已形成契約。", "最後看系統上線、維運年度、使用人次與開放資料，避免只停在示範案數。"],
        sourceRefs: ["sports", "pcc", "dgbas", "data"],
      },
      {
        label: "協會角色",
        value: "應用端居多",
        detailTitle: "協會角色怎麼判斷",
        detail: "協會在運動科技中常是應用端、場域端或選手資料的合作窗口。要判斷是否直接承接預算，需看補助名單、委辦契約、採購得標與成果報告，而不是只看協會是否出現在活動或新聞中。",
        flow: ["補助名單", "委辦契約", "合作露出", "實際承接"],
        checks: ["查協會是否列為受補助者、委辦承攬者或採購得標單位。", "區分新聞中的合作露出、提供選手資料、提供賽事場域與實際經費承接。", "比對成果報告、賽事資料與場域紀錄，確認科技導入後誰負責維運。"],
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

  function selectionSummary(set, dictionary) {
    if (set.size === 0) return "全部";
    if (set.size === 1) {
      const [value] = Array.from(set);
      return dictionary?.[value] || value;
    }
    return \`已選 \${set.size} 項\`;
  }

  function setSummary(title, value) {
    const details = Array.from(document.querySelectorAll(".select-menu"));
    const target = details.find((item) => item.querySelector("summary span")?.textContent?.trim() === title);
    const summary = target?.querySelector("summary strong");
    if (summary) summary.textContent = value;
  }

  function syncCheckboxes() {
    document.querySelectorAll(".select-menu").forEach((menu) => {
      const title = menu.querySelector("summary span")?.textContent?.trim();
      menu.querySelectorAll("label").forEach((label) => {
        const input = label.querySelector("input");
        const value = label.querySelector("span")?.textContent?.trim();
        if (!input || !value) return;
        if (value === "全部") {
          input.checked = title === "預算層級" ? selected.layers.size === 0 : selected.locations.size === 0;
          return;
        }
        if (title === "預算層級") {
          const key = label.dataset.filterLayer || Object.entries(flowData.layers).find(([, label]) => label === value)?.[0];
          input.checked = key ? selected.layers.has(key) : false;
        }
        if (title === "縣市") input.checked = selected.locations.has(label.dataset.filterLocation || value);
      });
    });
  }

  function updateFilterUi() {
    setSummary("預算層級", selectionSummary(selected.layers, flowData.layers));
    setSummary("縣市", selectionSummary(selected.locations));
    document.querySelectorAll("[data-stage-filter]").forEach((button) => {
      const stage = button.dataset.stageFilter;
      const isActive = stage === "all" ? selected.stages.size === 0 : selected.stages.has(stage);
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    syncCheckboxes();
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
            <div class="flow-diagram" aria-label="預算路徑"><span>中央/基金</span><span>執行單位</span><span>場域/協會</span><span>選手/民眾</span></div>
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
    drawer.className = "metric-drawer-layer static-drawer-layer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.innerHTML = \`
      <button class="metric-drawer-backdrop" aria-label="關閉總覽說明"></button>
      <aside class="metric-drawer-panel">
        <div class="drawer-topline">
          <div class="detail-header"><span>總覽指標</span><span>\${escapeHtml(metric.label)}</span></div>
          <button class="close-button" type="button">關閉</button>
        </div>
        <div class="metric-drawer-scroll">
          <span class="metric-drawer-label">\${escapeHtml(metric.value)}</span>
          <h2>\${escapeHtml(metric.detailTitle)}</h2>
          <p>\${escapeHtml(metric.detail)}</p>
          <div class="metric-check-flow" aria-label="\${escapeHtml(metric.label)}查核流程">\${metric.flow.map((step) => \`<span>\${escapeHtml(step)}</span>\`).join("")}</div>
          <section><h3>查核重點</h3><ul>\${list(metric.checks)}</ul></section>
          <section class="metric-source-section"><h3>相關連結</h3><ul>\${sourceLinks(metric.sourceRefs)}</ul></section>
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
    document.querySelectorAll(".select-menu label").forEach((label) => {
      label.addEventListener("change", () => {
        const menuTitle = label.closest(".select-menu")?.querySelector("summary span")?.textContent?.trim();
        const value = label.querySelector("span")?.textContent?.trim();
        if (!menuTitle || !value) return;
        const targetSet = menuTitle === "預算層級" ? selected.layers : selected.locations;
        if (value === "全部") targetSet.clear();
        else if (menuTitle === "預算層級") {
          const key = label.dataset.filterLayer || Object.entries(flowData.layers).find(([, label]) => label === value)?.[0];
          if (key) targetSet.has(key) ? targetSet.delete(key) : targetSet.add(key);
        } else {
          const key = label.dataset.filterLocation || value;
          targetSet.has(key) ? targetSet.delete(key) : targetSet.add(key);
        }
        const menu = label.closest(".select-menu");
        if (menu) menu.open = false;
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
