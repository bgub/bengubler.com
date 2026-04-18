---
title: "Enroot na Slurmu pro distribuované ML: 1. část"
description: Jak používat Enroot na Slurmu pro kontejnerizovaný trénink na více uzlech.
date: "2023-09-08T22:00:00+0000"
tags: [ml/ai]
---

*Toto je 1. část dvoudílné série. [2. část](./enroot-on-slurm-for-distributed-ml-part-2) je k dispozici zde.*

V laboratoři, kde pracuji, máme přístup k prostředí pro vysoce výkonné výpočty (HPC), které používá [Slurm Workload Manager](https://slurm.schedmd.com/documentation.html). Naše HPC běží na RHEL (Red Hat Enterprise Linux) 7 a běžní uživatelé mají výrazně omezená oprávnění. Nemáme přístup k `sudo` a z výpočetních uzlů se nemůžeme připojit k internetu.

Ve skutečnosti je instalace balíčků a aktualizace ovladačů přímo na výpočetním uzlu natolik obtížná, že distribuovaný trénink s moderním softwarem je neuvěřitelně komplikovaný. Naštěstí existuje řešení: kontejnerizace.

Pomocí Dockeru si na lokálním počítači vytvoříme image se všemi balíčky, které potřebujeme. Tu pak přeneseme do HPC a použijeme ke spuštění trénovacího skriptu.

## Krok 1: Sestavení Docker image lokálně

Už jsem psal o [Docker konfiguraci, kterou používám pro strojové učení](./ultimate-ml-dockerfile), takže to tu nebudu znovu rozebírat. Důležité je mít otagovaný Docker image s balíčky, které potřebujete ke spuštění trénovacího skriptu. Já používám Ubuntu 20.04 a CUDA 11.8.

## Krok 2: Sbalte image a přeneste ji

Nainstalujte [Enroot](https://github.com/NVIDIA/enroot) a pak spusťte následující příkaz, který převede váš Docker image do souboru squashfs:

```bash
enroot import dockerd://<image-name>
```

Tím se v aktuálním adresáři vytvoří soubor s názvem `<image-name>.sqsh`. Tento soubor přeneste na HPC pomocí `scp`.

## Krok 3: Načtení image v HPC

Připojte se k výpočetnímu uzlu pomocí `salloc --nodes=1 --gpus=8 --qos=<qos> --mem=2000G --time=72:00:00 --ntasks=1 --cpus-per-task=128`.

Nejprve je potřeba načíst modul Enroot:

```bash
module load jq zstd pigz parallel libnvidia-container enroot
```

Na HPC vytvořte image následujícím příkazem:

```bash
enroot create --name image-name /path/to/image-name.sqsh
```

Potom ho spusťte:

```bash
enroot start --mount /local/file/path:/image/file/path \
             --rw image-name bash
```

Tím se uvnitř kontejneru otevře interaktivní shell. Nezapomeňte na příznak `--rw`, který zpřístupní kořenový souborový systém pro zápis. Můžete přidat libovolný počet příznaků `--mount` a podle potřeby připojit soubory a adresáře z hostitelského stroje.

Pokud chcete předat proměnné prostředí, můžete použít příznak `--env` spolu s názvem proměnné prostředí na hostitelském stroji. Například `--env SLURM_NODEID` předá proměnnou prostředí `SLURM_NODEID`.