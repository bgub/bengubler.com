---
title: Rychlé a užitečné příkazy pro Slurm
description: Stručný průvodce používáním Slurmu pro distribuované strojové učení.
date: "2023-09-08"
tags: [ml/ai]
---

V laboratoři, kde pracuji, máme přístup k prostředí pro vysoce výkonné výpočty (HPC), které používá [Slurm Workload Manager](https://slurm.schedmd.com/documentation.html).

Používám ho už nějakou dobu a narazil jsem na několik příkazů, které používám pořád. Řekl jsem si, že se o ně tady podělím, kdyby se náhodou hodily i někomu dalšímu.

## Kontrola stavu úlohy

```bash
# Zobrazit všechny úlohy
squeue
# Zkontrolovat stav pouze vašich úloh
squeue -u <username>
# Zkontrolovat stav úloh s konkrétním QOS
squeue -q <QOS>
```

## Rušení úloh

```bash
# Zrušit konkrétní úlohu
scancel <job_id>
# Zrušit všechny vaše úlohy
scancel -u <username>
```

## Vyžádání uzlu v interaktivním režimu

```bash
# Vyžádání jednoho uzlu (tím se terminál otevře v interaktivním režimu)
# Po ukončení terminálu bude uzel znovu přidělen
salloc --nodes=1 --gpus=8 --qos=<QOS> --mem=2000G --time=72:00:00 --ntasks=1 --cpus-per-task=128
```

## Odeslání úlohy

Co když jsou všechny vaše výpočetní uzly obsazené nebo nechcete, aby se vaše úloha ukončila hned po zavření terminálu? V takovém případě můžete pomocí `sbatch` odeslat úlohu do fronty. Automaticky se spustí, jakmile pro ni bude možné přidělit prostředky.

To bude vyžadovat trochu víc přípravy. Předpokládejme, že úloha, kterou skutečně chceme spustit, je v `myjob.sh`. Abychom tento skript mohli odeslat jako úlohu, nejprve vytvoříme Bash skript, který spustí Slurm. Nazvěme ho `run.sh`:

```bash
#!/bin/bash
#SBATCH -J "JOBNAME"
#SBATCH --nodes=1
#SBATCH --gpus-per-node=8
#SBATCH --cpus-per-task=128
#SBATCH --mem=2000G
#SBATCH --time=72:00:00
#SBATCH --qos=<QOS>

srun --nodes=1 myjob.sh
```

Všimněte si, že používáme direktivu `#SBATCH`, pomocí které předáváme parametry, jež bychom dříve předali `salloc`. K spuštění samotné úlohy pak používáme `srun`; ten se postará o spuštění skriptu napříč více uzly, pokud to budeme chtít.

Nakonec skript spustíme takto:

```bash
sbatch run.sh
```

## Závěr

To je vše! Doufám, že to pro vás bylo užitečné. Pokud máte nějaké otázky, můžete se zeptat ChatGPT nebo Barda (dají vám buď neuvěřitelně užitečné, nebo úplně nesprávné odpovědi, ale za pokus to stojí!)

Další informace najdete také v [dokumentaci Slurmu](https://slurm.schedmd.com/documentation.html) nebo na stránce [Leo&#39;s notes](https://leo.leung.xyz/wiki/Slurm) o Slurmu.