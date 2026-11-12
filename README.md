# Essentials Folders — folder tiles for the Zen Browser Essentials grid

[![Version 1.15.0](https://img.shields.io/badge/version-1.15.0-informational)](https://github.com/danonchek51/zen-essentials-folders/releases)
[![MIT license](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Zen Browser 1.24b](https://img.shields.io/badge/zen%20browser-1.24b-orange)](https://zen-browser.app)
[![Sine Store](https://img.shields.io/badge/sine-store-purple)](https://github.com/sineorg/store)

> Русская версия: [README.ru.md](README.ru.md)

**Essentials Folders** is a mod for [Zen Browser](https://zen-browser.app) that turns the
Essentials grid (the pinboard) into **folder tiles**. Folders nest inside each other to any
depth, tabs and folders are rearranged by drag & drop, there is a search box for folders, and the
mod ships its own settings dialog with 22 options. Tabs stay ordinary Zen tabs — the mod never
moves or deletes anything.

| What is inside | Value |
|---|---|
| Configurable options | 22, in five groups |
| Active-folder indicator styles | 4, plus off |
| Folder nesting depth | unlimited |
| Membership rules | one rule per page (domain + path) |
| Compatibility | Zen Tab Groups (oom333) |
| License | [MIT](LICENSE) |

*A Zen Browser mod that turns the Essentials (pinboard) grid into folder tiles — nested
folders, drag & drop, search, and 22 settings. Tabs stay ordinary Zen tabs.*

An open folder **spills out into a wide plane of its own colour**, and its tiles sit inside that
plane. There is no separate "header" and no duplicated tile any more: a folder is shown exactly
once. Several folders can be open at the same time — the newest one (the one you opened last)
sits above the others.

Folders can be **nested inside each other** (to any depth), **reordered** and **rearranged
within** — all with ordinary mouse drag & drop.

![The Essentials panel of Zen Browser with folder tiles](images/panel.png)

**Language:** English · [Russian](README.ru.md)

## What it does

- **Folder tiles** in the Essentials grid: icon, name, colour, tab counter.
- **An open folder is a colour plane.** Click a tile: the tile leaves the top row and unfolds
  into a wide colour plane with its tiles inside. No duplication: the row keeps only collapsed
  folders.
- **The newest folder goes on top.** The folder you opened last sits above the other open ones.
- **Nested folders.** Drag a folder tile onto another folder's tile — it nests inside it (a
  nested folder is marked with a `›` chevron to the left of the icon). The nesting depth is
  unlimited.
- **A nested folder stays a tile.** It keeps no header and no colour plane of its own: open it
  and its icons appear as a dense strip right under the row, inside the colour area of the parent.
  The open nested folder is underlined with its own colour, and the strip of its icons carries a
  thin line of that colour — so it is clear at a glance whose icons these are.
- **You see which nested folder is open.** An expanded nested folder has a downward chevron
  instead of the usual sideways one, and its tile glows softly in the colour of the folder.
- **Reordering folders.** Drag a tile by its edge — the folder lands next to the one you dropped
  it on. A nested folder can be dragged back out to the top level the same way.
- **Reordering tiles inside a folder.** Drag an icon onto a neighbouring icon — the tile lands
  before or after it, depending on which side you released it.
- **Only the tab you dragged moves.** Drop a GitHub icon with one repository into another
  folder — only that one moved, the other GitHub tabs stayed where they were (see "How it
  works").
- **The drop target is the open folder itself.** Drop a tile into the colour area of an open
  folder — it moves into that folder (and leaves its previous folder).
- **Dragging a tab into a folder.** Drop a tab (from Essentials or from the regular panel) onto
  a tile or onto the area of an open folder — the tab becomes pinned in Essentials and lands in
  that folder.
- **The separator** separates the folder tiles from the pinned tabs that are in no folder: drop
  an icon there — the tab leaves its folder but stays pinned.
- **Right-click a tile** — menu: expand/collapse, open all tabs of the folder, pin to top,
  rename, change icon, change colour, nest into another folder, move to the top level, list
  sites, delete, expand/collapse all folders. The same menu opens on a right-click of the
  **header of an open folder** — that is, an open folder can also be renamed, recoloured or
  unpinned.
- **The `+` tile** in the row — create a new folder straight from the panel.
- **A new folder appears immediately.** The `+` tile does not open a dialog: the folder is
  created on the spot and its name is already selected for typing. Press `Enter` or click
  away to keep the name; press `Esc`, or leave the name empty, and the new folder is removed
  again.
- **Renaming happens on the tile.** Double-click a folder name — on a tile or on the header of
  an open folder — and the caption turns into a text field. `Enter` or clicking away keeps the
  new name, `Esc` puts the old one back.
- **Folder search**: the row above the tiles. Type a folder name or a domain — and only the
  matches stay. `Esc` or the cross resets the search.
- **A pinned folder** (the pin in the folder menu) always sits in the top row, above all the
  others, and is marked with a dot in the corner of the tile. For an open folder the dot is
  visible on the header.
- **The panel no longer covers your tabs.** Expanded folders no longer take over the whole left
  panel: the panel is height-limited and scrolls on its own, and below it the regular Zen tab
  list (and tab groups) stays — just like in a browser without the mod.
- **Open all tabs of a folder** — the tabs of the folder are selected right away and opened next
  to each other.
- **Folder dialog**: name, colour, icon (the standard Zen picker), a list of domains with
  checkboxes, adding a domain manually. It stays available from the tile menu and from the
  `Advanced…` button of the colour strip — the quick inline way handles the name and the
  colour, the dialog handles everything else.
- **Any colour for a folder.** Besides 16 preset shades, the dialog has a colour picker (a
  shade square + a colour bar), a field for an exact code (`#rrggbb`, `#rgb` is understood too)
  and a `Random` button. The chosen colour is immediately visible on the folder tile and on its
  header.
- **The "Move to folder" entry** in the Essentials tab menu: put a tab into an existing folder
  or create a new one with this domain right away.
- **Bright, large logos** in the Essentials grid: 26 px instead of 16 px, without the Firefox
  and Zia dimming. The icons are flat, without dark backdrops.
- **All logos are the same size.** Small favicons used to be drawn at their natural size, so
  inside a folder they ended up of different sizes. Now every logo has its own equal-sized cell,
  and the picture fits into it completely.
- **Folder tiles — in a separate strip.** They lie in a row across the full width of the panel
  and divide that width equally: widen the sidebar and the tiles get wider, instead of one more
  tile being added to the row. Previously the tile size did not depend on the panel width at all.
- **Tile names are not cut off.** All tiles have the same height, a long name is shortened with
  an ellipsis, but is not clipped vertically.
- **The counter is a neat badge** in the corner of the tile, not a bare number on top of the
  icon.
- **The `+` tile is a separate button** at the end of the row, not one more card: you cannot
  mistake it for a folder.
- **Drag & drop also works with tabs from the sidebar.** If the drag started there, the mod
  takes the tab straight from the drag buffer instead of looking it up by the drag-start event.
  Previously a drop looked like "not allowed here".
- **The icon you drag never hides the folder you aim at.** Zen puts a copy of the dragged icon
  under the cursor while you drag. The mod looks past that copy and takes the folder tile that is
  really under the pointer, so the icon lands in the folder you aimed at.
- **The dragged tab is found by the pointer.** Zen replaces the tab with a copy of it when a drag
  starts in the Essentials panel, so the drag no longer starts on the tab itself. The mod asks the
  document which tab stands under the cursor — the real tab is exactly where the icon was taken.
- **A hint instead of silence.** If the drop did not work, the mod explains why: for example,
  "the tab is already in this folder".
- **Logos do not disappear.** A site icon may arrive later than the panel was rebuilt: the mod
  re-checks the icons twice more after that, and listens for load and error — the word "tab" no
  longer replaces the logo for good.
- **An even grid inside a folder.** The icons of a folder stand in columns of equal width with
  an equal step — on the colour plane you can see which tab is where.
- **Columns stretch across the full width of the panel.** The columns do not pile up in the
  corner but divide the available space equally: the folder header and its icons are always
  aligned on one line, and the panel size has no effect on it.
- **Air around the icons.** Inside the colour plane every logo has equal padding (10 px on each
  side) — the icons stick neither to the edge nor to each other.
- **The plane fits its contents exactly.** The colour area ends right below the last icon of the
  folder: no empty space is left underneath.
- **A nested folder stays a tile.** When a folder is opened inside another folder, it does not
  get a block of its own any more: its icons stand in a dense strip right under the row of
  nested tiles, inside the colour plane of the parent. Previously the nested folder took as much
  vertical space as the main one, and a panel with a few nested folders grew twice as tall.
- **A gap between open folders.** The colour areas of neighbouring open folders no longer
  overlap and no longer cover the header of the next folder: a visible gap remains between
  them. Previously the plane of each folder reached 12 px into the next one and covered its
  title.
- **You can see which tab was unloaded.** An unloaded tab gets a frame around its logo: you
  immediately see which tab is "asleep" and which one is in memory.
- **If a site has no logo**, instead of an empty grey square the first letter of the address is
  shown on a coloured circle — every site has its own colour, and it is always the same.
- **You can see which folder is active.** The folder that holds the current tab is marked: by
  default with a pulsing frame glow. The style is chosen in the mod settings: frame glow, dot,
  corner or a star in the corner of the tile.
- **Your own settings in one place.** The mod has its own "Mod settings" dialog: 22 options in
  five groups — language, tile look, icon grid, indicators and behaviour. Everything applies
  immediately, without a "Save" button.

## Screenshots

The real look of the mod in Zen Browser 1.24b.

| Tile row | Open folder | Nested folder | Tile menu | Folder dialog | "Move to folder" in the tab menu |
|---|---|---|---|---|---|
| ![A row of colour-coded folder tiles with icons, names and tab counters](images/tiles.png) | ![An open folder unfolded into a wide colour plane with its tabs](images/expanded.png) | ![A nested folder: it stays a tile, and its icons lie in a dense strip inside the parent's colour](images/nested.png) | ![The context menu of a folder tile: expand, rename, change colour, nest, delete](images/menu.png) | ![Choosing a folder colour: palette, gradient picker and an exact hex code](images/dialog.png) | ![The "Move to folder" entry in the context menu of an Essentials tab](images/context.png) |

## Mod settings

The mod has **its own settings dialog** — open it with the `⚙` gear to the right of the search
row or with the `Mod settings…` entry in the folder menu.

![The settings dialog of the mod](images/settings.png)

The same options are also in **the mod manager of Zen** (Settings → Sine Mods →
Essentials Folders → the gear button): both places read and write the same preference, so a
change made in one is visible in the other at once — no restart needed.

### If a drop does not work

The mod keeps a report of the last drop in the browser preferences — `zen.essentialsfolders.lastdrop` —
and the start of the last drag in `zen.essentialsfolders.lastdrag`. Both are plain text in the
`prefs.js` file of the profile, so the reason can be read without the developer console:

| Field | What it says |
|---|---|
| `result` | what happened: `site-into-folder` (the tab went into the folder), `already-in` (the tile was already there), `no-target` (no folder under the cursor), `outside-panel` (the drop was not over the panel) |
| `targetSource` | where the target came from: `live` (found by the coordinates), `hover` (remembered from the highlight while dragging), `none` (not found) |
| `draggedUrl` | the address of the tab that was dragged |
| `essential` | whether the tab really became an Essential tab |

22 options in five groups:

| Group | What it controls |
|---|---|
| **Language** | interface language — English by default, Russian is one click away |
| **Folder tiles** | tile height, minimum width, folder icon size, whether names and the counter are shown, counter style (badge / dot / off), nesting marker (chevron / off) |
| **Icon grid** | icon step inside a folder, logo size in Essentials, sidebar tab icon size, padding under the plane and the gap between blocks, tile row (strip / grid) |
| **Indicators** | active-folder style (soft glow / dot / corner / star), pulsing on/off and its speed, unloaded-tab marker style (off by default; frame / dashed / dot / line / dimmed are available if you want to see which tabs are sleeping) |
| **Behaviour** | search row, `+` button, hints on a failed drop, the newest open folder is always on top |

Values apply **immediately** — there is nothing to press. The `Reset` button returns everything
to the default values.

The five original settings (`show-names`, `show-count`, `show-search`, `icon-size`,
`tab-icon-size`) still work: if you changed them before, the mod picks up the old value and
keeps the new one next to it — all in a single `zen.essentialsfolders.settings` pref.

## Active folder indicator

The mod marks the folder that holds the **current tab**. By default that is a pulsing frame
glow: the frame itself is always visible and only the halo around it pulses softly — the folder
is immediately visible in both the light and the dark theme, with any folder colour.

![Variants of the active folder indicator](images/indicator.png)

| Style | What it looks like |
|---|---|
| **Frame glow** (default) | A frame in the folder colour with a pulsing halo around it |
| **Dot** | A small dot in the bottom-right corner of the tile |
| **Corner** | A corner mark in the top-left corner of the tile |
| **Star** | A star in the bottom-right corner of the tile |

Pulsing can be switched off — both by a mod setting and by the system setting
`prefers-reduced-motion` (if "reduce motion" is enabled in your system, the pulsing is disabled
by itself).

## How to drag & drop

| Where you dropped it | What happened |
|---|---|
| On a folder tile (anywhere) | The site tile moves into that folder; a folder tile nests into it |
| On the edge of a folder tile (folders only) | The folder lands next to the one you dropped it on (the two swap places) |
| On the colour area of an open folder | The site tile moves into that folder; a folder tile nests into it |
| On an icon inside a folder | The tile lands before that icon or after it (left/right half) |
| On the separator below the folders | A site tile leaves its folder; a folder tile moves to the top level |

### A drop hits the target the first time

While you drag a tile, Zen inserts an empty slot into the Essentials grid under the tab — so the
tiles shift, and the drop lands in that slot instead of in the folder. The mod remembers the tile
layout at the start of the drag and resolves the target against it: even if the grid has moved,
the tab lands where you aimed. If there is not a single tile near the cursor, the mod does not
get in Zen's way — the drop stays an ordinary one.

Right after the drop the browser sometimes sends an extra click — the mod suppresses it, so the
folder does not collapse by itself and does not "jump".

While you drag, the target under the cursor is highlighted: the tile, the header of an open
folder or the icon strip of a nested folder. It is clear where the tile will land before you
release the mouse.

If a drop does not work, the mod remembers what happened. Open the Zen console (`Ctrl+Shift+J`)
and run `copy(JSON.stringify(window.__zenEssentialsFolders.lastDrop))` — the result says what
was dragged, what was under the cursor and where the tile ended up.

### How it works: one tab — one rule

A folder stores not tabs, but **rules**, and a rule is always a **page**: `github.com/dano-/zef` is
that repository, `github.com/` is the home page. There are no domain rules and no exclusions —
exact rules leave no room for a dispute about which folder owns a tab.

| Rule | What lands in the folder |
|---|---|
| `github.com/dano-/zef` | the `dano-/zef` repository and its inner pages |
| `github.com/` | only the GitHub home page |

So a move looks like this:

- you dragged **one** `github.com/dano-/zef` tile from the "GitHub" folder into the "Work"
  folder;
- "Work" got the rule `github.com/dano-/zef` — only that tab is in it;
- the other GitHub tabs stayed where they were: they have their own pages, and a page that is
  not in the folder simply is not in it.

If the address has no path at all (`https://github.com/`), the rule will be `github.com/` — the
home page only.

Typing a domain in the folder dialog adds the pages of the open tabs of that domain — the same
rules the drag would have created.

Older setups kept domain rules and exclusions. They are converted once, at the first start of
the new version: a domain rule becomes the pages of the open tabs of that domain (or the home
page, if no tab of that domain is open), and exclusions are dropped. The previous rules are kept
in `zen.essentialsfolders.rules-backup`, and the report of the conversion — in
`zen.essentialsfolders.migration-report`.

A rule whose page is not open right now is shown as a **dim tile**: the folder is not empty
while the rule lives in it, and the counter counts rules. Clicking the dim tile opens the page.

## Install

The mod installs in a minute: these are ready-made files, no build step and no npm. Zen reads the
mod at startup, so after installing it you need to restart Zen.

### Quick start

`Sine Mods` → `Install from repo` → paste the link → restart Zen:

```
https://github.com/danonchek51/zen-essentials-folders
```

Details are in the options below.

### Option 1. Through Sine (recommended)

Sine is the mod manager built into Zen (Settings → Sine Mods).

1. Open `Settings` → `Sine Mods` → `Marketplace` in Zen.
2. Find **Essentials Folders** and press `Install`.
3. Restart Zen.

Sine pulls new versions from the repository on its own — there is nothing to update manually.

It works without the store as well: `Sine Mods` → `Install from repo`, paste the link

```
https://github.com/danonchek51/zen-essentials-folders
```

### Option 2. Manually (without a mod manager)

1. Close Zen.
2. Copy the files `theme.json`, `preferences.json`, `chrome.css`,
   `essentials-folders.uc.js` into the folder

   ```
   <Zen profile>\chrome\sine-mods\zen-essentials-folders\
   ```

   The profile usually lives here:
   `%APPDATA%\zen\Profiles\<profile-name>\`

3. Add an entry to `chrome\sine-mods\mods.json` (if it is not there yet):

   ```json
   "zen-essentials-folders": {
     "id": "zen-essentials-folders",
     "name": "Essentials Folders",
     "description": "Folder tiles for the Essentials panel.",
     "style": {"chrome": "chrome.css", "content": ""},
     "scripts": {
       "essentials-folders.uc.js": {"include": ["chrome://browser/content/browser.xhtml"]}
     },
     "preferences": "preferences.json",
     "enabled": true
   }
   ```

4. Start Zen.

Quick option: run `python install.py` from the mod folder — the script finds the Zen profile on
its own, copies the files and fixes `mods.json`.

> Before editing `mods.json` and `prefs.js` **close Zen**: it rewrites those files on exit and
> can wipe your changes.

## How to use

1. By default the mod creates five folders under your current Essentials: "AI and models",
   "Mail and cloud", "Design and notes", "Social and media", "Other". If your sets are
   different — rename them, delete them and make your own (see below).
2. Click a tile — open the folder. It unfolds into a colour plane with tiles inside. Click the
   folder header — collapse it. There can be several open folders, the newest one sits higher.
3. Pinned tabs that are in no folder sit at the very bottom — behind the separator.
4. To move a tab into another folder: right-click the tab icon → `Move to folder` → the folder
   you need (the **whole site** moves). Or drag the icon onto a tile or onto the colour area of
   a folder — then **only that tab** moves, the tab becomes pinned in Essentials right away and
   lands in that folder.
5. To take a tab out of a folder, drag its icon onto the separator — the line below the
   folders. The tab stays pinned in Essentials but leaves the folder (the other tabs of the same
   site stay in the folder).
6. Right-click a tile → `Delete folder` to remove an unnecessary one. Nested folders are not
   lost — they move up one level.
7. Above the tiles there is a **search row**: type a folder name or a domain — and only the
   matches stay. `Esc` clears the search.
8. For a folder you need often: right-click → `Pin to top`. Such a folder is always in the top
   row.
9. The folder panel is height-limited: with many open folders the panel scrolls on its own
   (mouse wheel over the tiles). Once you reach the edge of the panel the wheel scrolls the
   regular tab list. Below the panel — the Zen tab list and tab groups, they are always
   reachable.
10. Your own folder colour: right-click a tile → `Change colour…`. In the dialog pick a shade
    with the picker, type a code in the field (`#e11d48`) or press `Random`, then `Save` — the
    colour changes at once. If the `Save` button is not in view (the domain list is long), press
    `Ctrl+Enter` — it is the same `Save`. The domain list of the folder does not change at the
    same time: it is rewritten only if you ticked or unticked a checkbox yourself.

### Settings

All mod settings are collected in its own dialog — see the [Mod settings](#mod-settings)
section above. The five original entries (`Show folder names on tiles`, `Show tab count in
folder`, `Show folder search row`, `Logo size in Essentials`, `Tab icon size in the side list`)
stayed on the Zen settings page — the mod reads them too.

The same values can be changed directly in the `chrome.css` of the mod — at the beginning of the
file there are the variables `--zef-icon-size`, `--zef-folder-icon-size` and
`--zef-tab-icon-size`.

### Where folders are stored

The data lives in the Zen preferences, so it survives restarts and browser updates:

- `zen.essentialsfolders.folders` — folders: name, colour, icon, parent (`parentId`), domains
  (`sites`) and their order, plus the `pinned` flag (the folder is pinned to the top)
- `zen.essentialsfolders.collapsed` — which folders are collapsed
- `zen.essentialsfolders.order` — the order of open folders: the newest on top
- `zen.essentialsfolders.settings` — the mod settings (one JSON): tile look, icon grid,
  indicators and behaviour

A tab belongs to a folder **by an address rule**, and not by tab id: a browser restart, a page
redirect and a tab move never break it. An ordinary rule is a domain (`github.com`), an exact
one is a domain with a path (`github.com/dano-/zef`), and `!github.com/dano-/zef` is an exclusion
that removes a specific tab from the folder. The longer the rule, the "more important" it is: an
exact rule wins over a domain rule, so a tab moved from one folder to another ends up in the new
one, while its namesake stays in the old one. With equal rules the folder that is nested deeper
wins.

## Frequently asked questions (FAQ)

### What is Essentials Folders?

Essentials Folders is a mod for Zen Browser that turns the Essentials grid into folder tiles.
Folders nest inside each other, tabs and folders are dragged around with the mouse, there is a
search for folders and its own settings dialog with 22 options.

### Do I have to move tabs into folders manually?

No. The mod moves and deletes nothing: tabs stay ordinary Zen tabs with their bookmarks and
history. Tabs join a folder by an address rule — for example all `github.com` tabs or just one
specific page.

### Where does the mod save the folders?

In the Zen preferences, so they survive restarts and browser updates: the prefs
`zen.essentialsfolders.folders`, `.collapsed`, `.order` and `.settings`.

### Will the mod keep working after a Zen update?

Yes. The mod uses public Zen APIs (`gZenWorkspaces.getCurrentEssentialsContainer()`) and the
`.zen-essentials-container` CSS class; the DOM observation reconnects itself when the
workspaces or the tabs change.

### Is the mod compatible with other mods?

Yes. The mod does not touch tabs or their data, it only draws tiles. Confirmed compatibility —
the **Zen Tab Groups** mod (oom333) with tab groups.

### Do I have to configure anything?

No, everything works right away. But if you want to: the `⚙` gear to the right of the search row
(or the `Mod settings…` entry in the folder menu) opens 22 options in five groups — language, tile look,
icon grid, indicators and behaviour. Values apply immediately.

### How do I get everything back as it was?

Delete the folder `chrome\sine-mods\zen-essentials-folders` and its entry from `mods.json`, then
restart Zen. No tabs are lost in the process.

### Dragging a tile into a folder does not work

The drop target is highlighted while you drag — if nothing is highlighted, the cursor is not over
a folder. If the tile still does not land where you aimed, open the Zen console (`Ctrl+Shift+J`)
and run `copy(JSON.stringify(window.__zenEssentialsFolders.lastDrop))`, then send the result:
it says what was dragged, what was under the cursor and where the tile ended up.

### And if the tiles have disappeared?

Open `about:support` → "Profile Folder" and check that
`chrome\sine-mods\zen-essentials-folders\essentials-folders.uc.js` is in place. It helps to
reload Zen: `Ctrl+Shift+R`.

## Why the mod is safe

- The mod **never moves and never deletes** anything: tabs stay ordinary Zen tabs, so Ctrl+W
  (unload), clicking the icon to reload and tab drag & drop keep working as usual.
- The mod **only draws**: it adds its own tiles to the Essentials grid, hides the contents of a
  collapsed folder and sets the display order through CSS `order`.
- No tab is ever replaced: at worst the tiles do not appear, but all tabs and their data stay
  where they are.
- Hiding the contents of a collapsed folder is done through a CSS attribute, not through inline
  styles.
- Only the **logo images in the Essentials grid** and the **tile background** change: the
  transparency of icons in the regular tab list, on tabs and in other places of the interface is
  untouched by the mod.
- Zen's Essentials counter keeps counting real tabs only.
- The mod survives Zen updates: it uses public APIs
  (`gZenWorkspaces.getCurrentEssentialsContainer()`) and the CSS class of the container
  `.zen-essentials-container`, and the DOM observation reconnects itself when the workspaces or
  the tabs change.

## If something goes wrong

- **The tiles have disappeared.** Open `about:support` → "Profile Folder" and check that
  `chrome\sine-mods\zen-essentials-folders\essentials-folders.uc.js` is in place. A simple Zen
  reload helps: `Ctrl+Shift+R` in the browser window.
- **The menu does not work.** Check that the mod is enabled in Zen Mods.
- **Rollback.** Delete the folder `chrome\sine-mods\zen-essentials-folders` and its entry from
  `mods.json`, then restart Zen. No tabs are lost in the process.
- In `about:support` → "Browser Console" you can look at the messages of the mod (in the log
  they are marked with the `[ZEF]` prefix).

## Compatibility

The mod plays well with others: it touches neither tabs nor their data, it only draws its own
tiles in the Essentials grid. In particular it works together with the **Zen Tab Groups** mod
(oom333) — tab groups in the sidebar.

## License

MIT — see [LICENSE](LICENSE).

## Contributing

The mod is free and open source. You can help in different ways:

- **Report a bug** — [Issues](https://github.com/danonchek51/zen-essentials-folders/issues):
  Zen version, mod version, steps to reproduce.
- **Suggest an idea** — [Discussions](https://github.com/danonchek51/zen-essentials-folders/discussions)
  or an issue with the `Feature` label.
- **Send a patch** — [CONTRIBUTING.md](CONTRIBUTING.md): how to install the mod locally, how to
  verify it and how to open a pull request.
- **Translate** — the English version is this file, the Russian version is here
  ([README.ru.md](README.ru.md)), other languages are welcome.

What changed in each version — in [CHANGELOG.md](CHANGELOG.md).

## Author

**Essentials Folders** is a mod for [Zen Browser](https://zen-browser.app) by
[@danonchek51](https://github.com/danonchek51).

Questions and suggestions — through
[Issues](https://github.com/danonchek51/zen-essentials-folders/issues)
and [Discussions](https://github.com/danonchek51/zen-essentials-folders/discussions).
