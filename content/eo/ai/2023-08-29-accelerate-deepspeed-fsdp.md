---
title: Accelerate kontraŭ DeepSpeed kontraŭ FSDP
description: Kiun vi devus uzi por distribuita trejnado?
date: "2023-08-29"
tags: [ml/ai]
---

## Enkonduko

Estas multaj diversaj bibliotekoj kaj strategioj por distribuita trejnado. En ĉi tiu artikolo ni rigardos tri el la plej popularaj: [Accelerate](https://huggingface.co/docs/accelerate/index), [DeepSpeed](https://www.deepspeed.ai/), kaj [FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/). Ni diskutos pri la diferencoj inter ili kaj pri tio, kiam vi eble preferos uzi unu anstataŭ alian.

## Accelerate

[Accelerate](https://huggingface.co/docs/accelerate/index) estas populara biblioteko evoluigita kaj prizorgata de HuggingFace. Vi povas pensi pri ĝi kiel pri envolvaĵo ĉirkaŭ `torch.distributed`. Esence, ĝi ebligas al vi simple lanĉi trejnadon aŭ [inferencon](./multi-gpu-inference-with-accelerate) sur pluraj GPU-oj aŭ nodoj.

En sia plej baza formo, vi uzas Accelerate por inicializi PyTorch-modelon sur ĉiu GPU. Per nur kelkaj modifoj al via trejna buklo, Accelerate prizorgos datenan paralelecon por vi.

Se via modelo estas tro granda por mahti sur unu sola GPU, vi povas uzi Accelerate por dividi la modelon inter pluraj GPU-oj pasante `device_map="auto"` al la metodo `from_pretrained` de Transformers. Atentu — vi povas uzi `device_map="auto"` nur se vi rulas kun `num_processes=1`, ĉar vi inicializas nur unu modelon.

Se vi bezonas pli altnivelan dispecigon de la modelo („dispecigi“ rilatas al dividado de modelo inter aparatoj), vi povas uzi DeepSpeed aŭ FSDP kune kun Accelerate

## DeepSpeed

[DeepSpeed](https://www.deepspeed.ai/) ofertas la Zero Redundancy Optimizer (ZeRO). Ĝi nomiĝas „Zero Redundancy“, ĉar ĝi ebligas dispartigi modelon tra pluraj GPU-oj sen devi reprodukti la parametrojn de la modelo sur ĉiu GPU. Tio estas grandega avantaĝo, ĉar ĝi ebligas trejni modelojn pli grandajn ol la memoro de unuopa GPU.

Estas tri stadioj de ZeRO:

* **ZeRO Stage 1** dispartigas la statojn de la optimumigilo
* **ZeRO Stage 2** ankaŭ dispartigas la gradientojn
* **ZeRO Stage 3** ankaŭ dispartigas la parametrojn

Se vi ankoraŭ renkontas memorproblemojn, DeepSpeed ebligas transigi la statojn de la optimumigilo, la gradientojn kaj kelkajn modelajn pezojn al CPU-memoro aŭ NVMe-stokado. Tio nomiĝas „**ZeRO-Infinity**“, kaj — kvankam ĝi estas signife pli malrapida ol trejnado sen tia transigo — ebligas trejni vere grandegajn modelojn.

## FSDP

[FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/) signifas „Fully Sharded Data Parallel“. Ĝi estis origine evoluigita de Facebook AI Research kaj publikigita en la biblioteko Fairscale, sed denaska subteno estis [aldonita rekte al PyTorch](https://pytorch.org/blog/introducing-pytorch-fully-sharded-data-parallel-api/) en PyTorch-versio 1.11.

Ĝi esence faras la samon kiel DeepSpeed ZeRO — administras la dispecigon de la statoj de la optimumigilo, gradientoj kaj modelaj parametroj. Ĝi ankaŭ subtenas offload al CPU. Unu utila trajto estas, ke ĝi povas servi kiel tuja anstataŭaĵo por DistributedDataParallel.

## Resumo

* Accelerate estas envolvaĵo ĉirkaŭ `torch.distributed`, kiu ebligas al vi facile lanĉi trejnadon aŭ inferencon sur pluraj GPU-oj aŭ nodoj. Ĝi ankaŭ uzeblas por simpla dispartigo de modelo, kaj bone funkcias kun DeepSpeed kaj FSDP por pli altnivelaj uzoj.
* DeepSpeed kaj FSDP estas du malsamaj realigoj de la sama ideo: dispecigi modelajn parametrojn, gradientojn kaj statojn de la optimumigilo tra pluraj GPU-oj. Ambaŭ subtenas malŝarĝon al CPU kaj uzeblas kune kun Accelerate.