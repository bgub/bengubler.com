---
title: الاستدلال متعدد الـGPU باستخدام Accelerate
description: شغّل الاستدلال بسرعة أكبر عبر تمرير الموجّهات إلى عدة وحدات GPU بالتوازي.
date: "2023-06-12"
lastUpdated: "2024-06-24"
tags: [ml/ai]
archived: true
---

*تحديث 2024: قد تكون المعلومات الواردة في هذا المقال قديمة أو غير دقيقة. وكما أشار Alex Salinas في التعليقات أدناه، فمن المرجّح أن هذا الكود كان ينبغي أن يستخدم torchpippy بدلًا من split&#95;between&#95;processes.*

تاريخيًا، حظي التدريب الموزّع باهتمام أكبر من الاستدلال الموزّع. ففي نهاية المطاف، يتطلب التدريب كلفةً حسابية أعلى. لكن نماذج اللغة الكبيرة (Large Language Models) الأكبر والأكثر تعقيدًا قد تستغرق وقتًا طويلًا لتنفيذ مهام إكمال النص. وسواء كان ذلك لأغراض البحث أو في بيئة الإنتاج، فمن المفيد موازاة الاستدلال لتحقيق أقصى أداء ممكن.

من المهم إدراك أن هناك فرقًا بين توزيع أوزان نموذج واحد على عدة وحدات GPU، وبين توزيع موجّهات النموذج أو مدخلاته على عدة نماذج. الخيار الأول بسيط نسبيًا، بينما الثاني (وهو ما سأركّز عليه) أكثر تعقيدًا قليلًا.

قبل أسبوع، في الإصدار 0.20.0، قدّمت [HuggingFace Accelerate](https://huggingface.co/docs/accelerate/index) ميزة تُبسّط الاستدلال متعدد الـGPU بشكل كبير: `Accelerator.split_between_processes()`. وهي مبنية على `torch.distributed`، لكنها أسهل بكثير في الاستخدام.

لنرَ كيف يمكننا استخدام هذه الميزة الجديدة مع LLaMA. سيُكتب الكود على افتراض أنك حفظت أوزان LLaMA بصيغة [Hugging Face Transformers](https://huggingface.co/docs/transformers/main/model_doc/llama).

أولًا، ابدأ باستيراد الوحدات المطلوبة وتهيئة المُجزِّئ والنموذج.

```python
from transformers import LlamaForCausalLM, LlamaTokenizer
from accelerate import Accelerator

accelerator = Accelerator()

MODEL_PATH = "path-to-llama-model"

tokenizer = LlamaTokenizer.from_pretrained(MODEL_PATH)

model = LlamaForCausalLM.from_pretrained(MODEL_PATH, device_map="auto")
```

لاحظ كيف نمرّر `device_map="auto"`. يتيح ذلك لـ Accelerate توزيع أوزان النموذج بالتساوي على وحدات GPU المتاحة.

إذا أردنا، يمكننا تشغيل `model.to(accelerator.device)`. سيؤدي ذلك إلى نقل النموذج إلى وحدة GPU محددة. ستكون `accelerator.device` مختلفة في كل عملية تعمل بالتوازي، لذا قد يكون لديك نموذج مُحمَّل على GPU 0، وآخر مُحمَّل على GPU 1، وهكذا. لكن في هذه الحالة، سنبقي على `device_map="auto"`. وهذا يتيح لنا استخدام نماذج أكبر مما يمكن أن تستوعبه وحدة GPU واحدة.

بعد ذلك، سنكتب الشيفرة البرمجية لإجراء الاستدلال!

```python

data = [
    "a dog",
    "a cat",
    "a vole",
    "a bat",
    "a bird",
    "a fish",
    "a horse",
    "a cow",
    "a sheep",
    "a goat",
    "a pig",
    "a chicken",
]

# سيقوم Accelerator تلقائيًا بتقسيم هذه البيانات بين كل عملية جارية.
# المصفوفة أعلاه تحتوي على 12 عنصرًا. فلو كان لدينا 4 عمليات، فستُخصَّص لكل عملية
# 3 سلاسل نصية كموجّهات.

with accelerator.split_between_processes(data,) as prompts:
    for prompt in prompts:

        # نقل الموتر إلى GPU، إذ يجب أن يكون على CUDA
        inputs = tokenizer(prompt, return_tensors="pt").to(accelerator.device)

        # الاستدلال
        generate_ids = model.generate(**inputs, max_length=30)

        # فك الترميز
        result = tokenizer.batch_decode(
            generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False
        )[0]

        # طباعة رقم العملية ونتيجة الاستدلال
        print(
            f"Process {accelerator.process_index} - "
            + result.replace("\n", "\\n")
        )

```

أخيرًا، لم يتبقَّ سوى تشغيل Accelerate باستخدام واجهة سطر أوامر Accelerate:

```bash
accelerate launch --num_processes=4 script.py
```

عندما نشغّل الشيفرة أعلاه، تُحمَّل 4 نسخ من النموذج على وحدات GPU المتاحة. وتُوزَّع الموجّهات الخاصة بنا بالتساوي على النماذج الأربعة، مما يحسّن الأداء بشكل ملحوظ.

يجب أن يبدو ناتج الشيفرة أعلاه (بعد السجلات الناتجة عن تحميل النماذج) كما يلي:

```text
Process 1 - a bathtub with a shower head a bathtub with a shower head bathtub with shower head and handheld
Process 0 - a dog's life, a dog's life, a dog's life, a dog's life, a dog's life
Process 1 - a bird in the hand is worth two in the bush.\na bird in the hand is worth two in the bush.\na bird in
Process 2 - a horse, a horse, my kingdom for a horse!\na horse, a horse, my kingdom for a horse!\na horse,
Process 3 - a goat, a sheep, a cow, a pig, a dog, a cat, a horse, a chicken, a du
Process 0 - a catastrophic event that will change the world forever.\nThe world is in the grip of a global pandemic.\nThe
Process 1 - a fishing trip to the Bahamas.\nI'm not sure if I'm going to be able to make it.\n
Process 2 - a coworker of mine is a big fan of the show and he's been trying to get me to watch it. I've
Process 3 - a piggy bank, a piggy bank, a piggy bank, a piggy bank, a piggy bank
Process 0 - a vole, a mouse, a shrew, a hamster, a gerbil, a guinea pig, a rabbit,
Process 2 - a sheep, a goat, a ram, a bullock, a he-lamb, a turtle-dove, and
Process 3 - a chicken in every pot, a car in every garage, a house in every backyard, a job for every man, a college
```

آمل أن يكون هذا مفيدًا! يمكنك الاطلاع على المزيد حول Accelerate والاستدلال الموزّع في التوثيق الخاص بـ Accelerate [هنا](https://huggingface.co/docs/accelerate/usage_guides/distributed_inference) إذا كنت مهتمًا.