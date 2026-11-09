# Changelog

All notable changes to the **Essentials Folders** mod. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versioning follows
[Semantic Versioning](https://semver.org/lang/en/).

Mod: [danonchek51/zen-essentials-folders](https://github.com/danonchek51/zen-essentials-folders) ·
releases: [Releases](https://github.com/danonchek51/zen-essentials-folders/releases) ·
installation: [Sine Store](https://github.com/sineorg/store) → `Install from repo`.

---

## [1.11.0] — 2026-11-09

Interface, readability and layout fixes found on the live browser.

### Added

- **Language switch in the mod settings.** The interface is English by default; Russian is
  still available — pick `Language` → `Русский` in the mod settings and the whole interface
  switches immediately. New folders, names and hints follow the chosen language.

### Changed

- **The interface language is now English** — menus, dialogs, settings and hints. Russian
  remains as an option inside the mod.
- **The active-folder indicator is a soft glow instead of a hard frame.** The rectangle around
  the open folder looked like a selected cell; now only a wide, gentle halo remains.
- **Folder names are readable on dark tiles.** The caption is now computed from the panel's
  own text colour with a soft shadow, so a black or deep-blue folder no longer hides its name.
- **Nested folders got their own row.** A collapsed sub-folder used to be dropped straight into
  Zen's shared grid: it could land in a free cell of a foreign row (it looked like it belonged
  to another folder) and, being taller than a Zen row, it overlapped the neighbours. Now every
  group of nested folders is laid out in a separate row under its parent.
- **The outline around sleeping tabs is gone by default.** A discarded tab was marked with a
  white 2 px frame around its icon, which looked like a glitch in the grid. The marker is now
  switched off by default; `Unloaded tab marker` still offers a dot, a line, a dimmed icon or
  the old frame if you want to see it.

### Fixed

- The folder caption is no longer cut off in low tiles — the icon gives way instead.
- Long folder names no longer overlap the neighbouring tiles.
- **Closing a folder closes the folders inside it too.** A nested folder used to stay open, and
  its tabs then dropped into the Essentials grid as ordinary tiles. Now the whole branch closes
  at once and the tabs stay hidden until the parent is opened again.
- **The edge of a folder no longer cuts through the tiles below it.** The empty strip under a
  folder's icons is now only drawn where it is actually free: in a narrow panel the next block
  started right under the icons, so the coloured plane ended in the middle of the tiles below.

---

## [1.10.2] — 2026-11-09

Public-facing release of the mod. **The mod code did not change** — behaviour, settings and
speed are exactly the same as in 1.10.1.

### Changed

- **Screenshots replaced with neutral ones.** The public images used to reveal personal
  folder and bookmark names. Now every snapshot shows a fictional "clean" set of folders
  and generic sites — there is no personal data in them.
- **The landing page got its own fonts.** Headings — Rubik (the same one Zen Browser uses
  itself), body text — Inter, code — JetBrains Mono. All three are free and include
  Cyrillic; they are loaded locally from GitHub Pages.
- **Mod card**: version and update date.

### Added

- `docs/fonts/` — the landing page font files (20 files, ~537 KB) and `docs/assets/fonts.css`
  with local `@font-face` rules.
- A "Landing page on GitHub Pages" section in `PUBLISH.md` — how to update the site.

---

## [1.10.1] — 2026-11-09

Documentation and mod card release. **The mod code did not change** — behaviour, settings
and speed are exactly the same as in 1.10.0.

### Changed

- **README rewritten for search.** The first paragraph answers the "what is this"
  question right in the first lines, a facts table was added, every screenshot got an
  alt text, plus a "Screenshots" section, a quick start with a ready-to-use link and a
  "FAQ" section.
- **An English version of the README was added** (`README.en.md`) — for English-language
  searches and for AI agents that read mod documentation.
- **Mod card**: the description was extended for search, the tags were topped up
  (now 15), and a link to Releases was added.

### Added

- `CHANGELOG.md` — the change history in Keep a Changelog format.
- `CONTRIBUTING.md` and `CONTRIBUTING.en.md` — how to install the mod locally, how to
  check a change and how to format a pull request.
- `CODE_OF_CONDUCT.md` — the code of conduct for participants.
- Issue templates (`bug_report.yml`, `feature_request.yml`) and a pull request template.

---

## [1.10.0] — 2026-11-09

### Added

- **The mod's own settings** — the "Mod settings" dialog (the `⚙` gear to the right of the
  search row, or the `Mod settings…` item in the folder menu). 21 options in four groups:
  folder tiles, icon grid, indicators, behaviour. Values are applied immediately, there is
  no "Save" button; there is a "Reset" button.
- **Active folder indicator** — the folder that holds the current tab is marked.
  Four styles: frame glow (default), dot, corner, a small star in the corner of the tile.
  By default the frame is always visible and only the halo around it pulses — so the
  indicator reads well with any folder colour and in any theme. The pulsing can be turned
  off in the mod settings and respects the system `prefers-reduced-motion`.
- **A single settings store** — the `zen.essentialsfolders.settings` pref (one JSON).
  The five old prefs (`show-names`, `show-count`, `show-search`, `icon-size`,
  `tab-icon-size`) are still read and still work.

### Changed

- Tile sizes, icon spacing, padding and gaps were moved to CSS variables and became
  configurable.
- The tab counter look, the nesting icon and the unloaded tab badge were moved into
  the settings.

---

## [1.9.0] — 2026-10-24 … 2026-11-08

The repository was published together with version 1.10.0, so the exact release dates of
1.1.0–1.9.0 were not preserved in the Git history. Below is what changed in each of them.

### 1.9.0

- The tile look was reworked and dragging with icons was fixed. Folder tiles now sit in a
  separate full-width strip at the top of the panel and split it evenly.
- All tiles have the same height, the name is not truncated, the counter became a tidy
  badge, and `+` is a separate button at the end of the row.
- A nested folder gets a neat chevron to the left of the icon.
- Dragging a tab into a folder now works for tabs that were started in the sidebar too.
- If the drop did not work, the mod explains why with a short hint.
- Site logos no longer disappear: the panel rechecks the icons twice more after the
  rebuild.

### 1.8.2

- Icon columns stretch across the full width of the panel, with equal padding around
  every logo.
- The coloured area ends right below the last icon.
- Parent folder icons start a new row after an opened nested folder and do not fall into
  its colour.
- Neighbouring open folders no longer overlap each other.

### 1.8.1

- The folder colour applies immediately after "Save".
- The domain list in a folder is no longer rewritten when the colour or the name changes.
- `Ctrl+Enter` works in the dialog.
- All logos in "Essentials" sit in the same 26 px cell, in a neat grid with even spacing.
- An unloaded tab gets a frame around its logo.

### 1.8.0

- The folder colour can be any colour: an eyedropper (a shade square + a colour strip),
  a field for an exact code (`#rrggbb`) and a "Random" button.

### 1.7.1

- The mouse wheel over the folder panel scrolls the panel itself; at the edge it scrolls
  the tab list.
- The coloured areas of folders no longer "drift" away from their folders while the
  panel scrolls.

### 1.7.0

- Drops hit the target on the first try: the tile layout is remembered at the start of
  the drag, and the extra click after the drop is suppressed.
- Folder search, pinning a folder to the top (a pin) with a yellow dot in the corner of
  the tile.
- "Open all tabs of the folder", "expand/collapse all", a context menu on right click on
  the header of an open folder.
- The folder panel is height-limited and scrolls on its own — the tab list underneath is
  no longer covered.

### 1.6.0

- A snapshot of the tile layout, drop zones, a letter placeholder for sites without
  a favicon.

### 1.5.0

- Moving between folders moves exactly one tab: a dot rule appears
  (`github.com/dano-/zef`), and a specific address is excluded (`!github.com/dano-/zef`).
- A rule for a site's home page (`github.com/`) and a boundary for rules with a path
  (`zef` does not catch `zef2`).

### 1.4.0

- An open folder expands into a wide coloured area (without duplicating the tile).
- Nested folders of any depth, reordering of folders and of tiles inside a folder by
  dragging.
- The drop zone is the open folder itself, the most recently opened folder on top.
- A flat, minimal look without dark underlays.

### 1.3.0

- Large logos in "Essentials" (26 px) without the Firefox/Zia dimming, a dark underlay
  for unloaded tiles, 18 px icons in the tab list.

### 1.2.0

- Dragging tabs into folders and back onto the separator.

### 1.1.0

- A single row of tiles, the header of an open folder, the separator.

---

[1.10.0]: https://github.com/danonchek51/zen-essentials-folders/releases/tag/v1.10.0
