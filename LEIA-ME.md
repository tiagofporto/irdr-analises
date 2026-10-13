# IRDR | ANALISES (Astro)

Sistema para analisar a contagem oficial de inventário (IRDR): DPMO por área, erros por processo, ofensores com prioridade de feedback (STU), plano de ação e relatório gerencial em PDF e Excel.

Cada usuário importa as próprias planilhas e baixa os próprios relatórios. Não há banco de dados: os dados ficam salvos no navegador de quem importou. Nada é enviado para servidor.

## 1. Instalar uma vez

1. Instale o **Node.js 22 LTS** (ou mais novo): https://nodejs.org. Na instalação, deixe as opções padrão.
2. Descompacte `irdr-analises-astro.zip` numa pasta, por exemplo `C:\projetos\irdr-analises-astro`.
3. Abra um terminal nessa pasta (no Windows: botão direito dentro da pasta › "Abrir no Terminal") e rode:

```
npm install
```

## 2. Usar no seu computador

```
npm run dev
```

Abra o endereço que aparecer (normalmente http://localhost:4321/irdr-analises/). Mudanças no código aparecem na hora. Para parar, `Ctrl + C` no terminal.

## 3. Publicar para o time

O site está no GitHub Pages: **https://tiagofporto.github.io/irdr-analises/**

Cada alteração enviada para a branch `main` é publicada sozinha (aba **Actions** do repositório mostra o andamento). Configuração feita uma única vez: em **Settings › Pages**, em "Build and deployment", escolha **Source: GitHub Actions**.

Para conferir o build na sua máquina antes de enviar: `npm run build` e depois `npm run preview`.

Para publicar em outro lugar (ex.: servidor interno), ajuste `site` e `base` em `astro.config.mjs`, rode `npm run build` e copie o conteúdo de `dist/`.

## Dados

Este repositório é público e não contém nenhuma planilha. Os dados que cada pessoa importa ficam só no navegador dela. Nunca coloque exports do ONT Base, backups `.json` ou relatórios gerados dentro desta pasta.

## Uso semanal

1. **Importar dados**: arraste os exports do ONT Base (.xlsx ou .csv). O sistema reconhece cada planilha pelos cabeçalhos (Pick Area/Overview, DD/NZ, Completed Research, STU). Reimportar a mesma semana atualiza, sem duplicar.
2. Escolha a semana na faixa de semanas e a janela (4, 6, 8, 12 ou todas).
3. Analise em Visão geral, Erros e pesquisas, DPMO por área e Ofensores.
4. Registre STUs em Feedbacks e gere ações no Plano de ação.
5. **Gerar relatório PDF / Exportar Excel**: baixa o relatório da semana selecionada.

Para levar os dados a outro computador: Importar dados › Seus dados › backup `.json`. Limpar os dados de navegação apaga o que foi importado.

## Estrutura

```
src/pages/index.astro        página do sistema (monta menu, topo e conteúdo)
src/layouts/Layout.astro     <head>, tema e estilos globais
src/components/              Sidebar e Topbar
src/styles/app.css           visual (tema claro e escuro, tokens de cor)
src/fonts/                   Inter e JetBrains Mono (sem depender de internet)
src/lib/main.js              ponto de entrada: carrega os módulos na ordem
src/lib/vendor.js            SheetJS, Chart.js e jsPDF instalados pelo npm
src/lib/store.js             importação de planilhas e armazenamento no navegador
src/lib/analytics.js         regras: DPMO, erros, ofensores, prioridade, insights
src/lib/export.js            relatório PDF e Excel
src/lib/app.js               telas e interações (rotas #visao, #erros, ...)
src/lib/glossary.js          glossário de defeitos IRDR
src/lib/icons.js             ícones (Lucide)
.github/workflows/deploy.yml publica no GitHub Pages a cada push na main
```

## Regras de análise

- **DPMO** = registros defeituosos ÷ registros contados × 1.000.000.
- **Erro**: 1 por associado + semana + bin + tipo de erro (um par Net Zero no mesmo bin conta uma vez).
- **Prioridade**: CRÍTICA (reincidente após feedback), ALTA (reincidente sem feedback), MÉDIA (1º erro sem STU), OK (STU na semana do último erro ou depois).
- **STU não realizado**: semana com erro atribuído e sem STU registrado.
