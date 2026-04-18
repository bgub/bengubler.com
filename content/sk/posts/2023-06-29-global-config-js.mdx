---
title: Jeden konfiguračný súbor, ktorý vládne všetkým
description: JavaScriptové nástroje majú príliš veľa konfiguračných súborov. Spojme ich.
date: "2023-06-29"
tags: [open-source]
was_llm_utilized: slightly
---

Moderný webový vývoj zahŕňa prácu s viacerými JS build nástrojmi a frameworkmi, pričom každý z nich vyžaduje vlastné konfiguračné súbory. Správa týchto konfiguračných súborov, ako sú `.eslintrc`, `next.config.js` a `tailwind.config.js`, môže byť neprehľadná a časovo náročná. V tomto príspevku sa pozriem na myšlienku spojiť tieto konfiguračné súbory do jedného súboru s názvom `global.config.js`, čím sa centralizuje konfigurácia projektu a obmedzí množstvo rušivých vplyvov.

## Konfiguračné súbory všade

Keď píšem tento blogový príspevok, v koreňovom adresári môjho projektu sú `.eslintrc.json`, `next.config.js`, `postcss.config.js`, `tailwind.config.js` a `tsconfig.json`. Hoci je moja konfigurácia v podstate celkom štandardná a každý súbor má menej ako 30 riadkov, tieto súbory zaberajú cenné miesto v bočnom paneli VSCode a odvádzajú pozornosť od toho podstatného: od môjho zdrojového kódu.

Môj prípad ani zďaleka nie je výnimočný. V niektorých iných projektoch je konfiguračných súborov oveľa viac. Predstavte si, aký neprehľadný môže projekt byť, keď pridáte `.babelrc`, `prettier.config.js`, `jest.config.js`, `cypress.json` atď.

## Riešenie: `global.config.js`

Chcel by som navrhnúť jednoduché riešenie: zjednotiť konfiguračné súbory do jedného súboru s názvom `global.config.js`. Konfigurácia pre každý nástroj by bola uložená v exportovanom objekte pod kľúčom pomenovaným podľa npm balíka.

Projekty by stále mali umožňovať používanie samostatných konfiguračných súborov v prípadoch, keď je konfigurácia rozsiahla a zložitá (napr. `tsconfig.json`), no najprv by mali skontrolovať, či existuje `global.config.js` a či obsahuje konfiguráciu pre daný nástroj.

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

## A čo typy?

Dopĺňanie typov sa dá v `global.config.js` jednoducho zapnúť pridaním typových definícií do komentárov, podobne ako to už robia Tailwind a NextJS vo svojich konfiguračných súboroch.

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

Ak sa vám tento nápad páči, pošlite PR do projektu svojho obľúbeného build nástroja! Ak nie, dajte mi vedieť prečo na Twitteri. Alebo aj nie a jednoducho žite ďalej svoj život.