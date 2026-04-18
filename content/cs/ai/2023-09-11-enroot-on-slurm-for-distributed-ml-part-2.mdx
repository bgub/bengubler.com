---
title: "Enroot na Slurmu pro distribuované ML: Část 2"
description: Jak používat Enroot na Slurmu pro kontejnerizovaný víceuzlový trénink.
date: "2023-09-11"
tags: [ml/ai]
---

*AKTUALIZACE 2024: Tuto metodu už nedoporučuji, protože jsem s ní narazil na několik problémů. Místo ní doporučuji [Pyxis](https://github.com/NVIDIA/pyxis), nástroj vyvinutý společností NVIDIA, který zjednodušuje spouštění kontejnerů na HPC systémech*.&#95;

*Toto je část 2 ze dvoudílné série. [Část 1](./enroot-on-slurm-for-distributed-ml-part-1) najdete zde.*

V [části 1](./enroot-on-slurm-for-distributed-ml-part-1) jsme si ukázali, jak používat Enroot na Slurmu pro kontejnerizovaný trénink na *jednom uzlu* pomocí `salloc`. V tomto článku si ukážeme, jak používat Enroot na Slurmu pro kontejnerizovaný trénink na *více uzlech* a přejdeme k používání `sbatch`.

## Krok 1: Spouštěcí skript pro Slurm

Nakonec vytvoříme několik souborů Bash, které by všechny měly být ve stejném adresáři jako váš trénovací skript. Prvním bude spouštěcí soubor pro Slurm, který spustíme pomocí `sbatch`. Tento soubor bude obsahovat stejné příkazy, jaké jsme spouštěli přes `salloc` v [části 1](../enroot-on-slurm-for-distributed-ml-part-1), ale zapsané pomocí direktiv `#SBATCH`.

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

Všimněte si, že vytváříme proměnnou `CUR_DIR`, do které ukládáme aktuální pracovní adresář (adresář, ze kterého byl spuštěn příkaz `sbatch`). Tuto proměnnou používám ke sdílení umístění trénovacího adresáře mezi skripty, abych nemusel natvrdo zadávat cesty. Není to ale nutné.

Slurm automaticky předá lokální proměnné prostředí příkazu `srun`, který na každém uzlu spustí skript `stage1.sh`.

## Krok 2. Spouštěcí skript Enroot

Dále vytvoříme skript, který poběží na každém uzlu. Ten bude mít na starosti spuštění kontejneru a trénovacího skriptu. Budeme mu říkat `stage1.sh`.

`stage1.sh`

```bash
#!/bin/bash

module load jq zstd pigz parallel libnvidia-container enroot

export MASTER_ADDR=$(scontrol show hostnames $SLURM_JOB_NODELIST | head -n 1) # získá IP adresu prvního uzlu v seznamu
export MASTER_PORT=6000 # nastaví port pro komunikaci mezi uzly

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

Všimněte si, že do kontejneru předáváme několik důležitých proměnných prostředí, které poskytuje Slurm, spolu s `CUR_DIR`. Proměnné `MASTER_ADDR` a `MASTER_PORT` používá backend PyTorch pro distribuované trénování ke koordinaci komunikace mezi uzly.

Do kontejneru také připojujeme lokální souborovou cestu (ujistěte se, že obsahuje váš trénovací skript!).

## Krok 3. Trénovací skript

Nakonec vytvoříme trénovací skript, který poběží uvnitř kontejneru. Nazveme ho `stage2.sh`.

`stage2.sh`

```bash
#!/bin/bash

export NCCL_DEBUG=INFO # pokud chcete vidět logy NCCL
export NODE_RANK=$SLURM_NODEID # nastavení ranku uzlu na ID uzlu (0, 1, 2, atd.)
echo NODE_RANK: $NODE_RANK # výpis ranku uzlu pro účely ladění

# Spuštění trénovacího skriptu
# POZNÁMKA: upravte podle potřeby, pokud nepoužíváte accelerate

accelerate launch --config_file ./accelerate_config.yaml --main_process_ip=$MASTER_ADDR --main_process_port=$MASTER_PORT --machine_rank $NODE_RANK ${CUR_DIR}/loop.py
```

Tady jsem [accelerate](https://huggingface.co/docs/accelerate) použil ke spuštění svého trénovacího skriptu pro distribuované trénování, ale můžete použít libovolný spouštěč. Jen se ujistěte, že předáte příslušné proměnné prostředí!

Pro úplnost tady uvádím svůj soubor `accelerate_config.yaml`. Využívá FSDP (Fully Sharded Data Parallel) k rozdělení parametrů modelu a gradientů mezi procesy. Je to skvělý způsob, jak trénovat velké modely, které se nevejdou do jedné GPU.

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
num_processes: 16 # 8 GPU na uzel * 2 uzly = 16 procesů
use_cpu: false
```

## Krok 4. Odeslání úlohy

Teď, když jsme vytvořili všechny potřebné skripty, můžeme úlohu odeslat do Slurmu pomocí `sbatch`! V adresáři se skripty spusťte:

```bash
sbatch launch.sh
```

Vaše úloha bude odeslána do Slurmu a spustí se, jakmile budou k dispozici výpočetní prostředky. Výstupní logy se uloží do souboru `slurm-<jobid>.out` v aktuálním adresáři.

## Závěr

Doufám, že vám to pomohlo! Zprovoznění distribuovaného trénování má mnoho částí, ale jakmile překonáte počáteční fázi učení, není to příliš složité.