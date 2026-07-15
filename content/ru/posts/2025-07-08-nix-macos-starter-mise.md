---
title: "Nix macOS Starter: Декларативная среда разработки с Mise"
description: "Стартовая конфигурация Nix для macOS с использованием nix-darwin, home-manager и mise."
date: "2025-07-08"
tags: [open-source]
---

В субботу я решил освоить Nix. После нескольких часов работы у меня получилась эта конфигурация. Отдельное спасибо моему другу [Ethan Niser](https://github.com/ethanniser), который подкинул мне эту идею и чью конфигурацию я взял за основу.

Настраивать новый Mac для разработки — та ещё головная боль. Устанавливаешь Homebrew, Node через nvm, Python через pyenv, настраиваешь оболочку, по отдельности ставишь GUI-приложения и надеешься, что ничего не забудешь, когда будешь переходить на другую машину.

Nix делает конфигурацию всей системы декларативной и воспроизводимой, но большинство конфигураций в интернете слишком сложны для новичков или рассчитаны на знание Linux.

[nix-macos-starter](https://github.com/bgub/nix-macos-starter) — это удобная для новичков конфигурация Nix, которая включает инструменты для разработки (mise для управления средами выполнения, CLI-инструменты, форматтеры), GUI-приложения через Homebrew и конфигурацию системы с разумными настройками по умолчанию.

Замените несколько заполнителей, выполните одну команду — и у вас будет полностью настроенная среда разработки.

## Установка

1. **Установите Nix** с помощью [установщика Determinate Systems](https://docs.determinate.systems/#products). Скачайте графический установщик для macOS и после установки перезапустите терминал.

2. **Установите Homebrew** с [brew.sh](https://brew.sh) для GUI-приложений.

3. **Клонируйте и настройте**:

   ```bash
   git clone https://github.com/bgub/nix-macos-starter ~/.config/nix
   cd ~/.config/nix
   ```

4. **Для Mac с Intel**: замените `"aarch64-darwin"` на `"x86_64-darwin"` в строке 28 файла `flake.nix`.

5. **Замените заполнители** в этих файлах:

   * `modules/git.nix`: `YOUR_NAME`, `YOUR_EMAIL`, `YOUR_USERNAME`
   * `modules/home-manager.nix`: `YOUR_USERNAME`
   * `platforms/darwin.nix`: `YOUR_USERNAME` (встречается 3 раза)
   * `hosts/my-macbook/configuration.nix`: `YOUR_USERNAME`

6. **Соберите и примените конфигурацию**:
   ```bash
   darwin-rebuild switch --flake .#my-macbook
   ```

После первоначальной настройки используйте псевдоним `nix-switch`, чтобы пересобирать конфигурацию.

## Настройка

* **Добавьте CLI-инструменты**: отредактируйте массив `packages` в `modules/home-manager.nix`
* **Добавьте GUI-приложения**: отредактируйте массив `casks` в `modules/homebrew-common.nix`
* **Добавьте инструменты для разработки**: добавьте `${pkgs.mise}/bin/mise use --global tool@version` в скрипт активации в `modules/home-manager.nix`
* **Конфигурация для конкретного хоста**: используйте `hosts/my-macbook/configuration.nix` для пакетов и настроек, специфичных для этой машины

***

**Репозиторий**: [github.com/bgub/nix-macos-starter](https://github.com/bgub/nix-macos-starter)