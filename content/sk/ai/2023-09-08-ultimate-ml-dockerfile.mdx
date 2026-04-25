---
title: Nastavenie Dockeru pre strojové učenie
description: Dockerfile, ktorý používam na nastavenie svojho prostredia pre strojové učenie.
date: "2023-09-08"
lastUpdated: "2024-06-24"
tags: [ml/ai]
---

*AKTUALIZÁCIA 2024: Tento článok som aktualizoval tak, aby vychádzal z obrazu `nvcr.io/nvidia/pytorch`, ktorý dnes používam prakticky vždy pre jeho skvelú podporu NVIDIA + NCCL + Infiniband. Súbor som tiež zjednodušil a upravil tak, aby na monitorovanie GPU používal `gom`.*

Tento článok je určený hlavne kolegom, ale môže byť užitočný aj pre ostatných. Podelím sa v ňom o Dockerfile, ktorý používam na nastavenie svojho prostredia pre strojové učenie. Vychádza z NVIDIA obrazu `pytorch`, ale pridal som doň niekoľko vecí (aktualizované balíčky Pip, GitHub CLI, prompt Starship, [monitorovanie GPU](./2023-10-16-gom-gpu-monitor-nvidia-smi-replacement) atď.), ktoré sa mi osvedčili.

## Nastavenie

Skopírujte nižšie uvedený `Dockerfile` do nového adresára. Pokojne si pridajte alebo odstráňte, čo chcete — tento článok budem pravdepodobne aktualizovať podľa toho, ako budem upravovať svoje nastavenie.

```dockerfile
# Základný obraz s Ubuntu 22.04, Python 3.10, CUDA 12.4
FROM nvcr.io/nvidia/pytorch:24.04-py3

#####################
# PYTHON BALÍČKY    #
#####################

# Zakázať upozornenie "running pip as the 'root' user can..."
ENV PIP_ROOT_USER_ACTION=ignore

# Aktualizovať pip
RUN pip3 install --upgrade pip

# Aktualizovať a nainštalovať užitočné balíčky pre strojové učenie
RUN pip3 install --upgrade transformers accelerate deepspeed fire tqdm openai numpy rouge_score wandb ipython emoji tokenizers evaluate matplotlib seaborn lm-eval jupyter nltk tiktoken aiolimiter swifter pytorch-lightning lightning sentencepiece jsonargparse[signatures] bitsandbytes datasets zstandard rich transformer_lens librosa soundfile gom git+https://github.com/stanfordnlp/pyvene.git git+https://github.com/stanfordnlp/pyreft.git

# Nainštalovať TorchAudio nightly
RUN pip3 install --no-deps torchaudio

# Opraviť nesprávny Docker pip balíček, aby GOM fungoval
RUN mv /usr/local/lib/python3.10/dist-packages/docker /usr/local/lib/python3.10/dist-packages/docker_old

#####################
# GH CLI & STARSHIP #
#####################

# GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install gh -y

RUN apt-get upgrade -y

# Starship prompt
RUN curl -sS https://starship.rs/install.sh -o starship-install.sh 
RUN sh -posix starship-install.sh --yes
RUN echo 'eval "$(starship init bash)"' >> ~/.bashrc

# Konfigurácia Starship
RUN echo $'[character]\n\
    success_symbol = "[λ](bold green) "\n\
    error_symbol = "[λ](bold red) "\n\
    \n\
    [aws]\n\
    disabled = true' > /root/.config/starship.toml
```

## Zostavenie obrazu

Po vytvorení súborov môžete obraz zostaviť pomocou:

```bash
cd /path/to/directory
docker build -t YOUR_IMAGE_NAME_HERE .
```

## Spustenie obrazu

Obraz môžete spustiť pomocou:

```bash
docker run -d --rm -it \
    --gpus all \
    --name YOUR_CONTAINER_NAME \
    --mount type=bind,source=YOUR_HOME_DIR,target=YOUR_HOME_DIR \
    -w YOUR_HOME_DIR \
    YOUR_IMAGE_NAME_HERE:latest
```