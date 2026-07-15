---
title: "Enroot en Slurm por distribuita ML: Parto 2"
description: Kiel uzi Enroot en Slurm por kontenerigita plurnoda trejnado.
date: "2023-09-11"
tags: [ml/ai]
---

*ĜISDATIGO 2024: Mi ne plu rekomendas ĉi tiun metodon, kaj mi spertis plurajn problemojn kun ĝi. Anstataŭe, mi rekomendas uzi [Pyxis](https://github.com/NVIDIA/pyxis), ilon evoluigitan de NVIDIA, kiu simpligas la procezon de ruligo de konteneroj en HPC-sistemoj*.&#95;

*Ĉi tio estas la 2-a parto de duparta serio. [Parto 1](./enroot-on-slurm-for-distributed-ml-part-1) estas legebla ĉi tie.*

En [parto 1](./enroot-on-slurm-for-distributed-ml-part-1), ni pritraktis kiel uzi Enroot en Slurm por kontenerigita *ununoda* trejnado per `salloc`. En ĉi tiu artikolo, ni pritraktos kiel uzi Enroot en Slurm por kontenerigita *plurnoda* trejnado, kaj transiros al uzado de `sbatch`.

## Paŝo 1: Slurm-lanĉa skripto

Ni fine kreos plurajn Bash-dosierojn, kaj ĉiuj ili devus esti en la sama dosierujo kiel via trejna skripto. La unua estos Slurm-lanĉa dosiero, kiun ni rulos per `sbatch`. Ĉi tiu dosiero enhavos la samajn komandojn, kiujn ni uzis kun `salloc` en [parto 1](../enroot-on-slurm-for-distributed-ml-part-1), sed difinitajn per `#SBATCH`-direktivoj.

`launch.sh`

```bash
#!/bin/bash
#SBATCH -J "JOBNAME"
#SBATCH --nodes=2
#SBATCH --gpus-per-node=8
#SBATCH --cpus-per-task=128
#SBATCH --mem=2000G
#SBATCH --time=72:00:00
#SBATCH --qos=<qos>

export CUR_DIR=$(pwd)
srun --nodes=2 stage1.sh
```

Rimarku, ke ni kreas variablon `CUR_DIR` por konservi la nunan labordosierujon (la dosierujon, el kiu la komando `sbatch` estis lanĉita). Mi uzas ĉi tiun variablon por dividi la lokon de mia trejnada dosierujo inter skriptoj, por ke mi ne devu fiksi la vojojn rekte en la kodo. Sed ĝi ne estas nepra.

Slurm aŭtomate plusendos lokajn mediovariablojn al la komando `srun`, kiu lanĉos la skripton `stage1.sh` sur ĉiu nodo.

## Paŝo 2. Lanĉa skripto de Enroot

Poste ni kreos skripton, kiu ruliĝos sur ĉiu nodo. Ĉi tiu skripto respondecos pri lanĉo de la ujo kaj pri rulado de la trejna skripto. Ni nomos ĝin `stage1.sh`.

`stage1.sh`

```bash
#!/bin/bash

module load jq zstd pigz parallel libnvidia-container enroot

export MASTER_ADDR=$(scontrol show hostnames $SLURM_JOB_NODELIST | head -n 1) # akiri la IP-adreson de la unua nodo en la listo
export MASTER_PORT=6000 # agordi la pordon por komunikado inter nodoj

enroot create --name image-name /path/to/image-name.sqsh

enroot start --env SLURM_NODEID \
             --env MASTER_ADDR \
             --env MASTER_PORT \
             --env SLURM_JOB_NAME \
             --env CUR_DIR \
             --mount /local/file/path:/image/file/path \
             --rw image-name \
             bash ${CUR_DIR}/stage2.sh
```

Rimarku, ke ni transdonas al la ujo plurajn gravajn mediovariablojn provizitajn de Slurm, kune kun `CUR_DIR`. La variabloj `MASTER_ADDR` kaj `MASTER_PORT` estas uzataj de la distribuita trejnada modulo de PyTorch por kunordigi komunikadon inter nodoj.

Ni ankaŭ muntas lokan dosiervojon en la ujon (certigu, ke ĝi enhavas vian trejnan skripton!).

## Paŝo 3. Trejna skripto

Fine, ni kreos trejnan skripton, kiu estos plenumata ene de la ujo. Ni nomos tiun skripton `stage2.sh`.

`stage2.sh`

```bash
#!/bin/bash

export NCCL_DEBUG=INFO # se vi volas vidi NCCL-protokolojn
export NODE_RANK=$SLURM_NODEID # agordu la nodan rangon al la noda ID (0, 1, 2, ktp.)
echo NODE_RANK: $NODE_RANK # presas la nodan rangon por sencimigaj celoj

# Ruli la trejnan skripton
# NOTO: modifi laŭ bezono se vi ne uzas accelerate

accelerate launch --config_file ./accelerate_config.yaml --main_process_ip=$MASTER_ADDR --main_process_port=$MASTER_PORT --machine_rank $NODE_RANK ${CUR_DIR}/loop.py
```

Ĉi tie mi uzis [accelerate](https://huggingface.co/docs/accelerate) kiel lanĉilon por mia distribuita trejna skripto, sed vi povas uzi kian ajn lanĉilon vi volas. Nur certigu, ke vi plusendas la koncernajn mediovariablojn!

Por pleneco, jen mia dosiero `accelerate_config.yaml`. Ĝi uzas FSDP (Fully Sharded Data Parallel) por dividi modelajn parametrojn kaj gradientojn inter procezoj. Tio estas bonega maniero por trejni grandajn modelojn, kiuj ne povas enteniĝi sur nur unu GPU.

```yaml
compute_environment: LOCAL_MACHINE
deepspeed_config: {}
distributed_type: FSDP
downcast_bf16: "no"
fsdp_config:
  fsdp_auto_wrap_policy: TRANSFORMER_BASED_WRAP
  fsdp_backward_prefetch_policy: BACKWARD_PRE
  fsdp_offload_params: false
  fsdp_sharding_strategy: 1
  fsdp_state_dict_type: FULL_STATE_DICT
  fsdp_transformer_layer_cls_to_wrap: LlamaDecoderLayer
main_training_function: main
mixed_precision: "no"
num_machines: 2
num_processes: 16 # 8 GPU-oj per nodo * 2 nodoj = 16 procezoj
use_cpu: false
```

## Paŝo 4. Submetu la taskon

Nun kiam ni kreis ĉiujn necesajn skriptojn, ni povas submeti la taskon al Slurm per `sbatch`! En la dosierujo, kiu enhavas la skriptojn, rulu:

```bash
sbatch launch.sh
```

Via tasko estos sendita al Slurm kaj lanĉiĝos tuj kiam rimedoj estos disponeblaj. Eligaj protokoloj estos konservitaj en `slurm-<jobid>.out` en la aktuala dosierujo.

## Konkludo

Mi esperas, ke tio estis utila! Estas multaj partoj por kunordigi, por ke distribuita trejnado funkciu, sed ĝi ne estas tro malfacila, post kiam vi superas la komencan lernokurbon.