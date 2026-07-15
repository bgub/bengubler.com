---
title: LLM-oj neniam povos fari (komplikan) matematikon
description: Ĉar al nuntempaj LLM-arkitekturoj mankas rekursio, ili principe ne kapablas plenumi certajn matematikajn operaciojn.
date: "2023-08-23"
lastUpdated: "2024-06-24"
tags: [ml/ai]
---

*ĜISDATIGO 2024: Por klarigi, ĉi tiu artikolo temas pri matematikaj operacioj, kiuj esence implikas plurajn rekursajn paŝojn, kiel potencigon. Kiel montris [interesa esploro](https://arxiv.org/abs/2405.17399v1), Transformiloj povas lerni fari bazan aritmetikon sufiĉe bone kun kelkaj adaptoj. Aldono de &quot;scratchpad&quot; povas plue plibonigi la rendimenton de la modelo kaj eble estas bona ĉirkaŭvojo por la problemoj menciitaj en ĉi tiu artikolo.*

## La Problemo

LLM-oj havas grandegan potencialon en multaj kampoj, sed la plej multaj nuntempaj modeloj havas unu enecan limigon: ili estas strukture nur antaŭenfluaj. Tio signifas, ke datumoj fluas linie de enigo al eligo, sen rekursio aŭ retrospurado. Tio ebligas nekredeble rapidan kaj efikan trejnadon per gradienta descendo kaj retrodisvastigo. Kalkuloj povas esti farataj paralele per matrica multipliko.

Bedaŭrinde, ilia manko de rekursio igas neeblaj iujn specojn de matematikaj operacioj. Konsideru potencigon. ChatGPT povas trakti simplajn potencigajn taskojn, sed kiam oni demandas, kio estas X^Y ĉe altaj valoroj de X aŭ Y, ĝi fariĝas malpreciza.

Kvankam potencigaj operacioj povas esti disigitaj en linearan sinsekvon, estas neeble por finhava, antaŭenflua neŭra reto trakti ajnan eblan rekursian operacion (t.e. X^Y kun ajna ebla valoro de Y). La kvanto de rekursio, kiun LLM povas „simuli“, estas limigita de la nombro de ĝiaj parametroj kaj tavoloj.

## Resumo

La manko de rekursio estas eneca dezajna limigo de nunaj GPT-stilaj LLM-oj, kiu malebligas al ili plenumi komplikajn matematikajn operaciojn. Sed fakte tio ne gravas en plej multaj uzokazoj por LLM-oj! Ili daŭre estas potencaj kaj helpemaj en tre vasta gamo da situacioj.

## Amuzaj Aferoj

Ankoraŭ restas multe da laboro por kompreni la konduton de trejnitaj grandaj lingvaj modeloj. Jen io fascina, kion mi trovis dum verkado de ĉi tiu artikolo:

Kiam mi demandis al ChatGPT, kiom estas 7^15, ĝi donis la respondon **170,859,375**. La ĝusta respondo estas **4,747,561,509,943**.

Kvankam la respondo evidente estas malĝusta, **170,859,375** havas unikan econ: ĝi malkomponiĝas en la faktorojn **(3^7)*(5^7)**. Ŝajnas, ke la modelo interne transformis **A^(B*C)** en **(B^A)*(C^A)**. Mi ŝatus scii, kial tio okazas!