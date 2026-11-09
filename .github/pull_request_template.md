## What changed

<!-- In one or two sentences: what problem is solved and how. -->

## Why this way

<!-- Why this particular solution. Link to an issue if there is one: Closes #123 -->

## How to verify

<!-- A checklist to reproduce the verification. -->

- [ ] `node --check essentials-folders.uc.js` passes without errors
- [ ] The mod is installed in the profile (`python install.py`) and Zen was restarted
- [ ] Tested on Zen version: ____
- [ ] Tested on mod version: ____

## Screenshots

<!-- Before / after. For UI changes, add images to `images/` and embed them here. -->

## Safety checklist

- [ ] The mod does not move or delete tabs — it only draws tiles
- [ ] No new debug messages in the console (only `console.warn` in emergency `catch` is allowed)
- [ ] New settings are read from the existing prefs and do not break them
- [ ] Compatibility with the Zen Tab Groups mod (oom333) is not broken
