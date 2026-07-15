---
title: "Enroot na Slurmu pro distribuované ML: 1. část"
description: Jak používat Enroot na Slurmu pro kontejnerizované trénování na více uzlech.
date: "2023-09-08T22:00:00+0000"
tags: [ml/ai]
---

*Toto je 1. část dvoudílné série. [2. část](./enroot-on-slurm-for-distributed-ml-part-2) najdete zde.*

V laboratoři, kde pracuji, máme přístup k prostředí pro vysoce výkonné výpočty (HPC), které používá [Slurm Workload Manager](https://slurm.schedmd.com/documentation.html). Naše HPC prostředí běží na RHEL (Red Hat Enterprise Linux) 7 a jednotliví uživatelé mají výrazně omezená oprávnění. Nemáme přístup k `sudo` a z výpočetních uzlů se nemůžeme připojit k internetu.

Ve skutečnosti je instalace balíčků a aktualizace ovladačů přímo na výpočetním uzlu natolik obtížná, že distribuované trénování s moderním softwarem je zbytečně složité. Naštěstí existuje řešení: kontejnerizace.

Pomocí Dockeru si na lokálním počítači sestavíme obraz, který bude obsahovat všechny potřebné balíčky. Pak můžeme tento obraz přenést do HPC a použít ho ke spuštění našeho trénovacího skriptu.

## Krok 1: Sestavte Docker obraz lokálně

Už jsem psal o [nastavení Dockeru, které používám pro machine learning](./ultimate-ml-dockerfile), takže se tu nebudu opakovat. Důležité je, abyste měli Docker obraz označený tagem a s balíčky, které potřebujete ke spuštění svého trénovacího skriptu. Já používám Ubuntu 20.04 a CUDA 11.8.

## Krok 2: Vytvoření squashfs a přenos obrazu

Nainstalujte [Enroot](https://github.com/NVIDIA/enroot) a potom spusťte následující příkaz, který z vašeho Docker obrazu vytvoří soubor squashfs:

```bash
enroot import dockerd://<image-name>
```

Tím se v aktuálním adresáři vytvoří soubor s názvem `<image-name>.sqsh`. Zkopírujte tento soubor na HPC pomocí `scp`.

## Krok 3: Načtení obrazu v HPC

Přihlaste se na výpočetní uzel pomocí `salloc --nodes=1 --gpus=8 --qos=<qos> --mem=2000G --time=72:00:00 --ntasks=1 --cpus-per-task=128`.

Nejprve musíme načíst modul Enroot:

```bash
module load jq zstd pigz parallel libnvidia-container enroot
```

Na HPC vytvořte obraz pomocí tohoto příkazu:

```bash
enroot create --name image-name /path/to/image-name.sqsh
```

Pak ho spusťte:

```bash
enroot start --mount /local/file/path:/image/file/path \
             --rw image-name bash
```

Tím se uvnitř kontejneru otevře interaktivní shell. Nezapomeňte na příznak `--rw`, který nastaví kořenový souborový systém jako zapisovatelný. Můžete přidat tolik příznaků `--mount`, kolik potřebujete, abyste připojili soubory a adresáře z hostitelského počítače.

Pokud chcete předat proměnné prostředí, můžete použít příznak `--env` spolu s názvem proměnné prostředí na hostitelském počítači. Například `--env SLURM_NODEID` předá proměnnou prostředí `SLURM_NODEID`.