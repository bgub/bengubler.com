---
title: "Prezentante agentpane"
description: "Loka reta interfaco por AI-agentoj por programado. Plurpanela, plursesia, kun fluado — rulu Claude Code kaj Codex flank-al-flanke el via retumilo."
date: "2026-03-05"
tags: [ml/ai, malfermitkoda, frontendo]
---

# Jen agentpane

agentpane estas loka reta interfaco por AI-agentoj por programado. Vi rulas `npx agentpane`, ĝi malfermiĝas en via retumilo, kaj vi povas paroli kun Claude Code, Codex aŭ iu ajn agento, kiu subtenas [ACP (Agent Client Protocol)](https://github.com/anthropics/agent-protocol) — ĉio per plurpanela interfaco kun fluado, persisto kaj seancoadministrado:

```bash
npx agentpane
# → http://localhost:6767
```

Elektu agenton, elektu labordosierujon kaj komencu sesion. La agento funkcias kiel subprocezo sur via komputilo. Neniu nubo, neniu deplojo, neniuj kontoj.

![La agorda ekrano de agentpane kun elekto de agento kaj dosierujo](/blog-images/agentpane-setup.png)

## Pluraj paneloj, pluraj agentoj

La ĉefa afero, kiun mi deziris, estis la eblo samtempe funkciigi plurajn agentojn kaj vidi ilin unu apud la alia. agentpane ofertas ĝis kvar regrandigeblajn panelojn kun langetoj. Vi povas treni sesiojn el la flankobreto en iun ajn panelon, aŭ treni langeton por disigi ĝin en novan panelon. La aranĝo konserviĝas post reŝargoj.

Tio signifas, ke vi povas havi Claude Code laborantan pri via backend en unu panelo kaj Codex refaktorantan vian frontend en alia — sama ekrano, sama aplikaĵo.

![Du sesioj unu apud la alia — Codex maldekstre, Claude Code dekstre](/blog-images/agentpane-hero.png)

## Arkitekturo

La aplikaĵo konsistas el du procezoj:

* **API-servilo** (Hono, pordo 3456) — kreas agentojn, administras sesiojn, prizorgas persiston
* **Reteja frontendo** (Next.js, pordo 6767) — la UI, kun `/api`-vokoj alidirektataj al la backend

La backend estas konstruita per [Effect.ts](https://effect.website/) kaj uzas injekton de dependecoj per kunmeteblaj servotavoloj:

```
SessionRepo (DB)
  → ConnectionManager (agent subprocess lifecycle)
  → PromptEngine (turn orchestration)
  → EventHub / EventBroadcaster (SSE)
  → WriteQueue (batched DB writes)
```

Agentoj komunikas per ACP — JSON-RPC 2.0 per stdio. Kiam vi sendas prompton, la `PromptEngine` kreas registrojn de interagoj, plusendas la mesaĝon al la agenta subprocezo per ACP, kaj elsendas la rezultojn reen per Server-Sent Events.

### Fluado kun sekura rekonekto

La frontendo abonas SSE-finpunkton por ĉiu sesio. Ĉiu evento ricevas monotonan identigilon. La `EventBroadcaster` tenas ringan bufron (512KB / 1000 eventoj), tiel ke se via retumilo malkonektiĝas kaj poste rekonektiĝas, ĝi reasendas la mankitajn eventojn uzante la kaplinion `Last-Event-ID`. Neniuj mankoj en la konversacio, kaj neniu mana reŝargo necesas.

### Paneorezista persisto

La tuta stato estas konservata en loka SQLite-datumbazo ĉe `~/.agentpane/agentpane.db`. Sed skriboj ne okazas tuj — la `WriteQueue` amasigas operaciojn kaj skribas ilin aro-post-are ĉiujn 50 ms. Antaŭ ol skribi la aron, la operacioj estas konservataj en reakira tabelo. Se la servilo paneas meze de la skribado, ĝi post rekomenco daŭrigas de kie ĝi ĉesis. Neniu mesaĝo perdiĝas.

```sql
-- La rekupera tabelo
CREATE TABLE write_queue_ops (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  op_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Kion agentoj vidas

agentpane ne zorgas pri tio, kiu modelo funkciigas la agenton — ĝi parolas ACP-on. Kiam vi konektiĝas al sesio, la `ConnectionManager`:

1. Trovas la agentan programdosieron (traserĉas `node_modules/.bin/` por kongrueco kun npm)
2. Lanĉas ĝin kiel idan procezon kun stdio-tuboj
3. Intertraktas ACP-kapablojn (aŭtentigo, agordoj, reĝimoj, komandoj)
4. Provas rekomenci sesion, se ĝi rekonektiĝas al antaŭa sesio

La interfaco adaptiĝas al tio, kion la agento subtenas. Se la agento disponigas agordajn opciojn, ili aperas kiel falmenuoj. Se ĝi subtenas oblikvostrekajn komandojn, vi ricevas aŭtomatan kompletigon. Se ĝi fluigas pensoblokojn, ili montriĝas kiel kunfaldeblaj sekcioj.

## La frontendo

La retaplikaĵo uzas Next.js 16 kun React 19 kaj la React Compiler — sen iu ajn mana `useMemo` aŭ `useCallback`. La stato estas dividita en du kuntekstajn tavolojn:

* **SessionProvider** — aktiva sesio, funkciokontroloj, CRUD de sesioj
* **LayoutProvider** — panela agordo, ordo de langetoj, trenado kaj demetado

Servila stato (sesioj, konversacioj, ĵetona uzado) estas administrata per TanStack React Query, malvalidigata okaze de SSE-eventoj. Markdown montriĝas dum ĝi alfluas per [Streamdown](https://github.com/anthropics/streamdown) kun sintaksa reliefigo de Shiki.

## Provu ĝin

```bash
npx agentpane
```

La fontkodo troviĝas ĉe [GitHub](https://github.com/bgub/agentpane). La dokumentaro estas en `apps/docs`.