---
title: "Nix macOS Starter: Deklarativa evoluiga agordo kun Mise"
description: "Komenca Nix-agordo por macOS kun nix-darwin, home-manager kaj mise."
date: "2025-07-08"
tags: [open-source]
---

Mi decidis lerni Nix sabate. Post horoj da laboro, mi elpensis ĉi tiun agordon. Dankon al mia amiko [Ethan Niser](https://github.com/ethanniser), kiu donis al mi la ideon kaj kies agordon mi uzis kiel deirpunkton.

Agordi novan Mac por programado estas ĝena. Vi instalas Homebrew, Node per nvm, Python per pyenv, agordas vian ŝelon, instalas GUI-aplikaĵojn unu post la alia, kaj esperas, ke vi memoros ĉion, kiam vi transiros al alia maŝino.

Nix faras la agordon de via tuta sistemo deklarativa kaj reproduktebla, sed la plej multaj agordoj troveblaj rete estas tro komplikaj por komencantoj aŭ supozas konon de Linux.

[nix-macos-starter](https://github.com/bgub/nix-macos-starter) estas por-komencanta Nix-agordo, kiu inkluzivas evoluigajn ilojn (mise por administri runtime-ojn, CLI-ilojn, formatilojn), GUI-aplikaĵojn per Homebrew, kaj sisteman agordon kun trafaj defaŭltoj.

Anstataŭigu kelkajn ŝablonajn valorojn, rulu unu komandon, kaj vi havos plene agorditan evoluigan medion.

## Instalado

1. **Instalu Nix** per la [instalilo de Determinate Systems](https://docs.determinate.systems/#products). Elŝutu la grafikan instalilon por macOS kaj restartigu vian terminalon post la instalado.

2. **Instalu Homebrew** de [brew.sh](https://brew.sh) por GUI-aplikaĵoj.

3. **Klonu kaj agordu**:

   ```bash
   git clone https://github.com/bgub/nix-macos-starter ~/.config/nix
   cd ~/.config/nix
   ```

4. **Por Intel-Mac-oj**: Ŝanĝu `"aarch64-darwin"` al `"x86_64-darwin"` en `flake.nix` ĉe linio 28.

5. **Anstataŭigu la ŝablonajn valorojn** en ĉi tiuj dosieroj:

   * `modules/git.nix`: `YOUR_NAME`, `YOUR_EMAIL`, `YOUR_USERNAME`
   * `modules/home-manager.nix`: `YOUR_USERNAME`
   * `platforms/darwin.nix`: `YOUR_USERNAME` (aperas 3 fojojn)
   * `hosts/my-macbook/configuration.nix`: `YOUR_USERNAME`

6. **Konstrui kaj aktivigi**:
   ```bash
   darwin-rebuild switch --flake .#my-macbook
   ```

Post la komenca agordo, uzu la kaŝnomon `nix-switch` por rekonstrui vian agordon.

## Personigo

* **Aldonu CLI-ilojn**: Redaktu la tabelon `packages` en `modules/home-manager.nix`
* **Aldonu GUI-apojn**: Redaktu la tabelon `casks` en `modules/homebrew-common.nix`
* **Aldonu evoluigajn ilojn**: Aldonu `${pkgs.mise}/bin/mise use --global tool@version` al la aktiviga skripto en `modules/home-manager.nix`
* **Maŝin-specifa agordo**: Uzu `hosts/my-macbook/configuration.nix` por maŝin-specifaj pakaĵoj kaj agordoj

***

**Repozitorio**: [github.com/bgub/nix-macos-starter](https://github.com/bgub/nix-macos-starter)