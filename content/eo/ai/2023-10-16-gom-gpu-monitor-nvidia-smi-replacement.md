---
title: "Prezentante gom: GPU-monitorado inter konteneroj"
description: Mi publikigis `gom`, CLI-ilon por monitorado de GPU-uzado inter Docker-konteneroj.
date: "2023-10-16"
tags: [ml/ai, open-source]
---

## Mallonge

`gom` signifas GPU Output Monitor. Ĝi estas pip-pakaĵo, kiu provizas CLI-on por monitorado de GPU-uzado. Pensu pri ĝi kiel pri `nvidia-smi`, sed pli rapida kaj pli simpla. Kaj ĝi havas kroman avantaĝon: **en medioj, kie Docker-konteneroj uzas GPU-ojn, ĝi montros la uzadon laŭ kontenero**! (Ne zorgu, ĝi funkcias ankaŭ en medioj sen Docker kaj eĉ interne de Docker-konteneroj.)

*Mi ŝuldas al mia kolego [Vin](https://howe.vin/) la inspiron por ĉi tiu projekto. Li uzis GPT-4 por krei komencan prototipon en Bash, sed mi devis reskribi ĝin tute de nulo pro cimoj kaj rendimentaj problemoj.*

## Instrukcioj

1. Rulu `pip3 install gom`
2. Laŭ via CUDA-versio, instalu la ĝustan version de `pynvml`
3. Rulu `gom show` (por montri la uzadon unufoje) aŭ `gom watch` (por monitorado de la uzado kun ĝisdatigo proksimume ĉiun sekundon))

## Komparo de `gom` kaj `nvidia-smi`

Mi pensas, ke la rezultoj parolas por si mem :). Ĉi tiu unua ekrankopio estas la rezulto de lanĉo de `gom watch`. Vi povas vidi, ke kvar malsamaj Docker-konteneroj, `r0`, `r1`, `r2` kaj `r3`, ĉiu sufiĉe intense uzas GPU-on. Estas ankaŭ iometa uzado de ĉiuj GPU-oj, kiu ne venas de iu ajn ujo.

![eligo de lanĉo de la komando gom watch](/blog-images/gom-watch.png)

Ĉi tiu dua ekrankopio estas la rezulto de lanĉo de `nvidia-smi`. Ĝi estas komplika kaj nenecese detalema. En pli da spaco ol `gom`, ĝi sukcesas montri informojn nur pri 8 GPU-oj!

![eligo de lanĉo de la komando nvidia-smi](/blog-images/nvidia-smi.png)

## Konkludo

Mi kreis `gom`, ĉar mi volis fari monitoradon de GPU-uzado en malsamaj Docker-konteneroj. Mi ofte uzas ĝin por ML-taskoj, ĉar ĝi estas rapida kaj la eligo bone konvenas al malgranda terminalo. Mi esperas, ke ĝi utilos al vi. Se vi havas sugestojn, bonvolu malfermi issue-on en la [GitHub repo](https://github.com/bgub/gom).