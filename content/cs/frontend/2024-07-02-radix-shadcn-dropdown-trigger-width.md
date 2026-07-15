---
title: Jak nastavit rozbalovací nabídku Radix na stejnou šířku jako její spouštěč
description: Jak zajistit, aby obsah rozbalovací nabídky Radix nebo shadcn měl stejnou šířku jako spouštěč.
date: "2024-07-02"
tags: [frontend]
---

Na svém webu používám [shadcn Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu) (postavené na `DropdownMenuPrimitive` od Radixu), aby si uživatelé mohli změnit aktuální motiv webu.

Ve výchozím nastavení není obsah rozbalovací nabídky stejně široký jako její spouštěč. Vadilo mi to, a tak jsem nějakou dobu hledal řešení. Nakonec jsem našel odpověď [v dokumentaci Radixu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#constrain-the-contentsub-content-size)!

Do souboru CSS vložte následující kód (pokud nepoužíváte Tailwind, obal `@layer utilities` můžete odstranit):

```css
@layer utilities {
  .dropdown-content-width-full {
    width: var(--radix-dropdown-menu-trigger-width);
    max-height: var(--radix-dropdown-menu-content-available-height);
  }
}
```

Teď upravte svůj `<DropdownMenuComponent>` takto:

```jsx
<DropdownMenuContent align="end" className="dropdown-content-width-full">
```

Hotovo! Obsah i spouštěč mají stejnou šířku. Není zač.