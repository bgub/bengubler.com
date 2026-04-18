---
title: "Představuji agentpane"
description: "Lokální webové rozhraní pro AI agenty na psaní kódu. Více panelů, více relací, streamování — spusťte Claude Code a Codex vedle sebe přímo v prohlížeči."
date: "2026-03-05"
tags: [ml/ai, open-source, frontend]
---

# Představujeme agentpane

agentpane je lokální webové rozhraní pro AI programovací agenty. Spustíte `npx agentpane`, otevře se v prohlížeči a můžete si povídat s Claude Code, Codexem nebo jakýmkoli agentem, který komunikuje přes [ACP (Agent Client Protocol)](https://github.com/anthropics/agent-protocol) — to vše v rozhraní s více panely, streamováním, perzistencí a správou relací:

```bash
npx agentpane
# → http://localhost:6767
```

Vyberte agenta, pracovní adresář a spusťte relaci. Agent běží jako podproces na vašem počítači. Bez cloudu, bez nasazování, bez účtů.

![Obrazovka nastavení agentpane s výběrem agenta a adresáře](/blog-images/agentpane-setup.png)

## Více panelů, více agentů

Hlavní věc, kterou jsem chtěl, byla možnost spustit více agentů najednou a mít je vedle sebe. agentpane nabízí až čtyři panely s nastavitelnou velikostí a kartami. Relace můžete přetáhnout z postranního panelu do libovolného panelu nebo přetažením karty vytvořit nový panel. Rozvržení zůstane zachované i po obnovení stránky.

To znamená, že v jednom panelu může Claude Code pracovat na vašem backendu a v druhém může Codex refaktorovat frontend — na jedné obrazovce, v jedné aplikaci.

![Dvě relace běžící vedle sebe — vlevo Codex, vpravo Claude Code](/blog-images/agentpane-hero.png)

## Architektura

Aplikace běží ve dvou procesech:

* **API server** (Hono, port 3456) — spouští agenty, spravuje relace a zajišťuje persistenci
* **Webový frontend** (Next.js, port 6767) — uživatelské rozhraní s voláními `/api` přepisovanými na backend

Backend je postavený na [Effect.ts](https://effect.website/) a používá dependency injection prostřednictvím skládatelných servisních vrstev:

```
SessionRepo (DB)
  → ConnectionManager (agent subprocess lifecycle)
  → PromptEngine (turn orchestration)
  → EventHub / EventBroadcaster (SSE)
  → WriteQueue (batched DB writes)
```

Agenti komunikují přes ACP — JSON-RPC 2.0 nad stdio. Když odešlete prompt, `PromptEngine` vytvoří záznamy jednotlivých kol, předá zprávu podprocesu agenta přes ACP a průběžně streamuje výsledky zpět přes Server-Sent Events.

### Streamování s bezpečným obnovením spojení

Frontend se v rámci každé relace připojuje k SSE endpointu. Každá událost má monotonně rostoucí ID. `EventBroadcaster` udržuje kruhový buffer (512KB / 1000 událostí), takže pokud se prohlížeč odpojí a znovu připojí, přehraje zmeškané události pomocí hlavičky `Last-Event-ID`. Bez výpadků v konverzaci a bez nutnosti ručního obnovení.

### Perzistence odolná proti pádu

Veškerý stav se ukládá do lokální databáze SQLite v `~/.agentpane/agentpane.db`. Zápisy ale neprobíhají přímo — `WriteQueue` shromažďuje operace a každých 50 ms je dávkově zapíše. Před samotným zápisem se operace uloží do tabulky pro obnovu. Pokud server během zápisu spadne, po restartu naváže tam, kde skončil. Žádná ztráta zpráv.

```sql
-- Tabulka pro obnovu
CREATE TABLE write_queue_ops (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  op_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Co agenti vidí

agentpane neřeší, jaký model agenta pohání — komunikuje přes ACP. Když se připojíte k relaci, `ConnectionManager`:

1. Vyhledá binárku agenta (kvůli kompatibilitě s npm prochází `node_modules/.bin/`)
2. Spustí ji jako podřízený proces se stdio rourami
3. Vyjedná možnosti ACP (auth, config, modes, commands)
4. Při opětovném připojení k předchozí relaci se pokusí relaci obnovit

Uživatelské rozhraní se přizpůsobí tomu, co agent podporuje. Pokud agent zpřístupňuje možnosti konfigurace, zobrazí se jako rozbalovací nabídky. Pokud podporuje slash commands, budete mít automatické doplňování. Pokud průběžně posílá bloky úvah, zobrazí se jako sbalitelné sekce.

## Frontend

Webová aplikace běží na Next.js 16 s Reactem 19 a React Compilerem — nikde není potřeba ručně používat `useMemo` ani `useCallback`. Stav je rozdělen do dvou vrstev kontextu:

* **SessionProvider** — aktivní relace, kontroly stavu, CRUD operace nad relacemi
* **LayoutProvider** — konfigurace panelů, pořadí karet, drag-and-drop

Serverový stav (relace, konverzace, využití tokenů) se spravuje pomocí TanStack React Query a při SSE událostech se invaliduje. Markdown se vykresluje průběžně tak, jak přichází, pomocí [Streamdown](https://github.com/anthropics/streamdown) se zvýrazňováním syntaxe přes Shiki.

## Vyzkoušejte si to

```bash
npx agentpane
```

Zdrojový kód je na [GitHubu](https://github.com/bgub/agentpane). Dokumentace je v `apps/docs`.