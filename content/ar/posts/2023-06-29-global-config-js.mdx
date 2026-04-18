---
title: ملف إعداد واحد يحكمها جميعًا
description: لدى أدوات JavaScript عدد كبير جدًا من ملفات الإعداد. فلنُوحِّدها في ملف واحد.
date: "2023-06-29"
tags: [open-source]
was_llm_utilized: slightly
---

يتطلب تطوير الويب الحديث العمل مع العديد من أدوات وأطر بناء JavaScript، ولكل منها ملفات إعداد خاصة بها. وقد تصبح إدارة هذه الملفات، مثل `.eslintrc` و`next.config.js` و`tailwind.config.js`، مرهقة وتستنزف الكثير من الوقت. في هذا المقال، سأستعرض فكرة جمع ملفات الإعداد هذه في ملف واحد باسم `global.config.js`، لتوحيد إعدادات المشروع وتقليل المشتتات.

## ملفات الإعداد في كل مكان

بينما أكتب هذا المقال، يحتوي المجلد الجذري لمشروعي على `.eslintrc.json` و`next.config.js` و`postcss.config.js` و`tailwind.config.js` و`tsconfig.json`. ومع أن إعداداتي قريبة جدًا من الإعدادات الافتراضية، وأن كل ملف لا يتجاوز 30 سطرًا، فإن هذه الملفات تشغل مساحة قيّمة في الشريط الجانبي في VSCode وتشتّت الانتباه عمّا هو مهم: الشيفرة المصدرية.

وحالتي ليست استثنائية على الإطلاق. فبعض المشاريع الأخرى تستخدم عددًا أكبر بكثير من ملفات الإعداد. تخيّل كم قد يصبح المشروع مزدحمًا عندما تضيف `.babelrc` و`prettier.config.js` و`jest.config.js` و`cypress.json` وما إلى ذلك.

## الحل: `global.config.js`

أود أن أقترح حلًا بسيطًا: توحيد ملفات الإعداد في ملف يُسمّى `global.config.js`. سيُخزَّن إعداد كل أداة في الكائن المُصدَّر، تحت مفتاح يحمل اسم حزمة npm.

يجب أن تظل المشاريع تتيح استخدام ملفات إعداد منفصلة في الحالات التي يكون فيها الإعداد كبيرًا ومعقدًا (مثل `tsconfig.json`)، لكن ينبغي لها أولًا التحقق مما إذا كان `global.config.js` موجودًا وما إذا كان إعداد الأداة الخاصة بها موجودًا فيه.

إليك كيف قد يبدو ملف `global.config.js` بسيط:

```js
module.exports = {
  eslint: {
    extends: ["next/core-web-vitals"]
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  tailwindcss: {
    content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
      extend: {
        backgroundImage: {
          "gradient-radial": "radial-gradient(var(--tw-gradient-stops))"
        }
      }
    },
    plugins: [require("@tailwindcss/typography")]
  }
}
```

## لكن ماذا عن الأنواع؟

يمكن بسهولة تفعيل الإكمال التلقائي للأنواع في `global.config.js` بإضافة تعريفات الأنواع داخل التعليقات، كما يفعل Tailwind وNextJS بالفعل في ملفات الإعداد الخاصة بهما.

```js
module.exports = {
  // ...

  /** @type {import('tailwindcss').Config} */
  tailwindcss: {
    content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
      extend: {
        backgroundImage: {
          "gradient-radial": "radial-gradient(var(--tw-gradient-stops))"
        }
      }
    },
    plugins: [require("@tailwindcss/typography")]
  }
}
```

## الخطوات التالية

إذا أعجبتك هذه الفكرة، فأرسل PR إلى أداة البناء المفضلة لديك! وإذا لم تعجبك، فأخبرني بالسبب على تويتر. أو لا تفعل، وواصل حياتك ببساطة.