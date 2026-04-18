---
title: Predstavujeme Eta v3
description: Nová verzia Eta, vstavaného šablónovacieho nástroja pre JS, prináša vylepšenia API a dokumentácie.
date: "2023-06-22"
tags: [open-source]
---

## Pozadie

Dnes je Eta môj najpopulárnejší a najpoužívanejší open-source projekt. Keď som ju však pred 3 rokmi prvýkrát zverejnil, nepatrila medzi moje hlavné priority. V skutočnosti som Etu vytvoril ako odľahčenú verziu [Squirrelly](https://squirrelly.js.org), komplexnejšieho šablónovacieho nástroja s funkciami, ako sú helpery a filtre.

Postupom času som si uvedomil, že pre väčšinu projektov sa vstavaný šablónovací nástroj v skutočnosti hodí viac než niečo zložitejšie. Projekty, ktoré potrebovali zložité spracovanie HTML alebo spracovanie HTML na strane klienta, zvyčajne používali framework ako React alebo Vue. Výkon Ety a malá veľkosť bundla z nej zároveň robili skvelú voľbu pre projekty, ktoré potrebovali rýchle spracovanie, nízku spotrebu pamäte alebo prácu s ne-XML jazykmi.

Eta sa zároveň stávala čoraz populárnejšou vďaka svojej rýchlosti, podpore Dena a syntaktickým výhodám oproti EJS. Vzhľadom na tieto faktory som sa rozhodol zamerať sa na Etu ako na svoj hlavný projekt. Venoval som čas písaniu tutoriálov, opravovaniu problémov a dolaďovaniu dokumentácie.

Po niekoľkých rokoch a po období, keď som sa ako misionár nevenoval programovaniu, som si konečne opäť našiel čas pracovať na Ete. Rozhodol som sa v projekte urobiť niekoľko veľkých zmien vrátane build systému, API a dokumentácie.

## Aktualizácie build systému

Napriek výhodám a funkciám mala Eta aj niekoľko veľkých problémov. Jedným z nich bol build systém. Bol zložitý a nešikovný, takže sa ťažko udržiaval a aktualizoval. Musel som sa vysporiadať so zložitými konfiguračnými súbormi aj s nutnosťou transpilovať osobitnú verziu pre Deno.

Zmeny vo verzii 3:

* Použitie [microbundle](https://github.com/developit/microbundle) na zabalenie knižnice mi pomohlo vyhnúť sa potrebe zložitých konfiguračných súborov.
* Použitie GitHub Actions na spúšťanie testov a zber pokrytia mi umožnilo skonsolidovať služby, ktoré som používal.
* Nastavením `allowImportingTsExtensions: true` v `tsconfig.json` som sa mohol vyhnúť používaniu [Denoify](https://github.com/garronej/denoify) na samostatný build pre Deno.

## Zmeny API

Ďalším problémom bolo API. Jednoduché metódy ako `eta.render()` mali mnoho preťažení, čo sťažovalo odvodzovanie typov a robilo ich používanie neintuitívnym. Pri volaní používateľsky dostupných funkcií, ako sú `render`, `parse` a `compile`, bolo možné odovzdať vlastný konfiguračný objekt. V praxi to znamenalo, že pri každom volaní ktorejkoľvek z týchto funkcií bolo potrebné zlúčiť používateľskú konfiguráciu s predvolenou konfiguráciou.

Zmeny vo verzii 3:

* Existuje už len jeden export: pomenovaná trieda `Eta`. Táto trieda má jediný konštruktor, ktorý spracuje konfiguračný objekt a pri inštancovaní vygeneruje cache šablón.
* Funkcie `render()` a `renderAsync()` majú teraz už len jednu signatúru.
  * V Eta v2 sa `render()` a `renderAsync()` dali použiť na vykreslenie pomenovaných šablón aj reťazcov šablón. Eta v3 zavádza dve nové funkcie na vykresľovanie reťazcov šablón: `renderString()` a `renderStringAsync()`.
* Funkcie `readFile()` a `resolvePath()`, ktoré Eta interne používa, môže používateľ prepísať ako metódy triedy.
* Interné premenné a metódy v každej skompilovanej šablóne sú uložené v objekte `__eta` namiesto toho, aby boli rozdelené medzi viacero premenných vrátane `__res`.
* Namiesto toho, aby používatelia mohli určiť jeden koreňový adresár `root` a viacero adresárov `views`, môžu teraz zadať len jeden adresár `views`. Tento adresár sa používa ako koreňový adresár pre všetko vyhľadávanie šablón. Všetky súbory šablón musia byť v tomto adresári alebo v niektorom z jeho podadresárov, čo zvyšuje bezpečnosť šablón a znižuje nákladné operácie vyhľadávania súborov.

## Zmeny vo vývojárskej skúsenosti

Jednou z najväčších zmien v Eta v3 bolo pridanie podrobných chybových hlásení za behu (inšpirovaných EJS). Zvážte napríklad nasledujúcu šablónu, ktorá vyhodí chybu kvôli nedefinovanej premennej:

```eta
Template header
<%= undefinedVariable %>
Lorem Ipsum
```

Eta v2 vyhodila chybu s niekoľkými všeobecnými informáciami, ale nebolo to veľmi užitočné. Naopak, Eta v3 vyhodí podrobnú chybu s názvom šablóny, číslom riadku a chybovým hlásením:

```text
EtaError [ReferenceError]: .../my-dir/templates/runtime-error.eta:2
    1| Template header
 >> 2| <%= undefinedVariable %>
    3| Lorem Ipsum

undefinedVariable is not defined
```

## Zmeny v dokumentácii

Dokumentácia pre Eta v2 bola rozsiahla, ale veľmi neprehľadná. Informácie o projekte boli rozdelené na viac ako 40 (!) strán dokumentácie a nachádzali sa vo viacerých priečinkoch roztrúsených naprieč 3 rôznymi sekciami webu.

Dokumentácia pre Eta v3 má 9 strán, pričom všetky sa nachádzajú v tej istej časti webu ([eta.js.org](https://eta.js.org)). Témy ako syntax šablón a prehľad API sú spracované na jednej stránke namiesto toho, aby boli rozdelené na viacero stránok.

## Budúcnosť Eta

Som hrdý na zmeny zahrnuté v Eta v3 aj na projekt ako celok. Veľká vďaka patrí tým, ktorí do projektu prispeli prostredníctvom PR, issues a návrhov. Poďakovanie patrí aj projektom ako [ejs](https://github.com/mde/ejs), z ktorých Eta naďalej čerpá inšpiráciu.

V tejto chvíli považujem Eta za projekt, ktorý je už z väčšej časti funkčne kompletný, hoci budem naďalej opravovať chyby a pridávať menšie funkcie. Súčasným používateľom knižnice by som odporučil prejsť na v3 a dúfam, že aj noví používatelia zistia, že Eta sa pre ich projekty výborne hodí.

## Odkazy

* [Eta na GitHube](https://github.com/eta-dev/eta)
* [Eta na npm](https://www.npmjs.com/package/eta)
* [Web a dokumentácia Eta](https://eta.js.org)