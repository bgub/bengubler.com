---
title: "Používanie datasetov HuggingFace offline"
description: Ako uložiť dataset HuggingFace na disk a používať ho offline
date: "2024-07-16"
tags: [ml/ai]
---

Je to celkom jednoduché, ale veľmi užitočné, ak spúšťate úlohy na výpočtovom uzle bez prístupu na internet.

Na prihlasovacom uzle alebo na inom počítači s prístupom na internet spustite nasledujúci kód v Pythone:

```python
import datasets

x = datasets.load_dataset("my_dataset")

x.save_to_disk("./my_dataset_local")
```

Potom, ak treba, skopírujte súbory do počítača, na ktorom beží vaša úloha. Načítanie datasetu z tohto offline počítača je potom jednoduché!

```python
y = datasets.load_from_disk("./hellaswag_local")
y # DatasetDict({...})
```