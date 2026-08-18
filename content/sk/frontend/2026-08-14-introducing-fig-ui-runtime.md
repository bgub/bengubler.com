---
title: "Predstavujeme Fig"
description: "Malé UI behové prostredie v TypeScripte založené na React Fiber."
date: "2026-08-14"
tags: [frontend, open-source]
---

## Rýchle predstavenie

[Fig](https://github.com/bgub/fig) je UI behové prostredie pre TypeScript založené na Reacte. V skratke:

- Približne polovičná veľkosť bundlu oproti Reactu
- Plná podpora fiberového/súbežného vykresľovania
- Vstavané dátové zdroje s kľúčmi, Suspense, streamovaným SSR/hydratáciou a stale-while-refresh
- Serverové komponenty, ktorým sa dá ľahko porozumieť
  - Inšpirovaní TanStackom považujeme serverové komponenty jednoducho za dáta, ktoré možno streamovať a vykresľovať. Keď obnovíte kľúč, hranica sa znovu vykreslí. Môžete dokonca zmeniť formát prenosu.
- Efekty, udalosti, väzby na DOM, prechody, akcie a načítavače dát všetky prijímajú `AbortSignal`
- (Mierne) rýchlejšie vykresľovanie
- Adaptéry pre TanStack Router a TanStack Start
- Užitočné funkcie pre tvorcov frameworkov (jednoduché spôsoby, ako deklarovať jemnozrnné závislosti komponentov od CSS či iných zdrojov)

Moja osobná webová stránka (<https://bengubler.com>) je vytvorená pomocou Fig TanStack Start. Pokojne sa pozrite na [zdrojový kód](https://github.com/bgub/bengubler.com) alebo **sa opýtajte svojho agenta, čo si o tom myslí**!

Oproti Reactu existuje niekoľko drobných rozdielov v syntaxi, no migrácia vašej stránky (ak používate framework založený na Vite) by mala byť vďaka veľkým jazykovým modelom (LLMs) triviálna!

## Filozofia Fig

Trochu sa stalo módou kritizovať React, ale je to preto, že **jednoznačne vyhral**. React je krásny a elegantný spôsob, ako vyjadriť pohľad ako funkciu stavu. Fiber/súbežné vykresľovanie sú skvelé (článok už čoskoro). Serverové komponenty môžu pomôcť odstrániť sieťové vodopády a zmenšiť veľkosť klientského bundle. Výkon je na rozdiel od toho, čo vidíte online, pri kvalitnom kóde bez problémov dostatočný pre akýkoľvek praktický prípad použitia. Frameworky založené na signáloch znejú teoreticky naozaj dobre, no v praxi často prinášajú zložité kompromisy pri veciach, ako sú SSR, serverové komponenty a HMR počas vývoja.

Postupom času sa frameworky mierne zväčšujú, uviaznu pri starých rozhodnutiach a musia zachovávať spätnú kompatibilitu. Fig je pokus znovu implementovať krásne základné myšlienky Reactu v trochu menšom balíku s niekoľkými odlišnými rozhodnutiami v API. Vo všeobecnosti sa snažím Fig smerovať k používaniu sémantiky platformy (`AbortSignal`s namiesto funkcií na čistenie v Reacte) a vysokourovňového API, ktoré sa dá jednoducho používať bez metaframeworku.

Vo väčšine prípadov budú mať metódy API s rovnakým názvom ako v Reacte aj rovnakú signatúru! Keď sa podstatne líšia, Fig zvyčajne používa iný názov.

## Komponenty

```tsx
import { createMixin } from "@bgub/fig";

const externalLink = createMixin((_context, label: string) => ({
  target: "_blank",
  rel: "noopener noreferrer",
  "aria-label": `${label} (opens in a new tab)`,
}));

function Greeting() {
  return (
    <>
      <h1 class="greeting">Hello from Fig!</h1>
      <a
        href="https://github.com/bgub/fig"
        mix={externalLink("View the source")}
      >
        View the source
      </a>
    </>
  );
}
```

Vo Fig sú **iba funkčné komponenty**, žiadne triedne komponenty. Ak potrebujete zachytiť chybu, Fig má vstavaný `ErrorBoundary`, ktorý môžete použiť alebo ním obaliť komponent namiesto definovania vlastného pomocou triedneho komponentu.

Inšpirovali sme sa Remixom V3 a podporujeme aj mixiny, ktoré vám umožňujú vytvárať opakovane použiteľné pomôcky pre props! Príklad vyššie je trochu vykonštruovaný, no mixiny sú naozaj užitočné pre prístupnosť (najmä v kombinácii s obsluhou udalostí, pozrite si nižšie na stránke).

Ešte jedna dôležitá vec: Fig používa **natívne názvy atribútov**, napríklad `class` namiesto `className` a `autocomplete` namiesto `autoComplete`. Vďaka tomu môžeme zdieľať rovnaké typy s natívnym HTML.

A ešte sme `dangerouslySetInnerHTML` premenovali na `unsafeHTML`.


## Hooky a prechody

```tsx
function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<string[]>([]);
  const [isPending, startSearchTransition] = useTransition();

  useReactive(() => {
    startSearchTransition(async (signal) => {
      const url = `/api/search?q=${encodeURIComponent(query)}`
      const response = await fetch(url, { signal });
      setResults(await response.json());
    });
  }, [query]);

  return <p>{isPending ? "Searching…" : results.join(", ")}</p>;
}
```

`useState` funguje rovnako ako v Reacte. `useReactive` je Fig&#39;ovou verziou `useEffect`; podobne ako v Reacte sa spustí po pripojení komponentu a následne po každom vykreslení potvrdenom do histórie, keď sa zmenia jeho (voliteľné) závislosti. Prechod zoskupuje aktualizácie stavu vo svojom rozsahu do úloh s nižšou prioritou, ktoré možno prerušiť.

Na rozdiel od efektov v Reacte efekty Fig prijímajú `AbortSignal` namiesto toho, aby vracali funkciu na vyčistenie. Vďaka tomu je jednoduché automaticky rušiť nahradené sieťové volania!

Hooky životného cyklu sme oproti ich ekvivalentom v Reacte premenovali 1) kvôli zrozumiteľnosti a 2) aby ste sa nepomýlili ani vy, ani agenti. Rýchly prehľad:

| React                | Fig               |
| -------------------- | ----------------- |
| `useEffect`          | `useReactive`     |
| `useLayoutEffect`    | `useBeforePaint`  |
| `useInsertionEffect` | `useBeforeLayout` |
| `useEffectEvent`     | `useStableEvent`  |


## Obsluhy udalostí

```tsx
import { useState } from "@bgub/fig";
import { on } from "@bgub/fig-dom";

function Counter() {
  const [count, setCount] = useState(0);
  const onClick = on("click", () => setCount((count) => count + 1));

  return <button mix={onClick}>Count: {count}</button>;
}
```

Obslužné funkcie udalostí tiež používajú mixiny! Vďaka tomu možno jednoducho vytvárať pomôcky na zlepšenie prístupnosti, napríklad `button`, bez pridávania obalových prvkov.

Obslužné funkcie udalostí dostávajú `AbortSignal`, ktorý sa preruší pri opätovnom spustení a odstránení poslucháča. Na pozadí používajú natívne udalosti prehliadača, nie syntetické udalosti ako React.


## Väzba na DOM

```tsx
function SearchInput() {
  return (
    <input
      type="search"
      bind={(input) => {
        input.focus();
        input.select();
      }}
    />
  );
}
```

Fig na prístup k DOM používa funkciu `bind` namiesto refov, `forwardRef` a `.current`. Ak chcete mať trvalý prístup k prvku HTML, stačí urobiť niečo takéto:

```tsx
const ref = useMemo(() => ({ current: null }), [])
return <input bind={(node) => (input.current = node)} />
```


## Suspense

```tsx
import { readPromise, Suspense } from "@bgub/fig";

function Greeting({ name }: { name: Promise<string> }) {
  return <h1>Hello, {readPromise(name)}!</h1>;
}

function App({ name }: { name: Promise<string> }) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Greeting name={name} />
    </Suspense>
  );
}
```

Vo Fig je React&#39;s `use` rozdelený na `readPromise`, `readContext` a `readData` (pozri nižšie). `readPromise` a `readData` môžu vyvolať Suspense vyhodením čakajúceho prísľubu; `readContext` je vždy synchrónny.

Prísľub musí mať stabilnú identitu (odovzdajte ho alebo memoizujte namiesto toho, aby ste ho vytvárali pri každom vykreslení).


## Kontext

```tsx
import { createContext, readContext } from "@bgub/fig";

const Theme = createContext("light");

function App() {
  return (
    <Theme value="dark">
      <Toolbar />
    </Theme>
  );
}

function Toolbar() {
  const theme = readContext(Theme);
  return <div class={`toolbar toolbar-${theme}`}>Toolbar</div>;
}
```

Kontexty samy fungujú ako poskytovatelia, takže nepotrebujete `.Provider` ani `.Consumer`.

`readContext` v Reacte nahrádza `useContext(ctx)` a `use(ctx)`. Nezaberá slot hooku, takže ho môžete volať podmienene (podobne ako `use`, na rozdiel od `useContext`).


## Dátové zdroje

```tsx
import { dataResource, readData, refreshData } from "@bgub/fig";
import { on } from "@bgub/fig-dom";

const userResource = dataResource({
  key: (id: string) => ["user", id],
  load: (id, { signal }) => fetchUser(id, signal),
});

function Profile({ id }: { id: string }) {
  const user = readData(userResource, id);

  return (
    <section>
      <h1>{user.name}</h1>
      <button mix={on("click", () => void refreshData(userResource, id))}>
        Refresh
      </button>
    </section>
  );
}
```

Táto funkcia je obzvlášť užitočná pre autorov knižníc a frameworkov! `readData()` uloží dáta pod kľúč, počas načítavania pozastaví vykonávanie a prihlási komponent, ktorý ju zavolal, na odber. Keď zavoláte `refreshData`, pôvodná hodnota zostane viditeľná, kým nepríde nová.


## Server Components (bez metaframeworku)

```tsx
// server.tsx
import { renderToPayloadStream } from "@bgub/fig-server/payload";
import { getUser } from "./database.server.ts";

async function Profile({ id }: { id: string }) {
  const user = await getUser(id);
  return <h1>Hello, {user.name}!</h1>;
}

export function renderProfile(id: string): Response {
  const payload = renderToPayloadStream(<Profile id={id} />);

  return new Response(payload.stream, {
    headers: { "content-type": payload.contentType },
  });
}

// client.tsx
import { refreshData, Suspense } from "@bgub/fig";
import { createPayloadComponent, on } from "@bgub/fig-dom";

const ProfilePage = createPayloadComponent<{ id: number }>({
  key: ["profile"],
  load: ({ id }, { signal }) => fetch(`/profile/${id}`, { signal }),
});

function App() {
  const id = 42;
  const refreshOnClick = on("click", () => void refreshData(ProfilePage, { id }));

  return (
    <>
      <Suspense fallback={<p>Loading profile…</p>}>
        <ProfilePage id={id} />
      </Suspense>
      <button mix={refreshOnClick}>Refresh profile</button>
    </>
  );
}
```

Serverové komponenty patria medzi **najsilnejšie funkcie Fig** a môžete ich používať aj bez metaframeworku.

Sú to jednoducho bežné komponenty, ktoré vykresľujeme a serializujeme do formátu JSON. Pojem &quot;Payload&quot; používame na odlíšenie od RSC, ako aj preto, že používame vlastný prenosový formát. Keď obnovíte tok payloadu, stará verzia zostane viditeľná, kým sa načítava jej náhrada.


## Server Components (s metaframeworkom)

```tsx
import { refreshData, Suspense } from "@bgub/fig";
import { createPayloadComponent, on } from "@bgub/fig-dom";
import { serverPayload } from "@bgub/fig-tanstack-start/payload";
import { getUser } from "./database.server.ts";

// tento komponent beží iba na serveri!
// každé obnovenie odošle streamom nový serializovaný payload do prehliadača
const ProfilePage = createPayloadComponent<{ id: number }>({
  key: ["profile"],
  load: serverPayload(async ({ id }) => {
    const user = await getUser(id);
    return <h1>Hello, {user.name}!</h1>;
  }),
});

function App() {
  const id = 42;
  const refreshOnClick = on("click", () => void refreshData(ProfilePage, { id }));

  return (
    <>
      <Suspense fallback={<p>Loading profile…</p>}>
        <ProfilePage id={id} />
      </Suspense>
      <button mix={refreshOnClick}>Refresh profile</button>
    </>
  );
}
```

TanStack tu zmení `serverPayload()` na súkromnú funkciu dostupnú len na serveri (z `load` vytvorí funkciu, ktorá volá malú vygenerovanú API cestu).


## Zdroje materiálov

```tsx
import { assets, preconnect, stylesheet } from "@bgub/fig";

function Map() {
  return assets(
    [
      stylesheet("/map.css", { precedence: "components" }),
      preconnect("https://tiles.example.com"),
    ],
    <div class="map">...</div>,
  );
}
```

Fig je navrhnutý tak, aby výborne podporoval tvorbu metaframeworkov. Tieto zdroje sa zistia až pri vykreslení komponentu `Map`. Fig zabezpečuje odstránenie duplicít a hoisting a dbá na to, aby sa blokujúce štýly načítali pred zobrazením obsahu, od ktorého závisia.


## Prechody medzi zobrazeniami

```tsx
import { transition, useState, ViewTransition } from "@bgub/fig";
import { on } from "@bgub/fig-dom";
import { enableViewTransitions } from "@bgub/fig-dom/view-transitions";

enableViewTransitions();

function Counter() {
  const [count, setCount] = useState(0);
  const incrementOnClick = on("click", () => transition(() => setCount((c) => c + 1)))

  return (
    <>
      <button mix={incrementOnClick}>Increment</button>
      <ViewTransition name="count">
        <p>Count: {count}</p>
      </ViewTransition>
    </>
  );
}
```

Fig natívne podporuje prechody medzi zobrazeniami! Ak chcete obmedziť veľkosť bundlu, musíte ich výslovne povoliť. Pár skvelých príkladov nájdete na mojej webovej stránke.


## Ostatné

Nasledujúce API sú prevažne rovnaké ako v Reacte: `useState`, `useMemo`, `useCallback`, `useId`, `useDeferredValue`, `useSyncExternalStore`, `createElement`, `isValidElement`, `Fragment`, `createPortal`, `flushSync`, `Suspense`, `Activity`, `createRoot`, `hydrateRoot`, metódy koreňového prvku `.render()` a `.unmount()`.

## Vyskúšajte si to

Posledných pár mesiacov pracujem na Figu. Stabilitu síce nemôžem zaručiť, no bol už pomerne dôkladne otestovaný. Dajte svojmu agentovi tento prompt:

```
Prepíš moju stránku pomocou Fig TanStack Start. Ako referenciu použi https://github.com/bgub/bengubler.com.

Porovnaj veľkosť bundle a výkon pred zmenou a po nej.
```

Pozrite si zdrojový kód a dokumentáciu na [GitHube](https://github.com/bgub/fig)!
