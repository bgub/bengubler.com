---
title: "Představuji Eta v4"
description: "Přechod Eta jen na ESM, změna scope balíčku a vylepšení CI/CD."
date: "2025-09-17T11:30:00-06:00"
tags: [open-source]
---

Eta jsem poprvé vydal před pěti lety! Od té doby se rozrostla natolik, že na ní závisejí stovky balíčků a stahuje se více než 1 milionkrát týdně.

Od verze v3, která vyšla v červnu 2023, považuji Etu z velké části za „hotové dílo“. Nebyl jsem ale spokojený s tím, jak byly v projektu řešené bundlování, testování, linting a CI/CD, tak jsem ji přepsal! (A pak jsem z těchto změn zpětně vyčlenil [novou TS šablonu pro knihovny s názvem ts-base](https://www.bengubler.com/posts/2025-09-17-ts-base-typescript-library-template)).

Je tu ještě několik dalších změn, o kterých byste měli vědět:

* Eta je teď už jen ESM. Je rok 2025 a tohle je správná volba!
* Repozitář (a další související repozitáře) jsem přesunul na svůj osobní účet na GitHubu, [bgub](https://github.com/bgub). Protože jsem hlavní přispěvatel, myslím, že to zjednoduší údržbu a omezí zmatky.
* Eta se bude dál publikovat na https://deno.land/x/, ale uživatelům doporučuji místo toho používat https://jsr.io/@bgub/eta.
* Pokud chcete používat verzi Eta kompatibilní s prohlížečem, musíte importovat z `eta/core`, protože teď v našem `package.json` používáme mnohem čistší `"exports"`.