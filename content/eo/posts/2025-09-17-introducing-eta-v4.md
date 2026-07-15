---
title: "Prezentante Eta v4"
description: "Farante Eta nur-ESM, ŝanĝante la pakaĵan nomspacon, kaj plibonigante CI/CD."
date: "2025-09-17T11:30:00-06:00"
tags: [open-source]
---

Mi publikigis Eta la unuan fojon antaŭ kvin jaroj! Ekde tiam, centoj da pakaĵoj dependas de ĝi, kaj ĝi estas elŝutata pli ol 1M fojojn semajne.

Mi konsideras Eta esence „finita verko“ ekde v3, kiu estis publikigita en junio 2023. Sed mi ne estis kontenta pri la pakado, testado, linting kaj CI/CD-flankoj de la projekto, do mi reverkis ĝin! (Poste mi apartigis tiujn ŝanĝojn en [novan TS-bibliotekan ŝablonon nomatan ts-base](https://www.bengubler.com/posts/2025-09-17-ts-base-typescript-library-template)).

Jen ankoraŭ kelkaj ŝanĝoj, pri kiuj indas scii:

* Eta nun estas defaŭlte nur-ESM. Jam estas 2025, kaj ĉi tio estas la ĝusta elekto!
* Mi transdonis la deponejon (kaj aliajn rilatajn deponejojn) al mia persona GitHub-konto, [bgub](https://github.com/bgub). Ĉar mi estas la ĉefa kontribuanto, mi pensas, ke tio simpligos la prizorgadon kaj malpliigos konfuzon.
* Eta plu estos publikigata ĉe https://deno.land/x/, sed mi rekomendas, ke uzantoj anstataŭe uzu https://jsr.io/@bgub/eta.
* Por uzi la retumil-kongruan version de Eta, vi devas importi el `eta/core`, ĉar ni nun uzas multe pli purajn `"exports"` en nia `package.json`.