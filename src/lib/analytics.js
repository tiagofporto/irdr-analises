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

  // ---------- Dive Deep: visão geral de todas as semanas importadas (ou da janela) ----------
  // Compara semanas, ranqueia erros e áreas, mede recorrência de associados e aplicação de STU.
  function deepDive(base, scope) {
    const keys = scope === "win" ? base.win.slice() : base.weeks.slice();
    const ctx = { ...base, win: keys, winSet: new Set(keys), ref: keys[keys.length - 1] || 0, prev: keys.length > 1 ? keys[keys.length - 2] : 0 };
    const D = S();
    const evAll = events(ctx);
    const ev = evAll.filter((e) => ctx.winSet.has(e.key));
    const att = ev.filter((e) => e.login);
    const total = ev.length || 1;
    const fbAll = D.feedbacks.map((f) => ({ ...f, key: wkKey(f) }));
    const glos = IRDR.glossary ? IRDR.glossary() : { rows: [] };
    const ptOf = new Map();
    for (const r of glos.rows) if (r.e && r.e.en && !ptOf.has(r.e.en.toLowerCase())) ptOf.set(r.e.en.toLowerCase(), r.e.pt);
    const pt = (e) => ptOf.get(String(e || "").toLowerCase()) || "";

    // Datas reais da contagem por semana (para medir o prazo até o STU)
    const countDay = new Map();
    for (const r of byWh(D.research, ctx.wh)) { const d = String(r.countDate || "").slice(0, 10); if (/^\d{4}-\d{2}-\d{2}$/.test(d)) { const k = wkKey(r); if (!countDay.has(k) || d > countDay.get(k)) countDay.set(k, d); } }
    for (const r of byWh(D.defects, ctx.wh)) { const d = String(r.countEnd || "").slice(0, 10); const k = wkKey(r); if (/^\d{4}-\d{2}-\d{2}$/.test(d) && !countDay.has(k)) countDay.set(k, d); }

    // Semanas
    const weeks = keys.map((k) => {
      const s = weekSummary(ctx, k);
      const e = ev.filter((x) => x.key === k);
      return {
        key: k, s,
        paths: countBy(e, "path"), errors: countBy(e, "error"),
        has: { ov: s.hasOverview, dd: s.defectRecords > 0, rs: s.researchRows > 0, stu: fbAll.some((f) => f.key === k) },
      };
    });
    const withOv = weeks.filter((w) => w.s.hasOverview);
    const counted = withOv.reduce((a, w) => a + w.s.counted, 0);
    const defOv = withOv.reduce((a, w) => a + w.s.defects, 0);
    const tot = {
      weeks: keys.length,
      counted: withOv.length ? counted : null,
      dpmo: counted ? (defOv / counted) * 1e6 : null,
      defects: weeks.reduce((a, w) => a + w.s.defects, 0),
      defectRecords: weeks.reduce((a, w) => a + w.s.defectRecords, 0),
      nz: weeks.reduce((a, w) => a + w.s.nz, 0),
      dd: weeks.reduce((a, w) => a + w.s.dd, 0),
      unitsFound: weeks.reduce((a, w) => a + w.s.unitsFound, 0),
      unitsMissing: weeks.reduce((a, w) => a + w.s.unitsMissing, 0),
      errors: ev.length,
      attributed: att.length,
      unknown: ev.length - att.length,
      associates: new Set(att.map((e) => e.login)).size,
      pending: weeks.reduce((a, w) => a + w.s.pending, 0),
      weeksOv: withOv.length,
      weeksRs: weeks.filter((w) => w.has.rs).length,
    };

    // Principais erros (Pareto)
    let cum = 0;
    const errors = countBy(ev, "error").map(([error, n]) => {
      cum += n;
      const sub = ev.filter((e) => e.error === error);
      return { error, pt: pt(error), n, share: n / total, cum: cum / total, assoc: new Set(sub.filter((e) => e.login).map((e) => e.login)).size, paths: countBy(sub, "path"), byWeek: Object.fromEntries(keys.map((k) => [k, sub.filter((e) => e.key === k).length])) };
    });

    // Processos e áreas
    const paths = countBy(ev, "path").map(([path, n]) => {
      const sub = ev.filter((e) => e.path === path);
      return { path, n, share: n / total, assoc: new Set(sub.filter((e) => e.login).map((e) => e.login)).size, areas: countBy(sub, "area"), errors: countBy(sub, "error"), byWeek: Object.fromEntries(keys.map((k) => [k, sub.filter((e) => e.key === k).length])) };
    });
    const pathAreas = [];
    for (const p of paths) for (const [area, n] of p.areas) pathAreas.push({ path: p.path, area, n, share: n / total });
    pathAreas.sort((a, b) => b.n - a.n);
    const pick = areaMatrix(ctx).map((a) => ({ ...a, records: defectRows(ctx, ctx.winSet).filter((d) => d.pickArea === a.area).length, errors: ev.filter((e) => e.pickArea === a.area).length }));
    pick.sort((a, b) => (b.dpmo ?? -1) - (a.dpmo ?? -1) || b.records - a.records);

    // Recorrência de associados
    const offs = offenders(ctx);
    const rec = offs.map((o) => {
      const inScope = o.events.filter((e) => ctx.winSet.has(e.key));
      const same = countBy(o.events, "error").find(([, n]) => n >= 2) || null;
      const fbKeys = o.feedbacks.map((f) => f.key);
      const afterStu = o.events.some((e) => fbKeys.some((k) => k < e.key));
      return { ...o, nScope: inScope.length, weeksScope: [...new Set(inScope.map((e) => e.key))], same, afterStu };
    });
    const reinc = rec.filter((o) => o.reincident).sort((a, b) => PRIO_ORDER[a.prio] - PRIO_ORDER[b.prio] || b.total - a.total || a.login.localeCompare(b.login));
    const dist = { one: rec.filter((o) => o.total === 1).length, two: rec.filter((o) => o.total === 2).length, more: rec.filter((o) => o.total >= 3).length };
    const pc = { CRITICA: 0, ALTA: 0, MEDIA: 0, OK: 0 };
    offs.forEach((o) => pc[o.prio]++);
    const recur = { list: reinc, dist, pc, associates: rec.length, reincident: reinc.length, rate: rec.length ? reinc.length / rec.length : null, sameError: rec.filter((o) => o.same).length, afterStu: rec.filter((o) => o.afterStu).length };

    // Aplicação de STU
    const cov = stuCoverage(ctx);
    const covScope = cov.filter((c) => ctx.winSet.has(c.key));
    const pairs = covScope.reduce((a, c) => a + c.associates, 0), done = covScope.reduce((a, c) => a + c.done, 0);
    const lags = [];
    for (const c of covScope) {
      const day = countDay.get(c.key);
      if (!day) continue;
      for (const login of new Set(att.filter((e) => e.key === c.key).map((e) => e.login))) {
        const f = fbAll.filter((x) => x.login === login && x.key >= c.key && /^\d{4}-\d{2}-\d{2}/.test(String(x.date || ""))).sort((a, b) => String(a.date).localeCompare(String(b.date)))[0];
        if (f) lags.push(Math.max(0, Math.round((Date.parse(String(f.date).slice(0, 10)) - Date.parse(day)) / 864e5)));
      }
    }
    const stu = { rows: cov, pairs, done, rate: pairs ? done / pairs : null, registered: fbAll.filter((f) => ctx.winSet.has(f.key)).length, registeredAll: fbAll.length, lagAvg: lags.length ? lags.reduce((a, b) => a + b, 0) / lags.length : null, lagN: lags.length, pending: covScope.flatMap((c) => c.pendingLogins.map((l) => ({ login: l, key: c.key }))) };

    // Gestores
    const mg = new Map();
    for (const e of att) {
      const k = e.manager || "—";
      if (!mg.has(k)) mg.set(k, { manager: k, errors: 0, logins: new Set(), ev: [] });
      const m = mg.get(k); m.errors++; m.logins.add(e.login); m.ev.push(e);
    }
    const mgrs = [...mg.values()].map((m) => {
      const lg = [...m.logins];
      let p = 0, d = 0;
      for (const c of covScope) for (const l of lg) if (att.some((e) => e.key === c.key && e.login === l)) { p++; if (!c.pendingLogins.includes(l)) d++; }
      return { manager: m.manager, errors: m.errors, associates: lg.length, reincident: reinc.filter((o) => lg.includes(o.login)).length, critica: offs.filter((o) => lg.includes(o.login) && o.prio === "CRITICA").length, stuRate: p ? d / p : null, stuDone: d, stuPairs: p, topError: countBy(m.ev, "error")[0] };
    }).sort((a, b) => b.errors - a.errors || b.reincident - a.reincident);

    // Comparação entre semanas (última com dado vs anterior com dado)
    const pairOf = (f) => { const v = weeks.filter((w) => f(w) != null); return v.length >= 2 ? { a: v[v.length - 2], b: v[v.length - 1], va: f(v[v.length - 2]), vb: f(v[v.length - 1]) } : null; };
    const cmp = {
      dpmo: pairOf((w) => w.s.dpmo),
      defects: pairOf((w) => (w.has.ov || w.has.dd ? w.s.defects : null)),
      errors: pairOf((w) => (w.has.rs ? w.s.errors : null)),
      associates: pairOf((w) => (w.has.rs ? w.s.associates : null)),
    };

    // Destaques e recomendações
    const L = wkLabel, F = [], R = [];
    const range = keys.length ? (keys.length > 1 ? `${L(keys[0])} a ${L(keys[keys.length - 1])}` : L(keys[0])) : "—";
    F.push({ icon: "layers", html: `<b>${keys.length} semana(s)</b> analisada(s) (${range}): ${tot.defects ? `${fmtInt(tot.defects)} registros defeituosos, ` : ""}${tot.dpmo != null ? `DPMO consolidado de <b>${fmtInt(tot.dpmo)}</b>, ` : ""}${tot.errors} erro(s) pesquisado(s) de ${tot.associates} associado(s).` });
    if (errors.length) {
      const top = errors[0];
      const topPa = top.paths[0];
      F.push({ icon: "target", html: `<b>${esc(top.error)}</b>${top.pt ? ` (${esc(top.pt)})` : ""} é o principal erro: ${fmtPct(top.share, 0)} do total (${top.n} de ${tot.errors})${topPa ? `, principalmente em ${esc(topPa[0])}` : ""}.` });
      const k80 = errors.findIndex((e) => e.cum >= 0.8) + 1;
      if (errors.length >= 3 && k80) F.push({ icon: "chart-no-axes-column", html: `<b>${k80} de ${errors.length}</b> tipos de erro somam 80% das ocorrências. É nesses tipos que o feedback e o treinamento rendem mais.` });
    }
    if (paths.length) {
      const p = paths.find((x) => x.path !== "Unknown") || paths[0];
      F.push({ icon: "map-pinned", html: `Processo mais ofensor: <b>${esc(p.path)}</b>, com ${fmtPct(p.share, 0)} dos erros (${p.n}) e ${p.assoc} associado(s); área principal ${esc(p.areas[0][0])}.` });
    }
    const pk = pick.find((a) => a.dpmo != null && a.dpmo > 0);
    if (pk) F.push({ icon: "map-pinned", html: `Pick area com maior DPMO: <b>${esc(pk.area)}</b> (${fmtInt(pk.dpmo)}).` });
    if (recur.associates) F.push({ icon: "refresh-cw", html: recur.reincident ? `<b>${recur.reincident} de ${recur.associates}</b> associado(s) são reincidentes (${fmtPct(recur.rate, 0)})${recur.sameError ? `; ${recur.sameError} repetiram o mesmo tipo de erro` : ""}${recur.afterStu ? `; <b>${recur.afterStu}</b> erraram de novo depois de receber STU` : ""}.` : `Nenhum associado reincidente no histórico importado: ${recur.associates} associado(s) com um único erro.` });
    if (pairs) F.push({ icon: "message-square", html: `STU aplicado em <b>${fmtPct(stu.rate, 0)}</b> dos casos (${done} de ${pairs} associado-semana com erro)${stu.lagAvg != null ? `, em média ${fmtInt(stu.lagAvg)} dia(s) após a contagem` : ""}.${covScope.filter((c) => c.associates && !c.done).length ? ` Semanas sem STU: ${covScope.filter((c) => c.associates && !c.done).map((c) => L(c.key)).join(", ")}.` : ""}` });
    if (cmp.errors) { const d = cmp.errors.vb - cmp.errors.va; F.push({ icon: d > 0 ? "arrow-up-right" : d < 0 ? "arrow-down-right" : "minus", html: `Erros pesquisados ${d > 0 ? "subiram" : d < 0 ? "caíram" : "ficaram estáveis"} de ${cmp.errors.va} (${L(cmp.errors.a.key)}) para ${cmp.errors.vb} (${L(cmp.errors.b.key)}).` }); }
    if (cmp.dpmo) { const d = cmp.dpmo.vb - cmp.dpmo.va; F.push({ icon: d > 0 ? "arrow-up-right" : "arrow-down-right", html: `DPMO ${d > 0 ? "subiu" : "caiu"} de ${fmtInt(cmp.dpmo.va)} (${L(cmp.dpmo.a.key)}) para ${fmtInt(cmp.dpmo.vb)} (${L(cmp.dpmo.b.key)}).` }); }
    if (tot.unknown) F.push({ icon: "triangle-alert", html: `${tot.unknown} erro(s) sem ofensor identificado (${fmtPct(tot.unknown / total, 0)} do total).` });
    const gaps = [];
    for (const w of weeks) {
      if (!w.has.ov) gaps.push(`${L(w.key)} sem Pick Area (sem DPMO)`);
      if (w.has.dd && !w.has.rs) gaps.push(`${L(w.key)} sem pesquisas concluídas`);
    }
    if (tot.pending) gaps.push(`${tot.pending} registro(s) DD/NZ sem pesquisa`);
    if (gaps.length) F.push({ icon: "info", html: `Lacunas nos dados: ${esc(gaps.join("; "))}.` });

    if (errors.length && errors[0].share >= 0.3) R.push({ priority: "ALTA", text: `Atacar ${errors[0].error}${errors[0].pt ? ` (${errors[0].pt})` : ""}: ${fmtPct(errors[0].share, 0)} dos erros. Reforçar o padrão no start-up de ${errors[0].paths.map(([p]) => p).filter((p) => p !== "Unknown").slice(0, 2).join(" e ") || "processo"} e auditar amostra.` });
    const pTop = paths.find((x) => x.path !== "Unknown");
    if (pTop && pTop.share >= 0.35) R.push({ priority: "ALTA", text: `${pTop.path} concentra ${fmtPct(pTop.share, 0)} dos erros (${pTop.areas.map(([a]) => a).slice(0, 3).join(", ")}). Fazer GEMBA no processo com o gestor da área.` });
    const crit = reinc.filter((o) => o.prio === "CRITICA");
    if (crit.length) R.push({ priority: "CRITICA", text: `${crit.length} associado(s) reincidiram após STU (${crit.slice(0, 5).map((o) => o.login).join(", ")}). Escalar com o gestor: STU formal e acompanhamento nas próximas 2 contagens.` });
    const alta = reinc.filter((o) => o.prio === "ALTA");
    if (alta.length) R.push({ priority: "ALTA", text: `${alta.length} reincidente(s) sem feedback (${alta.slice(0, 5).map((o) => o.login).join(", ")}). Aplicar STU sobre o padrão do processo.` });
    if (stu.pending.length) R.push({ priority: "ALTA", text: `${new Set(stu.pending.map((p) => p.login)).size} associado(s) com STU pendente. Registrar os feedbacks das semanas ${[...new Set(stu.pending.map((p) => L(p.key)))].join(", ")}.` });
    const mTop = mgrs[0];
    if (mTop && mgrs.length > 1 && mTop.errors / (tot.attributed || 1) >= 0.3) R.push({ priority: "MEDIA", text: `Time de ${mTop.manager} concentra ${mTop.errors} de ${tot.attributed} erros atribuídos. Alinhar o plano com o gestor.` });
    if (tot.unknown / total >= 0.15 && tot.unknown >= 2) R.push({ priority: "MEDIA", text: `Revisar as ${tot.unknown} pesquisas sem ofensor (Unknown) para identificar a causa raiz.` });
    if (tot.pending) R.push({ priority: "MEDIA", text: `Concluir ${tot.pending} pesquisa(s) pendente(s) para fechar o número oficial.` });
    if (!R.length) R.push({ priority: "OK", text: "Sem pontos críticos no período. Manter o acompanhamento semanal." });

    return { ctx, keys, range, weeks, tot, errors, paths, pathAreas, pick, recur, stu, mgrs, cmp, findings: F, recs: R };
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

  IRDR.an = { stuCoverage, wkKey, wkLabel, wkLong, PRIO_LABEL, PRIO_ORDER, warehouses, allWeeks, context, events, researchRows, defectRows, weekSummary, areaMatrix, offenders, managers, trend, insights, suggestedActions, countBy, fmtInt, fmtPct, esc, priorityOf, deepDive };
})();
