---
title: Multi-GPU-inferenco kun Accelerate
description: Rulu inferencon pli rapide, sendante promptojn paralele al pluraj GPU-oj.
date: "2023-06-12"
lastUpdated: "2024-06-24"
tags: [ml/ai]
archived: true
---

*ĜISDATIGO 2024: La informoj en ĉi tiu afiŝo eble estas malaktualaj aŭ malprecizaj. Kiel Alex Salinas atentigis en la subaj komentoj, ĉi tiu kodo verŝajne devus uzi torchpippy anstataŭ split&#95;between&#95;processes.*

Historie, pli da atento estis donita al distribuita trejnado ol al distribuita inferenco. Finfine, trejnado postulas pli da komputaj rimedoj. Tamen pli grandaj kaj pli kompleksaj LLM-oj povas bezoni longan tempon por plenumi tekstokompletigajn taskojn. Ĉu por esplorado aŭ en produktado, indas paraleligi inferencon por maksimumigi rendimenton.

Gravas rekoni, ke ekzistas diferenco inter distribui la pezojn de unu modelo tra pluraj GPU-oj kaj distribui promptojn aŭ enigojn tra pluraj modeloj. La unua estas relative simpla, dum la dua (sur kiu mi fokusos) estas iom pli komplika.

Antaŭ semajno, en versio 0.20.0, [HuggingFace Accelerate](https://huggingface.co/docs/accelerate/index) publikigis funkcion, kiu signife simpligas multi-GPU-inferencon: `Accelerator.split_between_processes()`. Ĝi baziĝas sur `torch.distributed`, sed estas multe pli facile uzebla.

Ni rigardu, kiel ni povas uzi ĉi tiun novan funkcion kun LLaMA. La kodo estos verkita sub la supozo, ke vi konservis la pezojn de LLaMA en la formato de [Hugging Face Transformers](https://huggingface.co/docs/transformers/main/model_doc/llama).

Unue, komencu per importado de la bezonataj moduloj kaj inicializado de la tokenizer kaj la modelo.

```python
from transformers import LlamaForCausalLM, LlamaTokenizer
from accelerate import Accelerator

accelerator = Accelerator()

MODEL_PATH = "path-to-llama-model"

tokenizer = LlamaTokenizer.from_pretrained(MODEL_PATH)

model = LlamaForCausalLM.from_pretrained(MODEL_PATH, device_map="auto")
```

Rimarku, ke ni uzas `device_map="auto"`. Tio permesas al Accelerate egale disdividi la pezojn de la modelo inter la disponeblaj GPU-oj.

Se ni volus, ni povus ruli `model.to(accelerator.device)`. Tio transigus la modelon al specifa GPU. `accelerator.device` estos malsama por ĉiu procezo rulata paralele, do eblus havi unu modelon ŝargita sur GPU 0, alian sur GPU 1, ktp. En ĉi tiu kazo, tamen, ni restos ĉe `device_map="auto"`. Tio permesas al ni uzi pli grandajn modelojn ol mahtus en unu sola GPU.

Poste ni skribos la kodon por fari inferencon!

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

# Accelerator aŭtomate dividos ĉi tiujn datumojn inter ĉiu rulanta procezo.
# La supra tabelo havas 12 erojn. Do se ni havus 4 procezojn, ĉiu procezo
# ricevus 3 ĉenojn kiel promptojn.

with accelerator.split_between_processes(data,) as prompts:
    for prompt in prompts:

        # movu la tensoron al GPU, ĉar ĝi devas esti sur CUDA
        inputs = tokenizer(prompt, return_tensors="pt").to(accelerator.device)

        # inferenco
        generate_ids = model.generate(**inputs, max_length=30)

        # deĉifrado
        result = tokenizer.batch_decode(
            generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False
        )[0]

        # presi la procezan numeron kaj la rezulton de inferenco
        print(
            f"Process {accelerator.process_index} - "
            + result.replace("\n", "\\n")
        )

```

Fine, restas nur lanĉi Accelerate per la CLI de Accelerate:

```bash
accelerate launch --num_processes=4 script.py
```

Kiam ni lanĉas la supran kodon, 4 kopioj de la modelo estas ŝargitaj sur la disponeblaj GPU-oj. Niaj prompts estas egale dividitaj inter la 4 modeloj, kio signife plibonigas la rendimenton.

La eligo de la supra kodo (post la protokolmesaĝoj pri la ŝargado de la modeloj) devus aspekti jene:

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

Mi esperas, ke tio estis utila! Vi povas lerni pli pri Accelerate kaj distribuita inferenco en la dokumentaro de Accelerate [ĉi tie](https://huggingface.co/docs/accelerate/usage_guides/distributed_inference), se tio interesas vin.