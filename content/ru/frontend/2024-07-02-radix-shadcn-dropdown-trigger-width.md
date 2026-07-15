---
title: Как сделать выпадающее меню Radix той же ширины, что и триггер
description: Как сделать так, чтобы содержимое выпадающего меню Radix или shadcn совпадало по ширине с триггером.
date: "2024-07-02"
tags: [frontend]
---

На моём сайте используется [shadcn Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu), основанное на `DropdownMenuPrimitive` из Radix, чтобы пользователи могли менять текущую тему сайта.

По умолчанию содержимое выпадающего меню не совпадает по ширине с триггером. Меня это раздражало, поэтому я какое-то время искал решение. В итоге я нашёл ответ [в документации Radix](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#constrain-the-contentsub-content-size)!

Добавьте приведённый ниже код в свой CSS-файл (можно убрать обёртку `@layer utilities`, если вы не используете Tailwind):

```css
@layer utilities {
  .dropdown-content-width-full {
    width: var(--radix-dropdown-menu-trigger-width);
    max-height: var(--radix-dropdown-menu-content-available-height);
  }
}
```

Теперь измените свой `<DropdownMenuComponent>`, чтобы он выглядел так:

```jsx
<DropdownMenuContent align="end" className="dropdown-content-width-full">
```

Вуаля! Содержимое и триггер теперь одной ширины. Пожалуйста.