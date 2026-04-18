---
title: "Enroot na Slurme pre distribuované ML: 1. časť"
description: Ako používať Enroot na Slurme na kontajnerizovaný tréning na viacerých uzloch.
date: "2023-09-08T22:00:00+0000"
tags: [ml/ai]
---

*Toto je 1. časť z 2-dielnej série. [2. časť](./enroot-on-slurm-for-distributed-ml-part-2) nájdete tu.*

V laboratóriu, kde pracujem, máme prístup k prostrediu vysokovýkonného počítania (HPC), ktoré používa [Slurm Workload Manager](https://slurm.schedmd.com/documentation.html). Naše HPC beží na RHEL (Red Hat Enterprise Linux) 7 a jednotliví používatelia majú výrazne obmedzené oprávnenia. Nemáme prístup k `sudo` a z výpočtových uzlov sa nemôžeme pripojiť na internet.

V skutočnosti je inštalácia balíkov a aktualizácia ovládačov priamo z výpočtového uzla natoľko náročná, že distribuovaný tréning s moderným softvérom je neuveriteľne komplikovaný. Našťastie existuje riešenie: kontajnerizácia.

Docker použijeme na vytvorenie obrazu na našom lokálnom počítači, ktorý bude obsahovať všetky balíky, ktoré potrebujeme. Potom tento obraz prenesieme do HPC a použijeme ho na spustenie nášho tréningového skriptu.

## Krok 1: Vytvorte Docker image lokálne

O [nastavení Dockeru, ktoré používam na strojové učenie](./ultimate-ml-dockerfile), som už písal, takže sa tu nebudem opakovať. Dôležité je, aby ste mali otagovaný Docker image s balíkmi, ktoré potrebujete na spustenie tréningového skriptu. Ja používam Ubuntu 20.04 a CUDA 11.8.

## Krok 2: Zbaľte a preneste obraz

Nainštalujte [Enroot](https://github.com/NVIDIA/enroot) a potom spustite nasledujúci príkaz, aby ste svoj Docker obraz premenili na súbor squashfs:

```bash
enroot import dockerd://<image-name>
```

Tým sa v aktuálnom adresári vytvorí súbor s názvom `<image-name>.sqsh`. Tento súbor preneste na HPC pomocou `scp`.

## Krok 3: Načítanie kontajnerového obrazu na HPC

Na výpočtový uzol sa prihláste pomocou `salloc --nodes=1 --gpus=8 --qos=<qos> --mem=2000G --time=72:00:00 --ntasks=1 --cpus-per-task=128`.

Najprv musíme načítať modul Enroot:

```bash
module load jq zstd pigz parallel libnvidia-container enroot
```

Na HPC vytvorte obraz pomocou nasledujúceho príkazu:

```bash
enroot create --name image-name /path/to/image-name.sqsh
```

Potom ho spustite:

```bash
enroot start --mount /local/file/path:/image/file/path \
             --rw image-name bash
```

Týmto sa vo vnútri kontajnera otvorí interaktívny shell. Nezabudnite na príznak `--rw`, ktorý nastaví koreňový súborový systém na zápis. Môžete pridať toľko príznakov `--mount`, koľko potrebujete, a pripojiť tak súbory a adresáre z hostiteľského stroja.

Ak chcete preniesť premenné prostredia, môžete použiť príznak `--env` spolu s názvom premennej prostredia na hostiteľskom stroji. Napríklad `--env SLURM_NODEID` prenesie premennú prostredia `SLURM_NODEID`.