---
title: "Nix macOS Starter: deklarativní vývojové prostředí s Mise"
description: "Základní konfigurace Nixu pro macOS s využitím nix-darwin, home-manager a mise."
date: "2025-07-08"
tags: [open-source]
---

V sobotu jsem se rozhodl naučit Nix. Po několika hodinách práce z toho vznikla tato konfigurace. Díky mému kamarádovi [Ethanovi Niserovi](https://github.com/ethanniser), který mi ten nápad vnukl a z jehož konfigurace jsem na začátku vycházel.

Nastavit nový Mac na vývoj je otrava. Nainstalujete Homebrew, Node přes nvm, Python přes pyenv, nastavíte shell, po jednom doinstalujete GUI aplikace a pak jen doufáte, že si při přechodu na jiný stroj vzpomenete na všechno potřebné.

Nix dělá konfiguraci celého systému deklarativní a reprodukovatelnou, ale většina konfigurací na internetu je pro začátečníky buď příliš složitá, nebo předpokládá znalost Linuxu.

[nix-macos-starter](https://github.com/bgub/nix-macos-starter) je konfigurace Nixu přívětivá pro začátečníky, která zahrnuje vývojové nástroje (mise pro správu runtime, CLI nástroje, formátovače), GUI aplikace přes Homebrew a konfiguraci systému s rozumně nastavenými výchozími hodnotami.

Stačí nahradit pár zástupných hodnot, spustit jeden příkaz a máte plně připravené vývojové prostředí.

## Instalace

1. **Nainstalujte Nix** pomocí [instalátoru Determinate Systems](https://docs.determinate.systems/#products). Stáhněte si grafický instalátor pro macOS a po instalaci restartujte terminál.

2. **Nainstalujte Homebrew** z [brew.sh](https://brew.sh) pro instalaci GUI aplikací.

3. **Naklonujte repozitář a nakonfigurujte ho**:

   ```bash
   git clone https://github.com/bgub/nix-macos-starter ~/.config/nix
   cd ~/.config/nix
   ```

4. **Pro Macy s Intelem**: V souboru `flake.nix` na řádku 28 změňte `"aarch64-darwin"` na `"x86_64-darwin"`.

5. **Nahraďte zástupné hodnoty** v těchto souborech:

   * `modules/git.nix`: `YOUR_NAME`, `YOUR_EMAIL`, `YOUR_USERNAME`
   * `modules/home-manager.nix`: `YOUR_USERNAME`
   * `platforms/darwin.nix`: `YOUR_USERNAME` (vyskytuje se 3krát)
   * `hosts/my-macbook/configuration.nix`: `YOUR_USERNAME`

6. **Sestavte a aktivujte konfiguraci**:
   ```bash
   darwin-rebuild switch --flake .#my-macbook
   ```

Po úvodním nastavení používejte alias `nix-switch` pro opětovné sestavení konfigurace.

## Přizpůsobení

* **Přidání CLI nástrojů**: Upravte pole `packages` v `modules/home-manager.nix`
* **Přidání GUI aplikací**: Upravte pole `casks` v `modules/homebrew-common.nix`
* **Přidání vývojových nástrojů**: Přidejte `${pkgs.mise}/bin/mise use --global tool@version` do aktivačního skriptu v `modules/home-manager.nix`
* **Konfigurace pro konkrétní stroj**: Pro balíčky a nastavení specifické pro daný stroj použijte `hosts/my-macbook/configuration.nix`

***

**Repozitář**: [github.com/bgub/nix-macos-starter](https://github.com/bgub/nix-macos-starter)