---
title: "Predstavujeme Eta v4"
description: "Prechod Eta výhradne na ESM, zmena scope balíka a vylepšenie CI/CD."
date: "2025-09-17T11:30:00-06:00"
tags: [open-source]
---

Eta som prvýkrát vydal pred piatimi rokmi! Odvtedy sa rozšírila natoľko, že od nej závisia stovky balíkov a týždenne sa stiahne viac než 1 miliónkrát.

Od verzie v3, ktorá vyšla v júni 2023, považujem Eta viac-menej za „hotové dielo“. Nebol som však spokojný s bundlovaním, testovaním, lintingom a CI/CD stránkou projektu, takže som ju prepísal! (A potom som tieto zmeny dodatočne vyčlenil do [novej TS šablóny pre knižnice s názvom ts-base](https://www.bengubler.com/posts/2025-09-17-ts-base-typescript-library-template)).

Je tu ešte pár ďalších zmien, o ktorých by ste mali vedieť:

* Eta je teraz predvolene iba pre ESM. Je rok 2025 a je to správna voľba!
* Repozitár (a ďalšie súvisiace repozitáre) som presunul na svoj osobný účet na GitHub, [bgub](https://github.com/bgub). Keďže som hlavný prispievateľ, myslím si, že to zjednoduší údržbu a zníži zmätok.
* Eta sa bude aj naďalej publikovať na https://deno.land/x/, ale používateľom odporúčam používať radšej https://jsr.io/@bgub/eta.
* Ak chcete používať verziu Eta kompatibilnú s browserom, musíte importovať z `eta/core`, keďže teraz v `package.json` používame oveľa čistejšie `"exports"`.