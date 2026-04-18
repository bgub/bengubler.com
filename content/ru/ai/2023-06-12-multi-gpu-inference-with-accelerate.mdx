---
title: Инференс на нескольких GPU с Accelerate
description: Ускорьте инференс, параллельно распределяя промпты по нескольким GPU.
date: "2023-06-12"
lastUpdated: "2024-06-24"
tags: [ml/ai]
archived: true
---

*ОБНОВЛЕНИЕ 2024: Информация в этой публикации может быть устаревшей или неточной. Как отметил Alex Salinas в комментариях ниже, в этом коде, скорее всего, следует использовать torchpippy вместо split&#95;between&#95;processes.*

Исторически распределённому обучению уделялось больше внимания, чем распределённому инференсу. В конце концов, обучение требует больше вычислительных ресурсов. Однако более крупным и сложным большим языковым моделям (LLMs) может требоваться много времени на задачи дополнения текста. И в исследованиях, и в продакшене полезно распараллеливать инференс, чтобы выжать максимум производительности.

Важно понимать, что распределение весов одной модели по нескольким GPU — это не то же самое, что распределение промптов или входных данных между несколькими моделями. Первый вариант относительно прост, тогда как второй (на котором я и сосредоточусь) немного сложнее.

Неделю назад, в версии 0.20.0, в [HuggingFace Accelerate](https://huggingface.co/docs/accelerate/index) появилась функция, которая значительно упрощает инференс на нескольких GPU: `Accelerator.split_between_processes()`. Она основана на `torch.distributed`, но пользоваться ею гораздо проще.

Давайте посмотрим, как можно использовать эту новую возможность с LLaMA. Код написан в расчёте на то, что вы уже сохранили веса LLaMA в [формате Hugging Face Transformers](https://huggingface.co/docs/transformers/main/model_doc/llama).

Для начала импортируем нужные модули и инициализируем токенизатор и модель.

```python
from transformers import LlamaForCausalLM, LlamaTokenizer
from accelerate import Accelerator

accelerator = Accelerator()

MODEL_PATH = "path-to-llama-model"

tokenizer = LlamaTokenizer.from_pretrained(MODEL_PATH)

model = LlamaForCausalLM.from_pretrained(MODEL_PATH, device_map="auto")
```

Обратите внимание, что мы передаём `device_map="auto"`. Это позволяет Accelerate равномерно распределить веса модели по доступным GPU.

При желании мы могли бы вызвать `model.to(accelerator.device)`. Это переместило бы модель на конкретный GPU. `accelerator.device` будет разным для каждого параллельно выполняющегося процесса, так что одну модель можно загрузить на GPU 0, другую — на GPU 1 и так далее. Однако в этом случае мы оставим `device_map="auto"`. Это позволяет использовать более крупные модели, чем те, что поместились бы на одном GPU.

Далее мы напишем код для инференса!

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

# Accelerator автоматически разделит эти данные между запущенными процессами.
# Массив выше содержит 12 элементов. Если бы у нас было 4 процесса, каждому
# было бы назначено по 3 строки в качестве промптов.

with accelerator.split_between_processes(data,) as prompts:
    for prompt in prompts:

        # перемещаем тензор на GPU, так как он должен находиться на CUDA
        inputs = tokenizer(prompt, return_tensors="pt").to(accelerator.device)

        # инференс
        generate_ids = model.generate(**inputs, max_length=30)

        # декодирование
        result = tokenizer.batch_decode(
            generate_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False
        )[0]

        # выводим номер процесса и результат инференса
        print(
            f"Process {accelerator.process_index} - "
            + result.replace("\n", "\\n")
        )

```

Наконец, остаётся только запустить Accelerate через CLI Accelerate:

```bash
accelerate launch --num_processes=4 script.py
```

Когда мы запускаем приведённый выше код, на доступные GPU загружаются 4 копии модели. Наши запросы равномерно распределяются между этими 4 моделями, что значительно повышает производительность.

Вывод приведённого выше кода (после сообщений в логе о загрузке моделей) должен выглядеть так:

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

Надеюсь, это было полезно! Если вам интересно, подробнее об Accelerate и распределённом инференсе можно узнать в документации Accelerate [здесь](https://huggingface.co/docs/accelerate/usage_guides/distributed_inference).