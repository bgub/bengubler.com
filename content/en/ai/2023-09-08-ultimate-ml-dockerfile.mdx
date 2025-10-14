---
title: Setting Up Docker for Machine Learning
description: The Dockerfile I use to set up my machine learning environment.
date: "2023-09-08"
lastUpdated: "2024-06-24"
tags: [ml/ai]
---

_UPDATE 2024: I've updated this post to be based on the `nvcr.io/nvidia/pytorch` image, which I always use these days because of its great NVIDIA + NCCL + Infiniband support. I also simplified the file and modified it to use `gom` for GPU monitoring._

This post is mainly meant for coworkers, but it might be useful for others as well. I'll be sharing the Dockerfile that I use to set up my machine learning environment. It's based on NVIDIA's `pytorch` image, but I've added a few things (upgraded Pip packages, GitHub CLI, Starship prompt, [GPU monitoring](./2023-10-16-gom-gpu-monitor-nvidia-smi-replacement), etc.) that I find useful.

## Setup

Copy and paste the below `Dockerfile` to a new directory. Feel free to add or remove anything you want — I'll likely update this post as I make changes to my setup.

```dockerfile
# Base image with Ubuntu 22.04, Python 3.10, CUDA 12.4
FROM nvcr.io/nvidia/pytorch:24.04-py3

#####################
# PYTHON PACKAGES   #
#####################

# Disable the "running pip as the 'root' user can..." warning
ENV PIP_ROOT_USER_ACTION=ignore

# Upgrade pip
RUN pip3 install --upgrade pip

# Upgrade & install useful machine learning packages
RUN pip3 install --upgrade transformers accelerate deepspeed fire tqdm openai numpy rouge_score wandb ipython emoji tokenizers evaluate matplotlib seaborn lm-eval jupyter nltk tiktoken aiolimiter swifter pytorch-lightning lightning sentencepiece jsonargparse[signatures] bitsandbytes datasets zstandard rich transformer_lens librosa soundfile gom git+https://github.com/stanfordnlp/pyvene.git git+https://github.com/stanfordnlp/pyreft.git

# Install TorchAudio nightly
RUN pip3 install --no-deps torchaudio

# Fix incorrect Docker pip package, so gom works
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

# Starship Prompt
RUN curl -sS https://starship.rs/install.sh -o starship-install.sh 
RUN sh -posix starship-install.sh --yes
RUN echo 'eval "$(starship init bash)"' >> ~/.bashrc

# Starship Config
RUN echo $'[character]\n\
    success_symbol = "[λ](bold green) "\n\
    error_symbol = "[λ](bold red) "\n\
    \n\
    [aws]\n\
    disabled = true' > /root/.config/starship.toml
```

## Building the Image

After you've created the files, you can build the image with:

```bash
cd /path/to/directory
docker build -t YOUR_IMAGE_NAME_HERE .
```

## Running the Image

You can run the image with:

```bash
docker run -d --rm -it \
    --gpus all \
    --name YOUR_CONTAINER_NAME \
    --mount type=bind,source=YOUR_HOME_DIR,target=YOUR_HOME_DIR \
    -w YOUR_HOME_DIR \
    YOUR_IMAGE_NAME_HERE:latest
```