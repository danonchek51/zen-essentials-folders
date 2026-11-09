# Contributing to Essentials Folders

Thanks for helping out. **Essentials Folders** is a Zen Browser mod that turns the
Essentials (pinboard) grid into folder tiles: nested folders, drag & drop, search and
21 settings.

The full guide is in Russian: [CONTRIBUTING.md](CONTRIBUTING.md).

## The rules the mod must follow

These are not ceremony — if the mod starts moving tabs instead of only drawing tiles,
users lose bookmarks. So:

1. **The mod never moves or deletes anything.** Tabs stay ordinary Zen tabs.
2. **The mod only draws.** Its own tiles in the Essentials grid, order via CSS `order`.
3. **Settings live in Zen prefs** (`zen.essentialsfolders.*`), never in files on disk.
4. **No debug output in public code.** Only `console.warn` inside emergency `catch`
   blocks; there should be no plain `console.log` in the mod.
5. **Do not break other mods.** Compatibility with **Zen Tab Groups** (oom333) is
   explicit — keep it working.

## Run it locally

The repository *is* the mod — there is no build step.

| File | What it is |
|---|---|
| `essentials-folders.uc.js` | all of the mod logic (userscript, Zen XUL context) |
| `chrome.css` | tile, panel and indicator styling |
| `theme.json` | manifest: name, version, files, tags |
| `preferences.json` | default mod settings (Zen pref values) |
| `install.py` | installs the mod into a Zen profile |
| `images/` | screenshots for the README and the store card |
| `PUBLISH.md` | how to cut a release |

Install into your Zen profile:

```powershell
python install.py
```

> **Close Zen before editing `mods.json` or `prefs.js`.** Zen rewrites those files on
> exit and can overwrite your changes.

After editing CSS or JS, **restart Zen** — changes are not picked up live.

## Check before you send

```powershell
node --check essentials-folders.uc.js
python install.py
```

Also worth checking by hand: that folder panels no longer overlap neighbouring open
folders, that dragging a tab into a folder and back onto the separator works, that the
folder holding the current tab is marked by the indicator, and that settings apply
immediately in the mod's own dialog.

## Send a change

1. Fork the repo, branch from `main`.
2. Make the change, commit with one clear sentence.
3. Open a Pull Request against `main`.
4. Describe what changed, why, and how you verified it.

## Code style

- JavaScript as in the existing `essentials-folders.uc.js`: `const`/`let`, arrow
  functions, no `var`, no modules, no bundler.
- CSS: `--zef-*` custom properties at the top of `chrome.css` so mod settings can
  override them.
- Comments in Russian, like the rest of the code.
- No new dependencies — the mod must run on plain Zen with no npm and no build.

## Questions

Open an [issue](https://github.com/danonchek51/zen-essentials-folders/issues) or start a
[discussion](https://github.com/danonchek51/zen-essentials-folders/discussions).

License: [MIT](LICENSE). By taking part you agree to the
[code of conduct](CODE_OF_CONDUCT.md).
