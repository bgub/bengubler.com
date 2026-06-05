---
title: "Nix macOS Starter: Deklarativa evoluiga agordo kun Mise"
description: "Komenca Nix-agordo por macOS kun nix-darwin, home-manager kaj mise."
date: "2025-07-08"
tags: [malfermkoda]
---

Mi decidis lerni Nix sabate. Post horoj da laboro, mi elpensis ĉi tiun agordon. Dankon al mia amiko [Ethan Niser](https://github.com/ethanniser), kiu donis al mi la ideon kaj kies agordo servis kiel mia deirpunkto.

Agordi novan Mac por evoluigo estas ĝene. Vi instalas Homebrew, Node per nvm, Python per pyenv, agordas vian ŝelon, instalas GUI-aplikaĵojn aparte, kaj esperas, ke vi memoros ĉion kiam vi transiros al alia maŝino.

Nix faras la tutan sisteman agordon deklarativa kaj reproduktebla, sed plej multaj agordoj en la reto estas tro kompleksaj por komencantoj aŭ supozas konon de Linux.

[nix-macos-starter](https://github.com/bgub/nix-macos-starter) estas alirebla Nix-agordo por komencantoj, kiu inkluzivas evoluigajn ilojn (mise por administri rulmediojn, CLI-ilojn, formatilojn), GUI-aplikaĵojn per Homebrew, kaj sisteman agordon kun sencohavaj defaŭltoj.

Anstataŭigu kelkajn lokokupilojn, rulu unu komandon, kaj vi havos plene agorditan evoluigan medion.

## Instalado

1. **Instalu Nix** per la [instalilo de Determinate Systems](https://docs.determinate.systems/#products). Elŝutu la grafikan instalilon por macOS kaj rekomencu vian terminalon post la instalado.

2. **Instalu Homebrew** el [brew.sh](https://brew.sh) por GUI-aplikaĵoj.

3. **Klonu kaj agordu**:

   ```bash
   git clone https://github.com/bgub/nix-macos-starter ~/.config/nix
   cd ~/.config/nix
   ```

4. **Por Intel-Mac-oj**: Ŝanĝu `"aarch64-darwin"` al `"x86_64-darwin"` en `flake.nix` ĉe linio 28.

5. **Anstataŭigu la lokokupilojn** en ĉi tiuj dosieroj:

   * `modules/git.nix`: `YOUR_NAME`, `YOUR_EMAIL`, `YOUR_USERNAME`
   * `modules/home-manager.nix`: `YOUR_USERNAME`
   * `platforms/darwin.nix`: `YOUR_USERNAME` (aperas 3 fojojn)
   * `hosts/my-macbook/configuration.nix`: `YOUR_USERNAME`

6. **Konstruu kaj apliku**:
   ```bash
   darwin-rebuild switch --flake .#my-macbook
   ```

Post la komenca agordo, uzu la alinomon `nix-switch` por rekonstrui vian agordon.

## Personigo

* **Aldonu CLI-ilojn**: Redaktu la liston `packages` en `modules/home-manager.nix`
* **Aldonu GUI-aplikaĵojn**: Redaktu la liston `casks` en `modules/homebrew-common.nix`
* **Aldonu evoluigajn ilojn**: Aldonu `${pkgs.mise}/bin/mise use --global tool@version` al la aktiviga skripto en `modules/home-manager.nix`
* **Agordo specifa por la gastiganto**: Uzu `hosts/my-macbook/configuration.nix` por la pakaĵoj kaj agordoj specifaj al la maŝino

***

**Deponejo**: [github.com/bgub/nix-macos-starter](https://github.com/bgub/nix-macos-starter)