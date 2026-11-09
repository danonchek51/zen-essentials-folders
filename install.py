"""Автоустановка мода Essentials Folders в профиль Zen (Windows).

    python install.py

Скрипт:
  1. находит профиль Zen (тот, где есть chrome/sine-mods);
  2. копирует файлы мода в chrome/sine-mods/zen-essentials-folders;
  3. добавляет/обновляет запись в chrome/sine-mods/mods.json.

Перед запуском закройте Zen: он перезаписывает mods.json при выходе.
"""
import io
import json
import os
import shutil
import sys

MOD_ID = "zen-essentials-folders"
FILES = ("theme.json", "preferences.json", "chrome.css", "essentials-folders.uc.js")
HERE = os.path.dirname(os.path.abspath(__file__))


def find_zen_profiles():
    """Возвращает список профилей Zen (папок с chrome/sine-mods)."""
    roots = [
        os.path.join(os.environ.get("APPDATA", ""), "zen", "Profiles"),
        os.path.join(os.environ.get("APPDATA", ""), "zen"),
    ]
    found = []
    for root in roots:
        if not os.path.isdir(root):
            continue
        for name in sorted(os.listdir(root)):
            path = os.path.join(root, name)
            if os.path.isdir(os.path.join(path, "chrome", "sine-mods")):
                found.append(path)
    return found


def main():
    profiles = find_zen_profiles()
    if not profiles:
        print("Профили Zen не найдены.")
        print("Скопируйте папку мода вручную в <профиль>\\chrome\\sine-mods\\%s" % MOD_ID)
        return 1
    if len(profiles) > 1:
        print("Найдено профилей Zen:")
        for i, p in enumerate(profiles, 1):
            print("  %d) %s" % (i, p))
        try:
            choice = int(input("Номер профиля [1]: ").strip() or "1")
        except ValueError:
            choice = 1
        profile = profiles[choice - 1]
    else:
        profile = profiles[0]
        print("Профиль: %s" % profile)

    mods_dir = os.path.join(profile, "chrome", "sine-mods")
    dst = os.path.join(mods_dir, MOD_ID)
    os.makedirs(dst, exist_ok=True)

    for name in FILES:
        src = os.path.join(HERE, name)
        if not os.path.exists(src):
            print("НЕТ ФАЙЛА: %s" % name)
            return 1
        shutil.copyfile(src, os.path.join(dst, name))
        print("скопирован %s" % name)

    mods_path = os.path.join(mods_dir, "mods.json")
    if os.path.exists(mods_path):
        with io.open(mods_path, encoding="utf-8") as f:
            mods = json.load(f)
    else:
        mods = {}
    mods[MOD_ID] = {
        "id": MOD_ID,
        "name": "Essentials Folders",
        "description": "Folder tiles for Zen Essentials: nesting, drag & drop, search and settings.",
        "author": "danonchek51",
        "version": "1.10.0",
        "homepage": "https://github.com/danonchek51/zen-essentials-folders",
        "readme": "https://github.com/danonchek51/zen-essentials-folders/blob/main/README.md",
        "style": {"chrome": "chrome.css", "content": ""},
        "scripts": {
            "essentials-folders.uc.js": {"include": ["chrome://browser/content/browser.xhtml"]}
        },
        "preferences": "preferences.json",
        "tags": ["sine", "JavaScript", "danonchek51", "tabs", "sidebar", "essentials"],
        "fork": ["zen"],
        "enabled": True,
    }
    with io.open(mods_path, "w", encoding="utf-8", newline="") as f:
        f.write(json.dumps(mods, ensure_ascii=False, separators=(",", ":")))
    print("mods.json обновлён")
    print("Готово. Запустите Zen.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
