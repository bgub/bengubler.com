---
title: Accelerate vs. DeepSpeed vs. FSDP
description: Ktorý by ste mali použiť na distribuované trénovanie?
date: "2023-08-29"
tags: [ml/ai]
---

## Úvod

Existuje mnoho rôznych knižníc a stratégií na distribuované trénovanie. V tomto článku sa pozrieme na tri z najpopulárnejších: [Accelerate](https://huggingface.co/docs/accelerate/index), [DeepSpeed](https://www.deepspeed.ai/) a [FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/). Pozrieme sa na rozdiely medzi nimi aj na to, kedy sa vám môže viac hodiť jedna alebo druhá.

## Accelerate

[Accelerate](https://huggingface.co/docs/accelerate/index) je populárna knižnica vyvíjaná a udržiavaná spoločnosťou HuggingFace. Môžete si ju predstaviť ako nadstavbu nad `torch.distributed`. V podstate vám umožňuje jednoducho spúšťať trénovanie alebo [inferenciu](./multi-gpu-inference-with-accelerate) na viacerých GPU alebo uzloch.

V najjednoduchšej podobe používate Accelerate na inicializáciu modelu PyTorch na každom GPU. Stačí urobiť len niekoľko úprav v tréningovej slučke a Accelerate za vás zabezpečí dátový paralelizmus.

Ak je váš model príliš veľký na to, aby sa zmestil na jedno GPU, môžete použiť Accelerate na rozdelenie modelu medzi viacero GPU tak, že metóde transformers `from_pretrained` odovzdáte `device_map="auto"`. Upozornenie: `device_map="auto"` môžete použiť len vtedy, ak ho spúšťate s `num_processes=1`, pretože inicializujete iba jeden model.

Ak potrebujete pokročilejšie shardovanie modelu („sharding“ označuje rozdelenie modelu medzi zariadenia), môžete spolu s Accelerate použiť DeepSpeed alebo FSDP

## DeepSpeed

[DeepSpeed](https://www.deepspeed.ai/) ponúka optimalizátor Zero Redundancy (ZeRO). Nazýva sa „Zero Redundancy“, pretože umožňuje rozdeliť model medzi viacero GPU bez nutnosti replikovať jeho parametre na každom GPU. Je to veľká výhoda, pretože vďaka tomu môžete trénovať modely, ktoré sú väčšie, než je pamäť ktoréhokoľvek jedného GPU.

ZeRO má tri fázy:

* **ZeRO Stage 1** rozdeľuje stavy optimalizátora
* **ZeRO Stage 2** navyše rozdeľuje gradienty
* **ZeRO Stage 3** navyše rozdeľuje parametre

Ak stále narážate na problémy s pamäťou, DeepSpeed umožňuje presunúť stav optimalizátora, gradienty a časť váh modelu do pamäte CPU alebo na úložisko NVMe. Toto sa nazýva &quot;**ZeRO-Infinity**&quot; a — hoci je to výrazne pomalšie než trénovanie bez presunu — umožňuje trénovať naozaj obrovské modely.

## FSDP

[FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/) znamená „Fully Sharded Data Parallel“. Pôvodne ho vyvinul Facebook AI Research a vydal v knižnici Fairscale, no natívna podpora bola [do PyTorch pridaná](https://pytorch.org/blog/introducing-pytorch-fully-sharded-data-parallel-api/) až vo verzii 1.11.

V podstate robí to isté ako DeepSpeed ZeRO — spravuje shardovanie stavov optimalizátora, gradientov a parametrov modelu. Podporuje aj presun na CPU. Jednou z jeho užitočných vlastností je, že môže slúžiť ako priama náhrada za DistributedDataParallel.

## Zhrnutie

* Accelerate je nadstavba nad `torch.distributed`, ktorá vám umožňuje jednoducho spúšťať trénovanie alebo inferenciu na viacerých GPU alebo uzloch. Dá sa použiť aj na jednoduché rozdelenie modelu a dobre funguje s DeepSpeed aj FSDP pri pokročilejších scenároch.
* DeepSpeed a FSDP sú dve odlišné implementácie tej istej myšlienky: rozdelenia parametrov modelu, gradientov a stavov optimalizátora medzi viacero GPU. Obe podporujú presun záťaže na CPU a dajú sa používať spolu s Accelerate.