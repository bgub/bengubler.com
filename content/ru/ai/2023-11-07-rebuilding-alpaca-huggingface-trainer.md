---
title: Воссоздание Alpaca с помощью класса Trainer из Hugging Face
description: Дообучение Llama-2-7B на датасете Alpaca с помощью Hugging Face Trainer
date: "2023-11-07"
tags: [ml/ai, open-source]
---

*ОБНОВЛЕНИЕ 2024: Код в этой публикации может быть устаревшим. Рекомендую свериться с [документацией Hugging Face Trainer](https://huggingface.co/docs/transformers/v4.41.3/en/trainer) — там самая актуальная информация.*

## Введение

В марте этого года (2023) одна из лабораторий Стэнфорда выпустила небольшой проект, который очень быстро стал чрезвычайно влиятельным — [Alpaca](https://crfm.stanford.edu/2023/03/13/alpaca.html). Авторы использовали `text-davinci-003` (модель InstructGPT от OpenAI), чтобы сгенерировать датасет из 52 тыс. примеров запросов и ответов, а затем дообучили Llama-7B на этих парах «запрос—ответ».

Результат оказался на удивление хорошим — Alpaca могла взаимодействовать с пользователями почти так же, как модели InstructGPT от OpenAI, несмотря на низкую стоимость обучения и отсутствие созданного людьми обучающего датасета. В этой публикации мы напишем код для обучения собственной модели с нуля на датасете Alpaca.

*Код в этой публикации основан на коде из [репозитория Alpaca](https://github.com/tatsu-lab/stanford_alpaca), хотя я надеюсь, что он будет проще и понятнее. Вся заслуга принадлежит оригинальным авторам статьи.*

## Настройка

Вам понадобится установить `torch`, `transformers`, `datasets` и `accelerate`. `wandb` отлично подойдёт, если вы хотите отслеживать loss в процессе обучения. И, конечно, если вы хотите, чтобы модель обучалась быстро, понадобятся и хорошие GPU.

Для начала создайте основную папку `alpaca-repro` с двумя подпапками: `trainer`, где будет находиться код обучения, и `finetunes`, где мы будем сохранять дообученную модель.

## Шаг 1: Загрузка и обработка данных

Поместите весь код из этого раздела в `trainer/get_data.py`.

Начнём с загрузки [данных Alpaca](https://huggingface.co/datasets/tatsu-lab/alpaca) из хаба Hugging Face. Каждую пару вопрос/запрос в датасете нужно преобразовать в одну строку, на которой мы будем обучать модель, но дополнительно мы создаём ещё одну строку — `source`, которую ниже используем, чтобы игнорировать метки и не обучать модель на инструкциях.

```python
from datasets import load_dataset

original_dataset = load_dataset("tatsu-lab/alpaca")["train"]

template_no_context = """Below is an instruction that describes a task. \
Write a response that appropriately completes the request.

### Instruction:
{instruction}

### Response:
"""

template_context = """Below is an instruction that describes a task. \
Write a response that appropriately completes the request.

### Instruction:
{instruction}

### Input:
{input}

### Response:
"""

def data_to_string(data):

    instruction = data["instruction"]
    context = data["input"]
    response = data["output"]

    template = template_context if len(context) > 0 else template_no_context
    source = template.format(instruction=instruction, input=context)

    return {
        "source": source,
        "text": source + response,
    }


dataset = original_dataset.map(
    data_to_string
).remove_columns(['instruction', 'input', 'output'])
```

Здесь мы разделяем данные, чтобы позже использовать 10% для валидации и тестирования.

```python
processed_dataset = dataset.train_test_split(test_size=0.1)

train_dataset = processed_dataset["train"]
eval_dataset = processed_dataset["test"]
```

Наконец, определим коллатор данных, который будет использоваться в нашем цикле обучения. Помните, что каждая строка `text` — это просто `source` и ответ. Поэтому мы токенизируем строку `source`, чтобы определить, сколько меток в строке `text` нужно игнорировать.

```python
IGNORE_TOKEN = -100

def data_collator(features, tokenizer):
    sources = [feature["source"] for feature in features]
    targets = [feature["text"] for feature in features]

    source_tokens = tokenizer(
        sources,
        return_tensors="pt",
        padding='longest',
        max_length=None,
    )

    target_tokens = tokenizer(
        targets,
        return_tensors="pt",
        padding='longest',
        max_length=None,
    )

    labels = target_tokens["input_ids"].clone()

    for i in range(len(labels)):
        source_len = source_tokens["attention_mask"][i].sum()

        labels[i, :source_len] = IGNORE_TOKEN

    res = {
        "input_ids": target_tokens["input_ids"],
        "attention_mask": target_tokens["attention_mask"],
        "labels": labels,
    }

    return res
```

## Шаг 2: Пишем цикл обучения

Поместите весь код из этого раздела в `trainer/loop.py`.

Этот код довольно прост и понятен, поэтому я просто снабдил его комментариями.

```python
from transformers import LlamaForCausalLM, LlamaTokenizer, Trainer, TrainingArguments
from accelerate import Accelerator
from get_data import train_dataset, eval_dataset, data_collator

accelerator = Accelerator()

MODEL_PATH = "meta-llama/Llama-2-7b-hf" # путь к Llama на Hugging Face Hub
OUTPUT_DIR = "../finetunes/alpaca-7b" # куда сохранить дообученную модель

tokenizer = LlamaTokenizer.from_pretrained(MODEL_PATH, legacy=False)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right" # по умолчанию не задаётся, что странно

model = LlamaForCausalLM.from_pretrained(
    MODEL_PATH, device_map="auto"
)

training_args = TrainingArguments(
    output_dir='checkpoints', # куда Trainer будет сохранять чекпоинты модели
    num_train_epochs=1, # для тестирования начните с небольшого числа эпох
    learning_rate=2e-5,
    logging_steps=10,
    per_device_train_batch_size=8,
    remove_unused_columns=False,
    save_steps=1000,
    save_total_limit=1,
    report_to="wandb",
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
    data_collator=lambda x: data_collator(x, tokenizer),
)

trainer.train()
trainer.evaluate()

model.save_pretrained(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)
```

## Шаг 3: Запуск цикла обучения

Создайте `trainer/accelerate_config.yaml` и вставьте в него следующую конфигурацию:

```yaml
compute_environment: LOCAL_MACHINE
deepspeed_config: {}
distributed_type: "NO"
downcast_bf16: "no"
machine_rank: 0
main_process_ip: null
main_process_port: null
main_training_function: main
mixed_precision: "no"
num_machines: 1
num_processes: 1
use_cpu: false
```

Затем перейдите в `./trainer` с помощью `cd` и запустите:

```bash
accelerate launch --config_file accelerate_config.yaml loop.py
```

Сохранение модели и весов может занять некоторое время, так что запаситесь терпением!

## Шаг 4: Тестируем нашу дообученную модель!

Я написал простой скрипт, который загружает нашу дообученную модель и позволяет с ней взаимодействовать! Он не поддерживает диалоги с сохранением контекста, но это отличный способ посмотреть, как работает модель.

Создайте новый файл `alpaca-repro/model_test.py`, затем запустите `python3 model_test.py`.

```python
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

template = """Below is an instruction that describes a task. \
Write a response that appropriately completes the request.

### Instruction:
{instruction}

### Response:
"""

model_path = "./finetunes/alpaca-7b"

tokenizer = AutoTokenizer.from_pretrained(model_path, legacy=False)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right"

model = AutoModelForCausalLM.from_pretrained(
    model_path, device_map="auto", local_files_only=True
)

pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    return_full_text=False,
    do_sample=True,
    temperature=0.9,
    max_new_tokens=200,
)

def prompt_model():
    prompt = input("Enter your question: ")
    prompt = template.format(instruction=prompt)
    answer = pipe(prompt)
    print(answer[0]["generated_text"])

while True:
    prompt_model()
```

## Заключение

Надеюсь, эта статья была полезной и содержательной! Через несколько дней я планирую опубликовать продолжение с объяснением того, как использовать FSDP с Hugging Face Trainer.

Если по ходу чтения вы где-то запутались, вот Gist с итоговым кодом проекта: https://gist.github.com/bgub/1da2c0064d53decf197a304267799708