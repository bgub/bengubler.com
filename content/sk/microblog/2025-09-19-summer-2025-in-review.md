---
title: "Obzretie za letom 2025"
description: Čo som sa naučil a aké projekty som vytvoril.
date: "2025-09-19"
tags: [random]
---

Pôvodne som plánoval napísať o svojej stáži vo Vercel aj o svojich osobných projektoch a skúsenostiach s učením, no napokon som sa rozhodol rozdeliť tieto témy do dvoch príspevkov. O mojej stáži sa čoskoro dozviete viac!

Dovtedy tu je stručný prehľad toho, čo sa počas leta dialo mimo práce. Bude to niečo medzi denníkovým zápisom, blogovým príspevkom a „zoznamom úspechov“, do ktorého môžu nazrieť aj potenciálni zamestnávatelia ;), takže sa vopred ospravedlňujem, ak to bude pôsobiť, akoby som sa trochu vychvaľoval.

## AI projekty

Konečne som sa naučil písať GPU jadrá pomocou [niekoľkých](https://developer.nvidia.com/blog/even-easier-introduction-cuda/) [skvelých](https://codelabs.developers.google.com/your-first-webgpu-app) [zdrojov](https://leetgpu.com/)! V nadväznosti na to som vytvoril (stále dosť rozpracovanú) knižnicu podobnú PyTorchu na výpočty akcelerované cez WebGPU v JavaScripte. Volá sa [shade](https://github.com/bgub/shade) (chápete, ako *shaders*?) Spätnú propagáciu som tam však zatiaľ ešte nepridal.

Vydal som aj niekoľko projektov súvisiacich s tokenizáciou, čo je oblasť, ktorá ma veľmi zaujíma: [tokka-bench](./2025-08-25-tokka-bench-evaluate-tokenizers-multilingual), súbor nástrojov na vyhodnocovanie/benchmarkovanie tokenizérov vo viacerých jazykoch, a [tokka](http://github.com/bgub/tokka), súbor nástrojov na jednoduché trénovanie tokenizérov na vlastných kombináciách dát.

Keďže práca s veľkými objemami dát iba pomocou Datasetov HuggingFace je náročná, napísal som [hf&#95;to&#95;mds](https://github.com/bgub/hf_to_mds) — skript na jednoduchú konverziu datasetov do formátu MosaicML Streaming a ich nahrávanie na HuggingFace Hub! Vytvoril som [MDS verziu datasetu Wikipedia](https://huggingface.co/datasets/bgub/wikipedia-mds) a rád by som skonvertoval aj ďalšie, ale stále čakám na odpoveď ohľadom navýšenia limitov úložiska.

Napokon som napísal [článok na LessWrong](https://www.lesswrong.com/posts/yRoXmjBKJFbc6zSFq/dialects-for-humans-sounding-distinct-from-llms?utm_campaign=post_share\&utm_source=link) o tom, ako ľudia menia svoj spôsob reči, aby zneli odlišne od veľkých jazykových modelov (LLMs). Objavil sa na hlavnej stránke, čo je celkom super!

## Náhodné veci

* Po rokoch prokrastinácie som sa konečne naučil klávesové skratky Vimu! Ukázali sa ako prekvapivo užitočné. Na chvíľu som prešiel na LazyVim a teraz používam Zed.
* Keď už je reč o Zed, pracujem na konfigurácii inšpirovanej LazyVimom s klávesovými skratkami cez leader key. Dúfam, že ju čoskoro vydám! Tiež som zmergoval PR, aby [si používatelia mohli skryť titulný panel](https://github.com/zed-industries/zed/pull/37428).
* Konečne som sa odhodlal a na GitHub som sa premenoval z `@nebrelbug` na `@bgub`! Na X som `@bgub_`... dajte mi vedieť, ak viete, ako môžem získať `@bgub`!
* Táto webová stránka vyzerá po aktualizácii UI a štýlov s pomocou v0 výrazne lepšie. A pridal som aj super tlačidlo „Vysvetli mi to, akoby som mal 5 rokov“ na priebežne generované AI zhrnutia príspevkov!
* Počas leta som prvýkrát dlhodobo používal macOS. Páčil sa mi menej, než som čakal (automatické dlaždicové usporiadanie je oveľa horšie než na Linuxe), takže na svojom osobnom počítači stále používam Linux ako hlavný systém. Pár týždňov som používal Omarchy, potom som sa vrátil k Fedore s desktopovým prostredím COSMIC, ku ktorému som [možno trochu pomohol dať impulz](https://www.reddit.com/r/pop_os/comments/1empjaw/5_years_ago_i_suggested_that_system76_write_a/) (ale realisticky asi nie).
* Skúšanie toľkých rôznych OS ma unavilo z neustáleho nastavovania počítača, takže som sa naučil používať Nix! Vytvoril som konfiguráciu s home-managerom pre svoj pracovný MacBook a k tomu aj súvisiacu [verejnú šablónu](https://github.com/bgub/nix-macos-starter). Moje nastavenie funguje aj na linuxových strojoch, ale tieto zmeny som ešte nepridal späť do šablóny.
* Vo Vercel som napísal 7-kapitolový tutoriál o tom, ako od základov vytvoriť React framework. Ešte som ho nezverejnil, ale dúfam, že čoskoro!

Nakoniec ešte pár noviniek z posledných niekoľkých týždňov (technicky už leto nie je, ale som príliš unavený na to, aby som písal ďalšie príspevky).

* Vydal som [šablónu pre TS knižnice](2025-09-17-ts-base-typescript-library-template), ktorá používa moderné nástroje ako release-please, Vitest, tsdown a Biome.
* Vydal som novú, čisto ESM verziu [eta](2025-09-17-introducing-eta-v4) s použitím týchto nástrojov.
* Aktualizoval som [eta.js.org](https://eta.js.org/) a [squirrelly.js.org](https://squirrelly.js.org/) tak, aby namiesto Docusaurus používali FumaDocs, mali lepšiu podporu verziovania atď.