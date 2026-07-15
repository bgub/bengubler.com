---
title: Opětovné vytvoření Alpacy pomocí třídy Hugging Face Trainer
description: Jemné doladění Llama-2-7B pomocí datové sady Alpaca a Hugging Face Trainer
date: "2023-11-07"
tags: [ml/ai, open-source]
---

*AKTUALIZACE 2024: Kód v tomto článku už může být zastaralý. Doporučuji podívat se do [dokumentace ke třídě Hugging Face Trainer](https://huggingface.co/docs/transformers/v4.41.3/en/trainer), kde najdete nejaktuálnější informace.*

## Úvod

V březnu tohoto roku (2023) vydala jedna ze stanfordských laboratoří malý projekt, který se rychle stal nesmírně vlivným — [Alpaca](https://crfm.stanford.edu/2023/03/13/alpaca.html). Autoři použili `text-davinci-003` (model InstructGPT od OpenAI) k vygenerování datové sady s 52 tisíci příklady promptů a odpovědí a poté na těchto dvojicích prompt–odpověď doladili model Llama-7B.

Výsledek byl překvapivě dobrý — Alpaca dokázala komunikovat s uživateli podobně jako modely InstructGPT od OpenAI, přestože její trénování bylo levné a nepoužívala datovou sadu vytvořenou lidmi. V tomto blogovém příspěvku napíšeme kód pro natrénování vlastního modelu od nuly s využitím datové sady Alpaca.

*Kód v tomto blogovém příspěvku vychází z [repozitáře Alpaca](https://github.com/tatsu-lab/stanford_alpaca), ale doufám, že bude jednodušší a intuitivnější. Veškeré zásluhy patří původním autorům práce.*

## Nastavení

Budete potřebovat nainstalovat `torch`, `transformers`, `datasets` a `accelerate`. `wandb` je skvělý, pokud chcete v čase sledovat tréninkovou ztrátu. A samozřejmě budete potřebovat i nějaké výkonné GPU, pokud chcete, aby se váš model trénoval rychle.

Začněte tím, že vytvoříte jednu hlavní složku `alpaca-repro` se dvěma podsložkami: jedna se bude jmenovat `trainer`, kam přijde váš trénovací kód, a druhá `finetunes`, kam budeme ukládat váš doladěný model.

## Krok 1: Načítání a zpracování dat

Veškerý kód v této části vložte do `trainer/get_data.py`.

Začneme načtením [dat Alpaca](https://huggingface.co/datasets/tatsu-lab/alpaca) z Hugging Face Hub. Každý pár otázka/prompt v datové sadě je potřeba převést na jediný řetězec, na kterém můžeme model trénovat, ale navíc ve skutečnosti vytváříme ještě jeden řetězec navíc: `source`, který níže používáme k ignorování labels, aby se náš model neučil z instrukcí.

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

Zde data rozdělíme tak, abychom 10 % z nich mohli později použít pro vyhodnocení a testování.

```python
processed_dataset = dataset.train_test_split(test_size=0.1)

train_dataset = processed_dataset["train"]
eval_dataset = processed_dataset["test"]
```

Nakonec definujeme data collator, který bude používat naše trénovací smyčka. Pamatujte, že každý řetězec `text` se skládá jen z `source` a odpovědi. Proto tokenizujeme řetězec `source`, abychom zjistili, kolik štítků v řetězci `text` máme ignorovat.

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

## Krok 2: Vytvoření naší trénovací smyčky

Veškerý kód z této části vložte do `trainer/loop.py`.

Tento kód je poměrně srozumitelný sám o sobě, takže jsem ho jen doplnil komentáři.

```python
from transformers import LlamaForCausalLM, LlamaTokenizer, Trainer, TrainingArguments
from accelerate import Accelerator
from get_data import train_dataset, eval_dataset, data_collator

accelerator = Accelerator()

MODEL_PATH = "meta-llama/Llama-2-7b-hf" # cesta k Llama na Hugging Face Hub
OUTPUT_DIR = "../finetunes/alpaca-7b" # kam uložit doladěný model

tokenizer = LlamaTokenizer.from_pretrained(MODEL_PATH, legacy=False)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right" # ve výchozím nastavení není nastaveno, což je zvláštní

model = LlamaForCausalLM.from_pretrained(
    MODEL_PATH, device_map="auto"
)

training_args = TrainingArguments(
    output_dir='checkpoints', # kam Trainer uloží checkpointy modelu
    num_train_epochs=1, # začněte s malým počtem epoch pro testování
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

## Krok 3: Spuštění naší trénovací smyčky

Vytvořte `trainer/accelerate_config.yaml` a vložte do něj následující konfiguraci:

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

Poté přejděte do `./trainer` pomocí `cd` a spusťte:

```bash
accelerate launch --config_file accelerate_config.yaml loop.py
```

Uložení modelu a vah může chvíli trvat, tak prosím vydržte!

## Krok 4: Testování našeho doladěného modelu!

Napsal jsem jednoduchý skript, který načte náš doladěný model a umožní s ním interagovat! Nepodporuje konverzace s kontextem, ale je to skvělý způsob, jak se podívat, jak model funguje.

Vytvořte nový soubor s názvem `alpaca-repro/model_test.py` a potom spusťte `python3 model_test.py`.

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

## Závěr

Doufám, že pro vás byl tento článek užitečný a přínosný! Za pár dní na něj chci navázat vysvětlením, jak používat FSDP s Hugging Face Trainerem.

Pokud jste se po cestě trochu ztratili, tady je Gist s finálním kódem projektu: https://gist.github.com/bgub/1da2c0064d53decf197a304267799708