---
title: "Prezentante tokka-bench"
description: "Ampleksa taksokadro por kompari tokenigilojn inter homaj lingvoj kaj programlingvoj."
date: "2025-08-25"
tags: [ml/ai, lingvistiko, malfermkoda]
---

(Ĉu vi hastas? Vizitu [tokka-bench.streamlit.app](https://tokka-bench.streamlit.app/))

![Ekrankopio de la grafikaĵo de tokka-bench](/blog-images/tokka-bench-hero.png)

Antaŭ kelkaj monatoj mi komencis labori pri nova projekto en mia libera tempo — antaŭtrejni malgrandan, multlingvan LLM-on. Kiel ofte okazas ĉe tiaj projektoj, ankaŭ la mia iom devojiĝis, kaj mi tre interesiĝis pri unu specifa aspekto de modeltrejnado: tokenigo.

Hodiaŭ mi volas prezenti kadron por taksi tokenigilojn, sed ankaŭ klarigi, kiel tokenigiloj povas helpi nin kompreni:

* Sur kiuj datumfontoj difinita modelo eble estis trejnita
* Kial iuj LLM-oj (precipe proprietaj modeloj, kiel ChatGPT, Claude kaj Gemini) plenumas multlingvajn taskojn multe pli bone ol aliaj
* Kial Claude, Gemini kaj GPT 4o kaj pli novaj modeloj havas fermitkodajn tokenigilojn
* Kial iuj malfermitkodaj modeloj estas pli bonaj ol aliaj por fajna agordado

## Teknika fono

### Kodado de skribsistemoj kaj gramatiko

Por kompreni tokenigadon, necesas unue kompreni, kiel teksto estas kodata je la bajta nivelo. Ĉiu lingvo estas kodata per UTF-8, sed malsamaj skribsistemoj postulas ege malsamajn nombrojn da bajtoj por kodi la saman semantikan enhavon. La angla averaĝe uzas iom pli ol 1 bajton por signo, kio faras ĝin nekredeble kompakta. La araba bezonas pli ol 2 bajtojn por signo, dum la ĉina povas postuli pli ol 3 bajtojn por signo por esti ĝuste kodata.

Krom la efikeco de kodado, lingvoj havas fundamentajn gramatikajn diferencojn, kiuj influas, kiel informo estas enpakata en vortojn. Sintezaj lingvoj enpakas multajn sintaksajn informojn en unuopajn vortojn. Ekzemple, mi parolas la ĉeĥan, kie esprimo kiel &quot;vzali se&quot; tradukiĝus per &quot;ili geedziĝis inter si&quot; en la angla. Tiu gramatika denseco malfaciligas kompari la efikecon de kodado.

### Tokenigado

LLM-oj ne laboras rekte kun bajtoj — ili laboras kun &quot;tokenoj&quot;, kiuj estas kvazaŭ simboloj respondantaj al grupoj de bajtoj. Plej multaj modernaj tokenigiloj uzas Byte Pair Encoding (BPE): ili komencas per unuopaj bajtoj kaj poste ripete kunfandas la plej oftajn parojn por konstrui vortprovizon de subvortaj unuoj.

Ekzistas ankaŭ kelkaj alternativaj aliroj, ekzemple la [Byte Latent Transformer](https://ai.meta.com/research/publications/byte-latent-transformer-patches-scale-better-than-tokens/), sed ĝis nun ili ankoraŭ ne vere enradikiĝis en produktaj sistemoj.

La teknikaj decidoj pri la projektado de tokenigilo estas multaj kaj gravaj:

* Ĉu vi aldonas antaŭajn spacojn? (Por ke la &quot;hello&quot; en &quot;hello world&quot; kaj en &quot; hello world&quot; estu tokenigita same?)
* Ĉu vi malpermesas bajtajn kunfandojn trans blankspacajn limojn? Kaj kio pri trans limojn inter skribsistemoj?
* Ĉu vi uzas nekonatan (UNK) tokenon aŭ anstataŭe revenas al bajtoj, kiam vi renkontas sekvencojn ekster la vortprovizo?

Espereble tio helpos vin kompreni la klasikan [mesaĝon pri tokenigado](https://x.com/karpathy/status/1759996551378940395) de Karpathy:

![Citaĵo de Karpathy: "Tokenigado kuŝas ĉe la koro de granda parto de la strangaĵoj de LLM-oj..."](https://pbs.twimg.com/media/GGzDbMRasAAZf_D?format=png\&name=medium)

## Kiel tokenigo influas antaŭtrejnadon

La rilato inter tokenigiloj kaj antaŭtrejnaj datumoj kreas kompleksan reton de efikoj, kiuj fundamente formas la kapablojn de modelo. Tokenigiloj ofte estas trejnataj per la antaŭtrejnaj datumoj de la LLM, en kiu ili estos uzataj, sed malsamaj lingvoj ricevas malsamajn nivelojn de „kovro“ en la vortprovizo de la tokenigilo.

Ni prenu ekzemplon: la kmera. Ĉar por la kmera ekzistas malpli da retaj rimedoj, malpli granda parto de la vortprovizo de tokenigilo respondos al malkodigoj en la kmera ol en la angla. Tiu malegaleco en kovro signifas, ke por kodi la saman nombron da vortoj en la kmera necesos multe pli da tokenoj ol en la angla. Sed jen kie aperas la problemo: antaŭtrejnado ofte uzas proporciajn dividojn inter malsamaj lingvoj laŭ tokeno-nombro. Tio signifas, ke oni povus trejni per 10 milionoj da tokenoj da angla teksto kaj 1 miliono da tokenoj da kmera teksto, esperante havi enhavrilatumon de 10:1. Sed la kmera teksto efektive reprezentas multe malpli ol 10% de la vortoj kompare kun la angla teksto!

La semantikaj implicoj estas eĉ pli gravaj. Kmeraj tokenoj, ĉar estas malpli da ili, pli verŝajne reprezentas literojn aŭ parojn de konsonantoj ol tutajn semantikajn unuojn. Tio signifas, ke modeloj ne povas tiel facile „stoki“ konceptojn, atributojn, difinojn kaj aliajn semantikajn sciojn en enkonstruaj vektoroj por nesufiĉe reprezentataj lingvoj.

Ekzistas vigla malfermkoda komunumo, kiu faras fajnagordojn de malfermkodaj fundamentaj modeloj por pli malgrandaj lingvoj. Se via tokenigilo ne bone traktas fremdajn lingvojn, fajnagordado estos pli malfacila kaj verŝajne postulos etendi la tokenigilon per propraj tokenoj. Aliflanke, enkonduki „parte trejnitajn“ tokenojn (tokenoj, kiuj ne aperos en la antaŭtrejnaj datumoj) povas konfuzi la LLM kaj eĉ ebligi „[token-atakojn](https://x.com/karpathy/status/1789590397749957117).“

## Kiel tokenigo influas inferencon

La malegalecoj en tokenigo, kiuj aperas dum antaŭtrejnado, daŭre kreas problemojn dum inferenco. Teksto en lingvoj kun malmultaj rimedoj (lingvoj kun malmultaj retaj rimedoj) postulas multe pli da tokenoj por esti reprezentata, kio kaŭzas plurajn kaskadajn problemojn:

**Malkresko de rendimento**: Pli malrapida trafluo fariĝas grava problemo, kiam ĉiu frazo postulas 2-3x pli da tokenoj por esti reprezentata. Uzantoj ricevas malrapidajn respondojn, kaj liveri babilajn servojn kostas al provizantoj pli da mono.

**Limigoj de kunteksto**: Pli longaj sekvencoj plenigas la kuntekstan fenestron pli rapide, kaj la kapablo rememori pli kaj pli malboniĝas, ĉar la modelo luktas por konservi koheran komprenon tra la ŝvelintaj tokenaj sekvencoj.

**Kvalito de generado**: La elekto de tokenoj dum generado povas enkonduki erarojn. Pli da tokenoj por ĉiu vorto signifas pli da „ŝancoj mispaŝi“ por ĉiu vorto, kio povas konduki al amasiĝanta drivo, en kiu etaj eraroj en la elekto de tokenoj kaskade kreskas en pli grandajn semantikajn fiaskojn.

## Taksado de tokenigiloj per tokka-bench

Mi kreis ilon por facile esplori la rendimenton de tokenigiloj tra 100 naturaj lingvoj kaj 20 programlingvoj. Mi komencis per taksado de 7 tokenigiloj: Gemma 3, GPT-2, GPT-4, gpt-oss, Kimi K2, Llama 3, kaj Qwen 3.

La projekto havas plurajn komponantojn, desegnitajn por malsamaj uzokazoj:

**Malfermkoda deponejo**: Vi povas kloni ĝin kaj ruli la mezurtestojn loke. [https://github.com/bgub/tokka-bench](https://github.com/bgub/tokka-bench)

**Viva panelo**: Krom la kodo por ruli la mezurtestojn, mi ankaŭ kreis vivan panelon! [https://tokka-bench.streamlit.app/](https://tokka-bench.streamlit.app/)

Tio ebligas al vi facile elekti kombinojn de lingvoj kaj tokenigiloj por kompari, kaj ŝanĝi inter malsamaj metrikoj por kompreni la multflankan naturon de tokenigila rendimento.

### Datumaroj kaj metodaro

**Datumaroj**: Por la taksado, mi uzas tri altkvalitajn datumarojn, kiuj reprezentas malsamajn tekstajn domajnojn:

* [FineWeb](https://huggingface.co/datasets/HuggingFaceFW/fineweb) por anglalingva enhavo
* [FineWeb 2](https://huggingface.co/datasets/HuggingFaceFW/fineweb-2) por aliaj homaj lingvoj
* [StarCoder](https://huggingface.co/datasets/bigcode/starcoderdata) por programlingvoj

**Lingvospecifaj metrikoj**: Mi prenas specimenon de 2MB da teksto el ĉiu datumaro kaj dividas ĝin en tokenojn por kalkuli lingvospecifajn rendimentajn metrikojn. Tiu aliro havas gravan limigon: pro diferencoj en UTF-8-kodado, 2MB reprezentas ege malsamajn kvantojn da semantika enhavo inter lingvoj. Pli bona aliro povus kalkuli tutmondan „skalan konstanton“ surbaze de ekvivalenta semantika enhavo — ekzemple, uzante paralelajn tradukojn por normaligi laŭ la bajta grandeco de Harry Potter en la angla dividita per semantikaj unuoj. En la nuna stato, translingvaj komparoj devas esti interpretataj singarde, kaj pli fidindas kompari malsamajn tokenigilojn ene de la sama lingvo.

**Vortprovizaj metrikoj**: Por analizi la vortprovizojn de la tokenigiloj mem, mi hazarde elektas 10,000 tokenojn el la vortprovizo de ĉiu tokenigilo kaj analizas iliajn ecojn post malkodigo.

**Difinoj de lingvaj unuoj**: Malsamaj lingvoj strukturas informon malsame, do mi difinas „unuojn“ por la metrikoj de fekundeco kaj disigado jene:

* **Lingvoj kun interspacoj**: tokenoj por vorto (unuoj apartigitaj per spacetoj)
* **Signobazitaj lingvoj** (ekz., ĉina, japana, taja): tokenoj por signo (ekskludante blankspacon)
* **Silabobazitaj lingvoj** (ekz., tibeta): tokenoj por silabo (unuoj apartigitaj per tsheg, kun alternativaj metodoj)

## Laŭlingvaj Metrikoj kaj Rezultoj

Ni komparu GPT-2, Llama 3 kaj Kimi K2 por subaro de popularaj lingvoj, por montri kiajn komprenojn tokka-bench povas malkaŝi. Mi elektis ĉi tiujn tri por montri la evoluon de tokenigaj aliroj tra la tempo.

Kunteksto pri ĉiu:

* GPT-2 havas vortprovizon de ~50K kaj estis publikigita en februaro 2019
* Llama 3 havas vortprovizon de ~128K kaj estis publikigita en aprilo 2024
* Kimi K2 havas vortprovizon de ~164K kaj estis publikigita en julio 2025

### Efikeco (Bajtoj por tokeno)

**`bytes_per_token`**: Meza nombro de UTF-8-bajtoj por tokeno (`total_bytes / total_tokens`). Pli altaj valoroj indikas pli efikan kunpremon de teksto en tokenojn.

![Grafikaĵo de bajtoj por tokeno en pluraj lingvoj](/blog-images/tokka-bench-efficiency.png)

La diferencoj en efikeco malkaŝas prioritatojn de trejnado kaj la konsiston de la datumoj. Lingvoj kun pli altaj rilatumoj de bajtoj por tokeno estas kunpremataj pli efike, kio sugestas aŭ pli bonan asignon de vortprovizo aŭ pli da trejnaj datumoj por lerni la vortprovizon.

**Grava limigo**: Ĉi tiu metriko ne konsideras diferencojn en UTF-8-kodado inter skribsistemoj. Ekzemple, la hinda atingas artefarite altan efikecon simple ĉar ĉiu signo postulas 3 bajtojn por esti kodita — atribui nur 50 tokenojn por reprezenti ĉiun signon en la hinda alfabeto donus efikecon de 3 bajtoj/tokeno. Tamen multaj hindaj signoj formiĝas per kombino de konsonantoj kun vokalsignoj aŭ konsonantaj kunmetaĵoj, do aldoni tokenojn por ĉi tiuj kombinoj (reprezentantaj po 6–9 bajtojn) povas ŝveligi efikecajn metrikojn, dum la semantika kovro restas malbona. Tio ne reflektas veran semantikan efikecon. La metriko plej taŭgas por kompari malsamajn tokenigilojn por la sama lingvo, prefere ol kompari efikecon inter diversaj skribsistemoj.

### Kovro (Unikaj tokenoj)

**`unique_tokens`**: Nombro de apartaj token-identigiloj uzataj dum enkodado de prova teksto en ĉiu lingvo. Pli altaj valoroj sugestas pli bonan kovron de la skribsistemo(j) de tiu lingvo, kun malpli da bajt-nivela fallback al unuopaj signoj.

![Grafikaĵo de unikaj tokenoj en pluraj lingvoj](/blog-images/tokka-bench-coverage.png)

Ĝenerale, mi trovas kovron la plej indika mezuro de la lingva konsisto de la pretraining-datumoj. Rigardu, kiom multe pli alta estas la kovro de la mandarena skribo ĉe Kimi K2 ol ĉe la aliaj tokenigiloj! Tio estas ĝuste tio, kion ni atendus, ĉar temas pri ĉina LLM kun vortprovizo speciale optimumigita por ĉina teksto.

La hierarkio de kovro montras klarajn trejnajn prioritatojn:

* La ĉina havas esceptan kovron ĉe Kimi K2
* La angla havas senkompare la plej bonan skrib-sisteman kovron en ĉiuj modeloj, krom ke ĉe Kimi K2 ĝi estas nur la dua plej bona
* Latinidaj lingvoj (precipe la latinidaj) funkcias bone
* Poste venas aliaj lingvoj kun latina alfabeto
* La korea, japana kaj rusa montras meznivelan kovron
* La hinda, persa kaj kmera signife postrestas

**Noto pri translingva komparo**: Ĉar kovro estas kalkulata sur fiksaj tekstaj specimenoj de 2 MB, rekta komparo estas problema, ĉar malsamaj lingvoj bezonas malsamajn kvantojn da UTF-8-bajtoj por esprimi semantike ekvivalentan enhavon. Pli principa aliro estus kalkuli kovron kiel procenton rilate al normaligita bazlinio—sed nuntempe tiu metriko estas plej fidinda por kompari malsamajn tokenigilojn en la sama lingvo, prefere ol por kompari kovron inter diversaj skribsistemoj.

### Indico de vortodisigo

**`word_split_pct`**: Procento de unuoj, kiuj disiĝas en pli ol unu tokenon. Unuoj estas difinitaj laŭ lingvo (vortoj por lingvoj kun interspacoj, signoj por signobazitaj lingvoj, silaboj por silobazitaj lingvoj). Pli malaltaj valoroj ĝenerale indikas pli bonan kongruon kun naturaj limoj inter unuoj.

![Grafikaĵo de vortodisiga procento en pluraj lingvoj](/blog-images/tokka-bench-word-splitting.png)

En la mandarena, Kimi K2 havas la plej malaltan indicon de daŭrigataj vortoj! Nur 4% de tokenoj daŭrigas vorton.

*Rimarko: memoru, ke por signobazitaj lingvoj kiel la mandarena, ĉi tiu metriko fakte mezuras laŭ signo, ne laŭ vorto. Vortoj en la mandarena povas havi 1 aŭ pli da signoj — plej multaj efektive longas du signojn — sed rapide determini tion en komparnormo estas kompute malsimpla.*

### Subvorta fekundeco

**`subword_fertility`**: tokenoj por unuo, kie unuoj estas difinitaj laŭ la lingva strukturo (vidu la metodaron supre). Malpli grandaj valoroj estas pli bonaj — valoro pli proksima al 1 signifas malpli da pecoj por semantika unuo.

![Grafikaĵo de subvorta fekundeco en pluraj lingvoj](/blog-images/tokka-bench-subword-fertility.png)

En la mandarena ĉina, Kimi K2 havas la plej malaltan subvortan fekundecon! La fekundeco estas sub 1, kio signifas, ke averaĝe ĉiu tokeno reprezentas pli ol 1 signon.

## Vortprovizaj Metrikoj (Agregitaj por Ĉiuj Lingvoj)

Kalkulitaj per specimenado de tokenoj el la vortprovizo de la tokenigilo, poste per ilia malkodado:

**`tokens_starting_with_space_pct`**: Proporcio de tokenoj, kiuj malkodiĝas kun komenca spaceto. Tio montras kaj la dezajnon de la tokenigilo (kiom da vortprovizo estas asignita al vortokomencoj kontraŭ daŭrigoj) kaj la ecojn de la trejnaj datumoj (lingvoj sen spacoj inter vortoj nature donos pli malaltajn procentojn).

**`tokens_with_whitespace_in_middle_pct`**: Proporcio de tokenoj, kies malkodita teksto enhavas blankspacon ne ĉe la komenco. Tio signalas plurvortajn aŭ spacoriĉajn tokenojn, kiuj transiras naturajn limojn.

**`tokens_with_script_overlap_pct`**: Proporcio de tokenoj enhavantaj signojn el pluraj Unikodaj skribsistemoj. Pli altaj valoroj povas indiki miksskribajn aŭ bajt-nivelajn tokenojn, kiuj ne respektas skribsistemajn limojn.

**`tokens_with_{script}_unicode_pct`**: Distribuo inter skribsistemoj (ekz., latina, cirila, ĉina, japana, korea, araba, devanagara, taja, hebrea, greka, nombroj, interpunkcio, simboloj). Montras, kiujn skribsistemojn la tokenoj de la tokenigilo efektive kovras en la praktiko.

## Kroma sekcio: programlingvoj

Fine, ni rigardu ion interesan, kion mi rimarkis pri programlingvoj (ĉi tie ni transiros de GPT-2 al gpt-oss):

![Grafiko de bajtoj por tokeno en diversaj programlingvoj](/blog-images/tokka-bench-coding-efficiency.png)

La efikeco varias draste malpli inter programlingvoj — Kimi K2, Llama 3 kaj GPT-OSS havas preskaŭ identan rezulton laŭ bajtoj por tokeno en ĉiu programlingvo!

Mi ne tute certas, kial okazas tiu konverĝo, sed ĝi fascinas min. Tio eble indikas komunajn datasetojn uzatajn de ĉiuj tri modeloj, aŭ eble similajn proporciojn de malsamaj kodlingvoj en GitHub kaj aliaj komunaj trejnfontoj.

## Konkludo

Mi esperas, ke vi trovos tokka-bench same utila kaj riveliga kiel mi! Eble ankoraŭ kaŝiĝas kelkaj cimoj — mi jam sufiĉe multe testis, sed la ilo certe profitus de multe pli ĝisfunda komunuma testado en diversaj lingvoj kaj uzokazoj.

Bonvolu helpi per kontribuoj! Ĉu temas pri cimraportoj, novaj metrikoj, aldonaj tokenigiloj aŭ pli vasta lingvokovro, komunuma partopreno faros ĉi tiun ilon multe pli valora.

Se vi laboras en AI-laboratorio kun proprieta modelo sed pretas kunhavigi la metrikojn de via tokenigilo por informa uzo, bonvolu kontakti min! La komunumo enorme profitus el pli bona kompreno pri tio, kiel pintnivelaj sistemoj traktas plurlingvan tokenigadon.

## Dankoj kaj referencoj

* [Vin Howe](https://howe.vin/), [Sachin Raja](https://x.com/s4chinraja), kaj [Jacob Holloway](https://www.linkedin.com/in/jhollowayj/) tralegis mian blogan afiŝon kaj donis utilajn komentojn
* [Harsha Vardhan Khurdula](https://www.linkedin.com/in/harsha-vardhan-khurdula-99b400183/) helpis min kolekti rilatajn studojn kaj sisteme pripensi metrikojn
* Judit Ács estis la unua persono (laŭ mia scio), kiu enkondukis subvortan fekundecon kaj la proporcion de daŭrigaj vortpecoj kiel normajn metrikojn de tokenigo en [ĉi tiu bloga afiŝo](https://juditacs.github.io/2019/02/19/bert-tokenization-stats.html)
* Rust et al. pluevoluigis ĉi tiujn ideojn en [ACL-artikolo](https://aclanthology.org/2021.acl-long.243.pdf), kiu estis ege utila

## Estontaj esplorideoj

**Korelacio de rendimento**: Kio pli gravas por posta plurlingva rendimento: efikeco de tokenigo aŭ amplekso de la vortprovizo? La rilato ne estas tuj klara kaj verŝajne varias laŭ la tipo de tasko.

**Optimumigaj kompromisoj**: Kiom multe eblas optimumigi la kovron sen perdi efikecon? Ĉu ekzistas Pareto-linio, kiun ni povas matematike karakterizi?

**Prognoza povo**: Ĉu ni povas antaŭdiri la kapablojn de plurlingvaj modeloj nur laŭ metrikoj de la tokenigilo? Se jes, tio povus provizi rapidan manieron taksi la potencialon de modelo antaŭ multekostaj taksaj ruladoj.