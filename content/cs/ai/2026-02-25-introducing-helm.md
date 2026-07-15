---
title: "Představujeme helm"
description: "Typovaný framework v TypeScriptu pro AI agenty. Nahraďte desítky nástrojů dvěma — vyhledáváním a spouštěním — a spouštějte kód generovaný LLM v sandboxu s jemně nastavitelnými oprávněními."
date: "2026-02-25"
tags: [ml/ai, open-source, frontend]
---

# Představujeme helm

helm je typovaný framework pro AI agenty napsaný v TypeScriptu. Místo práce se shellem a parsování řetězců agenti volají typované funkce se strukturovanými vstupy a výstupy:

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

„Skills“ — skupiny souvisejících operací — registrujete pomocí builder patternu. TypeScript v každém kroku odvodí kompletní typ. Každá operace má úroveň oprávnění: `allow` (spustí se okamžitě), `ask` (pozastaví se kvůli schválení) nebo `deny` (vyvolá `PermissionDeniedError`). Oprávnění se vyhodnocují podle priority: přesná shoda → zástupný znak → výchozí hodnota autora skillu → globální výchozí hodnota.

helm se dodává s vestavěnými skilly pro věci, které agenti dělají každý den: `fs`, `git`, `grep`, `edit`, `shell`, `http`. Můžete definovat vlastní skilly a automaticky k nim získáte typy, vyhledávání i oprávnění.

## Ukázka

Vytvořil jsem chatbota, který má k dispozici přesně dva nástroje: `search` a `execute`.

`search` vyhledává podle klíčových slov napříč všemi registrovanými operacemi v helm — agent ho volá, aby zjistil, co je k dispozici, a seznámil se se signaturami funkcí:

```ts
agent.search("file read");
// → [{ qualifiedName: "fs.read",
//      description: "Read a file and return its content as a string",
//      signature: "(path: string) => Promise<{ content: string }>", ... }]
```

`execute` přijímá libovolný kód v JavaScriptu a spouští ho nad API agenta helm. LLM píše kód například takto:

```js
const { staged, unstaged, branch } = await agent.git.status();
return { branch, staged: staged.length, unstaged: unstaged.length };
```

Dva nástroje v kontextu bez ohledu na počet zaregistrovaných skillů. Agent si podle potřeby zjistí, co potřebuje, a napíše kód pro jejich použití.

![Ukázková aplikace helm vypisující soubory v aktuálním adresáři](/blog-images/helm-demo-app-list-files.png)

### Sandboxování nedůvěryhodného kódu

Nástroj `execute` spustí jakýkoli JavaScript, který LLM napíše. Aby to bylo bezpečné, demo ho izoluje pomocí [SES (Secure ECMAScript)](https://github.com/endojs/endo/tree/master/packages/ses) v podřízeném procesu.

SES `lockdown()` zmrazí všechny vestavěné prvky JavaScriptu — `Object`, `Array`, `Promise`, `Function`, prostě všechno. Kód běží uvnitř `Compartment`, izolovaného globálního prostředí s přístupem přesně ke dvěma věcem: proxy `agent` a zástupnému `console`. `fetch`, `require`, `import`, `process`, `fs` — nic z toho v compartmentu neexistuje. Jediný způsob, jak udělat něco zajímavého, vede přes proxy agenta.

`agent` uvnitř sandboxu není skutečný agent helm — je to rekurzivní `Proxy`, který zachytává přístupy k vlastnostem a volání funkcí. Když kód zavolá `agent.git.status()`, proxy odešle IPC zprávu rodičovskému procesu. Ten zavolá skutečnou metodu na skutečném agentovi helm, provede úplnou kontrolu oprávnění a pošle výsledek zpět. Pokud je operace nastavená na `"ask"`, rodičovský proces se před odpovědí pozastaví a počká na schválení uživatelem. Pokud je nastavená na `"deny"`, chyba se přes IPC propaguje zpět.

Kód běžící v sandboxu vůbec netuší, že se něco z toho děje. Jen vidí, že se jeho `await` vyřeší na nějakou hodnotu. Jediný způsob, jak komunikovat s okolním světem, je přes operace helm řízené oprávněními.

### Rozhraní pro oprávnění

Rozhraní chatu má postranní panel se seznamem všech registrovaných dovedností a operací, přičemž každá má přepínač povolit/zeptat se/zakázat. Změna oprávnění se projeví u další zprávy.

![Panel nástrojů s ovládáním oprávnění pro jednotlivé operace](/blog-images/helm-demo-app.png)

Když LLM narazí na operaci nastavenou na `"ask"`, server do frontendu průběžně pošle žádost o schválení. U volání nástroje se zobrazí banner přímo v řádku s tlačítky Povolit a Zakázat. Server pak čeká na `Promise<boolean>`, dokud uživatel na jedno z nich neklikne.

![Volání nástroje execute čekající na schválení uživatelem s tlačítky Povolit a Zakázat](/blog-images/helm-demo-app-sandbox-feature.png)

Pokud uživatel akci zamítne, `PermissionDeniedError` se propíše až zpět a LLM ji uvidí ve výsledku nástroje. Může vysvětlit, proč oprávnění potřebuje, zkusit jiný postup nebo to vzdát.

## Inspirace

Tato architektura — dát agentovi nástroj pro spouštění kódu místo desítek samostatných nástrojů — se inspirovala [code mode](https://blog.cloudflare.com/code-mode-mcp/) od Cloudflare pro jejich MCP server, kde snížili spotřebu tokenů o 99,9 % tím, že více než 2 500 nástrojů pro API endpointy nahradili pomocí `search` + `execute`. [Podobný nápad Rhyse Sullivana](https://x.com/RhysSullivan/status/2019819177473933404) mi tu myšlenku pomohl ujasnit: kombinace spouštění kódu, objevitelnosti a jemně odstupňovaného modelu oprávnění znamená, že agent může dělat cokoli, ale nemůže se vymknout kontrole.

## Vyzkoušejte to

```bash
npm install @bgub/helm
```

Zdrojový kód je na [GitHubu](https://github.com/bgub/helm). Ukázková aplikace je v `apps/demo`.