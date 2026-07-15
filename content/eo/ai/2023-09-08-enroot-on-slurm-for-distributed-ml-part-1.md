---
title: "Enroot sur Slurm por distribuita ML: Parto 1"
description: Kiel uzi Enroot sur Slurm por kontenerigita plurnoda trejnado.
date: "2023-09-08T22:00:00+0000"
tags: [ml/ai]
---

*Ĉi tiu estas la unua parto de duparta serio. [Parto 2](./enroot-on-slurm-for-distributed-ml-part-2) estas disponebla ĉi tie.*

En la laboratorio, kie mi laboras, ni havas aliron al medio de High Performance Computing (HPC), kiu uzas [Slurm Workload Manager](https://slurm.schedmd.com/documentation.html). Nia HPC funkcias per RHEL (Red Hat Enterprise Linux) 7, kaj individuaj uzantoj havas tre limigitajn permesojn. Ni ne havas aliron al `sudo` kaj ne povas aliri la interreton el la komputaj nodoj.

Efektive, la procezo instali pakaĵojn kaj ĝisdatigi pelilojn rekte en komputa nodo estas tiel malfacila, ke ĝi faras distribuitan trejnadon per moderna programaro nekredeble komplika. Feliĉe, ekzistas solvo: kontenerigo.

Ni uzos Docker por konstrui bildon sur nia loka maŝino, kiu enhavos ĉiujn pakaĵojn, kiujn ni bezonas. Poste ni povos transigi tiun bildon al la HPC kaj uzi ĝin por ruli nian trejnan skripton.

## Paŝo 1: Loke konstrui Docker-bildon

Mi jam skribis pri [la Docker-agordo, kiun mi uzas por maŝinlernado](./ultimate-ml-dockerfile), do mi ne ripetos tion ĉi tie. La grava afero estas, ke vi havu Docker-bildon kun etikedo kaj kun la pakaĵoj, kiujn vi bezonas por ruli vian trejnan skripton. La mia baziĝas sur Ubuntu 20.04 kaj CUDA 11.8.

## Paŝo 2: Kunpremu kaj transigu la bildon

Instalu [Enroot](https://github.com/NVIDIA/enroot), poste rulu la jenan komandon por konverti vian Docker-bildon al squashfs-dosiero:

```bash
enroot import dockerd://<image-name>
```

Tio kreos dosieron nomatan `<image-name>.sqsh` en via nuna dosierujo. Kopiu ĉi tiun dosieron al la HPC per `scp`.

## Paŝo 3: Ŝargi la konteneran bildon en la HPC

Eniru komputan nodon per `salloc --nodes=1 --gpus=8 --qos=<qos> --mem=2000G --time=72:00:00 --ntasks=1 --cpus-per-task=128`.

Unue ni devas ŝargi la modulon Enroot:

```bash
module load jq zstd pigz parallel libnvidia-container enroot
```

En la HPC-sistemo, kreu la bildon per la jena komando:

```bash
enroot create --name image-name /path/to/image-name.sqsh
```

Poste rulu ĝin:

```bash
enroot start --mount /local/file/path:/image/file/path \
             --rw image-name bash
```

Tio malfermos interagan ŝelon en la ujo. Ne forgesu la flagon `--rw`, kiu ebligas skribi al la radika dosiersistemo. Vi povas aldoni tiom da flagoj `--mount`, kiom vi bezonas por munti dosierojn kaj dosierujojn el la gastiga maŝino.

Se vi volas plusendi mediovariablojn, vi povas uzi la flagon `--env` kune kun la nomo de la mediovariablo en la gastiga maŝino. Ekzemple, `--env SLURM_NODEID` plusendos la mediovariablon `SLURM_NODEID`.