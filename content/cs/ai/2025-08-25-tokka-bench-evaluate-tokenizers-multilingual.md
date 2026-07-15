---
title: "Představení tokka-bench"
description: "Komplexní hodnoticí framework pro porovnávání tokenizérů napříč lidskými i programovacími jazyky."
date: "2025-08-25"
tags: [ml/ai, linguistics, open-source]
---

(Spěcháte? Navštivte [tokka-bench.streamlit.app](https://tokka-bench.streamlit.app/))

![Snímek obrazovky grafu tokka-bench](/blog-images/tokka-bench-hero.png)

Před několika měsíci jsem se ve volném čase pustil do nového projektu — předtrénování malého vícejazyčného velkého jazykového modelu. Jak už to u podobných výprav bývá, ta moje se časem stočila jiným směrem a začal jsem se velmi zajímat o jeden konkrétní aspekt trénování modelů: tokenizaci.

Dnes se chci podělit o framework pro vyhodnocování tokenizérů, ale také vysvětlit, jak nám tokenizátory mohou pomoci pochopit:

* Na jakých zdrojích dat mohl být konkrétní model trénován
* Proč některé velké jazykové modely (zejména proprietární modely, jako ChatGPT, Claude a Gemini) dosahují ve vícejazyčných úlohách výrazně lepších výsledků než jiné
* Proč mají Claude, Gemini a modely od GPT 4o výš uzavřené tokenizátory
* Proč jsou některé OSS modely pro jemné doladění vhodnější než jiné

## Technické zázemí

### Kódování písem a gramatika

Chceme-li porozumět tokenizaci, musíme nejdřív pochopit, jak se text kóduje na úrovni bajtů. Všechny jazyky se kódují pomocí UTF-8, ale různá písma vyžadují k zakódování stejného významového obsahu výrazně odlišný počet bajtů. Angličtina má v průměru něco málo přes 1 bajt na znak, takže je mimořádně úsporná. Arabština potřebuje přes 2 bajty na znak, zatímco čínština může pro správné zakódování vyžadovat přes 3 bajty na znak.

Kromě efektivity kódování se jazyky zásadně liší i gramaticky, což ovlivňuje, jak se informace „balí“ do slov. Syntetické jazyky dokážou do jednoho slova vměstnat hodně syntaktických informací. Například mluvím česky, v níž by se výraz jako „vzali se“ do angličtiny přeložil jako „they married each other“. Tato gramatická hutnost ztěžuje porovnávání efektivity kódování.

### Tokenizace

Velké jazykové modely nepracují přímo s bajty — pracují s „tokeny“, což jsou symboly odpovídající skupinám bajtů. Většina moderních tokenizérů používá Byte Pair Encoding (BPE): začíná s jednotlivými bajty a pak iterativně slučuje nejčastější dvojice, aby postupně vytvořila slovník podslovních jednotek.

Existují i alternativní přístupy, například [Byte Latent Transformer](https://ai.meta.com/research/publications/byte-latent-transformer-patches-scale-better-than-tokens/), ale v produkčních systémech se zatím příliš neujaly.

Technických rozhodnutí při návrhu tokenizéru je spousta a mají zásadní dopad:

* Přidávají se mezery na začátek? (Aby se „hello“ v „hello world“ a „ hello world“ tokenizovalo stejně?)
* Zakazuje se slučování bajtů přes hranice bílých znaků? A co přes hranice různých písem?
* Používá se speciální token unknown (UNK), nebo se při výskytu sekvencí mimo slovník přechází zpět na bajty?

Snad vám to pomůže lépe pochopit Karpathyho klasický [příspěvek o tokenizaci](https://x.com/karpathy/status/1759996551378940395):

![Citát od Karpathyho: „Tokenizace je v jádru velké části podivností velkých jazykových modelů...“](https://pbs.twimg.com/media/GGzDbMRasAAZf_D?format=png\&name=medium)

## Jak tokenizace ovlivňuje předtrénování

Vztah mezi tokenizéry a předtrénovacími daty vytváří složitou síť vlivů, které zásadně utvářejí schopnosti modelu. Tokenizéry se často trénují na předtrénovacích datech velkého jazykového modelu, ve kterém se pak používají, ale různé jazyky mají ve slovní zásobě tokenizéru různou míru „pokrytí“.

Vezměme si například khmérštinu. Protože je pro ni online méně zdrojů, menší část slovní zásoby tokenizéru bude odpovídat dekódování do khmérštiny než do angličtiny. Tento rozdíl v pokrytí znamená, že zakódování stejného počtu slov v khmérštině bude vyžadovat mnohem více tokenů než v angličtině. A tady nastává problém: při předtrénování se často používají poměrná rozdělení různých jazyků podle počtu tokenů. To znamená, že můžete trénovat na 10 milionech tokenů anglického textu a 1 milionu tokenů khmérského textu v naději, že budete mít poměr obsahu 10:1. Jenže khmérský text ve skutečnosti ve srovnání s anglickým představuje výrazně méně než 10 % slov!

Sémantické důsledky jsou ještě závažnější. Protože je khmérských tokenů méně, s větší pravděpodobností představují jednotlivá písmena nebo dvojice souhlásek než celé sémantické jednotky. To znamená, že u nedostatečně zastoupených jazyků si modely nemohou tak snadno „ukládat“ koncepty, atributy, definice a další sémantické znalosti do embeddingových vektorů.

Existuje živá open-source komunita, která vytváří jemná doladění OSS základních modelů pro menší jazyky. Pokud váš tokenizér nezpracovává cizí jazyky dobře, jemné doladění bude obtížnější a pravděpodobně si vyžádá rozšíření tokenizéru o vlastní tokeny. Na druhou stranu může zavádění „částečně natrénovaných“ tokenů (tokenů, které se v předtrénovacích datech nevyskytují) velký jazykový model mást a dokonce umožnit i „[token attacks](https://x.com/karpathy/status/1789590397749957117)“.

## Jak tokenizace ovlivňuje inferenci

Rozdíly v tokenizaci, které vznikají během předtrénování, dál způsobují problémy i při inferenci. Text v jazycích s omezenými zdroji (jazycích s malým množstvím online zdrojů) vyžaduje k reprezentaci mnohem více tokenů, což vede k celé řadě navazujících problémů:

**Zhoršení výkonu**: Nižší propustnost se stává výrazným problémem, když každá věta potřebuje k vyjádření 2–3× více tokenů. Uživatelé dostávají pomalé odpovědi a provoz chatů stojí poskytovatele více peněz.

**Omezení kontextu**: Delší sekvence rychleji zaplní kontextové okno a výkon při vybavování informací se zhoršuje, protože model má potíže udržet souvislé porozumění napříč uměle prodlouženými sekvencemi tokenů.

**Kvalita generování**: Výběr tokenů během generování může vnášet chyby. Více tokenů na slovo znamená více „příležitostí něco pokazit“ u každého slova, což může vést k postupnému nabalování odchylek, kdy malé chyby při výběru tokenů přerostou ve větší sémantická selhání.

## Vyhodnocování tokenizérů pomocí tokka-bench

Vytvořil jsem nástroj pro snadné zkoumání výkonu tokenizérů napříč 100 přirozenými jazyky a 20 programovacími jazyky. Začal jsem vyhodnocením 7 tokenizérů: Gemma 3, GPT-2, GPT-4, gpt-oss, Kimi K2, Llama 3 a Qwen 3.

Projekt má několik částí navržených pro různé způsoby použití:

**Open-source repozitář**: Můžete si ho naklonovat a spouštět benchmarky lokálně. [https://github.com/bgub/tokka-bench](https://github.com/bgub/tokka-bench)

**Live dashboard**: Kromě kódu pro spouštění benchmarků jsem vytvořil také živý dashboard! [https://tokka-bench.streamlit.app/](https://tokka-bench.streamlit.app/)

Díky tomu můžete snadno vybírat kombinace jazyků a tokenizérů k porovnání a přepínat mezi různými metrikami, abyste lépe pochopili, že výkon tokenizérů má více rozměrů.

### Datové sady a metodologie

**Datové sady**: Pro vyhodnocení používám tři vysoce kvalitní datové sady, které reprezentují různé textové domény:

* [FineWeb](https://huggingface.co/datasets/HuggingFaceFW/fineweb) pro anglický obsah
* [FineWeb 2](https://huggingface.co/datasets/HuggingFaceFW/fineweb-2) pro ostatní lidské jazyky
* [StarCoder](https://huggingface.co/datasets/bigcode/starcoderdata) pro programovací jazyky

**Metriky podle jazyka**: Z každé datové sady odebírám vzorek 2 MB textu a tokenizuji ho, abych spočítal metriky výkonu specifické pro daný jazyk. Tento přístup má jedno důležité omezení: kvůli rozdílům v kódování UTF-8 představují 2 MB v různých jazycích velmi odlišné množství sémantického obsahu. Lepší přístup by mohl počítat globální „škálovací konstantu“ na základě ekvivalentního sémantického obsahu — například pomocí paralelních překladů normalizovat podle velikosti anglického Harryho Pottera v bajtech dělené počtem sémantických jednotek. V této podobě je proto potřeba mezijazyková srovnání interpretovat opatrně a spolehlivější je porovnávat různé tokenizéry v rámci téhož jazyka.

**Metriky slovníku**: Při analýze samotných slovníků tokenizérů náhodně vybírám 10 000 tokenů ze slovníku každého tokenizéru a analyzuji jejich dekódované vlastnosti.

**Definice jazykových jednotek**: Různé jazyky strukturují informace odlišně, proto pro metriky fertility a dělení definuji „jednotky“ následovně:

* **Jazyky s mezerami**: tokeny na slovo (jednotky oddělené mezerami)
* **Jazyky založené na znacích** (např. čínština, japonština, thajština): tokeny na znak (bez mezer)
* **Jazyky založené na slabikách** (např. tibetština): tokeny na slabiku (jednotky oddělené znakem tsheg, s použitím záložních metod)

## Metriky a výsledky podle jazyků

Porovnejme GPT-2, Llama 3 a Kimi K2 na vzorku rozšířených jazyků, abychom ukázali, jaké poznatky může tokka-bench přinést. Tyto tři modely jsem vybral proto, aby bylo vidět, jak se přístupy k tokenizaci v průběhu času vyvíjely.

Kontext ke každému z nich:

* GPT-2 má velikost slovníku ~50K a byl vydán v únoru 2019
* Llama 3 má velikost slovníku ~128K a byla vydána v dubnu 2024
* Kimi K2 má velikost slovníku ~164K a byl vydán v červenci 2025

### Efektivita (bajty na token)

**`bytes_per_token`**: Průměrný počet bajtů UTF-8 na token (`total_bytes / total_tokens`). Vyšší hodnoty znamenají efektivnější kompresi textu do tokenů.

![Graf bajtů na token ve více jazycích](/blog-images/tokka-bench-efficiency.png)

Rozdíly v efektivitě ukazují na priority při trénování a složení dat. Jazyky s vyšším poměrem bajtů na token se komprimují efektivněji, což naznačuje buď lepší alokaci slovníku, nebo více trénovacích dat pro jeho učení.

**Důležité omezení**: Tato metrika nezohledňuje rozdíly v kódování UTF-8 mezi jednotlivými písmy. Například hindština vykazuje uměle vysokou efektivitu jednoduše proto, že zakódování každého znaku vyžaduje 3 bajty — kdyby bylo k reprezentaci každého znaku hindské abecedy přiřazeno jen 50 tokenů, vycházela by efektivita na 3 bajty na token. Mnoho hindských znaků se však tvoří kombinací souhlásek se samohláskovými značkami nebo souhláskovými shluky, takže přidání tokenů pro tyto kombinace (z nichž každá reprezentuje 6–9 bajtů) může metriku efektivity nafouknout, a přitom stále poskytovat slabé sémantické pokrytí. To neodráží skutečnou sémantickou efektivitu. Tato metrika funguje nejlépe při porovnávání různých tokenizérů v rámci téhož jazyka, spíše než při porovnávání efektivity napříč různými písmy.

### Pokrytí (jedinečné tokeny)

**`unique_tokens`**: Počet různých ID tokenů použitých při kódování ukázkového textu v jednotlivých jazycích. Vyšší hodnoty naznačují lepší pokrytí písma daného jazyka a méně bajtových fallbacků na jednotlivé znaky.

![Graf jedinečných tokenů ve více jazycích](/blog-images/tokka-bench-coverage.png)

Obecně považuji pokrytí za nejvýstižnější ukazatel jazykového složení předtrénovacích dat. Podívejte se, o kolik vyšší je pokrytí čínského písma u Kimi K2 než u ostatních tokenizérů! Přesně to bychom čekali, protože jde o čínský LLM se slovníkem speciálně optimalizovaným pro čínský text.

Hierarchie pokrytí odhaluje jasné tréninkové priority:

* Čínština má v Kimi K2 výjimečné pokrytí
* Angličtina má zdaleka nejlepší pokrytí písma napříč všemi modely, s výjimkou Kimi K2, kde je druhá
* Jazyky psané latinkou (zejména románské jazyky) si vedou dobře
* Další jazyky používající latinku následují
* Korejština, japonština a ruština vykazují střední pokrytí
* Hindština, perština a khmérština výrazně zaostávají

**Poznámka ke srovnávání mezi jazyky**: Protože se pokrytí počítá na pevných 2MB vzorcích textu a různé jazyky vyžadují k vyjádření stejného sémantického obsahu různý počet bajtů UTF-8, je přímé srovnání problematické. Metodologicky čistší přístup by počítal pokrytí jako procento vůči normalizovanému základu — zatím je ale tato metrika nejspolehlivější pro porovnávání různých tokenizérů v rámci téhož jazyka, ne pro srovnávání pokrytí napříč různými písmy.

### Míra dělení slov

**`word_split_pct`**: Procento jednotek, které se rozdělí do více než jednoho tokenu. Jednotky jsou definovány podle jazyka (slova u jazyků oddělovaných mezerami, znaky u znakových jazyků, slabiky u jazyků založených na slabikách). Nižší hodnoty obvykle znamenají lepší soulad s přirozenými hranicemi jednotek.

![Graf procenta dělení slov v několika jazycích](/blog-images/tokka-bench-word-splitting.png)

V mandarínštině má Kimi K2 nejnižší míru pokračování slova! Jen 4 % tokenů tvoří pokračování slova.

*Upozornění: u znakových jazyků, jako je mandarínština, tato metrika ve skutečnosti měří hodnoty po znacích, ne po slovech. Slova v mandarínštině mohou mít 1 znak i více — většina z nich je ve skutečnosti dvouznaková — ale to je v benchmarku výpočetně náročné rychle určit.*

### Subslovní fertilita

**`subword_fertility`**: Počet tokenů na jednotku, přičemž jednotky jsou definovány podle struktury jazyka (viz metodika výše). Nižší hodnoty jsou lepší — čím blíže k 1, tím méně částí připadá na jednu sémantickou jednotku.

![Graf subslovní fertility ve více jazycích](/blog-images/tokka-bench-subword-fertility.png)

V mandarínštině má Kimi K2 nejnižší subslovní fertilitu! Hodnota je nižší než 1, což znamená, že jeden token v průměru odpovídá více než 1 znaku.

## Metriky slovní zásoby (agregované napříč všemi jazyky)

Vypočítáno vzorkováním tokenů ze slovní zásoby tokenizéru a jejich následným dekódováním:

**`tokens_starting_with_space_pct`**: Podíl tokenů, které se po dekódování zobrazují s počáteční mezerou. To vypovídá jak o návrhu tokenizéru (kolik položek slovní zásoby připadá na začátky slov oproti jejich pokračováním), tak o charakteru trénovacích dat (jazyky bez mezer mezi slovy budou přirozeně vykazovat nižší procenta).

**`tokens_with_whitespace_in_middle_pct`**: Podíl tokenů, jejichž dekódovaný text obsahuje bílý znak mimo začátek. Ukazuje na víceslovné tokeny nebo tokeny s větším množstvím mezer, které překračují přirozené hranice.

**`tokens_with_script_overlap_pct`**: Podíl tokenů obsahujících znaky z více rodin písem Unicode. Vyšší hodnoty mohou naznačovat tokeny se smíšenými skripty nebo tokeny na úrovni bajtů, které nerespektují hranice písem.

**`tokens_with_{script}_unicode_pct`**: Rozložení napříč písmy (např. latinka, cyrilice, čínské, japonské, korejské, arabské, dévanágarí, thajské, hebrejské, řecké písmo, číslice, interpunkce, symboly). Ukazuje, které systémy zápisu tokeny tokenizéru v praxi skutečně pokrývají.

## Bonusová sekce: Programovací jazyky

Nakonec se podívejme na něco zajímavého, čeho jsem si všiml u programovacích jazyků (tady přepneme z GPT-2 na gpt-oss):

![Graf bajtů na token v různých programovacích jazycích](/blog-images/tokka-bench-coding-efficiency.png)

Napříč programovacími jazyky je v efektivitě výrazně menší variabilita — Kimi K2, Llama 3 a GPT-OSS mají v každém programovacím jazyce téměř totožný počet bajtů na token!

Nejsem si úplně jistý, proč k tomuto sbližování dochází, ale přijde mi to fascinující. Může to naznačovat, že všechny tři modely používají podobné datasety, nebo třeba podobné zastoupení různých programovacích jazyků na GitHubu a v dalších běžných zdrojích pro trénování.

## Závěr

Doufám, že pro vás bude tokka-bench stejně užitečný a přínosný jako pro mě! Mohou se v něm skrývat nějaké chyby — testoval jsem ho poměrně hodně, ale nástroji by velmi prospělo mnohem důkladnější testování komunitou napříč různými jazyky a způsoby použití.

Budu rád, když přispějete! Ať už jde o hlášení chyb, nové metriky, další tokenizéry nebo širší jazykové pokrytí, zapojení komunity udělá tento nástroj mnohem hodnotnějším.

Pokud jste z AI laboratoře s proprietárním modelem, ale byli byste ochotní sdílet metriky svého tokenizéru pro informativní účely, prosím, ozvěte se mi! Komunita by nesmírně těžila z lepšího pochopení toho, jak špičkové systémy pracují s vícejazyčnou tokenizací.

## Poděkování a odkazy

* [Vin Howe](https://howe.vin/), [Sachin Raja](https://x.com/s4chinraja) a [Jacob Holloway](https://www.linkedin.com/in/jhollowayj/) si přečetli můj článek a poskytli mi užitečnou zpětnou vazbu
* [Harsha Vardhan Khurdula](https://www.linkedin.com/in/harsha-vardhan-khurdula-99b400183/) mi pomohl shromáždit relevantní výzkum a systematicky promyslet metriky
* Judit Ács jako první (pokud vím) představila subword fertility a proportion of continuation word pieces jako standardní metriky tokenizace v [tomto příspěvku na blogu](https://juditacs.github.io/2019/02/19/bert-tokenization-stats.html)
* Rust et. al tyto myšlenky dále rozpracovali v [článku na konferenci ACL](https://aclanthology.org/2021.acl-long.243.pdf), který mi nesmírně pomohl

## Náměty pro budoucí výzkum

**Souvislost s výkonem**: Co je pro výsledný výkon ve vícejazyčných úlohách důležitější: efektivita tokenizace, nebo pokrytí slovní zásoby? Tento vztah není na první pohled zřejmý a pravděpodobně se liší podle typu úlohy.

**Kompromisy při optimalizaci**: Do jaké míry lze optimalizovat pokrytí při zachování efektivity? Existuje Paretova hranice, kterou můžeme matematicky popsat?

**Prediktivní schopnost**: Dokážeme odhadnout schopnosti vícejazyčného modelu pouze na základě metrik tokenizéru? Pokud ano, mohlo by to nabídnout rychlý způsob, jak posoudit potenciál modelu ještě před nákladným vyhodnocováním.