---
title: "Představujeme Fig"
description: "Malý runtime uživatelského rozhraní v TypeScriptu založený na React Fiber."
date: "2026-08-14"
tags: [frontend, open-source]
---

## Rychlý úvod

[Fig](https://github.com/bgub/fig) je runtime pro UI v TypeScriptu založený na Reactu. Stručně:

- Přibližně poloviční velikost bundlu oproti Reactu
- Plná podpora fiberu a souběžného vykreslování
- Vestavěné datové zdroje s klíči, Suspense, streamovaným SSR/hydratací a stale-while-refresh
- Serverové komponenty, ale srozumitelné
  - Inspirováni TanStackem považujeme serverové komponenty jednoduše za data, která lze streamovat a vykreslovat. Když obnovíte klíč, hranice se znovu vykreslí. Můžete dokonce změnit formát přenosu.
- Efekty, události, vazby na DOM, přechody, akce i datové loadery přijímají `AbortSignal`
- (Mírně) rychlejší vykreslování
- Adaptéry pro TanStack Router a TanStack Start
- Praktické funkce pro tvůrce frameworků (snadné způsoby, jak podrobně deklarovat závislosti komponent na CSS či jiných prostředcích)

Můj osobní web (<https://bengubler.com>) je postavený na Fig TanStack Start. Klidně se podívejte na [zdrojový kód](https://github.com/bgub/bengubler.com) nebo se **zeptejte svého agenta, co si o tom myslí**!

Oproti Reactu má Fig několik drobných syntaktických odlišností, ale migrace vašeho webu (pokud používáte framework založený na Vite) by díky velkým jazykovým modelům měla být triviální!

## Filozofie Fig

V poslední době se stalo trochu módou kritizovat React, ale je to proto, že **jednoznačně zvítězil**. React je krásný a elegantní způsob, jak vyjádřit UI jako funkci stavu. Fiber a souběžné vykreslování jsou brilantní (článek již brzy). Serverové komponenty mohou pomoci odstranit síťové vodopády a zmenšit velikost klientského bundlu. Výkon je navzdory tomu, co vídáte online, pro jakýkoli praktický případ použití snadno dostatečný, pokud píšete kvalitní kód. Frameworky založené na signálech znějí teoreticky velmi dobře, ale v praxi často přinášejí složité kompromisy v oblastech jako SSR, serverové komponenty a HMR při vývoji.

Postupem času frameworky poněkud nabobtnají, uvíznou ve starých rozhodnutích a musí zachovávat zpětnou kompatibilitu. Fig je pokus znovu implementovat krásné základní myšlenky Reactu v o něco menším balíčku s několika odlišnými rozhodnutími ohledně API. Obecně se snažím Fig směřovat k využívání sémantiky platformy (`AbortSignal`s namísto funkcí pro úklid v Reactu) a API na vysoké úrovni, které se snadno používá bez metaframeworku.

Ve většině případů budou metody API se stejným názvem jako v Reactu mít i stejnou signaturu! Pokud se podstatně liší, Fig obvykle používá jiný název.

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

Fig má **pouze funkční komponenty**, žádné třídní komponenty. Pokud potřebujete zachytit chybu, Fig nabízí vestavěnou komponentu `ErrorBoundary`, kterou můžete použít nebo jí obalit jinou komponentu, místo abyste si vlastní definovali pomocí třídní komponenty.

Po vzoru Remixu V3 podporujeme také mixiny, které vám umožňují vytvářet znovupoužitelné utility pro props! Výše uvedený příklad je trochu vykonstruovaný, ale mixiny jsou opravdu užitečné pro přístupnost (zejména když je spojíte s obslužnými funkcemi událostí, viz dále na stránce).

Ještě jedna důležitá věc: Fig používá **nativní názvy atributů**, například `class` místo `className` a `autocomplete` místo `autoComplete`. Díky tomu můžeme sdílet stejné typy s nativním HTML.

A mimochodem, `dangerouslySetInnerHTML` jsme přejmenovali na `unsafeHTML`.


## Hooky a přechody

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

`useState` je stejný jako v Reactu. `useReactive` je Fig&#39;s verze `useEffect`; stejně jako v Reactu se spouští po připojení komponenty a poté po každém potvrzeném vykreslení, když se změní jeho (volitelné) závislosti. Přechod seskupuje aktualizace stavu ve svém rozsahu do práce s nižší prioritou, kterou lze přerušit.

Na rozdíl od efektů v Reactu přijímají efekty Fig `AbortSignal` namísto toho, aby vracely funkci pro úklid. Díky tomu lze snadno automaticky zrušit překonaná síťová volání!

Háčky životního cyklu jsme oproti jejich ekvivalentům v Reactu přejmenovali 1) kvůli přehlednosti a 2) aby nedošlo ke zmatku ani u vás, ani u agentů. Rychlý přehled:

| React                | Fig               |
| -------------------- | ----------------- |
| `useEffect`          | `useReactive`     |
| `useLayoutEffect`    | `useBeforePaint`  |
| `useInsertionEffect` | `useBeforeLayout` |
| `useEffectEvent`     | `useStableEvent`  |


## Obslužné funkce událostí

```tsx
import { useState } from "@bgub/fig";
import { on } from "@bgub/fig-dom";

function Counter() {
  const [count, setCount] = useState(0);
  const onClick = on("click", () => setCount((count) => count + 1));

  return <button mix={onClick}>Count: {count}</button>;
}
```

Obslužné funkce událostí také využívají mixiny! Díky tomu lze snadno vytvářet nástroje pro přístupnost, jako je `button`, bez přidávání obalových prvků.

Obslužné funkce událostí dostávají `AbortSignal`, který se přeruší při opětovném spuštění a odebrání naslouchající funkce. Pod kapotou používají nativní události prohlížeče namísto syntetických událostí, jaké používá React.


## Propojení s DOM

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

Fig pro přístup k DOM používá `bind` namísto refs, `forwardRef` a `.current`. Pokud chcete mít trvalý přístup k prvku HTML, stačí udělat něco takového:

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

Ve Fig je React&#39;s `use` rozdělen na `readPromise`, `readContext` a `readData` (viz níže). `readPromise` a `readData` mohou aktivovat Suspense vyhozením nevyřešeného promisu; `readContext` je vždy synchronní.

Promise musí mít stabilní identitu (předávejte ho jako parametr nebo ho memoizujte, místo abyste ho vytvářeli při každém renderování).


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

Kontexty samy fungují jako poskytovatelé, takže nepotřebujete `.Provider` ani `.Consumer`.

`readContext` v Reactu nahrazuje `useContext(ctx)` a `use(ctx)`. Nezabírá slot hooku, takže ho můžete volat podmíněně (stejně jako `use`, na rozdíl od `useContext`).


## Datové zdroje

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

Tato funkce je obzvlášť užitečná pro autory knihoven a frameworků! `readData()` ukládá data pod klíčem, během načítání pozastaví vykreslování a přihlásí komponentu, která ji zavolala, k odběru. Po zavolání `refreshData` zůstane stávající hodnota viditelná, dokud nedorazí její náhrada.


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

Serverové komponenty patří k **nejvýkonnějším funkcím Fig** a můžete je používat i bez metaframeworku.

Jsou to běžné komponenty, které vykreslujeme a serializujeme do JSONu. Označení &quot;Payload&quot; používáme, abychom je odlišili od RSC, a protože používáme vlastní formát přenosu dat. Když obnovíte stream payloadu, stará verze zůstane viditelná, zatímco se načítá nová.


## Server Components (s metaframeworkem)

```tsx
import { refreshData, Suspense } from "@bgub/fig";
import { createPayloadComponent, on } from "@bgub/fig-dom";
import { serverPayload } from "@bgub/fig-tanstack-start/payload";
import { getUser } from "./database.server.ts";

// tato komponenta běží pouze na serveru!
// každé obnovení streamuje nový serializovaný payload do prohlížeče
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

Zde TanStack změní `serverPayload()` na privátní funkci určenou pouze pro server (z `load` vytvoří funkci, která volá malou vygenerovanou trasu API).


## Zdroje prostředků

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

Fig je navržen tak, aby byl opravdu dobrý při vytváření metaframeworků. Tyto prostředky se objeví až při vykreslení `Map`. Fig zajišťuje deduplikaci a přesunutí na vyšší úroveň a dbá na to, aby se blokující styly načetly před zobrazením závislého obsahu.


## Přechody mezi zobrazeními

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

Fig nativně podporuje přechody mezi pohledy! Abyste omezili velikost bundlu, musíte je výslovně povolit. Několik skvělých příkladů si můžete prohlédnout na mém webu.


## Ostatní

Následující API jsou z velké části stejné jako v Reactu: `useState`, `useMemo`, `useCallback`, `useId`, `useDeferredValue`, `useSyncExternalStore`, `createElement`, `isValidElement`, `Fragment`, `createPortal`, `flushSync`, `Suspense`, `Activity`, `createRoot`, `hydrateRoot` a metody `.render()` a `.unmount()` kořene.

## Vyzkoušejte si to

Posledních několik měsíců pracuji na Fig. Nemohu zaručit stabilitu, ale Fig už byl poměrně důkladně otestován. Dejte svému agentovi tento prompt:

```
Přepiš můj web pomocí Fig TanStack Start. Jako referenci použij https://github.com/bgub/bengubler.com.

Porovnej velikost bundlu a výkon před a po.
```

Zdrojový kód a dokumentaci najdete na [GitHubu](https://github.com/bgub/fig)!
