---
title: Rýchle a užitočné príkazy Slurm
description: Stručný sprievodca používaním Slurm na distribuované strojové učenie.
date: "2023-09-08"
tags: [ml/ai]
---

V laboratóriu, kde pracujem, máme prístup k prostrediu High Performance Computing (HPC), ktoré používa [Slurm Workload Manager](https://slurm.schedmd.com/documentation.html).

Používam ho už nejaký čas a našiel som niekoľko príkazov, ktoré používam stále. Povedal som si, že sa o ne tu podelím pre prípad, že by sa mohli hodiť aj niekomu ďalšiemu.

## Kontrola stavu úlohy

```bash
# Zobraziť všetky úlohy
squeue
# Skontrolovať stav iba vašich úloh
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

Čo ak sú už všetky vaše výpočtové uzly pridelené alebo nechcete, aby sa vaša úloha ukončila hneď po zatvorení terminálu? V takom prípade môžete pomocou `sbatch` odoslať úlohu do fronty. Automaticky sa spustí, hneď ako budú k dispozícii potrebné prostriedky.

Bude to vyžadovať o niečo viac prípravy. Predpokladajme, že úloha, ktorú chceme skutočne spustiť, je v `myjob.sh`. Aby sme tento skript odoslali ako úlohu, najprv vytvoríme Bash skript, ktorý spustí Slurm. Nazvime ho `run.sh`:

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

Všimnite si, že používame direktívu `#SBATCH` na odovzdanie parametrov, ktoré by sme predtým zadali príkazu `salloc`. Taktiež používame `srun` na spustenie samotnej úlohy; ak budeme chcieť, postará sa aj o spustenie skriptu na viacerých uzloch.

Nakoniec náš skript spustíme takto:

```bash
sbatch run.sh
```

## Záver

To je všetko! Dúfam, že vám to pomohlo. Ak máte nejaké otázky, môžete sa opýtať ChatGPT alebo Barda (dostanete od nich buď neuveriteľne užitočné, alebo úplne nesprávne odpovede, ale za pokus to stojí!)

Viac informácií nájdete aj v [dokumentácii Slurm](https://slurm.schedmd.com/documentation.html) alebo na stránke [Leo&#39;s notes](https://leo.leung.xyz/wiki/Slurm) o Slurme.