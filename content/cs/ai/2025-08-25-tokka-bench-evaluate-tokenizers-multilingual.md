---
title: "Představuji tokka-bench"
description: "Ucelený evaluační rámec pro porovnávání tokenizérů napříč přirozenými i programovacími jazyky."
date: "2025-08-25"
tags: [ml/ai, linguistics, open-source]
---

(Spěcháte? Navštivte [tokka-bench.streamlit.app](https://tokka-bench.streamlit.app/))

![Snímek obrazovky grafu tokka-bench](/blog-images/tokka-bench-hero.png)

Před několika měsíci jsem ve volném čase začal pracovat na novém projektu — na předtrénování malého vícejazyčného jazykového modelu. Jak už to u podobných výprav bývá, i ta moje se stočila jinam a začal jsem se velmi zajímat o jeden konkrétní aspekt trénování modelů: tokenizaci.

Dnes chci představit rámec pro vyhodnocování tokenizérů, ale také vysvětlit, co nám tokenizéry mohou pomoci pochopit:

* Na jakých zdrojích dat mohl být daný model trénován
* Proč si některé velké jazykové modely (zejména proprietární modely, jako ChatGPT, Claude a Gemini) vedou v mnohojazyčných úlohách výrazně lépe než jiné
* Proč mají Claude, Gemini a GPT-4o a novější modely tokenizéry s uzavřeným zdrojovým kódem
* Proč jsou některé OSS modely pro jemné doladění vhodnější než jiné

## Technické souvislosti

### Kódování písem a gramatika

Pochopení tokenizace začíná pochopením toho, jak se text kóduje na úrovni bajtů. Veškerý text se kóduje v UTF-8, ale různá písma vyžadují k zakódování stejného sémantického obsahu výrazně odlišný počet bajtů. Angličtina má v průměru jen o něco více než 1 bajt na znak, takže je neuvěřitelně kompaktní. Arabština potřebuje 2+ bajty na znak, zatímco čínština může ke správnému zakódování vyžadovat 3+ bajty na znak.

Kromě efektivity kódování se jazyky zásadně liší i gramaticky, což ovlivňuje, jak se informace „balí“ do slov. Syntetické jazyky dokážou vměstnat spoustu syntaktických informací do jediného slova. Například mluvím česky, kde by se fráze jako „vzali se“ do angličtiny přeložila jako „they married each other“. Tato gramatická hutnost ztěžuje porovnávání efektivity kódování.

### Tokenizace

Velké jazykové modely nepracují přímo s bajty — pracují s „tokeny“, tedy jakýmisi symboly odpovídajícími skupinám bajtů. Většina moderních tokenizérů používá Byte Pair Encoding (BPE): začíná jednotlivými bajty a postupným slučováním nejčastějších dvojic vytváří slovník podslovních jednotek.

Existují i alternativní přístupy, například [Byte Latent Transformer](https://ai.meta.com/research/publications/byte-latent-transformer-patches-scale-better-than-tokens/), ale v produkčních systémech se zatím výrazněji neprosadily.

Technických rozhodnutí při návrhu tokenizéru je spousta a mají zásadní dopad:

* Přidávají se mezery na začátek? (Aby se „hello“ v „hello world“ a „ hello world“ tokenizovalo stejně?)
* Zakazuje se slučování bajtů přes hranice bílých znaků? A co přes hranice různých písem?
* Používá se neznámý token (UNK), nebo se při výskytu sekvencí mimo slovník přechází zpět na bajty?

Snad vám to pomůže lépe pochopit klasický Karpathyho [příspěvek o tokenizaci](https://x.com/karpathy/status/1759996551378940395):

![Citát od Karpathyho: „Tokenizace stojí za velkou částí podivností velkých jazykových modelů...“](https://pbs.twimg.com/media/GGzDbMRasAAZf_D?format=png\&name=medium)

## Jak tokenizace ovlivňuje předtrénování

Vztah mezi tokenizéry a daty pro předtrénování vytváří složitou síť vlivů, které zásadně utvářejí schopnosti modelu. Tokenizéry se často trénují na datech pro předtrénování velkého jazykového modelu, ve kterém se pak používají, ale různé jazyky mají ve slovníku tokenizéru různou míru „pokrytí“.

Vezměme si například khmérštinu. Protože má khmérština méně online zdrojů, menší část slovníku tokenizéru bude odpovídat khmérštině než angličtině. Tento rozdíl v pokrytí znamená, že zakódování stejného počtu slov v khmérštině bude vyžadovat mnohem více tokenů než v angličtině. A tady začíná problém: předtrénování často používá poměrné zastoupení různých jazyků podle počtu tokenů. To znamená, že můžete trénovat na 10 milionech tokenů anglického textu a 1 milionu tokenů khmérského textu v naději, že máte poměr obsahu 10:1. Jenže khmérský text ve skutečnosti představuje ve srovnání s anglickým textem výrazně méně než 10 % slov!

Sémantické důsledky jsou ještě závažnější. Khmérské tokeny, protože jich je méně, spíše reprezentují písmena nebo dvojice souhlásek než celé sémantické jednotky. To znamená, že modely si u nedostatečně zastoupených jazyků nemohou tak snadno „ukládat“ koncepty, atributy, definice a další sémantické znalosti do embeddingových vektorů.

Existuje živá open-source komunita, která vytváří jemně doladěné verze základních modelů OSS pro menší jazyky. Pokud si váš tokenizér neporadí dobře s jinými jazyky, jemné doladění bude obtížnější a pravděpodobně bude vyžadovat rozšíření tokenizéru o vlastní tokeny. Na druhou stranu může zavádění „částečně natrénovaných“ tokenů (tokenů, které se v datech pro předtrénování vůbec nevyskytují) velký jazykový model zmást a dokonce umožnit i „[útoky pomocí tokenů](https://x.com/karpathy/status/1789590397749957117)“.

## Jak tokenizace ovlivňuje inferenci

Rozdíly v tokenizaci, které vznikají během předtrénování, dál způsobují problémy i při inferenci. Text v jazycích s omezenými zdroji (jazycích s malým množstvím online zdrojů) vyžaduje pro své vyjádření mnohem více tokenů, což spouští několik navazujících problémů:

**Zhoršení výkonu**: Nižší propustnost se stává významným problémem, když každá věta vyžaduje ke svému vyjádření 2–3× více tokenů. Uživatelé dostávají pomalejší odpovědi a provoz chatů stojí poskytovatele více peněz.

**Omezení kontextu**: Delší sekvence rychleji zaplňují kontextové okno a schopnost vybavování se zhoršuje, protože model má potíže udržet souvislé porozumění napříč takto nafouknutými sekvencemi tokenů.

**Kvalita generování**: Výběr tokenů při generování může zanášet chyby. Více tokenů na slovo znamená víc „příležitostí něco pokazit“ u každého slova, což může vést k postupnému rozjíždění významu, kdy malé chyby ve výběru tokenů přerůstají ve větší sémantická selhání.

## Hodnocení tokenizérů pomocí tokka-bench

Vytvořil jsem nástroj pro snadné zkoumání výkonu tokenizérů ve 100 přirozených jazycích a 20 programovacích jazycích. Začal jsem hodnocením 7 tokenizérů: Gemma 3, GPT-2, GPT-4, gpt-oss, Kimi K2, Llama 3 a Qwen 3.

Projekt má několik částí navržených pro různé případy použití:

**Open-source repozitář**: Můžete si ho naklonovat a spouštět benchmarky lokálně. [https://github.com/bgub/tokka-bench](https://github.com/bgub/tokka-bench)

**Live dashboard**: Kromě kódu pro spouštění benchmarků jsem vytvořil také online dashboard! [https://tokka-bench.streamlit.app/](https://tokka-bench.streamlit.app/)

Díky tomu můžete snadno vybírat kombinace jazyků a tokenizérů k porovnání a přepínat mezi různými metrikami, abyste lépe pochopili, že výkon tokenizérů má více rozměrů.

### Datové sady a metodologie

**Datové sady**: Pro vyhodnocení používám tři kvalitní datové sady, které pokrývají různé textové domény:

* [FineWeb](https://huggingface.co/datasets/HuggingFaceFW/fineweb) pro anglický obsah
* [FineWeb 2](https://huggingface.co/datasets/HuggingFaceFW/fineweb-2) pro ostatní lidské jazyky
* [StarCoder](https://huggingface.co/datasets/bigcode/starcoderdata) pro programovací jazyky

**Metriky podle jazyka**: Z každé datové sady odebírám vzorek o velikosti 2 MB a tokenizuji ho, abych spočítal metriky výkonu pro daný jazyk. Tento přístup má jedno důležité omezení: kvůli rozdílům v kódování UTF-8 představují 2 MB v různých jazycích velmi rozdílné množství sémantického obsahu. Lepší přístup by mohl spočítat globální „škálovací konstantu“ na základě ekvivalentního sémantického obsahu — například pomocí paralelních překladů a normalizace podle velikosti Harryho Pottera v angličtině v bajtech dělené počtem sémantických jednotek. V této podobě je proto potřeba mezijazyková srovnání interpretovat opatrně a spolehlivější je porovnávat různé tokenizéry v rámci téhož jazyka.

**Metriky slovní zásoby**: Při analýze samotných slovních zásob tokenizérů náhodně vybírám 10 000 tokenů ze slovní zásoby každého tokenizéru a analyzuji jejich dekódované vlastnosti.

**Definice jazykových jednotek**: Různé jazyky strukturují informace odlišně, takže pro metriky fertility a splitting definuji „jednotky“ takto:

* **Jazyky s mezerami**: tokeny na slovo (jednotky oddělené mezerami)
* **Jazyky založené na znacích** (např. čínština, japonština, thajština): tokeny na znak (bez mezer)
* **Jazyky založené na slabikách** (např. tibetština): tokeny na slabiku (jednotky oddělené tshegem, se záložními metodami)

## Metriky a výsledky podle jednotlivých jazyků

Porovnejme GPT-2, Llama 3 a Kimi K2 na vzorku populárních jazyků, abychom ukázali, jaké poznatky může tokka-bench odhalit. Tyto tři jsem vybral proto, aby bylo vidět, jak se přístupy k tokenizaci v průběhu času vyvíjely.

Kontext pro každý z nich:

* GPT-2 má velikost slovníku ~50K a byl vydán v únoru 2019
* Llama 3 má velikost slovníku ~128K a byla vydána v dubnu 2024
* Kimi K2 má velikost slovníku ~164K a byl vydán v červenci 2025

### Efektivita (bajty na token)

**`bytes_per_token`**: Průměrný počet bajtů UTF-8 na token (`total_bytes / total_tokens`). Vyšší hodnoty znamenají efektivnější kompresi textu do tokenů.

![Graf bajtů na token ve více jazycích](/blog-images/tokka-bench-efficiency.png)

Rozdíly v efektivitě ukazují priority při tréninku i složení dat. Jazyky s vyšším poměrem bajtů na token se komprimují efektivněji, což naznačuje buď lepší alokaci ve slovní zásobě, nebo více trénovacích dat pro učení slovní zásoby.

**Důležité omezení**: Tato metrika nezohledňuje rozdíly v kódování UTF-8 mezi různými písmy. Například hindština dosahuje uměle vysoké efektivity jednoduše proto, že každý znak vyžaduje pro zakódování 3 bajty — přiřazení pouhých 50 tokenů pro reprezentaci každého znaku hindské abecedy by vedlo k efektivitě 3 bajty/token. Mnoho hindských znaků však vzniká kombinací souhlásek se samohláskovými značkami nebo souhláskovými shluky, takže přidání tokenů pro tyto kombinace (reprezentující 6–9 bajtů) může metriky efektivity nafouknout, a přitom stále poskytovat slabé sémantické pokrytí. To neodráží skutečnou sémantickou efektivitu. Tato metrika funguje nejlépe při porovnávání různých tokenizérů v rámci stejného jazyka, nikoli při porovnávání efektivity napříč různými písmy.

### Pokrytí (jedinečné tokeny)

**`unique_tokens`**: Počet různých ID tokenů použitých při kódování ukázkového textu v jednotlivých jazycích. Vyšší hodnoty naznačují lepší pokrytí písma/písem daného jazyka a méně přechodů na jednotlivé znaky na úrovni bajtů.

![Graf jedinečných tokenů ve více jazycích](/blog-images/tokka-bench-coverage.png)

Obecně považuji pokrytí za metriku, která nejlépe vypovídá o jazykovém složení předtréninkových dat. Podívejte se, o kolik vyšší je pokrytí mandarínské čínštiny u Kimi K2 než u ostatních tokenizérů! Přesně to bychom čekali, protože jde o čínský velký jazykový model se slovní zásobou cíleně optimalizovanou pro čínský text.

Hierarchie pokrytí odhaluje jasné priority při trénování:

* Čínština má u Kimi K2 výjimečné pokrytí
* Angličtina má napříč všemi modely zdaleka nejlepší pokrytí písma, s výjimkou Kimi K2, kde je druhá
* Jazyky používající latinku (zejména románské jazyky) si vedou dobře
* Ostatní jazyky psané latinkou následují
* Korejština, japonština a ruština vykazují střední pokrytí
* Hindština, perština a khmérština výrazně zaostávají

**Poznámka ke srovnání mezi jazyky**: Protože se pokrytí počítá z pevných 2MB vzorků textu a různé jazyky potřebují k vyjádření sémanticky ekvivalentního obsahu různý počet bajtů UTF-8, je přímé srovnání problematické. Metodologicky čistší přístup by počítal pokrytí jako procento vzhledem k normalizovanému základu — prozatím je ale tato metrika nejspolehlivější pro porovnávání různých tokenizérů v rámci téhož jazyka, nikoli pro porovnávání pokrytí napříč různými písmy.

### Míra dělení slov

**`word_split_pct`**: Procento jednotek, které se rozdělí do více než jednoho tokenu. Jednotky jsou definované podle jazyka (slova u jazyků oddělovaných mezerami, znaky u jazyků založených na znacích, slabiky u jazyků založených na slabikách). Nižší hodnoty obvykle znamenají lepší soulad s hranicemi přirozených jazykových jednotek.

![Graf procenta dělení slov v různých jazycích](/blog-images/tokka-bench-word-splitting.png)

V mandarínštině má Kimi K2 nejnižší míru pokračování v rámci slova! Jen 4 % tokenů tvoří pokračování slova.

*Upozornění: u jazyků založených na znacích, jako je mandarínština, tato metrika ve skutečnosti měří hodnoty po znacích, ne po slovech. Slova v mandarínštině mohou mít 1 znak i více — většina z nich má ve skutečnosti dva znaky — ale to je pro rychlé určení v benchmarku výpočetně příliš složité.*

### Fertilita subslov

**`subword_fertility`**: Počet tokenů na jednotku, přičemž jednotky jsou definovány podle struktury jazyka (viz metodika výše). Nižší hodnoty jsou lepší — čím blíže k 1, tím méně částí připadá na jednu sémantickou jednotku.

![Graf fertility subslov v několika jazycích](/blog-images/tokka-bench-subword-fertility.png)

V mandarínštině má Kimi K2 nejnižší fertilitu subslov! Hodnota je nižší než 1, což znamená, že jeden token v průměru představuje více než 1 znak.

## Metriky slovníku (agregované napříč všemi jazyky)

Vypočítáno vzorkováním tokenů ze slovníku tokenizéru a jejich následným dekódováním:

**`tokens_starting_with_space_pct`**: Podíl tokenů, které se po dekódování zobrazí s počáteční mezerou. To vypovídá jak o návrhu tokenizéru (jak velká část slovníku je vyhrazena začátkům slov oproti jejich pokračováním), tak o vlastnostech trénovacích dat (jazyky bez mezer mezi slovy budou přirozeně vykazovat nižší podíly).

**`tokens_with_whitespace_in_middle_pct`**: Podíl tokenů, jejichž dekódovaný text obsahuje mezeru nebo jiný bílý znak mimo začátek. Signalizuje víceslovné tokeny nebo tokeny bohaté na bílé znaky, které překračují přirozené hranice.

**`tokens_with_script_overlap_pct`**: Podíl tokenů obsahujících znaky z více rodin písem Unicode. Vyšší hodnoty mohou naznačovat tokeny mísící více písem nebo tokeny na úrovni bytů, které nerespektují hranice písem.

**`tokens_with_{script}_unicode_pct`**: Rozložení napříč písmy (např. latinka, cyrilice, čínské písmo, japonština, korejština, arabské písmo, dévanágarí, thajské písmo, hebrejské písmo, řecké písmo, číslice, interpunkce, symboly). Ukazuje, které systémy zápisu tokeny tokenizéru v praxi skutečně pokrývají.

## Bonusová část: Programovací jazyky

Nakonec se podívejme na něco zajímavého, čeho jsem si všiml u programovacích jazyků (tady přejdeme z GPT-2 na gpt-oss):

![Graf bajtů na token v různých programovacích jazycích](/blog-images/tokka-bench-coding-efficiency.png)

V efektivitě napříč programovacími jazyky je výrazně menší rozptyl — Kimi K2, Llama 3 a GPT-OSS mají v každém programovacím jazyce téměř totožný poměr bajtů na token!

Nejsem si úplně jistý, proč k téhle konvergenci dochází, ale přijde mi to fascinující. Mohlo by to naznačovat sdílené datové sady používané všemi třemi modely, nebo třeba podobné zastoupení různých programovacích jazyků na GitHubu a v dalších běžných zdrojích pro trénování.

## Závěr

Doufám, že vám tokka-bench bude připadat stejně užitečný a přínosný jako mně! Je možné, že se v něm ještě skrývají nějaké chyby — testoval jsem ho poměrně dost, ale nástroji by opravdu prospělo mnohem důkladnější testování komunitou napříč různými jazyky a způsoby použití.

Budu rád, když přispějete! Ať už jde o hlášení chyb, nové metriky, další tokenizéry nebo širší jazykové pokrytí, zapojení komunity udělá tento nástroj mnohem hodnotnějším.

Pokud pracujete v AI laboratoři s proprietárním modelem, ale nevadilo by vám pro informativní účely sdílet metriky svého tokenizéru, ozvěte se mi prosím! Komunita by velmi těžila z lepšího pochopení toho, jak nejmodernější systémy pracují s vícejazyčnou tokenizací.

## Poděkování a zdroje

* [Vin Howe](https://howe.vin/), [Sachin Raja](https://x.com/s4chinraja) a [Jacob Holloway](https://www.linkedin.com/in/jhollowayj/) si přečetli můj článek a poskytli cennou zpětnou vazbu
* [Harsha Vardhan Khurdula](https://www.linkedin.com/in/harsha-vardhan-khurdula-99b400183/) mi pomohl dohledat relevantní výzkum a systematicky promyslet metriky
* Judit Ács byla první, kdo (pokud vím) v [tomto blogovém příspěvku](https://juditacs.github.io/2019/02/19/bert-tokenization-stats.html) představil fertilitu subslov a proportion of continuation word pieces jako standardní metriky tokenizace
* Rust a kol. tyto myšlenky rozvinuli v [článku na ACL](https://aclanthology.org/2021.acl-long.243.pdf), který mi nesmírně pomohl

## Náměty pro budoucí výzkum

**Korelace s výkonem**: Co je pro vícejazyčný výkon v navazujících úlohách důležitější: efektivita tokenizace, nebo pokrytí slovní zásoby? Tento vztah není na první pohled zřejmý a pravděpodobně se liší podle typu úlohy.

**Kompromisy při optimalizaci**: Nakolik lze optimalizovat pokrytí při zachování efektivity? Existuje Paretova hranice, kterou můžeme matematicky popsat?

**Prediktivní síla**: Dokážeme předpovědět schopnosti vícejazyčného modelu jen na základě metrik tokenizéru? Pokud ano, mohlo by to nabídnout rychlý způsob, jak odhadnout potenciál modelu ještě před nákladnými evaluačními běhy.