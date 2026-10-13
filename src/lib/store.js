/* IRDR | ANALISES — armazenamento local (IndexedDB) e importação de planilhas.
   Tudo fica no navegador desta máquina: nenhum dado sai do computador. */
(function () {
  const IRDR = (window.IRDR = window.IRDR || {});

  // ---------- IndexedDB (chave/valor simples) ----------
  const DB_NAME = "irdr-analises";
  const STORE = "kv";
  let dbp = null;
  function db() {
    if (!dbp) {
      dbp = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return dbp;
  }
  async function idbGet(key) {
    const d = await db();
    return new Promise((res, rej) => {
      const r = d.transaction(STORE).objectStore(STORE).get(key);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  async function idbSet(key, val) {
    const d = await db();
    return new Promise((res, rej) => {
      const tx = d.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(val, key);
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  }

  const KEYS = ["overview", "defects", "research", "feedbacks", "actions", "imports", "settings"];
  const data = { overview: [], defects: [], research: [], feedbacks: [], actions: [], imports: [], settings: {} };

  async function load() {
    try {
      for (const k of KEYS) {
        const v = await idbGet(k);
        if (v !== undefined) data[k] = v;
      }
    } catch (e) {
      console.warn("IndexedDB indisponível, usando apenas memória.", e);
      IRDR.storageWarning = true;
    }
    return data;
  }
  async function save(...keys) {
    try {
      for (const k of keys.length ? keys : KEYS) await idbSet(k, data[k]);
    } catch (e) {
      console.warn("Falha ao salvar", e);
    }
  }

  // ---------- Normalização ----------
  const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const toNum = (v) => {
    if (v === null || v === undefined || v === "") return 0;
    if (typeof v === "number") return v;
    const s = String(v).trim().replace(/\s/g, "");
    // aceita 1.234,5 (pt-BR) e 1234.5
    const n = /,\d{1,3}$/.test(s) && !/\.\d{1,3}$/.test(s) ? Number(s.replace(/\./g, "").replace(",", ".")) : Number(s.replace(/,/g, ""));
    return isFinite(n) ? n : 0;
  };
  const toStr = (v) => {
    if (v === null || v === undefined) return "";
    if (v instanceof Date) return isoDateTime(v);
    return String(v).trim();
  };
  const yn = (v) => /^(y|yes|s|sim|true|1)$/i.test(String(v || "").trim());
  function isoDateTime(d) {
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  // Lê um campo tolerando variações de nome de coluna.
  function picker(row) {
    const map = {};
    for (const k of Object.keys(row)) map[norm(k)] = row[k];
    return (...names) => {
      for (const n of names) {
        const v = map[norm(n)];
        if (v !== undefined && v !== "") return v;
      }
      return "";
    };
  }

  // ---------- Detecção do tipo de planilha (pelos cabeçalhos) ----------
  const KINDS = {
    overview: { label: "DPMO por Pick Area", hint: "Overview / Pick Area — colunas Pick Area, Counted Records, Defective Records, Dpmo" },
    defects: { label: "Registros DD/NZ", hint: "DD/NZ — colunas Bin, Fnsku, Expected/Counted Quantity, M Or F, Net Zero, Double Defect" },
    research: { label: "Pesquisas concluídas", hint: "Completed Research — colunas Error Login, Path, Area, Error, Synopsis, Deviations" },
    feedbacks: { label: "Feedbacks (STU)", hint: "Export de STU do ONT Base (Research, Login, Week, Comments, Submitted By) ou o modelo Excel" },
  };
  function detectKind(headers) {
    const h = new Set(headers.map(norm));
    if (h.has("dpmo") && (h.has("defectiverecords") || h.has("countedrecords"))) return "overview";
    if (h.has("errorlogin") || (h.has("synopsis") && h.has("path"))) return "research";
    if (h.has("morf") && h.has("bin") && (h.has("expectedquantity") || h.has("countedquantity"))) return "defects";
    if (h.has("login") && (h.has("semana") || h.has("week")) && (h.has("tipo") || h.has("aplicadopor") || h.has("stu") || h.has("comments") || h.has("submittedby"))) return "feedbacks";
    return null;
  }

  function mapOverview(r) {
    const g = picker(r);
    return {
      wh: toStr(g("Warehouse", "FC")).toUpperCase(),
      year: toNum(g("Year", "Ano")),
      week: toNum(g("Week", "Semana")),
      pickArea: toStr(g("Pick Area")),
      countedBins: toNum(g("Counted Bins")),
      countedRecords: toNum(g("Counted Records")),
      expectedRecords: toNum(g("Expected Records")),
      defects: toNum(g("Defective Records")),
      countedQty: toNum(g("Counted Quantity")),
      expectedQty: toNum(g("Expected Quantity")),
      dpmo: toNum(g("Dpmo")),
    };
  }
  function mapDefect(r) {
    const g = picker(r);
    return {
      wh: toStr(g("Warehouse", "FC")).toUpperCase(),
      year: toNum(g("Year")),
      week: toNum(g("Week")),
      bin: toStr(g("Bin")),
      fnsku: toStr(g("Fnsku")),
      fcsku: toStr(g("Fcsku")),
      countEnd: toStr(g("Count End", "Count Date")),
      expQty: toNum(g("Expected Quantity", "Exp Q")),
      cntQty: toNum(g("Counted Quantity", "Count Q")),
      mf: toStr(g("M Or F")),
      nz: yn(g("Net Zero")),
      dd: yn(g("Double Defect")),
      binType: toStr(g("Bin Type Name")),
      binUsage: toStr(g("Bin Usage Name")),
      dropZone: toStr(g("Drop Zone")),
      pickArea: toStr(g("Pick Area")),
    };
  }
  function mapResearch(r) {
    const g = picker(r);
    const login = toStr(g("Error Login")).toLowerCase();
    return {
      wh: toStr(g("Warehouse", "FC")).toUpperCase(),
      year: toNum(g("Year")),
      week: toNum(g("Week")),
      bin: toStr(g("Bin")),
      fnsku: toStr(g("Fnsku")),
      fcsku: toStr(g("Fcsku")),
      countDate: toStr(g("Count Date", "Count End")),
      dd: yn(g("Double Defect")),
      nz: yn(g("Net Zero")),
      expQ: toNum(g("Exp Q", "Expected Quantity")),
      countQ: toNum(g("Count Q", "Counted Quantity")),
      mf: toStr(g("M Or F")),
      synopsis: toStr(g("Synopsis")),
      login,
      tenure: toStr(g("Error Login Tenure")),
      manager: toStr(g("Error Manager Login")).toLowerCase(),
      errorDate: toStr(g("Error Date")).slice(0, 10),
      errorAge: toStr(g("Error Age")),
      notes: toStr(g("Notes")).replace(/^-$/, ""),
      deviations: toStr(g("Deviations")),
      path: toStr(g("Path")) || "Unknown",
      area: toStr(g("Area")) || "Unknown",
      error: toStr(g("Error")) || "Unknown Problem",
      researchedBy: toStr(g("Researched By")).toLowerCase(),
      researchedAt: toStr(g("Researched At")),
      binType: toStr(g("Bin Type Name")),
      binUsage: toStr(g("Bin Usage Name")),
    };
  }
  function mapFeedback(r) {
    const g = picker(r);
    return {
      id: uid(),
      login: toStr(g("Login", "Associado")).toLowerCase(),
      wh: toStr(g("FC", "Warehouse")).toUpperCase(),
      year: toNum(g("Ano", "Year")) || new Date().getFullYear(),
      week: toNum(g("Semana", "Week")),
      date: toStr(g("Data", "Date", "Submitted At", "Updated At")).slice(0, 10),
      type: toStr(g("Tipo", "Type")) || "STU",
      by: toStr(g("Aplicado por", "Responsável", "Responsavel", "Submitted By", "Updated By")).toLowerCase(),
      error: toStr(g("Erro referente", "Erro", "Error")),
      note: toStr(g("Observação", "Observacao", "Notes", "Comments")),
      research: toStr(g("Research", "Pesquisa")),
      manager: toStr(g("Manager Login", "Gestor")).toLowerCase(),
      source: g("Research") !== "" ? "ONT Base" : "Planilha",
    };
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  const keyOf = {
    overview: (r) => [r.wh, r.year, r.week, r.pickArea].join("|"),
    defects: (r) => [r.wh, r.year, r.week, r.bin, r.fnsku].join("|"),
    research: (r) => [r.wh, r.year, r.week, r.bin, r.fnsku].join("|"),
    feedbacks: (r) => (r.research ? [r.login, r.year, r.week, "R" + r.research] : [r.login, r.year, r.week, r.date, r.type, r.error]).join("|"),
  };
  const mappers = { overview: mapOverview, defects: mapDefect, research: mapResearch, feedbacks: mapFeedback };

  // Lê um arquivo (xlsx/xls/csv) e devolve as abas com linhas e tipo detectado.
  async function readFile(file) {
    const isCsv = /\.(csv|txt)$/i.test(file.name);
    let wb;
    if (isCsv) {
      const text = await file.text();
      wb = XLSX.read(text, { type: "string", raw: true });
    } else {
      const buf = await file.arrayBuffer();
      wb = XLSX.read(buf, { type: "array", cellDates: true });
    }
    const sheets = [];
    for (const name of wb.SheetNames) {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[name], { defval: "", raw: true });
      if (!rows.length) continue;
      const kind = detectKind(Object.keys(rows[0]));
      sheets.push({ name, rows, kind });
    }
    return sheets;
  }

  // Importa linhas, substituindo registros com a mesma chave (reimportar a semana atualiza os dados).
  function ingest(kind, rows) {
    const mapped = rows.map(mappers[kind]).filter((r) => (kind === "feedbacks" ? r.login : r.week));
    const k = keyOf[kind];
    const idx = new Map(data[kind].map((r, i) => [k(r), i]));
    let added = 0, updated = 0;
    for (const r of mapped) {
      const key = k(r);
      if (idx.has(key)) {
        const i = idx.get(key);
        if (kind === "feedbacks") r.id = data[kind][i].id;
        data[kind][i] = r;
        updated++;
      } else {
        idx.set(key, data[kind].length);
        data[kind].push(r);
        added++;
      }
    }
    const weeks = [...new Set(mapped.map((r) => r.week).filter(Boolean))].sort((a, b) => a - b);
    return { added, updated, weeks, total: mapped.length };
  }

  async function importFiles(files) {
    const results = [];
    for (const file of files) {
      try {
        const sheets = await readFile(file);
        const recognized = sheets.filter((s) => s.kind);
        if (!recognized.length) {
          results.push({ file: file.name, ok: false, msg: "Formato não reconhecido. Confira se a primeira linha tem os cabeçalhos do export do ONT Base." });
          continue;
        }
        for (const s of recognized) {
          const r = ingest(s.kind, s.rows);
          const entry = { id: uid(), at: isoDateTime(new Date()), file: file.name, sheet: s.name, kind: s.kind, ...r };
          data.imports.unshift(entry);
          results.push({ file: file.name, ok: true, ...entry });
        }
      } catch (e) {
        console.error(e);
        results.push({ file: file.name, ok: false, msg: "Não foi possível ler o arquivo (" + (e.message || e) + ")." });
      }
    }
    data.imports = data.imports.slice(0, 200);
    await save("overview", "defects", "research", "feedbacks", "imports");
    return results;
  }

  async function clearAll() {
    for (const k of KEYS) data[k] = k === "settings" ? {} : [];
    await save();
  }

  // Backup completo em JSON (para levar a outra máquina)
  function backupJson() {
    return JSON.stringify({ app: "irdr-analises", version: 1, exportedAt: isoDateTime(new Date()), data }, null, 0);
  }
  async function restoreJson(text) {
    const obj = JSON.parse(text);
    if (!obj || obj.app !== "irdr-analises" || !obj.data) throw new Error("Arquivo de backup inválido.");
    for (const k of KEYS) if (obj.data[k] !== undefined) data[k] = obj.data[k];
    await save();
  }

  IRDR.store = { data, load, save, importFiles, clearAll, backupJson, restoreJson, KINDS, uid, isoDateTime, toNum };
})();
