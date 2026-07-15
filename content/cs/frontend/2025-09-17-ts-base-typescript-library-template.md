---
title: "Představuji ts-base: moderní šablonu knihovny pro TypeScript"
description: "Sestavujte s tsdown, Vitest, release-please a Biome."
date: "2025-09-17T12:30:00-06:00"
tags: [frontend, open-source]
---

Před osmi lety jsem vydal svou první open-source knihovnu pro TypeScript — [Squirrelly](https://github.com/squirrellyjs/squirrelly) — která obsahovala dva soubory, `package.json` a `index.js`. Před pěti lety jsem vydal [Eta](https://github.com/bgub/eta) s mnoha dalšími funkcemi včetně testování, lintingu, bundlování a CI/CD.

Myslel jsem si, že je to docela solidní vývojové prostředí, ale časy se mění a ekosystém JavaScriptu se vyvíjí rychle. Objevily se nové nástroje, osvědčené postupy se posunuly a správně publikovat npm balíček je dnes nějak zároveň jednodušší *a* zahlcující.

Stačí se podívat na vývoj pole „exports“ v `package.json`, pokud si chcete přivodit bolest hlavy. Nebo zkuste najít správnou kombinaci konfigurací TypeScriptu, bundlerů a CI workflow, abyste publikovali knihovnu, která bez problémů funguje v Node, Deno, Bun i prohlížečích. Překvapivě je těžké to nastavit správně.

Proto jsem vytvořil [**ts-base**](https://github.com/bgub/ts-base) — moderní startovací šablonu knihovny pro TypeScript, která za vás řeší všechnu tuhle složitost. Je postavená na jasně daných volbách, prověřená praxí a navržená tak, aby fungovala hned po vybalení v každém hlavním JavaScript runtime.

## Co je ts-base?

ts-base je šablona knihovny pro TypeScript, která využívá moderní nástroje a automatizované workflow. Místo toho, abyste začínali od nuly nebo kopírovali zastaralý boilerplate, získáte kompletní vývojové prostředí, které zahrnuje lintování, testování, sestavování, vydávání verzí i publikování — vše je předem nakonfigurované a připravené k použití.

Šablona stojí na třech hlavních principech:

* **Více runtime prostředí na prvním místě**: Funguje bez problémů v Node, Deno, Bun i v prohlížečích
* **Automatizace místo konfigurace**: Minimum nastavování, maximum automatizace
* **Moderní nástroje**: Pouze ESM, nejnovější TypeScript a pečlivě vybrané závislosti

## Architektura pro více runtime prostředí

Základem ts-base je návrh nezávislý na runtime prostředí. Místo snahy vytvořit jeden soubor, který bude fungovat všude (a řešit problémy s kompatibilitou), šablona používá čisté oddělení:

```typescript
// src/internal.ts - Základní logika, žádná API specifická pro runtime
export function add(a: number, b: number): number {
  return a + b;
}

export function greet(name: string, options = {}): string {
  const base = `Hello, ${name}`;
  return options.shout ? `${base.toUpperCase()}!` : `${base}.`;
}
```

```typescript
// src/index.ts - adaptér pro Node/Bun
export { add, greet } from "./internal";
import { randomBytes } from "node:crypto";

export function getSecureRandomId(): string {
  const timePart = Date.now().toString(36);
  const bytes = randomBytes(12).toString("base64url");
  return `${timePart}-${bytes}`;
}
```

```typescript
// src/browser.ts - Adaptér pro prohlížeč
export { add, greet } from "./internal";

export function getSecureRandomId(): string {
  const timePart = Date.now().toString(36);
  const array = new Uint8Array(12);
  crypto.getRandomValues(array);
  const rand = btoa(String.fromCharCode(...array))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
  return `${timePart}-${rand}`;
}
```

Díky tomu budete mít čisté importy v každém runtime:

```typescript
// Node/Bun
import { add, getSecureRandomId } from "@your-package/ts-base";

// Prohlížeč (přes bundler)
import { add, getSecureRandomId } from "@your-package/ts-base/browser";

// Deno (přímé importy TypeScriptu)
import {
  add,
  greet,
} from "https://jsr.io/@bgub/ts-base/<version>/src/index.ts";
```

Build systém používá [tsdown](https://tsdown.dev/) k vytvoření dvou optimalizovaných bundlů: jednoho pro prostředí Node a druhého, samostatného minifikovaného bundlu pro prohlížeče, oba se sourcemapami.

## Vývojářský komfort

ts-base sjednocuje vaše nástroje kolem několika skvělých voleb:

**Biome** nahrazuje ESLint i Prettier jediným rychlým nástrojem. Už žádné konflikty v konfiguraci ani nekompatibility pluginů — jen konzistentní formátování a linting, které fungují hned po spuštění.

**Vitest** nabízí bleskově rychlé testování s vestavěným reportováním pokrytí a nastavitelnými prahovými hodnotami. Testy běží paralelně, nativně podporují TypeScript a zahrnují užitečné funkce jako mockování a snapshoty.

**Size Limit** automaticky sleduje velikost vašeho bundlu. Běží v CI a přidává komentáře k pull requestům, když by vaše změny zvětšily bundle, takže pomáhá odhalit zbytečné bobtnání ještě před nasazením.

Konfigurace TypeScriptu je optimalizovaná pro moderní bundlery, se nastaveními jako `moduleResolution: "bundler"` a `allowImportingTsExtensions: true`, která skvěle fungují s nástroji jako Vite, Rollup a esbuild.

## Automatizovaná CI/CD pipeline

Jednou z největších předností ts-base je jeho kompletní CI/CD řešení. Každý aspekt kvality kódu i publikování je automatizovaný:

**Kontroly kvality**: Každý pull request spouští linting, kontrolu typů, testy a reportování pokrytí. CI nahrává data o pokrytí do Codecovu a přidává k PR komentáře s reporty o dopadu na velikost.

![Snímek obrazovky běhu CI/CD](/blog-images/ci-run-screenshot.png)

**Správa vydání**: Místo složitých konfigurací semantic-release používá ts-base nástroj Release Please od Googlu. Když se commity dostanou do větve main, Release Please automaticky otevře „Release PR“, který aktualizuje čísla verzí, generuje changelogy a vytváří release tagy.

**Automatizované publikování**: Když sloučíte Release PR, GitHub Actions automaticky sestaví a publikuje váš balíček do npm i JSR s plnou OIDC proveniencí a bezpečnostní atestací.

**Conventional Commits**: Názvy PR se automaticky kontrolují pomocí lintingu, aby odpovídaly formátu Conventional Commits a zajišťovaly konzistentní generování changelogů.

## Proč tento přístup funguje lépe

Většina šablon knihoven pro TypeScript, které jsem viděl, je buď příliš minimalistická (takže si musíte sami vyřešit CI, publikování a podporu více runtime prostředí), nebo zbytečně překombinovaná s desítkami závislostí. Viděl jsem šablony s balíčky jako `@commitlint/cli`, `@commitlint/config-conventional`, `@semantic-release/changelog`, `@semantic-release/git`, `@semantic-release/github`, `@semantic-release/npm` a dalšími jen kvůli publikování přes CI!

ts-base na to jde jinak a vystačí si celkem s pouhými 8 vývojovými závislostmi. Když místo semantic-release zvolíte Release Please, místo ESLint+Prettier Biome a místo Jestu Vitest, získáte jednodušší graf závislostí, který se snáz udržuje a u kterého je menší pravděpodobnost, že se rozbije.

Tato filozofie automatizace znamená méně konfigurace a méně míst, kde se může něco pokazit. Release Please v jednom nástroji řeší navyšování verzí, generování changelogu i vytváření releasů. Workflowy GitHub Actions se postarají o všechno ostatní.

## Kouzlo Release Please

![Snímek obrazovky Release PR v release-please](/blog-images/release-please-pr.png)

Release Please si zaslouží zvláštní pozornost, protože mění způsob, jak o vydávání přemýšlíte. Místo ručního navyšování verzí nebo nastavování složitých pipeline pro semantic-release funguje Release Please takto:

1. Sloučíte commity do `main` pomocí zpráv ve formátu conventional commit
2. Release Please automaticky otevře/aktualizuje „Release PR“ s navýšením verzí a položkami přehledu změn
3. Když jste připraveni vydat novou verzi, jednoduše sloučíte Release PR
4. GitHub Actions automaticky publikuje na npm a JSR

Systém podporuje i předběžná vydání. Pokud vydáte alfa nebo beta verzi, automaticky ji publikuje pod tagem „next“ na npm. Navýšení verze můžete přepsat pomocí `Release-As: 2.0.0` ve zprávách commitů a můžete také udržovat více release větví (například `2.x` a `3.x`), z nichž každá bude mít vlastní Release PR.

## Začínáme

Nastavení ts-base je jednoduché:

1. **Naklonujte a přizpůsobte**: Naklonujte repozitář, smažte složku `.git` a upravte `package.json`, `jsr.json` a `.release-please-manifest.json` podle údajů o svém balíčku.

2. **Zarezervujte si svůj balíček**: Ve všech konfiguračních souborech nastavte verzi na `0.0.0` a potom lokálně spusťte `npm publish`, abyste si na npm zarezervovali název balíčku.

3. **Nakonfigurujte publikování**: Na npm nastavte, aby váš balíček vyžadoval 2FA jen pro autorizaci (ne pro publikování), a potom přidejte svůj GitHub workflow jako důvěryhodného vydavatele. Na JSR vytvořte balíček a přidejte repozitář jako důvěryhodný zdroj.

![Snímek obrazovky nastavení publikování na npm](/blog-images/npm-trusted-publisher.png)

4. **Nastavte GitHub**: Nahrajte repozitář na GitHub, přidejte `CODECOV_TOKEN` jako secret repozitáře a nastavte pravidla ochrany větví.

5. **Začněte vyvíjet**: Přidejte svůj kód do `src/`, napište testy a odesílejte commity. O zbytek se postará Release Please.

Doporučuji na GitHubu povolit pouze squash merge a jako výchozí commit message používat „pull request title and commit details“. Díky tomu zůstane historie commitů přehledná a bude zajištěn soulad s conventional commits.

## Osvědčené postupy a tipy

**Nastavení repozitáře**: Na větvi `main` zapněte ochranu větve s povinnými kontrolami stavu. Zakažte merge commity, aby historie zůstala lineární.

**Vstupní body**: Pro Node/Bun používejte hlavní export (`@your-package`), pro bundlovaný kód do prohlížeče prohlížečový export (`@your-package/browser`) a pro Deno přímé importy TypeScriptu.

**Přizpůsobení**: Pokud nepotřebujete oddělené buildy pro Node a prohlížeč, odstraňte nepoužívanou konfiguraci. Šablona je navržená tak, aby se dala zúžit podle vašich konkrétních potřeb.

**Strategie testování**: Šablona obsahuje příklady testování sdíleného kódu i kódu specifického pro jednotlivé platformy, včetně mockování prohlížečových API v testovacím prostředí Node.

## Na závěr

Vydání knihovny pro TypeScript by nemělo vyžadovat doktorát z nastavování nástrojů. ts-base vám dává moderní, promyšlený základ, který se postará o všechnu složitost, abyste se mohli soustředit na tvorbu skvělého softwaru.

Tato šablona je výsledkem osmi let zkušeností získaných při údržbě open‑source projektů. Jste připraveni ji vyzkoušet? Podívejte se na [repozitář ts-base](https://github.com/bgub/ts-base) a pusťte se do tvorby své další knihovny.