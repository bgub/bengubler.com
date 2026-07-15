---
title: Rapidaj kaj utilaj Slurm-komandoj
description: Rapida gvidilo pri uzado de Slurm por distribuita maŝinlernado.
date: "2023-09-08"
tags: [ml/ai]
---

En la laboratorio, kie mi laboras, ni havas aliron al medio por alt-efika komputado (HPC), kiu uzas la [Slurm Workload Manager](https://slurm.schedmd.com/documentation.html).

Mi uzas ĝin jam de iom da tempo, kaj mi trovis kelkajn komandojn, kiujn mi uzas ree kaj ree. Mi pensis dividi ilin ĉi tie, se ili utilus ankaŭ al aliaj.

## Kontroli la staton de taskoj

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

## Peti nodon interage

```bash
# Petado de unu nodo (ĉi tio malfermos ĝin interaktive en via terminalo)
# Kiam vi eliros la terminalon, la nodo estos realokita
salloc --nodes=1 --gpus=8 --qos=<QOS> --mem=2000G --time=72:00:00 --ntasks=1 --cpus-per-task=128
```

## Sendi taskon

Kio okazas, se ĉiuj viaj komputaj nodoj jam estas asignitaj, aŭ se vi ne volas, ke via tasko finiĝu tuj kiam la konekto al via terminalo ĉesas? En tia okazo, vi povas uzi `sbatch` por sendi taskon al la atendovico. Ĝi aŭtomate ruliĝos tuj kiam la necesaj rimedoj estos disponeblaj.

Tio postulos iom pli da agordado. Supozu, ke la tasko, kiun ni efektive volas ruli, troviĝas en `myjob.sh`. Por sendi tiun skripton kiel taskon, ni unue kreos Bash-skripton, kiun Slurm rulos. Ni nomu ĝin `run.sh`:

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

Rimarku, ke ni uzas la direktivon `#SBATCH` por transdoni la parametrojn, kiujn ni antaŭe estus transdonintaj al `salloc`. Ni ankaŭ uzas `srun` por ruli nian efektivan taskon; ĝi zorgos pri la rulado de la skripto sur pluraj nodoj, se ni tion deziros.

Fine, por lanĉi nian skripton, ni rulos:

```bash
sbatch run.sh
```

## Konkludo

Jen ĉio! Mi esperas, ke tio helpis. Se vi havas demandojn, vi povas demandi ChatGPT-on aŭ Bard-on (ili donos aŭ nekredeble helpajn aŭ tute malĝustajn respondojn, sed indas provi!)

Vi ankaŭ povas konsulti la [Slurm-dokumentadon](https://slurm.schedmd.com/documentation.html) aŭ la paĝon [Notoj de Leo](https://leo.leung.xyz/wiki/Slurm) pri Slurm por pliaj informoj.