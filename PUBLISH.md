# Publishing the mod

Step-by-step plan: from the files in this folder to the mod in the Zen Mod Store.

## 1. Create the repository on GitHub

`git` and `gh` are already installed on this machine, and `gh` is authorized as `danonchek51`.
The fastest route is the ready-made script in the working folder:

```powershell
python publish_github.py             # show the plan
python publish_github.py --publish   # create the repository, push, and make the v1.11.0 release
```

The script creates the public repository `danonchek51/zen-essentials-folders` on its own,
commits the sources, sets the tag `v1.11.0` and creates a release with the archive attached.

Manually, the same thing:

```powershell
cd path\to\Zen-Essentials-Folders
git init
git add .
git commit -m "Essentials Folders: first release"
git branch -M main
git remote add origin https://github.com/danonchek51/zen-essentials-folders.git
git push -u origin main
```

If `git` is not installed — download it from <https://git-scm.com/downloads>, then:

```powershell
git config --global user.name "Your name"
git config --global user.email "your@email"
```

## 2. Check the address in the manifest

In `theme.json` it must be:

```json
"homepage": "https://github.com/danonchek51/zen-essentials-folders"
```

and the `"author"` field — as you wish (currently "Essentials Folders").

A quick check that the placeholder is gone:

```powershell
Select-String -Path theme.json -Pattern "YOUR-NICK"
```

## 3. Check that the mod installs from scratch

On a clean profile (or in the current one, but with the mod disabled):

1. Close Zen.
2. `python install.py` — the script finds the profile and installs the mod.
3. Start Zen: the tiles should appear in Essentials.

## 4. Publish the mod

### 4.1. GitHub Releases — the main platform

Repository + release with the mod archive. The mod is installed from it both manually
(`python install.py`) and through Sine.

```powershell
python publish_github.py --publish
```

### 4.2. Sine Store — the mod marketplace (main)

Sine is the mod manager built into Zen (`chrome/sine-mods` in the profile). Its marketplace
accepts **mods with scripts** — unlike the official Zen registry.

Application: an issue in `sineorg/store` with the `add-theme` template, where one field is
needed — a link to the repository:

- Address: <https://github.com/sineorg/store/issues/new?template=add-theme.yml>
- Title: `[add-theme]: Essentials Folders`
- Theme Homepage: `https://github.com/danonchek51/zen-essentials-folders`

The ready-made text is in the file `store-submission.md`.

After publication the mod appears in Zen: Settings → Sine Mods → Marketplace.
Sine picks up new versions from the repository on its own — there is no need to update manually.

A user can install the mod without the store as well: in Zen → Settings → Sine Mods →
"Install from repo" and paste the link to our repository.

### 4.3. The official Zen registry (zen-browser.app/mods) — does not fit

The registry at <https://zen-browser.app/mods/> is filled in automatically: the bot
(`zen-browser/theme-store`) reads the application and **builds `theme.json` itself**.
The assembled manifest contains only `style` (CSS), `readme`, `image` and `preferences` —
there is no `scripts` field, and the Zen installer (`ZenMods.installMod`) downloads only
`chrome.css`, `readme.md` and `preferences.json`.

Conclusion: a mod that needs a script (which is our mod) cannot be installed through this
registry — only the CSS would be downloaded, and there would be no tiles. So we **do not**
file an application in `zen-browser/theme-store`; the right platform for mods with scripts is
Sine Store (4.2).

If the registry maintainers extend the format and add `scripts`, the application is filed
using the `create-theme` template:

| What | Requirement | Ours |
|---|---|---|
| Mod name | unique, less than 25 characters, letters/digits/spaces only | `Essentials Folders` — 18 ✔ |
| Description | less than 100 characters | `Folder tiles for Zen Essentials: nesting, drag & drop, search and settings.` — 75 ✔ |
| Image | PNG **600×400** over HTTPS | a live screenshot from Zen is needed |
| Theme Styles | CSS (without `@-moz-document url-prefix('chrome://')`) | our `chrome.css` ✔ |
| Readme | required | ✔ `README.md` |
| Preferences | JSON | ✔ `preferences.json` (5 old settings) |

### 4.4. Other places

- **Community mod collections** — repositories like `baxyz/zen-mods`: they use a different
  format (`mod.json` + `userChrome.css`), so a separate converter is needed.
  Optional.
- **Your own page on GitHub** — the repository README is the showcase for the mod.

## 5. What should be in the repository

```
theme.json              — mod manifest (required)
preferences.json        — mod settings (required)
chrome.css              — styles (required)
essentials-folders.uc.js— the script (required)
README.md               — English description with screenshots
README.ru.md            — Russian version of the description
LICENSE                 — license
install.py              — manual auto-install (for those not using the Store)
images/                 — screenshots for the README
```

## 6. Pre-release checklist

- [ ] There is no `YOUR-NICK` in `theme.json` (the address is already set: `danonchek51`)
- [ ] Screenshot links in `README.md` point to `images/`
- [ ] `python install.py` runs without errors
- [ ] The mod can be enabled and disabled without Zen crashing
- [ ] Only collapsed folders stay in the top row — an open folder moves into the plane
      and is not duplicated
- [ ] The plane of an open folder covers all of its tiles, even if they are in two rows
- [ ] The most recently opened folder sits above the others
- [ ] A folder is nested into another by dragging (the `›` icon) and comes back out
- [ ] Tiles inside a folder are reordered by dragging, the order is preserved
- [ ] Dragging a tab into the coloured area of an open folder moves it into that folder
- [ ] Dragging an icon onto the separator removes the tab from the folder, but not from Essentials
- [ ] Moving a tile from one folder to another takes **only that tile**: other tabs of the
      same domain stay in the previous folder (an exclusion `!…` appears in the rules)
- [ ] `Ctrl+W` on an Essentials tab unloads it, the icon dims, a click loads it again
- [ ] After restarting Zen the folders, their nesting and their contents are in place
- [ ] Logos in Essentials are large (26 px) and not dimmed — visible at once
- [ ] A small logo is drawn at its natural size, not stretched
- [ ] A site without a logo shows the first letter of the address on a coloured circle,
      not an empty square
- [ ] Folder search finds a folder by both name and domain
- [ ] A pinned folder stays in the top row and is marked with a dot
- [ ] The dot is visible both on an open folder (on the header) and on a collapsed tile
- [ ] Right-clicking the header of an open folder opens the same menu
- [ ] Expanded folders do not cover the tab list: tabs and groups are visible below the panel
- [ ] The folder panel scrolls on its own when many folders are open
- [ ] The mouse wheel over the panel scrolls the panel, and at the edge — the tab list
- [ ] While scrolling the panel, the coloured planes stay with their folders
- [ ] The folder colour can be picked with the eyedropper in any shade, not only from the palette
- [ ] The colour code can be typed manually (`#rrggbb`) — the field accepts `#rgb` too
- [ ] The `Random` button gives a new shade
- [ ] The chosen colour is visible right away on the folder tile and on its header
- [ ] Icons in the regular side tab list have become larger (18 px)
- [ ] Inside an open folder the columns stretch to the full width of the panel, the header
      and the icons on one line
- [ ] Every logo has the same breathing room around it (10 px), icons do not stick to the edge
- [ ] The coloured plane ends right below the last icon, there is no empty space below
- [ ] An open nested folder does not "swallow" the parent row: the parent's icons start a
      new row and do not lie inside the nested folder's colour
- [ ] Neighbouring open folders do not overlap: a gap is visible between the coloured
      planes, the next folder's header is not covered
- [ ] Folder tiles stretch with the panel width instead of keeping the old size
- [ ] The tile title is not clipped vertically
- [ ] A tab from the sidebar can be dragged into a folder (the drop is allowed)
- [ ] If the drop did not work, the mod explains why
- [ ] There are no debug statements in the code (pref logging, `console.log`)
- [ ] The mod settings dialog has 21 options in 4 groups, everything applies at once
- [ ] The `⚙` gear next to the search row opens the settings
- [ ] The active folder (the one holding the current tab) is marked and pulses
- [ ] The pulsing is switched off by the system "reduce motion" setting
- [ ] The five old prefs on the Zen settings page still work

## 7. Version history
- **1.11.0** — the English-first release. **The mod code did not change** — behaviour,
  settings and speed are exactly the same as in 1.10.2. The project policy is now:
  English is the primary language of the mod, the repository and the site. The internal
  documentation (`PUBLISH.md`) and the site text files for AI agents (`docs/llms.txt`,
  `docs/llms-full.txt`, `docs/robots.txt`) are translated to English; the URL and command
  references in them are kept intact.
- **1.10.2** — release of the public look of the mod, **the mod code did not change**. Screenshots were replaced
  with neutral ones: the public images no longer contain personal folder and bookmark names,
  everywhere there is now a made-up "clean" set. The landing page got its own fonts: Rubik in
  headings (the same one Zen Browser itself uses), Inter in body text, JetBrains
  Mono in code — all three are free, support Cyrillic and are loaded locally from GitHub Pages.
- **1.10.1** — release of the documentation and the mod card, **the mod code did not change**. The README
  was rewritten for search: the first paragraph answers the question "what is this" in the first
  lines, a facts table was added, alt texts for all screenshots, a "Screenshots" section,
  a quick start and a "Frequently asked questions" section. An English version of the README
  was added (`README.en.md`). Community files appeared: `CHANGELOG.md`, `CONTRIBUTING.md`,
  `CONTRIBUTING.en.md`, `CODE_OF_CONDUCT.md`, issue and pull request templates. Mod card:
  the description was extended, the tags were filled out to 15.
- **1.10.0** — the mod got **its own settings**: the "Mod settings" dialog
  (the `⚙` gear next to the search row or an item in the folder menu) with 21 options in
  four groups: folder tiles, icon grid, indicators and behaviour. Everything
  applies at once, with no "Save" button; there is a "Reset". The new settings
  live in a single JSON pref `zen.essentialsfolders.settings`, the five old prefs
  are still read and work. An **active folder indicator** appeared —
  the folder that holds the current tab is marked and pulses softly: by default
  with a glowing frame (the frame is always visible, a halo pulses around it —
  so the indicator reads with any folder colour and in any theme), or with a dot,
  a corner or a star in the corner of the tile. The pulsing can be switched off, and its
  speed is configurable. Tile sizes, the icon step, the breathing room and the gaps were
  moved to CSS variables and became configurable; the counter style, the nesting icon
  and the unloaded tab marker were also moved into the settings.
- **1.9.0** — the look of the tiles was reworked and dragging with icons was fixed.
  Folder tiles now lie in a separate strip across the full width of the panel and divide it
  equally: the sidebar was widened — the tiles became wider (before, their size did not
  depend on the panel width at all). The tiles have the same height, the name is no longer
  clipped, the counter became a neat badge, and the "+" is a separate button at the end of
  the row. A nested folder now has a neat chevron to the left of the icon: before, the "↳"
  symbol was cut in half by the tile's rounded corner and read as a random digit.
  Dragging a tab into a folder now works for tabs started in the sidebar as well:
  the mod takes the tab from the drag buffer instead of relying only on the start
  event. If the drop did not work, the mod explains why with a short hint.
  Site logos no longer disappear: an icon that arrives later waits for its own
  load — and the panel rechecks the icons twice more after the rebuild.
- **1.8.2** — an expanded folder looks tidier: the icon columns stretch to the full
  width of the panel (the header and the icons stand on one line, the panel size does not
  affect it), every logo has the same breathing room around it (10 px), the coloured plane
  ends right below the last icon — there is no empty space below any more. The parent
  folder's icons no longer continue the nested row: after an open nested folder they start a
  new row (indented by 12 px) and do not fall into its colour — before, the nested
  folder's plane covered the parent's icons and they looked like the contents of the
  nested folder. Neighbouring open folders no longer overlap: a gap appeared between the
  coloured planes, and the next folder's header is no longer covered.
  The panel no longer accumulates old gaps: after opening and closing nested folders,
  no empty holes are left between the icons.
- **1.8.1** — the folder colour is applied immediately after "Save" (before, it could
  appear only after the next event); the domain list in a folder is no longer
  rewritten when the colour or the name changes; `Ctrl+Enter` works in the dialog;
  all logos in Essentials are now in the same cell (26 px) and stand in an even
  grid with the same step; a tab unloaded from memory gets a frame around the logo
  (the mod detects the unload itself — Zen immediately drops its own "unloaded" flag).
  The "Do not stretch small site icons" setting was removed —
  icons are always the same size.
- **1.8.0** — any folder colour can be chosen: the folder dialog got an eyedropper
  (a shade square + a colour bar), a field for an exact code (`#rrggbb`) and a
  "Random" button. Before there were only 16 preset colours.
- **1.7.1** — the mouse wheel over the folder panel scrolls the panel itself (Zen intercepted
  the sidebar scroll), at the edge of the panel the wheel goes to the tab list; the coloured planes
  of folders no longer "drift away" from their folders while the panel scrolls.
- **1.7.0** — drops hit the target on the first try (the tile layout is remembered at the
  start of the drag, the extra click after the drop is suppressed), dropping a regular tab
  onto a site tile, icons are no longer stretched (small ones are drawn at their natural size),
  instead of an empty tile — the first letter of the address on a coloured circle, folder search,
  pinning a folder to the top (pin) with a yellow dot in the corner of the tile (and on the
  header of an open folder), "open all tabs of the folder", "expand/collapse all", a right-click
  menu on the header of an open folder, the folder panel is height-limited and scrolls on its own —
  the tab list below it is no longer covered.
- **1.6.0** — fixes to dropping and icons: a snapshot of the tile layout, drop zones,
  a placeholder letter for sites without a favicon.
- **1.5.0** — moving between folders moves exactly one tab: for addresses with a path
  a specific rule appears in the folder (`github.com/dano-/zef`), the domain rule stays
  in the previous folder, and the exact address is excluded (`!github.com/dano-/zef`).
  A rule for the site home page appeared (`github.com/`), path rules got a
  boundary (`zef` does not catch `zef2`), and specific rules and exclusions are visible
  in the folder dialog.
- **1.4.0** — an open folder unfolds into a wide coloured plane (without duplicating
  the tile), nested folders of any depth, reordering folders and tiles inside a folder
  by dragging, the drop zone is the open folder itself, the most recently opened folder
  sits on top, a flat minimal look without dark backdrops.
- **1.3.0** — large logos in Essentials (26 px) without the Firefox/Zia dimming,
  a dark backdrop on unloaded tiles, 18 px icons in the tab list,
  two new size fields in the mod settings.
- **1.2.0** — dragging tabs into folders and back out onto the separator.
- **1.1.0** — a row of tiles on one line, the header of an expanded folder, the separator.

## 8. The landing page on GitHub Pages

The site lives in the `docs/` folder and is published from the `main` branch:
<https://danonchek51.github.io/zen-essentials-folders/>

| File | What it is |
|---|---|
| `docs/index.html` | the landing page itself: RU + EN switch, JSON-LD, meta tags |
| `docs/assets/site.css` | styles |
| `docs/assets/fonts.css` | local `@font-face` for the landing page fonts |
| `docs/fonts/` | font files (20 files, ~537 KB): Rubik, Inter, JetBrains Mono |
| `docs/llms.txt` | site map for AI agents (llmstxt.org format) |
| `docs/llms-full.txt` | the full documentation text in one file — for agents |
| `docs/robots.txt` | rules for search engines and 19 AI agents, `Content-Signal: search, ai` |
| `docs/sitemap.xml` | site map |
| `docs/og.png` | cover 1200×630 for links in chats and social networks |
| `docs/images/` | copies of the mod images for the site |

Rules when editing:

- **If you change `docs/assets/site.css` — bump the version in the link** in `docs/index.html`
  (`assets/site.css?v=N`). GitHub Pages caches the CSS for 10 minutes, and without changing
  the link the edit will not arrive immediately.
- **If you change `docs/index.html`** — the cache resets by itself, the HTML is served right away.
- Texts that contain markup (`<b>`, `<code>`, `<a>`) must not be put into the
  `data-ru` / `data-en` attributes: when switching the language the tags are printed as text.
  For such places use paired blocks `<p class="only-ru">` and `<p class="only-en">`.
- Add new pages to `docs/llms.txt`, `docs/sitemap.xml` and `docs/index.html`.
- **The fonts live locally** in `docs/fonts/`, not through the Google Fonts CDN: that way the site
  does not depend on an external service and loads the same for everyone. When you change the
  typefaces — rerun `fetch_landing_fonts.py` from the working folder, it rebuilds
  `docs/assets/fonts.css` and removes the unneeded files. The fonts must contain
  Cyrillic: the landing page is bilingual.
- **The `docs/` folder does not go into the mod release archive** — these are site files, not mod
  files. The exclusion is set in `package_repo.py` (`SKIP_IN_ZIP`).


