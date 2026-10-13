/* IRDR | ANALISES — regras de análise.
   Prioridade do ofensor (mesma regra da skill "Relatório IRDR"):
     CRÍTICA = reincidente que já recebeu feedback (errou de novo depois do STU)
     ALTA    = reincidente sem feedback
     MÉDIA   = 1º erro, ainda sem STU
     OK      = STU aplicado depois do último erro */
(function () {
  const IRDR = (window.IRDR = window.IRDR || {});
  const S = () => IRDR.store.data;

  const wkKey = (r) => (r.year || 0) * 100 + (r.week || 0);
  const wkLabel = (k) => (k ? "S" + String(k % 100).padStart(2, "0") : "—");
  const wkLong = (k) => (k ? `Semana ${k % 100} · ${Math.floor(k / 100)}` : "—");
  const PRIO_ORDER = { CRITICA: 0, ALTA: 1, MEDIA: 2, OK: 3 };
  const PRIO_LABEL = { CRITICA: "CRÍTICA", ALTA: "ALTA", MEDIA: "MÉDIA", OK: "OK" };

  function warehouses() {
    const s = new Set();
    for (const k of ["overview", "defects", "research"]) for (const r of S()[k]) if (r.wh) s.add(r.wh);
    return [...s].sort();
  }
  const byWh = (arr, wh) => (wh ? arr.filter((r) => !r.wh || r.wh === wh) : arr);

  function allWeeks(wh) {
    const s = new Set();
    for (const k of ["overview", "defects", "research"]) for (const r of byWh(S()[k], wh)) if (r.week) s.add(wkKey(r));
    return [...s].sort((a, b) => a - b);
  }

  // Contexto atual de análise: FC, semana de referência e janela (nº de semanas)
  function context(settings) {
    const whs = warehouses();
    const wh = settings.wh && whs.includes(settings.wh) ? settings.wh : whs[0] || "";
    const weeks = allWeeks(wh);
    const ref = settings.ref && weeks.includes(settings.ref) ? settings.ref : weeks[weeks.length - 1] || 0;
    const n = settings.window === "all" ? Infinity : Number(settings.window) || 6;
    const upto = weeks.filter((k) => k <= ref);
    const win = upto.slice(Math.max(0, upto.length - n));
    const prev = upto.length > 1 ? upto[upto.length - 2] : 0;
    return { wh, whs, weeks, ref, prev, win, winSet: new Set(win), n };
  }

  // ---------- Erros (eventos) ----------
  // Uma pesquisa pode gerar 2 linhas (par Net Zero no mesmo bin). Contamos 1 erro por
  // associado + semana + bin + tipo de erro, para não dobrar a reincidência.
  const evCache = new WeakMap();
  function events(ctx) {
    if (evCache.has(ctx)) return evCache.get(ctx);
    const rows = byWh(S().research, ctx.wh);
    const pickByKey = new Map(byWh(S().defects, ctx.wh).map((d) => [[wkKey(d), d.bin, d.fnsku].join("|"), d.pickArea]));
    const seen = new Map();
    for (const r of rows) {
      const k = wkKey(r);
      const id = [r.login || "—", k, r.bin, r.error].join("|");
      if (!seen.has(id)) {
        seen.set(id, {
          ...r,
          key: k,
          pickArea: pickByKey.get([k, r.bin, r.fnsku].join("|")) || "",
          rows: 1,
          units: Math.abs((r.countQ || 0) - (r.expQ || 0)),
        });
      } else {
        const e = seen.get(id);
        e.rows++;
        e.units += Math.abs((r.countQ || 0) - (r.expQ || 0));
      }
    }
    const list = [...seen.values()];
    evCache.set(ctx, list);
    return list;
  }

  function researchRows(ctx, keys) {
    const pickByKey = new Map(byWh(S().defects, ctx.wh).map((d) => [[wkKey(d), d.bin, d.fnsku].join("|"), d.pickArea]));
    return byWh(S().research, ctx.wh)
      .filter((r) => keys.has(wkKey(r)))
      .map((r) => ({ ...r, key: wkKey(r), pickArea: pickByKey.get([wkKey(r), r.bin, r.fnsku].join("|")) || "" }));
  }
  const defectRows = (ctx, keys) => byWh(S().defects, ctx.wh).filter((r) => keys.has(wkKey(r))).map((r) => ({ ...r, key: wkKey(r) }));

  // ---------- Resumo da semana ----------
  function weekSummary(ctx, key) {
    if (!key) return null;
    const ov = byWh(S().overview, ctx.wh).filter((r) => wkKey(r) === key);
    const counted = sum(ov, "countedRecords");
    const defectsOv = sum(ov, "defects");
    const df = byWh(S().defects, ctx.wh).filter((r) => wkKey(r) === key);
    const rs = byWh(S().research, ctx.wh).filter((r) => wkKey(r) === key);
    const ev = events(ctx).filter((e) => e.key === key);
    const researched = new Set(rs.map((r) => r.bin + "|" + r.fnsku));
    const pending = df.filter((d) => !researched.has(d.bin + "|" + d.fnsku)).length;
    const attributed = ev.filter((e) => e.login);
    return {
      key,
      hasOverview: ov.length > 0,
      countedBins: sum(ov, "countedBins"),
      counted: ov.length ? counted : null,
      expected: sum(ov, "expectedRecords"),
      defects: ov.length ? defectsOv : df.length,
      dpmo: counted ? (defectsOv / counted) * 1e6 : null,
      accuracy: counted ? 1 - defectsOv / counted : null,
      qtyCounted: sum(ov, "countedQty"),
      qtyExpected: sum(ov, "expectedQty"),
      defectRecords: df.length,
      nz: df.filter((d) => d.nz).length,
      dd: df.filter((d) => d.dd).length,
      found: df.filter((d) => /found/i.test(d.mf)).length,
      missing: df.filter((d) => /missing/i.test(d.mf)).length,
      unitsFound: df.filter((d) => d.cntQty > d.expQty).reduce((a, d) => a + d.cntQty - d.expQty, 0),
      unitsMissing: df.filter((d) => d.cntQty < d.expQty).reduce((a, d) => a + d.expQty - d.cntQty, 0),
      researchRows: rs.length,
      errors: ev.length,
      attributed: attributed.length,
      unknown: ev.length - attributed.length,
      associates: new Set(attributed.map((e) => e.login)).size,
      pending,
    };
  }

  // ---------- DPMO por Pick Area ----------
  function areaMatrix(ctx) {
    const ov = byWh(S().overview, ctx.wh).filter((r) => ctx.winSet.has(wkKey(r)));
    const df = byWh(S().defects, ctx.wh).filter((r) => ctx.winSet.has(wkKey(r)));
    const areas = [...new Set([...ov.map((r) => r.pickArea), ...df.map((r) => r.pickArea)].filter(Boolean))].sort();
    return areas.map((a) => {
      const cells = {};
      for (const k of ctx.win) {
        const rows = ov.filter((r) => r.pickArea === a && wkKey(r) === k);
        const c = sum(rows, "countedRecords"), d = sum(rows, "defects");
        const dRows = df.filter((r) => r.pickArea === a && wkKey(r) === k);
        cells[k] = { counted: rows.length ? c : null, defects: rows.length ? d : dRows.length, dpmo: c ? (d / c) * 1e6 : null, nz: dRows.filter((x) => x.nz).length, dd: dRows.filter((x) => x.dd).length, bins: rows.length ? sum(rows, "countedBins") : null };
      }
      const tc = ctx.win.reduce((s, k) => s + cells[k].counted, 0), td = ctx.win.reduce((s, k) => s + (cells[k].counted ? cells[k].defects : 0), 0);
      return { area: a, cells, dpmo: tc ? (td / tc) * 1e6 : null, counted: tc, defects: ctx.win.reduce((s, k) => s + cells[k].defects, 0) };
    });
  }

  // ---------- Ofensores ----------
  function feedbacksFor(login) {
    return S().feedbacks.filter((f) => f.login === login).map((f) => ({ ...f, key: wkKey(f) })).sort((a, b) => a.key - b.key || String(a.date).localeCompare(String(b.date)));
  }

  function priorityOf(evKeys, fbKeys) {
    // evKeys: semanas (com repetição) dos erros; fbKeys: semanas dos feedbacks
    if (!evKeys.length) return null;
    const last = Math.max(...evKeys);
    if (fbKeys.some((k) => k >= last)) return "OK";
    // Um STU anterior ao último erro também prova um erro anterior (o STU só existe porque houve erro),
    // mesmo que a pesquisa daquela semana não tenha sido importada.
    const reinc = evKeys.length >= 2 || fbKeys.some((k) => k < last);
    if (reinc && fbKeys.some((k) => k < last)) return "CRITICA";
    if (reinc) return "ALTA";
    return "MEDIA";
  }

  function offenders(ctx) {
    const ev = events(ctx).filter((e) => e.login && e.key <= ctx.ref);
    const map = new Map();
    for (const e of ev) {
      if (!map.has(e.login)) map.set(e.login, { login: e.login, all: [], win: [] });
      const o = map.get(e.login);
      o.all.push(e);
      if (ctx.winSet.has(e.key)) o.win.push(e);
    }
    const out = [];
    for (const o of map.values()) {
      if (!o.win.length) continue;
      o.all.sort((a, b) => a.key - b.key);
      const latest = o.all[o.all.length - 1];
      const fbs = feedbacksFor(o.login).filter((f) => f.key <= ctx.ref || !f.key);
      const fbKeys = fbs.map((f) => f.key || ctx.ref);
      const prio = priorityOf(o.all.map((e) => e.key), fbKeys);
      out.push({
        login: o.login,
        manager: latest.manager,
        tenure: latest.tenure,
        total: o.all.length,
        inWindow: o.win.length,
        inRef: o.win.filter((e) => e.key === ctx.ref).length,
        weeks: [...new Set(o.all.map((e) => e.key))],
        paths: countBy(o.win, "path"),
        errors: countBy(o.win, "error"),
        lastKey: latest.key,
        lastError: latest.error,
        lastPath: latest.path,
        feedbacks: fbs,
        lastFeedback: fbs[fbs.length - 1] || null,
        reincident: o.all.length >= 2 || fbKeys.some((k) => k < latest.key),
        stuPending: [...new Set(o.win.map((e) => e.key))].filter((k) => !fbKeys.some((f) => f >= k)),
        prio,
        events: o.all,
      });
    }
    out.sort((a, b) => PRIO_ORDER[a.prio] - PRIO_ORDER[b.prio] || b.inWindow - a.inWindow || b.total - a.total || a.login.localeCompare(b.login));
    return out;
  }

  function managers(ctx, offs) {
    const m = new Map();
    for (const o of offs) {
      const k = o.manager || "—";
      if (!m.has(k)) m.set(k, { manager: k, associates: 0, errors: 0, CRITICA: 0, ALTA: 0, MEDIA: 0, OK: 0 });
      const r = m.get(k);
      r.associates++;
      r.errors += o.inWindow;
      r[o.prio]++;
    }
    return [...m.values()].sort((a, b) => b.CRITICA - a.CRITICA || b.ALTA - a.ALTA || b.errors - a.errors);
  }

  // ---------- Cobertura de STU por semana ----------
  // Para cada semana: associados com erro e quantos receberam STU daquela semana (ou posterior).
  // Semana sem STU registrado = feedback não realizado.
  function stuCoverage(ctx) {
    const ev = events(ctx).filter((e) => e.login);
    const fbAll = S().feedbacks.map((f) => ({ ...f, key: wkKey(f) }));
    const keys = [...new Set([...ctx.win, ...fbAll.filter((f) => f.key <= ctx.ref).map((f) => f.key)])].sort((a, b) => a - b);
    return keys.map((k) => {
      const logins = [...new Set(ev.filter((e) => e.key === k).map((e) => e.login))];
      const stuWeek = fbAll.filter((f) => f.key === k);
      const done = logins.filter((l) => fbAll.some((f) => f.login === l && f.key >= k));
      return { key: k, inWindow: ctx.winSet.has(k), associates: logins.length, done: done.length, notDone: logins.length - done.length, pendingLogins: logins.filter((l) => !done.includes(l)), stuCount: stuWeek.length, stuAssociates: new Set(stuWeek.map((f) => f.login)).size, rate: logins.length ? done.length / logins.length : null };
    });
  }

  // ---------- Séries por semana ----------
  function trend(ctx) {
    const ev = events(ctx);
    return ctx.win.map((k) => {
      const s = weekSummary(ctx, k);
      const e = ev.filter((x) => x.key === k);
      return { key: k, dpmo: s.dpmo, defects: s.defects, counted: s.counted, errors: e.length, unknown: e.filter((x) => !x.login).length, byPath: countBy(e, "path") };
    });
  }

  // ---------- Insights automáticos ----------
  function insights(ctx) {
    const out = [];
    const cur = weekSummary(ctx, ctx.ref);
    const prv = ctx.prev ? weekSummary(ctx, ctx.prev) : null;
    if (!cur) return out;
    if (cur.dpmo != null && prv && prv.dpmo != null && prv.dpmo > 0) {
      const d = (cur.dpmo - prv.dpmo) / prv.dpmo;
      out.push({ icon: d > 0 ? "arrow-up-right" : "arrow-down-right", html: `DPMO ${d > 0 ? "subiu" : "caiu"} <b>${fmtPct(Math.abs(d), 0)}</b> vs ${wkLabel(ctx.prev)} (${fmtInt(prv.dpmo)} → ${fmtInt(cur.dpmo)}).` });
    } else if (cur.dpmo == null) {
      out.push({ icon: "info", html: `Sem DPMO para ${wkLabel(ctx.ref)}: importe o export de <b>Pick Area</b> desta semana.` });
    }
    const ev = events(ctx).filter((e) => e.key === ctx.ref);
    if (ev.length) {
      const paths = countBy(ev, "path");
      const [p, n] = paths[0];
      out.push({ icon: "circle-dot", html: `<b>${esc(p)}</b> concentra ${fmtPct(n / ev.length, 0)} dos erros da semana (${n} de ${ev.length}).` });
      const errs = countBy(ev, "error");
      out.push({ icon: "circle-dot", html: `Erro mais frequente: <b>${esc(errs[0][0])}</b> (${errs[0][1]}).` });
      const unk = ev.filter((e) => !e.login).length;
      if (unk) out.push({ icon: "triangle-alert", html: `<b>${unk}</b> erro(s) sem ofensor identificado (Unknown Problem).` });
    }
    const offs = offenders(ctx);
    const crit = offs.filter((o) => o.prio === "CRITICA");
    if (crit.length) out.push({ icon: "triangle-alert", html: `<b>${crit.length}</b> associado(s) em prioridade CRÍTICA: ${crit.slice(0, 4).map((o) => esc(o.login)).join(", ")}${crit.length > 4 ? "…" : ""}.` });
    const cov = stuCoverage(ctx).find((c) => c.key === ctx.ref);
    if (cov && cov.associates) out.push({ icon: "message-square", html: cov.done ? `STU de ${wkLabel(ctx.ref)}: <b>${cov.done} de ${cov.associates}</b> associado(s) com feedback realizado.` : `STU de ${wkLabel(ctx.ref)} <b>não realizado</b>: ${cov.associates} associado(s) com erro sem feedback.` });
    if (cur.pending) out.push({ icon: "info", html: `<b>${cur.pending}</b> registro(s) DD/NZ ainda sem pesquisa concluída. O total pesquisado pode ficar abaixo do oficial até fechar as pesquisas.` });
    const areas = areaMatrix(ctx).filter((a) => a.cells[ctx.ref] && a.cells[ctx.ref].dpmo != null).sort((a, b) => b.cells[ctx.ref].dpmo - a.cells[ctx.ref].dpmo);
    if (areas.length && areas[0].cells[ctx.ref].dpmo > 0) out.push({ icon: "map-pinned", html: `Maior DPMO por área: <b>${esc(areas[0].area)}</b> com ${fmtInt(areas[0].cells[ctx.ref].dpmo)}.` });
    return out;
  }

  // ---------- Sugestões para o plano de ação ----------
  function suggestedActions(ctx) {
    const offs = offenders(ctx).filter((o) => o.prio !== "OK");
    const list = offs.map((o) => {
      const errs = o.errors.map(([e, n]) => (n > 1 ? `${e} (${n})` : e)).join(", ");
      const proc = o.paths.map(([p]) => p).join("/");
      const text = {
        CRITICA: `Reincidência após feedback em ${proc}: ${errs}. Aplicar STU formal com o gestor e acompanhar as próximas 2 contagens.`,
        ALTA: `Reincidente sem feedback em ${proc}: ${errs}. Aplicar STU sobre o padrão do processo.`,
        MEDIA: `Primeiro erro (${errs}). Aplicar feedback de alinhamento sobre o padrão de ${proc}.`,
      }[o.prio];
      return { scope: "Associado", target: o.login, priority: o.prio, owner: o.manager || "", description: text };
    });
    const ev = events(ctx).filter((e) => e.key === ctx.ref && e.path && e.path !== "Unknown");
    if (ev.length >= 2) {
      const [p, n] = countBy(ev, "path")[0];
      const areas = countBy(ev.filter((e) => e.path === p), "area").map(([a]) => a).join(", ");
      if (n / ev.length >= 0.4) list.push({ scope: "Processo", target: p, priority: "ALTA", owner: "", description: `${p} concentra ${n} de ${ev.length} erros da semana (${areas}). Reforçar o padrão no start-up e auditar amostra do processo.` });
    }
    const unk = events(ctx).filter((e) => e.key === ctx.ref && !e.login);
    if (unk.length) list.push({ scope: "Pesquisa", target: "Unknown Problem", priority: "MEDIA", owner: "", description: `${unk.length} erro(s) sem ofensor. Revisar as pesquisas para tentar identificar a causa raiz.` });
    return list;
  }

  // ---------- util ----------
  function sum(arr, f) { return arr.reduce((a, r) => a + (Number(r[f]) || 0), 0); }
  function countBy(arr, f) {
    const m = new Map();
    for (const r of arr) { const k = r[f] || "—"; m.set(k, (m.get(k) || 0) + 1); }
    return [...m.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
  }
  const nf0 = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
  function fmtInt(v) { return v == null || !isFinite(v) ? "—" : nf0.format(Math.round(v)); }
  function fmtPct(v, d = 1) { return v == null || !isFinite(v) ? "—" : (v * 100).toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }) + "%"; }
  function esc(s) { return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  IRDR.an = { stuCoverage, wkKey, wkLabel, wkLong, PRIO_LABEL, PRIO_ORDER, warehouses, allWeeks, context, events, researchRows, defectRows, weekSummary, areaMatrix, offenders, managers, trend, insights, suggestedActions, countBy, fmtInt, fmtPct, esc, priorityOf };
})();
