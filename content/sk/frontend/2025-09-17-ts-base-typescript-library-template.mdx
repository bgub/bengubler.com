---
title: "Predstavujeme ts-base: modernú šablónu TypeScript knižnice"
description: "Tvorte s tsdown, Vitest, release-please a Biome."
date: "2025-09-17T12:30:00-06:00"
tags: [frontend, open-source]
---

Pred ôsmimi rokmi som vydal svoju prvú open-source TypeScript knižnicu — [Squirrelly](https://github.com/squirrellyjs/squirrelly) — ktorá obsahovala dva súbory, `package.json` a `index.js`. Pred piatimi rokmi som vydal [Eta](https://github.com/bgub/eta), ktorá už mala omnoho viac funkcií vrátane testovania, lintovania, bundlovania a CI/CD.

Myslel som si, že je to celkom solídne vývojové nastavenie, ale časy sa menia a ekosystém JavaScriptu sa vyvíja rýchlo. Objavili sa nové nástroje, osvedčené postupy sa posunuli a zložitosť správneho publikovania npm balíka sa akosi zároveň zjednodušila *aj* začala pôsobiť ešte zahlcujúcejšie.

Stačí sa pozrieť na vývoj poľa „exports“ v `package.json`, ak si chcete privodiť bolesť hlavy. Alebo skúste prísť na správnu kombináciu konfigurácií TypeScriptu, bundlerov a CI workflowov, aby ste publikovali knižnicu, ktorá funguje bez problémov v Node, Deno, Bun aj v prehliadačoch. Prekvapivo ľahko sa v tom dá spraviť chyba.

Preto som vytvoril [**ts-base**](https://github.com/bgub/ts-base) — modernú štartovaciu šablónu TypeScript knižnice, ktorá túto komplexnosť rieši za vás. Má jasný prístup, je overená v praxi a navrhnutá tak, aby fungovala hneď po rozbalení v každom hlavnom JavaScript behovom prostredí.

## Čo je ts-base?

ts-base je šablóna knižnice pre TypeScript, ktorá stavia na moderných nástrojoch a automatizovaných workflowoch. Namiesto toho, aby ste začínali od nuly alebo kopírovali zastaraný boilerplate, získate kompletné vývojové prostredie, ktoré zahŕňa lintovanie, testovanie, buildovanie, vydávanie verzií aj publikovanie — všetko je už nakonfigurované a pripravené na použitie.

Šablóna stojí na troch hlavných princípoch:

* **Multi-runtime na prvom mieste**: Bez problémov funguje v Node, Deno, Bun aj v prehliadačoch
* **Automatizácia namiesto konfigurácie**: Minimum nastavovania, maximum automatizácie
* **Moderné nástroje**: Iba ESM, najnovší TypeScript a starostlivo vybrané závislosti

## Architektúra pre viacero behových prostredí

Srdcom ts-base je jeho návrh nezávislý od behového prostredia. Namiesto snahy vytvoriť jeden súbor, ktorý bude fungovať všade (a pritom riešiť problémy s kompatibilitou), šablóna využíva jasné oddelenie:

```typescript
// src/internal.ts - Základná logika, žiadne API špecifické pre runtime
export function add(a: number, b: number): number {
  return a + b;
}

export function greet(name: string, options = {}): string {
  const base = `Hello, ${name}`;
  return options.shout ? `${base.toUpperCase()}!` : `${base}.`;
}
```

```typescript
// src/index.ts - adaptér pre Node/Bun
export { add, greet } from "./internal";
import { randomBytes } from "node:crypto";

export function getSecureRandomId(): string {
  const timePart = Date.now().toString(36);
  const bytes = randomBytes(12).toString("base64url");
  return `${timePart}-${bytes}`;
}
```

```typescript
// src/browser.ts - Adaptér pre prehliadač
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

Takto získate čisté importy pre každé behové prostredie:

```typescript
// Node/Bun
import { add, getSecureRandomId } from "@your-package/ts-base";

// Prehliadač (cez bundler)
import { add, getSecureRandomId } from "@your-package/ts-base/browser";

// Deno (priame importy TypeScript)
import {
  add,
  greet,
} from "https://jsr.io/@bgub/ts-base/<version>/src/index.ts";
```

Systém zostavovania používa [tsdown](https://tsdown.dev/) na vytvorenie dvoch optimalizovaných bundleov: jedného pre prostredia Node a samostatného minifikovaného bundleu pre prehliadače, pričom oba obsahujú sourcemapy.

## Vývojársky komfort

ts-base zjednodušuje váš toolchain tým, že stavia na niekoľkých skvelých voľbách:

**Biome** nahrádza ESLint aj Prettier jedným rýchlym nástrojom. Už žiadne konflikty v konfigurácii ani nekompatibilné pluginy — len konzistentné formátovanie a lintovanie, ktoré funguje bez ďalšieho nastavovania.

**Vitest** prináša bleskurýchle testovanie so vstavanými prehľadmi pokrytia a nastaviteľnými prahovými hodnotami. Testy bežia paralelne, natívne podporujú TypeScript a ponúkajú užitočné funkcie ako mockovanie a snapshoty.

**Size Limit** automaticky sleduje veľkosť vášho bundlu. Beží v CI a pridáva komentáre k pull requestom, keď by vaše zmeny zväčšili bundle, takže zachytíte zbytočné nabaľovanie ešte pred vydaním.

Konfigurácia TypeScriptu je optimalizovaná pre moderné bundlery s nastaveniami ako `moduleResolution: "bundler"` a `allowImportingTsExtensions: true`, ktoré výborne fungujú s nástrojmi ako Vite, Rollup a esbuild.

## Automatizovaný CI/CD proces

Jednou z najväčších predností ts-base je jeho kompletne nastavené CI/CD. Každý aspekt kvality kódu aj publikovania je automatizovaný:

**Kontroly kvality**: Pri každom pull requeste sa spustí linting, kontrola typov, testovanie a reportovanie pokrytia. CI nahráva údaje o pokrytí do Codecov a pridáva k PR komentáre so správami o vplyve na veľkosť.

![Snímka obrazovky behu CI/CD](/blog-images/ci-run-screenshot.png)

**Správa vydaní**: Namiesto zložitých konfigurácií semantic-release používa ts-base nástroj Release Please od Googlu. Keď sa commity dostanú do vetvy `main`, Release Please automaticky otvorí „Release PR“, ktorý aktualizuje čísla verzií, vygeneruje changelog a vytvorí tagy vydania.

**Automatizované publikovanie**: Keď zlúčite Release PR, GitHub Actions automaticky zostaví a publikuje váš balík do npm aj JSR s úplnou OIDC provenienciou a bezpečnostnou atestáciou.

**Conventional Commits**: Nadpisy PR sa automaticky kontrolujú lintingom, aby zodpovedali formátu Conventional Commits, čo zabezpečuje konzistentné generovanie changelogu.

## Prečo tento prístup funguje lepšie

Väčšina šablón knižníc pre TypeScript, ktoré som videl, je buď príliš minimalistická (a necháva vás, aby ste si CI, publikovanie a podporu viacerých behových prostredí vyriešili sami), alebo zbytočne prekombinovaná s desiatkami závislostí. Videl som šablóny s balíkmi ako `@commitlint/cli`, `@commitlint/config-conventional`, `@semantic-release/changelog`, `@semantic-release/git`, `@semantic-release/github`, `@semantic-release/npm` a ďalšími len kvôli publikovaniu cez CI!

ts-base volí iný prístup a vystačí si len s 8 vývojovými závislosťami. Keď si vyberiete Release Please namiesto semantic-release, Biome namiesto ESLint+Prettier a Vitest namiesto Jest, získate jednoduchší graf závislostí, ktorý sa ľahšie udržiava a je menej náchylný na problémy.

Táto filozofia automatizácie znamená menej konfigurácie a menej miest, kde sa môže niečo pokaziť. Release Please v jednom nástroji rieši zvyšovanie verzií, generovanie changelogu aj vytváranie vydaní. O všetko ostatné sa postarajú workflowy GitHub Actions.

## Kúzlo Release Please

![Snímka obrazovky PR release-please](/blog-images/release-please-pr.png)

Release Please si zaslúži osobitnú pozornosť, pretože mení spôsob, akým premýšľate o vydávaní nových verzií. Namiesto ručného zvyšovania verzií alebo nastavovania zložitých pipeline pre semantic-release funguje Release Please takto:

1. Zlučujete commity do `main` pomocou správ commitov podľa conventional commits
2. Release Please automaticky otvorí/aktualizuje „Release PR“ so zvýšením verzií a záznamami v changelogu
3. Keď ste pripravení vydať novú verziu, jednoducho zlučíte Release PR
4. GitHub Actions automaticky publikuje na npm a JSR

Systém podporuje aj predbežné vydania. Ak vydáte alpha alebo beta verziu, automaticky sa publikuje pod tagom „next“ na npm. Zvýšenie verzie môžete prepísať pomocou `Release-As: 2.0.0` v správach commitov a môžete tiež udržiavať viacero release vetiev (napríklad `2.x` a `3.x`), pričom každá bude mať vlastné Release PR.

## Ako začať

Nastaviť ts-base je jednoduché:

1. **Klonovanie a prispôsobenie**: Naklonujte repozitár, odstráňte priečinok `.git` a aktualizujte `package.json`, `jsr.json` a `.release-please-manifest.json` údajmi o svojom balíku.

2. **Zarezervujte si svoj balík**: Nastavte verziu na `0.0.0` vo všetkých konfiguračných súboroch a potom lokálne spustite `npm publish`, aby ste si na npm zarezervovali názov svojho balíka.

3. **Nastavte publikovanie**: V npm nastavte, aby váš balík vyžadoval 2FA iba na autorizáciu (nie na publikovanie), a potom pridajte svoj GitHub workflow ako dôveryhodného vydavateľa. V JSR vytvorte svoj balík a pridajte repozitár ako dôveryhodný zdroj.

![Snímka obrazovky nastavení publikovania v npm](/blog-images/npm-trusted-publisher.png)

4. **Nastavte GitHub**: Odošlite projekt na GitHub, pridajte `CODECOV_TOKEN` ako tajný kľúč repozitára a nastavte pravidlá ochrany vetiev.

5. **Začnite vyvíjať**: Pridajte svoj kód do `src/`, napíšte testy a odosielajte commity. O zvyšok sa postará Release Please.

Odporúčam nastaviť GitHub tak, aby povoľoval iba squash merge, a ako predvolenú správu commitu používať „názov pull requestu a podrobnosti commitu“. Vďaka tomu zostane história commitov prehľadná a zároveň sa zabezpečí súlad s conventional commits.

## Osvedčené postupy a tipy

**Nastavenia repozitára**: Na vetve `main` zapnite ochranu vetvy s povinnými kontrolami stavu. Zakážte merge commity, aby história zostala lineárna.

**Vstupné body**: Pre Node/Bun použite hlavný export (`@your-package`), pre browserový kód v bundli browserový export (`@your-package/browser`) a pre Deno priame importy TypeScriptu.

**Prispôsobenie**: Ak nepotrebujete samostatné buildy pre Node a browser, odstráňte nepoužívanú konfiguráciu. Šablóna je navrhnutá tak, aby sa dala orezať podľa vašich konkrétnych potrieb.

**Stratégia testovania**: Šablóna obsahuje príklady testovania zdieľaného aj platformovo špecifického kódu vrátane mockovania browser API v testovacom prostredí Node.

## Na záver

Publikovanie knižnice v TypeScripte by nemalo vyžadovať doktorát z konfigurácie nástrojov. ts-base vám poskytuje moderný, premyslene navrhnutý základ, ktorý rieši zložitosti za vás, aby ste sa mohli sústrediť na tvorbu skvelého softvéru.

Táto šablóna vychádza z ôsmich rokov skúseností získaných pri udržiavaní open-source projektov. Ste pripravení ju vyskúšať? Pozrite si [repozitár ts-base](https://github.com/bgub/ts-base) a pustite sa do tvorby svojej ďalšej knižnice.