---
title: Ako nastaviť Radix Dropdown na rovnakú šírku ako jeho spúšťač
description: Ako nastaviť, aby obsah rozbaľovacej ponuky Radix alebo shadcn mal rovnakú šírku ako spúšťač.
date: "2024-07-02"
tags: [frontend]
---

Na mojej webovej stránke používam [shadcn Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu) (postavené na Radix `DropdownMenuPrimitive`), aby si používatelia mohli meniť aktuálnu tému webu.

Predvolene nemá obsah rozbaľovacej ponuky rovnakú šírku ako jej spúšťač. Prekážalo mi to, a tak som chvíľu hľadal riešenie. Nakoniec som našiel odpoveď [v dokumentácii Radixu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#constrain-the-contentsub-content-size)!

Do svojho CSS súboru vložte nasledujúci kód (ak nepoužívate Tailwind, obal `@layer utilities` môžete odstrániť):

```css
@layer utilities {
  .dropdown-content-width-full {
    width: var(--radix-dropdown-menu-trigger-width);
    max-height: var(--radix-dropdown-menu-content-available-height);
  }
}
```

Teraz upravte svoj `<DropdownMenuComponent>` tak, aby vyzeral takto:

```jsx
<DropdownMenuContent align="end" className="dropdown-content-width-full">
```

Voila! Obsah aj spúšťač majú rovnakú šírku. Niet za čo.