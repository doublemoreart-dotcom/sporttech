"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  flows,
  layerNames,
  locationNames,
  metrics,
  sourceCatalog,
  stageOrder,
  stages,
  sportBudgetRows,
  type Layer,
  type Stage,
} from "./budget-data";

const lucidePaths: Record<string, ReactNode> = {
  "badge-check": (
    <>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.77 4 4 0 0 1 0 6.76 4 4 0 0 1-4.78 4.77 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  "building-2": (
    <>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
    </>
  ),
  "calendar-days": (
    <>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </>
  ),
  "circle-check": (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  cpu: (
    <>
      <rect width="14" height="14" x="5" y="5" rx="2" />
      <path d="M9 9h6v6H9z" />
      <path d="M9 1v4" />
      <path d="M15 1v4" />
      <path d="M9 19v4" />
      <path d="M15 19v4" />
      <path d="M1 9h4" />
      <path d="M1 15h4" />
      <path d="M19 9h4" />
      <path d="M19 15h4" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </>
  ),
  dumbbell: (
    <>
      <path d="m6.5 6.5 11 11" />
      <path d="m21 21-1-1" />
      <path d="m3 3 1 1" />
      <path d="m18 22 4-4" />
      <path d="m2 6 4-4" />
      <path d="m3 10 7-7" />
      <path d="m14 21 7-7" />
    </>
  ),
  "external-link": (
    <>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  "file-search": (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <circle cx="11.5" cy="14.5" r="2.5" />
      <path d="m13.3 16.3 1.7 1.7" />
    </>
  ),
  "file-text": (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </>
  ),
  handshake: (
    <>
      <path d="m11 17 2 2a2.8 2.8 0 0 0 4 0l4-4" />
      <path d="m14 14 2.5 2.5a2.8 2.8 0 0 0 4 0" />
      <path d="M3 7h3l4 4" />
      <path d="M21 7h-3l-4 4" />
      <path d="m7 15 4-4" />
      <path d="m2 8 5 5" />
      <path d="m22 8-5 5" />
    </>
  ),
  landmark: (
    <>
      <path d="M3 22h18" />
      <path d="M6 18v-7" />
      <path d="M10 18v-7" />
      <path d="M14 18v-7" />
      <path d="M18 18v-7" />
      <path d="m12 2 9 5H3Z" />
    </>
  ),
  "layout-dashboard": (
    <>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </>
  ),
  megaphone: (
    <>
      <path d="m3 11 18-5v12L3 14v-3Z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </>
  ),
  school: (
    <>
      <path d="m4 6 8-4 8 4" />
      <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" />
      <path d="M6 10v12" />
      <path d="M18 10v12" />
      <path d="M10 22v-6h4v6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.8 7.8L6 21l-3-3 7-7a6 6 0 0 1 7.8-7.8Z" />
    </>
  ),
};

const budgetRoute = [
  { icon: "landmark", label: "中央/基金", role: "政策、基金或年度科目" },
  { icon: "building-2", label: "執行單位", role: "部會、學研、地方或法人" },
  { icon: "handshake", label: "場域/協會", role: "場館、協會或合作夥伴" },
  { icon: "users", label: "選手/民眾", role: "訓練、使用與成果回饋" },
];

type SportSortKey = "sport" | "clues" | "amount" | "status";
type SportSortDirection = "asc" | "desc";

const sportSortLabels: Record<SportSortKey, string> = {
  sport: "運動項目",
  clues: "對應線索",
  amount: "可辨識金額",
  status: "查核狀態",
};

function LucideIcon({ className, name }: { className?: string; name: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {lucidePaths[name] ?? lucidePaths["circle-check"]}
    </svg>
  );
}

export default function Home() {
  const [selectedLayers, setSelectedLayers] = useState<Layer[]>([]);
  const [selectedStages, setSelectedStages] = useState<Stage[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [activeFlow, setActiveFlow] = useState(flows[0].id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeMetric, setActiveMetric] = useState<(typeof metrics)[number] | null>(null);
  const [itemView, setItemView] = useState<"list" | "card">("card");
  const [isPreloading, setIsPreloading] = useState(true);
  const [sportSort, setSportSort] = useState<{
    direction: SportSortDirection;
    key: SportSortKey;
  }>({ direction: "asc", key: "sport" });
  const [expandedSports, setExpandedSports] = useState<string[]>([]);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const metricCloseButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);
  const lastMetricTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    (window as Window & { __sporttechHydrated?: boolean }).__sporttechHydrated = true;
  }, []);

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
  const flowTitleById = useMemo(
    () => Object.fromEntries(flows.map((flow) => [flow.id, flow.title])),
    [],
  );
  const sortedSportBudgetRows = useMemo(() => {
    const amountRank = (amount: string) => {
      if (amount.includes("46 億元")) return 1;
      if (amount.includes("2.4 億元")) return 2;
      if (amount.includes("3,000")) return 3;
      return 4;
    };
    const valueOf = (row: (typeof sportBudgetRows)[number]) => {
      if (sportSort.key === "clues") return row.flowRefs.length;
      if (sportSort.key === "amount") return amountRank(row.amount);
      if (sportSort.key === "status") return row.status;
      return row.sport;
    };

    return [...sportBudgetRows].sort((left, right) => {
      const leftValue = valueOf(left);
      const rightValue = valueOf(right);
      const result =
        typeof leftValue === "number" && typeof rightValue === "number"
          ? leftValue - rightValue
          : String(leftValue).localeCompare(String(rightValue), "zh-Hant");
      return sportSort.direction === "asc" ? result : -result;
    });
  }, [sportSort]);

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

  function toggleSportSort(key: SportSortKey) {
    setSportSort((current) => ({
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
      key,
    }));
  }

  function toggleSportDetail(sport: string) {
    setExpandedSports((current) =>
      current.includes(sport)
        ? current.filter((item) => item !== sport)
        : [...current, sport],
    );
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
          aria-label="運動X科技預算小幫手載入中"
          aria-live="polite"
          className="preloader"
          role="status"
        >
          <div className="preloader-card">
            <span className="preloader-kicker">budget query assistant</span>
            <h2>整理預算線索</h2>
            <div className="preloader-bar" aria-hidden="true">
              <span />
            </div>
            <button type="button" onClick={() => setIsPreloading(false)}>
              略過導入
            </button>
          </div>
        </section>
      )}

      <main className={isPreloading ? "site-shell loading-shell" : "site-shell"} id="top">
      <header className="site-header" aria-label="頁面導覽">
        <a className="site-logo" href="#top" aria-label="回到頁首">
          運動X科技預算小幫手
        </a>
        <nav aria-label="主要區塊">
          <a href="#overview">總覽說明</a>
          <a href="#query">查詢預算</a>
          <a href="#sports">運動項目表</a>
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
          <h1>運動X科技預算小幫手</h1>
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
          <h2 id="overview-title"><span className="heading-icon" aria-hidden="true"><LucideIcon name="layout-dashboard" /></span>總覽說明</h2>
          <p>用四個指標快速抓預算規模、科研線索、地方場域與協會角色。</p>
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
              <div className="metric-value-row">
                <strong className={/\d/.test(metric.value) ? "metric-value numeric" : "metric-value"}>
                  {metric.value}
                </strong>
              </div>
              <small>{metric.note}</small>
            </button>
          ))}
        </div>

      </section>

      <section className="query-section" id="query" aria-labelledby="query-title">
        <div className="section-heading">
          <p className="eyebrow">query workbench</p>
          <h2 id="query-title"><span className="heading-icon" aria-hidden="true"><LucideIcon name="search" /></span>查詢預算</h2>
          <p>先用預算層級、執行程度與縣市縮小範圍，再切換列表或卡片檢視，點開項目查看來源與公開資訊進度。</p>
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
              <div className="filter-stack" aria-label="查詢篩選">
                <section>
                  <span className="control-label">預算層級</span>
                  <div className="stage-tags" aria-label="預算層級篩選">
                    <button
                      aria-pressed={selectedLayers.length === 0}
                      className={selectedLayers.length === 0 ? "stage-tag active" : "stage-tag"}
                      data-filter-layer="all"
                      onClick={() => {
                        setSelectedLayers([]);
                        setDrawerOpen(false);
                      }}
                      type="button"
                    >
                      全部
                    </button>
                    {(Object.keys(layerNames) as Layer[]).map((layer) => (
                      <button
                        aria-pressed={selectedLayers.includes(layer)}
                        className={selectedLayers.includes(layer) ? "stage-tag active" : "stage-tag"}
                        data-filter-layer={layer}
                        key={layer}
                        onClick={() => {
                          setSelectedLayers((current) =>
                            current.includes(layer)
                              ? current.filter((item) => item !== layer)
                              : [...current, layer],
                          );
                          setDrawerOpen(false);
                        }}
                        type="button"
                      >
                        {layerNames[layer]}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <span className="control-label">縣市</span>
                  <div className="stage-tags" aria-label="縣市篩選">
                    <button
                      aria-pressed={selectedLocations.length === 0}
                      className={selectedLocations.length === 0 ? "stage-tag active" : "stage-tag"}
                      data-filter-location="all"
                      onClick={() => {
                        setSelectedLocations([]);
                        setDrawerOpen(false);
                      }}
                      type="button"
                    >
                      全部
                    </button>
                    {Object.keys(locationNames).map((location) => (
                      <button
                        aria-pressed={selectedLocations.includes(location)}
                        className={selectedLocations.includes(location) ? "stage-tag active" : "stage-tag"}
                        data-filter-location={location}
                        key={location}
                        onClick={() => {
                          setSelectedLocations((current) =>
                            current.includes(location)
                              ? current.filter((item) => item !== location)
                              : [...current, location],
                          );
                          setDrawerOpen(false);
                        }}
                        type="button"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <span className="control-label">執行程度</span>
                  <div className="stage-tags" aria-label="執行程度篩選">
                    <button
                      aria-pressed={selectedStages.length === 0}
                      data-stage-filter="all"
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
                        data-stage-filter={stage}
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
                </section>
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
                  data-flow-id={flow.id}
                  data-flow-layer={flow.layer}
                  data-flow-locations={flow.locations.join("|")}
                  data-flow-stage={flow.stage}
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
                  {budgetRoute.map((step) => (
                    <span key={step.label}>
                      <b aria-hidden="true"><LucideIcon name={step.icon} /></b>
                      <strong>{step.label}</strong>
                      <small>{step.role}</small>
                    </span>
                  ))}
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
        <div className="drawer-layer metric-drawer-layer" role="dialog" aria-modal="true" aria-label={`${activeMetric.label}說明`}>
          <button className="drawer-backdrop metric-drawer-backdrop" aria-label="關閉總覽說明" onClick={closeMetricDrawer} />
          <aside className="drawer-panel metric-drawer-panel">
            <div className="drawer-handle" aria-hidden="true" />
            <div className="drawer-topline">
              <div className="detail-header">
                <span>總覽指標</span>
                <span>{activeMetric.label}</span>
              </div>
              <button className="close-button" onClick={closeMetricDrawer} ref={metricCloseButtonRef}>
                關閉
              </button>
            </div>
            <div className="drawer-scroll metric-drawer-scroll">
              <span className="metric-drawer-label">{activeMetric.value}</span>
              <h2>{activeMetric.detailTitle}</h2>
              <p>{activeMetric.detail}</p>
              <div className="metric-check-flow" aria-label={`${activeMetric.label}查核流程`}>
                {activeMetric.flow.map((step, index) => (
                  <span key={step}>
                    <b aria-hidden="true"><LucideIcon name={activeMetric.flowIcons[index]} /></b>
                    <strong>{step}</strong>
                    <small>{activeMetric.flowRoles[index]}</small>
                  </span>
                ))}
              </div>
              <section className="metric-info-block">
                <h3>查核重點</h3>
                <ul>
                  {activeMetric.checks.map((check) => (
                    <li key={check}>{check}</li>
                  ))}
                </ul>
              </section>
              <section className="metric-source-section metric-info-block compact">
                <h3>相關連結</h3>
                <ul>
                  {activeMetric.sourceRefs.map((sourceKey) => {
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
            </div>
          </aside>
        </div>
      )}

      <section className="sports-budget-section" id="sports" aria-labelledby="sports-title">
        <div className="section-heading">
          <p className="eyebrow">sport budget table</p>
          <h2 id="sports-title"><span className="heading-icon" aria-hidden="true"><LucideIcon name="dumbbell" /></span>運動項目預算表</h2>
          <p>
            這張表把公開線索改用運動項目聚合，方便先看哪個運動可能對應哪些科技計畫；金額仍以「可辨識線索」呈現，避免誤讀為已完成單項運動對帳。
          </p>
        </div>
        <div className="table-note" role="note">
          <strong>閱讀提示</strong>
          <span>表格中的「對應線索」會回扣上方 8 筆公開線索。同一運動可能同時出現在科研、地方場域、基金與協會應用端；展開後再看協會角色與下一步查核。</span>
        </div>
        <div className="sport-table-toolbar" aria-label="運動項目表狀態">
          <span>目前排序：{sportSortLabels[sportSort.key]} {sportSort.direction === "asc" ? "由小到大" : "由大到小"}</span>
          <button
            data-sport-expand-all
            onClick={() =>
              setExpandedSports((current) =>
                current.length === sportBudgetRows.length
                  ? []
                  : sportBudgetRows.map((row) => row.sport),
              )
            }
            type="button"
          >
            {expandedSports.length === sportBudgetRows.length ? "全部收合" : "全部展開"}
          </button>
        </div>
        <div className="sport-table-wrap" role="region" aria-label="以運動項目整理的預算線索表" tabIndex={0}>
          <table className="sport-budget-table">
            <thead>
              <tr>
                {[
                  ["sport", "運動項目"],
                  ["clues", "對應線索"],
                  ["amount", "可辨識金額"],
                  ["status", "查核狀態"],
                ].map(([key, label]) => (
                  <th
                    aria-sort={
                      sportSort.key === key
                        ? sportSort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                    key={key}
                    scope="col"
                  >
                    <button
                      className="sort-button"
                      data-sport-sort={key}
                      onClick={() => toggleSportSort(key as SportSortKey)}
                      type="button"
                    >
                      <span>{label}</span>
                      <span aria-hidden="true" className="sort-arrow">
                        {sportSort.key === key
                          ? sportSort.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </button>
                  </th>
                ))}
                <th scope="col">摘要</th>
              </tr>
            </thead>
            <tbody>
              {sortedSportBudgetRows.map((row) => (
                <Fragment key={row.sport}>
                  <tr
                    className="sport-summary-row"
                    data-sort-amount={row.amount}
                    data-sort-clues={row.flowRefs.length}
                    data-sort-sport={row.sport}
                    data-sort-status={row.status}
                    data-sport-row={row.sport}
                    key={`${row.sport}-summary`}
                  >
                    <th scope="row">
                      <button
                        aria-controls={`sport-detail-${row.sport}`}
                        aria-expanded={expandedSports.includes(row.sport)}
                        className="sport-toggle"
                        data-sport-toggle={row.sport}
                        onClick={() => toggleSportDetail(row.sport)}
                        type="button"
                      >
                        <span className="sport-toggle-icon" aria-hidden="true">
                          {expandedSports.includes(row.sport) ? "−" : "+"}
                        </span>
                        <span>
                          <span className="sport-name">{row.sport}</span>
                          <small>{row.theme}</small>
                        </span>
                      </button>
                    </th>
                    <td>
                      <div className="linked-clues" aria-label={`${row.sport}對應公開線索`}>
                        <strong>{row.flowRefs.length} 筆</strong>
                        <ul>
                          {row.flowRefs.map((flowId) => (
                            <li key={flowId}>{flowTitleById[flowId]}</li>
                          ))}
                        </ul>
                      </div>
                    </td>
                    <td><strong className="amount-emphasis">{row.amount}</strong></td>
                    <td><span className="status-pill">{row.status}</span></td>
                    <td>
                      <p className="sport-summary-copy">{row.budgetClues.join("、")}</p>
                    </td>
                  </tr>
                  <tr
                    className="sport-detail-row"
                    data-sport-detail={row.sport}
                    hidden={!expandedSports.includes(row.sport)}
                    id={`sport-detail-${row.sport}`}
                    key={`${row.sport}-detail`}
                  >
                    <td colSpan={5}>
                      <div className="sport-detail-grid">
                        <section>
                          <h3>協會角色</h3>
                          <p>{row.associationRole}</p>
                        </section>
                        <section>
                          <h3>下一步查核</h3>
                          <p>{row.nextCheck}</p>
                        </section>
                        <section>
                          <h3>來源</h3>
                          <div className="table-source-links">
                            {row.sourceRefs.map((sourceKey) => {
                              const source = sourceCatalog[sourceKey];
                              return (
                                <a href={source.url} key={sourceKey} rel="noreferrer" target="_blank">
                                  {source.label}
                                </a>
                              );
                            })}
                          </div>
                        </section>
                      </div>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sources-section" id="sources" aria-labelledby="sources-title">
        <div className="section-heading">
          <p className="eyebrow">source registry</p>
          <h2 id="sources-title"><span className="heading-icon" aria-hidden="true"><LucideIcon name="database" /></span>資料來源</h2>
          <p>
            本頁以公開可查的中央政策、科研計畫、預決算、政府採購與 open data 入口作為索引；每筆預算詳情仍需回到原始來源確認最新版本與授權條款。
          </p>
        </div>
        <ul className="source-registry" aria-label="資料來源清單">
          {Object.entries(sourceCatalog).map(([sourceKey, source]) => (
            <li className="source-row" key={sourceKey}>
              <a href={source.url} rel="noreferrer" target="_blank">
                <span>{source.label}</span>
                <small>{source.url.replace("https://", "")}</small>
              </a>
              <p>{source.note}</p>
            </li>
          ))}
        </ul>
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
