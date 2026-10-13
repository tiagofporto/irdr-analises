// @ts-check
import { defineConfig } from "astro/config";

// Site estático publicado no GitHub Pages: https://tiagofporto.github.io/irdr-analises/
// `npm run build` gera a pasta dist/. Para outro endereço (ex.: servidor interno),
// ajuste `site` e `base` (use base: "/" se o site ficar na raiz do domínio).
export default defineConfig({
  output: "static",
  site: "https://tiagofporto.github.io",
  base: "/irdr-analises",
  build: { assets: "assets" },
  vite: { build: { chunkSizeWarningLimit: 2500 } },
});
