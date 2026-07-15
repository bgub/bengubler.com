---
title: Ladění Pythonu ve VSCode
description: Použití funkce code.interact() ke spuštění interaktivního interpretu
date: "2024-07-02"
tags: [random]
---

Říká se, že se člověk každý den naučí něco nového, ale dost mě překvapilo, když jsem zjistil, že Python má skvělou funkci, o které jsem vůbec nevěděl.

Ukázalo se, že můžete pozastavit běh Python souboru a otevřít interaktivní terminál s lokálními proměnnými! Narazil jsem na to při sledování videa Andreje Karpathyho o [znovuvytvoření GPT-2](https://www.youtube.com/watch?v=l8pRSuU81PU) (od Karpathyho člověk takovéhle náhodné fígle tak nějak čeká).

Stačí na začátek souboru přidat `import code` a pak kamkoli v kódu vložit `code.interact(local=locals())`. Voilà! Jakmile běh programu dojde do tohoto místa, v terminálu se otevře Python interpreter s přístupem ke všem lokálním proměnným. Interpreter můžete zavřít stisknutím `CTRL+D` a pokračovat v běhu programu, nebo zadat `quit()`, čímž ukončíte terminál a zastavíte běh programu.