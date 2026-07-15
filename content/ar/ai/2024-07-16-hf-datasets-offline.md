---
title: "استخدام مجموعات بيانات HuggingFace دون اتصال بالإنترنت"
description: كيفية حفظ مجموعة بيانات من HuggingFace على القرص واستخدامها دون اتصال بالإنترنت
date: "2024-07-16"
tags: [ml/ai]
---

هذا أمر بسيط جدًا، لكنه مفيد جدًا إذا كنت تشغّل مهام على عقدة حوسبة لا يتوفر لها اتصال بالإنترنت.

على عقدة تسجيل الدخول أو على جهاز آخر متصل بالإنترنت، شغّل سكربت Python التالي:

```python
import datasets

x = datasets.load_dataset("my_dataset")

x.save_to_disk("./my_dataset_local")
```

ثم، إذا لزم الأمر، انسخ الملفات إلى الجهاز الذي يُشغّل مهمتك. والآن، من ذلك الجهاز غير المتصل، أصبح تحميل مجموعة البيانات بسيطًا!

```python
y = datasets.load_from_disk("./hellaswag_local")
y # DatasetDict({...})
```