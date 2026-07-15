---
title: Predstavujeme Eta v3
description: Ďalšia verzia Ety, vstavaného JS šablónovacieho nástroja, prináša vylepšenia API a dokumentácie.
date: "2023-06-22"
tags: [open-source]
---

## Pozadie

Dnes je Eta môj najpopulárnejší a najpoužívanejší open-source projekt. Keď som ju však pred 3 rokmi prvýkrát zverejnil, nepatrila medzi moje hlavné priority. V skutočnosti som Etu vytvoril ako odľahčenú verziu [Squirrelly](https://squirrelly.js.org), komplexnejšieho šablónovacieho nástroja s funkciami, ako sú helpery a filtre.

Postupom času som si uvedomil, že pre väčšinu projektov sa vstavaný šablónovací nástroj v skutočnosti hodí viac než niečo zložitejšie. Projekty, ktoré potrebovali komplexné spracovanie HTML alebo spracovanie HTML na strane klienta, zvyčajne používali framework ako React alebo Vue. Výkon Ety a malá veľkosť bundle z nej zároveň robili skvelú voľbu pre projekty, ktoré potrebovali rýchle spracovanie, nízke nároky na pamäť alebo prácu s jazykmi, ktoré nie sú XML.

Eta si zároveň získavala čoraz väčšiu popularitu vďaka svojej rýchlosti, podpore Dena a syntaktickým výhodám oproti EJS. Vzhľadom na tieto faktory som sa rozhodol zamerať sa hlavne na Etu. Venoval som čas písaniu návodov, opravovaniu chýb a dolaďovaniu dokumentácie.

Po niekoľkých rokoch a období, keď som sa kvôli misionárskej službe nevenoval programovaniu, som si konečne opäť našiel čas pracovať na Ete. Rozhodol som sa v projekte urobiť niekoľko veľkých zmien vrátane build systému, API a dokumentácie.

## Aktualizácie build systému

Napriek výhodám a funkciám mala Eta aj niekoľko veľkých problémov. Jedným z nich bol build systém. Bol zložitý a ťažkopádny, takže sa ťažko udržiaval aj aktualizoval. Musel som pracovať so zložitými konfiguračnými súbormi a tiež transpilovať verziu špeciálne pre Deno.

Zmeny vo verzii 3:

* Použitie [microbundle](https://github.com/developit/microbundle) na vytvorenie bundle knižnice mi pomohlo vyhnúť sa potrebe zložitých konfiguračných súborov.
* Použitie GitHub Actions na spúšťanie testov a zber pokrytia kódu mi umožnilo skonsolidovať služby, ktoré som používal.
* Nastavením `allowImportingTsExtensions: true` v `tsconfig.json` som sa dokázal vyhnúť používaniu [Denoify](https://github.com/garronej/denoify) na samostatný build pre Deno.

## Zmeny API

Ďalším problémom bolo API. Jednoduché metódy ako `eta.render()` mali veľa preťažených verzií, čo sťažovalo odvodzovanie typov a robilo ich používanie neintuitívnym. Pri volaní funkcií sprístupnených používateľovi, ako sú `render`, `parse` a `compile`, bolo možné odovzdať vlastný objekt konfigurácie. V praxi to znamenalo, že konfiguráciu zadanú používateľom bolo treba pri každom volaní ktorejkoľvek z týchto funkcií zlúčiť s predvolenou konfiguráciou.

Zmeny vo verzii 3:

* Existuje už len jeden export: pomenovaná trieda `Eta`. Táto trieda má jediný konštruktor, ktorý spracuje objekt konfigurácie a pri vytvorení inštancie vygeneruje cache šablón.
* Funkcie `render()` a `renderAsync()` majú teraz už len jednu signatúru.
  * V Eta v2 bolo možné `render()` a `renderAsync()` použiť na vykreslenie pomenovaných šablón aj reťazcov šablón. Eta v3 zavádza dve nové funkcie na vykresľovanie reťazcov šablón: `renderString()` a `renderStringAsync()`.
* Funkcie `readFile()` a `resolvePath()`, ktoré Eta používa interne, môže používateľ prepísať ako metódy triedy.
* Interné premenné a metódy v každej skompilovanej šablóne sú uložené v objekte `__eta` namiesto toho, aby boli rozdelené medzi viacero premenných vrátane `__res`.
* Namiesto toho, aby používatelia mohli určiť jeden koreňový adresár `root` a viacero adresárov `views`, môžu teraz zadať iba jeden adresár `views`. Tento adresár sa používa ako koreňový adresár pre celé rozlišovanie šablón. Všetky súbory šablón musia byť v tomto adresári alebo v jeho podadresári, čo zvyšuje bezpečnosť šablón a znižuje náročné operácie vyhľadávania súborov.

## Zmeny vo vývojárskej skúsenosti

Jednou z najväčších zmien v Eta v3 bolo pridanie podrobných chybových hlásení za behu (inšpirovaných EJS). Zvážte napríklad nasledujúcu šablónu, ktorá vyhodí chybu kvôli nedefinovanej premennej:

```eta
Template header
<%= undefinedVariable %>
Lorem Ipsum
```

Eta v2 vyhodila chybu s niekoľkými všeobecnými informáciami, ale nebolo to práve veľmi užitočné. Naopak, Eta v3 vypíše podrobnú chybu s názvom šablóny, číslom riadku a chybovým hlásením:

```text
EtaError [ReferenceError]: .../my-dir/templates/runtime-error.eta:2
    1| Template header
 >> 2| <%= undefinedVariable %>
    3| Lorem Ipsum

undefinedVariable is not defined
```

## Zmeny v dokumentácii

Dokumentácia k Eta v2 bola rozsiahla, ale veľmi neprehľadná. Informácie o projekte boli rozdelené medzi viac ako 40 (!) stránok dokumentácie vo viacerých priečinkoch roztrúsených v 3 rôznych sekciách webu.

Dokumentácia k Eta v3 má 9 stránok, pričom všetky sú v tej istej časti webu ([eta.js.org](https://eta.js.org)). Témy ako syntax šablón a prehľad API sú spracované na jednej stránke namiesto toho, aby boli rozdelené na viacero stránok.

## Budúcnosť Eta

Som hrdý na zmeny vo verzii Eta v3 aj na projekt ako celok. Veľká vďaka patrí všetkým, ktorí do projektu prispeli prostredníctvom PR, issues a návrhov. Ďakujem aj projektom, ako je [ejs](https://github.com/mde/ejs), z ktorých Eta naďalej čerpá inšpiráciu.

V tomto bode považujem Etu za knižnicu, ktorá je z väčšej časti funkčne kompletná, hoci budem naďalej opravovať chyby a pridávať menšie funkcie. Súčasným používateľom knižnice by som odporučil prejsť na v3 a dúfam, že noví používatelia zistia, že Eta je pre ich projekty skvelou voľbou.

## Odkazy

* [Eta na GitHube](https://github.com/eta-dev/eta)
* [Eta na npm](https://www.npmjs.com/package/eta)
* [Web a dokumentácia Eta](https://eta.js.org)