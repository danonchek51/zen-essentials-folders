# Contributing to Essentials Folders

Thanks for wanting to help. The mod is [Essentials Folders](https://github.com/danonchek51/zen-essentials-folders):
folder tiles for the Essentials (pinboard) grid in [Zen Browser](https://zen-browser.app).

> Русская версия: [CONTRIBUTING.ru.md](CONTRIBUTING.ru.md)

## What belongs here

- **Bug reports** — the most valuable contribution. Especially useful: Zen version, mod
  version, what you expected, what you actually got, steps to reproduce.
- **Ideas and suggestions** — via [Issues](https://github.com/danonchek51/zen-essentials-folders/issues).
  Describe the use case: what you wanted to do and why the current interface gets in the way.
- **Translations** — this file is the English version; the Russian one lives in
  [CONTRIBUTING.ru.md](CONTRIBUTING.ru.md), and other languages are welcome.
- **Code changes** — see below.

## Rules the mod must follow

This is not ceremony: if the mod starts moving tabs instead of only drawing tiles,
users will lose their bookmarks. Therefore:

1. **The mod never moves or deletes anything.** Tabs stay ordinary Zen tabs.
2. **The mod only draws.** Its own tiles in the Essentials grid, order via CSS `order`.
3. **Settings live in Zen prefs**, not in files on disk: `zen.essentialsfolders.*`.
4. **Public code without debug output.** Only `console.warn` is allowed in emergency
   `catch` blocks; there should be no plain `console.log` in the mod.
5. **The mod must not break other mods.** Compatibility with the **Zen Tab Groups** mod
   (oom333) is explicit — do not break it.

## Run the mod locally

The repository *is* the mod source; there is no build step.

| File | What it is |
|---|---|
| `essentials-folders.uc.js` | all of the mod logic (userscript, Zen XUL context) |
| `chrome.css` | tile, panel and indicator styling |
| `theme.json` | manifest: name, version, files, tags |
| `preferences.json` | default mod settings (Zen pref values) |
| `install.py` | installs the mod into a Zen profile |
| `images/` | screenshots for the README and the store card |
| `PUBLISH.md` | how to cut a release |

### Installing into a Zen profile

```powershell
python install.py
```

The script finds the Zen profile on its own, copies the files into
`<profile>\chrome\sine-mods\zen-essentials-folders\` and updates `mods.json`.

> **Close Zen before editing `mods.json` or `prefs.js`.** Zen rewrites those files on
> exit and can overwrite your changes.

After the edits, restart Zen: the mod is loaded at startup.

## Check before you send

```powershell
node --check essentials-folders.uc.js          # syntax
python install.py                               # install into the profile
```

Also worth checking:

- that the folder panel does not overlap neighbouring open folders;
- that dragging a tab into a folder and back onto the separator works;
- that the folder holding the current tab is marked by the indicator;
- that the settings dialog applies values immediately.

If you change CSS or JS — after checking, always **restart Zen**:
changes are not picked up on the fly.

## How to send a change

1. Fork the repository and branch from `main`.
2. Make your changes, describe them in the commit with one clear sentence.
3. Open a Pull Request against `main`.
4. In the description state: what changed, why, and how you verified it.

The PR template has ready-made fields — fill them in, it speeds up the review.

## Code style

- JavaScript — as in the existing `essentials-folders.uc.js`: `const`/`let`, arrow
  functions, no `var`, no modules and no build.
- CSS — `--zef-*` variables at the top of `chrome.css`, so the mod settings can
  override them.
- Comments — in English, the project's main language.
- Do not add dependencies: the mod works on plain Zen without npm and without a build.

## Questions

Via [Issues](https://github.com/danonchek51/zen-essentials-folders/issues) or
[Discussions](https://github.com/danonchek51/zen-essentials-folders/discussions).

License — [MIT](LICENSE). By taking part in the project you agree to the
[code of conduct](CODE_OF_CONDUCT.md).
