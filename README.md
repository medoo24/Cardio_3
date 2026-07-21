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
