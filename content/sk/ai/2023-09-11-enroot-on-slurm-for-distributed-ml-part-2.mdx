---
title: "Enroot na Slurme pre distribuované ML: 2. časť"
description: Ako používať Enroot na Slurme na kontajnerizovaný tréning na viacerých uzloch.
date: "2023-09-11"
tags: [ml/ai]
---

*AKTUALIZÁCIA 2024: Túto metódu už neodporúčam, pretože som pri nej narazil na viacero problémov. Namiesto nej odporúčam [Pyxis](https://github.com/NVIDIA/pyxis), nástroj od spoločnosti NVIDIA, ktorý zjednodušuje spúšťanie kontajnerov na HPC systémoch*.&#95;

*Toto je 2. časť z 2-dielnej série. [1. časť](./enroot-on-slurm-for-distributed-ml-part-1) nájdete tu.*

V [1. časti](./enroot-on-slurm-for-distributed-ml-part-1) sme si ukázali, ako používať Enroot na Slurme na kontajnerizovaný tréning na *jednom uzle* pomocou `salloc`. V tomto článku si ukážeme, ako používať Enroot na Slurme na kontajnerizovaný tréning na *viacerých uzloch*, a prejdeme na používanie `sbatch`.

## Krok 1: Spúšťací skript Slurm

Nakoniec vytvoríme niekoľko súborov Bash, pričom všetky by mali byť v rovnakom adresári ako váš tréningový skript. Prvým bude spúšťací súbor Slurm, ktorý spustíme pomocou `sbatch`. Tento súbor bude obsahovať tie isté príkazy, ktoré sme spúšťali pomocou `salloc` v [1. časti](../enroot-on-slurm-for-distributed-ml-part-1), ale zadané pomocou direktív `#SBATCH`.

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

Všimnite si, že vytvárame premennú `CUR_DIR`, do ktorej ukladáme aktuálny pracovný adresár (adresár, v ktorom bol spustený príkaz `sbatch`). Túto premennú používam na zdieľanie umiestnenia tréningového adresára medzi skriptmi, aby som nemusel natvrdo zadávať cesty. Nie je to však nevyhnutné.

Slurm automaticky prenesie lokálne premenné prostredia do príkazu `srun`, ktorý na každom uzle spustí skript `stage1.sh`.

## Krok 2. Spúšťací skript Enroot

Ďalej vytvoríme skript, ktorý sa bude spúšťať na každom uzle. Bude mať na starosti spustenie kontajnera a tréningového skriptu. Tento skript nazveme `stage1.sh`.

`stage1.sh`

```bash
#!/bin/bash

module load jq zstd pigz parallel libnvidia-container enroot

export MASTER_ADDR=$(scontrol show hostnames $SLURM_JOB_NODELIST | head -n 1) # získa IP adresu prvého uzla v zozname
export MASTER_PORT=6000 # nastaví port na komunikáciu medzi uzlami

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

Všimnite si, že do kontajnera odovzdávame niekoľko dôležitých premenných prostredia, ktoré poskytuje Slurm, spolu s `CUR_DIR`. Premenné `MASTER_ADDR` a `MASTER_PORT` používa backend distribuovaného trénovania v knižnici PyTorch na koordináciu komunikácie medzi uzlami.

Do kontajnera tiež pripájame lokálnu cestu k súboru (uistite sa, že obsahuje váš trénovací skript!).

## Krok 3. Tréningový skript

Nakoniec vytvoríme tréningový skript, ktorý sa bude spúšťať v kontajneri. Tento skript nazveme `stage2.sh`.

`stage2.sh`

```bash
#!/bin/bash

export NCCL_DEBUG=INFO # ak chcete vidieť NCCL logy
export NODE_RANK=$SLURM_NODEID # nastaví poradie uzla na ID uzla (0, 1, 2, atď.)
echo NODE_RANK: $NODE_RANK # vypíše poradie uzla na účely ladenia

# Spustí tréningový skript
# POZNÁMKA: upravte podľa potreby, ak nepoužívate accelerate

accelerate launch --config_file ./accelerate_config.yaml --main_process_ip=$MASTER_ADDR --main_process_port=$MASTER_PORT --machine_rank $NODE_RANK ${CUR_DIR}/loop.py
```

Tu som použil [accelerate](https://huggingface.co/docs/accelerate) ako spúšťač pre svoj skript pre distribuované trénovanie, ale môžete použiť akýkoľvek spúšťač. Len sa uistite, že odovzdáte príslušné premenné prostredia!

Pre úplnosť tu je môj súbor `accelerate_config.yaml`. Využíva FSDP (Fully Sharded Data Parallel) na rozdelenie parametrov modelu a gradientov medzi procesy. Je to skvelý spôsob, ako trénovať veľké modely, ktoré by sa na jednu grafickú kartu nezmestili.

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
num_processes: 16 # 8 GPU na uzol * 2 uzly = 16 procesov
use_cpu: false
```

## Krok 4. Odošlite úlohu

Teraz, keď sme vytvorili všetky potrebné skripty, môžeme úlohu odoslať do Slurmu pomocou `sbatch`! V adresári so skriptmi spustite:

```bash
sbatch launch.sh
```

Vaša úloha bude odoslaná do systému Slurm a spustí sa hneď, ako budú dostupné prostriedky. Výstupné záznamy sa uložia do `slurm-<jobid>.out` v aktuálnom adresári.

## Záver

Dúfam, že vám to pomohlo! Rozbehať distribuovaný tréning zahŕňa viacero častí, no keď prekonáte počiatočnú fázu učenia, nie je to až také ťažké.