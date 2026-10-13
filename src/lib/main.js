/* IRDR | ANALISES — ponto de entrada no navegador.
   1) Expõe as bibliotecas como globais usadas pelos módulos (XLSX, Chart, jspdf).
   2) Carrega os módulos na ordem: ícones, glossário, armazenamento, regras, exportação e telas. */
import "./vendor.js";
import "./icons.js";
import "./glossary.js";
import "./store.js";
import "./analytics.js";
import "./export.js";
import "./app.js";
