---
title: Prezento de Eta v3
description: La sekva versio de Eta, enkorpigita JS-ŝablonmotoro, alportas plibonigojn al la API kaj al la dokumentado.
date: "2023-06-22"
tags: [malfermitkoda]
---

## Fono

Hodiaŭ Eta estas mia plej populara kaj plej vaste uzata malfermitkoda projekto. Sed kiam mi unue publikigis ĝin antaŭ 3 jaroj, ĝi ne estis inter miaj ĉefaj prioritatoj. Fakte, mi kreis Eta kiel simpligitan variaĵon de [Squirrelly](https://squirrelly.js.org), pli kompleksa ŝablonmotoro kun ebloj kiel helpiloj kaj filtriloj.

Kun la paso de la tempo, mi rimarkis, ke por plej multaj projektoj enkorpigita ŝablonmotoro efektive pli taŭgas ol io pli kompleksa. Projektoj, kiuj bezonis kompleksan aŭ klientflankan HTML-prilaboradon, kutime uzis kadron kiel React aŭ Vue. Dume, la rendimento de Eta kaj ĝia malgranda pakaĵgrandeco igis ĝin bonega elekto por projektoj, kiuj bezonis rapidan prilaboradon, malaltan memoruzon, aŭ la kapablon trakti ne-XML-lingvojn.

Samtempe, Eta fariĝis ĉiam pli populara danke al sia rapideco, subteno por Deno kaj sintaksaj avantaĝoj kompare kun EJS. Konsiderante tiujn faktorojn, mi decidis ĉefe koncentriĝi pri Eta. Mi pasigis tempon verkante lernilojn, riparante problemojn kaj polurante la dokumentadon.

Post pluraj jaroj kaj iom da tempo for de programado dum mia vivo kiel misiisto, mi fine denove havis tempon labori pri Eta. Mi decidis fari kelkajn grandajn ŝanĝojn al la projekto, inkluzive de la konstrusistemo, API kaj dokumentado.

## Ĝisdatigoj pri la konstrusistemo

Malgraŭ la avantaĝoj kaj funkcioj de Eta, ĝi havis kelkajn gravajn problemojn. Unu el ili estis la konstrusistemo. Ĝi estis kompleksa kaj peza, kaj tial malfacila por prizorgi kaj ĝisdatigi. Mi devis trakti kompleksajn agordajn dosierojn kaj la neceson transpili version aparte por Deno.

Ŝanĝoj en versio 3:

* Uzi [microbundle](https://github.com/developit/microbundle) por pakigi la bibliotekon helpis min eviti la bezonon de kompleksaj agordaj dosieroj.
* Uzi GitHub Actions por ruli testojn kaj kolekti kovrodatumojn permesis al mi centralizi la servojn, kiujn mi uzis.
* Per agordo de `allowImportingTsExtensions: true` en `tsconfig.json`, mi povis eviti uzi [Denoify](https://github.com/garronej/denoify) por aparta Deno-konstruaĵo.

## API-ŝanĝoj

Alia problemo estis la API. Simplaj metodoj kiel `eta.render()` havis multajn funkciajn troŝarĝojn, kio malfaciligis tipan inferencon kaj igis la uzon malintuicia. Eblis transdoni propran agordan objekton dum alvoko de al uzantoj disponeblaj funkcioj kiel `render`, `parse` kaj `compile`. Praktike tio signifis, ke la de la uzanto provizita agordaro devis esti kunfandita kun la defaŭlta agordaro ĉiufoje kiam unu el tiuj funkcioj estis vokata.

Ŝanĝoj en versio 3:

* Estas nur unu eksportaĵo: nomita klaso `Eta`. Tiu klaso havas nur unu konstruktilon, kiu prilaboras agordan objekton kaj generas ŝablonajn kaŝmemorojn dum instancigo.
* La funkcioj `render()` kaj `renderAsync()` nun havas nur unu funkcian signaturon.
  * En Eta v2, `render()` kaj `renderAsync()` povis esti uzataj por bildigi aŭ nomitajn ŝablonojn aŭ ŝablonajn ĉenojn. Eta v3 enkondukas du novajn funkciojn por bildigi ŝablonajn ĉenojn: `renderString()` kaj `renderStringAsync()`.
* La funkcioj `readFile()` kaj `resolvePath()`, kiujn Eta uzas interne, povas esti anstataŭataj de la uzanto kiel klasmetodoj.
* Internaj variabloj kaj metodoj en ĉiu kompilita ŝablono estas konservataj en la objekto `__eta`, anstataŭ esti disigitaj tra pluraj variabloj, inkluzive de `__res`.
* Anstataŭ permesi al uzantoj specifi unu dosierujon `root` kaj plurajn dosierujojn `views`, uzantoj nun povas specifi nur unu dosierujon `views`. Tiu dosierujo estas uzata kiel radika dosierujo por ĉia ŝablona vojsolvado. Ĉiuj ŝablonaj dosieroj devas esti ene de tiu dosierujo aŭ en ĝia subdosierujo, kio plibonigas ŝablonan sekurecon kaj malpliigas multekostajn dosier-serĉajn operaciojn.

## Ŝanĝoj en la programista sperto

Unu el la plej gravaj ŝanĝoj en Eta v3 estis la aldono de detalaj rultempaj eraroj (inspiritaj de EJS). Konsideru ekzemple la jenan ŝablonon, kiu kaŭzos eraron pro nedifinita variablo:

```eta
Template header
<%= undefinedVariable %>
Lorem Ipsum
```

Eta v2 ĵetis eraron kun sufiĉe ĝeneralaj informoj, sed tio ne estis tre helpa. Male, Eta v3 ĵetas detalan eraron kun la nomo de la ŝablono, la lininombro kaj la erarmesaĝo:

```text
EtaError [ReferenceError]: .../my-dir/templates/runtime-error.eta:2
    1| Template header
 >> 2| <%= undefinedVariable %>
    3| Lorem Ipsum

undefinedVariable is not defined
```

## Ŝanĝoj en la dokumentado

La dokumentado por Eta v2 estis ampleksa, sed tre malfacile traserĉebla. Informoj pri la projekto estis disigitaj tra pli ol 40 (!) paĝoj de la dokumentado, troveblaj en pluraj dosierujoj tra 3 malsamaj sekcioj de la retejo.

La dokumentado por Eta v3 konsistas el 9 paĝoj, ĉiuj troveblaj en la sama parto de la retejo ([eta.js.org](https://eta.js.org)). Temoj kiel ŝablona sintakso kaj API-superrigardo estas pritraktataj en unu sola paĝo, anstataŭ esti disigitaj tra pluraj paĝoj.

## La estonteco de Eta

Mi fieras pri la ŝanĝoj en Eta v3 kaj pri la projekto entute. Grandan dankon al ĉiuj, kiuj kontribuis al la projekto per PR-oj, raportoj pri problemoj kaj sugestoj. Kroman dankon ankaŭ al projektoj kiel [ejs](https://github.com/mde/ejs), el kiuj Eta daŭre ĉerpas inspiron.

Mi rigardas Etan kiel jam preskaŭ plene kompletan laŭ funkcioj, kvankam mi plu korektos cimojn kaj aldonos kelkajn malgrandajn funkciojn. Mi kuraĝigus nunajn uzantojn de la biblioteko ĝisdatigi al v3, kaj mi esperas, ke novaj uzantoj trovos, ke Eta bonege taŭgas por iliaj projektoj.

## Ligiloj

* [Eta ĉe GitHub](https://github.com/eta-dev/eta)
* [Eta ĉe npm](https://www.npmjs.com/package/eta)
* [Retejo kaj dokumentaro de Eta](https://eta.js.org)