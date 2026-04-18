---
title: Accelerate أم DeepSpeed أم FSDP
description: أيّها ينبغي استخدامه في التدريب الموزّع؟
date: "2023-08-29"
tags: [ml/ai]
---

## المقدمة

توجد العديد من المكتبات والاستراتيجيات المختلفة للتدريب الموزّع. في هذه المقالة، سنستعرض ثلاثة من أكثرها شيوعًا: [Accelerate](https://huggingface.co/docs/accelerate/index)، و[DeepSpeed](https://www.deepspeed.ai/)، و[FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/). وسنناقش الفروق بينها، ومتى قد تفضّل استخدام أحدها بدلًا من الآخر.

## Accelerate

تُعد [Accelerate](https://huggingface.co/docs/accelerate/index) مكتبة شائعة طوّرتها وتديرها HuggingFace. ويمكنك اعتبارها غلافًا لـ `torch.distributed`. وبشكل أساسي، تتيح لك تشغيل التدريب أو [الاستدلال](./multi-gpu-inference-with-accelerate) بسهولة عبر عدة وحدات GPU أو عُقد.

في أبسط حالاته، تُستخدم Accelerate لتهيئة نموذج PyTorch على كل وحدة GPU. وبإجراء بضعة تعديلات فقط على حلقة التدريب، ستتولى Accelerate تنفيذ توازي البيانات نيابةً عنك.

إذا كان نموذجك كبيرًا جدًا بحيث لا يتسع على أي وحدة GPU واحدة، فيمكنك استخدام Accelerate لتقسيم النموذج عبر عدة وحدات GPU من خلال تمرير `device_map="auto"` إلى الدالة `from_pretrained` في transformers. لكن انتبه — لا يمكنك استخدام `device_map="auto"` إلا إذا كنت تعمل مع `num_processes=1`، لأنك لا تهيّئ سوى نموذج واحد.

إذا كنت بحاجة إلى تجزئة أكثر تقدمًا للنموذج (تشير &quot;التجزئة&quot; إلى تقسيم النموذج عبر الأجهزة)، فيمكنك استخدام DeepSpeed أو FSDP إلى جانب Accelerate

## DeepSpeed

يوفّر [DeepSpeed](https://www.deepspeed.ai/) محسّن Zero Redundancy Optimizer ‏(ZeRO). وسُمّي &quot;Zero Redundancy&quot; لأنه يتيح لك توزيع النموذج على عدة وحدات GPU من دون الحاجة إلى تكرار معلَمات النموذج على كل وحدة GPU. وهذه ميزة كبيرة جدًا، لأنها تتيح لك تدريب نماذج أكبر من سعة الذاكرة المتاحة في أي وحدة GPU واحدة.

هناك ثلاث مراحل في ZeRO:

* **ZeRO Stage 1** يوزّع حالات المُحسّن
* **ZeRO Stage 2** يوزّع التدرجات أيضًا
* **ZeRO Stage 3** يوزّع المعلَمات أيضًا

إذا كنت لا تزال تواجه مشكلات في الذاكرة، فإن DeepSpeed يتيح لك نقل حالة المُحسّن والتدرجات وبعض أوزان النموذج إلى ذاكرة CPU أو وحدة تخزين NVMe. ويُسمّى هذا &quot;**ZeRO-Infinity**&quot;، وعلى الرغم من أنه أبطأ بكثير من التدريب من دون هذا النقل، فإنه يتيح تدريب نماذج ضخمة بحق.

## FSDP

[FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/) هو اختصار لعبارة &quot;Fully Sharded Data Parallel&quot;. طوّرته في الأصل Facebook AI Research وأطلقته ضمن مكتبة Fairscale، ثم أُضيف [دعم أصلي له في PyTorch](https://pytorch.org/blog/introducing-pytorch-fully-sharded-data-parallel-api/) بدءًا من الإصدار 1.11 من PyTorch.

وهو يؤدي عمليًا المهمة نفسها التي يؤديها DeepSpeed ZeRO — أي إدارة تجزئة حالات المُحسِّن والتدرجات ومعلَمات النموذج. كما يدعم أيضًا نقل إلى CPU. ومن ميزاته المفيدة أنه يمكن استخدامه كبديل مباشر لـ DistributedDataParallel.

## الملخص

* Accelerate هو طبقة تغليف حول `torch.distributed` تتيح لك بسهولة تشغيل التدريب أو الاستدلال عبر عدة وحدات GPU أو عُقد. ويمكن استخدامه أيضًا لتقسيم النموذج بشكل بسيط، كما يعمل جيدًا مع كلٍّ من DeepSpeed وFSDP في حالات الاستخدام الأكثر تقدمًا.
* DeepSpeed وFSDP هما تنفيذان مختلفان للفكرة نفسها: توزيع معلَمات النموذج والتدرجات وحالات المُحسِّن عبر عدة وحدات GPU. وكلاهما يدعم النقل إلى CPU ويمكن استخدامهما مع Accelerate.