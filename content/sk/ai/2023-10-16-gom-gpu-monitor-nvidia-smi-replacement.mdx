---
title: "Predstavujem gom: monitorovanie GPU naprieč Docker kontajnermi"
description: Publikoval som `gom`, nástroj príkazového riadka na monitorovanie využitia GPU naprieč Docker kontajnermi.
date: "2023-10-16"
tags: [ml/ai, open-source]
---

## V skratke

`gom` znamená GPU Output Monitor. Je to balík pre pip, ktorý poskytuje CLI na monitorovanie využitia GPU. Predstavte si ho ako `nvidia-smi`, ale rýchlejší a minimalistickejší. A má aj bonusovú funkciu: **v prostrediach, kde Docker kontajnery používajú GPU, rozdelí využitie podľa jednotlivých kontajnerov**! (Bez obáv, funguje aj v prostrediach bez Dockeru a dokonca aj v Docker kontajneroch.)

*Za inšpiráciu pre tento projekt vďačím svojmu kolegovi [Vin](https://howe.vin/). Pomocou GPT-4 vytvoril úvodný prototyp v Bashi, ale pre chyby a problémy s výkonom som ho musel prepísať úplne od začiatku.*

## Pokyny

1. Spustite `pip3 install gom`
2. V závislosti od verzie CUDA nainštalujte správnu verziu `pynvml`
3. Spustite `gom show` (na jednorazové zobrazenie využitia) alebo `gom watch` (na sledovanie využitia s aktualizáciou približne každú sekundu)

## Porovnanie `gom` a `nvidia-smi`

Myslím, že výsledky hovoria samy za seba :). Táto prvá snímka obrazovky je výsledkom spustenia `gom watch`. Vidno na nej, že štyri rôzne Docker kontajnery — `r0`, `r1`, `r2` a `r3` — každý pomerne intenzívne využívajú GPU. Vidno aj mierne využitie všetkých GPU, ktoré nepochádza zo žiadneho kontajnera.

![výstup po spustení príkazu gom watch](/blog-images/gom-watch.png)

Táto druhá snímka obrazovky je výsledkom spustenia `nvidia-smi`. Je zložitá a zbytočne rozvláčna. Na väčšej ploche než `gom` dokáže zobraziť informácie len o 8 GPU!

![výstup po spustení príkazu nvidia-smi](/blog-images/nvidia-smi.png)

## Záver

Vytvoril som `gom`, pretože som chcel sledovať využitie GPU v rôznych Docker kontajneroch. Často ho používam pri ML úlohách, pretože je rýchly a jeho výstup sa zmestí aj do malého terminálu. Dúfam, že bude užitočný aj pre vás. Ak máte návrhy, pokojne otvorte issue v [repozitári na GitHube](https://github.com/bgub/gom).