/* Bibliotecas de terceiros instaladas pelo npm (ver package.json). */
import * as XLSX from "xlsx-js-style";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";

applyPlugin(jsPDF); // habilita doc.autoTable(...)
window.XLSX = XLSX;
window.Chart = Chart;
window.jspdf = { jsPDF };
