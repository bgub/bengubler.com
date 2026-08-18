---
title: "Представляем Fig"
description: "Небольшая среда выполнения пользовательского интерфейса на TypeScript на базе React Fiber."
date: "2026-08-14"
tags: [frontend, open-source]
---

## Краткое введение

[Fig](https://github.com/bgub/fig) — это UI-среда выполнения на TypeScript, основанная на React. Если коротко:

- Примерно вдвое меньший бандл, чем у React
- Полная поддержка fiber-архитектуры и конкурентного рендеринга
- Встроенные ресурсы данных с ключами, Suspense, стримингом SSR/гидратацией и обновлением в фоне
- Серверные компоненты, но без лишней сложности
  - Вдохновляясь TanStack, мы рассматриваем серверные компоненты как обычные данные, которые можно передавать стримингом и рендерить. При обновлении ключа граница рендерится заново. Можно даже изменить формат данных в сети.
- Эффекты, события, DOM-привязки, переходы, действия и загрузчики данных принимают `AbortSignal`
- (Немного) более высокая скорость рендеринга
- Адаптеры для TanStack Router и TanStack Start
- Удобные возможности для создателей фреймворков (простые способы детально объявлять зависимости компонентов от CSS и других ресурсов)

Мой личный сайт (<https://bengubler.com>) создан с помощью Fig и TanStack Start. Можете посмотреть [исходный код](https://github.com/bgub/bengubler.com) или **спросить своего агента, что он об этом думает**!

Есть несколько небольших синтаксических отличий от React, но благодаря большим языковым моделям (LLMs) перенести ваш сайт (если вы используете фреймворк на основе Vite) будет проще простого!

## Философия Fig

Сейчас стало модно критиковать React, но лишь потому, что он **явно победил**. React — красивый и элегантный способ выразить представление как функцию состояния. Fiber и конкурентный рендеринг великолепны (статья скоро выйдет). Серверные компоненты помогают устранить сетевые водопады и сократить клиентский бандл. Производительность, вопреки тому, что пишут в интернете, вполне достаточна для любого практического применения, если писать хороший код. Фреймворки на основе сигналов в теории звучат очень привлекательно, но на практике часто предполагают сложные компромиссы в таких вопросах, как SSR, серверные компоненты и dev HMR.

Со временем фреймворки немного разрастаются, оказываются привязаны к прежним решениям и вынуждены поддерживать обратную совместимость. Fig — попытка заново реализовать прекрасные ключевые идеи React в чуть более компактном пакете, приняв несколько иных API-решений. В целом я стараюсь ориентировать Fig на использование семантики платформы (`AbortSignal` вместо функций очистки React) и высокоуровневого API, которым легко пользоваться без метафреймворка.

В большинстве случаев API-методы с теми же именами, что и в React, будут иметь и те же сигнатуры! Если же различия существенны, Fig обычно использует другое имя.

## Компоненты

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

В Fig есть **только функциональные компоненты**, классовых компонентов нет. Если нужно перехватить ошибку, в Fig есть встроенный `ErrorBoundary`, который можно использовать или обернуть им компонент, вместо того чтобы определять собственный через классовый компонент.

Вдохновившись Remix V3, мы также поддерживаем миксины, которые позволяют создавать переиспользуемые утилиты для пропсов! Пример выше немного надуманный, но миксины действительно полезны для обеспечения доступности, особенно в сочетании с обработчиками событий (см. ниже на странице).

Ещё один важный момент: Fig использует **нативные имена атрибутов**, например `class` вместо `className` и `autocomplete` вместо `autoComplete`. Это позволяет использовать одни и те же типы с нативным HTML.

А ещё мы переименовали `dangerouslySetInnerHTML` в `unsafeHTML`.


## Зацепки и переходы

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

`useState` работает точно так же, как в React. `useReactive` — аналог `useEffect` в Fig: как и в React, он запускается после монтирования компонента, а затем после каждого зафиксированного рендера, если изменились его (необязательные) зависимости. Переход объединяет обновления состояния в своей области видимости в низкоприоритетную работу, которую можно прервать.

В отличие от эффектов React, эффекты Fig принимают `AbortSignal` вместо того, чтобы возвращать функцию очистки. Благодаря этому устаревшие сетевые вызовы легко отменяются автоматически!

Мы переименовали хуки жизненного цикла по сравнению с их аналогами в React: 1) для ясности и 2) чтобы ни вы, ни агенты не запутались. Краткая шпаргалка:

| React                | Fig               |
| -------------------- | ----------------- |
| `useEffect`          | `useReactive`     |
| `useLayoutEffect`    | `useBeforePaint`  |
| `useInsertionEffect` | `useBeforeLayout` |
| `useEffectEvent`     | `useStableEvent`  |


## Обработчики событий

```tsx
import { useState } from "@bgub/fig";
import { on } from "@bgub/fig-dom";

function Counter() {
  const [count, setCount] = useState(0);
  const onClick = on("click", () => setCount((count) => count + 1));

  return <button mix={onClick}>Count: {count}</button>;
}
```

Обработчики событий также используют миксины! Это позволяет легко создавать утилиты для обеспечения доступности, такие как `button`, без добавления элементов-обёрток.

Обработчикам событий передаётся `AbortSignal`, который срабатывает при повторном вызове и удалении слушателя. В их основе лежат нативные события браузера, а не синтетические, как в React.


## Привязка к DOM

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

Fig использует `bind` для доступа к DOM вместо refs, `forwardRef` и `.current`. Если вам нужен постоянный доступ к HTML-элементу, достаточно сделать что-то вроде этого:

```tsx
const ref = useMemo(() => ({ current: null }), [])
return <input bind={(node) => (input.current = node)} />
```


## Приостановка

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

В Fig хук React `use` разделён на `readPromise`, `readContext` и `readData` (см. ниже). `readPromise` и `readData` могут активировать Suspense, выбрасывая незавершённый промис; `readContext` всегда синхронен.

Промис должен сохранять стабильную идентичность: передавайте его извне или мемоизируйте, а не создавайте заново при каждом рендере.


## Контекст

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

Контексты сами выступают провайдерами, поэтому `.Provider` и `.Consumer` не нужны.

`readContext` заменяет в React `useContext(ctx)` и `use(ctx)`. Она не занимает слот хука, поэтому её можно вызывать условно (как `use`, но в отличие от `useContext`).


## Ресурсы данных

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

Эта возможность особенно полезна авторам библиотек и фреймворков! `readData()` кэширует данные, приостанавливает выполнение на время загрузки и подписывает вызвавший её компонент. При вызове `refreshData` текущее значение остаётся видимым, пока не будет получено новое.


## Серверные компоненты (без метафреймворка)

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

Серверные компоненты — одна из **самых мощных возможностей Fig**; их можно использовать даже без метафреймворка.

Это обычные компоненты, которые мы рендерим и сериализуем в JSON. Мы используем термин &quot;Payload&quot;, чтобы отличать их от RSC, а также потому, что применяем собственный формат передачи данных. При обновлении потока payload старая версия остаётся видимой, пока загружается новая.


## Серверные компоненты (с метафреймворком)

```tsx
import { refreshData, Suspense } from "@bgub/fig";
import { createPayloadComponent, on } from "@bgub/fig-dom";
import { serverPayload } from "@bgub/fig-tanstack-start/payload";
import { getUser } from "./database.server.ts";

// этот компонент выполняется только на сервере!
// любое обновление потоково передаёт новый сериализованный payload в browser
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

Здесь TanStack превращает `serverPayload()` в закрытую функцию, доступную только на сервере (при этом `load` превращается в функцию, вызывающую небольшой сгенерированный API-маршрут).


## Ресурсы

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

Fig специально разработан для создания метафреймворков. Эти ресурсы обнаруживаются только при рендеринге `Map`. Fig устраняет дубликаты, выносит их и следит за тем, чтобы блокирующие таблицы стилей загружались до отображения зависимого содержимого.


## Переходы между представлениями

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

Fig поддерживает View Transitions из коробки! Чтобы не раздувать размер бандла, их нужно включить явно. Несколько классных примеров можно посмотреть на моём сайте.


## Прочее

Следующие API в целом такие же, как в React: `useState`, `useMemo`, `useCallback`, `useId`, `useDeferredValue`, `useSyncExternalStore`, `createElement`, `isValidElement`, `Fragment`, `createPortal`, `flushSync`, `Suspense`, `Activity`, `createRoot`, `hydrateRoot`, а также корневые `.render()` и `.unmount()`.

## Попробуйте

Последние несколько месяцев я работаю над Fig. Не могу гарантировать стабильность, но он уже довольно хорошо протестирован. Дайте своему агенту такой промпт:

```
Перепиши мой сайт на Fig TanStack Start. В качестве образца используй https://github.com/bgub/bengubler.com.

Сравни размер бандла и производительность до и после.
```

Исходный код и документацию можно найти на [GitHub](https://github.com/bgub/fig)!
