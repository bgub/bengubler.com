---
title: "Uzi HuggingFace-datumarojn senrete"
description: Kiel konservi HuggingFace-datumaron sur disko kaj uzi ĝin senrete
date: "2024-07-16"
tags: [ml/ai]
---

Tio estas sufiĉe simpla, sed tre utila, se vi rulas taskojn sur komputa nodo, kiu ne havas aliron al interreto.

Sur la ensaluta nodo aŭ alia maŝino kun aliro al interreto, rulu la jenan Python-kodon:

```python
import datasets

x = datasets.load_dataset("my_dataset")

x.save_to_disk("./my_dataset_local")
```

Poste, se necese, kopiu la dosierojn al la maŝino, sur kiu ruliĝas via tasko. Nun, sur tiu senkonekta maŝino, ŝargi la datumaron estas facile!

```python
y = datasets.load_from_disk("./hellaswag_local")
y # DatasetDict({...})
```