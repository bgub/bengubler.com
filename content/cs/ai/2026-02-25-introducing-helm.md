---
title: "Představujeme helm"
description: "Typovaný framework v TypeScriptu pro AI agenty. Nahraďte desítky nástrojů dvěma — search a execute — a spouštějte kód generovaný velkým jazykovým modelem v sandboxu s granulárními oprávněními."
date: "2026-02-25"
tags: [ml/ai, open-source, frontend]
---

# Představujeme helm

helm je typovaný framework pro AI agenty v TypeScriptu. Místo spouštění shellových příkazů a parsování řetězců agenti volají typované funkce se strukturovanými vstupy a výstupy:

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

Pomocí builder patternu registrujete &quot;skilly&quot; — skupiny souvisejících operací. TypeScript v každém kroku odvodí kompletní typ. Každá operace má úroveň oprávnění: `allow` (spustí se okamžitě), `ask` (pozastaví se kvůli schválení) nebo `deny` (vyhodí `PermissionDeniedError`). Oprávnění se vyhodnocují podle priority: přesná shoda → zástupný znak → výchozí nastavení definované autorem skillu → globální výchozí nastavení.

helm obsahuje vestavěné skilly pro běžné každodenní úlohy agentů: `fs`, `git`, `grep`, `edit`, `shell`, `http`. Můžete definovat vlastní skilly a automaticky pro ně získáte typy, `search` i oprávnění.

## Ukázka

Vytvořil jsem chatbota, ve kterém má agent přesně dva nástroje: `search` a `execute`.

`search` vyhledává podle klíčových slov napříč všemi registrovanými operacemi helm — agent ho volá, aby zjistil, co je k dispozici, a jaké mají funkce signatury:

```ts
agent.search("file read");
// → [{ qualifiedName: "fs.read",
//      description: "Read a file and return its content as a string",
//      signature: "(path: string) => Promise<{ content: string }>", ... }]
```

`execute` přijímá libovolný kód v JavaScriptu a spouští ho nad API agenta helm. Velký jazykový model píše kód například takto:

```js
const { staged, unstaged, branch } = await agent.git.status();
return { branch, staged: staged.length, unstaged: unstaged.length };
```

Dva nástroje v kontextu bez ohledu na to, kolik skillů je zaregistrováno. Agent si podle potřeby najde, co potřebuje, a napíše kód pro jeho použití.

![Ukázková aplikace helm vypisující soubory v aktuálním adresáři](/blog-images/helm-demo-app-list-files.png)

### Izolace nedůvěryhodného kódu

Nástroj `execute` spouští jakýkoli JavaScript, který velký jazykový model napíše. Aby to bylo bezpečné, demo ho izoluje pomocí [SES (Secure ECMAScript)](https://github.com/endojs/endo/tree/master/packages/ses) v podřízeném procesu.

SES `lockdown()` zmrazí všechny interní prvky JavaScriptu — `Object`, `Array`, `Promise`, `Function`, prostě všechno. Kód běží uvnitř `Compartment`, izolovaného globálního prostředí, které má přístup přesně ke dvěma věcem: k proxy `agent` a upravenému `console`. `fetch`, `require`, `import`, `process`, `fs` — nic z toho v compartmentu neexistuje. Jediný způsob, jak udělat něco zajímavého, vede přes proxy agenta.

`agent` uvnitř sandboxu není skutečný agent helm — je to rekurzivní `Proxy`, který zachytává přístup k vlastnostem a volání funkcí. Když kód zavolá `agent.git.status()`, proxy odešle IPC zprávu nadřazenému procesu. Ten zavolá skutečnou metodu na skutečném agentovi helm, provede úplnou kontrolu oprávnění a pošle výsledek zpět. Pokud je operace nastavená na `"ask"`, nadřazený proces před odpovědí počká na schválení od uživatele. Pokud je nastavená na `"deny"`, chyba se přes IPC vrátí zpět.

Kód běžící v sandboxu netuší, že se něco z toho děje. Jen vidí, že se jeho `await` vyhodnotí na nějakou hodnotu. Jediný způsob, jak komunikovat s okolním světem, je přes operace v helmu řízené oprávněními.

### Rozhraní pro oprávnění

Chatové UI má postranní panel se seznamem všech registrovaných skillů a operací, přičemž každá má přepínač povolit/zeptat se/zakázat. Změna oprávnění se projeví při další zprávě.

![Panel nástrojů s ovládacími prvky oprávnění pro jednotlivé operace](/blog-images/helm-demo-app.png)

Když velký jazykový model narazí na operaci nastavenou na `"ask"`, server do frontendu průběžně posílá žádost o schválení. U volání nástroje se zobrazí banner přímo v řádku s tlačítky Allow a Deny. Server čeká na `Promise<boolean>`, dokud uživatel na jedno z nich neklikne.

![Volání nástroje execute čekající na schválení uživatelem pomocí tlačítek Allow a Deny](/blog-images/helm-demo-app-sandbox-feature.png)

Pokud uživatel odmítne, `PermissionDeniedError` se propíše až zpátky a velký jazykový model ji uvidí ve výsledku nástroje. Může vysvětlit, proč oprávnění potřebuje, zkusit jiný postup nebo to vzdát.

## Inspirace

Tato architektura — tedy dát agentovi nástroj pro spouštění kódu namísto desítek samostatných nástrojů — byla inspirována [code mode](https://blog.cloudflare.com/code-mode-mcp/) od Cloudflare pro jejich MCP server, kde snížili spotřebu tokenů o 99,9 % tím, že více než 2 500 nástrojů pro jednotlivé API endpointy nahradili dvojicí `search` + `execute`. [Podobný nápad Rhyse Sullivana](https://x.com/RhysSullivan/status/2019819177473933404) mi tu myšlenku vyjasnil: kombinace spouštění kódu, objevitelnosti a granulárního modelu oprávnění znamená, že agent může dělat cokoli, ale nemůže se vymknout kontrole.

## Vyzkoušejte

```bash
npm install @bgub/helm
```

Zdrojový kód je na [GitHubu](https://github.com/bgub/helm). Ukázková aplikace je v `apps/demo`.