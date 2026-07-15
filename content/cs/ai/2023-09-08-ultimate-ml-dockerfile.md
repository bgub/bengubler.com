---
title: Nastavení Dockeru pro strojové učení
description: Dockerfile, který používám pro nastavení svého prostředí pro strojové učení.
date: "2023-09-08"
lastUpdated: "2024-06-24"
tags: [ml/ai]
---

*AKTUALIZACE 2024: Tento post jsem upravil tak, aby vycházel z obrazu `nvcr.io/nvidia/pytorch`, který dnes používám pořád díky skvělé podpoře NVIDIA + NCCL + Infiniband. Soubor jsem také zjednodušil a upravil tak, aby pro monitorování GPU používal `gom`.*

Tento post je určený hlavně kolegům, ale může se hodit i ostatním. Podělím se v něm o Dockerfile, který používám pro nastavení svého prostředí pro strojové učení. Je založený na obrazu `pytorch` od NVIDIA, ale přidal jsem do něj pár věcí, které se mi osvědčily (aktualizované balíčky pro Pip, GitHub CLI, prompt Starship, [monitorování GPU](./2023-10-16-gom-gpu-monitor-nvidia-smi-replacement) atd.).

## Nastavení

Zkopírujte níže uvedený soubor `Dockerfile` do nového adresáře. Klidně si v něm přidejte nebo odeberte cokoli chcete — tento článek budu pravděpodobně průběžně aktualizovat podle toho, jak budu své nastavení měnit.

```dockerfile
# Základní obraz s Ubuntu 22.04, Python 3.10, CUDA 12.4
FROM nvcr.io/nvidia/pytorch:24.04-py3

#####################
# PYTHON BALÍČKY    #
#####################

# Zakázat varování „running pip as the 'root' user can..."
ENV PIP_ROOT_USER_ACTION=ignore

# Aktualizovat pip
RUN pip3 install --upgrade pip

# Aktualizovat a nainstalovat užitečné balíčky pro strojové učení
RUN pip3 install --upgrade transformers accelerate deepspeed fire tqdm openai numpy rouge_score wandb ipython emoji tokenizers evaluate matplotlib seaborn lm-eval jupyter nltk tiktoken aiolimiter swifter pytorch-lightning lightning sentencepiece jsonargparse[signatures] bitsandbytes datasets zstandard rich transformer_lens librosa soundfile gom git+https://github.com/stanfordnlp/pyvene.git git+https://github.com/stanfordnlp/pyreft.git

# Nainstalovat noční sestavení TorchAudio
RUN pip3 install --no-deps torchaudio

# Opravit chybný Docker pip balíček, aby GOM fungoval
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

# Konfigurace Starship
RUN echo $'[character]\n\
    success_symbol = "[λ](bold green) "\n\
    error_symbol = "[λ](bold red) "\n\
    \n\
    [aws]\n\
    disabled = true' > /root/.config/starship.toml
```

## Sestavení obrazu

Po vytvoření souborů můžete obraz sestavit pomocí:

```bash
cd /path/to/directory
docker build -t YOUR_IMAGE_NAME_HERE .
```

## Spuštění obrazu

Obraz spustíte pomocí:

```bash
docker run -d --rm -it \
    --gpus all \
    --name YOUR_CONTAINER_NAME \
    --mount type=bind,source=YOUR_HOME_DIR,target=YOUR_HOME_DIR \
    -w YOUR_HOME_DIR \
    YOUR_IMAGE_NAME_HERE:latest
```