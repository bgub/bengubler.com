---
title: "Jen Fig"
description: "Malgranda TypeScript-rultempo por uzantinterfacoj, bazita sur React Fiber."
date: "2026-08-14"
tags: [frontend, open-source]
---

## Rapida enkonduko

[Fig](https://github.com/bgub/fig) estas TypeScript-a UI-rultempo bazita sur React. Mallonga prezento:

- Ĉirkaŭ 50% de la pakaĵa grando de React
- Plena subteno por fibra/samtempa bildigo
- Enkonstruitaj ŝlosilaj datumrimedoj kun Suspense, flua SSR/hidratigo kaj malnovaj datumoj dum refreŝigo
- Servilaj komponantoj, sed facile kompreneblaj
  - Inspirite de TanStack, ni traktas servilajn komponantojn kiel datumojn, kiujn eblas flue transdoni kaj bildigi. Kiam vi refreŝigas la ŝlosilon, la limregiono rebildiĝas. Vi eĉ povas ŝanĝi la datumtransigan formaton.
- Efikoj, eventoj, DOM-ligoj, transiroj, agoj kaj datumŝargiloj ĉiuj akceptas `AbortSignal`
- (Iomete) pli rapida bildiga rendimento
- Adaptiloj por TanStack Router kaj TanStack Start
- Utilaj funkcioj por kadrokreintoj (facilaj manieroj detale deklari la dependecojn de komponantoj je CSS aŭ aliaj havaĵoj)

Mia persona retejo (<https://bengubler.com>) estas konstruita per Fig kaj TanStack Start. Bonvolu rigardi la [fontkodon](https://github.com/bgub/bengubler.com) aŭ **demandu vian agenton, kion ĝi pensas**!

Estas kelkaj etaj sintaksaj diferencoj disde React, sed migri vian retejon (se vi uzas kadron bazitan sur Vite) devus esti tute facila danke al LLM-oj!

## La filozofio de Fig

Iom furoriĝis malŝati React, sed tio estas ĉar ĝi **klare venkis**. React estas bela kaj eleganta maniero esprimi vidon kiel funkcion de stato. Fiber/samtempa bildigo estas brila (artikolo baldaŭ aperos). Servilaj komponantoj povas helpi forigi retajn akvofalojn kaj malgrandigi la klientan pakaĵon. La efikeco, kontraŭe al tio, kion vi vidas interrete, estas facile sufiĉe bona por ĉia praktika uzokazo, se vi verkas bonan kodon. Signalbazitaj kadroj sonas tre bone teorie, sed praktike ofte implicas komplikajn kompromisojn pri aferoj kiel SSR, servilaj komponantoj kaj evoluiga HMR.

Kun la paso de la tempo, kadroj iom grandiĝas, ligiĝas al malnovaj decidoj kaj devas konservi retrokongruecon. Fig estas provo realigi denove la belajn kernajn ideojn de React en iom pli malgranda pakaĵo kun kelkaj malsamaj API-decidoj. Ĝenerale mi provas direkti Fig al uzado de platformaj semantikoj (`AbortSignal`-oj anstataŭ la purigaj funkcioj de React) kaj altnivela API facile uzebla sen metakadroj.

Plejofte API-metodoj kun la sama nomo kiel en React ankaŭ havos la saman signaturon! Kiam ili signife diferencas, Fig kutime uzas alian nomon.

## Komponantoj

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

En Fig ekzistas **nur funkciaj komponantoj**, ne klasaj komponantoj. Se vi bezonas kapti eraron, Fig havas enkonstruitan `ErrorBoundary`, kiun vi povas uzi aŭ ĉirkaŭvolvi, anstataŭ mem difini tian per klasa komponanto.

Inspirite de Remix V3, ni ankaŭ subtenas miksaĵojn, kiuj ebligas krei reuzeblajn ilojn por rekvizitoj! La supra ekzemplo estas iom elpensita, sed miksaĵoj estas vere utilaj por alirebleco (precipe kiam vi kombinas ilin kun eventotraktiloj; vidu pli sube sur la paĝo).

Ankaŭ gravas rimarki, ke Fig uzas **denaskajn atributnomojn**, kiel `class` anstataŭ `className` kaj `autocomplete` anstataŭ `autoComplete`. Tio ebligas al ni kunhavigi la samajn tipojn kun denaska HTML.

Ho, ni ankaŭ alinomiĝis `dangerouslySetInnerHTML` al `unsafeHTML`.


## Hokoj kaj Transiroj

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

`useState` estas tute sama kiel en React. `useReactive` estas la Fig-versio de `useEffect`; same kiel en React, ĝi ruliĝas post la muntado de komponanto kaj poste post ĉiu komitita bildigo, kiam ĝiaj (laŭvolaj) dependecoj ŝanĝiĝis. Transiro grupigas ŝtatajn ĝisdatigojn ene de sia amplekso en malpli prioritatan laboron, kiun eblas interrompi.

Malsame ol React-efikoj, Fig-efikoj ricevas `AbortSignal` anstataŭ redoni purigan funkcion. Tio faciligas aŭtomate nuligi superregitajn retvokojn!

Ni alinomis vivciklajn hokojn el iliaj React-ekvivalentoj 1) por klareco kaj 2) por ke nek vi nek agentoj konfuziĝu. Rapida konsulttabelo:

| React                | Fig               |
| -------------------- | ----------------- |
| `useEffect`          | `useReactive`     |
| `useLayoutEffect`    | `useBeforePaint`  |
| `useInsertionEffect` | `useBeforeLayout` |
| `useEffectEvent`     | `useStableEvent`  |


## Eventotraktiloj

```tsx
import { useState } from "@bgub/fig";
import { on } from "@bgub/fig-dom";

function Counter() {
  const [count, setCount] = useState(0);
  const onClick = on("click", () => setCount((count) => count + 1));

  return <button mix={onClick}>Count: {count}</button>;
}
```

Eventotraktiloj ankaŭ uzas miksaĵojn! Tio tre faciligas krei alireblecajn ilojn kiel `button` sen aldoni ĉirkaŭajn elementojn.

Eventotraktiloj ricevas `AbortSignal`, kiu ĉesigas ilin ĉe reentrado kaj forigo de aŭskultilo. Ili interne uzas denaskajn retumilajn eventojn, anstataŭ sintezajn eventojn kiel React.


## DOM-ligado

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

Fig uzas `bind` por aliri la DOM anstataŭ ref-ojn, `forwardRef` kaj `.current`. Se vi volas konstante aliri HTML-elementon, vi povas simple fari ion tian:

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

En Fig, la `use` de React estas dividita en `readPromise`, `readContext` kaj `readData` (vidu sube). `readPromise` kaj `readData` povas ekigi Suspense per ĵeto de ankoraŭ neplenumita promeso; `readContext` ĉiam funkcias sinkrone.

La promeso devas havi stabilan identecon (transdonu ĝin aŭ memorigas ĝin anstataŭ krei ĝin ĉe ĉiu bildigo).


## Kunteksto

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

Kuntekstoj mem estas provizantoj, do vi ne bezonas `.Provider` nek `.Consumer`.

`readContext` anstataŭas `useContext(ctx)` kaj `use(ctx)` en React. Ĝi ne okupas hokfendon, do vi povas voki ĝin kondiĉe (kiel `use`, sed malsame ol `useContext`).


## Datumaj rimedoj

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

Tiu funkcio estas aparte utila por aŭtoroj de bibliotekoj kaj kadroj! `readData()` konservas la datumojn laŭ ŝlosilo, suspendas la rendradon dum ŝargado kaj abonas la komponanton, kiu ĝin vokis. Kiam vi vokas `refreshData`, la ekzistanta valoro restas videbla ĝis alveno de ĝia anstataŭaĵo.


## Servilaj komponantoj (sen metakadro)

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

Servilaj komponantoj estas unu el la **plej potencaj funkcioj de Fig**, kaj vi povas uzi ilin eĉ sen metakadro.

Ili estas simple ordinaraj komponantoj, kiujn ni bildigas kaj seriigas en JSON. Ni uzas la terminon &quot;Payload&quot; por distingi ilin de RSC-oj kaj ĉar ni uzas propran transigan formaton. Kiam vi refreŝigas la Payload-fluon, la malnova versio restas videbla dum la nova alfluas.


## Servilaj komponantoj (kun metakadro)

```tsx
import { refreshData, Suspense } from "@bgub/fig";
import { createPayloadComponent, on } from "@bgub/fig-dom";
import { serverPayload } from "@bgub/fig-tanstack-start/payload";
import { getUser } from "./database.server.ts";

// ĉi tiu komponanto ruliĝas nur en la servilo!
// ĉiu refreŝigo elsendas flue la novan seriigitan Payload-on al la retumilo
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

Ĉi tie TanStack transformas `serverPayload()` en privatan funkcion uzeblan nur en la servilo (ĝi transformas `load` en funkcion, kiu vokas etan generitan API-itineron).


## Rimedoj por aktivaĵoj

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

Fig estas desegnita por esti vere lerta pri konstruado de metakadrojn. Tiuj ĉi rimedoj estas malkovritaj nur se/kiam `Map` bildigas. Fig prizorgas forigon de duoblaĵoj kaj suprenigon, kaj certigas, ke blokantaj stilfolioj ŝargiĝas antaŭ ol montri la dependan enhavon.


## Vidaj transiroj

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

Fig denaske subtenas vidtransirojn! Por limigi la grandecon de la pakaĵo, vi devas eksplicite ebligi ilin. Vi povas vidi kelkajn bonegajn ekzemplojn en mia retejo.


## Aliaj

La jenaj API-oj estas plejparte samaj kiel tiuj de React: `useState`, `useMemo`, `useCallback`, `useId`, `useDeferredValue`, `useSyncExternalStore`, `createElement`, `isValidElement`, `Fragment`, `createPortal`, `flushSync`, `Suspense`, `Activity`, `createRoot`, `hydrateRoot`, same kiel la radikaj `.render()` kaj `.unmount()`.

## Provu

Mi laboras pri Fig jam de kelkaj monatoj. Mi ne povas garantii stabilecon, sed ĝi estas sufiĉe bone testita. Donu al via aganto jenan prompton:

```
Reverku mian retejon per Fig TanStack Start. Uzu https://github.com/bgub/bengubler.com kiel referencon.

Komparu la grandecon de la pakaĵo kaj la rendimenton antaŭ kaj post.
```

Rigardu la fontkodon kaj dokumentaron en [GitHub](https://github.com/bgub/fig)!
