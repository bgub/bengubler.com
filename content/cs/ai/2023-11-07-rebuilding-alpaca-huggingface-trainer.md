---
title: Znovuvytvoření Alpacy pomocí třídy Hugging Face Trainer
description: Dolaďování modelu Llama-2-7B pomocí datové sady Alpaca a nástroje Hugging Face Trainer
date: "2023-11-07"
tags: [ml/ai, open-source]
---

*AKTUALIZACE 2024: Kód v tomto článku už může být zastaralý. Doporučuji mrknout do [dokumentace k Hugging Face Traineru](https://huggingface.co/docs/transformers/v4.41.3/en/trainer), kde najdete nejaktuálnější informace.*

## Úvod

V březnu tohoto roku (2023) zveřejnila jedna laboratoř na Stanfordu malý projekt, který se rychle stal velmi vlivným — [Alpaca](https://crfm.stanford.edu/2023/03/13/alpaca.html). Autoři použili `text-davinci-003` (model InstructGPT od OpenAI) k vygenerování datové sady s 52 tisíci příklady promptů a odpovědí a následně na těchto dvojicích promptů a odpovědí doladili Llama-7B.

Výsledek byl překvapivě dobrý — Alpaca dokázala komunikovat s uživateli podobně jako modely InstructGPT od OpenAI, přestože byla levná na trénování a nevyužívala trénovací datovou sadu vytvořenou lidmi. V tomto článku na blogu si ukážeme, jak napsat kód pro natrénování vlastního modelu od začátku s využitím datové sady Alpaca.

*Kód v tomto článku na blogu vychází z kódu v [repozitáři Alpaca](https://github.com/tatsu-lab/stanford_alpaca), ale doufám, že bude jednodušší a srozumitelnější. Veškeré zásluhy patří původním autorům článku.*

## Nastavení

Budete si muset nainstalovat `torch`, `transformers`, `datasets` a `accelerate`. `wandb` se skvěle hodí, pokud chcete v průběhu trénování sledovat vývoj tréninkové ztráty. A samozřejmě budete potřebovat i nějaké výkonné GPU, pokud chcete, aby se model trénoval rychle.

Začněte tím, že vytvoříte jednu hlavní složku `alpaca-repro` se dvěma podsložkami: jednu s názvem `trainer`, kam přijde váš trénovací kód, a druhou `finetunes`, kam uložíme váš doladěný model.

## Krok 1: Načtení a zpracování dat

Veškerý kód z této sekce vložte do `trainer/get_data.py`.

Začneme načtením [datové sady Alpaca](https://huggingface.co/datasets/tatsu-lab/alpaca) z Hugging Face. Každou dvojici otázka/prompt v datové sadě je potřeba převést na jeden řetězec, na kterém můžeme model trénovat, ale navíc vytváříme ještě jeden řetězec: `source`, který později používáme k ignorování štítků, aby se model netrénoval na instrukcích.

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

Zde rozdělíme data, abychom později mohli 10 % použít pro vyhodnocení a testování.

```python
processed_dataset = dataset.train_test_split(test_size=0.1)

train_dataset = processed_dataset["train"]
eval_dataset = processed_dataset["test"]
```

Nakonec definujeme datový kolátor, který použijeme v trénovací smyčce. Pamatujte, že každý řetězec `text` se skládá jen z `source` a odpovědi. Proto tokenizujeme řetězec `source`, abychom zjistili, kolik labelů v řetězci `text` máme ignorovat.

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

## Krok 2: Vytvoření trénovací smyčky

Veškerý kód z této sekce vložte do `trainer/loop.py`.

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
    output_dir='checkpoints', # kam Trainer uloží kontrolní body modelu
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

## Krok 3: Spuštění trénovací smyčky

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

Pak pomocí `cd` přejděte do `./trainer` a spusťte:

```bash
accelerate launch --config_file accelerate_config.yaml loop.py
```

Uložení modelu a vah může chvíli trvat, tak prosím vydržte!

## Krok 4: Otestujeme náš doladěný model!

Napsal jsem jednoduchý skript, který načte náš doladěný model a umožní nám s ním pracovat! Nepodporuje konverzace s kontextem, ale je to skvělý způsob, jak si ověřit, jak model funguje.

Vytvořte nový soubor s názvem `alpaca-repro/model_test.py` a pak spusťte `python3 model_test.py`.

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

Doufám, že vám tento článek pomohl a že pro vás byl přínosný! Za pár dní na něj plánuji navázat vysvětlením, jak používat FSDP s Hugging Face Trainerem.

Pokud jste se v tom cestou trochu ztratili, tady je Gist s finálním kódem projektu: https://gist.github.com/bgub/1da2c0064d53decf197a304267799708