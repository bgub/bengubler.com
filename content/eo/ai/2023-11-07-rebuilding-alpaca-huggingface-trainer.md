---
title: Rekreante Alpaca per la klaso Trainer de Hugging Face
description: Fajnagordado de Llama-2-7B per la datumaro Alpaca kaj Hugging Face Trainer
date: "2023-11-07"
tags: [ml/ai, open-source]
---

*ĜISDATIGO 2024: La kodo en ĉi tiu artikolo eble estas malaktuala. Mi rekomendas kontroli la [dokumentaron de Hugging Face Trainer](https://huggingface.co/docs/transformers/v4.41.3/en/trainer) por la plej ĝisdataj informoj.*

## Enkonduko

En marto de ĉi tiu jaro (2023), laboratorio de Stanford publikigis etan projekton, kiu rapide fariĝis ege influa — [Alpaca](https://crfm.stanford.edu/2023/03/13/alpaca.html). La aŭtoroj uzis `text-davinci-003` (modelo InstructGPT de OpenAI) por generi datumaron kun 52K ekzemploj de promtoj kaj respondoj, kaj poste fajnagordis Llama-7B per tiuj paroj de promtoj kaj respondoj.

La rezulto estis surprize bona — Alpaca povis interagi kun uzantoj simile al la modeloj InstructGPT de OpenAI, kvankam ĝi estis malmultekosta por trejni kaj ne uzis homkreitan trejnan datumaron. En ĉi tiu blogartikolo, ni skribos kodon por trejni nian propran modelon ekde nulo uzante la datumaron Alpaca.

*La kodo en ĉi tiu blogartikolo baziĝas sur tiu en la [Alpaca repo](https://github.com/tatsu-lab/stanford_alpaca), kvankam mi esperas, ke ĝi estos pli simpla kaj pli intuicia. Ĉiu merito apartenas al la originaj aŭtoroj de la artikolo.*

## Agordo

Vi bezonos instali `torch`, `transformers`, `datasets` kaj `accelerate`. `wandb` tre utilas, se vi volas spuri la trejnadan perdon laŭlonge de la tempo. Kaj, kompreneble, vi bezonos bonajn GPU-ojn, se vi volas, ke via modelo trejniĝu rapide.

Komence kreu unu ĉefdosierujon, `alpaca-repro`, kun du subdosierujoj: unu nomatan `trainer`, kie estos via trejna kodo, kaj unu nomatan `finetunes`, kie ni konservos vian fajnagorditan modelon.

## Paŝo 1: Ŝargado kaj prilaborado de la datumoj

Metu la tutan kodon de ĉi tiu sekcio en `trainer/get_data.py`.

Ni komencos per ŝargado de la [Alpaca-datumaro](https://huggingface.co/datasets/tatsu-lab/alpaca) el la Hugging Face Hub. Ĉiu demando/prompto-paro en la datumaro devas esti konvertita al unu sola ĉeno, per kiu ni povas trejni la modelon, sed ni fakte generas ankaŭ unu plian ĉenon: `source`, kiun ni uzas pli sube por ignori etikedojn, por ke nia modelo ne estu trejnata laŭ la instrukcioj.

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

Ĉi tie ni dividas la datumojn, por ke ni poste povu uzi 10% por taksado kaj testado.

```python
processed_dataset = dataset.train_test_split(test_size=0.1)

train_dataset = processed_dataset["train"]
eval_dataset = processed_dataset["test"]
```

Fine, ni difinas datumkolaciilon por uzi en nia trejna buklo. Memoru, ke ĉiu `text`-ĉeno simple konsistas el `source` kaj la respondo. Do ni tokenigas la `source`-ĉenon por ekscii, kiom da etikedoj en la `text`-ĉeno oni ignoru.

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

## Paŝo 2: Verki nian trejnan buklon

Metu la tutan kodon de ĉi tiu sekcio en `trainer/loop.py`.

Ĉi tiu kodo estas sufiĉe memklariga, do mi nur aldonis komentojn al ĝi.

```python
from transformers import LlamaForCausalLM, LlamaTokenizer, Trainer, TrainingArguments
from accelerate import Accelerator
from get_data import train_dataset, eval_dataset, data_collator

accelerator = Accelerator()

MODEL_PATH = "meta-llama/Llama-2-7b-hf" # vojo al Llama sur Hugging Face Hub
OUTPUT_DIR = "../finetunes/alpaca-7b" # kie konservi la fajnagorditan modelon

tokenizer = LlamaTokenizer.from_pretrained(MODEL_PATH, legacy=False)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right" # ne agordita defaŭlte, strange

model = LlamaForCausalLM.from_pretrained(
    MODEL_PATH, device_map="auto"
)

training_args = TrainingArguments(
    output_dir='checkpoints', # kie Trainer konservos kontrolpunktojn de la modelo
    num_train_epochs=1, # komencu per malgranda nombro da epokoj por testado
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

## Paŝo 3: Ruligi nian trejnan buklon

Kreu `trainer/accelerate_config.yaml`, kaj algluu en ĝin la jenan agordon:

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

Poste iru al `./trainer` per `cd` kaj rulu:

```bash
accelerate launch --config_file accelerate_config.yaml loop.py
```

Konservado de la modelo kaj de la pezoj eble daŭros iom da tempo, do paciencu!

## Paŝo 4: Testado de nia fajnagordita modelo!

Mi skribis simplan skripton por ŝargi nian fajnagorditan modelon kaj interagi kun ĝi! Ĝi ne subtenas kuntekstajn konversaciojn, sed ĝi estas bonega maniero vidi, kiel la modelo funkcias.

Kreu novan dosieron nomatan `alpaca-repro/model_test.py`, poste rulu `python3 model_test.py`.

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

## Konkludo

Mi esperas, ke ĉi tiu artikolo estis utila kaj informa! Mi planas post kelkaj tagoj sekvi ĝin per klarigo pri tio, kiel uzi FSDP kun la Hugging Face Trainer.

Se vi ie perdiĝis laŭvoje, jen Gist kun la fina kodo de la projekto: https://gist.github.com/bgub/1da2c0064d53decf197a304267799708