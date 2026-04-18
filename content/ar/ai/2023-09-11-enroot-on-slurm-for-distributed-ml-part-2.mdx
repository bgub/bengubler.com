---
title: "Enroot على Slurm للتعلّم الآلي الموزّع: الجزء 2"
description: كيفية استخدام Enroot على Slurm للتدريب متعدد العُقد باستخدام الحاويات.
date: "2023-09-11"
tags: [ml/ai]
---

*تحديث 2024: لم أعد أوصي بهذه الطريقة، فقد واجهت معها عدة مشكلات. بدلًا من ذلك، أوصي باستخدام [Pyxis](https://github.com/NVIDIA/pyxis)، وهي أداة طوّرتها NVIDIA لتبسيط تشغيل الحاويات على أنظمة HPC*.&#95;

*هذا هو الجزء 2 من سلسلة من جزأين. يتوفر [الجزء 1](./enroot-on-slurm-for-distributed-ml-part-1) هنا.*

في [الجزء 1](./enroot-on-slurm-for-distributed-ml-part-1)، تناولنا كيفية استخدام Enroot على Slurm للتدريب *أحادي العقدة* باستخدام الحاويات عبر `salloc`. في هذا المقال، سنشرح كيفية استخدام Enroot على Slurm للتدريب *متعدد العُقد* باستخدام الحاويات، والانتقال إلى استخدام `sbatch`.

## الخطوة 1: سكربت تشغيل Slurm

سننشئ في النهاية عدة ملفات Bash، ويجب أن تكون جميعها في نفس الدليل الذي يوجد فيه سكربت التدريب الخاص بك. أولها سيكون ملف تشغيل لـ Slurm سنشغّله باستخدام `sbatch`. سيحتوي هذا الملف على الأوامر نفسها التي استخدمناها مع `salloc` في [الجزء 1](../enroot-on-slurm-for-distributed-ml-part-1)، ولكن مع تعريفها باستخدام توجيهات المعالجة `#SBATCH`.

`launch.sh`

```bash
#!/bin/bash
#SBATCH -J "JOBNAME"
#SBATCH --nodes=2
#SBATCH --gpus-per-node=8
#SBATCH --cpus-per-task=128
#SBATCH --mem=2000G
#SBATCH --time=72:00:00
#SBATCH --qos=<qos>

export CUR_DIR=$(pwd)
srun --nodes=2 stage1.sh
```

لاحظ أننا ننشئ متغيرًا باسم `CUR_DIR` لتخزين دليل العمل الحالي (أي الدليل الذي نُفِّذ فيه أمر `sbatch`). أستخدم هذا المتغير لمشاركة موقع دليل التدريب بين السكربتات، حتى لا أضطر إلى تثبيت المسارات داخل الشيفرة. لكنه ليس ضروريًا.

سيُمرِّر Slurm تلقائيًا متغيرات البيئة المحلية إلى الأمر `srun`، والذي سيشغّل السكربت `stage1.sh` على كل عقدة.

## الخطوة 2. سكربت تشغيل Enroot

بعد ذلك، سننشئ سكربتًا يُشغَّل على كل عقدة. سيتولى هذا السكربت تشغيل الحاوية وتنفيذ سكربت التدريب. سنسمّي هذا السكربت `stage1.sh`.

`stage1.sh`

```bash
#!/bin/bash

module load jq zstd pigz parallel libnvidia-container enroot

export MASTER_ADDR=$(scontrol show hostnames $SLURM_JOB_NODELIST | head -n 1) # الحصول على عنوان IP للعقدة الأولى في القائمة
export MASTER_PORT=6000 # تعيين المنفذ المستخدم للتواصل بين العقد

enroot create --name image-name /path/to/image-name.sqsh

enroot start --env SLURM_NODEID \
             --env MASTER_ADDR \
             --env MASTER_PORT \
             --env SLURM_JOB_NAME \
             --env CUR_DIR \
             --mount /local/file/path:/image/file/path \
             --rw image-name \
             bash ${CUR_DIR}/stage2.sh
```

لاحظ أننا نمرّر عدة متغيرات بيئة مهمة يوفّرها Slurm، بالإضافة إلى `CUR_DIR`، إلى داخل الحاوية. وتُستخدم المتغيرات `MASTER_ADDR` و`MASTER_PORT` من قِبل الواجهة الخلفية للتدريب الموزّع في PyTorch لتنسيق الاتصال بين العقد.

كما نربط مسار ملف محليًا داخل الحاوية (تأكّد من أنه يحتوي على سكربت التدريب الخاص بك!).

## الخطوة 3. سكربت التدريب

أخيرًا، سننشئ سكربتًا للتدريب سيُشغَّل داخل الحاوية. وسنسمّي هذا السكربت `stage2.sh`.

`stage2.sh`

```bash
#!/bin/bash

export NCCL_DEBUG=INFO # إذا أردت رؤية سجلات NCCL
export NODE_RANK=$SLURM_NODEID # تعيين رتبة العقدة وفق معرّف العقدة (0، 1، 2، إلخ)
echo NODE_RANK: $NODE_RANK # طباعة رتبة العقدة لأغراض التنقيح

# تشغيل سكربت التدريب
# ملاحظة: عدّل حسب الحاجة إذا لم تكن تستخدم accelerate

accelerate launch --config_file ./accelerate_config.yaml --main_process_ip=$MASTER_ADDR --main_process_port=$MASTER_PORT --machine_rank $NODE_RANK ${CUR_DIR}/loop.py
```

هنا استخدمت [accelerate](https://huggingface.co/docs/accelerate) كأداة تشغيل لسكربت التدريب الموزّع الخاص بي، لكن يمكنك استخدام أي أداة تشغيل تريدها. فقط تأكد من تمرير متغيرات البيئة ذات الصلة!

ولتمام الفائدة، إليك ملف `accelerate_config.yaml` الخاص بي. فهو يستخدم FSDP (Fully Sharded Data Parallel) لتوزيع معلمات النموذج والتدرجات على العمليات. وهذه طريقة رائعة لتدريب النماذج الكبيرة التي لا تتسع على GPU واحد فقط.

```yaml
compute_environment: LOCAL_MACHINE
deepspeed_config: {}
distributed_type: FSDP
downcast_bf16: "no"
fsdp_config:
  fsdp_auto_wrap_policy: TRANSFORMER_BASED_WRAP
  fsdp_backward_prefetch_policy: BACKWARD_PRE
  fsdp_offload_params: false
  fsdp_sharding_strategy: 1
  fsdp_state_dict_type: FULL_STATE_DICT
  fsdp_transformer_layer_cls_to_wrap: LlamaDecoderLayer
main_training_function: main
mixed_precision: "no"
num_machines: 2
num_processes: 16 # 8 وحدات GPU لكل عقدة * 2 عقدة = 16 عملية
use_cpu: false
```

## الخطوة 4. إرسال المهمة

الآن بعد أن أنشأنا جميع السكربتات اللازمة، يمكننا إرسال المهمة إلى Slurm باستخدام `sbatch`! من الدليل الذي يحتوي على هذه السكربتات، شغّل:

```bash
sbatch launch.sh
```

ستُرسَل مهمتك إلى Slurm وستُشغَّل بمجرد توفّر الموارد. وستُحفَظ سجلات الإخراج في `slurm-<jobid>.out` داخل الدليل الحالي.

## الخلاصة

آمل أن يكون هذا قد أفادك! هناك جوانب عديدة تدخل في تشغيل التدريب الموزّع، لكنه ليس صعبًا جدًا بمجرد تجاوز منحنى التعلّم في البداية.