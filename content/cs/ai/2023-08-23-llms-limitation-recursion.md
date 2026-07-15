---
title: Velké jazykové modely nikdy nebudou schopné zvládat (složitou) matematiku
description: Protože současné architektury velkých jazykových modelů postrádají rekurzi, jsou v zásadě neschopné provádět některé matematické operace.
date: "2023-08-23"
lastUpdated: "2024-06-24"
tags: [ml/ai]
---

*AKTUALIZACE 2024: Jen pro upřesnění, tento článek se týká matematických operací, které ze své podstaty zahrnují více rekurzivních kroků, například umocňování. Jak ukázal [zajímavý výzkum](https://arxiv.org/abs/2405.17399v1), transformery se s několika úpravami dokážou poměrně dobře naučit základní aritmetiku. Přidání „scratchpadu“ může výkon modelu ještě zlepšit a může být vhodným řešením problémů zmíněných v tomto článku.*

## Problém

Velké jazykové modely mají v mnoha oblastech obrovský potenciál, ale většina současných modelů má jedno zásadní omezení: jejich struktura je čistě dopředná. To znamená, že data proudí lineárně od vstupu k výstupu, bez rekurze a bez možnosti vracet se zpět. Díky tomu je možné je trénovat neuvěřitelně rychle a efektivně pomocí gradientního sestupu a zpětného šíření chyby. Výpočty navíc lze provádět paralelně pomocí násobení matic.

Bohužel právě absence rekurze znemožňuje některé typy matematických operací. Vezměme si umocňování. ChatGPT si poradí s jednoduchými příklady na mocniny, ale když se ho zeptáte, kolik je X^Y pro vysoké hodnoty X nebo Y, začne být nepřesný.

Ačkoli lze umocňování rozložit na lineární posloupnost kroků, pro konečnou dopřednou neuronovou síť je nemožné zvládnout libovolnou rekurzivní operaci (tj. X^Y pro jakoukoli možnou hodnotu Y). Množství rekurze, které může velký jazykový model „simulovat“, je omezené počtem jeho parametrů a vrstev.

## Shrnutí

Nedostatek rekurze je vrozeným konstrukčním omezením současných velkých jazykových modelů ve stylu GPT, které jim brání provádět složité matematické operace. Faktem ale je, že ve většině případů použití velkých jazykových modelů to nevadí! I tak jsou výkonné a užitečné v celé řadě situací.

## Zajímavosti

Pořád je před námi ještě hodně práce, než opravdu porozumíme chování natrénovaných velkých jazykových modelů. Tady je něco fascinujícího, na co jsem narazil při psaní tohoto článku:

Když jsem se ChatGPT zeptal, kolik je 7^15, odpověděl **170,859,375**. Správný výsledek je **4,747,561,509,943**.

Ačkoli je tato odpověď zjevně nesprávná, **170,859,375** má jednu zajímavou vlastnost: lze ji rozložit na **(3^7)*(5^7)**. Zdá se, že model si „pod kapotou“ převedl **A^(B*C)** na **(B^A)*(C^A)**. Zajímalo by mě, proč se to děje!