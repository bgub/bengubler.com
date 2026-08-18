---
title: "التعريف بـ Fig"
description: "بيئة تشغيل صغيرة لواجهة مستخدم بلغة TypeScript مبنية على React Fiber."
date: "2026-08-14"
tags: [frontend, open-source]
---

## مقدمة سريعة

[Fig](https://github.com/bgub/fig) هو بيئة تشغيل لواجهات المستخدم مكتوبة بـ TypeScript ومبنية على React. إليك نبذة سريعة:

- حجم الحزمة يقارب 50% من حجم حزمة React
- دعم كامل للـ fiber والعرض المتزامن
- مصادر بيانات مضمّنة قائمة على المفاتيح، مع Suspense وSSR/الإماهة بالتدفق وتحديث البيانات القديمة في الخلفية
- مكوّنات الخادم، لكن يسهل فهمها
  - مستوحين من TanStack، نتعامل مع مكوّنات الخادم باعتبارها مجرد بيانات يمكن بثها وعرضها. وعند تحديث المفتاح، يُعاد عرض الحدّ الفاصل. ويمكنك حتى تغيير تنسيق النقل.
- التأثيرات والأحداث وروابط DOM والانتقالات والإجراءات ومحمّلات البيانات كلها تقبل `AbortSignal`
- أداء عرض أسرع (بقدر طفيف)
- موائمات لـ TanStack Router وTanStack Start
- ميزات رائعة لمطوري الأطر (طرائق سهلة للتصريح بدقة عن تبعيات المكوّنات على CSS أو الأصول الأخرى)

موقعي الشخصي (<https://bengubler.com>) مبني باستخدام Fig وTanStack Start. لا تتردد في إلقاء نظرة على [المصدر](https://github.com/bgub/bengubler.com) أو **اسأل وكيلك عن رأيه**!

توجد بعض الاختلافات الطفيفة في الصياغة مقارنةً بـ React، لكن نقل موقعك (إذا كنت تستخدم إطارًا قائمًا على Vite) ينبغي أن يكون سهلًا بفضل نماذج اللغة الكبيرة (Large Language Models)!

## فلسفة Fig

أصبح انتقاد React رائجًا إلى حدّ ما، لكن ذلك لأنه **فاز بوضوح**. فـReact طريقة جميلة وأنيقة للتعبير عن الواجهة بوصفها دالةً للحالة. إن Fiber/العرض المتزامن رائعان (مقال قريبًا). يمكن لمكوّنات الخادم أن تساعد في التخلص من شلالات الشبكة وتقليص حجم حزمة العميل. والأداء، خلافًا لما تراه على الإنترنت، جيد بسهولة بما يكفي لأي حالة استخدام عملية إذا كتبت شيفرة جيدة. تبدو الأطر القائمة على الإشارات رائعة حقًا نظريًا، لكنها عمليًا تنطوي غالبًا على مفاضلات معقدة في أمور مثل SSR ومكوّنات الخادم وHMR أثناء التطوير.

مع مرور الوقت، تكبر الأطر قليلًا، وتصبح مقيدة بقرارات قديمة، ويتعين عليها الحفاظ على التوافق مع الإصدارات السابقة. Fig محاولة لإعادة تنفيذ الأفكار الجوهرية الجميلة في React ضمن حزمة أصغر قليلًا، مع بعض القرارات المختلفة في واجهة برمجة التطبيقات. عمومًا، أحاول توجيه Fig نحو استخدام دلالات المنصة (`AbortSignal`s بدلًا من دوال التنظيف في React) وواجهة برمجة تطبيقات عالية المستوى يسهل استخدامها دون إطار فوقي.

في معظم الحالات، ستتشارك أساليب واجهة برمجة التطبيقات التي تحمل الاسم نفسه في React التوقيع نفسه أيضًا! وعندما تختلف اختلافًا جوهريًا، يستخدم Fig عادةً اسمًا مختلفًا.

## المكوّنات

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

في Fig، لا توجد سوى **مكوّنات دوال**، ولا توجد مكوّنات أصناف. إذا احتجت إلى التقاط خطأ، يوفر Fig مكوّن `ErrorBoundary` مدمجًا يمكنك استخدامه أو تغليف مكوّناتك به بدلًا من تعريف مكوّنك الخاص باستخدام مكوّن صنف.

استلهامًا من Remix V3، ندعم أيضًا الـ mixins التي تتيح لك إنشاء أدوات مساعدة قابلة لإعادة الاستخدام للخصائص! المثال أعلاه متكلّف قليلًا، لكن الـ mixins مفيدة جدًا لإتاحة الوصول، خاصةً عند إقرانها بمعالجات الأحداث (انظر أسفل الصفحة).

ثمة أمر مهم آخر: يستخدم Fig **أسماء السمات الأصلية**، مثل `class` بدلًا من `className` و`autocomplete` بدلًا من `autoComplete`. يتيح لنا ذلك مشاركة الأنواع نفسها مع HTML الأصلي.

وأيضًا، أعدنا تسمية `dangerouslySetInnerHTML` إلى `unsafeHTML`.


## الخطّافات والانتقالات

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

`useState` مطابق تمامًا لما هو عليه في React. أما `useReactive` فهو إصدار Fig من `useEffect`؛ ومثل React، يُشغَّل بعد تركيب المكوّن، ثم بعد كل عملية تصيير مُعتمدة تتغيّر فيها تبعياته (الاختيارية). يجمع الانتقال تحديثات الحالة ضمن نطاقه في عمل منخفض الأولوية يمكن مقاطعته.

بخلاف تأثيرات React، تتلقى تأثيرات Fig قيمة `AbortSignal` بدلًا من إرجاع دالة تنظيف. وهذا يجعل الإلغاء التلقائي لطلبات الشبكة التي حلّت محلها طلبات أحدث أمرًا سهلًا!

أعدنا تسمية خطّافات دورة الحياة بدلًا من نظيراتها في React: 1) لمزيد من الوضوح، و2) لتجنّب التباس الأمر عليك أو على الوكلاء. إليك جدولًا مرجعيًا سريعًا:

| React                | Fig               |
| -------------------- | ----------------- |
| `useEffect`          | `useReactive`     |
| `useLayoutEffect`    | `useBeforePaint`  |
| `useInsertionEffect` | `useBeforeLayout` |
| `useEffectEvent`     | `useStableEvent`  |


## معالجات الأحداث

```tsx
import { useState } from "@bgub/fig";
import { on } from "@bgub/fig-dom";

function Counter() {
  const [count, setCount] = useState(0);
  const onClick = on("click", () => setCount((count) => count + 1));

  return <button mix={onClick}>Count: {count}</button>;
}
```

تستخدم معالجات الأحداث mixins أيضًا! وهذا يسهّل جدًا إنشاء أدوات لإتاحة الوصول مثل `button` من دون إضافة عناصر تغليف.

تتلقى معالجات الأحداث كائن `AbortSignal` يُجهَض عند إعادة الإدخال وإزالة المستمع. وهي تستخدم أحداث المتصفح الأصلية داخليًا بدلًا من الأحداث الاصطناعية كما في React.


## ربط نموذج كائنات المستند (DOM)

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

يستخدم Fig الدالة `bind` للوصول إلى DOM بدلًا من المراجع و`forwardRef` و`.current`. إذا أردت الوصول المستمر إلى عنصر HTML، يمكنك ببساطة فعل شيء كهذا:

```tsx
const ref = useMemo(() => ({ current: null }), [])
return <input bind={(node) => (input.current = node)} />
```


## التشويق

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

في Fig، تُقسَّم `use` في React إلى `readPromise` و`readContext` و`readData` (انظر أدناه). يمكن أن تؤدي `readPromise` و`readData` إلى تشغيل Suspense عبر رمي وعد قيد الانتظار، بينما تكون `readContext` متزامنة دائمًا.

يجب أن تكون هوية الوعد ثابتة (مرّره إليها أو خزّنه مؤقتًا بدلًا من إنشائه عند كل عملية عرض).


## السياق

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

تعمل السياقات كموفّرات بحد ذاتها، لذا لا تحتاج إلى `.Provider` أو `.Consumer`.

يحلّ `readContext` محلّ كلٍّ من `useContext(ctx)` و`use(ctx)` في React. ولا يستهلك خانة خطّاف، لذا يمكنك استدعاؤه بشكل شرطي (مثل `use`، بخلاف `useContext`).


## مصادر البيانات

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

تُعد هذه الميزة مفيدةً بشكل خاص لمؤلفي المكتبات والأطر! تُسنِد `readData()` مفتاحًا إلى البيانات، وتُعلّق التنفيذ أثناء التحميل، وتُسجّل المكوّن الذي استدعاها للاشتراك. عند استدعاء `refreshData`، تبقى القيمة الحالية ظاهرة إلى أن تصل القيمة الجديدة.


## مكوّنات الخادم (من دون إطار فوقي)

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

تُعد مكوّنات الخادم من **أقوى ميزات Fig**، ويمكنك استخدامها حتى من دون إطار فوقي.

إنها مجرد مكوّنات عادية نُصيّرها ونسلسلها إلى JSON. نستخدم مصطلح &quot;Payload&quot; لتمييزها عن RSCs، ولأننا نستخدم تنسيق نقل خاصًا بنا. عند تحديث تدفّق الحمولة، تظل النسخة القديمة ظاهرة إلى أن تتدفّق النسخة البديلة.


## مكوّنات الخادم (باستخدام إطار عمل فوقي)

```tsx
import { refreshData, Suspense } from "@bgub/fig";
import { createPayloadComponent, on } from "@bgub/fig-dom";
import { serverPayload } from "@bgub/fig-tanstack-start/payload";
import { getUser } from "./database.server.ts";

// هذا المكوّن يعمل على الخادم فقط!
// أي تحديث يبثّ الحمولة المُسلسَلة الجديدة إلى المتصفح
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

هنا، يحوّل TanStack الدالة `serverPayload()` إلى دالة خاصة لا تعمل إلا على الخادم (ويحوّل `load` إلى دالة تستدعي مسارًا صغيرًا مُولَّدًا لواجهة برمجة التطبيقات).


## موارد الوسائط

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

صُمم Fig ليبرع في بناء الأطر الفوقية. لا تُكتشف هذه الموارد إلا عند تصيير `Map`. يتولى Fig إزالة التكرار ورفعها، ويضمن تحميل أوراق الأنماط الحاجبة قبل إظهار المحتوى التابع.


## انتقالات العرض

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

يوفّر Fig دعمًا أصيلًا لانتقالات العرض! ولتقليل حجم الحزمة، يجب تفعيلها صراحةً. يمكنك الاطلاع على بعض الأمثلة الرائعة على موقعي الإلكتروني.


## أخرى

واجهات برمجة التطبيقات التالية متشابهة إلى حد كبير مع نظيراتها في React: `useState`، `useMemo`، `useCallback`، `useId`، `useDeferredValue`، `useSyncExternalStore`، `createElement`، `isValidElement`، `Fragment`، `createPortal`، `flushSync`، `Suspense`، `Activity`، `createRoot`، `hydrateRoot`، بالإضافة إلى `.render()` و`.unmount()` الخاصة بالجذر.

## جرّبه

عملتُ على Fig خلال الأشهر القليلة الماضية. لا أستطيع ضمان استقراره، لكنه خضع لاختبارات جيدة إلى حدّ ما. أعطِ وكيلك هذا الموجّه:

```
أعد كتابة موقعي باستخدام Fig TanStack Start. استخدم https://github.com/bgub/bengubler.com كمرجع.

قارن بين حجم الحزمة والأداء قبل التغيير وبعده.
```

اطّلع على الشفرة المصدرية والتوثيق على [GitHub](https://github.com/bgub/fig)!
