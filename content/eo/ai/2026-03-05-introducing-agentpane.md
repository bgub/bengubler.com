---
title: "Konatiĝu kun agentpane"
description: "Loka reta interfaco por AI-programadaj agentoj. Plurpanela, plursesia, kun fluado — rulu Claude Code kaj Codex flank-al-flanke en via retumilo."
date: "2026-03-05"
tags: [ml/ai, open-source, frontend]
---

# Konatiĝu kun agentpane

agentpane estas loka reta interfaco por AI-kodaj agentoj. Vi rulas `npx agentpane`, ĝi malfermiĝas en via retumilo, kaj vi povas paroli kun Claude Code, Codex aŭ iu ajn agento, kiu subtenas [ACP (Agent Client Protocol)](https://github.com/anthropics/agent-protocol) — ĉio ĉi en plurpanela interfaco kun fluado, persisto kaj administrado de sesioj:

```bash
npx agentpane
# → http://localhost:6767
```

Elektu agenton, elektu labordosierujon kaj komencu sesion. La agento funkcias kiel subprocezo en via komputilo. Neniu nubo, neniu deplojo, neniuj kontoj.

![La agordekrano de agentpane kun elekto de agento kaj dosierujo](/blog-images/agentpane-setup.png)

## Plurpanela, Pluragenta

La ĉefa afero, kiun mi deziris, estis povi ruli plurajn agentojn samtempe kaj vidi ilin unu apud la alia. agentpane donas al vi ĝis kvar regrandigeblajn panelojn kun langetoj. Vi povas treni sesiojn el la flankobreto en iun ajn panelon, aŭ treni langeton por dividi ĝin en novan. La aranĝo restas konservita post reŝargoj.

Tio signifas, ke vi povas havi Claude Code laborantan pri via backendo en unu panelo kaj Codex restrukturantan vian frontendon en alia — sama ekrano, sama aplikaĵo.

![Du sesioj rulataj unu apud la alia — Codex maldekstre, Claude Code dekstre](/blog-images/agentpane-hero.png)

## Arkitekturo

La aplikaĵo konsistas el du procezoj:

* **API-servilo** (Hono, pordo 3456) — startigas agentojn, administras sesiojn, prizorgas persiston
* **Reta frontendo** (Next.js, pordo 6767) — la interfaco, kun vokoj al `/api` plusendataj al la backend

La backendo estas konstruita per [Effect.ts](https://effect.website/) kaj uzas dependecinjekton per kunmeteblaj servotavoloj:

```
SessionRepo (DB)
  → ConnectionManager (agent subprocess lifecycle)
  → PromptEngine (turn orchestration)
  → EventHub / EventBroadcaster (SSE)
  → WriteQueue (batched DB writes)
```

Agentoj komunikas per ACP — JSON-RPC 2.0 super stdio. Kiam vi sendas prompton, la `PromptEngine` kreas registrojn pri interagoj, plusendas la mesaĝon al la agenta subprocezo per ACP, kaj elsendas la rezultojn reen per Server-Sent Events.

### Fluado kun sekura rekonekto

La frontendo abonas SSE-finpunkton por ĉiu sesio. Ĉiu evento ricevas monotonan ID-on. La `EventBroadcaster` tenas ciklan bufron (512KB / 1000 eventoj), por ke se via retumilo malkonektiĝas kaj rekonektiĝas, ĝi reliveru maltrafitajn eventojn per la kaplinio `Last-Event-ID`. Neniuj mankoj en la konversacio, neniu mana refreŝigo necesas.

### Persisto sekura kontraŭ kraŝoj

La tuta stato iras al loka SQLite-datumbazo ĉe `~/.agentpane/agentpane.db`. Sed skriboj ne okazas tuj — la `WriteQueue` amasigas operaciojn kaj enskribas ilin grupe ĉiujn 50 ms. Antaŭ tio, la operacioj estas konservataj en reakira tabelo. Se la servilo kraŝas meze de la enskribo, ĝi rekomencas de tie, kie ĝi ĉesis, post restartigo. Neniu mesaĝo perdiĝas.

```sql
-- La reakirotabelo
CREATE TABLE write_queue_ops (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  op_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Kion vidas la agentoj

agentpane ne gravas, kiu modelo funkciigas la agenton — ĝi parolas ACP. Kiam vi konektiĝas al sesio, la `ConnectionManager`:

1. Trovas la agentan binaraĵon (traserĉas `node_modules/.bin/` por kongrueco kun npm)
2. Lanĉas ĝin kiel subprocezon kun stdio-tuboj
3. Negocas ACP-kapablojn (aŭtentigo, agordo, reĝimoj, komandoj)
4. Provas restarigi la sesion, se temas pri rekonekto al antaŭa sesio

La interfaco adaptiĝas al ĉio, kion la agento subtenas. Se la agento disponigas agordajn opciojn, ili aperas kiel falmenuoj. Se ĝi subtenas `slash commands`, vi ricevas aŭtomatan kompletigon. Se ĝi elsendas pensoblokojn, ili montriĝas kiel faldeblaj sekcioj.

## La frontendo

La retaplikaĵo uzas Next.js 16 kun React 19 kaj la React Compiler — nenie necesas mana `useMemo` aŭ `useCallback`. La stato estas dividita en du kuntekstajn tavolojn:

* **SessionProvider** — aktiva sesio, sankontroloj, sesia CRUD
* **LayoutProvider** — panela agordo, ordigo de langetoj, trenado kaj demetado

Servila stato (sesioj, konversacioj, uzado de tokenoj) estas administrata per TanStack React Query kaj malvalidigata post SSE-okazaĵoj. Markdown bildiĝas dum ĝi alfluas per [Streamdown](https://github.com/anthropics/streamdown) kun sintaksa reliefigo de Shiki.

## Provu ĝin

```bash
npx agentpane
```

La fontkodo estas sur [GitHub](https://github.com/bgub/agentpane). La dokumentaro estas ĉe `apps/docs`.
