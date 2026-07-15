---
title: "Predstavujeme Eta v4"
description: "Eta prechádza na čisto ESM, mení scope balíka a zlepšuje CI/CD."
date: "2025-09-17T11:30:00-06:00"
tags: [open-source]
---

Eta som prvýkrát vydal pred piatimi rokmi! Odvtedy sa rozrástla natoľko, že od nej dnes závisia stovky balíkov a každý týždeň sa stiahne viac ako 1 miliónkrát.

Od verzie v3, ktorá vyšla v júni 2023, považujem Eta v podstate za „hotové dielo“. Nebol som však spokojný s bundlovaním, testovaním, lintovaním a CI/CD stránkou projektu, takže som ju prepísal! (A potom som tieto zmeny dodatočne vyčlenil do [novej šablóny TS knižnice s názvom ts-base](https://www.bengubler.com/posts/2025-09-17-ts-base-typescript-library-template)).

Je tu ešte niekoľko zmien, o ktorých by ste mali vedieť:

* Eta je teraz štandardne len ESM. Je rok 2025 a je to správna voľba!
* Repozitár (a ďalšie súvisiace repozitáre) som presunul do svojho osobného GitHub účtu, [bgub](https://github.com/bgub). Keďže som hlavný prispievateľ, myslím si, že to zjednoduší údržbu a zníži nejasnosti.
* Eta sa bude naďalej publikovať na https://deno.land/x/, ale používateľom odporúčam radšej používať https://jsr.io/@bgub/eta.
* Ak chcete používať verziu Eta pre prehliadač, musíte importovať z `eta/core`, pretože teraz v našom `package.json` používame oveľa čistejšie `"exports"`.