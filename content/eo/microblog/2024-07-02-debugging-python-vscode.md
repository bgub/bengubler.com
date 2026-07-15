---
title: Sencimigado de Python en VSCode
description: Uzi la funkcion code.interact() por lanĉi interagan Python-interpretilon
date: "2024-07-02"
tags: [hazarda]
---

Oni diras, ke oni lernas ion novan ĉiutage, sed mi vere ŝokiĝis, kiam mi eksciis pri mirinda trajto de Python, pri kiu mi tute ne sciis.

Ŝajne, eblas paŭzigi la plenumadon de Python-dosiero kaj malfermi interagan terminalon kun la lokaj variabloj! Mi malkovris tion dum spektado de la video de Andrej Karpathy pri [rekreado de GPT-2](https://www.youtube.com/watch?v=l8pRSuU81PU) (kompreneble Karpathy konas tiajn hazardajn lertaĵojn.)

Simple metu `import code` ĉe la supro de via dosiero, poste enmetu `code.interact(local=locals())` ie ajn en via kodo. Jen! Kiam la plenumado atingos tiun punkton, Python-interpretilo malfermiĝos en la terminalo kun aliro al ĉiuj lokaj variabloj. Vi povas premi `CTRL+D` por fermi la interpretilon kaj daŭrigi la plenumadon, aŭ tajpi `quit()` por fermi la terminalon kaj ĉesigi la plenumadon.