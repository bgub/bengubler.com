---
title: Agordi Docker por maŝina lernado
description: La Dockerfile, kiun mi uzas por agordi mian medion de maŝina lernado.
date: "2023-09-08"
lastUpdated: "2024-06-24"
tags: [ml/ai]
---

*ĜISDATIGO 2024: Mi ĝisdatigis ĉi tiun artikolon, por ke ĝi baziĝu sur la bildo `nvcr.io/nvidia/pytorch`, kiun mi nuntempe ĉiam uzas pro ĝia bonega subteno por NVIDIA + NCCL + Infiniband. Mi ankaŭ simpligis la dosieron kaj adaptis ĝin por uzi `gom` por GPU-monitorado.*

Ĉi tiu artikolo estas ĉefe destinita al kunlaborantoj, sed ĝi eble utilos ankaŭ al aliaj. Mi dividos la Dockerfile, kiun mi uzas por agordi mian medion de maŝina lernado. Ĝi baziĝas sur la bildo `pytorch` de NVIDIA, sed mi aldonis kelkajn utilajn aferojn (ĝisdatigitaj Pip-pakaĵoj, GitHub CLI, Starship prompto, [GPU-monitorado](./2023-10-16-gom-gpu-monitor-nvidia-smi-replacement), ktp.).

## Agordo

Kopiu kaj algluu la suban `Dockerfile` en novan dosierujon. Vi povas libere aldoni aŭ forigi ion ajn — mi verŝajne ĝisdatigos ĉi tiun afiŝon, dum mi faros ŝanĝojn al mia agordo.

```dockerfile
# Baza bildo kun Ubuntu 22.04, Python 3.10, CUDA 12.4
FROM nvcr.io/nvidia/pytorch:24.04-py3

#####################
# PYTHON-PAKAĴOJ   #
#####################

# Malaktivigi la avertmesaĝon "running pip as the 'root' user can..."
ENV PIP_ROOT_USER_ACTION=ignore

# Ĝisdatigi pip
RUN pip3 install --upgrade pip

# Ĝisdatigi kaj instali utilajn maŝinlernajn pakaĵojn
RUN pip3 install --upgrade transformers accelerate deepspeed fire tqdm openai numpy rouge_score wandb ipython emoji tokenizers evaluate matplotlib seaborn lm-eval jupyter nltk tiktoken aiolimiter swifter pytorch-lightning lightning sentencepiece jsonargparse[signatures] bitsandbytes datasets zstandard rich transformer_lens librosa soundfile gom git+https://github.com/stanfordnlp/pyvene.git git+https://github.com/stanfordnlp/pyreft.git

# Instali TorchAudio nightly
RUN pip3 install --no-deps torchaudio

# Ripari malĝustan Docker pip-pakaĵon, por ke gom funkciu
RUN mv /usr/local/lib/python3.10/dist-packages/docker /usr/local/lib/python3.10/dist-packages/docker_old

#####################
# GH CLI kaj STARSHIP #
#####################

# GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install gh -y

RUN apt-get upgrade -y

# Starship-prompto
RUN curl -sS https://starship.rs/install.sh -o starship-install.sh 
RUN sh -posix starship-install.sh --yes
RUN echo 'eval "$(starship init bash)"' >> ~/.bashrc

# Starship-agordo
RUN echo $'[character]\n\
    success_symbol = "[λ](bold green) "\n\
    error_symbol = "[λ](bold red) "\n\
    \n\
    [aws]\n\
    disabled = true' > /root/.config/starship.toml
```

## Konstrui la bildon

Post kiam vi kreis la dosierojn, vi povas konstrui la bildon per:

```bash
cd /path/to/directory
docker build -t YOUR_IMAGE_NAME_HERE .
```

## Lanĉi la bildon

Vi povas lanĉi la bildon jene:

```bash
docker run -d --rm -it \
    --gpus all \
    --name YOUR_CONTAINER_NAME \
    --mount type=bind,source=YOUR_HOME_DIR,target=YOUR_HOME_DIR \
    -w YOUR_HOME_DIR \
    YOUR_IMAGE_NAME_HERE:latest
```