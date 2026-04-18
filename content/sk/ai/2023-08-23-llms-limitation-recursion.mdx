---
title: Veľké jazykové modely (LLMs) nikdy nebudú schopné robiť (zložitú) matematiku
description: Keďže súčasným architektúram veľkých jazykových modelov (LLMs) chýba rekurzia, v princípe nedokážu vykonávať niektoré matematické operácie.
date: "2023-08-23"
lastUpdated: "2024-06-24"
tags: [ml/ai]
---

*AKTUALIZÁCIA 2024: Len na upresnenie, tento článok je o matematických operáciách, ktoré zo svojej podstaty zahŕňajú viacero rekurzívnych krokov, napríklad umocňovanie. Ako ukázal [zaujímavý výskum](https://arxiv.org/abs/2405.17399v1), transformery sa po určitých úpravách dokážu celkom dobre naučiť základnú aritmetiku. Pridanie „scratchpadu“ môže výkon modelu ešte zlepšiť a môže byť dobrým spôsobom, ako obísť problémy spomenuté v tomto článku.*

## Problém

Veľké jazykové modely (LLMs) majú obrovský potenciál v mnohých oblastiach, no väčšina súčasných modelov má jedno zásadné obmedzenie: ich štruktúra je výlučne dopredná. To znamená, že dáta prúdia lineárne od vstupu k výstupu, bez rekurzie a bez návratu k predchádzajúcim krokom. Vďaka tomu je možné mimoriadne rýchle a efektívne trénovanie pomocou gradientného zostupu a spätného šírenia chyby. Výpočty sa dajú vykonávať paralelne pomocou násobenia matíc.

Žiaľ, práve absencia rekurzie spôsobuje, že niektoré typy matematických operácií sú nemožné. Uvažujme napríklad o umocňovaní. ChatGPT si poradí s jednoduchými príkladmi s mocninami, ale keď sa ho spýtate, koľko je X^Y pri vysokých hodnotách X alebo Y, začne byť nepresný.

Hoci sa operácie s exponentmi dajú rozložiť na lineárnu postupnosť, konečná dopredná neurónová sieť nedokáže zvládnuť ľubovoľnú rekurzívnu operáciu (t. j. X^Y pre akúkoľvek možnú hodnotu Y). Miera rekurzie, ktorú dokáže veľký jazykový model (LLM) „simulovať“, je obmedzená počtom jeho parametrov a vrstiev.

## Zhrnutie

Nedostatok rekurzie je prirodzené konštrukčné obmedzenie dnešných veľkých jazykových modelov (LLMs) v štýle GPT, ktoré im bráni vykonávať zložité matematické operácie. Faktom však je, že vo väčšine prípadov použitia veľkých jazykových modelov (LLMs) to neprekáža! Stále sú výkonné a užitočné v širokej škále situácií.

## Zaujímavosti

Stále je pred nami ešte veľa práce, kým úplne pochopíme správanie natrénovaných veľkých jazykových modelov. Tu je niečo fascinujúce, na čo som narazil pri písaní tohto článku:

Keď som sa ChatGPT spýtal, koľko je 7^15, odpovedal **170,859,375**. Správny výsledok je **4,747,561,509,943**.

Hoci je táto odpoveď očividne nesprávna, **170,859,375** má jednu zaujímavú vlastnosť: dá sa rozložiť na **(3^7)*(5^7)**. Zdá sa, že model si na pozadí premenil **A^(B*C)** na **(B^A)*(C^A)**. Zaujímalo by ma, prečo sa to deje!