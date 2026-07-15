---
title: Jeden konfiguračný súbor, ktorý vládne všetkým
description: JavaScriptové nástroje majú príliš veľa konfiguračných súborov. Spojme ich.
date: "2023-06-29"
tags: [open-source]
was_llm_utilized: slightly
---

Moderný webový vývoj zahŕňa prácu s viacerými JS build nástrojmi a frameworkmi, pričom každý z nich vyžaduje vlastné konfiguračné súbory. Správa týchto konfiguračných súborov, ako sú `.eslintrc`, `next.config.js` a `tailwind.config.js`, môže byť neprehľadná a časovo náročná. V tomto príspevku sa pozriem na myšlienku zlúčiť tieto konfiguračné súbory do jedného súboru s názvom `global.config.js`, čím by sa centralizovala konfigurácia projektu a obmedzilo zbytočné rozptyľovanie.

## Konfiguračné súbory všade navôkol

Keď píšem tento príspevok, môj koreňový adresár projektu obsahuje `.eslintrc.json`, `next.config.js`, `postcss.config.js`, `tailwind.config.js` a `tsconfig.json`. Hoci je moja konfigurácia v podstate štandardná a každý súbor má menej ako 30 riadkov, tieto súbory zaberajú cenné miesto v bočnom paneli VS Code a odvádzajú pozornosť od toho podstatného: zdrojového kódu.

Môj prípad zďaleka nie je výnimočný. V niektorých iných projektoch je konfiguračných súborov oveľa viac. Predstavte si, aký neprehľadný môže projekt byť, keď pridáte `.babelrc`, `prettier.config.js`, `jest.config.js`, `cypress.json` atď.

## Riešenie: `global.config.js`

Chcel by som navrhnúť jednoduché riešenie: zlúčiť konfiguračné súbory do jedného súboru s názvom `global.config.js`. Konfigurácia pre každý nástroj by bola uložená v exportovanom objekte pod kľúčom pomenovaným podľa npm balíka.

Projekty by mali naďalej umožňovať používanie samostatných konfiguračných súborov v prípadoch, keď je konfigurácia rozsiahla a zložitá (napr. `tsconfig.json`), no najprv by mali skontrolovať, či existuje `global.config.js` a či obsahuje konfiguráciu pre daný nástroj.

Takto by mohol vyzerať jednoduchý `global.config.js`:

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

## Ale čo typy?

Dopĺňanie typov sa dá pre `global.config.js` jednoducho povoliť pridaním definícií typov do komentárov, podobne ako to už robia Tailwind a NextJS vo svojich konfiguračných súboroch.

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

## Ďalšie kroky

Ak sa vám tento nápad páči, pošlite PR do svojho obľúbeného build nástroja! Ak nie, dajte mi na Twitteri vedieť, prečo. Alebo aj nie a jednoducho si žite ďalej po svojom.