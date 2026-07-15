---
title: "Představujeme agentpane"
description: "Lokální webové UI pro AI agenty pro psaní kódu. Více panelů, více relací, streamování — spouštějte Claude Code a Codex vedle sebe přímo z prohlížeče."
date: "2026-03-05"
tags: [ml/ai, open-source, frontend]
---

# Představujeme agentpane

agentpane je lokální webové UI pro AI agenty pro psaní kódu. Spustíte `npx agentpane`, otevře se v prohlížeči a můžete komunikovat s Claude Code, Codexem nebo jakýmkoli agentem, který umí [ACP (Agent Client Protocol)](https://github.com/anthropics/agent-protocol) — to vše ve vícepanelovém rozhraní se streamováním, perzistencí a správou relací:

```bash
npx agentpane
# → http://localhost:6767
```

Vyberte agenta, zvolte pracovní adresář a spusťte relaci. Agent běží jako podproces na vašem počítači. Bez cloudu, bez nasazování, bez účtů.

![Obrazovka nastavení agentpane s výběrem agenta a adresáře](/blog-images/agentpane-setup.png)

## Více panelů, více agentů

Hlavně jsem chtěl mít možnost spustit více agentů najednou a vidět je vedle sebe. agentpane nabízí až čtyři panely s kartami, jejichž velikost si můžete upravit. Relace můžete přetáhnout z postranního panelu do libovolného panelu nebo přetažením karty otevřít nový. Rozvržení zůstane zachované i po obnovení stránky.

To znamená, že v jednom panelu můžete mít Claude Code, který pracuje na vašem backendu, a v jiném Codex refaktorující váš frontend — na jedné obrazovce, v jedné aplikaci.

![Dvě relace spuštěné vedle sebe — vlevo Codex, vpravo Claude Code](/blog-images/agentpane-hero.png)

## Architektura

Aplikace běží ve dvou procesech:

* **API server** (Hono, port 3456) — spouští agenty, spravuje relace a zajišťuje perzistenci
* **Webový frontend** (Next.js, port 6767) — UI, ve kterém se volání na `/api` přepisují na backend

Backend je postaven na [Effect.ts](https://effect.website/) a používá dependency injection prostřednictvím kompozovatelných servisních vrstev:

```
SessionRepo (DB)
  → ConnectionManager (agent subprocess lifecycle)
  → PromptEngine (turn orchestration)
  → EventHub / EventBroadcaster (SSE)
  → WriteQueue (batched DB writes)
```

Agenti komunikují přes ACP — JSON-RPC 2.0 přes stdio. Když odešlete prompt, `PromptEngine` vytvoří záznamy jednotlivých tahů, předá zprávu podprocesu agenta přes ACP a průběžně posílá výsledky zpět prostřednictvím Server-Sent Events.

### Streamování s bezpečným opětovným připojením

Frontend se pro každou relaci připojuje k SSE endpointu. Každá událost dostane monotónně rostoucí ID. `EventBroadcaster` udržuje kruhový buffer (512 KB / 1000 událostí), takže pokud se váš prohlížeč odpojí a znovu připojí, přehraje zmeškané události pomocí hlavičky `Last-Event-ID`. Žádné mezery v konverzaci, žádné ruční obnovování není potřeba.

### Perzistence odolná vůči pádům

Veškerý stav se ukládá do lokální databáze SQLite v `~/.agentpane/agentpane.db`. Zápisy ale neprobíhají přímo — `WriteQueue` shromažďuje operace a každých 50 ms je dávkově zapisuje. Před samotným zápisem se operace uloží do tabulky pro obnovu. Pokud server během zápisu spadne, po restartu naváže tam, kde skončil. Žádná ztráta zpráv.

```sql
-- Tabulka pro zotavení
CREATE TABLE write_queue_ops (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  op_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Co vidí agenti

agentpane neřeší, jaký model agenta pohání — komunikuje přes ACP. Když se připojíte k relaci, `ConnectionManager`:

1. Najde binárku agenta (kvůli kompatibilitě s npm prohledá `node_modules/.bin/`)
2. Spustí ji jako podřízený proces se stdio pipes
3. Vyjedná možnosti ACP (auth, config, modes, commands)
4. Pokud se znovu připojuje k předchozí relaci, pokusí se ji obnovit

UI se přizpůsobí tomu, co agent podporuje. Pokud agent nabízí možnosti konfigurace, zobrazí se jako rozbalovací nabídky. Pokud podporuje `slash commands`, budete mít automatické doplňování. Pokud streamuje bloky úvah, zobrazí se jako sbalitelné sekce.

## Frontend

Webová aplikace používá Next.js 16 s Reactem 19 a React Compilerem — nikde žádné ručně psané `useMemo` ani `useCallback`. Stav je rozdělený do dvou kontextových vrstev:

* **SessionProvider** — aktivní relace, kontroly stavu, CRUD operace nad relacemi
* **LayoutProvider** — konfigurace panelů, pořadí karet, drag-and-drop

Stav na serveru (relace, konverzace a využití tokenů) se spravuje pomocí TanStack React Query a zneplatňuje při událostech SSE. Markdown se vykresluje průběžně během streamování pomocí [Streamdown](https://github.com/anthropics/streamdown) se zvýrazňováním syntaxe od Shiki.

## Vyzkoušejte si to

```bash
npx agentpane
```

Zdrojový kód je na [GitHub](https://github.com/bgub/agentpane). Dokumentace je v `apps/docs`.
