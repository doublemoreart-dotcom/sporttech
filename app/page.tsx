"use client";

import { useMemo, useState } from "react";

type Stage = "proposal" | "approved" | "executing" | "verified" | "unknown";
type Layer = "central" | "research" | "local" | "industry" | "association";

const stages: Record<Stage, string> = {
  proposal: "提案/爭取",
  approved: "已核定",
  executing: "執行中",
  verified: "已有成果",
  unknown: "待公開對帳",
};

const layerNames: Record<Layer, string> = {
  central: "中央預算",
  research: "科研/學研",
  local: "地方場域",
  industry: "產業新創",
  association: "協會應用端",
};

const metrics = [
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

const flows = [
  {
    id: "taiwan-sporttech",
    year: "2022-2026",
    title: "台灣運動 x 科技行動計畫",
    amount: "46 億元",
    source: "行政院跨部會科技預算",
    actors: ["運動部/前體育署", "國科會", "經濟部", "地方政府", "學研單位"],
    associations: ["棒球", "羽球", "桌球", "自由車", "游泳", "田徑"],
    stage: "executing" as Stage,
    layer: "central" as Layer,
    publicness: "政策總額明確，逐年逐案流向仍需對帳。",
    note: "政策總額，分散於跨部會與跨年度項目，不宜直接視為運動部單一預算。",
  },
  {
    id: "precision-sport-science",
    year: "2017-2024",
    title: "精準運動科學研究專案",
    amount: "2.4 億元級",
    source: "科技部/國科會科研預算",
    actors: ["大學研究團隊", "國家隊支援系統", "國家運動科學中心"],
    associations: ["羽球", "桌球", "棒球", "舉重", "自由車"],
    stage: "verified" as Stage,
    layer: "research" as Layer,
    publicness: "歷史專案與成果可辨識，但分年支出仍需細表。",
    note: "重點在 AI 訓練、動作分析、疲勞監控、傷害預防與競技表現。",
  },
  {
    id: "field-proof",
    year: "2022-2025",
    title: "地方運動科技場域實證",
    amount: "分案補助",
    source: "運動部公務預算 + 地方配合款",
    actors: ["14 縣市", "場館營運者", "科技廠商", "地方體育局"],
    associations: ["游泳", "田徑", "棒球", "全民運動"],
    stage: "executing" as Stage,
    layer: "local" as Layer,
    publicness: "案件數可辨識，逐案決標、驗收、維運需另查。",
    note: "公開資料顯示累計約 30 案；各案核定、決標、驗收、維運狀態不一致。",
  },
  {
    id: "sports-fund",
    year: "年度型",
    title: "運動發展基金創新研發與數位轉型",
    amount: "約 3,000 萬元年度科目案例",
    source: "運動發展基金",
    actors: ["運動產業", "新創團隊", "法人", "地方政府"],
    associations: ["依合作案而定"],
    stage: "executing" as Stage,
    layer: "industry" as Layer,
    publicness: "年度科目可辨識，受補助名單與成果需逐案整理。",
    note: "偏向產品、服務、數位轉型、產學合作和商業模式驗證。",
  },
  {
    id: "application-budget",
    year: "年度型",
    title: "運動科技應用發展",
    amount: "約 3,567 萬元年度科目案例",
    source: "體育署/運動部年度公務預算",
    actors: ["地方政府", "學校", "委辦團隊", "場域夥伴"],
    associations: ["依場域而定"],
    stage: "verified" as Stage,
    layer: "central" as Layer,
    publicness: "科目案例清楚，但非所有運動科技經費總額。",
    note: "用於地方科技場域、跨域人才與應用推廣；只是特定年度可辨識科目。",
  },
  {
    id: "baseball-made",
    year: "2025-2026",
    title: "國球國造：棒球運動科技場域淬鍊",
    amount: "待核定公開",
    source: "爭取 115 年度國科會科技預算",
    actors: ["國科會", "運動部", "天母棒球場經驗模型", "縣市場館"],
    associations: ["棒球"],
    stage: "proposal" as Stage,
    layer: "research" as Layer,
    publicness: "目前宜列提案/爭取，不宜寫成已全面執行。",
    note: "目前較適合列為提案/預算爭取，不宜描述為已全面執行。",
  },
  {
    id: "aspn",
    year: "2025-2026",
    title: "ASPN 國際運動科技創新加速器",
    amount: "委辦與補助細目待公開",
    source: "運動部產業與科技相關預算",
    actors: ["陽明交通大學 IAPS", "新創團隊", "國際市場夥伴"],
    associations: ["依場域測試而定"],
    stage: "executing" as Stage,
    layer: "industry" as Layer,
    publicness: "活動與成果可見，完整成本拆分仍待公開。",
    note: "可見活動與成果，但完整委辦金額、新創補助與行政成本仍需對帳。",
  },
  {
    id: "association-use",
    year: "持續",
    title: "協會端科技導入與國家隊應用",
    amount: "多非直接預算主體",
    source: "大學/研究中心/國科會/運動部計畫轉介",
    actors: ["單項協會", "教練", "選手", "研究團隊"],
    associations: ["棒球", "羽球", "桌球", "舉重", "自由車"],
    stage: "unknown" as Stage,
    layer: "association" as Layer,
    publicness: "需逐案釐清協會是受補助者、合作方或應用場域。",
    note: "協會多為合作場域、選手資料與應用端，不一定是科技預算直接受補助者。",
  },
];

const stageOrder: Stage[] = [
  "proposal",
  "approved",
  "executing",
  "verified",
  "unknown",
];

export default function Home() {
  const [selectedLayer, setSelectedLayer] = useState<Layer | "all">("all");
  const [selectedStage, setSelectedStage] = useState<Stage | "all">("all");
  const [activeFlow, setActiveFlow] = useState(flows[0].id);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(
    () =>
      flows.filter((flow) => {
        const layerMatch = selectedLayer === "all" || flow.layer === selectedLayer;
        const stageMatch = selectedStage === "all" || flow.stage === selectedStage;
        return layerMatch && stageMatch;
      }),
    [selectedLayer, selectedStage],
  );

  const active =
    filtered.find((flow) => flow.id === activeFlow) ?? filtered[0] ?? null;

  return (
    <main className="site-shell">
      <section className="masthead">
        <div>
          <p className="eyebrow">budget query assistant / 2022-2026</p>
          <h1>運動X科技預算查詢小幫手</h1>
          <p className="lede">
            想查一筆運動科技相關預算時，先用這個頁面確認它比較像政策總額、年度科目、基金補助、地方場域，
            還是協會端應用。點選項目後，可以快速查看來源、執行狀態、合作單位與下一步查核問題。
          </p>
        </div>
        <div className="audit-panel" aria-label="查詢提醒">
          <span>查詢提醒</span>
          <strong>先判斷預算身分，再看協會是否直接承接。</strong>
          <p>目前公開資料更常見的是政府、國科會或基金先到學研、地方、法人與新創，再進入場域或協會應用。</p>
        </div>
      </section>

      <section className="metrics" aria-label="總覽數字">
        {metrics.map((metric) => (
          <div className="metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </div>
        ))}
      </section>

      <section className="workbench">
        <aside className="panel">
          <div className="panel-inner">
            <span className="control-label">預算層級</span>
            <div className="chip-row">
              <button
                className={selectedLayer === "all" ? "chip active" : "chip"}
                onClick={() => {
                  setSelectedLayer("all");
                  setDrawerOpen(false);
                }}
              >
                全部
              </button>
              {(Object.keys(layerNames) as Layer[]).map((layer) => (
                <button
                  className={selectedLayer === layer ? "chip active" : "chip"}
                  key={layer}
                  onClick={() => {
                    setSelectedLayer(layer);
                    setDrawerOpen(false);
                  }}
                >
                  {layerNames[layer]}
                </button>
              ))}
            </div>

            <span className="control-label">執行程度</span>
            <div className="chip-row">
              <button
                className={selectedStage === "all" ? "chip active" : "chip"}
                onClick={() => {
                  setSelectedStage("all");
                  setDrawerOpen(false);
                }}
              >
                全部
              </button>
              {stageOrder.map((stage) => (
                <button
                  className={selectedStage === stage ? "chip active" : "chip"}
                  key={stage}
                  onClick={() => {
                    setSelectedStage(stage);
                    setDrawerOpen(false);
                  }}
                >
                  {stages[stage]}
                </button>
              ))}
            </div>

            <span className="control-label">圖例</span>
            <div className="legend">
              {stageOrder.map((stage) => (
                <div className="legend-row" key={stage}>
                  <span className={`stage-dot ${stage}`} />
                  <span>{stages[stage]}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="lane-map" aria-label="預算項目清單">
          {filtered.map((flow) => (
            <button
              className={active?.id === flow.id ? "lane active" : "lane"}
              key={flow.id}
              onClick={() => {
                setActiveFlow(flow.id);
                setDrawerOpen(true);
              }}
            >
              <span className={`stage-dot ${flow.stage}`} />
              <span className="timeline-year">{flow.year}</span>
              <span>
                <strong>{flow.title}</strong>
                <small>{layerNames[flow.layer]} / {stages[flow.stage]}</small>
              </span>
              <span className="amount">{flow.amount}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state">目前沒有符合這組條件的公開可辨識項目。</div>
          )}
        </section>
      </section>

      {active && drawerOpen && (
        <div className="drawer-layer" role="dialog" aria-modal="true" aria-label={`${active.title} 查詢結果`}>
          <button className="drawer-backdrop" aria-label="關閉查詢結果" onClick={() => setDrawerOpen(false)} />
          <article className="drawer-panel">
            <div className="drawer-handle" aria-hidden="true" />
            <div className="drawer-topline">
              <div className="detail-header">
                <span>{layerNames[active.layer]}</span>
                <span>{stages[active.stage]}</span>
              </div>
              <button className="close-button" onClick={() => setDrawerOpen(false)}>
                關閉
              </button>
            </div>
            <div className="drawer-scroll">
              <h2>{active.title}</h2>
              <dl className="facts compact-facts">
                <div>
                  <dt>期間</dt>
                  <dd>{active.year}</dd>
                </div>
                <div>
                  <dt>金額</dt>
                  <dd>{active.amount}</dd>
                </div>
                <div>
                  <dt>來源</dt>
                  <dd>{active.source}</dd>
                </div>
              </dl>
              <div className="audit-summary compact-summary">
                <h3>查核摘要</h3>
                <p>{active.publicness}</p>
              </div>
              <div className="drawer-detail-grid">
                <div className="flow-diagram" aria-label="預算路徑">
                  <span>中央/基金</span>
                  <span>執行單位</span>
                  <span>場域/協會</span>
                  <span>選手/民眾</span>
                </div>
                <div className="detail-groups">
                  <section>
                    <h3>主要執行或合作單位</h3>
                    <ul className="inline-list">
                      {active.actors.map((actor) => (
                        <li key={actor}>{actor}</li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h3>對應協會或運動種類</h3>
                    <ul className="inline-list">
                      {active.associations.map((association) => (
                        <li key={association}>{association}</li>
                      ))}
                    </ul>
                  </section>
                </div>
                <div className="audit-summary secondary-summary">
                  <h3>補充判斷</h3>
                  <p>{active.note}</p>
                  <dl>
                    <div>
                      <dt>下一步問法</dt>
                      <dd>這筆錢是政策總額、年度科目、委辦案、地方配合款，還是協會直接補助？</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </article>
        </div>
      )}

      <section className="release-strip" aria-label="版本資訊">
        <p>
          <span>版號 v0.2.0</span>
          <span>更新日期 2026-07-13</span>
        </p>
      </section>
    </main>
  );
}
