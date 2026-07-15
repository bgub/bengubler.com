---
title: Opätovné vytvorenie Alpaca pomocou triedy Hugging Face Trainer
description: Doladenie modelu Llama-2-7B na datasete Alpaca pomocou Hugging Face Trainer
date: "2023-11-07"
tags: [ml/ai, open-source]
---

*AKTUALIZÁCIA 2024: Kód v tomto príspevku už môže byť zastaraný. Odporúčam pozrieť si [dokumentáciu k Hugging Face Trainer](https://huggingface.co/docs/transformers/v4.41.3/en/trainer), kde nájdete najaktuálnejšie informácie.*

## Úvod

V marci tohto roku (2023) zverejnilo jedno laboratórium na Stanforde malý projekt, ktorý sa rýchlo stal mimoriadne vplyvným — [Alpaca](https://crfm.stanford.edu/2023/03/13/alpaca.html). Autori použili `text-davinci-003` (model InstructGPT od OpenAI) na vygenerovanie datasetu s 52 tisíc príkladmi promptov a odpovedí a potom na týchto dvojiciach promptov a odpovedí doladili Llama-7B.

Výsledok bol prekvapivo dobrý — Alpaca dokázala komunikovať s používateľmi podobne ako modely InstructGPT od OpenAI, hoci bola lacná na trénovanie a nepoužívala tréningový dataset vytvorený ľuďmi. V tomto príspevku napíšeme kód na natrénovanie vlastného modelu od začiatku pomocou datasetu Alpaca.

*Kód v tomto príspevku vychádza z kódu v [repozitári Alpaca](https://github.com/tatsu-lab/stanford_alpaca), no dúfam, že bude jednoduchší a intuitívnejší. Všetky zásluhy patria pôvodným autorom článku.*

## Nastavenie

Budete musieť nainštalovať `torch`, `transformers`, `datasets` a `accelerate`. `wandb` je skvelý, ak chcete priebežne sledovať trénovaciu stratu. A samozrejme budete potrebovať aj výkonné GPU, ak chcete model natrénovať rýchlo.

Na začiatok si vytvorte jeden hlavný priečinok, `alpaca-repro`, s dvoma podpriečinkami: jeden s názvom `trainer`, kam dáte tréningový kód, a druhý s názvom `finetunes`, kam uložíme váš doladený model.

## Krok 1: Načítanie a spracovanie dát

Všetok kód v tejto sekcii vložte do `trainer/get_data.py`.

Začneme načítaním [dát Alpaca](https://huggingface.co/datasets/tatsu-lab/alpaca) z Hugging Face Hubu. Každú dvojicu otázka/prompt v datasete treba previesť na jeden reťazec, na ktorom môžeme model trénovať, no zároveň vytvárame ešte jeden ďalší reťazec: `source`, ktorý neskôr používame na ignorovanie labelov, aby sa model netrénoval na inštrukciách.

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

Tu rozdelíme dáta, aby sme neskôr mohli 10 % použiť na vyhodnotenie a testovanie.

```python
processed_dataset = dataset.train_test_split(test_size=0.1)

train_dataset = processed_dataset["train"]
eval_dataset = processed_dataset["test"]
```

Nakoniec definujeme dátový kolátor, ktorý sa bude používať v našej tréningovej slučke. Pamätajte, že každý reťazec `text` sa skladá len z `source` a odpovede. Preto tokenizujeme reťazec `source`, aby sme zistili, koľko labelov v reťazci `text` treba ignorovať.

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

## Krok 2: Písanie tréningovej slučky

Všetok kód z tejto časti vložte do `trainer/loop.py`.

Tento kód je pomerne zrozumiteľný aj bez ďalšieho vysvetľovania, takže som ho len doplnil komentármi.

```python
from transformers import LlamaForCausalLM, LlamaTokenizer, Trainer, TrainingArguments
from accelerate import Accelerator
from get_data import train_dataset, eval_dataset, data_collator

accelerator = Accelerator()

MODEL_PATH = "meta-llama/Llama-2-7b-hf" # cesta k Llama na Hugging Face Hub
OUTPUT_DIR = "../finetunes/alpaca-7b" # kam uložiť doladený model

tokenizer = LlamaTokenizer.from_pretrained(MODEL_PATH, legacy=False)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right" # predvolene nenastavené, čo je zvláštne

model = LlamaForCausalLM.from_pretrained(
    MODEL_PATH, device_map="auto"
)

training_args = TrainingArguments(
    output_dir='checkpoints', # kam Trainer uloží kontrolné body modelu
    num_train_epochs=1, # začnite s malým počtom epoch na testovanie
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

## Krok 3: Spustenie našej tréningovej slučky

Vytvorte `trainer/accelerate_config.yaml` a vložte doň nasledujúcu konfiguráciu:

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

Potom prejdite príkazom `cd` do `./trainer` a spustite:

```bash
accelerate launch --config_file accelerate_config.yaml loop.py
```

Uloženie modelu a váh môže chvíľu potrváť, takže buďte trpezliví!

## Krok 4: Testovanie nášho doladeného modelu!

Napísal som jednoduchý skript, ktorý načíta náš doladený model a umožní s ním pracovať! Nepodporuje konverzácie s kontextom, ale je to skvelý spôsob, ako si overiť, ako model funguje.

Vytvorte nový súbor s názvom `alpaca-repro/model_test.py` a potom spustite `python3 model_test.py`.

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

## Záver

Dúfam, že vám tento článok pomohol a priniesol užitočné informácie! O pár dní naň plánujem nadviazať vysvetlením, ako používať FSDP s Hugging Face Trainer.

Ak ste sa v tom po ceste trochu stratili, tu je Gist s finálnym kódom projektu: https://gist.github.com/bgub/1da2c0064d53decf197a304267799708