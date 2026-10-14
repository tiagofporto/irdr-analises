/* IRDR | ANALISES — exportação do relatório gerencial (PDF e Excel) */
(function () {
  const IRDR = (window.IRDR = window.IRDR || {});
  const an = () => IRDR.an;

  function download(blob, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  const stamp = () => new Date().toISOString().slice(0, 10);
  const fname = (ctx, ext) => `IRDR_${ctx.wh || "FC"}_${an().wkLabel(ctx.ref)}_${stamp()}.${ext}`;
  const plain = (html) => { const d = document.createElement("div"); d.innerHTML = html; return d.textContent; };

  // Dados do relatório, compartilhados por PDF e Excel
  function build(ctx) {
    const A = an();
    const s = A.weekSummary(ctx, ctx.ref);
    const p = ctx.prev ? A.weekSummary(ctx, ctx.prev) : null;
    const offs = A.offenders(ctx);
    const evRef = A.events(ctx).filter((e) => e.key === ctx.ref);
    const evWin = A.events(ctx).filter((e) => ctx.winSet.has(e.key));
    const areas = A.areaMatrix(ctx);
    const tr = A.trend(ctx);
    const pc = { CRITICA: 0, ALTA: 0, MEDIA: 0, OK: 0 };
    offs.forEach((o) => pc[o.prio]++);
    return { s, p, offs, evRef, evWin, areas, tr, pc, ins: A.insights(ctx).map((i) => plain(i.html)), mgrs: A.managers(ctx, offs) };
  }

  // ---------------- Excel ----------------
  const HEAD = { font: { bold: true, color: { rgb: "FFFFFF" }, name: "Calibri", sz: 11 }, fill: { fgColor: { rgb: "1F2A44" } }, alignment: { vertical: "center", wrapText: true }, border: { bottom: { style: "thin", color: { rgb: "1F2A44" } } } };
  const TITLE = { font: { bold: true, sz: 16, color: { rgb: "0F1424" } } };
  const SUB = { font: { sz: 10, color: { rgb: "6F7689" } } };
  const PRIO_FILL = { CRITICA: "FDE8EA", ALTA: "FDF0DC", MEDIA: "FBF4D2", OK: "DEF5EA" };

  function sheet(rows, widths, opts = {}) {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = widths.map((w) => ({ wch: w }));
    const hr = opts.headerRow ?? 0;
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r: hr, c })];
      if (cell) cell.s = HEAD;
    }
    if (opts.title) {
      const t = ws["A1"]; if (t) t.s = TITLE;
      const st = ws["A2"]; if (st) st.s = SUB;
    }
    if (opts.prioCol != null) {
      for (let r = hr + 1; r <= range.e.r; r++) {
        const cell = ws[XLSX.utils.encode_cell({ r, c: opts.prioCol })];
        const key = cell && { "CRÍTICA": "CRITICA", "ALTA": "ALTA", "MÉDIA": "MEDIA", "OK": "OK" }[cell.v];
        if (key) cell.s = { fill: { fgColor: { rgb: PRIO_FILL[key] } }, font: { bold: true } };
      }
    }
    if (opts.wrapCols) {
      for (let r = hr + 1; r <= range.e.r; r++) for (const c of opts.wrapCols) {
        const cell = ws[XLSX.utils.encode_cell({ r, c })];
        if (cell) cell.s = { ...(cell.s || {}), alignment: { wrapText: true, vertical: "top" } };
      }
    }
    if (rows.length > hr + 1) ws["!autofilter"] = { ref: XLSX.utils.encode_range({ r: hr, c: 0 }, { r: range.e.r, c: range.e.c }) };
    return ws;
  }

  function xlsx(ctx) {
    const A = an(), R = build(ctx), D = IRDR.store.data;
    const L = A.wkLabel, PL = A.PRIO_LABEL;
    const r0 = (v) => (v == null ? "" : Math.round(v));
    const wb = XLSX.utils.book_new();

    const resumo = [
      ["IRDR | ANALISES — Relatório gerencial"],
      [`${ctx.wh} · ${A.wkLong(ctx.ref)} · janela ${L(ctx.win[0])}–${L(ctx.win[ctx.win.length - 1])} · gerado em ${IRDR.store.isoDateTime(new Date())}`],
      [],
      ["Indicador", L(ctx.ref), ctx.prev ? L(ctx.prev) : "Semana anterior"],
      ["DPMO", r0(R.s.dpmo), r0(R.p && R.p.dpmo)],
      ["Registros contados", R.s.counted, R.p ? R.p.counted : ""],
      ["Registros defeituosos", R.s.defects, R.p ? R.p.defects : ""],
      ["Acurácia de registros", R.s.accuracy == null ? "" : Number((R.s.accuracy * 100).toFixed(3)), R.p && R.p.accuracy != null ? Number((R.p.accuracy * 100).toFixed(3)) : ""],
      ["Registros Net Zero", R.s.nz, R.p ? R.p.nz : ""],
      ["Registros Double Defect", R.s.dd, R.p ? R.p.dd : ""],
      ["Unidades em sobra", R.s.unitsFound, R.p ? R.p.unitsFound : ""],
      ["Unidades em falta", R.s.unitsMissing, R.p ? R.p.unitsMissing : ""],
      ["Erros pesquisados", R.s.errors, R.p ? R.p.errors : ""],
      ["Erros sem ofensor", R.s.unknown, R.p ? R.p.unknown : ""],
      ["Associados com erro", R.s.associates, R.p ? R.p.associates : ""],
      ["Pesquisas pendentes", R.s.pending, R.p ? R.p.pending : ""],
      [],
      ["Prioridade dos ofensores (janela)", "Associados"],
      ...["CRITICA", "ALTA", "MEDIA", "OK"].map((k) => [PL[k], R.pc[k]]),
      [],
      ["Destaques"],
      ...R.ins.map((t) => [t]),
    ];
    const wsR = sheet(resumo, [44, 16, 18], { headerRow: 3, title: true });
    delete wsR["!autofilter"];
    XLSX.utils.book_append_sheet(wb, wsR, "Resumo");

    XLSX.utils.book_append_sheet(wb, sheet([
      ["Semana", "DPMO", "Registros contados", "Registros defeituosos", "Erros pesquisados", "Erros sem ofensor"],
      ...R.tr.map((t) => [L(t.key), r0(t.dpmo), t.counted, t.defects, t.errors, t.unknown]),
    ], [10, 10, 18, 20, 18, 18]), "Tendência");

    XLSX.utils.book_append_sheet(wb, sheet([
      ["Pick area", ...ctx.win.map((k) => `DPMO ${L(k)}`), "DPMO janela", `Contados ${L(ctx.ref)}`, `Defeitos ${L(ctx.ref)}`, `NZ ${L(ctx.ref)}`, `DD ${L(ctx.ref)}`],
      ...R.areas.map((a) => [a.area, ...ctx.win.map((k) => r0(a.cells[k].dpmo)), r0(a.dpmo), a.cells[ctx.ref].counted, a.cells[ctx.ref].defects, a.cells[ctx.ref].nz, a.cells[ctx.ref].dd]),
    ], [18, ...ctx.win.map(() => 11), 13, 14, 14, 9, 9]), "DPMO por área");

    const byPath = A.countBy(R.evWin, "path");
    XLSX.utils.book_append_sheet(wb, sheet([
      ["Processo (Path)", ...ctx.win.map(L), "Total janela", "% janela"],
      ...byPath.map(([p, n]) => [p, ...ctx.win.map((k) => R.evWin.filter((e) => e.key === k && e.path === p).length), n, Number(((n / R.evWin.length) * 100).toFixed(1))]),
    ], [24, ...ctx.win.map(() => 8), 12, 10]), "Erros por processo");

    XLSX.utils.book_append_sheet(wb, sheet([
      ["Associado", "Prioridade", "Gestor", "Tempo de casa (dias)", "Erros na janela", `Erros em ${L(ctx.ref)}`, "Erros no histórico", "Semanas com erro", "Processos", "Tipos de erro", "STU", "Semanas sem STU", "Último STU (semana)", "Último STU (data)"],
      ...R.offs.map((o) => [o.login, PL[o.prio], o.manager, Number(o.tenure) || o.tenure, o.inWindow, o.inRef, o.total, o.weeks.map(L).join(" "), o.paths.map(([p, n]) => `${p} (${n})`).join(", "), o.errors.map(([e, n]) => `${e} (${n})`).join(", "), o.stuPending.length ? "Não realizado" : "Realizado", o.stuPending.map(L).join(" "), o.lastFeedback ? L(o.lastFeedback.key) : "", o.lastFeedback ? o.lastFeedback.date : ""]),
    ], [14, 11, 12, 12, 10, 10, 12, 18, 28, 34, 14, 14, 12, 12], { prioCol: 1 }), "Ofensores");

    XLSX.utils.book_append_sheet(wb, sheet([
      ["Semana", "Status", "Associados com erro", "STU realizado", "Não realizado", "Cobertura %", "STUs registrados", "Associados pendentes"],
      ...A.stuCoverage(ctx).map((c) => [L(c.key), IRDR.stuStatusText(c), c.associates, c.done, c.notDone, c.rate == null ? "" : Math.round(c.rate * 100), c.stuCount, c.pendingLogins.join(", ")]),
    ], [8, 18, 18, 13, 13, 11, 15, 50]), "Cobertura STU");

    XLSX.utils.book_append_sheet(wb, sheet([
      ["Gestor", "Associados", "Erros na janela", "Crítica", "Alta", "Média", "OK"],
      ...R.mgrs.map((m) => [m.manager, m.associates, m.errors, m.CRITICA, m.ALTA, m.MEDIA, m.OK]),
    ], [14, 11, 14, 9, 9, 9, 9]), "Por gestor");

    const rs = A.researchRows(ctx, ctx.winSet).sort((a, b) => b.key - a.key);
    XLSX.utils.book_append_sheet(wb, sheet([
      ["Semana", "Bin", "FNSKU", "Pick area", "Tipo", "Esperado", "Contado", "Net Zero", "Double Defect", "Processo", "Área", "Erro", "Associado", "Tempo de casa", "Gestor", "Data do erro", "Pesquisado por", "Desvio"],
      ...rs.map((r) => [L(r.key), r.bin, r.fnsku, r.pickArea, r.mf, r.expQ, r.countQ, r.nz ? "Sim" : "Não", r.dd ? "Sim" : "Não", r.path, r.area, r.error, r.login, r.tenure, r.manager, r.errorDate, r.researchedBy, r.deviations]),
    ], [8, 15, 13, 13, 9, 9, 9, 9, 11, 16, 16, 24, 12, 11, 12, 11, 12, 90], { wrapCols: [17] }), "Pesquisas");

    const df = A.defectRows(ctx, ctx.winSet).sort((a, b) => b.key - a.key);
    XLSX.utils.book_append_sheet(wb, sheet([
      ["Semana", "Bin", "FNSKU", "Pick area", "Tipo de bin", "Uso do bin", "Tipo", "Esperado", "Contado", "Diferença", "Net Zero", "Double Defect", "Fim da contagem"],
      ...df.map((r) => [L(r.key), r.bin, r.fnsku, r.pickArea, r.binType, r.binUsage, r.mf, r.expQty, r.cntQty, r.cntQty - r.expQty, r.nz ? "Sim" : "Não", r.dd ? "Sim" : "Não", r.countEnd]),
    ], [8, 15, 13, 13, 14, 14, 9, 9, 9, 10, 9, 11, 24]), "Registros DD-NZ");

    XLSX.utils.book_append_sheet(wb, sheet([
      ["Semana", "Data", "Associado", "Gestor", "Pesquisa", "Tipo", "Erro referente", "Aplicado por", "Comentário"],
      ...D.feedbacks.map((f) => ({ ...f, key: A.wkKey(f) })).sort((a, b) => b.key - a.key).map((f) => [L(f.key), f.date, f.login, f.manager || "", f.research || "", f.type, f.error, f.by, f.note]),
    ], [8, 11, 14, 12, 11, 12, 18, 14, 80], { wrapCols: [8] }), "Feedbacks STU");

    XLSX.utils.book_append_sheet(wb, sheet([
      ["Prioridade", "Semana", "Escopo", "Alvo", "Ação", "Responsável", "Prazo", "Status"],
      ...D.actions.slice().sort((a, b) => (b.weekKey || 0) - (a.weekKey || 0)).map((a) => [PL[a.priority] || a.priority, L(a.weekKey), a.scope, a.target, a.description, a.owner, a.due, a.status]),
    ], [11, 8, 11, 16, 70, 14, 11, 13], { prioCol: 0, wrapCols: [4] }), "Plano de ação");

    const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    download(new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), fname(ctx, "xlsx"));
  }

  function feedbackTemplate() {
    const ws = sheet([
      ["Login", "Semana", "Ano", "Data", "Tipo", "Aplicado por", "Erro referente", "Observação"],
      ["exemplo1", 41, 2026, "2026-10-09", "STU", "gestor1", "Wrong Bin", "Feedback sobre conferência do bin no stow"],
    ], [14, 9, 8, 12, 22, 14, 22, 48]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "STU");
    const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    download(new Blob([out]), "IRDR_modelo_STU.xlsx");
  }

  // ---------------- PDF ----------------
  const C = { ink: [15, 20, 36], ink2: [79, 86, 106], ink3: [111, 118, 137], line: [226, 229, 238], primary: [47, 69, 230], surface2: [240, 242, 247], label: [255, 246, 199],
    CRITICA: [200, 35, 47], ALTA: [180, 83, 9], MEDIA: [138, 106, 0], OK: [15, 122, 75] };
  const WASH = { CRITICA: [253, 232, 234], ALTA: [253, 240, 220], MEDIA: [251, 244, 210], OK: [222, 245, 234] };

  function chartImage(cfg, w, h) {
    return new Promise((resolve) => {
      const cv = document.createElement("canvas");
      cv.width = w * 2; cv.height = h * 2;
      cv.style.cssText = `position:fixed;left:-9999px;top:0;width:${w}px;height:${h}px`;
      document.body.appendChild(cv);
      const ch = new Chart(cv.getContext("2d"), { ...cfg, options: { ...cfg.options, responsive: false, animation: false, devicePixelRatio: 2 } });
      ch.resize(w, h);
      requestAnimationFrame(() => {
        // fundo branco para o PDF
        const ctx2 = cv.getContext("2d");
        ctx2.save(); ctx2.globalCompositeOperation = "destination-over"; ctx2.fillStyle = "#fff"; ctx2.fillRect(0, 0, cv.width, cv.height); ctx2.restore();
        const url = cv.toDataURL("image/png");
        ch.destroy(); cv.remove();
        resolve(url);
      });
    });
  }

  async function pdf(ctx) {
    const A = an(), R = build(ctx), D = IRDR.store.data, L = A.wkLabel, PL = A.PRIO_LABEL;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 14;
    const fi = A.fmtInt, fp = A.fmtPct;
    const range = `${L(ctx.win[0])}–${L(ctx.win[ctx.win.length - 1])}`;

    const header = () => {
      doc.setFillColor(...C.ink); doc.rect(0, 0, W, 4, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(...C.ink);
      doc.text("IRDR | ANALISES", M, 11);
      doc.setFont("helvetica", "normal"); doc.setTextColor(...C.ink3);
      doc.text(`${ctx.wh} · ${A.wkLong(ctx.ref)} · janela ${range}`, W - M, 11, { align: "right" });
      doc.setDrawColor(...C.line); doc.line(M, 14, W - M, 14);
    };
    const footer = () => {
      const n = doc.internal.getNumberOfPages();
      for (let i = 1; i <= n; i++) {
        doc.setPage(i);
        doc.setFontSize(8); doc.setTextColor(...C.ink3); doc.setFont("helvetica", "normal");
        doc.text(`Gerado em ${IRDR.store.isoDateTime(new Date()).slice(0, 16)} · Contagem oficial IRDR · uso interno`, M, H - 7);
        doc.text(`${i} / ${n}`, W - M, H - 7, { align: "right" });
      }
    };
    const section = (title, y, sub) => {
      doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...C.ink); doc.text(title, M, y);
      if (sub) { doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(...C.ink3); doc.text(sub, M, y + 4.5); }
      return y + (sub ? 8 : 5);
    };
    const tableStyle = {
      theme: "plain", margin: { left: M, right: M, top: 20 },
      styles: { font: "helvetica", fontSize: 8.5, cellPadding: 2.2, textColor: C.ink, lineColor: C.line, lineWidth: { bottom: 0.2 } },
      headStyles: { fillColor: C.surface2, textColor: C.ink3, fontStyle: "bold", fontSize: 7.5 },
      didDrawPage: header,
    };
    const prioCell = (col) => (data) => {
      if (data.section === "body" && data.column.index === col) {
        const k = { "CRÍTICA": "CRITICA", ALTA: "ALTA", "MÉDIA": "MEDIA", OK: "OK" }[data.cell.raw];
        if (k) { data.cell.styles.textColor = C[k]; data.cell.styles.fontStyle = "bold"; data.cell.styles.fillColor = WASH[k]; }
      }
    };

    // ---- Página 1: capa executiva ----
    header();
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...C.ink3);
    doc.text("RELATÓRIO GERENCIAL · CONTAGEM OFICIAL DE INVENTÁRIO", M, 24);
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(...C.ink);
    doc.text(`${ctx.wh} · Semana ${ctx.ref % 100}`, M, 33);

    // KPIs
    const kpis = [
      ["DPMO", R.s.dpmo != null ? fi(R.s.dpmo) : "—", R.p && R.p.dpmo != null && R.s.dpmo != null ? `${L(ctx.prev)}: ${fi(R.p.dpmo)}` : "sem base anterior"],
      ["Registros defeituosos", fi(R.s.defects), R.s.counted ? `de ${fi(R.s.counted)} contados · acurácia ${fp(R.s.accuracy, 2)}` : ""],
      ["Erros pesquisados", fi(R.s.errors), `${R.s.associates} associado(s) · ${R.s.unknown} sem ofensor`],
      ["Divergência em unidades", fi(R.s.unitsFound + R.s.unitsMissing), `+${fi(R.s.unitsFound)} sobra · -${fi(R.s.unitsMissing)} falta`],
      ["Associados aguardando STU", fi(R.pc.CRITICA + R.pc.ALTA + R.pc.MEDIA), `${R.pc.CRITICA} crítica · ${R.pc.ALTA} alta · ${R.pc.MEDIA} média`],
    ];
    const kw = (W - 2 * M - 4 * 4) / 5;
    kpis.forEach(([l, v, sub], i) => {
      const x = M + i * (kw + 4), y = 40;
      doc.setDrawColor(...C.line); doc.setFillColor(255, 255, 255); doc.roundedRect(x, y, kw, 26, 2, 2, "FD");
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(...C.ink3); doc.text(l, x + 4, y + 6);
      doc.setFont("helvetica", "bold"); doc.setFontSize(17); doc.setTextColor(...C.ink); doc.text(v, x + 4, y + 15);
      doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(...C.ink3); doc.text(doc.splitTextToSize(sub, kw - 8), x + 4, y + 21);
    });

    // gráfico de tendência
    const trendImg = await chartImage(IRDR.chartTrendCfg(R.tr, { static: true, primary: "#2f45e6", muted: "#cdd2df", grid: "#e2e5ee" }), 760, 300);
    let y = section("Tendência da janela", 76, "DPMO (linha) e erros pesquisados (barras) por semana");
    const cw = (W - 2 * M) * 0.6;
    doc.addImage(trendImg, "PNG", M, y, cw, cw * 300 / 760, undefined, "FAST");

    // destaques
    const ix = M + cw + 8, iw = W - M - ix;
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...C.ink); doc.text("Destaques", ix, 76);
    let iy = 84;
    doc.setFontSize(9); doc.setFont("helvetica", "normal");
    for (const t of R.ins) {
      const lines = doc.splitTextToSize(t, iw - 5);
      if (iy + lines.length * 4.2 > H - 14) break;
      doc.setFillColor(...C.primary); doc.circle(ix + 1, iy - 1.2, 0.8, "F");
      doc.setTextColor(...C.ink2); doc.text(lines, ix + 4, iy);
      iy += lines.length * 4.2 + 2.5;
    }

    // ---- Página 2: processos e áreas ----
    doc.addPage(); header();
    y = section(`Erros por processo · ${L(ctx.ref)} e janela`, 24);
    const byPath = A.countBy(R.evWin, "path");
    doc.autoTable({ ...tableStyle, startY: y, tableWidth: (W - 2 * M) * 0.48,
      head: [["Processo", ...ctx.win.map(L), "Total", "%"]],
      body: byPath.map(([p, n]) => [p, ...ctx.win.map((k) => R.evWin.filter((e) => e.key === k && e.path === p).length || "—"), n, fp(n / R.evWin.length, 0)]),
      columnStyles: Object.fromEntries([...ctx.win.map((_, i) => [i + 1, { halign: "right" }]), [ctx.win.length + 1, { halign: "right", fontStyle: "bold" }], [ctx.win.length + 2, { halign: "right" }]]),
    });
    const leftEnd = doc.lastAutoTable.finalY;
    const byErr = A.countBy(R.evRef, "error");
    doc.autoTable({ ...tableStyle, startY: y, margin: { left: M + (W - 2 * M) * 0.52, right: M, top: 20 },
      head: [[`Tipo de erro · ${L(ctx.ref)}`, "Processo › Área", "Qtd."]],
      body: byErr.map(([e, n]) => [e, [...new Set(R.evRef.filter((x) => x.error === e).map((x) => x.path + " › " + x.area))].join(", "), n]),
      columnStyles: { 2: { halign: "right", fontStyle: "bold" } },
    });
    y = Math.max(leftEnd, doc.lastAutoTable.finalY) + 10;
    if (y > H - 50) { doc.addPage(); header(); y = 24; }
    y = section("DPMO por pick area", y, "Registros defeituosos ÷ registros contados × 1.000.000");
    const maxD = Math.max(1, ...R.areas.flatMap((a) => ctx.win.map((k) => a.cells[k].dpmo || 0)));
    doc.autoTable({ ...tableStyle, startY: y,
      head: [["Pick area", ...ctx.win.map(L), "Janela", `Contados ${L(ctx.ref)}`, `Defeitos ${L(ctx.ref)}`, "NZ", "DD"]],
      body: R.areas.map((a) => [a.area, ...ctx.win.map((k) => (a.cells[k].dpmo == null ? "—" : fi(a.cells[k].dpmo))), a.dpmo == null ? "—" : fi(a.dpmo), fi(a.cells[ctx.ref].counted), a.cells[ctx.ref].defects, a.cells[ctx.ref].nz, a.cells[ctx.ref].dd]),
      columnStyles: Object.fromEntries(Array.from({ length: ctx.win.length + 6 }, (_, i) => [i + 1, { halign: "right" }])),
      didParseCell: (d) => {
        if (d.section === "body" && d.column.index >= 1 && d.column.index <= ctx.win.length) {
          const k = ctx.win[d.column.index - 1];
          const v = R.areas[d.row.index].cells[k].dpmo;
          if (v) { const t = Math.min(1, v / maxD); d.cell.styles.fillColor = [255, Math.round(255 - t * 90), Math.round(255 - t * 90)]; }
        }
      },
    });

    // ---- Página 3: ofensores ----
    doc.addPage(); header();
    y = section("Ofensores e prioridade de feedback", 24, "CRÍTICA = reincidente após feedback · ALTA = reincidente sem feedback · MÉDIA = 1º erro sem STU · OK = STU aplicado");
    doc.autoTable({ ...tableStyle, startY: y,
      head: [["Associado", "Prioridade", "Gestor", "Casa (dias)", "Erros janela", "Histórico", "Semanas", "Erros", "STU", "Último STU"]],
      body: R.offs.map((o) => [o.login, PL[o.prio], o.manager || "—", o.tenure || "—", o.inWindow, o.total, o.weeks.map(L).join(" "), o.errors.map(([e, n]) => e + (n > 1 ? ` ×${n}` : "")).join(", "), o.stuPending.length ? "Não realizado" : "Realizado", o.lastFeedback ? L(o.lastFeedback.key) : "nenhum"]),
      columnStyles: { 0: { font: "courier", fontStyle: "bold" }, 3: { halign: "right" }, 4: { halign: "right", fontStyle: "bold" }, 5: { halign: "right" }, 7: { cellWidth: 70 } },
      didParseCell: (d) => { prioCell(1)(d); if (d.section === "body" && d.column.index === 8) { const bad = d.cell.raw === "Não realizado"; d.cell.styles.textColor = bad ? C.CRITICA : C.OK; d.cell.styles.fontStyle = "bold"; } },
    });
    y = doc.lastAutoTable.finalY + 10;
    const cov = A.stuCoverage(ctx);
    if (cov.length) {
      if (y > H - 40) { doc.addPage(); header(); y = 24; }
      y = section("Cobertura de STU por semana", y, "Semana sem STU registrado conta como feedback não realizado");
      doc.autoTable({ ...tableStyle, startY: y, tableWidth: 200,
        head: [["Semana", "Status", "Com erro", "Realizado", "Não realizado", "Cobertura", "STUs"]],
        body: cov.map((c) => [L(c.key), IRDR.stuStatusText(c), c.associates || "—", c.associates ? c.done : "—", c.associates ? c.notDone : "—", c.rate == null ? "—" : fp(c.rate, 0), c.stuCount || "—"]),
        columnStyles: Object.fromEntries([2, 3, 4, 5, 6].map((i) => [i, { halign: "right" }])),
        didParseCell: (d) => { if (d.section === "body" && d.column.index === 1) { const t = d.cell.raw; d.cell.styles.fontStyle = "bold"; d.cell.styles.textColor = t === "Não realizado" ? C.CRITICA : t === "Parcial" ? C.ALTA : t === "Realizado" || t === "STU registrado" ? C.OK : C.ink3; } },
      });
      y = doc.lastAutoTable.finalY + 10;
    }
    if (R.mgrs.length) {
      if (y > H - 40) { doc.addPage(); header(); y = 24; }
      y = section("Por gestor", y);
      doc.autoTable({ ...tableStyle, startY: y, tableWidth: 150,
        head: [["Gestor", "Associados", "Erros", "Crítica", "Alta", "Média", "OK"]],
        body: R.mgrs.map((m) => [m.manager, m.associates, m.errors, m.CRITICA, m.ALTA, m.MEDIA, m.OK]),
        columnStyles: Object.fromEntries([1, 2, 3, 4, 5, 6].map((i) => [i, { halign: "right" }])),
      });
    }

    // ---- Página 4: plano de ação ----
    const acts = D.actions.filter((a) => a.status !== "Concluída" || a.weekKey === ctx.ref).sort((a, b) => A.PRIO_ORDER[a.priority] - A.PRIO_ORDER[b.priority]);
    const sug = acts.length ? null : A.suggestedActions(ctx);
    doc.addPage(); header();
    y = section("Plano de ação", 24, acts.length ? "Ações abertas e concluídas na semana" : "Sugestões geradas a partir da priorização (ainda não registradas no plano)");
    doc.autoTable({ ...tableStyle, startY: y,
      head: [["Prioridade", "Alvo", "Ação", "Responsável", "Prazo", "Status"]],
      body: (acts.length ? acts : sug.map((s) => ({ ...s, status: "Sugerida", due: "" }))).map((a) => [PL[a.priority] || a.priority, a.target, a.description, a.owner || "—", a.due ? a.due.split("-").reverse().join("/") : "—", a.status]),
      columnStyles: { 1: { font: "courier" }, 2: { cellWidth: 140 } },
      didParseCell: prioCell(0),
    });

    // ---- Anexo: pesquisas da semana ----
    const rs = A.researchRows(ctx, new Set([ctx.ref]));
    if (rs.length) {
      doc.addPage(); header();
      y = section(`Anexo · pesquisas concluídas em ${L(ctx.ref)}`, 24, `${rs.length} registro(s)`);
      doc.autoTable({ ...tableStyle, startY: y, styles: { ...tableStyle.styles, fontSize: 7.5 },
        head: [["Bin", "FNSKU", "Tipo", "Esp.", "Cont.", "Erro", "Associado", "Gestor", "Desvio"]],
        body: rs.map((r) => [r.bin, r.fnsku, /found/i.test(r.mf) ? "Sobra" : "Falta", r.expQ, r.countQ, `${r.error}\n${r.path} › ${r.area}`, r.login || "—", r.manager || "—", r.deviations.length > 420 ? r.deviations.slice(0, 420) + "…" : r.deviations]),
        columnStyles: { 0: { font: "courier", cellWidth: 26 }, 1: { font: "courier", cellWidth: 22 }, 3: { halign: "right" }, 4: { halign: "right" }, 5: { cellWidth: 34 }, 6: { font: "courier" }, 8: { cellWidth: 110 } },
      });
    }

    footer();
    doc.save(fname(ctx, "pdf"));
  }

  // ---------------- Dive Deep (PDF e Excel) ----------------
  const ddName = (dd, ext) => `IRDR_DiveDeep_${dd.ctx.wh || "FC"}_${an().wkLabel(dd.keys[0])}-${an().wkLabel(dd.keys[dd.keys.length - 1])}_${stamp()}.${ext}`;
  const covText = (c) => IRDR.stuStatusText(c);

  function deepXlsx(dd) {
    const A = an(), L = A.wkLabel, PL = A.PRIO_LABEL;
    const r0 = (v) => (v == null ? "" : Math.round(v));
    const pct = (v) => (v == null ? "" : Number((v * 100).toFixed(1)));
    const wb = XLSX.utils.book_new();
    const t = dd.tot;
    const resumo = [
      ["IRDR | ANALISES — Dive Deep"],
      [`${dd.ctx.wh} · ${dd.range} · ${dd.keys.length} semana(s) · gerado em ${IRDR.store.isoDateTime(new Date())}`],
      [],
      ["Indicador", "Valor"],
      ["Semanas analisadas", dd.keys.map(L).join(" ")],
      ["DPMO consolidado", r0(t.dpmo)],
      ["Registros contados", t.counted ?? ""],
      ["Registros defeituosos", t.defects],
      ["Net Zero / Double Defect", `${t.nz} / ${t.dd}`],
      ["Erros pesquisados", t.errors],
      ["Erros sem ofensor", t.unknown],
      ["Associados com erro", t.associates],
      ["Reincidentes", dd.recur.reincident],
      ["Reincidiram após STU", dd.recur.afterStu],
      ["Aplicação de STU (%)", pct(dd.stu.rate)],
      ["Casos de STU realizados / com erro", `${dd.stu.done} / ${dd.stu.pairs}`],
      ["Pesquisas pendentes", t.pending],
      [],
      ["Principais conclusões"],
      ...dd.findings.map((f) => [plain(f.html)]),
      [],
      ["Recomendações", "Prioridade"],
      ...dd.recs.map((r) => [r.text, PL[r.priority] || r.priority]),
    ];
    const wsR = sheet(resumo, [90, 22], { headerRow: 3, title: true });
    delete wsR["!autofilter"];
    XLSX.utils.book_append_sheet(wb, wsR, "Resumo");

    const cov = (k) => dd.stu.rows.find((c) => c.key === k);
    XLSX.utils.book_append_sheet(wb, sheet([
      ["Semana", "DPMO", "Contados", "Defeituosos", "Net Zero", "Double Defect", "Unid. sobra", "Unid. falta", "Erros pesquisados", "Associados", "Sem ofensor", "Pesquisas pendentes", "Principal erro", "Principal processo", "STU", "Pick Area importado", "DD/NZ importado", "Pesquisas importadas"],
      ...dd.weeks.map((w) => [L(w.key), r0(w.s.dpmo), w.s.counted ?? "", w.s.defects, w.s.nz, w.s.dd, w.s.unitsFound, w.s.unitsMissing, w.has.rs ? w.s.errors : "", w.has.rs ? w.s.associates : "", w.has.rs ? w.s.unknown : "", w.s.pending, w.errors[0] ? `${w.errors[0][0]} (${w.errors[0][1]})` : "", w.paths[0] ? `${w.paths[0][0]} (${w.paths[0][1]})` : "", cov(w.key) ? covText(cov(w.key)) : "", w.has.ov ? "Sim" : "Não", w.has.dd ? "Sim" : "Não", w.has.rs ? "Sim" : "Não"]),
    ], [8, 9, 10, 11, 9, 11, 10, 10, 14, 11, 11, 15, 28, 22, 14, 14, 13, 15]), "Comparativo semanal");

    XLSX.utils.book_append_sheet(wb, sheet([
      ["Erro", "Erro (PT)", "Processos", "Quantidade", "% do total", "% acumulado", "Associados", ...dd.keys.map(L)],
      ...dd.errors.map((e) => [e.error, e.pt, e.paths.map(([p, n]) => `${p} (${n})`).join(", "), e.n, pct(e.share), pct(e.cum), e.assoc, ...dd.keys.map((k) => e.byWeek[k] || 0)]),
    ], [28, 28, 26, 11, 10, 11, 11, ...dd.keys.map(() => 7)]), "Principais erros");

    XLSX.utils.book_append_sheet(wb, sheet([
      ["Processo", "Área", "Erros", "% do total"],
      ...dd.pathAreas.map((a) => [a.path, a.area, a.n, pct(a.share)]),
    ], [24, 28, 9, 10]), "Áreas ofensoras");

    XLSX.utils.book_append_sheet(wb, sheet([
      ["Pick area", "DPMO do período", "Registros contados", "Defeituosos", "Registros DD/NZ", "Erros pesquisados", ...dd.keys.map((k) => `DPMO ${L(k)}`)],
      ...dd.pick.map((a) => [a.area, r0(a.dpmo), a.counted || "", a.defects, a.records, a.errors, ...dd.keys.map((k) => r0(a.cells[k] && a.cells[k].dpmo))]),
    ], [16, 14, 16, 12, 14, 15, ...dd.keys.map(() => 10)]), "Pick areas");

    XLSX.utils.book_append_sheet(wb, sheet([
      ["Associado", "Prioridade", "Gestor", "Tempo de casa", "Erros no período", "Erros no histórico", "Semanas com erro", "Erro repetido", "Erros", "Reincidiu após STU", "Último STU"],
      ...dd.recur.list.map((o) => [o.login, PL[o.prio], o.manager, Number(o.tenure) || o.tenure, o.nScope, o.total, o.weeks.map(L).join(" "), o.same ? `${o.same[0]} (${o.same[1]})` : "", o.errors.map(([e, n]) => `${e} (${n})`).join(", "), o.afterStu ? "Sim" : "Não", o.lastFeedback ? `${L(o.lastFeedback.key)} ${o.lastFeedback.date || ""}` : ""]),
    ], [14, 11, 12, 12, 14, 15, 18, 24, 34, 16, 16], { prioCol: 1 }), "Recorrência");

    XLSX.utils.book_append_sheet(wb, sheet([
      ["Semana", "Status", "Associados com erro", "STU realizado", "Pendente", "Cobertura %", "STUs registrados", "Associados pendentes"],
      ...dd.stu.rows.map((c) => [L(c.key), covText(c), c.associates, c.done, c.notDone, c.rate == null ? "" : Math.round(c.rate * 100), c.stuCount, c.pendingLogins.join(", ")]),
    ], [8, 18, 18, 13, 10, 11, 15, 50]), "Aplicação STU");

    XLSX.utils.book_append_sheet(wb, sheet([
      ["Gestor", "Erros", "% dos erros", "Associados", "Reincidentes", "Crítica", "STU realizado", "Casos com erro", "Cobertura STU %", "Principal erro"],
      ...dd.mgrs.map((m) => [m.manager, m.errors, pct(m.errors / (dd.tot.attributed || 1)), m.associates, m.reincident, m.critica, m.stuDone, m.stuPairs, m.stuRate == null ? "" : Math.round(m.stuRate * 100), m.topError ? `${m.topError[0]} (${m.topError[1]})` : ""]),
    ], [14, 8, 11, 11, 12, 8, 13, 13, 14, 28]), "Por gestor");

    const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    download(new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), ddName(dd, "xlsx"));
  }

  async function deepPdf(dd) {
    const A = an(), L = A.wkLabel, PL = A.PRIO_LABEL, fi = A.fmtInt, fp = A.fmtPct;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 14;
    const header = () => {
      doc.setFillColor(...C.ink); doc.rect(0, 0, W, 4, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(...C.ink);
      doc.text("IRDR | ANALISES · DIVE DEEP", M, 11);
      doc.setFont("helvetica", "normal"); doc.setTextColor(...C.ink3);
      doc.text(`${dd.ctx.wh} · ${dd.range} · ${dd.keys.length} semana(s)`, W - M, 11, { align: "right" });
      doc.setDrawColor(...C.line); doc.line(M, 14, W - M, 14);
    };
    const section = (title, y, sub) => {
      doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...C.ink); doc.text(title, M, y);
      if (sub) { doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(...C.ink3); doc.text(sub, M, y + 4.5); }
      return y + (sub ? 8 : 5);
    };
    const ensure = (y, need) => { if (y > H - need) { doc.addPage(); header(); return 24; } return y; };
    const ts = {
      theme: "plain", margin: { left: M, right: M, top: 20 },
      styles: { font: "helvetica", fontSize: 8.5, cellPadding: 2.2, textColor: C.ink, lineColor: C.line, lineWidth: { bottom: 0.2 } },
      headStyles: { fillColor: C.surface2, textColor: C.ink3, fontStyle: "bold", fontSize: 7.5 },
      didDrawPage: header,
    };
    const prioCell = (col) => (d) => {
      if (d.section === "body" && d.column.index === col) {
        const k = { "CRÍTICA": "CRITICA", ALTA: "ALTA", "MÉDIA": "MEDIA", OK: "OK" }[d.cell.raw];
        if (k) { d.cell.styles.textColor = C[k]; d.cell.styles.fontStyle = "bold"; d.cell.styles.fillColor = WASH[k]; }
      }
    };
    const t = dd.tot;

    // ---- Página 1: resumo executivo ----
    header();
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...C.ink3);
    doc.text("DIVE DEEP · CONTAGEM OFICIAL DE INVENTÁRIO", M, 24);
    doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(...C.ink);
    doc.text(`${dd.ctx.wh} · ${dd.range}`, M, 33);
    const kpis = [
      ["Erros pesquisados", fi(t.errors), `${t.associates} associado(s) · ${t.unknown} sem ofensor`],
      ["DPMO consolidado", t.dpmo != null ? fi(t.dpmo) : "—", t.dpmo != null ? `${fi(t.counted)} registros contados` : "sem Pick Area importado"],
      ["Registros defeituosos", fi(t.defects), `${t.nz} Net Zero · ${t.dd} Double Defect`],
      ["Reincidentes", fi(dd.recur.reincident), `de ${dd.recur.associates} · ${dd.recur.afterStu} após STU`],
      ["Aplicação de STU", dd.stu.rate != null ? fp(dd.stu.rate, 0) : "—", dd.stu.pairs ? `${dd.stu.done} de ${dd.stu.pairs} casos` : "sem casos no período"],
    ];
    const kw = (W - 2 * M - 4 * 4) / 5;
    kpis.forEach(([l, v, sub], i) => {
      const x = M + i * (kw + 4), y = 40;
      doc.setDrawColor(...C.line); doc.setFillColor(255, 255, 255); doc.roundedRect(x, y, kw, 26, 2, 2, "FD");
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(...C.ink3); doc.text(l, x + 4, y + 6);
      doc.setFont("helvetica", "bold"); doc.setFontSize(17); doc.setTextColor(...C.ink); doc.text(v, x + 4, y + 15);
      doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(...C.ink3); doc.text(doc.splitTextToSize(sub, kw - 8), x + 4, y + 21);
    });
    const colW = (W - 2 * M - 10) / 2;
    const bullets = (title, items, x, y0, color) => {
      doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...C.ink); doc.text(title, x, y0);
      let y = y0 + 8;
      doc.setFontSize(9); doc.setFont("helvetica", "normal");
      for (const it of items) {
        const lines = doc.splitTextToSize(it.text, colW - 6);
        if (y + lines.length * 4.2 > H - 14) break;
        doc.setFillColor(...(it.color || color)); doc.circle(x + 1, y - 1.2, 0.9, "F");
        doc.setTextColor(...C.ink2); doc.text(lines, x + 4, y);
        y += lines.length * 4.2 + 2.8;
      }
    };
    bullets("Principais conclusões", dd.findings.map((f) => ({ text: plain(f.html) })), M, 78, C.primary);
    bullets("Recomendações", dd.recs.map((r) => ({ text: r.text, color: C[r.priority] || C.primary })), M + colW + 10, 78, C.primary);

    // ---- Página 2: comparativo semanal ----
    doc.addPage(); header();
    let y = section("Comparativo entre semanas", 24, dd.keys.length > 1 ? "Erros por processo (barras) e DPMO (linha)" : "Uma semana importada: a comparação aparece com duas ou mais semanas");
    if (dd.keys.length > 1) {
      const img = await chartImage(IRDR.ddWeeksCfg(dd, { static: true }), 900, 300);
      const iw = W - 2 * M;
      doc.addImage(img, "PNG", M, y, iw, iw * 300 / 900, undefined, "FAST");
      y += iw * 300 / 900 + 6;
    }
    const cov = (k) => dd.stu.rows.find((c) => c.key === k);
    y = ensure(y, 50);
    doc.autoTable({ ...ts, startY: y,
      head: [["Semana", "DPMO", "Contados", "Defeituosos", "NZ", "DD", "Erros", "Associados", "Sem ofensor", "Pendentes", "Principal erro", "STU"]],
      body: dd.weeks.map((w) => [L(w.key), w.s.dpmo != null ? fi(w.s.dpmo) : "—", w.s.counted != null ? fi(w.s.counted) : "—", w.has.ov || w.has.dd ? fi(w.s.defects) : "—", w.has.dd ? w.s.nz : "—", w.has.dd ? w.s.dd : "—", w.has.rs ? w.s.errors : "—", w.has.rs ? w.s.associates : "—", w.has.rs ? w.s.unknown : "—", w.has.dd ? w.s.pending : "—", w.errors[0] ? `${w.errors[0][0]} (${w.errors[0][1]})` : "—", cov(w.key) ? covText(cov(w.key)) : "—"]),
      columnStyles: Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => [i, { halign: "right" }])),
      didParseCell: (d) => { if (d.section === "body" && d.column.index === 11) { const v = d.cell.raw; d.cell.styles.fontStyle = "bold"; d.cell.styles.textColor = v === "Não realizado" ? C.CRITICA : v === "Parcial" ? C.ALTA : v === "Realizado" || v === "STU registrado" ? C.OK : C.ink3; } },
    });

    // ---- Página 3: erros e áreas ----
    doc.addPage(); header();
    y = section("Principais erros (Pareto)", 24, `${dd.errors.length} tipo(s) de erro · ${t.errors} erro(s) pesquisado(s)`);
    if (dd.errors.length) {
      const h = Math.min(10, dd.errors.length) * 26 + 70;
      const img = await chartImage(IRDR.ddParetoCfg(dd, { static: true }), 900, h);
      const iw = (W - 2 * M) * 0.62;
      doc.addImage(img, "PNG", M, y, iw, iw * h / 900, undefined, "FAST");
      y += iw * h / 900 + 6;
      y = ensure(y, 40);
      doc.autoTable({ ...ts, startY: y,
        head: [["Erro", "Erro (PT)", "Processos", "Qtd.", "%", "Acum.", "Assoc.", ...(dd.keys.length > 1 ? dd.keys.map(L) : [])]],
        body: dd.errors.map((e) => [e.error, e.pt || "—", e.paths.map(([p]) => p).join(", "), e.n, fp(e.share, 0), fp(e.cum, 0), e.assoc, ...(dd.keys.length > 1 ? dd.keys.map((k) => e.byWeek[k] || "·") : [])]),
        columnStyles: Object.fromEntries([3, 4, 5, 6, ...dd.keys.map((_, i) => 7 + i)].map((i) => [i, { halign: "right" }])),
      });
      y = doc.lastAutoTable.finalY + 10;
    }
    y = ensure(y, 50);
    y = section("Áreas mais ofensoras", y, "Processo › área da pesquisa e pick areas");
    doc.autoTable({ ...ts, startY: y, tableWidth: (W - 2 * M) * 0.48,
      head: [["Processo", "Área", "Erros", "%"]],
      body: dd.pathAreas.map((a) => [a.path, a.area, a.n, fp(a.share, 0)]),
      columnStyles: { 2: { halign: "right", fontStyle: "bold" }, 3: { halign: "right" } },
    });
    const leftEnd = doc.lastAutoTable.finalY;
    doc.autoTable({ ...ts, startY: y, margin: { left: M + (W - 2 * M) * 0.52, right: M, top: 20 },
      head: [["Pick area", "DPMO", "Defeituosos", "DD/NZ", "Erros"]],
      body: dd.pick.slice(0, 15).map((a) => [a.area, a.dpmo != null ? fi(a.dpmo) : "—", fi(a.defects), a.records, a.errors]),
      columnStyles: { 1: { halign: "right", fontStyle: "bold" }, 2: { halign: "right" }, 3: { halign: "right" }, 4: { halign: "right" } },
    });
    y = Math.max(leftEnd, doc.lastAutoTable.finalY) + 10;

    // ---- Página 4: recorrência, STU e gestores ----
    doc.addPage(); header();
    const r = dd.recur;
    y = section("Recorrência de associados", 24, `${r.associates} associado(s) com erro · 1 erro: ${r.dist.one} · 2 erros: ${r.dist.two} · 3+: ${r.dist.more} · mesmo erro repetido: ${r.sameError} · erraram após STU: ${r.afterStu}`);
    if (r.list.length) {
      doc.autoTable({ ...ts, startY: y,
        head: [["Associado", "Prioridade", "Gestor", "Período", "Histórico", "Semanas", "Erro repetido", "Erros", "Último STU"]],
        body: r.list.map((o) => [o.login, PL[o.prio], o.manager || "—", o.nScope, o.total, o.weeks.map(L).join(" "), o.same ? `${o.same[0]} ×${o.same[1]}` : "tipos diferentes", o.errors.map(([e, n]) => e + (n > 1 ? ` ×${n}` : "")).join(", "), o.lastFeedback ? L(o.lastFeedback.key) : "nenhum"]),
        columnStyles: { 0: { font: "courier", fontStyle: "bold" }, 3: { halign: "right", fontStyle: "bold" }, 4: { halign: "right" }, 7: { cellWidth: 60 } },
        didParseCell: prioCell(1),
      });
      y = doc.lastAutoTable.finalY + 10;
    } else {
      doc.setFontSize(9); doc.setTextColor(...C.ink2); doc.text("Nenhum reincidente no histórico importado.", M, y + 2); y += 10;
    }
    y = ensure(y, 45);
    y = section("Aplicação de STU por semana", y, `Cobertura ${dd.stu.rate != null ? fp(dd.stu.rate, 0) : "—"} (${dd.stu.done} de ${dd.stu.pairs})${dd.stu.lagAvg != null ? ` · prazo médio ${fi(dd.stu.lagAvg)} dia(s) após a contagem` : ""} · ${dd.stu.registered} STU(s) registrados no período`);
    doc.autoTable({ ...ts, startY: y, tableWidth: 230,
      head: [["Semana", "Status", "Com erro", "Realizado", "Pendente", "Cobertura", "STUs", "Pendentes"]],
      body: dd.stu.rows.map((c) => [L(c.key), covText(c), c.associates || "—", c.associates ? c.done : "—", c.associates ? c.notDone : "—", c.rate == null ? "—" : fp(c.rate, 0), c.stuCount || "—", c.pendingLogins.join(", ") || "—"]),
      columnStyles: Object.fromEntries([2, 3, 4, 5, 6].map((i) => [i, { halign: "right" }])),
      didParseCell: (d) => { if (d.section === "body" && d.column.index === 1) { const v = d.cell.raw; d.cell.styles.fontStyle = "bold"; d.cell.styles.textColor = v === "Não realizado" ? C.CRITICA : v === "Parcial" ? C.ALTA : v === "Realizado" || v === "STU registrado" ? C.OK : C.ink3; } },
    });
    y = doc.lastAutoTable.finalY + 10;
    if (dd.mgrs.length) {
      y = ensure(y, 40);
      y = section("Por gestor", y);
      doc.autoTable({ ...ts, startY: y, tableWidth: 230,
        head: [["Gestor", "Erros", "% dos erros", "Associados", "Reincidentes", "Crítica", "STU", "Principal erro"]],
        body: dd.mgrs.map((m) => [m.manager, m.errors, fp(m.errors / (t.attributed || 1), 0), m.associates, m.reincident, m.critica, m.stuPairs ? `${m.stuDone}/${m.stuPairs}` : "—", m.topError ? `${m.topError[0]} (${m.topError[1]})` : "—"]),
        columnStyles: Object.fromEntries([1, 2, 3, 4, 5, 6].map((i) => [i, { halign: "right" }])),
      });
    }

    const n = doc.internal.getNumberOfPages();
    for (let i = 1; i <= n; i++) {
      doc.setPage(i);
      doc.setFontSize(8); doc.setTextColor(...C.ink3); doc.setFont("helvetica", "normal");
      doc.text(`Gerado em ${IRDR.store.isoDateTime(new Date()).slice(0, 16)} · Contagem oficial IRDR · uso interno`, M, H - 7);
      doc.text(`${i} / ${n}`, W - M, H - 7, { align: "right" });
    }
    doc.save(ddName(dd, "pdf"));
  }

  IRDR.exp = { xlsx, pdf, download, feedbackTemplate, deepXlsx, deepPdf };
})();
