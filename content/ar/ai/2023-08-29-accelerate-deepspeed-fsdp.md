---
title: Accelerate مقابل DeepSpeed مقابل FSDP
description: أيّها يجب أن تستخدمه للتدريب الموزّع؟
date: "2023-08-29"
tags: [ml/ai]
---

## المقدمة

هناك العديد من المكتبات والاستراتيجيات المختلفة للتدريب الموزع. في هذه المقالة، سنستعرض ثلاثًا من أشهرها: [Accelerate](https://huggingface.co/docs/accelerate/index)، و[DeepSpeed](https://www.deepspeed.ai/)، و[FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/). وسنناقش الفروق بينها، ومتى قد تفضّل استخدام إحداها بدلًا من الأخرى.

## Accelerate

تُعد [Accelerate](https://huggingface.co/docs/accelerate/index) مكتبة شائعة طوّرتها وتُشرف على صيانتها HuggingFace. ويمكنك اعتبارها غلافًا لـ `torch.distributed`. وببساطة، تتيح لك تشغيل التدريب أو [الاستدلال](./multi-gpu-inference-with-accelerate) عبر عدة وحدات GPU أو عُقد.

في أبسط حالاتها، تستخدم Accelerate لتهيئة نموذج PyTorch على كل وحدة GPU. وبإجراء بضعة تعديلات بسيطة على Training Loop، ستتولى Accelerate التعامل مع توازي البيانات نيابةً عنك.

إذا كان نموذجك كبيرًا جدًا بحيث لا يتسع له أي GPU واحد، فيمكنك استخدام Accelerate لتقسيم النموذج على عدة وحدات GPU عبر تمرير `device_map="auto"` إلى الدالة `from_pretrained` في transformers. لكن انتبه — لا يمكنك استخدام `device_map="auto"` إلا عند التشغيل مع `num_processes=1`، لأنك في هذه الحالة لا تهيّئ سوى نموذج واحد.

إذا كنت بحاجة إلى تقسيم أكثر تقدّمًا للنموذج (يشير &quot;تقسيم&quot; إلى تقسيم النموذج عبر الأجهزة)، فيمكنك استخدام DeepSpeed أو FSDP إلى جانب Accelerate

## DeepSpeed

يوفّر [DeepSpeed](https://www.deepspeed.ai/) مُحسِّن انعدام التكرار (ZeRO). وسُمّي &quot;انعدام التكرار&quot; لأنه يتيح لك تقسيم النموذج عبر عدة وحدات GPU من دون الحاجة إلى تكرار معلَمات النموذج على كل وحدة GPU. وهذه ميزة كبيرة جدًا، لأنها تتيح لك تدريب نماذج أكبر من سعة ذاكرة أي وحدة GPU واحدة.

هناك ثلاث مراحل لـ ZeRO:

* **ZeRO Stage 1** يقسّم حالات المُحسِّن
* **ZeRO Stage 2** يقسّم أيضًا التدرّجات
* **ZeRO Stage 3** يقسّم أيضًا المعلَمات

إذا كنت لا تزال تواجه مشكلات في الذاكرة، فإن DeepSpeed يتيح لك نقل حالة المُحسِّن والتدرّجات وبعض أوزان النموذج إلى ذاكرة CPU أو وحدة تخزين NVMe. ويُسمّى هذا &quot;**ZeRO-Infinity**&quot;، ورغم أنه أبطأ بكثير من التدريب من دون نقل، فإنه يتيح تدريب نماذج ضخمة بحق.

## FSDP

يرمز [FSDP](https://engineering.fb.com/2021/07/15/open-source/fsdp/) إلى &quot;التوازي الكامل للبيانات مع التقسيم&quot;. طوّرته في الأصل Facebook AI Research وأطلقته ضمن مكتبة Fairscale، لكن [أُضيف له دعم مدمج مباشرةً في PyTorch](https://pytorch.org/blog/introducing-pytorch-fully-sharded-data-parallel-api/) في الإصدار 1.11 من PyTorch.

وهو يؤدي عمليًا المهمة نفسها التي يؤديها DeepSpeed ZeRO — أي إدارة تقسيم حالات المُحسِّن، والتدرجات، ومعلَمات النموذج. كما يدعم النقل إلى CPU. ومن ميزاته المفيدة أيضًا أنه يمكن استخدامه كبديل مباشر لـ DistributedDataParallel.

## الملخص

* Accelerate هو غلاف لـ `torch.distributed` يتيح لك تشغيل التدريب أو الاستدلال بسهولة عبر عدة وحدات GPU أو عُقد. ويمكن استخدامه أيضًا لتقسيم النماذج بشكل بسيط، كما يعمل جيدًا مع كلٍّ من DeepSpeed وFSDP في حالات الاستخدام الأكثر تقدمًا.
* يُعدّ كلٌّ من DeepSpeed وFSDP تنفيذين مختلفين للفكرة نفسها: تقسيم معلَمات النموذج والتدرّجات وحالات المُحسِّن عبر عدة وحدات GPU. وكلاهما يدعم النقل إلى CPU ويمكن استخدامه بالاقتران مع Accelerate.