---
title: "Enkonduko al gom: GPU-monitorado tra Docker-konteneroj"
description: Mi publikigis `gom`, CLI-ilon por monitori GPU-uzon tra Docker-konteneroj.
date: "2023-10-16"
tags: [ml/ai, open-source]
---

## Mallonge

`gom` signifas GPU Output Monitor. Ĝi estas `pip`-pakaĵo, kiu provizas CLI-on por monitori GPU-uzadon. Pensu pri ĝi kiel pri `nvidia-smi`, sed pli rapida kaj pli minimumisma. Kaj ĝi havas kroman avantaĝon: **en medioj, kie Docker-konteneroj uzas GPU-ojn, ĝi disigos la uzadon laŭ konteneroj**! (Ne zorgu, ĝi funkcias ankaŭ en medioj sen Docker kaj eĉ interne de Docker-konteneroj.)

*Mi dankŝuldas al mia kolego [Vin](https://howe.vin/) la inspiron por ĉi tiu projekto. Li uzis GPT-4 por krei komencan prototipon en Bash, sed mi devis reverki ĝin de nulo pro cimoj kaj rendimentaj problemoj.*

## Instrukcioj

1. Rulu `pip3 install gom`
2. Laŭ via CUDA-versio, instalu la ĝustan version de `pynvml`
3. Rulu `gom show` (por montri la uzadon unufoje) aŭ `gom watch` (por observi la uzadon, ĝisdatigatan proksimume ĉiun sekundon)

## Komparo de `gom` kaj `nvidia-smi`

Mi pensas, ke la rezultoj parolas por si mem :). Ĉi tiu unua ekrankopio montras la rezulton de `gom watch`. Vi povas vidi, ke kvar malsamaj Docker-konteneroj, `r0`, `r1`, `r2` kaj `r3`, ĉiu sufiĉe intense uzas GPU-on. Estas ankaŭ eta uzo de ĉiuj GPU-oj, kiu ne venas de iu ajn ujo.

![eligo de la komando gom watch](/blog-images/gom-watch.png)

Ĉi tiu dua ekrankopio montras la rezulton de `nvidia-smi`. Ĝi estas kompleksa kaj nenecese vortoriĉa. Kvankam ĝi okupas pli da spaco ol `gom`, ĝi sukcesas montri informojn nur pri 8 GPU-oj!

![eligo de la komando nvidia-smi](/blog-images/nvidia-smi.png)

## Konkludo

Mi kreis `gom`, ĉar mi volis monitori GPU-uzadon en diversaj Docker-konteneroj. Mi ofte uzas ĝin, kiam mi faras ML-taskojn, ĉar ĝi estas rapida kaj la eligo bone taŭgas por malgranda terminalo. Mi esperas, ke ĝi utilos al vi. Se vi havas sugestojn, bonvolu malfermi issue-n en la [GitHub repo](https://github.com/bgub/gom).