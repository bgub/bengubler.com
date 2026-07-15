---
title: "بداية استخدام Nix على macOS: إعداد تطوير تصريحي باستخدام Mise"
description: "إعداد Nix مبدئي لنظام macOS باستخدام nix-darwin وhome-manager وmise."
date: "2025-07-08"
tags: [open-source]
---

قررت أن أتعلم Nix يوم السبت. وبعد ساعات من العمل، خرجت بهذا الإعداد. وشكرًا لصديقي [Ethan Niser](https://github.com/ethanniser) الذي أعطاني الفكرة، والذي بدأت من إعداده أساسًا.

إعداد جهاز Mac جديد للتطوير أمر متعب. تثبّت Homebrew، وNode عبر nvm، وPython عبر pyenv، وتضبط الـ shell، وتثبّت تطبيقات ذات واجهة رسومية واحدًا واحدًا، ثم تأمل ألا تنسى شيئًا عند الانتقال إلى جهاز آخر.

يجعل Nix إعداد نظامك بالكامل تصريحيًا وقابلاً للتكرار، لكن معظم الإعدادات الموجودة على الإنترنت معقدة أكثر من اللازم للمبتدئين أو تفترض معرفةً بـ Linux.

[nix-macos-starter](https://github.com/bgub/nix-macos-starter) هو إعداد Nix مناسب للمبتدئين يتضمن أدوات التطوير (mise لإدارة بيئات التشغيل، وأدوات واجهة سطر أوامر، ومنسقات الشيفرة)، وتطبيقات ذات واجهة رسومية عبر Homebrew، وإعدادًا للنظام مع قيم افتراضية عملية.

استبدل بضع قيم نائبة، وشغّل أمرًا واحدًا، وستحصل على بيئة تطوير مُعدّة بالكامل.

## التثبيت

1. **ثبّت Nix** باستخدام [مثبّت Determinate Systems](https://docs.determinate.systems/#products). نزّل المثبّت الرسومي لنظام macOS ثم أعد تشغيل الطرفية بعد التثبيت.

2. **ثبّت Homebrew** من [brew.sh](https://brew.sh) لتثبيت التطبيقات ذات الواجهة الرسومية.

3. **استنسخ المستودع واضبط الإعدادات**:

   ```bash
   git clone https://github.com/bgub/nix-macos-starter ~/.config/nix
   cd ~/.config/nix
   ```

4. **لأجهزة Mac المزودة بمعالجات Intel**: غيّر `"aarch64-darwin"` إلى `"x86_64-darwin"` في السطر 28 من `flake.nix`.

5. **استبدل القيم النائبة** في هذه الملفات:

   * `modules/git.nix`: `YOUR_NAME`, `YOUR_EMAIL`, `YOUR_USERNAME`
   * `modules/home-manager.nix`: `YOUR_USERNAME`
   * `platforms/darwin.nix`: `YOUR_USERNAME` (يتكرر 3 مرات)
   * `hosts/my-macbook/configuration.nix`: `YOUR_USERNAME`

6. **ابنِ وفعّل**:
   ```bash
   darwin-rebuild switch --flake .#my-macbook
   ```

بعد الإعداد الأولي، استخدم الاسم المستعار `nix-switch` لإعادة بناء إعداداتك.

## التخصيص

* **إضافة أدوات واجهة سطر أوامر**: حرّر مصفوفة `packages` في `modules/home-manager.nix`
* **إضافة تطبيقات ذات واجهة رسومية**: حرّر مصفوفة `casks` في `modules/homebrew-common.nix`
* **إضافة أدوات التطوير**: أضف `${pkgs.mise}/bin/mise use --global tool@version` إلى سكربت التفعيل في `modules/home-manager.nix`
* **إعدادات خاصة بالجهاز**: استخدم `hosts/my-macbook/configuration.nix` للحزم والإعدادات الخاصة بالجهاز

***

**المستودع**: [github.com/bgub/nix-macos-starter](https://github.com/bgub/nix-macos-starter)