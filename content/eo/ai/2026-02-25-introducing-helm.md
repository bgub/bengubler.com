---
title: "Prezentante helm"
description: "Tipigita TypeScript-kadro por AI-agentoj. Anstataŭigu dekojn da iloj per du — search kaj execute — kaj izolu kodon generitan de LLM per fajne agordeblaj permesoj."
date: "2026-02-25"
tags: [ml/ai, open-source, frontend]
---

# Jen helm

helm estas strikte tipigita TypeScript-kadro por AI-agentoj. Anstataŭ lanĉi ŝelkomandojn kaj analizi tekstajn ĉenojn, agentoj vokas strikte tipigitajn funkciojn kun strukturitaj enigaĵoj kaj eligaĵoj:

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

Vi registras &quot;kapablojn&quot; — grupojn de rilataj operacioj — per konstruila ŝablono. TypeScript deduktas la plenan tipon ĉe ĉiu paŝo. Ĉiu operacio havas permesnivelon: `allow` (ruliĝas tuj), `ask` (paŭzas por aprobo), aŭ `deny` (ĵetas `PermissionDeniedError`). Permesoj estas decidataj laŭ prioritato: preciza kongruo → ĵokero → apriora valoro de la kapabla aŭtoro → ĝenerala apriora valoro.

helm venas kun enkonstruitaj kapabloj por ĉiutagaj taskoj de agentoj: `fs`, `git`, `grep`, `edit`, `shell`, `http`. Vi povas difini proprajn kapablojn, kaj ili aŭtomate ricevas tipojn, search kaj permesojn.

## La demonstraĵo

Mi kreis babilroboton, en kiu la agento havas ĝuste du ilojn: `search` kaj `execute`.

`search` faras ŝlosilvortan serĉon tra ĉiuj registritaj helm-operacioj — la agento vokas ĝin por vidi, kio disponeblas, kaj lerni la funkciosignaturojn:

```ts
agent.search("file read");
// → [{ qualifiedName: "fs.read",
//      description: "Read a file and return its content as a string",
//      signature: "(path: string) => Promise<{ content: string }>", ... }]
```

`execute` prenas arbitran JavaScript-kodon kaj rulas ĝin per la API de la helm-agento. La LLM verkas kodon jene:

```js
const { staged, unstaged, branch } = await agent.git.status();
return { branch, staged: staged.length, unstaged: unstaged.length };
```

Du iloj en la kunteksto, sendepende de kiom da kapabloj estas registritaj. La agento laŭbezone eltrovos, kion ĝi bezonas, kaj skribas kodon por uzi tion.

![La demo-aplikaĵo helm listigas dosierojn en la nuna dosierujo](/blog-images/helm-demo-app-list-files.png)

### Izolado de nefidinda kodo

La ilo `execute` rulas kian ajn JavaScript-kodon la LLM skribas. Por sekurigi tion, la demonstraĵo izolas ĝin per [SES (Secure ECMAScript)](https://github.com/endojs/endo/tree/master/packages/ses) en ida procezo.

SES `lockdown()` frostigas ĉiun internan JavaScript-objekton — `Object`, `Array`, `Promise`, `Function`, ĉion. La kodo rulas ene de `Compartment`, izolita malloka amplekso kun aliro al ĝuste du aferoj: `agent`-prokurilo kaj anstataŭita `console`. `fetch`, `require`, `import`, `process`, `fs` — nenio el tio ekzistas en la compartimento. La sola maniero fari ion interesan estas per la `agent`-prokurilo.

La `agent` ene de la sablokesto ne estas la vera helm-agento — ĝi estas rekursia `Proxy`, kiu kaptas alirojn al ecoj kaj funkciajn vokojn. Kiam la kodo vokas `agent.git.status()`, la prokurilo sendas IPC-mesaĝon al la gepatra procezo. La gepatra procezo vokas la realan metodon ĉe la vera helm-agento, plenumas la tutan kontrolon de permesoj, kaj resendas la rezulton. Se la operacio estas agordita al `"ask"`, la gepatra procezo paŭzas por atendi aprobon de la uzanto antaŭ ol respondi. Se ĝi estas `"deny"`, la eraro revenas per IPC.

La izolita kodo tute ne scias, ke io el ĉi tio okazas. Ĝi simple vidas, ke ĝia `await` liveras valoron. La sola maniero interagi kun la ekstera mondo estas per la operacioj de helm, kiujn kontrolas permesoj.

### La Permesa Interfaco

La babila interfaco havas flankpanelon, kiu listigas ĉiun registritan kapablon kaj operacion, ĉiun kun ŝaltilo por allow/ask/deny. Ŝanĝo de permeso ekvalidas por la sekva mesaĝo.

![La ilpanelo kun po-operaciaj permesregiloj](/blog-images/helm-demo-app.png)

Kiam la LLM renkontas operacion agorditan al `"ask"`, la servilo fluas aproban peton al la frontendo. La ilvoko montras enlinian sciigon kun butonoj Allow kaj Deny. La servilo restas blokita ĉe `Promise<boolean>` ĝis la uzanto alklakas unu el ili.

![Voko de la ilo execute atendanta aprobon de la uzanto kun butonoj Allow kaj Deny](/blog-images/helm-demo-app-sandbox-feature.png)

Se la uzanto rifuzas, `PermissionDeniedError` propagas tute reen, kaj la LLM vidas ĝin en la ilrezulto. Ĝi povas klarigi kial ĝi bezonas la permeson, provi alian aliron, aŭ rezigni.

## Inspiro

Ĉi tiu arkitekturo — doni al la agento ilon por ruli kodon anstataŭ dekojn da apartaj iloj — estis inspirita de la [code mode](https://blog.cloudflare.com/code-mode-mcp/) de Cloudflare por ilia MCP-servilo, kie ili reduktis uzon de tokenoj je 99.9% per anstataŭigo de pli ol 2,500 API-finpuktaj iloj per `search` + `execute`. [Simila ideo de Rhys Sullivan](https://x.com/RhysSullivan/status/2019819177473933404) kristaligis la ideon por mi: la kombino de koda rulado, malkovreblo kaj fajngrajna permesmodelo signifas, ke la agento povas fari ĉion, sed ne povas tute devojiĝi.

## Provu

```bash
npm install @bgub/helm
```

La fontkodo troviĝas en [GitHub](https://github.com/bgub/helm). La demo-aplikaĵo troviĝas en `apps/demo`.