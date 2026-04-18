---
title: "Predstavujeme helm"
description: "Typovaný TypeScript framework pre AI agentov. Nahraďte desiatky nástrojov dvoma — search a execute — a spúšťajte kód generovaný LLM v sandboxe s jemne nastaviteľnými oprávneniami."
date: "2026-02-25"
tags: [ml/ai, open-source, frontend]
---

# Predstavujeme helm

helm je typovaný framework v TypeScripte pre AI agentov. Namiesto volania shellu a parsovania reťazcov agenti volajú typované funkcie so štruktúrovanými vstupmi a výstupmi:

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

„Skills“ — skupiny súvisiacich operácií — registrujete pomocou builder patternu. TypeScript v každom kroku odvodí kompletný typ. Každá operácia má úroveň oprávnenia: `allow` (spustí sa okamžite), `ask` (pozastaví sa a čaká na schválenie) alebo `deny` (vyhodí `PermissionDeniedError`). Oprávnenia sa vyhodnocujú podľa priority: presná zhoda → zástupný znak → predvolená hodnota autora skillu → globálna predvolená hodnota.

helm sa dodáva so vstavanými skillmi na veci, ktoré agenti robia každý deň: `fs`, `git`, `grep`, `edit`, `shell`, `http`. Môžete definovať vlastné skilly a automaticky získajú typy, vyhľadávanie aj oprávnenia.

## Ukážka

Vytvoril som chatbot, v ktorom má agent presne dva nástroje: `search` a `execute`.

`search` vyhľadáva podľa kľúčových slov vo všetkých zaregistrovaných operáciách helm — agent ho volá, aby zistil, čo je k dispozícii, a oboznámil sa so signatúrami funkcií:

```ts
agent.search("file read");
// → [{ qualifiedName: "fs.read",
//      description: "Read a file and return its content as a string",
//      signature: "(path: string) => Promise<{ content: string }>", ... }]
```

`execute` prijíma ľubovoľný kód v JavaScripte a spúšťa ho cez API agenta helm. LLM píše kód takto:

```js
const { staged, unstaged, branch } = await agent.git.status();
return { branch, staged: staged.length, unstaged: unstaged.length };
```

Dva nástroje v kontexte bez ohľadu na počet zaregistrovaných skillov. Agent si podľa potreby zistí, čo potrebuje, a napíše kód na ich použitie.

![Ukážková aplikácia helm vypisujúca súbory v aktuálnom adresári](/blog-images/helm-demo-app-list-files.png)

### Izolácia nedôveryhodného kódu

Nástroj `execute` spustí akýkoľvek JavaScript, ktorý LLM napíše. Aby to bolo bezpečné, demo ho izoluje pomocou [SES (Secure ECMAScript)](https://github.com/endojs/endo/tree/master/packages/ses) v podriadenom procese.

SES `lockdown()` zmrazí všetky vstavané prvky JavaScriptu — `Object`, `Array`, `Promise`, `Function`, skrátka všetko. Kód beží v `Compartment`, izolovanom globálnom priestore s prístupom presne k dvom veciam: proxy objektu `agent` a stubovanej `console`. `fetch`, `require`, `import`, `process`, `fs` — nič z toho v compartmente neexistuje. Jediný spôsob, ako urobiť čokoľvek zaujímavé, je cez proxy agenta.

`agent` vo vnútri sandboxu nie je skutočný helm agent — je to rekurzívny `Proxy`, ktorý zachytáva prístup k vlastnostiam a volania funkcií. Keď kód zavolá `agent.git.status()`, proxy pošle IPC správu nadradenému procesu. Nadradený proces zavolá skutočnú metódu na skutočnom helm agentovi, vykoná úplnú kontrolu oprávnení a pošle výsledok späť. Ak je operácia nastavená na `"ask"`, nadradený proces pred odpoveďou pozastaví vykonávanie a počká na schválenie používateľom. Ak je nastavená na `"deny"`, chyba sa cez IPC prenesie späť.

Kód bežiaci v sandboxe nemá tušenie, že sa toto všetko deje. Len vidí, že jeho `await` vráti hodnotu. Jediný spôsob interakcie s vonkajším svetom je cez operácie helmu riadené oprávneniami.

### Rozhranie oprávnení

Chatovacie UI má bočný panel so zoznamom všetkých zaregistrovaných skillov a operácií, pričom každá má prepínač allow/ask/deny. Zmena oprávnenia sa prejaví pri nasledujúcej správe.

![Panel nástrojov s ovládaním povolení pre jednotlivé operácie](/blog-images/helm-demo-app.png)

Keď LLM narazí na operáciu nastavenú na `"ask"`, server odošle do frontendu požiadavku na schválenie formou streamu. Pri volaní nástroja sa zobrazí vložený banner s tlačidlami Allow a Deny. Server čaká na `Promise<boolean>`, kým používateľ na jedno z nich neklikne.

![Volanie nástroja execute čakajúce na schválenie používateľom s tlačidlami Allow a Deny](/blog-images/helm-demo-app-sandbox-feature.png)

Ak používateľ odmietne, `PermissionDeniedError` sa propaguje až naspäť a LLM ho uvidí vo výsledku nástroja. Môže vysvetliť, prečo toto oprávnenie potrebuje, skúsiť iný prístup alebo to vzdať.

## Inšpirácia

Táto architektúra — dať agentovi nástroj na spúšťanie kódu namiesto desiatok samostatných nástrojov — vznikla na základe režimu [code mode](https://blog.cloudflare.com/code-mode-mcp/) od Cloudflare pre ich MCP server, kde znížili spotrebu tokenov o 99,9 % tým, že viac ako 2 500 nástrojov pre API endpointy nahradili za `search` + `execute`. [Podobný nápad Rhysa Sullivana](https://x.com/RhysSullivan/status/2019819177473933404) mi túto myšlienku pomohol ujasniť: kombinácia spúšťania kódu, objaviteľnosti a podrobného modelu oprávnení znamená, že agent dokáže robiť čokoľvek, ale nemôže sa „utrhnúť z reťaze“.

## Vyskúšajte si to

```bash
npm install @bgub/helm
```

Zdrojový kód je na [GitHube](https://github.com/bgub/helm). Demo aplikácia je v `apps/demo`.