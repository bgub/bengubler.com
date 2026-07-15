---
title: Accelerate vs. DeepSpeed vs. FSDP
description: Který z nich použít pro distribuované trénování?
date: "2023-08-29"
tags: [ml/ai]
---

## Úvod

Existuje mnoho různých knihoven a strategií pro distribuované trénování. V tomto článku se podíváme na tři z nejoblíbenějších: [Accelerate](https://huggingface.co/docs/accelerate/index), [DeepSpeed](https://www.deepspeed.ai/) a [FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/). Probereme si, jaké jsou mezi nimi rozdíly a kdy se vyplatí zvolit jednu místo druhé.

## Accelerate

[Accelerate](https://huggingface.co/docs/accelerate/index) je populární knihovna, kterou vyvíjí a spravuje HuggingFace. Můžete si ji představit jako wrapper nad `torch.distributed`. V zásadě vám umožňuje jednoduše spouštět trénování nebo [inferenci](./multi-gpu-inference-with-accelerate) na více GPU nebo uzlech.

V nejjednodušší podobě použijete Accelerate k inicializaci modelu PyTorch na každém GPU. Stačí jen udělat pár úprav v Training Loopu a Accelerate se za vás postará o datový paralelismus.

Pokud je váš model příliš velký na to, aby se vešel na jediné GPU, můžete s pomocí Accelerate rozdělit model mezi více GPU předáním `device_map="auto"` metodě `from_pretrained` z transformers. Jen pozor — `device_map="auto"` můžete použít pouze tehdy, když běžíte s `num_processes=1`, protože inicializujete jen jeden model.

Pokud potřebujete pokročilejší rozdělení modelu („rozdělení“ označuje rozdělení modelu mezi zařízení), můžete spolu s Accelerate použít DeepSpeed nebo FSDP

## DeepSpeed

[DeepSpeed](https://www.deepspeed.ai/) nabízí Zero Redundancy Optimizer (ZeRO). Říká se mu „Zero Redundancy“, protože umožňuje rozdělit model mezi více GPU, aniž by bylo nutné replikovat parametry modelu na každém GPU. To je obrovská výhoda, protože díky tomu můžete trénovat modely, které jsou větší než paměť kteréhokoli jednoho GPU.

ZeRO má tři fáze:

* **ZeRO Stage 1** rozděluje stavy optimalizátoru
* **ZeRO Stage 2** také rozděluje gradienty
* **ZeRO Stage 3** také rozděluje parametry

Pokud stále narážíte na problémy s pamětí, DeepSpeed umožňuje offloadovat stavy optimalizátoru, gradienty a některé váhy modelu do paměti CPU nebo na úložiště NVMe. To se nazývá &quot;**ZeRO-Infinity**&quot; a — přestože je to výrazně pomalejší než trénování bez offloadu — to umožňuje trénovat opravdu obrovské modely.

## FSDP

[FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/) znamená „Fully Sharded Data Parallel“. Původně ho vyvinul Facebook AI Research a vydal v rámci knihovny Fairscale, ale ve verzi PyTorch 1.11 byla [nativní podpora přidána přímo do PyTorch](https://pytorch.org/blog/introducing-pytorch-fully-sharded-data-parallel-api/).

V podstatě dělá totéž co DeepSpeed ZeRO — spravuje rozdělení stavů optimalizátoru, gradientů a parametrů modelu. Podporuje také offload na CPU. Jednou z užitečných vlastností je, že může sloužit jako přímá náhrada za DistributedDataParallel.

## Shrnutí

* Accelerate je wrapper nad `torch.distributed`, který vám umožňuje snadno spouštět trénování nebo inferenci na více GPU nebo uzlech. Lze ho také použít pro jednoduché rozdělení modelu a dobře funguje jak s DeepSpeed, tak s FSDP pro pokročilejší scénáře.
* DeepSpeed a FSDP jsou dvě různé implementace stejné myšlenky: rozdělení parametrů modelu, gradientů a stavů optimalizátoru mezi více GPU. Oba podporují offload na CPU a lze je používat společně s Accelerate.