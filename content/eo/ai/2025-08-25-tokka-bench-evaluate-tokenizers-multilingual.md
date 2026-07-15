---
title: "Prezentante tokka-bench"
description: "Ampleksa taksa kadro por kompari tokenigilojn en homaj kaj programlingvoj."
date: "2025-08-25"
tags: [ml/ai, linguistics, open-source]
---

(Ĉu vi rapidas? Vizitu [tokka-bench.streamlit.app](https://tokka-bench.streamlit.app/))

![Ekrankopio de diagramo en tokka-bench](/blog-images/tokka-bench-hero.png)

Antaŭ pluraj monatoj mi komencis labori pri nova projekto en mia libera tempo — antaŭtrejni malgrandan, plurlingvan LLM-on. Kiel ofte okazas ĉe tiaj entreprenoj, mia devojiĝis, kaj mi tre interesiĝis pri unu specifa aspekto de modeltrejnado: tokenigado.

Hodiaŭ mi volas prezenti kadron por taksi tokenigilojn, sed ankaŭ klarigi, kiel tokenigiloj povas helpi nin kompreni:

* El kiuj datumfontoj certa modelo eble estis trejnita
* Kial iuj LLM-oj (precipe proprietaj modeloj, kiel ChatGPT, Claude kaj Gemini) funkcias multe pli bone ol aliaj pri plurlingvaj taskoj
* Kial Claude, Gemini kaj la modeloj ekde GPT 4o havas fermitkodajn tokenigilojn
* Kial iuj OSS-modeloj pli taŭgas ol aliaj por fajnagordado

## Teknika fono

### Kodado de skribsistemoj kaj gramatiko

Kompreni tokenigadon komenciĝas per kompreno pri tio, kiel teksto estas kodata je la nivelo de bajtoj. Ĉia lingva teksto estas kodata per UTF-8, sed malsamaj skribsistemoj postulas tre malsamajn kvantojn da bajtoj por kodi la saman semantikan enhavon. La angla averaĝas iom pli ol 1 bajton por signo, kio faras ĝin nekredeble kompakta. La araba bezonas pli ol 2 bajtojn por signo, dum la ĉina povas postuli pli ol 3 bajtojn por signo por esti ĝuste kodata.

Krom la efikeco de kodado, lingvoj havas fundamentajn gramatikajn diferencojn, kiuj influas, kiel informo estas pakita en vortojn. Sintezaj lingvoj enpakas multajn sintaksajn informojn en unuopajn vortojn. Ekzemple, mi parolas la ĉeĥan, kie esprimo kiel &quot;vzali se&quot; tradukiĝus en la anglan kiel &quot;they married each other&quot;. Tiu gramatika denseco malfaciligas kompari la efikecon de kodado.

### Tokenigado

LLM-oj ne funkcias rekte per bajtoj — ili funkcias per &quot;tokenoj&quot;, kiuj estas kvazaŭ simboloj respondantaj al grupoj de bajtoj. Plej multaj modernaj tokenigiloj uzas Byte Pair Encoding (BPE): ili komencas per unuopaj bajtoj kaj poste ripete kunfandas la plej oftajn parojn por konstrui vortprovizon el subvortaj unuoj.

Ekzistas ankaŭ kelkaj alternativaj aliroj, ekzemple la [Byte Latent Transformer](https://ai.meta.com/research/publications/byte-latent-transformer-patches-scale-better-than-tokens/), sed ĝis nun ili ankoraŭ ne vere enradikiĝis en produktadaj sistemoj.

La teknikaj decidoj ĉe la projektado de tokenigilo estas multaj kaj gravaj:

* Ĉu vi aldonas prefiksajn spacetojn? (Por ke la &quot;hello&quot; en &quot;hello world&quot; kaj &quot; hello world&quot; estu tokenigita same?)
* Ĉu vi malpermesas bajtajn kunfandojn trans limojn de blankspacoj? Kaj kio pri limoj inter skribsistemoj?
* Ĉu vi uzas nekonatan (UNK) tokenon aŭ anstataŭe revenas al bajtoj kiam vi renkontas sekvencojn ekster la vortprovizo?

Espereble ĉi tio helpos vin kompreni la klasikan [afiŝon pri tokenigado](https://x.com/karpathy/status/1759996551378940395) de Karpathy:

![Citaĵo de Karpathy: "Tokenization is at the heart of much weirdness of LLMS..."](https://pbs.twimg.com/media/GGzDbMRasAAZf_D?format=png\&name=medium)

## Kiel tokenigado influas antaŭtrejnadon

La rilato inter tokenigiloj kaj antaŭtrejnaj datumoj kreas kompleksan reton de efikoj, kiuj funde formas la kapablojn de modelo. Tokenigiloj ofte estas trejnataj sur la antaŭtrejnaj datumoj de la LLM, en kiu ili estos uzataj, sed malsamaj lingvoj ricevas malsamajn nivelojn de „kovro“ en la vortprovizo de la tokenigilo.

Ni prenu ekzemplon: la kmera. Ĉar la kmera havas malpli da retaj rimedoj, malpli granda parto de la vortprovizo de tokenigilo respondos al kmeraj teksteroj ol al anglaj. Tiu malegaleco en kovro signifas, ke por enkodi la saman nombron da vortoj en la kmera necesos multe pli da tokenoj ol en la angla. Sed ĝuste tie aperas la problemo: antaŭtrejnado ofte uzas proporciajn dividojn de malsamaj lingvoj laŭ la nombro de tokenoj. Tio signifas, ke oni povus trejni per 10 milionoj da tokenoj de angla teksto kaj 1 miliono da tokenoj de kmera, esperante havi enhavan rilatumon de 10:1. Sed la kmera teksto efektive reprezentas multe malpli ol 10% de la vortoj kompare kun la angla teksto!

La semantikaj implicoj estas eĉ pli severaj. Kmeraj tokenoj, ĉar ili estas malpli multaj, pli verŝajne reprezentas literojn aŭ parojn de konsonantoj anstataŭ tutajn semantikajn unuojn. Tio signifas, ke modeloj ne povas tiel facile „konservi“ konceptojn, ecojn, difinojn kaj aliajn semantikajn sciojn en embedding-vektoroj por nesufiĉe reprezentataj lingvoj.

Ekzistas vigla malfermkoda komunumo, kiu faras fajnagordojn de OSS-fundamentaj modeloj por pli malgrandaj lingvoj. Se via tokenigilo ne bone traktas fremdajn lingvojn, fajnagordado estos pli malfacila kaj verŝajne postulos etendi la tokenigilon per propraj tokenoj. Aliflanke, enkonduki „parte trejnitajn“ tokenojn (tokenojn, kiuj ne aperos en la antaŭtrejnaj datumoj) povas konfuzi la LLM kaj eĉ ebligi „[token-atakojn](https://x.com/karpathy/status/1789590397749957117).“

## Kiel tokenigado influas inferencon

La diferencoj en tokenigado, kiuj aperas dum antaŭtrejnado, daŭre kaŭzas problemojn dum inferenco. Teksto en lingvoj kun malmultaj rimedoj (lingvoj kun malmultaj retaj rimedoj) postulas multe pli da tokenoj por esti reprezentata, kio siavice kaŭzas plurajn ĉenajn problemojn:

**Malboniĝo de rendimento**: Pli malrapida trairkapacito fariĝas grava problemo, kiam ĉiu frazo bezonas 2-3x pli da tokenoj por esti reprezentata. Uzantoj ricevas malrapidajn respondojn, kaj la kostoj de provizado de babilaj servoj altiĝas por la provizantoj.

**Limigoj de kunteksto**: Pli longaj sekvencoj pli rapide plenigas la kuntekstan fenestron, kaj la rememora rendimento malboniĝas, ĉar la modelo penas konservi koheran komprenon tra la ŝvelintaj tokensekvencoj.

**Kvalito de generado**: La elekto de tokenoj dum generado povas enkonduki erarojn. Pli da tokenoj por unu vorto signifas pli da &quot;ŝancoj mispaŝi&quot; ĉe ĉiu vorto, kio povas konduki al akumuliĝanta devojiĝo, en kiu etaj eraroj en tokenelekto ĉene fariĝas pli grandaj semantikaj fiaskoj.

## Taksado de tokenigiloj per tokka-bench

Mi kreis ilon por facile esplori la efikecon de tokenigiloj en 100 naturaj lingvoj kaj 20 programlingvoj. Mi komence taksis 7 tokenigilojn: Gemma 3, GPT-2, GPT-4, gpt-oss, Kimi K2, Llama 3, kaj Qwen 3.

La projekto havas plurajn partojn por malsamaj uzokazoj:

**Malfermkoda deponejo**: Vi povas kloni ĝin kaj loke ruli la benchmarkojn. [https://github.com/bgub/tokka-bench](https://github.com/bgub/tokka-bench)

**Reta panelo**: Krom la kodo por ruli la benchmarkojn, mi ankaŭ faris retan panelon! [https://tokka-bench.streamlit.app/](https://tokka-bench.streamlit.app/)

Tio ebligas al vi facile elekti kombinojn de lingvoj kaj tokenigiloj por komparo, kaj ŝanĝi inter diversaj metrikoj por pli bone kompreni la multfacetan naturon de ilia efikeco.

### Datumaroj kaj metodologio

**Datumaroj**: Por taksado, mi uzas tri altkvalitajn datumarojn, kiuj reprezentas malsamajn tekstajn domajnojn:

* [FineWeb](https://huggingface.co/datasets/HuggingFaceFW/fineweb) por anglalingva enhavo
* [FineWeb 2](https://huggingface.co/datasets/HuggingFaceFW/fineweb-2) por aliaj homaj lingvoj
* [StarCoder](https://huggingface.co/datasets/bigcode/starcoderdata) por programlingvoj

**Lingvospecifaj metrikoj**: Mi prenas specimenon de 2MB da teksto el ĉiu datumaro kaj tokenigas ĝin por kalkuli lingvo-specifajn efikecajn metrikojn. Tiu ĉi aliro havas gravan limigon: pro diferencoj en UTF-8-kodado, 2MB reprezentas treege malsamajn kvantojn de semantika enhavo inter lingvoj. Pli bona aliro eble kalkulus ĝeneralan &quot;skaligan konstanton&quot; surbaze de ekvivalenta semantika enhavo—ekzemple, uzante paralelajn tradukojn por normaligi laŭ la bajta grandeco de Harry Potter en la angla, dividita per semantikaj unuoj. Nuntempe translingvaj komparoj devas esti interpretataj singarde, kaj estas pli fidinde kompari malsamajn tokenigilojn por la sama lingvo.

**Vortprovizaj metrikoj**: Por analizi la vortprovizojn de la tokenigiloj mem, mi hazarde prenas specimenon de 10 000 tokenoj el la vortprovizo de ĉiu tokenigilo kaj analizas iliajn ecojn post malkodigo.

**Difinoj de lingvaj unuoj**: Malsamaj lingvoj strukturas informojn malsame, do mi difinas &quot;unuojn&quot; por la metrikoj de fekundeco kaj disigado jene:

* **Lingvoj kun interspacoj**: tokenoj po vorto (unuoj apartigitaj per spacoj)
* **Signobazitaj lingvoj** (ekz., la ĉina, la japana, la taja): tokenoj po signo (ekskludante blankspacojn)
* **Silabobazitaj lingvoj** (ekz., la tibeta): tokenoj po silabo (unuoj apartigitaj per tsheg, kun rezervaj metodoj)

## Metrikoj kaj rezultoj laŭ lingvo

Ni komparu GPT-2, Llama 3 kaj Kimi K2 ĉe subaro de popularaj lingvoj por montri, kiajn komprenojn tokka-bench povas malkaŝi. Mi elektis ĉi tiujn tri por montri, kiel aliroj al tokenigado evoluis tra la tempo.

Kunteksto por ĉiu:

* GPT-2 havas vortprovizon de ~50K kaj estis publikigita en februaro 2019
* Llama 3 havas vortprovizon de ~128K kaj estis publikigita en aprilo 2024
* Kimi K2 havas vortprovizon de ~164K kaj estis publikigita en julio 2025

### Efikeco (Bajtoj por Tokeno)

**`bytes_per_token`**: Meza nombro de UTF-8-bajtoj por tokeno (`total_bytes / total_tokens`). Pli altaj valoroj indikas pli efikan kunpremon de teksto en tokenojn.

![Grafikaĵo de bajtoj-po-tokeno en pluraj lingvoj](/blog-images/tokka-bench-efficiency.png)

La diferencoj en efikeco malkaŝas prioritatojn de la trejnado kaj la konsiston de la datumoj. Lingvoj kun pli altaj proporcioj de bajtoj por tokeno estas kunpremataj pli efike, kio sugestas aŭ pli bonan asignon de vortprovizo aŭ pli da trejnaj datumoj por lerni la vortprovizon.

**Grava limigo**: Ĉi tiu metriko ne konsideras diferencojn en UTF-8-kodado inter skribsistemoj. Ekzemple, la hindia atingas artefarite altan efikecon simple ĉar ĉiu signo bezonas 3 bajtojn por esti kodita—atribui nur 50 tokenojn por reprezenti ĉiun signon en la hindia alfabeto donus efikecon de 3 bajtoj/tokeno. Tamen multaj hindiaj signoj formiĝas per kombino de konsonantoj kun vokalsignoj aŭ per konsonantaj kunmetaĵoj, do aldoni tokenojn por tiuj kombinaĵoj (reprezentantaj po 6-9 bajtojn) povas ŝveligi la efikecajn metrikojn, dum la semantika kovro restas malbona. Tio ne spegulas veran semantikan efikecon. La metriko plej taŭgas por kompari malsamajn tokenigilojn por la sama lingvo, anstataŭ por kompari efikecon inter diversaj skribsistemoj.

### Kovro (Unikaj tokenoj)

**`unique_tokens`**: Nombro de malsamaj token-identigiloj uzataj dum enkodigo de specimena teksto en ĉiu lingvo. Pli altaj valoroj sugestas pli bonan kovron de la koncerna(j) skribsistemo(j), kun malpli da bajtnivelaj fallback-oj al unuopaj signoj.

![Grafikaĵo de unikaj tokenoj en pluraj lingvoj](/blog-images/tokka-bench-coverage.png)

Ĝenerale mi trovas kovron la plej indika mezuro de la lingva konsisto de la datumoj por antaŭtrejnado. Rigardu kiom pli alta estas la kovro de la mandarena skribsistemo ĉe Kimi K2 ol ĉe la aliaj tokenigiloj! Ĝuste tion ni atendus, ĉar temas pri ĉina LLM kun vortprovizo specife optimumigita por ĉina teksto.

La kovro-hierarkio montras klarajn trejnajn prioritatojn:

* La ĉina havas esceptan kovron en Kimi K2
* La angla havas senkompare la plej bonan skribsisteman kovron tra ĉiuj modeloj, krom ke ĉe Kimi K2 ĝi estas nur la dua plej bona
* Latinidaj lingvoj (precipe la latinidaj) funkcias bone
* Sekvas aliaj lingvoj kun latina alfabeto
* La korea, la japana kaj la rusa montras meznivelan kovron
* La hindia, la persa kaj la kmera signife postrestas

**Noto pri translingva komparo**: Ĉar kovro estas kalkulata sur fiksaj 2MB-tekstospecimenoj, rekta komparo estas problema, ĉar malsamaj lingvoj postulas malsamajn nombrojn da UTF-8-bajtoj por esprimi semantike ekvivalentan enhavon. Pli principa aliro kalkulus kovron kiel procenton relative al normaligita bazlinio—sed nuntempe ĉi tiu mezuro estas plej fidinda por kompari malsamajn tokenigilojn en la sama lingvo, prefere ol kompari kovron inter diversaj skribsistemoj.

### Indico de vortodisiĝo

**`word_split_pct`**: Procento de unuoj, kiuj disiĝas en pli ol unu tokenon. Unuoj estas difinitaj laŭ la lingvo (vortoj por lingvoj kun interspacoj, signoj por signobazitaj lingvoj, silaboj por silabobazitaj lingvoj). Pli malaltaj valoroj ĝenerale indikas pli bonan kongruon kun naturaj limoj de unuoj.

![Grafikaĵo de la procento de vortodisiĝo en pluraj lingvoj](/blog-images/tokka-bench-word-splitting.png)

En la mandarena, Kimi K2 havas la plej malaltan indicon de vortodaŭrigo! Nur 4% de la tokenoj daŭrigas vorton.

*Rimarko: memoru, ke por signobazitaj lingvoj kiel la mandarena, tiu metriko efektive mezuras po signo, ne po vorto. Vortoj en la mandarena povas havi 1 signon aŭ pli — plej multaj efektive longas du signojn — sed rapide determini tion en komparnormo estas kompute malsimple.*

### Subvorta fekundeco

**`subword_fertility`**: Tokenoj por unuo, kie la unuoj estas difinitaj laŭ la lingva strukturo (vidu la supran metodaron). Pli malaltaj valoroj estas pli bonaj — valoro pli proksima al 1 signifas malpli da pecoj por semantika unuo.

![Grafikaĵo de subvorta fekundeco en pluraj lingvoj](/blog-images/tokka-bench-subword-fertility.png)

En la mandarena, Kimi K2 havas la plej malaltan subvortan fekundecon! La fekundeco estas sub 1, kio signifas, ke averaĝe ĉiu tokeno reprezentas pli ol 1 signon.

## Vortprovizaj metrikoj (agregitaj por ĉiuj lingvoj)

Kalkulitaj per prova elekto de tokenoj el la vortprovizo de la tokenigilo kaj posta malkodado de ili:

**`tokens_starting_with_space_pct`**: Proporcio de tokenoj, kiuj malkodiĝas kun komenca spaceto. Tio malkaŝas kaj la dezajnon de la tokenigilo (kiom da vortprovizo estas asignita al vortokomencoj kontraŭ daŭrigoj) kaj la ecojn de la trejnaj datumoj (lingvoj sen spacoj inter vortoj nature donos pli malaltajn procentojn).

**`tokens_with_whitespace_in_middle_pct`**: Proporcio de tokenoj, kies malkodita teksto enhavas blankspacon ne ĉe la komenco. Tio indikas pluvortajn aŭ blankspac-riĉajn tokenojn, kiuj transpasas naturajn limojn.

**`tokens_with_script_overlap_pct`**: Proporcio de tokenoj, kiuj enhavas signojn el pluraj unikodaj skribsistemaj familioj. Pli altaj valoroj povas indiki miks-skribsistemajn aŭ bajtnivelajn tokenojn, kiuj ne respektas skribsistemajn limojn.

**`tokens_with_{script}_unicode_pct`**: Distribuo laŭ skribsistemoj (ekz. latina, cirila, ĉina, japana, korea, araba, devanagara, taja, hebrea, greka, nombroj, interpunkcio, simboloj). Montras, kiujn skribsistemojn la tokenoj de la tokenigilo efektive kovras praktike.

## Kroma sekcio: Programlingvoj

Fine, ni rigardu ion interesan, kion mi rimarkis pri programlingvoj (ĉi tie ni transiros de GPT-2 al gpt-oss):

![Grafikaĵo de bajtoj-po-tokeno en diversaj programlingvoj](/blog-images/tokka-bench-coding-efficiency.png)

Estas draste malpli da variado en efikeco inter programlingvoj — Kimi K2, Llama 3 kaj GPT-OSS havas preskaŭ identan rendimenton laŭ bajtoj por tokeno en ĉiu programlingvo!

Mi ne estas tute certa, kial okazas tiu ĉi konverĝo, sed mi trovas ĝin fascina. Ĝi eble indikas komunajn datumarojn uzatajn de ĉiuj tri modeloj, aŭ eble similajn proporciojn de malsamaj programlingvoj en GitHub kaj aliaj komunaj trejnfontoj.

## Konkludo

Mi esperas, ke tokka-bench estos por vi same utila kaj priluma kiel por mi! Eble ankoraŭ kaŝiĝas kelkaj cimoj — mi testis sufiĉe vaste, sed la ilo povus multe profiti de pli ĝisfunda testado fare de la komunumo tra diversaj lingvoj kaj uzkazoj.

Bonvolu helpi per kontribuoj! Ĉu temas pri cimraportoj, novaj metrikoj, aldonaj tokenigiloj aŭ pli vasta lingvokovro, komunuma partopreno faros ĉi tiun ilon multe pli valora.

Se vi laboras en AI-laboratorio kun proprieta modelo sed pretas kundividi la metrikojn de via tokenigilo por informaj celoj, bonvolu kontakti min! La komunumo enorme profitus el pli bona kompreno pri tio, kiel pintnivelaj sistemoj traktas plurlingvan tokenigadon.

## Dankoj kaj Referencoj

* [Vin Howe](https://howe.vin/), [Sachin Raja](https://x.com/s4chinraja), kaj [Jacob Holloway](https://www.linkedin.com/in/jhollowayj/) recenzis mian artikolon kaj donis utilajn rimarkojn
* [Harsha Vardhan Khurdula](https://www.linkedin.com/in/harsha-vardhan-khurdula-99b400183/) helpis min kolekti rilatajn esplorojn kaj sisteme pripensi la metrikojn
* Judit Ács estis la unua persono (laŭ mia scio), kiu enkondukis subvortan fekundecon kaj la proporcion de daŭrigaj vortpecoj kiel normajn metrikojn por tokenigo en [ĉi tiu blogartikolo](https://juditacs.github.io/2019/02/19/bert-tokenization-stats.html)
* Rust kaj aliaj plue evoluigis ĉi tiujn ideojn en [ACL-artikolo](https://aclanthology.org/2021.acl-long.243.pdf), kiu estis nekredeble helpa

## Estontaj Esplorideoj

**Korelacio kun rendimento**: Kio pli gravas por posta plurlingva rendimento: efikeco de tokenigado aŭ kovro de la vortprovizo? La rilato ne estas tuj evidenta kaj verŝajne varias laŭ la speco de tasko.

**Optimumigaj kompromisoj**: Kiom multe oni povas optimumigi kovron, samtempe konservante efikecon? Ĉu ekzistas Pareto-fronto, kiun ni povas matematike priskribi?

**Antaŭdira povo**: Ĉu ni povas antaŭdiri la kapablojn de plurlingva modelo nur laŭ metrikoj de la tokenigilo? Se jes, tio povus oferti rapidan manieron taksi la potencialon de modelo antaŭ multekostaj taksadoj.