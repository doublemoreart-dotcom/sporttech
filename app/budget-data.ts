export type Stage = "proposal" | "approved" | "executing" | "verified" | "unknown";
export type Layer = "central" | "research" | "local" | "industry" | "association";

export type PublicInfo = {
  news: string[];
  announcements: string[];
  openData: string[];
};

export const sourceCatalog = {
  ey: {
    label: "行政院全球資訊網",
    url: "https://www.ey.gov.tw/",
    note: "政策新聞、院會與跨部會計畫線索。",
  },
  nstc: {
    label: "國科會全球資訊網",
    url: "https://www.nstc.gov.tw/",
    note: "科技計畫、研究補助、新聞資料與查詢入口。",
  },
  gstp: {
    label: "政府科技計畫資訊網",
    url: "https://gstp.stpi.narl.org.tw/",
    note: "跨部會科技計畫與年度科技預算查詢入口。",
  },
  grb: {
    label: "政府研究資訊系統 GRB",
    url: "https://www.grb.gov.tw/",
    note: "研究計畫名稱、主持人、關鍵字與成果摘要查詢。",
  },
  sports: {
    label: "運動部全民運動署",
    url: "https://www.sa.gov.tw/",
    note: "運動科技、場域、補助與政策公告入口。",
  },
  dgbas: {
    label: "行政院主計總處",
    url: "https://www.dgbas.gov.tw/",
    note: "中央政府預算、決算與補捐助資訊入口。",
  },
  pcc: {
    label: "公共工程委員會",
    url: "https://www.pcc.gov.tw/",
    note: "政府採購、決標與委辦案追蹤入口。",
  },
  data: {
    label: "政府資料開放平臺",
    url: "https://data.gov.tw/",
    note: "open data 資料集與 API 查詢入口。",
  },
} as const;

export type SourceKey = keyof typeof sourceCatalog;

export const stages: Record<Stage, string> = {
  proposal: "提案/爭取",
  approved: "已核定",
  executing: "執行中",
  verified: "已有成果",
  unknown: "待公開對帳",
};

export const layerNames: Record<Layer, string> = {
  central: "中央預算",
  research: "科研/學研",
  local: "地方場域",
  industry: "產業新創",
  association: "協會應用端",
};

export const metrics = [
  {
    label: "政策總額",
    value: "46 億元",
    note: "跨部會、跨年度政策總額，不能直接視為運動部單一預算。",
  },
  {
    label: "科研線索",
    value: "2.4 億元級",
    note: "精準運動科學歷史科研專案，重點在國家隊與競技表現。",
  },
  {
    label: "地方案例",
    value: "14 縣市 / 30 案",
    note: "地方場域實證需分別查核核定、決標、驗收與維運。",
  },
  {
    label: "協會角色",
    value: "應用端居多",
    note: "協會常提供選手、場域與賽事脈絡，不一定直接拿科技預算。",
  },
];

export const flows = [
  {
    id: "taiwan-sporttech",
    year: "2022-2026",
    title: "台灣運動 x 科技行動計畫",
    amount: "46 億元",
    source: "行政院跨部會科技預算",
    actors: ["運動部/前體育署", "國科會", "經濟部", "地方政府", "學研單位"],
    associations: ["棒球", "羽球", "桌球", "自由車", "游泳", "田徑"],
    locations: ["全國/跨縣市", "待逐案整理"],
    stage: "executing" as Stage,
    layer: "central" as Layer,
    publicness: "政策總額明確，逐年逐案流向仍需對帳。",
    note: "政策總額，分散於跨部會與跨年度項目，不宜直接視為運動部單一預算。",
    sourceRefs: ["ey", "nstc", "gstp", "dgbas", "data"] satisfies SourceKey[],
    publicInfo: {
      news: ["新聞與政策報導多以 2022-2026、46 億元跨部會投入為主，較少逐案列明年度支出。"],
      announcements: ["中央層級以行政院、科技會報、國科會與運動部政策說明為主要線索。"],
      openData: ["尚未見單一公開資料集可逐年對帳 46 億元流向；需拆到部會、年度與地方分案。"],
    } satisfies PublicInfo,
  },
  {
    id: "precision-sport-science",
    year: "2017-2024",
    title: "精準運動科學研究專案",
    amount: "2.4 億元級",
    source: "科技部/國科會科研預算",
    actors: ["大學研究團隊", "國家隊支援系統", "國家運動科學中心"],
    associations: ["羽球", "桌球", "棒球", "舉重", "自由車"],
    locations: ["全國/跨縣市"],
    stage: "verified" as Stage,
    layer: "research" as Layer,
    publicness: "歷史專案與成果可辨識，但分年支出仍需細表。",
    note: "重點在 AI 訓練、動作分析、疲勞監控、傷害預防與競技表現。",
    sourceRefs: ["nstc", "grb", "gstp", "sports"] satisfies SourceKey[],
    publicInfo: {
      news: ["公開討論包含精準運動科學研究、國科會補助與國家隊科技支援成果。"],
      announcements: ["中央線索在科技部/國科會研究計畫、學校研究公告與國家運動科學中心成果。"],
      openData: ["可查研究計畫名稱、主持人、補助金額與成果摘要，但完整運動別分年支出仍需逐案整理。"],
    } satisfies PublicInfo,
  },
  {
    id: "field-proof",
    year: "2022-2025",
    title: "地方運動科技場域實證",
    amount: "分案補助",
    source: "運動部公務預算 + 地方配合款",
    actors: ["14 縣市", "場館營運者", "科技廠商", "地方體育局"],
    associations: ["游泳", "田徑", "棒球", "全民運動"],
    locations: ["台北市", "新北市", "桃園市", "嘉義市", "高雄市", "待逐案整理"],
    stage: "executing" as Stage,
    layer: "local" as Layer,
    publicness: "案件數可辨識，逐案決標、驗收、維運需另查。",
    note: "公開資料顯示累計約 30 案；各案核定、決標、驗收、維運狀態不一致。",
    sourceRefs: ["sports", "pcc", "dgbas", "data"] satisfies SourceKey[],
    publicInfo: {
      news: ["地方案例常以智慧走跑、科技防溺、智慧場館或運動科技體驗活動形式出現在地方新聞。"],
      announcements: ["地方政府體育局、教育局公告、議會預算與政府採購決標是主要追蹤路徑。"],
      openData: ["已知有縣市與案件數線索，但每案核定、決標、驗收、維運、使用人次尚未形成統一 open data。"],
    } satisfies PublicInfo,
  },
  {
    id: "sports-fund",
    year: "年度型",
    title: "運動發展基金創新研發與數位轉型",
    amount: "約 3,000 萬元年度科目案例",
    source: "運動發展基金",
    actors: ["運動產業", "新創團隊", "法人", "地方政府"],
    associations: ["依合作案而定"],
    locations: ["全國/跨縣市", "待逐案整理"],
    stage: "executing" as Stage,
    layer: "industry" as Layer,
    publicness: "年度科目可辨識，受補助名單與成果需逐案整理。",
    note: "偏向產品、服務、數位轉型、產學合作和商業模式驗證。",
    sourceRefs: ["sports", "dgbas", "pcc", "data"] satisfies SourceKey[],
    publicInfo: {
      news: ["較常出現在運動產業創新、數位轉型、新創補助與產學合作報導。"],
      announcements: ["線索集中在運動發展基金年度預算、補助要點、受補助名單或成果發表。"],
      openData: ["年度科目可辨識，但受補助團隊、補助額、成果與後續營收需逐案公開對帳。"],
    } satisfies PublicInfo,
  },
  {
    id: "application-budget",
    year: "年度型",
    title: "運動科技應用發展",
    amount: "約 3,567 萬元年度科目案例",
    source: "體育署/運動部年度公務預算",
    actors: ["地方政府", "學校", "委辦團隊", "場域夥伴"],
    associations: ["依場域而定"],
    locations: ["全國/跨縣市", "待逐案整理"],
    stage: "verified" as Stage,
    layer: "central" as Layer,
    publicness: "科目案例清楚，但非所有運動科技經費總額。",
    note: "用於地方科技場域、跨域人才與應用推廣；只是特定年度可辨識科目。",
    sourceRefs: ["sports", "dgbas", "pcc", "data"] satisfies SourceKey[],
    publicInfo: {
      news: ["多以運動科技應用、地方場域、人才培育、體驗競賽等活動型新聞出現。"],
      announcements: ["主要查運動部/前體育署年度預算、單位預算與相關委辦、補助公告。"],
      openData: ["科目案例可辨識，但不是完整運動科技總額；需和資訊服務費、場館設備、委辦費分開查。"],
    } satisfies PublicInfo,
  },
  {
    id: "baseball-made",
    year: "2025-2026",
    title: "國球國造：棒球運動科技場域淬鍊",
    amount: "待核定公開",
    source: "爭取 115 年度國科會科技預算",
    actors: ["國科會", "運動部", "天母棒球場經驗模型", "縣市場館"],
    associations: ["棒球"],
    locations: ["台北市", "待擴散縣市"],
    stage: "proposal" as Stage,
    layer: "research" as Layer,
    publicness: "目前宜列提案/爭取，不宜寫成已全面執行。",
    note: "目前較適合列為提案/預算爭取，不宜描述為已全面執行。",
    sourceRefs: ["nstc", "gstp", "sports", "pcc"] satisfies SourceKey[],
    publicInfo: {
      news: ["目前公開資訊多指向天母棒球場經驗、棒球科技場域與國產技術驗證構想。"],
      announcements: ["應追蹤 115 年度國科會科技預算、運動部提案與後續採購或補助公告。"],
      openData: ["尚屬提案/爭取與模型規劃階段；未見完整核定金額、得標廠商與擴散縣市清單。"],
    } satisfies PublicInfo,
  },
  {
    id: "aspn",
    year: "2025-2026",
    title: "ASPN 國際運動科技創新加速器",
    amount: "委辦與補助細目待公開",
    source: "運動部產業與科技相關預算",
    actors: ["陽明交通大學 IAPS", "新創團隊", "國際市場夥伴"],
    associations: ["依場域測試而定"],
    locations: ["全國/跨縣市", "待逐案整理"],
    stage: "executing" as Stage,
    layer: "industry" as Layer,
    publicness: "活動與成果可見，完整成本拆分仍待公開。",
    note: "可見活動與成果，但完整委辦金額、新創補助與行政成本仍需對帳。",
    sourceRefs: ["sports", "pcc", "dgbas", "data"] satisfies SourceKey[],
    publicInfo: {
      news: ["公開資訊以 ASPN 國際運動科技創新加速器徵案、入選團隊、國際展會與 Demo Day 為主。"],
      announcements: ["可追陽明交通大學 IAPS、運動部產業科技計畫、委辦或徵案公告。"],
      openData: ["活動成果可見，但委辦金額、新創補助、展會費用與場域驗證成本仍需拆帳。"],
    } satisfies PublicInfo,
  },
  {
    id: "association-use",
    year: "持續",
    title: "協會端科技導入與國家隊應用",
    amount: "多非直接預算主體",
    source: "大學/研究中心/國科會/運動部計畫轉介",
    actors: ["單項協會", "教練", "選手", "研究團隊"],
    associations: ["棒球", "羽球", "桌球", "舉重", "自由車"],
    locations: ["全國/跨縣市", "待逐案整理"],
    stage: "unknown" as Stage,
    layer: "association" as Layer,
    publicness: "需逐案釐清協會是受補助者、合作方或應用場域。",
    note: "協會多為合作場域、選手資料與應用端，不一定是科技預算直接受補助者。",
    sourceRefs: ["sports", "nstc", "grb", "data"] satisfies SourceKey[],
    publicInfo: {
      news: ["協會端多出現在特定運動科技導入、國家隊訓練、選手數據分析或賽事情蒐報導。"],
      announcements: ["需比對單項協會、國訓中心、國家運動科學中心與研究團隊合作公告。"],
      openData: ["目前應標為應用端線索；需逐案確認協會是受補助者、合作方、資料提供者或場域使用者。"],
    } satisfies PublicInfo,
  },
];

export const stageOrder: Stage[] = [
  "proposal",
  "approved",
  "executing",
  "verified",
  "unknown",
];

export const locationNames: Record<string, string> = Object.fromEntries(
  Array.from(new Set(flows.flatMap((flow) => flow.locations))).map((location) => [
    location,
    location,
  ]),
);
