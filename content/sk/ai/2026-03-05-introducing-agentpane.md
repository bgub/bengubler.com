---
title: "Predstavujeme agentpane"
description: "Lokálne webové UI pre AI agentov pre programovanie. Viacero panelov, viacero relácií, streamovanie — spúšťajte Claude Code a Codex vedľa seba v prehliadači."
date: "2026-03-05"
tags: [ml/ai, open-source, frontend]
---

# Predstavujeme agentpane

agentpane je lokálne webové UI pre AI agentov na programovanie. Spustíte `npx agentpane`, otvorí sa v prehliadači a môžete komunikovať s Claude Code, Codexom alebo akýmkoľvek agentom, ktorý podporuje [ACP (Agent Client Protocol)](https://github.com/anthropics/agent-protocol) — to všetko v rozhraní s viacerými panelmi, streamovaním, perzistenciou a správou relácií:

```bash
npx agentpane
# → http://localhost:6767
```

Vyberte agenta, zvoľte pracovný adresár a spustite reláciu. Agent beží ako podproces na vašom počítači. Bez cloudu, bez nasadenia, bez účtov.

![Obrazovka nastavenia agentpane s výberom agenta a adresára](/blog-images/agentpane-setup.png)

## Viac panelov, viac agentov

Najviac som chcel možnosť spustiť naraz viacero agentov a vidieť ich vedľa seba. agentpane ponúka až štyri panely s nastaviteľnou veľkosťou a kartami. Relácie môžete presúvať z bočného panela do ľubovoľného panelu alebo potiahnutím karty vytvoriť nový panel. Rozloženie zostane zachované aj po obnovení stránky.

To znamená, že v jednom paneli môžete mať Claude Code, ktorý pracuje na vašom backende, a v druhom Codex, ktorý refaktoruje váš frontend — na tej istej obrazovke, v tej istej aplikácii.

![Dve relácie spustené vedľa seba — Codex vľavo, Claude Code vpravo](/blog-images/agentpane-hero.png)

## Architektúra

Aplikácia pozostáva z dvoch procesov:

* **API server** (Hono, port 3456) — spúšťa agentov, spravuje relácie, zabezpečuje perzistenciu
* **Web frontend** (Next.js, port 6767) — UI, kde sa volania na `/api` prepisujú na backend

Backend je postavený na [Effect.ts](https://effect.website/) a používa dependency injection cez kompozovateľné servisné vrstvy:

```
SessionRepo (DB)
  → ConnectionManager (agent subprocess lifecycle)
  → PromptEngine (turn orchestration)
  → EventHub / EventBroadcaster (SSE)
  → WriteQueue (batched DB writes)
```

Agenti komunikujú cez ACP — JSON-RPC 2.0 cez stdio. Keď odošlete prompt, `PromptEngine` vytvorí záznamy jednotlivých výmen, odošle správu podprocesu agenta cez ACP a priebežne posiela výsledky späť cez Server-Sent Events.

### Streaming s bezpečným opätovným pripojením

Frontend sa pre každú reláciu pripája k SSE endpointu. Každá udalosť dostane monotónne rastúce ID. `EventBroadcaster` udržiava kruhový buffer (512KB / 1000 udalostí), takže ak sa váš prehliadač odpojí a znova pripojí, pomocou hlavičky `Last-Event-ID` znovu odošle zmeškané udalosti. Žiadne medzery v konverzácii, bez potreby manuálneho obnovenia.

### Perzistencia odolná proti pádu

Všetok stav sa ukladá do lokálnej databázy SQLite v `~/.agentpane/agentpane.db`. Zápisy však neprebiehajú priamo — `WriteQueue` zhromažďuje operácie a každých 50 ms ich hromadne zapíše. Predtým sa operácie uložia do obnovovacej tabuľky. Ak server spadne uprostred zápisu, po reštarte bude pokračovať tam, kde skončil. Bez straty správ.

```sql
-- Tabuľka obnovy
CREATE TABLE write_queue_ops (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  op_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Čo agenti vidia

agentpane nezaujíma, aký model agenta poháňa — komunikuje cez ACP. Keď sa pripojíte k relácii, `ConnectionManager`:

1. Nájde binárny súbor agenta (prehľadá `node_modules/.bin/` kvôli kompatibilite s npm)
2. Spustí ho ako podproces so stdio pipe-mi
3. Dohodne možnosti ACP (auth, config, modes, commands)
4. Ak sa znovu pripája k predchádzajúcej relácii, pokúsi sa ju obnoviť

UI sa prispôsobí tomu, čo agent podporuje. Ak agent sprístupňuje možnosti konfigurácie, zobrazia sa ako rozbaľovacie ponuky. Ak podporuje `slash commands`, budete mať automatické dopĺňanie. Ak streamuje bloky myšlienok, zobrazia sa ako zbaliteľné sekcie.

## Frontend

Webová aplikácia je postavená na Next.js 16 s Reactom 19 a React Compilerom — nikde sa manuálne nepoužíva `useMemo` ani `useCallback`. Stav je rozdelený do dvoch vrstiev kontextu:

* **SessionProvider** — aktívna relácia, kontroly stavu, CRUD operácie relácií
* **LayoutProvider** — konfigurácia panelov, poradie kariet, drag-and-drop

Stav na serveri (relácie, konverzácie, využitie tokenov) sa spravuje pomocou TanStack React Query a invaliduje sa pri SSE udalostiach. Markdown sa vykresľuje priebežne počas streamovania pomocou [Streamdown](https://github.com/anthropics/streamdown) so zvýrazňovaním syntaxe cez Shiki.

## Vyskúšajte si to

```bash
npx agentpane
```

Zdrojový kód je na [GitHube](https://github.com/bgub/agentpane). Dokumentácia je v `apps/docs`.
