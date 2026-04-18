---
title: Rýchle a užitočné príkazy pre Slurm
description: Stručný sprievodca používaním Slurmu na distribuované strojové učenie.
date: "2023-09-08"
tags: [ml/ai]
---

V laboratóriu, kde pracujem, máme prístup k prostrediu High Performance Computing (HPC), ktoré používa [Slurm Workload Manager](https://slurm.schedmd.com/documentation.html).

Používam ho už nejaký čas a vybral som pár príkazov, ktoré používam stále. Napadlo mi, že sa o ne tu podelím, ak by sa zišli aj niekomu ďalšiemu.

## Kontrola stavu úlohy

```bash
# Zobraziť všetky úlohy
squeue
# Skontrolovať stav iba svojich úloh
squeue -u <username>
# Skontrolovať stav úloh s konkrétnym QOS
squeue -q <QOS>
```

## Zrušenie úloh

```bash
# Zruš konkrétnu úlohu
scancel <job_id>
# Zruš všetky svoje úlohy
scancel -u <username>
```

## Vyžiadanie uzla v interaktívnom režime

```bash
# Vyžiadanie jedného uzla (otvorí sa interaktívne vo vašom termináli)
# Po ukončení terminálu bude uzol uvoľnený
salloc --nodes=1 --gpus=8 --qos=<QOS> --mem=2000G --time=72:00:00 --ntasks=1 --cpus-per-task=128
```

## Odoslanie úlohy

Čo ak sú všetky vaše výpočtové uzly obsadené alebo nechcete, aby sa úloha ukončila hneď po zatvorení terminálu? V takom prípade môžete pomocou `sbatch` odoslať úlohu do frontu. Spustí sa automaticky, hneď ako sa pre ňu podarí prideliť potrebné zdroje.

Toto si bude vyžadovať o niečo viac prípravy. Predpokladajme, že úloha, ktorú chceme v skutočnosti spustiť, je v `myjob.sh`. Aby sme tento skript odoslali ako úlohu, najprv vytvoríme Bash skript, ktorý potom spustí Slurm. Nazvime ho `run.sh`:

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

Všimnite si, že používame direktívu `#SBATCH` na odovzdanie parametrov, ktoré by sme predtým zadali príkazu `salloc`. Na spustenie samotnej úlohy používame aj `srun`; ak budeme chcieť, postará sa aj o spustenie skriptu na viacerých uzloch.

Nakoniec náš skript spustíme takto:

```bash
sbatch run.sh
```

## Záver

To je všetko! Dúfam, že to bolo užitočné. Ak máte nejaké otázky, môžete sa opýtať ChatGPT alebo Barda (buď vám dajú neuveriteľne užitočné odpovede, alebo budú úplne mimo, ale za pokus to stojí!)

Viac informácií nájdete aj v [dokumentácii Slurmu](https://slurm.schedmd.com/documentation.html) alebo na stránke [Leove poznámky](https://leo.leung.xyz/wiki/Slurm) o Slurme.