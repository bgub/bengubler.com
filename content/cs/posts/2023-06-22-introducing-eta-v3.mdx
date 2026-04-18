---
title: Představujeme Eta v3
description: Nová verze Ety, vestavitelného šablonovacího enginu pro JS, přináší vylepšení API i dokumentace.
date: "2023-06-22"
tags: [open-source]
---

## Pozadí

Dnes je Eta můj nejpopulárnější a nejpoužívanější open-source projekt. Když jsem ji ale před 3 lety poprvé zveřejnil, nebyla jedním z mých hlavních zaměření. Ve skutečnosti jsem Etu vytvořil jako odlehčenou variantu [Squirrelly](https://squirrelly.js.org), složitějšího šablonovacího enginu s funkcemi jako helpers a filtry.

Postupem času jsem si uvědomil, že pro většinu projektů se vestavěný šablonovací engine ve skutečnosti hodí lépe než něco složitějšího. Projekty, které potřebovaly komplexní zpracování HTML nebo jeho zpracování na straně klienta, obvykle používaly framework jako React nebo Vue. Výkon Ety a malá velikost bundlu z ní mezitím dělaly skvělou volbu pro projekty, které potřebovaly rychlé zpracování, nízkou spotřebu paměti nebo práci s jazyky, které nejsou XML.

Zároveň byla Eta díky své rychlosti, podpoře Dena a syntaktickým výhodám oproti EJS stále populárnější. S ohledem na tyto faktory jsem se rozhodl zaměřit se především na Etu. Věnoval jsem čas psaní návodů, opravování chyb a vylepšování dokumentace.

Po několika letech a období, kdy jsem byl kvůli misijní službě mimo programování, jsem si konečně znovu našel čas na práci na Etě. Rozhodl jsem se v projektu udělat několik velkých změn, včetně build systému, API a dokumentace.

## Aktualizace build systému

Přes všechny výhody a funkce měla Eta i několik zásadních problémů. Jedním z nich byl build systém. Byl složitý a neobratný, takže se špatně udržoval i aktualizoval. Musel jsem se potýkat se složitými konfiguračními soubory a také s nutností transpilovat zvláštní verzi pro Deno.

Změny ve verzi 3:

* Použití [microbundle](https://github.com/developit/microbundle) pro zabalení knihovny mi pomohlo obejít potřebu složitých konfiguračních souborů.
* Použití GitHub Actions ke spouštění testů a sběru pokrytí mi umožnilo sjednotit služby, které jsem používal.
* Díky nastavení `allowImportingTsExtensions: true` v `tsconfig.json` jsem se mohl vyhnout použití [Denoify](https://github.com/garronej/denoify) pro samostatný build pro Deno.

## Změny API

Dalším problémem bylo API. Jednoduché metody jako `eta.render()` měly mnoho přetížení, takže bylo obtížné odvozovat typy a jejich použití nebylo intuitivní. Při volání uživatelsky dostupných funkcí jako `render`, `parse` a `compile` bylo navíc možné předat vlastní konfigurační objekt. V praxi to znamenalo, že při každém volání kterékoli z těchto funkcí bylo nutné sloučit uživatelskou konfiguraci s výchozí.

Změny ve verzi 3:

* Existuje už jen jeden export: pojmenovaná třída `Eta`. Tato třída má jediný konstruktor, který zpracuje konfigurační objekt a při instanciaci vygeneruje cache šablon.
* Funkce `render()` a `renderAsync()` teď mají jen jednu signaturu.
  * V Eta v2 bylo možné `render()` a `renderAsync()` použít k vykreslení buď pojmenovaných šablon, nebo řetězců šablon. Eta v3 zavádí dvě nové funkce pro vykreslování řetězců šablon: `renderString()` a `renderStringAsync()`.
* Funkce `readFile()` a `resolvePath()`, které Eta interně používá, může uživatel přepsat jako metody třídy.
* Interní proměnné a metody uvnitř každé zkompilované šablony jsou uložené v objektu `__eta` místo v několika samostatných proměnných včetně `__res`.
* Místo toho, aby uživatelé mohli zadat jeden kořenový adresář `root` a více adresářů `views`, mohou nyní zadat jen jediný adresář `views`. Ten se používá jako kořenový adresář pro veškeré určování cest k šablonám. Všechny soubory šablon musí být uvnitř tohoto adresáře nebo některého jeho podadresáře, což zvyšuje bezpečnost šablon a omezuje nákladné operace při vyhledávání souborů.

## Změny z pohledu vývojářů

Jednou z největších změn v Eta v3 bylo přidání podrobných běhových chyb (inspirovaných EJS). Uvažujme třeba následující šablonu, která skončí chybou kvůli nedefinované proměnné:

```eta
Template header
<%= undefinedVariable %>
Lorem Ipsum
```

Eta v2 sice vyhodila chybu s několika obecnými informacemi, ale nebylo to nijak zvlášť užitečné. Oproti tomu Eta v3 vypisuje podrobnou chybu s názvem šablony, číslem řádku a chybovou zprávou:

```text
EtaError [ReferenceError]: .../my-dir/templates/runtime-error.eta:2
    1| Template header
 >> 2| <%= undefinedVariable %>
    3| Lorem Ipsum

undefinedVariable is not defined
```

## Změny v dokumentaci

Dokumentace k Eta v2 byla rozsáhlá, ale velmi nepřehledná. Informace o projektu byly rozdělené do více než 40 (!) stránek dokumentace, uložených v několika složkách napříč 3 různými sekcemi webu.

Dokumentace k Eta v3 má 9 stránek, všechny ve stejné části webu ([eta.js.org](https://eta.js.org)). Témata jako syntaxe šablon a přehled API jsou shrnuta na jedné stránce, místo aby byla rozdělená do více stránek.

## Budoucnost Ety

Jsem hrdý na změny obsažené v Eta v3 i na celý projekt. Velké díky patří všem, kdo do projektu přispěli prostřednictvím PR, issues a návrhů. Poděkování patří také projektům jako [ejs](https://github.com/mde/ejs), z nichž Eta i nadále čerpá inspiraci.

V tuto chvíli považuji Etu z větší části za funkčně hotovou, i když budu dál opravovat chyby a přidávat drobné funkce. Současným uživatelům knihovny bych doporučil přejít na v3 a doufám, že pro nové uživatele bude Eta skvělou volbou pro jejich projekty.

## Odkazy

* [Eta na GitHubu](https://github.com/eta-dev/eta)
* [Eta na npm](https://www.npmjs.com/package/eta)
* [Web Eta a dokumentace](https://eta.js.org)