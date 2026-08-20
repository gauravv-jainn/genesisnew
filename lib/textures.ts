/**
 * Procedural textures as data URIs.
 *
 * All generated with SVG `feTurbulence` rather than shipped as image files:
 * they scale to any size, add nothing to the bundle, and survive the strict
 * CSP (no external host, no blob). Each is a pure function of its arguments,
 * so the same call always yields the same bytes and SSR matches the client.
 */

function svgDataUri(svg: string) {
  // encodeURIComponent rather than base64: it stays legible in devtools and
  // avoids the ~33% size penalty base64 adds.
  return `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}")`;
}

/**
 * Brushed, cloudy texture for walls and floor. Low base frequency with several
 * octaves gives long soft strokes rather than fine sand — the difference
 * between a painted surface and TV static.
 */
export function paintedWall({
  size = 700,
  frequency = 0.006,
  octaves = 5,
  opacity = 0.55,
  seed = 7,
  /**
   * Colour baked into the texture. Tinting here rather than with a CSS
   * `filter: sepia() saturate() hue-rotate()` on the layer matters: a filter
   * on a full-bleed element forces an offscreen buffer every frame it is
   * composited, and this scene already has ~56 animated siblings above it.
   */
  tint,
}: {
  size?: number;
  frequency?: number;
  octaves?: number;
  opacity?: number;
  seed?: number;
  tint?: string;
} = {}) {
  return svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <filter id="p" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="${frequency} ${frequency * 3.4}"
          numOctaves="${octaves}" seed="${seed}" stitchTiles="stitch" result="n"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="${opacity}"/>
        </feComponentTransfer>
      </filter>
      ${tint ? `<rect width="${size}" height="${size}" fill="${tint}" filter="url(#p)"/>` : `<rect width="${size}" height="${size}" filter="url(#p)"/>`}
    </svg>`);
}

/**
 * Paper fibre. High frequency and low opacity — visible as tooth when the
 * light rakes across a sheet, invisible as pattern.
 */
export function paperFibre({ size = 180, seed = 3, opacity = 0.5 } = {}) {
  return svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <filter id="f">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4"
          seed="${seed}" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="${opacity}"/>
        </feComponentTransfer>
      </filter>
      <rect width="${size}" height="${size}" filter="url(#f)"/>
    </svg>`);
}

/**
 * Blotchy aging across a sheet.
 *
 * Real paper is never one flat tone: it foxes, it yellows unevenly, it holds
 * damp marks. A very low base frequency gives broad soft patches rather than
 * grain, which is the difference between aged stock and a printed swatch.
 */
export function paperMottle({ size = 260, seed = 5, opacity = 0.55 } = {}) {
  return svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <filter id="m">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.017" numOctaves="4"
          seed="${seed}" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer>
          <feFuncA type="gamma" exponent="1.6" amplitude="${opacity}"/>
        </feComponentTransfer>
      </filter>
      <rect width="${size}" height="${size}" filter="url(#m)"/>
    </svg>`);
}

/**
 * The faint pencil work on a sheet: a block of ruled lines, a boxed diagram
 * and a couple of stray marks. Deterministic per `seed`, so every sheet in a
 * scene looks hand-made but never re-randomises between renders.
 */
export function sketchMarks({ seed = 1, ink = "#4a3f28" } = {}) {
  const random = (salt: number) => {
    const value = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
    return value - Math.floor(value);
  };

  const rules: string[] = [];
  const ruleCount = 6 + Math.floor(random(1) * 5);
  for (let i = 0; i < ruleCount; i += 1) {
    const y = 26 + i * 7.5;
    const width = 30 + random(i + 2) * 48;
    rules.push(
      `<line x1="12" y1="${y}" x2="${12 + width}" y2="${y}" stroke="${ink}" stroke-width="1.1" opacity="${0.3 + random(i + 9) * 0.3}"/>`,
    );
  }

  // A boxed diagram, roughly where the reference sheets carry a plan drawing.
  const boxX = 14 + random(3) * 30;
  const boxY = 80 + random(4) * 26;
  const boxW = 26 + random(5) * 26;
  const boxH = 18 + random(6) * 20;

  return svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="110" height="150" viewBox="0 0 110 150">
      <g fill="none" stroke="${ink}">
        ${rules.join("")}
        <rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" stroke-width="1.2" opacity="0.5"/>
        <line x1="${boxX}" y1="${boxY + boxH / 2}" x2="${boxX + boxW}" y2="${boxY + boxH / 2}" stroke-width="0.9" opacity="0.35"/>
        <line x1="${boxX + boxW / 2}" y1="${boxY}" x2="${boxX + boxW / 2}" y2="${boxY + boxH}" stroke-width="0.9" opacity="0.35"/>
        <line x1="12" y1="${boxY + boxH + 14}" x2="${58 + random(7) * 30}" y2="${boxY + boxH + 14}" stroke-width="1.1" opacity="0.35"/>
        <line x1="12" y1="${boxY + boxH + 22}" x2="${44 + random(8) * 34}" y2="${boxY + boxH + 22}" stroke-width="1.1" opacity="0.28"/>
      </g>
    </svg>`);
}

/**
 * A full sheet of aged paper: staining, foxing and creases.
 *
 * Modelled on the reference swatch — warm stock that has browned unevenly,
 * darkened hard at the edges and corners, picked up rust-coloured foxing
 * spots, and cracked along a few fold lines. Everything is drawn into one
 * SVG so a sheet costs a single background layer rather than a stack of
 * elements.
 *
 * Deterministic in `seed`, so a pooled set of these renders identically on
 * the server and the client.
 */
export function agedPaper({ seed = 1, width = 220, height = 300 } = {}) {
  const random = (salt: number) => {
    const value = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
    return value - Math.floor(value);
  };

  // Foxing — the small rust spots age leaves behind.
  const spots: string[] = [];
  const spotCount = 7 + Math.floor(random(1) * 8);
  for (let i = 0; i < spotCount; i += 1) {
    const cx = 8 + random(i + 2) * (width - 16);
    const cy = 10 + random(i + 30) * (height - 20);
    const r = 1 + random(i + 60) * 3.4;
    spots.push(
      `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * (0.7 + random(i + 90) * 0.6)).toFixed(1)}" fill="#8a5f2a" opacity="${(0.06 + random(i + 120) * 0.16).toFixed(3)}"/>`,
    );
  }

  /**
   * Creases. Each is drawn twice — a dark line with a lighter one alongside —
   * because a fold is a ridge: one face turns away from the light and the
   * other catches it. A single line reads as a scratch, not a fold.
   */
  const creases: string[] = [];
  const creaseCount = 2 + Math.floor(random(200) * 3);
  for (let i = 0; i < creaseCount; i += 1) {
    const horizontal = random(i + 210) > 0.45;
    const drift = 6 + random(i + 220) * 10;

    if (horizontal) {
      const y = height * (0.2 + random(i + 230) * 0.6);
      const wobble = (random(i + 240) - 0.5) * 14;
      const path = `M0 ${y.toFixed(1)} Q ${(width / 2).toFixed(1)} ${(y + wobble).toFixed(1)} ${width} ${(y + wobble * 0.4).toFixed(1)}`;
      creases.push(
        `<path d="${path}" stroke="#6a5230" stroke-width="1.1" fill="none" opacity="0.3"/>`,
        `<path d="${path}" transform="translate(0,-1.4)" stroke="#fff6dd" stroke-width="1" fill="none" opacity="0.42"/>`,
      );
    } else {
      const x = width * (0.18 + random(i + 250) * 0.64);
      const wobble = (random(i + 260) - 0.5) * 12;
      const path = `M${x.toFixed(1)} 0 Q ${(x + wobble).toFixed(1)} ${(height / 2).toFixed(1)} ${(x + wobble * 0.5).toFixed(1)} ${height}`;
      creases.push(
        `<path d="${path}" stroke="#6a5230" stroke-width="1" fill="none" opacity="0.26"/>`,
        `<path d="${path}" transform="translate(-1.3,0)" stroke="#fff6dd" stroke-width="0.9" fill="none" opacity="0.38"/>`,
      );
    }
    // A short crack branching off the fold, as on worn stock.
    if (random(i + 270) > 0.55) {
      const sx = random(i + 280) * width;
      const sy = random(i + 290) * height;
      creases.push(
        `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} l ${(drift * (random(i + 300) - 0.5)).toFixed(1)} ${drift.toFixed(1)}" stroke="#5c4526" stroke-width="0.8" fill="none" opacity="0.3"/>`,
      );
    }
  }

  return svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <radialGradient id="stain" cx="50%" cy="46%" r="62%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="62%" stop-color="#6d4a1f" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="#4a2f11" stop-opacity="0.42"/>
        </radialGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.03" numOctaves="4" seed="${seed}"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer><feFuncA type="gamma" exponent="1.8" amplitude="0.5"/></feComponentTransfer>
        </filter>
      </defs>

      <rect width="${width}" height="${height}" fill="#efe2c2"/>
      <rect width="${width}" height="${height}" filter="url(#grain)" opacity="0.5" style="mix-blend-mode:multiply"/>
      ${spots.join("")}
      ${creases.join("")}
      <rect width="${width}" height="${height}" fill="url(#stain)"/>
    </svg>`);
}

/**
 * The printed content of a backlit document — the landing scene on page 1.
 *
 * In the reference the sheets are lit from BEHIND, so what reaches the eye is
 * not ink on paper but the shadow of ink seen through the sheet: a masthead, a
 * few ruled paragraphs, a ruled table, and on some sheets a photo box. Drawing
 * that content is what separates a lit document from a plain warm rectangle,
 * and a plain warm rectangle is what the wall had been rendering.
 *
 * Deterministic in `seed`, so SSR and the client agree and no sheet is
 * identical to its neighbour.
 */
export function documentSheet({
  seed = 1,
  width = 220,
  height = 300,
  ink = "#6d3208",
}: { seed?: number; width?: number; height?: number; ink?: string } = {}) {
  // Small deterministic PRNG; Math.random() would break SSR.
  let state = seed * 9301 + 49297;
  const rand = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };

  const pad = width * 0.1;
  const inner = width - pad * 2;
  const parts: string[] = [];
  let y = pad * 1.15;

  // Masthead: a heavy title bar and a short rule under it.
  parts.push(
    `<rect x="${pad}" y="${y}" width="${(inner * (0.42 + rand() * 0.26)).toFixed(1)}" height="${(height * 0.022).toFixed(1)}" fill="${ink}" opacity="0.62"/>`,
  );
  y += height * 0.05;
  parts.push(
    `<rect x="${pad}" y="${y}" width="${inner.toFixed(1)}" height="0.8" fill="${ink}" opacity="0.4"/>`,
  );
  y += height * 0.028;

  // Body: ruled paragraphs with ragged right edges.
  const paragraphs = 2 + Math.floor(rand() * 2);
  for (let p = 0; p < paragraphs && y < height * 0.56; p += 1) {
    const lines = 3 + Math.floor(rand() * 4);
    for (let l = 0; l < lines && y < height * 0.58; l += 1) {
      const w = inner * (l === lines - 1 ? 0.36 + rand() * 0.3 : 0.82 + rand() * 0.18);
      parts.push(
        `<rect x="${pad}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="1.5" fill="${ink}" opacity="${(0.3 + rand() * 0.16).toFixed(2)}"/>`,
      );
      y += height * 0.0165;
    }
    y += height * 0.016;
  }

  // A ruled table — the strongest structure in the reference sheets.
  const rows = 4 + Math.floor(rand() * 3);
  const cols = 3 + Math.floor(rand() * 2);
  const tableTop = y + height * 0.012;
  const rowH = height * 0.026;
  const tableH = rowH * rows;
  if (tableTop + tableH < height * 0.94) {
    for (let r = 0; r <= rows; r += 1) {
      parts.push(
        `<rect x="${pad}" y="${(tableTop + r * rowH).toFixed(1)}" width="${inner.toFixed(1)}" height="0.7" fill="${ink}" opacity="0.4"/>`,
      );
    }
    for (let c = 0; c <= cols; c += 1) {
      parts.push(
        `<rect x="${(pad + (inner / cols) * c).toFixed(1)}" y="${tableTop.toFixed(1)}" width="0.7" height="${tableH.toFixed(1)}" fill="${ink}" opacity="0.4"/>`,
      );
    }
    // A few filled cells so the table reads as completed, not blank.
    for (let i = 0; i < rows; i += 1) {
      const c = Math.floor(rand() * cols);
      parts.push(
        `<rect x="${(pad + (inner / cols) * c + 3).toFixed(1)}" y="${(tableTop + rowH * i + rowH * 0.36).toFixed(1)}" width="${((inner / cols) * (0.34 + rand() * 0.36)).toFixed(1)}" height="1.4" fill="${ink}" opacity="0.44"/>`,
      );
    }
    y = tableTop + tableH + height * 0.022;
  }

  // Roughly every third sheet carries a photo box, as in the reference.
  if (rand() > 0.62 && y < height * 0.8) {
    const boxW = inner * 0.3;
    parts.push(
      `<rect x="${(width - pad - boxW).toFixed(1)}" y="${y.toFixed(1)}" width="${boxW.toFixed(1)}" height="${(boxW * 1.24).toFixed(1)}" fill="${ink}" opacity="0.3"/>`,
    );
  }

  return svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${parts.join("")}
    </svg>`);
}
