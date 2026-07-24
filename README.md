# Valvular Heart Disease Lab — Interactive Website

An offline-first, dependency-free study website rebuilt from the supplied **Valvular Heart Disease** chapter and improved using the structure of the supplied Heart Failure interactive example.

## Open it

1. Extract the ZIP.
2. Keep every file in the same folder.
3. Open `index.html` in a modern browser.

No installation, build step, server, account, or internet connection is required for the core site. External guideline links require internet access.

## Included

- 39 interconnected modules grouped into foundations, mitral, aortic, right-sided, special issues, and interactive revision.
- Responsive sidebar, related-module tabs, previous/next navigation, global search, progress tracking, bookmarks, and local notes.
- Light and dark themes.
- Section-level text-to-speech controls. Pause and resume continue the active speech session; Stop resets it.
- Interactive hemodynamics model, murmur decoder, maneuver lab, and severity reasoning lab.
- 12 progressive clinical cases.
- 72 flippable flashcards with category filters, shuffle, and local review status.
- 36-question scored quiz with saved progress.
- Embedded copy of the original PDF.
- Print stylesheet that always exports a clean white page, independent of dark mode.
- Keyboard access: `/` focuses search, `D` toggles theme, and `Alt` + arrow keys move between modules.

## Files

All runtime files are intentionally kept in one main folder:

- `index.html` — application shell
- `styles.css` — responsive light/dark interface
- `print.css` — clean print/PDF output
- `render.js` — reusable accessible content components
- `data.js` — structured educational content, cases, flashcards, and quiz bank
- `labs.js` — interactive reasoning tools
- `study.js` — TTS, cases, flashcards, quiz, and notes
- `app.js` — routing, search, progress, bookmarks, theme, and keyboard controls
- `valvular-heart-disease-source.pdf` — original source chapter

## Scope

This website is an educational revision aid rather than a clinical decision-support system. Management decisions must use current guidelines, expert imaging, patient-specific factors, and local protocols.
