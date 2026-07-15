---
title: Velké jazykové modely nikdy nebudou schopné zvládat (složitější) matematiku
description: Protože v současných architekturách velkých jazykových modelů chybí rekurze, jsou v zásadě neschopné provádět některé matematické operace.
date: "2023-08-23"
lastUpdated: "2024-06-24"
tags: [ml/ai]
---

*AKTUALIZACE 2024: Jen pro upřesnění, tento článek se týká matematických operací, které ze své podstaty zahrnují více rekurzivních kroků, například umocňování. Jak ukázal [zajímavý výzkum](https://arxiv.org/abs/2405.17399v1), transformery se s několika úpravami dokážou poměrně dobře naučit základní aritmetiku. Přidání „scratchpadu“ může výkon modelu ještě zlepšit a může být dobrým řešením problémů zmíněných v tomto článku.*

## Problém

Velké jazykové modely mají obrovský potenciál v mnoha oblastech, ale většina současných modelů má jedno vrozené omezení: jejich struktura je čistě dopředná. To znamená, že data proudí lineárně od vstupu k výstupu, bez rekurze a bez možnosti vracet se zpět. Díky tomu je možné modely trénovat neuvěřitelně rychle a efektivně pomocí gradientního sestupu a zpětného šíření chyby. Výpočty navíc lze provádět paralelně pomocí násobení matic.

Jejich absence rekurze však bohužel způsobuje, že některé typy matematických operací jsou nemožné. Vezměme si například umocňování. ChatGPT si poradí s jednoduchými příklady na mocniny, ale když se ho zeptáte, kolik je X^Y pro vysoké hodnoty X nebo Y, začne být nepřesný.

I když lze operace s mocninami rozložit na lineární posloupnost, konečná dopředná neuronová síť nedokáže zpracovat libovolnou rekurzivní operaci (tj. X^Y pro libovolnou hodnotu Y). Množství rekurze, které dokáže velký jazykový model „simulovat“, je omezené počtem jeho parametrů a vrstev.

## Shrnutí

Nedostatek rekurze je vrozené konstrukční omezení současných velkých jazykových modelů ve stylu GPT, které jim brání provádět složité matematické operace. Faktem ale je, že ve většině případů použití velkých jazykových modelů na tom nezáleží! I tak jsou výkonné a užitečné v celé řadě situací.

## Zajímavosti

K pochopení chování natrénovaných velkých jazykových modelů je ještě potřeba udělat spoustu práce. Tady je jedna fascinující věc, na kterou jsem narazil při psaní tohoto článku:

Když jsem se ChatGPT zeptal, kolik je 7^15, odpověděl **170,859,375**. Správný výsledek je **4,747,561,509,943**.

I když je tahle odpověď očividně nesprávná, **170,859,375** má zajímavou vlastnost: lze ji rozložit na **(3^7)*(5^7)**. Vypadá to, že model si interně převedl **A^(B*C)** na **(B^A)*(C^A)**. Zajímalo by mě, proč se to děje!