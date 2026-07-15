---
title: ملف إعداد واحد يحكمها جميعًا
description: تمتلك أدوات JavaScript عددًا كبيرًا جدًا من ملفات الإعداد. لنجمعها في ملف واحد.
date: "2023-06-29"
tags: [open-source]
was_llm_utilized: slightly
---

يتطلب تطوير الويب الحديث العمل مع عدة أدوات بناء وأطر عمل لـ JS، ويحتاج كلٌّ منها إلى ملفات الإعداد الخاصة به. وقد تصبح إدارة ملفات الإعداد هذه، مثل `.eslintrc` و`next.config.js` و`tailwind.config.js`، مرهقة وتستهلك الكثير من الوقت. في هذا المقال، سأستكشف فكرة دمج ملفات الإعداد هذه في ملف واحد باسم `global.config.js`، لتجميع إعدادات المشروع في مكان واحد وتقليل عوامل التشتيت.

## ملفات الإعداد في كل مكان

بينما أكتب هذا المقال، يحتوي المجلد الجذر لمشروعي على `.eslintrc.json` و`next.config.js` و`postcss.config.js` و`tailwind.config.js` و`tsconfig.json`. ومع أن إعداداتي تكاد تكون افتراضية، وأن كل ملف منها لا يتجاوز 30 سطرًا، فإن هذه الملفات تشغل مساحة قيّمة في الشريط الجانبي لـ VSCode وتُشتّت الانتباه عمّا هو أهم: شيفرتي المصدرية.

وحالتي هذه ليست استثنائية على الإطلاق. فبعض المشاريع الأخرى تستخدم عددًا أكبر بكثير من ملفات الإعداد. تخيّل كم قد يبدو المشروع مزدحمًا عندما تضيف `.babelrc` و`prettier.config.js` و`jest.config.js` و`cypress.json` وما إلى ذلك.

## الحل: `global.config.js`

أودّ أن أقترح حلًا بسيطًا: جمع ملفات الإعداد في ملف يُسمّى `global.config.js`. وسيُحفَظ إعداد كل أداة في الكائن المُصدَّر، تحت مفتاح يحمل اسم حزمة npm.

يجب أن تظل المشاريع تسمح باستخدام ملفات إعداد منفصلة في الحالات التي يكون فيها الإعداد كبيرًا ومعقّدًا (مثل `tsconfig.json`)، لكن ينبغي لها أولًا التحقّق مما إذا كان `global.config.js` موجودًا، وما إذا كان إعداد الأداة موجودًا فيه.

إليك كيف قد يبدو ملف `global.config.js` بسيطًا:

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

## ولكن ماذا عن الأنواع؟

يمكن بسهولة تفعيل الإكمال التلقائي للأنواع في `global.config.js` عبر إضافة تعريفات الأنواع داخل التعليقات، كما يفعل Tailwind وNextJS بالفعل في ملفات الإعداد الخاصة بهما.

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

إذا أعجبتك هذه الفكرة، فافتح PR لأداة البناء المفضلة لديك! وإن لم تُعجبك، فأخبرني لماذا على تويتر. أو لا تفعل، وتابع حياتك فحسب.