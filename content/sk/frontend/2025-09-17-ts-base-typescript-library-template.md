---
title: "Predstavujeme ts-base: modernú šablónu TypeScript knižnice"
description: "Vytvárajte pomocou tsdown, Vitest, release-please a Biome."
date: "2025-09-17T12:30:00-06:00"
tags: [frontend, open-source]
---

Pred ôsmimi rokmi som vydal svoju prvú open-source TypeScript knižnicu — [Squirrelly](https://github.com/squirrellyjs/squirrelly) — ktorá obsahovala dva súbory: `package.json` a `index.js`. Pred piatimi rokmi som vydal [Eta](https://github.com/bgub/eta) s omnoho väčším množstvom funkcií vrátane testovania, lintingu, bundlovania a CI/CD.

Myslel som si, že je to celkom solídne vývojové nastavenie, ale časy sa menia a ekosystém JavaScriptu napreduje rýchlo. Objavili sa nové nástroje, osvedčené postupy sa vyvíjali a zložitosť správneho publikovania npm balíka sa akosi zároveň zjednodušila *aj* začala pôsobiť ešte zahlcujúcejšie.

Stačí sa pozrieť na vývoj poľa `exports` v `package.json`, ak chcete dostať migrénu. Alebo skúste prísť na správnu kombináciu konfigurácií TypeScriptu, bundlerov a CI workflow, aby ste publikovali knižnicu, ktorá funguje bez problémov v Node, Deno, Bun aj v prehliadačoch. Prekvapivo ľahko sa to spraví zle.

Preto som vytvoril [**ts-base**](https://github.com/bgub/ts-base) — modernú štartovaciu šablónu TypeScript knižnice, ktorá túto zložitosť rieši za vás. Má jasne definovaný prístup, je overená v praxi a navrhnutá tak, aby fungovala hneď po vybalení v každom hlavnom JavaScript behovom prostredí.

## Čo je ts-base?

ts-base je šablóna pre knižnicu v TypeScripte, ktorá stavia na moderných nástrojoch a automatizovaných workflowoch. Namiesto toho, aby ste začínali od nuly alebo kopírovali zastaraný boilerplate, získate kompletné vývojové prostredie, ktoré zahŕňa linting, testovanie, zostavenie, vydávanie verzií a publikovanie — všetko je vopred nakonfigurované a pripravené na použitie.

Šablóna je postavená na troch hlavných princípoch:

* **Viacero behových prostredí na prvom mieste**: Funguje bez problémov v Node, Deno, Bun aj v prehliadačoch
* **Automatizácia namiesto konfigurácie**: Minimum nastavovania, maximum automatizácie
* **Moderné nástroje**: Len ESM, najnovší TypeScript a starostlivo vybrané závislosti

## Architektúra pre viacero behových prostredí

Jadrom ts-base je jeho dizajn nezávislý od behového prostredia. Namiesto snahy vytvoriť jeden súbor, ktorý bude fungovať všade (a riešiť problémy s kompatibilitou), šablóna využíva jasné oddelenie:

```typescript
// src/internal.ts - Základná logika, žiadne API špecifické pre behové prostredie
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

Vďaka tomu máte čisté importy pre každé behové prostredie:

```typescript
// Node/Bun
import { add, getSecureRandomId } from "@your-package/ts-base";

// Browser (cez bundler)
import { add, getSecureRandomId } from "@your-package/ts-base/browser";

// Deno (priame importy TypeScript)
import {
  add,
  greet,
} from "https://jsr.io/@bgub/ts-base/<version>/src/index.ts";
```

Systém zostavenia používa [tsdown](https://tsdown.dev/) na vytvorenie dvoch optimalizovaných bundleov: jedného pre prostredia Node a druhého, samostatného minifikovaného bundleu pre prehliadače, pričom oba obsahujú sourcemapy.

## Vývojársky komfort

ts-base zjednocuje vaše nástroje okolo niekoľkých výborných riešení:

**Biome** nahrádza ESLint aj Prettier jedným rýchlym nástrojom. Už žiadne konflikty v konfigurácii ani nekompatibilita pluginov — iba konzistentné formátovanie a lintovanie, ktoré funguje bez ďalšieho nastavovania.

**Vitest** prináša bleskurýchle testovanie so vstavaným reportovaním pokrytia a prispôsobiteľnými prahmi. Testy bežia paralelne, natívne podporujú TypeScript a zahŕňajú užitočné funkcie, ako sú mocky a snapshoty.

**Size Limit** automaticky sleduje veľkosť vášho bundle. Beží v CI a pridáva komentáre do pull requestov, keď by vaše zmeny zväčšili bundle, takže zachytíte zbytočné nafukovanie ešte pred nasadením.

Konfigurácia TypeScriptu je optimalizovaná pre moderné bundlery pomocou nastavení ako `moduleResolution: "bundler"` a `allowImportingTsExtensions: true`, ktoré výborne fungujú s nástrojmi ako Vite, Rollup a esbuild.

## Automatizovaná CI/CD pipeline

Jednou z najväčších predností ts-base je jeho kompletné CI/CD nastavenie. Každý aspekt kvality kódu a publikovania je automatizovaný:

**Kontroly kvality**: Pri každom pull requeste sa spustí linting, kontrola typov, testovanie a reportovanie pokrytia. CI odosiela údaje o pokrytí do Codecovu a do PR pridáva komentáre s reportmi o vplyve na veľkosť.

![Snímka obrazovky z behu CI/CD](/blog-images/ci-run-screenshot.png)

**Správa vydaní**: Namiesto zložitých konfigurácií semantic-release používa ts-base nástroj Google Release Please. Keď sa commity dostanú do vetvy main, Release Please automaticky otvorí „Release PR“, ktorý aktualizuje čísla verzií, generuje changelogy a vytvára tagy vydaní.

**Automatizované publikovanie**: Keď zlúčite Release PR, GitHub Actions automaticky zostaví a publikuje váš balík na npm aj JSR s plnou OIDC provenienciou a bezpečnostnou atestáciou.

**Conventional Commits**: Názvy PR sa automaticky kontrolujú pomocou lintingu, aby zodpovedali formátu conventional commit, čo zabezpečuje konzistentné generovanie changelogov.

## Prečo tento prístup funguje lepšie

Väčšina šablón TypeScript knižníc, ktoré som videl, je buď príliš minimalistická (a necháva na vás, aby ste si poradili s CI, publikovaním a podporou viacerých behových prostredí), alebo zbytočne prekomplikovaná s desiatkami závislostí. Videl som šablóny s balíkmi ako `@commitlint/cli`, `@commitlint/config-conventional`, `@semantic-release/changelog`, `@semantic-release/git`, `@semantic-release/github`, `@semantic-release/npm` a ďalšími len kvôli publikovaniu cez CI!

ts-base volí iný prístup len s 8 vývojovými závislosťami. Ak si zvolíte Release Please namiesto semantic-release, Biome namiesto ESLint+Prettier a Vitest namiesto Jest, získate jednoduchší graf závislostí, ktorý sa ľahšie udržiava a je menej náchylný na problémy.

Filozofia automatizácie znamená menej konfigurácie a menej miest, kde sa veci môžu pokaziť. Release Please v jednom nástroji rieši zvyšovanie verzií, generovanie changelogu a vytváranie vydaní. O všetko ostatné sa postarajú workflow GitHub Actions.

## Kúzlo Release Please

![Snímka obrazovky Release PR nástroja release-please](/blog-images/release-please-pr.png)

Release Please si zaslúži osobitnú pozornosť, pretože mení spôsob, akým uvažujete o vydaniach. Namiesto manuálneho zvyšovania verzií alebo nastavovania zložitých pipeline pre semantic-release funguje Release Please takto:

1. Zlučujete commity do vetvy `main` pomocou správ vo formáte conventional commit
2. Release Please automaticky otvorí alebo aktualizuje „Release PR“ so zvýšením verzií a položkami changelogu
3. Keď ste pripravení vydať novú verziu, jednoducho zlučte Release PR
4. GitHub Actions automaticky publikuje na npm a JSR

Systém podporuje aj predbežné vydania. Ak vydáte alfa alebo beta verziu, automaticky ju publikuje pod tagom „next“ na npm. Zvýšenie verzie môžete prepísať pomocou `Release-As: 2.0.0` v správach commitov a môžete udržiavať viacero release vetiev (napríklad `2.x` a `3.x`), pričom každá z nich dostane vlastné Release PR.

## Začíname

Nastavenie ts-base je jednoduché:

1. **Naklonujte a prispôsobte**: Naklonujte repozitár, odstráňte priečinok `.git` a aktualizujte `package.json`, `jsr.json` a `.release-please-manifest.json` údajmi o svojom balíku.

2. **Zarezervujte si svoj balík**: Nastavte verziu na `0.0.0` vo všetkých konfiguračných súboroch a potom lokálne spustite `npm publish`, aby ste si na npm zarezervovali názov balíka.

3. **Nakonfigurujte publikovanie**: V npm nastavte, aby váš balík vyžadoval 2FA iba na autorizáciu (nie na publikovanie), a potom pridajte svoj GitHub workflow ako dôveryhodného vydavateľa. V JSR vytvorte svoj balík a pridajte repozitár ako dôveryhodný zdroj.

![Snímka obrazovky nastavení publikovania v npm](/blog-images/npm-trusted-publisher.png)

4. **Nastavte GitHub**: Pushnite na GitHub, pridajte `CODECOV_TOKEN` ako tajný kľúč repozitára a nakonfigurujte pravidlá ochrany vetiev.

5. **Začnite vyvíjať**: Pridajte svoj kód do `src/`, napíšte testy a pushnite commity. O zvyšok sa postará Release Please.

Odporúčam nakonfigurovať GitHub tak, aby povoľoval iba squash merge, a ako predvolenú správu commitu používať možnosť „názov pull requestu a podrobnosti commitu“. Vďaka tomu zostane história commitov čistá a zabezpečí sa súlad s conventional commit formátom.

## Osvedčené postupy a tipy

**Nastavenia repozitára**: Na vetve `main` povoľte ochranu vetvy s povinnými kontrolami stavu. Zakážte merge commity, aby história zostala lineárna.

**Vstupné body**: Pre Node/Bun používajte hlavný export (`@your-package`), pre bundle kód do prehliadača export pre prehliadač (`@your-package/browser`) a pre Deno priame importy TypeScriptu.

**Prispôsobenie**: Ak nepotrebujete samostatné buildy pre Node a prehliadač, odstráňte nepoužívanú konfiguráciu. Šablóna je navrhnutá tak, aby sa dala osekať podľa vašich konkrétnych potrieb.

**Stratégia testovania**: Šablóna obsahuje príklady testovania zdieľaného aj platformovo špecifického kódu vrátane mockovania API prehliadača v testovacom prostredí Node.

## Na záver

Publikovanie knižnice v TypeScripte by nemalo vyžadovať doktorát z konfigurácie nástrojov. ts-base vám poskytuje moderný, premyslený základ, ktorý túto zložitosť rieši za vás, takže sa môžete sústrediť na tvorbu skvelého softvéru.

Táto šablóna stelesňuje osem rokov skúseností získaných pri údržbe open-source projektov. Ste pripravení ju vyskúšať? Pozrite si [repozitár ts-base](https://github.com/bgub/ts-base) a pustite sa do tvorby svojej ďalšej knižnice.