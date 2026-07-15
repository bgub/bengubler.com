---
title: Kiel fari Radix-falmenuon samlarĝa kiel ĝia ekigilo
description: Kiel fari la enhavon de falmenuo de Radix aŭ shadcn samlarĝa kiel ĝia ekigilo.
date: "2024-07-02"
tags: [frontend]
---

Mia retejo uzas la [shadcn Dropdown Menu](https://ui.shadcn.com/docs/components/dropdown-menu) (bazitan sur la `DropdownMenuPrimitive` de Radix) por permesi al uzantoj ŝanĝi la nunan temon de la retejo.

Defaŭlte, la enhavo de falmenua komponanto ne estas samlarĝa kiel ĝia ekigilo. Tio ĝenis min, do mi pasigis iom da tempo serĉante solvon. Fine, mi trovis la respondon [en la dokumentaro de Radix](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#constrain-the-contentsub-content-size)!

Metu la suban kodon en vian CSS-dosieron (vi povas forigi la ĉirkaŭan `@layer utilities`, se vi ne uzas Tailwind):

```css
@layer utilities {
  .dropdown-content-width-full {
    width: var(--radix-dropdown-menu-trigger-width);
    max-height: var(--radix-dropdown-menu-content-available-height);
  }
}
```

Nun ŝanĝu vian `<DropdownMenuComponent>` tiel, ke ĝi aspektu jene:

```jsx
<DropdownMenuContent align="end" className="dropdown-content-width-full">
```

Jen! La enhavo kaj la aktivigilo havas la saman larĝon. Nedankinde.