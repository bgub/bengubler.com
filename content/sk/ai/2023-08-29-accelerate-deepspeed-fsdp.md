---
title: Accelerate vs. DeepSpeed vs. FSDP
description: Ktorý z nich by ste mali použiť na distribuované trénovanie?
date: "2023-08-29"
tags: [ml/ai]
---

## Úvod

Existuje mnoho rôznych knižníc a stratégií na distribuované trénovanie. V tomto článku sa pozrieme na tri z najpopulárnejších: [Accelerate](https://huggingface.co/docs/accelerate/index), [DeepSpeed](https://www.deepspeed.ai/) a [FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/). Rozoberieme si, aké sú medzi nimi rozdiely a kedy sa vám môže viac hodiť jedna než druhá.

## Accelerate

[Accelerate](https://huggingface.co/docs/accelerate/index) je populárna knižnica, ktorú vyvíja a spravuje HuggingFace. Môžete si ju predstaviť ako nadstavbu nad `torch.distributed`. V podstate vám umožňuje jednoducho spúšťať tréning alebo [inferenciu](./multi-gpu-inference-with-accelerate) na viacerých GPU alebo uzloch.

V najjednoduchšej podobe použijete Accelerate na inicializáciu modelu PyTorch na každom GPU. Stačí spraviť len pár úprav v tréningovej slučke a Accelerate za vás zabezpečí dátový paralelizmus.

Ak je váš model príliš veľký na to, aby sa zmestil na jedno GPU, môžete pomocou Accelerate rozdeliť model medzi viacero GPU tak, že metóde `from_pretrained` z knižnice transformers odovzdáte `device_map="auto"`. Majte však na pamäti — `device_map="auto"` môžete použiť iba vtedy, ak bežíte s `num_processes=1`, pretože inicializujete len jeden model.

Ak potrebujete pokročilejšie shardovanie modelu („sharding“ označuje rozdelenie modelu medzi zariadenia), môžete spolu s Accelerate použiť DeepSpeed alebo FSDP

## DeepSpeed

[DeepSpeed](https://www.deepspeed.ai/) ponúka Zero Redundancy Optimizer (ZeRO). Nazýva sa „Zero Redundancy“, pretože vám umožňuje rozdeliť model medzi viacero GPU bez toho, aby ste museli replikovať parametre modelu na každom z nich. Je to veľká výhoda, pretože vďaka tomu môžete trénovať modely, ktoré sú väčšie než pamäť ktoréhokoľvek jedného GPU.

ZeRO má tri fázy:

* **ZeRO Stage 1** rozdeľuje stavy optimalizátora
* **ZeRO Stage 2** rozdeľuje aj gradienty
* **ZeRO Stage 3** rozdeľuje aj parametre

Ak stále narážate na problémy s pamäťou, DeepSpeed vám umožňuje presunúť stavy optimalizátora, gradienty a časť váh modelu do pamäte CPU alebo na úložisko NVMe. Nazýva sa to „**ZeRO-Infinity**“ a — hoci je to výrazne pomalšie než trénovanie bez presunu — umožňuje trénovať naozaj obrovské modely.

## FSDP

[FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/) znamená „Fully Sharded Data Parallel“. Pôvodne ho vyvinul Facebook AI Research a vydal v knižnici Fairscale, no vo verzii PyTorch 1.11 bola [natívna podpora pridaná priamo do PyTorch](https://pytorch.org/blog/introducing-pytorch-fully-sharded-data-parallel-api/).

V podstate robí to isté ako DeepSpeed ZeRO — stará sa o shardovanie stavov optimalizátora, gradientov a parametrov modelu. Podporuje aj presun na CPU. Užitočné je aj to, že môže slúžiť ako bezproblémová náhrada za DistributedDataParallel.

## Zhrnutie

* Accelerate je nadstavba nad `torch.distributed`, ktorý vám umožňuje jednoducho spúšťať trénovanie alebo inferenciu na viacerých GPU či uzloch. Dá sa použiť aj na jednoduché rozdelenie modelu a dobre funguje s DeepSpeed aj FSDP pri náročnejších scenároch použitia.
* DeepSpeed a FSDP sú dve odlišné implementácie tej istej myšlienky: shardovania parametrov modelu, gradientov a stavov optimalizátora medzi viaceré GPU. Obe podporujú aj presun na CPU a dajú sa používať spolu s Accelerate.