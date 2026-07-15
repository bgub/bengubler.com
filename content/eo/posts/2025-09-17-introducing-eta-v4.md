---
title: "Prezentante Eta v4"
description: "Igi Eta nur ESM, ŝanĝi la amplekson de la pakaĵo, kaj plibonigi CI/CD."
date: "2025-09-17T11:30:00-06:00"
tags: [open-source]
---

Mi publikigis Eta unuafoje antaŭ kvin jaroj! Ekde tiam, ĝi kreskis tiel, ke centoj da pakaĵoj dependas de ĝi, kaj ĝi estas elŝutata pli ol 1 milionon da fojoj semajne.

Mi konsideras Eta plejparte „finita laboro“ ekde v3, kiu aperis en junio 2023. Sed mi ne estis kontenta pri la bundlado, testado, linting kaj CI/CD-flankoj de la projekto, do mi reskribis ĝin! (Kaj poste mi apartigis tiujn ŝanĝojn en [novan TS-bibliotekan ŝablonon nomatan ts-base](https://www.bengubler.com/posts/2025-09-17-ts-base-typescript-library-template)).

Estas ankoraŭ kelkaj ŝanĝoj, pri kiuj indas scii:

* Eta nun estas nur ESM defaŭlte. Estas 2025, kaj tio estas la ĝusta elekto!
* Mi transdonis la deponejon (kaj aliajn rilatajn deponejojn) al mia persona GitHub-konto, [bgub](https://github.com/bgub). Ĉar mi estas la ĉefa kontribuanto, mi pensas, ke tio simpligos la prizorgadon kaj malpliigos konfuzon.
* Eta plu estos publikigata ĉe https://deno.land/x/, sed mi rekomendas, ke uzantoj anstataŭe uzu https://jsr.io/@bgub/eta.
* Por uzi la retumilo-kongruan version de Eta, vi devas importi el `eta/core`, ĉar ni nun uzas multe pli klarajn `"exports"` en nia `package.json`.