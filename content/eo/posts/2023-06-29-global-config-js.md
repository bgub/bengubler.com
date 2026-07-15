---
title: Unu agorda dosiero por regi ĉiujn
description: JavaScript-iloj havas tro multajn agordajn dosierojn. Ni kunigu ilin.
date: "2023-06-29"
tags: [open-source]
was_llm_utilized: slightly
---

Moderna retevoluigo implicas laboron kun pluraj JS-konstruiloj kaj kadroj, kaj ĉiu postulas siajn proprajn agordajn dosierojn. Administri tiujn agordajn dosierojn, kiel `.eslintrc`, `next.config.js` kaj `tailwind.config.js`, povas fariĝi maloportune kaj tempopostule. En ĉi tiu blogaĵo, mi esploros la ideon kunigi tiujn agordajn dosierojn en unu solan dosieron nomatan `global.config.js`, por centraligi la projektan agordon kaj malpliigi distraĵojn.

## Agordaj dosieroj ĉie

Dum mi verkas ĉi tiun blogaĵon, la radika dosierujo de mia projekto enhavas `.eslintrc.json`, `next.config.js`, `postcss.config.js`, `tailwind.config.js` kaj `tsconfig.json`. Kvankam mia agordo estas sufiĉe defaŭlta kaj ĉiu dosiero havas malpli ol 30 liniojn, tiuj dosieroj okupas valoran spacon en la flankobreto de VSCode kaj deturnas la atenton de tio, kio gravas: mia fontkodo.

Mia situacio tute ne estas escepta. Iuj aliaj projektoj uzas multe pli da agordaj dosieroj. Imagu, kiom malorda projekto povas fariĝi, kiam vi aldonas `.babelrc`, `prettier.config.js`, `jest.config.js`, `cypress.json`, ktp.

## La solvo: `global.config.js`

Mi ŝatus proponi simplan solvon: unuigi agordajn dosierojn en dosieron nomatan `global.config.js`. La agordo por ĉiu ilo estus konservata en la eksportita objekto, sub ŝlosilo kun la nomo de la npm-pakaĵo.

Projektoj tamen devus permesi la uzadon de apartaj agordaj dosieroj en kazoj, kiam la agordo estas granda kaj kompleksa (ekz. `tsconfig.json`), sed ili unue kontrolu, ĉu ekzistas `global.config.js` kaj ĉu ĝi enhavas agordon por ilia ilo.

Jen kiel simpla `global.config.js` povus aspekti:

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

## Sed kio pri tipoj?

Aŭtomata kompletigo de tipoj povas esti facile ebligita por `global.config.js` per aldonado de tipdifinoj en komentoj, same kiel Tailwind kaj NextJS jam faras en siaj agordaj dosieroj.

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

## Sekvaj paŝoj

Se vi ŝatas ĉi tiun ideon, sendu PR al via plej ŝatata konstruilo! Se ne, sciigu min kial ĉe Twitter. Aŭ ne — simple daŭrigu vian vivon.