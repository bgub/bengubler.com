---
title: Inferencia na viacerých GPU s Accelerate
description: Zrýchlite inferenciu paralelným odosielaním promptov na viacero GPU.
date: "2023-06-12"
lastUpdated: "2024-06-24"
tags: [ml/ai]
archived: true
---

*AKTUALIZÁCIA 2024: Informácie v tomto článku môžu byť zastarané alebo nepresné. Ako upozornil Alex Salinas v komentároch nižšie, tento kód by pravdepodobne mal používať torchpippy namiesto split&#95;between&#95;processes.*

Historicky sa distribuovanému trénovaniu venovala väčšia pozornosť než distribuovanej inferencii. Trénovanie je predsa len výpočtovo náročnejšie. Väčšie a zložitejšie veľké jazykové modely (LLMs) však môžu pri úlohách dopĺňania textu potrebovať veľa času. Či už ide o výskum alebo produkčné nasadenie, paralelizácia inferencie je užitočná na maximalizáciu výkonu.

Je dôležité uvedomiť si, že je rozdiel medzi rozdelením váh jedného modelu medzi viacero GPU a rozdelením promptov alebo vstupov medzi viacero modelov. Prvá možnosť je pomerne jednoduchá, zatiaľ čo druhá (na ktorú sa zameriam) je o niečo zložitejšia.

Pred týždňom bola vo verzii 0.20.0 v [HuggingFace Accelerate](https://huggingface.co/docs/accelerate/index) predstavená funkcia, ktorá výrazne zjednodušuje inferenciu na viacerých GPU: `Accelerator.split_between_processes()`. Je založená na `torch.distributed`, ale používa sa oveľa jednoduchšie.

Pozrime sa, ako môžeme túto novú funkciu použiť s LLaMA. Kód bude napísaný s predpokladom, že máte váhy LLaMA uložené vo formáte [Hugging Face Transformers](https://huggingface.co/docs/transformers/main/model_doc/llama).

Najprv importujte potrebné moduly a inicializujte tokenizér a model.

```python
from transformers import LlamaForCausalLM, LlamaTokenizer
from accelerate import Accelerator

accelerator = Accelerator()

MODEL_PATH = "path-to-llama-model"

tokenizer = LlamaTokenizer.from_pretrained(MODEL_PATH)

model = LlamaForCausalLM.from_pretrained(MODEL_PATH, device_map="auto")
```

Všimnite si, že odovzdávame `device_map="auto"`. To umožňuje knižnici Accelerate rovnomerne rozložiť váhy modelu medzi dostupné GPU.

Ak by sme chceli, mohli by sme použiť `model.to(accelerator.device)`. Tým by sa model presunul na konkrétne GPU. `accelerator.device` bude pre každý paralelne bežiaci proces iné, takže jeden model môže byť načítaný na GPU 0, ďalší na GPU 1 atď. V tomto prípade však zostaneme pri `device_map="auto"`. Vďaka tomu môžeme používať väčšie modely, než by sa zmestili na jedno GPU.

Ďalej napíšeme kód na spustenie inferencie!

```python

data = [
    "a dog",
    "a cat",
    "a vole",
    "a bat",
    "a bird",
    "a fish",
    "a horse",
    "a cow",
    "a sheep",
    "a goat",
    "a pig",
    "a chicken",
]

# Accelerator automaticky rozdelí tieto dáta medzi jednotlivé bežiace procesy.
# Pole vyššie má 12 položiek. Takže ak by sme mali 4 procesy, každý proces
# by dostal priradené 3 reťazce ako prompty.

with accelerator.split_between_processes(data,) as prompts:
    for prompt in prompts:

        # presuň tensor na GPU, keďže musí byť na CUDA
        inputs = tokenizer(prompt, return_tensors="pt").to(accelerator.device)

        # inferencia
        generate_ids = model.generate(**inputs, max_length=30)

        # dekódovanie
        result = tokenizer.batch_decode(
            generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False
        )[0]

        # vypíš číslo procesu a výsledok inferencie
        print(
            f"Process {accelerator.process_index} - "
            + result.replace("\n", "\\n")
        )

```

Nakoniec už stačí len spustiť Accelerate pomocou Accelerate CLI:

```bash
accelerate launch --num_processes=4 script.py
```

Keď spustíme vyššie uvedený kód, na dostupné GPU sa načítajú 4 kópie modelu. Naše prompty sa rovnomerne rozdelia medzi 4 modely, čo výrazne zlepší výkon.

Výstup vyššie uvedeného kódu (po logoch z načítavania modelov) by mal vyzerať takto:

```text
Process 1 - a bathtub with a shower head a bathtub with a shower head bathtub with shower head and handheld
Process 0 - a dog's life, a dog's life, a dog's life, a dog's life, a dog's life
Process 1 - a bird in the hand is worth two in the bush.\na bird in the hand is worth two in the bush.\na bird in
Process 2 - a horse, a horse, my kingdom for a horse!\na horse, a horse, my kingdom for a horse!\na horse,
Process 3 - a goat, a sheep, a cow, a pig, a dog, a cat, a horse, a chicken, a du
Process 0 - a catastrophic event that will change the world forever.\nThe world is in the grip of a global pandemic.\nThe
Process 1 - a fishing trip to the Bahamas.\nI'm not sure if I'm going to be able to make it.\n
Process 2 - a coworker of mine is a big fan of the show and he's been trying to get me to watch it. I've
Process 3 - a piggy bank, a piggy bank, a piggy bank, a piggy bank, a piggy bank
Process 0 - a vole, a mouse, a shrew, a hamster, a gerbil, a guinea pig, a rabbit,
Process 2 - a sheep, a goat, a ram, a bullock, a he-lamb, a turtle-dove, and
Process 3 - a chicken in every pot, a car in every garage, a house in every backyard, a job for every man, a college
```

Dúfam, že vám to pomohlo! Ak vás to zaujíma, viac o Accelerate a distribuovanej inferencii sa dozviete v dokumentácii Accelerate [tu](https://huggingface.co/docs/accelerate/usage_guides/distributed_inference).