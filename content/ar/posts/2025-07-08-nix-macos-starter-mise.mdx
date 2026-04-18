---
title: "دليل البدء بـ Nix على macOS: إعداد تطوير تصريحي باستخدام Mise"
description: "إعداد Nix مبدئي لنظام macOS باستخدام nix-darwin وhome-manager وmise."
date: "2025-07-08"
tags: [مفتوح-المصدر]
---

قررت أن أتعلم Nix يوم السبت. وبعد ساعات من العمل، خرجت بهذا الإعداد. تحية لصديقي [Ethan Niser](https://github.com/ethanniser) الذي ألهمني الفكرة، والذي انطلقت في البداية من إعداده.

إعداد جهاز Mac جديد للتطوير أمر مرهق. تثبّت Homebrew، وNode عبر nvm، وPython عبر pyenv، وتضبط الشِل، وتثبّت التطبيقات ذات الواجهة الرسومية واحدًا واحدًا، ثم تأمل أن تتذكر كل شيء عند الانتقال إلى جهاز آخر.

يجعل Nix إعداد نظامك بالكامل تصريحيًا وقابلًا لإعادة الإنتاج، لكن معظم الإعدادات الموجودة على الإنترنت معقدة أكثر من اللازم للمبتدئين أو تفترض معرفةً بـ Linux.

[nix-macos-starter](https://github.com/bgub/nix-macos-starter) هو إعداد Nix مناسب للمبتدئين يتضمن أدوات التطوير (mise لإدارة بيئات التشغيل، وأدوات CLI، وأدوات التنسيق)، وتطبيقات ذات واجهة رسومية عبر Homebrew، وإعدادًا للنظام بإعدادات افتراضية مناسبة.

استبدل بعض القيم النائبة، وشغّل أمرًا واحدًا، وستحصل على بيئة تطوير مُعدّة بالكامل.

## التثبيت

1. **ثبّت Nix** باستخدام [مثبّت Determinate Systems](https://docs.determinate.systems/#products). نزّل المثبّت الرسومي لنظام macOS، ثم أعد تشغيل الطرفية بعد اكتمال التثبيت.

2. **ثبّت Homebrew** من [brew.sh](https://brew.sh) للتطبيقات ذات الواجهة الرسومية.

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

6. **ابنِ وفعّل الإعدادات**:
   ```bash
   darwin-rebuild switch --flake .#my-macbook
   ```

بعد الإعداد الأولي، استخدم الاسم المستعار `nix-switch` لإعادة بناء إعداداتك.

## التخصيص

* **إضافة أدوات CLI**: عدّل مصفوفة `packages` في `modules/home-manager.nix`
* **إضافة تطبيقات بواجهة رسومية**: عدّل مصفوفة `casks` في `modules/homebrew-common.nix`
* **إضافة أدوات تطوير**: أضف `${pkgs.mise}/bin/mise use --global tool@version` إلى نص التفعيل البرمجي في `modules/home-manager.nix`
* **إعدادات خاصة بالجهاز**: استخدم `hosts/my-macbook/configuration.nix` للحزم والإعدادات الخاصة بكل جهاز

***

**المستودع**: [github.com/bgub/nix-macos-starter](https://github.com/bgub/nix-macos-starter)