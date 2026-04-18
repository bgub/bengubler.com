---
title: "Nix macOS Starter: Deklarativní vývojové prostředí s Mise"
description: "Výchozí konfigurace Nixu pro macOS s využitím nix-darwin, home-manager a mise."
date: "2025-07-08"
tags: [open-source]
---

V sobotu jsem se rozhodl naučit Nix. Po několika hodinách práce z toho vznikla tato konfigurace. Díky kamarádovi [Ethan Niser](https://github.com/ethanniser), který mi ten nápad vnukl a z jehož konfigurace jsem původně vycházel.

Nastavit nový Mac na vývoj je otrava. Nainstalujete Homebrew, Node přes nvm, Python přes pyenv, nastavíte shell, po jednom nainstalujete GUI aplikace a doufáte, že si při přechodu na jiný stroj na všechno vzpomenete.

Nix dělá konfiguraci celého systému deklarativní a reprodukovatelnou, ale většina konfigurací na internetu je pro začátečníky buď moc složitá, nebo předpokládá znalost Linuxu.

[nix-macos-starter](https://github.com/bgub/nix-macos-starter) je konfigurace Nixu přívětivá pro začátečníky, která zahrnuje vývojové nástroje (mise pro správu runtime prostředí, CLI nástroje a formátovače), GUI aplikace přes Homebrew a konfiguraci systému s rozumným výchozím nastavením.

Stačí nahradit pár zástupných hodnot, spustit jeden příkaz a máte plně nakonfigurované vývojové prostředí.

## Instalace

1. **Nainstalujte Nix** pomocí [instalátoru Determinate Systems](https://docs.determinate.systems/#products). Stáhněte si grafický instalátor pro macOS a po instalaci terminál restartujte.

2. **Nainstalujte Homebrew** z [brew.sh](https://brew.sh) pro GUI aplikace.

3. **Naklonujte repozitář a nakonfigurujte ho**:

   ```bash
   git clone https://github.com/bgub/nix-macos-starter ~/.config/nix
   cd ~/.config/nix
   ```

4. **Pro Macy s Intelem**: Změňte `"aarch64-darwin"` na `"x86_64-darwin"` v souboru `flake.nix` na řádku 28.

5. **Nahraďte zástupné hodnoty** v těchto souborech:

   * `modules/git.nix`: `YOUR_NAME`, `YOUR_EMAIL`, `YOUR_USERNAME`
   * `modules/home-manager.nix`: `YOUR_USERNAME`
   * `platforms/darwin.nix`: `YOUR_USERNAME` (objevuje se 3krát)
   * `hosts/my-macbook/configuration.nix`: `YOUR_USERNAME`

6. **Sestavte a přepněte**:
   ```bash
   darwin-rebuild switch --flake .#my-macbook
   ```

Po úvodním nastavení používejte alias `nix-switch` pro opětovné sestavení konfigurace.

## Přizpůsobení

* **Přidání CLI nástrojů**: Upravte pole `packages` v souboru `modules/home-manager.nix`
* **Přidání GUI aplikací**: Upravte pole `casks` v souboru `modules/homebrew-common.nix`
* **Přidání vývojových nástrojů**: Přidejte `${pkgs.mise}/bin/mise use --global tool@version` do aktivačního skriptu v souboru `modules/home-manager.nix`
* **Konfigurace pro konkrétní stroj**: Pro balíčky a nastavení specifické pro daný stroj použijte `hosts/my-macbook/configuration.nix`

***

**Repozitář**: [github.com/bgub/nix-macos-starter](https://github.com/bgub/nix-macos-starter)