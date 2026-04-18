---
title: Accelerate vs. DeepSpeed vs. FSDP
description: Který z nich použít pro distribuované trénování?
date: "2023-08-29"
tags: [ml/ai]
---

## Úvod

Existuje mnoho různých knihoven a strategií pro distribuované trénování. V tomto článku se podíváme na tři z nejoblíbenějších: [Accelerate](https://huggingface.co/docs/accelerate/index), [DeepSpeed](https://www.deepspeed.ai/) a [FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/). Probereme, čím se od sebe liší, a kdy se vám může hodit jedna spíš než druhá.

## Accelerate

[Accelerate](https://huggingface.co/docs/accelerate/index) je populární knihovna vyvíjená a udržovaná společností HuggingFace. Můžete si ji představit jako nadstavbu nad `torch.distributed`. V podstatě vám umožňuje jednoduše spouštět trénování nebo [inferenci](./multi-gpu-inference-with-accelerate) napříč více GPU nebo uzly.

V nejzákladnější podobě se Accelerate používá k inicializaci modelu PyTorch na každém GPU. Stačí udělat několik úprav v trénovací smyčce a Accelerate se za vás postará o datový paralelismus.

Pokud je váš model příliš velký na to, aby se vešel na jedno GPU, můžete pomocí Accelerate rozdělit model mezi více GPU předáním `device_map="auto"` metodě `from_pretrained` z knihovny transformers. Upozornění — `device_map="auto"` můžete použít pouze tehdy, když běžíte s `num_processes=1`, protože inicializujete jen jeden model.

Pokud potřebujete pokročilejší shardování modelu („sharding“ znamená rozdělení modelu mezi zařízení), můžete spolu s Accelerate použít DeepSpeed nebo FSDP

## DeepSpeed

[DeepSpeed](https://www.deepspeed.ai/) nabízí Zero Redundancy Optimizer (ZeRO). Říká se mu „Zero Redundancy“, protože umožňuje rozdělit model mezi více GPU, aniž by bylo nutné replikovat parametry modelu na každé GPU. To je obrovská výhoda, protože díky tomu můžete trénovat modely, které jsou větší, než kolik paměti má kterákoli jednotlivá GPU.

ZeRO má tři fáze:

* **ZeRO Stage 1** rozděluje optimalizátor
* **ZeRO Stage 2** navíc rozděluje gradienty
* **ZeRO Stage 3** navíc rozděluje parametry

Pokud stále narážíte na problémy s pamětí, DeepSpeed umožňuje přesunout stav optimizéru, gradienty a část vah modelu do paměti CPU nebo na úložiště NVMe. Tomu se říká &quot;**ZeRO-Infinity**&quot; a — přestože je to výrazně pomalejší než trénování bez offloadu — to umožňuje trénovat opravdu obrovské modely.

## FSDP

[FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/) znamená „plně shardovaný datový paralelismus“. Původně ho vyvinula organizace Facebook AI Research a vydala ho v knihovně Fairscale, ale od verze 1.11 je [nativně podporován přímo v PyTorch](https://pytorch.org/blog/introducing-pytorch-fully-sharded-data-parallel-api/).

V zásadě dělá totéž co DeepSpeed ZeRO — spravuje shardování stavů optimalizátoru, gradientů a parametrů modelu. Podporuje také offload na CPU. Užitečné je i to, že může sloužit jako přímá náhrada za DistributedDataParallel.

## Shrnutí

* Accelerate je nadstavba nad `torch.distributed`, která vám umožňuje snadno spouštět trénování nebo inferenci na více GPU či uzlech. Dá se použít i pro jednoduché rozdělení modelu a dobře funguje jak s DeepSpeed, tak s FSDP pro pokročilejší scénáře.
* DeepSpeed a FSDP jsou dvě různé implementace stejné myšlenky: rozdělení parametrů modelu, gradientů a stavů optimalizátoru mezi více GPU. Oba podporují offload na CPU a lze je používat společně s Accelerate.