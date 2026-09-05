# Activ Health App — the logo's route

Drop the artwork here and the Brand & Design section shows it. Nothing else
to edit: `branding-design.tsx` reads this folder at build time, so the files
ARE the deployment.

    phase-1.png    the sketches, in the order they happened
    phase-2.png
    phase-3.png    …as many as there are; phase-10 sorts after phase-9
    final.png      the mark it arrived at

`.png`, `.jpg`, `.webp` and `.svg` all work. Anything not matching
`phase-<number>.` or `final.` is ignored, so working files can live here too.

The chips render on WHITE, because the sketches are scans of paper — a glass
ground would show through them and grey the pencil out. Roughly square art
sits best; the mark is `object-contain`, so nothing gets cropped either way.

With the folder empty the section prints "Activ Health App / Logo redesign"
and no strip, which is what it did before this existed.
