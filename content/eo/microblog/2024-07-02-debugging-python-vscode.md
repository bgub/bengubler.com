---
title: Sencimigi Python en VSCode
description: Uzado de la funkcio `code.interact()` por lanĉi interagan kodinterpretilon
date: "2024-07-02"
tags: [random]
---

Oni diras, ke oni lernas ion novan ĉiutage, sed mi estis ŝokita ekscii pri mirinda Python-trajto, pri kiu mi tute ne sciis.

Ŝajne, vi povas paŭzigi la plenumon de Python-dosiero kaj malfermi interagan terminalon kun la lokaj variabloj! Mi malkovris tion dum mi spektis la filmeton de Andrej Karpathy pri [reproduktado de GPT-2](https://www.youtube.com/watch?v=l8pRSuU81PU) (kompreneble Karpathy konas tiajn hazardajn lertaĵojn.)

Simple metu `import code` ĉe la supro de via dosiero, poste enmetu `code.interact(local=locals())` ie ajn en via kodo. Jen! Kiam la plenumo atingos tiun punkton, Python-interpretilo malfermiĝos en la terminalo kun aliro al ĉiuj lokaj variabloj. Vi povas premi `CTRL+D` por fermi la interpretilon kaj daŭrigi la plenumon, aŭ tajpi `quit()` por forlasi la interpretilon kaj ĉesigi la plenumon.