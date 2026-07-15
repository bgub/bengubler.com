---
title: Jeden konfigurační soubor, který vládne všem
description: JavaScriptové nástroje mají příliš mnoho konfiguračních souborů. Pojďme je sloučit.
date: "2023-06-29"
tags: [open-source]
was_llm_utilized: slightly
---

Moderní webový vývoj zahrnuje práci s řadou JS build nástrojů a frameworků, z nichž každý vyžaduje vlastní konfigurační soubory. Správa těchto konfiguračních souborů, jako jsou `.eslintrc`, `next.config.js` a `tailwind.config.js`, může být nepraktická a časově náročná. V tomto příspěvku se podívám na možnost sloučit tyto konfigurační soubory do jediného souboru s názvem `global.config.js`, centralizovat tak konfiguraci projektu a omezit zbytečné rozptylování.

## Konfigurační soubory všude

Zatímco píšu tento blogový post, v kořenovém adresáři projektu mám `.eslintrc.json`, `next.config.js`, `postcss.config.js`, `tailwind.config.js` a `tsconfig.json`. I když je moje konfigurace víceméně výchozí a každý soubor má méně než 30 řádků, zabírají tyto soubory cenné místo v postranním panelu VSCode a odvádějí pozornost od toho podstatného: od zdrojového kódu.

Můj případ zdaleka není nijak výjimečný. Některé jiné projekty používají konfiguračních souborů mnohem víc. Představte si, jak nepřehledný projekt může být, když přidáte `.babelrc`, `prettier.config.js`, `jest.config.js`, `cypress.json` atd.

## Řešení: `global.config.js`

Chtěl bych navrhnout jednoduché řešení: sloučit konfigurační soubory do jednoho souboru s názvem `global.config.js`. Konfigurace pro každý nástroj by byla uložená v exportovaném objektu pod klíčem pojmenovaným podle příslušného npm balíčku.

Projekty by stále měly umožňovat používat samostatné konfigurační soubory v případech, kdy je konfigurace rozsáhlá a složitá (např. `tsconfig.json`), ale nejdřív by měly zkontrolovat, jestli existuje `global.config.js` a jestli obsahuje konfiguraci pro daný nástroj.

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

Doplňování typů lze v `global.config.js` snadno povolit přidáním typových definic do komentářů, stejně jako to už ve svých konfiguračních souborech dělají Tailwind a NextJS.

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

Jestli se vám tenhle nápad líbí, pošlete PR do svého oblíbeného build nástroje! Pokud ne, dejte mi na Twitteru vědět proč. Nebo taky ne a prostě žijte dál.