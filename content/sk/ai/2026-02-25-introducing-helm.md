---
title: "Predstavujeme helm"
description: "Typovaný TypeScript framework pre AI agentov. Nahraďte desiatky nástrojov dvoma — search a execute — a spúšťajte kód generovaný LLM v sandboxe s podrobne nastavenými oprávneniami."
date: "2026-02-25"
tags: [ml/ai, open-source, frontend]
---

# Predstavujeme helm

helm je typovaný framework TypeScriptu pre AI agentov. Namiesto spúšťania shellových príkazov a parsovania reťazcov agenti volajú typované funkcie so štruktúrovanými vstupmi a výstupmi:

```ts
import { createHelm, git, fs, grep } from "@bgub/helm";

const agent = createHelm({
  permissions: {
    "fs.read": "allow",
    "fs.write": "ask",
    "fs.remove": "deny",
    "git.status": "allow",
    "git.*": "ask",
  },
  onPermissionRequest: async (operation, args) => {
    return confirm(`Allow ${operation}?`);
  },
})
  .use(fs())
  .use(git())
  .use(grep());

const { staged, unstaged, branch } = await agent.git.status();
const { content } = await agent.fs.read("./package.json");
```

„Skilly“ — skupiny súvisiacich operácií — registrujete pomocou builder patternu. TypeScript v každom kroku odvodí úplný typ. Každá operácia má úroveň oprávnenia: `allow` (spustí sa okamžite), `ask` (pozastaví sa a čaká na schválenie) alebo `deny` (vyhodí `PermissionDeniedError`). Oprávnenia sa vyhodnocujú podľa priority: presná zhoda → zástupný znak → predvolené nastavenie autora skillu → globálne predvolené nastavenie.

helm sa dodáva so vstavanými skillmi pre bežné úlohy, ktoré agenti vykonávajú každý deň: `fs`, `git`, `grep`, `edit`, `shell`, `http`. Môžete definovať vlastné skilly a automaticky k nim získate typy, search aj oprávnenia.

## Ukážka

Vytvoril som chatbot, v ktorom má agent presne dva nástroje: `search` a `execute`.

`search` vyhľadáva podľa kľúčových slov vo všetkých registrovaných operáciách helm — agent ho používa na zistenie, čo je k dispozícii, a na oboznámenie sa so signatúrami funkcií:

```ts
agent.search("file read");
// → [{ qualifiedName: "fs.read",
//      description: "Read a file and return its content as a string",
//      signature: "(path: string) => Promise<{ content: string }>", ... }]
```

`execute` prijíma ľubovoľný kód v jazyku JavaScript a spúšťa ho cez API agenta helm. LLM píše kód napríklad takto:

```js
const { staged, unstaged, branch } = await agent.git.status();
return { branch, staged: staged.length, unstaged: unstaged.length };
```

V kontexte sú dva nástroje bez ohľadu na to, koľko skills je zaregistrovaných. Agent si podľa potreby zistí, čo potrebuje, a napíše kód na ich použitie.

![Demo app helm zobrazujúca súbory v aktuálnom adresári](/blog-images/helm-demo-app-list-files.png)

### Sandboxovanie nedôveryhodného kódu

Nástroj `execute` spúšťa ľubovoľný JavaScript, ktorý LLM napíše. Aby to bolo bezpečné, demo ho izoluje pomocou [SES (Secure ECMAScript)](https://github.com/endojs/endo/tree/master/packages/ses) v podprocese.

SES `lockdown()` zmrazí všetky vstavané prvky JavaScriptu — `Object`, `Array`, `Promise`, `Function`, skrátka všetko. Kód beží v `Compartment`, izolovanom globálnom priestore s prístupom presne k dvom veciam: proxy objektu `agent` a stubovanému `console`. `fetch`, `require`, `import`, `process`, `fs` — nič z toho v tomto priestore neexistuje. Jediný spôsob, ako urobiť čokoľvek zaujímavé, vedie cez proxy objekt agenta.

`agent` vnútri sandboxu nie je skutočný helm agent — je to rekurzívny `Proxy`, ktorý zachytáva prístup k vlastnostiam a volania funkcií. Keď kód zavolá `agent.git.status()`, proxy odošle IPC správu nadradenému procesu. Nadradený proces zavolá skutočnú metódu na skutočnom helm agente, vykoná úplnú kontrolu oprávnení a pošle výsledok späť. Ak je operácia nastavená na `"ask"`, nadradený proces pred odpoveďou počká na schválenie používateľom. Ak je nastavená na `"deny"`, chyba sa prenesie späť cez IPC.

Kód bežiaci v sandboxe netuší, že sa niečo z toho deje. Jednoducho len vidí, že sa jeho `await` vyhodnotí na hodnotu. Jediný spôsob interakcie s vonkajším svetom vedie cez operácie v helme riadené oprávneniami.

### UI oprávnení

V UI chatu je na bočnom paneli zoznam všetkých zaregistrovaných skillov a operácií, pričom každá má prepínač allow/ask/deny. Zmena oprávnenia sa prejaví pri ďalšej správe.

![Panel nástrojov s ovládacími prvkami oprávnení pre každú operáciu zvlášť](/blog-images/helm-demo-app.png)

Keď LLM narazí na operáciu nastavenú na `"ask"`, server priebežne odošle požiadavku na schválenie do frontendu. Pri volaní nástroja sa zobrazí inline banner s tlačidlami Allow a Deny. Server čaká na vyriešenie `Promise<boolean>`, kým používateľ neklikne na jedno z tlačidiel.

![Volanie nástroja execute čakajúce na schválenie používateľom pomocou tlačidiel Allow a Deny](/blog-images/helm-demo-app-sandbox-feature.png)

Ak používateľ odmietne, `PermissionDeniedError` sa propaguje až naspäť a LLM ju uvidí vo výsledku nástroja. Môže vysvetliť, prečo oprávnenie potrebuje, skúsiť iný postup alebo sa vzdať.

## Inšpirácia

Táto architektúra — dať agentovi nástroj na spúšťanie kódu namiesto desiatok samostatných nástrojov — vznikla na základe inšpirácie [code mode](https://blog.cloudflare.com/code-mode-mcp/) od Cloudflare pre ich MCP server, kde znížili spotrebu tokenov o 99,9 % tým, že viac ako 2 500 nástrojov pre API endpointy nahradili pomocou `search` + `execute`. [Podobný nápad Rhysa Sullivana](https://x.com/RhysSullivan/status/2019819177473933404) mi túto myšlienku pomohol ujasniť: kombinácia spúšťania kódu, možnosti objavovať dostupné operácie a detailného modelu oprávnení znamená, že agent dokáže robiť čokoľvek, no zároveň sa nemôže vymknúť spod kontroly.

## Vyskúšajte to

```bash
npm install @bgub/helm
```

Zdrojový kód je na [GitHub](https://github.com/bgub/helm). Ukážková aplikácia je v `apps/demo`.