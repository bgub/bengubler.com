---
title: "Představuji gom: monitorování GPU napříč kontejnery"
description: Publikoval jsem `gom`, CLI nástroj pro monitorování využití GPU napříč kontejnery Dockeru.
date: "2023-10-16"
tags: [ml/ai, open-source]
---

## Stručně

`gom` znamená GPU Output Monitor. Je to balíček pro pip, který poskytuje CLI pro monitorování využití GPU. Představte si ho jako `nvidia-smi`, jen rychlejší a minimalističtější. A navíc má jednu bonusovou funkci: **v prostředích, kde kontejnery Dockeru používají GPU, rozepíše využití podle jednotlivých kontejnerů**! (Nebojte, funguje i v prostředích bez Dockeru, a dokonce i uvnitř kontejnerů Dockeru.)

*Za inspiraci k tomuto projektu vděčím svému kolegovi [Vinovi](https://howe.vin/). Pomocí GPT-4 vytvořil první prototyp v Bashi, ale kvůli chybám a problémům s výkonem jsem ho musel přepsat úplně od nuly.*

## Pokyny

1. Spusťte `pip3 install gom`
2. Podle verze CUDA nainstalujte správnou verzi `pynvml`
3. Spusťte `gom show` (pro jednorázové zobrazení využití) nebo `gom watch` (pro sledování využití, aktualizuje se zhruba každou sekundu)

## Porovnání `gom` a `nvidia-smi`

Myslím, že výsledky mluví samy za sebe :). Tento první snímek obrazovky ukazuje výsledek spuštění `gom watch`. Je vidět, že čtyři různé kontejnery Dockeru — `r0`, `r1`, `r2` a `r3` — všechny poměrně intenzivně využívají GPU. Je tam také mírné využití všech GPU, které nepochází z žádného kontejneru.

![výstup příkazu gom watch](/blog-images/gom-watch.png)

Tento druhý snímek obrazovky ukazuje výsledek spuštění `nvidia-smi`. Je složitý a zbytečně rozvláčný. Na větší ploše než `gom` zvládne zobrazit informace jen o 8 GPU!

![výstup příkazu nvidia-smi](/blog-images/nvidia-smi.png)

## Závěr

Vytvořil jsem `gom`, protože jsem chtěl sledovat využití GPU v různých kontejnerech Dockeru. Používám ho často při úlohách strojového učení, protože je rychlý a jeho výstup se vejde i do malého terminálu. Doufám, že bude užitečný i pro vás. Pokud máte nějaké návrhy, klidně otevřete issue v [repozitáři na GitHubu](https://github.com/bgub/gom).