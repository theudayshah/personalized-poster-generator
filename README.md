# Greeting Studio — Personalized Poster Generator

A responsive, frontend-only poster generator built with HTML, CSS, JavaScript, and the Canvas API. Users can select an occasion, enter the required names/details, preview the poster live, and download a PNG.

## Included categories

- Birthday — one person's name
- Anniversary — husband and wife names
- New vehicle — owner's name and optional vehicle name
- New home — person/family name
- Graduation — graduate's name

The current posters are original Canvas-generated starter designs. They are not copies of the supplied client poster. Replace or adapt the rendering functions to match client-approved designs.

## Run the project

1. Extract the ZIP file.
2. Open `index.html` in a modern browser.
3. Choose an occasion and edit the sample details.
4. Click **Download poster**.

For the most consistent font loading, you can run a local server from the project folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser. The project does not require Python for its functionality; this is only a convenient local server. Google Fonts are used when internet access is available, with system-font fallbacks.

## Customize the design

### Add or change poster categories

Edit `js/templates.js`. Each template defines:
- `label`: category label
- `fileName`: filename prefix
- `fields`: input fields and validation
- `defaults`: sample values shown initially
- `render`: rendering type and colors

Then add a matching `case` in `js/poster-generator.js` if the new design needs a distinct layout.

### Use a client's supplied poster image

For a client-supplied background:
1. Put the approved image inside `assets/`.
2. Add an image path to that category's template config.
3. Update the rendering function to load the image and draw it to the canvas before placing the names.
4. Ensure the existing printed name is removed from the template first, or cover it cleanly before drawing the replacement name.
5. Wait for the image to load before rendering/exporting. If loading remote images, CORS settings can prevent canvas export; local assets avoid that issue.

### Change text positions and fonts

Edit the relevant category case in `js/poster-generator.js`. Canvas coordinates use a 1080 × 1350 canvas, so `(540, 675)` is the center point.

## Notes

- Everything runs in the browser; names are not sent to a server.
- PNG export uses `canvas.toBlob()`.
- This is a starter project. Real client designs will need per-template font, spacing, text-position, and long-name adjustments.
- Do not use copyrighted client artwork or logos without permission.
