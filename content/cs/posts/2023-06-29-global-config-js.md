---
title: Jeden konfigurační soubor nade všemi
description: JavaScriptové nástroje mají příliš mnoho konfiguračních souborů. Pojďme je sloučit.
date: "2023-06-29"
tags: [open-source]
was_llm_utilized: slightly
---

Moderní vývoj webu zahrnuje práci s řadou JS build toolů a frameworků, z nichž každý vyžaduje vlastní konfigurační soubory. Správa těchto konfiguračních souborů, jako jsou `.eslintrc`, `next.config.js` a `tailwind.config.js`, může být nepřehledná a časově náročná. V tomto blogovém příspěvku se podívám na myšlenku sloučit tyto konfigurační soubory do jediného souboru s názvem `global.config.js`, centralizovat konfiguraci projektu a omezit zbytečné rozptylování.

## Konfigurační soubory všude

Zrovna teď, když píšu tento příspěvek na blog, mám v kořenovém adresáři projektu soubory `.eslintrc.json`, `next.config.js`, `postcss.config.js`, `tailwind.config.js` a `tsconfig.json`. I když je moje konfigurace v zásadě úplně standardní a každý z těch souborů má méně než 30 řádků, zabírají cenné místo v postranním panelu VSCode a odvádějí pozornost od toho podstatného: od zdrojového kódu.

Můj případ zdaleka není nijak výjimečný. Některé jiné projekty používají konfiguračních souborů mnohem víc. Představte si, jak nepřehledný projekt může být, když přidáte `.babelrc`, `prettier.config.js`, `jest.config.js`, `cypress.json` atd.

## Řešení: `global.config.js`

Rád bych navrhl jednoduché řešení: sjednotit konfigurační soubory do jednoho souboru s názvem `global.config.js`. Konfigurace pro jednotlivé nástroje by byla uložená v exportovaném objektu pod klíčem pojmenovaným podle daného npm balíčku.

Projekty by ale stále měly umožňovat používat samostatné konfigurační soubory v případech, kdy je konfigurace rozsáhlá a složitá (např. `tsconfig.json`), nejdřív by však měly zkontrolovat, zda existuje `global.config.js` a zda obsahuje konfiguraci pro jejich nástroj.

Takto by mohl vypadat jednoduchý `global.config.js`:

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

## Ale co typy?

Doplňování typů lze pro `global.config.js` snadno zapnout přidáním definic typů do komentářů, stejně jako to už Tailwind a NextJS dělají ve svých konfiguračních souborech.

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

## Další kroky

Pokud se vám tenhle nápad líbí, pošlete PR do svého oblíbeného build toolu! Pokud ne, dejte mi na Twitteru vědět, proč. Nebo ne a prostě žijte dál.