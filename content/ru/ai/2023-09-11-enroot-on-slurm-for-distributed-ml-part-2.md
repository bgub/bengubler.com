---
title: "Enroot в Slurm для распределённого ML: часть 2"
description: Как использовать Enroot в Slurm для контейнеризированного многоузлового обучения.
date: "2023-09-11"
tags: [ml/ai]
---

*ОБНОВЛЕНИЕ 2024: Я больше не рекомендую этот метод, так как столкнулся с рядом проблем при его использовании. Вместо этого рекомендую [Pyxis](https://github.com/NVIDIA/pyxis) — инструмент, разработанный NVIDIA, который упрощает запуск контейнеров на HPC-системах*.&#95;

*Это часть 2 из серии, состоящей из 2 частей. [Часть 1](./enroot-on-slurm-for-distributed-ml-part-1) доступна здесь.*

В [части 1](./enroot-on-slurm-for-distributed-ml-part-1) мы рассмотрели, как использовать Enroot в Slurm для контейнеризированного *одноузлового* обучения с помощью `salloc`. В этой публикации мы разберём, как использовать Enroot в Slurm для контейнеризированного *многоузлового* обучения и перейти на `sbatch`.

## Шаг 1: Скрипт запуска Slurm

В итоге мы создадим несколько Bash-файлов, и все они должны находиться в том же каталоге, что и ваш скрипт обучения. Первый из них — файл запуска Slurm, который мы будем запускать через `sbatch`. В этом файле будут те же команды, которые мы выполняли через `salloc` в [части 1](../enroot-on-slurm-for-distributed-ml-part-1), но оформленные в виде директив `#SBATCH`.

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

Обратите внимание, что мы создаём переменную `CUR_DIR`, чтобы сохранить текущий рабочий каталог (каталог, из которого была запущена команда `sbatch`). Я использую эту переменную, чтобы передавать путь к каталогу с обучением между скриптами и не прописывать пути вручную. Но это не обязательно.

Slurm автоматически передаст локальные переменные окружения в команду `srun`, которая запустит скрипт `stage1.sh` на каждом узле.

## Шаг 2. Скрипт запуска Enroot

Далее создадим скрипт, который будет выполняться на каждом узле. Он будет отвечать за запуск контейнера и выполнение скрипта обучения. Назовём его `stage1.sh`.

`stage1.sh`

```bash
#!/bin/bash

module load jq zstd pigz parallel libnvidia-container enroot

export MASTER_ADDR=$(scontrol show hostnames $SLURM_JOB_NODELIST | head -n 1) # получить IP-адрес первого узла в списке
export MASTER_PORT=6000 # задать порт для связи между узлами

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

Обратите внимание, что в контейнер мы передаём несколько важных переменных окружения, предоставляемых Slurm, а также `CUR_DIR`. Переменные `MASTER_ADDR` и `MASTER_PORT` используются бэкендом распределённого обучения PyTorch для координации обмена данными между узлами.

Мы также монтируем в контейнер локальный путь к файлу (убедитесь, что по этому пути находится ваш скрипт обучения!).

## Шаг 3. Скрипт обучения

Наконец, создадим скрипт обучения, который будет выполняться внутри контейнера. Назовём его `stage2.sh`.

`stage2.sh`

```bash
#!/bin/bash

export NCCL_DEBUG=INFO # если хотите видеть логи NCCL
export NODE_RANK=$SLURM_NODEID # задать ранг узла равным его ID (0, 1, 2 и т.д.)
echo NODE_RANK: $NODE_RANK # вывести ранг узла для отладки

# Запуск скрипта обучения
# ПРИМЕЧАНИЕ: измените при необходимости, если не используете accelerate

accelerate launch --config_file ./accelerate_config.yaml --main_process_ip=$MASTER_ADDR --main_process_port=$MASTER_PORT --machine_rank $NODE_RANK ${CUR_DIR}/loop.py
```

Здесь я использовал [accelerate](https://huggingface.co/docs/accelerate) как лаунчер для своего скрипта распределённого обучения, но вы можете использовать любой лаунчер по своему выбору. Главное — не забудьте передать нужные переменные окружения!

Для полноты картины вот мой файл `accelerate_config.yaml`. В нём используется FSDP (Fully Sharded Data Parallel), чтобы распределять параметры модели и градиенты между процессами. Это отличный способ обучать большие модели, которые не помещаются на одном GPU.

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
num_processes: 16 # 8 GPU на узел * 2 узла = 16 процессов
use_cpu: false
```

## Шаг 4. Отправка задания

Теперь, когда мы создали все необходимые скрипты, можно отправить задание в Slurm с помощью `sbatch`! Находясь в каталоге со скриптами, выполните:

```bash
sbatch launch.sh
```

Ваше задание будет отправлено в Slurm и запустится, как только освободятся ресурсы. Логи вывода будут сохранены в файле `slurm-<jobid>.out` в текущем каталоге.

## Заключение

Надеюсь, это было полезно! В настройке распределённого обучения есть много нюансов, но после преодоления начального порога входа всё оказывается не так уж сложно.