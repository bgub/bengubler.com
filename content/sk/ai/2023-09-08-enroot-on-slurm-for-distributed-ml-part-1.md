---
title: "Enroot na Slurme pre distribuované ML: 1. časť"
description: Ako používať Enroot na Slurme na kontajnerizované trénovanie na viacerých uzloch.
date: "2023-09-08T22:00:00+0000"
tags: [ml/ai]
---

*Toto je 1. časť 2-dielnej série. [2. časť](./enroot-on-slurm-for-distributed-ml-part-2) nájdete tu.*

V laboratóriu, kde pracujem, máme prístup k prostrediu High Performance Computing (HPC), ktoré používa [Slurm Workload Manager](https://slurm.schedmd.com/documentation.html). Naše HPC beží na RHEL (Red Hat Enterprise Linux) 7 a jednotliví používatelia majú výrazne obmedzené oprávnenia. Nemáme prístup k `sudo` a z výpočtových uzlov sa nevieme dostať na internet.

V skutočnosti je inštalácia balíkov a aktualizácia ovládačov priamo z výpočtového uzla natoľko náročná, že distribuované trénovanie pomocou moderného softvéru je mimoriadne komplikované. Našťastie existuje riešenie: kontajnerizácia.

Pomocou Dockeru vytvoríme na lokálnom počítači obraz, ktorý bude obsahovať všetky balíky, ktoré potrebujeme. Potom môžeme tento obraz preniesť na HPC a použiť ho na spustenie nášho tréningového skriptu.

## Krok 1: Lokálne vytvorte Docker obraz

O [nastavení Dockeru, ktoré používam na strojové učenie](./ultimate-ml-dockerfile), som už písal, takže sa tu nebudem opakovať. Dôležité je, aby ste mali otagovaný Docker obraz s balíkmi, ktoré potrebujete na spustenie tréningového skriptu. Ja používam Ubuntu 20.04 a CUDA 11.8.

## Krok 2: Skonvertujte a preneste obraz

Nainštalujte [Enroot](https://github.com/NVIDIA/enroot) a potom spustite nasledujúci príkaz, aby ste z Docker obrazu vytvorili súbor squashfs:

```bash
enroot import dockerd://<image-name>
```

Týmto sa v aktuálnom adresári vytvorí súbor s názvom `<image-name>.sqsh`. Preneste tento súbor na HPC pomocou `scp`.

## Krok 3: Načítanie obrazu v HPC

Do výpočtového uzla vstúpte pomocou `salloc --nodes=1 --gpus=8 --qos=<qos> --mem=2000G --time=72:00:00 --ntasks=1 --cpus-per-task=128`.

Najprv musíme načítať modul Enroot:

```bash
module load jq zstd pigz parallel libnvidia-container enroot
```

V prostredí HPC vytvorte obraz pomocou nasledujúceho príkazu:

```bash
enroot create --name image-name /path/to/image-name.sqsh
```

Potom ho spustite:

```bash
enroot start --mount /local/file/path:/image/file/path \
             --rw image-name bash
```

Týmto sa otvorí interaktívny shell vo vnútri kontajnera. Nezabudnite na príznak `--rw`, ktorý sprístupní koreňový súborový systém na zápis. Môžete pridať toľko príznakov `--mount`, koľko potrebujete, aby ste pripojili súbory a adresáre z hostiteľského počítača.

Ak chcete odovzdať premenné prostredia, môžete použiť príznak `--env` spolu s názvom premennej prostredia na hostiteľskom počítači. Napríklad `--env SLURM_NODEID` odovzdá premennú prostredia `SLURM_NODEID`.