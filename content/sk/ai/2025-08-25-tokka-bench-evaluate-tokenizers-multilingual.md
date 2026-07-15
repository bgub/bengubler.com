---
title: "Predstavujeme tokka-bench"
description: "Komplexný hodnotiaci rámec na porovnávanie tokenizérov naprieč prirodzenými a programovacími jazykmi."
date: "2025-08-25"
tags: [ml/ai, linguistics, open-source]
---

(Ponáhľate sa? Navštívte [tokka-bench.streamlit.app](https://tokka-bench.streamlit.app/))

![Snímka obrazovky grafu tokka-bench](/blog-images/tokka-bench-hero.png)

Pred niekoľkými mesiacmi som vo voľnom čase začal pracovať na novom projekte — na predtrénovaní malého, viacjazyčného LLM. Ako to už pri podobných výpravách býva, aj tá moja sa postupne vybrala iným smerom a začal som sa veľmi zaujímať o jeden konkrétny aspekt trénovania modelov: tokenizáciu.

Dnes sa chcem podeliť o rámec na hodnotenie tokenizérov, ale aj vysvetliť, ako nám tokenizéry môžu pomôcť pochopiť:

* Na akých zdrojoch dát mohol byť daný model trénovaný
* Prečo niektoré veľké jazykové modely (LLMs) (najmä proprietárne modely ako ChatGPT, Claude a Gemini) dosahujú pri viacjazyčných úlohách výrazne lepšie výsledky než iné
* Prečo majú Claude, Gemini a GPT 4o a novšie verzie tokenizéry s uzavretým zdrojovým kódom
* Prečo sú niektoré modely OSS vhodnejšie na fine-tuning než iné

## Technické zázemie

### Kódovanie písiem a gramatika

Pochopenie tokenizácie sa začína pochopením toho, ako sa text kóduje na úrovni bajtov. Všetok text sa kóduje v UTF-8, no rôzne písma vyžadujú na zakódovanie rovnakého sémantického obsahu výrazne odlišný počet bajtov. Angličtina má v priemere len o trochu viac ako 1 bajt na znak, takže je mimoriadne úsporná. Arabčina potrebuje 2+ bajty na znak, zatiaľ čo čínština môže na správne zakódovanie vyžadovať 3+ bajty na znak.

Okrem efektivity kódovania sa jazyky zásadne líšia aj gramaticky, čo ovplyvňuje, ako sa informácie vmestia do slov. Syntetické jazyky dokážu vložiť veľa syntaktických informácií do jedného slova. Napríklad hovorím po česky, kde by sa výraz ako „vzali se“ do angličtiny preložil ako „they married each other“. Táto gramatická hustota sťažuje porovnávanie efektivity kódovania.

### Tokenizácia

Veľké jazykové modely (LLMs) nepracujú priamo s bajtmi — pracujú s „tokenmi“, teda symbolmi zodpovedajúcimi skupinám bajtov. Väčšina moderných tokenizérov používa Byte Pair Encoding (BPE): začína jednotlivými bajtmi a potom opakovane zlučuje najčastejšie dvojice, aby postupne vytvorila slovník podslovných jednotiek.

Existujú aj alternatívne prístupy, napríklad [Byte Latent Transformer](https://ai.meta.com/research/publications/byte-latent-transformer-patches-scale-better-than-tokens/), no zatiaľ sa v produkčných systémoch veľmi neujali.

Technických rozhodnutí pri návrhu tokenizéra je veľa a majú zásadné dôsledky:

* Pridávate úvodné medzery? (Aby sa „hello“ v „hello world“ a „ hello world“ tokenizovalo rovnako?)
* Neumožňujete zlučovanie bajtov cez hranice bielych znakov? A čo cez hranice medzi rôznymi písmami?
* Používate neznámy token (UNK), alebo pri sekvenciách mimo slovníka prechádzate späť na bajty?

Dúfam, že vám to pomôže lepšie pochopiť Karpathyho klasický [príspevok o tokenizácii](https://x.com/karpathy/status/1759996551378940395):

![Citát od Karpathyho: "Tokenization is at the heart of much weirdness of LLMS..."](https://pbs.twimg.com/media/GGzDbMRasAAZf_D?format=png\&name=medium)

## Ako tokenizácia ovplyvňuje predtrénovanie

Vzťah medzi tokenizérmi a dátami na predtrénovanie vytvára zložitú sieť vplyvov, ktoré zásadne formujú schopnosti modelu. Tokenizéry sa často trénujú na dátach predtrénovania LLM, v ktorom sa budú používať, no rôzne jazyky majú v slovníku tokenizéra odlišnú mieru „pokrytia“.

Uveďme si príklad: khmérčina. Keďže pre khmérčinu existuje menej online zdrojov, menšia časť slovníka tokenizéra bude zodpovedať dekódovaniam do khmérčiny než do angličtiny. Tento rozdiel v pokrytí znamená, že zakódovanie rovnakého počtu slov v khmérčine si vyžiada omnoho viac tokenov než v angličtine. A tu nastáva problém: pri predtrénovaní sa rôzne jazyky často rozdeľujú pomerne podľa počtu tokenov. To znamená, že môžete trénovať na 10 miliónoch tokenov anglického textu a 1 milióne tokenov khmérskeho textu v nádeji, že tým dosiahnete pomer obsahu 10:1. V skutočnosti však khmérsky text predstavuje v porovnaní s anglickým oveľa menej než 10 % slov!

Sémantické dôsledky sú ešte vážnejšie. Keďže khmérskych tokenov je menej, skôr budú predstavovať písmená alebo dvojice spoluhlások než celé sémantické jednotky. To znamená, že modely si pri nedostatočne zastúpených jazykoch nedokážu tak ľahko „ukladať“ koncepty, atribúty, definície a ďalšie sémantické poznatky do embeddingových vektorov.

Existuje živá open-source komunita, ktorá vytvára fine-tunes základných OSS modelov pre menšie jazyky. Ak si váš tokenizér nevie dobre poradiť s cudzími jazykmi, fine-tuning bude náročnejší a pravdepodobne si vyžiada rozšírenie tokenizéra o vlastné tokeny. Na druhej strane môže zavedenie „čiastočne natrénovaných“ tokenov (tokenov, ktoré sa v dátach predtrénovania vôbec neobjavia) LLM pomýliť a dokonca umožniť aj „[token attacks](https://x.com/karpathy/status/1789590397749957117)“.

## Ako tokenizácia ovplyvňuje inferenciu

Rozdiely v tokenizácii, ktoré vznikajú počas predtrénovania, naďalej spôsobujú problémy aj pri inferencii. Text v jazykoch s obmedzenými zdrojmi (jazykoch s malým množstvom online zdrojov) si na vyjadrenie vyžaduje omnoho viac tokenov, čo vedie k viacerým naväzujúcim problémom:

**Zhoršenie výkonu**: Nižšia priepustnosť sa stáva výrazným problémom, keď každá veta potrebuje na vyjadrenie 2- až 3-krát viac tokenov. Používatelia dostávajú pomalé odpovede a poskytovateľov stojí prevádzka chatov viac peňazí.

**Obmedzenia kontextu**: Dlhšie sekvencie rýchlejšie zapĺňajú kontextové okno a zhoršuje sa aj schopnosť modelu vybaviť si informácie, keď sa snaží udržať súvislé porozumenie naprieč nadmerne dlhými sekvenciami tokenov.

**Kvalita generovania**: Výber tokenov počas generovania môže vnášať chyby. Viac tokenov na slovo znamená viac „príležitostí pokaziť to“ pri každom slove, čo môže viesť k postupnému nabaľovaniu odchýlok, pri ktorom sa malé chyby pri výbere tokenov prelievajú do väčších sémantických zlyhaní.

## Hodnotenie tokenizérov pomocou tokka-bench

Vytvoril som nástroj na jednoduché skúmanie výkonu tokenizérov naprieč 100 prirodzenými jazykmi a 20 programovacími jazykmi. Začal som hodnotením 7 tokenizérov: Gemma 3, GPT-2, GPT-4, gpt-oss, Kimi K2, Llama 3 a Qwen 3.

Projekt má viacero komponentov navrhnutých pre rôzne prípady použitia:

**Open-source repozitár**: Môžete si ho naklonovať a spúšťať benchmarky lokálne. [https://github.com/bgub/tokka-bench](https://github.com/bgub/tokka-bench)

**Live dashboard**: Okrem kódu na spúšťanie benchmarkov som vytvoril aj live dashboard! [https://tokka-bench.streamlit.app/](https://tokka-bench.streamlit.app/)

To vám umožní jednoducho vyberať kombinácie jazykov a tokenizérov na porovnanie a prepínať medzi rôznymi metrikami, aby ste lepšie pochopili, že výkon tokenizérov má viacero rozmerov.

### Datasety a metodológia

**Datasety**: Na vyhodnotenie používam tri kvalitné datasety, ktoré reprezentujú rôzne oblasti textu:

* [FineWeb](https://huggingface.co/datasets/HuggingFaceFW/fineweb) pre anglický obsah
* [FineWeb 2](https://huggingface.co/datasets/HuggingFaceFW/fineweb-2) pre ostatné ľudské jazyky
* [StarCoder](https://huggingface.co/datasets/bigcode/starcoderdata) pre programovacie jazyky

**Metriky podľa jazyka**: Z každého datasetu vyberám vzorku 2 MB textu a tokenizujem ju, aby som vypočítal metriky výkonu špecifické pre daný jazyk. Tento prístup má jedno dôležité obmedzenie: kvôli rozdielom v kódovaní UTF-8 predstavujú 2 MB v rôznych jazykoch výrazne odlišné množstvo sémantického obsahu. Lepší prístup by mohol vypočítať globálnu „škálovaciu konštantu“ na základe ekvivalentného sémantického obsahu — napríklad pomocou paralelných prekladov a normalizácie podľa počtu bajtov na sémantickú jednotku v anglickom Harrym Potterovi. V súčasnej podobe treba medzijazykové porovnania interpretovať opatrne a spoľahlivejšie je porovnávať rôzne tokenizéry v rámci toho istého jazyka.

**Metriky slovníka**: Pri analýze samotných slovníkov tokenizérov náhodne vyberám 10 000 tokenov zo slovníka každého tokenizéra a analyzujem ich vlastnosti po dekódovaní.

**Definície jazykových jednotiek**: Rôzne jazyky štruktúrujú informácie odlišne, preto pre metriky fertility a splittingu definujem „jednotky“ takto:

* **Jazyky s medzerami**: tokeny na slovo (jednotky oddelené medzerami)
* **Jazyky založené na znakoch** (napr. čínština, japončina, thajčina): tokeny na znak (bez medzier)
* **Jazyky založené na slabikách** (napr. tibetčina): tokeny na slabiku (jednotky oddelené znakom tsheg, so záložnými metódami)

## Metriky a výsledky podľa jednotlivých jazykov

Porovnajme GPT-2, Llama 3 a Kimi K2 na vzorke populárnych jazykov, aby sme ukázali, aké poznatky môže tokka-bench odhaliť. Tieto tri som vybral preto, aby som ukázal, ako sa prístupy k tokenizácii časom vyvíjali.

Kontext ku každému z nich:

* GPT-2 má veľkosť slovníka ~50K a bol vydaný vo februári 2019
* Llama 3 má veľkosť slovníka ~128K a bol vydaný v apríli 2024
* Kimi K2 má veľkosť slovníka ~164K a bol vydaný v júli 2025

### Efektivita (bajty na token)

**`bytes_per_token`**: Priemerný počet bajtov UTF-8 na token (total&#95;bytes / total&#95;tokens). Vyššie hodnoty znamenajú efektívnejšiu kompresiu textu do tokenov.

![Graf bajtov na token vo viacerých jazykoch](/blog-images/tokka-bench-efficiency.png)

Rozdiely v efektivite odhaľujú priority pri trénovaní aj zloženie dát. Jazyky s vyšším pomerom bajtov na token sa komprimujú efektívnejšie, čo naznačuje buď lepšiu alokáciu slovníka, alebo viac tréningových dát na učenie slovníka.

**Dôležité obmedzenie**: Táto metrika nezohľadňuje rozdiely v kódovaní UTF-8 medzi rôznymi písmami. Napríklad hindčina dosahuje umelo vysokú efektivitu jednoducho preto, že každý znak vyžaduje na zakódovanie 3 bajty — ak by sa na reprezentáciu každého znaku hindského písma pridelilo iba 50 tokenov, viedlo by to k efektivite 3 bajty/token. Mnohé hindské znaky však vznikajú kombinovaním spoluhlások so samohláskovými znamienkami alebo spoluhláskovými skupinami, takže pridanie tokenov pre tieto kombinácie (ktoré reprezentujú 6–9 bajtov) môže umelo navýšiť metriky efektivity, a pritom stále poskytovať slabé sémantické pokrytie. To neodráža skutočnú sémantickú efektivitu. Táto metrika je najužitočnejšia pri porovnávaní rôznych tokenizérov v rámci toho istého jazyka, nie pri porovnávaní efektivity naprieč rôznymi písmami.

### Pokrytie (jedinečné tokeny)

**`unique_tokens`**: Počet rôznych ID tokenov použitých pri kódovaní ukážkového textu v jednotlivých jazykoch. Vyššie hodnoty naznačujú lepšie pokrytie písma/písiem daného jazyka a menej núdzových prechodov na jednotlivé znaky na úrovni bajtov.

![Graf jedinečných tokenov vo viacerých jazykoch](/blog-images/tokka-bench-coverage.png)

Vo všeobecnosti považujem pokrytie za metriku, ktorá najlepšie vystihuje jazykové rozloženie dát použitých pri predtrénovaní. Pozrite sa, o koľko vyššie je pokrytie mandarínskeho písma pri Kimi K2 než pri ostatných tokenizéroch! Presne to by sme očakávali, keďže ide o čínske LLM so slovníkom špeciálne optimalizovaným pre čínsky text.

Hierarchia pokrytia odhaľuje jasné priority pri trénovaní:

* Čínština má v Kimi K2 výnimočné pokrytie
* Angličtina má zďaleka najlepšie pokrytie písma vo všetkých modeloch, s výnimkou Kimi K2, kde je druhá
* Jazyky používajúce latinku (najmä románske jazyky) si vedú dobre
* Nasledujú ďalšie jazyky používajúce latinku
* Kórejčina, japončina a ruština vykazujú stredné pokrytie
* Hindčina, perzština a khmérčina výrazne zaostávajú

**Poznámka ku krížovému porovnávaniu jazykov**: Keďže sa pokrytie počíta z pevných 2 MB textových vzoriek, priame porovnávanie je problematické, pretože rôzne jazyky potrebujú na vyjadrenie rovnakého sémantického obsahu rôzny počet bajtov UTF-8. Dôslednejší prístup by počítal pokrytie ako percento vzhľadom na normalizovaný základ — zatiaľ je však táto metrika najspoľahlivejšia pri porovnávaní rôznych tokenizérov v tom istom jazyku, nie pri porovnávaní pokrytia naprieč rozličnými písmami.

### Miera delenia slov

**`word_split_pct`**: Percento jednotiek, ktoré sa rozdelia na viac ako jeden token. Jednotky sú definované podľa jazyka (slová pre jazyky s medzerami, znaky pre jazyky založené na znakoch, slabiky pre jazyky založené na slabikách). Nižšie hodnoty vo všeobecnosti naznačujú lepší súlad s prirodzenými hranicami jednotiek.

![Graf percenta delenia slov vo viacerých jazykoch](/blog-images/tokka-bench-word-splitting.png)

V mandarínčine má Kimi K2 najnižšiu mieru pokračovania v slove! Iba 4 % tokenov pokračujú v slove.

*Upozornenie: pamätajte, že pri jazykoch založených na znakoch, ako je mandarínčina, táto metrika v skutočnosti meria hodnoty na znak, nie na slovo. Slová v mandarínčine môžu mať 1 znak alebo viac — väčšina má v skutočnosti dva znaky — no to je výpočtovo príliš zložité na rýchle určenie v benchmarku.*

### Subslovná fertilita

**`subword_fertility`**: Počet tokenov na jednotku, pričom jednotky sú definované na základe štruktúry jazyka (pozri metodológiu vyššie). Nižšie hodnoty sú lepšie — hodnota bližšia k 1 znamená menej častí na jednu sémantickú jednotku.

![Graf subslovnej fertility vo viacerých jazykoch](/blog-images/tokka-bench-subword-fertility.png)

V mandarínčine má Kimi K2 najnižšiu subslovnú fertilitu! Fertilita je pod 1, čo znamená, že v priemere každý token reprezentuje viac ako 1 znak.

## Metriky slovníka (agregované naprieč všetkými jazykmi)

Vypočítané vzorkovaním tokenov zo slovníka tokenizéra a ich následným dekódovaním:

**`tokens_starting_with_space_pct`**: Podiel tokenov, ktoré sa po dekódovaní začínajú medzerou. To odhaľuje jednak návrh tokenizéra (aká veľká časť slovníka je vyhradená pre začiatky slov oproti ich pokračovaniam), jednak charakter tréningových dát (jazyky bez medzier medzi slovami budú mať prirodzene nižšie percentá).

**`tokens_with_whitespace_in_middle_pct`**: Podiel tokenov, ktorých dekódovaný text obsahuje medzeru mimo začiatku. Signalizuje viacslovné tokeny alebo tokeny bohaté na medzery, ktoré prekračujú prirodzené hranice.

**`tokens_with_script_overlap_pct`**: Podiel tokenov obsahujúcich znaky z viacerých rodín písiem Unicode. Vyššie hodnoty môžu naznačovať tokeny so zmiešanými písmami alebo tokeny na úrovni bajtov, ktoré nerešpektujú hranice písiem.

**`tokens_with_{script}_unicode_pct`**: Rozdelenie naprieč písmami (napr. latinka, cyrilika, čínske písmo, japončina, kórejčina, arabské písmo, dévanágarí, thajské písmo, hebrejské písmo, grécke písmo, číslice, interpunkcia, symboly). Ukazuje, ktoré systémy písma tokeny tokenizéra v praxi skutočne pokrývajú.

## Bonusová časť: Programovacie jazyky

Nakoniec sa pozrime na niečo zaujímavé, čo som si všimol pri programovacích jazykoch (tu prejdeme z GPT-2 na gpt-oss):

![Graf bajtov na token v rôznych programovacích jazykoch](/blog-images/tokka-bench-coding-efficiency.png)

Rozdiely v efektivite medzi programovacími jazykmi sú výrazne menšie — Kimi K2, Llama 3 a GPT-OSS majú v každom programovacom jazyku takmer identický pomer bajtov na token!

Nie som si úplne istý, prečo k tejto konvergencii dochádza, ale príde mi to fascinujúce. Mohlo by to naznačovať spoločné datasety používané všetkými tromi modelmi, alebo možno podobné zastúpenie rôznych programovacích jazykov na GitHub a v ďalších bežných zdrojoch tréningových dát.

## Záver

Dúfam, že vám bude tokka-bench pripadať rovnako užitočný a poučný ako mne! Môžu sa v ňom skrývať nejaké chyby — testoval som ho celkom dôkladne, ale nástroju by veľmi prospelo oveľa dôkladnejšie komunitné testovanie naprieč rôznymi jazykmi a spôsobmi použitia.

Prosím, pomôžte mi tým, že prispejete! Či už ide o hlásenia chýb, nové metriky, ďalšie tokenizéry alebo širšie jazykové pokrytie, zapojenie komunity urobí tento nástroj oveľa hodnotnejším.

Ak ste z AI laboratória s proprietárnym modelom, ale ste ochotní zdieľať metriky svojho tokenizéra na informačné účely, ozvite sa mi! Komunite by veľmi pomohlo lepšie pochopiť, ako najmodernejšie systémy pristupujú k viacjazyčnej tokenizácii.

## Poďakovania a odkazy

* [Vin Howe](https://howe.vin/), [Sachin Raja](https://x.com/s4chinraja) a [Jacob Holloway](https://www.linkedin.com/in/jhollowayj/) si prečítali môj príspevok a poskytli užitočnú spätnú väzbu
* [Harsha Vardhan Khurdula](https://www.linkedin.com/in/harsha-vardhan-khurdula-99b400183/) mi pomohol zhromaždiť relevantný výskum a systematicky premyslieť metriky
* Judit Ács bola podľa všetkého prvá, kto v [tomto príspevku](https://juditacs.github.io/2019/02/19/bert-tokenization-stats.html) predstavila subslovnú fertilitu a podiel pokračovacích častí slov ako štandardné metriky tokenizácie
* Rust et. al tieto myšlienky ďalej rozvinuli v [článku na konferencii ACL](https://aclanthology.org/2021.acl-long.243.pdf), ktorý mi veľmi pomohol

## Budúce výskumné nápady

**Korelácia výkonnosti**: Čo je pre viacjazyčný výkon v nadväzných úlohách dôležitejšie: efektivita tokenizácie alebo pokrytie slovníka? Tento vzťah nie je na prvý pohľad zrejmý a pravdepodobne sa líši podľa typu úlohy.

**Kompromisy pri optimalizácii**: Do akej miery možno optimalizovať pokrytie pri zachovaní efektivity? Existuje Paretoova hranica, ktorú vieme matematicky opísať?

**Prediktívna sila**: Dokážeme predpovedať schopnosti viacjazyčných modelov len na základe metrík tokenizéra? Ak áno, mohlo by to poskytnúť rýchly spôsob, ako posúdiť potenciál modelu ešte pred nákladnými evaluačnými behmi.