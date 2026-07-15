---
title: إعادة إنشاء Alpaca باستخدام فئة Trainer من Hugging Face
description: الضبط الدقيق لـ Llama-2-7B باستخدام مجموعة بيانات Alpaca وTrainer من Hugging Face
date: "2023-11-07"
tags: [ml/ai, open-source]
---

*تحديث 2024: قد يكون الكود الوارد في هذا المقال قديمًا. أنصح بالاطلاع على [توثيق Hugging Face Trainer](https://huggingface.co/docs/transformers/v4.41.3/en/trainer) للحصول على أحدث المعلومات.*

## المقدمة

في مارس من هذا العام (2023)، أطلق أحد مختبرات ستانفورد مشروعًا صغيرًا سرعان ما أصبح مؤثرًا للغاية — [Alpaca](https://crfm.stanford.edu/2023/03/13/alpaca.html). استخدم المؤلفون `text-davinci-003` (وهو نموذج InstructGPT من OpenAI) لتوليد مجموعة بيانات تضم 52 ألف مثال من الموجّهات والاستجابات، ثم أجروا ضبطًا دقيقًا لـ Llama-7B باستخدام أزواج الموجّهات والاستجابات تلك.

وجاءت النتيجة جيدة على نحو مفاجئ — إذ تمكن Alpaca من التفاعل مع المستخدمين بطريقة مشابهة لنماذج InstructGPT من OpenAI، رغم انخفاض تكلفة تدريبه وعدم اعتماده على مجموعة بيانات تدريب من إعداد بشري. في هذا المقال، سنكتب شيفرة لتدريب نموذجنا الخاص من الصفر باستخدام مجموعة بيانات Alpaca.

*تعتمد الشيفرة في هذا المقال على الشيفرة الموجودة في [مستودع Alpaca](https://github.com/tatsu-lab/stanford_alpaca)، لكنني آمل أن تكون أبسط وأسهل فهمًا. ويعود كامل الفضل إلى المؤلفين الأصليين للورقة البحثية.*

## الإعداد

ستحتاج إلى تثبيت `torch` و`transformers` و`datasets` و`accelerate`. ويُعد `wandb` خيارًا رائعًا إذا أردت تتبّع خسارة التدريب مع مرور الوقت. وبالطبع، ستحتاج إلى بعض وحدات معالجة الرسومات (GPU) الجيدة إذا كنت تريد أن يتدرّب نموذجك بسرعة.

ابدأ بإنشاء مجلد رئيسي باسم `alpaca-repro`، مع مجلدين فرعيين: أحدهما باسم `trainer`، حيث سيوضع كود التدريب، والآخر باسم `finetunes`، حيث سنحفظ نموذجك المضبوط بدقة.

## الخطوة 1: تحميل البيانات ومعالجتها

ضع كل الشيفرة في هذا القسم داخل `trainer/get_data.py`.

سنبدأ بتحميل [بيانات Alpaca](https://huggingface.co/datasets/tatsu-lab/alpaca) من Hub الخاص بـ Hugging Face. يجب تحويل كل زوج من السؤال/الموجّه في مجموعة البيانات إلى سلسلة نصية واحدة يمكننا تدريب النموذج عليها، لكننا نُنشئ في الواقع سلسلة إضافية هي: `source`، ونستخدمها لاحقًا لتجاهل التسميات حتى لا يتدرّب نموذجنا على التعليمات.

```python
from datasets import load_dataset

original_dataset = load_dataset("tatsu-lab/alpaca")["train"]

template_no_context = """Below is an instruction that describes a task. \
Write a response that appropriately completes the request.

### Instruction:
{instruction}

### Response:
"""

template_context = """Below is an instruction that describes a task. \
Write a response that appropriately completes the request.

### Instruction:
{instruction}

### Input:
{input}

### Response:
"""

def data_to_string(data):

    instruction = data["instruction"]
    context = data["input"]
    response = data["output"]

    template = template_context if len(context) > 0 else template_no_context
    source = template.format(instruction=instruction, input=context)

    return {
        "source": source,
        "text": source + response,
    }


dataset = original_dataset.map(
    data_to_string
).remove_columns(['instruction', 'input', 'output'])
```

هنا نقسّم البيانات لنتمكن لاحقًا من استخدام 10% للتقييم والاختبار.

```python
processed_dataset = dataset.train_test_split(test_size=0.1)

train_dataset = processed_dataset["train"]
eval_dataset = processed_dataset["test"]
```

أخيرًا، نعرّف مُجمِّع بيانات لاستخدامه في حلقة التدريب. تذكّر أن كل سلسلة `text` تتكوّن فقط من `source` مضافًا إليها الاستجابة. لذلك نُرمِّز سلسلة `source` لمعرفة عدد التسميات في سلسلة `text` التي يجب تجاهلها.

```python
IGNORE_TOKEN = -100

def data_collator(features, tokenizer):
    sources = [feature["source"] for feature in features]
    targets = [feature["text"] for feature in features]

    source_tokens = tokenizer(
        sources,
        return_tensors="pt",
        padding='longest',
        max_length=None,
    )

    target_tokens = tokenizer(
        targets,
        return_tensors="pt",
        padding='longest',
        max_length=None,
    )

    labels = target_tokens["input_ids"].clone()

    for i in range(len(labels)):
        source_len = source_tokens["attention_mask"][i].sum()

        labels[i, :source_len] = IGNORE_TOKEN

    res = {
        "input_ids": target_tokens["input_ids"],
        "attention_mask": target_tokens["attention_mask"],
        "labels": labels,
    }

    return res
```

## الخطوة 2: كتابة حلقة التدريب

ضع كل الشيفرة في هذا القسم داخل `trainer/loop.py`.

هذا الكود واضح إلى حدٍّ كبير، لذا اكتفيتُ بإرفاقه ببعض التعليقات التوضيحية.

```python
from transformers import LlamaForCausalLM, LlamaTokenizer, Trainer, TrainingArguments
from accelerate import Accelerator
from get_data import train_dataset, eval_dataset, data_collator

accelerator = Accelerator()

MODEL_PATH = "meta-llama/Llama-2-7b-hf" # مسار Llama على Hugging Face Hub
OUTPUT_DIR = "../finetunes/alpaca-7b" # مكان حفظ النموذج المضبوط دقيقًا

tokenizer = LlamaTokenizer.from_pretrained(MODEL_PATH, legacy=False)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right" # لا يُضبط افتراضيًا، وهذا أمر غريب

model = LlamaForCausalLM.from_pretrained(
    MODEL_PATH, device_map="auto"
)

training_args = TrainingArguments(
    output_dir='checkpoints', # المكان الذي سيحفظ فيه Trainer نقاط تفتيش النموذج
    num_train_epochs=1, # ابدأ بعدد حقب منخفض للاختبار
    learning_rate=2e-5,
    logging_steps=10,
    per_device_train_batch_size=8,
    remove_unused_columns=False,
    save_steps=1000,
    save_total_limit=1,
    report_to="wandb",
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    tokenizer=tokenizer,
    data_collator=lambda x: data_collator(x, tokenizer),
)

trainer.train()
trainer.evaluate()

model.save_pretrained(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)
```

## الخطوة 3: تشغيل حلقة التدريب

أنشئ `trainer/accelerate_config.yaml`، ثم الصق الإعداد التالي:

```yaml
compute_environment: LOCAL_MACHINE
deepspeed_config: {}
distributed_type: "NO"
downcast_bf16: "no"
machine_rank: 0
main_process_ip: null
main_process_port: null
main_training_function: main
mixed_precision: "no"
num_machines: 1
num_processes: 1
use_cpu: false
```

ثم انتقل إلى `./trainer` باستخدام `cd` ثم شغّل:

```bash
accelerate launch --config_file accelerate_config.yaml loop.py
```

قد يستغرق حفظ النموذج والأوزان بعض الوقت، لذا يُرجى التحلي بالصبر!

## الخطوة 4: اختبار نموذجنا المضبوط بدقة!

كتبتُ سكربتًا بسيطًا لتحميل نموذجنا المضبوط بدقة والتفاعل معه! لا يدعم المحادثات التي تحتفظ بالسياق، لكنه طريقة رائعة لرؤية كيفية عمل النموذج.

أنشئ ملفًا جديدًا باسم `alpaca-repro/model_test.py`، ثم شغّل `python3 model_test.py`.

```python
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

template = """Below is an instruction that describes a task. \
Write a response that appropriately completes the request.

### Instruction:
{instruction}

### Response:
"""

model_path = "./finetunes/alpaca-7b"

tokenizer = AutoTokenizer.from_pretrained(model_path, legacy=False)
tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "right"

model = AutoModelForCausalLM.from_pretrained(
    model_path, device_map="auto", local_files_only=True
)

pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    return_full_text=False,
    do_sample=True,
    temperature=0.9,
    max_new_tokens=200,
)

def prompt_model():
    prompt = input("Enter your question: ")
    prompt = template.format(instruction=prompt)
    answer = pipe(prompt)
    print(answer[0]["generated_text"])

while True:
    prompt_model()
```

## الخلاصة

آمل أن تكون هذه المقالة مفيدة وثرية بالمعلومات! وأخطط خلال الأيام القليلة المقبلة لمتابعتها بشرح لكيفية استخدام FSDP مع Hugging Face Trainer.

إذا شعرت ببعض الالتباس أثناء المتابعة، فإليك Gist يحتوي على الشيفرة النهائية للمشروع: https://gist.github.com/bgub/1da2c0064d53decf197a304267799708