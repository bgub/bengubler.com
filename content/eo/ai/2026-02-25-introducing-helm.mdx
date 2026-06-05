---
title: "Prezentante helm"
description: "Tipizita TypeScript-kadro por AI-agentoj. Anstataŭigu dekojn da iloj per nur du — serĉado kaj plenumo — kaj izolu kodon generitan de LLM per fajnagordeblaj permesoj."
date: "2026-02-25"
tags: [ml/ai, open-source, frontend]
---

# Jen helm

helm estas tipita TypeScript-kadro por AI-agentoj. Anstataŭ alvoki la ŝelon kaj analizi tekstajn ĉenojn, agentoj vokas tipitajn funkciojn kun strukturitaj enigoj kaj eligoj:

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

Vi registras &quot;kapablojn&quot; — grupojn de rilataj operacioj — per builder-ŝablono. TypeScript deduktas la plenan tipon ĉe ĉiu paŝo. Ĉiu operacio havas permesan nivelon: `allow` (ruliĝas tuj), `ask` (paŭzas por aprobo), aŭ `deny` (ĵetas `PermissionDeniedError`). Permesoj determiniĝas laŭ precedenco: preciza kongruo → ĵokera kongruo → apriora valoro de la kapablo-aŭtoro → tutmonda apriora valoro.

helm inkluzivas enkonstruitajn kapablojn por ĉiutagaj agentaj taskoj: `fs`, `git`, `grep`, `edit`, `shell`, `http`. Vi povas difini proprajn kapablojn, kaj ili ricevas tipojn, serĉon kaj permesojn senpage.

## La demonstraĵo

Mi konstruis babilboton, en kiu la agento havas ĝuste du ilojn: `search` kaj `execute`.

`search` faras ŝlosilvortan serĉon tra ĉiuj registritaj helm-operacioj — la agento uzas ĝin por malkovri, kio disponeblas, kaj lerni la funkciosignaturojn:

```ts
agent.search("file read");
// → [{ qualifiedName: "fs.read",
//      description: "Read a file and return its content as a string",
//      signature: "(path: string) => Promise<{ content: string }>", ... }]
```

`execute` akceptas arbitran JavaScript-kodon kaj plenumas ĝin per la API de la helm-agento. La LLM verkas kodon jene:

```js
const { staged, unstaged, branch } = await agent.git.status();
return { branch, staged: staged.length, unstaged: unstaged.length };
```

Du iloj en la kunteksto, sendepende de kiom da kapabloj estas registritaj. La agento laŭbezone malkovras, kion ĝi bezonas, kaj skribas kodon por utiligi tion.

![La demo-aplikaĵo de helm listiganta dosierojn en la nuna dosierujo](/blog-images/helm-demo-app-list-files.png)

### Izolado de nefidinda kodo

La ilo `execute` rulas kian ajn JavaScript-kodon la LLM verkas. Por fari tion sekura, la demonstraĵo izolas ĝin per [SES (Secure ECMAScript)](https://github.com/endojs/endo/tree/master/packages/ses) en ida procezo.

SES `lockdown()` frostigas ĉiujn internajn JavaScript-objektojn — `Object`, `Array`, `Promise`, `Function`, ĉion. La kodo ruliĝas ene de `Compartment`, izolita malloka amplekso kun aliro al ĝuste du aferoj: `agent`-prokurilo kaj imita `console`. `fetch`, `require`, `import`, `process`, `fs` — nenio el tio ekzistas en la compartment. La sola maniero fari ion interesan estas per la `agent`-prokurilo.

La `agent` ene de la sablokesto ne estas la vera helm-agento — ĝi estas rikura `Proxy`, kiu interkaptas alirojn al atributoj kaj funkciajn alvokojn. Kiam la kodo vokas `agent.git.status()`, la prokurilo sendas IPC-mesaĝon al la gepatra procezo. La gepatra procezo vokas la realan metodon ĉe la vera helm-agento, faras la plenan kontrolon de permesoj, kaj resendas la rezulton. Se la operacio estas agordita al `"ask"`, la gepatra procezo paŭzas por atendi aprobon de la uzanto antaŭ ol respondi. Se ĝi estas `"deny"`, la eraro propagas reen per IPC.

La sablokesta kodo tute ne scias, ke io el tio okazas. Ĝi nur vidas, ke ĝia `await` liveras valoron. La sola maniero interagi kun la ekstera mondo estas per la operacioj de helm regataj de permesoj.

### La permesa interfaco

La babila interfaco havas flankpanelon, kiu listigas ĉiun registritan kapablon kaj operacion, ĉiun kun baskulo allow/ask/deny. Ŝanĝi permeson efikas ekde la sekva mesaĝo.

![La panelo de iloj kun po-operaciaj permesregiloj](/blog-images/helm-demo-app.png)

Kiam la LLM atingas operacion agorditan al `"ask"`, la servilo sendas aprobpeto­n al la klienta interfaco per flua transsendo. La ilvoko montras enlinian strion kun butonoj Allow kaj Deny. La servilo atendas ĉe `Promise<boolean>` ĝis la uzanto alklakas unu el ili.

![Ilvoko de execute atendanta aprobon de la uzanto kun butonoj Allow kaj Deny](/blog-images/helm-demo-app-sandbox-feature.png)

Se la uzanto rifuzas, `PermissionDeniedError` propagas ĝis la LLM, kaj ĝi vidas ĝin en la ilrezulto. Ĝi povas klarigi kial ĝi bezonas la permeson, provi alian aliron, aŭ rezigni.

## Inspiro

Ĉi tiu arkitekturo — doni al la agento ilon por plenumi kodon anstataŭ dekojn da apartaj iloj — estis inspirita de la [code mode](https://blog.cloudflare.com/code-mode-mcp/) de Cloudflare por ilia MCP-servilo, kie ili reduktis la uzon de tokenoj je 99,9 % anstataŭigante pli ol 2 500 API-finpunktojn per `search` + `execute`. [Simila ideo de Rhys Sullivan](https://x.com/RhysSullivan/status/2019819177473933404) kristaligis la ideon por mi: la kombino de plenumado de kodo, malkovreblo kaj detala permesomodelo signifas, ke la agento povas fari ĉion, sed ne povas elreliĝi.

## Provu

```bash
npm install @bgub/helm
```

La fontkodo troviĝas ĉe [GitHub](https://github.com/bgub/helm). La demo-aplikaĵo estas en `apps/demo`.