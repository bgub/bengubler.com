---
title: إعداد Docker للتعلّم الآلي
description: ملف Dockerfile الذي أستخدمه لإعداد بيئة التعلّم الآلي الخاصة بي.
date: "2023-09-08"
lastUpdated: "2024-06-24"
tags: [ml/ai]
---

*تحديث 2024: حدّثت هذا المقال ليعتمد على صورة `nvcr.io/nvidia/pytorch`، وهي الصورة التي أستخدمها دائمًا هذه الأيام لما توفّره من دعم ممتاز لـ NVIDIA وNCCL وInfiniband. كما بسّطت الملف وعدّلته لاستخدام `GOM` لمراقبة الـ GPU.*

هذا المقال موجّه أساسًا إلى زملاء العمل، لكنه قد يكون مفيدًا لغيرهم أيضًا. سأشارك ملف Dockerfile الذي أستخدمه لإعداد بيئة التعلّم الآلي الخاصة بي. وهو مبني على صورة `pytorch` من NVIDIA، لكنني أضفت إليه بعض الأمور التي أجدها مفيدة (مثل ترقية حزم Pip، وGitHub CLI، وموجّه Starship، و[مراقبة الـ GPU](./2023-10-16-gom-gpu-monitor-nvidia-smi-replacement)، وغيرها).

## الإعداد

انسخ والصق ملف `Dockerfile` أدناه في مجلد جديد. لا تتردد في إضافة أو إزالة أي شيء تريده — وعلى الأرجح سأحدّث هذا المقال كلما أجريت تغييرات على إعداداتي.

```dockerfile
# الصورة الأساسية مع Ubuntu 22.04 وPython 3.10 وCUDA 12.4
FROM nvcr.io/nvidia/pytorch:24.04-py3

#####################
# حزم PYTHON        #
#####################

# تعطيل تحذير "تشغيل pip كمستخدم 'root' قد..."
ENV PIP_ROOT_USER_ACTION=ignore

# تحديث pip
RUN pip3 install --upgrade pip

# تحديث وتثبيت حزم التعلّم الآلي المفيدة
RUN pip3 install --upgrade transformers accelerate deepspeed fire tqdm openai numpy rouge_score wandb ipython emoji tokenizers evaluate matplotlib seaborn lm-eval jupyter nltk tiktoken aiolimiter swifter pytorch-lightning lightning sentencepiece jsonargparse[signatures] bitsandbytes datasets zstandard rich transformer_lens librosa soundfile gom git+https://github.com/stanfordnlp/pyvene.git git+https://github.com/stanfordnlp/pyreft.git

# تثبيت الإصدار الليلي من TorchAudio
RUN pip3 install --no-deps torchaudio

# إصلاح حزمة Docker pip الخاطئة لكي يعمل GOM
RUN mv /usr/local/lib/python3.10/dist-packages/docker /usr/local/lib/python3.10/dist-packages/docker_old

#####################
# GH CLI و STARSHIP #
#####################

# واجهة سطر أوامر GitHub
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install gh -y

RUN apt-get upgrade -y

# موجّه Starship
RUN curl -sS https://starship.rs/install.sh -o starship-install.sh 
RUN sh -posix starship-install.sh --yes
RUN echo 'eval "$(starship init bash)"' >> ~/.bashrc

# إعدادات Starship
RUN echo $'[character]\n\
    success_symbol = "[λ](bold green) "\n\
    error_symbol = "[λ](bold red) "\n\
    \n\
    [aws]\n\
    disabled = true' > /root/.config/starship.toml
```

## إنشاء الصورة

بعد إنشاء الملفات، يمكنك إنشاء الصورة باستخدام:

```bash
cd /path/to/directory
docker build -t YOUR_IMAGE_NAME_HERE .
```

## تشغيل الصورة

يمكنك تشغيلها باستخدام:

```bash
docker run -d --rm -it \
    --gpus all \
    --name YOUR_CONTAINER_NAME \
    --mount type=bind,source=YOUR_HOME_DIR,target=YOUR_HOME_DIR \
    -w YOUR_HOME_DIR \
    YOUR_IMAGE_NAME_HERE:latest
```