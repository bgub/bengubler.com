---
title: Veľké jazykové modely (LLMs) nikdy nebudú schopné zvládnuť (zložitú) matematiku
description: Keďže súčasným architektúram veľkých jazykových modelov (LLMs) chýba rekurzia, v zásade nedokážu vykonávať niektoré matematické operácie.
date: "2023-08-23"
lastUpdated: "2024-06-24"
tags: [ml/ai]
---

*AKTUALIZÁCIA 2024: Len na upresnenie, tento príspevok je o matematických operáciách, ktoré zo svojej podstaty zahŕňajú viacero rekurzívnych krokov, napríklad umocňovanie. Ako ukázal [zaujímavý výskum](https://arxiv.org/abs/2405.17399v1), Transformery sa s niekoľkými úpravami dokážu pomerne dobre naučiť základnú aritmetiku. Pridanie „scratchpadu“ môže výkon modelu ešte zlepšiť a môže byť dobrým riešením problémov spomenutých v tomto článku.*

## Problém

Veľké jazykové modely (LLMs) majú obrovský potenciál v mnohých oblastiach, no väčšina súčasných modelov má jedno prirodzené obmedzenie: ich štruktúra je čisto feed-forward. To znamená, že dáta prúdia lineárne od vstupu k výstupu, bez rekurzie či návratu späť. Vďaka tomu sa dajú trénovať neuveriteľne rýchlo a efektívne pomocou gradient descent a backpropagation. Výpočty sa dajú vykonávať paralelne pomocou násobenia matíc.

Bohužiaľ, práve absencia rekurzie spôsobuje, že niektoré typy matematických operácií sú nemožné. Zoberme si umocňovanie. ChatGPT si poradí s jednoduchými príkladmi na mocniny, no keď sa ho spýtate, koľko je X^Y pri vysokých hodnotách X alebo Y, začne byť nepresný.

Hoci sa dajú operácie umocňovania rozložiť na lineárnu postupnosť, pre konečnú feed-forward neurónovú sieť je nemožné zvládnuť ľubovoľnú rekurzívnu operáciu (t. j. X^Y pri akejkoľvek možnej hodnote Y). Miera rekurzie, ktorú dokáže LLM „simulovať“, je obmedzená počtom jeho parametrov a vrstiev.

## Zhrnutie

Nedostatok rekurzie je prirodzeným konštrukčným obmedzením súčasných veľkých jazykových modelov (LLMs) v štýle GPT, ktoré im bráni vykonávať zložité matematické operácie. Faktom však je, že vo väčšine prípadov použitia veľkých jazykových modelov (LLMs) na tom nezáleží! Stále sú výkonné a užitočné v širokej škále situácií.

## Zaujímavosti

Stále je pred nami veľa práce, ak chceme lepšie porozumieť správaniu natrénovaných veľkých jazykových modelov. Pri písaní tohto článku som narazil na niečo fascinujúce:

Keď som sa spýtal ChatGPT, koľko je 7^15, odpovedal **170,859,375**. Správny výsledok je **4,747,561,509,943**.

Hoci je táto odpoveď očividne nesprávna, **170,859,375** má jednu zaujímavú vlastnosť: dá sa rozložiť na **(3^7)*(5^7)**. Zdá sa, že model si „v zákulisí“ premenil **A^(B*C)** na **(B^A)*(C^A)**. Zaujímalo by ma, prečo sa to deje!