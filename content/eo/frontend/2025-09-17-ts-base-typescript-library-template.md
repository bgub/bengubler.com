---
title: "Prezentante ts-base: moderna TypeScript-biblioteka ŝablono"
description: "Konstruu per tsdown, Vitest, release-please kaj Biome."
date: "2025-09-17T12:30:00-06:00"
tags: [frontend, open-source]
---

Antaŭ ok jaroj, mi publikigis mian unuan malfermkodan TypeScript-bibliotekon — [Squirrelly](https://github.com/squirrellyjs/squirrelly) — kiu konsistis el du dosieroj, `package.json` kaj `index.js`. Antaŭ kvin jaroj, mi publikigis [Eta](https://github.com/bgub/eta) kun multe pli da funkcioj, inkluzive de testado, linting, bundligo kaj CI/CD.

Mi pensis, ke tio estas sufiĉe solida evoluiga aranĝo, sed tempoj ŝanĝiĝas, kaj la JavaScript-ekosistemo moviĝas rapide. Aperis novaj iloj, plej bonaj praktikoj evoluis, kaj la komplekseco de ĝuste publikigi npm-pakaĵon iel fariĝis samtempe *kaj* pli facila *kaj* pli superforta.

Sufiĉas rigardi la evoluon de la kampo &quot;exports&quot; en `package.json`, se vi volas kapdoloron. Aŭ provi eltrovi la ĝustan kombinon de TypeScript-agordoj, bundliloj kaj CI-laborfluoj por publikigi bibliotekon, kiu glate funkcias en Node, Deno, Bun kaj retumiloj. Estas surprize malfacile fari tion ĝuste.

Tial mi kreis [**ts-base**](https://github.com/bgub/ts-base) — modernan TypeScript-bibliotekan komencan ŝablonon, kiu prizorgas tiun tutan kompleksecon por vi. Ĝi baziĝas sur klaraj elektoj, estas provita en praktiko, kaj estas desegnita por funkcii tuj kun ĉiu grava JavaScript-rulmedio.

## Kio estas ts-base?

ts-base estas ŝablono por TypeScript-biblioteko, kiu utiligas modernajn ilojn kaj aŭtomatigitajn laborfluojn. Anstataŭ komenci de nulo aŭ kopii malmodernan ŝablonkodon, vi ricevas kompletan evolumedion, kiu inkluzivas linting-on, testadon, konstruadon, eldonadon kaj publikigon — ĉio jam antaŭagordita kaj preta por uzo.

La ŝablono baziĝas sur tri kernaj principoj:

* **Multi-runtime unue**: Funkcias glate en Node, Deno, Bun kaj retumiloj
* **Aŭtomatigo anstataŭ agordo**: Minimuma agordo, maksimuma aŭtomatigo
* **Modernaj iloj**: Nur ESM, la plej nova TypeScript kaj zorge elektitaj dependecoj

## Arkitekturo por pluraj rulmedioj

La kerno de ts-base estas ĝia rulmedio-sendependa dezajno. Anstataŭ provi igi unu dosieron funkcii ĉie (kaj fronti kongruecajn problemojn), la ŝablono uzas klaran disigon:

```typescript
// src/internal.ts - Kerna logiko, neniuj rulmedio-specifaj API-oj
export function add(a: number, b: number): number {
  return a + b;
}

export function greet(name: string, options = {}): string {
  const base = `Hello, ${name}`;
  return options.shout ? `${base.toUpperCase()}!` : `${base}.`;
}
```

```typescript
// src/index.ts - adaptilo por Node/Bun
export { add, greet } from "./internal";
import { randomBytes } from "node:crypto";

export function getSecureRandomId(): string {
  const timePart = Date.now().toString(36);
  const bytes = randomBytes(12).toString("base64url");
  return `${timePart}-${bytes}`;
}
```

```typescript
// src/browser.ts - Retumila adaptilo
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

Tio donas al vi purajn importojn por ĉiu rulmedio:

```typescript
// Node/Bun
import { add, getSecureRandomId } from "@your-package/ts-base";

// Retumilo (per kompililo)
import { add, getSecureRandomId } from "@your-package/ts-base/browser";

// Deno (rektaj TypeScript importoj)
import {
  add,
  greet,
} from "https://jsr.io/@bgub/ts-base/<version>/src/index.ts";
```

La konstrusistemo uzas [tsdown](https://tsdown.dev/) por krei du optimumigitajn pakaĵojn: unu por Node-medioj kaj apartan minigitan pakaĵon por retumiloj, ambaŭ kun sourcemapoj.

## Sperto por programistoj

ts-base kunigas viajn ilojn ĉirkaŭ kelkaj bonegaj elektoj:

**Biome** anstataŭigas kaj ESLint kaj Prettier per unu sola, rapida ilo. Ne plu estas konfiguraciaj konfliktoj aŭ nekongruaj kromaĵoj — nur konsekvenca formatado kaj lintado, kiuj funkcias tuj sen plia agordo.

**Vitest** provizas fulmrapidan testadon kun enkonstruita raportado pri kovrado kaj agordeblaj sojloj. Testoj ruliĝas paralele, denaske subtenas TypeScript, kaj inkluzivas utilajn funkciojn kiel mokadon kaj momentfotojn.

**Size Limit** aŭtomate kontrolas la grandecon de via pakaĵo. Ĝi ruliĝas en CI kaj komentas en pull requestoj kiam viaj ŝanĝoj pliigus la grandecon de la pakaĵo, helpante vin kapti ŝveliĝon antaŭ ol ĝi estos publikigita.

La TypeScript-konfiguracio estas optimumigita por modernaj pakigiloj, kun agordoj kiel `moduleResolution: "bundler"` kaj `allowImportingTsExtensions: true`, kiuj bonege funkcias kun iloj kiel Vite, Rollup kaj esbuild.

## Aŭtomatigita CI/CD-dukto

Unu el la plej grandaj fortoj de ts-base estas ĝia kompleta CI/CD-agordo. Ĉiu aspekto de kodkvalito kaj publikigado estas aŭtomatigita:

**Kvalitkontroloj**: Ĉiu pull request ekigas linting, tipokontrolon, testadon kaj raportadon pri testokovro. La CI alŝutas la kovroraporton al Codecov kaj komentas ĉe PR-oj per raportoj pri efiko al grandeco.

![Ekrankopio de CI/CD-rulado](/blog-images/ci-run-screenshot.png)

**Eldonadministrado**: Anstataŭ komplikaj semantic-release-agordoj, ts-base uzas Release Please de Google. Kiam komitoj estas enmetitaj en main, Release Please aŭtomate malfermas „Release PR“, kiu ĝisdatigas versinombrojn, generas ŝanĝregistrojn kaj kreas eldonetikedojn.

**Aŭtomatigita publikigado**: Kiam vi kunfandas la Release PR, GitHub Actions aŭtomate konstruas kaj publikigas vian pakon al npm kaj JSR, kun plena OIDC-proveno kaj sekureca atestado.

**Konvenciaj komitoj**: PR-titoloj estas aŭtomate kontrolataj per linting, por ke ili sekvu la conventional commit-formaton kaj tiel certigu konsekvencan generadon de ŝanĝregistroj.

## Kial ĉi tiu aliro funkcias pli bone

Plej multaj TypeScript-bibliotekaj ŝablonoj, kiujn mi vidis, estas aŭ tro minimumismaj (kaj lasas vin mem eltrovi CI-on, publikigadon kaj subtenon por pluraj rulmedioj) aŭ tro komplikaj, kun dekoj da dependecoj. Mi vidis ŝablonojn kun pakaĵoj kiel `@commitlint/cli`, `@commitlint/config-conventional`, `@semantic-release/changelog`, `@semantic-release/git`, `@semantic-release/github`, `@semantic-release/npm`, kaj aliaj, nur por CI-publikigado!

ts-base elektas alian vojon, kun entute nur 8 evoluigaj dependecoj. Elektante Release Please anstataŭ semantic-release, Biome anstataŭ ESLint+Prettier, kaj Vitest anstataŭ Jest, vi ricevas pli simplan dependeckarbon, kiun estas pli facile prizorgi kaj kiu malpli verŝajne paneos.

Tiu aŭtomatiga filozofio signifas malpli da agordado kaj malpli da lokoj, kie io povas misfunkcii. Release Please prizorgas version-altigon, generado de ŝanĝoregistro kaj kreadon de eldono per unu sola ilo. La laborfluoj de GitHub Actions prizorgas ĉion alian.

## La Magio de Release Please

![Ekrankopio de Release Please PR](/blog-images/release-please-pr.png)

Release Please meritas apartan atenton, ĉar ĝi ŝanĝas la manieron, kiel vi pensas pri eldonoj. Anstataŭ permane altigi versiojn aŭ agordi kompleksajn `semantic-release`-duktojn, Release Please funkcias jene:

1. Vi kunfandas komitojn en `main` uzante mesaĝojn laŭ la Conventional Commits-konvencio
2. Release Please aŭtomate malfermas/ĝisdatigas „Release PR“ kun versialtigoj kaj eroj en la ŝanĝoregistro
3. Kiam vi pretas eldoni, simple kunfandu la „Release PR“
4. GitHub Actions aŭtomate publikigas al npm kaj JSR

La sistemo subtenas ankaŭ antaŭeldonojn. Se vi eldonas alfa- aŭ beta-version, ĝi aŭtomate publikiĝas sub la etikedo „next“ en npm. Vi povas anstataŭigi la versialtigojn per `Release-As: 2.0.0` en komitmesaĝoj, kaj vi povas prizorgi plurajn eldonbranĉojn (kiel `2.x` kaj `3.x`), kiuj ĉiu ricevas sian propran „Release PR“.

## Komencado

Agordi ts-base estas simpla:

1. **Kloni kaj adapti**: Klonu la deponejon, forigu la dosierujon `.git`, kaj ĝisdatigu `package.json`, `jsr.json` kaj `.release-please-manifest.json` per la detaloj de via pakaĵo.

2. **Rezervi vian pakaĵon**: Agordu la version al `0.0.0` en ĉiuj agordaj dosieroj, poste rulu `npm publish` loke por rezervi la nomon de via pakaĵo ĉe npm.

3. **Agordi publikigadon**: En npm, agordu vian pakaĵon tiel, ke ĝi postulu 2FA nur por rajtigo (ne por publikigado), poste aldonu vian GitHub-laborfluon kiel fidindan publikiganton. En JSR, kreu vian pakaĵon kaj aldonu la deponejon kiel fidindan fonton.

![Ekrankopio de la agordoj por publikigado en npm](/blog-images/npm-trusted-publisher.png)

4. **Agordi GitHub**: Puŝu al GitHub, aldonu `CODECOV_TOKEN` kiel sekreton de la deponejo, kaj agordu regulojn pri protektado de branĉoj.

5. **Komenci disvolvadon**: Aldonu vian kodon al `src/`, verku testojn, kaj puŝu komitojn. Release Please prizorgos la reston.

Mi rekomendas agordi GitHub tiel, ke ĝi permesu nur squash-kunfandojn, kaj uzi &quot;pull request title and commit details&quot; kiel la defaŭltan komitmesaĝon. Tio tenas vian komithistorion pura kaj certigas konformecon al conventional commit.

## Bonaj Praktikoj kaj Konsiloj

**Deponejaj agordoj**: Ŝaltu branĉan protekton por `main` kun devigaj statokontroloj. Malŝaltu kunfandajn komitojn por konservi linian historion.

**Enirpunktoj**: Uzu la ĉefan eksporton (`@your-package`) por Node/Bun, la retumilan eksporton (`@your-package/browser`) por pakigita retumila kodo, kaj rektajn TypeScript-importojn por Deno.

**Personigo**: Se vi ne bezonas apartajn Node-/retumilajn versiojn, forigu la neuzatan agordon. La ŝablono estas intence facile reduktebla laŭ viaj specifaj bezonoj.

**Testa strategio**: La ŝablono inkluzivas ekzemplojn pri testado de komuna kaj platformspecifa kodo, inkluzive de simulado de retumilaj API-oj en la testa medio de Node.

## Konklude

Publikigi TypeScript-bibliotekon ne devus postuli doktoriĝon pri agordado de ilaro. ts-base donas al vi modernan, bone pripensitan bazon, kiu pritraktas la kompleksecon, por ke vi povu koncentriĝi pri kreado de bonega programaro.

La ŝablono enkorpigas ok jarojn da spertoj akiritaj dum prizorgado de malfermkodaj projektoj. Ĉu vi pretas provi ĝin? Rigardu la [deponejon de ts-base](https://github.com/bgub/ts-base) ĉe GitHub kaj komencu krei vian sekvan bibliotekon.