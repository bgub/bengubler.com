---
title: Ladenie Pythonu vo VSCode
description: Použitie funkcie code.interact() na spustenie interaktívneho interpreta kódu
date: "2024-07-02"
tags: [random]
---

Hovorí sa, že každý deň sa človek naučí niečo nové, ale poriadne ma prekvapilo, keď som sa dozvedel o skvelej funkcii Pythonu, o ktorej som dovtedy vôbec netušil.

Zrejme sa dá pozastaviť vykonávanie Python súboru a otvoriť interaktívny terminál s lokálnymi premennými! Objavil som to pri sledovaní videa Andreja Karpathyho o [reprodukcii GPT-2](https://www.youtube.com/watch?v=l8pRSuU81PU) (na Karpathyho je typické, že pozná takéto náhodné triky).

Stačí na začiatok súboru pridať `import code` a potom vložiť `code.interact(local=locals())` na ľubovoľné miesto v kóde. Voilà! Keď vykonávanie dôjde do tohto bodu, v termináli sa otvorí interpreter Pythonu s prístupom ku všetkým lokálnym premenným. Interpreter môžete zavrieť stlačením `CTRL+D` a pokračovať vo vykonávaní, alebo zadať `quit()`, čím ukončíte terminál a zastavíte vykonávanie.