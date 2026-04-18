---
title: "Nix macOS Starter: декларативная настройка среды разработки с Mise"
description: "Стартовая конфигурация Nix для macOS с использованием nix-darwin, home-manager и mise."
date: "2025-07-08"
tags: [open-source]
---

В субботу я решил разобраться с Nix. После нескольких часов работы у меня получилась вот эта конфигурация. Отдельное спасибо моему другу [Ethan Niser](https://github.com/ethanniser): именно он подал мне идею, и за основу я взял его конфиг.

Настройка нового Mac для разработки — то ещё мучение. Нужно установить Homebrew, Node через nvm, Python через pyenv, настроить оболочку, по отдельности поставить GUI-приложения и надеяться, что при переходе на другую машину ничего не забудешь.

Nix делает всю конфигурацию системы декларативной и воспроизводимой, но большинство конфигов в интернете либо слишком сложные для новичков, либо рассчитаны на знание Linux.

[nix-macos-starter](https://github.com/bgub/nix-macos-starter) — это Nix-конфигурация, удобная для новичков: в неё входят инструменты для разработки (mise для управления средами выполнения, CLI-инструменты, форматтеры), GUI-приложения через Homebrew и системная конфигурация с разумными настройками по умолчанию.

Замените несколько заполнителей, выполните одну команду — и у вас будет полностью настроенная среда разработки.

## Установка

1. **Установите Nix** с помощью [установщика Determinate Systems](https://docs.determinate.systems/#products). Скачайте графический установщик для macOS и после установки перезапустите терминал.

2. **Установите Homebrew** с сайта [brew.sh](https://brew.sh) для GUI-приложений.

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

После первоначальной настройки используйте алиас `nix-switch`, чтобы пересобирать конфигурацию.

## Настройка

* **Добавить CLI-инструменты**: Измените массив `packages` в `modules/home-manager.nix`
* **Добавить GUI-приложения**: Измените массив `casks` в `modules/homebrew-common.nix`
* **Добавить инструменты разработки**: Добавьте `${pkgs.mise}/bin/mise use --global tool@version` в скрипт активации в `modules/home-manager.nix`
* **Конфигурация для конкретного хоста**: Используйте `hosts/my-macbook/configuration.nix` для пакетов и настроек, специфичных для конкретной машины

***

**Репозиторий**: [github.com/bgub/nix-macos-starter](https://github.com/bgub/nix-macos-starter)