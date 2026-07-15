---
title: "Ohlédnutí za létem 2025"
description: Co jsem se naučil a jaké projekty jsem vytvořil.
date: "2025-09-19"
tags: [random]
---

Původně jsem chtěl psát jak o své stáži ve Vercelu, tak o osobních projektech a o tom, co jsem se naučil, ale nakonec jsem se rozhodl rozdělit to do dvou příspěvků. O stáži se tu brzy dozvíte víc!

Mezitím tu je stručný přehled toho, co se mi během léta dělo mimo práci. Bude to něco mezi deníkovým zápisem, blogovým příspěvkem a „seznamem úspěchů“, do kterého můžou nahlédnout i potenciální zaměstnavatelé ;), takže se předem omlouvám, jestli to bude znít, jako bych se moc vytahoval.

## AI projekty

Konečně jsem se naučil psát GPU kernely s pomocí [několika](https://developer.nvidia.com/blog/even-easier-introduction-cuda/) [skvělých](https://codelabs.developers.google.com/your-first-webgpu-app) [zdrojů](https://leetgpu.com/)! V souvislosti s tím jsem vytvořil (zatím dost rozpracovanou) knihovnu podobnou PyTorch pro výpočty akcelerované přes WebGPU v JavaScriptu. Říkám jí [shade](https://github.com/bgub/shade) (chápete, jako *shadery*?) Zpětnou propagaci jsem tam ale zatím nepřidal.

Také jsem vydal několik projektů souvisejících s tokenizací, což je oblast, která mě hodně zajímá: [tokka-bench](./2025-08-25-tokka-bench-evaluate-tokenizers-multilingual), nástroj pro vyhodnocování/benchmarking tokenizérů napříč více jazyky, a [tokka](http://github.com/bgub/tokka), nástroj pro snadné trénování tokenizérů na vlastních kombinacích dat.

Protože práce s velkým množstvím dat jen pomocí Datasetů HuggingFace je obtížná, napsal jsem [hf&#95;to&#95;mds](https://github.com/bgub/hf_to_mds) — skript pro snadný převod datasetů do formátu MosaicML Streaming a jejich nahrávání na HuggingFace Hub! Vytvořil jsem [MDS verzi datasetu Wikipedia](https://huggingface.co/datasets/bgub/wikipedia-mds) a rád bych převedl i další, ale stále ještě čekám na odpověď ohledně navýšení limitů úložiště.

Nakonec jsem napsal [článek na LessWrong](https://www.lesswrong.com/posts/yRoXmjBKJFbc6zSFq/dialects-for-humans-sounding-distinct-from-llms?utm_campaign=post_share\&utm_source=link) o tom, jak lidé mění způsob své mluvy, aby zněli odlišně od velkých jazykových modelů. Dostal se na hlavní stránku, což je docela super!

## Různé

* Po letech prokrastinace jsem se konečně naučil klávesové zkratky ve Vimu! Ukázaly se jako překvapivě užitečné. Na chvíli jsem přešel na LazyVim a teď používám Zed.
* Když už je řeč o Zedu, pracuji na konfiguraci inspirované LazyVimem s klávesovými zkratkami přes leader key. Snad ji brzy vydám! Taky jsem mergnul PR, který [uživatelům umožní skrýt titulkový pruh](https://github.com/zed-industries/zed/pull/37428).
* Konečně jsem se rozhoupal a na GitHubu se přejmenoval z `@nebrelbug` na `@bgub`! Na X jsem `@bgub_`... dejte vědět, jestli víte, jak bych mohl získat `@bgub`!
* Tenhle web vypadá o dost lépe poté, co jsem s pomocí v0 upravil UI. A taky jsem přidal super tlačítko „Vysvětli jako pro pětileté“ na průběžně generovaná AI shrnutí příspěvků!
* Během léta jsem poprvé dlouhodobě používal macOS. Líbilo se mi méně, než jsem čekal (automatické skládání oken je mnohem horší než na Linuxu), takže na svém osobním počítači dál denně používám Linux. Pár týdnů jsem používal Omarchy a pak se vrátil k Fedoře s Desktopovým prostředím COSMIC, které jsem [možná pomohl inspirovat](https://www.reddit.com/r/pop_os/comments/1empjaw/5_years_ago_i_suggested_that_system76_write_a/) (i když reálně asi ne.)
* Zkoušení tolika různých OS mě unavilo z neustálého nastavování počítače, takže jsem se naučil používat Nix! Vytvořil jsem konfiguraci s home-managerem pro svůj pracovní MacBook a k tomu i související [veřejnou šablonu](https://github.com/bgub/nix-macos-starter). Moje nastavení funguje i na linuxových strojích, ale tyhle změny jsem zatím do šablony neposlal upstream.
* Ve Vercel jsem napsal sedmidílný tutoriál o tom, jak od nuly postavit React framework. Ještě jsem ho nepublikoval, ale snad brzy!

A nakonec pár novinek z posledních několika týdnů (technicky už léto není, ale jsem příliš unavený na psaní dalších příspěvků).

* Vydal jsem [šablonu pro TS knihovny](2025-09-17-ts-base-typescript-library-template), která používá moderní nástroje jako release-please, Vitest, tsdown a Biome.
* Vydal jsem novou, čistě ESM verzi [eta](2025-09-17-introducing-eta-v4) s využitím těchto nástrojů.
* Aktualizoval jsem [eta.js.org](https://eta.js.org/) a [squirrelly.js.org](https://squirrelly.js.org/) tak, aby místo Docusauru používaly FumaDocs, lépe podporovaly verzování atd.