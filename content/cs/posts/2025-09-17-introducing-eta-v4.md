---
title: "Představuji Eta v4"
description: "Přechod Ety výhradně na ESM, změna scope balíčku a vylepšení CI/CD."
date: "2025-09-17T11:30:00-06:00"
tags: [open-source]
---

Eta jsem poprvé vydal před pěti lety! Od té doby se rozrostla natolik, že na ní závisejí stovky balíčků a týdně se stáhne více než milionkrát.

Etu od verze v3, která vyšla v červnu 2023, považuji z větší části za „hotové dílo“. Nebyl jsem ale spokojený s tím, jak byl v projektu řešený bundling, testování, lintování a CI/CD, takže jsem ho přepsal! (A své změny jsem pak zpětně vyčlenil do [nové šablony TS knihovny s názvem ts-base](https://www.bengubler.com/posts/2025-09-17-ts-base-typescript-library-template)).

Je tu ještě pár dalších změn, o kterých je dobré vědět:

* Eta je teď ve výchozím nastavení pouze pro ESM. Je rok 2025 a tohle je správná volba!
* Repozitář (a další související repozitáře) jsem převedl na svůj osobní účet na GitHubu, [bgub](https://github.com/bgub). Protože jsem hlavní přispěvatel, myslím, že to zjednoduší údržbu a omezí zmatky.
* Eta se bude dál publikovat na https://deno.land/x/, ale uživatelům doporučuji používat raději https://jsr.io/@bgub/eta.
* Pokud chcete používat verzi Ety kompatibilní s prohlížečem, musíte importovat z `eta/core`, protože teď v našem `package.json` používáme mnohem čistší `"exports"`.