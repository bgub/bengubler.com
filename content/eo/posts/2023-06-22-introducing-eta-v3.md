---
title: Prezentante Eta v3
description: La sekva versio de Eta, enigita JS-ŝablonmotoro, alportas plibonigojn al la API kaj la dokumentado.
date: "2023-06-22"
tags: [open-source]
---

## Fono

Hodiaŭ Eta estas mia plej populara kaj plej vaste uzata malfermkoda projekto. Sed kiam mi unue publikigis ĝin antaŭ 3 jaroj, ĝi ne estis unu el miaj ĉefaj prioritatoj. Fakte, mi kreis Etan kiel simpligitan variaĵon de [Squirrelly](https://squirrelly.js.org), pli kompleksa ŝablonmotoro kun ebloj kiel helpiloj kaj filtriloj.

Kun la paso de la tempo, mi rimarkis, ke por la plej multaj projektoj enigita ŝablonmotoro efektive pli taŭgas ol io pli kompleksa. Projektoj, kiuj bezonis kompleksan aŭ klientflankan HTML-prilaboradon, kutime uzis kadron kiel React aŭ Vue. Dume, la rendimento de Eta kaj ĝia malgranda pakaĵgrandeco igis ĝin bonega elekto por projektoj, kiuj bezonis rapidan prilaboradon, malaltan memoruzadon aŭ subtenon por ne-XML-lingvoj.

Samtempe, Eta fariĝis ĉiam pli populara danke al sia rapideco, Deno-subteno kaj sintaksaj avantaĝoj kompare kun EJS. Pro tiuj faktoroj, mi decidis fari Etan mia ĉefa fokuso. Mi pasigis tempon verkante lernilojn, riparante problemojn kaj polurante la dokumentadon.

Post pluraj jaroj kaj iom da tempo for de programado kiel misiisto, mi fine denove havis tempon labori pri Eta. Mi decidis fari kelkajn grandajn ŝanĝojn al la projekto, inkluzive de la konstrusistemo, API kaj dokumentado.

## Ĝisdatigoj de la konstrusistemo

Malgraŭ la avantaĝoj kaj trajtoj de Eta, ĝi havis kelkajn gravajn problemojn. Unu tia problemo estis la konstrusistemo. Ĝi estis komplika kaj peza, do malfacile prizorgebla kaj ĝisdatigebla. Mi devis trakti komplikajn agordajn dosierojn kaj la neceson transpili version specife por Deno.

Ŝanĝoj en versio 3:

* Uzi [microbundle](https://github.com/developit/microbundle) por paki la bibliotekon helpis min eviti la bezonon de komplikaj agordaj dosieroj.
* Uzi GitHub Actions por ruli testojn kaj kolekti testkovron permesis al mi centralizi la servojn, kiujn mi uzis.
* Agordante `allowImportingTsExtensions: true` en `tsconfig.json`, mi povis eviti uzi [Denoify](https://github.com/garronej/denoify) por aparta Deno-versio.

## Ŝanĝoj en la API

Alia problemo estis la API. Simplaj metodoj kiel `eta.render()` havis multajn troŝarĝojn, kio malfaciligis inferi tipojn kaj igis la uzadon neintuicia. Oni povis transdoni propran agordan objekton dum alvoko de al uzantoj elmetitaj funkcioj kiel `render`, `parse` kaj `compile`. Praktike tio signifis, ke la agordo provizita de la uzanto devis esti kunfandita kun la apriora agordo ĉiufoje, kiam iu ajn el tiuj funkcioj estis vokita.

Ŝanĝoj en versio 3:

* Estas nur unu eksporto: nomita klaso `Eta`. Tiu klaso havas nur unu konstruktilon, kiu prilaboras agordan objekton kaj kreas ŝablonajn kaŝmemorojn dum instancigo.
* La funkcioj `render()` kaj `renderAsync()` nun havas nur unu funkcian signaturon.
  * En Eta v2, `render()` kaj `renderAsync()` povis esti uzataj por bildigi aŭ nomitajn ŝablonojn aŭ ŝablonajn ĉenojn. Eta v3 enkondukas du novajn funkciojn por bildigi ŝablonajn ĉenojn: `renderString()` kaj `renderStringAsync()`.
* La funkcioj `readFile()` kaj `resolvePath()`, kiujn Eta uzas interne, povas esti anstataŭataj de la uzanto kiel klasmetodoj.
* Internaj variabloj kaj metodoj en ĉiu kompilita ŝablono estas konservataj en la objekto `__eta`, anstataŭ en pluraj variabloj, inkluzive de `__res`.
* Anstataŭ permesi al uzantoj specifi unu dosierujon `root` kaj plurajn dosierujojn `views`, uzantoj nun povas simple specifi unu solan dosierujon `views`. Tiu dosierujo estas uzata kiel radika dosierujo por ĉia ŝablonserĉado. Ĉiuj ŝablonaj dosieroj devas troviĝi en tiu dosierujo aŭ en ĝia subdosierujo, kio plibonigas la sekurecon de ŝablonoj kaj malpliigas multekostajn dosierserĉajn operaciojn.

## Ŝanĝoj en la programista sperto

Unu el la plej grandaj ŝanĝoj en Eta v3 estis la aldono de detalaj rultempaj eraroj (inspirite de EJS). Konsideru ekzemple la jenan ŝablonon, kiu kaŭzos eraron pro nedifinita variablo:

```eta
Template header
<%= undefinedVariable %>
Lorem Ipsum
```

Eta v2 ĵetis eraron kun iuj ĝeneralaj informoj, sed tio ne estis aparte utila. Kontraste, Eta v3 ĵetas detalan eraron kun la nomo de la ŝablono, la lininombro kaj la erarmesaĝo:

```text
EtaError [ReferenceError]: .../my-dir/templates/runtime-error.eta:2
    1| Template header
 >> 2| <%= undefinedVariable %>
    3| Lorem Ipsum

undefinedVariable is not defined
```

## Ŝanĝoj en la dokumentado

La dokumentado por Eta v2 estis ampleksa, sed tre malfacile trair-ebla. Informoj pri la projekto estis disigitaj tra pli ol 40 (!) dokumentaj paĝoj, troveblaj en pluraj dosierujoj disaj tra 3 malsamaj sekcioj de la retejo.

La dokumentado por Eta v3 konsistas el 9 paĝoj, ĉiuj troveblaj en la sama parto de la retejo ([eta.js.org](https://eta.js.org)). Temoj kiel ŝablona sintakso kaj API-superrigardo estas pritraktataj en unu sola paĝo, anstataŭ esti disigitaj tra pluraj paĝoj.

## La estonteco de Eta

Mi fieras pri la ŝanĝoj en Eta v3 kaj pri la projekto entute. Grandan dankon al ĉiuj, kiuj kontribuis al la projekto per PR-oj, issue-oj kaj sugestoj. Kroman dankon ankaŭ al projektoj kiel [ejs](https://github.com/mde/ejs), el kiuj Eta daŭre ĉerpas inspiron.

Laŭ mi, Eta nun estas plejparte kompletigita laŭ funkcioj, kvankam mi plu riparos cimojn kaj aldonos kelkajn etajn funkciojn. Mi instigus nunajn uzantojn de la biblioteko ĝisdatigi al v3, kaj mi esperas, ke novaj uzantoj trovos en Eta bonegan solvon por siaj projektoj.

## Ligiloj

* [Eta ĉe GitHub](https://github.com/eta-dev/eta)
* [Eta ĉe npm](https://www.npmjs.com/package/eta)
* [Retejo kaj dokumentaro de Eta](https://eta.js.org)