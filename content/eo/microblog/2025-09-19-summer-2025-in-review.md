---
title: "Somero 2025 retrorigarde"
description: Aferoj, kiujn mi lernis, kaj projektoj, kiujn mi faris.
date: "2025-09-19"
tags: [random]
---

Komence mi planis verki kaj pri mia staĝo ĉe Vercel kaj pri miaj personaj projektoj/spertadoj pri lernado, sed mi decidis disigi la temojn en du blogaĵojn. Baldaŭ vi aŭdos pli pri mia staĝo!

Intertempe, jen mallonga superrigardo pri la ne-laboraj okazintaĵoj de mia somero. Ĉi tio estos miksaĵo de taglibra noto, blogaĵo kaj „fanfaronlisto“, kiun eblaj dungantoj povos vidi ;), do mi jam anticipe pardonpetas, se ŝajnos, ke mi iom tro fanfaronas.

## AI-projektoj

Mi finfine lernis verki GPU-kernojn helpe de [kelkaj](https://developer.nvidia.com/blog/even-easier-introduction-cuda/) [bonegaj](https://codelabs.developers.google.com/your-first-webgpu-app) [rimedoj](https://leetgpu.com/)! Lige kun tio, mi faris (ankoraŭ tre WIP-an) PyTorch-similan bibliotekon por WebGPU-akcelita komputado en JavaScript. Mi nomas ĝin [shade](https://github.com/bgub/shade) (ĉu kaptite? kiel *shaders*?) Mi tamen ankoraŭ ne aldonis retropropagadon.

Mi ankaŭ publikigis kelkajn projektojn rilatajn al tokenigado, kampo kiu tre interesas min: [tokka-bench](./2025-08-25-tokka-bench-evaluate-tokenizers-multilingual), ilaro por taksi kaj kompari tokenigilojn tra pluraj lingvoj, kaj [tokka](http://github.com/bgub/tokka), ilaro por facile trejni tokenigilojn per propraj datummiksaĵoj.

Ĉar labori kun grandaj kvantoj da datumoj uzante nur HuggingFace Datasets estas malfacile, mi verkis [hf&#95;to&#95;mds](https://github.com/bgub/hf_to_mds) — skripton por facile konverti datumarojn al la formato MosaicML Streaming kaj alŝuti ilin al la HuggingFace Hub! Mi faris [MDS-version de la Vikipedio-datumaro](https://huggingface.co/datasets/bgub/wikipedia-mds) kaj ŝatus konverti pliajn, sed mi ankoraŭ atendas respondon pri plialtigo de miaj stokadlimoj.

Fine, mi verkis [artikolon en LessWrong](https://www.lesswrong.com/posts/yRoXmjBKJFbc6zSFq/dialects-for-humans-sounding-distinct-from-llms?utm_campaign=post_share\&utm_source=link) pri tio, kiel homoj ŝanĝas siajn parolmanierojn por soni klare malsame ol LLM-oj. Ĝi aperis sur la ĉefpaĝo, kio estas sufiĉe mojosa!

## Diversaĵoj

* Post jaroj da prokrastado, mi fine lernis la Vim-klavkombinojn! Tio montriĝis surprize utila. Dum kelka tempo mi uzis LazyVim, kaj nun mi estas ĉe Zed.
* Parolante pri Zed, mi laboras pri agordo inspirita de LazyVim kun gvidklavaj klavaraj ŝparvojoj. Mi esperas eldoni ĝin baldaŭ! Mi ankaŭ kunfandis PR-on por [ebligi al uzantoj kaŝi la titolbreton](https://github.com/zed-industries/zed/pull/37428).
* Mi fine kuraĝiĝis kaj ŝanĝis mian markon de `@nebrelbug` al `@bgub` en GitHub! Mi estas `@bgub_` en X... sciigu min, se vi scias, kiel mi povus ricevi `@bgub`!
* Tiu ĉi retejo aspektas rimarkinde pli bone post kiam mi ĝisdatigis la interfacon kun stilada helpo de v0. Kaj mi aldonis mojosan butonon „Klarigu kvazaŭ mi havus 5 jarojn“ por laŭfluaj, de AI generataj resumoj de afiŝoj!
* Dum la somero mi unuafoje pli longe uzis macOS. Ĝi plaĉis al mi malpli ol mi atendis (aŭtomata kaheligo estas multe pli malbona ol en Linux), do mi ankoraŭ ĉiutage uzas Linux sur mia persona komputilo. Mi uzis Omarchy dum kelkaj semajnoj, poste revenis al Fedora kun COSMIC Desktop, kiun mi [eble helpis inspiri](https://www.reddit.com/r/pop_os/comments/1empjaw/5_years_ago_i_suggested_that_system76_write_a/) (sed realisme verŝajne ne.)
* Pro tio, ke mi provis tiom da malsamaj operaciumaj opcioj, mi laciĝis agordi mian komputilon ree kaj ree, do mi lernis uzi Nix! Mi faris agordon kun home-manager por mia labora MacBook, kaj rilatan [publikan ŝablonon](https://github.com/bgub/nix-macos-starter). Mia aranĝo funkcias ankaŭ kun Linux-maŝinoj, sed mi ankoraŭ ne enmetis tiujn ŝanĝojn en la ŝablonon.
* Ĉe Vercel, mi verkis 7-ĉapitran lernilon pri tio, kiel konstrui React-kadron de nulo. Mi ankoraŭ ne publikigis ĝin, sed esperas fari tion baldaŭ!

Fine, jen kelkaj ĝisdatigoj el la lastaj semajnoj (teknike jam ne plu estas somero, sed mi estas tro laca por verki pliajn afiŝojn).

* Mi publikigis [ŝablonon por TS-bibliotekoj](2025-09-17-ts-base-typescript-library-template) kun modernaj iloj kiel release-please, Vitest, tsdown kaj Biome.
* Mi publikigis novan, nur-ESM-version de [eta](2025-09-17-introducing-eta-v4) uzante tiujn ilojn.
* Mi ĝisdatigis [eta.js.org](https://eta.js.org/) kaj [squirrelly.js.org](https://squirrelly.js.org/) por uzi FumaDocs anstataŭ Docusaurus, subteni pli bonan versiadministradon, ktp.