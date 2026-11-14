# Mod Submission Request

Ready-made text for submissions. Nothing needs to be improvised on the spot — just copy
it into the form field.

## 1. Sine Store — mod marketplace (primary)

Address: <https://github.com/sineorg/store/issues/new?template=add-theme.yml>

- **Title:** `[add-theme]: Essentials Folders`
- **Theme Homepage:** `https://github.com/danonchek51/zen-essentials-folders`

There is nothing else to fill in — the template has a single field.

A submission has already been filed: <https://github.com/sineorg/store/issues/1411>.
The mod card pulls `theme.json` from the repository, so the description and the tags
update on their own; if a moderator asks, the answer is ready (below).

If the moderators ask for clarification, here is the ready-made text:

> **Essentials Folders** — folder tiles for the Essentials (pinboard) grid in Zen Browser.
>
> What it does:
> - nested folders of any depth, drag & drop of tabs and tiles with the mouse: the target
>   under the cursor is highlighted, and the tile lands in the folder you aimed at;
> - folder search, pinning a folder to the top, a "+" button to create a new folder;
> - its own settings dialog: 22 options in five groups (language, tile appearance, icon
>   grid, indicators, behaviour) — applied instantly;
> - active folder indicator: the folder holding the current tab is highlighted
>   and softly pulses (frame glow, dot, corner or a small star);
> - moves exactly one tab, not an entire site.
>
> The mod never moves or deletes anything: tabs stay ordinary Zen tabs.
> Open source, MIT.
>
> **Install:** from the Sine marketplace (Settings → Sine Mods → Marketplace)
> or via "Install from repo" with the link
> `https://github.com/danonchek51/zen-essentials-folders`.
>
> **Short listing description:**
> Folder tiles for Zen Essentials - nesting, drag & drop, search, 22 settings.
>
> **English README:** https://github.com/danonchek51/zen-essentials-folders/blob/main/README.md
> **Russian README:** https://github.com/danonchek51/zen-essentials-folders/blob/main/README.ru.md

## 2. Official Zen registry — not submitted

<https://zen-browser.app/mods/> is filled in automatically: the bot from
`zen-browser/theme-store` collects `theme.json` from the form fields, and it only
contains `style` (CSS), `readme`, `image` and `preferences`. There is no `scripts`
field there, and the Zen installer downloads only `chrome.css`, `readme.md` and
`preferences.json`.

Our mod does not work without a script: the tiles are drawn by JavaScript. So we do
not submit to this registry — the right platform for mods with scripts is the
Sine Store (section 1).

If the registry format is extended and `scripts` appears in `theme.json`, the submission
is made with the `create-theme` template
(<https://github.com/zen-browser/theme-store/issues/new>):

- **Name:** `Essentials Folders` (18 characters, limit 25) ✔
- **Description:** `Zen Browser mod: folder tiles for Essentials - nesting, drag & drop, search, 22 settings.` (89 characters, limit 100) ✔
- **Homepage:** `https://github.com/danonchek51/zen-essentials-folders`
- **Image:** PNG 600×400 over HTTPS — `images/store-card.png` in the repository
  (the Essentials panel with folder tiles, drawn by the mod itself)
- **Theme Styles:** the contents of `chrome.css` (without the `@-moz-document url-prefix('chrome://')` wrapper)
- **Readme:** the contents of `README.md`
- **Preferences:** the contents of `preferences.json`

The 600×400 image is `images/store-card.png`: the panel is drawn by the mod itself
(real `chrome.css` and script), with neutral folder names — no personal names of
folders or bookmarks appear in the public files.

## 3. Other platforms — texts are ready

Accounts and publishing are yours, so the texts below are simply kept ready to use.

### Reddit (r/zen_browser)

> **Essentials Folders** — a mod that turns Essentials into folder tiles.
>
> What it does: instead of a scatter of icons in the Essentials grid — coloured tiles
> with an icon, a name and a tab counter. Folders nest inside each other to any
> depth, everything is rearranged by dragging, and there is search plus a settings
> dialog of its own (22 options, applied instantly). On top of that, an active folder
> indicator: the folder that holds the current tab softly pulses.
>
> The main thing: the mod never moves or deletes anything — tabs stay ordinary Zen
> tabs, and the folders are stored in the browser's preferences.
>
> https://github.com/danonchek51/zen-essentials-folders

### Mod lists / Awesome

One line for the list:

```markdown
- [Essentials Folders](https://github.com/danonchek51/zen-essentials-folders) — folder tiles for Essentials in Zen Browser: nesting, drag & drop, search, settings. MIT.
```

### GitHub profile

The repository is worth pinning in the `danonchek51` profile — up to six slots.
The profile description should mention Zen Browser and mods for it: this links the
profile to the repository and to name-based search.

## 4. What to check after publishing

- [ ] The mod appears in the Sine marketplace and installs with the `Install` button.
- [ ] The new description and tags are visible on the card.
- [ ] `Theme Homepage` leads to the repository, not to a 404.
- [ ] The Releases tab on GitHub opens an archive that contains all 4 mod files.
- [ ] The images open in the README on GitHub (all 9 in the `images/` folder,
      plus `store-card.png` — the 600×400 card image).

## 5. Release 1.15.4 — what changed for the submission

The card description is pulled from `theme.json`, so it updates on its own: the version is
`1.15.4` and the description already says "22 settings". Nothing has to be retyped there.

The mod manager of Zen now shows all 22 options of the mod (every option has its own
preference), and the mod shows its own version in the settings window.

Two things are worth doing by hand after the user restarts Zen:

- **A fresh 600×400 screenshot** of the live panel (the card image and the registry entry).
  The layout did not change in 1.14.3, so the current images still look right, but a fresh
  shot proves the fixed version runs.
- **A note in the Sine issue** that dragging a tab into a folder now works in Zen itself and
  that the drop target is highlighted. If a moderator asks what changed, the ready-made text in
  section 1 already covers it.

### What 1.14.3 fixed (for the issue comment)

> **Drag & drop of tabs into folders.** A tab dropped into a folder is moved for real now:
> the folder opens to show the tile, a tab dragged from the sidebar becomes essential (the
> browser does it, the mod only adds the rule), and the rule of a folder follows the tab when
> it changes its address. Earlier versions could leave the folder looking empty — the tile was
> hidden under a closed lid.
