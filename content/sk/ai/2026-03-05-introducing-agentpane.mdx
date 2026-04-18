---
title: "Predstavujeme agentpane"
description: "Lokálne webové rozhranie pre AI agentov na programovanie. Viacero panelov, viacero relácií, streamovanie — spustite Claude Code a Codex vedľa seba priamo z prehliadača."
date: "2026-03-05"
tags: [ml/ai, open-source, frontend]
---

# Predstavujeme agentpane

agentpane je lokálne webové rozhranie pre AI agentov na programovanie. Spustíte `npx agentpane`, otvorí sa v prehliadači a môžete komunikovať s Claude Code, Codexom alebo akýmkoľvek agentom, ktorý podporuje [ACP (Agent Client Protocol)](https://github.com/anthropics/agent-protocol) — a to všetko z rozhrania s viacerými panelmi, so streamovaním, s perzistenciou a správou relácií:

```bash
npx agentpane
# → http://localhost:6767
```

Vyberte si agenta, zvoľte pracovný adresár a spustite reláciu. Agent beží ako podproces na vašom počítači. Žiadny cloud, žiadne nasadenie, žiadne účty.

![Obrazovka nastavenia agentpane s výberom agenta a adresára](/blog-images/agentpane-setup.png)

## Viac panelov, viac agentov

Najviac som chcel možnosť spustiť naraz viac agentov a vidieť ich vedľa seba. agentpane vám dá až štyri panely s meniteľnou veľkosťou a kartami. Relácie môžete pretiahnuť z bočného panela do ľubovoľného panelu alebo potiahnutím karty rozdeliť panel na nový. Rozloženie zostane zachované aj po obnovení stránky.

To znamená, že v jednom paneli môžete mať Claude Code, ktorý pracuje na vašom backende, a v druhom Codex, ktorý refaktoruje váš frontend — na jednej obrazovke, v jednej aplikácii.

![Dve relácie spustené vedľa seba — Codex vľavo, Claude Code vpravo](/blog-images/agentpane-hero.png)

## Architektúra

Aplikácia pozostáva z dvoch procesov:

* **API server** (Hono, port 3456) — spúšťa agentov, spravuje relácie a zabezpečuje perzistenciu
* **Webový frontend** (Next.js, port 6767) — používateľské rozhranie, v ktorom sa volania na `/api` prepisujú na backend

Backend je postavený na [Effect.ts](https://effect.website/) a používa vkladanie závislostí prostredníctvom skladateľných servisných vrstiev:

```
SessionRepo (DB)
  → ConnectionManager (agent subprocess lifecycle)
  → PromptEngine (turn orchestration)
  → EventHub / EventBroadcaster (SSE)
  → WriteQueue (batched DB writes)
```

Agenti komunikujú cez ACP — JSON-RPC 2.0 cez stdio. Keď odošlete prompt, `PromptEngine` vytvorí záznamy jednotlivých kôl, odovzdá správu podprocesu agenta cez ACP a výsledky potom streamuje späť prostredníctvom Server-Sent Events.

### Streamovanie s bezpečným opätovným pripojením

Frontend sa v každej relácii pripája k SSE endpointu. Každá udalosť dostane monotónne rastúce ID. `EventBroadcaster` udržiava kruhový buffer (512 KB / 1000 udalostí), takže ak sa váš prehliadač odpojí a znova pripojí, doplní zmeškané udalosti pomocou hlavičky `Last-Event-ID`. Žiadne výpadky v konverzácii, bez potreby ručného obnovenia.

### Persistencia odolná voči pádom

Celý stav sa ukladá do lokálnej databázy SQLite v `~/.agentpane/agentpane.db`. Zápisy sa však nevykonávajú priamo — `WriteQueue` zhromažďuje operácie a každých 50 ms ich dávkovo zapíše. Pred samotným zápisom sa operácie uložia do tabuľky na obnovu. Ak server spadne uprostred zápisu, po reštarte pokračuje tam, kde skončil. Bez straty správ.

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

agentpane nerieši, ktorý model agenta poháňa — komunikuje cez ACP. Keď sa pripojíte k relácii, `ConnectionManager`:

1. Nájde binárku agenta (prechádza `node_modules/.bin/` kvôli kompatibilite s npm)
2. Spustí ju ako podproces so stdio rúrami
3. Vyjedná podporované možnosti ACP (auth, config, modes, commands)
4. Ak sa znovu pripája k predchádzajúcej relácii, pokúsi sa ju obnoviť

Používateľské rozhranie sa prispôsobí tomu, čo agent podporuje. Ak agent ponúka možnosti konfigurácie, zobrazia sa ako rozbaľovacie ponuky. Ak podporuje slash príkazy, budete mať automatické dopĺňanie. Ak priebežne posiela bloky myšlienok, zobrazia sa ako zbaliteľné sekcie.

## Frontend

Webová aplikácia je postavená na Next.js 16 s Reactom 19 a React Compilerom — nikde sa manuálne nepoužíva `useMemo` ani `useCallback`. Stav je rozdelený do dvoch vrstiev kontextu:

* **SessionProvider** — aktívna relácia, kontroly stavu, CRUD operácie relácie
* **LayoutProvider** — konfigurácia panelov, poradie kariet, drag-and-drop

Stav na serveri (relácie, konverzácie, využitie tokenov) sa spravuje pomocou TanStack React Query a zneplatňuje sa pri SSE udalostiach. Markdown sa vykresľuje priebežne počas streamovania pomocou [Streamdown](https://github.com/anthropics/streamdown) so zvýrazňovaním syntaxe cez Shiki.

## Vyskúšajte to

```bash
npx agentpane
```

Zdrojový kód je na [GitHub](https://github.com/bgub/agentpane). Dokumentácia je v `apps/docs`.