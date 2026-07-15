---
title: "Predstavujem gom: monitorovanie GPU naprieč Docker kontajnermi"
description: Zverejnil som `gom`, CLI nástroj na monitorovanie využitia GPU naprieč Docker kontajnermi.
date: "2023-10-16"
tags: [ml/ai, open-source]
---

## V skratke

`gom` znamená GPU Output Monitor. Je to pip balík, ktorý poskytuje CLI na monitorovanie využitia GPU. Predstavte si ho ako `nvidia-smi`, len rýchlejší a minimalistickejší. A má aj bonusovú funkciu: **v prostrediach, kde Docker kontajnery používajú GPU, rozdelí využitie podľa jednotlivých kontajnerov**! (Nebojte sa, funguje aj v prostrediach bez Dockeru a dokonca aj vo vnútri Docker kontajnerov.)

*Za inšpiráciu k tomuto projektu vďačím svojmu kolegovi [Vin](https://howe.vin/). Pomocou GPT-4 vytvoril počiatočný prototyp v Bashi, ale kvôli chybám a problémom s výkonom som ho musel prepísať od základov.*

## Pokyny

1. Spustite `pip3 install gom`
2. V závislosti od verzie CUDA nainštalujte správnu verziu `pynvml`
3. Spustite `gom show` (na jednorazové zobrazenie využitia) alebo `gom watch` (na sledovanie využitia, aktualizované približne každú sekundu)

## Porovnanie `gom` a `nvidia-smi`

Myslím si, že výsledky hovoria samy za seba :). Tento prvý snímok obrazovky je výsledkom spustenia `gom watch`. Vidno na ňom, že štyri rôzne Docker kontajnery — `r0`, `r1`, `r2` a `r3` — každý z nich dosť intenzívne využíva GPU. Vidno aj mierne využitie všetkých GPU, ktoré nepochádza zo žiadneho kontajnera.

![výstup príkazu gom watch](/blog-images/gom-watch.png)

Tento druhý snímok obrazovky je výsledkom spustenia `nvidia-smi`. Je zložitý a zbytočne rozvláčny. Na väčšom priestore než `gom` dokáže zobraziť informácie len o 8 GPU!

![výstup príkazu nvidia-smi](/blog-images/nvidia-smi.png)

## Záver

Vytvoril som `gom`, pretože som chcel sledovať využitie GPU v rôznych Docker kontajneroch. Často ho používam pri ML úlohách, pretože je rýchly a jeho výstup sa zmestí aj do malého terminálu. Dúfam, že bude užitočný aj pre vás. Ak máte návrhy, pokojne otvorte issue v [repozitári na GitHube](https://github.com/bgub/gom).