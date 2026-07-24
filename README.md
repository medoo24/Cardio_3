# ValveLab — Interactive Valvular Heart Disease Website

## Open the website

Open `index.html` in any modern browser. The site is fully static and works offline; no installation or build step is required.

For the most consistent browser behavior, you may also serve the folder locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Included features

- Single-page website with hash-based interconnected modules.
- Responsive desktop sidebar and mobile navigation.
- Overview, general principles, all major mitral/aortic/tricuspid modules, prosthetic valves, and sources.
- Interactive pressure-versus-volume overload visualizer.
- Mitral-valve-prolapse maneuver timeline.
- Educational aortic-stenosis severity pattern checker.
- Murmur differential laboratory using timing, site, radiation, and maneuvers.
- Twelve case-based questions with explanations and locally saved best score.
- Search, keyboard navigation, progress tracking, print styles, and reduced-motion support.
- Official guideline source links and educational disclaimer.

## Files

- `index.html` — accessible application shell and navigation.
- `styles.css` — responsive visual design and print styles.
- `app.js` — content, routing, interactive tools, search, progress, and quiz logic.

## Educational scope

The website is a structured medical study aid and is not intended for patient-specific diagnosis or treatment decisions. Use current complete guidelines and specialist/Heart Team review for clinical care.


## 2026 unified study upgrade

This archive was standardized to the Rheumatic Fever Lab interaction model. It now includes:

- Persistent light/night mode
- Focus reading mode and adjustable text size
- A categorized Study Hub with active-recall flashcards, spaced-review markers, local notes, and a 25-minute timer
- Reading progress and back-to-top controls
- Universal pause/continue text-to-speech behavior
- Keyboard shortcuts: `S` Study Hub, `D` night mode, `F` focus mode, `/` search
- A flat, portable folder structure: open `index.html`; no server or build step is required

Flashcards summarize material already presented in the learning site. Use the site’s Sources module for references and clinical scope.
