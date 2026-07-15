---
title: Accelerate kontraŭ DeepSpeed kontraŭ FSDP
description: Kiun el ili vi uzu por distribuita trejnado?
date: "2023-08-29"
tags: [ml/ai]
---

## Enkonduko

Estas multaj malsamaj bibliotekoj kaj strategioj por distribuita trejnado. En ĉi tiu artikolo, ni rigardos tri el la plej popularaj: [Accelerate](https://huggingface.co/docs/accelerate/index), [DeepSpeed](https://www.deepspeed.ai/), kaj [FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/). Ni pritraktos la diferencojn inter ili, kaj kiam eble indas uzi unu prefere al la alia.

## Accelerate

[Accelerate](https://huggingface.co/docs/accelerate/index) estas populara biblioteko evoluigita kaj prizorgata de HuggingFace. Vi povas pensi pri ĝi kiel envolvaĵo ĉirkaŭ `torch.distributed`. Esence, ĝi ebligas al vi simple lanĉi trejnadon aŭ [inferencon](./multi-gpu-inference-with-accelerate) tra pluraj GPU-oj aŭ nodoj.

En sia plej baza formo, vi uzas Accelerate por inicializi PyTorch-modelon sur ĉiu GPU. Per nur kelkaj modifoj al via trejna ciklo, Accelerate prizorgos la datuman paraleligon por vi.

Se via modelo estas tro granda por maŝi sur unu sola GPU, vi povas uzi Accelerate por dividi la modelon inter pluraj GPU-oj, transdonante `device_map="auto"` al la metodo `from_pretrained` de transformers. Atentu — vi povas uzi `device_map="auto"` nur se vi rulas kun `num_processes=1`, ĉar vi inicializas nur unu modelon.

Se vi bezonas pli altnivelan modelan dispecigon (&quot;dispecigo&quot; rilatas al dividado de modelo inter aparatoj), vi povas uzi DeepSpeed aŭ FSDP kune kun Accelerate

## DeepSpeed

[DeepSpeed](https://www.deepspeed.ai/) ofertas la Zero Redundancy Optimizer (ZeRO). Ĝi nomiĝas „Zero Redundancy“, ĉar ĝi ebligas partigi modelon inter pluraj GPU-oj sen devi duobligi la parametrojn de la modelo en ĉiu GPU. Tio estas grandega avantaĝo, ĉar ĝi ebligas trejni modelojn pli grandajn ol la memoro de unu sola GPU.

Estas tri stadioj de ZeRO:

* **ZeRO Stage 1** partigas la statojn de la optimumigilo
* **ZeRO Stage 2** ankaŭ partigas gradientojn
* **ZeRO Stage 3** ankaŭ partigas parametrojn

Se vi ankoraŭ renkontas memorproblemojn, DeepSpeed permesas al vi transmeti la statojn de la optimumigilo, gradientojn kaj iujn modelajn pezojn al CPU-memoro aŭ NVMe-stokado. Tio nomiĝas &quot;**ZeRO-Infinity**&quot;, kaj — kvankam ĝi estas signife pli malrapida ol trejnado sen tia transmeto — ebligas trejnadon de vere grandegaj modeloj.

## FSDP

[FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/) signifas „Plene dispecigita datuma paraleligo“. Ĝi estis origine evoluigita de Facebook AI Research kaj publikigita en la biblioteko Fairscale, sed poste estis [rekte integrita en PyTorch](https://pytorch.org/blog/introducing-pytorch-fully-sharded-data-parallel-api/) en PyTorch-versio 1.11.

Ĝi esence faras la saman aferon kiel DeepSpeed ZeRO — administras la dispecigon de optimizilaj statoj, gradientoj kaj modelaj parametroj. Ĝi ankaŭ subtenas transŝarĝon al la CPU. Unu utila trajto estas, ke ĝi povas servi kiel rekta anstataŭaĵo por DistributedDataParallel.

## Resumo

* Accelerate estas envolvaĵo ĉirkaŭ `torch.distributed`, kiu ebligas al vi facile ruligi trejnadon aŭ inferencon tra pluraj GPU-oj aŭ nodoj. Ĝi ankaŭ povas esti uzata por simpla dispartigo de modelo, kaj bone funkcias kun kaj DeepSpeed kaj FSDP por pli progresintaj uzkazoj.
* DeepSpeed kaj FSDP estas du malsamaj realigoj de la sama ideo: dispecigi modelajn parametrojn, gradientojn kaj statojn de la optimumigilo tra pluraj GPU-oj. Ambaŭ subtenas malŝarĝon al CPU kaj povas esti uzataj kune kun Accelerate.