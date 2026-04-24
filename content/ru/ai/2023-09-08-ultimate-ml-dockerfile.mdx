---
title: Настройка Docker для машинного обучения
description: Dockerfile, который я использую для настройки своей среды машинного обучения.
date: "2023-09-08"
lastUpdated: "2024-06-24"
tags: [ml/ai]
---

*UPDATE 2024: Я обновил эту публикацию: теперь она основана на образе `nvcr.io/nvidia/pytorch`, который я в последнее время использую постоянно из-за его отличной поддержки NVIDIA + NCCL + Infiniband. Я также упростил файл и перевёл мониторинг GPU на `gom`.*

Эта публикация в первую очередь предназначена для коллег, но может быть полезна и другим. Ниже я поделюсь Dockerfile, который использую для настройки своей среды машинного обучения. Он основан на образе NVIDIA `pytorch`, но я добавил в него несколько полезных для себя вещей (обновлённые пакеты Pip, GitHub CLI, промпт Starship, [мониторинг GPU](./2023-10-16-gom-gpu-monitor-nvidia-smi-replacement) и т. д.).

## Настройка

Скопируйте приведённый ниже `Dockerfile` в новый каталог. Смело добавляйте или удаляйте всё, что хотите, — я, скорее всего, буду обновлять эту публикацию по мере того, как вношу изменения в свою конфигурацию.

```dockerfile
# Базовый образ с Ubuntu 22.04, Python 3.10, CUDA 12.4
FROM nvcr.io/nvidia/pytorch:24.04-py3

#####################
# ПАКЕТЫ PYTHON     #
#####################

# Отключить предупреждение "running pip as the 'root' user can..."
ENV PIP_ROOT_USER_ACTION=ignore

# Обновить pip
RUN pip3 install --upgrade pip

# Обновить и установить полезные пакеты для машинного обучения
RUN pip3 install --upgrade transformers accelerate deepspeed fire tqdm openai numpy rouge_score wandb ipython emoji tokenizers evaluate matplotlib seaborn lm-eval jupyter nltk tiktoken aiolimiter swifter pytorch-lightning lightning sentencepiece jsonargparse[signatures] bitsandbytes datasets zstandard rich transformer_lens librosa soundfile gom git+https://github.com/stanfordnlp/pyvene.git git+https://github.com/stanfordnlp/pyreft.git

# Установить ночную сборку TorchAudio
RUN pip3 install --no-deps torchaudio

# Исправить некорректный pip-пакет Docker, чтобы GOM работал
RUN mv /usr/local/lib/python3.10/dist-packages/docker /usr/local/lib/python3.10/dist-packages/docker_old

#####################
# GH CLI И STARSHIP #
#####################

# GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install gh -y

RUN apt-get upgrade -y

# Промпт Starship
RUN curl -sS https://starship.rs/install.sh -o starship-install.sh 
RUN sh -posix starship-install.sh --yes
RUN echo 'eval "$(starship init bash)"' >> ~/.bashrc

# Конфигурация Starship
RUN echo $'[character]\n\
    success_symbol = "[λ](bold green) "\n\
    error_symbol = "[λ](bold red) "\n\
    \n\
    [aws]\n\
    disabled = true' > /root/.config/starship.toml
```

## Сборка образа

После создания файлов образ можно собрать с помощью:

```bash
cd /path/to/directory
docker build -t YOUR_IMAGE_NAME_HERE .
```

## Запуск образа

Образ можно запустить так:

```bash
docker run -d --rm -it \
    --gpus all \
    --name YOUR_CONTAINER_NAME \
    --mount type=bind,source=YOUR_HOME_DIR,target=YOUR_HOME_DIR \
    -w YOUR_HOME_DIR \
    YOUR_IMAGE_NAME_HERE:latest
```