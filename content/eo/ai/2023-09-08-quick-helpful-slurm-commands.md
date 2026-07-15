---
title: Rapidaj kaj utilaj Slurm-komandoj
description: Rapida gvidilo por uzi Slurm por distribuita maŝinlernado.
date: "2023-09-08"
tags: [ml/ai]
---

En la laboratorio, kie mi laboras, ni havas aliron al alt-efikeca komputika medio (HPC), kiu uzas la [Slurm Workload Manager](https://slurm.schedmd.com/documentation.html).

Mi uzas ĝin jam de kelka tempo, kaj mi trovis kelkajn komandojn, kiujn mi uzas tre ofte. Mi pensis, ke mi dividu ilin ĉi tie, se ili utilos ankaŭ al aliaj.

## Kontroli la staton de tasko

```bash
# Vidi ĉiujn taskojn
squeue
# Kontroli la staton nur de viaj taskoj
squeue -u <username>
# Kontroli la staton de taskoj kun specifa QOS
squeue -q <QOS>
```

## Nuligo de taskoj

```bash
# Nuligu specifan taskon
scancel <job_id>
# Nuligu ĉiujn viajn taskojn
scancel -u <username>
```

## Interage peti nodon

```bash
# Petante ununuran nodon (ĉi tio malfermos ĝin interaktive en via terminalo)
# Kiam vi eliros la terminalon, la nodo estos realokita
salloc --nodes=1 --gpus=8 --qos=<QOS> --mem=2000G --time=72:00:00 --ntasks=1 --cpus-per-task=128
```

## Submeti taskon

Kio se ĉiuj viaj komputnodoj jam estas atribuitaj, aŭ vi ne volas, ke via tasko ĉesu tuj kiam la konekto al via terminalo fermiĝas? En tiu kazo, vi povas uzi `sbatch` por submeti taskon al la vico. Ĝi aŭtomate ruliĝos tuj kiam ĝi povos atribui la rimedojn.

Tio postulos iom pli da preparado. Supozu, ke la tasko, kiun ni efektive volas ruli, troviĝas en `myjob.sh`. Por submeti tiun skripton kiel taskon, ni unue kreos Bash-skripton, kiun Slurm rulos. Ni nomu ĝin `run.sh`:

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

Rimarku, ke ni uzas la prilaboran direktivon `#SBATCH` por transdoni la parametrojn, kiujn ni antaŭe estus transdonintaj al `salloc`. Ni ankaŭ uzas `srun` por ruli nian efektivan taskon; ĝi prizorgos la ruladon de la skripto sur pluraj nodoj, se ni tion deziras.

Fine, por lanĉi nian skripton, ni rulos:

```bash
sbatch run.sh
```

## Konkludo

Jen ĉio! Mi esperas, ke tio estis utila. Se vi havas demandojn, vi povas demandi ChatGPT-on aŭ Bard-on (ili donos aŭ nekredeble helpajn aŭ tute malĝustajn respondojn, sed indas provi!)

Vi ankaŭ povas trarigardi la [Slurm-dokumentadon](https://slurm.schedmd.com/documentation.html) aŭ la paĝon [Leo&#39;s notes](https://leo.leung.xyz/wiki/Slurm) pri Slurm por pliaj informoj.