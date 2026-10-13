/* IRDR | ANALISES — interface (rotas, telas e interações) */
(function () {
  const IRDR = window.IRDR;
  const { store, an } = IRDR;
  const D = store.data;
  const { esc, fmtInt, fmtPct, wkLabel, wkLong, PRIO_LABEL } = an;

  // ---------- helpers ----------
  const $ = (s, el = document) => el.querySelector(s);
  const icon = (n, cls = "i") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${(window.ICONS || {})[n] || ""}</svg>`;
  const tag = (s, plain) => (s ? `<span class="tag${plain ? " plain" : ""}" translate="no">${esc(s)}</span>` : `<span class="muted">—</span>`);
  const prio = (p) => (p ? `<span class="prio ${p}">${PRIO_LABEL[p]}</span>` : "");
  const mf = (v) => (/found/i.test(v) ? `<span class="pill found">Sobra</span>` : /missing/i.test(v) ? `<span class="pill missing">Falta</span>` : `<span class="pill">${esc(v || "—")}</span>`);
  const opt = (v, label, sel) => `<option value="${esc(v)}"${String(v) === String(sel) ? " selected" : ""}>${esc(label ?? v)}</option>`;
  const today = () => new Date().toISOString().slice(0, 10);
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const fmtDate = (s) => (s && /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(8, 10) + "/" + s.slice(5, 7) + "/" + s.slice(0, 4) : s || "—");

  function toast(msg, err) {
    const t = document.createElement("div");
    t.className = "toast" + (err ? " err" : "");
    t.setAttribute("role", "status");
    t.textContent = msg;
    $("#toasts").appendChild(t);
    setTimeout(() => t.remove(), err ? 6000 : 3500);
  }
  IRDR.toast = toast;

  // ---------- estado de UI ----------
  const ui = {
    erros: { tab: "research", scope: "ref", q: "", path: "", area: "", error: "", manager: "" },
    ofs: { prio: "", q: "", manager: "", sort: "" },
    plano: { status: "open" },
  };
  let charts = [];
  let ctx = null;

  const ROUTES = [
    { id: "visao", label: "Visão geral", icon: "layout-dashboard", group: "Análise" },
    { id: "erros", label: "Erros e pesquisas", icon: "scan-barcode", group: "Análise" },
    { id: "areas", label: "DPMO por área", icon: "map-pinned", group: "Análise" },
    { id: "ofensores", label: "Ofensores", icon: "users", group: "Análise" },
    { id: "feedbacks", label: "Feedbacks (STU)", icon: "message-square", group: "Ação" },
    { id: "plano", label: "Plano de ação", icon: "list-checks", group: "Ação" },
    { id: "importar", label: "Importar dados", icon: "upload", group: "Dados" },
    { id: "glossario", label: "Glossário", icon: "book-open", group: "Dados" },
  ];
  const route = () => {
    const id = (location.hash.match(/^#\/?(\w+)/) || [])[1];
    return ROUTES.find((r) => r.id === id) ? id : "visao";
  };
  const hasData = () => D.overview.length || D.defects.length || D.research.length;

  // ---------- render principal ----------
  function render() {
    charts.forEach((c) => c.destroy());
    charts = [];
    ctx = an.context(D.settings);
    IRDR.ctx = ctx;
    const r = route();
    renderSide(r);
    renderTop();
    const view = VIEWS[r];
    const needsData = !["importar", "glossario"].includes(r);
    $("#content").innerHTML = `<div class="view-enter">${needsData && !hasData() ? emptyAll() : view.html()}</div>`;
    if (!(needsData && !hasData()) && view.after) view.after();
    const sel = document.querySelector('.rail [aria-pressed="true"]');
    if (sel) sel.scrollIntoView({ block: "nearest", inline: "nearest" });
    document.title = `${ROUTES.find((x) => x.id === r).label} · IRDR | ANALISES`;
  }
  IRDR.render = render;

  // Pessoa: avatar com iniciais + login (e linha secundária opcional)
  const avClass = (s) => "av" + ([...String(s)].reduce((a, c) => a + c.charCodeAt(0), 0) % 6);
  function avatar(login, prioKey, xs) {
    return `<span class="avatar ${avClass(login)}${xs ? " xs" : ""}" aria-hidden="true">${esc(String(login).slice(0, 2))}${prioKey ? `<span class="st ${prioKey}"></span>` : ""}</span>`;
  }
  function who(login, sub, prioKey) {
    if (!login) return `<span class="muted">sem ofensor</span>`;
    return `<span class="who" translate="no">${avatar(login, prioKey)}<span><b>${esc(login)}</b>${sub ? `<small>${sub}</small>` : ""}</span></span>`;
  }
  IRDR.who = who;

  // Período real da contagem (datas das contagens importadas na semana)
  function weekDates(k) {
    const ds = [];
    for (const d of D.defects) if (an.wkKey(d) === k && d.countEnd) ds.push(d.countEnd.slice(0, 10));
    for (const r of D.research) if (an.wkKey(r) === k && r.countDate) ds.push(r.countDate.slice(0, 10));
    const v = ds.filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x)).sort();
    if (!v.length) return "";
    const f = (s) => s.slice(8, 10) + "/" + s.slice(5, 7);
    return v[0] === v[v.length - 1] ? f(v[0]) : `${f(v[0])} – ${f(v[v.length - 1])}`;
  }

  function renderSide(r) {
    let g = "";
    const counts = { ofensores: hasData() ? an.offenders(ctx).filter((o) => o.prio !== "OK").length : 0, plano: D.actions.filter((a) => a.status !== "Concluída").length };
    $("#ws").innerHTML = `<span class="ws-ico">${esc((ctx.wh || "FC").slice(0, 1))}</span>
      <span><b>${esc(ctx.wh || "Sem FC")}</b><small>${ctx.weeks.length} semana(s) importada(s)</small></span>
      ${ctx.whs.length > 1 ? `<span class="chev">${icon("chevrons-up-down")}</span><label class="sr-only" for="ws-sel">Trocar FC</label><select id="ws-sel" data-set="wh">${ctx.whs.map((w) => opt(w, w, ctx.wh)).join("")}</select>` : ""}`;
    $("#nav").innerHTML = ROUTES.map((x) => {
      const head = x.group !== g ? `<div class="nav-group">${(g = x.group)}</div>` : "";
      const c = counts[x.id] ? `<span class="count" aria-label="${counts[x.id]} pendentes">${counts[x.id]}</span>` : "";
      return `${head}<a href="#${x.id}"${x.id === r ? ' aria-current="page"' : ""}>${icon(x.icon)}<span>${x.label}</span>${c}</a>`;
    }).join("");
    const last = D.imports[0];
    const next = ctx.ref ? wkLabel(ctx.weeks[ctx.weeks.length - 1] + 1) : "";
    $("#side-card").innerHTML = `<div class="top">${icon("calendar")}${next ? `<span class="chip">${next}</span>` : ""}</div>
      <b>${hasData() ? "Próxima contagem" : "Comece pela importação"}</b>
      <p>${hasData() ? `Importe os exports do ONT Base de ${next} para atualizar a análise.${last ? ` Última importação em ${esc(fmtDate(last.at.slice(0, 10)))} às ${esc(last.at.slice(11, 16))}.` : ""}` : "Arraste os exports do ONT Base para montar a primeira análise."}</p>
      <a class="btn primary sm" href="#importar">${icon("upload")}Importar dados</a>`;
  }

  function renderTop() {
    const dates = ctx.ref ? weekDates(ctx.ref) : "";
    $("#topbar").innerHTML = `
      <div class="search-pill">${icon("search")}<label class="sr-only" for="global-q">Buscar</label>
        <input id="global-q" type="search" placeholder="Buscar login, bin ou FNSKU…" autocomplete="off" spellcheck="false"><span class="kbd" aria-hidden="true">Ctrl K</span></div>
      ${ctx.ref ? `<div class="week-pill">${icon("calendar")}<span><b>${esc(wkLong(ctx.ref))}</b><small>${dates ? "Contagem " + esc(dates) : esc(ctx.wh)}</small></span></div>` : ""}
      <div class="spacer"></div>
      <span class="status-chip" title="Os dados ficam salvos no navegador desta máquina">Dados salvos neste navegador</span>
      <button class="btn icon ghost" data-act="theme" aria-label="Alternar tema claro/escuro">${icon(document.documentElement.dataset.theme === "dark" ? "sun" : "moon")}</button>`;
  }

  function railHtml() {
    if (!ctx.weeks.length) return "";
    const sums = ctx.weeks.map((k) => an.weekSummary(ctx, k));
    const win = D.settings.window || "6";
    const range = ctx.win.length ? `${wkLabel(ctx.win[0])} a ${wkLabel(ctx.win[ctx.win.length - 1])}` : "";
    return `<div class="weeks">
      <div class="wl"><b>Semanas</b><small>Janela ${esc(range)}</small></div>
      <div class="rail" role="group" aria-label="Semana de referência">${sums.map((s) => `<button class="rail-cell${ctx.winSet.has(s.key) ? "" : " out"}" data-week="${s.key}" aria-pressed="${s.key === ctx.ref}" title="${esc(wkLong(s.key))} · ${s.defects} registros defeituosos">
          <span class="wk">${wkLabel(s.key)}</span><span class="dp num">${s.dpmo != null ? fmtInt(s.dpmo) : s.defects + " def."}</span><span class="dot${s.pending ? " on" : ""}" title="${s.pending ? s.pending + " pesquisa(s) pendente(s)" : ""}"></span></button>`).join("")}</div>
      <div class="seg light" role="group" aria-label="Janela de análise">${[["4", "4"], ["6", "6"], ["8", "8"], ["12", "12"], ["all", "Todas"]].map(([v, l]) => `<button data-window="${v}" aria-pressed="${win === v}">${l}${v !== "all" ? " sem." : ""}</button>`).join("")}</div>
    </div>`;
  }

  const ROUTE_GROUP = Object.fromEntries(ROUTES.map((r) => [r.id, r.group]));
  function head(title, lead, actions = "", opts = {}) {
    const r = route();
    const exp = opts.noExport ? "" : `<button class="btn" data-act="export-xlsx" ${hasData() ? "" : "disabled"}>${icon("file-spreadsheet")}Exportar Excel</button>
      <button class="btn primary" data-act="export-pdf" ${hasData() ? "" : "disabled"}>${icon("file-down")}Gerar relatório PDF</button>`;
    return `<nav class="crumbs" aria-label="Você está em"><span>${esc(ctx.wh || "IRDR")}</span>${icon("chevron-right")}<span>${esc(ROUTE_GROUP[r])}</span>${icon("chevron-right")}<b>${esc(ROUTES.find((x) => x.id === r).label)}</b></nav>
      <div class="page-head"><div>
        <div class="title-row"><h1>${title}</h1>${ctx.ref && !opts.noBadge ? `<span class="badge live">${esc(wkLong(ctx.ref))}</span>` : ""}</div>
        ${lead ? `<p class="lead">${lead}</p>` : ""}
      </div><div class="actions">${actions}${exp}</div></div>
      ${opts.noRail ? "" : railHtml()}`;
  }

  function emptyAll() {
    return `<div class="card"><div class="empty">
      <div class="big">${icon("inbox")}</div>
      <h2>Importe a primeira contagem</h2>
      <p class="muted" style="max-width:52ch;margin:0">Arraste os exports do ONT Base (Pick Area, DD/NZ, Completed Research e STU) em Excel ou CSV. O sistema reconhece cada planilha pelos cabeçalhos.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center"><a class="btn primary" href="#importar">${icon("upload")}Importar planilhas</a>${IRDR.DEMO ? `<button class="btn" data-act="demo">${icon("sparkles")}Ver com dados de exemplo</button>` : ""}</div>
    </div></div>`;
  }

  function delta(cur, prev, lowerIsBetter = true) {
    if (cur == null || prev == null) return `<span class="delta flat">${icon("minus")}sem base</span>`;
    const d = cur - prev;
    if (Math.abs(d) < 1e-9) return `<span class="delta flat">${icon("minus")}0%</span>`;
    const bad = lowerIsBetter ? d > 0 : d < 0;
    const txt = prev ? fmtPct(Math.abs(d) / Math.abs(prev), 0) : fmtInt(Math.abs(d));
    return `<span class="delta ${bad ? "bad" : "good"}">${icon(d > 0 ? "arrow-up" : "arrow-down")}${txt}</span>`;
  }

  // Sparkline em SVG (área + linha + ponto final)
  let spId = 0;
  function spark(vals, color) {
    const v = vals.map((x) => (x == null || !isFinite(x) ? null : x));
    const pts = v.map((x, i) => [i, x]).filter((p) => p[1] != null);
    if (pts.length < 2) return `<svg class="spark" viewBox="0 0 100 36" aria-hidden="true"><line x1="0" y1="30" x2="100" y2="30" stroke="var(--line-strong)" stroke-dasharray="3 3"/></svg>`;
    const max = Math.max(...pts.map((p) => p[1])), min = Math.min(...pts.map((p) => p[1]));
    const n = v.length - 1 || 1;
    const xy = pts.map(([i, x]) => [(i / n) * 96 + 2, 32 - ((x - min) / (max - min || 1)) * 26]);
    const line = xy.map((p) => p.map((c) => c.toFixed(1)).join(",")).join(" ");
    const id = "sp" + ++spId;
    const last = xy[xy.length - 1];
    return `<svg class="spark" viewBox="0 0 100 36" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".25"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      <polygon points="${xy[0][0]},34 ${line} ${last[0]},34" fill="url(#${id})"/><polyline points="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${last[0]}" cy="${last[1]}" r="2.6" fill="${color}"/></svg>`;
  }

  function kpi({ ico, tone, label, value, unit, dl, foot, series, color }) {
    return `<div class="card kpi">
      <div class="kpi-top"><span class="ico ${tone}">${icon(ico)}</span>${dl || ""}</div>
      <span class="kpi-label">${label}</span>
      <div class="kpi-row"><span class="kpi-value">${value}${unit ? `<small>${unit}</small>` : ""}</span>${series ? spark(series, color) : ""}</div>
      ${foot ? `<span class="kpi-foot">${foot}</span>` : ""}
    </div>`;
  }

  function hbars(pairs, max = 8) {
    if (!pairs.length) return `<p class="muted small" style="margin:0">Sem erros neste recorte.</p>`;
    const top = pairs.slice(0, max);
    const m = Math.max(...top.map((p) => p[1]));
    return `<div class="hbars">${top.map(([l, v]) => `<div class="hbar"><span class="lbl" title="${esc(l)}">${esc(l)}</span><span class="trk"><i style="width:${(v / m) * 100}%"></i></span><span class="v">${v}</span></div>`).join("")}</div>`;
  }

  // ---------- Chart.js ----------
  function chartDefaults() {
    if (!window.Chart) return;
    Chart.defaults.font.family = css("--sans") || "sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = css("--ink-3");
    Chart.defaults.borderColor = css("--line");
    Chart.defaults.animation = matchMedia("(prefers-reduced-motion: reduce)").matches ? false : { duration: 450 };
  }
  function mkChart(el, cfg) {
    if (!window.Chart || !el) return;
    chartDefaults();
    charts.push(new Chart(el, cfg));
  }
  const tooltipStyle = () => ({ backgroundColor: css("--ink"), titleColor: css("--surface"), bodyColor: css("--surface"), padding: 10, cornerRadius: 10, displayColors: true, boxPadding: 4 });
  IRDR.chartTrendCfg = function (tr, opts = {}) {
    const primary = opts.primary || css("--primary"), second = opts.muted || css("--purple");
    const grid = opts.grid || css("--line");
    return {
      type: "line",
      data: {
        labels: tr.map((t) => wkLabel(t.key)),
        datasets: [
          { label: "DPMO", data: tr.map((t) => (t.dpmo == null ? null : Math.round(t.dpmo))), borderColor: primary, borderWidth: 3, yAxisID: "y", tension: 0.4, pointRadius: 4, pointBackgroundColor: opts.static ? "#fff" : css("--surface"), pointBorderWidth: 2.5, pointHoverRadius: 6, spanGaps: true, fill: true,
            backgroundColor: (c) => { const a = c.chart.chartArea; if (!a) return "transparent"; const g = c.chart.ctx.createLinearGradient(0, a.top, 0, a.bottom); g.addColorStop(0, primary + "40"); g.addColorStop(1, primary + "00"); return g; } },
          { label: "Erros pesquisados", data: tr.map((t) => t.errors), borderColor: second, borderWidth: 2, borderDash: [6, 5], yAxisID: "y1", tension: 0.4, pointRadius: 3, pointBackgroundColor: second, fill: false },
        ],
      },
      options: {
        responsive: !opts.static, maintainAspectRatio: false, ...(opts.static ? { animation: false } : {}), animations: { colors: false },
        interaction: { mode: "index", intersect: false },
        plugins: { legend: { display: !!opts.static, position: "bottom", labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true } }, tooltip: opts.static ? {} : tooltipStyle() },
        scales: {
          y: { beginAtZero: true, border: { display: false }, grid: { color: grid, borderDash: [3, 3] }, ticks: { callback: (v) => fmtInt(v), maxTicksLimit: 6 } },
          y1: { beginAtZero: true, position: "right", border: { display: false }, grid: { display: false }, ticks: { precision: 0, maxTicksLimit: 6 } },
          x: { grid: { display: false }, border: { display: false } },
        },
      },
    };
  };

  const PRIO_COLOR = () => ({ CRITICA: css("--crit-solid"), ALTA: css("--high-solid"), MEDIA: css("--med-solid"), OK: css("--ok-solid") });
  const INS_TONE = { "triangle-alert": "t-red", "arrow-up-right": "t-red", "arrow-down-right": "t-green", "message-square": "t-amber", info: "t-blue", "map-pinned": "t-purple", "circle-dot": "t-blue" };
  const PATH_COLORS = ["--primary", "--purple", "--teal", "--high-solid", "--secondary", "--ok-solid"];

  function workload(ev, total) {
    const paths = an.countBy(ev, "path");
    if (!paths.length) return `<p class="muted small" style="margin:0">Sem erros pesquisados nesta semana.</p>`;
    return `<div class="wload">${paths.map(([p, n], i) => {
      const share = n / total;
      const hot = share >= 0.4 && p !== "Unknown";
      const col = hot ? "var(--crit-solid)" : p === "Unknown" ? "var(--line-strong)" : `var(${PATH_COLORS[i % PATH_COLORS.length]})`;
      const sub = ev.filter((e) => e.path === p);
      const areas = an.countBy(sub, "area").map(([a]) => a).join(" · ");
      const errs = an.countBy(sub, "error").map(([e, c]) => e + (c > 1 ? ` (${c})` : "")).join(", ");
      const tagx = hot ? `<span class="tagx" style="color:var(--crit);background:var(--crit-wash)">${fmtPct(share, 0)} dos erros</span>` : p === "Unknown" ? `<span class="tagx" style="color:var(--ink-3);background:var(--surface-2)">Sem ofensor</span>` : `<span class="tagx" style="color:var(--primary);background:var(--primary-wash)">${fmtPct(share, 0)}</span>`;
      return `<div class="wl-row"><div class="wl-line"><span class="dot" style="background:${col}"></span><b>${esc(p)}</b>${tagx}<span class="right">${n} erro(s)<strong>${fmtPct(share, 0)}</strong></span></div>
        <div class="wl-bar"><i style="width:${Math.max(3, share * 100)}%;background:${col}"></i></div>
        <div class="wl-sub"><span>${esc(areas)}</span><span>${esc(errs)}</span></div></div>`;
    }).join("")}</div>`;
  }

  // ================= TELAS =================
  const VIEWS = {};

  // ---------- Visão geral ----------
  VIEWS.visao = {
    html() {
      const s = an.weekSummary(ctx, ctx.ref);
      const p = ctx.prev ? an.weekSummary(ctx, ctx.prev) : null;
      const sums = ctx.win.map((k) => an.weekSummary(ctx, k));
      const offs = an.offenders(ctx);
      const pc = { CRITICA: 0, ALTA: 0, MEDIA: 0, OK: 0 };
      offs.forEach((o) => pc[o.prio]++);
      const evRef = an.events(ctx).filter((e) => e.key === ctx.ref);
      const ins = an.insights(ctx);
      const cov = an.stuCoverage(ctx).find((c) => c.key === ctx.ref);
      const total = offs.length;
      const weekOffs = offs.filter((o) => o.inRef);
      const mgrs = an.countBy(evRef.filter((e) => e.login), "manager");
      return `${head("Visão geral da contagem", "Resultado da IRDR da semana selecionada: qualidade da contagem, onde os erros se concentram e quem precisa de feedback.")}
      <div class="stack">
        <div class="grid g-kpi">
          ${kpi({ ico: "activity", tone: "t-blue", label: "DPMO da semana", value: s.dpmo != null ? fmtInt(s.dpmo) : "—", dl: delta(s.dpmo, p && p.dpmo), foot: s.dpmo != null ? `Acurácia de registros ${fmtPct(s.accuracy, 2)}` : `Importe o export de Pick Area de ${wkLabel(ctx.ref)}`, series: sums.map((x) => x.dpmo), color: css("--primary") })}
          ${kpi({ ico: "scan-barcode", tone: "t-purple", label: "Registros defeituosos", value: fmtInt(s.defects), unit: s.counted ? "de " + fmtInt(s.counted) : "registros", dl: delta(s.defects, p && p.defects), foot: `${s.nz} Net Zero · ${s.dd} Double Defect`, series: sums.map((x) => x.defects), color: css("--purple") })}
          ${kpi({ ico: "users-round", tone: "t-amber", label: "Erros pesquisados", value: fmtInt(s.errors), unit: `${s.associates} assoc.`, dl: delta(s.errors, p && p.errors), foot: `${s.unknown} sem ofensor${s.pending ? ` · ${s.pending} pesquisa(s) pendente(s)` : ""}`, series: sums.map((x) => x.errors), color: css("--high-solid") })}
          ${kpi({ ico: "message-square", tone: cov && cov.associates && !cov.done ? "t-red" : "t-green", label: "STU da semana", value: cov && cov.associates ? fmtPct(cov.rate, 0) : "—", unit: cov && cov.associates ? `${cov.done} de ${cov.associates}` : "", dl: cov && cov.associates ? (cov.notDone ? `<span class="delta bad">${icon("circle-alert")}${cov.notDone} pendente(s)</span>` : `<span class="delta good">${icon("circle-check")}completo</span>`) : "", foot: cov && cov.associates ? (cov.done ? "Feedback realizado para os associados com erro" : "Feedback não realizado nesta semana") : "Sem erros atribuídos na semana" })}
        </div>

        <div class="grid g-3-1">
          <div class="card"><div class="card-head"><div><h2>Tendência de DPMO e erros</h2><div class="sub">Janela de ${ctx.win.length} semana(s) · DPMO por registros contados e erros pesquisados</div></div>
              <div class="legend"><span><i style="background:var(--primary)"></i>DPMO</span><span><i style="background:var(--purple)"></i>Erros pesquisados</span></div></div>
            <div class="card-body"><div class="chart-box"><canvas id="ch-trend" role="img" aria-label="Gráfico de DPMO e erros pesquisados por semana"></canvas></div></div></div>
          <div class="card"><div class="card-head"><div><h2>Prioridade dos ofensores</h2><div class="sub">${total} associado(s) com erro na janela</div></div><a class="btn link" href="#ofensores">Ver todos</a></div>
            <div class="card-body">
              <div class="donut-wrap"><canvas id="ch-donut" role="img" aria-label="Distribuição de prioridades"></canvas><div class="donut-center"><b class="num">${total}</b><small>Associados</small></div></div>
              <div class="legend-grid">${["CRITICA", "ALTA", "MEDIA", "OK"].map((k) => `<button class="lchip${k === "CRITICA" && pc[k] ? " hot" : ""}" data-act="goto-prio" data-prio="${k}"><span class="dot" style="background:var(--${{ CRITICA: "crit", ALTA: "high", MEDIA: "med", OK: "ok" }[k]}-solid)"></span><span class="lbl">${PRIO_LABEL[k]}</span><b class="num">${pc[k]}</b></button>`).join("")}</div>
            </div></div>
        </div>

        <div class="grid g-3-1">
          <div class="card"><div class="card-head"><div><h2>Erros por processo</h2><div class="sub">${wkLong(ctx.ref)} · concentração por Path, com áreas e tipos de erro</div></div><span class="badge">${evRef.length} erro(s)</span></div>
            <div class="card-body">${workload(evRef, evRef.length || 1)}</div></div>
          <div class="card"><div class="card-head"><div><h2>Diagnóstico da semana</h2><div class="sub">Gerado a partir dos dados importados</div></div><span class="badge">Automático</span></div>
            <div class="card-body"><div class="diag">${(ins.length ? ins : [{ icon: "info", html: "Sem destaques para esta semana." }]).map((i) => `<div class="diag-item"><span class="ico ${INS_TONE[i.icon] || "t-blue"}">${icon(i.icon)}</span><p>${i.html}</p></div>`).join("")}</div>
              <a class="btn soft" href="#plano" style="margin-top:12px;width:100%;justify-content:center;color:var(--primary);font-weight:600">Abrir plano de ação ${icon("arrow-right")}</a></div></div>
        </div>

        <div class="card"><div class="card-head" style="padding-bottom:14px"><div><h2>Ofensores da semana</h2><div class="sub">Associados com erro em ${wkLabel(ctx.ref)}, ordenados por prioridade</div></div><a class="btn link" href="#ofensores">Ver análise completa ${icon("arrow-right")}</a></div>
          ${offTable(weekOffs, true)}
          <div class="table-foot"><span>Mostrando <b>${weekOffs.length}</b> de <b>${offs.length}</b> associado(s) da janela</span><span>Clique para ver o histórico</span></div></div>

        <div class="grid g-3-1">
          <div class="card"><div class="card-head"><div><h2>Erros por gestor</h2><div class="sub">${wkLong(ctx.ref)} · Manager login</div></div></div>
            <div class="card-body">${mgrs.length ? `<div class="hbars">${mgrs.map(([m, n]) => `<div class="hbar"><span class="lbl">${who(m)}</span><span class="trk"><i style="width:${(n / mgrs[0][1]) * 100}%"></i></span><span class="v">${n}</span></div>`).join("")}</div>` : `<p class="muted small" style="margin:0">Sem erros atribuídos.</p>`}</div></div>
          <div class="card"><div class="card-head"><div><h2>Exportação imediata</h2><div class="sub">Relatório gerencial de ${wkLabel(ctx.ref)}</div></div></div>
            <div class="card-body"><div class="exp-list">
              <button class="exp-item" data-act="export-pdf"><span class="ico t-red">${icon("file-text")}</span><span><b>Relatório gerencial (PDF)</b><small>KPIs, tendência, áreas, ofensores, STU e plano</small></span>${icon("arrow-right")}</button>
              <button class="exp-item" data-act="export-xlsx"><span class="ico t-green">${icon("file-spreadsheet")}</span><span><b>Base analítica (Excel)</b><small>11 abas com todos os dados da janela</small></span>${icon("arrow-right")}</button>
              <button class="exp-item" data-act="backup"><span class="ico t-blue">${icon("database")}</span><span><b>Backup dos dados (JSON)</b><small>Para levar a outro computador</small></span>${icon("arrow-right")}</button>
            </div></div></div>
        </div>
      </div>`;
    },
    after() {
      mkChart($("#ch-trend"), IRDR.chartTrendCfg(an.trend(ctx)));
      const offs = an.offenders(ctx);
      const keys = ["CRITICA", "ALTA", "MEDIA", "OK"];
      const vals = keys.map((k) => offs.filter((o) => o.prio === k).length);
      const col = PRIO_COLOR();
      mkChart($("#ch-donut"), {
        type: "doughnut",
        data: { labels: keys.map((k) => PRIO_LABEL[k]), datasets: [{ data: vals.some(Boolean) ? vals : [1], backgroundColor: vals.some(Boolean) ? keys.map((k) => col[k]) : [css("--surface-2")], borderWidth: 0, borderRadius: 6, spacing: 3 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: "76%", plugins: { legend: { display: false }, tooltip: vals.some(Boolean) ? tooltipStyle() : { enabled: false } } },
      });
    },
  };

  // ---------- Erros e pesquisas ----------
  VIEWS.erros = {
    html() {
      const f = ui.erros;
      const keys = f.scope === "ref" ? new Set([ctx.ref]) : ctx.winSet;
      const isR = f.tab === "research";
      let rows, table;
      if (isR) {
        const all = an.researchRows(ctx, keys);
        const uniq = (k) => [...new Set(all.map((r) => r[k]).filter(Boolean))].sort();
        rows = all.filter((r) => (!f.path || r.path === f.path) && (!f.area || r.area === f.area) && (!f.error || r.error === f.error) && (!f.manager || r.manager === f.manager) && (!f.q || [r.bin, r.fnsku, r.login, r.synopsis, r.deviations].join(" ").toLowerCase().includes(f.q.toLowerCase())));
        rows.sort((a, b) => b.key - a.key || a.bin.localeCompare(b.bin));
        IRDR._erRows = rows;
        const filt = `
          <label class="sr-only" for="f-path">Processo</label><select id="f-path" data-f="erros.path"><option value="">Todos os processos</option>${uniq("path").map((v) => opt(v, v, f.path)).join("")}</select>
          <label class="sr-only" for="f-area">Área</label><select id="f-area" data-f="erros.area"><option value="">Todas as áreas</option>${uniq("area").map((v) => opt(v, v, f.area)).join("")}</select>
          <label class="sr-only" for="f-err">Erro</label><select id="f-err" data-f="erros.error"><option value="">Todos os erros</option>${uniq("error").map((v) => opt(v, v, f.error)).join("")}</select>
          <label class="sr-only" for="f-mgr">Gestor</label><select id="f-mgr" data-f="erros.manager"><option value="">Todos os gestores</option>${uniq("manager").map((v) => opt(v, v, f.manager)).join("")}</select>`;
        table = `<div class="filters">${search("erros.q", f.q, "Buscar bin, FNSKU, login ou texto da pesquisa")}${filt}</div>
          <div class="table-wrap"><table><thead><tr><th>Semana</th><th>Bin</th><th>FNSKU</th><th>Tipo</th><th class="n">Esp.</th><th class="n">Cont.</th><th>Erro</th><th>Associado</th><th>Gestor</th></tr></thead><tbody>
          ${rows.map((r, i) => `<tr class="click" data-act="open-research" data-i="${i}" tabindex="0">
            <td class="mono">${wkLabel(r.key)}</td><td>${tag(r.bin)}</td><td class="mono">${esc(r.fnsku)}</td><td>${mf(r.mf)}${r.nz ? ' <span class="pill">NZ</span>' : ""}${r.dd ? ' <span class="pill">DD</span>' : ""}</td>
            <td class="n">${fmtInt(r.expQ)}</td><td class="n">${fmtInt(r.countQ)}</td>
            <td><div class="two"><span>${esc(r.error)}</span><small>${esc(r.path)} · ${esc(r.area)}</small></div></td>
            <td>${who(r.login)}</td><td class="mono">${esc(r.manager || "—")}</td></tr>`).join("") || `<tr><td colspan="9" class="muted" style="text-align:center;padding:28px">Nenhuma pesquisa neste filtro.</td></tr>`}
          </tbody></table></div><div class="table-foot"><span>${rows.length} registro(s)</span><span>Clique na linha para ler a pesquisa completa</span></div>`;
      } else {
        const all = an.defectRows(ctx, keys);
        const researched = new Set(an.researchRows(ctx, keys).map((r) => r.key + "|" + r.bin + "|" + r.fnsku));
        rows = all.filter((r) => !f.q || [r.bin, r.fnsku, r.pickArea, r.binType].join(" ").toLowerCase().includes(f.q.toLowerCase()));
        rows.sort((a, b) => b.key - a.key || a.bin.localeCompare(b.bin));
        table = `<div class="filters">${search("erros.q", f.q, "Buscar bin, FNSKU ou pick area")}</div>
          <div class="table-wrap"><table><thead><tr><th>Semana</th><th>Bin</th><th>FNSKU</th><th>Pick area</th><th>Tipo de bin</th><th>Tipo</th><th class="n">Esp.</th><th class="n">Cont.</th><th class="n">Δ</th><th>NZ</th><th>DD</th><th>Pesquisa</th></tr></thead><tbody>
          ${rows.map((r) => { const d = r.cntQty - r.expQty; const ok = researched.has(r.key + "|" + r.bin + "|" + r.fnsku); return `<tr>
            <td class="mono">${wkLabel(r.key)}</td><td>${tag(r.bin)}</td><td class="mono">${esc(r.fnsku)}</td><td class="mono">${esc(r.pickArea)}</td><td class="small">${esc(r.binType)} <span class="muted">${esc(r.binUsage)}</span></td>
            <td>${mf(r.mf)}</td><td class="n">${fmtInt(r.expQty)}</td><td class="n">${fmtInt(r.cntQty)}</td><td class="n mono" style="color:${d > 0 ? "var(--ok)" : "var(--crit)"}">${d > 0 ? "+" : ""}${d}</td>
            <td>${r.nz ? "Sim" : "—"}</td><td>${r.dd ? "Sim" : "—"}</td><td>${ok ? '<span class="pill found">Concluída</span>' : '<span class="pill">Pendente</span>'}</td></tr>`; }).join("") || `<tr><td colspan="12" class="muted" style="text-align:center;padding:28px">Nenhum registro DD/NZ neste filtro.</td></tr>`}
          </tbody></table></div><div class="table-foot"><span>${rows.length} registro(s) · ${rows.filter((r) => r.nz).length} NZ · ${rows.filter((r) => r.dd).length} DD</span></div>`;
      }
      return `${head("Erros e pesquisas", "Cada divergência da contagem e o resultado da pesquisa de causa raiz.")}
        <div class="card">
          <div class="card-head" style="padding-bottom:14px">
            <div class="seg" role="group" aria-label="Base">${segBtn("erros.tab", "research", "Pesquisas concluídas", f.tab)}${segBtn("erros.tab", "defects", "Registros DD/NZ", f.tab)}</div>
            <div class="seg" role="group" aria-label="Período">${segBtn("erros.scope", "ref", wkLabel(ctx.ref), f.scope)}${segBtn("erros.scope", "win", "Janela inteira", f.scope)}</div>
          </div>${table}</div>`;
    },
  };

  function segBtn(key, val, label, cur) {
    return `<button data-seg="${key}" data-v="${val}" aria-pressed="${cur === val}">${esc(label)}</button>`;
  }
  function search(key, val, ph) {
    return `<div class="search">${icon("search")}<label class="sr-only" for="q-${key}">${ph}</label><input id="q-${key}" type="search" data-f="${key}" value="${esc(val)}" placeholder="${esc(ph)}" autocomplete="off"></div>`;
  }

  function openResearch(r) {
    drawer({
      eyebrow: `${wkLong(r.key)} · ${r.wh}`,
      title: r.synopsis || r.error,
      body: `<dl class="dl">
          <dt>Bin</dt><dd>${tag(r.bin)}</dd>
          <dt>FNSKU / FCSKU</dt><dd class="mono">${esc(r.fnsku)} ${r.fcsku ? "/ " + esc(r.fcsku) : ""}</dd>
          <dt>Contagem</dt><dd>${mf(r.mf)} esperado ${fmtInt(r.expQ)}, contado ${fmtInt(r.countQ)} ${r.nz ? '<span class="pill">Net Zero</span>' : ""} ${r.dd ? '<span class="pill">Double Defect</span>' : ""}</dd>
          <dt>Processo</dt><dd>${esc(r.path)} · ${esc(r.area)}</dd>
          <dt>Erro</dt><dd>${esc(r.error)}</dd>
          <dt>Associado</dt><dd>${r.login ? tag(r.login) + ` <span class="muted small">${esc(r.tenure)} dias de casa</span>` : '<span class="muted">Sem ofensor identificado</span>'}</dd>
          <dt>Gestor</dt><dd class="mono">${esc(r.manager || "—")}</dd>
          <dt>Data do erro</dt><dd>${fmtDate(r.errorDate)}${r.errorAge ? ` <span class="muted small">(${esc(r.errorAge)} dias antes da contagem)</span>` : ""}</dd>
          <dt>Pick area / bin</dt><dd class="mono">${esc(r.pickArea || "—")} · ${esc(r.binType)} ${esc(r.binUsage)}</dd>
          <dt>Pesquisado por</dt><dd class="mono">${esc(r.researchedBy || "—")} <span class="muted">${esc(r.researchedAt)}</span></dd>
        </dl>
        <div><div class="eyebrow">Desvio (pesquisa)</div><p class="narrative">${esc(r.deviations || "Sem descrição.")}</p></div>
        ${r.notes ? `<div><div class="eyebrow">Notas</div><p class="narrative">${esc(r.notes)}</p></div>` : ""}`,
      foot: r.login ? `<button class="btn primary" data-act="new-fb" data-login="${esc(r.login)}" data-week="${r.key}" data-error="${esc(r.error)}">${icon("message-square")}Registrar STU</button>` : "",
    });
  }

  // ---------- DPMO por área ----------
  VIEWS.areas = {
    html() {
      const m = an.areaMatrix(ctx);
      const vals = m.flatMap((a) => ctx.win.map((k) => a.cells[k].dpmo).filter((v) => v != null));
      const max = Math.max(1, ...vals);
      const heat = (v) => {
        if (v == null) return `<span class="muted">—</span>`;
        const t = Math.min(1, v / max);
        return `<span style="background:color-mix(in srgb, var(--crit) ${Math.round(t * 38)}%, transparent)">${fmtInt(v)}</span>`;
      };
      const refRows = m.map((a) => ({ area: a.area, ...a.cells[ctx.ref] })).sort((a, b) => (b.dpmo ?? -1) - (a.dpmo ?? -1));
      return `${head("DPMO por área", "Defeitos por milhão de registros contados, por pick area. Quanto mais escura a célula, maior o DPMO.")}
      <div class="stack">
        <div class="grid g-2">
          <div class="card"><div class="card-head"><div><h2>DPMO por área em ${wkLabel(ctx.ref)}</h2><div class="sub">Registros defeituosos ÷ registros contados × 1.000.000</div></div></div>
            <div class="card-body"><div class="chart-box"><canvas id="ch-area" role="img" aria-label="DPMO por pick area"></canvas></div></div></div>
          <div class="card"><div class="card-head"><div><h2>Detalhe da semana</h2><div class="sub">${wkLong(ctx.ref)}</div></div></div>
            <div class="card-body flush"><div class="table-wrap"><table><thead><tr><th>Pick area</th><th class="n">Bins</th><th class="n">Contados</th><th class="n">Defeitos</th><th class="n">DPMO</th><th class="n">NZ</th><th class="n">DD</th></tr></thead><tbody>
            ${refRows.map((r) => `<tr><td class="mono">${esc(r.area)}</td><td class="n">${fmtInt(r.bins)}</td><td class="n">${fmtInt(r.counted)}</td><td class="n">${fmtInt(r.defects)}</td><td class="n"><b>${r.dpmo != null ? fmtInt(r.dpmo) : "—"}</b></td><td class="n">${r.nz}</td><td class="n">${r.dd}</td></tr>`).join("") || `<tr><td colspan="7" class="muted" style="text-align:center;padding:24px">Sem dados de área.</td></tr>`}
            </tbody></table></div></div></div>
        </div>
        <div class="card"><div class="card-head"><div><h2>Mapa de calor da janela</h2><div class="sub">DPMO por área e semana</div></div></div>
          <div class="card-body flush"><div class="table-wrap"><table class="heat"><thead><tr><th>Pick area</th>${ctx.win.map((k) => `<th class="n">${wkLabel(k)}</th>`).join("")}<th class="n">Janela</th></tr></thead><tbody>
          ${m.map((a) => `<tr><td class="mono">${esc(a.area)}</td>${ctx.win.map((k) => `<td class="h">${heat(a.cells[k].dpmo)}</td>`).join("")}<td class="h"><b>${a.dpmo != null ? fmtInt(a.dpmo) : "—"}</b></td></tr>`).join("")}
          </tbody></table></div></div></div>
      </div>`;
    },
    after() {
      const m = an.areaMatrix(ctx).map((a) => ({ area: a.area, v: a.cells[ctx.ref].dpmo })).filter((a) => a.v != null).sort((a, b) => b.v - a.v);
      if (!m.length) { $("#ch-area").parentElement.innerHTML = `<div class="empty" style="padding:40px 12px"><h2>Sem DPMO nesta semana</h2><p class="muted" style="margin:0">Importe o export de Pick Area de ${wkLabel(ctx.ref)} para ver o DPMO por área.</p></div>`; return; }
      mkChart($("#ch-area"), {
        type: "bar",
        data: { labels: m.map((a) => a.area), datasets: [{ label: "DPMO", data: m.map((a) => Math.round(a.v)), backgroundColor: css("--primary"), borderRadius: 4, maxBarThickness: 22 }] },
        options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { callback: (v) => fmtInt(v) } }, y: { grid: { display: false } } } },
      });
    },
  };

  // ---------- Ofensores ----------
  function offTable(list, compact) {
    if (!list.length) return `<p class="muted" style="padding:8px 18px 18px;margin:0">Nenhum associado neste recorte.</p>`;
    return `<div class="table-wrap"><table><thead><tr><th>Associado</th><th>Prioridade</th><th>Gestor</th><th class="n">Erros janela</th><th class="n">Histórico</th><th>Semanas com erro</th><th>Erros</th><th>STU</th>${compact ? "" : "<th></th>"}</tr></thead><tbody>
      ${list.map((o) => `<tr class="click" data-act="open-off" data-login="${esc(o.login)}" tabindex="0">
        <td>${who(o.login, o.tenure ? o.tenure + " dias de casa" : "", o.prio)}</td><td>${prio(o.prio)}</td><td class="mono">${esc(o.manager || "—")}</td>
        <td class="n"><b>${o.inWindow}</b></td><td class="n">${o.total}</td>
        <td>${o.weeks.map((k) => `<span class="tag plain">${wkLabel(k)}</span>`).join(" ")}</td>
        <td><div class="two"><span>${o.errors.map(([e, n]) => esc(e) + (n > 1 ? ` ×${n}` : "")).join(", ")}</span><small>${o.paths.map(([p]) => esc(p)).join(" · ")}</small></div></td>
        <td>${stuCell(o)}</td>
        ${compact ? "" : `<td><button class="btn sm" data-act="new-fb" data-login="${esc(o.login)}" data-week="${o.lastKey}" data-error="${esc(o.lastError)}">${icon("plus")}STU</button></td>`}</tr>`).join("")}
    </tbody></table></div>`;
  }

  function stuCell(o) {
    const last = o.lastFeedback ? `<small>último: ${wkLabel(o.lastFeedback.key)}${o.lastFeedback.date ? " · " + fmtDate(o.lastFeedback.date) : ""}</small>` : "";
    if (o.stuPending.length) return `<div class="two"><span><span class="pill missing">Não realizado</span></span><small>${o.stuPending.map(wkLabel).join(" ")}</small>${last}</div>`;
    return `<div class="two"><span><span class="pill found">Realizado</span></span>${last}</div>`;
  }
  function stuStatus(c) {
    if (!c.associates) return c.stuCount ? `<span class="pill found">STU registrado</span>` : `<span class="pill">Sem erros atribuídos</span>`;
    if (!c.done) return `<span class="pill missing">Não realizado</span>`;
    if (c.notDone) return `<span class="pill" style="color:var(--high);background:var(--high-wash)">Parcial</span>`;
    return `<span class="pill found">Realizado</span>`;
  }
  IRDR.stuStatusText = (c) => (!c.associates ? (c.stuCount ? "STU registrado" : "Sem erros atribuídos") : !c.done ? "Não realizado" : c.notDone ? "Parcial" : "Realizado");

  VIEWS.ofensores = {
    html() {
      const f = ui.ofs;
      const all = an.offenders(ctx);
      const pc = { CRITICA: 0, ALTA: 0, MEDIA: 0, OK: 0 };
      all.forEach((o) => pc[o.prio]++);
      const mgrs = [...new Set(all.map((o) => o.manager).filter(Boolean))].sort();
      const list = all.filter((o) => (!f.prio || o.prio === f.prio) && (!f.manager || o.manager === f.manager) && (!f.q || o.login.includes(f.q.toLowerCase())));
      const mg = an.managers(ctx, all);
      return `${head("Ofensores", "Associados com erro na janela, priorizados por reincidência e feedback aplicado. Reincidência considera todo o histórico importado até a semana selecionada.")}
      <div class="stack">
        <div class="prio-strip" role="group" aria-label="Filtrar por prioridade">
          ${[["CRITICA", "Reincidente após feedback"], ["ALTA", "Reincidente sem feedback"], ["MEDIA", "1º erro sem STU"], ["OK", "STU aplicado"]].map(([k, l]) => `<button class="prio-box" data-p="${k}" data-act="filter-prio" data-prio="${k}" aria-pressed="${f.prio === k}" style="${f.prio === k ? "box-shadow:inset 0 0 0 1px var(--ink-3)" : ""}"><span>${PRIO_LABEL[k]}</span><b class="num">${pc[k]}</b><span>${l}</span></button>`).join("")}
        </div>
        <div class="card">
          <div class="filters">${search("ofs.q", f.q, "Buscar login")}
            <label class="sr-only" for="f-omgr">Gestor</label><select id="f-omgr" data-f="ofs.manager"><option value="">Todos os gestores</option>${mgrs.map((m) => opt(m, m, f.manager)).join("")}</select>
            ${f.prio ? `<button class="btn sm ghost" data-act="filter-prio" data-prio="">${icon("x")}Limpar prioridade</button>` : ""}
          </div>
          ${offTable(list)}
          <div class="table-foot"><span>${list.length} associado(s)</span><span>Clique para ver o histórico</span></div>
        </div>
        <div class="card"><div class="card-head"><div><h2>Por gestor</h2><div class="sub">Distribuição de prioridades na janela</div></div></div>
          <div class="card-body flush"><div class="table-wrap"><table><thead><tr><th>Gestor</th><th class="n">Associados</th><th class="n">Erros</th><th class="n">Crítica</th><th class="n">Alta</th><th class="n">Média</th><th class="n">OK</th></tr></thead><tbody>
          ${mg.map((m) => `<tr><td class="mono">${esc(m.manager)}</td><td class="n">${m.associates}</td><td class="n">${m.errors}</td><td class="n" style="color:var(--crit)">${m.CRITICA || "—"}</td><td class="n" style="color:var(--high)">${m.ALTA || "—"}</td><td class="n">${m.MEDIA || "—"}</td><td class="n" style="color:var(--ok)">${m.OK || "—"}</td></tr>`).join("")}
          </tbody></table></div></div></div>
      </div>`;
    },
  };

  function openOffender(login) {
    const o = an.offenders(ctx).find((x) => x.login === login);
    if (!o) return;
    const items = [
      ...o.events.map((e) => ({ k: e.key, kind: "err", e })),
      ...o.feedbacks.map((f) => ({ k: f.key, kind: "fb", f })),
    ].sort((a, b) => b.k - a.k || (a.kind === "fb" ? -1 : 1));
    drawer({
      eyebrow: `Associado · gestor ${o.manager || "—"}`,
      title: `${esc(o.login)}`,
      titleHtml: `${tag(o.login)} ${prio(o.prio)}`,
      body: `<dl class="dl">
          <dt>Tempo de casa</dt><dd>${esc(o.tenure || "—")} dias</dd>
          <dt>Erros</dt><dd>${o.inWindow} na janela · ${o.total} no histórico</dd>
          <dt>Processos</dt><dd>${o.paths.map(([p, n]) => `${esc(p)} (${n})`).join(", ")}</dd>
          <dt>Reincidente</dt><dd>${o.reincident ? "Sim" : "Não"}</dd>
        </dl>
        <div><div class="eyebrow">Linha do tempo</div>
        <div class="table-wrap"><table><tbody>
        ${items.map((it) => it.kind === "err"
          ? `<tr><td class="mono" style="width:56px">${wkLabel(it.k)}</td><td><div class="two"><span>${icon("triangle-alert")} ${esc(it.e.error)}</span><small>${esc(it.e.path)} · ${esc(it.e.area)} · bin ${esc(it.e.bin)} · ${fmtDate(it.e.errorDate)}</small></div></td></tr>`
          : `<tr><td class="mono">${wkLabel(it.k)}</td><td><div class="two"><span style="color:var(--ok)">${icon("circle-check")} ${esc(it.f.type)}${it.f.error ? " · " + esc(it.f.error) : ""}${it.f.research ? " · pesquisa " + esc(it.f.research) : ""}</span><small>${fmtDate(it.f.date)}${it.f.by ? " · por " + esc(it.f.by) : ""}${it.f.note ? " · " + esc(it.f.note) : ""}</small></div></td></tr>`).join("")}
        </tbody></table></div></div>`,
      foot: `<button class="btn" data-act="new-action" data-login="${esc(o.login)}">${icon("list-checks")}Criar ação</button><button class="btn primary" data-act="new-fb" data-login="${esc(o.login)}" data-week="${o.lastKey}" data-error="${esc(o.lastError)}">${icon("message-square")}Registrar STU</button>`,
    });
  }

  // ---------- Feedbacks (STU) ----------
  VIEWS.feedbacks = {
    html() {
      const fbs = [...D.feedbacks].map((f) => ({ ...f, key: an.wkKey(f) })).sort((a, b) => b.key - a.key || String(b.date).localeCompare(String(a.date)));
      const waiting = an.offenders(ctx).filter((o) => o.prio !== "OK");
      const cov = an.stuCoverage(ctx).slice().reverse();
      const covCard = `<div class="card" style="margin-bottom:16px"><div class="card-head" style="padding-bottom:12px"><div><h2>Cobertura de STU por semana</h2><div class="sub">Semana sem STU registrado conta como feedback não realizado</div></div></div>
        <div class="table-wrap"><table><thead><tr><th>Semana</th><th>Status</th><th class="n">Associados com erro</th><th class="n">STU realizado</th><th class="n">Não realizado</th><th class="n">Cobertura</th><th class="n">STUs registrados</th><th>Pendentes</th></tr></thead><tbody>
        ${cov.map((c) => `<tr><td class="mono">${wkLabel(c.key)}</td><td>${stuStatus(c)}</td><td class="n">${c.associates || "—"}</td><td class="n">${c.associates ? c.done : "—"}</td><td class="n"${c.notDone ? ' style="color:var(--crit)"' : ""}>${c.associates ? c.notDone : "—"}</td><td class="n">${c.rate == null ? "—" : fmtPct(c.rate, 0)}</td><td class="n">${c.stuCount || "—"}</td><td>${c.pendingLogins.slice(0, 6).map((l) => tag(l)).join(" ")}${c.pendingLogins.length > 6 ? ` <span class="muted small">+${c.pendingLogins.length - 6}</span>` : ""}</td></tr>`).join("") || `<tr><td colspan="8" class="muted" style="text-align:center;padding:24px">Sem semanas na janela.</td></tr>`}
        </tbody></table></div></div>`;
      return `${head("Feedbacks (STU)", "Feedbacks aplicados, importados do export de STU do ONT Base ou registrados aqui. Um STU da semana do último erro (ou posterior) muda o associado para OK.",
        `<button class="btn" data-act="fb-template">${icon("download")}Modelo Excel</button><button class="btn primary" data-act="new-fb">${icon("plus")}Registrar STU</button>`)}
      ${covCard}
      <div class="grid g-fb">
        <div class="card"><div class="card-head" style="padding-bottom:12px"><div><h2>Histórico de STU</h2><div class="sub">${fbs.length} registro(s)</div></div></div>
          ${fbs.length ? `<div class="table-wrap"><table><thead><tr><th>Semana</th><th>Data</th><th>Associado</th><th>Gestor</th><th>Pesquisa</th><th>Aplicado por</th><th>Comentário</th><th></th></tr></thead><tbody>
          ${fbs.map((f) => `<tr><td class="mono">${wkLabel(f.key)}</td><td>${fmtDate(f.date)}</td><td>${tag(f.login)}</td><td class="mono">${esc(f.manager || "—")}</td><td class="mono small">${esc(f.research || f.error || "—")}</td><td class="mono">${esc(f.by || "—")}</td><td class="small" style="min-width:260px;max-width:420px">${f.type && f.type !== "STU" ? `<b>${esc(f.type)}</b> · ` : ""}${esc(f.note || "")}</td>
            <td style="white-space:nowrap"><button class="btn sm icon ghost" data-act="edit-fb" data-id="${f.id}" aria-label="Editar STU de ${esc(f.login)}">${icon("pencil")}</button><button class="btn sm icon ghost danger" data-act="del-fb" data-id="${f.id}" aria-label="Excluir STU de ${esc(f.login)}">${icon("trash-2")}</button></td></tr>`).join("")}
          </tbody></table></div>` : `<div class="empty"><div class="big">${icon("message-square")}</div><h2>Nenhum STU registrado</h2><p class="muted" style="margin:0;max-width:46ch">Registre aqui cada feedback aplicado, ou importe a planilha de STUs usando o modelo Excel.</p></div>`}
        </div>
        <div class="card"><div class="card-head"><div><h2>Aguardando STU</h2><div class="sub">${waiting.length} associado(s) na janela</div></div></div>
          <div class="card-body" style="display:grid;gap:8px">
          ${waiting.map((o) => `<div style="display:flex;align-items:center;gap:8px;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:8px">
              <span style="display:grid;gap:4px">${tag(o.login)}<span class="small muted">${esc(o.lastError)} · ${wkLabel(o.lastKey)}</span></span>
              <span style="display:flex;gap:6px;align-items:center">${prio(o.prio)}<button class="btn sm" data-act="new-fb" data-login="${esc(o.login)}" data-week="${o.lastKey}" data-error="${esc(o.lastError)}" aria-label="Registrar STU para ${esc(o.login)}">${icon("plus")}</button></span>
            </div>`).join("") || `<p class="muted small" style="margin:0">Todos os ofensores da janela já receberam STU.</p>`}
          </div></div>
      </div>`;
    },
  };

  function fbForm(pre = {}) {
    const logins = [...new Set(an.events(ctx).map((e) => e.login).filter(Boolean))].sort();
    const week = pre.key || pre.week || ctx.ref;
    const weeks = ctx.weeks.length ? ctx.weeks : [week];
    const isEdit = !!pre.id;
    drawer({
      eyebrow: "Feedbacks (STU)",
      title: isEdit ? "Editar STU" : "Registrar STU",
      body: `<form class="form" id="fb-form" autocomplete="off">
        <input type="hidden" name="id" value="${esc(pre.id || "")}">
        <label>Associado (login)<input type="text" name="login" list="dl-logins" required value="${esc(pre.login || "")}" spellcheck="false"></label>
        <datalist id="dl-logins">${logins.map((l) => `<option value="${esc(l)}">`).join("")}</datalist>
        <div class="row">
          <label>Semana IRDR referente<select name="week">${weeks.map((k) => opt(k, wkLong(k), week)).join("")}</select></label>
          <label>Data da aplicação<input type="date" name="date" value="${esc(pre.date || today())}" required></label>
        </div>
        <div class="row">
          <label>Tipo<select name="type">${["STU", "Feedback de alinhamento", "Re-treinamento", "Outro"].map((t) => opt(t, t, pre.type || "STU")).join("")}</select></label>
          <label>Aplicado por<input type="text" name="by" value="${esc(pre.by || "")}" placeholder="login de quem aplicou" spellcheck="false"></label>
        </div>
        <label>Erro referente<input type="text" name="error" value="${esc(pre.error || "")}"></label>
        <label>Observação<textarea name="note" rows="3">${esc(pre.note || "")}</textarea></label>
      </form>`,
      foot: `<button class="btn" data-act="close">Cancelar</button><button class="btn primary" data-act="save-fb">${isEdit ? "Salvar alterações" : "Registrar STU"}</button>`,
    });
    setTimeout(() => { const i = $("#fb-form [name=login]"); if (i && !i.value) i.focus(); }, 50);
  }

  async function saveFb() {
    const f = $("#fb-form");
    if (!f.reportValidity()) return;
    const v = Object.fromEntries(new FormData(f));
    const k = Number(v.week);
    const rec = { id: v.id || store.uid(), login: v.login.trim().toLowerCase(), wh: ctx.wh, year: Math.floor(k / 100), week: k % 100, date: v.date, type: v.type, by: v.by.trim().toLowerCase(), error: v.error.trim(), note: v.note.trim() };
    const i = D.feedbacks.findIndex((x) => x.id === rec.id);
    if (i >= 0) D.feedbacks[i] = { ...D.feedbacks[i], ...rec }; else D.feedbacks.push({ ...rec, source: "Manual" });
    await store.save("feedbacks");
    closeDrawer();
    toast(v.id ? "STU atualizado." : `STU registrado para ${rec.login}.`);
    render();
  }

  // ---------- Plano de ação ----------
  VIEWS.plano = {
    html() {
      const f = ui.plano;
      const acts = D.actions.filter((a) => f.status === "all" || (f.status === "open" ? a.status !== "Concluída" : a.status === "Concluída"))
        .sort((a, b) => (a.status === "Concluída") - (b.status === "Concluída") || an.PRIO_ORDER[a.priority] - an.PRIO_ORDER[b.priority] || (b.weekKey || 0) - (a.weekKey || 0));
      return `${head("Plano de ação", "Ações de feedback e melhoria por semana. Gere as sugestões a partir da priorização e ajuste o que for preciso.",
        `<button class="btn" data-act="suggest">${icon("sparkles")}Gerar ações de ${wkLabel(ctx.ref)}</button><button class="btn primary" data-act="new-action">${icon("plus")}Nova ação</button>`)}
      <div class="card">
        <div class="card-head" style="padding-bottom:14px"><div class="seg" role="group" aria-label="Status">${segBtn("plano.status", "open", "Abertas", f.status)}${segBtn("plano.status", "done", "Concluídas", f.status)}${segBtn("plano.status", "all", "Todas", f.status)}</div>
          <span class="small muted">${D.actions.filter((a) => a.status !== "Concluída").length} aberta(s) · ${D.actions.filter((a) => a.status === "Concluída").length} concluída(s)</span></div>
        ${acts.length ? `<div class="table-wrap"><table><thead><tr><th>Prioridade</th><th>Semana</th><th>Alvo</th><th>Ação</th><th>Responsável</th><th>Prazo</th><th>Status</th><th></th></tr></thead><tbody>
          ${acts.map((a) => `<tr>
            <td>${prio(a.priority)}</td><td class="mono">${wkLabel(a.weekKey)}</td>
            <td><div class="two">${a.scope === "Associado" ? tag(a.target) : `<span>${esc(a.target)}</span>`}<small>${esc(a.scope)}</small></div></td>
            <td style="max-width:420px">${esc(a.description)}</td>
            <td class="mono">${esc(a.owner || "—")}</td><td>${fmtDate(a.due)}</td>
            <td><label class="sr-only" for="st-${a.id}">Status</label><select id="st-${a.id}" class="status-sel" data-act-status="${a.id}">${["Aberta", "Em andamento", "Concluída"].map((s) => opt(s, s, a.status)).join("")}</select></td>
            <td style="white-space:nowrap"><button class="btn sm icon ghost" data-act="edit-action" data-id="${a.id}" aria-label="Editar ação">${icon("pencil")}</button><button class="btn sm icon ghost danger" data-act="del-action" data-id="${a.id}" aria-label="Excluir ação">${icon("trash-2")}</button></td></tr>`).join("")}
        </tbody></table></div>` : `<div class="empty"><div class="big">${icon("list-checks")}</div><h2>Nenhuma ação ${f.status === "done" ? "concluída" : "aberta"}</h2><p class="muted" style="margin:0;max-width:50ch">Use “Gerar ações de ${wkLabel(ctx.ref)}” para criar uma ação para cada ofensor que ainda precisa de STU e para o processo que mais concentrou erros.</p></div>`}
      </div>`;
    },
  };

  function actionForm(pre = {}) {
    drawer({
      eyebrow: "Plano de ação",
      title: pre.id ? "Editar ação" : "Nova ação",
      body: `<form class="form" id="act-form" autocomplete="off">
        <input type="hidden" name="id" value="${esc(pre.id || "")}">
        <div class="row">
          <label>Escopo<select name="scope">${["Associado", "Processo", "Área", "Pesquisa", "Outro"].map((s) => opt(s, s, pre.scope || "Associado")).join("")}</select></label>
          <label>Alvo<input type="text" name="target" required value="${esc(pre.target || "")}" placeholder="login, processo ou área"></label>
        </div>
        <label>Ação<textarea name="description" rows="4" required>${esc(pre.description || "")}</textarea></label>
        <div class="row">
          <label>Prioridade<select name="priority">${["CRITICA", "ALTA", "MEDIA", "OK"].map((p) => opt(p, PRIO_LABEL[p], pre.priority || "MEDIA")).join("")}</select></label>
          <label>Semana<select name="weekKey">${(ctx.weeks.length ? ctx.weeks : [ctx.ref]).map((k) => opt(k, wkLong(k), pre.weekKey || ctx.ref)).join("")}</select></label>
        </div>
        <div class="row">
          <label>Responsável<input type="text" name="owner" value="${esc(pre.owner || "")}" spellcheck="false"></label>
          <label>Prazo<input type="date" name="due" value="${esc(pre.due || "")}"></label>
        </div>
        <label>Status<select name="status">${["Aberta", "Em andamento", "Concluída"].map((s) => opt(s, s, pre.status || "Aberta")).join("")}</select></label>
      </form>`,
      foot: `<button class="btn" data-act="close">Cancelar</button><button class="btn primary" data-act="save-action">${pre.id ? "Salvar alterações" : "Criar ação"}</button>`,
    });
  }
  async function saveAction() {
    const f = $("#act-form");
    if (!f.reportValidity()) return;
    const v = Object.fromEntries(new FormData(f));
    const rec = { ...v, id: v.id || store.uid(), weekKey: Number(v.weekKey), target: v.target.trim(), createdAt: store.isoDateTime(new Date()) };
    const i = D.actions.findIndex((x) => x.id === rec.id);
    if (i >= 0) D.actions[i] = { ...D.actions[i], ...rec }; else D.actions.push(rec);
    await store.save("actions");
    closeDrawer();
    toast(v.id ? "Ação atualizada." : "Ação criada.");
    render();
  }
  async function suggest() {
    const sug = an.suggestedActions(ctx);
    const exists = new Set(D.actions.filter((a) => a.status !== "Concluída").map((a) => a.scope + "|" + a.target + "|" + a.weekKey));
    let n = 0;
    const due = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
    for (const s of sug) {
      if (exists.has(s.scope + "|" + s.target + "|" + ctx.ref)) continue;
      D.actions.push({ ...s, id: store.uid(), weekKey: ctx.ref, status: "Aberta", due, createdAt: store.isoDateTime(new Date()) });
      n++;
    }
    await store.save("actions");
    toast(n ? `${n} ação(ões) criada(s) para ${wkLabel(ctx.ref)}.` : "Nenhuma ação nova: as sugestões desta semana já estão no plano.");
    render();
  }

  // ---------- Importar ----------
  VIEWS.importar = {
    html() {
      const kinds = store.KINDS;
      const weeksOf = (k) => { const w = [...new Set(D[k].map((r) => an.wkKey(r)).filter((x) => x % 100))].sort((a, b) => a - b); return w.length ? w.map(wkLabel).join(" ") : "—"; };
      return `${head("Importar dados", "Arraste os exports do ONT Base em Excel (.xlsx) ou CSV. Reimportar a mesma semana atualiza os registros, sem duplicar.")}
      <div class="stack">
        <label class="drop" id="drop" for="file-in">
          <span class="big">${icon("upload")}</span>
          <h2>Solte as planilhas aqui</h2>
          <span class="muted">ou <u>escolha os arquivos</u> no computador · vários de uma vez</span>
          <input id="file-in" type="file" multiple accept=".xlsx,.xls,.csv,.txt" class="sr-only">
        </label>
        <div class="kinds">
          ${Object.entries(kinds).map(([k, v]) => `<div class="card kind"><span class="kpi-label">${esc(v.label)}</span><span class="k-n num">${fmtInt(D[k].length)}</span><span class="small muted">${k === "feedbacks" ? "registros" : "semanas: " + weeksOf(k)}</span><code>${esc(v.hint)}</code></div>`).join("")}
        </div>
        <div class="card"><div class="card-head" style="padding-bottom:12px"><div><h2>Histórico de importações</h2></div></div>
          ${D.imports.length ? `<div class="table-wrap"><table><thead><tr><th>Quando</th><th>Arquivo</th><th>Tipo</th><th>Semanas</th><th class="n">Novos</th><th class="n">Atualizados</th></tr></thead><tbody>
          ${D.imports.slice(0, 30).map((i) => `<tr><td class="mono small">${esc(i.at)}</td><td>${esc(i.file)}${i.sheet && !/\.csv$/i.test(i.file) ? ` <span class="muted small">(${esc(i.sheet)})</span>` : ""}</td><td>${esc(kinds[i.kind] ? kinds[i.kind].label : i.kind)}</td><td class="mono">${(i.weeks || []).map((w) => "S" + w).join(" ") || "—"}</td><td class="n">${i.added}</td><td class="n">${i.updated}</td></tr>`).join("")}
          </tbody></table></div>` : `<p class="muted" style="padding:0 18px 18px;margin:0">Nenhuma importação ainda.</p>`}
        </div>
        <div class="card"><div class="card-head"><div><h2>Seus dados</h2><div class="sub">Ficam salvos neste navegador, nesta máquina. Faça um backup para levar a outro computador.</div></div></div>
          <div class="card-body" style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn" data-act="backup">${icon("download")}Baixar backup (.json)</button>
            <label class="btn" for="restore-in">${icon("upload")}Restaurar backup</label><input id="restore-in" type="file" accept=".json" class="sr-only">
            ${IRDR.DEMO ? `<button class="btn" data-act="demo">${icon("sparkles")}Carregar dados de exemplo</button>` : ""}
            <button class="btn danger" data-act="clear">${icon("trash-2")}Apagar todos os dados</button>
          </div></div>
      </div>`;
    },
    after() {
      const drop = $("#drop");
      ["dragenter", "dragover"].forEach((e) => drop.addEventListener(e, (ev) => { ev.preventDefault(); drop.classList.add("over"); }));
      ["dragleave", "drop"].forEach((e) => drop.addEventListener(e, (ev) => { ev.preventDefault(); drop.classList.remove("over"); }));
      drop.addEventListener("drop", (ev) => doImport([...ev.dataTransfer.files]));
      $("#file-in").addEventListener("change", (ev) => doImport([...ev.target.files]));
      $("#restore-in").addEventListener("change", async (ev) => {
        const file = ev.target.files[0];
        if (!file) return;
        try { await store.restoreJson(await file.text()); toast("Backup restaurado."); render(); } catch (e) { toast(e.message, true); }
      });
    },
  };

  async function doImport(files) {
    if (!files.length) return;
    toast(`Lendo ${files.length} arquivo(s)…`);
    const res = await store.importFiles(files);
    for (const r of res) {
      if (r.ok) toast(`${r.file}: ${store.KINDS[r.kind].label}, ${r.added} novo(s), ${r.updated} atualizado(s).`);
      else toast(`${r.file}: ${r.msg}`, true);
    }
    // ao importar uma semana nova, ela vira a semana de referência
    const okWeeks = res.filter((r) => r.ok && r.kind !== "feedbacks").flatMap((r) => r.weeks);
    if (okWeeks.length) { D.settings.ref = 0; await store.save("settings"); }
    render();
  }

  // ---------- Glossário ----------
  // ---------- Glossário ----------
  // "Tote Adjacente (Adjacent Tote)" -> { pt: "Tote Adjacente", en: "Adjacent Tote" } (aceita parênteses aninhados)
  function splitPtEn(s) {
    s = String(s || "").trim();
    if (!s.endsWith(")")) return { pt: s, en: "" };
    let depth = 0;
    for (let i = s.length - 1; i >= 0; i--) {
      if (s[i] === ")") depth++;
      else if (s[i] === "(" && --depth === 0) return i > 0 ? { pt: s.slice(0, i).trim(), en: s.slice(i + 1, -1).trim() } : { pt: s, en: "" };
    }
    return { pt: s, en: "" };
  }
  const fold = (s) => [...String(s)].map((c) => c.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().slice(0, 1) || c).join("");
  // Escapa e destaca todas as ocorrências do termo (ignora acento e caixa)
  function hl(text, term) {
    text = String(text || "");
    if (!term) return esc(text);
    const f = fold(text), t = fold(term);
    let out = "", i = 0, j;
    while ((j = f.indexOf(t, i)) !== -1) { out += esc(text.slice(i, j)) + "<mark>" + esc(text.slice(j, j + t.length)) + "</mark>"; i = j + t.length; }
    return out + esc(text.slice(i));
  }
  const slug = (s) => fold(s).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  let GLOS = null;
  function glossary() {
    if (GLOS) return GLOS;
    const rows = (window.IRDR_GLOSSARY || []).map((g) => ({ ...g, p: splitPtEn(g.path), a: splitPtEn(g.area), e: splitPtEn(g.error) }));
    const paths = [];
    const byPath = new Map();
    for (const r of rows) {
      if (!byPath.has(r.path)) { byPath.set(r.path, new Map()); paths.push(r.path); }
      const m = byPath.get(r.path);
      if (!m.has(r.area)) m.set(r.area, []);
      m.get(r.area).push(r);
    }
    return (GLOS = { rows, paths, byPath, areas: new Set(rows.map((r) => r.path + "|" + r.area)).size });
  }
  IRDR.glossary = glossary;

  ui.glos = { tab: "defeitos", q: "", path: "", seen: "" };

  VIEWS.glossario = {
    html() {
      const f = ui.glos;
      const G = glossary();
      // Ocorrências nos dados importados (nomes em inglês do Completed Research):
      // casa Path + Area + Error; se a área não existir no catálogo, casa só Path + Error
      const k2 = (p, e) => fold(p) + "|" + fold(e);
      const k3 = (p, a, e) => k2(p, e) + "|" + fold(a);
      const known = new Set(G.rows.map((r) => k3(r.p.en || r.path, r.a.en || r.area, r.e.en || r.error)));
      const occ = new Map();
      const bump = (k) => occ.set(k, (occ.get(k) || 0) + 1);
      if (hasData()) for (const e of an.events(ctx)) { const k = k3(e.path, e.area, e.error); bump(known.has(k) ? k : k2(e.path, e.error)); }
      const occOf = (r) => (occ.get(k3(r.p.en || r.path, r.a.en || r.area, r.e.en || r.error)) || 0) + (occ.get(k2(r.p.en || r.path, r.e.en || r.error)) || 0);
      const seenTotal = G.rows.filter(occOf).length;
      const tabs = `<div class="seg" role="group" aria-label="Conteúdo do glossário">${segBtn("glos.tab", "defeitos", `Defeitos IRDR (${G.rows.length})`, f.tab)}${segBtn("glos.tab", "termos", "Termos e regras do sistema", f.tab)}</div>`;
      const top = head("Glossário", "Catálogo de causas-raiz de divergência da IRDR, por processo e subprocesso, e os termos usados nas análises.", "", { noRail: true, noExport: true, noBadge: true });
      if (f.tab === "termos") return `${top}<div class="stack">${tabs}${termsHtml()}</div>`;

      const q = f.q.trim();
      const t = fold(q);
      const match = (r) => !t || [r.path, r.area, r.error, r.definition].some((x) => fold(x).includes(t));
      const vis = G.rows.filter((r) => (!f.path || r.path === f.path) && (!f.seen || occOf(r)) && match(r));
      const visSet = new Set(vis);
      const pathCode = new Map(G.paths.map((p, i) => [p, String(i + 1).padStart(2, "0")]));
      const filtered = q || f.path || f.seen;

      const stats = [
        ["layers", "t-blue", "Processos", G.paths.length, "Path de origem do defeito"],
        ["boxes", "t-purple", "Subprocessos", G.areas, "Áreas dentro de cada processo"],
        ["book-open", "t-teal", "Tipos de defeito", G.rows.length, "Definições traduzidas para PT-BR"],
        ["scan-barcode", "t-amber", "Vistos nos seus dados", seenTotal, hasData() ? "Defeitos com ocorrência nas pesquisas importadas" : "Importe pesquisas para cruzar"],
      ];

      const nav = G.paths.map((p) => {
        const n = [...G.byPath.get(p).values()].flat().filter((r) => visSet.has(r)).length;
        const pe = splitPtEn(p);
        return `<button class="gl-nav-item" data-act="glos-jump" data-id="gl-${slug(p)}"${n ? "" : " disabled"}><span class="code">${pathCode.get(p)}</span><span class="lbl">${esc(pe.pt)}</span><span class="cnt">${n}</span></button>`;
      }).join("");

      const sections = G.paths.map((p) => {
        const areas = [...G.byPath.get(p).entries()].map(([a, list]) => [a, list.filter((r) => visSet.has(r))]).filter(([, l]) => l.length);
        if (!areas.length) return "";
        const pe = splitPtEn(p);
        const n = areas.reduce((s, [, l]) => s + l.length, 0);
        return `<section class="card gl-proc" id="gl-${slug(p)}">
          <div class="gl-proc-head"><span class="gl-code">${pathCode.get(p)}</span><div><h2>${hl(pe.pt, q)}</h2>${pe.en ? `<small translate="no">${hl(pe.en, q)}</small>` : ""}</div><span class="badge">${n} defeito${n === 1 ? "" : "s"}</span></div>
          ${areas.map(([a, list]) => { const ae = splitPtEn(a); return `<div class="gl-sub">
            <div class="gl-sub-head"><h3>${hl(ae.pt, q)}</h3>${ae.en ? `<span class="en" translate="no">${hl(ae.en, q)}</span>` : ""}<span class="cnt">${list.length}</span></div>
            <div class="gl-grid">${list.map((r) => { const o = occOf(r); return `<article class="gl-card${o ? " seen" : ""}">
              <div class="gl-card-top"><div><h4>${hl(r.e.pt, q)}</h4>${r.e.en ? `<span class="en" translate="no">${hl(r.e.en, q)}</span>` : ""}</div>${o ? `<span class="gl-occ" title="Ocorrências nas pesquisas importadas">${icon("scan-barcode")}${o}×</span>` : ""}</div>
              <p>${hl(r.definition, q)}</p></article>`; }).join("")}</div></div>`; }).join("")}
        </section>`;
      }).join("");

      return `${top}
      <div class="stack">
        ${tabs}
        <div class="grid g-kpi gl-stats">${stats.map(([ic, tone, l, v, foot]) => `<div class="card kpi"><div class="kpi-top"><span class="ico ${tone}">${icon(ic)}</span></div><span class="kpi-label">${l}</span><div class="kpi-row"><span class="kpi-value">${v}</span></div><span class="kpi-foot">${foot}</span></div>`).join("")}</div>
        <div class="card gl-bar"><div class="filters">
          ${search("glos.q", f.q, "Buscar termo em PT ou EN (ex.: Wrong ASIN, Devolução, Bin Etiquette)")}
          <label class="sr-only" for="gl-path">Processo</label><select id="gl-path" data-f="glos.path"><option value="">Todos os processos</option>${G.paths.map((p) => opt(p, splitPtEn(p).pt, f.path)).join("")}</select>
          <button class="btn sm${f.seen ? " primary" : ""}" data-act="glos-seen" aria-pressed="${!!f.seen}" ${hasData() ? "" : "disabled"}>${icon("scan-barcode")}Só vistos nos dados</button>
          ${filtered ? `<button class="btn sm ghost" data-act="glos-clear">${icon("x")}Limpar</button>` : ""}
          <span class="gl-count"><b>${vis.length}</b> de ${G.rows.length} definições</span>
        </div></div>
        <div class="gl-layout">
          <nav class="card gl-nav" aria-label="Processos do glossário"><div class="gl-nav-title">Processos</div>${nav}</nav>
          <div class="gl-main">${sections || `<div class="card"><div class="empty"><div class="big">${icon("search")}</div><h2>Nenhum resultado encontrado</h2><p class="muted" style="margin:0">Tente outro termo ou limpe os filtros.</p><button class="btn" data-act="glos-clear">${icon("x")}Limpar filtros</button></div></div>`}</div>
        </div>
      </div>`;
    },
    after() {
      const items = [...document.querySelectorAll(".gl-nav-item")];
      const secs = [...document.querySelectorAll(".gl-proc")];
      if (!items.length || !secs.length || !window.IntersectionObserver) return;
      const io = new IntersectionObserver((ents) => {
        for (const en of ents) if (en.isIntersecting) items.forEach((b) => b.classList.toggle("active", b.dataset.id === en.target.id));
      }, { rootMargin: "-90px 0px -65% 0px" });
      secs.forEach((s) => io.observe(s));
    },
  };

  function termsHtml() {
    const ev = hasData() ? an.events(ctx) : [];
    const tree = new Map();
    for (const e of ev) {
      const k = e.path + " › " + e.area;
      if (!tree.has(k)) tree.set(k, new Map());
      tree.get(k).set(e.error, (tree.get(k).get(e.error) || 0) + 1);
    }
      const terms = [
        ["IRDR", "Contagem oficial semanal de inventário. Cada divergência encontrada vira um registro defeituoso e passa por pesquisa de causa raiz."],
        ["DPMO", "Defeitos por milhão: registros defeituosos ÷ registros contados × 1.000.000. Calculado por pick area e somado para o FC."],
        ["Registro contado", "Cada combinação bin + item verificada na contagem (Counted Records)."],
        ["Registro defeituoso", "Registro em que a quantidade contada difere da esperada (Defective Records)."],
        ["Found / Missing", "Sobra (contado maior que o esperado) ou falta (contado menor que o esperado)."],
        ["Net Zero (NZ)", "Divergências no mesmo bin que se compensam em quantidade, como uma sobra de um item e falta de outro."],
        ["Double Defect (DD)", "Bin com mais de um registro defeituoso na mesma contagem."],
        ["Path / Area / Error", "Processo de origem do erro (ex.: Stow, Receive), a sub-área (ex.: Each Stow, Case/Pallet) e o tipo de erro (ex.: Wrong Bin)."],
        ["Ofensor", "Login do associado apontado pela pesquisa como causador do erro (Error Login). Unknown Problem não tem ofensor."],
        ["STU", "Feedback formal aplicado ao associado sobre o erro, vindo do export de STU do ONT Base ou registrado na aba Feedbacks. Semana sem STU registrado conta como feedback não realizado."],
        ["Erro (contagem do sistema)", "Uma pesquisa pode gerar duas linhas (par NZ no mesmo bin). O sistema conta 1 erro por associado + semana + bin + tipo de erro."],
        ["Pesquisa pendente", "Registro DD/NZ que ainda não aparece no Completed Research. Por isso o total pesquisado pode ficar abaixo do oficial até as pesquisas fecharem."],
      ];
      return `
        <div class="card"><div class="card-head"><h2>Regra de prioridade</h2></div><div class="card-body">
          <div class="table-wrap"><table><tbody>
            <tr><td>${prio("CRITICA")}</td><td>Reincidente que já recebeu feedback: errou de novo depois de um STU. Um STU de semana anterior conta como erro anterior, mesmo sem a pesquisa daquela semana importada.</td></tr>
            <tr><td>${prio("ALTA")}</td><td>Reincidente (2 ou mais erros no histórico) ainda sem feedback.</td></tr>
            <tr><td>${prio("MEDIA")}</td><td>Primeiro erro, ainda sem STU.</td></tr>
            <tr><td>${prio("OK")}</td><td>STU aplicado na semana do último erro ou depois.</td></tr>
          </tbody></table></div></div></div>
        <div class="card"><div class="card-head"><h2>Termos</h2></div><div class="card-body"><dl class="dl" style="grid-template-columns:200px 1fr">${terms.map(([t, d]) => `<dt><b style="color:var(--ink)">${t}</b></dt><dd>${d}</dd>`).join("")}</dl></div></div>
        ${tree.size ? `<div class="card"><div class="card-head"><div><h2>Erros encontrados nos dados</h2><div class="sub">Processo › área e tipos de erro, com ocorrências em todo o histórico</div></div></div>
          <div class="card-body flush"><div class="table-wrap"><table><thead><tr><th>Processo › Área</th><th>Tipos de erro</th></tr></thead><tbody>
          ${[...tree.entries()].sort().map(([k, m]) => `<tr><td>${esc(k)}</td><td>${[...m.entries()].map(([e, n]) => `${esc(e)} <span class="muted">(${n})</span>`).join(", ")}</td></tr>`).join("")}
          </tbody></table></div></div></div>` : ""}`;
  }

  // ---------- Drawer ----------
  let lastFocus = null;
  function drawer({ eyebrow, title, titleHtml, body, foot }) {
    closeDrawer(true);
    lastFocus = document.activeElement;
    const wrap = document.createElement("div");
    wrap.id = "drawer-root";
    wrap.innerHTML = `<div class="scrim" data-act="close"></div>
      <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="dr-title">
        <div class="drawer-head"><div><div class="eyebrow">${esc(eyebrow || "")}</div><h2 id="dr-title" style="font-size:18px">${titleHtml || esc(title)}</h2></div>
          <button class="btn icon ghost" data-act="close" aria-label="Fechar">${icon("x")}</button></div>
        <div class="drawer-body">${body}</div>
        ${foot ? `<div class="drawer-foot">${foot}</div>` : ""}
      </aside>`;
    document.body.appendChild(wrap);
    requestAnimationFrame(() => { wrap.querySelector(".scrim").classList.add("on"); wrap.querySelector(".drawer").classList.add("on"); wrap.querySelector(".drawer [data-act=close]").focus(); });
  }
  function closeDrawer(silent) {
    const w = $("#drawer-root");
    if (w) w.remove();
    if (!silent && lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  // Confirmação dentro da página (o navegador embutido do projeto não mostra confirm())
  function ask(msg, okLabel) {
    return new Promise((resolve) => {
      const prev = document.activeElement;
      const w = document.createElement("div");
      w.innerHTML = `<div class="scrim on"></div><div class="confirm" role="alertdialog" aria-modal="true" aria-labelledby="cf-msg">
        <p id="cf-msg">${esc(msg)}</p>
        <div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn" data-cf="0">Cancelar</button><button class="btn primary danger-fill" data-cf="1">${esc(okLabel)}</button></div></div>`;
      document.body.appendChild(w);
      const done = (v) => { w.remove(); document.removeEventListener("keydown", onKey, true); if (prev) prev.focus(); resolve(v); };
      const onKey = (e) => { if (e.key === "Escape") { e.stopPropagation(); done(false); } };
      document.addEventListener("keydown", onKey, true);
      w.addEventListener("click", (e) => { const b = e.target.closest("[data-cf]"); if (b) done(b.dataset.cf === "1"); else if (e.target.classList.contains("scrim")) done(false); });
      w.querySelector('[data-cf="0"]').focus();
    });
  }

  // ---------- Dados de exemplo (versão publicada no projeto) ----------
  const DEMO = ["ONT Base(10).csv", "ONT Base(11).csv", "ONT Base(12).csv", "ONT Base(13).csv", "ONT Base(14).csv"];
  const canFetch = () => /^https?:$/.test(location.protocol);
  async function loadDemo() {
    const files = [];
    for (const n of DEMO) {
      try { const r = await fetch("exemplos/ont-base-" + n.match(/\d+/)[0] + ".csv"); if (r.ok) files.push(new File([await r.text()], n, { type: "text/csv" })); } catch (e) {}
    }
    if (!files.length) return false;
    await store.importFiles(files);
    return true;
  }
  IRDR.loadDemo = loadDemo;

  // ---------- Eventos ----------
  document.addEventListener("click", async (ev) => {
    const seg = ev.target.closest("[data-seg]");
    if (seg) { const [v, k] = seg.dataset.seg.split("."); ui[v === "erros" ? "erros" : v][k] = seg.dataset.v; return render(); }
    const wk = ev.target.closest("[data-week]:not([data-act])");
    if (wk && wk.classList.contains("rail-cell")) { D.settings.ref = Number(wk.dataset.week); await store.save("settings"); return render(); }
    const wn = ev.target.closest("[data-window]");
    if (wn) { D.settings.window = wn.dataset.window; await store.save("settings"); return render(); }
    const el = ev.target.closest("[data-act]");
    if (!el) return;
    const a = el.dataset.act;
    switch (a) {
      case "close": return closeDrawer();
      case "theme": {
        const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = t;
        try { localStorage.setItem("irdr-theme", t); } catch (e) {}
        return render();
      }
      case "goto-prio": ui.ofs.prio = el.dataset.prio; location.hash = "#ofensores"; return;
      case "filter-prio": ui.ofs.prio = ui.ofs.prio === el.dataset.prio ? "" : el.dataset.prio; return render();
      case "open-research": return openResearch(IRDR._erRows[Number(el.dataset.i)]);
      case "open-off": if (ev.target.closest("button")) return; return openOffender(el.dataset.login);
      case "new-fb": return fbForm({ login: el.dataset.login, week: Number(el.dataset.week) || ctx.ref, error: el.dataset.error });
      case "edit-fb": return fbForm({ ...D.feedbacks.find((f) => f.id === el.dataset.id), key: an.wkKey(D.feedbacks.find((f) => f.id === el.dataset.id)) });
      case "save-fb": return saveFb();
      case "del-fb": {
        const f = D.feedbacks.find((x) => x.id === el.dataset.id);
        if (!f || !(await ask(`Excluir o STU de ${f.login} (${fmtDate(f.date)})?`, "Excluir STU"))) return;
        D.feedbacks = D.feedbacks.filter((x) => x.id !== f.id);
        store.data.feedbacks = D.feedbacks;
        await store.save("feedbacks"); toast("STU excluído."); return render();
      }
      case "fb-template": return IRDR.exp.feedbackTemplate();
      case "new-action": {
        const o = el.dataset.login ? an.offenders(ctx).find((x) => x.login === el.dataset.login) : null;
        const s = o ? an.suggestedActions(ctx).find((x) => x.target === o.login) : null;
        return actionForm(o ? { scope: "Associado", target: o.login, owner: o.manager, priority: o.prio, description: s ? s.description : "" } : {});
      }
      case "edit-action": return actionForm(D.actions.find((x) => x.id === el.dataset.id));
      case "save-action": return saveAction();
      case "del-action": {
        if (!(await ask("Excluir esta ação do plano?", "Excluir ação"))) return;
        D.actions = D.actions.filter((x) => x.id !== el.dataset.id);
        store.data.actions = D.actions;
        await store.save("actions"); toast("Ação excluída."); return render();
      }
      case "glos-jump": { const t = document.getElementById(el.dataset.id); if (t) t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); return; }
      case "glos-seen": ui.glos.seen = ui.glos.seen ? "" : "1"; return render();
      case "glos-clear": Object.assign(ui.glos, { q: "", path: "", seen: "" }); return render();
      case "suggest": return suggest();
      case "demo": el.disabled = true; if (await loadDemo()) { toast("Dados de exemplo carregados (CNF2, S35–S41)."); D.settings.ref = 0; await store.save("settings"); render(); } else { toast("Não foi possível carregar os exemplos.", true); el.disabled = false; } return;
      case "backup": return IRDR.exp.download(new Blob([store.backupJson()], { type: "application/json" }), `IRDR_backup_${today()}.json`);
      case "clear":
        if (!(await ask("Apagar todos os dados importados, STUs e ações deste navegador? Faça um backup antes, se precisar.", "Apagar tudo"))) return;
        await store.clearAll(); toast("Dados apagados."); return render();
      case "export-pdf": el.disabled = true; try { await IRDR.exp.pdf(ctx); toast("Relatório PDF gerado."); } catch (e) { console.error(e); toast("Falha ao gerar o PDF: " + e.message, true); } el.disabled = false; return;
      case "export-xlsx": try { IRDR.exp.xlsx(ctx); toast("Planilha Excel gerada."); } catch (e) { console.error(e); toast("Falha ao gerar o Excel: " + e.message, true); } return;
    }
  });

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && $("#drawer-root")) return closeDrawer();
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "k") { ev.preventDefault(); const q = $("#global-q"); if (q) q.focus(); return; }
    if (ev.key === "Enter" && ev.target.id === "global-q") {
      Object.assign(ui.erros, { q: ev.target.value.trim(), tab: "research", scope: "win", path: "", area: "", error: "", manager: "" });
      if (location.hash === "#erros") render(); else location.hash = "#erros";
      return;
    }
    if ((ev.key === "Enter" || ev.key === " ") && ev.target.matches("tr.click")) { ev.preventDefault(); ev.target.click(); }
  });

  let qTimer;
  document.addEventListener("input", (ev) => {
    const el = ev.target;
    if (el.dataset.f && el.type === "search") {
      clearTimeout(qTimer);
      qTimer = setTimeout(() => {
        const [v, k] = el.dataset.f.split(".");
        ui[v][k] = el.value;
        const pos = el.selectionStart, id = el.id;
        render();
        const n = document.getElementById(id);
        if (n) { n.focus(); n.setSelectionRange(pos, pos); }
      }, 180);
    }
  });
  document.addEventListener("change", async (ev) => {
    const el = ev.target;
    if (el.dataset.set) { D.settings[el.dataset.set] = el.value; if (el.dataset.set === "wh") D.settings.ref = 0; await store.save("settings"); return render(); }
    if (el.dataset.f && el.tagName === "SELECT") { const [v, k] = el.dataset.f.split("."); ui[v][k] = el.value; return render(); }
    if (el.dataset.actStatus) {
      const a = D.actions.find((x) => x.id === el.dataset.actStatus);
      if (a) { a.status = el.value; a.updatedAt = store.isoDateTime(new Date()); await store.save("actions"); toast(`Status: ${el.value}.`); render(); }
    }
  });
  window.addEventListener("hashchange", () => { closeDrawer(true); render(); window.scrollTo(0, 0); });

  // ---------- boot ----------
  (async function boot() {
    try { const t = localStorage.getItem("irdr-theme"); if (t) document.documentElement.dataset.theme = t; else if (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.dataset.theme = "dark"; } catch (e) {}
    await store.load();
    if (!D.settings.window) D.settings.window = "6";
    render();
    if (IRDR.storageWarning) toast("O navegador bloqueou o armazenamento local: os dados valem só enquanto a página estiver aberta.", true);
  })();
})();
