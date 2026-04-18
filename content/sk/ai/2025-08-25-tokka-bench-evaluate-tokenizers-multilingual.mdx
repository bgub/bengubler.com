---
title: "Predstavujem tokka-bench"
description: "Komplexný rámec na vyhodnocovanie tokenizérov naprieč prirodzenými aj programovacími jazykmi."
date: "2025-08-25"
tags: [ml/ai, linguistics, open-source]
---

(Ponáhľate sa? Navštívte [tokka-bench.streamlit.app](https://tokka-bench.streamlit.app/))

![Snímka grafu tokka-bench](/blog-images/tokka-bench-hero.png)

Pred niekoľkými mesiacmi som vo voľnom čase začal pracovať na novom projekte — predtrénovaní malého, viacjazyčného veľkého jazykového modelu (LLM). Ako to pri takýchto výpravách býva, aj tá moja sa trochu odklonila a začal som sa veľmi zaujímať o jeden konkrétny aspekt trénovania modelov: tokenizáciu.

Dnes sa chcem podeliť o rámec na vyhodnocovanie tokenizérov, ale aj vysvetliť, ako nám tokenizéry môžu pomôcť pochopiť:

* Z akých dátových zdrojov mohol byť daný model trénovaný
* Prečo niektoré veľké jazykové modely (LLMs) (najmä proprietárne modely, ako ChatGPT, Claude a Gemini) dosahujú pri viacjazyčných úlohách oveľa lepšie výsledky než iné
* Prečo majú Claude, Gemini a GPT 4o a novšie verzie tokenizátory s uzavretým zdrojovým kódom
* Prečo sú niektoré OSS modely vhodnejšie na fine-tuning než iné

## Technické súvislosti

### Kódovanie písma a gramatika

Pochopenie tokenizácie sa začína tým, ako je text kódovaný na úrovni bajtov. Všetky jazyky sa kódujú v UTF-8, no rôzne písma vyžadujú na zakódovanie toho istého sémantického obsahu výrazne odlišný počet bajtov. Angličtina má v priemere len o trochu viac než 1 bajt na znak, čo ju robí mimoriadne kompaktnou. Arabčina potrebuje viac než 2 bajty na znak, zatiaľ čo čínština môže na správne zakódovanie vyžadovať viac než 3 bajty na znak.

Okrem efektivity kódovania sa jazyky zásadne líšia aj gramatikou, čo ovplyvňuje, ako sa informácie zahusťujú do slov. Syntetické jazyky dokážu veľa syntaktických informácií vložiť do jedného slova. Napríklad hovorím po česky, kde by sa fráza ako „vzali se“ do angličtiny preložila ako „they married each other“. Táto gramatická hutnosť sťažuje porovnávanie efektivity kódovania.

### Tokenizácia

veľké jazykové modely (LLMs) nepracujú priamo s bajtmi — pracujú s „tokenmi“, teda symbolmi zodpovedajúcimi skupinám bajtov. Väčšina moderných tokenizérov používa Byte Pair Encoding (BPE): začína jednotlivými bajtmi a potom iteratívne spája najčastejšie dvojice, aby vytvorila slovník podslovných jednotiek.

Existujú aj alternatívne prístupy, napríklad [Byte Latent Transformer](https://ai.meta.com/research/publications/byte-latent-transformer-patches-scale-better-than-tokens/), ale zatiaľ sa v produkčných systémoch výraznejšie nepresadili.

Technických rozhodnutí pri návrhu tokenizéra je veľa a ich dôsledky sú významné:

* Pridávajú sa na začiatok medzery? (Aby sa „hello“ v „hello world“ a „ hello world“ tokenizovalo rovnako?)
* Zakazuje sa spájanie bajtov cez hranice medzier? A čo cez hranice medzi skriptmi?
* Používa sa neznámy token (UNK), alebo sa pri sekvenciách mimo slovníka prechádza späť na bajty?

Dúfam, že vám to pomôže lepšie pochopiť Karpathyho klasický [post o tokenizácii](https://x.com/karpathy/status/1759996551378940395):

![Citát od Karpathyho: „Tokenization is at the heart of much weirdness of LLMS...“](https://pbs.twimg.com/media/GGzDbMRasAAZf_D?format=png\&name=medium)

## Ako tokenizácia ovplyvňuje predtrénovanie

Vzťah medzi tokenizérmi a predtrénovacími dátami vytvára zložitú spleť vplyvov, ktoré zásadne formujú schopnosti modelu. Tokenizéry sa často trénujú na predtrénovacích dátach LLM, v ktorých sa potom používajú, no rôzne jazyky majú v slovníku tokenizéra rôznu mieru „pokrytia“.

Uveďme si príklad: khmérčina. Keďže pre khmérčinu existuje menej online zdrojov, menšia časť slovníka tokenizéra bude zodpovedať dekódovaniu do khmérčiny než do angličtiny. Tento rozdiel v pokrytí znamená, že na zakódovanie rovnakého počtu slov v khmérčine treba oveľa viac tokenov než v angličtine. A tu vzniká problém: pri predtrénovaní sa rôzne jazyky často rozdeľujú pomerne podľa počtu tokenov. To znamená, že môžete model trénovať na 10 miliónoch tokenov anglického textu a 1 milióne tokenov khmérskeho textu v nádeji, že tým dosiahnete pomer obsahu 10:1. V skutočnosti však khmérsky text predstavuje v porovnaní s anglickým výrazne menej než 10 % slov!

Sémantické dôsledky sú ešte vážnejšie. Keďže khmérskych tokenov je menej, je pravdepodobnejšie, že budú predstavovať písmená alebo dvojice spoluhlások, a nie celé sémantické jednotky. To znamená, že pri nedostatočne zastúpených jazykoch si modely nedokážu tak ľahko „uložiť“ pojmy, vlastnosti, definície a ďalšie sémantické poznatky do embeddingových vektorov.

Existuje živá open-source komunita, ktorá vytvára fine-tuny OSS foundation modelov pre menšie jazyky. Ak si váš tokenizér s cudzími jazykmi neporadí dobre, fine-tuning bude náročnejší a pravdepodobne si vyžiada rozšírenie tokenizéra o vlastné tokeny. Na druhej strane, zavádzanie „čiastočne natrénovaných“ tokenov (tokenov, ktoré sa v predtrénovacích dátach nevyskytujú) môže LLM zmiasť a dokonca umožniť aj „[tokenové útoky](https://x.com/karpathy/status/1789590397749957117)“.

## Ako tokenizácia ovplyvňuje inferenciu

Rozdiely v tokenizácii, ktoré vznikajú počas predtrénovania, naďalej spôsobujú problémy aj pri inferencii. Text v jazykoch s nízkou dostupnosťou zdrojov (jazykoch s malým množstvom online zdrojov) potrebuje na vyjadrenie oveľa viac tokenov, čo vedie k viacerým navzájom sa nabaľujúcim problémom:

**Zhoršenie výkonu**: Nižšia priepustnosť sa stáva výrazným problémom, keď každá veta potrebuje na vyjadrenie 2–3x viac tokenov. Používatelia dostávajú pomalé odpovede a prevádzka chatov stojí poskytovateľov viac peňazí.

**Obmedzenia kontextu**: Dlhšie sekvencie rýchlejšie zapĺňajú kontextové okno a výkon pri vybavovaní informácií sa zhoršuje, keď má model problém udržať súvislé porozumenie naprieč nafúknutými sekvenciami tokenov.

**Kvalita generovania**: Výber tokenov počas generovania môže vnášať chyby. Viac tokenov na slovo znamená viac „príležitostí niečo pokaziť“ pri každom slove, čo môže viesť ku kumulatívnemu driftu, pri ktorom sa malé chyby pri výbere tokenov nabaľujú do väčších významových zlyhaní.

## Hodnotenie tokenizérov pomocou tokka-bench

Vytvoril som nástroj na jednoduché skúmanie výkonu tokenizérov naprieč 100 prirodzenými jazykmi a 20 programovacími jazykmi. Začal som hodnotením 7 tokenizérov: Gemma 3, GPT-2, GPT-4, gpt-oss, Kimi K2, Llama 3 a Qwen 3.

Projekt má viacero komponentov navrhnutých pre rôzne spôsoby použitia:

**Open-source repozitár**: Môžete si ho naklonovať a benchmarky spúšťať lokálne. [https://github.com/bgub/tokka-bench](https://github.com/bgub/tokka-bench)

**Live dashboard**: Okrem kódu na spúšťanie benchmarkov som vytvoril aj live dashboard! [https://tokka-bench.streamlit.app/](https://tokka-bench.streamlit.app/)

Vďaka tomu si môžete jednoducho vyberať kombinácie jazykov a tokenizérov na porovnanie a prepínať medzi rôznymi metrikami, aby ste lepšie pochopili, že výkon tokenizérov má viacero rozmerov.

### Datasety a metodológia

**Datasety**: Na vyhodnotenie používam tri vysokokvalitné datasety, ktoré pokrývajú rôzne textové domény:

* [FineWeb](https://huggingface.co/datasets/HuggingFaceFW/fineweb) pre anglický obsah
* [FineWeb 2](https://huggingface.co/datasets/HuggingFaceFW/fineweb-2) pre ostatné ľudské jazyky
* [StarCoder](https://huggingface.co/datasets/bigcode/starcoderdata) pre programovacie jazyky

**Metriky podľa jazyka**: Z každého datasetu vyberám vzorku 2 MB textu a tokenizujem ju, aby som vypočítal metriky výkonu špecifické pre daný jazyk. Tento prístup má jedno dôležité obmedzenie: v dôsledku rozdielov v kódovaní UTF-8 predstavujú 2 MB v rôznych jazykoch výrazne odlišné množstvá sémantického obsahu. Lepší prístup by mohol vypočítať globálnu „škálovaciu konštantu“ na základe ekvivalentného sémantického obsahu — napríklad pomocou paralelných prekladov a normalizácie podľa veľkosti anglického Harryho Pottera v bajtoch na sémantickú jednotku. V súčasnej podobe treba medzijazykové porovnania interpretovať opatrne a spoľahlivejšie je porovnávať rôzne tokenizéry v tom istom jazyku.

**Metriky slovnej zásoby**: Pri analýze samotných slovných zásob tokenizérov náhodne vyberám 10 000 tokenov zo slovnej zásoby každého tokenizéra a analyzujem ich vlastnosti po dekódovaní.

**Definície jazykových jednotiek**: Rôzne jazyky štruktúrujú informácie odlišne, preto pre metriky fertility a delenia definujem „jednotky“ takto:

* **Jazyky s medzerami**: tokeny na slovo (jednotky oddelené medzerami)
* **Jazyky založené na znakoch** (napr. čínština, japončina, thajčina): tokeny na znak (bez medzier)
* **Jazyky založené na slabikách** (napr. tibetčina): tokeny na slabiku (jednotky oddelené znakom tsheg, so záložnými metódami)

## Metriky a výsledky podľa jednotlivých jazykov

Porovnajme GPT-2, Llama 3 a Kimi K2 na vybranej skupine rozšírených jazykov, aby sme ukázali, aké poznatky môže tokka-bench odhaliť. Tieto tri som vybral preto, aby som ukázal, ako sa prístupy k tokenizácii v priebehu času vyvíjali.

Kontext ku každému z nich:

* GPT-2 má veľkosť slovnej zásoby ~50K a bol vydaný vo februári 2019
* Llama 3 má veľkosť slovnej zásoby ~128K a bol vydaný v apríli 2024
* Kimi K2 má veľkosť slovnej zásoby ~164K a bol vydaný v júli 2025

### Efektivita (bajty na token)

**`bytes_per_token`**: Priemerný počet bajtov UTF-8 na token (`total_bytes / total_tokens`). Vyššie hodnoty naznačujú efektívnejšiu kompresiu textu do tokenov.

![Graf bajtov na token vo viacerých jazykoch](/blog-images/tokka-bench-efficiency.png)

Rozdiely v efektivite odhaľujú priority pri tréningu a zloženie dát. Jazyky s vyšším pomerom bajtov na token sa komprimujú efektívnejšie, čo naznačuje buď lepšie rozdelenie slovníka, alebo viac tréningových dát na učenie slovníka.

**Dôležité obmedzenie**: Táto metrika nezohľadňuje rozdiely v kódovaní UTF-8 medzi rôznymi písmami. Napríklad hindčina dosahuje umelo vysokú efektivitu jednoducho preto, že každý znak vyžaduje na zakódovanie 3 bajty — pridelenie iba 50 tokenov na reprezentáciu každého znaku v hindskom písme by viedlo k efektivite 3 bajty/token. Mnohé hindské znaky však vznikajú kombinovaním spoluhlások so samohláskovými znamienkami alebo spoluhláskovými skupinami, takže pridanie tokenov pre tieto kombinácie (ktoré reprezentujú 6–9 bajtov každá) môže nafúknuť metriky efektivity, pričom stále poskytuje slabé sémantické pokrytie. To neodráža skutočnú sémantickú efektivitu. Táto metrika funguje najlepšie pri porovnávaní rôznych tokenizérov v rámci toho istého jazyka, nie pri porovnávaní efektivity medzi rozličnými písmami.

### Pokrytie (jedinečné tokeny)

**`unique_tokens`**: Počet rôznych ID tokenov použitých pri kódovaní ukážkového textu v jednotlivých jazykoch. Vyššie hodnoty naznačujú lepšie pokrytie písma daného jazyka s menším počtom núdzových prechodov na jednotlivé znaky na úrovni bajtov.

![Graf jedinečných tokenov vo viacerých jazykoch](/blog-images/tokka-bench-coverage.png)

Vo všeobecnosti považujem pokrytie za metriku, ktorá najlepšie vystihuje jazykové zloženie predtrénovacích dát. Pozrite sa, o koľko vyššie je pokrytie mandarínskeho písma pri Kimi K2 než pri ostatných tokenizéroch! Presne to by sme očakávali, keďže ide o čínsky LLM so slovnou zásobou špeciálne optimalizovanou pre čínsky text.

Hierarchia pokrytia odhaľuje jasné tréningové priority:

* Čínština má v Kimi K2 výnimočné pokrytie
* Angličtina má zďaleka najlepšie pokrytie písma naprieč všetkými modelmi, s výnimkou Kimi K2, kde je druhá
* Jazyky používajúce latinku (najmä románske jazyky) si vedú dobre
* Nasledujú ďalšie jazyky používajúce latinku
* Kórejčina, japončina a ruština vykazujú stredné pokrytie
* Hindčina, perzština a khmérčina výrazne zaostávajú

**Poznámka ku medzijazykovému porovnávaniu**: Keďže sa pokrytie počíta z pevných 2 MB textových vzoriek, priame porovnanie je problematické, pretože rôzne jazyky vyžadujú na vyjadrenie rovnakého sémantického obsahu odlišný počet bajtov UTF-8. Dôslednejší prístup by počítal pokrytie ako percento vzhľadom na normalizovaný základ — no zatiaľ je táto metrika najspoľahlivejšia pri porovnávaní rôznych tokenizérov v rámci toho istého jazyka, nie pri porovnávaní pokrytia naprieč rôznymi písmami.

### Miera rozdeľovania slov

**`word_split_pct`**: Percento jednotiek, ktoré sa rozdelia na viac ako jeden token. Jednotky sú definované podľa jazyka (slová v jazykoch oddeľovaných medzerami, znaky v znakových jazykoch, slabiky v jazykoch založených na slabikách). Nižšie hodnoty spravidla naznačujú lepší súlad s prirodzenými hranicami jednotiek.

![Graf percenta rozdeľovania slov vo viacerých jazykoch](/blog-images/tokka-bench-word-splitting.png)

V mandarínskej čínštine má Kimi K2 najnižší podiel tokenov pokračujúcich v rámci slova! Len 4 % tokenov pokračujú v slove.

*Upozornenie: nezabudnite, že pri znakových jazykoch, ako je mandarínska čínština, metrika sa v skutočnosti počíta na znak, nie na slovo. Slová v mandarínskej čínštine môžu mať 1 alebo viac znakov — väčšina z nich má v skutočnosti dva znaky — no to sa v benchmarku výpočtovo nedá rýchlo určiť.*

### Subslovná plodnosť

**`subword_fertility`**: Počet tokenov na jednotku, pričom jednotky sú definované na základe štruktúry jazyka (pozri metodológiu vyššie). Nižšie hodnoty sú lepšie — hodnota bližšia k 1 znamená menej častí na jednu sémantickú jednotku.

![Graf subslovnej plodnosti vo viacerých jazykoch](/blog-images/tokka-bench-subword-fertility.png)

V mandarínskej čínštine má Kimi K2 najnižšiu subslovnú plodnosť! Hodnota je nižšia ako 1, čo znamená, že v priemere jeden token reprezentuje viac než 1 znak.

## Slovníkové metriky (agregované naprieč všetkými jazykmi)

Vypočítané na základe vzorky tokenov zo slovníka tokenizéra a ich následného dekódovania:

**`tokens_starting_with_space_pct`**: Podiel tokenov, ktoré sa po dekódovaní začínajú medzerou. Odhaľuje to jednak návrh tokenizéra (aká veľká časť slovníka je vyhradená začiatkom slov oproti ich pokračovaniam), jednak charakter tréningových dát (jazyky bez medzier medzi slovami budú prirodzene vykazovať nižšie percentá).

**`tokens_with_whitespace_in_middle_pct`**: Podiel tokenov, ktorých dekódovaný text obsahuje biele znaky mimo začiatku. Signalizuje viacslovné tokeny alebo tokeny s väčším výskytom bielych znakov, ktoré prekračujú prirodzené hranice.

**`tokens_with_script_overlap_pct`**: Podiel tokenov obsahujúcich znaky z viacerých rodín písiem Unicode. Vyššie hodnoty môžu naznačovať tokeny so zmiešanými písmami alebo tokeny na úrovni bajtov, ktoré nerešpektujú hranice medzi písmami.

**`tokens_with_{script}_unicode_pct`**: Rozdelenie podľa písiem (napr. latinka, cyrilika, čínština, japončina, kórejčina, arabčina, dévanágarí, thajčina, hebrejčina, gréčtina, čísla, interpunkcia, symboly). Ukazuje, ktoré systémy písma tokeny tokenizéra v praxi skutočne pokrývajú.

## Bonusová sekcia: Programovacie jazyky

Na záver sa pozrime na niečo zaujímavé, čo som si všimol pri programovacích jazykoch (tu prepneme z GPT-2 na gpt-oss):

![Graf bajtov na token v rôznych programovacích jazykoch](/blog-images/tokka-bench-coding-efficiency.png)

V efektivite naprieč programovacími jazykmi je výrazne menšia variabilita — Kimi K2, Llama 3 a GPT-OSS majú v každom programovacom jazyku takmer rovnaký počet bajtov na token!

Nie som si úplne istý, prečo dochádza k tejto konvergencii, ale príde mi fascinujúca. Môže to naznačovať spoločné datasety používané všetkými tromi modelmi alebo možno podobné zastúpenie rôznych programovacích jazykov na GitHub a v ďalších bežných zdrojoch tréningových dát.

## Záver

Dúfam, že vám tokka-bench bude rovnako užitočný a prínosný ako mne! Je možné, že sa v ňom ešte skrývajú nejaké chyby — testoval som ho celkom dosť, no nástroju by veľmi prospelo oveľa dôkladnejšie komunitné testovanie naprieč rôznymi jazykmi a spôsobmi použitia.

Prosím, prispejte! Či už ide o hlásenia chýb, nové metriky, ďalšie tokenizéry alebo širšie jazykové pokrytie, zapojenie komunity urobí tento nástroj oveľa hodnotnejším.

Ak ste z AI laboratória s proprietárnym modelom, ale ste ochotní zdieľať metriky svojho tokenizéra na informačné účely, ozvite sa mi! Komunite by veľmi pomohlo lepšie pochopiť, ako najmodernejšie systémy pracujú s viacjazyčnou tokenizáciou.

## Poďakovania a zdroje

* [Vin Howe](https://howe.vin/), [Sachin Raja](https://x.com/s4chinraja) a [Jacob Holloway](https://www.linkedin.com/in/jhollowayj/) si prečítali môj článok a poskytli mi užitočnú spätnú väzbu
* [Harsha Vardhan Khurdula](https://www.linkedin.com/in/harsha-vardhan-khurdula-99b400183/) mi pomohol zhromaždiť relevantné zdroje a systematicky uvažovať o metrikách
* Judit Ács bola podľa všetkého prvá, kto predstavil subword fertility a proportion of continuation word pieces ako štandardné metriky tokenizácie v [tomto blogovom článku](https://juditacs.github.io/2019/02/19/bert-tokenization-stats.html)
* Rust a kol. tieto myšlienky ďalej rozvinuli v [článku na ACL](https://aclanthology.org/2021.acl-long.243.pdf), ktorý mi veľmi pomohol

## Budúce výskumné nápady

**Korelácia s výkonom**: Čo je dôležitejšie pre výkon v následných viacjazyčných úlohách: efektivita tokenizácie alebo pokrytie slovnej zásoby? Tento vzťah nie je na prvý pohľad zrejmý a pravdepodobne sa líši podľa typu úlohy.

**Kompromisy pri optimalizácii**: Do akej miery možno optimalizovať pokrytie pri zachovaní efektivity? Existuje Paretoova hranica, ktorú môžeme matematicky charakterizovať?

**Prediktívna sila**: Dokážeme predpovedať schopnosti viacjazyčného modelu len na základe metrík tokenizéra? Ak áno, mohlo by to poskytnúť rýchly spôsob, ako odhadnúť potenciál modelu ešte pred nákladným vyhodnocovaním.