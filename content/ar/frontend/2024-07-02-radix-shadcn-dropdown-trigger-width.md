---
title: جعل قائمة Radix المنسدلة بنفس عرض المشغّل
description: كيفية جعل محتوى القائمة المنسدلة في Radix أو shadcn يطابق عرض المشغّل.
date: "2024-07-02"
tags: [frontend]
---

يستخدم موقعي [قائمة shadcn المنسدلة](https://ui.shadcn.com/docs/components/dropdown-menu) (المبنية على `DropdownMenuPrimitive` من Radix) لتمكين المستخدمين من تغيير سمة الموقع الحالية.

بشكل افتراضي، لا يكون محتوى مكوّن القائمة المنسدلة بنفس عرض المشغّل. وقد أزعجني ذلك، لذا أمضيت بعض الوقت أبحث عن حل. وأخيرًا، وجدت الإجابة [في توثيق Radix](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#constrain-the-contentsub-content-size)!

ضع الكود أدناه في ملف CSS لديك (يمكنك إزالة غلاف `@layer utilities` إذا لم تكن تستخدم Tailwind):

```css
@layer utilities {
  .dropdown-content-width-full {
    width: var(--radix-dropdown-menu-trigger-width);
    max-height: var(--radix-dropdown-menu-content-available-height);
  }
}
```

الآن، عدّل `<DropdownMenuComponent>` ليصبح بهذا الشكل:

```jsx
<DropdownMenuContent align="end" className="dropdown-content-width-full">
```

ها قد تم! أصبح المحتوى والمُشغِّل بالعرض نفسه. على الرحب والسعة.