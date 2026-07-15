---
title: Představujeme Eta v3
description: Další verze Eta, vestavěného JS šablonovacího engine, přináší vylepšení API a dokumentace.
date: "2023-06-22"
tags: [open-source]
---

## Pozadí

Dnes je Eta můj nejpopulárnější a nejpoužívanější open-source projekt. Když jsem ji ale před 3 lety poprvé zveřejnil, nebyla jedním z mých hlavních zaměření. Eta jsem totiž vytvořil jako odlehčenou variantu [Squirrelly](https://squirrelly.js.org), komplexnějšího šablonovacího enginu s funkcemi, jako jsou helpers a filtry.

Postupem času jsem si uvědomil, že pro většinu projektů se vestavěný šablonovací engine ve skutečnosti hodí lépe než něco složitějšího. Projekty, které potřebovaly složité zpracování HTML nebo zpracování HTML na straně klienta, obvykle používaly framework jako React nebo Vue. Výkon Ety a malá velikost bundle z ní naopak dělaly skvělou volbu pro projekty, které potřebovaly rychlé zpracování, nízkou spotřebu paměti nebo práci s ne-XML jazyky.

Zároveň byla Eta díky své rychlosti, podpoře Deno a syntaktickým výhodám oproti EJS stále populárnější. Vzhledem k těmto faktorům jsem se rozhodl zaměřit se na Etu jako na svůj hlavní projekt. Věnoval jsem čas psaní návodů, opravování chyb a vylepšování dokumentace.

Po několika letech a po období, kdy jsem se programování nevěnoval kvůli misijní službě, jsem si konečně znovu našel čas na práci na Etě. Rozhodl jsem se v projektu udělat několik velkých změn, včetně build systému, API a dokumentace.

## Aktualizace build systému

Navzdory výhodám a funkcím měla Eta i několik velkých problémů. Jedním z nich byl build systém. Byl složitý a těžkopádný, takže se špatně udržoval i aktualizoval. Musel jsem pracovat se složitými konfiguračními soubory a navíc transpilovat verzi určenou speciálně pro Deno.

Změny ve verzi 3:

* Použití [microbundle](https://github.com/developit/microbundle) ke sbalení knihovny mi pomohlo vyhnout se nutnosti používat složité konfigurační soubory.
* Použití GitHub Actions ke spouštění testů a sběru pokrytí kódu mi umožnilo sjednotit služby, které jsem používal.
* Díky nastavení `allowImportingTsExtensions: true` v `tsconfig.json` jsem se mohl vyhnout použití [Denoify](https://github.com/garronej/denoify) pro samostatný build pro Deno.

## Změny v API

Dalším problémem bylo API. Jednoduché metody jako `eta.render()` měly mnoho přetížení funkcí, takže z nich bylo obtížné odvozovat typy a jejich použití nebylo intuitivní. Při volání uživatelsky přístupných funkcí jako `render`, `parse` a `compile` bylo navíc možné předat vlastní objekt konfigurace. V praxi to znamenalo, že se uživatelská konfigurace musela při každém volání kterékoli z těchto funkcí sloučit s výchozí konfigurací.

Změny ve verzi 3:

* Existuje už jen jeden export: pojmenovaná třída `Eta`. Tato třída má jediný konstruktor, který zpracuje objekt konfigurace a při vytvoření instance vygeneruje cache šablon.
* Funkce `render()` a `renderAsync()` mají nyní jen jednu signaturu.
  * V Eta v2 bylo možné `render()` a `renderAsync()` použít k vykreslení buď pojmenovaných šablon, nebo řetězců šablon. Eta v3 zavádí dvě nové funkce pro vykreslování řetězců šablon: `renderString()` a `renderStringAsync()`.
* Funkce `readFile()` a `resolvePath()`, které Eta interně používá, může uživatel přepsat jako metody třídy.
* Interní proměnné a metody uvnitř každé zkompilované šablony jsou uložené v objektu `__eta`, místo aby byly rozdělené mezi několik proměnných včetně `__res`.
* Místo toho, aby uživatelé mohli zadat jeden kořenový adresář `root` a více adresářů `views`, mohou nyní zadat jen jeden adresář `views`. Tento adresář slouží jako kořenový adresář pro vyhledávání všech šablon. Všechny soubory šablon musí být uvnitř tohoto adresáře nebo některého z jeho podadresářů, což zvyšuje bezpečnost šablon a omezuje nákladné operace při vyhledávání souborů.

## Změny ve vývojářském komfortu

Jednou z největších změn v Eta v3 bylo přidání podrobných chyb za běhu (inspirovaných EJS). Vezměme si například následující šablonu, u které dojde k chybě kvůli nedefinované proměnné:

```eta
Template header
<%= undefinedVariable %>
Lorem Ipsum
```

Eta v2 vyhazovala chybu s několika obecnými informacemi, ale nebylo to nijak zvlášť užitečné. Oproti tomu Eta v3 vypisuje podrobnou chybu s názvem šablony, číslem řádku a chybovou zprávou:

```text
EtaError [ReferenceError]: .../my-dir/templates/runtime-error.eta:2
    1| Template header
 >> 2| <%= undefinedVariable %>
    3| Lorem Ipsum

undefinedVariable is not defined
```

## Změny v dokumentaci

Dokumentace k Eta v2 byla rozsáhlá, ale velmi nepřehledná. Informace o projektu byly rozdělené do více než 40 (!) stránek dokumentace v několika složkách napříč 3 různými sekcemi webu.

Dokumentace k Eta v3 má 9 stránek, všechny ve stejné části webu ([eta.js.org](https://eta.js.org)). Témata jako syntaxe šablon a přehled API jsou na jedné stránce, místo aby byla rozdělená do více stránek.

## Budoucnost Eta

Jsem hrdý na změny, které Eta v3 přináší, i na celý projekt. Velké díky patří všem, kteří do projektu přispěli prostřednictvím PR, issues a návrhů. Další poděkování patří projektům jako [ejs](https://github.com/mde/ejs), z nichž Eta i nadále čerpá inspiraci.

V tuto chvíli považuji Eta z větší části za funkčně kompletní, i když budu dál opravovat chyby a přidávat drobné funkce. Současné uživatele knihovny bych rád povzbudil k přechodu na v3 a doufám, že novým uživatelům bude Eta pro jejich projekty skvěle vyhovovat.

## Odkazy

* [Eta na GitHubu](https://github.com/eta-dev/eta)
* [Eta na npm](https://www.npmjs.com/package/eta)
* [Web a dokumentace Eta](https://eta.js.org)