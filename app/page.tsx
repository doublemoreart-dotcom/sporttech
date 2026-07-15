"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  flows,
  layerNames,
  locationNames,
  metrics,
  sourceCatalog,
  stageOrder,
  stages,
  type Layer,
  type Stage,
} from "./budget-data";

function selectionSummary<T extends string>(
  selected: T[],
  labels: Record<T, string>,
  allLabel = "全部",
) {
  if (selected.length === 0) return allLabel;
  if (selected.length === 1) return labels[selected[0]];
  return `已選 ${selected.length} 項`;
}

export default function Home() {
  const [selectedLayers, setSelectedLayers] = useState<Layer[]>([]);
  const [selectedStages, setSelectedStages] = useState<Stage[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [activeFlow, setActiveFlow] = useState(flows[0].id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeMetric, setActiveMetric] = useState<(typeof metrics)[number] | null>(null);
  const [itemView, setItemView] = useState<"list" | "card">("list");
  const [isPreloading, setIsPreloading] = useState(true);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const metricCloseButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);
  const lastMetricTriggerRef = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(
    () =>
      flows.filter((flow) => {
        const layerMatch =
          selectedLayers.length === 0 || selectedLayers.includes(flow.layer);
        const stageMatch =
          selectedStages.length === 0 || selectedStages.includes(flow.stage);
        const locationMatch =
          selectedLocations.length === 0 ||
          flow.locations.some((location) => selectedLocations.includes(location));
        return layerMatch && stageMatch && locationMatch;
      }),
    [selectedLayers, selectedLocations, selectedStages],
  );

  const active =
    filtered.find((flow) => flow.id === activeFlow) ?? filtered[0] ?? null;
  const hasActiveFilters =
    selectedLayers.length > 0 ||
    selectedStages.length > 0 ||
    selectedLocations.length > 0;

  function resetFilters() {
    setSelectedLayers([]);
    setSelectedStages([]);
    setSelectedLocations([]);
    setDrawerOpen(false);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }

  function closeMetricDrawer() {
    setActiveMetric(null);
    window.requestAnimationFrame(() => lastMetricTriggerRef.current?.focus());
  }

  useEffect(() => {
    const preloadTimer = window.setTimeout(() => setIsPreloading(false), 1400);
    return () => window.clearTimeout(preloadTimer);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setDrawerOpen(false);
        window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  useEffect(() => {
    if (!activeMetric) return;

    metricCloseButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMetricDrawer();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeMetric]);

  return (
    <>
      {isPreloading && (
        <section
          aria-label="運動X科技預算查詢小幫手載入中"
          aria-live="polite"
          className="preloader"
          role="status"
        >
          <div className="preloader-card">
            <span className="preloader-kicker">budget query assistant</span>
            <h2>整理運動X科技預算線索</h2>
            <div className="preloader-flow" aria-hidden="true">
              <span>公開資料</span>
              <span>預算身分</span>
              <span>查核路徑</span>
            </div>
            <div className="preloader-bar" aria-hidden="true">
              <span />
            </div>
            <p>正在標記政策總額、年度科目、地方場域與協會應用端。</p>
            <button type="button" onClick={() => setIsPreloading(false)}>
              略過導入
            </button>
          </div>
        </section>
      )}

      <main className={isPreloading ? "site-shell loading-shell" : "site-shell"} id="top">
      <header className="site-header" aria-label="頁面導覽">
        <a className="site-logo" href="#top" aria-label="回到頁首">
          運動X科技預算查詢小幫手
        </a>
        <nav aria-label="主要區塊">
          <a href="#overview">總覽說明</a>
          <a href="#query">查詢預算</a>
          <a href="#sources">資料來源</a>
        </nav>
      </header>
      <section className="masthead">
        <figure className="hero-visual">
          <picture>
            <source media="(max-width: 640px)" srcSet="/sporttech-budget-hero-small.jpg" />
            <img
              alt="運動場域、資料節點與預算流向的主視覺"
              decoding="async"
              height={887}
              loading="eager"
              src="/sporttech-budget-hero.jpg"
              width={1774}
            />
          </picture>
        </figure>
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

      <section className="overview-section" id="overview" aria-labelledby="overview-title">
        <div className="section-heading">
          <p className="eyebrow">overview</p>
          <h2 id="overview-title">總覽說明</h2>
          <p>用四個指標快速抓預算規模、科研線索、地方場域與協會角色，再照三步驟縮小查核範圍。</p>
        </div>

        <div className="metrics" aria-label="總覽數字">
          {metrics.map((metric) => (
            <button
              aria-label={`查看${metric.label}說明`}
              className="metric"
              key={metric.label}
              onClick={(event) => {
                lastMetricTriggerRef.current = event.currentTarget;
                setActiveMetric(metric);
                setDrawerOpen(false);
              }}
              type="button"
            >
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.note}</small>
            </button>
          ))}
        </div>

        <div className="query-flow" aria-label="建議查詢流程">
          <div>
            <span>1</span>
            <strong>先選預算身分</strong>
            <p>從中央、科研、地方、產業或協會應用端縮小範圍。</p>
          </div>
          <div>
            <span>2</span>
            <strong>再看執行程度</strong>
            <p>區分提案、執行中、已有成果與仍待公開對帳的項目。</p>
          </div>
          <div>
            <span>3</span>
            <strong>最後打開詳情</strong>
            <p>核對來源連結、公開資訊進度與下一步查核問題。</p>
          </div>
        </div>
      </section>

      <section className="query-section" id="query" aria-labelledby="query-title">
        <div className="section-heading">
          <p className="eyebrow">query workbench</p>
          <h2 id="query-title">查詢預算</h2>
          <p>先用預算層級、執行程度與縣市縮小範圍，再切換列表或卡片檢視，點開項目查看來源與公開資訊進度。</p>
        </div>

        <div className="workbench">
          <aside className="panel">
            <div className="panel-inner">
              <div className="panel-status">
                <div>
                  <span className="control-label">目前查詢</span>
                  <strong>{filtered.length} / {flows.length} 項</strong>
                </div>
                {hasActiveFilters && (
                  <button onClick={resetFilters} type="button">
                    清除篩選
                  </button>
                )}
              </div>
              <div className="filter-grid" aria-label="查詢篩選">
              <details className="select-menu">
                <summary>
                  <span>預算層級</span>
                  <strong>{selectionSummary(selectedLayers, layerNames)}</strong>
                </summary>
                <div className="select-options">
                  <label>
                    <input
                      checked={selectedLayers.length === 0}
                      onChange={() => {
                        setSelectedLayers([]);
                        setDrawerOpen(false);
                      }}
                      type="checkbox"
                    />
                    <span>全部</span>
                  </label>
                  {(Object.keys(layerNames) as Layer[]).map((layer) => (
                    <label key={layer}>
                      <input
                        checked={selectedLayers.includes(layer)}
                        onChange={() => {
                          setSelectedLayers((current) =>
                            current.includes(layer)
                              ? current.filter((item) => item !== layer)
                              : [...current, layer],
                          );
                          setDrawerOpen(false);
                        }}
                        type="checkbox"
                      />
                      <span>{layerNames[layer]}</span>
                    </label>
                  ))}
                </div>
              </details>

              <details className="select-menu">
                <summary>
                  <span>縣市</span>
                  <strong>{selectionSummary(selectedLocations, locationNames)}</strong>
                </summary>
                <div className="select-options">
                  <label>
                    <input
                      checked={selectedLocations.length === 0}
                      onChange={() => {
                        setSelectedLocations([]);
                        setDrawerOpen(false);
                      }}
                      type="checkbox"
                    />
                    <span>全部</span>
                  </label>
                  {Object.keys(locationNames).map((location) => (
                    <label key={location}>
                      <input
                        checked={selectedLocations.includes(location)}
                        onChange={() => {
                          setSelectedLocations((current) =>
                            current.includes(location)
                              ? current.filter((item) => item !== location)
                              : [...current, location],
                          );
                          setDrawerOpen(false);
                        }}
                        type="checkbox"
                      />
                      <span>{location}</span>
                    </label>
                  ))}
                </div>
              </details>
            </div>

              <span className="control-label">執行程度</span>
              <div className="stage-tags" aria-label="執行程度篩選">
                <button
                  aria-pressed={selectedStages.length === 0}
                  className={selectedStages.length === 0 ? "stage-tag active" : "stage-tag"}
                  onClick={() => {
                    setSelectedStages([]);
                    setDrawerOpen(false);
                  }}
                  type="button"
                >
                  全部
                </button>
                {stageOrder.map((stage) => (
                  <button
                    aria-pressed={selectedStages.includes(stage)}
                    className={selectedStages.includes(stage) ? "stage-tag active" : "stage-tag"}
                    key={stage}
                    onClick={() => {
                      setSelectedStages((current) =>
                        current.includes(stage)
                          ? current.filter((item) => item !== stage)
                          : [...current, stage],
                      );
                      setDrawerOpen(false);
                    }}
                    type="button"
                  >
                    <span className={`stage-dot ${stage}`} />
                    <span>{stages[stage]}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="results-panel" aria-label="預算項目">
            <div className="results-toolbar">
              <div>
                <span className="control-label">查詢結果</span>
                <strong>{filtered.length === 0 ? "沒有符合項目" : `顯示 ${filtered.length} 筆公開線索`}</strong>
              </div>
              <div className="view-switcher">
                <span className="control-label">切換分類</span>
                <div className="view-toggle" role="group" aria-label="預算項目顯示方式">
                  <button
                    aria-pressed={itemView === "list"}
                    onClick={() => setItemView("list")}
                    type="button"
                  >
                    列表
                  </button>
                  <button
                    aria-pressed={itemView === "card"}
                    onClick={() => setItemView("card")}
                    type="button"
                  >
                    卡片
                  </button>
                </div>
              </div>
            </div>
            <div className={`lane-map ${itemView === "card" ? "card-view" : "list-view"}`} aria-label="預算項目清單">
              {filtered.map((flow) => (
                <button
                  className={active?.id === flow.id ? "lane active" : "lane"}
                  key={flow.id}
                  onClick={(event) => {
                    lastTriggerRef.current = event.currentTarget;
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
                <div className="empty-state">
                  <strong>目前沒有符合這組條件的公開可辨識項目。</strong>
                  <p>建議先回到全部項目，再逐一縮小預算層級、執行程度或縣市。</p>
                  <button onClick={resetFilters} type="button">重設查詢條件</button>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>

      {active && drawerOpen && (
        <div className="drawer-layer" role="dialog" aria-modal="true" aria-label={`${active.title} 查詢結果`}>
          <button className="drawer-backdrop" aria-label="關閉查詢結果" onClick={closeDrawer} />
          <article className="drawer-panel">
            <div className="drawer-handle" aria-hidden="true" />
            <div className="drawer-topline">
              <div className="detail-header">
                <span>{layerNames[active.layer]}</span>
                <span>{stages[active.stage]}</span>
              </div>
              <button className="close-button" onClick={closeDrawer} ref={closeButtonRef}>
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
                  <section>
                    <h3>對應縣市</h3>
                    <ul className="inline-list">
                      {active.locations.map((location) => (
                        <li key={location}>{location}</li>
                      ))}
                    </ul>
                  </section>
                </div>
                <section className="public-info">
                  <h3>公開資訊進度</h3>
                  <div className="public-info-grid">
                    <section>
                      <h4>新聞/報導線索</h4>
                      <ul>
                        {active.publicInfo.news.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h4>中央或地方府會公告</h4>
                      <ul>
                        {active.publicInfo.announcements.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h4>open data / 對帳進度</h4>
                      <ul>
                        {active.publicInfo.openData.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </section>
                <section className="source-links">
                  <h3>相關數據與連結來源</h3>
                  <ul>
                    {active.sourceRefs.map((sourceKey) => {
                      const source = sourceCatalog[sourceKey];
                      return (
                        <li key={sourceKey}>
                          <a href={source.url} rel="noreferrer" target="_blank">
                            {source.label}
                          </a>
                          <span>{source.note}</span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
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

      {activeMetric && (
        <div className="metric-drawer-layer" role="dialog" aria-modal="true" aria-label={`${activeMetric.label}說明`}>
          <button className="metric-drawer-backdrop" aria-label="關閉總覽說明" onClick={closeMetricDrawer} />
          <aside className="metric-drawer-panel">
            <div className="drawer-topline">
              <div className="detail-header">
                <span>總覽指標</span>
                <span>{activeMetric.label}</span>
              </div>
              <button className="close-button" onClick={closeMetricDrawer} ref={metricCloseButtonRef}>
                關閉
              </button>
            </div>
            <div className="metric-drawer-scroll">
              <span className="metric-drawer-label">{activeMetric.value}</span>
              <h2>{activeMetric.detailTitle}</h2>
              <p>{activeMetric.detail}</p>
              <section>
                <h3>查核重點</h3>
                <ul>
                  {activeMetric.checks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              </section>
            </div>
          </aside>
        </div>
      )}

      <section className="sources-section" id="sources" aria-labelledby="sources-title">
        <div className="section-heading">
          <p className="eyebrow">source registry</p>
          <h2 id="sources-title">資料來源</h2>
          <p>
            本頁以公開可查的中央政策、科研計畫、預決算、政府採購與 open data 入口作為索引；每筆預算詳情仍需回到原始來源確認最新版本與授權條款。
          </p>
        </div>
        <div className="source-registry" aria-label="資料來源清單">
          {Object.entries(sourceCatalog).map(([sourceKey, source]) => (
            <a className="source-card" href={source.url} key={sourceKey} rel="noreferrer" target="_blank">
              <span>{source.label}</span>
              <p>{source.note}</p>
              <small>{source.url.replace("https://", "")}</small>
            </a>
          ))}
        </div>
      </section>

      <footer className="site-footer" aria-label="公開資料與版權聲明">
        <div className="footer-copy">
          <strong>公開資料與版權聲明</strong>
          <p>
            本頁整理政府公開資訊、open data、新聞報導、中央與地方府會公告，以及可公開查詢之採購與研究計畫線索，
            供公共討論、新聞查核、政策研究與公民監督使用。
          </p>
          <p>
            資料僅作為查詢輔助與脈絡整理，不代表主管機關之正式預算對帳、決算審定或完整授權清單；引用時請回到原始公開來源確認最新版本、授權條款與更新日期。
          </p>
        </div>
        <div className="footer-meta" aria-label="版本與授權用途">
          <span>版號 v0.2.3</span>
          <span>更新日期 2026-07-15</span>
          <small>Copyright 2026. Open data for public interest research and non-commercial civic use.</small>
        </div>
      </footer>
      </main>
    </>
  );
}
