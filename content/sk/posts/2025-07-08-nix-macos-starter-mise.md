---
title: "Nix macOS Starter: Deklaratívne vývojové prostredie s Mise"
description: "Základná konfigurácia Nix pre macOS s použitím nix-darwin, home-manager a mise."
date: "2025-07-08"
tags: [open-source]
---

V sobotu som sa rozhodol, že sa naučím Nix. Po niekoľkých hodinách práce vznikla táto konfigurácia. Vďaka patrí môjmu kamarátovi [Ethan Niser](https://github.com/ethanniser), ktorý mi vnukol tento nápad a z ktorého konfigurácie som na začiatku vychádzal.

Nastaviť nový Mac na vývoj je otrava. Nainštalujete Homebrew, Node cez nvm, Python cez pyenv, nastavíte si shell, jednotlivo nainštalujete GUI aplikácie a dúfate, že si pri prechode na iný stroj na všetko spomeniete.

Nix robí konfiguráciu celého systému deklaratívnou a reprodukovateľnou, no väčšina konfigurácií na internete je pre začiatočníkov príliš zložitá alebo predpokladá znalosť Linuxu.

[nix-macos-starter](https://github.com/bgub/nix-macos-starter) je Nix konfigurácia vhodná pre začiatočníkov, ktorá zahŕňa vývojárske nástroje (mise na správu runtime verzií, CLI nástroje, formátovače), GUI aplikácie cez Homebrew a systémovú konfiguráciu s rozumnými predvolenými voľbami.

Stačí nahradiť niekoľko zástupných hodnôt, spustiť jeden príkaz a máte plne nakonfigurované vývojové prostredie.

## Inštalácia

1. **Nainštalujte Nix** pomocou [inštalátora od Determinate Systems](https://docs.determinate.systems/#products). Stiahnite si grafický inštalátor pre macOS a po inštalácii reštartujte terminál.

2. **Nainštalujte Homebrew** z [brew.sh](https://brew.sh) pre GUI aplikácie.

3. **Klonujte repozitár a nakonfigurujte ho**:

   ```bash
   git clone https://github.com/bgub/nix-macos-starter ~/.config/nix
   cd ~/.config/nix
   ```

4. **Pre Macy s procesorom Intel**: Zmeňte `"aarch64-darwin"` na `"x86_64-darwin"` v súbore `flake.nix` na riadku 28.

5. **Nahraďte zástupné hodnoty** v týchto súboroch:

   * `modules/git.nix`: `YOUR_NAME`, `YOUR_EMAIL`, `YOUR_USERNAME`
   * `modules/home-manager.nix`: `YOUR_USERNAME`
   * `platforms/darwin.nix`: `YOUR_USERNAME` (vyskytuje sa 3-krát)
   * `hosts/my-macbook/configuration.nix`: `YOUR_USERNAME`

6. **Zostavte a prepnite**:
   ```bash
   darwin-rebuild switch --flake .#my-macbook
   ```

Po úvodnom nastavení použite alias `nix-switch` na opätovné zostavenie svojej konfigurácie.

## Prispôsobenie

* **Pridanie CLI nástrojov**: Upravte pole `packages` v `modules/home-manager.nix`
* **Pridanie GUI aplikácií**: Upravte pole `casks` v `modules/homebrew-common.nix`
* **Pridanie vývojových nástrojov**: Pridajte `${pkgs.mise}/bin/mise use --global tool@version` do aktivačného skriptu v `modules/home-manager.nix`
* **Konfigurácia pre konkrétny stroj**: Použite `hosts/my-macbook/configuration.nix` pre balíky a nastavenia špecifické pre daný stroj

***

**Repozitár**: [github.com/bgub/nix-macos-starter](https://github.com/bgub/nix-macos-starter)