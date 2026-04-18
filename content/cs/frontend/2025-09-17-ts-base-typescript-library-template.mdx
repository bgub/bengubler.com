---
title: "Představení ts-base: moderní šablona knihovny pro TypeScript"
description: "Sestavujte s tsdown, Vitest, release-please a Biome."
date: "2025-09-17T12:30:00-06:00"
tags: [frontend, open-source]
---

Před osmi lety jsem vydal svou první open-source knihovnu pro TypeScript — [Squirrelly](https://github.com/squirrellyjs/squirrelly) — která obsahovala dva soubory, `package.json` a `index.js`. Před pěti lety jsem vydal [Eta](https://github.com/bgub/eta), která už měla mnohem víc funkcí včetně testování, lintování, bundlování a CI/CD.

Myslel jsem si, že je to docela solidní vývojové nastavení, ale časy se mění a ekosystém JavaScriptu se vyvíjí rychle. Objevily se nové nástroje, osvědčené postupy se posunuly a složitost správného publikování npm balíčku se nějak zároveň zmenšila *a* začala působit ještě zahlcujícím dojmem.

Stačí se podívat na vývoj pole `exports` v `package.json`, pokud vás ještě nebolí hlava dost. Nebo zkuste přijít na správnou kombinaci konfigurací TypeScriptu, bundlerů a CI workflow, abyste publikovali knihovnu, která bude bez problémů fungovat v Node, Deno, Bunu i prohlížečích. Překvapivě těžko se to dělá správně.

Proto jsem vytvořil [**ts-base**](https://github.com/bgub/ts-base) — moderní startovací šablonu knihovny pro TypeScript, která tuhle všechnu složitost vyřeší za vás. Je postavená na jasně daných volbách, prověřená v praxi a navržená tak, aby fungovala hned po vybalení s každým hlavním JavaScript runtime.

## Co je ts-base?

ts-base je šablona knihovny pro TypeScript, která staví na moderních nástrojích a automatizovaných postupech. Místo toho, abyste začínali od nuly nebo kopírovali zastaralalý boilerplate, získáte kompletní vývojové prostředí, které zahrnuje linting, testování, build, release i publikování — vše je předem nakonfigurované a připravené k použití.

Šablona stojí na třech hlavních principech:

* **Více runtime prostředí na prvním místě**: Bez problémů funguje v Node, Deno, Bun i v prohlížečích
* **Automatizace místo konfigurace**: Minimum nastavování, maximum automatizace
* **Moderní tooling**: Pouze ESM, nejnovější TypeScript a pečlivě vybrané závislosti

## Architektura pro více runtime prostředí

Jádrem ts-base je návrh nezávislý na konkrétním runtime. Místo snahy vytvořit jeden soubor, který bude fungovat všude (a řešit problémy s kompatibilitou), šablona využívá čisté oddělení:

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

Díky tomu budete mít čisté importy pro každý runtime:

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

Systém buildu používá [tsdown](https://tsdown.dev/) k vytvoření dvou optimalizovaných balíčků: jednoho pro prostředí Node a druhého, minifikovaného, pro prohlížeče, oba se sourcemapami.

## Vývojářský komfort

ts-base sjednocuje vaši sadu nástrojů kolem několika skvělých voleb:

**Biome** nahrazuje ESLint i Prettier jediným rychlým nástrojem. Už žádné konflikty v konfiguraci ani nekompatibilní pluginy — jen konzistentní formátování a lintování, které funguje hned po instalaci.

**Vitest** nabízí bleskově rychlé testování s vestavěnými reporty pokrytí a nastavitelnými prahovými hodnotami. Testy běží paralelně, nativně podporují TypeScript a zahrnují užitečné funkce, jako jsou mocky a snapshoty.

**Size Limit** automaticky sleduje velikost vašeho bundlu. Spouští se v CI a přidává komentáře k pull requestům, pokud by vaše změny velikost bundlu zvýšily, takže můžete zachytit zbytečné bobtnání ještě před vydáním.

Konfigurace TypeScriptu je optimalizovaná pro moderní bundlery díky nastavením jako `moduleResolution: "bundler"` a `allowImportingTsExtensions: true`, která skvěle fungují s nástroji jako Vite, Rollup a esbuild.

## Automatizovaná CI/CD pipeline

Jednou z největších předností ts-base je jeho kompletní CI/CD setup. Každý aspekt kvality kódu i publikování je automatizovaný:

**Kontroly kvality**: Každý pull request spustí linting, kontrolu typů, testy a reportování pokrytí. CI nahrává údaje o pokrytí do Codecovu a přidává do PR komentáře s reporty o dopadu na velikost.

![Snímek obrazovky z běhu CI/CD](/blog-images/ci-run-screenshot.png)

**Správa vydání**: Místo složitých konfigurací semantic-release používá ts-base nástroj Release Please od Googlu. Jakmile se commity dostanou do větve main, Release Please automaticky otevře „Release PR“, který aktualizuje verze, generuje changelogy a vytváří tagy vydání.

**Automatizované publikování**: Když sloučíte Release PR, GitHub Actions automaticky sestaví a publikuje váš balíček na npm i do JSR, včetně plné OIDC provenience a bezpečnostní atestace.

**Conventional Commits**: Nadpisy PR se automaticky kontrolují, aby odpovídaly formátu Conventional Commits, což zajišťuje konzistentní generování changelogu.

## Proč tento přístup funguje lépe

Většina šablon pro knihovny v TypeScriptu, které jsem viděl, je buď příliš strohá (takže si CI, publikování a podporu více runtime prostředí musíte vyřešit sami), nebo zbytečně složitá a plná desítek závislostí. Viděl jsem šablony s balíčky jako `@commitlint/cli`, `@commitlint/config-conventional`, `@semantic-release/changelog`, `@semantic-release/git`, `@semantic-release/github`, `@semantic-release/npm` a dalšími — a to všechno jen kvůli publikování přes CI!

ts-base na to jde jinak a vystačí si jen s 8 vývojovými závislostmi. Když místo semantic-release zvolíte Release Please, místo ESLint+Prettier Biome a místo Jest Vitest, získáte jednodušší graf závislostí, který se snadněji udržuje a u kterého je menší pravděpodobnost, že se rozbije.

Tahle filozofie automatizace znamená méně konfigurace a méně míst, kde se může něco pokazit. Release Please v jednom nástroji řeší navyšování verzí, generování changelogu a vytváření releasů. O všechno ostatní se starají workflow v GitHub Actions.

## Kouzlo Release Please

![Snímek obrazovky PR z release-please](/blog-images/release-please-pr.png)

Release Please si zaslouží zvláštní pozornost, protože mění způsob, jak o vydávání verzí přemýšlíte. Místo ručního zvyšování verzí nebo nastavování složitých pipeline pro semantic-release funguje Release Please takto:

1. Sloučíte commity do `main` s použitím zpráv ve formátu conventional commits
2. Release Please automaticky otevře/aktualizuje „Release PR“ se zvýšením verzí a položkami changelogu
3. Když jste připraveni vydat novou verzi, jednoduše sloučíte Release PR
4. GitHub Actions ji automaticky publikuje na npm a JSR

Systém podporuje i předběžná vydání. Pokud vydáte alfa nebo beta verzi, automaticky se publikuje pod tagem „next“ na npm. Zvýšení verze můžete přepsat pomocí `Release-As: 2.0.0` ve zprávách commitů a můžete udržovat více release větví (například `2.x` a `3.x`), z nichž každá bude mít vlastní Release PR.

## Začínáme

Nastavení ts-base je jednoduché:

1. **Naklonujte a přizpůsobte**: Naklonujte repozitář, odstraňte složku `.git` a aktualizujte `package.json`, `jsr.json` a `.release-please-manifest.json` údaji o svém balíčku.

2. **Zarezervujte si svůj balíček**: Nastavte verzi na `0.0.0` ve všech konfiguračních souborech a pak lokálně spusťte `npm publish`, abyste si na npm zarezervovali název balíčku.

3. **Nakonfigurujte publikování**: V npm nastavte, aby váš balíček vyžadoval 2FA jen pro autorizaci (ne pro publikování), a potom přidejte svůj GitHub workflow jako důvěryhodného vydavatele. V JSR vytvořte svůj balíček a přidejte repozitář jako důvěryhodný zdroj.

![Snímek obrazovky nastavení publikování v npm](/blog-images/npm-trusted-publisher.png)

4. **Nastavte GitHub**: Nahrajte projekt na GitHub, přidejte `CODECOV_TOKEN` jako secret repozitáře a nastavte pravidla ochrany větví.

5. **Začněte vyvíjet**: Přidejte svůj kód do `src/`, napište testy a odesílejte commity. O zbytek se postará Release Please.

Doporučuji v GitHubu nastavit, aby bylo povolené jen squash merging, a jako výchozí zprávu commitu používat „pull request title and commit details“. Díky tomu zůstane historie commitů přehledná a zároveň bude zajištěný soulad s Conventional Commits.

## Osvědčené postupy a tipy

**Nastavení repozitáře**: Zapněte ochranu větve `main` s povinnými kontrolami stavu. Vypněte merge commity, aby historie zůstala lineární.

**Vstupní body**: Pro Node/Bun používejte hlavní export (`@your-package`), pro kód do prohlížeče v bundlu export pro prohlížeč (`@your-package/browser`) a pro Deno přímé importy TypeScriptu.

**Přizpůsobení**: Pokud nepotřebujete samostatné buildy pro Node a prohlížeč, odstraňte nepoužívanou konfiguraci. Šablona je navržená tak, aby se dala zúžit podle vašich konkrétních potřeb.

**Strategie testování**: Šablona obsahuje příklady testování sdíleného i platformně specifického kódu, včetně mockování browserových API v testovacím prostředí Node.

## Na závěr

Vydat knihovnu v TypeScriptu by nemělo vyžadovat doktorát z nastavování nástrojů. ts-base vám dává moderní základ s jasně daným přístupem, který složitost řeší za vás, takže se můžete soustředit na tvorbu skvělého softwaru.

Tato šablona je výsledkem osmi let zkušeností získaných při údržbě open‑source projektů. Jste připraveni ji vyzkoušet? Podívejte se na [repozitář ts-base](https://github.com/bgub/ts-base) a pusťte se do své další knihovny.