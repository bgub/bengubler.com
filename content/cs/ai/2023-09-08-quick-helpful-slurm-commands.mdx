---
title: Rychlé a užitečné příkazy pro Slurm
description: Stručný průvodce používáním Slurmu pro distribuované strojové učení.
date: "2023-09-08"
tags: [ml/ai]
---

V laboratoři, kde pracuji, máme přístup k prostředí pro vysoce výkonné výpočty (HPC), které používá [Slurm Workload Manager](https://slurm.schedmd.com/documentation.html).

Už nějakou dobu ho používám a časem jsem si našel několik příkazů, které používám pořád dokola. Řekl jsem si, že se o ně tady podělím, kdyby se hodily i někomu dalšímu.

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
# Po ukončení terminálu bude uzel uvolněn zpět do fondu
salloc --nodes=1 --gpus=8 --qos=<QOS> --mem=2000G --time=72:00:00 --ntasks=1 --cpus-per-task=128
```

## Odeslání úlohy

Co když už jsou všechny vaše výpočetní uzly přidělené nebo nechcete, aby se úloha ukončila hned po zavření terminálu? V takovém případě můžete pomocí `sbatch` odeslat úlohu do fronty. Automaticky se spustí, jakmile pro ni budou k dispozici potřebné prostředky.

To vyžaduje o něco víc přípravy. Předpokládejme, že úloha, kterou chceme skutečně spustit, je v `myjob.sh`. Abychom tento skript odeslali jako úlohu, nejprve vytvoříme bashový skript, který spustí Slurm. Říkejme mu `run.sh`:

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

Všimněte si, že používáme direktivu `#SBATCH` k předání parametrů, které bychom dříve zadali pomocí `salloc`. Také používáme `srun` ke spuštění samotné úlohy; pokud budeme chtít, postará se o spuštění skriptu na více uzlech.

Nakonec skript spustíme takto:

```bash
sbatch run.sh
```

## Závěr

To je vše! Doufám, že to bylo užitečné. Pokud máte nějaké otázky, můžete se zeptat ChatGPT nebo Barda (dají vám buď neuvěřitelně užitečné, nebo úplně chybné odpovědi, ale za pokus to stojí!)

Další informace najdete také v [dokumentaci ke Slurmu](https://slurm.schedmd.com/documentation.html) nebo na stránce [Leo&#39;s notes](https://leo.leung.xyz/wiki/Slurm) o Slurmu.