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
      <rect width="${size}" height="${size}" filter="url(#p)"/>
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
