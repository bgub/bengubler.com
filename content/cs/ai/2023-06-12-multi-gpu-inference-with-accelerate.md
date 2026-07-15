---
title: Inference na více GPU pomocí Accelerate
description: Spouštějte inferenci rychleji tím, že budete prompty paralelně předávat více GPU.
date: "2023-06-12"
lastUpdated: "2024-06-24"
tags: [ml/ai]
archived: true
---

*AKTUALIZACE 2024: Informace v tomto článku mohou být zastaralé nebo nepřesné. Jak upozornil Alex Salinas v komentářích níže, tento kód by nejspíš měl používat torchpippy namísto split&#95;between&#95;processes.*

Historicky se distribuovanému trénování věnovala větší pozornost než distribuované inferenci. Koneckonců, trénování je výpočetně náročnější. Větším a složitějším velkým jazykovým modelům však může plnění úloh doplňování textu trvat dlouho. Ať už jde o výzkum, nebo o produkční nasazení, inferenci se vyplatí paralelizovat, abyste maximalizovali výkon.

Je důležité si uvědomit, že je rozdíl mezi rozdělením vah jednoho modelu mezi více GPU a rozdělením promptů nebo vstupů mezi více modelů. První možnost je poměrně jednoduchá, zatímco druhá (na kterou se zaměřím) je o něco složitější.

Před týdnem v [HuggingFace Accelerate](https://huggingface.co/docs/accelerate/index) ve verzi 0.20.0 přibyla funkce, která inference na více GPU výrazně zjednodušuje: `Accelerator.split_between_processes()`. Je založená na `torch.distributed`, ale používá se mnohem jednodušeji.

Podívejme se, jak můžeme tuto novou funkci použít s LLaMA. Kód bude napsaný s předpokladem, že jste váhy LLaMA uložili ve [formátu Hugging Face Transformers](https://huggingface.co/docs/transformers/main/model_doc/llama).

Nejprve naimportujte potřebné moduly a inicializujte tokenizér a model.

```python
from transformers import LlamaForCausalLM, LlamaTokenizer
from accelerate import Accelerator

accelerator = Accelerator()

MODEL_PATH = "path-to-llama-model"

tokenizer = LlamaTokenizer.from_pretrained(MODEL_PATH)

model = LlamaForCausalLM.from_pretrained(MODEL_PATH, device_map="auto")
```

Všimněte si, že předáváme `device_map="auto"`. To umožňuje knihovně Accelerate rovnoměrně rozložit váhy modelu mezi dostupná GPU.

Kdybychom chtěli, mohli bychom zavolat `model.to(accelerator.device)`. Tím by se model přesunul na konkrétní GPU. `accelerator.device` bude pro každý paralelně běžící proces jiný, takže byste mohli mít jeden model načtený na GPU 0, jiný na GPU 1 atd. V tomto případě ale zůstaneme u `device_map="auto"`. Díky tomu můžeme používat větší modely, než jaké by se vešly na jednu GPU.

Dále napíšeme kód pro spuštění inference!

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

# Accelerator automaticky rozdělí tato data mezi jednotlivé běžící procesy.
# Výše uvedené pole má 12 položek. Kdybychom tedy měli 4 procesy, každému procesu
# by byly přiřazeny 3 řetězce jako výzvy.

with accelerator.split_between_processes(data,) as prompts:
    for prompt in prompts:

        # přesunout tensor na GPU, protože musí být na CUDA
        inputs = tokenizer(prompt, return_tensors="pt").to(accelerator.device)

        # inference
        generate_ids = model.generate(**inputs, max_length=30)

        # dekódování
        result = tokenizer.batch_decode(
            generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False
        )[0]

        # vypsat číslo procesu a výsledek inference
        print(
            f"Process {accelerator.process_index} - "
            + result.replace("\n", "\\n")
        )

```

Nakonec už jen zbývá spustit Accelerate pomocí nástroje Accelerate CLI:

```bash
accelerate launch --num_processes=4 script.py
```

Když spustíme výše uvedený kód, na dostupné GPU se načtou 4 kopie modelu. Naše prompty se rovnoměrně rozdělí mezi všechny 4 modely, což výrazně zlepší výkon.

Výstup výše uvedeného kódu (po výpisech z načítání modelů) by měl vypadat takto:

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

Doufám, že vám to pomohlo! Pokud vás to zajímá, víc o Accelerate a distribuované inferenci najdete v dokumentaci Accelerate [zde](https://huggingface.co/docs/accelerate/usage_guides/distributed_inference).