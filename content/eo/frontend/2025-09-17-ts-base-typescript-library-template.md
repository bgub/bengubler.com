---
title: "Prezentante ts-base: moderna ŝablono por TypeScript-biblioteko"
description: "Konstruu per tsdown, Vitest, release-please kaj Biome."
date: "2025-09-17T12:30:00-06:00"
tags: [frontend, open-source]
---

Antaŭ ok jaroj, mi publikigis mian unuan malfermkodan TypeScript-bibliotekon — [Squirrelly](https://github.com/squirrellyjs/squirrelly) — kiu enhavis du dosierojn, `package.json` kaj `index.js`. Antaŭ kvin jaroj, mi publikigis [Eta](https://github.com/bgub/eta) kun multe pli da funkcioj, inkluzive de testado, linting, bundligado kaj CI/CD.

Mi opiniis tion sufiĉe solida evoluiga aranĝo, sed tempoj ŝanĝiĝas kaj la JavaScript-ekosistemo moviĝas rapide. Aperis novaj iloj, plej bonaj praktikoj evoluis, kaj la komplekseco de ĝusta publikigo de npm-pakaĵo iel fariĝis samtempe pli facila *kaj* pli superforta.

Nur rigardu la evoluon de la kampo &quot;exports&quot; en `package.json`, se vi volas kapdoloron. Aŭ provu eltrovi la ĝustan kombinon de TypeScript-agordoj, bundligiloj kaj CI-laborfluoj por publikigi bibliotekon, kiu funkcias glate en Node, Deno, Bun kaj retumiloj. Estas surprize malfacile fari tion ĝuste.

Tial mi kreis [**ts-base**](https://github.com/bgub/ts-base) — modernan startŝablonon por TypeScript-biblioteko, kiu prizorgas tiun tutan kompleksecon por vi. Ĝi havas klarajn defaŭltajn elektojn, estas elprovita en praktiko, kaj estas desegnita por funkcii tuj sen plia agordo en ĉiu grava JavaScript-rultempa medio.

## Kio estas ts-base?

ts-base estas ŝablono por TypeScript-biblioteko, kiu utiligas modernajn ilojn kaj aŭtomatigitajn laborfluojn. Anstataŭ komenci de nulo aŭ kopii malmodernan bazŝablonon, vi ricevas kompletan evoluigan medion, kiu inkluzivas kontroladon de koda kvalito, testadon, konstruadon, eldonadon kaj publikigadon — ĉio jam agordita kaj preta por uzo.

La ŝablono baziĝas sur tri kernaj principoj:

* **Plurrultempe unue**: Funkcias glate en Node, Deno, Bun kaj retumiloj
* **Aŭtomatigo anstataŭ agordado**: Minimuma preparado, maksimuma aŭtomatigo
* **Modernaj iloj**: Nur ESM, la plej nova TypeScript kaj zorge elektitaj dependaĵoj

## Arkitekturo por pluraj rultempoj

La kerno de ts-base estas ĝia dezajno sendependa de la rultempo. Anstataŭ provi igi unu dosieron funkcii ĉie (kaj fronti kongruecajn kapdolorojn), la ŝablono uzas klaran disigon:

```typescript
// src/internal.ts - Kerna logiko, neniuj runtime-specifaj API-oj
export function add(a: number, b: number): number {
  return a + b;
}

export function greet(name: string, options = {}): string {
  const base = `Hello, ${name}`;
  return options.shout ? `${base.toUpperCase()}!` : `${base}.`;
}
```

```typescript
// src/index.ts - Node/Bun adaptilo
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

Ĉi tio donas al vi purajn importojn por ĉiu rulmedio:

```typescript
// Node/Bun
import { add, getSecureRandomId } from "@your-package/ts-base";

// Retumilo (per bundligilo)
import { add, getSecureRandomId } from "@your-package/ts-base/browser";

// Deno (rektaj TypeScript importoj)
import {
  add,
  greet,
} from "https://jsr.io/@bgub/ts-base/<version>/src/index.ts";
```

La konstrusistemo uzas [tsdown](https://tsdown.dev/) por krei du optimumigitajn pakaĵojn: unu por Node-medioj kaj apartan minimumigitan pakaĵon por retumiloj, ambaŭ kun sourcemapoj.

## Programista sperto

ts-base kunigas viajn ilojn ĉirkaŭ kelkaj bonegaj elektoj:

**Biome** anstataŭigas kaj ESLint kaj Prettier per unu sola, rapida ilo. Ne plu agordaj konfliktoj aŭ nekongruaj kromprogramoj — nur konsekvenca formatado kaj lintado, kiuj funkcias tuj sen plia agordado.

**Vitest** provizas fulmrapidan testadon kun enkonstruita raportado pri kovrado kaj agordeblaj sojloj. Testoj ruliĝas paralele, denaske subtenas TypeScript, kaj inkluzivas utilajn funkciojn kiel imitaĵojn kaj momentfotojn.

**Size Limit** aŭtomate kontrolas la grandecon de via bundlo. Ĝi ruliĝas en CI kaj komentas en kunfandpetoj kiam viaj ŝanĝoj pliigus la grandecon de la bundlo, helpante vin rimarki troan kreskon antaŭ ol ĝi estus publikigita.

La TypeScript-agordo estas optimumigita por modernaj bundligiloj, kun agordoj kiel `moduleResolution: "bundler"` kaj `allowImportingTsExtensions: true`, kiuj bonege funkcias kun iloj kiel Vite, Rollup kaj esbuild.

## Aŭtomatigita CI/CD-dukto

Unu el la plej grandaj fortoj de ts-base estas ĝia kompleta CI/CD-aranĝo. Ĉiu aspekto de koda kvalito kaj publikigo estas aŭtomatigita:

**Kvalitkontroloj**: Ĉiu kunfandpeto ekigas lintadon, tipokontrolon, testadon kaj raportadon pri testkovrado. La CI alŝutas la kovrajn datumojn al Codecov kaj komentas ĉe kunfandpetoj per raportoj pri grandeca efiko.

![Ekrankopio de CI/CD-rulado](/blog-images/ci-run-screenshot.png)

**Administrado de eldonoj**: Anstataŭ kompleksaj agordoj por semantic-release, ts-base uzas Release Please de Google. Kiam komitoj estas enmetitaj en `main`, Release Please aŭtomate malfermas &quot;Release PR&quot;, kiu ĝisdatigas versinombrojn, generas ŝanĝprotokolojn kaj kreas eldonajn etikedojn.

**Aŭtomatigita publikigo**: Kiam vi kunfandas la Release PR, GitHub Actions aŭtomate konstruas kaj publikigas vian pakaĵon ĉe npm kaj JSR kun plena OIDC-deveno kaj sekureca atestado.

**Konvenciaj komitoj**: La titoloj de kunfandpetoj estas aŭtomate kontrolataj por sekvi la formaton de konvencia komito, kio certigas konsekvencan generadon de ŝanĝprotokoloj.

## Kial Ĉi Tiu Aliro Funkcias Pli Bone

Plej multaj TypeScript-bibliotekaj ŝablonoj, kiujn mi vidis, estas aŭ tro minimumismaj (lasante al vi mem eltrovi CI, publikigon kaj plurrultempan subtenon) aŭ tro komplikaj, kun dekoj da dependecoj. Mi vidis ŝablonojn kun pakaĵoj kiel `@commitlint/cli`, `@commitlint/config-conventional`, `@semantic-release/changelog`, `@semantic-release/git`, `@semantic-release/github`, `@semantic-release/npm`, kaj eĉ pli, nur por CI-publikigo!

ts-base uzas alian aliron, kun nur 8 dependecoj por evoluigo entute. Elektante Release Please anstataŭ semantic-release, Biome anstataŭ ESLint+Prettier, kaj Vitest anstataŭ Jest, vi ricevas pli simplan dependecgrafon, kiu estas pli facile prizorgebla kaj malpli verŝajne paneos.

Tiu aŭtomatiga filozofio signifas malpli da agordado kaj malpli da lokoj, kie aferoj povas misi. Release Please prizorgas altigon de versio, generadon de ŝanĝprotokolo kaj kreadon de eldono per unu sola ilo. La GitHub Actions laborfluoj prizorgas ĉion alian.

## La magio de Release Please

![Ekrankopio de Release Please PR](/blog-images/release-please-pr.png)

Release Please meritas apartan atenton, ĉar ĝi ŝanĝas vian pensmanieron pri eldonoj. Anstataŭ mane altigi versiojn aŭ agordi kompleksajn semantic-release-duktojn, Release Please funkcias jene:

1. Vi kunfandas komitojn en `main` per konvenciaj komitmesaĝoj
2. Release Please aŭtomate malfermas/ĝisdatigas &quot;Release PR&quot; kun versialtigoj kaj eroj en la ŝanĝprotokolo
3. Kiam vi pretas eldoni, simple kunfandu la Release PR
4. GitHub Actions aŭtomate publikigas al npm kaj JSR

La sistemo subtenas ankaŭ antaŭeldonojn. Se vi eldonas alfa- aŭ beta-version, ĝi aŭtomate publikigas sub la etikedo &quot;next&quot; ĉe npm. Vi povas anstataŭigi la versialtigon per `Release-As: 2.0.0` en komitmesaĝoj, kaj vi povas prizorgi plurajn eldonbranĉojn (kiel `2.x` kaj `3.x`), kiuj ĉiu ricevas propran Release PR.

## Unuaj paŝoj

Agordi ts-base estas facila:

1. **Klonu kaj adaptu**: Klonu la deponejon, forigu la dosierujon `.git`, kaj ĝisdatigu `package.json`, `jsr.json` kaj `.release-please-manifest.json` per la detaloj de via pakaĵo.

2. **Rezervu vian pakaĵon**: Agordu la version al `0.0.0` en ĉiuj agordaj dosieroj, poste rulu `npm publish` loke por rezervi la nomon de via pakaĵo ĉe npm.

3. **Agordu publikigon**: En npm, agordu vian pakaĵon tiel, ke ĝi postulu 2FA nur por aŭtorizo (ne por publikigo), poste aldonu vian GitHub-laborfluon kiel fidindan eldonanton. En JSR, kreu vian pakaĵon kaj aldonu la deponejon kiel fidindan fonton.

![Ekrankopio de npm-agordoj por publikigo](/blog-images/npm-trusted-publisher.png)

4. **Agordu GitHub**: Puŝu al GitHub, aldonu `CODECOV_TOKEN` kiel deponejan sekreton, kaj agordu regulojn pri branĉprotekto.

5. **Komencu evoluigi**: Aldonu vian kodon al `src/`, verku testojn kaj puŝu komitojn. Release Please prizorgos la ceteron.

Mi rekomendas agordi GitHub tiel, ke ĝi permesu nur squash-kunfandadon, kaj uzi „pull request title and commit details“ kiel la defaŭltan komitmesaĝon. Tio tenas vian komithistorion neta kaj certigas kongruon kun konvencia komito.

## Plej bonaj praktikoj kaj konsiletoj

**Deponejaj agordoj**: Ebligu branĉprotekton en `main` kun devigaj statokontroloj. Malebligu kunfandajn komitojn por teni la historion lineara.

**Enirpunktoj**: Uzu la ĉefan eksporton (`@your-package`) por Node/Bun, la retumilan eksporton (`@your-package/browser`) por pakigita retumila kodo, kaj rektajn TypeScript-importojn por Deno.

**Personigo**: Se vi ne bezonas apartajn konstruaĵojn por Node kaj retumilo, forigu la neuzatan agordon. La ŝablono estas kreita por esti reduktita laŭ viaj specifaj bezonoj.

**Testa strategio**: La ŝablono inkluzivas ekzemplojn de testado de komuna kaj platformspecifa kodo, inkluzive de simulado de retumilaj API-oj en la Node-testa medio.

## Konklude

Publikigi TypeScript-bibliotekon ne devus postuli doktoriĝon pri agordado de ilaro. ts-base donas al vi modernan, klare konceptitan bazon, kiu prizorgas la komplikaĵojn, por ke vi povu koncentriĝi pri konstruado de bonega programaro.

La ŝablono enkorpigas ok jarojn da spertoj kaj lernitaĵoj el prizorgado de malfermfontaj projektoj. Ĉu vi pretas provi ĝin? Rigardu la [ts-base-deponejon](https://github.com/bgub/ts-base) kaj komencu konstrui vian sekvan bibliotekon.