---
title: "Leto 2025 v skratke"
description: Čo som sa naučil a na akých projektoch som pracoval.
date: "2025-09-19"
tags: [náhodné]
---

Pôvodne som chcel písať o svojej stáži vo Vercel aj o svojich osobných projektoch a o tom, čo som sa naučil, ale napokon som sa rozhodol rozdeliť tieto témy do dvoch príspevkov. Čoskoro sa o mojej stáži dozviete viac!

Dovtedy je tu stručný prehľad toho, čo sa počas leta dialo mimo práce. Bude to niečo medzi denníkovým zápiskom, blogovým príspevkom a „zoznamom úspechov“ pre potenciálnych zamestnávateľov ;), takže sa vopred ospravedlňujem, ak to bude znieť, akoby som sa priveľmi chválil.

## AI projekty

Konečne som sa naučil písať GPU kernely pomocou [niekoľkých](https://developer.nvidia.com/blog/even-easier-introduction-cuda/) [skvelých](https://codelabs.developers.google.com/your-first-webgpu-app) [zdrojov](https://leetgpu.com/)! Popri tom som vytvoril (stále poriadne rozpracovanú) knižnicu podobnú PyTorchu pre výpočty akcelerované cez WebGPU v JavaScripte. Nazval som ju [shade](https://github.com/bgub/shade) (chápete, podľa *shaders*?) Spätnú propagáciu som tam však zatiaľ nepridal.

Vydal som tiež niekoľko projektov súvisiacich s tokenizáciou, čo je oblasť, ktorá ma veľmi zaujíma: [tokka-bench](./2025-08-25-tokka-bench-evaluate-tokenizers-multilingual), súpravu nástrojov na vyhodnocovanie/benchmarkovanie tokenizérov vo viacerých jazykoch, a [tokka](http://github.com/bgub/tokka), súpravu nástrojov na jednoduché trénovanie tokenizérov na vlastných kombináciách dát.

Keďže pracovať s veľkým množstvom dát len pomocou Datasetov HuggingFace je náročné, napísal som [hf&#95;to&#95;mds](https://github.com/bgub/hf_to_mds) — skript na jednoduchú konverziu datasetov do formátu MosaicML Streaming a ich nahrávanie na HuggingFace Hub! Vytvoril som [MDS verziu Wikipédie](https://huggingface.co/datasets/bgub/wikipedia-mds) a rád by som skonvertoval aj ďalšie datasety, ale stále čakám na odpoveď ohľadom navýšenia limitov úložiska.

Napokon som napísal [článok na LessWrong](https://www.lesswrong.com/posts/yRoXmjBKJFbc6zSFq/dialects-for-humans-sounding-distinct-from-llms?utm_campaign=post_share\&utm_source=link) o tom, ako ľudia menia svoj spôsob reči, aby zneli odlišne od veľkých jazykových modelov (LLMs). Objavil sa na hlavnej stránke, čo je celkom fajn!

## Náhodné veci

* Po rokoch prokrastinácie som sa konečne naučil klávesové skratky vo Vime! Ukázalo sa, že sú prekvapivo užitočné. Na chvíľu som prešiel na LazyVim a teraz používam Zed.
* Keď už je reč o Zed, pracujem na konfigurácii inšpirovanej LazyVimom s klávesovými skratkami cez leader key. Dúfam, že ju čoskoro vydám! Tiež som mergol PR, ktorý [umožňuje používateľom skryť titulný panel](https://github.com/zed-industries/zed/pull/37428).
* Konečne som sa odhodlal a na GitHub som sa premenoval z `@nebrelbug` na `@bgub`! Na X som `@bgub_`... dajte vedieť, ak viete, ako môžem získať `@bgub`!
* Tento web vyzerá po aktualizácii UI s pomocou od v0 výrazne lepšie. A pridal som aj super tlačidlo „Vysvetli mi to, akoby som mal 5 rokov“ na streamované AI súhrny príspevkov!
* Počas leta som prvýkrát dlhodobo používal macOS. Páčil sa mi menej, než som čakal (automatické usporiadanie okien je oveľa horšie než na Linuxe), takže na svojom osobnom počítači stále denne používam Linux. Niekoľko týždňov som používal Omarchy a potom som sa vrátil k Fedore s desktopovým prostredím COSMIC, ktorého vznik som [možno pomohol inšpirovať](https://www.reddit.com/r/pop_os/comments/1empjaw/5_years_ago_i_suggested_that_system76_write_a/) (ale realisticky asi nie).
* Keď som skúšal toľko rôznych možností OS, unavilo ma neustále nastavovanie počítača, a tak som sa naučil používať Nix! Vytvoril som konfiguráciu s home-managerom pre svoj pracovný MacBook a k nej aj súvisiacu [verejnú šablónu](https://github.com/bgub/nix-macos-starter). Moje nastavenie funguje aj na linuxových strojoch, ale tieto zmeny som zatiaľ neposlal upstream do šablóny.
* Vo Vercel som napísal 7-kapitolový tutoriál o tom, ako od nuly postaviť React framework. Zatiaľ som ho nepublikoval, ale dúfam, že čoskoro!

A napokon ešte pár noviniek z posledných niekoľkých týždňov (technicky už leto nie je, ale som príliš unavený na to, aby som písal ďalšie príspevky).

* Vydal som [šablónu pre TS knižnice](2025-09-17-ts-base-typescript-library-template) s modernými nástrojmi ako release-please, Vitest, tsdown a Biome.
* Vydal som novú, čisto ESM verziu [eta](2025-09-17-introducing-eta-v4) s použitím týchto nástrojov.
* Aktualizoval som [eta.js.org](https://eta.js.org/) a [squirrelly.js.org](https://squirrelly.js.org/) tak, aby používali FumaDocs namiesto Docusaurusu, podporovali lepšie verzovanie atď.